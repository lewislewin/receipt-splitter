<script lang="ts">
  import { goto } from '$app/navigation';
  import type { ParsedReceipt } from '$lib/types';
  import Receipt from '$lib/Receipt.svelte';

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

    const receiptImage = receiptInput.files[0];
    const formData = new FormData();
    formData.append('receipt', receiptImage);

    const res = await fetch('/api/receipt', { method: 'POST', body: formData });

    const responseJson: ApiResponse = await res.json();
    parsedReceipt = responseJson.receipt;
  };

  function clearReceipt() {
    parsedReceipt = null;
  }
</script>


<div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
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
        onclick={uploadReceipt}
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        Parse Receipt
      </button>
      
    </div>
  </div>
  {/if}
  <button
        onclick={clearReceipt}
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        Clear Receipt
      </button>
  <!-- Display Receipt if parsed -->
  {#if parsedReceipt}
    <div class="mt-6 w-full max-w-md">
      <Receipt receipt={parsedReceipt}/>
    </div>
  {/if}
  
</div>
