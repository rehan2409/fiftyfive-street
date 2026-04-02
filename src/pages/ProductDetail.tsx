
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Minus, Box, Share2, Copy, Check } from 'lucide-react';
import Product3DViewer from '@/components/Product3DViewer';
import ProductRecommendations from '@/components/ProductRecommendations';
import ProductReviews from '@/components/ProductReviews';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, cart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const product = products.find(p => p.id === id);
  const isOutOfStock = product ? (product.stock ?? 0) <= 0 : false;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate('/products/all')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    // Check if adding this quantity would exceed stock
    const existingInCart = cart.find(
      (item) => item.productId === product.id && item.size === selectedSize
    );
    const currentInCart = existingInCart ? existingInCart.quantity : 0;
    const availableStock = (product.stock ?? 0) - currentInCart;

    if (quantity > availableStock) {
      alert(`Only ${availableStock} more available. You already have ${currentInCart} in your cart.`);
      return;
    }

    addToCart({
      productId: product.id,
      product,
      size: selectedSize,
      quantity
    });

    alert('Added to cart!');
  };

  const shareUrl = `${window.location.origin}/product/${product.id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} - ₹${product.price} on 55th Street!`,
          url: shareUrl,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link Copied!", description: "Product link copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images & 3D View */}
          <div className="space-y-4">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="images">Product Images</TabsTrigger>
                <TabsTrigger value="3d" className="flex items-center gap-2">
                  <Box className="h-4 w-4" />
                  3D View
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {product.images[selectedImageIndex] ? (
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>
                
                {product.images.length > 1 && (
                  <div className="flex space-x-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-20 h-20 rounded border-2 overflow-hidden ${
                          selectedImageIndex === index ? 'border-black' : 'border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="3d">
                <Card className="overflow-hidden border-2 border-primary/20">
                  <CardContent className="p-0">
                    <Product3DViewer 
                      category={product.category} 
                      productImage={product.images[0]}
                    />
                  </CardContent>
                </Card>
                <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-center font-medium flex items-center justify-center gap-2">
                    <Box className="h-4 w-4" />
                    Drag to rotate • Scroll to zoom • Interactive 3D model with product texture
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleCopyLink} title="Copy Link">
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare} title="Share Product">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-2xl font-bold">₹{product.price}</p>
              <span className="inline-block bg-muted text-muted-foreground px-3 py-1 rounded text-sm mt-2">
                {product.category}
              </span>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="min-w-[3rem]"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(quantity + 1, product.stock ?? 1))}
                  disabled={quantity >= (product.stock ?? 0)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stock Info */}
            {product && (
              <div className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {isOutOfStock ? '❌ Out of Stock' : `✅ ${product.stock} in stock`}
              </div>
            )}

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-black text-white hover:bg-gray-800 py-3 text-lg"
              disabled={!selectedSize || isOutOfStock}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <ProductRecommendations currentProductId={id} showPersonalized={true} showTrending={true} limit={4} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
