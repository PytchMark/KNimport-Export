import { initializeApp, cert, getApps, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let initError = null;

function parseServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed.private_key) parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    return parsed;
  } catch {
    return null;
  }
}

function initFirebaseAdmin() {
  if (getApps().length) return getApps()[0];

  const serviceAccount = parseServiceAccount();
  if (serviceAccount) return initializeApp({ credential: cert(serviceAccount) });

  const projectId = process.env.FIREBASE_PROJECT_ID;
  return initializeApp({
    credential: applicationDefault(),
    ...(projectId ? { projectId } : {})
  });
}

export function getFirebaseAuth() {
  try {
    const app = initFirebaseAdmin();
    return getAuth(app);
  } catch (error) {
    initError = error;
    return null;
  }
}

export function getFirestoreDb() {
  try {
    const app = initFirebaseAdmin();
    return getFirestore(app);
  } catch (error) {
    initError = error;
    return null;
  }
}

export function getFirebaseInitError() {
  return initError;
}
