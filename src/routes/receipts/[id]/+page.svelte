<script lang="ts">
  import ReceiptWrapper from '$lib/receipt/ReceiptWrapper.svelte';
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

<div class="min-h-screen flex flex-col items-center bg-gray-100 p-8 md:p-12">
  <!-- Loading or fallback state -->
  {#if data?.receipt}
    <!-- Page Title -->
    <div class="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
      <!-- Receipt Wrapper -->
      <div class="w-full max-w-4xl mx-auto">
        <ReceiptWrapper
          receipt={data.receipt}
          canEdit={false}
        />
      </div>
    </div>
  {:else}
    <p class="text-gray-500 text-center text-lg">Loading receipt...</p>
  {/if}
</div>
