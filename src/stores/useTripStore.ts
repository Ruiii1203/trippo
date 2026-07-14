import { create } from 'zustand'
import type { Trip, AIRouteDraftMeta } from '../types'
import { getStorageItem, setStorageItem, generateId } from '../utils/storage'
import { mockTrips } from '../data/mockTrips'

interface TripState {
  trips: Trip[]
  aiRouteDrafts: AIRouteDraftMeta[]
  loaded: boolean
  loadTrips: () => void
  loadAIRouteDrafts: () => void
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Trip
  updateTrip: (id: string, updates: Partial<Trip>) => void
  deleteTrip: (id: string) => void
  getTripById: (id: string) => Trip | undefined
  checkAndUpdateStatus: () => void
  getAIRouteDraft: (tripId: string) => AIRouteDraftMeta | undefined
  setAIRouteDraft: (tripId: string, status: 'draft' | 'confirmed') => void
  clearAIRouteDraft: (tripId: string) => void
}

const STORAGE_KEY = 'trips'
const DRAFT_STORAGE_KEY = 'ai_route_drafts'

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  aiRouteDrafts: [],
  loaded: false,

  loadTrips: () => {
    const stored = getStorageItem<Trip[]>(STORAGE_KEY, [])
    const storedDrafts = getStorageItem<AIRouteDraftMeta[]>(DRAFT_STORAGE_KEY, [])
    if (stored.length > 0) {
      set({ trips: stored, aiRouteDrafts: storedDrafts, loaded: true })
    } else {
      set({ trips: mockTrips, aiRouteDrafts: storedDrafts, loaded: true })
      setStorageItem(STORAGE_KEY, mockTrips)
    }
  },

  loadAIRouteDrafts: () => {
    const storedDrafts = getStorageItem<AIRouteDraftMeta[]>(DRAFT_STORAGE_KEY, [])
    set({ aiRouteDrafts: storedDrafts })
  },

  addTrip: (tripData) => {
    const now = new Date().toISOString()
    const newTrip: Trip = {
      ...tripData,
      id: generateId(),
      status: 'upcoming',
      createdAt: now,
      updatedAt: now,
    }
    const trips = [newTrip, ...get().trips]
    set({ trips })
    setStorageItem(STORAGE_KEY, trips)
    return newTrip
  },

  updateTrip: (id, updates) => {
    const trips = get().trips.map((trip) =>
      trip.id === id
        ? { ...trip, ...updates, updatedAt: new Date().toISOString() }
        : trip
    )
    set({ trips })
    setStorageItem(STORAGE_KEY, trips)
  },

  deleteTrip: (id) => {
    const trips = get().trips.filter((trip) => trip.id !== id)
    set({ trips })
    setStorageItem(STORAGE_KEY, trips)
  },

  getTripById: (id) => {
    return get().trips.find((trip) => trip.id === id)
  },

  checkAndUpdateStatus: () => {
    const now = new Date().toISOString()
    let hasChanges = false
    
    const updatedTrips = get().trips.map((trip) => {
      let newStatus = trip.status
      
      if (trip.status === 'upcoming' && now >= trip.startDate && now <= trip.endDate) {
        newStatus = 'ongoing'
        hasChanges = true
      } else if (trip.status === 'upcoming' && now > trip.endDate) {
        newStatus = 'completed'
        hasChanges = true
      } else if (trip.status === 'ongoing' && now > trip.endDate) {
        newStatus = 'completed'
        hasChanges = true
      }
      
      if (newStatus !== trip.status) {
        return { ...trip, status: newStatus, updatedAt: now }
      }
      return trip
    })
    
    if (hasChanges) {
      set({ trips: updatedTrips })
      setStorageItem(STORAGE_KEY, updatedTrips)
    }
  },

  getAIRouteDraft: (tripId) => {
    return get().aiRouteDrafts.find((d) => d.tripId === tripId)
  },

  setAIRouteDraft: (tripId, status) => {
    const state = get()
    const existing = state.aiRouteDrafts.find((d) => d.tripId === tripId)
    let newDrafts: AIRouteDraftMeta[]
    if (existing) {
      newDrafts = state.aiRouteDrafts.map((d) =>
        d.tripId === tripId ? { ...d, status, generatedAt: status === 'draft' ? new Date().toISOString() : d.generatedAt } : d,
      )
    } else {
      newDrafts = [...state.aiRouteDrafts, { tripId, generatedAt: new Date().toISOString(), status }]
    }
    set({ aiRouteDrafts: newDrafts })
    setStorageItem(DRAFT_STORAGE_KEY, newDrafts)
  },

  clearAIRouteDraft: (tripId) => {
    const newDrafts = get().aiRouteDrafts.filter((d) => d.tripId !== tripId)
    set({ aiRouteDrafts: newDrafts })
    setStorageItem(DRAFT_STORAGE_KEY, newDrafts)
  },
}))
