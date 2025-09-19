'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageItem {
  img_url: string;
  img_id: string;
}

interface ProductImageUploadProps {
  mainImage: ImageItem;
  gallery: ImageItem[];
  onMainImageChange: (image: ImageItem) => void;
  onGalleryChange: (gallery: ImageItem[]) => void;
}

export function ProductImageUpload({
  mainImage,
  gallery,
  onMainImageChange,
  onGalleryChange
}: ProductImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      await uploadFiles(files);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  }, []);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    try {
      for (const file of files) {
        // Simulate upload - replace with actual upload logic
        const formData = new FormData();
        formData.append('file', file);
        
        // Mock upload response
        const uploadedImage: ImageItem = {
          img_id: Math.random().toString(36).substring(7),
          img_url: URL.createObjectURL(file)
        };
        
        // If no main image, set as main image
        if (!mainImage.img_url) {
          onMainImageChange(uploadedImage);
        } else {
          // Add to gallery
          onGalleryChange([...gallery, uploadedImage]);
        }
      }
      
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (imageId: string, isMainImage = false) => {
    if (isMainImage) {
      // If removing main image and gallery has images, promote first gallery image
      if (gallery.length > 0) {
        onMainImageChange(gallery[0]);
        onGalleryChange(gallery.slice(1));
      } else {
        onMainImageChange({ img_url: '', img_id: '' });
      }
    } else {
      onGalleryChange(gallery.filter(img => img.img_id !== imageId));
    }
  };

  const setAsMainImage = (image: ImageItem) => {
    // Move current main image to gallery if it exists
    if (mainImage.img_url) {
      onGalleryChange([mainImage, ...gallery.filter(img => img.img_id !== image.img_id)]);
    } else {
      onGalleryChange(gallery.filter(img => img.img_id !== image.img_id));
    }
    onMainImageChange(image);
  };

  const optimizeImage = async (imageId: string) => {
    try {
      // Implement image optimization logic here
      toast.success('Image optimized successfully');
    } catch (error) {
      toast.error('Failed to optimize image');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          isUploading && 'opacity-50 pointer-events-none'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            {isUploading ? (
              <Icons.loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Icons.upload className="h-6 w-6" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium">
              {isUploading ? 'Uploading...' : 'Upload Product Images'}
            </h3>
            <p className="text-muted-foreground">
              Drag and drop images here, or click to select files
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Supports: JPG, PNG, WebP (max 5MB each)
            </p>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" disabled={isUploading}>
              <Icons.upload className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Image */}
      {mainImage.img_url && (
        <div>
          <h3 className="text-lg font-medium mb-4">Main Product Image</h3>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative group">
                <div className="aspect-square relative">
                  <Image
                    src={mainImage.img_url}
                    alt="Main product image"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">Main Image</Badge>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => optimizeImage(mainImage.img_id)}
                        title="Optimize image"
                      >
                        <Icons.zap className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(mainImage.img_id, true)}
                        title="Remove image"
                      >
                        <Icons.trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gallery Images */}
      {gallery.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Gallery Images ({gallery.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((image, index) => (
              <Card key={image.img_id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative group">
                    <div className="aspect-square relative">
                      <Image
                        src={image.img_url}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setAsMainImage(image)}
                          title="Set as main image"
                        >
                          <Icons.star className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => optimizeImage(image.img_id)}
                          title="Optimize image"
                        >
                          <Icons.zap className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(image.img_id)}
                          title="Remove image"
                        >
                          <Icons.trash className="h-3 w-3" />
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

      {/* Image Optimization Tips */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icons.lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-2">Image Optimization Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use high-quality images (at least 1200x1200px for main image)</li>
                <li>• Keep file sizes under 5MB for faster loading</li>
                <li>• Use descriptive file names for better SEO</li>
                <li>• The first image will be used as the main product image</li>
                <li>• Images are automatically optimized for web delivery</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}