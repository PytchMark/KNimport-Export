// Supabase Storage Service - replaces Cloudinary
import { getSupabaseAdmin } from './supabase.js';

const BUCKET_NAME = 'kn-media';

// Media categories for cataloging
export const MEDIA_CATEGORIES = {
  HERO: 'hero',
  INVENTORY: 'inventory', 
  DELIVERY: 'delivery',
  QUALITY: 'quality',
  GALLERY: 'gallery'
};

/**
 * Upload file to Supabase Storage
 * @param {Buffer} fileBuffer - The file data
 * @param {string} filename - Original filename
 * @param {string} category - Category for cataloging (hero, inventory, etc.)
 * @param {string} contentType - MIME type
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadToStorage(fileBuffer, filename, category = 'gallery', contentType = 'image/jpeg') {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  // Generate unique path with category
  const timestamp = Date.now();
  const ext = filename.split('.').pop() || 'jpg';
  const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const storagePath = `${category}/${timestamp}-${safeName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    path: data.path
  };
}

/**
 * Delete file from Supabase Storage
 * @param {string} storagePath - Path to file in bucket
 */
export async function deleteFromStorage(storagePath) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) throw error;
  return true;
}

/**
 * List files from storage by category
 * @param {string} category - Category folder to list
 */
export async function listStorageFiles(category = '') {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(category, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    });

  if (error) throw error;
  return data;
}

export { BUCKET_NAME };
