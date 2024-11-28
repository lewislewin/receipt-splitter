<script lang="ts">
	import ItemsTable from './tables/items/ItemsTable.svelte';
	import ModifiersTable from './tables/modifiers/ModifiersTable.svelte';
	import type { ReceiptItem, Modifier, ParsedReceipt } from '$lib/types';
	import { goto } from '$app/navigation';
	import { storeReceipt } from '$lib/api';

	let { receipt, canEdit }: { receipt: ParsedReceipt; canEdit: boolean } = $props();

	console.log('Initial Receipt:', receipt);
	let monzoLink = '';

	// Calculate the total with included modifiers
	const calculateTotal = () => {
    // Sum items total
    const itemsTotal = receipt.items.reduce(
      (sum, item) => Math.round((sum + (item.price ?? 0) * item.qty) * 100) / 100,
      0
    );

    console.log('Items Total:', itemsTotal);

    // Calculate included modifiers (e.g., service charge, percentage extras)
    const includedModifiers = receipt.modifiers.filter((mod) => mod.include);

    const totalWithModifiers = includedModifiers.reduce((total, modifier) => {
      if (modifier.percentage) {
        // Add percentage-based modifiers, ensuring rounding
        return Math.round(total * (1 + modifier.percentage / 100) * 100) / 100;
      }
      if (modifier.value) {
        // Add value-based modifiers, ensuring rounding
        return Math.round((total + modifier.value) * 100) / 100;
      }
      return total;
    }, itemsTotal);

    // Ensure the final result is rounded
    return Math.round(totalWithModifiers * 100) / 100;
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
    const total = calculateTotal().toFixed(2); // Ensure consistent formatting
    const recipient = receipt.monzo_id;
    const reason = receipt.reason || 'Payment';

    console.log('Monzo Total:', total);

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
			items: [...receipt.items, { item: '', qty: 1, price: 0 }]
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
			modifiers: [...receipt.modifiers, { type: '', value: 0, percentage: 0, include: false }]
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
			goto(`/${response.id}`);
		} catch (error: any) {
			console.error('Error generating receipt link:', error.message);
			alert(error.message || 'Failed to generate receipt link. Please try again.');
		}
	}
</script>

<div class="flex min-h-screen flex-col bg-white p-4 shadow">
	<h2 class="mb-4 text-center text-3xl font-bold">{receipt.name}</h2>
	<div class="flex-grow">
		<div class="mb-6">
			<h3 class="text-center text-lg font-semibold">Items</h3>
			<ItemsTable
				items={receipt.items}
				onItemUpdate={updateItem}
				onItemRemove={removeItem}
				{canEdit}
			/>
		</div>
		<div class="mb-6">
			<h3 class="text-center text-lg font-semibold">Modifiers</h3>
			<ModifiersTable
				modifiers={receipt.modifiers}
				onModifierUpdate={updateModifier}
				onModifierRemove={removeModifier}
				{canEdit}
			/>
		</div>
		{#if canEdit}
			<div class="mb-4">
				<label class="mb-2 block">Monzo.me Link</label>
				<input
					type="url"
					bind:value={monzoLink}
					placeholder="https://monzo.me/link"
					class="w-full rounded border p-2 focus:outline-none"
					onblur={() => parseMonzoLink(monzoLink)}
				/>
			</div>
		{/if}
		<h3 class="mt-4 text-center text-lg font-bold">Total: £{calculateTotal().toFixed(2)}</h3>
	</div>
	<div class="mt-4 flex justify-center gap-4">
		{#if canEdit}
			<button onclick={addItem} class="rounded bg-blue-500 px-4 py-2 text-white">Add Item</button>
			<button onclick={addModifier} class="rounded bg-green-500 px-4 py-2 text-white"
				>Add Modifier</button
			>
			<button onclick={generateReceiptLink} class="rounded bg-gray-800 px-4 py-2 text-white"
				>Generate Link</button
			>
		{:else}
			<button onclick={payWithMonzo} class="rounded bg-green-500 px-4 py-2 text-white"
				>Pay Now</button
			>
		{/if}
	</div>
</div>
