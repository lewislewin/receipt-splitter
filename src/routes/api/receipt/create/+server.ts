import { json } from '@sveltejs/kit';
import type { ParsedReceipt } from '$lib/types';
import { env } from '$env/dynamic/private';
import { v4 as uuidv4 } from 'uuid';
import type { KVNamespace } from '@cloudflare/workers-types';

// Simulated KV store for development
const inMemoryKV: Record<string, string> = {};

declare const RECEIPTS: KVNamespace;

const getKV = () => {
  if (env.NODE_ENV === 'development') {
    return {
      put: async (key: string, value: string) => {
        inMemoryKV[key] = value;
      },
      get: async (key: string) => inMemoryKV[key] ?? null,
    };
  }
  return RECEIPTS; // Cloudflare KV in production
};

const kv = getKV();

export const POST = async ({ request }: { request: Request }) => {
  try {
    const data = await request.formData();
    const receipt = JSON.parse(data.get('receipt') as string) as ParsedReceipt;

    const receiptId = uuidv4();
    await kv.put(receiptId, JSON.stringify(receipt));

    return json({ id: receiptId });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
