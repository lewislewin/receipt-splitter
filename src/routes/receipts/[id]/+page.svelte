<script lang="ts">
    import type { Receipt } from '$lib/types';
  
    export let data: Receipt;
  
    let total: number = 0;
  
    const calculateTotal = () => {
      total = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      return total.toFixed(2);
    };
  </script>
  
  <h1>{data.name}</h1>
  <ul>
    {#each data.items as item}
      <li>{item.qty}x {item.item} - £{item.price.toFixed(2)}</li>
    {/each}
  </ul>
  
  <p>Total: £{calculateTotal()}</p>
  