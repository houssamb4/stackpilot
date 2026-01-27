'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, ServerStats } from '@/lib/api';
import { Activity, Server, Cpu, HardDrive, Clock, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { LoaderFullPage } from '@/components/Loader';

// Generate mock CPU history data
const generateCpuHistory = (currentCpu: number) => {
  const data = [];
  for (let i = 23; i >= 0; i--) {
    data.push({
      time: `${i}h ago`,
      cpu: Math.max(0, Math.min(100, currentCpu + (Math.random() - 0.5) * 20)),
      memory: Math.max(0, Math.min(100, currentCpu + (Math.random() - 0.5) * 15)),
    });
  }
  return data.reverse();
};

// Generate network traffic data
const generateNetworkData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    hour: `${i * 2}:00`,
    incoming: Math.floor(Math.random() * 500) + 200,
    outgoing: Math.floor(Math.random() * 300) + 100,
  }));
};

// Mock processes data
const mockProcesses = [
  { id: 1, name: 'node.exe', cpu: 12.5, memory: 245, status: 'running' },
  { id: 2, name: 'mysqld.exe', cpu: 8.3, memory: 512, status: 'running' },
  { id: 3, name: 'nginx.exe', cpu: 4.2, memory: 128, status: 'running' },
  { id: 4, name: 'redis-server.exe', cpu: 2.1, memory: 64, status: 'running' },
  { id: 5, name: 'chrome.exe', cpu: 15.7, memory: 892, status: 'running' },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [cpuHistory, setCpuHistory] = useState<any[]>([]);
  const [networkData] = useState(generateNetworkData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiClient.getServerStats();
      setStats(data);
      setCpuHistory(generateCpuHistory(data.cpu.usage));
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

  const resourceDistribution = stats ? [
    { name: 'CPU', value: stats.cpu.usage, color: '#3b82f6' },
    { name: 'Memory', value: stats.memory.usedPercent, color: '#8b5cf6' },
    { name: 'Disk', value: stats.disk.usedPercent, color: '#10b981' },
  ] : [];

  if (loading) {
    return <LoaderFullPage />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            System Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Real-time monitoring and analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${stats && !error ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
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

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">CPU Usage</CardTitle>
            <Cpu className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {loading ? '...' : stats ? `${stats.cpu.usage}%` : 'N/A'}
            </div>
            <p className="text-xs text-blue-700 mt-2">{stats ? `${stats.cpu.cores} cores` : 'Loading...'}</p>
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

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Memory</CardTitle>
            <Server className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {loading ? '...' : stats ? `${stats.memory.usedPercent}%` : 'N/A'}
            </div>
            <p className="text-xs text-purple-700 mt-2">{stats ? `${stats.memory.used}GB / ${stats.memory.total}GB` : 'Loading...'}</p>
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

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Disk Space</CardTitle>
            <HardDrive className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {loading ? '...' : stats ? `${stats.disk.usedPercent}%` : 'N/A'}
            </div>
            <p className="text-xs text-green-700 mt-2">{stats ? `${stats.disk.used}GB / ${stats.disk.total}GB` : 'Loading...'}</p>
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

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">System Status</CardTitle>
            <Activity className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-600 hover:bg-green-700">Healthy</Badge>
            </div>
            <p className="text-xs text-orange-700 mt-2">Uptime: {stats ? formatUptime(stats.uptimeSeconds) : 'N/A'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* CPU Usage Chart */}
        <Card className="border-0 shadow-lg col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              CPU & Memory Usage (24h)
            </CardTitle>
            <CardDescription>Real-time resource utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cpuHistory}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                <Area type="monotone" dataKey="memory" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMemory)" name="Memory %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Network Traffic Chart */}
        <Card className="border-0 shadow-lg col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-green-600" />
              Network Traffic
            </CardTitle>
            <CardDescription>Incoming vs Outgoing (MB/s)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="incoming" fill="#10b981" name="Incoming" radius={[8, 8, 0, 0]} />
                <Bar dataKey="outgoing" fill="#f59e0b" name="Outgoing" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
