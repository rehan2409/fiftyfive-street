
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const [step, setStep] = useState<'secret' | 'login'>('secret');
  const [secretPassword, setSecretPassword] = useState('');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setIsAdmin } = useStore();
  const navigate = useNavigate();

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretPassword === 'Adnaan@fiftyfive2025') {
      setStep('login');
    } else {
      alert('Invalid secret password');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple demo login - in production, this would validate against a database
    setTimeout(() => {
      if (loginData.email && loginData.password) {
        setIsAdmin(true);
        navigate('/admin/dashboard');
      } else {
        alert('Please enter valid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 'secret' ? 'Admin Access' : 'Admin Login'}
          </CardTitle>
          <p className="text-gray-600">
            {step === 'secret' ? 'Enter secret password to continue' : 'Sign in to admin dashboard'}
          </p>
        </CardHeader>
        <CardContent>
          {step === 'secret' ? (
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
              <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700">
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Admin Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  placeholder="Enter admin email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Enter password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 text-white hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
