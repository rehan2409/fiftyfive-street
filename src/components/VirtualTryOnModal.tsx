import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, RefreshCw, User, Shirt, Camera, X, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/store/useStore';
import { useProducts } from '@/hooks/useSupabaseProducts';
import { UserProfile, defaultUserProfile } from './StyleChatbot';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('stylebot_user_profile');
    return saved ? JSON.parse(saved) : defaultUserProfile;
  });
  
  const [gender, setGender] = useState<'man' | 'woman' | 'person'>('person');
  const [selectedOutfit, setSelectedOutfit] = useState<Product[]>(selectedProducts);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
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

  // Generate virtual try-on using canvas compositing (no API needed!)
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
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not available");
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context not available");

      // Load user photo
      const userImg = new Image();
      userImg.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        userImg.onload = () => resolve();
        userImg.onerror = () => reject(new Error("Failed to load user photo"));
        userImg.src = userPhoto;
      });

      // Set canvas size based on user image
      const maxWidth = 600;
      const maxHeight = 800;
      let width = userImg.width;
      let height = userImg.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;

      // Draw user photo as base
      ctx.drawImage(userImg, 0, 0, width, height);

      // Load and overlay product images
      for (const product of selectedOutfit) {
        if (product.images && product.images.length > 0) {
          const productImg = new Image();
          productImg.crossOrigin = "anonymous";
          
          await new Promise<void>((resolve) => {
            productImg.onload = () => resolve();
            productImg.onerror = () => resolve(); // Continue even if image fails
            productImg.src = product.images![0];
          });

          if (productImg.complete && productImg.naturalWidth > 0) {
            // Position based on product category
            let x = 0, y = 0, pWidth = 0, pHeight = 0;
            const category = product.category.toLowerCase();
            
            if (category.includes('shirt') || category === 't-shirts') {
              // Position for tops - center upper body
              pWidth = width * 0.5;
              pHeight = pWidth * (productImg.height / productImg.width);
              x = (width - pWidth) / 2;
              y = height * 0.2;
            } else if (category.includes('cargo') || category.includes('pant') || category.includes('jeans')) {
              // Position for bottoms - center lower body
              pWidth = width * 0.45;
              pHeight = pWidth * (productImg.height / productImg.width);
              x = (width - pWidth) / 2;
              y = height * 0.5;
            } else if (category.includes('jacket')) {
              // Position for jackets - over the top
              pWidth = width * 0.55;
              pHeight = pWidth * (productImg.height / productImg.width);
              x = (width - pWidth) / 2;
              y = height * 0.15;
            }

            // Apply blend mode for semi-transparent overlay
            ctx.globalAlpha = 0.85;
            ctx.drawImage(productImg, x, y, pWidth, pHeight);
            ctx.globalAlpha = 1.0;
          }
        }
      }

      // Add a stylish overlay effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, width, height);

      // Add watermark
      ctx.font = '14px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'right';
      ctx.fillText('55th Street Try-On', width - 10, height - 10);

      // Convert canvas to image
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setGeneratedImage(dataUrl);
      
      toast({
        title: "Try-On Generated! ✨",
        description: "Your outfit preview is ready. This shows how items would look together."
      });
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

  const saveProfile = () => {
    localStorage.setItem('stylebot_user_profile', JSON.stringify(userProfile));
    setShowProfileForm(false);
    toast({
      title: "Profile Saved! ✨",
      description: "Your profile has been updated."
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
        description: "Now select outfits and generate your try-on!"
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
    link.download = `55th-street-tryon-${Date.now()}.jpg`;
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
            <Sparkles className="h-6 w-6 text-primary" />
            Virtual Try-On
          </DialogTitle>
          <DialogDescription>
            Upload your photo and see how outfits look on you instantly!
          </DialogDescription>
        </DialogHeader>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />

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
                    ✓ Photo ready for try-on
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
                Full body photo works best for accurate try-on
              </p>
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
                  Creating Preview...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Try-On
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Preview */}
          <div className="flex flex-col">
            <h3 className="font-medium mb-4">Preview</h3>
            
            <div className="flex-1 bg-gradient-to-br from-muted/50 to-muted rounded-lg p-4 min-h-[400px] flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Creating your look...</p>
                </div>
              ) : generatedImage ? (
                <div className="space-y-4 w-full">
                  <img 
                    src={generatedImage} 
                    alt="Virtual try-on result"
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
                <div className="text-center space-y-4 text-muted-foreground">
                  <Shirt className="h-16 w-16 mx-auto opacity-30" />
                  <div>
                    <p className="font-medium">Your try-on preview will appear here</p>
                    <p className="text-sm mt-1">Upload a photo and select items to start</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> For best results, use a well-lit full body photo with a plain background.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VirtualTryOnModal;
