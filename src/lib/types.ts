export interface ReceiptItem {
    item: string
    price: number | null
    qty: number
  }
  
export interface Modifier {
    type: string
    value: number | null
    percentage: number | null
    include: boolean
}

export interface ParsedReceipt {
    name: string
    items: ReceiptItem[]
    modifiers: Modifier[]
    monzoId: string
    reason: string
  }
  