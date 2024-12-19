<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initializeAuth, auth, logoutUser } from '$lib/auth.svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	let { children } = $props();

	// Regular expression to match UUIDs
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

	onMount(async () => {
		await initializeAuth();

		const authState = get(auth);

		console.log('Auth State in onMount:', authState);

		const publicRoutes = ['/login', '/register'];
		const currentPath = window.location.pathname;

		// Check if the current route is a UUID
		const pathSegments = currentPath.split('/').filter(Boolean); // Split and remove empty segments
		const hasUuid = pathSegments.some((segment) => uuidRegex.test(segment));

		// Determine if the route is public
		const isPublicRoute = publicRoutes.some((route) => currentPath.startsWith(route)) || hasUuid;

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
			onclick={handleLogout} 
			class="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200"
		>
			Logout
		</button>
	</div>
</div>

<main class="p-1">
	{@render children()}
</main>
