import { create } from 'zustand'
import type { CheckIn } from '../types'
import { getStorageItem, setStorageItem, generateId } from '../utils/storage'
import { mockCheckIns } from '../data/mockCheckIns'

interface CheckInState {
  checkIns: CheckIn[]
  loaded: boolean
  loadCheckIns: () => void
  getCheckInsByTrip: (tripId: string) => CheckIn[]
  getCheckInsBySpot: (spotId: string) => CheckIn[]
  getCheckInBySpotAndDate: (spotId: string, date: string) => CheckIn | undefined
  addCheckIn: (data: Omit<CheckIn, 'id' | 'createdAt'>) => CheckIn
  updateCheckIn: (id: string, updates: Partial<CheckIn>) => void
  deleteCheckIn: (id: string) => void
}

const STORAGE_KEY = 'checkins'

export const useCheckInStore = create<CheckInState>((set, get) => ({
  checkIns: [],
  loaded: false,

  loadCheckIns: () => {
    const stored = getStorageItem<CheckIn[]>(STORAGE_KEY, [])
    if (stored.length > 0) {
      set({ checkIns: stored, loaded: true })
    } else {
      set({ checkIns: mockCheckIns, loaded: true })
      setStorageItem(STORAGE_KEY, mockCheckIns)
    }
  },

  getCheckInsByTrip: (tripId) => {
    return get()
      .checkIns.filter((c) => c.tripId === tripId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  getCheckInsBySpot: (spotId) => {
    return get()
      .checkIns.filter((c) => c.spotId === spotId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  getCheckInBySpotAndDate: (spotId, date) => {
    return get().checkIns.find((c) => c.spotId === spotId && c.date === date)
  },

  addCheckIn: (data) => {
    const newCheckIn: CheckIn = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    const checkIns = [newCheckIn, ...get().checkIns]
    set({ checkIns })
    setStorageItem(STORAGE_KEY, checkIns)
    return newCheckIn
  },

  updateCheckIn: (id, updates) => {
    const checkIns = get().checkIns.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    )
    set({ checkIns })
    setStorageItem(STORAGE_KEY, checkIns)
  },

  deleteCheckIn: (id) => {
    const checkIns = get().checkIns.filter((c) => c.id !== id)
    set({ checkIns })
    setStorageItem(STORAGE_KEY, checkIns)
  },
}))
