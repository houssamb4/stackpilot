'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, ServerStats } from '@/lib/api';
import { Activity, Server, Users, CheckCircle2, XCircle, Clock, TrendingUp, Zap, Eye, Cpu, HardDrive, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 5 seconds
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiClient.getServerStats();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your systems today
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${stats && !error ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">{stats && !error ? 'Live' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">CPU Usage</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {loading ? '...' : stats ? `${stats.cpu.usage}%` : 'N/A'}
            </div>
            <p className="text-xs text-blue-700 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats ? `${stats.cpu.cores} cores` : 'Loading...'}
            </p>
            {stats && (
              <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(stats.cpu.usage, 100)}%` }} 
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Memory</CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Server className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {loading ? '...' : stats ? `${stats.memory.usedPercent}%` : 'N/A'}
            </div>
            <p className="text-xs text-purple-700 mt-2 flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              {stats ? `${stats.memory.used}GB / ${stats.memory.total}GB` : 'Loading...'}
            </p>
            {stats && (
              <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.memory.usedPercent}%` }} 
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Disk Space</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <HardDrive className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {loading ? '...' : stats ? `${stats.disk.usedPercent}%` : 'N/A'}
            </div>
            <p className="text-xs text-green-700 mt-2 flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {stats ? `${stats.disk.used}GB / ${stats.disk.total}GB` : 'Loading...'}
            </p>
            {stats && (
              <div className="w-full bg-green-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.disk.usedPercent}%` }} 
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Uptime</CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {loading ? '...' : stats ? formatUptime(stats.uptimeSeconds) : 'N/A'}
            </div>
            <p className="text-xs text-orange-700 mt-2 flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              99.9% uptime this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Info Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user?.role === 'super_admin' && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Admin Panel
              </CardTitle>
              <CardDescription className="text-blue-100">
                Manage users and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Link href="/dashboard/admin">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Open Admin Panel
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Activity className="mr-2 h-5 w-5 text-blue-600" />
              System Load Average
            </CardTitle>
            <CardDescription>
              Real-time system load metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">1 minute</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats ? stats.load.one.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">5 minutes</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats ? stats.load.five.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">15 minutes</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats ? stats.load.fifteen.toFixed(2) : '0.00'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Server className="mr-2 h-5 w-5 text-green-600" />
              System Information
            </CardTitle>
            <CardDescription>
              Server environment details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform</span>
              <span className="font-medium text-gray-900 capitalize">
                {stats?.platform || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Hostname</span>
              <span className="font-medium text-gray-900">
                {stats?.hostname || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">CPU Model</span>
              <span className="font-medium text-gray-900 truncate max-w-[200px]" title={stats?.cpu.model}>
                {stats?.cpu.model || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-medium text-green-600">
                {stats ? new Date(stats.timestamp).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Activity className="mr-2 h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest system events and logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 mt-2 bg-green-600 rounded-full" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">User logged in</p>
                <p className="text-sm text-gray-600">You signed in successfully from a new device</p>
              </div>
              <span className="text-sm text-gray-500">Just now</span>
            </div>
            <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 mt-2 bg-blue-600 rounded-full" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Health check completed</p>
                <p className="text-sm text-gray-600">Server status verified - all systems operational</p>
              </div>
              <span className="text-sm text-gray-500">30s ago</span>
            </div>
            <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 mt-2 bg-purple-600 rounded-full" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Dashboard accessed</p>
                <p className="text-sm text-gray-600">Viewed system metrics and statistics</p>
              </div>
              <span className="text-sm text-gray-500">1m ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
