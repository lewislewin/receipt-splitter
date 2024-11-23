<script lang="ts">
  import Receipt from './Receipt.svelte';
  import type { ParsedReceipt } from '$lib/types';

  let {receipt, canEdit}: {receipt: ParsedReceipt | null, canEdit: boolean} = $props()
  console.log('Wrapper', receipt)
  const updateReceipt = (updatedReceipt: ParsedReceipt) => {
    receipt = updatedReceipt;
  };

  if (!canEdit) {
    receipt?.items.forEach(item => {
      item.qty = 0
    });
  }

  
</script>

<div class="min-h-screen flex flex-col items-center bg-gray-100 p-8 md:p-12">
  {#if receipt}
    <div class="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
      <!-- Receipt Component -->
      <Receipt
        receipt={receipt}
        on:update={(e) => updateReceipt(e.detail)}
        {canEdit}
      />
      
    </div>

    
  {:else}
    <p class="text-gray-500 text-center text-xl">No receipt loaded.</p>
  {/if}
</div>
