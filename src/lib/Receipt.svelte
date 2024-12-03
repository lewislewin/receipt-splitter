<script lang="ts">
	import ReceiptLine from '$lib/ReceiptLine.svelte';
	import ModifierComponent from '$lib/ModifierLine.svelte';
	import type { ReceiptItem, Modifier, ParsedReceipt } from '$lib/types';
	import { goto } from '$app/navigation';
	import { storeReceipt } from '$lib/api';

	let { receiptName = '', items = [], modifiers = [], canEdit = false, reason = '', monzo_id = '' } = $props();

	let selectedItem: ReceiptItem | null = $state(null);
	let activeLines: ReceiptItem[] = $state([]);
	let activeModifiers: Modifier[] = $state(modifiers);

	const addLine = (event: CustomEvent<ReceiptItem>) => {
		const line = event.detail;
		activeLines = [...activeLines.filter((l) => l.item !== line.item), line];
		selectedItem = null;
	};

	const addNewItem = () => {
		const newItem: ReceiptItem = { item: 'New Item', price: 0, qty: 1 };
		activeLines = [...activeLines, newItem];
	};

	const removeLine = (event: CustomEvent<{ item: ReceiptItem }>) => {
		const lineToRemove = event.detail.item;
		activeLines = activeLines.filter((line) => line.item !== lineToRemove.item);
	};

	const updateModifier = (index: number, updatedModifier: Modifier) => {
		activeModifiers[index] = updatedModifier;
		activeModifiers = [...activeModifiers];
	};

	const calculateItemsTotal = () => {
		return activeLines.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
	};

	const calculateTotal = () => {
		const itemsTotal = calculateItemsTotal();
		const modifiersTotal = activeModifiers.reduce((total, modifier) => {
			if (!modifier.include && !canEdit) return total;
			if (modifier.percentage) {
				return total + itemsTotal * (modifier.percentage / 100);
			}
			return total;
		}, itemsTotal);

		return Math.round(modifiersTotal * 100) / 100;
	};

	async function generateReceiptLink() {
		try {
			if (!activeLines.length) {
				console.error('No receipt data available');
				alert('No receipt items to generate a link.');
				return;
			}

			if (!monzo_id) {
				console.error('Monzo ID is required');
				alert('Please provide a valid Monzo ID before generating the receipt link.');
				return;
			}

			const receipt: ParsedReceipt = {
				name: receiptName,
				items: activeLines,
				modifiers: activeModifiers,
				reason,
				monzo_id,
				id: undefined
			};

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

	const pay = () => {
    // Calculate total as a rounded number down to the nearest 0.05
    const rawTotal = Math.floor(calculateTotal() * 20) / 20; // Multiply by 20, floor it, then divide back
    // Format the total to always have exactly two decimal places
    const total = rawTotal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const recipient = monzo_id;
    const paymentReason = reason || 'Payment';

    console.log('Monzo Total (rounded to nearest 0.05):', total);

    if (recipient) {
      const url = `https://monzo.me/${recipient}/${encodeURIComponent(total)}?d=${encodeURIComponent(paymentReason)}`;
      // Redirect in the same tab
      window.location.href = url;
    } else {
      console.error('Recipient not set');
      alert('Monzo ID is required for payment.');
    }
  };





	if (canEdit) {
		items.forEach((item) => {
			activeLines.push(item);
		});
	}
</script>

<div class="flex flex-col rounded bg-white p-4 shadow">
	<h2 class="mb-4 text-center text-2xl font-bold">{receiptName}</h2>

	{#if !canEdit}
		<div class="mb-4">
			<label for="item-select" class="mb-2 block font-semibold">Select an item</label>
			<select id="item-select" class="w-full rounded border p-2" bind:value={selectedItem}>
				<option value={null}>-- Select an Item --</option>
				{#each items as item}
					<option value={item}>{item.item} - £{item.price?.toFixed(2)}</option>
				{/each}
			</select>
		</div>
	{/if}

	{#if selectedItem}
		<ReceiptLine
			zero={true}
			{selectedItem}
			on:addLine={addLine}
			on:cancel={() => (selectedItem = null)}
		/>
	{/if}

	<h3 class="mb-2 mt-6 text-lg font-bold">Active Items</h3>
	<div>
		{#each activeLines as line (line.item)}
			<ReceiptLine
				selectedItem={line}
				minimal
				on:removeLine={removeLine}
				on:expand={() => (selectedItem = line)}
			/>
		{/each}
	</div>

	{#if canEdit}
		<!-- Add New Item Button -->
		<div class="mt-4 flex justify-end">
			<button
				class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
				onclick={addNewItem}
			>
				Add New Item
			</button>
		</div>
	{/if}

	<h3 class="mb-2 mt-6 text-lg font-bold">Modifiers</h3>
	<div>
		{#each activeModifiers as modifier, index}
			{#if canEdit || modifier.include}
				<ModifierComponent
					{modifier}
					{index}
					editable={canEdit}
					itemsTotal={calculateItemsTotal()}
					onUpdate={updateModifier}
				/>
			{/if}
		{/each}
	</div>

	<!-- Additional Fields -->
	{#if canEdit}
		<div class="mt-6">
			<label class="mb-2 block font-semibold" for="reason">Reason</label>
			<input
				id="reason"
				type="text"
				bind:value={reason}
				placeholder="Reason for the receipt"
				class="mb-4 w-full rounded border p-2"
			/>

			<label class="mb-2 block font-semibold" for="monzo_id">Monzo ID</label>
			<input
				id="monzo_id"
				type="text"
				bind:value={monzo_id}
				placeholder="Monzo.me ID"
				class="w-full rounded border p-2"
			/>
		</div>
	{/if}

	<div class="mt-6 text-right">
		<p class="text-lg font-bold">Total: £{calculateTotal().toFixed(2)}</p>
		{#if canEdit}
			<button
				class="mt-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
				onclick={generateReceiptLink}
			>
				Create
			</button>
		{:else}
			<button
				class="mt-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
				onclick={pay}
			>
				Pay
			</button>
		{/if}
	</div>
</div>
