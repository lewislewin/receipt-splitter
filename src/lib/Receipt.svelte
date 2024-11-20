<script lang="ts">
  import type { Modifier, ParsedReceipt, ReceiptItem } from '$lib/types';
  import ItemComponent from '$lib/ItemComponent.svelte';
  import ModifierComponent from '$lib/ModifierComponent.svelte';
  import { createEventDispatcher } from 'svelte';

  export let receipt: ParsedReceipt;
  const dispatch = createEventDispatcher();

  const updateItem = (index: number, updatedItem: ReceiptItem) => {
    const updatedItems = [...receipt.items];
    updatedItems[index] = updatedItem;
    dispatch('update', { ...receipt, items: updatedItems });
  };

  const updateModifier = (index: number, updatedModifier: Modifier) => {
    const updatedModifiers = [...receipt.modifiers];
    updatedModifiers[index] = updatedModifier;
    dispatch('update', { ...receipt, modifiers: updatedModifiers });
  };

  const addItem = () => {
    const updatedItems = [...receipt.items, { item: '', qty: 1, price: 0 }];
    dispatch('update', { ...receipt, items: updatedItems });
  };

  const removeItem = (index: number) => {
    const updatedItems = receipt.items.filter((_, i) => i !== index);
    dispatch('update', { ...receipt, items: updatedItems });
  };

  const addModifier = () => {
    const updatedModifiers = [...receipt.modifiers, { type: '', percentage: 0, value: 0 }];
    dispatch('update', { ...receipt, modifiers: updatedModifiers });
  };

  const removeModifier = (index: number) => {
    const updatedModifiers = receipt.modifiers.filter((_, i) => i !== index);
    dispatch('update', { ...receipt, modifiers: updatedModifiers });
  };
</script>

<div class="min-h-screen w-full max-w-5xl mx-auto bg-white p-10 rounded-lg shadow-lg">
  <h2 class="mb-8 text-center text-4xl font-bold text-gray-800">{receipt.name}</h2>

  <!-- Items Section -->
  <div class="mb-10">
    <h3 class="mb-6 text-center text-2xl font-semibold text-gray-700">Items</h3>
    <ul class="space-y-4">
      {#each receipt.items as item, index}
        <li class="flex items-center space-x-6">
          <ItemComponent
            {item}
            update={(updatedValue: ReceiptItem) => updateItem(index, updatedValue)}
          />
          <button
            on:click={() => removeItem(index)}
            class="rounded bg-red-500 px-4 py-2 text-white font-bold hover:bg-red-600"
          >
            Remove
          </button>
        </li>
      {/each}
    </ul>
    <div class="mt-6 text-center">
      <button
        on:click={addItem}
        class="rounded bg-blue-500 px-6 py-3 text-lg font-bold text-white hover:bg-blue-600"
      >
        Add Item
      </button>
    </div>
  </div>

  <!-- Modifiers Section -->
  <div>
    <h3 class="mb-6 text-center text-2xl font-semibold text-gray-700">Modifiers</h3>
    <ul class="space-y-4">
      {#each receipt.modifiers as modifier, index}
        <li class="flex items-center space-x-6">
          <ModifierComponent
            {modifier}
            update={(updatedValue: Modifier) => updateModifier(index, updatedValue)}
          />
          <button
            on:click={() => removeModifier(index)}
            class="rounded bg-red-500 px-4 py-2 text-white font-bold hover:bg-red-600"
          >
            Remove
          </button>
        </li>
      {/each}
    </ul>
    <div class="mt-6 text-center">
      <button
        on:click={addModifier}
        class="rounded bg-blue-500 px-6 py-3 text-lg font-bold text-white hover:bg-blue-600"
      >
        Add Modifier
      </button>
    </div>
  </div>
</div>
