import { create } from 'zustand'
import type { Journal, Trip, CheckIn, Spot } from '../types'
import { getStorageItem, setStorageItem, generateId } from '../utils/storage'
import { mockJournals } from '../data/mockJournals'

interface JournalState {
  journals: Journal[]
  loaded: boolean
  loadJournals: () => void
  getJournalsByTrip: (tripId: string) => Journal[]
  getJournalById: (id: string) => Journal | undefined
  addJournal: (data: Omit<Journal, 'id' | 'createdAt' | 'updatedAt'>) => Journal
  updateJournal: (id: string, updates: Partial<Journal>) => void
  deleteJournal: (id: string) => void
  generateDraft: (trip: Trip, checkIns: CheckIn[], spots: Spot[]) => Journal
}

const STORAGE_KEY = 'journals'

function generateDraftContent(trip: Trip, checkIns: CheckIn[], spots: Spot[]): string {
  const sortedCheckIns = [...checkIns].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const days: Record<string, { checkIn: CheckIn; spot?: Spot }[]> = {}
  for (const c of sortedCheckIns) {
    if (!days[c.date]) days[c.date] = []
    days[c.date].push({
      checkIn: c,
      spot: spots.find((s) => s.id === c.spotId),
    })
  }

  let content = `这次${trip.destination}之行，记录下了很多美好的瞬间。\n\n`

  const dateKeys = Object.keys(days).sort()
  for (let i = 0; i < dateKeys.length; i++) {
    const date = dateKeys[i]
    const dayItems = days[date]
    const dateObj = new Date(date)
    const dateStr = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`

    content += `第${i + 1}天 · ${dateStr}\n`
    for (const item of dayItems) {
      const spotName = item.spot?.name || '打卡点'
      content += `📍 ${spotName}`
      if (item.checkIn.cost && item.checkIn.cost > 0) {
        content += `（花费 ¥${item.checkIn.cost}）`
      }
      content += '\n'
      if (item.checkIn.notes) {
        content += `${item.checkIn.notes}\n`
      }
      content += '\n'
    }
  }

  content += `${trip.destination}是一座很有魅力的城市，期待下次再来。`

  return content
}

export const useJournalStore = create<JournalState>((set, get) => ({
  journals: [],
  loaded: false,

  loadJournals: () => {
    const stored = getStorageItem<Journal[]>(STORAGE_KEY, [])
    if (stored.length > 0) {
      set({ journals: stored, loaded: true })
    } else {
      set({ journals: mockJournals, loaded: true })
      setStorageItem(STORAGE_KEY, mockJournals)
    }
  },

  getJournalsByTrip: (tripId) => {
    return get()
      .journals.filter((j) => j.tripId === tripId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  getJournalById: (id) => {
    return get().journals.find((j) => j.id === id)
  },

  addJournal: (data) => {
    const now = new Date().toISOString()
    const newJournal: Journal = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    const journals = [newJournal, ...get().journals]
    set({ journals })
    setStorageItem(STORAGE_KEY, journals)
    return newJournal
  },

  updateJournal: (id, updates) => {
    const now = new Date().toISOString()
    const journals = get().journals.map((j) =>
      j.id === id ? { ...j, ...updates, updatedAt: now } : j
    )
    set({ journals })
    setStorageItem(STORAGE_KEY, journals)
  },

  deleteJournal: (id) => {
    const journals = get().journals.filter((j) => j.id !== id)
    set({ journals })
    setStorageItem(STORAGE_KEY, journals)
  },

  generateDraft: (trip, checkIns, spots) => {
    const content = generateDraftContent(trip, checkIns, spots)
    return {
      id: '',
      tripId: trip.id,
      title: `${trip.title}·旅行手账`,
      content,
      coverImage: '',
      createdAt: '',
      updatedAt: '',
    }
  },
}))
