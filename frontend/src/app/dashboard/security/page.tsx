'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SecurityPage() {
  const securityChecks = [
    { id: 1, name: 'Firewall Status', status: 'active', description: 'Windows Defender Firewall is active' },
    { id: 2, name: 'Antivirus Protection', status: 'active', description: 'Real-time protection enabled' },
    { id: 3, name: 'System Updates', status: 'warning', description: '3 updates pending installation' },
    { id: 4, name: 'Password Policy', status: 'active', description: 'Strong password requirements enabled' },
    { id: 5, name: 'SSH Access', status: 'inactive', description: 'SSH server not running' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Security</h1>
        <p className="mt-2 text-gray-600">Monitor security status and vulnerabilities</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center text-green-900">
              <Shield className="mr-2 h-5 w-5" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-900">85/100</div>
            <p className="text-sm text-green-700 mt-2">Good security posture</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-900">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-900">3</div>
            <p className="text-sm text-orange-700 mt-2">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Lock className="mr-2 h-5 w-5" />
              Last Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">2 hours ago</div>
            <p className="text-sm text-blue-700 mt-2">No threats detected</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-600" />
            Security Status
          </CardTitle>
          <CardDescription>System security checks and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityChecks.map((check) => (
              <div key={check.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  {check.status === 'active' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : check.status === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{check.name}</p>
                    <p className="text-sm text-gray-600">{check.description}</p>
                  </div>
                </div>
                <Badge 
                  variant={check.status === 'active' ? 'default' : check.status === 'warning' ? 'secondary' : 'outline'}
                  className={
                    check.status === 'active' ? 'bg-green-600' : 
                    check.status === 'warning' ? 'bg-orange-600' : 
                    'bg-gray-400'
                  }
                >
                  {check.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5 text-purple-600" />
            Authentication & Access
          </CardTitle>
          <CardDescription>User authentication and access control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Additional security for login</p>
              </div>
              <Badge className="bg-green-600">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Failed Login Attempts</p>
                <p className="text-sm text-gray-600">Last 24 hours</p>
              </div>
              <span className="font-semibold text-gray-900">0</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Active Sessions</p>
                <p className="text-sm text-gray-600">Currently logged in</p>
              </div>
              <span className="font-semibold text-gray-900">1</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
