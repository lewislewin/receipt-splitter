<script lang="ts">
  import type { Modifier, ParsedReceipt, ReceiptItem } from '$lib/types';
  import ItemComponent from '$lib/ItemComponent.svelte';
  import ModifierComponent from '$lib/ModifierComponent.svelte';

  export let receipt: ParsedReceipt;

  const updateItem = (index: number, updatedItem: ReceiptItem) => {
    receipt.items[index] = updatedItem;
    receipt = { ...receipt }; // Trigger reactivity
  };

  const updateModifier = (index: number, updatedModifier: Modifier) => {
    receipt.modifiers[index] = updatedModifier;
    receipt = { ...receipt }; // Trigger reactivity
  };

  const addItem = () => receipt.items.push({ item: '', qty: 1, price: 0 });
  const removeItem = (index: number) => receipt.items.splice(index, 1);

  const addModifier = () => receipt.modifiers.push({ type: '', percentage: 0, value: 0 });
  const removeModifier = (index: number) => receipt.modifiers.splice(index, 1);
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
