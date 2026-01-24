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

  // Skin tone based color recommendations
  const skinToneColors: Record<string, { best: string[], avoid: string[], neutrals: string[] }> = {
    fair: {
      best: ['soft pastels', 'dusty pink', 'light blue', 'lavender', 'sage green', 'soft coral'],
      avoid: ['harsh neon colors', 'mustard yellow', 'orange'],
      neutrals: ['navy', 'charcoal gray', 'cream', 'soft white']
    },
    light: {
      best: ['soft blue', 'rose pink', 'light gray', 'periwinkle', 'mint green', 'mauve'],
      avoid: ['bright orange', 'harsh yellow'],
      neutrals: ['navy', 'medium gray', 'off-white', 'beige']
    },
    medium: {
      best: ['olive green', 'teal', 'coral', 'burgundy', 'warm browns', 'mustard'],
      avoid: ['pale pastels that wash you out'],
      neutrals: ['camel', 'chocolate brown', 'olive', 'navy']
    },
    olive: {
      best: ['warm earth tones', 'rust', 'burnt orange', 'deep purple', 'forest green', 'warm red'],
      avoid: ['cool pastels', 'bright pink'],
      neutrals: ['olive', 'khaki', 'brown', 'cream']
    },
    tan: {
      best: ['bright white', 'coral', 'turquoise', 'fuchsia', 'cobalt blue', 'bright green'],
      avoid: ['muddy browns', 'dull colors'],
      neutrals: ['white', 'navy', 'khaki', 'caramel']
    },
    brown: {
      best: ['bright colors', 'orange', 'yellow', 'fuchsia', 'royal blue', 'emerald green', 'coral'],
      avoid: ['washed out pastels', 'colors too close to skin tone'],
      neutrals: ['white', 'cream', 'navy', 'charcoal']
    },
    dark: {
      best: ['vibrant colors', 'bright yellow', 'hot pink', 'cobalt blue', 'orange', 'white', 'red'],
      avoid: ['dark colors that blend with skin', 'very muted tones'],
      neutrals: ['white', 'cream', 'light gray', 'navy']
    }
  };

  // Hair color impact on style
  const hairColorAdvice: Record<string, string> = {
    black: 'Your dark hair creates striking contrast with light colors. White, cream, and bright jewel tones will make your features pop.',
    brown: 'Brown hair is versatile! Earth tones complement naturally, while blues and greens provide nice contrast.',
    blonde: 'Blonde hair pairs beautifully with navy, burgundy, and forest green. Avoid very pale yellows that may blend.',
    red: 'Red hair is stunning with greens (especially emerald), navy, cream, and chocolate brown. Avoid orange and clashing reds.',
    gray: 'Silver/gray hair looks sophisticated with navy, burgundy, purple, and pink. These colors add vibrancy.',
    white: 'White hair creates elegant contrast with deep colors - navy, black, burgundy, emerald green.',
    colored: 'For dyed/colored hair, coordinate your outfit colors to complement or contrast your hair color intentionally.'
  };

  // Hair length styling advice
  const hairLengthAdvice: Record<string, string> = {
    long: 'With long hair, V-necks and boat necks balance your silhouette. Consider how your hair falls on different necklines.',
    medium: 'Medium-length hair works with most necklines. Crew necks and collared shirts frame your face well.',
    short: 'Short hair draws attention to your face - statement accessories and interesting necklines enhance this.',
    bald: 'A bald head creates a clean, bold look. Turtlenecks, crew necks, and V-necks all work excellently. Consider statement accessories like watches or chains.'
  };

  // Body type specific advice
  const bodyTypeAdvice: Record<string, string> = {
    slim: 'For your lean build, layering adds dimension! A fitted t-shirt with a bomber jacket creates great proportions. Horizontal stripes and textured fabrics add visual interest.',
    athletic: 'Your athletic build looks great in fitted pieces! Show off those gains with well-fitted t-shirts and tapered pants. V-necks accentuate your shoulders.',
    average: 'Your balanced proportions work with most styles! Focus on proper fit - not too tight, not too loose. You can experiment with various silhouettes.',
    curvy: 'Embrace your curves with wrap styles and defined waists! V-necks and vertical details elongate. High-waisted bottoms create beautiful proportions.',
    'plus-size': 'Structure is your friend! Well-fitted pieces in quality fabrics drape beautifully. Monochromatic looks elongate, and strategic color blocking flatters.'
  };

  // Height-based advice
  const getHeightAdvice = (height: number | string): string => {
    if (!height || height === '') return '';
    const h = typeof height === 'string' ? parseInt(height) : height;
    if (h < 165) {
      return 'At your height, vertical lines and monochromatic outfits create elongation. High-waisted pants and cropped jackets work great.';
    } else if (h > 180) {
      return 'Your tall stature can handle bold patterns and horizontal elements. Layering looks great on you, and you can pull off oversized fits.';
    } else {
      return 'Your medium height gives you flexibility with proportions. Focus on balanced fits that aren\'t too oversized or too cropped.';
    }
  };

  // Build personalized recommendations
  if (profile.skinTone && skinToneColors[profile.skinTone]) {
    const colors = skinToneColors[profile.skinTone];
    recommendations.push(`For your ${profile.skinTone} skin tone: Best colors are ${colors.best.join(', ')}. Great neutrals: ${colors.neutrals.join(', ')}.`);
  }

  if (profile.hairColor && hairColorAdvice[profile.hairColor]) {
    recommendations.push(hairColorAdvice[profile.hairColor]);
  }

  if (profile.hairLength && hairLengthAdvice[profile.hairLength]) {
    recommendations.push(hairLengthAdvice[profile.hairLength]);
  }

  if (profile.bodyType && bodyTypeAdvice[profile.bodyType]) {
    recommendations.push(bodyTypeAdvice[profile.bodyType]);
  }

  const heightAdvice = getHeightAdvice(profile.height);
  if (heightAdvice) {
    recommendations.push(heightAdvice);
  }

  return recommendations.join(' ');
};

