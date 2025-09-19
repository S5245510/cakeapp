'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Package,
  Image,
  FileText,
  Settings,
  Menu,
  Home,
  ShoppingCart,
  Users,
  BarChart3,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    key: 'dashboard'
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
    key: 'products'
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    key: 'orders'
  },
  {
    title: 'Content',
    href: '/admin/content',
    icon: FileText,
    key: 'content'
  },
  {
    title: 'Media',
    href: '/admin/media',
    icon: Image,
    key: 'media'
  },
  {
    title: 'Design',
    href: '/admin/design',
    icon: Palette,
    key: 'design'
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
    key: 'customers'
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    key: 'analytics'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    key: 'settings'
  }
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

function Sidebar({ className }: { className?: string }) {
  const t = useTranslations('admin');
  const pathname = usePathname();

  return (
    <div className={cn('flex h-full flex-col bg-white border-r', className)}>
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">🧁</span>
          </div>
          <span>Cake Admin</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="sm" className="fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-gray-900">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Link>
            </Button>
            <LanguageSwitcher />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}