'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { NutritionInfo } from '@/types/cms';
import { toast } from 'sonner';

interface NutritionInfoManagerProps {
  nutrition: NutritionInfo | null;
  onChange: (nutrition: NutritionInfo | null) => void;
}

const nutritionFields = [
  { key: 'calories', label: 'Calories', unit: 'kcal', required: true },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbohydrates', label: 'Carbohydrates', unit: 'g' },
  { key: 'fat', label: 'Total Fat', unit: 'g' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
  { key: 'sugar', label: 'Sugar', unit: 'g' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' }
];

const defaultNutrition: NutritionInfo = {
  servingSize: '',
  calories: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
  additionalInfo: {}
};

export function NutritionInfoManager({ nutrition, onChange }: NutritionInfoManagerProps) {
  const [isEditing, setIsEditing] = useState(!!nutrition);
  const [newAdditionalField, setNewAdditionalField] = useState({ name: '', value: '', unit: '' });

  const currentNutrition = nutrition || defaultNutrition;

  const updateField = (field: keyof NutritionInfo, value: any) => {
    const updated = { ...currentNutrition, [field]: value };
    onChange(updated);
  };

  const updateNumericField = (field: keyof NutritionInfo, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateField(field, numValue);
  };

  const addAdditionalField = () => {
    if (!newAdditionalField.name || !newAdditionalField.value) {
      toast.error('Please fill in all fields');
      return;
    }

    const additionalInfo = {
      ...currentNutrition.additionalInfo,
      [newAdditionalField.name]: newAdditionalField.unit 
        ? `${newAdditionalField.value} ${newAdditionalField.unit}`
        : newAdditionalField.value
    };

    updateField('additionalInfo', additionalInfo);
    setNewAdditionalField({ name: '', value: '', unit: '' });
    toast.success('Additional nutrition info added');
  };

  const removeAdditionalField = (fieldName: string) => {
    const additionalInfo = { ...currentNutrition.additionalInfo };
    delete additionalInfo[fieldName];
    updateField('additionalInfo', additionalInfo);
    toast.success('Field removed');
  };

  const clearNutritionInfo = () => {
    onChange(null);
    setIsEditing(false);
    toast.success('Nutrition information cleared');
  };

  const calculatePercentDV = (nutrient: string, value: number) => {
    // Daily Value percentages based on 2000 calorie diet
    const dailyValues: { [key: string]: number } = {
      fat: 65,
      sodium: 2300,
      carbohydrates: 300,
      fiber: 25,
      protein: 50
    };

    if (dailyValues[nutrient]) {
      return Math.round((value / dailyValues[nutrient]) * 100);
    }
    return null;
  };

  if (!isEditing) {
    return (
      <div className="text-center py-8">
        <Icons.activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Nutrition Information</h3>
        <p className="text-muted-foreground mb-4">
          Add detailed nutrition facts to help customers make informed choices
        </p>
        <Button onClick={() => setIsEditing(true)}>
          <Icons.plus className="mr-2 h-4 w-4" />
          Add Nutrition Information
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Serving Size */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Nutrition Facts</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearNutritionInfo}
                className="text-red-600 hover:text-red-700"
              >
                <Icons.trash className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Serving Size *</Label>
              <Input
                value={currentNutrition.servingSize}
                onChange={(e) => updateField('servingSize', e.target.value)}
                placeholder="e.g., 1 slice (85g)"
              />
              <p className="text-xs text-muted-foreground">
                Specify the serving size for all nutrition values below
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Nutrition Fields */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Nutrition Values</h4>
            
            <div className="grid gap-4 md:grid-cols-2">
              {nutritionFields.map((field) => {
                const value = currentNutrition[field.key as keyof NutritionInfo] as number || 0;
                const percentDV = calculatePercentDV(field.key, value);
                
                return (
                  <div key={field.key} className="space-y-2">
                    <Label className="flex items-center gap-1">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={value || ''}
                        onChange={(e) => updateNumericField(field.key as keyof NutritionInfo, e.target.value)}
                        placeholder="0"
                      />
                      <span className="text-sm text-muted-foreground min-w-[30px]">
                        {field.unit}
                      </span>
                      {percentDV && (
                        <span className="text-xs text-muted-foreground min-w-[40px]">
                          {percentDV}% DV
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Nutrition Information */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Additional Information</h4>
            
            {/* Existing Additional Fields */}
            {Object.entries(currentNutrition.additionalInfo || {}).length > 0 && (
              <div className="space-y-2">
                {Object.entries(currentNutrition.additionalInfo || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="ml-2 text-muted-foreground">{value}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAdditionalField(key)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icons.x className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add New Additional Field */}
            <div className="space-y-3 p-3 border rounded-lg">
              <Label className="text-sm font-medium">Add Custom Nutrition Info</Label>
              <div className="grid gap-2 md:grid-cols-3">
                <Input
                  placeholder="Field name (e.g., Vitamin C)"
                  value={newAdditionalField.name}
                  onChange={(e) => setNewAdditionalField(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Value (e.g., 15)"
                  value={newAdditionalField.value}
                  onChange={(e) => setNewAdditionalField(prev => ({ ...prev, value: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Unit (e.g., mg)"
                    value={newAdditionalField.unit}
                    onChange={(e) => setNewAdditionalField(prev => ({ ...prev, unit: e.target.value }))}
                  />
                  <Button onClick={addAdditionalField} size="sm">
                    <Icons.plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Label Preview */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Nutrition Label Preview</h4>
            
            <div className="border rounded-lg p-4 bg-white text-black max-w-md mx-auto">
              <div className="text-center">
                <h3 className="text-2xl font-bold border-b-8 border-black pb-1">Nutrition Facts</h3>
                <div className="text-sm mt-1">
                  {currentNutrition.servingSize && (
                    <div>Serving size: {currentNutrition.servingSize}</div>
                  )}
                </div>
              </div>
              
              <div className="border-t-4 border-black mt-2 pt-1">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold">Calories</span>
                  <span className="text-3xl font-bold">{currentNutrition.calories}</span>
                </div>
              </div>
              
              <div className="border-t border-black mt-2 pt-1 text-sm">
                <div className="text-right font-bold mb-1">% Daily Value*</div>
                
                {nutritionFields.slice(1).map((field) => {
                  const value = currentNutrition[field.key as keyof NutritionInfo] as number || 0;
                  const percentDV = calculatePercentDV(field.key, value);
                  
                  if (value === 0) return null;
                  
                  return (
                    <div key={field.key} className="flex justify-between border-t border-gray-300 py-1">
                      <span className="font-medium">
                        {field.label} {value}{field.unit}
                      </span>
                      {percentDV && <span className="font-bold">{percentDV}%</span>}
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t-4 border-black mt-2 pt-1 text-xs">
                * Percent Daily Values are based on a 2000 calorie diet.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Text */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icons.info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-2">Nutrition Information Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All values should be per serving size specified</li>
                <li>• Calories are required for nutrition labeling</li>
                <li>• Round values to nearest whole number for most nutrients</li>
                <li>• Fiber values can be rounded to nearest 0.5g</li>
                <li>• Use official nutrition analysis when possible</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}