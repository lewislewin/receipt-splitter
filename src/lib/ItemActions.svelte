<script lang="ts">
	import type { ReceiptItem } from '$lib/types';

	let { update, remove, item, canRemove } = $props();

	const incrementQty = () => {
		const updatedItem = { ...item, qty: item.qty + 1 };
		update(updatedItem);
	};

	const decrementQty = () => {
		const updatedItem = { ...item, qty: Math.max(item.qty - 1, 0) };
		update(updatedItem);
	};

	const handleRemove = () => {
		remove(); // Invoke the `remove` function passed as a prop
	};
</script>

<div class="flex items-center space-x-4">
	<button
		onclick={decrementQty}
		class="h-10 w-10 rounded bg-gray-200 text-lg font-bold hover:bg-gray-300"
	>
		-
	</button>
	<span class="text-lg font-semibold">{item.qty}</span>
	<button
		onclick={incrementQty}
		class="h-10 w-10 rounded bg-gray-200 text-lg font-bold hover:bg-gray-300"
	>
		+
	</button>
	{#if canRemove}
		<button
			onclick={handleRemove}
			class="w-24 rounded bg-red-500 px-3 py-2 font-bold text-white hover:bg-red-600"
		>
			Remove
		</button>
	{/if}
</div>
