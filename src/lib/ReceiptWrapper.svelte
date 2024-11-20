<script lang="ts">
  import Receipt from './Receipt.svelte';
  import type { ParsedReceipt } from '$lib/types';

  export let parsedReceipt: ParsedReceipt | null = null;
  export let readOnly: boolean = true

  const clearReceipt = () => (parsedReceipt = null);

  const updateReceipt = (updatedReceipt: ParsedReceipt) => {
    parsedReceipt = updatedReceipt;
  };

  if (readOnly) {
    parsedReceipt?.items.forEach(item => {
      item.qty = 0
    });
  }
</script>

<div class="min-h-screen flex flex-col items-center bg-gray-100 p-8 md:p-12">
  {#if parsedReceipt}
    <div class="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
      <!-- Receipt Component -->
      <Receipt
        receipt={parsedReceipt}
        on:update={(e) => updateReceipt(e.detail)}
        readOnly
      />

      <!-- Action Buttons -->
      {#if !readOnly}
      <div class="flex justify-end mt-8">
        <button
          on:click={clearReceipt}
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
        >
          Clear Receipt
        </button>
      </div>
      {/if}
    </div>
  {:else}
    <p class="text-gray-500 text-center text-xl">No receipt loaded.</p>
  {/if}
</div>
