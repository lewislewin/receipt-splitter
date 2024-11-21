<script lang="ts">
    let { update, remove, modifier, canEdit } = $props();
  
    const handleRemove = () => {
      remove();
    };
  </script>
  
  <div class="flex items-center space-x-4">
    {#if canEdit}
      <button
        onclick={handleRemove}
        class="w-24 rounded bg-red-500 px-3 py-2 font-bold text-white hover:bg-red-600"
      >
        Remove
      </button>
    {/if}
  </div>
  