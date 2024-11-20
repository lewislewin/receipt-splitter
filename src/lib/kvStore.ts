import { env } from '$env/dynamic/private';
import type { KVNamespace } from '@cloudflare/workers-types';

// Simulated KV store for development
const inMemoryKV: Record<string, string> = {};

// Cloudflare KV binding
declare const RECEIPTS: KVNamespace;

// Function to select the appropriate KV store
export const getKV = () => {
  if (env.NODE_ENV === 'development') {
    return {
      put: async (key: string, value: string) => {
        console.log(key, value)
        inMemoryKV[key] = value;
      },
      get: async (key: string) => inMemoryKV[key] ?? null,
    };
  }
  return RECEIPTS; // Cloudflare KV in production
};
