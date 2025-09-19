'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/ui/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CmsProduct, HealthAttribute, Ingredient, NutritionInfo, Allergen } from '@/types/cms';
import { ProductStatus } from '@/types';
import { ProductImageUpload } from '@/components/cms/product-image-upload';
import { WysiwygEditor } from '@/components/cms/wysiwyg-editor';
import { HealthAttributesManager } from '@/components/cms/health-attributes-manager';
import { IngredientsManager } from '@/components/cms/ingredients-manager';
import { NutritionInfoManager } from '@/components/cms/nutrition-info-manager';
import { AllergensManager } from '@/components/cms/allergens-manager';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number;
  sku: string;
  quantity: number;
  status: ProductStatus;
  image: { img_url: string; img_id: string };
  gallery: { img_url: string; img_id: string }[];
  healthAttributes: HealthAttribute[];
  ingredients: Ingredient[];
  nutrition: NutritionInfo | null;
  allergens: Allergen[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

const defaultFormData: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  sale_price: 0,
  sku: '',
  quantity: 0,
  status: ProductStatus.Draft,
  image: { img_url: '', img_id: '' },
  gallery: [],
  healthAttributes: [],
  ingredients: [],
  nutrition: null,
  allergens: [],
  seoTitle: '',
  seoDescription: '',
  seoKeywords: []
};

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty) return;

    const autoSaveTimer = setTimeout(async () => {
      await handleAutoSave();
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [formData, autoSaveEnabled, isDirty]);

  const handleAutoSave = async () => {
    if (!isDirty) return;
    
    try {
      // Implement auto-save API call here
      setLastSaved(new Date());
      setIsDirty(false);
      toast.success('Auto-saved successfully');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const updateField = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Auto-generate slug when name changes
    if (field === 'name' && typeof value === 'string') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleSave = async (publish = false) => {
    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        status: publish ? ProductStatus.Publish : formData.status
      };
      
      // Implement save API call here
      // await saveProduct(productId, dataToSave);
      
      setLastSaved(new Date());
      setIsDirty(false);
      toast.success(publish ? 'Product published successfully!' : 'Product saved successfully!');
    } catch (error) {
      toast.error('Failed to save product');
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Open preview in new tab
    window.open(`/products/${formData.slug}?preview=true`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cms/products">
            <Button variant="ghost" size="icon">
              <Icons.arrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {productId === 'new' ? 'Create Product' : 'Edit Product'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Auto-save</span>
              <Switch
                checked={autoSaveEnabled}
                onCheckedChange={setAutoSaveEnabled}
              />
              {lastSaved && (
                <span>• Last saved: {lastSaved.toLocaleTimeString()}</span>
              )}
              {isDirty && <Badge variant="outline">Unsaved changes</Badge>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Icons.eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
            {isSaving ? <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.save className="mr-2 h-4 w-4" />}
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={isSaving}>
            {isSaving ? <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.upload className="mr-2 h-4 w-4" />}
            Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="health">Health & Nutrition</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details of your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => updateField('slug', e.target.value)}
                        placeholder="product-url-slug"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <WysiwygEditor
                      content={formData.description}
                      onChange={(content) => updateField('description', content)}
                      placeholder="Describe your delicious product..."
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="price">Regular Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sale_price">Sale Price ($)</Label>
                      <Input
                        id="sale_price"
                        type="number"
                        step="0.01"
                        value={formData.sale_price}
                        onChange={(e) => updateField('sale_price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Stock Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => updateField('quantity', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => updateField('sku', e.target.value)}
                      placeholder="CAKE-001"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Attributes</CardTitle>
                  <CardDescription>
                    Define health-related properties of your product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthAttributesManager
                    attributes={formData.healthAttributes}
                    onChange={(attributes) => updateField('healthAttributes', attributes)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Information</CardTitle>
                  <CardDescription>
                    Provide detailed nutrition facts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NutritionInfoManager
                    nutrition={formData.nutrition}
                    onChange={(nutrition) => updateField('nutrition', nutrition)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Allergen Information</CardTitle>
                  <CardDescription>
                    Specify allergens present in this product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AllergensManager
                    allergens={formData.allergens}
                    onChange={(allergens) => updateField('allergens', allergens)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                  <CardDescription>
                    List all ingredients used in this product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IngredientsManager
                    ingredients={formData.ingredients}
                    onChange={(ingredients) => updateField('ingredients', ingredients)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Upload and manage product images with drag-and-drop functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductImageUpload
                    mainImage={formData.image}
                    gallery={formData.gallery}
                    onMainImageChange={(image) => updateField('image', image)}
                    onGalleryChange={(gallery) => updateField('gallery', gallery)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Optimize your product for search engines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) => updateField('seoTitle', e.target.value)}
                      placeholder="Enter SEO title"
                    />
                    <p className="text-sm text-muted-foreground">
                      {formData.seoTitle.length}/60 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) => updateField('seoDescription', e.target.value)}
                      placeholder="Enter SEO description"
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      {formData.seoDescription.length}/160 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>SEO Keywords</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.seoKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                          <button
                            onClick={() => {
                              const newKeywords = formData.seoKeywords.filter((_, i) => i !== index);
                              updateField('seoKeywords', newKeywords);
                            }}
                            className="ml-2 hover:text-red-500"
                          >
                            <Icons.x className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add keyword and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const keyword = input.value.trim();
                          if (keyword && !formData.seoKeywords.includes(keyword)) {
                            updateField('seoKeywords', [...formData.seoKeywords, keyword]);
                            input.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField('status', value as ProductStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProductStatus.Draft}>Draft</SelectItem>
                    <SelectItem value={ProductStatus.Publish}>Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Created:</span>
                  <span className="text-muted-foreground">Jan 15, 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Last modified:</span>
                  <span className="text-muted-foreground">Jan 20, 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Author:</span>
                  <span className="text-muted-foreground">Admin</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Icons.copy className="mr-2 h-4 w-4" />
                Duplicate Product
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Icons.download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Icons.trash className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}