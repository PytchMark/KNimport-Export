import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { supabaseAdmin } from '../services/supabase.js';

const router = Router();
router.use(requireAdmin);

router.get('/requests', async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('requests').select('*, request_items(*)').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ requests: data });
});

router.patch('/requests/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('requests').update(req.body).eq('id', req.params.id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ request: data });
});

router.post('/inventory', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('inventory_items').insert(req.body).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ item: data });
});

router.patch('/inventory/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('inventory_items').update(req.body).eq('id', req.params.id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ item: data });
});

router.post('/media', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('media_assets').insert(req.body).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ asset: data });
});

router.delete('/media/:id', async (req, res) => {
  const { error } = await supabaseAdmin.from('media_assets').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ deleted: true });
});

export default router;
