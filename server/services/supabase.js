import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createOptionalClient(key, label) {
  if (!url || !key) {
    console.warn(
      `[config] ${label} disabled: missing ${!url ? 'SUPABASE_URL' : ''}${
        !url && !key ? ' and ' : ''
      }${!key ? (label.includes('admin') ? 'SUPABASE_SERVICE_ROLE_KEY' : 'SUPABASE_ANON_KEY') : ''}`
    );
    return null;
  }

  return createClient(url, key);
}

export const supabaseAdmin = createOptionalClient(service, 'supabase-admin');
export const supabasePublic = createOptionalClient(anon, 'supabase-public');

export function getSupabaseAdmin() {
  return supabaseAdmin;
}
