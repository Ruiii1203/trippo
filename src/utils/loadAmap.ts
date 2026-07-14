const AMAP_JS_API_KEY = import.meta.env.VITE_AMAP_JS_KEY || ''

declare global {
  interface Window {
    AMapLoader?: {
      load: (options: { key: string; version: string; plugins?: string[] }) => Promise<any>
    }
    AMap?: any
  }
}

let amapLoadPromise: Promise<any> | null = null

export function loadAmap(): Promise<any> {
  if (window.AMap) {
    return Promise.resolve(window.AMap)
  }

  if (amapLoadPromise) {
    return amapLoadPromise
  }

  amapLoadPromise = new Promise((resolve, reject) => {
    if (!AMAP_JS_API_KEY) {
      reject(new Error('未配置高德地图JS API Key'))
      amapLoadPromise = null
      return
    }

    if (window.AMapLoader) {
      window.AMapLoader.load({
        key: AMAP_JS_API_KEY,
        version: '2.0',
      })
        .then((AMap: any) => {
          resolve(AMap)
        })
        .catch((err: any) => {
          reject(err)
          amapLoadPromise = null
        })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://webapi.amap.com/loader.js'
    script.async = true
    script.onload = () => {
      if (!window.AMapLoader) {
        reject(new Error('高德地图Loader加载失败'))
        amapLoadPromise = null
        return
      }
      window.AMapLoader.load({
        key: AMAP_JS_API_KEY,
        version: '2.0',
      })
        .then((AMap: any) => {
          resolve(AMap)
        })
        .catch((err: any) => {
          reject(err)
          amapLoadPromise = null
        })
    }
    script.onerror = () => {
      reject(new Error('高德地图Loader脚本加载失败'))
      amapLoadPromise = null
    }
    document.head.appendChild(script)
  })

  return amapLoadPromise
}

export function isAmapJsKeyConfigured(): boolean {
  return !!AMAP_JS_API_KEY
}
