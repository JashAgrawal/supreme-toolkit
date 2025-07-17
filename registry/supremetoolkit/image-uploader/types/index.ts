// ============================================================================
// IMAGE UPLOADER TYPES
// ============================================================================

export interface UploadedImage {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  thumbnail_url?: string;
  size: number;
  width?: number;
  height?: number;
  format: string;
  uploaded_by?: string;
  uploaded_at: Date;
  metadata?: {
    alt_text?: string;
    caption?: string;
    tags?: string[];
    folder?: string;
    public_id?: string; // For Cloudinary
    etag?: string; // For S3
  };
}

export interface ImageUploadConfig {
  provider: 'cloudinary' | 's3' | 'local';
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  s3Bucket?: string;
  s3Region?: string;
  s3AccessKeyId?: string;
  s3SecretAccessKey?: string;
  maxFileSize?: number; // in MB
  allowedFormats?: string[];
  enableThumbnails?: boolean;
  thumbnailSizes?: Array<{ width: number; height: number; name: string }>;
  enableOptimization?: boolean;
  quality?: number; // 1-100
  autoGenerateAltText?: boolean;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  result?: UploadedImage;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseImageUploadOptions {
  userId?: string;
  folder?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  allowedFormats?: string[];
  enableThumbnails?: boolean;
  onUploadComplete?: (images: UploadedImage[]) => void;
  onUploadError?: (error: string) => void;
  onProgress?: (progress: UploadProgress[]) => void;
}

export interface UseImageUploadReturn {
  uploads: UploadProgress[];
  isUploading: boolean;
  error: string | null;
  uploadImages: (files: File[]) => Promise<void>;
  removeUpload: (fileIndex: number) => void;
  clearUploads: () => void;
  retryUpload: (fileIndex: number) => Promise<void>;
}

export interface UseImageGalleryOptions {
  userId?: string;
  folder?: string;
  limit?: number;
  onError?: (error: string) => void;
}

export interface UseImageGalleryReturn {
  images: UploadedImage[];
  isLoading: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  deleteImage: (imageId: string) => Promise<void>;
  updateImage: (imageId: string, updates: Partial<UploadedImage>) => Promise<void>;
  refreshImages: () => Promise<void>;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface ImageUploaderProps {
  userId?: string;
  folder?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  allowedFormats?: string[];
  enableThumbnails?: boolean;
  enableDragDrop?: boolean;
  enablePasteUpload?: boolean;
  showProgress?: boolean;
  showPreview?: boolean;
  multiple?: boolean;
  className?: string;
  onUploadComplete?: (images: UploadedImage[]) => void;
  onUploadError?: (error: string) => void;
}

export interface ImageDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  allowedFormats?: string[];
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ImagePreviewProps {
  uploads: UploadProgress[];
  onRemove?: (index: number) => void;
  onRetry?: (index: number) => void;
  showProgress?: boolean;
  className?: string;
}

export interface ImageGalleryProps {
  images: UploadedImage[];
  onImageSelect?: (image: UploadedImage) => void;
  onImageDelete?: (imageId: string) => void;
  onImageUpdate?: (imageId: string, updates: Partial<UploadedImage>) => void;
  selectable?: boolean;
  deletable?: boolean;
  editable?: boolean;
  columns?: number;
  className?: string;
}

export interface ImageCardProps {
  image: UploadedImage;
  onSelect?: () => void;
  onDelete?: () => void;
  onUpdate?: (updates: Partial<UploadedImage>) => void;
  selectable?: boolean;
  deletable?: boolean;
  editable?: boolean;
  selected?: boolean;
  className?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface UploadImageRequest {
  file: File;
  folder?: string;
  alt_text?: string;
  caption?: string;
  tags?: string[];
}

export interface UploadImageResponse {
  success: boolean;
  image?: UploadedImage;
  error?: string;
}

export interface ImageFilters {
  folder?: string;
  format?: string[];
  size_range?: {
    min: number;
    max: number;
  };
  date_range?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  search?: string;
  uploaded_by?: string;
}

// ============================================================================
// PROVIDER TYPES
// ============================================================================

export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
}

export interface S3UploadResult {
  Location: string;
  ETag: string;
  Bucket: string;
  Key: string;
}

// ============================================================================
// OPTIMIZATION TYPES
// ============================================================================

export interface ImageOptimizationOptions {
  quality?: number; // 1-100
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
  gravity?: 'auto' | 'center' | 'north' | 'south' | 'east' | 'west';
}

export interface ThumbnailConfig {
  width: number;
  height: number;
  name: string;
  quality?: number;
  format?: string;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

export interface ImageValidationRules {
  maxFileSize?: number; // in bytes
  allowedFormats?: string[];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: {
    min?: number;
    max?: number;
  };
}
