import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  hairLength: 'long' | 'medium' | 'short' | 'bald' | '';
  hairColor: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'white' | 'colored' | '';
  skinTone: 'fair' | 'light' | 'medium' | 'olive' | 'tan' | 'brown' | 'dark' | '';
}

// Color theory and styling knowledge base
const getColorRecommendations = (profile: UserProfile): string => {
  const recommendations: string[] = [];

  // Skin tone based color recommendations (based on color theory)
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
    short: 'Short hair draws attention to your face - statement earrings (if applicable) and interesting necklines enhance this.',
    bald: 'A bald head creates a clean, bold look. Turtlenecks, crew necks, and V-necks all work excellently. Consider statement accessories like watches or chains.'
  };

  // Build personalized recommendations
  if (profile.skinTone && skinToneColors[profile.skinTone]) {
    const colors = skinToneColors[profile.skinTone];
    recommendations.push(`For your ${profile.skinTone} skin tone: Best colors are ${colors.best.join(', ')}. Great neutrals: ${colors.neutrals.join(', ')}.`);
    if (colors.avoid.length > 0) {
      recommendations.push(`You may want to avoid: ${colors.avoid.join(', ')}.`);
    }
  }

  if (profile.hairColor && hairColorAdvice[profile.hairColor]) {
    recommendations.push(hairColorAdvice[profile.hairColor]);
  }

  if (profile.hairLength && hairLengthAdvice[profile.hairLength]) {
    recommendations.push(hairLengthAdvice[profile.hairLength]);
  }

  return recommendations.join(' ');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, products, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create a rich system prompt with product context and personalization
    const productContext = products && products.length > 0
      ? `\n\nAvailable Products:\n${products.map((p: any) => 
          `- ${p.name} (${p.category}) - ₹${p.price}${p.description ? ': ' + p.description : ''}`
        ).join('\n')}`
      : '';

    // Build personalized context based on user profile
    let personalizationContext = '';
    if (userProfile && (userProfile.hairLength || userProfile.hairColor || userProfile.skinTone)) {
      const profileDesc = [];
      if (userProfile.hairLength) profileDesc.push(`${userProfile.hairLength} hair`);
      if (userProfile.hairColor) profileDesc.push(`${userProfile.hairColor} hair color`);
      if (userProfile.skinTone) profileDesc.push(`${userProfile.skinTone} skin tone`);
      
      const colorRecs = getColorRecommendations(userProfile);
      
      personalizationContext = `

CUSTOMER PROFILE:
The customer has: ${profileDesc.join(', ')}.

PERSONALIZED COLOR & STYLE RECOMMENDATIONS FOR THIS CUSTOMER:
${colorRecs}

IMPORTANT: Always consider this customer's unique features when making recommendations. Suggest colors and styles that complement their hair and skin tone. When recommending products, explain WHY certain colors work well for them specifically.`;
    }

    const systemPrompt = `You are an expert fashion stylist and personal shopping assistant for "Fifty-Five", a premium streetwear brand. You have deep expertise in:

1. COLOR THEORY & SKIN TONE ANALYSIS:
- Understanding which colors complement different skin tones (cool/warm undertones)
- Knowledge of seasonal color analysis (Spring, Summer, Autumn, Winter palettes)
- How hair color affects overall color harmony

2. HAIR & STYLE COORDINATION:
- How different hair lengths affect neckline choices and overall proportions
- Styling for bald/shaved heads (which actually gives great flexibility!)
- How hair color creates contrast with clothing colors

3. PERSONALIZED STYLING:
- Creating complete outfit combinations based on individual features
- Balancing proportions and creating flattering silhouettes
- Occasion-specific styling (casual, formal, party, work, etc.)

Key Guidelines:
- Be friendly, enthusiastic, and encouraging
- Give SPECIFIC recommendations based on the customer's features
- Always explain WHY certain colors or styles work for them
- Reference specific products by name when making suggestions
- Use emojis tastefully to add personality (✨, 👔, 🔥, 💫, 🎨)
- Keep responses concise but informative (3-5 sentences typically)
${personalizationContext}
${productContext}

When a customer hasn't set up their profile yet, gently encourage them to share their hair and skin details for better personalized recommendations.`;

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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "I'm getting too many requests right now. Please try again in a moment! 🙏" 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Service temporarily unavailable. Please contact support." 
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Unable to process your request. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    console.log("AI response generated successfully");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
