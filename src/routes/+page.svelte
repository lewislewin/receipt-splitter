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

<div class="min-h-screen flex flex-col items-center bg-gray-100 p-8 md:p-12">
  <!-- Upload Form -->
  {#if !receipt}
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
      <h1 class="text-3xl font-bold mb-6 text-center">Upload a Receipt</h1>
      <div class="flex flex-col gap-6">
        <input
          type="file"
          accept="image/*"
          bind:this={receiptInput}
          class="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        <button
          on:click={handleParseReceipt}
          aria-label="Upload Receipt"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
        >
          Parse Receipt
        </button>
      </div>
    </div>
  {/if}

  <!-- Parsed Receipt -->
  {#if receipt}
    <div class="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
      <ReceiptWrapper {receipt} canEdit={true}/>
    </div>
  {/if}
</div>
