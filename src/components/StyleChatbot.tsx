import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useProducts } from '@/hooks/useSupabaseProducts';
import { Product } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  products?: Product[];
}

interface UserProfile {
  hairLength: 'long' | 'medium' | 'short' | 'bald' | '';
  hairColor: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'white' | 'colored' | '';
  skinTone: 'fair' | 'light' | 'medium' | 'olive' | 'tan' | 'brown' | 'dark' | '';
}

const StyleChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('stylebot_user_profile');
    return saved ? JSON.parse(saved) : { hairLength: '', hairColor: '', skinTone: '' };
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: products = [] } = useProducts();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('stylebot_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const hasProfile = userProfile.hairLength || userProfile.hairColor || userProfile.skinTone;
      const welcomeText = hasProfile 
        ? `Welcome back! 👋 I remember your style profile. I'll give you personalized recommendations based on your ${userProfile.hairLength || ''} ${userProfile.hairColor || ''} hair and ${userProfile.skinTone || ''} skin tone. What are you looking for today?`
        : "Hi! I'm your AI-powered style assistant. 👋 To give you the best personalized recommendations, click the profile icon to share your hair type and skin tone. Or just ask me anything about style!";
      
      const welcomeMessage: ChatMessage = {
        id: '1',
        text: welcomeText,
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, userProfile]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Call the AI edge function with user profile
      const { data, error } = await supabase.functions.invoke('style-chat', {
        body: {
          messages: [
            ...messages.map(m => ({
              role: m.isBot ? 'assistant' : 'user',
              content: m.text
            })),
            { role: 'user', content: userInput }
          ],
          products: products.map(p => ({
            name: p.name,
            category: p.category,
            price: p.price,
            description: p.description
          })),
          userProfile: userProfile
        }
      });

      if (error) throw error;

      // Extract product suggestions from AI response if mentioned
      const responseText = data.response;
      const suggestedProducts: Product[] = [];
      
      // Smart product matching based on AI response
      const lowerResponse = responseText.toLowerCase();
      products.forEach(product => {
        if (lowerResponse.includes(product.name.toLowerCase()) || 
            lowerResponse.includes(product.category.toLowerCase())) {
          suggestedProducts.push(product);
        }
      });

      // If no specific products mentioned, suggest based on context
      if (suggestedProducts.length === 0) {
        const input = userInput.toLowerCase();
        if (input.includes('tshirt') || input.includes('t-shirt') || input.includes('shirt')) {
          suggestedProducts.push(...products.filter(p => 
            p.category.toLowerCase().includes('shirt') || p.category.toLowerCase() === 't-shirts'
          ).slice(0, 2));
        } else if (input.includes('cargo') || input.includes('pant')) {
          suggestedProducts.push(...products.filter(p => 
            p.category.toLowerCase().includes('cargo') || p.category.toLowerCase() === 'cargos'
          ).slice(0, 2));
        } else if (input.includes('jacket')) {
          suggestedProducts.push(...products.filter(p => 
            p.category.toLowerCase().includes('jacket') || p.category.toLowerCase() === 'jackets'
          ).slice(0, 2));
        } else if (input.includes('outfit') || input.includes('complete')) {
          const tshirt = products.find(p => p.category.toLowerCase().includes('shirt') || p.category.toLowerCase() === 't-shirts');
          const cargo = products.find(p => p.category.toLowerCase().includes('cargo') || p.category.toLowerCase() === 'cargos');
          const jacket = products.find(p => p.category.toLowerCase().includes('jacket') || p.category.toLowerCase() === 'jackets');
          if (tshirt) suggestedProducts.push(tshirt);
          if (cargo) suggestedProducts.push(cargo);
          if (jacket) suggestedProducts.push(jacket);
        }
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isBot: true,
        timestamp: new Date(),
        products: suggestedProducts.slice(0, 4)
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      
      let errorMessage = "I'm having trouble right now. Please try again! 😊";
      
      if (error.message?.includes('429')) {
        errorMessage = "I'm getting too many requests right now. Please wait a moment and try again! 🙏";
      } else if (error.message?.includes('402')) {
        errorMessage = "Service temporarily unavailable. Please contact support. 💫";
      }

      const errorBotMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorBotMessage]);
      
      toast({
        title: "Oops!",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleProfileSave = () => {
    setShowProfile(false);
    toast({
      title: "Profile Updated! ✨",
      description: "I'll now give you personalized style recommendations."
    });
    
    // Add a message acknowledging the profile update
    const profileMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Perfect! I've saved your profile. With your ${userProfile.hairLength || 'unique'} ${userProfile.hairColor || ''} hair and ${userProfile.skinTone || 'beautiful'} skin tone, I can now give you truly personalized color and style recommendations! 🎨`,
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, profileMessage]);
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
    <Card className="fixed bottom-6 right-6 h-[550px] w-96 flex flex-col bg-gradient-to-br from-background to-background/95 shadow-2xl border border-border/50 backdrop-blur-sm z-50 animate-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <h3 className="font-semibold">AI Style Assistant</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProfile(!showProfile)}
            className="text-primary-foreground hover:bg-white/20 h-7 w-7 p-0 transition-colors"
            title="Your Style Profile"
          >
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-white/20 h-7 w-7 p-0 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Profile Panel */}
      {showProfile && (
        <div className="p-4 border-b border-border/20 bg-muted/50 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Your Style Profile
            </h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowProfile(false)}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Hair Length</Label>
              <Select 
                value={userProfile.hairLength} 
                onValueChange={(value: UserProfile['hairLength']) => 
                  setUserProfile(prev => ({ ...prev, hairLength: value }))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select hair length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">Long Hair</SelectItem>
                  <SelectItem value="medium">Medium Length</SelectItem>
                  <SelectItem value="short">Short Hair</SelectItem>
                  <SelectItem value="bald">Bald / No Hair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Hair Color</Label>
              <Select 
                value={userProfile.hairColor} 
                onValueChange={(value: UserProfile['hairColor']) => 
                  setUserProfile(prev => ({ ...prev, hairColor: value }))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select hair color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="blonde">Blonde</SelectItem>
                  <SelectItem value="red">Red / Auburn</SelectItem>
                  <SelectItem value="gray">Gray / Silver</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="colored">Colored (Dyed)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Skin Tone</Label>
              <Select 
                value={userProfile.skinTone} 
                onValueChange={(value: UserProfile['skinTone']) => 
                  setUserProfile(prev => ({ ...prev, skinTone: value }))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select skin tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fair">Fair / Porcelain</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="olive">Olive</SelectItem>
                  <SelectItem value="tan">Tan / Caramel</SelectItem>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="dark">Dark / Deep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleProfileSave} 
            size="sm" 
            className="w-full"
          >
            Save Profile
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

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
                          <p className="text-sm font-semibold text-primary">₹{product.price}</p>
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
            onClick={() => setInputValue("what colors suit me?")}
            className="text-xs px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
          >
            Colors for me
          </button>
          <button 
            onClick={() => setInputValue("suggest an outfit for my features")}
            className="text-xs px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
          >
            Personalized outfit
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
