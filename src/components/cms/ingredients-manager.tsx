'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { Ingredient } from '@/types/cms';
import { toast } from 'sonner';

interface IngredientsManagerProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

const commonIngredients = [
  { name: 'All-purpose flour', unit: 'cups' },
  { name: 'Sugar', unit: 'cups' },
  { name: 'Butter', unit: 'cups' },
  { name: 'Eggs', unit: 'pieces' },
  { name: 'Vanilla extract', unit: 'tsp' },
  { name: 'Baking powder', unit: 'tsp' },
  { name: 'Salt', unit: 'tsp' },
  { name: 'Milk', unit: 'cups' },
  { name: 'Cocoa powder', unit: 'cups' },
  { name: 'Heavy cream', unit: 'cups' }
];

const units = [
  'cups', 'tbsp', 'tsp', 'oz', 'lbs', 'g', 'kg', 'ml', 'l', 'pieces', 'pinch'
];

const allergenTypes = [
  'Gluten', 'Dairy', 'Eggs', 'Nuts', 'Soy', 'Fish', 'Shellfish', 'Sesame'
];

export function IngredientsManager({ ingredients, onChange }: IngredientsManagerProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: '',
    quantity: '',
    unit: 'cups',
    allergenInfo: [],
    isOrganic: false,
    origin: ''
  });

  const addIngredient = () => {
    if (!newIngredient.name) {
      toast.error('Please enter an ingredient name');
      return;
    }

    const ingredient: Ingredient = {
      _id: Math.random().toString(36).substring(7),
      name: newIngredient.name!,
      quantity: newIngredient.quantity,
      unit: newIngredient.unit,
      allergenInfo: newIngredient.allergenInfo || [],
      isOrganic: newIngredient.isOrganic || false,
      origin: newIngredient.origin
    };

    onChange([...ingredients, ingredient]);
    setNewIngredient({
      name: '',
      quantity: '',
      unit: 'cups',
      allergenInfo: [],
      isOrganic: false,
      origin: ''
    });
    setIsAddingNew(false);
    toast.success('Ingredient added successfully');
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    const updatedIngredients = ingredients.map(ingredient => 
      ingredient._id === id ? { ...ingredient, ...updates } : ingredient
    );
    onChange(updatedIngredients);
  };

  const removeIngredient = (id: string) => {
    onChange(ingredients.filter(ingredient => ingredient._id !== id));
    toast.success('Ingredient removed');
  };

  const addCommonIngredient = (common: typeof commonIngredients[0]) => {
    const ingredient: Ingredient = {
      _id: Math.random().toString(36).substring(7),
      name: common.name,
      quantity: '',
      unit: common.unit,
      allergenInfo: [],
      isOrganic: false,
      origin: ''
    };

    onChange([...ingredients, ingredient]);
    toast.success(`${common.name} added to ingredients`);
  };

  const toggleAllergen = (ingredientId: string, allergen: string) => {
    const ingredient = ingredients.find(ing => ing._id === ingredientId);
    if (!ingredient) return;

    const allergenInfo = ingredient.allergenInfo || [];
    const hasAllergen = allergenInfo.includes(allergen);
    
    const updatedAllergens = hasAllergen
      ? allergenInfo.filter(a => a !== allergen)
      : [...allergenInfo, allergen];

    updateIngredient(ingredientId, { allergenInfo: updatedAllergens });
  };

  const reorderIngredients = (fromIndex: number, toIndex: number) => {
    const reorderedIngredients = [...ingredients];
    const [removed] = reorderedIngredients.splice(fromIndex, 1);
    reorderedIngredients.splice(toIndex, 0, removed);
    onChange(reorderedIngredients);
  };

  return (
    <div className="space-y-6">
      {/* Existing Ingredients */}
      {ingredients.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Ingredients ({ingredients.length})</h4>
            <Button variant="outline" size="sm">
              <Icons.move className="mr-2 h-4 w-4" />
              Reorder
            </Button>
          </div>
          
          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <Card key={ingredient._id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground min-w-[20px]">
                        {index + 1}.
                      </span>
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <Icons.gripVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Ingredient Name</Label>
                          <Input
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(ingredient._id, { name: e.target.value })}
                            placeholder="e.g., All-purpose flour"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            value={ingredient.quantity || ''}
                            onChange={(e) => updateIngredient(ingredient._id, { quantity: e.target.value })}
                            placeholder="e.g., 2"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Unit</Label>
                          <Select
                            value={ingredient.unit}
                            onValueChange={(value) => updateIngredient(ingredient._id, { unit: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Origin/Source (Optional)</Label>
                        <Input
                          value={ingredient.origin || ''}
                          onChange={(e) => updateIngredient(ingredient._id, { origin: e.target.value })}
                          placeholder="e.g., Local farm, Organic supplier"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Allergen Information</Label>
                        <div className="flex flex-wrap gap-2">
                          {allergenTypes.map((allergen) => {
                            const isSelected = ingredient.allergenInfo?.includes(allergen);
                            return (
                              <Button
                                key={allergen}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleAllergen(ingredient._id, allergen)}
                                className="h-7 text-xs"
                              >
                                {allergen}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={ingredient.isOrganic}
                            onCheckedChange={(checked) => updateIngredient(ingredient._id, { isOrganic: checked })}
                          />
                          <Label className="text-sm">Organic</Label>
                          {ingredient.isOrganic && (
                            <Badge variant="secondary" className="text-green-600">
                              <Icons.leaf className="mr-1 h-3 w-3" />
                              Organic
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIngredient(ingredient._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Icons.trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Add Common Ingredients */}
      <div className="space-y-3">
        <h4 className="font-medium">Quick Add Common Ingredients</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {commonIngredients
            .filter(common => !ingredients.some(ing => ing.name.toLowerCase() === common.name.toLowerCase()))
            .map((common, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => addCommonIngredient(common)}
                className="h-auto p-2 text-left justify-start"
              >
                <span className="text-xs">{common.name}</span>
              </Button>
            ))
          }
        </div>
      </div>

      {/* Add New Ingredient */}
      {isAddingNew ? (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Add New Ingredient</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingNew(false)}
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Ingredient Name *</Label>
                  <Input
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Dark chocolate"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="e.g., 2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select
                    value={newIngredient.unit}
                    onValueChange={(value) => setNewIngredient(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Origin/Source</Label>
                <Input
                  value={newIngredient.origin}
                  onChange={(e) => setNewIngredient(prev => ({ ...prev, origin: e.target.value }))}
                  placeholder="e.g., Local organic farm"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={newIngredient.isOrganic}
                  onCheckedChange={(checked) => setNewIngredient(prev => ({ ...prev, isOrganic: checked }))}
                />
                <Label>Organic ingredient</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
                <Button onClick={addIngredient}>
                  Add Ingredient
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAddingNew(true)} variant="outline" className="w-full">
          <Icons.plus className="mr-2 h-4 w-4" />
          Add Custom Ingredient
        </Button>
      )}

      {/* Help Text */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icons.info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-2">Ingredient Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• List ingredients in order of quantity (most to least)</li>
                <li>• Be specific with measurements for accuracy</li>
                <li>• Mark allergens to help customers with dietary restrictions</li>
                <li>• Include origin information for premium or local ingredients</li>
                <li>• Use drag and drop to reorder ingredients</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}