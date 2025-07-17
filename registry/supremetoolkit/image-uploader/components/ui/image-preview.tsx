"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  FileImage
} from 'lucide-react';
import type { ImagePreviewProps } from '../../types';
import { cn } from '@/lib/utils';

export function ImagePreview({
  uploads,
  onRemove,
  onRetry,
  showProgress = true,
  className,
}: ImagePreviewProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <FileImage className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'uploading':
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200';
    }
  };

  if (uploads.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {uploads.map((upload, index) => (
        <Card key={index} className={cn("transition-colors", getStatusColor(upload.status))}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* File Preview */}
              <div className="flex-shrink-0">
                {upload.file.type.startsWith('image/') ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={URL.createObjectURL(upload.file)}
                      alt={upload.file.name}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        // Clean up object URL after image loads
                        setTimeout(() => {
                          URL.revokeObjectURL((e.target as HTMLImageElement).src);
                        }, 1000);
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 border flex items-center justify-center">
                    <FileImage className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(upload.status)}
                  <h4 className="font-medium text-sm truncate">
                    {upload.file.name}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {formatFileSize(upload.file.size)}
                  </Badge>
                </div>

                {/* Status and Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={cn(
                      "capitalize",
                      upload.status === 'completed' && "text-green-600",
                      upload.status === 'error' && "text-red-600",
                      (upload.status === 'uploading' || upload.status === 'processing') && "text-blue-600"
                    )}>
                      {upload.status === 'uploading' && 'Uploading...'}
                      {upload.status === 'processing' && 'Processing...'}
                      {upload.status === 'completed' && 'Upload complete'}
                      {upload.status === 'error' && 'Upload failed'}
                      {upload.status === 'pending' && 'Waiting...'}
                    </span>
                    {showProgress && upload.status !== 'pending' && (
                      <span className="text-muted-foreground">
                        {upload.progress}%
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {showProgress && upload.status !== 'pending' && upload.status !== 'completed' && (
                    <Progress 
                      value={upload.progress} 
                      className="h-2"
                    />
                  )}

                  {/* Error Message */}
                  {upload.status === 'error' && upload.error && (
                    <p className="text-xs text-red-600 mt-1">
                      {upload.error}
                    </p>
                  )}

                  {/* Success Info */}
                  {upload.status === 'completed' && upload.result && (
                    <div className="text-xs text-green-600">
                      <p>Uploaded successfully</p>
                      {upload.result.width && upload.result.height && (
                        <p className="text-muted-foreground">
                          {upload.result.width} × {upload.result.height}px
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex gap-1">
                {upload.status === 'error' && onRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetry(index)}
                    className="h-8 w-8 p-0"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                )}
                
                {onRemove && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="h-8 w-8 p-0"
                    disabled={upload.status === 'uploading' || upload.status === 'processing'}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
