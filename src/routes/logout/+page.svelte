<script lang="ts">
    import { goto } from '$app/navigation';
    import { logout } from '$lib/api';

    // Log the user out and redirect to the login page
    logout();
    goto('/login');
</script>

<p>Logging you out...</p>