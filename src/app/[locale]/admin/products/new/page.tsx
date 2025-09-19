'use client';

import { ProductEditor } from '@/components/admin/ProductEditor';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProductData {
  name: { en: string; zh: string };
  description: { en: string; zh: string };
  shortDescription: { en: string; zh: string };
  price: number;
  compareAtPrice?: number;
  category: string;
  tags: string[];
  images: string[];
  ingredients: Array<{
    id: string;
    name: string;
    isOrganic: boolean;
    allergens: string[];
  }>;
  nutrition: {
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
    sugar: number;
    fiber: number;
  };
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

export default function NewProductPage() {
  const router = useRouter();

  const handleSave = async (data: ProductData) => {
    try {
      // Here you would typically make an API call to save the product
      console.log('Saving product:', data);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      toast.success('Product created successfully!');

      // Redirect to products list
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  return (
    <ProductEditor
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}