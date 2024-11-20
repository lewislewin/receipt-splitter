<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Modifier } from '$lib/types';

  export let modifier: Modifier;
  const dispatch = createEventDispatcher();

  const updateField = (field: keyof Modifier, value: any) => {
    const updatedModifier = { ...modifier, [field]: value };
    dispatch('update', updatedModifier);
  };
</script>

<div class="grid grid-cols-3 items-center">
  <!-- Editable type field -->
  <input 
    type="text" 
    class="border p-1 rounded w-full" 
    value={modifier.type} 
    on:input={(e) => updateField('type', (e.target as HTMLInputElement).value)} 
  />

  <!-- Editable percentage field -->
  <input 
    type="number" 
    class="border p-1 rounded w-full text-center" 
    value={modifier.percentage ?? ''} 
    on:input={(e) => updateField('percentage', parseFloat((e.target as HTMLInputElement).value) || 0)} 
  />

  <!-- Editable value field -->
  <input 
    type="number" 
    step="0.01"
    class="border p-1 rounded w-full text-right" 
    value={modifier.value ?? ''} 
    on:input={(e) => updateField('value', parseFloat((e.target as HTMLInputElement).value) || 0)} 
  />
</div>
