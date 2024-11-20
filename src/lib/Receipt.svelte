<script lang="ts">
    import type { ParsedReceipt } from '$lib/types';
  
    export let receipt: ParsedReceipt | null = null;
  </script>
  
  {#if receipt}
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">{receipt.name}</h2>
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-center">Items</h3>
        <div class="grid grid-cols-3 font-semibold text-gray-600 border-b pb-2 mb-2">
          <div>Item</div>
          <div>Quantity</div>
          <div>Price</div>
        </div>
        <ul class="space-y-2">
          {#each receipt.items as { item, price, qty }}
            <li class="grid grid-cols-3">
              <div>{item}</div>
              <div>x{qty}</div>
              <div>£{price != null ? price.toFixed(2) : '0.00'}</div>
            </li>
          {/each}
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-center">Modifiers</h3>
        <div class="grid grid-cols-3 font-semibold text-gray-600 border-b pb-2 mb-2">
          <div>Type</div>
          <div>Percentage</div>
          <div>Value</div>
        </div>
        <ul class="space-y-2">
          {#each receipt.modifiers as { type, value, percentage }}
            <li class="grid grid-cols-3">
              <div>{type}</div>
              <div>
                {percentage != null ? `${percentage}%` : 'N/A'}
              </div>
              <div>
                £{value != null ? value.toFixed(2) : '0.00'}
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {:else}
    <p class="text-center text-gray-500">No receipt data available.</p>
  {/if}
  