import { Router } from 'express';
import { getSupabaseAdmin } from '../services/supabase.js';
import { makeReferenceId } from '../utils/reference.js';
import { MEDIA_CATEGORIES } from '../services/storage.js';

const router = Router();

function getAdminClientOrRespond(res) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    res.status(500).json({ error: 'Server is missing Supabase configuration' });
    return null;
  }

  return supabaseAdmin;
}

router.get('/health', (_req, res) => res.json({ ok: true }));

// Get gallery assets from Supabase media_assets table
router.get('/gallery', async (req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  try {
    const requestedTags = String(req.query.tags || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    let query = supabaseAdmin.from('media_assets').select('*').order('created_at', { ascending: false });
    
    if (requestedTags.length) {
      query = query.in('tag', requestedTags);
    }

    const { data, error } = await query.limit(80);
    if (error) throw error;

    const assets = (data || []).map((asset) => ({
      id: asset.id,
      url: asset.url,
      type: asset.type || 'image',
      tag: asset.tag || 'gallery',
      category: asset.category || 'gallery',
      storage_path: asset.storage_path
    }));

    res.json({ assets });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch gallery assets' });
  }
});

// Get hero images specifically
router.get('/hero-images', async (_req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  try {
    const { data, error } = await supabaseAdmin
      .from('media_assets')
      .select('*')
      .eq('category', 'hero')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ images: data || [] });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch hero images' });
  }
});

router.get('/inventory', async (req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  let query = supabaseAdmin.from('inventory_items').select('*').eq('is_active', true);
  if (req.query.status) query = query.eq('status', req.query.status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ items: data });
});

router.get('/media', async (_req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  const { data, error } = await supabaseAdmin.from('media_assets').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ assets: data });
});

router.post('/requests', async (req, res) => {
  const supabaseAdmin = getAdminClientOrRespond(res);
  if (!supabaseAdmin) return;

  const body = req.body;
  const reference_id = makeReferenceId();
  const payload = {
    reference_id,
    request_type: body.request_type,
    business_name: body.business_name,
    contact_name: body.contact_name,
    phone_whatsapp: body.phone_whatsapp,
    email: body.email,
    parish: body.parish,
    business_type: body.business_type,
    urgency: body.urgency,
    substitutions_allowed: body.substitutions_allowed,
    notes: body.notes
  };
  const { data: requestData, error: requestError } = await supabaseAdmin.from('requests').insert(payload).select('*').single();
  if (requestError) return res.status(400).json({ error: requestError.message });

  const items = (body.items || []).map((item) => ({ ...item, request_id: requestData.id }));
  if (items.length) {
    const { error: itemError } = await supabaseAdmin.from('request_items').insert(items);
    if (itemError) return res.status(400).json({ error: itemError.message });
  }

  res.status(201).json({ reference_id, id: requestData.id });
});

export default router;
