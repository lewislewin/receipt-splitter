<script lang="ts">
  import ModifierActions from './ModifierActions.svelte';
  import type { Modifier } from '$lib/types';

  let { modifiers, onModifierUpdate, onModifierRemove, canEdit } = $props();

  const calculateModifierTotal = (modifier: Modifier) => {
    return (modifier.percentage ?? 0) * (modifier.value ?? 0);
  };
</script>

<div class="w-full overflow-x-auto">
  <table class="table-auto w-full text-left border-collapse">
    <thead>
      <tr class="bg-gray-200 text-gray-600 uppercase text-sm">
        <th class="px-4 py-2">Type</th>
        <th class="px-4 py-2 text-right">Percentage</th>
        <th class="px-4 py-2 text-right">Value</th>
        <th class="px-4 py-2 text-center">Include</th>
        <th class="px-4 py-2 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each modifiers as modifier, index}
        <tr class="border-t">
          <!-- Modifier Type -->
          <td class="px-4 py-2">
            {#if canEdit}
              <input
                type="text"
                value={modifier.type}
                class="border rounded p-1 w-full"
                oninput={(e) => onModifierUpdate(index, { ...modifier, type: e.target.value })}
              />
            {:else}
              <span class="text-gray-800">{modifier.type}</span>
            {/if}
          </td>

          <!-- Modifier Percentage -->
          <td class="px-4 py-2 text-right">
            {#if canEdit}
              <input
                type="number"
                step="0.01"
                value={modifier.percentage ?? ''}
                class="border rounded p-1 w-full"
                oninput={(e) =>
                  onModifierUpdate(index, { ...modifier, percentage: parseFloat(e.target.value) || 0 })
                }
              />
            {:else}
              <span class="text-gray-800">{modifier.percentage ?? ''}%</span>
            {/if}
          </td>

          <!-- Modifier Value -->
          <td class="px-4 py-2 text-right">
            {#if canEdit}
              <input
                type="number"
                step="0.01"
                value={modifier.value ?? ''}
                class="border rounded p-1 w-full"
                oninput={(e) =>
                  onModifierUpdate(index, { ...modifier, value: parseFloat(e.target.value) || 0 })
                }
              />
            {:else}
              <span class="text-gray-800">£{modifier.value ?? ''}</span>
            {/if}
          </td>

          <!-- Modifier Include -->
          <td class="px-4 py-2 text-center">
            {#if canEdit}
              <input
                type="checkbox"
                checked={modifier.include}
                class="form-checkbox h-5 w-5 text-blue-600"
                onchange={(e) =>
                  onModifierUpdate(index, { ...modifier, include: e.target.checked })
                }
              />
            {:else}
              <span class="text-gray-800">{modifier.include ? 'Yes' : 'No'}</span>
            {/if}
          </td>

          <!-- Actions -->
          <td class="px-4 py-2 text-center">
            <ModifierActions
              {modifier}
              {canEdit}
              update={(updatedModifier: Modifier) => onModifierUpdate(index, updatedModifier)}
              remove={() => onModifierRemove(index)}
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
