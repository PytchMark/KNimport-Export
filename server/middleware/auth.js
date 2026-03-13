import crypto from 'crypto';

// Admin accounts from environment
const ADMINS = [
  {
    username: process.env.ADMIN_1_USERNAME || 'admin1',
    password: process.env.ADMIN_1_PASSWORD || 'KnAdmin2026!',
    role: process.env.ADMIN_1_ROLE || 'admin'
  },
  {
    username: process.env.ADMIN_2_USERNAME || 'admin2',
    password: process.env.ADMIN_2_PASSWORD || 'KnAdmin2026!',
    role: process.env.ADMIN_2_ROLE || 'admin'
  },
  {
    username: process.env.MASTER_ADMIN_USERNAME || 'masteradmin',
    password: process.env.MASTER_ADMIN_PASSWORD || 'KnMaster2026!Dev',
    role: process.env.MASTER_ADMIN_ROLE || 'masteradmin'
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'kn-import-export-secret-2026-secure-key';

// Simple JWT-like token creation
function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

// Simple JWT-like token verification
function verifyToken(token) {
  try {
    const [header, body, signature] = token.split('.');
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    
    return payload;
  } catch {
    return null;
  }
}

// Login handler
export function loginAdmin(username, password) {
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (!admin) return null;
  
  const token = createToken({
    username: admin.username,
    role: admin.role
  });
  
  return {
    token,
    user: {
      username: admin.username,
      role: admin.role
    }
  };
}

// Get all admin usernames (for display purposes)
export function getAdminList() {
  return ADMINS.map(a => ({ username: a.username, role: a.role }));
}

// Auth middleware
export async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });

  // Check if user still exists in admin list
  const admin = ADMINS.find(a => a.username === payload.username);
  if (!admin) return res.status(401).json({ error: 'User no longer authorized' });

  req.user = payload;
  next();
}

// Master admin only middleware
export async function requireMasterAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });

  if (payload.role !== 'masteradmin') {
    return res.status(403).json({ error: 'Master admin access required' });
  }

  req.user = payload;
  next();
}
