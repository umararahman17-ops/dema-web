import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vszazkjezdeqnhwqddfw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_nuqUpHD6AgPeiVBl9hXrNA_gFCqFWZg';

let isHostReachable = false;

// Fast asynchronous DNS validation on server-side to avoid 7-second DNS hangs when domain is invalid/offline
if (typeof window === 'undefined') {
  try {
    const hostname = new URL(supabaseUrl).hostname;
    if (hostname && !hostname.includes('localhost')) {
      const dns = require('dns');
      dns.lookup(hostname, (err) => {
        isHostReachable = !err;
        if (err) {
          console.warn(`[Supabase] Host "${hostname}" tidak dapat diakses (${err.code}). Sistem otomatis menggunakan database lokal instan.`);
        }
      });
    } else if (hostname) {
      isHostReachable = true;
    }
  } catch {
    isHostReachable = false;
  }
} else {
  isHostReachable = true;
}

const rawClient = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Chainable proxy: jika host unreachable, langsung resolve error dalam 0.1ms tanpa blocking render
export const supabase = rawClient ? new Proxy(rawClient, {
  get(target, prop) {
    if (!isHostReachable && typeof window === 'undefined') {
      return () => {
        const queryBuilder = {
          select: () => queryBuilder,
          insert: () => queryBuilder,
          update: () => queryBuilder,
          delete: () => queryBuilder,
          eq: () => queryBuilder,
          neq: () => queryBuilder,
          order: () => queryBuilder,
          limit: () => queryBuilder,
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase host unreachable' } }),
          then: (resolve) => resolve({ data: null, error: { message: 'Supabase host unreachable' } }),
          catch: () => queryBuilder,
        };
        return queryBuilder;
      };
    }
    return target[prop];
  }
}) : null;
