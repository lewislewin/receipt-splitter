<script lang="ts">
  import ReceiptWrapper from '$lib/ReceiptWrapper.svelte'; // Ensure path is correct
  import type { ParsedReceipt } from '$lib/types';

  export let data: { receipt: ParsedReceipt };

  console.log('Data received in page:', data);

  
  let total: number = 0;

  // Calculate the total whenever items in the receipt change
  const calculateTotal = () => {
    total = data.receipt.items.reduce((sum, item) => sum + (item.price ?? 0) * item.qty, 0);
    return total.toFixed(2);
  };

  // Handle receipt changes (if modifications are allowed directly on this page)
  const handleReceiptChange = (updatedReceipt: ParsedReceipt) => {
    data.receipt = updatedReceipt;
    calculateTotal();
  };
</script>

<div class="min-h-screen flex flex-col items-center bg-gray-100 p-6">
  <!-- Page Title -->
  <h1 class="text-3xl font-bold mb-6">{data.receipt.name}</h1>

  <!-- Use the ReceiptWrapper -->
  <div class="w-full max-w-3xl">
    <ReceiptWrapper
      parsedReceipt = {data.receipt}
      on:change={(e) => handleReceiptChange(e.detail)}
    />
  </div>

  <!-- Display the Total -->
  <p class="text-lg font-bold mt-4">Total: £{calculateTotal()}</p>
</div>
 