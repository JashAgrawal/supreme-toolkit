import { getModuleConfig } from '@/config';
import type { 
  UploadedImage, 
  ImageUploadConfig, 
  UploadImageRequest,
  CloudinaryUploadResult,
  S3UploadResult,
  ImageOptimizationOptions,
  ThumbnailConfig,
  FileValidationResult,
  ImageValidationRules,
  ImageFilters
} from '../types';

// ============================================================================
// IMAGE UPLOAD CONFIGURATION
// ============================================================================

const config = getModuleConfig('imageUpload') as ImageUploadConfig;

export const uploadConfig = {
  provider: config?.provider || 'cloudinary',
  maxFileSize: config?.maxFileSize || 10, // MB
  allowedFormats: config?.allowedFormats || ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  enableThumbnails: config?.enableThumbnails ?? true,
  thumbnailSizes: config?.thumbnailSizes || [
    { width: 150, height: 150, name: 'thumb' },
    { width: 300, height: 300, name: 'small' },
    { width: 600, height: 600, name: 'medium' },
  ],
  enableOptimization: config?.enableOptimization ?? true,
  quality: config?.quality || 80,
  autoGenerateAltText: config?.autoGenerateAltText ?? false,
};

// ============================================================================
// IN-MEMORY STORAGE (Replace with your database)
// ============================================================================

const imageStore: Map<string, UploadedImage> = new Map();

// ============================================================================
// FILE VALIDATION
// ============================================================================

/**
 * Validate uploaded file
 */
export function validateFile(file: File, rules?: ImageValidationRules): FileValidationResult {
  const maxSize = (rules?.maxFileSize || uploadConfig.maxFileSize * 1024 * 1024);
  const allowedFormats = rules?.allowedFormats || uploadConfig.allowedFormats;

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
    };
  }

  // Check file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowedFormats.includes(fileExtension)) {
    return {
      valid: false,
      error: `File format not supported. Allowed formats: ${allowedFormats.join(', ')}`,
    };
  }

  // Check if it's actually an image
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'File must be an image',
    };
  }

  return { valid: true };
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(
  file: File, 
  rules?: ImageValidationRules
): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const warnings: string[] = [];

      // Check minimum dimensions
      if (rules?.minWidth && img.width < rules.minWidth) {
        resolve({
          valid: false,
          error: `Image width must be at least ${rules.minWidth}px`,
        });
        return;
      }

      if (rules?.minHeight && img.height < rules.minHeight) {
        resolve({
          valid: false,
          error: `Image height must be at least ${rules.minHeight}px`,
        });
        return;
      }

      // Check maximum dimensions
      if (rules?.maxWidth && img.width > rules.maxWidth) {
        warnings.push(`Image width exceeds recommended ${rules.maxWidth}px`);
      }

      if (rules?.maxHeight && img.height > rules.maxHeight) {
        warnings.push(`Image height exceeds recommended ${rules.maxHeight}px`);
      }

      // Check aspect ratio
      if (rules?.aspectRatio) {
        const aspectRatio = img.width / img.height;
        if (rules.aspectRatio.min && aspectRatio < rules.aspectRatio.min) {
          resolve({
            valid: false,
            error: `Image aspect ratio too narrow`,
          });
          return;
        }
        if (rules.aspectRatio.max && aspectRatio > rules.aspectRatio.max) {
          resolve({
            valid: false,
            error: `Image aspect ratio too wide`,
          });
          return;
        }
      }

      resolve({ valid: true, warnings });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: 'Invalid image file',
      });
    };

    img.src = url;
  });
}

// ============================================================================
// UPLOAD PROVIDERS
// ============================================================================

/**
 * Upload to Cloudinary
 */
export async function uploadToCloudinary(
  file: File,
  options: {
    folder?: string;
    publicId?: string;
    tags?: string[];
  } = {}
): Promise<CloudinaryUploadResult> {
  if (!config?.cloudinaryCloudName || !config?.cloudinaryApiKey) {
    throw new Error('Cloudinary configuration missing');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'unsigned_preset'); // You need to create this in Cloudinary
  
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  
  if (options.publicId) {
    formData.append('public_id', options.publicId);
  }
  
  if (options.tags?.length) {
    formData.append('tags', options.tags.join(','));
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Upload failed');
  }

  return response.json();
}

/**
 * Upload to S3 (simplified - you'd typically use AWS SDK)
 */
export async function uploadToS3(
  file: File,
  options: {
    key?: string;
    bucket?: string;
  } = {}
): Promise<S3UploadResult> {
  // This is a simplified example - in production, you'd use AWS SDK
  // and handle presigned URLs or server-side uploads
  throw new Error('S3 upload not implemented in this example');
}

/**
 * Upload to local storage
 */
