import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, RefreshCw, Shirt, Camera, X, Download, Wand2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/store/useStore';
import { useProducts } from '@/hooks/useSupabaseProducts';
import { supabase } from '@/integrations/supabase/client';

interface VirtualTryOnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProducts?: Product[];
}

type BodyType = 'slim' | 'athletic' | 'average' | 'muscular' | 'plus-size';
type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'white' | 'other';

const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({ 
  open, 
  onOpenChange,
  selectedProducts = []
}) => {
  const { toast } = useToast();
  const { data: allProducts = [] } = useProducts();
  
  // Body details
  const [bodyType, setBodyType] = useState<BodyType>('average');
  const [hairColor, setHairColor] = useState<HairColor>('black');
  const [height, setHeight] = useState<string>('170');
  const [weight, setWeight] = useState<string>('70');
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

  // Generate virtual try-on using AI with actual product images
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
      // Prepare product data with actual images
      const productsWithImages = selectedOutfit.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        imageUrl: p.images?.[0] || null // Use the first product image
      }));

      const { data, error } = await supabase.functions.invoke('virtual-tryon-ai', {
        body: {
          userPhotoBase64: userPhoto,
          selectedProducts: productsWithImages,
          gender,
          bodyDetails: {
            bodyType,
            hairColor,
            heightCm: parseInt(height) || 170,
            weightKg: parseInt(weight) || 70
          }
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
        description: "Now fill in your body details and select outfits!"
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

  // Get selected product for each category
  const selectedTop = selectedOutfit.find(p => 
    p.category.toLowerCase().includes('shirt') || p.category.toLowerCase() === 't-shirts'
  );
  const selectedBottom = selectedOutfit.find(p => 
    p.category.toLowerCase().includes('cargo') || 
    p.category.toLowerCase().includes('pant') ||
    p.category.toLowerCase().includes('jeans')
  );
  const selectedJacket = selectedOutfit.find(p => 
    p.category.toLowerCase().includes('jacket')
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Wand2 className="h-6 w-6 text-primary" />
            AI Virtual Try-On
          </DialogTitle>
          <DialogDescription>
            Upload your photo, enter your body details, and see yourself wearing our actual products!
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Left Column - Configuration */}
          <div className="space-y-4">
            {/* Photo Upload */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
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
                    className="w-28 h-36 rounded-lg object-cover mx-auto border-2 border-primary"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-1/4 h-6 w-6"
                    onClick={removePhoto}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-20 border-dashed"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="h-5 w-5" />
                    <span className="text-sm">Upload Your Photo</span>
                  </div>
                </Button>
              )}
            </div>

            {/* Body Details */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Body Details
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Gender</Label>
                  <Select value={gender} onValueChange={(v: 'man' | 'woman' | 'person') => setGender(v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="person">Prefer not to say</SelectItem>
                      <SelectItem value="man">Male</SelectItem>
                      <SelectItem value="woman">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Body Type</Label>
                  <Select value={bodyType} onValueChange={(v: BodyType) => setBodyType(v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slim">Slim</SelectItem>
                      <SelectItem value="athletic">Athletic</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="muscular">Muscular</SelectItem>
                      <SelectItem value="plus-size">Plus Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Hair Color</Label>
                  <Select value={hairColor} onValueChange={(v: HairColor) => setHairColor(v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="brown">Brown</SelectItem>
                      <SelectItem value="blonde">Blonde</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="gray">Gray</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Height (cm)</Label>
                  <Input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="h-9"
                    min="100"
                    max="250"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Weight (kg)</Label>
                  <Input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="h-9"
                    min="30"
                    max="200"
                  />
                </div>
              </div>
            </div>

            {/* Outfit Selection with Product Previews */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  <Shirt className="h-4 w-4" />
                  Select Outfit
                </h3>
                {selectedOutfit.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearOutfit}>
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {/* Top Selection */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Top</Label>
                  <div className="flex gap-2 items-center">
                    <Select onValueChange={(v) => handleProductSelect(v, 'top')}>
                      <SelectTrigger className="h-9 flex-1">
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
                    {selectedTop?.images?.[0] && (
                      <img 
                        src={selectedTop.images[0]} 
                        alt={selectedTop.name}
                        className="w-10 h-10 rounded object-cover border"
                      />
                    )}
                  </div>
                </div>

                {/* Bottom Selection */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Bottom</Label>
                  <div className="flex gap-2 items-center">
                    <Select onValueChange={(v) => handleProductSelect(v, 'bottom')}>
                      <SelectTrigger className="h-9 flex-1">
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
                    {selectedBottom?.images?.[0] && (
                      <img 
                        src={selectedBottom.images[0]} 
                        alt={selectedBottom.name}
                        className="w-10 h-10 rounded object-cover border"
                      />
                    )}
                  </div>
                </div>

                {/* Jacket Selection */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Jacket (Optional)</Label>
                  <div className="flex gap-2 items-center">
                    <Select onValueChange={(v) => handleProductSelect(v, 'jacket')}>
                      <SelectTrigger className="h-9 flex-1">
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
                    {selectedJacket?.images?.[0] && (
                      <img 
                        src={selectedJacket.images[0]} 
                        alt={selectedJacket.name}
                        className="w-10 h-10 rounded object-cover border"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Selected Items Summary */}
              {selectedOutfit.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Selected ({selectedOutfit.length}):</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedOutfit.map(item => (
                      <div key={item.id} className="flex items-center gap-1 bg-primary/10 rounded-full px-2 py-1">
                        {item.images?.[0] && (
                          <img src={item.images[0]} alt="" className="w-4 h-4 rounded-full object-cover" />
                        )}
                        <span className="text-xs text-primary">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <Button 
              className="w-full h-11"
              onClick={handleGenerateTryOn}
              disabled={isGenerating || !userPhoto || selectedOutfit.length === 0}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating your look...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Try-On
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              ✨ Uses actual product images from our catalog
            </p>
          </div>

          {/* Right Column - Preview */}
          <div className="flex flex-col">
            <h3 className="font-medium mb-3">AI Generated Preview</h3>
            
            <div className="flex-1 bg-gradient-to-br from-muted/50 to-muted rounded-lg p-4 min-h-[400px] flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <div>
                    <p className="text-muted-foreground">AI is creating your look...</p>
                    <p className="text-xs text-muted-foreground mt-1">This may take 15-30 seconds</p>
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
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Wand2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Your preview will appear here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      1. Upload your photo<br />
                      2. Enter body details<br />
                      3. Select outfit items<br />
                      4. Click "Generate Try-On"
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
