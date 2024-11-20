<script lang="ts">
    import type { ReceiptItem } from '$lib/types';
  
    let { update, remove, item } = $props();
  
    const incrementQty = () => {
      const updatedItem = { ...item, qty: item.qty + 1 };
      update(updatedItem);
    };
  
    const decrementQty = () => {
      const updatedItem = { ...item, qty: Math.max(item.qty - 1, 0) };
      update(updatedItem);
    };
  
    const handleRemove = () => {
      remove(); // Invoke the `remove` function passed as a prop
    };
  </script>
  
  <div class="flex items-center space-x-4">
    <button
      onclick={decrementQty}
      class="w-10 h-10 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold"
    >
      -
    </button>
    <span class="text-lg font-semibold">{item.qty}</span>
    <button
      onclick={incrementQty}
      class="w-10 h-10 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold"
    >
      +
    </button>
    <button
      onclick={handleRemove}
      class="w-24 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 font-bold"
    >
      Remove
    </button>
  </div>
  