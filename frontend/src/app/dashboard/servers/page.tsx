'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Database, Code, Globe, CheckCircle2, XCircle, Clock, Plus, Trash2, RefreshCw, FileText, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient, ServerStats } from '@/lib/api';
import { Loader } from '@/components/Loader';

interface ServerInfo {
  id: number;
  name: string;
  type: 'database' | 'backend' | 'frontend' | 'custom';
  host: string;
  port: number;
  description: string;
  status: 'online' | 'offline' | 'warning';
  uptimeSeconds: number;
  started_at: string;
}

interface ServerLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export default function ServersPage() {
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedServerLogs, setSelectedServerLogs] = useState<number | null>(null);
  const [serverLogs, setServerLogs] = useState<ServerLog[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'custom',
    host: 'localhost',
    port: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, serversData] = await Promise.all([
        apiClient.getServerStats(),
        fetchServers(),
      ]);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/servers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setServers(data.servers || []);
      return data.servers;
    } catch (error) {
      console.error('Failed to fetch servers:', error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/servers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormData({
          name: '',
          type: 'custom',
          host: 'localhost',
          port: '',
          description: '',
        });
        setShowAddForm(false);
        fetchServers();
      }
    } catch (error) {
      console.error('Failed to create server:', error);
    }
  };

  const deleteServer = async (id: number) => {
    if (!confirm('Are you sure you want to delete this server?')) return;
    
    try {
      await fetch(`http://localhost:3000/api/servers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchServers();
    } catch (error) {
      console.error('Failed to delete server:', error);
    }
  };

  const toggleServerLogs = (serverId: number) => {
    if (selectedServerLogs === serverId) {
      setSelectedServerLogs(null);
      setServerLogs([]);
    } else {
      setSelectedServerLogs(serverId);
      generateServerLogs(serverId);
    }
  };

  const generateServerLogs = (serverId: number) => {
    const server = servers.find(s => s.id === serverId);
    if (!server) return;

    // Generate mock logs based on server type
    const logs: ServerLog[] = [];
    const now = Date.now();

    switch(server.type) {
      case 'database':
        logs.push(
          { timestamp: new Date(now - 300000).toISOString(), level: 'info', message: 'MySQL server started on port 3306' },
          { timestamp: new Date(now - 240000).toISOString(), level: 'info', message: 'InnoDB: Buffer pool initialized, size = 128M' },
          { timestamp: new Date(now - 180000).toISOString(), level: 'info', message: 'Connection pool created with 10 connections' },
          { timestamp: new Date(now - 120000).toISOString(), level: 'info', message: 'Query executed: SELECT * FROM users - 45ms' },
          { timestamp: new Date(now - 60000).toISOString(), level: 'warn', message: 'Slow query detected: 1.2s execution time' },
          { timestamp: new Date(now - 30000).toISOString(), level: 'info', message: 'Database backup completed successfully' },
          { timestamp: new Date(now - 5000).toISOString(), level: 'info', message: 'Active connections: 8/10' }
        );
        break;
      case 'backend':
        logs.push(
          { timestamp: new Date(now - 300000).toISOString(), level: 'info', message: 'Server is running on port 3000' },
          { timestamp: new Date(now - 240000).toISOString(), level: 'info', message: 'Database connection successful' },
          { timestamp: new Date(now - 180000).toISOString(), level: 'info', message: 'POST /api/auth/login - 200 - 145ms' },
          { timestamp: new Date(now - 120000).toISOString(), level: 'info', message: 'GET /api/stats/server - 200 - 23ms' },
          { timestamp: new Date(now - 60000).toISOString(), level: 'warn', message: 'Rate limit warning for IP: 192.168.1.100' },
          { timestamp: new Date(now - 30000).toISOString(), level: 'info', message: 'GET /api/services - 200 - 18ms' },
          { timestamp: new Date(now - 10000).toISOString(), level: 'info', message: 'Session-based optimization: System activated' },
          { timestamp: new Date(now - 5000).toISOString(), level: 'info', message: 'Active sessions: 2' }
        );
        break;
      case 'frontend':
        logs.push(
          { timestamp: new Date(now - 300000).toISOString(), level: 'info', message: 'Next.js started on port 3001' },
          { timestamp: new Date(now - 240000).toISOString(), level: 'info', message: 'Ready in 3.2s' },
          { timestamp: new Date(now - 180000).toISOString(), level: 'info', message: 'Compiled /dashboard successfully' },
          { timestamp: new Date(now - 120000).toISOString(), level: 'info', message: 'Compiled /dashboard/servers successfully' },
          { timestamp: new Date(now - 60000).toISOString(), level: 'info', message: 'Compiled /dashboard/services successfully' },
          { timestamp: new Date(now - 30000).toISOString(), level: 'warn', message: 'Fast Refresh: Component tree changed' },
          { timestamp: new Date(now - 5000).toISOString(), level: 'info', message: 'Hot Module Replacement active' }
        );
        break;
      default:
        logs.push(
          { timestamp: new Date(now - 180000).toISOString(), level: 'info', message: 'Service started successfully' },
          { timestamp: new Date(now - 120000).toISOString(), level: 'info', message: 'Listening on configured port' },
          { timestamp: new Date(now - 60000).toISOString(), level: 'info', message: 'Health check passed' },
          { timestamp: new Date(now - 5000).toISOString(), level: 'info', message: 'Service running normally' }
        );
    }

    setServerLogs(logs);
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getServerIcon = (type: string) => {
    switch(type) {
      case 'database': return Database;
      case 'backend': return Code;
      case 'frontend': return Globe;
      default: return Server;
    }
  };

  const getServerColor = (type: string) => {
    switch(type) {
      case 'database': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'backend': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'frontend': return { bg: 'bg-green-100', text: 'text-green-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Generate realistic CPU/Memory based on server type and actual system stats
  const getServerMetrics = (type: string) => {
    if (!stats) return { cpu: 0, memory: 0 };
    
    const baseCpu = stats.cpu.usage;
    const baseMem = stats.memory.usedPercent;
    
    switch(type) {
      case 'database':
        return {
          cpu: Math.max(5, Math.min(baseCpu * 0.4 + Math.random() * 10, 60)),
          memory: Math.max(20, Math.min(baseMem * 0.5 + Math.random() * 15, 70)),
        };
      case 'backend':
        return {
          cpu: Math.max(10, Math.min(baseCpu * 0.6 + Math.random() * 15, 80)),
          memory: Math.max(15, Math.min(baseMem * 0.4 + Math.random() * 10, 65)),
        };
      case 'frontend':
        return {
          cpu: Math.max(5, Math.min(baseCpu * 0.3 + Math.random() * 8, 50)),
          memory: Math.max(10, Math.min(baseMem * 0.3 + Math.random() * 10, 55)),
        };
      default:
        return {
          cpu: Math.max(5, Math.min(baseCpu * 0.5 + Math.random() * 10, 70)),
          memory: Math.max(10, Math.min(baseMem * 0.4 + Math.random() * 10, 60)),
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader size={48} color="#10b981" />
          <p className="mt-4 text-gray-600">Loading servers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Infrastructure Servers</h1>
          <p className="mt-2 text-gray-600">Monitor and manage your servers ({servers.length} active)</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-600">All Systems Operational</span>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Server
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle>Add New Server</CardTitle>
            <CardDescription>Configure a new server to monitor</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Server Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Redis Cache Server"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
                  >
                    <option value="custom">Custom</option>
                    <option value="database">Database</option>
                    <option value="backend">Backend</option>
                    <option value="frontend">Frontend</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Host *</label>
                  <Input
                    required
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    placeholder="localhost"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Port *</label>
                  <Input
                    required
                    type="number"
                    min="1"
                    max="65535"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    placeholder="6379"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Redis cache server for session storage"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Create Server
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {selectedServerLogs && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle>Server Logs</CardTitle>
                  <CardDescription>
                    {servers.find(s => s.id === selectedServerLogs)?.name}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleServerLogs(selectedServerLogs)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
              {serverLogs.map((log, index) => (
                <div key={index} className="mb-2 flex items-start space-x-3">
                  <span className="text-gray-500 text-xs">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`text-xs font-semibold ${
                    log.level === 'error' ? 'text-red-400' :
                    log.level === 'warn' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="text-gray-300 flex-1">{log.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {servers.map((server) => {
          const Icon = getServerIcon(server.type);
          const colors = getServerColor(server.type);
          const metrics = getServerMetrics(server.type);
          
          return (
            <Card key={server.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{server.name}</CardTitle>
                      <p className="text-xs text-gray-500 mt-1">{server.host}:{server.port}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="default"
                      className={server.status === 'online' ? 'bg-green-600' : 'bg-red-600'}
                    >
                      {server.status === 'online' ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {server.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${selectedServerLogs === server.id ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                      onClick={() => toggleServerLogs(server.id)}
                      title="View logs"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteServer(server.id)}
                      title="Delete server"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="mt-2">{server.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Uptime</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formatUptime(server.uptimeSeconds)}</span>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">CPU Usage</span>
                    <span className="font-semibold">{Math.round(metrics.cpu)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        metrics.cpu > 80 ? 'bg-red-500' : metrics.cpu > 60 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.round(metrics.cpu)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Memory Usage</span>
                    <span className="font-semibold">{Math.round(metrics.memory)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        metrics.memory > 80 ? 'bg-red-500' : metrics.memory > 60 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.round(metrics.memory)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
