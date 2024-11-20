import { json } from '@sveltejs/kit';
import type { ParsedReceipt } from '$lib/types';
import type { KVNamespace } from '@cloudflare/workers-types';

// Cloudflare KV binding
declare const RECEIPTS: KVNamespace;

export const GET = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const receiptData = await RECEIPTS.get(id);

  if (!receiptData) {
    return json({ error: 'Receipt not found' }, { status: 404 });
  }

  const receipt: ParsedReceipt = JSON.parse(receiptData);
  return json(receipt);
};
