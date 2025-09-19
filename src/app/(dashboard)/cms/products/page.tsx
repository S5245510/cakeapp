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
import Link from 'next/link';
import { CmsProduct } from '@/types/cms';
import { ProductStatus } from '@/types';

// Mock data - replace with actual API calls
const mockProducts: CmsProduct[] = [
  {
    _id: '1',
    name: 'Chocolate Birthday Cake',
    slug: 'chocolate-birthday-cake',
    price: 45.99,
    sale_price: 39.99,
    status: ProductStatus.Publish,
    image: { img_url: '/images/chocolate-cake.jpg', img_id: '1' },
    quantity: 15,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    ratings: 4.8,
    shop: {} as any,
    type: {} as any,
    product_type: 'simple' as any,
    categories: [],
    orders: [],
    rating_count: [],
    healthAttributes: [
      { _id: '1', name: 'Gluten-Free', value: 'No', icon: 'wheat', description: 'Contains gluten', verified: true },
      { _id: '2', name: 'Organic', value: 'Yes', icon: 'leaf', description: 'Made with organic ingredients', verified: true }
    ],
    allergens: [
      { _id: '1', name: 'Wheat', severity: 'high', description: 'Contains wheat flour' },
      { _id: '2', name: 'Eggs', severity: 'medium', description: 'Contains eggs' }
    ]
  },
  {
    _id: '2',
    name: 'Vanilla Cupcakes (12 pack)',
    slug: 'vanilla-cupcakes-12-pack',
    price: 24.99,
    sale_price: 24.99,
    status: ProductStatus.Publish,
    image: { img_url: '/images/vanilla-cupcakes.jpg', img_id: '2' },
    quantity: 8,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-18T11:15:00Z',
    ratings: 4.6,
    shop: {} as any,
    type: {} as any,
    product_type: 'simple' as any,
    categories: [],
    orders: [],
    rating_count: [],
    healthAttributes: [
      { _id: '3', name: 'Low Sugar', value: 'Yes', icon: 'droplet', description: 'Reduced sugar content', verified: true }
    ],
    allergens: [
      { _id: '3', name: 'Dairy', severity: 'medium', description: 'Contains milk products' }
    ]
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<CmsProduct[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | ProductStatus>('all');
  const [isLoading, setIsLoading] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.Publish:
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case ProductStatus.Draft:
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStockStatus = (quantity?: number) => {
    if (!quantity || quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity < 5) {
      return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your cake and bakery products with health attributes and nutrition info
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Icons.import className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Icons.download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/cms/products/new">
            <Button>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
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
                    Status: {filterStatus === 'all' ? 'All' : filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus(ProductStatus.Publish)}>
                    Published
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus(ProductStatus.Draft)}>
                    Draft
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

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Manage your product catalog with detailed health and nutrition information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Health Info</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-lg">
                          <AvatarImage src={product.image.img_url} alt={product.name} />
                          <AvatarFallback className="rounded-lg">
                            <Icons.package className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {product.sku || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">${product.price}</div>
                        {product.sale_price !== product.price && (
                          <div className="text-sm text-green-600">
                            Sale: ${product.sale_price}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="text-sm">{product.quantity || 0} units</div>
                        {getStockStatus(product.quantity)}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status!)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {product.healthAttributes?.slice(0, 2).map((attr) => (
                          <Badge key={attr._id} variant="outline" className="text-xs">
                            {attr.name}
                          </Badge>
                        ))}
                        {(product.healthAttributes?.length || 0) > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(product.healthAttributes?.length || 0) - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Icons.star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.ratings}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(product.updated_at)}
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
                            <Link href={`/cms/products/${product._id}/edit`}>
                              <Icons.edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/cms/products/${product._id}`}>
                              <Icons.eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Icons.copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Icons.package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
              </p>
              {!searchTerm && (
                <Link href="/cms/products/new">
                  <Button className="mt-4">
                    <Icons.plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}