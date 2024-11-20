<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ReceiptItem } from '$lib/types';

  let { item, update } = $props()

  const updateField = (field: keyof ReceiptItem, value: any) => {
    const updatedItem: ReceiptItem = { ...item, [field]: value };
    update(updatedItem);
  };

  const calculateRowTotal = () => (item.qty * (item.price ?? 0)).toFixed(2);
</script>

<div class="grid grid-cols-5 items-center gap-2">
  <!-- Editable item name -->
  <input 
    type="text" 
    class="border p-1 rounded w-full"
    value={item.item} 
    oninput={(e) => updateField('item', (e.target as HTMLInputElement).value)} 
  />

  <!-- Quantity controls -->
  <div class="flex items-center space-x-2">
    <button onclick={() => updateField('qty', Math.max(item.qty - 1, 0))} class="p-1 bg-gray-200 rounded">-</button>
    <span>{item.qty}</span>
    <button onclick={() => updateField('qty', item.qty + 1)} class="p-1 bg-gray-200 rounded">+</button>
  </div>

  <!-- Editable price -->
  <input 
    type="number" 
    step="0.01"
    class="border p-1 rounded w-full"
    value={(item.price ?? 0).toFixed(2)} 
    oninput={(e) => updateField('price', parseFloat((e.target as HTMLInputElement).value) || 0)} 
  />

  <!-- Row total -->
  <div class="text-right font-semibold">
    £{calculateRowTotal()}
  </div>
</div>
