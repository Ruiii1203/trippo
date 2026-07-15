import type { Spot, Trip } from '../types'

export interface AIPlannerSpot {
  spotId: string
  name: string
  estimatedDuration: string
  order: number
}

export interface AIPlannerDay {
  dayIndex: number
  title: string
  spots: AIPlannerSpot[]
}

export interface AIPlannerResponse {
  days: AIPlannerDay[]
}

const ARK_BASE_URL = import.meta.env.VITE_ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'
const ARK_API_KEY = import.meta.env.VITE_ARK_API_KEY
const ARK_MODEL = import.meta.env.VITE_ARK_MODEL || 'doubao-seed-2-1-pro-260628'

const SYSTEM_PROMPT = `你是旅啵 Trippo 的旅行路线规划助手。你的任务是根据用户提供的心愿单景点和行程天数，生成可编辑的每日路线草稿。

请严格遵守：
1. 只返回合法 JSON，不要返回 Markdown，不要使用代码块，不要输出任何解释文字，不要输出思考过程。
2. JSON 顶层结构必须为：{"days":[...]}。
3. days 是数组，每一项代表一天，必须包含字段：dayIndex（数字，从 1 开始）、title（字符串，当天标题）、spots（数组）。
4. spots 数组中每个景点必须包含字段：spotId（字符串，用户提供的景点ID）、name（字符串，景点名称）、estimatedDuration（字符串，预估时长，如"2小时"、"半天"）、order（数字，当天顺序，从 1 开始）。
5. 只能使用用户提供的 spotId 和 name，不要编造新景点。
6. 不要求安排所有景点，但应优先均衡分配到每天。
7. 每天景点数量尽量合理，避免单日过满，建议每天 2-5 个。
8. 同类景点尽量靠近，美食类分散到午晚餐时段。
9. 务必确保所有 spots 中的 order 字段从 1 开始连续编号。

返回示例：
{"days":[{"dayIndex":1,"title":"Day 1 轻松抵达与城市初印象","spots":[{"spotId":"spot_1","name":"西湖","estimatedDuration":"2小时","order":1}]}]}`

function buildUserPrompt(trip: Trip, spots: Spot[], totalDays: number): string {
  const spotLines = spots
    .map((s) => {
      const parts = [`spotId: ${s.id}`, `name: ${s.name}`]
      if (s.category) parts.push(`category: ${s.category}`)
      if (s.address) parts.push(`address: ${s.address}`)
      return `- ${parts.join(', ')}`
    })
    .join('\n')

  return `请根据以下信息生成每日路线草稿：
行程名称：${trip.title}
目的地：${trip.destination}
行程天数：${totalDays} 天

心愿单：
${spotLines}

请按 system prompt 的 JSON 格式返回。`
}

function extractJSON(text: string): string {
  let cleaned = text.trim()
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim()
  }
  const jsonStart = cleaned.indexOf('{')
  const jsonEnd = cleaned.lastIndexOf('}')
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1)
  }
  return cleaned
}

export async function generateAIRoute(
  trip: Trip,
  spots: Spot[],
  totalDays: number,
): Promise<AIPlannerResponse> {
  if (!ARK_API_KEY) {
    throw new Error('缺少火山方舟 API Key，请在 .env 中配置 VITE_ARK_API_KEY')
  }

  if (spots.length === 0) {
    throw new Error('没有可安排的心愿景点')
  }

  const userPrompt = buildUserPrompt(trip, spots, totalDays)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 180000)

  try {
    console.log('[AI Planner] Calling ARK API (streaming)', { url: ARK_BASE_URL, model: ARK_MODEL })
    const response = await fetch(`${ARK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ARK_API_KEY}`,
      },
      body: JSON.stringify({
        model: ARK_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        stream: true,
      }),
      signal: controller.signal,
    })

    console.log('[AI Planner] ARK API response', { status: response.status })

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      console.error('[AI Planner] ARK API error', { status: response.status, text: errText })
      throw new Error(`AI 生成失败（${response.status}），请稍后再试`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法读取响应流')
    }

    let content = ''
    const decoder = new TextDecoder('utf-8')
    let lastProgressTime = Date.now()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      console.log('[AI Planner] Received chunk', { length: chunk.length })

      const lines = chunk.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6)
          if (dataStr === '[DONE]') {
            console.log('[AI Planner] Stream completed')
            reader.releaseLock()
            break
          }
          try {
            const data = JSON.parse(dataStr)
            const delta = data?.choices?.[0]?.delta?.content
            if (delta) {
              content += delta
              lastProgressTime = Date.now()
              console.log('[AI Planner] Accumulated content length:', content.length)
            }
          } catch (e) {
            console.warn('[AI Planner] Failed to parse stream data:', dataStr)
          }
        }
      }

      if (Date.now() - lastProgressTime > 60000) {
        throw new Error('AI 生成进度停滞，请稍后再试')
      }
    }

    console.log('[AI Planner] Final content:', content)

    if (!content) {
      throw new Error('AI 返回内容为空，请重新生成')
    }

    const jsonStr = extractJSON(content)
    console.log('[AI Planner] Extracted JSON:', jsonStr)
    let result: AIPlannerResponse

    try {
      result = JSON.parse(jsonStr)
    } catch (e) {
      console.error('[AI Planner] JSON parse error:', e)
      throw new Error('AI 返回格式异常，请重新生成')
    }

    console.log('[AI Planner] Parsed result:', JSON.stringify(result))

    if (!result.days || !Array.isArray(result.days) || result.days.length === 0) {
      throw new Error('这次没有生成可用路线，请换一批心愿试试')
    }

    console.log('[AI Planner] Days count:', result.days.length)

    const validSpotIds = new Set(spots.map((s) => s.id))
    result.days = result.days
      .filter((d) => d && (typeof d.dayIndex === 'number' || typeof d.dayNumber === 'number'))
      .map((d) => {
        const dayIdx = typeof d.dayIndex === 'number' ? d.dayIndex : (d as any).dayNumber
        const rawSpots = Array.isArray(d.spots) ? d.spots : []
        const validSpots = rawSpots
          .filter((s: any) => s && s.spotId && validSpotIds.has(s.spotId))
          .map((s: any, idx: number) => ({
            spotId: s.spotId,
            name: s.name || '',
            estimatedDuration: s.estimatedDuration || s.recommendedVisitTime || '约1小时',
            order: typeof s.order === 'number' ? s.order : idx + 1,
          }))
          .sort((a: any, b: any) => a.order - b.order)
        return {
          dayIndex: dayIdx,
          title: d.title || d.description || `第${dayIdx}天`,
          spots: validSpots,
        }
      })
      .filter((d) => d.spots.length > 0)
      .sort((a, b) => a.dayIndex - b.dayIndex)

    if (result.days.length === 0) {
      throw new Error('这次没有生成可用路线，请换一批心愿试试')
    }

    return result
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('AI 生成超时，请稍后再试')
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}

export function isArkConfigured(): boolean {
  const hasKey = !!ARK_API_KEY && ARK_API_KEY !== 'YOUR_ARK_API_KEY'
  if (!hasKey) {
    console.warn('[AI Planner] ARK API Key not configured', {
      ARK_API_KEY: ARK_API_KEY ? 'present' : 'missing',
      ARK_BASE_URL,
      ARK_MODEL,
    })
  }
  return hasKey
}
