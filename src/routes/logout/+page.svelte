<script lang="ts">
    import { goto } from '$app/navigation';
    import { logoutUser } from '$lib/auth.svelte';

    // Call the logout function
    logoutUser();

    // Redirect to the login page
    $effect(() => {
        goto('/login');
    })
</script>

<p>Logging you out...</p>
