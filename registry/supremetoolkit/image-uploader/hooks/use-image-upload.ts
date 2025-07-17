"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  validateFile, 
  validateImageDimensions, 
  uploadToCloudinary, 
  uploadToLocal,
  generateThumbnails,
  saveImageMetadata,
  uploadConfig
} from '../lib/upload';
import type { 
  UploadProgress, 
  UploadedImage, 
  UseImageUploadOptions, 
  UseImageUploadReturn 
} from '../types';

export function useImageUpload({
  userId,
  folder,
  maxFiles = 10,
  maxFileSize,
  allowedFormats,
  enableThumbnails = true,
  onUploadComplete,
  onUploadError,
  onProgress,
}: UseImageUploadOptions): UseImageUploadReturn {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllersRef = useRef<Map<number, AbortController>>(new Map());

  const uploadImages = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Check max files limit
    if (uploads.length + files.length > maxFiles) {
      const errorMessage = `Maximum ${maxFiles} files allowed`;
      setError(errorMessage);
      onUploadError?.(errorMessage);
      return;
    }

    setError(null);
    setIsUploading(true);

    // Initialize upload progress for all files
    const newUploads: UploadProgress[] = files.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadIndex = uploads.length + i;

      try {
        await uploadSingleFile(file, uploadIndex);
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
      }
    }

    setIsUploading(false);

    // Check if all uploads completed successfully
    const completedUploads = uploads.filter(upload => 
      upload.status === 'completed' && upload.result
    );
    
    if (completedUploads.length > 0) {
      onUploadComplete?.(completedUploads.map(upload => upload.result!));
    }
  }, [uploads, maxFiles, userId, folder, enableThumbnails, onUploadComplete, onUploadError]);

  const uploadSingleFile = async (file: File, uploadIndex: number) => {
    const updateProgress = (updates: Partial<UploadProgress>) => {
      setUploads(prev => 
        prev.map((upload, index) => 
          index === uploadIndex ? { ...upload, ...updates } : upload
        )
      );
    };

    try {
      // Validate file
      const validation = validateFile(file, {
        maxFileSize: (maxFileSize || uploadConfig.maxFileSize) * 1024 * 1024,
        allowedFormats: allowedFormats || uploadConfig.allowedFormats,
      });

      if (!validation.valid) {
        updateProgress({ status: 'error', error: validation.error });
        return;
      }

      // Validate image dimensions
      const dimensionValidation = await validateImageDimensions(file);
      if (!dimensionValidation.valid) {
        updateProgress({ status: 'error', error: dimensionValidation.error });
        return;
      }

      updateProgress({ status: 'uploading', progress: 10 });

      // Create abort controller for this upload
      const abortController = new AbortController();
      abortControllersRef.current.set(uploadIndex, abortController);

      // Upload file based on provider
      let uploadResult;
      
      if (uploadConfig.provider === 'cloudinary') {
        uploadResult = await uploadToCloudinary(file, {
          folder,
          tags: folder ? [folder] : undefined,
        });
        
        updateProgress({ progress: 60 });
      } else {
        // Default to local upload
        uploadResult = await uploadToLocal(file, { folder });
        updateProgress({ progress: 60 });
      }

      updateProgress({ status: 'processing', progress: 70 });

      // Generate thumbnails if enabled
      let thumbnailUrl;
      if (enableThumbnails && uploadConfig.enableThumbnails) {
        try {
          const thumbnails = await generateThumbnails(file, uploadConfig.thumbnailSizes);
          if (thumbnails.length > 0) {
            // Use the first thumbnail as the main thumbnail
            thumbnailUrl = thumbnails[0].url;
          }
        } catch (error) {
          console.warn('Thumbnail generation failed:', error);
        }
      }

      updateProgress({ progress: 90 });

      // Get image dimensions
      const { width, height } = await getImageDimensions(file);

      // Save image metadata
      const imageData: Omit<UploadedImage, 'id' | 'uploaded_at'> = {
        filename: `${Date.now()}-${file.name}`,
        original_name: file.name,
        url: uploadConfig.provider === 'cloudinary' 
          ? (uploadResult as any).secure_url 
          : (uploadResult as any).url,
        thumbnail_url: thumbnailUrl,
        size: file.size,
        width,
        height,
        format: file.name.split('.').pop()?.toLowerCase() || 'unknown',
        uploaded_by: userId,
        metadata: {
          folder,
          public_id: uploadConfig.provider === 'cloudinary' 
            ? (uploadResult as any).public_id 
            : undefined,
        },
      };

      const savedImage = await saveImageMetadata(imageData);

      updateProgress({ 
        status: 'completed', 
        progress: 100, 
        result: savedImage 
      });

      // Clean up abort controller
      abortControllersRef.current.delete(uploadIndex);

    } catch (error: any) {
      updateProgress({ 
        status: 'error', 
        error: error.message || 'Upload failed' 
      });
      
      // Clean up abort controller
      abortControllersRef.current.delete(uploadIndex);
    }
  };

  const removeUpload = useCallback((fileIndex: number) => {
    // Abort upload if in progress
    const abortController = abortControllersRef.current.get(fileIndex);
    if (abortController) {
      abortController.abort();
      abortControllersRef.current.delete(fileIndex);
    }

    setUploads(prev => prev.filter((_, index) => index !== fileIndex));
  }, []);

  const clearUploads = useCallback(() => {
    // Abort all uploads
    abortControllersRef.current.forEach(controller => controller.abort());
    abortControllersRef.current.clear();
    
    setUploads([]);
    setError(null);
    setIsUploading(false);
  }, []);

  const retryUpload = useCallback(async (fileIndex: number) => {
    const upload = uploads[fileIndex];
    if (!upload || upload.status !== 'error') return;

    // Reset upload status
    setUploads(prev => 
      prev.map((upload, index) => 
        index === fileIndex 
          ? { ...upload, status: 'pending', progress: 0, error: undefined }
          : upload
      )
    );

    // Retry upload
    await uploadSingleFile(upload.file, fileIndex);
  }, [uploads]);

  // Update progress callback
  useEffect(() => {
    onProgress?.(uploads);
  }, [uploads, onProgress]);

  return {
    uploads,
    isUploading,
    error,
    uploadImages,
    removeUpload,
    clearUploads,
    retryUpload,
  };
}

// Helper function to get image dimensions
async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };

    img.src = url;
  });
}
