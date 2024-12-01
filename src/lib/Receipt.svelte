<script lang="ts">
    import ReceiptLine from '$lib/ReceiptLine.svelte';
    import ModifierComponent from '$lib/ModifierLine.svelte';
    import type { ReceiptItem, Modifier } from '$lib/types';
  
    let { receiptName = '', items = [], modifiers = [], canEdit = false } = $props();
  
    let selectedItem: ReceiptItem | null = $state(null);
    let activeLines: ReceiptItem[] = $state([]);
    let activeModifiers: Modifier[] = $state(modifiers);
  
    const addLine = (event: CustomEvent<ReceiptItem>) => {
      const line = event.detail;
      activeLines = [...activeLines.filter((l) => l.item !== line.item), line];
      selectedItem = null;
    };
  
    const removeLine = (event: CustomEvent<{ item: ReceiptItem }>) => {
      const lineToRemove = event.detail.item;
      activeLines = activeLines.filter((line) => line.item !== lineToRemove.item);
    };
  
    const updateModifier = (index: number, updatedModifier: Modifier) => {
      activeModifiers[index] = updatedModifier;
      activeModifiers = [...activeModifiers];
    };
  
    const calculateItemsTotal = () => {
      return activeLines.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
    };
  
    const calculateTotal = () => {
      const itemsTotal = calculateItemsTotal();
      const modifiersTotal = activeModifiers.reduce((total, modifier) => {
        if (!modifier.include && !canEdit) return total;
        if (modifier.percentage) {
          return total + itemsTotal * (modifier.percentage / 100);
        }
        if (modifier.value) {
          return total + modifier.value;
        }
        return total;
      }, itemsTotal);
  
      return Math.round(modifiersTotal * 100) / 100;
    };
  
    const pay = () => {
      alert(`Paying £${calculateTotal().toFixed(2)}`);
    };
  </script>
  
  <div class="flex flex-col p-4 bg-white rounded shadow">
    <h2 class="text-2xl font-bold text-center mb-4">{receiptName}</h2>
  
    <div class="mb-4">
      <label for="item-select" class="block mb-2 font-semibold">Select an item</label>
      <select
        id="item-select"
        class="w-full rounded border p-2"
        bind:value={selectedItem}
      >
        <option value={null}>-- Select an Item --</option>
        {#each items as item}
          <option value={item}>{item.item} - £{item.price?.toFixed(2)}</option>
        {/each}
      </select>
    </div>
  
    {#if selectedItem}
      <ReceiptLine
        {selectedItem}
        on:addLine={addLine}
        on:cancel={() => (selectedItem = null)}
      />
    {/if}
  
    <h3 class="text-lg font-bold mt-6 mb-2">Active Items</h3>
    <div>
      {#each activeLines as line (line.item)}
        <ReceiptLine
          zero={true}
          selectedItem={line}
          minimal
          on:removeLine={removeLine}
          on:expand={() => (selectedItem = line)}
        />
      {/each}
    </div>
  
    <h3 class="text-lg font-bold mt-6 mb-2">Modifiers</h3>
    <div>
      {#each activeModifiers as modifier, index}
        {#if canEdit || modifier.include}
          <ModifierComponent
            {modifier}
            {index}
            editable={canEdit}
            itemsTotal={calculateItemsTotal()}
            onUpdate={updateModifier}
          />
        {/if}
      {/each}
    </div>
  
    <div class="mt-6 text-right">
      <p class="text-lg font-bold">Total: £{calculateTotal().toFixed(2)}</p>
      <button
        class="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
        onclick={pay}
      >
        Pay
      </button>
    </div>
  </div>
  