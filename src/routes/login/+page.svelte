<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginUser, logoutUser, auth } from '$lib/auth.svelte';
	import { get } from 'svelte/store';

	let email = '';
	let password = '';
	let error: string | null = null;

	const handleLogin = async () => {
		error = null;

		if (!email || !password) {
			error = 'Both email and password are required.';
			return;
		}

		try {
			await loginUser(email, password);
			error = null;
			goto('/');
		} catch (err: any) {
			error = err.message || 'Login failed. Please try again.';
		}
	};

	const handleLogout = () => {
		logoutUser();
		goto('/login');
	};

	$: isAuthenticated = get(auth).isAuthenticated;
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
		{#if isAuthenticated}
			<h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">You are logged in!</h1>
			<button 
				on:click={handleLogout} 
				class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
			>
				Logout
			</button>
		{:else}
			<h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>

			<div class="space-y-4">
				<input
					type="email"
					placeholder="Email"
					bind:value={email}
					class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
				/>
				<input
					type="password"
					placeholder="Password"
					bind:value={password}
					class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
				/>
			</div>

			{#if error}
				<p class="mt-4 text-red-500 text-sm">{error}</p>
			{/if}

			<button
				on:click={handleLogin}
				class="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
			>
				Login
			</button>
            <button
				on:click={() => goto('/register')}
				class="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
			>
				Register
			</button>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		@apply bg-gray-100;
	}
</style>