// Offline fallback responses when AI is unavailable
const getFallbackResponse = (userInput: string, products: any[], userProfile: UserProfile): string => {
  const input = userInput.toLowerCase();
  const colorRecs = userProfile ? getColorRecommendations(userProfile) : '';
  
  // Profile-based personalization
  const profileIntro = userProfile?.bodyType || userProfile?.skinTone 
    ? `Based on your ${userProfile.bodyType || ''} build and ${userProfile.skinTone || 'unique'} skin tone, `
    : '';
  
  // Get products by category
  const tshirts = products?.filter(p => p.category?.toLowerCase().includes('shirt')) || [];
  const cargos = products?.filter(p => p.category?.toLowerCase().includes('cargo')) || [];
  const jackets = products?.filter(p => p.category?.toLowerCase().includes('jacket')) || [];
  
  // Category-specific responses
  if (input.includes('tshirt') || input.includes('t-shirt') || input.includes('shirt') || input.includes('top')) {
    const recommended = tshirts[0];
    return `${profileIntro}I'd recommend checking out our t-shirts! 👕 ${recommended ? `The "${recommended.name}" at ₹${recommended.price} is a great choice.` : ''} ${colorRecs ? `For your coloring: ${colorRecs.split('.')[0]}.` : ''} ✨`;
  }
  
  if (input.includes('cargo') || input.includes('pant') || input.includes('bottom') || input.includes('jeans')) {
    const recommended = cargos[0];
    return `${profileIntro}Our cargo pants are perfect for streetwear! 👖 ${recommended ? `Try the "${recommended.name}" for ₹${recommended.price}.` : ''} They're versatile and comfortable. 🔥`;
  }
  
  if (input.includes('jacket') || input.includes('coat') || input.includes('outerwear')) {
    const recommended = jackets[0];
    return `${profileIntro}Jackets are essential for layering! 🧥 ${recommended ? `Check out "${recommended.name}" at ₹${recommended.price}.` : ''} Perfect for completing your look! 💫`;
  }
  
  if (input.includes('outfit') || input.includes('complete') || input.includes('full look')) {
    return `${profileIntro}For a complete streetwear outfit, I'd suggest pairing ${tshirts[0]?.name || 'a graphic tee'} with ${cargos[0]?.name || 'cargo pants'} and ${jackets[0]?.name || 'a bomber jacket'}! This creates a balanced, trendy look. 🎨✨`;
  }
  
  if (input.includes('color') || input.includes('colour') || input.includes('recommend')) {
    if (colorRecs) {
      return `Great question! ${colorRecs} These colors will make you look amazing! 🎨`;
    }
    return `Set up your profile to get personalized color recommendations! Click the profile icon above. 👤✨`;
  }
  
  if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
    return `Hey there! 👋 I'm your style assistant. How can I help you find the perfect look today? Browse our t-shirts, cargos, and jackets! ✨`;
  }
  
  // Default response
  return `${profileIntro}I'd love to help you find your perfect style! 🛍️ We have amazing t-shirts starting at ₹${tshirts[0]?.price || '999'}, comfortable cargos, and stylish jackets. What catches your eye? ✨`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, products, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    // Get the last user message for fallback
    const lastUserMessage = messages?.[messages.length - 1]?.content || '';
    
    if (!LOVABLE_API_KEY) {
      console.log("No API key, using fallback response");
      const fallbackResponse = getFallbackResponse(lastUserMessage, products, userProfile);
      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a rich system prompt with product context and personalization
    const productContext = products && products.length > 0
      ? `\n\nAvailable Products:\n${products.map((p: any) => 
          `- ${p.name} (${p.category}) - ₹${p.price}${p.description ? ': ' + p.description : ''}`
        ).join('\n')}`
      : '';

    // Build personalized context based on user profile
    let personalizationContext = '';
    if (userProfile && (userProfile.hairLength || userProfile.hairColor || userProfile.skinTone || userProfile.bodyType || userProfile.height)) {
      const profileDesc = [];
      if (userProfile.bodyType) profileDesc.push(`${userProfile.bodyType} body type`);
      if (userProfile.height) profileDesc.push(`${userProfile.height}cm tall`);
      if (userProfile.hairLength) profileDesc.push(`${userProfile.hairLength} hair`);
      if (userProfile.hairColor) profileDesc.push(`${userProfile.hairColor} hair color`);
      if (userProfile.skinTone) profileDesc.push(`${userProfile.skinTone} skin tone`);
      
      const colorRecs = getColorRecommendations(userProfile);
      
      personalizationContext = `

CUSTOMER PROFILE:
The customer has: ${profileDesc.join(', ')}.

PERSONALIZED COLOR & STYLE RECOMMENDATIONS FOR THIS CUSTOMER:
${colorRecs}

IMPORTANT: Always consider this customer's unique features when making recommendations:
- Suggest colors that complement their skin tone and hair color
- Recommend fits and silhouettes that flatter their body type
- Consider proportions based on their height
- Explain WHY certain choices work well for them specifically`;
    }

    const systemPrompt = `You are an expert fashion stylist and personal shopping assistant for "Fifty-Five", a premium streetwear brand. You have deep expertise in:

1. COLOR THEORY & SKIN TONE ANALYSIS:
- Understanding which colors complement different skin tones
- Knowledge of seasonal color analysis (Spring, Summer, Autumn, Winter palettes)
- How hair color affects overall color harmony

2. BODY TYPE STYLING:
- Slim: Layering, horizontal elements to add dimension
- Athletic: Fitted pieces that showcase physique, V-necks for shoulders
- Average: Balanced fits, flexibility with silhouettes
- Curvy: Wrap styles, defined waists, high-waisted bottoms
- Plus-size: Structured pieces, quality fabrics, strategic color blocking

3. HEIGHT-BASED PROPORTIONS:
- Shorter: Vertical lines, high-waisted pieces, monochromatic looks
- Taller: Can handle bold patterns, layering, oversized fits
- Medium: Balanced proportions, avoid extremes

4. HAIR & STYLE COORDINATION:
- How different hair lengths affect neckline choices
- Styling for bald/shaved heads
- Hair color and clothing color harmony

Key Guidelines:
- Be friendly, enthusiastic, and encouraging
- Give SPECIFIC recommendations based on the customer's features
- Always explain WHY certain colors or styles work for them
- Reference specific products by name when making suggestions
- Use emojis tastefully (✨, 👔, 🔥, 💫, 🎨)
- Keep responses concise but informative (3-5 sentences typically)
${personalizationContext}
${productContext}

When a customer hasn't set up their profile yet, gently encourage them to share their features for better personalized recommendations.`;

    console.log("Calling AI gateway with personalized context...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      console.log("AI gateway returned error:", response.status, "- using fallback");
      
      if (response.status === 429 || response.status === 402) {
        // Use fallback for rate limit or payment issues
        const fallbackResponse = getFallbackResponse(lastUserMessage, products, userProfile);
        return new Response(
          JSON.stringify({ response: fallbackResponse }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      const fallbackResponse = getFallbackResponse(lastUserMessage, products, userProfile);
      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      const fallbackResponse = getFallbackResponse(lastUserMessage, products, userProfile);
      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("AI response generated successfully");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat error:", error);
    // Return a friendly fallback even on errors
    return new Response(
      JSON.stringify({ response: "I'm here to help! 👋 Browse our t-shirts, cargos, and jackets - I can suggest what works best for your style! ✨" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
