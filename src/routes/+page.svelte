<script lang="ts">
	import { parseReceipt } from '$lib/api'; // Import the parseReceipt function from api.ts
	import type { ParsedReceipt } from '$lib/types';
	import ReceiptWrapper from '$lib/receipt/ReceiptWrapper.svelte';

	let receiptInput: HTMLInputElement | null = null;
	let receipt: ParsedReceipt | null = null;

	const handleParseReceipt = async () => {
		if (!receiptInput || !receiptInput.files || receiptInput.files.length === 0) {
			alert('Please select a receipt image!');
			return;
		}

		const receiptImage = receiptInput.files[0];
		console.log('Selected File:', receiptImage); // Check if the file is retrieved

		try {
			receipt = await parseReceipt(receiptImage); // Use the parseReceipt function from api.ts
			console.log('Returned Receipt: ', receipt);
		} catch (error: any) {
			alert(error.message || 'Failed to parse the receipt. Please try again.');
		}
	};
</script>

<div class="flex min-h-screen flex-col items-center bg-gray-100 p-4">
	<!-- Upload Form -->
	{#if !receipt}
		<div class="w-full rounded-md bg-white p-4 shadow">
			<h1 class="mb-4 text-center text-2xl font-bold">Upload a Receipt</h1>
			<div class="flex flex-col gap-4">
				<input
					type="file"
					accept="image/png, image/jpeg, image/jpg"
					bind:this={receiptInput}
					class="w-full rounded-md border bg-gray-50 text-lg focus:outline-none"
				/>
				<button
					on:click={handleParseReceipt}
					class="rounded-md bg-blue-500 py-2 font-bold text-white transition-colors hover:bg-blue-600"
				>
					Parse Receipt
				</button>
			</div>
		</div>
	{/if}

	<!-- Parsed Receipt -->
	{#if receipt}
		<div class="w-full rounded-md bg-white p-4 shadow">
			<ReceiptWrapper {receipt} canEdit={true} />
		</div>
	{/if}
</div>
