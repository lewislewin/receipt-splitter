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

    const updatePrice = (e: Event) => {
        const newValue = parseFloat((e.target as HTMLInputElement).value);
        if (!isNaN(newValue)) {
            item.price = newValue;
            dispatch('update', item);
        }
    };

    const calculateRowTotal = () => {
        return (item.qty * (item.price ?? 0)).toFixed(2);
    };
</script>

<li class="grid grid-cols-5 items-center gap-2">
    <!-- Editable item name -->
    <input 
        type="text" 
        class="border p-1 rounded w-full"
        bind:value={item.item} 
        on:input={updateName} 
    />
    
    <!-- Quantity controls -->
    <div class="flex items-center space-x-2">
        <button on:click={decreaseQty} class="p-1 bg-gray-200 rounded">-</button>
        <span>{item.qty}</span>
        <button on:click={increaseQty} class="p-1 bg-gray-200 rounded">+</button>
    </div>
    
    <!-- Editable price -->
    <input 
        type="number" 
        step="0.01"
        class="border p-1 rounded w-full"
        value={(item.price ?? 0).toFixed(2)} 
        on:input={updatePrice} 
    />
    
    <!-- Row total -->
    <div class="text-right font-semibold">
        £{calculateRowTotal()}
    </div>
</li>
