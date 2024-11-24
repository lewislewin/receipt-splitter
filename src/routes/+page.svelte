<script lang="ts">
	import { parseReceipt } from '$lib/api';
	import type { ParsedReceipt } from '$lib/types';
	import ReceiptWrapper from '$lib/receipt/ReceiptWrapper.svelte';

	let receipt: ParsedReceipt | null = null;

	// Allowed file types
	const allowedFileTypes = ['image/jpeg', 'image/png'];

	// Handle receipt parsing
	const handleParseReceipt = async (event: Event) => {
		const input = event.target as HTMLInputElement;

		// Check if files are selected
		if (!input.files || input.files.length === 0) {
			alert('Please select a receipt image!');
			return;
		}

		// Validate file type
		const receiptImage = input.files[0];
		if (!allowedFileTypes.includes(receiptImage.type)) {
			alert('Unsupported file type. Please upload a JPEG or PNG image.');
			return;
		}

		// Ensure file is not empty
		if (receiptImage.size === 0) {
			alert('The selected file is empty. Please try again.');
			return;
		}

		console.log('Selected File:', receiptImage); // Log file details for debugging

		try {
			// Parse the receipt
			receipt = await parseReceipt(receiptImage);
			console.log('Returned Receipt: ', receipt);
		} catch (error: any) {
			alert(error.message || 'Failed to parse the receipt. Please try again.');
		}
	};
</script>

<div class="min-h-screen flex flex-col items-center bg-gray-100 p-4">
	<!-- Upload Form -->
	{#if !receipt}
		<div class="bg-white p-4 rounded-md shadow w-full max-w-lg">
			<h1 class="text-2xl font-bold mb-4 text-center">Upload a Receipt</h1>
			<div class="flex flex-col gap-4">
				<input
					type="file"
					accept="image/jpeg, image/png"
					on:change={handleParseReceipt}
					class="w-full text-lg border rounded-md bg-gray-50 focus:outline-none"
				/>
			</div>
		</div>
	{/if}

	<!-- Parsed Receipt -->
	{#if receipt}
		<div class="w-full bg-white p-4 rounded-md shadow">
			<ReceiptWrapper {receipt} canEdit={true} />
		</div>
	{/if}
</div>
