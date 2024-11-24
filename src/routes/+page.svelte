<script lang="ts">
  import { parseReceipt } from '$lib/api'; // Import the parseReceipt function from api.ts
  import type { ParsedReceipt } from '$lib/types';
  import ReceiptWrapper from '$lib/receipt/ReceiptWrapper.svelte';

  let receiptInput: HTMLInputElement | null = null;
  let receipt: ParsedReceipt | null = null;
  
  const handleParseReceipt = async () => {
    if (!receiptInput || !receiptInput.files || receiptInput.files.length === 0) {
      alert('Please select a receipt image!');
      return;
    }

    try {
      const receiptImage = receiptInput.files[0];
      receipt = await parseReceipt(receiptImage); // Use the parseReceipt function from api.ts
      
      console.log('Returned Receipt: ', receipt)
    } catch (error: any) {
      alert(error.message || 'Failed to parse the receipt. Please try again.');
    }
  };
</script>

<div class="min-h-screen flex flex-col items-center bg-gray-100 p-4">
  <!-- Upload Form -->
  {#if !receipt}
    <div class="bg-white p-4 rounded-md shadow w-full">
      <h1 class="text-2xl font-bold mb-4 text-center">Upload a Receipt</h1>
      <div class="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          bind:this={receiptInput}
          class="w-full text-lg border rounded-md bg-gray-50 focus:outline-none"
        />
        <button
          on:click={handleParseReceipt}
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md transition-colors"
        >
          Parse Receipt
        </button>
      </div>
    </div>
  {/if}

  <!-- Parsed Receipt -->
  {#if receipt}
    <div class="w-full bg-white p-4 rounded-md shadow">
      <ReceiptWrapper {receipt} canEdit={true}/>
    </div>
  {/if}
</div>
