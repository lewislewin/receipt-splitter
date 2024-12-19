<script lang="ts">
    import { goto } from '$app/navigation';
    import { logoutUser } from '$lib/auth.svelte';

    logoutUser();

    $effect(() => {
        goto('/login');
    })
</script>

<p>Logging you out...</p>
