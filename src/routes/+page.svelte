<script lang="ts">
  import { goto } from '$app/navigation';

  let receiptInput: HTMLInputElement | null = null;

  // Define the expected structure of the response
  interface ApiResponse {
    id: string;
  }

  const uploadReceipt = async () => {
    if (!receiptInput || !receiptInput.files || receiptInput.files.length === 0) {
      alert('Please select a receipt image!');
      return;
    }

    const receiptImage = receiptInput.files[0]; // Get the first file from the input
    const formData = new FormData();
    formData.append('receipt', receiptImage);

    const res = await fetch('/api/receipt', { method: 'POST', body: formData });

    // Ensure TypeScript knows the response structure
    const responseJson: ApiResponse = await res.json();

    // Use the id from the response
    goto(`/receipt/${responseJson.id}`);
  };
</script>

<h1>Upload a Receipt</h1>
<input type="file" accept="image/*" bind:this={receiptInput} />
<button on:click={uploadReceipt}>Parse Receipt</button>
