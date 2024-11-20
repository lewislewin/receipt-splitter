<script lang="ts">
	import { goto } from '$app/navigation';
    import Receipt from '$lib/Receipt.svelte';
    import type { ParsedReceipt } from '$lib/types';
  
    export let parsedReceipt: ParsedReceipt | null = null;
  
    const clearReceipt = () => {
      parsedReceipt = null;
    };

    function generateLink() {

        goto('/receipts/' + 1)
    }
  </script>
  
  <div class="w-full max-w-md">
    <!-- Display Receipt -->
    {#if parsedReceipt}
      <Receipt receipt={parsedReceipt} />
    {/if}

    <div class="flex justify-end mb-4">
        <button
          onclick={generateLink}
          aria-label="Clear Receipt"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Generate Link
        </button>
        <button
          onclick={clearReceipt}
          aria-label="Clear Receipt"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Clear Receipt
        </button>
      </div>
  </div>
  