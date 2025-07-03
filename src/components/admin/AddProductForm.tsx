
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/store/useStore';
import { X, Upload, Plus } from 'lucide-react';

const AddProductForm = () => {
  const { addProduct } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    images: [] as string[],
    sizes: [] as string[]
  });
  const [imageInput, setImageInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    const product = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category as 'Cargos' | 'Jackets' | 'T-Shirts',
      description: formData.description,
      price: parseFloat(formData.price),
      images: formData.images,
      sizes: formData.sizes as ('S' | 'M' | 'L' | 'XL' | 'XXL')[],
      createdAt: new Date().toISOString()
    };

    addProduct(product);
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      images: [],
      sizes: []
    });
    alert('Product added successfully!');
  };

  const handleImageAdd = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sizes: checked 
        ? [...prev.sizes, size]
        : prev.sizes.filter(s => s !== size)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cargos">Cargos</SelectItem>
                <SelectItem value="Jackets">Jackets</SelectItem>
                <SelectItem value="T-Shirts">T-Shirts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label>Product Images</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Enter image URL"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
              />
              <Button type="button" onClick={handleImageAdd}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm truncate">{image}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleImageRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Available Sizes</Label>
            <div className="flex space-x-4 mt-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={size}
                    checked={formData.sizes.includes(size)}
                    onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                  />
                  <Label htmlFor={size}>{size}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
