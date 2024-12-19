<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initializeAuth, auth, logoutUser } from '$lib/auth.svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	let { children } = $props();

	onMount(async () => {
		// Initialize the authentication state
		await initializeAuth();

		const authState = get(auth);

		console.log('Auth State in onMount:', authState);

		// Define public routes
		const publicRoutes = ['/login', '/register'];
		const currentPath = window.location.pathname;

		// Check if the current route is public
		const isPublicRoute = publicRoutes.some((route) => currentPath.startsWith(route));

		// Redirect to /login if not authenticated and the route is private
		if (!authState.isAuthenticated && !isPublicRoute) {
			console.log('Redirecting to /login');
			goto('/login');
		}
	});

	// Handle logout
	const handleLogout = () => {
		logoutUser();
	};
</script>

<svelte:head>
	<title>Splitty</title>
</svelte:head>

<div class="flex items-center justify-between bg-blue-500 text-white p-4">
	<div class="text-lg font-bold">
		<a href="/" class="hover:underline">Splitty</a>
	</div>
	<div class="flex items-center gap-4">
		<a href="/user" class="hover:underline">Current User</a>
		<button 
			on:click={handleLogout} 
			class="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200"
		>
			Logout
		</button>
	</div>
</div>

<main class="p-1">
	{@render children()}
</main>
