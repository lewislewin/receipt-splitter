<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { ReceiptItem } from '$lib/types';

    export let item: ReceiptItem;

    const dispatch = createEventDispatcher();

    const increaseQty = () => {
        item.qty += 1;
        dispatch('update', item);
    };

    const decreaseQty = () => {
        if (item.qty > 0) {
            item.qty -= 1;
            dispatch('update', item);
        }
    };

    const updateName = (e: Event) => {
        item.item = (e.target as HTMLInputElement).value;
        dispatch('update', item);
    };
</script>

<li class="grid grid-cols-3 items-center">
    <input 
        type="text" 
        class="border p-1 rounded w-full"
        bind:value={item.item} 
        on:input={updateName} 
    />
    <div class="flex items-center space-x-2">
        <button on:click={decreaseQty} class="p-1 bg-gray-200 rounded">-</button>
        <span>{item.qty}</span>
        <button on:click={increaseQty} class="p-1 bg-gray-200 rounded">+</button>
    </div>
    <div>£{item.price != null ? item.price.toFixed(2) : '0.00'}</div>
</li>
