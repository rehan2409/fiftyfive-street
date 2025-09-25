
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.3)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl animate-scale-in">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">Admin Portal</CardTitle>
          <p className="text-gray-300">Secure access to dashboard control</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSecretSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="secret" className="block text-sm font-medium text-gray-200">
                Authorization Code
              </label>
              <Input
                id="secret"
                type="password"
                value={secretPassword}
                onChange={(e) => setSecretPassword(e.target.value)}
                placeholder="Enter secure access code"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access Admin Dashboard'
              )}
            </Button>
          </form>
          
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400">
              Authorized personnel only • Secure access required
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
