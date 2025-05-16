import { createRouter, createWebHistory } from 'vue-router'
import LayoutView from '@/views/LayoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layoutView',
      component: LayoutView,
      children: [
        {
          path: '',
          name: 'invoiceApp',
          component: () => import('@/views/InvoiceApp.vue'),
        },
        {
          path: 'invoiceDetails/:id',
          name: 'invoiceDetails',
          component: () => import('@/views/InvoiceDetails.vue'),
        },
      ],
    },
  ],
})

export default router
