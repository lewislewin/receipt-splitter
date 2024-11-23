<script lang="ts">
  import ItemsTable from './tables/items/ItemsTable.svelte';
  import ModifiersTable from './tables/modifiers/ModifiersTable.svelte';
  import type { ReceiptItem, Modifier, ParsedReceipt } from '$lib/types';
  import { goto } from '$app/navigation';
	import { storeReceipt } from '$lib/api';

  let { receipt, canEdit }: { receipt: ParsedReceipt; canEdit: boolean } = $props();

  interface ApiResponse {
    id: string;
  }
  console.log('Initial Receipt:', receipt)
  let monzoLink = ''

  // Calculate the total with included modifiers
  const calculateTotal = () => {
    // Sum items total
    const itemsTotal = receipt.items.reduce(
      (sum, item) => sum + (item.price ?? 0) * item.qty,
      0
    );

    // Calculate included modifiers (e.g., service charge, percentage extras)
    const includedModifiers = receipt.modifiers.filter((mod) => mod.include);

    const totalWithModifiers = includedModifiers.reduce((total, modifier) => {
      if (modifier.percentage) {
        // Add percentage-based modifiers
        return total * (1 + modifier.percentage / 100);
      }
      if (modifier.value) {
        // Add value-based modifiers
        return total + modifier.value;
      }
      return total;
    }, itemsTotal);

    return totalWithModifiers;
  };

  const parseMonzoLink = (link: string) => {
    const regex = /monzo\.me\/([^\/]+)(?:\/([^?]+))?(?:\?.*d=([^&]+))?/;
    const match = link.match(regex);

    if (match) {
      const recipient = match[1];
      const reason = match[3] || '';
      receipt = { ...receipt, monzo_id: recipient, reason };
    } else {
      console.error('Invalid Monzo.me link');
    }
  };

  const payWithMonzo = () => {
    const total = calculateTotal().toFixed(2);
    const recipient = receipt.monzo_id;
    const reason = receipt.reason || 'Payment';

    if (recipient) {
      const url = `https://monzo.me/${recipient}/${total}?d=${encodeURIComponent(reason)}`;
      window.location.href = url;
    } else {
      console.error('Recipient not set');
    }
  };

  const updateItem = (index: number, updatedItem: ReceiptItem) => {
    const updatedItems = [...receipt.items];
    updatedItems[index] = updatedItem;
    receipt = { ...receipt, items: updatedItems };
  };

  const removeItem = (index: number) => {
    const updatedItems = receipt.items.filter((_, i) => i !== index);
    receipt = { ...receipt, items: updatedItems };
  };

  const addItem = () => {
    receipt = {
      ...receipt,
      items: [...receipt.items, { item: '', qty: 1, price: 0 }],
    };
  };

  const updateModifier = (index: number, updatedModifier: Modifier) => {
    const updatedModifiers = [...receipt.modifiers];
    updatedModifiers[index] = updatedModifier;
    receipt = { ...receipt, modifiers: updatedModifiers };
  };

  const removeModifier = (index: number) => {
    const updatedModifiers = receipt.modifiers.filter((_, i) => i !== index);
    receipt = { ...receipt, modifiers: updatedModifiers };
  };

  const addModifier = () => {
    receipt = {
      ...receipt,
      modifiers: [...receipt.modifiers, { type: '', value: 0, percentage: 0, include: false }],
    };
  };

  async function generateReceiptLink() {
    try {
        if (!receipt) {
            console.error('No receipt to generate a link for');
            alert('No receipt data available.');
            return;
        }

        if (!receipt.monzo_id) {
            console.error('Monzo link is required');
            alert('Please provide a valid Monzo link before generating the receipt link.');
            return;
        }

        console.log('Storing receipt on the server:', receipt);

        // Use the storeReceipt helper to send the receipt to the backend
        const response = await storeReceipt(receipt);

        console.log('Receipt successfully stored, ID:', response.id);

        // Redirect to the receipt details page
        goto(`/receipts/${response.id}`);
    } catch (error: any) {
        console.error('Error generating receipt link:', error.message);
        alert(error.message || 'Failed to generate receipt link. Please try again.');
    }
}

</script>

<div class="min-h-screen w-full max-w-5xl mx-auto bg-white p-10 rounded-lg shadow-lg flex flex-col justify-between">
  <!-- Header -->
  <h2 class="mb-8 text-center text-4xl font-bold text-gray-800">{receipt.name}</h2>

  <!-- Content -->
  <div class="flex-grow">
    <!-- Items Table -->
    <div class="mb-10">
      <h3 class="mb-6 text-center text-2xl font-semibold text-gray-700">Items</h3>
      <ItemsTable
        items={receipt.items}
        onItemUpdate={updateItem}
        onItemRemove={removeItem}
        {canEdit}
      />
    </div>

    <!-- Modifiers Table -->
    <div class="mb-10">
      <h3 class="mb-6 text-center text-2xl font-semibold text-gray-700">Modifiers</h3>
      <ModifiersTable
        modifiers={receipt.modifiers}
        onModifierUpdate={updateModifier}
        onModifierRemove={removeModifier}
        {canEdit}
      />
    </div>

    <!-- Monzo.me Link Input -->
    {#if canEdit}
      <div class="mb-6">
        <label for="monzo-link" class="block text-lg font-semibold text-gray-700 mb-2">
          Monzo.me Link
        </label>
        <input
          id="monzo-link"
          type="url"
          bind:value={monzoLink}
          placeholder="https://monzo.me/joebloggs/100?h=31n7Wo&d=Dinner"
          class="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
          onblur={() => parseMonzoLink(monzoLink)}
        />
        <p class="mt-2 text-sm text-gray-600">
          Paste a Monzo.me link here to extract recipient and reason.
        </p>
      </div>
    {/if}

    <!-- Total Display -->
    <div class="mt-6 text-center">
      <h3 class="text-2xl font-bold text-gray-700">Total: £{calculateTotal().toFixed(2)}</h3>
    </div>
  </div>

  <!-- Buttons at the Bottom -->
  {#if canEdit}
    <div class="mt-10 flex flex-col sm:flex-row sm:space-x-4 justify-center items-center">
      <button
        onclick={addItem}
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg w-full sm:w-auto mb-4 sm:mb-0"
      >
        Add Item
      </button>
      <button
        onclick={addModifier}
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg w-full sm:w-auto mb-4 sm:mb-0"
      >
        Add Modifier
      </button>
      <button
        onclick={generateReceiptLink}
        class="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg w-full sm:w-auto"
      >
        Generate Link
      </button>
    </div>
  {:else}
    <div class="mt-10 flex justify-center">
      <button
        onclick={payWithMonzo}
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
      >
        Pay Now
      </button>
    </div>
  {/if}
</div>
