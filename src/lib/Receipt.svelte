<script lang="ts">
    import type { ParsedReceipt } from '$lib/types';
  
    export let receipt: ParsedReceipt | null = null;
  </script>
  
  {#if receipt}
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">{receipt.name}</h2>
      <div class="mb-4">
        <h3 class="text-lg font-semibold">Items</h3>
        <ul class="space-y-2">
          {#each receipt.items as { item, price, qty }}
            <li class="flex justify-between">
              <span>{item}</span>
              <span>x{qty}</span>
              <span>£{price.toFixed(2)}</span>
            </li>
          {/each}
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-semibold">Modifiers</h3>
        <ul class="space-y-2">
          {#each receipt.modifiers as { type, value, percentage }}
            <li class="flex justify-between">
              <span>{type}</span>
              <span>
                {#if percentage > 0}
                  {percentage}%
                {:else}
                  £{value.toFixed(2)}
                {/if}
              </span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {:else}
    <p class="text-center text-gray-500">No receipt data available.</p>
  {/if}
  