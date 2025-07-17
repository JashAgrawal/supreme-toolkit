"use server";

import { 
  saveImageMetadata, 
  getImages, 
  deleteImage, 
  updateImageMetadata,
  uploadToCloudinary,
  uploadToLocal,
  validateFile,
  uploadConfig
} from '../lib/upload';
import type { 
  UploadedImage, 
  UploadImageRequest,
  UploadImageResponse,
  ImageFilters 
} from '../types';

// ============================================================================
// IMAGE UPLOAD SERVER ACTIONS
// ============================================================================

/**
 * Upload a single image
 */
export async function uploadImage(
  formData: FormData,
  userId?: string
): Promise<UploadImageResponse> {
  try {
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const altText = formData.get('alt_text') as string;
    const caption = formData.get('caption') as string;
    const tags = formData.get('tags') as string;

    if (!file) {
      return {
        success: false,
        error: 'No file provided',
      };
    }

    // Validate file
    const validation = validateFile(file, {
      maxFileSize: uploadConfig.maxFileSize * 1024 * 1024,
      allowedFormats: uploadConfig.allowedFormats,
    });

    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Upload file based on provider
    let uploadResult;
    let imageUrl: string;
    let publicId: string | undefined;

    if (uploadConfig.provider === 'cloudinary') {
      uploadResult = await uploadToCloudinary(file, {
        folder,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
      });
      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    } else {
      // Default to local upload
      uploadResult = await uploadToLocal(file, { folder });
      imageUrl = uploadResult.url;
    }

    // Get image dimensions (this would need to be implemented server-side)
    // For now, we'll use placeholder values
    let width: number | undefined = undefined;
    let height: number | undefined = undefined;
    if (uploadConfig.provider === 'cloudinary' && 'width' in uploadResult && 'height' in uploadResult && typeof uploadResult.width === 'number' && typeof uploadResult.height === 'number') {
      width = uploadResult.width;
      height = uploadResult.height;
    }

    // Save image metadata
    const imageData: Omit<UploadedImage, 'id' | 'uploaded_at'> = {
      filename: `${Date.now()}-${file.name}`,
      original_name: file.name,
      url: imageUrl,
      size: file.size,
      width,
      height,
      format: file.name.split('.').pop()?.toLowerCase() || 'unknown',
      uploaded_by: userId,
      metadata: {
        alt_text: altText || undefined,
        caption: caption || undefined,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
        folder: folder || undefined,
        public_id: publicId,
      },
    };

    const savedImage = await saveImageMetadata(imageData);

    // Call upload completion handler
    await onImageUploaded({
      image: savedImage,
      userId,
      timestamp: new Date(),
    });

    return {
      success: true,
      image: savedImage,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Get images with filters
 */
export async function getImageList(
  filters: ImageFilters = {},
  userId?: string
): Promise<{
  success: boolean;
  images?: UploadedImage[];
  error?: string;
}> {
  try {
    const images = await getImages(filters, userId);

    return {
      success: true,
      images,
    };
  } catch (error) {
    console.error('Error getting images:', error);
    return {
      success: false,
      error: 'Failed to get images',
    };
  }
}

/**
 * Delete an image
 */
export async function deleteImageById(
  imageId: string,
  userId?: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Get image to check ownership
    const images = await getImages({}, userId);
    const image = images.find(img => img.id === imageId);

    if (!image) {
      return {
        success: false,
        error: 'Image not found',
      };
    }

    // Check if user owns the image (for non-admin users)
    if (userId && image.uploaded_by !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    const deleted = await deleteImage(imageId);

    if (!deleted) {
      return {
        success: false,
        error: 'Failed to delete image',
      };
    }

    // Call deletion handler
    await onImageDeleted({
      image,
      deletedBy: userId,
      timestamp: new Date(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: 'Failed to delete image',
    };
  }
}

/**
 * Update image metadata
 */
export async function updateImageById(
  imageId: string,
  updates: {
    alt_text?: string;
    caption?: string;
    tags?: string[];
  },
  userId?: string
): Promise<{
  success: boolean;
  image?: UploadedImage;
  error?: string;
}> {
  try {
    // Get image to check ownership
    const images = await getImages({}, userId);
    const image = images.find(img => img.id === imageId);

    if (!image) {
      return {
        success: false,
        error: 'Image not found',
      };
    }

    // Check if user owns the image (for non-admin users)
    if (userId && image.uploaded_by !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    const updatedImage = await updateImageMetadata(imageId, {
      metadata: {
        ...image.metadata,
        alt_text: updates.alt_text,
        caption: updates.caption,
        tags: updates.tags,
      },
    });

    if (!updatedImage) {
      return {
        success: false,
        error: 'Failed to update image',
      };
    }

    return {
      success: true,
      image: updatedImage,
    };
  } catch (error) {
    console.error('Error updating image:', error);
    return {
      success: false,
      error: 'Failed to update image',
    };
  }
}

/**
 * Get image statistics
 */
export async function getImageStats(
  userId?: string
): Promise<{
  success: boolean;
  stats?: {
    total: number;
    totalSize: number;
    byFormat: Record<string, number>;
    byFolder: Record<string, number>;
    recentUploads: number;
  };
  error?: string;
}> {
  try {
    const images = await getImages({}, userId);
    
    const stats = {
      total: images.length,
      totalSize: images.reduce((sum, img) => sum + img.size, 0),
      byFormat: {} as Record<string, number>,
      byFolder: {} as Record<string, number>,
      recentUploads: 0,
    };

    // Calculate stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    images.forEach(image => {
      // By format
      stats.byFormat[image.format] = (stats.byFormat[image.format] || 0) + 1;
      
      // By folder
      const folder = image.metadata?.folder || 'root';
      stats.byFolder[folder] = (stats.byFolder[folder] || 0) + 1;
      
      // Recent uploads
      if (image.uploaded_at > oneWeekAgo) {
        stats.recentUploads++;
      }
    });

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error('Error getting image stats:', error);
    return {
      success: false,
      error: 'Failed to get image statistics',
    };
  }
}

// ============================================================================
// EVENT HANDLERS (Customize these for your business logic)
// ============================================================================

/**
 * Called when an image is uploaded
 */
async function onImageUploaded(params: {
  image: UploadedImage;
  userId?: string;
  timestamp: Date;
}) {
  console.log('Image uploaded:', params.image.id);

  // Add your custom business logic here:

  // 1. Generate additional thumbnails
  try {
    // Example: await generateAdditionalThumbnails(params.image);
  } catch (error) {
    console.warn('Thumbnail generation failed:', error);
  }

  // 2. Auto-generate alt text using AI
  if (uploadConfig.autoGenerateAltText && !params.image.metadata?.alt_text) {
    try {
      // Example: await generateAltText(params.image);
    } catch (error) {
      console.warn('Alt text generation failed:', error);
    }
  }

  // 3. Track analytics
  try {
    // Example: await analytics.track('image_uploaded', {
    //   image_id: params.image.id,
    //   file_size: params.image.size,
    //   format: params.image.format,
    //   user_id: params.userId,
    //   timestamp: params.timestamp,
    // });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }

  // 4. Send notifications
  try {
    // Example: await sendUploadNotification({
    //   image: params.image,
    //   userId: params.userId,
    // });
  } catch (error) {
    console.warn('Upload notification failed:', error);
  }
}

/**
 * Called when an image is deleted
 */
async function onImageDeleted(params: {
  image: UploadedImage;
  deletedBy?: string;
  timestamp: Date;
}) {
  console.log('Image deleted:', params.image.id);

  // Add your custom business logic here:

  // 1. Clean up cloud storage
  try {
    if (uploadConfig.provider === 'cloudinary' && params.image.metadata?.public_id) {
      // Example: await cloudinary.uploader.destroy(params.image.metadata.public_id);
    }
  } catch (error) {
    console.warn('Cloud storage cleanup failed:', error);
  }

  // 2. Track analytics
  try {
    // Example: await analytics.track('image_deleted', {
    //   image_id: params.image.id,
    //   deleted_by: params.deletedBy,
    //   timestamp: params.timestamp,
    // });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }

  // 3. Clean up related data
  try {
    // Example: await cleanupRelatedData(params.image.id);
  } catch (error) {
    console.warn('Related data cleanup failed:', error);
  }
}
