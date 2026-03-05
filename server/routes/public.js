import { Router } from 'express';
import { getFirestoreDb, getFirebaseInitError } from '../services/firebase.js';
import { makeReferenceId } from '../utils/reference.js';

const router = Router();

function withFirestore(res) {
  const firestore = getFirestoreDb();
  if (firestore) return firestore;

  const initError = getFirebaseInitError();
  res.status(503).json({
    error: 'Firebase is not configured on the server.',
    details: initError?.message
  });
  return null;
}

router.get('/health', (_req, res) => res.json({ ok: true }));

router.get('/inventory', async (req, res) => {
  try {
    const firestore = withFirestore(res);
    if (!firestore) return;

    let query = firestore.collection('inventory_items').where('is_active', '==', true);
    if (req.query.status) query = query.where('status', '==', req.query.status);

    const snapshot = await query.get();
    const items = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

    res.json({ items });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/media', async (_req, res) => {
  try {
    const firestore = withFirestore(res);
    if (!firestore) return;

    const snapshot = await firestore.collection('media_assets').get();
    const assets = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

    res.json({ assets });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/requests', async (req, res) => {
  try {
    const firestore = withFirestore(res);
    if (!firestore) return;

    const body = req.body;
    const reference_id = makeReferenceId();
    const now = new Date().toISOString();
    const requestDoc = {
      reference_id,
      request_type: body.request_type,
      business_name: body.business_name,
      contact_name: body.contact_name,
      phone_whatsapp: body.phone_whatsapp,
      email: body.email || null,
      parish: body.parish || null,
      business_type: body.business_type || null,
      urgency: body.urgency || null,
      substitutions_allowed: body.substitutions_allowed ?? true,
      notes: body.notes || null,
      status: 'new',
      request_items: body.items || [],
      created_at: now,
      updated_at: now
    };

    const ref = await firestore.collection('requests').add(requestDoc);
    res.status(201).json({ reference_id, id: ref.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
