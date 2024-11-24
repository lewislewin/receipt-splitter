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

<div class="w-full bg-white p-4 rounded-md shadow">
  {#if receipt}
    <Receipt
      receipt={receipt}
      on:update={(e) => updateReceipt(e.detail)}
      {canEdit}
    />
  {:else}
    <p class="text-gray-500 text-center">No receipt loaded.</p>
  {/if}
</div>

