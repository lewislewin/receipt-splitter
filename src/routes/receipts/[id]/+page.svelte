<script lang="ts">
  import ReceiptWrapper from '$lib/receipt/ReceiptWrapper.svelte';
  import { getReceipt } from '$lib/api'; // Import your API helper
  import type { ParsedReceipt } from '$lib/types';
  import { onMount } from 'svelte';
  import { page } from '$app/stores'; // Access URL and route details from SvelteKit

  let receipt: ParsedReceipt | null = null;
  let total: number = 0;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      // Extract ID from the URL
      const currentPage = $page;
      const id = currentPage.url.pathname.split('/').pop(); // Extract the last segment of the URL

      if (!id) {
        throw new Error('No receipt ID found in the URL.');
      }

      console.log('Fetching receipt with ID:', id);
      receipt = await getReceipt(id); // Use the API helper to fetch receipt data
      console.log('Fetched receipt:', receipt);
      calculateTotal(); // Calculate the total
    } catch (err: any) {
      console.error('Error fetching receipt:', err.message);
      error = err.message || 'Failed to load receipt. Please try again.';
    } finally {
      loading = false;
    }
  });

  const calculateTotal = () => {
    if (!receipt) return '0.00';
    total = receipt.items.reduce((sum, item) => sum + (item.price ?? 0) * item.qty, 0);
    return total.toFixed(2);
  };
</script>

<div class="min-h-screen flex flex-col items-center bg-gray-100 p-8 md:p-12">
  <!-- Loading State -->
  {#if loading}
    <p class="text-gray-500 text-center text-lg">Loading receipt...</p>
  {:else if error}
    <!-- Error State -->
    <p class="text-red-500 text-center text-lg">{error}</p>
  {:else if receipt}
    <!-- Render the Receipt -->
    <div class="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
      <!-- Receipt Title -->
      <h1 class="text-3xl font-bold mb-6 text-center">{receipt.name}</h1>
      <!-- Receipt Wrapper -->
      <div class="w-full max-w-4xl mx-auto">
        <ReceiptWrapper
          {receipt}
          canEdit={false}
        />
      </div>
      <!-- Total -->
      <div class="mt-6 text-center">
        <h3 class="text-2xl font-bold text-gray-700">Total: £{calculateTotal()}</h3>
      </div>
    </div>
  {:else}
    <!-- Fallback State -->
    <p class="text-gray-500 text-center text-lg">No receipt found.</p>
  {/if}
</div>
