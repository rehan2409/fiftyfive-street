import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  hairLength: string;
  hairColor: string;
  skinTone: string;
  bodyType: string;
  height: number | string;
}

interface Product {
  name: string;
  category: string;
  description?: string;
  images?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, products, gender = 'person' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build a detailed prompt for the virtual try-on
    const profileDesc = buildProfileDescription(userProfile);
    const outfitDesc = buildOutfitDescription(products);
    
    // Build message content with product images as references
    const messageContent: any[] = [];
    
    // Add product images as references
    const productImages = products
      .filter((p: Product) => p.images && p.images.length > 0)
      .map((p: Product) => p.images![0]);
    
    if (productImages.length > 0) {
      // Add instruction text first
      messageContent.push({
        type: "text",
        text: `I'm showing you ${productImages.length} clothing item(s) that I want you to use as reference. Generate a fashion photography image of a ${gender} model wearing EXACTLY these specific clothing items.

MODEL DESCRIPTION: ${profileDesc}

CLOTHING ITEMS TO WEAR (use these exact items from the reference images):
${products.map((p: Product, i: number) => `${i + 1}. ${p.name} (${p.category})${p.description ? ' - ' + p.description : ''}`).join('\n')}

STYLE REQUIREMENTS:
- Full body shot showing the complete outfit
- Professional fashion photography, studio lighting
- Clean white or neutral background
- Model posed confidently in streetwear style
- High-end editorial look
- The clothing items must match the reference images exactly - same colors, patterns, and design details

Generate the image now.`
      });
      
      // Add each product image as reference
      for (const imageUrl of productImages) {
        messageContent.push({
          type: "image_url",
          image_url: {
            url: imageUrl
          }
        });
      }
    } else {
      // Fallback to text-only prompt if no images
      messageContent.push({
        type: "text",
        text: `Generate a professional fashion photography image of a ${gender} model with ${profileDesc}.

The model is wearing: ${outfitDesc}.

Style: Full body shot, high-end fashion editorial, studio lighting, clean background, confident streetwear pose. Modern urban fashion aesthetic, professional photography quality.`
      });
    }

    console.log("Generating virtual try-on with", productImages.length, "reference images");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate image");
    }

    const data = await response.json();
    console.log("AI response received");
    
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        description: textResponse || "Your personalized outfit visualization"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Virtual try-on error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildProfileDescription(profile: UserProfile): string {
  const parts: string[] = [];
  
  // Body type
  if (profile.bodyType) {
    const bodyDescriptions: Record<string, string> = {
      slim: 'slim, lean build',
      athletic: 'athletic, fit build',
      average: 'average build',
      curvy: 'curvy figure',
      'plus-size': 'plus-size build'
    };
    parts.push(bodyDescriptions[profile.bodyType] || `${profile.bodyType} build`);
  }
  
  // Height with specific cm
  if (profile.height) {
    const h = typeof profile.height === 'string' ? parseInt(profile.height) : profile.height;
    parts.push(`${h}cm tall`);
  }
  
  // Hair description
  if (profile.hairLength === 'bald') {
    parts.push('bald/shaved head');
  } else if (profile.hairLength && profile.hairColor) {
    parts.push(`${profile.hairLength} ${profile.hairColor} hair`);
  } else if (profile.hairLength) {
    parts.push(`${profile.hairLength} hair`);
  } else if (profile.hairColor) {
    parts.push(`${profile.hairColor} hair`);
  }
  
  // Skin tone
  if (profile.skinTone) {
    const skinDescriptions: Record<string, string> = {
      fair: 'fair/porcelain skin',
      light: 'light skin',
      medium: 'medium skin tone',
      olive: 'olive skin tone',
      tan: 'tan/caramel skin',
      brown: 'brown skin',
      dark: 'dark/deep skin tone'
    };
    parts.push(skinDescriptions[profile.skinTone] || `${profile.skinTone} skin`);
  }
  
  return parts.length > 0 ? parts.join(', ') : 'stylish appearance';
}

function buildOutfitDescription(products: Product[]): string {
  if (!products || products.length === 0) {
    return 'trendy streetwear outfit with a graphic t-shirt and cargo pants';
  }
  
  return products.map(p => {
    const desc = p.description ? ` (${p.description})` : '';
    return `${p.name}${desc}`;
  }).join(', ');
}
