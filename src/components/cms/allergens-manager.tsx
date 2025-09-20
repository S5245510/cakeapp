'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { Allergen } from '@/types/cms';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AllergensManagerProps {
  allergens: Allergen[];
  onChange: (allergens: Allergen[]) => void;
}

const commonAllergens = [
  {
    name: 'Milk',
    severity: 'medium' as const,
    description: 'Contains dairy products including milk, butter, cream',
    icon: '🥛'
  },
  {
    name: 'Eggs',
    severity: 'medium' as const,
    description: 'Contains chicken eggs',
    icon: '🥚'
  },
  {
    name: 'Wheat',
    severity: 'high' as const,
    description: 'Contains gluten from wheat flour',
    icon: '🌾'
  },
  {
    name: 'Soy',
    severity: 'medium' as const,
    description: 'Contains soy products including lecithin',
    icon: '🫘'
  },
  {
    name: 'Tree Nuts',
    severity: 'high' as const,
    description: 'Contains almonds, walnuts, pecans, or other tree nuts',
    icon: '🌰'
  },
  {
    name: 'Peanuts',
    severity: 'high' as const,
    description: 'Contains peanuts or peanut products',
    icon: '🥜'
  },
  {
    name: 'Fish',
    severity: 'high' as const,
    description: 'Contains fish or fish-derived ingredients',
    icon: '🐟'
  },
  {
    name: 'Shellfish',
    severity: 'high' as const,
    description: 'Contains shellfish or shellfish-derived ingredients',
    icon: '🦐'
  },
  {
    name: 'Sesame',
    severity: 'low' as const,
    description: 'Contains sesame seeds or sesame oil',
    icon: '🌱'
  },
  {
    name: 'Artificial Colors',
    severity: 'low' as const,
    description: 'Contains artificial food coloring',
    icon: '🎨'
  }
];

const severityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200'
};

const severityIcons = {
  low: Icons.info,
  medium: Icons.alertTriangle,
  high: Icons.alertCircle
};

