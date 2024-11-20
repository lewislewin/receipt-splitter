<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Modifier } from '$lib/types';
  
    export let modifier: Modifier;
    const dispatch = createEventDispatcher();
  
    const updateField = (field: keyof Modifier, value: any) => {
      modifier[field] = value;
      dispatch('update', { ...modifier });
    };
  </script>
  
  <li class="grid grid-cols-3 items-center">
    <input 
      type="text" 
      class="border p-1 rounded w-full" 
      bind:value={modifier.type} 
      on:input={(e) => updateField('type', (e.target as HTMLInputElement).value)} 
    />
    <input 
      type="number" 
      class="border p-1 rounded w-full text-center" 
      bind:value={modifier.percentage} 
      on:input={(e) => updateField('percentage', parseFloat((e.target as HTMLInputElement).value) || 0)} 
    />
    <input 
      type="number" 
      step="0.01"
      class="border p-1 rounded w-full text-right" 
      bind:value={modifier.value} 
      on:input={(e) => updateField('value', parseFloat((e.target as HTMLInputElement).value) || 0)} 
    />
  </li>
  