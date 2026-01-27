'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AlertsPage() {
  const alerts = [
    { id: 1, type: 'critical', message: 'Database Server CPU usage above 90%', time: '2 minutes ago', icon: AlertCircle },
    { id: 2, type: 'warning', message: 'Cache Server memory usage high', time: '15 minutes ago', icon: AlertTriangle },
    { id: 3, type: 'info', message: 'Backup completed successfully', time: '1 hour ago', icon: Info },
    { id: 4, type: 'warning', message: 'API response time increased', time: '2 hours ago', icon: AlertTriangle },
    { id: 5, type: 'info', message: 'System update available', time: '5 hours ago', icon: Info },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          <p className="mt-2 text-gray-600">System notifications and alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="destructive" className="bg-red-600">2 Critical</Badge>
          <Badge variant="secondary" className="bg-orange-600">2 Warnings</Badge>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <Card key={alert.id} className={`border-2 ${getAlertColor(alert.type)}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Icon className="h-6 w-6 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <span className="text-sm text-gray-500">{alert.time}</span>
                    </div>
                    <Badge className="mt-2" variant="outline">
                      {alert.type.toUpperCase()}
                    </Badge>
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
