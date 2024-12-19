<script lang="ts">
    import { goto } from '$app/navigation';
    import { apiFetch } from '$lib/api'; // Use apiFetch for authenticated requests
    import { onMount } from 'svelte';

    let name = '';
    let email = '';
    let password = '';
    let monzoId = '';
    let error: string | null = null;

    const handleRegister = async () => {
        error = null;

        // Validate form fields
        if (!name || !email || !password || !monzoId) {
            error = 'All fields are required.';
            return;
        }

        try {
            // Make API call to register the user
            await apiFetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, monzo_id: monzoId })
            });

            error = null; // Clear any previous errors
            goto('/login'); // Redirect to login on successful registration
        } catch (err: any) {
            error = err.message || 'Registration failed. Please try again.';
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h1>

        <div class="space-y-4">
            <input
                type="text"
                placeholder="Name"
                bind:value={name}
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
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
            <input
                type="text"
                placeholder="Monzo ID"
                bind:value={monzoId}
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
        </div>

        {#if error}
            <p class="mt-4 text-red-500 text-sm">{error}</p>
        {/if}

        <button
            on:click={handleRegister}
            class="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
            Register
        </button>
    </div>
</div>

<style>
    :global(body) {
        @apply bg-gray-100;
    }
</style>
