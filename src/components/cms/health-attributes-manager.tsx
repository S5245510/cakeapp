'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { HealthAttribute } from '@/types/cms';
import { toast } from 'sonner';

interface HealthAttributesManagerProps {
  attributes: HealthAttribute[];
  onChange: (attributes: HealthAttribute[]) => void;
}

const presetAttributes = [
  { name: 'Gluten-Free', icon: 'wheat', description: 'Does not contain gluten' },
  { name: 'Organic', icon: 'leaf', description: 'Made with organic ingredients' },
  { name: 'Vegan', icon: 'sprout', description: 'Contains no animal products' },
  { name: 'Sugar-Free', icon: 'droplet', description: 'No added sugars' },
  { name: 'Low Calorie', icon: 'activity', description: 'Lower calorie option' },
  { name: 'Keto-Friendly', icon: 'zap', description: 'Suitable for ketogenic diet' },
  { name: 'Dairy-Free', icon: 'milk', description: 'Contains no dairy products' },
  { name: 'Nut-Free', icon: 'alertTriangle', description: 'Free from tree nuts' },
  { name: 'Preservative-Free', icon: 'shield', description: 'No artificial preservatives' },
  { name: 'Local Sourced', icon: 'mapPin', description: 'Ingredients sourced locally' }
];

const iconOptions = [
  'heart', 'leaf', 'wheat', 'droplet', 'activity', 'zap', 'shield', 
  'sprout', 'milk', 'alertTriangle', 'mapPin', 'star', 'check'
];

export function HealthAttributesManager({ attributes, onChange }: HealthAttributesManagerProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAttribute, setNewAttribute] = useState<Partial<HealthAttribute>>({
    name: '',
    value: '',
    icon: 'heart',
    description: '',
    verified: false
  });

  const addAttribute = () => {
    if (!newAttribute.name || !newAttribute.value) {
      toast.error('Please fill in all required fields');
      return;
    }

    const attribute: HealthAttribute = {
      _id: Math.random().toString(36).substring(7),
      name: newAttribute.name!,
      value: newAttribute.value!,
      icon: newAttribute.icon!,
      description: newAttribute.description!,
      verified: newAttribute.verified!
    };

    onChange([...attributes, attribute]);
    setNewAttribute({
      name: '',
      value: '',
      icon: 'heart',
      description: '',
      verified: false
    });
    setIsAddingNew(false);
    toast.success('Health attribute added successfully');
  };

  const updateAttribute = (id: string, updates: Partial<HealthAttribute>) => {
    const updatedAttributes = attributes.map(attr => 
      attr._id === id ? { ...attr, ...updates } : attr
    );
    onChange(updatedAttributes);
  };

  const removeAttribute = (id: string) => {
    onChange(attributes.filter(attr => attr._id !== id));
    toast.success('Health attribute removed');
  };

  const addPresetAttribute = (preset: typeof presetAttributes[0]) => {
    const attribute: HealthAttribute = {
      _id: Math.random().toString(36).substring(7),
      name: preset.name,
      value: 'Yes',
      icon: preset.icon,
      description: preset.description,
      verified: true
    };

    onChange([...attributes, attribute]);
    toast.success(`${preset.name} attribute added`);
  };

  return (
    <div className="space-y-6">
      {/* Existing Attributes */}
      {attributes.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Current Health Attributes</h4>
          <div className="grid gap-4">
            {attributes.map((attribute) => {
              const IconComponent = Icons[attribute.icon as keyof typeof Icons] || Icons.heart;
              return (
                <Card key={attribute._id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Attribute Name</Label>
                            <Input
                              value={attribute.name}
                              onChange={(e) => updateAttribute(attribute._id, { name: e.target.value })}
                              placeholder="e.g., Gluten-Free"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Value</Label>
                            <Input
                              value={attribute.value}
                              onChange={(e) => updateAttribute(attribute._id, { value: e.target.value })}
                              placeholder="e.g., Yes, No, 50g"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs">Description</Label>
                          <Textarea
                            value={attribute.description}
                            onChange={(e) => updateAttribute(attribute._id, { description: e.target.value })}
                            placeholder="Describe this health attribute..."
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={attribute.verified}
                                onCheckedChange={(checked) => updateAttribute(attribute._id, { verified: checked })}
                              />
                              <Label className="text-sm">Verified</Label>
                            </div>
                            {attribute.verified && (
                              <Badge variant="secondary" className="text-green-600">
                                <Icons.checkCircle className="mr-1 h-3 w-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttribute(attribute._id)}
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

      {/* Quick Add Presets */}
      <div className="space-y-3">
        <h4 className="font-medium">Quick Add Common Attributes</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {presetAttributes
            .filter(preset => !attributes.some(attr => attr.name === preset.name))
            .map((preset, index) => {
              const IconComponent = Icons[preset.icon as keyof typeof Icons] || Icons.heart;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => addPresetAttribute(preset)}
                  className="h-auto p-3 flex flex-col gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs text-center">{preset.name}</span>
                </Button>
              );
            })
          }
        </div>
      </div>

      {/* Add New Attribute */}
      {isAddingNew ? (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Add New Health Attribute</h4>
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
                  <Label>Attribute Name *</Label>
                  <Input
                    value={newAttribute.name}
                    onChange={(e) => setNewAttribute(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Gluten-Free"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Value *</Label>
                  <Input
                    value={newAttribute.value}
                    onChange={(e) => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="e.g., Yes, No, 50g"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select
                  value={newAttribute.icon}
                  onValueChange={(value) => setNewAttribute(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => {
                      const IconComponent = Icons[icon as keyof typeof Icons];
                      return (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="capitalize">{icon}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newAttribute.description}
                  onChange={(e) => setNewAttribute(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this health attribute..."
                  rows={2}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={newAttribute.verified}
                  onCheckedChange={(checked) => setNewAttribute(prev => ({ ...prev, verified: checked }))}
                />
                <Label>Mark as verified</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
                <Button onClick={addAttribute}>
                  Add Attribute
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAddingNew(true)} variant="outline" className="w-full">
          <Icons.plus className="mr-2 h-4 w-4" />
          Add Custom Health Attribute
        </Button>
      )}

      {/* Help Text */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icons.info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-2">About Health Attributes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Health attributes help customers make informed dietary choices</li>
                <li>• Verified attributes are highlighted to customers with a trust badge</li>
                <li>• Use clear, simple language that customers will understand</li>
                <li>• Include specific values when possible (e.g., &quot;5g sugar&quot; vs &quot;Low sugar&quot;)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}