export async function uploadToLocal(
  file: File,
  options: {
    folder?: string;
  } = {}
): Promise<{ url: string; path: string }> {
  // This would typically save to your server's file system
  // For demo purposes, we'll create a blob URL
  const url = URL.createObjectURL(file);
  const path = `uploads/${options.folder || 'images'}/${Date.now()}-${file.name}`;
  
  return { url, path };
}

// ============================================================================
// IMAGE PROCESSING
// ============================================================================

/**
 * Generate thumbnails
 */
export async function generateThumbnails(
  file: File,
  configs: ThumbnailConfig[]
): Promise<Array<{ config: ThumbnailConfig; blob: Blob; url: string }>> {
  const thumbnails: Array<{ config: ThumbnailConfig; blob: Blob; url: string }> = [];

  for (const config of configs) {
    const thumbnail = await resizeImage(file, {
      width: config.width,
      height: config.height,
      quality: config.quality || uploadConfig.quality,
      format: config.format as "" || 'webp',
    });

    thumbnails.push({
      config,
      blob: thumbnail,
      url: URL.createObjectURL(thumbnail),
    });
  }

  return thumbnails;
}

/**
 * Resize image
 */
export async function resizeImage(
  file: File,
  options: ImageOptimizationOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      const { width, height } = calculateDimensions(
        img.width,
        img.height,
        options.width,
        options.height,
        options.crop || 'fit'
      );

      canvas.width = width;
      canvas.height = height;

      // Apply image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        `image/${options.format || 'webp'}`,
        (options.quality || uploadConfig.quality) / 100
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate dimensions for resizing
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number,
  crop: 'fill' | 'fit' | 'scale' | 'crop' = 'fit'
): { width: number; height: number } {
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalWidth / originalHeight;

  if (crop === 'scale') {
    return {
      width: targetWidth || originalWidth,
      height: targetHeight || originalHeight,
    };
  }

  if (targetWidth && targetHeight) {
    if (crop === 'fill') {
      return { width: targetWidth, height: targetHeight };
    }

    const targetAspectRatio = targetWidth / targetHeight;

    if (crop === 'fit') {
      if (aspectRatio > targetAspectRatio) {
        return {
          width: targetWidth,
          height: Math.round(targetWidth / aspectRatio),
        };
      } else {
        return {
          width: Math.round(targetHeight * aspectRatio),
          height: targetHeight,
        };
      }
    }
  }

  if (targetWidth) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  }

  if (targetHeight) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  }

  return { width: originalWidth, height: originalHeight };
}

// ============================================================================
// IMAGE MANAGEMENT
// ============================================================================

/**
 * Save uploaded image metadata
 */
export async function saveImageMetadata(
  imageData: Omit<UploadedImage, 'id' | 'uploaded_at'>
): Promise<UploadedImage> {
  const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const image: UploadedImage = {
    id: imageId,
    ...imageData,
    uploaded_at: new Date(),
  };

  imageStore.set(imageId, image);
  return image;
}

/**
 * Get images with filters
 */
export async function getImages(
  filters: ImageFilters = {},
  userId?: string
): Promise<UploadedImage[]> {
  let images = Array.from(imageStore.values());

  // Filter by user
  if (userId) {
    images = images.filter(img => img.uploaded_by === userId);
  }

  // Apply filters
  if (filters.folder) {
    images = images.filter(img => img.metadata?.folder === filters.folder);
  }

  if (filters.format?.length) {
    images = images.filter(img => filters.format!.includes(img.format));
  }

  if (filters.tags?.length) {
    images = images.filter(img => 
      img.metadata?.tags?.some(tag => filters.tags!.includes(tag))
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    images = images.filter(img =>
      img.filename.toLowerCase().includes(searchTerm) ||
      img.original_name.toLowerCase().includes(searchTerm) ||
      img.metadata?.alt_text?.toLowerCase().includes(searchTerm) ||
      img.metadata?.caption?.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.date_range) {
    images = images.filter(img =>
      img.uploaded_at >= filters.date_range!.start &&
      img.uploaded_at <= filters.date_range!.end
    );
  }

  if (filters.size_range) {
    images = images.filter(img =>
      img.size >= filters.size_range!.min &&
      img.size <= filters.size_range!.max
    );
  }

  // Sort by upload date (newest first)
  return images.sort((a, b) => b.uploaded_at.getTime() - a.uploaded_at.getTime());
}

/**
 * Delete image
 */
export async function deleteImage(imageId: string): Promise<boolean> {
  return imageStore.delete(imageId);
}

/**
 * Update image metadata
 */
export async function updateImageMetadata(
  imageId: string,
  updates: Partial<UploadedImage>
): Promise<UploadedImage | null> {
  const image = imageStore.get(imageId);
  if (!image) return null;

  const updatedImage = { ...image, ...updates };
  imageStore.set(imageId, updatedImage);
  return updatedImage;
}
