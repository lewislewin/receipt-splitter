<script lang="ts">
  import Receipt from './Receipt.svelte';
  import type { ParsedReceipt } from '$lib/types';

  export let parsedReceipt: ParsedReceipt | null = null;

  const clearReceipt = () => (parsedReceipt = null);

  const updateReceipt = (updatedReceipt: ParsedReceipt) => {
    parsedReceipt = updatedReceipt;
  };
</script>

<div class="w-full max-w-md">
  {#if parsedReceipt}
    <Receipt
      receipt={parsedReceipt}
      on:update={(e) => updateReceipt(e.detail)}
    />
    <div class="flex justify-between mt-4">
      <button on:click={clearReceipt} class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        Clear Receipt
      </button>
    </div>
  {:else}
    <p class="text-gray-500 text-center">No receipt loaded.</p>
  {/if}
</div>
