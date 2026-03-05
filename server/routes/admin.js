import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { getFirestoreDb, getFirebaseInitError } from '../services/firebase.js';

const router = Router();
router.use(requireAdmin);

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

router.get('/requests', async (_req, res) => {
  try {
    const firestore = withFirestore(res);
    if (!firestore) return;

    const snapshot = await firestore.collection('requests').get();
    const requests = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data(), request_items: doc.data().request_items || [] }))
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

    res.json({ requests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/requests/:id', async (req, res) => {
  try {
    const firestore = withFirestore(res);
    if (!firestore) return;

    const ref = firestore.collection('requests').doc(req.params.id);
    await ref.set({ ...req.body, updated_at: new Date().toISOString() }, { merge: true });
    const updated = await ref.get();
    res.json({ request: { id: updated.id, ...updated.data() } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/inventory', async (req, res) => {
  try {
    const firestore = withFirestore(res);
    if (!firestore) return;

    const now = new Date().toISOString();
    const payload = {
      is_active: true,
      featured: false,
      ...req.body,
      created_at: now,
      updated_at: now
    };
    const ref = await firestore.collection('inventory_items').add(payload);
    res.status(201).json({ item: { id: ref.id, ...payload } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/inventory/:id', async (req, res) => {
  try {
    const firestore = withFirestore(res);
    if (!firestore) return;

    const ref = firestore.collection('inventory_items').doc(req.params.id);
    await ref.set({ ...req.body, updated_at: new Date().toISOString() }, { merge: true });
    const updated = await ref.get();
    res.json({ item: { id: updated.id, ...updated.data() } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/media', async (req, res) => {
  try {
    const firestore = withFirestore(res);
    if (!firestore) return;

    const payload = { ...req.body, created_at: new Date().toISOString() };
    const ref = await firestore.collection('media_assets').add(payload);
    res.status(201).json({ asset: { id: ref.id, ...payload } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/media/:id', async (req, res) => {
  try {
    const firestore = withFirestore(res);
    if (!firestore) return;

    await firestore.collection('media_assets').doc(req.params.id).delete();
    res.json({ deleted: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
