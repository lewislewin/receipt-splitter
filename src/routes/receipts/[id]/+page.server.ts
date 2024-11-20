import type { ParsedReceipt } from '$lib/types';
import type { KVNamespace } from '@cloudflare/workers-types';

// Cloudflare KV binding
declare const RECEIPTS: KVNamespace;

export const load = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    // Retrieve the receipt from KV store
    const receiptData = await RECEIPTS.get(id);

    if (!receiptData) {
      throw new Error('Receipt not found');
    }

    // Parse the receipt data
    const receipt: ParsedReceipt = JSON.parse(receiptData);

    return { receipt };
  } catch (error) {
    // Handle errors
    return {
      status: 404,
      error: new Error('Receipt not found or an error occurred'),
    };
  }
};
