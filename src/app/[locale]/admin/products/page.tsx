'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockProducts = [
  {
    id: '1',
    name: { en: 'Organic Chocolate Cake', zh: '有机巧克力蛋糕' },
    category: 'Birthday Cakes',
    price: 45.00,
    stock: 12,
    status: 'active',
    image: '/api/placeholder/100/100',
    sales: 156,
    lastUpdated: '2024-01-15',
    dietaryInfo: ['organic', 'glutenFree']
  },
  {
    id: '2',
    name: { en: 'Vanilla Birthday Cake', zh: '香草生日蛋糕' },
    category: 'Birthday Cakes',
    price: 38.00,
    stock: 8,
    status: 'active',
    image: '/api/placeholder/100/100',
    sales: 89,
    lastUpdated: '2024-01-14',
    dietaryInfo: ['organic']
  },
  {
    id: '3',
    name: { en: 'Vegan Red Velvet', zh: '纯素红丝绒蛋糕' },
    category: 'Custom Cakes',
    price: 52.00,
    stock: 3,
    status: 'low_stock',
    image: '/api/placeholder/100/100',
    sales: 67,
    lastUpdated: '2024-01-13',
    dietaryInfo: ['vegan', 'organic']
  },
  {
    id: '4',
    name: { en: 'Sugar-Free Lemon Cake', zh: '无糖柠檬蛋糕' },
    category: 'Cheesecakes',
    price: 42.00,
    stock: 0,
    status: 'out_of_stock',
    image: '/api/placeholder/100/100',
    sales: 34,
    lastUpdated: '2024-01-12',
    dietaryInfo: ['sugarFree', 'glutenFree']
  },
  {
    id: '5',
    name: { en: 'Classic Carrot Cake', zh: '经典胡萝卜蛋糕' },
    category: 'Birthday Cakes',
    price: 40.00,
    stock: 15,
    status: 'active',
    image: '/api/placeholder/100/100',
    sales: 123,
    lastUpdated: '2024-01-11',
    dietaryInfo: ['organic']
  }
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  low_stock: 'bg-yellow-100 text-yellow-800',
  out_of_stock: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800'
};

const dietaryBadgeColors = {
  organic: 'bg-green-100 text-green-800',
  vegan: 'bg-purple-100 text-purple-800',
  glutenFree: 'bg-blue-100 text-blue-800',
  sugarFree: 'bg-orange-100 text-orange-800',
  dairyFree: 'bg-pink-100 text-pink-800'
};

export default function ProductsPage() {
  const t = useTranslations('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentLocale, setCurrentLocale] = useState<'en' | 'zh'>('en');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name[currentLocale].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalProducts: mockProducts.length,
    activeProducts: mockProducts.filter(p => p.status === 'active').length,
    lowStockProducts: mockProducts.filter(p => p.status === 'low_stock').length,
    totalRevenue: mockProducts.reduce((sum, p) => sum + (p.price * p.sales), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your healthy cake products</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProducts} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              products need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProducts.reduce((sum, p) => sum + p.sales, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              units sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              from product sales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="Birthday Cakes">Birthday Cakes</option>
                <option value="Wedding Cakes">Wedding Cakes</option>
                <option value="Cupcakes">Cupcakes</option>
                <option value="Cheesecakes">Cheesecakes</option>
                <option value="Custom Cakes">Custom Cakes</option>
              </select>
              <select
                value={currentLocale}
                onChange={(e) => setCurrentLocale(e.target.value as 'en' | 'zh')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="en">🇺🇸 English</option>
                <option value="zh">🇨🇳 中文</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Dietary</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name[currentLocale]}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name[currentLocale]}</div>
                      <div className="text-sm text-gray-500">ID: {product.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{product.stock}</span>
                      {product.stock <= 5 && product.stock > 0 && (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      {product.stock === 0 && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[product.status as keyof typeof statusColors]}>
                      {product.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{product.sales} sold</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.dietaryInfo.map((dietary) => (
                        <Badge
                          key={dietary}
                          variant="secondary"
                          className={`text-xs ${dietaryBadgeColors[dietary as keyof typeof dietaryBadgeColors]}`}
                        >
                          {dietary.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first product.'}
              </p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}