import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Invoice } from '@/types/invoice'

export const useInvoiceStore = defineStore('invoice', () => {
  const currentInvoice = ref<Invoice>()

  const setCurrentInvoice = (invoice: Invoice) => {
    currentInvoice.value = invoice
  }

  return { currentInvoice, setCurrentInvoice }
})
