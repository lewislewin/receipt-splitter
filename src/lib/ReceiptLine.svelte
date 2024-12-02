<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ReceiptItem } from '$lib/types';

	export let selectedItem: ReceiptItem;
	export let minimal = false;
	export let zero = false;

	const dispatch = createEventDispatcher();

	const toggleEdit = () => {
		if (minimal) {
			minimal = false; // Only toggle if currently minimal
		}
	};

	const addLine = () => {
		dispatch('addLine', selectedItem);
		minimal = true; // Collapse back to minimal view after adding
	};

	const cancel = () => {
		dispatch('cancel');
		minimal = true; // Collapse back to minimal view after canceling
	};

	const removeLine = () => {
		dispatch('removeLine', selectedItem);
	};

	let fractionalQty = 1; // Default to 1 (no split)

	const incrementQty = () => {
		if (selectedItem.qty === 0) {
			selectedItem.qty = fractionalQty; // If qty is 0, set it to the fraction
		} else {
			selectedItem.qty = parseFloat((selectedItem.qty + fractionalQty).toFixed(2));
		}
	};

	const decrementQty = () => {
		selectedItem.qty = parseFloat(Math.max(selectedItem.qty - fractionalQty, 0).toFixed(2));
	};

	const updateFraction = (fraction: number) => {
		fractionalQty = fraction;
		if (selectedItem.qty <= 1) {
			selectedItem.qty = fractionalQty;
		}
	};

	const calculateRowTotal = () => {
		return (selectedItem.price * selectedItem.qty).toFixed(2);
	};

	function zeroItem() {
		if (zero) {
			selectedItem.qty = 1;
		}
	}

	const fractionalOptions = [1, 0.5, 0.25, 0.1]; // Example fractional splits

	zeroItem();
</script>

<div class="mb-4 rounded bg-gray-100 p-4 shadow">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	{#if minimal}
		<!-- Minimal View -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="flex cursor-pointer items-center justify-between" onclick={toggleEdit}>
			<span>{selectedItem.item}</span>
			<span>{selectedItem.qty}</span>
			<span>£{(selectedItem.price * selectedItem.qty).toFixed(2)}</span>
			<button class="rounded bg-red-500 px-2 py-1 text-white" onclick={removeLine}> Remove </button>
		</div>
	{:else}
		<!-- Expanded View -->
		<div>
			<div class="mb-2 flex items-center justify-between">
				<input
					type="text"
					class="w-half rounded border p-2 font-semibold"
					bind:value={selectedItem.item}
				/>
        <input
					type="number"
					class="w-half rounded border p-2 font-semibold"
					bind:value={selectedItem.price}
				/>
			</div>
			<div class="mb-2 flex items-center">
				<!-- Quantity Controls -->
				<button class="h-10 w-10 rounded bg-gray-300" onclick={decrementQty}>-</button>
				<input type="number" class="mx-2 w-16 border text-center" bind:value={selectedItem.qty} />
				<button class="h-10 w-10 rounded bg-gray-300" onclick={incrementQty}>+</button>

				<!-- Split Dropdown -->
				<select
					class="ml-4 rounded border p-2"
					bind:value={fractionalQty}
					onchange={(e) => updateFraction(parseFloat(e.target.value))}
				>
					{#each fractionalOptions as option}
						<option value={option}>
							{option === 1 ? '100%' : `${option * 100}%`}
						</option>
					{/each}
				</select>
			</div>

			<div class="mt-2 flex items-center justify-between">
				<span class="font-semibold">Row Total:</span>
				<span>£{calculateRowTotal()}</span>
			</div>

			<div class="mt-4 flex justify-between">
				<button class="rounded bg-red-500 px-4 py-1 text-white" onclick={cancel}> Cancel </button>
				<button class="rounded bg-blue-500 px-4 py-1 text-white" onclick={addLine}> Add </button>
			</div>
		</div>
	{/if}
</div>
