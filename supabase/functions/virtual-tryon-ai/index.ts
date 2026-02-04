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
    const { userPhotoBase64, selectedProducts, gender } = await req.json();
    
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

    // Build outfit description from selected products
    const outfitParts: string[] = [];
    for (const product of selectedProducts) {
      const category = product.category?.toLowerCase() || '';
      if (category.includes('shirt') || category === 't-shirts') {
        outfitParts.push(`wearing a ${product.name} t-shirt/top`);
      } else if (category.includes('cargo') || category.includes('pant') || category.includes('jeans')) {
        outfitParts.push(`with ${product.name} pants/bottoms`);
      } else if (category.includes('jacket')) {
        outfitParts.push(`and a stylish ${product.name} jacket`);
      }
    }

    const outfitDescription = outfitParts.join(' ') || 'wearing the selected outfit';
    const genderTerm = gender === 'woman' ? 'woman' : gender === 'man' ? 'man' : 'person';

    const prompt = `Transform this photo to show the ${genderTerm} ${outfitDescription}. Keep the person's face, features, and body proportions exactly the same. Only change their clothing to match the described outfit. The result should look like a professional fashion photo with natural lighting and the clothes fitting perfectly. Make it look realistic and high quality, like the person is actually wearing these clothes.`;

    console.log("Generating virtual try-on with prompt:", prompt);

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
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: userPhotoBase64
                }
              }
            ]
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
    console.log("AI response received");

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
        message: textResponse || "Your virtual try-on is ready!"
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
