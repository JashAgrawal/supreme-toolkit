/**
 * Image Uploader Configuration
 * 
 * Configure image upload settings and cloud storage
 */

export interface ImageUploaderConfig {
  provider: 'cloudinary' | 's3' | 'local';
  maxFileSize?: number; // in MB
  maxFiles?: number;
  allowedFormats?: string[];
  enableThumbnails?: boolean;
  enableOptimization?: boolean;
  // Cloudinary specific
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  cloudinaryUploadPreset?: string;
  // S3 specific
  s3Bucket?: string;
  s3Region?: string;
  s3AccessKeyId?: string;
  s3SecretAccessKey?: string;
}

export const defaultImageUploaderConfig: Partial<ImageUploaderConfig> = {
  provider: 'cloudinary',
  maxFileSize: 10,
  maxFiles: 10,
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  enableThumbnails: true,
  enableOptimization: true,
};

/**
 * Get image uploader configuration with defaults
 */
export function getImageUploaderConfig(userConfig?: Partial<ImageUploaderConfig>): ImageUploaderConfig {
  // Ensure provider is set to a valid value
  const provider = process.env.IMAGE_PROVIDER as 'cloudinary' | 's3' | 'local' || 
                  userConfig?.provider || 
                  defaultImageUploaderConfig.provider || 
                  'local';
                  
  return {
    provider,
    ...defaultImageUploaderConfig,
    ...userConfig,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    s3Bucket: process.env.S3_BUCKET,
    s3Region: process.env.S3_REGION,
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  };
}

/**
 * Validate image uploader environment variables
 */
export function validateImageUploaderConfig(config: ImageUploaderConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.provider === 'cloudinary') {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      errors.push('CLOUDINARY_CLOUD_NAME is required for Cloudinary provider');
    }
    if (!process.env.CLOUDINARY_API_KEY) {
      errors.push('CLOUDINARY_API_KEY is required for Cloudinary provider');
    }
    if (!process.env.CLOUDINARY_API_SECRET) {
      errors.push('CLOUDINARY_API_SECRET is required for Cloudinary provider');
    }
  }
  
  if (config.provider === 's3') {
    if (!process.env.S3_BUCKET) errors.push('S3_BUCKET is required for S3 provider');
    if (!process.env.S3_REGION) errors.push('S3_REGION is required for S3 provider');
    if (!process.env.S3_ACCESS_KEY_ID) errors.push('S3_ACCESS_KEY_ID is required for S3 provider');
    if (!process.env.S3_SECRET_ACCESS_KEY) errors.push('S3_SECRET_ACCESS_KEY is required for S3 provider');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
