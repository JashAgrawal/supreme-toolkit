"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  CheckCircle,
  ArrowLeft,
  FileImage,
  Cloud
} from 'lucide-react';
import Link from 'next/link';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  preview?: string;
}

export default function ImageUploaderPreview() {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newUploads: UploadFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading',
      preview: URL.createObjectURL(file),
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Simulate upload progress
    newUploads.forEach((upload) => {
      simulateUpload(upload.id);
    });
  };

  const simulateUpload = (uploadId: string) => {
    const interval = setInterval(() => {
      setUploads(prev => prev.map(upload => {
        if (upload.id === uploadId) {
          const newProgress = Math.min(upload.progress + Math.random() * 20, 100);
          return {
            ...upload,
            progress: newProgress,
            status: newProgress === 100 ? 'completed' : 'uploading'
          };
        }
        return upload;
      }));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, progress: 100, status: 'completed' }
          : upload
      ));
    }, 2000 + Math.random() * 2000);
  };

  const removeUpload = (uploadId: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== uploadId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs/modules/image-uploader">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Image Uploader Preview</h1>
            <p className="text-muted-foreground">Interactive demo of the image upload system</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Live Demo</Badge>
          <Badge variant="outline">Drag & Drop</Badge>
        </div>
      </div>

      <Tabs defaultValue="demo" className="space-y-6">
        <TabsList>
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="demo">
          <div className="space-y-6">
            {/* Upload Area */}
            <Card
              className={`border-2 border-dashed transition-colors cursor-pointer ${
                isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="mb-4">
                    {isDragOver ? (
                      <Upload className="h-12 w-12 mx-auto text-primary" />
                    ) : (
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your images here, or click to browse
                  </p>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                  <div className="mt-4 text-xs text-muted-foreground space-y-1">
                    <p>Supported formats: JPG, PNG, WEBP, GIF</p>
                    <p>Maximum file size: 10MB</p>
                    <p>Maximum files: 10</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />

            {/* Upload Progress */}
            {uploads.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload Progress</CardTitle>
                  <CardDescription>
                    {uploads.filter(u => u.status === 'completed').length} of {uploads.length} files uploaded
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {uploads.map((upload) => (
                    <div key={upload.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      {/* Preview */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border flex-shrink-0">
                        {upload.preview ? (
                          <img
                            src={upload.preview}
                            alt={upload.file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileImage className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{upload.file.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {formatFileSize(upload.file.size)}
                          </Badge>
                          {upload.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        
                        {upload.status === 'uploading' && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Uploading...</span>
                              <span>{Math.round(upload.progress)}%</span>
                            </div>
                            <Progress value={upload.progress} className="h-2" />
                          </div>
                        )}
                        
                        {upload.status === 'completed' && (
                          <p className="text-xs text-green-600">Upload complete</p>
                        )}
                      </div>

                      {/* Actions */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUpload(upload.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuration</CardTitle>
                <CardDescription>Current upload settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Provider</p>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Cloud className="h-3 w-3" />
                      Cloudinary
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Max File Size</p>
                    <p className="text-muted-foreground">10 MB</p>
                  </div>
                  <div>
                    <p className="font-medium">Max Files</p>
                    <p className="text-muted-foreground">10 files</p>
                  </div>
                  <div>
                    <p className="font-medium">Formats</p>
                    <p className="text-muted-foreground">JPG, PNG, WEBP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Drag & Drop</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Intuitive drag and drop interface for easy file selection and upload.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time upload progress with visual indicators and status updates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cloud Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Integration with Cloudinary, S3, and other cloud storage providers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Image Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatic image compression and optimization for better performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">File Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comprehensive validation for file types, sizes, and image dimensions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thumbnail Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatic thumbnail generation in multiple sizes for different use cases.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