export function AllergensManager({ allergens, onChange }: AllergensManagerProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAllergen, setNewAllergen] = useState<Partial<Allergen>>({
    name: '',
    severity: 'medium',
    description: ''
  });

  const addAllergen = () => {
    if (!newAllergen.name) {
      toast.error('Please enter an allergen name');
      return;
    }

    // Check for duplicates
    if (allergens.some(allergen => allergen.name.toLowerCase() === newAllergen.name!.toLowerCase())) {
      toast.error('This allergen is already added');
      return;
    }

    const allergen: Allergen = {
      _id: Math.random().toString(36).substring(7),
      name: newAllergen.name!,
      severity: newAllergen.severity as 'low' | 'medium' | 'high',
      description: newAllergen.description
    };

    onChange([...allergens, allergen]);
    setNewAllergen({
      name: '',
      severity: 'medium',
      description: ''
    });
    setIsAddingNew(false);
    toast.success('Allergen added successfully');
  };

  const updateAllergen = (id: string, updates: Partial<Allergen>) => {
    const updatedAllergens = allergens.map(allergen => 
      allergen._id === id ? { ...allergen, ...updates } : allergen
    );
    onChange(updatedAllergens);
  };

  const removeAllergen = (id: string) => {
    onChange(allergens.filter(allergen => allergen._id !== id));
    toast.success('Allergen removed');
  };

  const addCommonAllergen = (common: typeof commonAllergens[0]) => {
    // Check for duplicates
    if (allergens.some(allergen => allergen.name.toLowerCase() === common.name.toLowerCase())) {
      toast.error(`${common.name} is already added`);
      return;
    }

    const allergen: Allergen = {
      _id: Math.random().toString(36).substring(7),
      name: common.name,
      severity: common.severity,
      description: common.description
    };

    onChange([...allergens, allergen]);
    toast.success(`${common.name} allergen added`);
  };

  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    const IconComponent = severityIcons[severity];
    return <IconComponent className="h-4 w-4" />;
  };

  const getAllergenWarningLevel = () => {
    if (allergens.length === 0) return null;
    
    const hasHigh = allergens.some(a => a.severity === 'high');
    const hasMedium = allergens.some(a => a.severity === 'medium');
    
    if (hasHigh) return 'high';
    if (hasMedium) return 'medium';
    return 'low';
  };

  const warningLevel = getAllergenWarningLevel();

  return (
    <div className="space-y-6">
      {/* Overall Allergen Warning */}
      {allergens.length > 0 && warningLevel && (
        <Card className={cn('border-2', severityColors[warningLevel])}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {getSeverityIcon(warningLevel)}
              <div>
                <h4 className="font-medium">
                  {warningLevel === 'high' && 'High Allergen Risk'}
                  {warningLevel === 'medium' && 'Moderate Allergen Risk'}
                  {warningLevel === 'low' && 'Low Allergen Risk'}
                </h4>
                <p className="text-sm">
                  This product contains {allergens.length} known allergen{allergens.length > 1 ? 's' : ''}. 
                  Please review the list carefully.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Allergens */}
      {allergens.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Current Allergens ({allergens.length})</h4>
          <div className="grid gap-3">
            {allergens.map((allergen) => {
              const SeverityIcon = severityIcons[allergen.severity];
              return (
                <Card key={allergen._id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'rounded-lg p-2 flex items-center justify-center',
                        severityColors[allergen.severity]
                      )}>
                        <SeverityIcon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Allergen Name</Label>
                            <Input
                              value={allergen.name}
                              onChange={(e) => updateAllergen(allergen._id, { name: e.target.value })}
                              placeholder="e.g., Tree Nuts"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Severity Level</Label>
                            <Select
                              value={allergen.severity}
                              onValueChange={(value) => updateAllergen(allergen._id, { severity: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">
                                  <div className="flex items-center gap-2">
                                    <Icons.info className="h-4 w-4 text-green-600" />
                                    Low Risk
                                  </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                  <div className="flex items-center gap-2">
                                    <Icons.alertTriangle className="h-4 w-4 text-yellow-600" />
                                    Medium Risk
                                  </div>
                                </SelectItem>
                                <SelectItem value="high">
                                  <div className="flex items-center gap-2">
                                    <Icons.alertCircle className="h-4 w-4 text-red-600" />
                                    High Risk
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs">Description</Label>
                          <Textarea
                            value={allergen.description}
                            onChange={(e) => updateAllergen(allergen._id, { description: e.target.value })}
                            placeholder="Describe the allergen and its sources..."
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge className={severityColors[allergen.severity]}>
                            {allergen.severity.charAt(0).toUpperCase() + allergen.severity.slice(1)} Risk
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAllergen(allergen._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Icons.trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Add Common Allergens */}
      <div className="space-y-3">
        <h4 className="font-medium">Quick Add Common Allergens</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {commonAllergens
            .filter(common => !allergens.some(allergen => allergen.name.toLowerCase() === common.name.toLowerCase()))
            .map((common, index) => {
              const SeverityIcon = severityIcons[common.severity];
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => addCommonAllergen(common)}
                  className="h-auto p-3 flex items-start gap-3 text-left justify-start"
                >
                  <div className="text-lg">{common.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{common.name}</span>
                      <SeverityIcon className={cn(
                        'h-3 w-3',
                        common.severity === 'high' && 'text-red-600',
                        common.severity === 'medium' && 'text-yellow-600',
                        common.severity === 'low' && 'text-green-600'
                      )} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {common.description}
                    </p>
                  </div>
                </Button>
              );
            })
          }
        </div>
      </div>

      {/* Add New Allergen */}
      {isAddingNew ? (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Add Custom Allergen</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingNew(false)}
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Allergen Name *</Label>
                  <Input
                    value={newAllergen.name}
                    onChange={(e) => setNewAllergen(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Sulfites"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Severity Level</Label>
                  <Select
                    value={newAllergen.severity}
                    onValueChange={(value) => setNewAllergen(prev => ({ ...prev, severity: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <Icons.info className="h-4 w-4 text-green-600" />
                          Low Risk
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <Icons.alertTriangle className="h-4 w-4 text-yellow-600" />
                          Medium Risk
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <Icons.alertCircle className="h-4 w-4 text-red-600" />
                          High Risk
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newAllergen.description}
                  onChange={(e) => setNewAllergen(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the allergen and potential sources..."
                  rows={2}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
                <Button onClick={addAllergen}>
                  Add Allergen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAddingNew(true)} variant="outline" className="w-full">
          <Icons.plus className="mr-2 h-4 w-4" />
          Add Custom Allergen
        </Button>
      )}

      {/* Help Text */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icons.info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-2">Allergen Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>High Risk:</strong> Life-threatening allergies (nuts, shellfish)</li>
                <li>• <strong>Medium Risk:</strong> Common allergies with moderate reactions</li>
                <li>• <strong>Low Risk:</strong> Mild sensitivities or intolerances</li>
                <li>• Always include &quot;may contain&quot; warnings for cross-contamination</li>
                <li>• Keep allergen information up-to-date and accurate</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}