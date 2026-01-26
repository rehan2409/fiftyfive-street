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
  facePhotoUrl?: string;
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
    const { userProfile, products, gender = 'person', facePhoto } = await req.json();
    const HF_API_KEY = Deno.env.get("HUGGINGFACE_API_KEY");

    if (!HF_API_KEY) {
      throw new Error("HUGGINGFACE_API_KEY is not configured");
    }

    const profileDesc = buildProfileDescription(userProfile);
    const outfitDesc = buildOutfitDescription(products);

    const promptText = `Fashion editorial photo. ${gender} model wearing ${outfitDesc}.
${profileDesc}.
Full body shot, studio lighting, professional fashion photography, high quality, detailed clothing, realistic fabrics, clean white background.`;

    console.log("Generating virtual try-on with", productImages.length, "reference images");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        method: "POST",
        body: JSON.stringify({ inputs: promptText }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("HF API error:", response.status, errorData);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(result)));
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

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
