'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/ui/icons';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { FileUpload } from '@/types/cms';

// Mock data - replace with actual API calls
const mockFiles: FileUpload[] = [
  {
    _id: '1',
    originalName: 'chocolate-cake-hero.jpg',
    fileName: 'chocolate-cake-hero-optimized.webp',
    mimeType: 'image/webp',
    size: 245760,
    path: '/uploads/2024/01/',
    url: '/images/chocolate-cake.jpg',
    uploadedBy: 'admin',
    uploadedAt: new Date('2024-01-15T10:00:00Z'),
    tags: ['cake', 'chocolate', 'hero', 'product'],
    description: 'Main hero image for chocolate birthday cake'
  },
  {
    _id: '2',
    originalName: 'vanilla-cupcakes.png',
    fileName: 'vanilla-cupcakes-compressed.webp',
    mimeType: 'image/webp',
    size: 189440,
    path: '/uploads/2024/01/',
    url: '/images/vanilla-cupcakes.jpg',
    uploadedBy: 'admin',
    uploadedAt: new Date('2024-01-12T14:30:00Z'),
    tags: ['cupcakes', 'vanilla', 'product'],
    description: 'Product image for vanilla cupcakes 12-pack'
  },
  {
    _id: '3',
    originalName: 'bakery-storefront.jpg',
    fileName: 'bakery-storefront-banner.webp',
    mimeType: 'image/webp',
    size: 512000,
    path: '/uploads/2024/01/',
    url: '/images/bakery-banner.jpg',
    uploadedBy: 'editor',
    uploadedAt: new Date('2024-01-10T09:15:00Z'),
    tags: ['banner', 'storefront', 'about'],
    description: 'Bakery storefront image for about page banner'
  }
];

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'date' | 'size' | 'type';

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<FileUpload[]>(mockFiles);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileUpload | null>(null);

  const filteredAndSortedFiles = files
    .filter(file => {
      const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || file.mimeType.startsWith(filterType);
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.originalName.localeCompare(b.originalName);
        case 'date':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'size':
          return b.size - a.size;
        case 'type':
          return a.mimeType.localeCompare(b.mimeType);
        default:
          return 0;
      }
    });

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
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    await uploadFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    await uploadFiles(selectedFiles);
  }, []);

  const uploadFiles = async (filesToUpload: File[]) => {
    setIsUploading(true);
    try {
      for (const file of filesToUpload) {
        // Simulate upload - replace with actual upload logic
        const uploadedFile: FileUpload = {
          _id: Math.random().toString(36).substring(7),
          originalName: file.name,
          fileName: file.name.replace(/\.[^/.]+$/, '') + '-optimized.webp',
          mimeType: file.type,
          size: file.size,
          path: '/uploads/2024/01/',
          url: URL.createObjectURL(file),
          uploadedBy: 'admin',
          uploadedAt: new Date(),
          tags: [],
          description: ''
        };
        
        setFiles(prev => [uploadedFile, ...prev]);
      }
      
      toast.success(`${filesToUpload.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload files');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const selectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAllFiles = () => {
    setSelectedFiles(
      selectedFiles.length === filteredAndSortedFiles.length 
        ? [] 
        : filteredAndSortedFiles.map(f => f._id)
    );
  };

  const deleteFiles = (fileIds: string[]) => {
    setFiles(prev => prev.filter(file => !fileIds.includes(file._id)));
    setSelectedFiles([]);
    toast.success(`${fileIds.length} file(s) deleted`);
  };

  const updateFileMetadata = (fileId: string, updates: Partial<FileUpload>) => {
    setFiles(prev => prev.map(file => 
      file._id === fileId ? { ...file, ...updates } : file
    ));
    toast.success('File updated successfully');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Icons.image;
    if (mimeType.startsWith('video/')) return Icons.video;
    if (mimeType.includes('pdf')) return Icons.fileText;
    return Icons.file;
  };

  const FileGridItem = ({ file }: { file: FileUpload }) => {
    const isSelected = selectedFiles.includes(file._id);
    const isImage = file.mimeType.startsWith('image/');
    const FileIcon = getFileIcon(file.mimeType);

    return (
      <Card 
        className={cn(
          'group cursor-pointer transition-all hover:shadow-md',
          isSelected && 'ring-2 ring-primary'
        )}
        onClick={() => selectFile(file._id)}
      >
        <CardContent className="p-0">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            {isImage ? (
              <Image
                src={file.url}
                alt={file.originalName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <FileIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            <div className="absolute top-2 left-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => selectFile(file._id)}
                className="bg-background"
              />
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Icons.moreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedFile(file)}>
                    <Icons.edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.copy className="mr-2 h-4 w-4" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => deleteFiles([file._id])}
                  >
                    <Icons.trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="p-3">
            <h3 className="font-medium text-sm truncate" title={file.originalName}>
              {file.originalName}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
              <Badge variant="outline" className="text-xs">
                {file.mimeType.split('/')[1].toUpperCase()}
              </Badge>
            </div>
            {file.tags && file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {file.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-1">
                    {tag}
                  </Badge>
                ))}
                {file.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs px-1">
                    +{file.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your images, videos, and other media files
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Icons.upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Upload Zone */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          isUploading && 'opacity-50 pointer-events-none'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
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
                {isUploading ? 'Uploading files...' : 'Drop files here to upload'}
              </h3>
              <p className="text-muted-foreground">
                Or click to select files from your computer
              </p>
            </div>
            <Button variant="outline" disabled={isUploading}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-80">
            <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Icons.filter className="mr-2 h-4 w-4" />
                {filterType === 'all' ? 'All Files' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                All Files
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('image')}>
                Images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('video')}>
                Videos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('document')}>
                Documents
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Icons.arrowUpDown className="mr-2 h-4 w-4" />
                Sort by {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('size')}>
                Size
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('type')}>
                Type
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedFiles.length > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => deleteFiles(selectedFiles)}
                className="text-red-600"
              >
                <Icons.trash className="mr-2 h-4 w-4" />
                Delete ({selectedFiles.length})
              </Button>
              <Button variant="outline" size="sm">
                <Icons.download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </>
          )}
          
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Icons.grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <Icons.list className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Selection Controls */}
      {filteredAndSortedFiles.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedFiles.length === filteredAndSortedFiles.length}
              onCheckedChange={selectAllFiles}
            />
            <span className="text-sm">
              {selectedFiles.length === 0 
                ? `${filteredAndSortedFiles.length} files`
                : `${selectedFiles.length} of ${filteredAndSortedFiles.length} selected`
              }
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Total size: {formatFileSize(
              filteredAndSortedFiles.reduce((sum, file) => sum + file.size, 0)
            )}
          </div>
        </div>
      )}

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredAndSortedFiles.map((file) => (
            <FileGridItem key={file._id} file={file} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredAndSortedFiles.map((file, index) => {
                const isSelected = selectedFiles.includes(file._id);
                const isImage = file.mimeType.startsWith('image/');
                const FileIcon = getFileIcon(file.mimeType);
                
                return (
                  <div
                    key={file._id}
                    className={cn(
                      'flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer',
                      isSelected && 'bg-primary/5',
                      index !== filteredAndSortedFiles.length - 1 && 'border-b'
                    )}
                    onClick={() => selectFile(file._id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => selectFile(file._id)}
                    />
                    
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      {isImage ? (
                        <Image
                          src={file.url}
                          alt={file.originalName}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <FileIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{file.originalName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.mimeType.split('/')[1].toUpperCase()}</span>
                        <span>•</span>
                        <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {file.tags?.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Icons.moreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSelectedFile(file)}>
                          <Icons.edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Icons.download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Icons.copy className="mr-2 h-4 w-4" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => deleteFiles([file._id])}
                        >
                          <Icons.trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredAndSortedFiles.length === 0 && (
        <div className="text-center py-12">
          <Icons.image className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No files found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
          </p>
        </div>
      )}

      {/* File Edit Dialog */}
      {selectedFile && (
        <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit File Details</DialogTitle>
              <DialogDescription>
                Update the metadata and tags for this file
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>File Name</Label>
                  <Input
                    value={selectedFile.originalName}
                    onChange={(e) => setSelectedFile(prev => 
                      prev ? { ...prev, originalName: e.target.value } : null
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>File Size</Label>
                  <Input value={formatFileSize(selectedFile.size)} disabled />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={selectedFile.description || ''}
                  onChange={(e) => setSelectedFile(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                  placeholder="Add a description for this file..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  value={selectedFile.tags?.join(', ') || ''}
                  onChange={(e) => setSelectedFile(prev => 
                    prev ? { ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } : null
                  )}
                  placeholder="Enter tags separated by commas"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedFile(null)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (selectedFile) {
                    updateFileMetadata(selectedFile._id, selectedFile);
                    setSelectedFile(null);
                  }
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}