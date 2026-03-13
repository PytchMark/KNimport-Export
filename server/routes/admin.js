import { Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../middleware/auth.js';
import { getSupabaseAdmin } from '../services/supabase.js';
import { uploadToStorage, deleteFromStorage, MEDIA_CATEGORIES, BUCKET_NAME } from '../services/storage.js';

const router = Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

router.use(requireAdmin);

function getAdminClientOrRespond(res) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    res.status(500).json({ error: 'Server is missing Supabase configuration' });
    return null;
  }

  return supabaseAdmin;
}

router.get('/requests', async (_req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  const { data, error } = await supabaseAdmin.from('requests').select('*, request_items(*)').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ requests: data });
});

router.patch('/requests/:id', async (req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  const { data, error } = await supabaseAdmin.from('requests').update(req.body).eq('id', req.params.id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ request: data });
});

// Inventory endpoints
router.get('/inventory', async (_req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  const { data, error } = await supabaseAdmin.from('inventory_items').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ items: data });
});

router.post('/inventory', async (req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  const { data, error } = await supabaseAdmin.from('inventory_items').insert(req.body).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ item: data });
});

router.patch('/inventory/:id', async (req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  const { data, error } = await supabaseAdmin.from('inventory_items').update(req.body).eq('id', req.params.id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ item: data });
});

router.delete('/inventory/:id', async (req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  // Soft delete - set is_active to false
  const { error } = await supabaseAdmin.from('inventory_items').update({ is_active: false }).eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ deleted: true });
});

// Media upload endpoint - uploads to Supabase Storage
router.post('/media/upload', upload.single('file'), async (req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { category = 'gallery', tag = 'gallery' } = req.body;
    
    // Validate category
    const validCategories = Object.values(MEDIA_CATEGORIES);
    const safeCategory = validCategories.includes(category) ? category : 'gallery';

    // Upload to Supabase Storage
    const { url, path } = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      safeCategory,
      req.file.mimetype
    );

    // Save reference in database
    const { data, error } = await supabaseAdmin
      .from('media_assets')
      .insert({
        url,
        storage_path: path,
        type: req.file.mimetype.startsWith('video/') ? 'video' : 'image',
        tag,
        category: safeCategory,
        original_filename: req.file.originalname
      })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({ asset: data });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// Legacy media create endpoint (for manual URL entries)
router.post('/media', async (req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  const { data, error } = await supabaseAdmin.from('media_assets').insert(req.body).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ asset: data });
});

router.delete('/media/:id', async (req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  try {
    // Get the media asset first to get storage path
    const { data: asset, error: fetchError } = await supabaseAdmin
      .from('media_assets')
      .select('storage_path')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage if path exists
    if (asset?.storage_path) {
      try {
        await deleteFromStorage(asset.storage_path);
      } catch (storageErr) {
        console.warn('Storage delete warning:', storageErr.message);
      }
    }

    // Delete from database
    const { error } = await supabaseAdmin.from('media_assets').delete().eq('id', req.params.id);
    if (error) throw error;
    
    res.json({ deleted: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get available categories
router.get('/media/categories', (_req, res) => {
  res.json({ categories: MEDIA_CATEGORIES });
});

export default router;
