<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ReceiptItem } from '$lib/types';

  // Props
  export let selectedItem: ReceiptItem;
  export let minimal = false;

  const dispatch = createEventDispatcher();

  const addLine = () => dispatch('addLine', selectedItem);
  const cancel = () => dispatch('cancel');
  const removeLine = () => dispatch('removeLine', selectedItem);
  const expand = () => dispatch('expand');

  const incrementQty = () => selectedItem.qty++;
  const decrementQty = () => (selectedItem.qty = Math.max(selectedItem.qty - 1, 0));

  let fractionalQty = 1; // Default to 1 (no split)

  const updateFraction = (fraction: number) => {
    fractionalQty = fraction;
    selectedItem.qty = fractionalQty;
  };

  const calculateRowTotal = () => {
    return (selectedItem.price * selectedItem.qty).toFixed(2);
  };

  const fractionalOptions = [1, 0.5, 0.25, 0.1]; // Example fractional splits
</script>

<div class="p-4 bg-gray-100 rounded shadow mb-4">
  {#if minimal}
    <div class="flex justify-between items-center">
      <span>{selectedItem.item}</span>
      <span>£{(selectedItem.price * selectedItem.qty).toFixed(2)}</span>
      <button class="text-blue-500" onclick={expand}>Edit</button>
    </div>
  {:else}
    <div class="flex justify-between items-center mb-2">
      <span class="font-semibold">{selectedItem.item}</span>
      <span>£{selectedItem.price?.toFixed(2)}</span>
    </div>
    <div class="flex items-center mb-2">
      <!-- Quantity Controls -->
      <button class="h-10 w-10 bg-gray-300 rounded" onclick={decrementQty}>-</button>
      <input
        type="number"
        class="w-16 text-center border mx-2"
        bind:value={selectedItem.qty}
      />
      <button class="h-10 w-10 bg-gray-300 rounded" onclick={incrementQty}>+</button>

      <!-- Split Dropdown -->
      <select
        class="border rounded p-2 ml-4"
        bind:value={fractionalQty}
        onchange={(e) => updateFraction(parseFloat(e.target.value))}
      >
        {#each fractionalOptions as option}
          <option value={option}>
            {option === 1 ? 'Full' : `${option * 100}%`}
          </option>
        {/each}
      </select>
    </div>

    <div class="flex justify-between items-center mt-2">
      <span class="font-semibold">Row Total:</span>
      <span>£{calculateRowTotal()}</span>
    </div>

    <div class="flex justify-between mt-4">
      <button
        class="bg-red-500 text-white rounded py-1 px-4"
        onclick={cancel}
      >
        Cancel
      </button>
      <button
        class="bg-blue-500 text-white rounded py-1 px-4"
        onclick={addLine}
      >
        Add
      </button>
    </div>
  {/if}
</div>
