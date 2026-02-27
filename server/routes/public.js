import { Router } from 'express';
import { supabaseAdmin } from '../services/supabase.js';
import { makeReferenceId } from '../utils/reference.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true }));

router.get('/inventory', async (req, res) => {
  let query = supabaseAdmin.from('inventory_items').select('*').eq('is_active', true);
  if (req.query.status) query = query.eq('status', req.query.status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ items: data });
});

router.get('/media', async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('media_assets').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ assets: data });
});

router.post('/requests', async (req, res) => {
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
