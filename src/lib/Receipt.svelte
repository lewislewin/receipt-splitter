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

      const record: ApiResponse = await response.json();
      console.log('Receipt link generated:', record.id);

      goto(`/receipts/${record.id}`);
    } catch (error) {
      console.error('Error generating receipt link:', error);
    }
  }
</script>

<div class="min-h-screen w-full max-w-5xl mx-auto bg-white p-10 rounded-lg shadow-lg flex flex-col justify-between">
  <!-- Header -->
  <h2 class="mb-8 text-center text-4xl font-bold text-gray-800">{receipt.name}</h2>

  <!-- Content -->
  <div class="flex-grow">
    <!-- Items Table -->
    <div class="mb-10">
      <h3 class="mb-6 text-center text-2xl font-semibold text-gray-700">Items</h3>
      <ItemsTable
        items={receipt.items}
        onItemUpdate={updateItem}
        onItemRemove={removeItem}
        {canEdit}
      />
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
    </div>
  </div>

  <!-- Buttons at the Bottom -->
  {#if canEdit}
    <div class="mt-10 flex flex-col sm:flex-row sm:space-x-4 justify-center items-center">
      <button
        onclick={addItem}
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg w-full sm:w-auto mb-4 sm:mb-0"
      >
        Add Item
      </button>
      <button
        onclick={addModifier}
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg w-full sm:w-auto mb-4 sm:mb-0"
      >
        Add Modifier
      </button>
      <button
        onclick={generateReceiptLink}
        class="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg w-full sm:w-auto"
      >
        Generate Link
      </button>
    </div>
  {/if}
</div>
