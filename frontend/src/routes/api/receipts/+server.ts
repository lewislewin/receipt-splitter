import { json } from '@sveltejs/kit';
import { getKV } from '$lib/kvStore';
import { v4 as uuidv4 } from 'uuid';
import type { ParsedReceipt } from '$lib/types';

const kv = getKV();

export const POST = async ({ request }: { request: Request }) => {
  try {
    const data: ParsedReceipt = await request.json();

    const receiptId = uuidv4();
    await kv.put(receiptId, JSON.stringify(data));

    console.log(await kv.get(receiptId))

    return json({ id: receiptId });
  } catch (error: unknown) {
    return json({ error: error.message }, { status: 500 });
  }
};
