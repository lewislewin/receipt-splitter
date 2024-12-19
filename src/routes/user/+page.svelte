<script lang="ts">
	import { onMount } from 'svelte';
	import { apiFetch } from '$lib/api';

	let user: { name: string; monzo_id: string; created_at: string } | null = null;
	let name = '';
	let monzoId = '';
	let error: string | null = null;
	let successMessage: string | null = null;

	onMount(async () => {
		try {
			// Fetch data about the current user from the /me endpoint
			const response = await apiFetch('/me');
			user = response; // Assuming the API returns an object with user details
			name = user.name;
			monzoId = user.monzo_id;
		} catch (err: any) {
			error = err.message || 'Failed to fetch user data.';
		}
	});

	const handleUpdate = async () => {
		error = null;
		successMessage = null;

		if (!name || !monzoId) {
			error = 'Name and Monzo ID are required.';
			return;
		}

		try {
			await apiFetch('/me', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, monzo_id: monzoId })
			});
			successMessage = 'User updated successfully!';
			if (user) {
				user.name = name;
				user.monzo_id = monzoId;
			}
		} catch (err: any) {
			error = err.message || 'Failed to update user data.';
		}
	};
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
		<h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Update User Information</h1>

		{#if error}
			<p class="text-red-500 text-sm mb-4">{error}</p>
		{/if}

		{#if successMessage}
			<p class="text-green-500 text-sm mb-4">{successMessage}</p>
		{/if}

		{#if user}
			<div class="space-y-4">
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
					/>
				</div>
				<div>
					<label for="monzo_id" class="block text-sm font-medium text-gray-700">Monzo ID</label>
					<input
						id="monzo_id"
						type="text"
						bind:value={monzoId}
						class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
					/>
				</div>
			</div>

			<button
				on:click={handleUpdate}
				class="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
			>
				Update
			</button>

			<p class="mt-4 text-sm text-gray-500">Created at: {new Date(user.created_at).toLocaleString()}</p>
		{:else}
			<p>Loading user data...</p>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		@apply bg-gray-100;
	}
</style>
