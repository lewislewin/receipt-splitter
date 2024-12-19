<script lang="ts">
    import type { Modifier } from '$lib/types';
  
    export let modifier: Modifier;
    export let index: number;
    export let editable: boolean;
    export let itemsTotal: number;
    export let onUpdate: (index: number, updatedModifier: Modifier) => void;
  
    const handleTypeChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      onUpdate(index, { ...modifier, type: target.value });
    };
  
    const handlePercentageChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      onUpdate(index, { ...modifier, percentage: parseFloat(target.value) || 0 });
    };
  
    const handleValueChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      onUpdate(index, { ...modifier, value: parseFloat(target.value) || 0 });
    };
  
    const handleIncludeChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      onUpdate(index, { ...modifier, include: target.checked });
    };
  
    const calculateModifierTotal = () => {
      if (modifier.percentage) {
        return (itemsTotal * (modifier.percentage / 100)).toFixed(2);
      }
      return modifier.value?.toFixed(2) || '0.00';
    };
  </script>
  
  {#if editable || modifier.include}
  <div class="flex items-center mb-2">
    {#if editable}
      <input
        type="text"
        placeholder="Type"
        class="border rounded p-2 mr-2 flex-grow"
        value={modifier.type}
        on:input={handleTypeChange}
      />
      <input
        type="number"
        step="0.01"
        placeholder="%"
        class="border rounded p-2 w-20 mr-2"
        value={modifier.percentage}
        on:input={handlePercentageChange}
      />
      <input
        type="number"
        step="0.01"
        placeholder="£"
        class="border rounded p-2 w-20"
        value={modifier.value}
        on:input={handleValueChange}
      />
      <input
        type="checkbox"
        checked={modifier.include}
        class="ml-2"
        on:input={handleIncludeChange}
      />
    {:else}
      <span class="flex-grow">{modifier.type}</span>
      <span class="w-20 text-right">{modifier.percentage || 0}%</span>
      <span class="w-20 text-right">£{calculateModifierTotal()}</span>
    {/if}
  </div>
  {/if}
  