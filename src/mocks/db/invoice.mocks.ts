import { faker } from '@faker-js/faker'
import type { Invoice } from '@/types/invoice'

const STORAGE_KEY = 'invoices'

const generateId = () => {
  return faker.string.alphanumeric(6).toUpperCase()
}

const generatePaymentDue = (createdAt: string, paymentTerms: number) => {
  return new Date(new Date(createdAt).getTime() + paymentTerms * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]
}

// 生成假数据
export const generateInvoice = (): Invoice => {
  const createdAt = faker.date.past().toISOString().split('T')[0]
  // 生成指定范围内的日期（默认格式：YYYY-MM-DD）
  // const createdAt = faker.date
  //   .between({
  //     from: '2020-01-01',
  //     to: '2025-12-31',
  //   })
  //   .toISOString()
  //   .split('T')[0]
  const paymentTerms = faker.helpers.arrayElement([7, 14, 30])
  const paymentDue = generatePaymentDue(createdAt, paymentTerms)

  const items = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => {
    const quantity = faker.number.int({ min: 1, max: 5 })
    const price = parseFloat(faker.finance.amount())
    return {
      name: faker.commerce.productName(),
      quantity,
      price,
      total: parseFloat((quantity * price).toFixed(2)),
    }
  })

  const total = items.reduce((acc, item) => acc + item.total, 0)

  return {
    id: generateId(),
    createdAt,
    paymentDue,
    description: faker.commerce.productDescription(),
    paymentTerms,
    clientName: faker.person.fullName(),
    clientEmail: faker.internet.email(),
    status: faker.helpers.arrayElement(['paid', 'pending', 'draft']),
    senderAddress: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      postCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    clientAddress: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      postCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    items,
    total: parseFloat(total.toFixed(2)),
  }
}

// 初始化数据
export const initInvoices = (count = 10) => {
  const data = Array.from({ length: count }, generateInvoice)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return data
}

// 获取所有数据
export const getInvoices = (): Invoice[] => {
  const invoices = localStorage.getItem(STORAGE_KEY)
  if (!invoices || JSON.parse(invoices).length === 0) {
    return initInvoices()
  }
  try {
    return JSON.parse(invoices)
  } catch {
    return initInvoices()
  }
}

// 保存数据
export const saveInvoices = (invoices: Invoice[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
}

// 删除一条
export const deleteInvoiceById = (id: string) => {
  const data = getInvoices().filter((inv) => inv.id !== id)
  saveInvoices(data)
}

// 修改一条
export const updateInvoice = (updated: Invoice) => {
  const data = getInvoices().map((inv) => (inv.id === updated.id ? updated : inv))
  saveInvoices(data)
}

// 保存一条
export const addInvoice = (invoice: Invoice) => {
  const data = getInvoices()
  invoice.id = generateId()
  invoice.paymentDue = generatePaymentDue(invoice.createdAt, invoice.paymentTerms)
  console.log(invoice)
  data.push(invoice)
  saveInvoices(data)
}

// 获取一条
export const getInvoiceById = (id: string) => {
  return getInvoices().find((invoice) => invoice.id === id)
}

// 根据状态获取数据
export const getInvoiceByStatus = (statuses: string[]) => {
  return getInvoices().filter((invoice) => statuses.includes(invoice.status))
}
