<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Splitty</title>
</svelte:head>

{@render children()}
