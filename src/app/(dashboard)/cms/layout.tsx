'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarItem {
  title: string;
  href: string;
  icon: keyof typeof Icons;
  badge?: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/cms',
    icon: 'dashboard'
  },
  {
    title: 'Content Management',
    href: '/cms/content',
    icon: 'fileText',
    children: [
      { title: 'Pages', href: '/cms/content/pages', icon: 'file' },
      { title: 'Banners', href: '/cms/content/banners', icon: 'image' },
      { title: 'SEO Settings', href: '/cms/content/seo', icon: 'search' }
    ]
  },
  {
    title: 'Product Management',
    href: '/cms/products',
    icon: 'package',
    children: [
      { title: 'All Products', href: '/cms/products', icon: 'package' },
      { title: 'Categories', href: '/cms/products/categories', icon: 'folder' },
      { title: 'Health Attributes', href: '/cms/products/health-attributes', icon: 'heart' },
      { title: 'Ingredients', href: '/cms/products/ingredients', icon: 'leaf' },
      { title: 'Nutrition Info', href: '/cms/products/nutrition', icon: 'activity' },
      { title: 'Allergens', href: '/cms/products/allergens', icon: 'alertTriangle' }
    ]
  },
  {
    title: 'Media Library',
    href: '/cms/media',
    icon: 'image'
  },
  {
    title: 'User Management',
    href: '/cms/users',
    icon: 'users'
  },
  {
    title: 'Analytics',
    href: '/cms/analytics',
    icon: 'barChart'
  },
  {
    title: 'Settings',
    href: '/cms/settings',
    icon: 'settings',
    children: [
      { title: 'General', href: '/cms/settings/general', icon: 'settings' },
      { title: 'Appearance', href: '/cms/settings/appearance', icon: 'palette' },
      { title: 'Languages', href: '/cms/settings/languages', icon: 'globe' },
      { title: 'Backup', href: '/cms/settings/backup', icon: 'download' }
    ]
  }
];

interface CmsLayoutProps {
  children: React.ReactNode;
}

export default function CmsLayout({ children }: CmsLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = Icons[item.icon];

    return (
      <div key={item.title} className={cn('', level > 0 && 'ml-4')}>
        <div className="flex items-center justify-between group">
          <Link
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary flex-1"
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Link>
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(item.title)}
              className="h-8 w-8 p-0"
            >
              <Icons.chevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
            </Button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-1">
            {item.children?.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/cms" className="flex items-center gap-2 font-semibold">
          <Icons.cake className="h-6 w-6" />
          <span>Jazila CMS</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <Icons.lightbulb className="h-5 w-5 text-yellow-500" />
          <div className="flex-1">
            <p className="text-sm font-medium">Quick Tip</p>
            <p className="text-xs text-muted-foreground">Use auto-save to protect your work</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <SidebarContent />
      </div>
      
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Sidebar Trigger */}
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Icons.menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
            <div className="relative">
              <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products, content..."
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3 rounded-lg border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.png" alt="@admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Icons.user className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icons.settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icons.logOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}