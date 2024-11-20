<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Modifier } from '$lib/types';

    export let modifier: Modifier;

    const dispatch = createEventDispatcher();

    const updateType = (e: Event) => {
        modifier.type = (e.target as HTMLInputElement).value;
        dispatch('update', modifier);
    };

    const updateValue = (e: Event) => {
        modifier.value = parseFloat((e.target as HTMLInputElement).value) || 0;
        dispatch('update', modifier);
    };

    const updatePercentage = (e: Event) => {
        modifier.percentage = parseFloat((e.target as HTMLInputElement).value) || 0;
        dispatch('update', modifier);
    };
</script>

<li class="grid grid-cols-3 items-center">
    <input 
        type="text" 
        class="border p-1 rounded w-full" 
        bind:value={modifier.type} 
        on:input={updateType} 
    />
    <input 
        type="number" 
        class="border p-1 rounded w-full text-center" 
        bind:value={modifier.percentage} 
        on:input={updatePercentage} 
    />
    <input 
        type="number" 
        step="0.01"
        class="border p-1 rounded w-full text-right" 
        bind:value={modifier.value} 
        on:input={updateValue} 
    />
</li>
``
