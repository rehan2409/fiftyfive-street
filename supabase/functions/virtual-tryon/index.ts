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
    
    const prompt = `Generate a professional fashion photography style image of a stylish ${gender} model with ${profileDesc}. 
    
The model is wearing: ${outfitDesc}.

Style: High-end fashion editorial, studio lighting, clean background, full body shot showing the complete outfit. The model should be posed confidently, showing off the streetwear outfit. Modern urban fashion aesthetic, professional photography quality.

Important: Focus on showcasing the clothing items clearly while matching the model's appearance to the described features.`;

    console.log("Generating virtual try-on image with prompt:", prompt);

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
            content: prompt
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
  
  // Body type and height
  if (profile.bodyType) {
    const bodyDescriptions: Record<string, string> = {
      slim: 'a slim, lean build',
      athletic: 'an athletic, fit build',
      average: 'an average build',
      curvy: 'a curvy figure',
      'plus-size': 'a plus-size build'
    };
    parts.push(bodyDescriptions[profile.bodyType] || `${profile.bodyType} build`);
  }
  
  if (profile.height) {
    const h = typeof profile.height === 'string' ? parseInt(profile.height) : profile.height;
    if (h < 165) {
      parts.push('shorter stature');
    } else if (h > 180) {
      parts.push('tall stature');
    } else {
      parts.push('medium height');
    }
  }
  
  // Hair description
  if (profile.hairLength === 'bald') {
    parts.push('a bald/shaved head');
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
