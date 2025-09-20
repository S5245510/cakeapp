'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { CmsDashboardStats } from '@/types/cms';

// Mock data - replace with actual API calls
const mockStats: CmsDashboardStats = {
  totalProducts: 127,
  totalOrders: 1892,
  totalCustomers: 456,
  revenue: 89754.32,
  recentActivities: [],
  popularProducts: [],
  lowStockProducts: []
};

const quickActions = [
  {
    title: 'Add New Product',
    description: 'Create a new cake or bakery item',
    icon: 'plus',
    href: '/cms/products/new',
    color: 'bg-blue-500'
  },
  {
    title: 'Upload Images',
    description: 'Add photos to media library',
    icon: 'upload',
    href: '/cms/media/upload',
    color: 'bg-green-500'
  },
  {
    title: 'Create Banner',
    description: 'Design promotional banners',
    icon: 'image',
    href: '/cms/content/banners/new',
    color: 'bg-purple-500'
  },
  {
    title: 'Manage Orders',
    description: 'View and process orders',
    icon: 'shoppingCart',
    href: '/cms/orders',
    color: 'bg-orange-500'
  }
];

const recentActivities = [
  {
    id: '1',
    action: 'Product created',
    details: 'Chocolate Birthday Cake',
    user: 'Admin',
    timestamp: '2 minutes ago',
    icon: 'plus'
  },
  {
    id: '2',
    action: 'Order received',
    details: 'Order #1234 - $45.99',
    user: 'Customer',
    timestamp: '5 minutes ago',
    icon: 'shoppingCart'
  },
  {
    id: '3',
    action: 'Content updated',
    details: 'About Us page',
    user: 'Editor',
    timestamp: '1 hour ago',
    icon: 'edit'
  },
  {
    id: '4',
    action: 'Image uploaded',
    details: '5 product images',
    user: 'Admin',
    timestamp: '2 hours ago',
    icon: 'upload'
  }
];

export default function CmsDashboard() {
  const [stats, setStats] = useState<CmsDashboardStats>(mockStats);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh stats from API
      // fetchDashboardStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your cake shop.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Icons.circle className="mr-1 h-2 w-2 fill-green-600" />
            System Online
          </Badge>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <Icons.refreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Icons.shoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Icons.package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+5</span> new this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23</span> new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = Icons[action.icon as keyof typeof Icons];
              return (
                <Link key={index} href={action.href}>
                  <div className="group cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${action.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions performed in your CMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = Icons[activity.icon as keyof typeof Icons];
                return (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className="rounded-full bg-muted p-2">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.action}:</span>{' '}
                        {activity.details}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {activity.user} • {activity.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Monitor your system health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Server Performance</span>
                <span className="text-green-600">Excellent</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Database Health</span>
                <span className="text-green-600">Good</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Storage Usage</span>
                <span className="text-yellow-600">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>CDN Status</span>
                <span className="text-green-600">Active</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button size="sm" variant="outline" className="w-full">
                <Icons.activity className="mr-2 h-4 w-4" />
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}