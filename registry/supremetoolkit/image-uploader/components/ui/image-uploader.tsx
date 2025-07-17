"use client";

import { useCallback, useRef,useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  RotateCcw, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useImageUpload } from '../../hooks/use-image-upload';
import { ImageDropzone } from './image-dropzone';
import { ImagePreview } from './image-preview';
import type { ImageUploaderProps } from '../../types';
import { cn } from '@/lib/utils';

export function ImageUploader({
  userId,
  folder,
  maxFiles = 10,
  maxFileSize = 10,
  allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  enableThumbnails = true,
  enableDragDrop = true,
  enablePasteUpload = true,
  showProgress = true,
  showPreview = true,
  multiple = true,
  className,
  onUploadComplete,
  onUploadError,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploads,
    isUploading,
    error,
    uploadImages,
    removeUpload,
    clearUploads,
    retryUpload,
  } = useImageUpload({
    userId,
    folder,
    maxFiles,
    maxFileSize,
    allowedFormats,
    enableThumbnails,
    onUploadComplete,
    onUploadError,
  });

  const handleFileSelect = useCallback((files: File[]) => {
    uploadImages(files);
  }, [uploadImages]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle paste upload
  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (!enablePasteUpload) return;

    const items = Array.from(e.clipboardData?.items || []);
    const imageFiles = items
      .filter(item => item.type.startsWith('image/'))
      .map(item => item.getAsFile())
      .filter(Boolean) as File[];

    if (imageFiles.length > 0) {
      handleFileSelect(imageFiles);
    }
  }, [enablePasteUpload, handleFileSelect]);

  // Add paste event listener
  useEffect(() => {
    if (enablePasteUpload) {
      document.addEventListener('paste', handlePaste);
      return () => document.removeEventListener('paste', handlePaste);
    }
  }, [enablePasteUpload, handlePaste]);

  const completedUploads = uploads.filter(upload => upload.status === 'completed');
  const failedUploads = uploads.filter(upload => upload.status === 'error');
  const inProgressUploads = uploads.filter(upload => 
    upload.status === 'uploading' || upload.status === 'processing'
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      {enableDragDrop ? (
        <ImageDropzone
          onFilesSelected={handleFileSelect}
          maxFiles={maxFiles}
          maxFileSize={maxFileSize}
          allowedFormats={allowedFormats}
          multiple={multiple}
          disabled={isUploading}
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select {multiple ? 'images' : 'an image'} to upload
              </p>
              <Button onClick={handleBrowseClick} disabled={isUploading}>
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedFormats.map(format => `.${format}`).join(',')}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress Summary */}
      {uploads.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Upload Progress</h4>
              <div className="flex gap-2">
                {completedUploads.length > 0 && (
                  <Badge variant="secondary" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {completedUploads.length} completed
                  </Badge>
                )}
                {failedUploads.length > 0 && (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {failedUploads.length} failed
                  </Badge>
                )}
                {inProgressUploads.length > 0 && (
                  <Badge variant="secondary">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    {inProgressUploads.length} uploading
                  </Badge>
                )}
              </div>
            </div>

            {uploads.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearUploads}
                  disabled={isUploading}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
                {failedUploads.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      failedUploads.forEach((_, index) => {
                        const originalIndex = uploads.findIndex(u => u === failedUploads[index]);
                        if (originalIndex !== -1) {
                          retryUpload(originalIndex);
                        }
                      });
                    }}
                    disabled={isUploading}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Retry Failed
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Preview */}
      {showPreview && uploads.length > 0 && (
        <ImagePreview
          uploads={uploads}
          onRemove={removeUpload}
          onRetry={retryUpload}
          showProgress={showProgress}
        />
      )}

      {/* Upload Instructions */}
      {uploads.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Supported formats:</strong> {allowedFormats.join(', ').toUpperCase()}
              </p>
              <p className="mb-2">
                <strong>Maximum file size:</strong> {maxFileSize}MB
              </p>
              <p className="mb-2">
                <strong>Maximum files:</strong> {maxFiles}
              </p>
              {enablePasteUpload && (
                <p>
                  <strong>Tip:</strong> You can also paste images from your clipboard
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
