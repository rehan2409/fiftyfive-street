
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const [secretPassword, setSecretPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAdmin } = useStore();
  const navigate = useNavigate();

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (secretPassword === 'Adnaan@fiftyfive2025') {
        setIsAdmin(true);
        navigate('/admin/dashboard');
      } else {
        alert('Invalid secret password');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <p className="text-gray-600">Enter secret password to access admin dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSecretSubmit} className="space-y-4">
            <div>
              <label htmlFor="secret" className="block text-sm font-medium mb-1">
                Secret Password
              </label>
              <Input
                id="secret"
                type="password"
                value={secretPassword}
                onChange={(e) => setSecretPassword(e.target.value)}
                placeholder="Enter secret password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-red-600 text-white hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
