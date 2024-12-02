<script lang="ts">
  import { getReceipt } from '$lib/api'; // Import your API helper
  import type { ParsedReceipt } from '$lib/types';
  import { onMount } from 'svelte';
  import { page } from '$app/stores'; // Access URL and route details from SvelteKit
	import Receipt from '$lib/Receipt.svelte';

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

    setTitle()
  });

  const calculateTotal = () => {
    if (!receipt) return '0.00';
    total = receipt.items.reduce((sum, item) => sum + (item.price ?? 0) * item.qty, 0);
    return total.toFixed(2);
  };

  function setTitle() {
    if (receipt?.name) {
      document.title = receipt.name;
    }
  }
</script>

<div class="min-h-screen flex flex-col bg-gray-100 p-4">
  {#if loading}
    <p class="text-gray-500 text-center">Loading receipt...</p>
  {:else if error}
    <p class="text-red-500 text-center">{error}</p>
  {:else if receipt}
    <div >
      <Receipt
        receiptName={receipt.name}
        items={receipt.items}
        modifiers={receipt.modifiers}
        canEdit={false}
        monzo_id={receipt.monzo_id}
        reason={receipt.reason}
      />
    </div>
  {:else}
    <p class="text-gray-500 text-center">No receipt found.</p>
  {/if}
</div>