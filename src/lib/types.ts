export interface ReceiptItem {
    item: string;
    price: number;
    qty: number;
  }
  
  export interface Receipt {
    name: string;
    items: ReceiptItem[];
  }
  