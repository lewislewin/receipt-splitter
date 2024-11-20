<script lang="ts">
  import type { Modifier, ParsedReceipt, ReceiptItem } from '$lib/types';
  import ItemComponent from '$lib/ItemComponent.svelte';
  import ModifierComponent from '$lib/ModifierComponent.svelte';

  export let receipt: ParsedReceipt | null = null;

  const updateItem = (index: number, updatedItem: ReceiptItem) => {
    if (receipt) {
      receipt.items[index] = updatedItem;
      receipt = { ...receipt }; // Trigger reactivity
    }
  };

  const updateModifier = (index: number, updatedModifier: Modifier) => {
    if (receipt) {
      receipt.modifiers[index] = updatedModifier;
      receipt = { ...receipt }; // Trigger reactivity
    }
  };

  const addItem = () => {
    if (receipt) {
      receipt.items = [...receipt.items, { item: '', qty: 1, price: 0 }];
      receipt = { ...receipt }; // Trigger reactivity
    }
  };

  const removeItem = (index: number) => {
    if (receipt) {
      receipt.items = receipt.items.filter((_, i) => i !== index);
      receipt = { ...receipt }; // Trigger reactivity
    }
  };

  const addModifier = () => {
    if (receipt) {
      receipt.modifiers = [...receipt.modifiers, { type: '', percentage: 0, value: 0 }];
      receipt = { ...receipt }; // Trigger reactivity
    }
  };

  const removeModifier = (index: number) => {
    if (receipt) {
      receipt.modifiers = receipt.modifiers.filter((_, i) => i !== index);
      receipt = { ...receipt }; // Trigger reactivity
    }
  };
</script>

{#if receipt}
  <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-2xl font-bold mb-4 text-center">{receipt.name}</h2>

    <!-- Items Section -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-center">Items</h3>
      <div class="grid grid-cols-3 font-semibold text-gray-600 border-b pb-2 mb-2">
        <div>Item</div>
        <div>Quantity</div>
        <div>Price</div>
      </div>
      <ul class="space-y-2">
        {#each receipt.items as item, index}
          <li class="flex items-center space-x-4">
            <ItemComponent 
              {item} 
              on:update={(e) => updateItem(index, e.detail)} 
            />
            <button 
              on:click={() => removeItem(index)} 
              class="text-red-500 hover:text-red-700 font-bold"
            >
              Remove
            </button>
          </li>
        {/each}
      </ul>
      <button 
        on:click={addItem} 
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Add Item
      </button>
    </div>

    <!-- Modifiers Section -->
    <div>
      <h3 class="text-lg font-semibold text-center">Modifiers</h3>
      <div class="grid grid-cols-3 font-semibold text-gray-600 border-b pb-2 mb-2">
        <div>Type</div>
        <div>Percentage</div>
        <div>Value</div>
      </div>
      <ul class="space-y-2">
        {#each receipt.modifiers as modifier, index}
          <li class="flex items-center space-x-4">
            <ModifierComponent 
              {modifier} 
              on:update={(e) => updateModifier(index, e.detail)} 
            />
            <button 
              on:click={() => removeModifier(index)} 
              class="text-red-500 hover:text-red-700 font-bold"
            >
              Remove
            </button>
          </li>
        {/each}
      </ul>
      <button 
        on:click={addModifier} 
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Add Modifier
      </button>
    </div>
  </div>
{:else}
  <p class="text-center text-gray-500">No receipt data available.</p>
{/if}
