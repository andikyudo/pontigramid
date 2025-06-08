'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import VisitorAnalytics from './VisitorAnalytics';
import {
  LayoutDashboard,
  FileText,
  Tags,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Globe,
  MessageSquare,
  Image,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Overview dan statistik'
  },
  {
    name: 'Berita',
    href: '/admin/news',
    icon: FileText,
    description: 'Kelola artikel berita'
  },
  {
    name: 'Kategori',
    href: '/admin/categories',
    icon: Tags,
    description: 'Kelola kategori berita'
  },
  {
    name: 'Media',
    href: '/admin/media',
    icon: Image,
    description: 'Kelola gambar dan file'
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Statistik dan laporan'
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'Kelola pengguna'
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: MessageSquare,
    description: 'Kelola konten khusus'
  },
  {
    name: 'Activity',
    href: '/admin/activity',
    icon: Activity,
    description: 'Log aktivitas'
  },
  {
    name: 'Footer',
    href: '/admin/footer',
    icon: Settings,
    description: 'Kelola footer website'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Pengaturan sistem'
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string; role: string } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Get user info from session storage or API
    const storedUser = sessionStorage.getItem('admin-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutMessage('Logging out...');

    // Always clear local session data first (fallback behavior)
    const clearLocalSession = () => {
      try {
        sessionStorage.removeItem('admin-user');
        setUser(null);
      } catch (error) {
        console.error('Error clearing session storage:', error);
      }
    };

    try {
      // Attempt to call logout API
      setLogoutMessage('Clearing server session...');
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        console.log('Server logout successful');
        setLogoutMessage('Logout successful!');
      } else {
        console.warn('Server logout failed, but continuing with local logout');
        setLogoutMessage('Completing logout...');
      }
    } catch (error) {
      console.warn('Logout API call failed, but continuing with local logout:', error);
      setLogoutMessage('Completing logout...');
      // Don't throw error - we'll still proceed with local logout
    }

    // Always clear local session and redirect (regardless of API success/failure)
    clearLocalSession();

    try {
      // Small delay to show success message
      setTimeout(() => {
        setLogoutMessage('Redirecting...');
        router.push('/admin/login');
      }, 500);
    } catch (error) {
      console.error('Redirect error:', error);
      // Fallback: reload page to login
      window.location.href = '/admin/login';
    }

    // Reset after delay
    setTimeout(() => {
      setLoggingOut(false);
      setLogoutMessage('');
    }, 1000);
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center space-x-3">
              <div className="relative p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <Globe className="h-5 w-5 text-white" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    active ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Visitor Analytics */}
          <div className="px-4 pb-4">
            <VisitorAnalytics />
          </div>

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'admin@pontigramid.com'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 hover:text-gray-900"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {loggingOut ? (logoutMessage || 'Logging out...') : 'Logout'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:flex lg:flex-col lg:min-w-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Search */}
              <div className="hidden sm:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari berita, kategori..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              {/* Quick actions */}
              <Link href="/admin/news/create">
                <Button size="sm" className="hidden sm:inline-flex">
                  <FileText className="mr-2 h-4 w-4" />
                  Buat Berita
                </Button>
              </Link>

              <Link href="/" target="_blank">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Lihat Website
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
