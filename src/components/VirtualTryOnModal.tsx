import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, RefreshCw, User, Shirt } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/store/useStore';
import { useProducts } from '@/hooks/useSupabaseProducts';

interface UserProfile {
  hairLength: 'long' | 'medium' | 'short' | 'bald' | '';
  hairColor: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'white' | 'colored' | '';
  skinTone: 'fair' | 'light' | 'medium' | 'olive' | 'tan' | 'brown' | 'dark' | '';
}

interface VirtualTryOnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProducts?: Product[];
}

const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({ 
  open, 
  onOpenChange,
  selectedProducts = []
}) => {
  const { toast } = useToast();
  const { data: allProducts = [] } = useProducts();
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('stylebot_user_profile');
    return saved ? JSON.parse(saved) : { hairLength: '', hairColor: '', skinTone: '' };
  });
  
  const [gender, setGender] = useState<'man' | 'woman' | 'person'>('person');
  const [selectedOutfit, setSelectedOutfit] = useState<Product[]>(selectedProducts);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Group products by category
  const tshirts = allProducts.filter(p => 
    p.category.toLowerCase().includes('shirt') || p.category.toLowerCase() === 't-shirts'
  );
  const bottoms = allProducts.filter(p => 
    p.category.toLowerCase().includes('cargo') || 
    p.category.toLowerCase().includes('pant') ||
    p.category.toLowerCase().includes('jeans')
  );
  const jackets = allProducts.filter(p => 
    p.category.toLowerCase().includes('jacket') || p.category.toLowerCase() === 'jackets'
  );

  const handleGenerateTryOn = async () => {
    if (!userProfile.hairLength && !userProfile.hairColor && !userProfile.skinTone) {
      setShowProfileForm(true);
      toast({
        title: "Profile Needed",
        description: "Please set up your profile for personalized visualization.",
        variant: "destructive"
      });
      return;
    }

    if (selectedOutfit.length === 0) {
      toast({
        title: "Select Products",
        description: "Please select at least one item to try on.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('virtual-tryon', {
        body: {
          userProfile,
          products: selectedOutfit.map(p => ({
            name: p.name,
            category: p.category,
            description: p.description
          })),
          gender
        }
      });

      if (error) throw error;

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast({
          title: "Try-On Generated! ✨",
          description: "Your personalized outfit visualization is ready."
        });
      } else {
        throw new Error(data.error || "Failed to generate image");
      }
    } catch (error: any) {
      console.error('Try-on error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProductSelect = (productId: string, category: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    setSelectedOutfit(prev => {
      // Remove any existing product from the same category type
      const filtered = prev.filter(p => {
        if (category === 'top') {
          return !(p.category.toLowerCase().includes('shirt') || p.category.toLowerCase() === 't-shirts');
        }
        if (category === 'bottom') {
          return !(p.category.toLowerCase().includes('cargo') || 
                   p.category.toLowerCase().includes('pant') ||
                   p.category.toLowerCase().includes('jeans'));
        }
        if (category === 'jacket') {
          return !(p.category.toLowerCase().includes('jacket'));
        }
        return true;
      });
      return [...filtered, product];
    });
  };

  const saveProfile = () => {
    localStorage.setItem('stylebot_user_profile', JSON.stringify(userProfile));
    setShowProfileForm(false);
    toast({
      title: "Profile Saved! ✨",
      description: "Your profile has been updated."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Virtual Try-On
          </DialogTitle>
          <DialogDescription>
            See how outfits look on someone with your features using AI visualization
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Your Profile
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowProfileForm(!showProfileForm)}
                >
                  {showProfileForm ? 'Hide' : 'Edit'}
                </Button>
              </div>
              
              {!showProfileForm && (userProfile.hairLength || userProfile.hairColor || userProfile.skinTone) && (
                <p className="text-sm text-muted-foreground">
                  {userProfile.hairLength && `${userProfile.hairLength} `}
                  {userProfile.hairColor && `${userProfile.hairColor} hair`}
                  {userProfile.skinTone && `, ${userProfile.skinTone} skin`}
                </p>
              )}

              {showProfileForm && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Hair Length</Label>
                    <Select 
                      value={userProfile.hairLength} 
                      onValueChange={(v: UserProfile['hairLength']) => 
                        setUserProfile(prev => ({ ...prev, hairLength: v }))
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="long">Long</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="bald">Bald</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Hair Color</Label>
                    <Select 
                      value={userProfile.hairColor} 
                      onValueChange={(v: UserProfile['hairColor']) => 
                        setUserProfile(prev => ({ ...prev, hairColor: v }))
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="brown">Brown</SelectItem>
                        <SelectItem value="blonde">Blonde</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="colored">Colored</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Skin Tone</Label>
                    <Select 
                      value={userProfile.skinTone} 
                      onValueChange={(v: UserProfile['skinTone']) => 
                        setUserProfile(prev => ({ ...prev, skinTone: v }))
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="olive">Olive</SelectItem>
                        <SelectItem value="tan">Tan</SelectItem>
                        <SelectItem value="brown">Brown</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Model Gender</Label>
                    <Select value={gender} onValueChange={(v: typeof gender) => setGender(v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="man">Man</SelectItem>
                        <SelectItem value="woman">Woman</SelectItem>
                        <SelectItem value="person">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button size="sm" onClick={saveProfile} className="w-full">
                    Save Profile
                  </Button>
                </div>
              )}
            </div>

            {/* Outfit Selection */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Shirt className="h-4 w-4" />
                Build Your Outfit
              </h3>

              {/* Top Selection */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Top</Label>
                <Select onValueChange={(v) => handleProductSelect(v, 'top')}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select a top" />
                  </SelectTrigger>
                  <SelectContent>
                    {tshirts.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ₹{product.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bottom Selection */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Bottom</Label>
                <Select onValueChange={(v) => handleProductSelect(v, 'bottom')}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select bottoms" />
                  </SelectTrigger>
                  <SelectContent>
                    {bottoms.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ₹{product.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Jacket Selection (Optional) */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Jacket (Optional)</Label>
                <Select onValueChange={(v) => handleProductSelect(v, 'jacket')}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select a jacket" />
                  </SelectTrigger>
                  <SelectContent>
                    {jackets.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ₹{product.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Items */}
              {selectedOutfit.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Selected Items:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOutfit.map(item => (
                      <span 
                        key={item.id}
                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerateTryOn} 
              disabled={isGenerating || selectedOutfit.length === 0}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Your Look...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Try-On
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Generated Image */}
          <div className="flex flex-col">
            <div className="flex-1 bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center min-h-[400px] relative overflow-hidden">
              {generatedImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={generatedImage} 
                    alt="Virtual Try-On Result"
                    className="w-full h-full object-contain"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleGenerateTryOn}
                    disabled={isGenerating}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                </div>
              ) : isGenerating ? (
                <div className="text-center p-8">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                  <p className="text-muted-foreground">Creating your personalized look...</p>
                  <p className="text-xs text-muted-foreground mt-2">This may take 10-20 seconds</p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Your AI-generated try-on will appear here</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Set your profile & select items to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VirtualTryOnModal;
