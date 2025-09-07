import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useProducts } from '@/hooks/useSupabaseProducts';
import { Product } from '@/store/useStore';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  products?: Product[];
}

const StyleChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: products = [] } = useProducts();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        text: "Hi! I'm your personal style assistant. I can help you find the perfect outfit combinations from our collection. What are you looking to style today?",
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const getSmartResponse = (userInput: string): { text: string; products: Product[] } => {
    const input = userInput.toLowerCase();
    const suggestions: Product[] = [];
    
    // Enhanced product categorization with better filtering
    const tshirts = products.filter(p => p.category.toLowerCase().includes('shirt') || p.name.toLowerCase().includes('shirt') || p.name.toLowerCase().includes('tee') || p.category.toLowerCase() === 't-shirts');
    const cargos = products.filter(p => p.category.toLowerCase().includes('cargo') || p.name.toLowerCase().includes('cargo') || p.name.toLowerCase().includes('pant') || p.category.toLowerCase() === 'cargos');
    const jackets = products.filter(p => p.category.toLowerCase().includes('jacket') || p.name.toLowerCase().includes('jacket') || p.name.toLowerCase().includes('hoodie') || p.category.toLowerCase() === 'jackets');
    const jeans = products.filter(p => p.category.toLowerCase().includes('jeans') || p.name.toLowerCase().includes('jeans') || p.name.toLowerCase().includes('denim'));
    
    // Enhanced body type and fit advice
    const getFitAdvice = (bodyType: string) => {
      const advice = {
        slim: "For your lean build, try layering! A fitted t-shirt with a bomber jacket creates great proportions. Cargos add volume to your lower half.",
        athletic: "Your athletic build looks great in fitted pieces! Show off those gains with well-fitted t-shirts and tapered cargos.",
        broad: "Balance your shoulders with straight-leg cargos and avoid overly tight tops. Darker colors on top, lighter on bottom works well.",
        tall: "You can pull off oversized fits! Try longer t-shirts and relaxed cargos. Horizontal stripes add width if desired.",
        petite: "Fitted pieces work best for you! Avoid oversized items that might overwhelm. High-waisted cargos elongate your legs."
      };
      return advice[bodyType as keyof typeof advice] || "Let's find pieces that make you feel confident and comfortable!";
    };
    
    // Color coordination expertise
    const getColorAdvice = (colors: string[]) => {
      const colorCombos = {
        black: "Black is timeless! Pair with white, gray, or add a pop with red or yellow accessories.",
        white: "White is versatile! Works with everything. Try it with denim blues or earth tones for a fresh look.",
        navy: "Navy is sophisticated! Combine with white, gray, or camel. Avoid black unless you're going for all-dark vibes.",
        gray: "Gray is the perfect neutral! Mix with any color. Great for layering pieces.",
        olive: "Olive green is so trendy! Pairs beautifully with cream, tan, or denim blues.",
        burgundy: "Rich burgundy adds luxury! Combine with navy, gray, or cream for elegant contrast."
      };
      return colors.map(color => colorCombos[color as keyof typeof colorCombos]).filter(Boolean).join(" ");
    };
    
    // Seasonal and weather-based suggestions
    const getSeasonalAdvice = () => {
      const month = new Date().getMonth();
      if (month >= 2 && month <= 4) return "Spring vibes! Try lighter layers - a light jacket over a tee works perfectly.";
      if (month >= 5 && month <= 7) return "Summer ready! Breathable fabrics and lighter colors will keep you cool and stylish.";
      if (month >= 8 && month <= 10) return "Fall layering season! Perfect time for jackets, hoodies, and mixing textures.";
      return "Winter warmth! Layer up with jackets and don't forget accessories to complete the look.";
    };

    // Context-aware responses with variations
    const responses = {
      tshirt: [
        "T-shirts are the perfect foundation for any outfit! Let me show you some amazing combinations:",
        "I love styling t-shirts! Here are some fresh looks you can create:",
        "Great choice! T-shirts offer endless styling possibilities. Check these out:",
        "T-shirts are so versatile! Here are my top picks for creating standout looks:"
      ],
      cargo: [
        "Cargo pants are having a major moment! They're perfect for that urban streetwear vibe:",
        "Love the cargo choice! They're incredibly functional and stylish. Here's what I'd pair them with:",
        "Cargo pants are a game-changer! Let me show you how to style them effortlessly:",
        "Smart pick! Cargo pants offer the perfect blend of comfort and style:"
      ],
      jacket: [
        "Jackets are the ultimate style statement! They can transform any basic outfit:",
        "Perfect timing for layering! Jackets add instant sophistication to your look:",
        "I'm excited to help you with jackets! They're my favorite way to elevate an outfit:",
        "Jackets are where the magic happens! Here's how to create that perfect layered look:"
      ],
      casual: [
        "Casual doesn't mean boring! Let's create a relaxed yet put-together vibe:",
        "I love casual styling! It's all about effortless cool. Here's what I'm thinking:",
        "Casual outfits are my specialty! Let's build something comfortable but chic:",
        "Perfect! Casual wear that looks intentional is the best. Check out these combos:"
      ],
      formal: [
        "Time to dress to impress! Let me help you create a polished, professional look:",
        "Formal styling is an art! Here's how to achieve that sophisticated edge:",
        "I love helping with formal looks! Confidence is the best accessory. Here's my selection:",
        "Excellent choice going formal! Let's create a look that commands attention:"
      ]
    };

    // Advanced occasion-based styling with detailed advice
    if (input.includes('party') || input.includes('night out') || input.includes('date') || input.includes('club') || input.includes('dinner')) {
      const darkTees = tshirts.filter(t => t.name.toLowerCase().includes('black') || t.name.toLowerCase().includes('dark') || t.name.toLowerCase().includes('navy'));
      const stylishJackets = jackets.filter(j => !j.name.toLowerCase().includes('casual'));
      const eveningPieces = [...(stylishJackets.length ? stylishJackets.slice(0, 1) : jackets.slice(0, 1)), ...jeans.slice(0, 1), ...(darkTees.length ? darkTees.slice(0, 1) : tshirts.slice(0, 1))];
      suggestions.push(...eveningPieces);
      
      const advice = "✨ Date night magic! Dark colors create sophistication, fitted pieces show confidence. Pro tip: A well-fitted jacket instantly elevates any look. " + getSeasonalAdvice();
      return {
        text: advice,
        products: suggestions.slice(0, 3)
      };
    }

    if (input.includes('work') || input.includes('office') || input.includes('professional') || input.includes('business') || input.includes('meeting')) {
      const professionalTees = tshirts.filter(t => !t.name.toLowerCase().includes('graphic') && !t.name.toLowerCase().includes('logo') && !t.name.toLowerCase().includes('ripped'));
      const blazers = jackets.filter(j => j.name.toLowerCase().includes('blazer') || j.name.toLowerCase().includes('formal'));
      const cleanPants = [...cargos, ...jeans].filter(p => !p.name.toLowerCase().includes('ripped') && !p.name.toLowerCase().includes('distressed'));
      
      suggestions.push(...professionalTees.slice(0, 1), ...cleanPants.slice(0, 1), ...(blazers.length ? blazers.slice(0, 1) : jackets.slice(0, 1)));
      
      const advice = "🏢 Professional power! Clean lines and solid colors project confidence. Avoid logos and distressed items. Dark colors are always safe. Pro tip: A structured jacket makes any outfit work-appropriate.";
      return {
        text: advice,
        products: suggestions
      };
    }

    if (input.includes('workout') || input.includes('gym') || input.includes('sport') || input.includes('active') || input.includes('exercise') || input.includes('running')) {
      const performanceTees = tshirts.filter(t => t.name.toLowerCase().includes('athletic') || t.name.toLowerCase().includes('performance') || t.name.toLowerCase().includes('sport'));
      const activePants = cargos.filter(c => c.name.toLowerCase().includes('athletic') || c.name.toLowerCase().includes('jogger'));
      const activeWear = [...(performanceTees.length ? performanceTees : tshirts).slice(0, 2), ...(activePants.length ? activePants : cargos).slice(0, 1)];
      suggestions.push(...activeWear);
      
      const advice = "💪 Workout warrior! Look for moisture-wicking fabrics and flexible fits. Darker colors hide sweat better. Pro tip: Layering helps with temperature regulation during workouts.";
      return {
        text: advice,
        products: suggestions
      };
    }

    if (input.includes('color') && (input.includes('black') || input.includes('white') || input.includes('blue') || input.includes('red'))) {
      const colorMatch = input.match(/(black|white|blue|red|green|gray|grey)/);
      if (colorMatch) {
        const colorProducts = products.filter(p => p.name.toLowerCase().includes(colorMatch[0]));
        suggestions.push(...colorProducts.slice(0, 4));
        return {
          text: `${colorMatch[0].charAt(0).toUpperCase() + colorMatch[0].slice(1)} is such a versatile color! Here are some amazing pieces in that shade:`,
          products: suggestions
        };
      }
    }

    // Category-specific responses with variations
    if (input.includes('t-shirt') || input.includes('tshirt') || input.includes('shirt')) {
      const randomResponse = responses.tshirt[Math.floor(Math.random() * responses.tshirt.length)];
      if (cargos.length > 0 && Math.random() > 0.5) {
        suggestions.push(...tshirts.slice(0, 2), ...cargos.slice(0, 1));
      } else if (jeans.length > 0) {
        suggestions.push(...tshirts.slice(0, 2), ...jeans.slice(0, 1));
      }
      return { text: randomResponse, products: suggestions };
    }

    if (input.includes('cargo') || input.includes('pant')) {
      const randomResponse = responses.cargo[Math.floor(Math.random() * responses.cargo.length)];
      suggestions.push(...cargos.slice(0, 2), ...tshirts.slice(0, 1));
      if (jackets.length > 0 && Math.random() > 0.6) {
        suggestions.push(...jackets.slice(0, 1));
      }
      return { text: randomResponse, products: suggestions };
    }

    if (input.includes('jacket') || input.includes('hoodie') || input.includes('layer')) {
      const randomResponse = responses.jacket[Math.floor(Math.random() * responses.jacket.length)];
      suggestions.push(...jackets.slice(0, 2));
      const bottomChoice = Math.random() > 0.5 ? jeans : cargos;
      if (bottomChoice.length > 0) suggestions.push(...bottomChoice.slice(0, 1));
      return { text: randomResponse, products: suggestions };
    }

    if (input.includes('casual') || input.includes('everyday') || input.includes('comfortable')) {
      const randomResponse = responses.casual[Math.floor(Math.random() * responses.casual.length)];
      const casualBottoms = cargos.length > 0 ? cargos : jeans;
      suggestions.push(...tshirts.slice(0, 1), ...casualBottoms.slice(0, 1));
      return { text: randomResponse, products: suggestions };
    }

    if (input.includes('formal') || input.includes('smart') || input.includes('dress up')) {
      const randomResponse = responses.formal[Math.floor(Math.random() * responses.formal.length)];
      const formalItems = products.filter(p => 
        p.name.toLowerCase().includes('formal') || 
        p.name.toLowerCase().includes('dress') ||
        p.category.toLowerCase().includes('formal')
      );
      suggestions.push(...formalItems.slice(0, 3));
      return { text: randomResponse, products: suggestions };
    }

    if (input.includes('outfit') || input.includes('complete') || input.includes('look') || input.includes('style me')) {
      const completeOutfitResponses = [
        "Let me create a complete head-to-toe look for you! Here's my curated selection:",
        "Time for a full makeover! I'm putting together pieces that work perfectly together:",
        "Complete outfit coming right up! I've handpicked these items for maximum style impact:",
        "I love creating complete looks! Here's an outfit that'll have you looking amazing:"
      ];
      const randomResponse = completeOutfitResponses[Math.floor(Math.random() * completeOutfitResponses.length)];
      const completeBottoms = cargos.length > 0 ? cargos : jeans;
      suggestions.push(...tshirts.slice(0, 1), ...completeBottoms.slice(0, 1), ...jackets.slice(0, 1));
      return { text: randomResponse, products: suggestions };
    }

    // Conversational responses for greetings and general queries
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      const greetings = [
        "Hey there, style star! Ready to put together an amazing look? Tell me what you're feeling today!",
        "Hello! I'm so excited to help you create the perfect outfit. What's the vibe you're going for?",
        "Hi! Your personal stylist is here! Whether you want casual cool or dressed up, I've got you covered!",
        "Hey! Let's make you look incredible today. What type of outfit are you dreaming up?"
      ];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      const trendingItems = products.sort(() => Math.random() - 0.5).slice(0, 3);
      return { text: randomGreeting, products: trendingItems };
    }

    if (input.includes('help') || input.includes('suggest') || input.includes('recommend')) {
      const helpResponses = [
        "I'm here to help you look amazing! I can suggest outfits for any occasion. Try asking about 'casual looks' or 'party outfits'!",
        "Let me be your styling guide! Tell me about the occasion, your mood, or specific pieces you want to style.",
        "I love helping with outfit ideas! You can ask me about combining different pieces or creating looks for specific events.",
        "Style assistance at your service! Ask me about t-shirts, cargos, jackets, or complete outfit ideas!"
      ];
      const randomHelp = helpResponses[Math.floor(Math.random() * helpResponses.length)];
      return { text: randomHelp, products: [] };
    }

    // Enhanced body type specific advice
    if (input.includes('body type') || input.includes('fit') || input.includes('size') || input.includes('tall') || input.includes('short') || input.includes('slim') || input.includes('athletic')) {
      const bodyType = input.includes('tall') ? 'tall' : input.includes('slim') ? 'slim' : input.includes('athletic') ? 'athletic' : 'general';
      const advice = getFitAdvice(bodyType);
      suggestions.push(...products.slice(0, 3));
      return { text: `👔 ${advice} ${getSeasonalAdvice()}`, products: suggestions };
    }

    // Color matching expertise
    if (input.includes('what goes with') || input.includes('match') || input.includes('coordinate')) {
      const mentionedColors = ['black', 'white', 'navy', 'gray', 'grey', 'olive', 'burgundy'].filter(color => input.includes(color));
      if (mentionedColors.length > 0) {
        const colorAdvice = getColorAdvice(mentionedColors);
        const colorProducts = products.filter(p => mentionedColors.some(color => p.name.toLowerCase().includes(color)));
        suggestions.push(...colorProducts.slice(0, 4));
        return { text: `🎨 Color coordination expert here! ${colorAdvice}`, products: suggestions };
      }
    }

    // Budget consciousness
    if (input.includes('budget') || input.includes('affordable') || input.includes('cheap') || input.includes('expensive')) {
      const budgetProducts = products.sort((a, b) => a.price - b.price);
      suggestions.push(...budgetProducts.slice(0, 4));
      return {
        text: "💰 Smart shopping! Here are some great value pieces that don't compromise on style. Mix high and low pieces for the best looks!",
        products: suggestions
      };
    }

    // Trend awareness
    if (input.includes('trend') || input.includes('trendy') || input.includes('fashion') || input.includes('style') || input.includes('latest')) {
      const trendyPieces = [...cargos.slice(0, 1), ...jackets.slice(0, 1), ...tshirts.slice(0, 2)];
      suggestions.push(...trendyPieces);
      return {
        text: "🔥 Trend alert! Cargo pants are having a major moment, oversized fits are in, and layering is everything. Here's how to stay current:",
        products: suggestions
      };
    }

    // Default with seasonal and personalized advice
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening';
    
    const personalizedResponses = [
      `Good ${timeOfDay}! ✨ I'm loving these versatile pieces that work for multiple occasions. ${getSeasonalAdvice()}`,
      `Perfect timing to refresh your wardrobe! These trending items are flying off our shelves: ${getSeasonalAdvice()}`,
      `Style inspiration coming right up! These pieces are perfect for creating signature looks that reflect your personality.`,
      `Let's elevate your style game! These carefully curated pieces offer endless mixing and matching possibilities.`
    ];
    const randomDefault = personalizedResponses[Math.floor(Math.random() * personalizedResponses.length)];
    const curatedProducts = products.sort(() => Math.random() - 0.5).slice(0, 4);
    
    return {
      text: randomDefault,
      products: curatedProducts
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const { text, products: suggestedProducts } = getSmartResponse(inputValue);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text,
        isBot: true,
        timestamp: new Date(),
        products: suggestedProducts
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 z-50 border-2 border-background animate-pulse hover:animate-none"
      >
        <MessageCircle className="h-7 w-7" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full ring-2 ring-background animate-bounce"></div>
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 h-[500px] w-96 flex flex-col bg-gradient-to-br from-background to-background/95 shadow-2xl border border-border/50 backdrop-blur-sm z-50 animate-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="font-semibold">✨ Style Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:bg-white/20 h-6 w-6 p-0 transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-muted/20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-1 duration-300`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                message.isBot
                  ? 'bg-gradient-to-br from-muted/90 to-muted text-foreground border border-border/50'
                  : 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-primary/20'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              {message.products && message.products.length > 0 && (
                <div className="mt-4 space-y-3">
                  {message.products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 bg-background/80 backdrop-blur-sm rounded-xl p-3 border border-border/30 hover:border-border/60 transition-colors">
                      {product.images && product.images[0] && (
                        <div className="relative">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded-lg shadow-sm"
                          />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full ring-2 ring-background"></div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm font-semibold text-primary">${product.price}</p>
                          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded-full">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in slide-in-from-bottom-1 duration-300">
            <div className="bg-gradient-to-br from-muted/90 to-muted p-4 rounded-2xl border border-border/50">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-muted-foreground">Styling your look...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/20 bg-background/50 backdrop-blur-sm">
        <div className="flex space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about styling outfits..."
            className="flex-1 border-border/50 bg-background/80 focus:bg-background transition-colors placeholder:text-muted-foreground/70"
          />
          <Button 
            onClick={handleSendMessage} 
            size="sm"
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm"
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button 
            onClick={() => setInputValue("casual outfit")}
            className="text-xs px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
          >
            Casual look
          </button>
          <button 
            onClick={() => setInputValue("t-shirt and cargo")}
            className="text-xs px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
          >
            T-shirt + Cargo
          </button>
          <button 
            onClick={() => setInputValue("party outfit")}
            className="text-xs px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
          >
            Party ready
          </button>
        </div>
      </div>
    </Card>
  );
};

export default StyleChatbot;