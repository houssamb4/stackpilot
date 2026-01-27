'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function LogsPage() {
  const logs = [
    { id: 1, timestamp: '2026-01-27 15:45:23', level: 'INFO', message: 'Server started successfully', source: 'system' },
    { id: 2, timestamp: '2026-01-27 15:45:45', level: 'INFO', message: 'Database connection established', source: 'database' },
    { id: 3, timestamp: '2026-01-27 15:46:12', level: 'WARNING', message: 'High memory usage detected', source: 'monitor' },
    { id: 4, timestamp: '2026-01-27 15:47:03', level: 'ERROR', message: 'API request timeout', source: 'api' },
    { id: 5, timestamp: '2026-01-27 15:48:15', level: 'INFO', message: 'Backup job completed', source: 'backup' },
    { id: 6, timestamp: '2026-01-27 15:49:22', level: 'INFO', message: 'User authentication successful', source: 'auth' },
    { id: 7, timestamp: '2026-01-27 15:50:11', level: 'WARNING', message: 'Cache miss rate above threshold', source: 'cache' },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-600 bg-red-50';
      case 'WARNING': return 'text-orange-600 bg-orange-50';
      case 'INFO': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
        <p className="mt-2 text-gray-600">View and search system logs</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search logs..." 
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors font-mono text-sm">
                <span className="text-gray-500">{log.timestamp}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelColor(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-gray-400">[{log.source}]</span>
                <span className="text-gray-900 flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
