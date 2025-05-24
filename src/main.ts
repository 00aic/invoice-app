import '@/assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const mountMock = async () => {
  // if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
  // if (import.meta.env.DEV) {
  try {
    const { initMock } = await import('@/mocks/browser')
    const mock = await initMock()
    await mock.start()
    console.log('Mock server started')
  } catch (error) {
    console.error('Mock server failed:', error)
  }
  // }
}

// 该方式生产环境下有问题
// await mountMock()
// app.mount('#app')

// 没有后台，因此生产环境下启用mock数据
;(async () => {
  await mountMock() // 确保 mountMock 是异步的
  app.mount('#app')
})()
