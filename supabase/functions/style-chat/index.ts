import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, products } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create a rich system prompt with product context
    const productContext = products && products.length > 0
      ? `\n\nAvailable Products:\n${products.map((p: any) => 
          `- ${p.name} (${p.category}) - ₹${p.price}${p.description ? ': ' + p.description : ''}`
        ).join('\n')}`
      : '';

    const systemPrompt = `You are a professional fashion stylist and personal shopping assistant for "Fifty-Five", a premium streetwear brand. Your expertise includes:

- Creating complete outfit combinations
- Providing style advice based on body type, occasion, and personal preferences
- Color coordination and matching
- Seasonal fashion trends
- Occasion-specific styling (casual, formal, party, work, etc.)

Key Guidelines:
- Be friendly, enthusiastic, and encouraging
- Keep responses concise but informative (2-4 sentences typically)
- Suggest specific products from the available catalog when relevant
- Give actionable styling tips
- Consider factors like: occasion, season, body type, color preferences
- Use emojis tastefully to add personality (✨, 👔, 🔥, 💫, etc.)

${productContext}

When recommending products, reference them by name and explain WHY they work together. Focus on creating cohesive looks that customers can actually wear.`;

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
        max_tokens: 500,
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
