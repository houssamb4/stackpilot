'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, ArrowUp, ArrowDown, Activity, Wifi, Cable, Gauge } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiClient } from '@/lib/api';
import { Loader } from '@/components/Loader';
import { Button } from '@/components/ui/button';

const networkData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  upload: Math.floor(Math.random() * 100) + 20,
  download: Math.floor(Math.random() * 150) + 50,
}));

interface NetworkInterface {
  iface: string;
  ifaceName: string;
  ip4: string;
  ip6: string;
  mac: string;
  internal: boolean;
  virtual: boolean;
  operstate: string;
  type: string;
  speed: number;
}

interface SpeedTestResult {
  download: number;
  upload: number;
  unit: string;
  timestamp: string;
}

export default function NetworkPage() {
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [speedTestRunning, setSpeedTestRunning] = useState(false);
  const [speedTestResult, setSpeedTestResult] = useState<SpeedTestResult | null>(null);

  useEffect(() => {
    fetchNetworkInterfaces();
    const interval = setInterval(fetchNetworkInterfaces, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNetworkInterfaces = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/metrics/network/interfaces', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setInterfaces(data.interfaces || []);
    } catch (error) {
      console.error('Failed to fetch network interfaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInterfaceIcon = (type: string, name: string) => {
    if (type === 'wireless' || name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('wifi')) {
      return <Wifi className="h-5 w-5 text-blue-600" />;
    }
    return <Cable className="h-5 w-5 text-green-600" />;
  };

  const getInterfaceType = (type: string, name: string) => {
    if (type === 'wireless' || name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('wifi')) {
      return 'Wi-Fi';
    }
    if (name.toLowerCase().includes('ethernet') || name.toLowerCase().includes('eth')) {
      return 'Ethernet';
    }
    return type || 'Network';
  };

  const isActive = (iface: NetworkInterface) => {
    return iface.operstate === 'up' && iface.ip4 && !iface.internal;
  };

  const runSpeedTest = async () => {
    setSpeedTestRunning(true);
    try {
      const response = await fetch('http://localhost:3000/api/metrics/network/speedtest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSpeedTestResult(data);
    } catch (error) {
      console.error('Failed to run speed test:', error);
    } finally {
      setSpeedTestRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network</h1>
          <p className="mt-2 text-gray-600">Monitor network traffic and connectivity</p>
        </div>
        <Button 
          onClick={runSpeedTest} 
          disabled={speedTestRunning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {speedTestRunning ? (
            <>
              <Loader size={16} color="#fff" />
              <span className="ml-2">Testing...</span>
            </>
          ) : (
            <>
              <Gauge className="mr-2 h-4 w-4" />
              Test Speed
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <ArrowUp className="mr-2 h-5 w-5" />
              Upload Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {speedTestResult ? `${speedTestResult.upload}` : '45.2'} Mbps
            </div>
            <p className="text-sm text-blue-700 mt-2">
              {speedTestResult ? 'Last test result' : 'Average speed'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center text-green-900">
              <ArrowDown className="mr-2 h-5 w-5" />
              Download Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {speedTestResult ? `${speedTestResult.download}` : '98.7'} Mbps
            </div>
            <p className="text-sm text-green-700 mt-2">
              {speedTestResult ? 'Last test result' : 'Average speed'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-900">
              <Activity className="mr-2 h-5 w-5" />
              Total Traffic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">2.4 TB</div>
            <p className="text-sm text-purple-700 mt-2">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Network className="mr-2 h-5 w-5 text-blue-600" />
            Network Traffic (24h)
          </CardTitle>
          <CardDescription>Upload and download speeds over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={networkData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="upload" stroke="#3b82f6" strokeWidth={2} name="Upload (Mbps)" />
              <Line type="monotone" dataKey="download" stroke="#10b981" strokeWidth={2} name="Download (Mbps)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Network Interfaces</CardTitle>
          <CardDescription>Active network connections with IP addresses</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader size={36} />
            </div>
          ) : interfaces.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No network interfaces found</p>
          ) : (
            <div className="space-y-3">
              {interfaces
                .filter(iface => !iface.internal) // Filter out loopback interfaces
                .map((iface, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      {getInterfaceIcon(iface.type, iface.ifaceName)}
                      <div>
                        <p className="font-medium text-gray-900">{getInterfaceType(iface.type, iface.ifaceName)}</p>
                        <p className="text-sm text-gray-600">{iface.ifaceName}</p>
                        {iface.ip4 && (
                          <p className="text-sm font-mono text-blue-600 mt-1">
                            IPv4: {iface.ip4}
                          </p>
                        )}
                        {iface.ip6 && (
                          <p className="text-xs font-mono text-gray-500 mt-0.5">
                            IPv6: {iface.ip6.substring(0, 30)}...
                          </p>
                        )}
                        {iface.mac && (
                          <p className="text-xs font-mono text-gray-400 mt-0.5">
                            MAC: {iface.mac}
                          </p>
                        )}
                        {iface.speed > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Speed: {iface.speed} Mbps
                          </p>
                        )}
                      </div>
                    </div>
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isActive(iface)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isActive(iface) ? 'Connected' : 'Inactive'}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
