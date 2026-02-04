import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, RefreshCw, Shirt, Camera, X, Download, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/store/useStore';
import { useProducts } from '@/hooks/useSupabaseProducts';
import { supabase } from '@/integrations/supabase/client';

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
  
  const [gender, setGender] = useState<'man' | 'woman' | 'person'>('person');
  const [selectedOutfit, setSelectedOutfit] = useState<Product[]>(selectedProducts);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(() => {
    return localStorage.getItem('tryon_user_photo');
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Generate virtual try-on using AI
  const handleGenerateTryOn = async () => {
    if (!userPhoto) {
      toast({
        title: "Photo Required",
        description: "Please upload your photo first.",
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
      const { data, error } = await supabase.functions.invoke('virtual-tryon-ai', {
        body: {
          userPhotoBase64: userPhoto,
          selectedProducts: selectedOutfit.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category
          })),
          gender
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast({
          title: "AI Try-On Complete! ✨",
          description: data.message || "See how the outfit looks on you!"
        });
      } else {
        throw new Error("No image generated");
      }
    } catch (error: any) {
      console.error('Try-on error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Please try again.",
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image under 10MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setUserPhoto(base64);
      localStorage.setItem('tryon_user_photo', base64);
      toast({
        title: "Photo Uploaded! 📸",
        description: "Now select outfits and generate your AI try-on!"
      });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setUserPhoto(null);
    setGeneratedImage(null);
    localStorage.removeItem('tryon_user_photo');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.download = `55th-street-ai-tryon-${Date.now()}.jpg`;
    link.href = generatedImage;
    link.click();
  };

  const clearOutfit = () => {
    setSelectedOutfit([]);
    setGeneratedImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Wand2 className="h-6 w-6 text-primary" />
            AI Virtual Try-On
          </DialogTitle>
          <DialogDescription>
            Upload your photo and our AI will show you wearing the selected outfits!
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Photo Upload */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Your Photo
                </h3>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="user-photo-input"
              />
              
              {userPhoto ? (
                <div className="relative">
                  <img 
                    src={userPhoto} 
                    alt="Your photo" 
                    className="w-32 h-40 rounded-lg object-cover mx-auto border-2 border-primary"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-1/4 h-6 w-6"
                    onClick={removePhoto}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    ✓ Photo ready for AI try-on
                  </p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-24 border-dashed"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="h-6 w-6" />
                    <span>Upload Your Photo</span>
                  </div>
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                Full body or upper body photo works best for realistic results
              </p>
            </div>

            {/* Gender Selection */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <Label>Select Gender (for better results)</Label>
              <Select value={gender} onValueChange={(v: 'man' | 'woman' | 'person') => setGender(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person">Prefer not to say</SelectItem>
                  <SelectItem value="man">Male</SelectItem>
                  <SelectItem value="woman">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Outfit Selection */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  <Shirt className="h-4 w-4" />
                  Build Your Outfit
                </h3>
                {selectedOutfit.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearOutfit}>
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-3">
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

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Jacket (Optional)</Label>
                  <Select onValueChange={(v) => handleProductSelect(v, 'jacket')}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Add a jacket" />
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
              </div>

              {/* Selected Items */}
              {selectedOutfit.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Selected items:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOutfit.map(item => (
                      <span 
                        key={item.id}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
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
              className="w-full h-12 text-lg"
              onClick={handleGenerateTryOn}
              disabled={isGenerating || !userPhoto || selectedOutfit.length === 0}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  AI is creating your look...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate AI Try-On
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              ✨ Powered by AI - See yourself in our outfits!
            </p>
          </div>

          {/* Right Column - Preview */}
          <div className="flex flex-col">
            <h3 className="font-medium mb-4">AI Generated Preview</h3>
            
            <div className="flex-1 bg-gradient-to-br from-muted/50 to-muted rounded-lg p-4 min-h-[400px] flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <div>
                    <p className="text-muted-foreground">AI is working its magic...</p>
                    <p className="text-xs text-muted-foreground mt-1">This may take 10-20 seconds</p>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="space-y-4 w-full">
                  <img 
                    src={generatedImage} 
                    alt="AI Virtual try-on result"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleGenerateTryOn}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={downloadImage}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 p-6">
                  <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Wand2 className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Your AI preview will appear here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      1. Upload your photo<br />
                      2. Select outfit items<br />
                      3. Click "Generate AI Try-On"
                    </p>
                  </div>
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
