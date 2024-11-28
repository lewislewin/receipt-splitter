<script lang="ts">
    import { goto } from '$app/navigation';
    import { apiFetch } from '$lib/api'; // Use apiFetch for authenticated requests
    let name = '';
    let email = '';
    let password = '';
    let monzoId = '';
    let error: string | null = null;

    const handleRegister = async () => {
        try {
            await apiFetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, monzo_id: monzoId })
            });
            error = null;
            goto('/login'); // Redirect to login on successful registration
        } catch (err: any) {
            error = err.message || 'Registration failed. Please try again.';
        }
    };
</script>

<div class="register-form">
    <h1>Register</h1>
    <input type="text" placeholder="Name" bind:value={name} />
    <input type="email" placeholder="Email" bind:value={email} />
    <input type="password" placeholder="Password" bind:value={password} />
    <input type="text" placeholder="Monzo ID" bind:value={monzoId} />
    <button on:click={handleRegister} class="btn">Register</button>
    {#if error}
        <p class="error">{error}</p>
    {/if}
</div>

<style>
    .btn {
        background-color: #28a745;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
    }

    .btn:hover {
        background-color: #218838;
    }

    .error {
        color: red;
    }
</style>
