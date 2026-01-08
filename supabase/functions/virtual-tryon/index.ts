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
    const { userProfile, products, gender = 'person', facePhoto } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build a detailed prompt for the virtual try-on
    const profileDesc = buildProfileDescription(userProfile);
    const outfitDesc = buildOutfitDescription(products);
    
    // Build message content with product images and face photo as references
    const messageContent: any[] = [];
    
    // Add product images as references
    const productImages = products
      .filter((p: Product) => p.images && p.images.length > 0)
      .map((p: Product) => p.images![0]);
    
    const hasFacePhoto = facePhoto && facePhoto.startsWith('data:image');
    const hasProductImages = productImages.length > 0;
    
    // Build the prompt based on available inputs
    let promptText = '';
    
    // Enhanced system context for better face/texture accuracy
    const faceAccuracyInstructions = `
CRITICAL FACE PRESERVATION RULES:
- EXACT facial structure: jawline shape, cheekbone position, chin shape, forehead size
- EXACT facial features: eye shape, eye color, eyebrow thickness/arch, nose bridge width, nose tip shape, lip fullness, lip shape
- EXACT skin texture: preserve any freckles, moles, skin texture, pores, and natural skin imperfections
- EXACT skin tone: match the precise undertone (warm/cool/neutral) and shade from the reference
- EXACT hair: hairstyle, hair texture (straight/wavy/curly/coily), hair color including highlights/lowlights, hairline shape
- Maintain the person's natural expression tendencies and facial proportions
- Preserve any distinguishing features: dimples, beauty marks, scars, facial hair patterns
`;

    const lightingInstructions = `
PROFESSIONAL LIGHTING & TEXTURE:
- Soft diffused key light at 45 degrees
- Subtle fill light to reduce harsh shadows
- Rim/hair light for depth separation
- Natural skin rendering with subsurface scattering
- Realistic fabric texture and material properties (cotton weave, denim texture, silk sheen)
- Accurate shadow casting on clothing folds and body contours
`;

    const photographyStyle = `
PHOTOGRAPHY SPECIFICATIONS:
- Shot on high-end medium format camera (Hasselblad/Phase One quality)
- 85mm equivalent focal length for flattering proportions
- f/4 aperture for subject isolation with sharp focus
- 4K resolution, photorealistic rendering
- Fashion editorial quality composition
- Model positioned at natural 3/4 angle or straight-on
`;
    
    if (hasFacePhoto && hasProductImages) {
      promptText = `VIRTUAL TRY-ON GENERATION REQUEST

I am providing:
1. A reference face photo of a real person
2. ${productImages.length} clothing item reference image(s)

YOUR TASK: Generate a photorealistic full-body fashion image where:
- The person's face is an EXACT match to the reference photo
- The clothing items are EXACTLY as shown in the reference images

${faceAccuracyInstructions}

CLOTHING ACCURACY:
${products.map((p: Product, i: number) => `- Item ${i + 1}: "${p.name}" (${p.category})${p.description ? ' - ' + p.description : ''} - COPY EXACT: color, pattern, cut, fabric texture, buttons/zippers, logos, prints`).join('\n')}

MODEL PROFILE DATA: ${profileDesc}
GENDER PRESENTATION: ${gender}

${lightingInstructions}
${photographyStyle}

COMPOSITION:
- Full body visible from head to feet
- Clean studio backdrop (pure white or soft gradient gray)
- Natural confident pose appropriate for ${gender} fashion editorial
- Arms and hands visible, natural positioning
- Clothing fits naturally on the body with realistic draping

Generate this photorealistic fashion image now.`;
    } else if (hasFacePhoto) {
      promptText = `VIRTUAL TRY-ON GENERATION REQUEST

I am providing a reference face photo of a real person.

YOUR TASK: Generate a photorealistic full-body fashion image where the person's face is an EXACT match to the reference photo.

${faceAccuracyInstructions}

MODEL PROFILE DATA: ${profileDesc}
GENDER PRESENTATION: ${gender}

OUTFIT TO GENERATE: ${outfitDesc}
- Ensure clothing looks realistic with proper fabric physics
- Natural wrinkles and folds based on body position
- Accurate material rendering (cotton, denim, leather, etc.)

${lightingInstructions}
${photographyStyle}

COMPOSITION:
- Full body visible from head to feet
- Clean studio backdrop (pure white or soft gradient gray)
- Natural confident pose appropriate for ${gender} streetwear editorial
- Arms and hands visible, natural positioning

Generate this photorealistic fashion image now.`;
    } else if (hasProductImages) {
      promptText = `VIRTUAL TRY-ON GENERATION REQUEST

I am providing ${productImages.length} clothing item reference image(s).

YOUR TASK: Generate a photorealistic full-body fashion image of a ${gender} model wearing EXACTLY these clothing items.

MODEL SPECIFICATIONS:
- Physical appearance: ${profileDesc}
- Natural, realistic human proportions
- Photorealistic skin texture with natural pores and subtle imperfections

CLOTHING TO REPLICATE EXACTLY:
${products.map((p: Product, i: number) => `- Item ${i + 1}: "${p.name}" (${p.category})${p.description ? ' - ' + p.description : ''} - MATCH EXACT: color shade, pattern placement, fabric texture, design details, any logos or prints`).join('\n')}

${lightingInstructions}
${photographyStyle}

COMPOSITION:
- Full body visible from head to feet  
- Clean studio backdrop (pure white or soft gradient gray)
- Natural confident pose for fashion editorial
- Clothing fits naturally with realistic draping and folds

Generate this photorealistic fashion image now.`;
    } else {
      promptText = `FASHION EDITORIAL GENERATION REQUEST

Generate a photorealistic full-body fashion photography image.

MODEL SPECIFICATIONS:
- Gender: ${gender}
- Physical appearance: ${profileDesc}
- Photorealistic human with natural skin texture, pores, and features

OUTFIT: ${outfitDesc}
- Realistic fabric rendering with proper material properties
- Natural clothing drape and fold physics

${lightingInstructions}
${photographyStyle}

COMPOSITION:
- Full body shot from head to feet
- Clean studio backdrop
- Confident streetwear pose
- High-end fashion editorial quality

Generate this photorealistic fashion image now.`;
    }
    
    // Add the prompt text
    messageContent.push({
      type: "text",
      text: promptText
    });
    
    // Add face photo first if available (so AI focuses on it)
    if (hasFacePhoto) {
      messageContent.push({
        type: "image_url",
        image_url: {
          url: facePhoto
        }
      });
      console.log("Added face photo to request");
    }
    
    // Add product images
    for (const imageUrl of productImages) {
      messageContent.push({
        type: "image_url",
        image_url: {
          url: imageUrl
        }
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
