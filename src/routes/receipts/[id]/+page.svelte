<script lang="ts">
  import ReceiptWrapper from '$lib/ReceiptWrapper.svelte';
  import type { ParsedReceipt } from '$lib/types';

  export let data: { receipt?: ParsedReceipt };

  let total: number = 0;

  // Log to confirm the structure
  console.log('Data received in page:', data);

  // Calculate total dynamically
  const calculateTotal = () => {
    if (!data?.receipt) return '0.00';
    total = data.receipt.items.reduce((sum, item) => sum + (item.price ?? 0) * item.qty, 0);
    return total.toFixed(2);
  };

  const handleReceiptChange = (updatedReceipt: ParsedReceipt) => {
    if (data?.receipt) {
      data.receipt = updatedReceipt;
      calculateTotal();
    }
  };
</script>

<div class="min-h-screen flex flex-col items-center bg-gray-100 p-6">
  <!-- Loading or fallback state -->
  {#if data?.receipt}
    <!-- Page Title -->
    <h1 class="text-3xl font-bold mb-6">{data.receipt.name}</h1>

    <!-- Receipt Wrapper -->
    <div class="w-full max-w-3xl">
      <ReceiptWrapper
        parsedReceipt={data.receipt}
      />
    </div>

    <!-- Total -->
    <p class="text-lg font-bold mt-4">Total: £{calculateTotal()}</p>
  {:else}
    <p class="text-gray-500 text-center">Loading receipt...</p>
  {/if}
</div>
