'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Icons } from '@/components/ui/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { CmsBanner, BannerPosition } from '@/types/cms';
import { toast } from 'sonner';

// Mock data - replace with actual API calls
const mockBanners: CmsBanner[] = [
  {
    _id: '1',
    title: 'Holiday Special Cakes',
    subtitle: 'Order now for the holidays',
    description: 'Get 20% off on all holiday-themed cakes and desserts',
    image: { img_url: '/images/holiday-banner.jpg', img_id: '1' },
    link: '/products/holiday-cakes',
    buttonText: 'Shop Now',
    position: BannerPosition.HERO,
    priority: 1,
    isActive: true,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    targetAudience: ['all']
  },
  {
    _id: '2',
    title: 'Custom Wedding Cakes',
    subtitle: 'Make your special day perfect',
    description: 'Custom designed wedding cakes for your dream wedding',
    image: { img_url: '/images/wedding-banner.jpg', img_id: '2' },
    link: '/products/wedding-cakes',
    buttonText: 'Learn More',
    position: BannerPosition.SECONDARY,
    priority: 2,
    isActive: true,
    targetAudience: ['couples']
  },
  {
    _id: '3',
    title: 'Fresh Daily Bakes',
    subtitle: 'Baked fresh every morning',
    description: 'Try our daily selection of fresh pastries and breads',
    image: { img_url: '/images/daily-bakes.jpg', img_id: '3' },
    position: BannerPosition.SIDEBAR,
    priority: 3,
    isActive: false,
    targetAudience: ['local']
  }
];

export default function BannersPage() {
  const [banners, setBanners] = useState<CmsBanner[]>(mockBanners);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<'all' | BannerPosition>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === 'all' || banner.position === filterPosition;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && banner.isActive) ||
      (filterStatus === 'inactive' && !banner.isActive);
    return matchesSearch && matchesPosition && matchesStatus;
  });

  const toggleBannerStatus = (id: string) => {
    setBanners(prev => prev.map(banner => 
      banner._id === id ? { ...banner, isActive: !banner.isActive } : banner
    ));
    toast.success('Banner status updated');
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(banner => banner._id !== id));
    toast.success('Banner deleted');
  };

  const getPositionBadge = (position: BannerPosition) => {
    const colors = {
      [BannerPosition.HERO]: 'bg-purple-100 text-purple-800',
      [BannerPosition.SECONDARY]: 'bg-blue-100 text-blue-800',
      [BannerPosition.SIDEBAR]: 'bg-green-100 text-green-800',
      [BannerPosition.FOOTER]: 'bg-gray-100 text-gray-800',
      [BannerPosition.POPUP]: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={colors[position]}>
        {position.charAt(0).toUpperCase() + position.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No end date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
          <p className="text-muted-foreground">
            Create and manage promotional banners for your cake shop
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Icons.download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/cms/content/banners/new">
            <Button>
              <Icons.plus className="mr-2 h-4 w-4" />
              Create Banner
            </Button>
          </Link>
        </div>
      </div>

      {/* Banner Positions Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Object.values(BannerPosition).map((position) => {
          const count = banners.filter(b => b.position === position && b.isActive).length;
          const total = banners.filter(b => b.position === position).length;
          
          return (
            <Card key={position}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {position.charAt(0).toUpperCase() + position.slice(1)}
                    </p>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">
                      {count} active of {total} total
                    </p>
                  </div>
                  <div className="text-2xl">
                    {position === BannerPosition.HERO && '🎯'}
                    {position === BannerPosition.SECONDARY && '📢'}
                    {position === BannerPosition.SIDEBAR && '📌'}
                    {position === BannerPosition.FOOTER && '📄'}
                    {position === BannerPosition.POPUP && '🎪'}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search your banners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search banners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Icons.filter className="mr-2 h-4 w-4" />
                    Position: {filterPosition === 'all' ? 'All' : filterPosition}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterPosition('all')}>
                    All Positions
                  </DropdownMenuItem>
                  {Object.values(BannerPosition).map((position) => (
                    <DropdownMenuItem key={position} onClick={() => setFilterPosition(position)}>
                      {position.charAt(0).toUpperCase() + position.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Icons.toggle className="mr-2 h-4 w-4" />
                    Status: {filterStatus === 'all' ? 'All' : filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="icon">
                <Icons.refreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Banners ({filteredBanners.length})</CardTitle>
          <CardDescription>
            Manage your promotional banners and their placement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banner</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.map((banner) => (
                  <TableRow key={banner._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-16 w-24 rounded-lg">
                          <AvatarImage 
                            src={banner.image.img_url} 
                            alt={banner.title}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-lg">
                            <Icons.image className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="font-medium">{banner.title}</div>
                          {banner.subtitle && (
                            <div className="text-sm text-muted-foreground">
                              {banner.subtitle}
                            </div>
                          )}
                          {banner.buttonText && (
                            <Badge variant="outline" className="text-xs">
                              Button: {banner.buttonText}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPositionBadge(banner.position)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{banner.priority}</span>
                        <Icons.arrowUp className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={banner.isActive}
                          onCheckedChange={() => toggleBannerStatus(banner._id)}
                        />
                        <Badge variant={banner.isActive ? "default" : "secondary"}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>Start: {formatDate(banner.startDate)}</div>
                        <div>End: {formatDate(banner.endDate)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Icons.eye className="h-3 w-3" />
                          <span>1.2k views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icons.mousePointer className="h-3 w-3" />
                          <span>84 clicks</span>
                        </div>
                        <div className="text-green-600">7.0% CTR</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Icons.moreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/cms/content/banners/${banner._id}/edit`}>
                              <Icons.edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Icons.copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Icons.barChart className="mr-2 h-4 w-4" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => toggleBannerStatus(banner._id)}
                          >
                            <Icons.toggle className="mr-2 h-4 w-4" />
                            {banner.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => deleteBanner(banner._id)}
                          >
                            <Icons.trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredBanners.length === 0 && (
            <div className="text-center py-12">
              <Icons.image className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No banners found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first banner'}
              </p>
              {!searchTerm && (
                <Link href="/cms/content/banners/new">
                  <Button className="mt-4">
                    <Icons.plus className="mr-2 h-4 w-4" />
                    Create Banner
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Banner Performance Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold">15.2k</p>
                <p className="text-xs text-green-600">+12% this week</p>
              </div>
              <Icons.eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">1.8k</p>
                <p className="text-xs text-green-600">+8% this week</p>
              </div>
              <Icons.mousePointer className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average CTR</p>
                <p className="text-2xl font-bold">6.8%</p>
                <p className="text-xs text-green-600">+0.3% this week</p>
              </div>
              <Icons.trendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}