'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  X,
  Upload,
  Save,
  Eye,
  AlertCircle,
  Info
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { WYSIWYGEditor } from './WYSIWYGEditor';

interface Ingredient {
  id: string;
  name: string;
  isOrganic: boolean;
  allergens: string[];
}

interface NutritionInfo {
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  sugar: number;
  fiber: number;
}

interface ProductData {
  id?: string;
  name: { en: string; zh: string };
  description: { en: string; zh: string };
  shortDescription: { en: string; zh: string };
  price: number;
  compareAtPrice?: number;
  category: string;
  tags: string[];
  images: string[];
  ingredients: Ingredient[];
  nutrition: NutritionInfo;
  allergens: string[];
  dietaryInfo: {
    glutenFree: boolean;
    vegan: boolean;
    sugarFree: boolean;
    dairyFree: boolean;
    organic: boolean;
  };
  isActive: boolean;
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  };
  seo: {
    title: { en: string; zh: string };
    description: { en: string; zh: string };
    keywords: string[];
  };
}

const ALLERGENS = [
  'Eggs', 'Milk', 'Nuts', 'Peanuts', 'Soy', 'Wheat', 'Sesame'
];

const CATEGORIES = [
  'Birthday Cakes',
  'Wedding Cakes',
  'Cupcakes',
  'Cheesecakes',
  'Custom Cakes',
  'Seasonal Specials'
];

interface DraggableImageProps {
  src: string;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (index: number) => void;
}

function DraggableImage({ src, index, moveImage, onRemove }: DraggableImageProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'image',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'image',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative group cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <img
        src={src}
        alt="Product"
        className="w-24 h-24 object-cover rounded-lg border"
      />
      <Button
        variant="destructive"
        size="sm"
        className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(index)}
      >
        <X className="h-3 w-3" />
      </Button>
      {index === 0 && (
        <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>
      )}
    </div>
  );
}

interface ProductEditorProps {
  initialData?: Partial<ProductData>;
  onSave: (data: ProductData) => Promise<void>;
  onCancel: () => void;
}

