
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/useStore';
import { Upload, QrCode, Trash2 } from 'lucide-react';

const QRCodeManagement = () => {
  const { paymentQRImage, setPaymentQRImage } = useStore();
  const [qrPreview, setQrPreview] = useState<string | null>(paymentQRImage);

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setQrPreview(result);
        setPaymentQRImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveQR = () => {
    setQrPreview(null);
    setPaymentQRImage('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>Payment QR Code Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="qr-upload">Upload Payment QR Code</Label>
            <p className="text-sm text-gray-600 mb-4">
              Upload the QR code image that customers will see during checkout for payments.
            </p>
            
            {!qrPreview ? (
              <div className="flex items-center justify-center w-full">
                <label htmlFor="qr-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> QR code image
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                  <input 
                    id="qr-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleQRUpload}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <img 
                    src={qrPreview} 
                    alt="Payment QR Code" 
                    className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <label htmlFor="qr-upload-replace" className="flex-1">
                    <Button variant="outline" className="w-full" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Replace QR Code
                      </span>
                    </Button>
                    <input 
                      id="qr-upload-replace" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleQRUpload}
                    />
                  </label>
                  
                  <Button 
                    variant="destructive" 
                    onClick={handleRemoveQR}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove QR Code
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload your payment QR code image (UPI, Bank transfer, etc.)</li>
              <li>• Customers will see this QR code during checkout</li>
              <li>• They can scan and pay using their preferred payment app</li>
              <li>• They can then upload payment proof to complete their order</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeManagement;
