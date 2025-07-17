import { NextRequest, NextResponse } from 'next/server';
import {
  uploadImage,
  getImageList,
  deleteImageById,
  updateImageById,
  getImageStats
} from '../../actions/upload-actions';

// ============================================================================
// IMAGE UPLOAD API ROUTES
// ============================================================================

/**
 * POST /api/upload - Upload images
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;

    // Handle single file upload
    const result = await uploadImage(formData, userId || undefined);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.image,
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload - Get images or statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'list', 'stats'

    if (type === 'stats') {
      const result = await getImageStats(userId || undefined);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.stats,
      });
    }

    // Default to getting image list
    const filters: { [key: string]: any } = {
      folder: searchParams.get('folder') || undefined,
      format: searchParams.get('format')?.split(',') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      search: searchParams.get('search') || undefined,
    };

    // Handle date range
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate && endDate) {
      filters.date_range = {
        start: new Date(startDate),
        end: new Date(endDate),
      };
    }

    // Handle size range
    const minSize = searchParams.get('minSize');
    const maxSize = searchParams.get('maxSize');
    if (minSize && maxSize) {
      filters.size_range = {
        min: parseInt(minSize),
        max: parseInt(maxSize),
      };
    }

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters];
      }
    });

    const result = await getImageList(filters, userId || undefined);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.images,
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/upload - Update image metadata
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageId, userId, updates } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const result = await updateImageById(imageId, updates, userId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Image not found' ? 404 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.image,
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload - Delete image
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    const userId = searchParams.get('userId');

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteImageById(imageId, userId || undefined);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Image not found' ? 404 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
