import { env } from '$env/dynamic/private';
import type { KVNamespace } from '@cloudflare/workers-types';

const inMemoryKV: Record<string, string> = {};

declare const RECEIPTS: KVNamespace | undefined;

export const getKV = () => {
  if (env.NODE_ENV === 'development' || typeof RECEIPTS === 'undefined') {
    return {
      put: async (key: string, value: string) => {
        console.log('Storing in dev KV:', key, value);
        inMemoryKV[key] = value;
      },
      get: async (key: string) => {
        console.log('Retrieving from dev KV:', key);
        return inMemoryKV[key] ?? null;
      },
    };
  }
  return RECEIPTS; // Cloudflare KV in production
};
