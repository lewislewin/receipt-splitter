<script lang="ts">
  import { goto } from '$app/navigation';
  import type { ParsedReceipt } from '$lib/types';
  import ReceiptWrapper from '$lib/ReceiptWrapper.svelte';

  let receiptInput: HTMLInputElement | null = null;
  let parsedReceipt: ParsedReceipt | null = null;

  

  // Generate a receipt link by sending it to the server
  async function generateReceiptLink() {
    try {
      if (!parsedReceipt) {
        console.error('No receipt to generate a link for');
        return;
      }

      const response = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedReceipt),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate link: ${response.statusText}`);
      }

      // Ensure the response contains the receipt ID
      const record: ApiResponse = await response.json();
      console.log('Receipt link generated:', record.id);

      // Navigate to the generated URL
      goto(`/receipts/${record.id}`);
    } catch (error) {
      console.error('Error generating receipt link:', error);
    }
  }

  const parseReceipt = async () => {
    if (!receiptInput || !receiptInput.files || receiptInput.files.length === 0) {
      alert('Please select a receipt image!');
      return;
    }

    try {
      const receiptImage = receiptInput.files[0];
      const formData = new FormData();
      formData.append('receipt', receiptImage);

      const res = await fetch('/api/parse', { method: 'POST', body: formData });

      if (!res.ok) {
        throw new Error('Failed to upload the receipt. Please try again.');
      }

      const responseJson: { receipt: ParsedReceipt } = await res.json();
      parsedReceipt = responseJson.receipt;
    } catch (error) {
      alert(error.message);
    }
  };
</script>

<div class="min-h-screen flex flex-col items-center bg-gray-100 p-8 md:p-12">
  <!-- Upload Form -->
  {#if !parsedReceipt}
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
          on:click={parseReceipt}
          aria-label="Upload Receipt"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
        >
          Parse Receipt
        </button>
      </div>
    </div>
  {/if}

  <!-- Parsed Receipt -->
  {#if parsedReceipt}
    <div class="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
      <ReceiptWrapper receipt={parsedReceipt} canEdit={true}/>
      
    </div>
  {/if}
</div>
