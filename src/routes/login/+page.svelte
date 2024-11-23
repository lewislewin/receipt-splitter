<script lang="ts">
    import { goto } from '$app/navigation';
    import { login, isAuthenticated, logout } from '$lib/api';
    let username = '';
    let password = '';
    let error: string | null = null;

    const handleLogin = async () => {
        try {
            await login(username, password);
            error = null;
            goto('/'); // Redirect to the home page or dashboard
        } catch (err: any) {
            error = err.message || 'Login failed. Please try again.';
        }
    };

    const handleLogout = () => {
        logout();
        goto('/login'); // Redirect to the login page
    };
</script>

{#if isAuthenticated()}
    <p>You are logged in!</p>
    <button on:click={handleLogout} class="btn">Logout</button>
{:else}
    <div class="login-form">
        <h1>Login</h1>
        <input type="text" placeholder="Username" bind:value={username} />
        <input type="password" placeholder="Password" bind:value={password} />
        <button on:click={handleLogin} class="btn">Login</button>
        {#if error}
            <p class="error">{error}</p>
        {/if}
    </div>
{/if}

<style>
    .btn {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
    }

    .btn:hover {
        background-color: #0056b3;
    }

    .error {
        color: red;
    }
</style>
