'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HardDrive, Database, FolderOpen } from 'lucide-react';

export default function StoragePage() {
  const disks = [
    { id: 1, name: 'C: Drive (System)', total: 500, used: 345, free: 155, type: 'SSD' },
    { id: 2, name: 'D: Drive (Data)', total: 1000, used: 678, free: 322, type: 'HDD' },
    { id: 3, name: 'E: Drive (Backup)', total: 2000, used: 1234, free: 766, type: 'HDD' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Disk & Storage</h1>
        <p className="mt-2 text-gray-600">Monitor disk usage and storage capacity</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {disks.map((disk) => {
          const usedPercent = Math.round((disk.used / disk.total) * 100);
          return (
            <Card key={disk.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <HardDrive className="mr-2 h-5 w-5 text-blue-600" />
                    {disk.name}
                  </CardTitle>
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {disk.type}
                  </span>
                </div>
                <CardDescription>
                  {disk.used}GB used of {disk.total}GB
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Used Space</span>
                    <span className="font-semibold text-gray-900">{usedPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        usedPercent > 80 ? 'bg-red-500' : usedPercent > 60 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${usedPercent}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                  <div>
                    <p className="text-gray-600">Free</p>
                    <p className="font-semibold text-green-600">{disk.free}GB</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="font-semibold text-gray-900">{disk.total}GB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-purple-600" />
            Storage Details
          </CardTitle>
          <CardDescription>Detailed storage information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <FolderOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">System Files</p>
                  <p className="text-sm text-gray-600">Operating system and programs</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">124 GB</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <FolderOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Application Data</p>
                  <p className="text-sm text-gray-600">User files and data</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">456 GB</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <FolderOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Temporary Files</p>
                  <p className="text-sm text-gray-600">Cache and temporary data</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">23 GB</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
