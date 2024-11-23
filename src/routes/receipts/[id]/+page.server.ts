import { getKV } from '$lib/kvStore';
import type { ParsedReceipt } from '$lib/types';

const kv = getKV();

// export const load = async ({ params }: { params: { id: string } }) => {
//   const { id } = params;

//   try {
//     console.log('INLOAD')
//     // Retrieve receipt from KV store
//     const receiptData = await kv.get(id);
//     console.log('a', receiptData)

//     if (!receiptData) {
//       throw new Error('Receipt not found');
//     }

//     // Parse the receipt data
//     const receipt: ParsedReceipt = JSON.parse(receiptData);
//     console.log('b', receipt)

//     // Return the receipt wrapped in props
//     return {
//       receipt,
//     };
//   } catch (error) {
//     // Handle errors and provide fallback or error messages
//     return {
//       status: 404,
//       error: new Error(`Failed to load receipt: ${error instanceof Error ? error.message : 'Unknown error'}`),
//     };
//   }
// };
