'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Server, 
  Settings, 
  BarChart3,
  Shield,
  Bell,
  FileText,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'text-sky-500',
    },
    {
      label: 'Servers',
      icon: Server,
      href: '/dashboard/servers',
      color: 'text-violet-500',
    },
    {
      label: 'Metrics',
      icon: BarChart3,
      href: '/dashboard/metrics',
      color: 'text-pink-700',
    },
    {
      label: 'Alerts',
      icon: Bell,
      href: '/dashboard/alerts',
      color: 'text-orange-700',
    },
    {
      label: 'Logs',
      icon: FileText,
      href: '/dashboard/logs',
      color: 'text-green-600',
    },
  ];

  const adminRoutes = [
    {
      label: 'User Management',
      icon: Users,
      href: '/dashboard/admin',
      color: 'text-green-500',
      adminOnly: true,
    },
    {
      label: 'System Settings',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'text-gray-500',
    },
  ];

  return (
    <div className={cn('space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white', className)}>
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-10 w-10 mr-4">
            <Shield className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            StackPilot
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {user?.role === 'super_admin' && (
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Administration
          </h2>
          <div className="space-y-1">
            {adminRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                  pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400'
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white mb-1 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-zinc-400 truncate">
                {user?.email}
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                  {user?.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="ml-2 p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </buttosName="text-xs text-zinc-400">
            {user?.email}
          </p>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
              {user?.role.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
