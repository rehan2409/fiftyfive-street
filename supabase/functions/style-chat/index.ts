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

// Color theory and styling knowledge base
const getColorRecommendations = (profile: UserProfile): string => {
  const recommendations: string[] = [];

  const skinToneColors: Record<string, { best: string[], neutrals: string[] }> = {
    fair: {
      best: ['soft pastels', 'dusty pink', 'light blue', 'lavender', 'sage green', 'soft coral'],
      neutrals: ['navy', 'charcoal gray', 'cream', 'soft white']
    },
    light: {
      best: ['soft blue', 'rose pink', 'light gray', 'periwinkle', 'mint green', 'mauve'],
      neutrals: ['navy', 'medium gray', 'off-white', 'beige']
    },
    medium: {
      best: ['olive green', 'teal', 'coral', 'burgundy', 'warm browns', 'mustard'],
      neutrals: ['camel', 'chocolate brown', 'olive', 'navy']
    },
    olive: {
      best: ['warm earth tones', 'rust', 'burnt orange', 'deep purple', 'forest green', 'warm red'],
      neutrals: ['olive', 'khaki', 'brown', 'cream']
    },
    tan: {
      best: ['bright white', 'coral', 'turquoise', 'fuchsia', 'cobalt blue', 'bright green'],
      neutrals: ['white', 'navy', 'khaki', 'caramel']
    },
    brown: {
      best: ['bright colors', 'orange', 'yellow', 'fuchsia', 'royal blue', 'emerald green', 'coral'],
      neutrals: ['white', 'cream', 'navy', 'charcoal']
    },
    dark: {
      best: ['vibrant colors', 'bright yellow', 'hot pink', 'cobalt blue', 'orange', 'white', 'red'],
      neutrals: ['white', 'cream', 'light gray', 'navy']
    }
  };

  const bodyTypeAdvice: Record<string, string> = {
    slim: 'For your lean build, layering adds dimension! A fitted t-shirt with a bomber jacket creates great proportions.',
    athletic: 'Your athletic build looks great in fitted pieces! Show off those gains with well-fitted t-shirts and tapered pants.',
    average: 'Your balanced proportions work with most styles! Focus on proper fit - not too tight, not too loose.',
    curvy: 'Embrace your curves with wrap styles and defined waists! V-necks and vertical details elongate.',
    'plus-size': 'Structure is your friend! Well-fitted pieces in quality fabrics drape beautifully.'
  };

  if (profile.skinTone && skinToneColors[profile.skinTone]) {
    const colors = skinToneColors[profile.skinTone];
    recommendations.push(`For your ${profile.skinTone} skin tone: Best colors are ${colors.best.join(', ')}. Great neutrals: ${colors.neutrals.join(', ')}.`);
  }

  if (profile.bodyType && bodyTypeAdvice[profile.bodyType]) {
    recommendations.push(bodyTypeAdvice[profile.bodyType]);
  }

  return recommendations.join(' ');
};

// Build context-aware response using rule-based logic + Hugging Face
const buildStyleResponse = async (
  userMessage: string,
  products: any[],
  userProfile: UserProfile,
  HF_API_KEY: string
): Promise<string> => {
  const personalizedTips = getColorRecommendations(userProfile);
  
  // Build a focused prompt for Hugging Face text generation
  const productList = products?.length > 0 
    ? products.map(p => `${p.name} (${p.category}) - ₹${p.price}`).join(', ')
    : 'various streetwear items';

  const profileDesc = [
    userProfile.bodyType && `${userProfile.bodyType} build`,
    userProfile.height && `${userProfile.height}cm tall`,
    userProfile.hairLength && `${userProfile.hairLength} hair`,
    userProfile.hairColor && `${userProfile.hairColor} hair color`,
    userProfile.skinTone && `${userProfile.skinTone} skin tone`
  ].filter(Boolean).join(', ');

  const prompt = `You are a friendly fashion stylist at Fifty-Five streetwear. 
Customer profile: ${profileDesc || 'Not specified'}.
Style tips for them: ${personalizedTips}
Available products: ${productList}

Customer asks: "${userMessage}"

Give a helpful, friendly response (2-3 sentences) with specific product recommendations. Use emojis sparingly.`;

  try {
    // Use Hugging Face's free Inference API with a text generation model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        headers: { 
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API error:", response.status, errorText);
      
      if (response.status === 503) {
        // Model is loading, return fallback
        return getFallbackResponse(userMessage, products, personalizedTips);
      }
      
      throw new Error(`HF API error: ${response.status}`);
    }

    const data = await response.json();
    let generatedText = data[0]?.generated_text || '';
    
    // Clean up the response
    generatedText = generatedText.trim();
    if (generatedText.length < 20) {
      return getFallbackResponse(userMessage, products, personalizedTips);
    }
    
    return generatedText;
  } catch (error) {
    console.error("HF generation error:", error);
    return getFallbackResponse(userMessage, products, personalizedTips);
  }
};

// Fallback response when AI is unavailable
const getFallbackResponse = (userMessage: string, products: any[], tips: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('tshirt') || lowerMessage.includes('t-shirt') || lowerMessage.includes('shirt')) {
    const tshirts = products.filter(p => p.category?.toLowerCase().includes('shirt'));
    if (tshirts.length > 0) {
      return `Great choice! 👕 Check out our ${tshirts[0].name} at ₹${tshirts[0].price}. ${tips ? tips.split('.')[0] + '.' : 'It would look amazing on you!'}`;
    }
  }
  
  if (lowerMessage.includes('cargo') || lowerMessage.includes('pant')) {
    const cargos = products.filter(p => p.category?.toLowerCase().includes('cargo'));
    if (cargos.length > 0) {
      return `Our cargo pants are 🔥! The ${cargos[0].name} at ₹${cargos[0].price} is super popular. Pair it with a fitted tee for the perfect streetwear look!`;
    }
  }
  
  if (lowerMessage.includes('jacket')) {
    const jackets = products.filter(p => p.category?.toLowerCase().includes('jacket'));
    if (jackets.length > 0) {
      return `Looking to layer up? 🧥 Our ${jackets[0].name} is perfect! At ₹${jackets[0].price}, it's a great investment for your wardrobe.`;
    }
  }
  
  if (lowerMessage.includes('outfit') || lowerMessage.includes('look') || lowerMessage.includes('complete')) {
    return `For a complete streetwear look, I'd recommend pairing a graphic tee with our cargo pants and a bomber jacket. 🔥 ${tips ? tips.split('.')[0] + '.' : 'This combo works great for your style!'}`;
  }
  
  return `Hey! 👋 I'm here to help you find the perfect streetwear. ${tips ? tips.split('.')[0] + '.' : ''} Browse our collection of t-shirts, cargos, and jackets. What style are you going for today?`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, products, userProfile } = await req.json();
    const HF_API_KEY = Deno.env.get("HUGGINGFACE_API_KEY");
    
    if (!HF_API_KEY) {
      throw new Error("HUGGINGFACE_API_KEY is not configured");
    }

    // Get the latest user message
    const lastUserMessage = messages?.filter((m: any) => m.role === 'user').pop();
    const userMessage = lastUserMessage?.content || "Hello";

    console.log("Processing style chat with Hugging Face...");
    
    const response = await buildStyleResponse(
      userMessage,
      products || [],
      userProfile || {},
      HF_API_KEY
    );

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        response: "I'm having a moment! 😅 Try asking me about our t-shirts, cargos, or jackets - I'd love to help you find your perfect look!" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
