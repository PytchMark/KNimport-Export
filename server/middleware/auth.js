import { supabaseAdmin } from '../services/supabase.js';

export async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Invalid token' });
  const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST || '').split(',').map((x) => x.trim()).filter(Boolean);
  if (allowlist.length && !allowlist.includes(data.user.email)) return res.status(403).json({ error: 'Not an allowed admin' });
  req.user = data.user;
  next();
}
