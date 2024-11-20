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

<div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
  <h2 class="text-2xl font-bold mb-4 text-center">{receipt.name}</h2>

  <!-- Items Section -->
  <div class="mb-6">
    <h3 class="text-lg font-semibold text-center">Items</h3>
    <ul class="space-y-2">
      {#each receipt.items as item, index}
        <li class="flex items-center space-x-4">
          <ItemComponent {item} on:update={(e) => updateItem(index, e.detail)} />
          <button on:click={() => removeItem(index)} class="text-red-500 hover:text-red-700 font-bold">
            Remove
          </button>
        </li>
      {/each}
    </ul>
    <button on:click={addItem} class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
      Add Item
    </button>
  </div>

  <!-- Modifiers Section -->
  <div>
    <h3 class="text-lg font-semibold text-center">Modifiers</h3>
    <ul class="space-y-2">
      {#each receipt.modifiers as modifier, index}
        <li class="flex items-center space-x-4">
          <ModifierComponent {modifier} on:update={(e) => updateModifier(index, e.detail)} />
          <button on:click={() => removeModifier(index)} class="text-red-500 hover:text-red-700 font-bold">
            Remove
          </button>
        </li>
      {/each}
    </ul>
    <button on:click={addModifier} class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
      Add Modifier
    </button>
  </div>
</div>
