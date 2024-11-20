<script lang="ts">
    import ItemActions from './ItemActions.svelte';
    import type { ReceiptItem } from '$lib/types';
  
    let { items, onItemUpdate, onItemRemove } = $props();
  
    const calculateRowTotal = (item: ReceiptItem) => (item.qty * (item.price ?? 0)).toFixed(2);
  </script>
  
  <div class="w-full overflow-x-auto">
    <table class="table-auto w-full text-left border-collapse">
      <thead>
        <tr class="bg-gray-200 text-gray-600 uppercase text-sm">
          <th class="px-4 py-2 text-right">Line Price</th>
          <th class="px-4 py-2">Item Name</th>
          <th class="px-4 py-2 text-right">Individual Price</th>
          <th class="px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, index}
          <tr class="border-t">
            <!-- Line Price -->
            <td class="px-4 py-2 text-right font-semibold">
              £{calculateRowTotal(item)}
            </td>
  
            <!-- Item Name -->
            <td class="px-4 py-2">
              <input
                type="text"
                value={item.item}
                class="border rounded p-1 w-full"
                oninput={(e) => onItemUpdate(index, { ...item, item: e.target.value })}
              />
            </td>
  
            <!-- Individual Price -->
            <td class="px-4 py-2 text-right">
              <input
                type="number"
                step="0.01"
                value={(item.price ?? 0).toFixed(2)}
                class="border rounded p-1 w-full"
                oninput={(e) =>
                  onItemUpdate(index, { ...item, price: parseFloat(e.target.value) || 0 })
                }
              />
            </td>
  
            <!-- Actions -->
            <td class="px-4 py-2 text-center">
              <ItemActions
                {item}
                update={(updatedValue: ReceiptItem) => onItemUpdate(index, updatedValue)}
                remove={() => onItemRemove(index)} 
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  