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

  const getStyleSuggestions = (userInput: string): { text: string; products: Product[] } => {
    const input = userInput.toLowerCase();
    const suggestions: Product[] = [];
    let responseText = '';

    // Categorize products
    const tshirts = products.filter(p => p.category.toLowerCase().includes('shirt') || p.name.toLowerCase().includes('shirt') || p.name.toLowerCase().includes('tee'));
    const cargos = products.filter(p => p.category.toLowerCase().includes('cargo') || p.name.toLowerCase().includes('cargo') || p.name.toLowerCase().includes('pant'));
    const jackets = products.filter(p => p.category.toLowerCase().includes('jacket') || p.name.toLowerCase().includes('jacket') || p.name.toLowerCase().includes('hoodie'));
    const jeans = products.filter(p => p.category.toLowerCase().includes('jeans') || p.name.toLowerCase().includes('jeans') || p.name.toLowerCase().includes('denim'));

    if (input.includes('t-shirt') || input.includes('tshirt') || input.includes('shirt')) {
      if (cargos.length > 0) {
        suggestions.push(...tshirts.slice(0, 2), ...cargos.slice(0, 2));
        responseText = "Great choice! Here are some perfect t-shirt and cargo combinations for a casual, comfortable look:";
      } else if (jeans.length > 0) {
        suggestions.push(...tshirts.slice(0, 2), ...jeans.slice(0, 2));
        responseText = "Perfect! Here are some stylish t-shirt and jeans combinations:";
      }
    } else if (input.includes('cargo') || input.includes('pant')) {
      if (tshirts.length > 0) {
        suggestions.push(...cargos.slice(0, 2), ...tshirts.slice(0, 2));
        responseText = "Cargo pants are versatile! Here are some great combinations with our t-shirts:";
      }
      if (jackets.length > 0) {
        suggestions.push(...jackets.slice(0, 1));
        responseText += " You can also layer with these jackets for a complete look.";
      }
    } else if (input.includes('jacket') || input.includes('hoodie')) {
      suggestions.push(...jackets.slice(0, 2));
      if (jeans.length > 0) {
        suggestions.push(...jeans.slice(0, 1));
        responseText = "Here are some awesome jacket combinations. Perfect with jeans for a layered look:";
      }
      if (tshirts.length > 0) {
        suggestions.push(...tshirts.slice(0, 1));
        responseText += " Layer over a simple t-shirt for the perfect casual outfit.";
      }
    } else if (input.includes('casual') || input.includes('everyday')) {
      const casualBottoms = cargos.length > 0 ? cargos : jeans;
      suggestions.push(...tshirts.slice(0, 1), ...casualBottoms.slice(0, 1));
      responseText = "For a casual everyday look, here are some comfortable combinations:";
    } else if (input.includes('formal') || input.includes('smart')) {
      const formalItems = products.filter(p => 
        p.name.toLowerCase().includes('formal') || 
        p.name.toLowerCase().includes('dress') ||
        p.category.toLowerCase().includes('formal')
      );
      suggestions.push(...formalItems.slice(0, 3));
      responseText = "For a more formal look, here are some sophisticated options:";
    } else if (input.includes('outfit') || input.includes('complete') || input.includes('look')) {
      // Mix different categories for a complete outfit
      const completeBottoms = cargos.length > 0 ? cargos : jeans;
      suggestions.push(
        ...tshirts.slice(0, 1),
        ...completeBottoms.slice(0, 1),
        ...jackets.slice(0, 1)
      );
      responseText = "Here's a complete outfit suggestion mixing our best pieces:";
    } else {
      // Default suggestions
      const randomProducts = products.sort(() => Math.random() - 0.5).slice(0, 4);
      suggestions.push(...randomProducts);
      responseText = "Here are some popular items from our collection that work great together:";
    }

    // Remove duplicates
    const uniqueSuggestions = suggestions.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );

    return {
      text: responseText || "Here are some great styling options from our collection:",
      products: uniqueSuggestions.slice(0, 4)
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
      const { text, products: suggestedProducts } = getStyleSuggestions(inputValue);
      
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
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 h-96 w-80 flex flex-col bg-white shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-white rounded-t-lg">
        <h3 className="font-semibold">Style Assistant</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.isBot
                  ? 'bg-muted text-foreground'
                  : 'bg-primary text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              {message.products && message.products.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2 bg-white/10 rounded p-2">
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-8 w-8 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-medium">{product.name}</p>
                        <p className="text-xs opacity-80">${product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about styling..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StyleChatbot;