'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Palette,
  Layers,
  Sparkles,
  MessageSquare,
  ShoppingCart,
  Wand2,
  Info,
  Heart,
  Star,
  Gift
} from 'lucide-react';
import { CakeDesigner3D } from '@/components/cake-designer/CakeDesigner3D';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';

interface CakeLayer {
  id: string;
  shape: 'round' | 'square' | 'heart';
  size: number;
  height: number;
  flavor: string;
  color: string;
}

interface CakeDecoration {
  id: string;
  type: 'flower' | 'text' | 'candle' | 'fruit';
  position: [number, number, number];
  color: string;
  content?: string;
}

interface CakeDesign {
  layers: CakeLayer[];
  decorations: CakeDecoration[];
  frosting: {
    type: 'smooth' | 'textured' | 'piped';
    color: string;
  };
  personalMessage?: string;
  occasion?: string;
}

const CAKE_SHAPES = [
  { value: 'round', label: 'Round', icon: '⭕' },
  { value: 'square', label: 'Square', icon: '⬜' },
  { value: 'heart', label: 'Heart', icon: '💝' },
];

const CAKE_FLAVORS = [
  { value: 'vanilla', label: 'Vanilla Bean', color: '#f8f6f0', healthy: true },
  { value: 'chocolate', label: 'Organic Chocolate', color: '#8b4513', healthy: true },
  { value: 'strawberry', label: 'Fresh Strawberry', color: '#ffb6c1', healthy: true },
  { value: 'lemon', label: 'Meyer Lemon', color: '#fff700', healthy: true },
  { value: 'carrot', label: 'Spiced Carrot', color: '#ff8c00', healthy: true },
  { value: 'red-velvet', label: 'Red Velvet (Natural)', color: '#dc143c', healthy: true },
];

const DECORATION_TYPES = [
  { value: 'flower', label: 'Edible Flowers', icon: '🌸' },
  { value: 'fruit', label: 'Fresh Fruits', icon: '🍓' },
  { value: 'text', label: 'Custom Text', icon: '📝' },
  { value: 'candle', label: 'Natural Candles', icon: '🕯️' },
];

const FROSTING_COLORS = [
  { value: '#ffffff', label: 'Pure White', name: 'white' },
  { value: '#ffb6c1', label: 'Rose Pink', name: 'rose' },
  { value: '#e6e6fa', label: 'Lavender', name: 'lavender' },
  { value: '#f0e68c', label: 'Buttercream', name: 'buttercream' },
  { value: '#dda0dd', label: 'Plum', name: 'plum' },
  { value: '#98fb98', label: 'Mint Green', name: 'mint' },
];

const AI_SUGGESTIONS = [
  {
    id: 1,
    name: 'Birthday Celebration',
    description: '3-layer round cake with rainbow decorations',
    price: 85,
    layers: [
      { shape: 'round', size: 2, flavor: 'vanilla', color: '#f8f6f0' },
      { shape: 'round', size: 1.5, flavor: 'chocolate', color: '#8b4513' },
      { shape: 'round', size: 1, flavor: 'strawberry', color: '#ffb6c1' },
    ],
    decorations: ['flowers', 'candles', 'text'],
    occasion: 'birthday'
  },
  {
    id: 2,
    name: 'Romantic Heart',
    description: 'Heart-shaped cake with rose decorations',
    price: 95,
    layers: [
      { shape: 'heart', size: 1.8, flavor: 'red-velvet', color: '#dc143c' },
      { shape: 'heart', size: 1.2, flavor: 'vanilla', color: '#f8f6f0' },
    ],
    decorations: ['flowers', 'text'],
    occasion: 'anniversary'
  },
  {
    id: 3,
    name: 'Garden Fresh',
    description: 'Square cake with fruit and flower decorations',
    price: 78,
    layers: [
      { shape: 'square', size: 2, flavor: 'lemon', color: '#fff700' },
      { shape: 'square', size: 1.5, flavor: 'carrot', color: '#ff8c00' },
    ],
    decorations: ['fruit', 'flowers'],
    occasion: 'celebration'
  }
];