export function ProductEditor({ initialData, onSave, onCancel }: ProductEditorProps) {
  const t = useTranslations('admin');
  const [currentLocale, setCurrentLocale] = useState<'en' | 'zh'>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ProductData>({
    name: { en: '', zh: '' },
    description: { en: '', zh: '' },
    shortDescription: { en: '', zh: '' },
    price: 0,
    category: '',
    tags: [],
    images: [],
    ingredients: [],
    nutrition: {
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
      sugar: 0,
      fiber: 0,
    },
    allergens: [],
    dietaryInfo: {
      glutenFree: false,
      vegan: false,
      sugarFree: false,
      dairyFree: false,
      organic: false,
    },
    isActive: true,
    inventory: {
      quantity: 0,
      lowStockThreshold: 5,
      trackQuantity: true,
    },
    seo: {
      title: { en: '', zh: '' },
      description: { en: '', zh: '' },
      keywords: [],
    },
    ...initialData,
  });

  const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
    const newImages = [...formData.images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    setFormData(prev => ({ ...prev, images: newImages }));
  }, [formData.images]);

  const removeImage = useCallback((index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  }, [formData.images]);

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      isOrganic: false,
      allergens: [],
    };
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
    }));
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing =>
        ing.id === id ? { ...ing, ...updates } : ing
      ),
    }));
  };

  const removeIngredient = (id: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== id),
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {initialData?.id ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600">
              Create healthy, customizable cake products for your customers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={currentLocale} onValueChange={(value: 'en' | 'zh') => setCurrentLocale(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="zh">🇨🇳 中文</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="health">Health & Nutrition</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name[currentLocale]}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          name: { ...prev.name, [currentLocale]: e.target.value },
                        }))
                      }
                      placeholder={`Enter product name in ${currentLocale === 'en' ? 'English' : 'Chinese'}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription[currentLocale]}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        shortDescription: { ...prev.shortDescription, [currentLocale]: e.target.value },
                      }))
                    }
                    placeholder="Brief description for product cards"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <WYSIWYGEditor
                    content={formData.description[currentLocale]}
                    onChange={(content) =>
                      setFormData(prev => ({
                        ...prev,
                        description: { ...prev.description, [currentLocale]: content },
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      step="0.01"
                      value={formData.compareAtPrice || ''}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                        }))
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add tags (press Enter)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, isActive: checked }))
                    }
                  />
                  <Label htmlFor="active">Product is active</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health & Nutrition */}
          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Health Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dietary Information */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Dietary Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(formData.dietaryInfo).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) =>
                            setFormData(prev => ({
                              ...prev,
                              dietaryInfo: { ...prev.dietaryInfo, [key]: checked },
                            }))
                          }
                        />
                        <Label htmlFor={key} className="text-sm">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergens */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Allergens</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ALLERGENS.map((allergen) => (
                      <div key={allergen} className="flex items-center space-x-2">
                        <Switch
                          id={allergen}
                          checked={formData.allergens.includes(allergen)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                allergens: [...prev.allergens, allergen],
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                allergens: prev.allergens.filter(a => a !== allergen),
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={allergen} className="text-sm">
                          {allergen}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingredients */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Ingredients</h3>
                    <Button variant="outline" size="sm" onClick={addIngredient}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.ingredients.map((ingredient) => (
                      <Card key={ingredient.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Input
                              value={ingredient.name}
                              onChange={(e) =>
                                updateIngredient(ingredient.id, { name: e.target.value })
                              }
                              placeholder="Ingredient name"
                              className="flex-1"
                            />
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={ingredient.isOrganic}
                                onCheckedChange={(checked) =>
                                  updateIngredient(ingredient.id, { isOrganic: checked })
                                }
                              />
                              <Label className="text-sm">Organic</Label>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeIngredient(ingredient.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Nutrition Facts */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Nutrition Facts (per serving)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(formData.nutrition).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-sm">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                          {key === 'calories' ? '' : ' (g)'}
                        </Label>
                        <Input
                          id={key}
                          type="number"
                          step="0.1"
                          value={value}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              nutrition: {
                                ...prev.nutrition,
                                [key]: parseFloat(e.target.value) || 0,
                              },
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop images here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Recommended: 1000x1000px, JPG or PNG, max 5MB each
                  </p>
                  <Button variant="outline" className="mt-4">
                    Choose Files
                  </Button>
                </div>

                {formData.images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Product Images</h3>
                    <div className="flex flex-wrap gap-4">
                      {formData.images.map((image, index) => (
                        <DraggableImage
                          key={`${image}-${index}`}
                          src={image}
                          index={index}
                          moveImage={moveImage}
                          onRemove={removeImage}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Drag images to reorder. The first image will be the main product image.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="trackQuantity"
                    checked={formData.inventory.trackQuantity}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        inventory: { ...prev.inventory, trackQuantity: checked },
                      }))
                    }
                  />
                  <Label htmlFor="trackQuantity">Track quantity</Label>
                </div>

                {formData.inventory.trackQuantity && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Current Stock</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.inventory.quantity}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            inventory: {
                              ...prev.inventory,
                              quantity: parseInt(e.target.value) || 0,
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        value={formData.inventory.lowStockThreshold}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            inventory: {
                              ...prev.inventory,
                              lowStockThreshold: parseInt(e.target.value) || 0,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Engine Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seo.title[currentLocale]}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          title: { ...prev.seo.title, [currentLocale]: e.target.value },
                        },
                      }))
                    }
                    placeholder="Optimized title for search engines"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seo.description[currentLocale]}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          description: { ...prev.seo.description, [currentLocale]: e.target.value },
                        },
                      }))
                    }
                    placeholder="Meta description for search results"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>SEO Keywords</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.seo.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="gap-1">
                        {keyword}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() =>
                            setFormData(prev => ({
                              ...prev,
                              seo: {
                                ...prev.seo,
                                keywords: prev.seo.keywords.filter(k => k !== keyword),
                              },
                            }))
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add SEO keywords (press Enter)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const keyword = e.currentTarget.value.trim();
                        if (keyword && !formData.seo.keywords.includes(keyword)) {
                          setFormData(prev => ({
                            ...prev,
                            seo: {
                              ...prev.seo,
                              keywords: [...prev.seo.keywords, keyword],
                            },
                          }));
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Product Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    {formData.images[0] && (
                      <img
                        src={formData.images[0]}
                        alt={formData.name[currentLocale]}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {formData.dietaryInfo.organic && (
                          <Badge variant="secondary">Organic</Badge>
                        )}
                        {formData.dietaryInfo.vegan && (
                          <Badge variant="secondary">Vegan</Badge>
                        )}
                        {formData.dietaryInfo.glutenFree && (
                          <Badge variant="secondary">Gluten Free</Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {formData.name[currentLocale] || 'Product Name'}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {formData.shortDescription[currentLocale] || 'Product description will appear here...'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600">
                            ${formData.price.toFixed(2)}
                          </span>
                          {formData.compareAtPrice && formData.compareAtPrice > formData.price && (
                            <span className="text-lg text-gray-500 line-through">
                              ${formData.compareAtPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Button size="sm">Add to Cart</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DndProvider>
  );
}