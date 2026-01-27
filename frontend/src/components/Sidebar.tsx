'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Server, 
  Settings, 
  Cpu,
  HardDrive,
  Network,
  Shield,
  Bell,
  FileText,
  LogOut,
  Moon,
  Sun,
  Cog
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useState } from 'react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      label: 'Servers',
      icon: Server,
      href: '/dashboard/servers',
    },
    {
      label: 'Services',
      icon: Cog,
      href: '/dashboard/services',
    },
    {
      label: 'CPU & Memory',
      icon: Cpu,
      href: '/dashboard/metrics',
    },
    {
      label: 'Disk & Storage',
      icon: HardDrive,
      href: '/dashboard/storage',
    },
    {
      label: 'Network',
      icon: Network,
      href: '/dashboard/network',
    },
    {
      label: 'Alerts',
      icon: Bell,
      href: '/dashboard/alerts',
    },
    {
      label: 'Logs',
      icon: FileText,
      href: '/dashboard/logs',
    },
    {
      label: 'Security',
      icon: Shield,
      href: '/dashboard/security',
    },
  ];

  const adminRoutes = [
    {
      label: 'User Management',
      icon: Users,
      href: '/dashboard/admin',
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('flex flex-col h-full bg-white border-r border-gray-200', className)}>
      {/* Logo Section */}
      <div className="px-6 py-5 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg">
            <Server className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">StackPilot</h1>
            <p className="text-xs text-gray-500">Server Monitor</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative',
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-r-full" />
              )}
              <Icon 
                className={cn(
                  'h-5 w-5 mr-3 transition-colors',
                  isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                )} 
              />
              <span>{route.label}</span>
            </Link>
          );
        })}

        {/* Admin Section */}
        {user?.role === 'super_admin' && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Administration
              </p>
            </div>
            {adminRoutes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative',
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-r-full" />
                  )}
                  <Icon 
                    className={cn(
                      'h-5 w-5 mr-3 transition-colors',
                      isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                    )} 
                  />
                  <span>{route.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 px-3 py-4 space-y-3">
        {/* User Profile */}
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-green-400 to-green-600">
            <AvatarFallback className="bg-transparent text-white font-semibold text-sm">
              {user ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize">
              {user?.role === 'super_admin' ? 'Super Admin' : user?.role || 'User'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <Link
            href="/dashboard/settings"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>

          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
