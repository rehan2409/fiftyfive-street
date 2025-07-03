
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/useStore';
import { Upload, X } from 'lucide-react';

const QRCodeManagement = () => {
  const { paymentQRImage, setPaymentQRImage } = useStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreviewUrl(result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file');
      }
    }
  };

  const handleUpload = () => {
    if (previewUrl) {
      setPaymentQRImage(previewUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
      alert('QR Code uploaded successfully!');
    }
  };

  const handleRemove = () => {
    setPaymentQRImage('');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment QR Code Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload Payment QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="qr-upload">Select QR Code Image</Label>
            <Input
              id="qr-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="mt-1"
            />
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <Label>Preview:</Label>
              <div className="relative inline-block">
                <img 
                  src={previewUrl} 
                  alt="QR Code Preview" 
                  className="w-48 h-48 object-contain border rounded-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemovePreview}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload QR Code
                </Button>
                <Button variant="outline" onClick={handleRemovePreview}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {paymentQRImage && (
        <Card>
          <CardHeader>
            <CardTitle>Current Payment QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src={paymentQRImage} 
                  alt="Current Payment QR Code" 
                  className="w-64 h-64 object-contain border rounded-lg"
                />
              </div>
              <div className="text-center">
                <Button variant="outline" onClick={handleRemove}>
                  Remove Current QR Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!paymentQRImage && !previewUrl && (
        <Card>
          <CardContent className="text-center py-8">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No payment QR code uploaded yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Upload a QR code image that customers will see during checkout
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRCodeManagement;
