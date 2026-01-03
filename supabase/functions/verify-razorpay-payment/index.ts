import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      order_data 
    } = await req.json();

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!keySecret) {
      console.error('Razorpay secret not configured');
      throw new Error('Payment gateway not configured');
    }

    console.log('Verifying Razorpay payment:', razorpay_payment_id);

    // Verify signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(keySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureData = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signatureData)
    );

    const generatedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (generatedSignature !== razorpay_signature) {
      console.error('Payment signature verification failed');
      throw new Error('Payment verification failed');
    }

    console.log('Payment verified successfully');

    // Create order in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert({
        items: order_data.items,
        total: order_data.total,
        discount: order_data.discount || 0,
        coupon_code: order_data.couponCode || null,
        customer_info: order_data.customerInfo,
        payment_proof: `Razorpay: ${razorpay_payment_id}`,
        status: 'Confirmed',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    console.log('Order created:', orderResult.id);

    // If a coupon was used, increment its usage and auto-disable if limit reached
    if (order_data.couponCode) {
      // First get the current coupon data
      const { data: couponData, error: couponFetchError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', order_data.couponCode)
        .single();

      if (!couponFetchError && couponData) {
        const newUsageCount = couponData.current_usages + 1;
        const shouldDisable = newUsageCount >= couponData.max_usages;

        const { error: couponUpdateError } = await supabase
          .from('coupons')
          .update({ 
            current_usages: newUsageCount,
            active: shouldDisable ? false : couponData.active
          })
          .eq('code', order_data.couponCode);

        if (couponUpdateError) {
          console.error('Error updating coupon usage:', couponUpdateError);
        } else {
          console.log(`Coupon ${order_data.couponCode} usage updated: ${newUsageCount}/${couponData.max_usages}${shouldDisable ? ' - DISABLED' : ''}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: orderResult.id,
        paymentId: razorpay_payment_id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
