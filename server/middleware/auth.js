import { getFirebaseAuth, getFirebaseInitError } from '../services/firebase.js';

export async function requireAdmin(req, res, next) {
  const auth = getFirebaseAuth();
  if (!auth) {
    const error = getFirebaseInitError();
    return res.status(503).json({
      error: 'Firebase auth is not configured on the server.',
      details: error?.message
    });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = await auth.verifyIdToken(token);
    const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST || '').split(',').map((x) => x.trim()).filter(Boolean);

    if (allowlist.length && !allowlist.includes(decoded.email)) {
      return res.status(403).json({ error: 'Not an allowed admin' });
    }

    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
