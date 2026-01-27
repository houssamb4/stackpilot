'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Mail, Lock, ArrowRight, Sparkles, Activity, Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-400/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-400/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">StackPilot</h1>
              <p className="text-emerald-100 text-sm font-medium">System Management Platform</p>
            </div>
          </div>
          <p className="mt-6 text-emerald-50 text-lg font-light leading-relaxed max-w-md">
            Enterprise-grade monitoring and management solution for modern infrastructure
          </p>
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl p-3 shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Real-time Monitoring</h3>
              <p className="text-emerald-100 text-sm mt-1">Live system metrics and performance tracking</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
            <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl p-3 shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Advanced Security</h3>
              <p className="text-emerald-100 text-sm mt-1">Enterprise-grade protection with rate limiting</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl p-3 shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">High Performance</h3>
              <p className="text-emerald-100 text-sm mt-1">Optimized for speed and reliability</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-emerald-100 text-sm">
          <p>© 2026 StackPilot. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-3 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">StackPilot</h1>
            <p className="text-gray-600 text-sm mt-1">System Management Platform</p>
          </div>

          <Card className="border border-gray-200 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
              <CardDescription className="text-base text-gray-600">
                Sign in to access your dashboard and monitor your systems
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg flex items-start space-x-3 shadow-sm">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Authentication Failed</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@stackpilot.com"
                      className="pl-10 h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Password
                    </Label>
                    <Link href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-12 h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs">This site is protected by rate limiting and advanced security measures</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
                <p className="text-sm text-center text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                    Create one now
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <Link href="#" className="text-emerald-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="#" className="text-emerald-600 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
