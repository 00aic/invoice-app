import { createRouter, createWebHistory } from 'vue-router'
import InvoiceApp from '../views/InvoiceApp.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'invoiceApp',
      component: InvoiceApp,
    },
  ],
})

export default router
