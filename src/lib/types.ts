export interface ReceiptItem {
    item: string
    price: number
    qty: number
  }
  
export interface Modifier {
    type: string
    value: number
    percentage: number
}

export interface ParsedReceipt {
    name: string
    items: ReceiptItem[]
    modifiers: Modifier[]
  }
  