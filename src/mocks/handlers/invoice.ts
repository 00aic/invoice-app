// src/mocks/handlers.ts
import type { Invoice } from '@/types/invoice'
import { http, HttpResponse, delay } from 'msw'
import {
  addInvoice,
  deleteInvoiceById,
  getInvoiceById,
  getInvoiceByStatus,
  getInvoices,
  updateInvoice,
} from '@/mocks/db/invoice.mocks'
import type { ApiResponse } from '@/mocks/mock'

const handlers = [
  // 带参数的路由
  // http.get<PathParams, RequestBody, ResponseType>
  http.get<{ id: string }, never, ApiResponse<Invoice>>(
    `${import.meta.env.VITE_API_BASE}/invoices/:id`,
    async ({ params }) => {
      await delay(1) // 模拟网络延迟
      try {
        const id = params.id

        if (typeof id !== 'string') {
          return HttpResponse.json({ code: 400, error: 'Invalid or missing ID' }, { status: 400 })
        }

        const invoice = getInvoiceById(id)
        if (!invoice) {
          return HttpResponse.json({ code: 500, error: 'Invoice not found' }, { status: 500 })
        }

        return HttpResponse.json(
          {
            code: 200,
            message: 'Invoices retrieved successfully',
            data: invoice,
          },
          {
            status: 200, // 返回成功的状态码
          },
        )
      } catch (error) {
        return HttpResponse.json({ code: 500, error: 'Invalid payload' + error }, { status: 500 })
      }
    },
  ),

  http.get<{ statuses: string }, never, ApiResponse<Invoice[]>>(
    `${import.meta.env.VITE_API_BASE}/invoices/status/:statuses`,
    async ({ params }) => {
      await delay(1) // 模拟网络延迟
      try {
        const statuses = params.statuses
        const statusList: string[] = statuses.split(',').map((item: string) => item.trim())
        const invoice = getInvoiceByStatus(statusList)
        // if (!invoice) {
        //   return HttpResponse.json({ code: 404, error: 'Invoice not found' }, { status: 404 })
        // }

        return HttpResponse.json(
          {
            code: 200,
            message: 'Invoices retrieved successfully',
            data: invoice,
          },
          {
            status: 200, // 返回成功的状态码
          },
        )
      } catch (error) {
        return HttpResponse.json({ code: 500, error: 'Invalid payload' + error }, { status: 500 })
      }
    },
  ),

  http.get<never, never, ApiResponse<Invoice[]>>(
    `${import.meta.env.VITE_API_BASE}/invoices`,
    async ({}) => {
      await delay(1) // 模拟网络延迟
      // 生成一个包含 5 个随机用户的数组
      return HttpResponse.json(
        {
          code: 200,
          message: 'Invoices retrieved successfully',
          data: getInvoices(),
        },
        {
          status: 200, // 返回成功的状态码
        },
      )
    },
  ),

  http.post<never, Invoice, ApiResponse<Invoice>>(
    `${import.meta.env.VITE_API_BASE}/invoices`,
    async ({ request }) => {
      await delay(1) // 模拟网络延迟

      // 从请求体中获取传递的用户数据
      const body = await request.json() // 自动推断为 IUser
      // const newUser: User = await request.json()
      // 返回状态码 201 表示成功创建
      addInvoice(body)
      return HttpResponse.json(
        {
          code: 201,
          message: 'Invoices retrieved successfully',
        },
        {
          status: 201, // 创建成功状态码
        },
      )

      // return HttpResponse.json(
      //   { success: true, data: body },
      //   { status: 201, headers: { 'X-Mock': 'true' } }
      // )
    },
  ),

  http.put<never, Invoice, ApiResponse<Invoice>>(
    `${import.meta.env.VITE_API_BASE}/invoices`,
    async ({ request }) => {
      await delay(1) // 模拟网络延迟

      // 从请求体中获取传递的用户数据
      const body = await request.json() // 自动推断为 IUser
      // const newUser: User = await request.json()
      // 返回状态码 201 表示成功创建
      updateInvoice(body)
      return HttpResponse.json(
        {
          code: 201,
          message: 'Invoices retrieved successfully',
        },
        {
          status: 201, // 创建成功状态码
        },
      )

      // return HttpResponse.json(
      //   { success: true, data: body },
      //   { status: 201, headers: { 'X-Mock': 'true' } }
      // )
    },
  ),

  http.delete(`${import.meta.env.VITE_API_BASE}/invoices/:id`, async ({ params }) => {
    await delay(1) // 模拟网络延迟
    try {
      const id = params.id

      if (typeof id !== 'string') {
        return HttpResponse.json({ error: 'Invalid or missing ID' }, { status: 400 })
      }

      deleteInvoiceById(id)
      return HttpResponse.json({ status: 200 })
    } catch (error) {
      return HttpResponse.json({ error: 'Invalid payload' + error }, { status: 400 })
    }
  }),

  // 模拟 GET 请求失败
  http.get(`${import.meta.env.VITE_API_BASE}/error`, async () => {
    await delay(150) // 模拟网络延迟

    // 返回状态码 500 表示服务器错误
    return HttpResponse.json(
      {
        message: 'Internal Server Error',
      },
      {
        status: 500, // 服务器错误状态码
      },
    )
  }),
]

export default handlers
