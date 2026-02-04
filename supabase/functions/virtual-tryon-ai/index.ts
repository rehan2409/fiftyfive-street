import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPhotoBase64, selectedProducts, gender, bodyDetails } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!userPhotoBase64) {
      throw new Error("User photo is required");
    }

    if (!selectedProducts || selectedProducts.length === 0) {
      throw new Error("At least one product must be selected");
    }

    // Extract body details
    const { bodyType = 'average', hairColor = 'black', heightCm = 170, weightKg = 70 } = bodyDetails || {};

    // Build detailed outfit description with actual product info
    const outfitParts: string[] = [];
    const productImages: { type: string; image_url: { url: string } }[] = [];
    
    for (const product of selectedProducts) {
      const category = product.category?.toLowerCase() || '';
      
      // Add product image if available
      if (product.imageUrl) {
        productImages.push({
          type: "image_url",
          image_url: { url: product.imageUrl }
        });
      }
      
      if (category.includes('shirt') || category === 't-shirts') {
        outfitParts.push(`the exact "${product.name}" t-shirt/top shown in the reference image`);
      } else if (category.includes('cargo') || category.includes('pant') || category.includes('jeans')) {
        outfitParts.push(`the exact "${product.name}" pants/bottoms shown in the reference image`);
      } else if (category.includes('jacket')) {
        outfitParts.push(`the exact "${product.name}" jacket shown in the reference image`);
      }
    }

    const outfitDescription = outfitParts.join(', ') || 'the selected outfit items';
    const genderTerm = gender === 'woman' ? 'woman' : gender === 'man' ? 'man' : 'person';

    // Build body description
    const bodyDescription = `${bodyType} build, ${heightCm}cm tall, ${weightKg}kg, ${hairColor} hair`;

    // Create prompt that emphasizes using the actual product images
    const prompt = `You are given:
1. A photo of a ${genderTerm} (first image) - this is the person to dress
2. Product images (following images) - these are the EXACT clothes to put on the person

CRITICAL INSTRUCTIONS:
- Keep the person's face, skin tone, hair (${hairColor}), and body proportions EXACTLY the same
- The person has a ${bodyType} body type, approximately ${heightCm}cm tall and ${weightKg}kg
- COPY the EXACT clothing items from the product reference images onto the person
- Do NOT generate or imagine new clothing designs - use ONLY what you see in the product images
- Match the colors, patterns, textures, and style of the products EXACTLY as shown
- The clothes should fit naturally on their ${bodyType} body frame
- Create a professional, realistic fashion photo with natural lighting
- The final result should look like the person is actually wearing these specific products

Products to apply: ${outfitDescription}

Generate a single high-quality image showing this ${genderTerm} wearing these exact products.`;

    console.log("Generating virtual try-on with actual products");
    console.log("Products:", selectedProducts.map((p: any) => p.name).join(", "));
    console.log("Body details:", bodyDescription);

    // Build message content with user photo and all product images
    const messageContent: any[] = [
      {
        type: "text",
        text: prompt
      },
      {
        type: "image_url",
        image_url: { url: userPhotoBase64 }
      },
      ...productImages // Add all product images
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: messageContent
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received successfully");

    // Extract the generated image
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (!generatedImageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("Failed to generate try-on image. Please try again.");
    }

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: generatedImageUrl,
        message: textResponse || "Your virtual try-on is ready! See yourself in our actual products."
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Virtual try-on error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to generate virtual try-on" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
