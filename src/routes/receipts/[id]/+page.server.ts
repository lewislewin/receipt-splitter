import type { ParsedReceipt } from '$lib/types';

export const load = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // Simulate fetching data or use real KV store
  const receiptData = JSON.stringify({
    name: 'Flatiron Steak',
    modifiers: [
      { type: 'Optional Donation', value: 0.6, percentage: null },
      { type: 'Service Charge', value: 18.06, percentage: 12.5 },
      { type: 'Tax', value: 24.08, percentage: 20 }
    ],
    items: [
      { item: 'Pillars Pils', price: 5.75, qty: 1 },
      { item: 'Coke', price: 3.4, qty: 2 },
      { item: 'Coke Zero', price: 3.4, qty: 2 },
      { item: 'Steak', price: 14, qty: 6 },
      { item: 'Crispy Bone Marrow Mash', price: 4.5, qty: 5 },
      { item: 'Truffled Mac & Cheese', price: 5.7, qty: 2 },
      { item: 'Chips', price: 4, qty: 1 },
      { item: 'Bearnaise', price: 1.5, qty: 1 },
      { item: 'Peppercorn', price: 1.5, qty: 1 }
    ]
  }); // Replace with `await RECEIPTS.get(id)` for real data

  if (!receiptData) {
    throw new Error('Receipt not found');
  }

  const receipt: ParsedReceipt = JSON.parse(receiptData);

  // Return the receipt wrapped in an object
  return {
    props: { receipt }
  };
};
