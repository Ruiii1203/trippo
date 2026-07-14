const AMAP_WEB_API_KEY = import.meta.env.VITE_AMAP_KEY || 'YOUR_AMAP_KEY'

export interface AmapPoiRaw {
  id: string
  name: string
  type: string
  address: string
  location: string
  adname: string
  cityname: string
}

export interface AmapPoiResponse {
  status: string
  info: string
  count: string
  pois: AmapPoiRaw[]
}

export interface AmapPoiResult {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  category: string
  source: 'amap'
}

export interface PoiSpotData {
  name: string
  address?: string
  lat?: number
  lng?: number
  category?: string
}

function parseAmapLocation(location: string): { lat: number; lng: number } | null {
  if (!location) return null
  const parts = location.split(',')
  if (parts.length !== 2) return null
  const lng = parseFloat(parts[0])
  const lat = parseFloat(parts[1])
  if (isNaN(lat) || isNaN(lng)) return null
  return { lat, lng }
}

function mapAmapTypeToCategory(type: string): string {
  const t = type.toLowerCase()
  if (t.includes('美食') || t.includes('餐饮')) return '美食'
  if (t.includes('购物') || t.includes('商场') || t.includes('超市')) return '购物'
  if (t.includes('公园') || t.includes('绿地') || t.includes('自然')) return '公园'
  if (t.includes('乐园') || t.includes('游乐场') || t.includes('景区')) return '乐园'
  if (t.includes('文化') || t.includes('博物馆') || t.includes('剧院') || t.includes('艺术')) return '文化'
  if (t.includes('景点') || t.includes('旅游') || t.includes('风景')) return '景点'
  return '其他'
}

function normalizeAmapPoi(poi: AmapPoiRaw): AmapPoiResult | null {
  const location = parseAmapLocation(poi.location)
  if (!location) return null

  return {
    id: poi.id || `amap_${poi.name}_${poi.location}`,
    name: poi.name,
    address: poi.address || '',
    lat: location.lat,
    lng: location.lng,
    category: mapAmapTypeToCategory(poi.type),
    source: 'amap',
  }
}

export function poiResultToSpotData(poi: AmapPoiResult): PoiSpotData {
  return {
    name: poi.name,
    address: poi.address || undefined,
    lat: poi.lat,
    lng: poi.lng,
    category: poi.category,
  }
}

export async function searchAmapPois(
  keywords: string,
  city?: string,
  signal?: AbortSignal
): Promise<{ success: boolean; data: AmapPoiResult[]; error?: string; notConfigured?: boolean }> {
  if (!keywords.trim()) {
    return { success: true, data: [] }
  }

  if (AMAP_WEB_API_KEY === 'YOUR_AMAP_KEY') {
    return { success: false, data: [], notConfigured: true, error: '未配置高德API Key' }
  }

  const params = new URLSearchParams({
    key: AMAP_WEB_API_KEY,
    keywords: keywords.trim(),
    offset: '10',
    page: '1',
    extensions: 'base',
  })

  if (city && city.trim()) {
    params.set('city', city.trim())
  }

  try {
    const response = await fetch(
      `https://restapi.amap.com/v3/place/text?${params.toString()}`,
      { signal }
    )

    if (!response.ok) {
      return { success: false, data: [], error: '网络请求失败' }
    }

    const result: AmapPoiResponse = await response.json()

    if (result.status !== '1') {
      const errorMsg = result.info || '地图服务返回异常'
      if (errorMsg.includes('INVALID_USER_KEY') || errorMsg.includes('USERKEY_PLATFORM_NOMATCH')) {
        return { success: false, data: [], error: '高德API Key无效或未配置' }
      }
      if (errorMsg.includes('OVER_QUERY_LIMIT')) {
        return { success: false, data: [], error: '今日地图服务暂不可用，请稍后再试' }
      }
      return { success: false, data: [], error: `地图搜索暂不可用：${errorMsg}` }
    }

    const pois = (result.pois || []).map(normalizeAmapPoi).filter(Boolean) as AmapPoiResult[]
    return { success: true, data: pois }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { success: false, data: [], error: '请求已取消' }
    }
    return { success: false, data: [], error: '网络异常，请检查网络连接' }
  }
}
