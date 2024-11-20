<script lang="ts">
  import Receipt from './Receipt.svelte';
  import type { ParsedReceipt } from '$lib/types';

  export let parsedReceipt: ParsedReceipt | null = null;

  const clearReceipt = () => (parsedReceipt = null);

  async function generateReceiptLink() {
    let result = await fetch('api/receipt/create', { method: 'POST', body: JSON.stringify(parsedReceipt) })
    console.log(result)
  }
</script>

<div class="w-full max-w-md">
  {#if parsedReceipt}
    <Receipt receipt={parsedReceipt} />
    <div class="flex justify-between mt-4">
      <button on:click={clearReceipt} class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        Clear Receipt
      </button>
      <button on:click={generateReceiptLink} class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        Generate Link
      </button>
    </div>
  {/if}
</div>
