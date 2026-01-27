'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ServersPage() {
  const servers = [
    { id: 1, name: 'Web Server 01', status: 'online', cpu: 45, memory: 62, uptime: '15d 4h' },
    { id: 2, name: 'Database Server', status: 'online', cpu: 78, memory: 85, uptime: '30d 12h' },
    { id: 3, name: 'API Server 01', status: 'online', cpu: 34, memory: 48, uptime: '7d 18h' },
    { id: 4, name: 'Cache Server', status: 'warning', cpu: 89, memory: 92, uptime: '45d 6h' },
    { id: 5, name: 'Backup Server', status: 'offline', cpu: 0, memory: 0, uptime: '0h' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Servers</h1>
        <p className="mt-2 text-gray-600">Monitor and manage your server infrastructure</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {servers.map((server) => (
          <Card key={server.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{server.name}</CardTitle>
                </div>
                <Badge 
                  variant={server.status === 'online' ? 'default' : server.status === 'warning' ? 'secondary' : 'destructive'}
                  className={
                    server.status === 'online' ? 'bg-green-600' : 
                    server.status === 'warning' ? 'bg-orange-600' : 
                    'bg-red-600'
                  }
                >
                  {server.status === 'online' ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {server.status}
                </Badge>
              </div>
              <CardDescription>Uptime: {server.uptime}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">CPU Usage</span>
                  <span className="font-semibold">{server.cpu}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      server.cpu > 80 ? 'bg-red-500' : server.cpu > 60 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${server.cpu}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Memory Usage</span>
                  <span className="font-semibold">{server.memory}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      server.memory > 80 ? 'bg-red-500' : server.memory > 60 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${server.memory}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
