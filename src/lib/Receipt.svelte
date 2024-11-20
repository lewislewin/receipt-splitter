<script lang="ts">
	import type { Modifier, ParsedReceipt, ReceiptItem } from '$lib/types';
	import ItemComponent from '$lib/ItemComponent.svelte';
	import ModifierComponent from '$lib/ModifierComponent.svelte';
	import { createEventDispatcher } from 'svelte';

	export let receipt: ParsedReceipt;
	const dispatch = createEventDispatcher();

	const updateItem = (index: number, updatedItem: ReceiptItem) => {
		const updatedItems = [...receipt.items];
		updatedItems[index] = updatedItem;
		dispatch('update', { ...receipt, items: updatedItems });
	};

	const updateModifier = (index: number, updatedModifier: Modifier) => {
		const updatedModifiers = [...receipt.modifiers];
		updatedModifiers[index] = updatedModifier;
		dispatch('update', { ...receipt, modifiers: updatedModifiers });
	};

	const addItem = () => {
		const updatedItems = [...receipt.items, { item: '', qty: 1, price: 0 }];
		dispatch('update', { ...receipt, items: updatedItems });
	};

	const removeItem = (index: number) => {
		const updatedItems = receipt.items.filter((_, i) => i !== index);
		dispatch('update', { ...receipt, items: updatedItems });
	};

	const addModifier = () => {
		const updatedModifiers = [...receipt.modifiers, { type: '', percentage: 0, value: 0 }];
		dispatch('update', { ...receipt, modifiers: updatedModifiers });
	};

	const removeModifier = (index: number) => {
		const updatedModifiers = receipt.modifiers.filter((_, i) => i !== index);
		dispatch('update', { ...receipt, modifiers: updatedModifiers });
	};
</script>

<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
	<h2 class="mb-4 text-center text-2xl font-bold">{receipt.name}</h2>

	<!-- Items Section -->
	<div class="mb-6">
		<h3 class="text-center text-lg font-semibold">Items</h3>
		<ul class="space-y-2">
			{#each receipt.items as item, index}
				<li class="flex items-center space-x-4">
					<ItemComponent {item} update={(updatedValue: ReceiptItem) => updateItem(index, updatedValue)} />
					<button
						on:click={() => removeItem(index)}
						class="font-bold text-red-500 hover:text-red-700"
					>
						Remove
					</button>
				</li>
			{/each}
		</ul>
		<button
			on:click={addItem}
			class="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
		>
			Add Item
		</button>
	</div>

	<!-- Modifiers Section -->
	<div>
		<h3 class="text-center text-lg font-semibold">Modifiers</h3>
		<ul class="space-y-2">
			{#each receipt.modifiers as modifier, index}
				<li class="flex items-center space-x-4">
					<ModifierComponent {modifier} update={(updatedValue: ReceiptItem) => updateItem(index, updatedValue)} />
					<button
						on:click={() => removeModifier(index)}
						class="font-bold text-red-500 hover:text-red-700"
					>
						Remove
					</button>
				</li>
			{/each}
		</ul>
		<button
			on:click={addModifier}
			class="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
		>
			Add Modifier
		</button>
	</div>
</div>
