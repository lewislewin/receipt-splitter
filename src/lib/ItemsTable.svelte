<script lang="ts">
    import ItemActions from '$lib/ItemActions.svelte';
    import type { ReceiptItem } from '$lib/types';
  
    export let items: ReceiptItem[] = [];
    export let onItemUpdate: (index: number, updatedItem: ReceiptItem) => void;
    export let onItemRemove: (index: number) => void;
  
    const calculateRowTotal = (item: ReceiptItem) => (item.qty * (item.price ?? 0)).toFixed(2);
  </script>
  
  <div class="w-full overflow-x-auto">
    <table class="table-auto w-full text-left border-collapse">
      <thead>
        <tr class="bg-gray-200 text-gray-600 uppercase text-sm">
          <th class="px-4 py-2">Line Price</th>
          <th class="px-4 py-2">Item Name</th>
          <th class="px-4 py-2">Individual Price</th>
          <th class="px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, index}
          <tr class="border-t">
            <td class="px-4 py-2 text-right font-semibold">
              £{calculateRowTotal(item)}
            </td>
            <td class="px-4 py-2">
              <input
                type="text"
                value={item.item}
                class="border rounded p-1 w-full"
                on:input={(e) => onItemUpdate(index, { ...item, item: e.target.value })}
              />
            </td>
            <td class="px-4 py-2">
              <input
                type="number"
                step="0.01"
                value={(item.price ?? 0).toFixed(2)}
                class="border rounded p-1 w-full"
                on:input={(e) =>
                  onItemUpdate(index, { ...item, price: parseFloat(e.target.value) || 0 })
                }
              />
            </td>
            <td class="px-4 py-2 text-center">
              <ItemActions
                {item}
                on:update={(e) => onItemUpdate(index, e.detail)}
                on:remove={() => onItemRemove(index)}
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  