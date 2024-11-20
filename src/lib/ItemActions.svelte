<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { ReceiptItem } from '$lib/types';
  
    export let item: ReceiptItem;
  
    const dispatch = createEventDispatcher();
  
    const incrementQty = () => {
      dispatch('update', { ...item, qty: item.qty + 1 });
    };
  
    const decrementQty = () => {
      dispatch('update', { ...item, qty: Math.max(item.qty - 1, 0) });
    };
  
    const removeItem = () => {
      dispatch('remove', item);
    };
  </script>
  
  <div class="flex items-center space-x-4">
    <button
      on:click={decrementQty}
      class="w-10 h-10 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold"
    >
      -
    </button>
    <span class="text-lg font-semibold">{item.qty}</span>
    <button
      on:click={incrementQty}
      class="w-10 h-10 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold"
    >
      +
    </button>
    <button
      on:click={removeItem}
      class="w-24 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 font-bold"
    >
      Remove
    </button>
  </div>
  