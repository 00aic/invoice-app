import { setupWorker } from 'msw/browser'
import { autoImportHandlers } from './handlers/autoImport'

const handlers = await autoImportHandlers()
export const worker = setupWorker(...handlers)

// onUnhandledRequest(req) {
//     // 1. 总是放行未处理的请求
//     req.passthrough()

//     // 2. 只在shouldMock=false时打印警告（避免生产环境日志污染）
//     if (!shouldMock(req) && import.meta.env.DEV) {
//       console.warn('[MSW] Bypassed real request:', req.method, req.url)
//     }
//   }

// 静态资源排除列表
const staticAssets = [
  /\.vue$/,
  /\.css$/,
  /\.js$/,
  /\.png$/,
  /\.jpg$/,
  /\.svg$/,
  /\.ico$/,
  /^\/@vite\/client$/,
  /^\/@id\/vite-plugin-vue:main/,
]

// 暴露开发工具方法
export const mock = {
  start: () =>
    worker.start({
      // quiet: true,
      onUnhandledRequest: 'bypass',
      // onUnhandledRequest(req, print) {
      //       // 1. 总是放行未处理的请求
      // req.passthrough()

      // // 2. 只在shouldMock=false时打印警告（避免生产环境日志污染）
      // if (!shouldMock(req) && import.meta.env.DEV) {
      //   console.warn('[MSW] Bypassed real request:', req.method, req.url)
      // }

      // const url = new URL(req.url)

      // // 静态资源正则列表
      // const staticAssets = [/\.(vue|css|js|png|jpg|svg|ico)$/i, /^\/@vite\//, /^\/src\//]

      // if (staticAssets.some((regex) => regex.test(url.pathname))) {
      //   return 'bypass' // 显式放过静态资源
      // }

      // 其他未处理的请求给出警告
      //   print.warning()
      //   console.warn('[MSW] Bypassed real request:', req.method, req.url)
      // },
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`, // 注意 BASE_URL 是以 /invoice-app/ 开头的
      },
    }),
  stop: () => worker.stop(),
  reset: () => {
    // 可以在这里重置模拟数据
  },
  // docs: () => {
  //   // 自动生成 Mock API 文档
  //   handlers.forEach((handler) => {
  //     console.log(`${handler.info.method} ${handler.info.path}`)
  //   })
  // },
}
