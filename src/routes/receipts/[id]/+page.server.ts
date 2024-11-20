import type { ParsedReceipt } from '$lib/types';
import type { KVNamespace } from '@cloudflare/workers-types';

// Cloudflare KV binding
declare const RECEIPTS: KVNamespace;

export const load = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const receiptData = await RECEIPTS.get(id);

  if (!receiptData) {
    throw new Error('Receipt not found');
  }

  const receipt: ParsedReceipt = JSON.parse(receiptData);
  return receipt;
};
