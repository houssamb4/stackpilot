'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await register(email, password, name);
      setSuccess(response.message);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <Shield className="h-12 w-12 text-white" />
            <h1 className="text-4xl font-bold text-white">StackPilot</h1>
          </div>
          <p className="mt-4 text-purple-100 text-lg">
            Join our platform and start managing your systems efficiently
          </p>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">What you'll get:</h2>
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 rounded-full p-2 backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Full Dashboard Access</h3>
              <p className="text-purple-100 text-sm">Complete overview of your systems</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 rounded-full p-2 backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Real-time Analytics</h3>
              <p className="text-purple-100 text-sm">Monitor performance metrics instantly</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 rounded-full p-2 backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Secure Platform</h3>
              <p className="text-purple-100 text-sm">Enterprise-grade security standards</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl" />
      </div>

      {/* Right side - Register form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Shield className="h-10 w-10 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">StackPilot</h1>
            </div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
              <CardDescription className="text-center text-base">
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-3 rounded-lg flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{success}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 h-11"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      className="pl-10 h-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-11"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-11"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
                  disabled={loading}
                >
                  {loading ? (
                    'Creating account...'
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <p className="text-sm text-center text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                    Sign in here
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          <p className="mt-8 text-center text-xs text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