export default function CustomCakePage() {
  const t = useTranslations('customCake');
  const { addItem } = useCartStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [design, setDesign] = useState<CakeDesign>({
    layers: [
      {
        id: '1',
        shape: 'round',
        size: 2,
        height: 0.8,
        flavor: 'vanilla',
        color: '#f8f6f0'
      }
    ],
    decorations: [],
    frosting: {
      type: 'smooth',
      color: '#ffffff'
    }
  });

  const [personalMessage, setPersonalMessage] = useState('');
  const [occasion, setOccasion] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(45);

  const addLayer = () => {
    const newLayer: CakeLayer = {
      id: Date.now().toString(),
      shape: 'round',
      size: Math.max(1, design.layers[design.layers.length - 1]?.size - 0.5 || 1.5),
      height: 0.8,
      flavor: 'vanilla',
      color: '#f8f6f0'
    };
    setDesign(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer]
    }));
    updatePrice();
  };

  const updateLayer = (layerId: string, updates: Partial<CakeLayer>) => {
    setDesign(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    }));
    updatePrice();
  };

  const removeLayer = (layerId: string) => {
    if (design.layers.length > 1) {
      setDesign(prev => ({
        ...prev,
        layers: prev.layers.filter(layer => layer.id !== layerId)
      }));
      updatePrice();
    }
  };

  const addDecoration = (type: string) => {
    const newDecoration: CakeDecoration = {
      id: Date.now().toString(),
      type: type as any,
      position: [0, design.layers.reduce((sum, l) => sum + l.height, 0) + 0.1, 0],
      color: '#ff69b4',
      content: type === 'text' ? 'Happy Birthday!' : undefined
    };
    setDesign(prev => ({
      ...prev,
      decorations: [...prev.decorations, newDecoration]
    }));
    updatePrice();
  };

  const updatePrice = () => {
    const basePrice = 35;
    const layerPrice = design.layers.length * 15;
    const decorationPrice = design.decorations.length * 8;
    const customPrice = personalMessage ? 10 : 0;

    setEstimatedPrice(basePrice + layerPrice + decorationPrice + customPrice);
  };

  const applySuggestion = (suggestion: any) => {
    const newLayers = suggestion.layers.map((layer: any, index: number) => ({
      id: (index + 1).toString(),
      shape: layer.shape,
      size: layer.size,
      height: 0.8,
      flavor: layer.flavor,
      color: layer.color
    }));

    setDesign(prev => ({
      ...prev,
      layers: newLayers,
      decorations: []
    }));

    setOccasion(suggestion.occasion);
    setEstimatedPrice(suggestion.price);
    setCurrentStep(2);
  };

  const addToCart = () => {
    const customCake = {
      id: `custom-${Date.now()}`,
      name: { en: 'Custom Designed Cake', zh: '定制设计蛋糕' },
      price: estimatedPrice,
      image: '/api/placeholder/300/300',
      category: 'Custom Cakes',
      dietaryInfo: ['organic', 'customizable'],
      customization: {
        layers: design.layers.length.toString(),
        decorations: design.decorations.length.toString(),
        personalMessage: personalMessage,
        occasion: occasion
      }
    };

    addItem(customCake);
    toast.success('Custom cake added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Design Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-purple-600" />
                  {t('aiSuggestions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {AI_SUGGESTIONS.map((suggestion) => (
                    <div key={suggestion.id} className="border rounded-lg p-4 hover:border-purple-300 transition-colors">
                      <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center">
                        <div className="text-2xl">
                          {suggestion.occasion === 'birthday' && '🎂'}
                          {suggestion.occasion === 'anniversary' && '💝'}
                          {suggestion.occasion === 'celebration' && '🎉'}
                        </div>
                      </div>
                      <h3 className="font-medium text-sm mb-1">{suggestion.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600">${suggestion.price}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => applySuggestion(suggestion)}
                        >
                          Use This
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Design Tabs */}
            <Tabs value={`step${currentStep}`} onValueChange={(value) => setCurrentStep(parseInt(value.replace('step', '')))}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="step1" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Layers
                </TabsTrigger>
                <TabsTrigger value="step2" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Decorations
                </TabsTrigger>
                <TabsTrigger value="step3" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Frosting
                </TabsTrigger>
                <TabsTrigger value="step4" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </TabsTrigger>
              </TabsList>

              {/* Step 1: Cake Layers */}
              <TabsContent value="step1" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('step1')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {design.layers.map((layer, index) => (
                      <div key={layer.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Layer {index + 1}</h4>
                          {design.layers.length > 1 && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeLayer(layer.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Shape</Label>
                            <Select
                              value={layer.shape}
                              onValueChange={(value) => updateLayer(layer.id, { shape: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CAKE_SHAPES.map((shape) => (
                                  <SelectItem key={shape.value} value={shape.value}>
                                    {shape.icon} {shape.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Size</Label>
                            <Select
                              value={layer.size.toString()}
                              onValueChange={(value) => updateLayer(layer.id, { size: parseFloat(value) })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Small (6&quot;)</SelectItem>
                                <SelectItem value="1.5">Medium (8&quot;)</SelectItem>
                                <SelectItem value="2">Large (10&quot;)</SelectItem>
                                <SelectItem value="2.5">Extra Large (12&quot;)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Flavor</Label>
                            <Select
                              value={layer.flavor}
                              onValueChange={(value) => {
                                const flavor = CAKE_FLAVORS.find(f => f.value === value);
                                updateLayer(layer.id, {
                                  flavor: value,
                                  color: flavor?.color || layer.color
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CAKE_FLAVORS.map((flavor) => (
                                  <SelectItem key={flavor.value} value={flavor.value}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full border"
                                        style={{ backgroundColor: flavor.color }}
                                      />
                                      {flavor.label}
                                      {flavor.healthy && <Badge variant="secondary" className="text-xs">Healthy</Badge>}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button onClick={addLayer} variant="outline" className="w-full">
                      + Add Another Layer
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 2: Decorations */}
              <TabsContent value="step2" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('step3')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {DECORATION_TYPES.map((decoration) => (
                        <Button
                          key={decoration.value}
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-center gap-2"
                          onClick={() => addDecoration(decoration.value)}
                        >
                          <span className="text-2xl">{decoration.icon}</span>
                          <span className="text-sm">{decoration.label}</span>
                        </Button>
                      ))}
                    </div>

                    {design.decorations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Added Decorations:</h4>
                        <div className="flex flex-wrap gap-2">
                          {design.decorations.map((decoration) => (
                            <Badge key={decoration.id} variant="secondary">
                              {decoration.type} decoration
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 3: Frosting */}
              <TabsContent value="step3" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Frosting Style</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {['smooth', 'textured', 'piped'].map((type) => (
                        <Button
                          key={type}
                          variant={design.frosting.type === type ? 'default' : 'outline'}
                          onClick={() => setDesign(prev => ({
                            ...prev,
                            frosting: { ...prev.frosting, type: type as any }
                          }))}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Frosting Color</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {FROSTING_COLORS.map((color) => (
                          <Button
                            key={color.value}
                            variant="outline"
                            className={`h-12 flex items-center gap-2 ${
                              design.frosting.color === color.value ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setDesign(prev => ({
                              ...prev,
                              frosting: { ...prev.frosting, color: color.value }
                            }))}
                          >
                            <div
                              className="w-6 h-6 rounded-full border"
                              style={{ backgroundColor: color.value }}
                            />
                            <span className="text-xs">{color.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 4: Personal Message */}
              <TabsContent value="step4" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('step4')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="occasion">Occasion</Label>
                      <Select value={occasion} onValueChange={setOccasion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select occasion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="birthday">🎂 Birthday</SelectItem>
                          <SelectItem value="anniversary">💝 Anniversary</SelectItem>
                          <SelectItem value="wedding">💒 Wedding</SelectItem>
                          <SelectItem value="graduation">🎓 Graduation</SelectItem>
                          <SelectItem value="celebration">🎉 Celebration</SelectItem>
                          <SelectItem value="other">🎈 Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personalMessage">Personal Message (Optional)</Label>
                      <Textarea
                        id="personalMessage"
                        value={personalMessage}
                        onChange={(e) => setPersonalMessage(e.target.value)}
                        placeholder="Enter a personal message for your cake..."
                        rows={3}
                      />
                      <p className="text-sm text-gray-500">
                        +$10 for custom text decoration
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 3D Preview and Summary */}
          <div className="space-y-6">
            {/* 3D Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {t('preview')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CakeDesigner3D
                  design={design}
                  className="h-64 w-full rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  {t('price')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>$35</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Layers ({design.layers.length}):</span>
                    <span>${design.layers.length * 15}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Decorations ({design.decorations.length}):</span>
                    <span>${design.decorations.length * 8}</span>
                  </div>
                  {personalMessage && (
                    <div className="flex justify-between">
                      <span>Custom Text:</span>
                      <span>$10</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">${estimatedPrice}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    {t('healthy')}
                  </p>
                </div>

                <Button onClick={addToCart} className="w-full" size="lg">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t('submitDesign')} - ${estimatedPrice}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Free delivery on orders over $50
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Custom?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Made with love and natural ingredients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Personalized to your exact preferences</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-purple-500" />
                    <span>Perfect for special occasions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span>3D preview before ordering</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}