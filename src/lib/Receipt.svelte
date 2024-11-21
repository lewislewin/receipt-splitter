<script lang="ts">
  import ItemsTable from './ItemsTable.svelte';
  import ModifiersTable from './ModifiersTable.svelte';
  import type { ReceiptItem, Modifier } from '$lib/types';
	import { goto } from '$app/navigation';

  let { receipt, canEdit } = $props();

  interface ApiResponse {
    id: string;
  }
  
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

  const updateModifier = (index: number, updatedModifier: Modifier) => {
    const updatedModifiers = [...receipt.modifiers];
    updatedModifiers[index] = updatedModifier;
    receipt = { ...receipt, modifiers: updatedModifiers };
  };

  const removeModifier = (index: number) => {
    const updatedModifiers = receipt.modifiers.filter((_, i) => i !== index);
    receipt = { ...receipt, modifiers: updatedModifiers };
  };

  const addModifier = () => {
    receipt = {
      ...receipt,
      modifiers: [...receipt.modifiers, { type: '', percentage: 0, value: 0 }],
    };
  };

  // Generate a receipt link by sending it to the server
  async function generateReceiptLink() {
    try {
      if (!receipt) {
        console.error('No receipt to generate a link for');
        return;
      }

      const response = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receipt),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate link: ${response.statusText}`);
      }

      // Ensure the response contains the receipt ID
      const record: ApiResponse = await response.json();
      console.log('Receipt link generated:', record.id);

      // Navigate to the generated URL
      goto(`/receipts/${record.id}`);
    } catch (error) {
      console.error('Error generating receipt link:', error);
    }
  }
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
      {canEdit}
    />
    {#if canEdit}
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

  <!-- Modifiers Table -->
  <div class="mb-10">
    <h3 class="mb-6 text-center text-2xl font-semibold text-gray-700">Modifiers</h3>
    <ModifiersTable
      modifiers={receipt.modifiers}
      onModifierUpdate={updateModifier}
      onModifierRemove={removeModifier}
      {canEdit}
    />
    {#if canEdit}
      <div class="mt-6 text-center">
        <button
          onclick={addModifier}
          class="rounded bg-green-500 px-6 py-3 text-lg font-bold text-white hover:bg-green-600"
        >
          Add Modifier
        </button>
      </div>
      <div class="mt-6 flex justify-center">
        <button
          onclick={generateReceiptLink}
          aria-label="Generate Receipt Link"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
        >
          Generate Link
        </button>
      </div>
    {/if}
  </div>
</div>
