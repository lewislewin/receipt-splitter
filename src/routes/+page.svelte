<script lang="ts">
  import { goto } from '$app/navigation';
  import type { ParsedReceipt } from '$lib/types';
  import ReceiptWrapper from '$lib/ReceiptWrapper.svelte';

  let receiptInput: HTMLInputElement | null = null;
  let parsedReceipt: ParsedReceipt | null = null;

  interface ApiResponse {
    receipt: ParsedReceipt;
  }

  const uploadReceipt = async () => {
    if (!receiptInput || !receiptInput.files || receiptInput.files.length === 0) {
      alert('Please select a receipt image!');
      return;
    }

    try {
      const receiptImage = receiptInput.files[0];
      const formData = new FormData();
      formData.append('receipt', receiptImage);

      const res = await fetch('/api/receipt', { method: 'POST', body: formData });

      if (!res.ok) {
        throw new Error('Failed to upload the receipt. Please try again.');
      }

      const responseJson: ApiResponse = await res.json();
      parsedReceipt = responseJson.receipt;
    } catch (error) {
      alert(error.message);
    }
  };
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
  <!-- Upload Form -->
  {#if !parsedReceipt}
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4 text-center">Upload a Receipt</h1>
      <div class="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          bind:this={receiptInput}
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        <button
          on:click={uploadReceipt}
          aria-label="Upload Receipt"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Parse Receipt
        </button>
      </div>
    </div>
  {/if}

  <!-- Parsed Receipt -->
  {#if parsedReceipt}
    <ReceiptWrapper {parsedReceipt} />
  {/if}
</div>
