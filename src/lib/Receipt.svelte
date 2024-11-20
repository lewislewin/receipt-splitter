<script lang="ts">
  import ItemsTable from './ItemsTable.svelte';
  import type { ReceiptItem, ParsedReceipt } from '$lib/types';

  let { receipt, readOnly } = $props()

  const updateItem = (index: number, updatedItem: ReceiptItem) => {
    const updatedItems = [...receipt.items];
    updatedItems[index] = updatedItem;
    receipt = { ...receipt, items: updatedItems };
  };

  const removeItem = (index: number) => {
    const updatedItems = receipt.items.filter((_, i) => i !== index);
    receipt = { ...receipt, items: updatedItems };
  };

  const addItem = () => {
    receipt = {
      ...receipt,
      items: [...receipt.items, { item: '', qty: 1, price: 0 }],
    };
  };
</script>

<div class="min-h-screen w-full max-w-5xl mx-auto bg-white p-10 rounded-lg shadow-lg">
  <h2 class="mb-8 text-center text-4xl font-bold text-gray-800">{receipt.name}</h2>

  <!-- Items Table -->
  <div class="mb-10">
    <h3 class="mb-6 text-center text-2xl font-semibold text-gray-700">Items</h3>
    <ItemsTable
      items={receipt.items}
      onItemUpdate={updateItem}
      onItemRemove={removeItem}
      canEdit={!readOnly}
    />
    {#if !readOnly}
    <div class="mt-6 text-center">
      <button
        onclick={addItem}
        class="rounded bg-blue-500 px-6 py-3 text-lg font-bold text-white hover:bg-blue-600"
      >
        Add Item
      </button>
    </div>
    {/if}
  </div>
</div>
