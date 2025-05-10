interface Address {
  street: string
  city: string
  postCode: string
  country: string
}

interface InvoiceItem {
  name: string
  quantity: number
  price: number
  total: number
}

export type Status = 'paid' | 'pending' | 'draft'

export interface Invoice {
  id: string
  createdAt: string
  paymentDue: string
  description: string
  paymentTerms: number
  clientName: string
  clientEmail: string
  status: Status
  senderAddress: Address
  clientAddress: Address
  items: InvoiceItem[]
  total: number
}
