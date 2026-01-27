'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Trash2, Plus, Settings, FileText, RefreshCw } from 'lucide-react';
import { Loader } from '@/components/Loader';

interface Service {
  id: number;
  name: string;
  description: string;
  executable_path: string;
  arguments: string;
  working_directory: string;
  venv_path: string;
  status: 'stopped' | 'running' | 'failed';
  pid: number;
  last_started_at: string;
  last_stopped_at: string;
}

interface ServiceLog {
  id: number;
  service_id: number;
  log_type: 'stdout' | 'stderr' | 'system';
  message: string;
  timestamp: string;
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    executable_path: '',
    arguments: '',
    working_directory: '',
    venv_path: '',
  });

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchLogs(selectedService.id);
      const interval = setInterval(() => fetchLogs(selectedService.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedService]);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/services', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (serviceId: number) => {
    try {
      setLogsLoading(true);
      const response = await fetch(`http://localhost:3000/api/services/${serviceId}/logs?limit=200`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/services', {
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
          description: '',
          executable_path: '',
          arguments: '',
          working_directory: '',
          venv_path: '',
        });
        setShowAddForm(false);
        fetchServices();
      }
    } catch (error) {
      console.error('Failed to create service:', error);
    }
  };

  const startService = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/services/${id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchServices();
    } catch (error) {
      console.error('Failed to start service:', error);
    }
  };

  const stopService = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/services/${id}/stop`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchServices();
    } catch (error) {
      console.error('Failed to stop service:', error);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await fetch(`http://localhost:3000/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchServices();
      if (selectedService?.id === id) {
        setSelectedService(null);
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-green-600">Running</Badge>;
      case 'stopped':
        return <Badge variant="secondary">Stopped</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'stderr':
        return 'text-red-600';
      case 'system':
        return 'text-blue-600';
      default:
        return 'text-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="mt-2 text-gray-600">Manage and monitor your custom services</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle>Add New Service</CardTitle>
            <CardDescription>Configure a new service to manage from the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Application"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description of the service"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Executable Path *</label>
                <Input
                  required
                  value={formData.executable_path}
                  onChange={(e) => setFormData({ ...formData, executable_path: e.target.value })}
                  placeholder="C:\path\to\program.exe or node"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Arguments</label>
                <Input
                  value={formData.arguments}
                  onChange={(e) => setFormData({ ...formData, arguments: e.target.value })}
                  placeholder="script.js --port 8080"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Working Directory</label>
                <Input
                  value={formData.working_directory}
                  onChange={(e) => setFormData({ ...formData, working_directory: e.target.value })}
                  placeholder="C:\path\to\working\directory"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Virtual Environment Path (Optional)</label>
                <Input
                  value={formData.venv_path}
                  onChange={(e) => setFormData({ ...formData, venv_path: e.target.value })}
                  placeholder="C:\path\to\venv"
                />
                <p className="text-xs text-gray-500 mt-1">For Python services: path to venv folder (e.g., C:\Projects\myapp\venv)</p>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Create Service
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Services ({services.length})</h2>
          {services.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No services configured. Click "Add Service" to get started.
              </CardContent>
            </Card>
          ) : (
            services.map((service) => (
              <Card 
                key={service.id} 
                className={`border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all ${
                  selectedService?.id === service.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedService(service)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5 text-gray-600" />
                        <span>{service.name}</span>
                      </CardTitle>
                      <CardDescription className="mt-2">{service.description || 'No description'}</CardDescription>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600 truncate">
                      <span className="font-medium">Path:</span> {service.executable_path}
                    </p>
                    {service.pid && (
                      <p className="text-gray-600">
                        <span className="font-medium">PID:</span> {service.pid}
                      </p>
                    )}
                    {service.last_started_at && (
                      <p className="text-gray-600">
                        <span className="font-medium">Last started:</span>{' '}
                        {new Date(service.last_started_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    {service.status === 'running' ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          stopService(service.id);
                        }}
                      >
                        <Square className="mr-2 h-4 w-4" />
                        Stop
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          startService(service.id);
                        }}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(service);
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Logs
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteService(service.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {selectedService ? `Logs: ${selectedService.name}` : 'Service Logs'}
            </h2>
            {selectedService && (
              <Button size="sm" variant="outline" onClick={() => fetchLogs(selectedService.id)}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              {!selectedService ? (
                <div className="p-6 text-center text-gray-500">
                  Select a service to view logs
                </div>
              ) : logsLoading && logs.length === 0 ? (
                <div className="p-6 flex justify-center">
                  <Loader size={36} />
                </div>
              ) : logs.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No logs available. Start the service to see logs.
                </div>
              ) : (
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs max-h-[600px] overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="mb-1">
                      <span className="text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      {' '}
                      <span className={`font-semibold ${
                        log.log_type === 'stderr' ? 'text-red-400' :
                        log.log_type === 'system' ? 'text-blue-400' :
                        'text-green-400'
                      }`}>
                        [{log.log_type.toUpperCase()}]
                      </span>
                      {' '}
                      <span className="text-gray-200">{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
