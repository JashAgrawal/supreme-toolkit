"use client";

import { useState, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { validateFile } from '../../lib/upload';
import type { ImageDropzoneProps } from '../../types';
import { cn } from '@/lib/utils';

export function ImageDropzone({
  onFilesSelected,
  maxFiles = 10,
  maxFileSize = 10,
  allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  multiple = true,
  disabled = false,
  className,
}: ImageDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    if (!multiple && files.length > 1) {
      errors.push('Only one file is allowed');
      return { valid, errors };
    }

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return { valid, errors };
    }

    files.forEach((file) => {
      const validation = validateFile(file, {
        maxFileSize: maxFileSize * 1024 * 1024,
        allowedFormats,
      });

      if (validation.valid) {
        valid.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    return { valid, errors };
  }, [maxFiles, maxFileSize, allowedFormats, multiple]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsDragOver(true);
    setDragError(null);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set drag over to false if we're leaving the dropzone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragError(null);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    // Check if dragged items are files
    const hasFiles = Array.from(e.dataTransfer.items).some(
      item => item.kind === 'file' && item.type.startsWith('image/')
    );

    if (!hasFiles) {
      setDragError('Only image files are allowed');
    } else {
      setDragError(null);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    setDragError(null);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );

    if (files.length === 0) {
      setDragError('No valid image files found');
      return;
    }

    const { valid, errors } = validateFiles(files);

    if (errors.length > 0) {
      setDragError(errors[0]);
      return;
    }

    if (valid.length > 0) {
      onFilesSelected(valid);
    }
  }, [disabled, validateFiles, onFilesSelected]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    const { valid, errors } = validateFiles(files);

    if (errors.length > 0) {
      setDragError(errors[0]);
      return;
    }

    if (valid.length > 0) {
      onFilesSelected(valid);
    }

    // Reset input value
    e.target.value = '';
  };

  const handleBrowseClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver && !dragError && "border-primary bg-primary/5",
          isDragOver && dragError && "border-red-500 bg-red-50",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && !isDragOver && "hover:border-primary/50 hover:bg-muted/50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <div className="mb-4">
              {isDragOver ? (
                <Upload 
                  className={cn(
                    "h-12 w-12 mx-auto",
                    dragError ? "text-red-500" : "text-primary"
                  )} 
                />
              ) : (
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              )}
            </div>

            <div className="space-y-2">
              {isDragOver ? (
                <div>
                  {dragError ? (
                    <p className="text-sm font-medium text-red-600">
                      {dragError}
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-primary">
                      Drop your images here
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Upload Images
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your images here, or click to browse
                  </p>
                  <Button 
                    variant="outline" 
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrowseClick();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                </div>
              )}
            </div>

            {!isDragOver && (
              <div className="mt-4 text-xs text-muted-foreground space-y-1">
                <p>
                  Supported formats: {allowedFormats.join(', ').toUpperCase()}
                </p>
                <p>
                  Maximum file size: {maxFileSize}MB
                </p>
                <p>
                  Maximum files: {maxFiles}
                </p>
              </div>
            )}

            {dragError && !isDragOver && (
              <div className="mt-4 text-sm text-red-600">
                {dragError}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedFormats.map(format => `.${format}`).join(',')}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
