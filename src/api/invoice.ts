import http from './http'
import type { Invoice } from '@/types/invoice'
// // 获取用户列表
// export const fetchUsers = (params?: { page?: number; size?: number }) => {
//   return http.get<{
//     list: User[];
//     total: number;
//     page: number;
//     size: number;
//   }>('/api/users', { params, mock: true }); // 强制使用mock
// };
export const getInvoices = () => {
  return http.get<Invoice[]>('/invoices')
}

export const addInvoice = (params: Invoice) => {
  return http.post('/invoices', params)
}

export const updateInvoice = (params: Invoice) => {
  return http.put('/invoices', params)
}

export const deleteInvoiceById = (id: string) => {
  return http.delete(`/invoices/${id}`, { mock: true })
}

export const getInvoiceById = (id: string) => {
  return http.get<Invoice>(`/invoices/${id}`)
}
