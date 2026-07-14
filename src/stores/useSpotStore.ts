import { create } from 'zustand'
import type { Spot } from '../types'
import { getStorageItem, setStorageItem, generateId } from '../utils/storage'
import { mockSpots, searchableSpots } from '../data/mockSpots'

interface SpotState {
  spots: Spot[]
  loaded: boolean
  loadSpots: () => void
  getSpotsByTrip: (tripId: string) => Spot[]
  getWishlistedSpots: (tripId: string) => Spot[]
  getSpotsByDay: (tripId: string, dayIndex: number) => Spot[]
  getUnassignedSpots: (tripId: string) => Spot[]
  searchSpots: (query: string, tripId: string) => Spot[]
  toggleWishlist: (spotId: string) => void
  addSpotToTrip: (spotData: Omit<Spot, 'id' | 'tripId' | 'wishlisted' | 'addedAt'>, tripId: string, wishlisted?: boolean) => Spot
  addOrUpdateSpotToTrip: (spotData: Omit<Spot, 'id' | 'tripId' | 'wishlisted' | 'addedAt'>, tripId: string, wishlisted?: boolean) => Spot
  findDuplicateSpot: (name: string, address: string | undefined, tripId: string) => Spot | undefined
  removeSpotFromTrip: (spotId: string) => void
  moveSpotToTrip: (spotId: string, newTripId: string) => void
  assignSpotToDay: (spotId: string, dayIndex: number, orderInDay: number) => void
  addSpotToDay: (spotId: string, dayIndex: number) => void
  removeSpotFromDay: (spotId: string) => void
  moveSpotUp: (spotId: string, tripId: string, dayIndex: number) => void
  moveSpotDown: (spotId: string, tripId: string, dayIndex: number) => void
  moveSpotToDay: (spotId: string, tripId: string, fromDay: number, toDay: number) => void
  updateSpotCategory: (spotId: string, category: string) => void
  applyAIRoute: (tripId: string, days: Array<{ dayIndex: number; spots: Array<{ spotId: string; order: number }> }>) => void
}

const STORAGE_KEY = 'spots'

export const useSpotStore = create<SpotState>((set, get) => ({
  spots: [],
  loaded: false,

  loadSpots: () => {
    const stored = getStorageItem<Spot[]>(STORAGE_KEY, [])
    if (stored.length > 0) {
      set({ spots: stored, loaded: true })
    } else {
      set({ spots: mockSpots, loaded: true })
      setStorageItem(STORAGE_KEY, mockSpots)
    }
  },

  getSpotsByTrip: (tripId) => {
    return get().spots.filter((s) => s.tripId === tripId)
  },

  getWishlistedSpots: (tripId) => {
    return get().spots.filter((s) => s.tripId === tripId && s.wishlisted)
  },

  getSpotsByDay: (tripId, dayIndex) => {
    return get()
      .spots.filter((s) => s.tripId === tripId && s.dayIndex === dayIndex)
      .sort((a, b) => (a.orderInDay ?? 0) - (b.orderInDay ?? 0))
  },

  getUnassignedSpots: (tripId) => {
    return get().spots.filter((s) => s.tripId === tripId && s.dayIndex === undefined)
  },

  searchSpots: (query, tripId) => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const tripSpots = get().spots.filter((s) => s.tripId === tripId)
    const existingNames = new Set(tripSpots.map((s) => s.name.toLowerCase()))

    const results: Spot[] = []

    for (const spot of tripSpots) {
      if (spot.name.toLowerCase().includes(q)) {
        results.push(spot)
      }
    }

    for (const candidate of searchableSpots) {
      if (candidate.name.toLowerCase().includes(q) && !existingNames.has(candidate.name.toLowerCase())) {
        results.push({
          ...candidate,
          id: `search-${candidate.name}`,
          tripId,
          wishlisted: false,
          addedAt: undefined,
        })
      }
    }

    return results.slice(0, 20)
  },

  toggleWishlist: (spotId) => {
    const spots = get().spots.map((spot) => {
      if (spot.id === spotId) {
        return {
          ...spot,
          wishlisted: !spot.wishlisted,
          addedAt: !spot.wishlisted ? new Date().toISOString() : spot.addedAt,
        }
      }
      return spot
    })
    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
  },

  addSpotToTrip: (spotData, tripId, wishlisted = true) => {
    const newSpot: Spot = {
      ...spotData,
      id: generateId(),
      tripId,
      wishlisted,
      addedAt: new Date().toISOString(),
    }
    const spots = [newSpot, ...get().spots]
    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
    return newSpot
  },

  findDuplicateSpot: (name, address, tripId) => {
    const normalizedName = name.trim().toLowerCase()
    const normalizedAddr = (address || '').trim().toLowerCase()
    return get().spots.find((s) => {
      if (s.tripId !== tripId) return false
      if (s.name.trim().toLowerCase() !== normalizedName) return false
      const sAddr = (s.address || '').trim().toLowerCase()
      if (normalizedAddr && sAddr) {
        return sAddr === normalizedAddr
      }
      return true
    })
  },

  addOrUpdateSpotToTrip: (spotData, tripId, wishlisted = true) => {
    const existing = get().findDuplicateSpot(spotData.name, spotData.address, tripId)

    if (existing) {
      const updatedSpot: Spot = {
        ...existing,
        name: spotData.name,
        address: spotData.address || existing.address,
        lat: spotData.lat ?? existing.lat,
        lng: spotData.lng ?? existing.lng,
        category: spotData.category || existing.category,
        coverImage: spotData.coverImage || existing.coverImage,
        rating: spotData.rating ?? existing.rating,
        wishlisted: wishlisted || existing.wishlisted,
        addedAt: existing.addedAt || new Date().toISOString(),
      }
      const spots = get().spots.map((s) => (s.id === existing.id ? updatedSpot : s))
      set({ spots })
      setStorageItem(STORAGE_KEY, spots)
      return updatedSpot
    }

    return get().addSpotToTrip(spotData, tripId, wishlisted)
  },

  removeSpotFromTrip: (spotId) => {
    const spots = get().spots.filter((s) => s.id !== spotId)
    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
  },

  moveSpotToTrip: (spotId, newTripId) => {
    const spots = get().spots.map((spot) => {
      if (spot.id === spotId) {
        return {
          ...spot,
          tripId: newTripId,
          dayIndex: undefined,
          orderInDay: undefined,
          addedAt: new Date().toISOString(),
        }
      }
      return spot
    })
    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
  },

  assignSpotToDay: (spotId, dayIndex, orderInDay) => {
    const spots = get().spots.map((spot) => {
      if (spot.id === spotId) {
        return { ...spot, dayIndex, orderInDay }
      }
      return spot
    })
    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
  },

  addSpotToDay: (spotId, dayIndex) => {
    const state = get()
    const daySpots = state.spots.filter((s) => s.dayIndex === dayIndex)
    const nextOrder = daySpots.length
    const spots = state.spots.map((spot) => {
      if (spot.id === spotId) {
        return { ...spot, dayIndex, orderInDay: nextOrder }
      }
      return spot
    })
    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
  },

  removeSpotFromDay: (spotId) => {
    const state = get()
    const spot = state.spots.find((s) => s.id === spotId)
    if (!spot || spot.dayIndex === undefined) return

    const { dayIndex } = spot
    let spots = state.spots.map((s) => {
      if (s.id === spotId) {
        return { ...s, dayIndex: undefined, orderInDay: undefined }
      }
      return s
    })

    spots = spots.map((s) => {
      if (s.tripId === spot.tripId && s.dayIndex === dayIndex && (s.orderInDay ?? 0) > (spot.orderInDay ?? 0)) {
        return { ...s, orderInDay: (s.orderInDay ?? 0) - 1 }
      }
      return s
    })

    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
  },

  moveSpotUp: (spotId, tripId, dayIndex) => {
    const state = get()
    const spot = state.spots.find((s) => s.id === spotId)
    if (!spot || spot.orderInDay === undefined || spot.orderInDay <= 0) return

    const targetOrder = spot.orderInDay - 1
    let spots = state.spots.map((s) => {
      if (s.tripId === tripId && s.dayIndex === dayIndex && s.orderInDay === targetOrder) {
        return { ...s, orderInDay: spot.orderInDay }
      }
      if (s.id === spotId) {
        return { ...s, orderInDay: targetOrder }
      }
      return s
    })

    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
  },

  moveSpotDown: (spotId, tripId, dayIndex) => {
    const state = get()
    const spot = state.spots.find((s) => s.id === spotId)
    if (!spot || spot.orderInDay === undefined) return

    const daySpots = state.spots.filter((s) => s.tripId === tripId && s.dayIndex === dayIndex)
    if (spot.orderInDay >= daySpots.length - 1) return

    const targetOrder = spot.orderInDay + 1
    let spots = state.spots.map((s) => {
      if (s.tripId === tripId && s.dayIndex === dayIndex && s.orderInDay === targetOrder) {
        return { ...s, orderInDay: spot.orderInDay }
      }
      if (s.id === spotId) {
        return { ...s, orderInDay: targetOrder }
      }
      return s
    })

    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
  },

  moveSpotToDay: (spotId, tripId, fromDay, toDay) => {
    const state = get()
    const spot = state.spots.find((s) => s.id === spotId)
    if (!spot || spot.dayIndex === undefined || spot.orderInDay === undefined) return
    if (fromDay === toDay) return

    let spots = state.spots.map((s) => {
      if (s.tripId === tripId && s.dayIndex === fromDay && (s.orderInDay ?? 0) > (spot.orderInDay ?? 0)) {
        return { ...s, orderInDay: (s.orderInDay ?? 0) - 1 }
      }
      return s
    })

    const toDaySpots = spots.filter((s) => s.tripId === tripId && s.dayIndex === toDay)
    const newOrder = toDaySpots.length

    spots = spots.map((s) => {
      if (s.id === spotId) {
        return { ...s, dayIndex: toDay, orderInDay: newOrder }
      }
      return s
    })

    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
  },

  updateSpotCategory: (spotId, category) => {
    const spots = get().spots.map((spot) => {
      if (spot.id === spotId) {
        return { ...spot, category }
      }
      return spot
    })
    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
  },

  applyAIRoute: (tripId, days) => {
    const state = get()
    const spotUpdates = new Map<string, { dayIndex: number; orderInDay: number }>()

    days.forEach((day) => {
      day.spots.forEach((s) => {
        spotUpdates.set(s.spotId, { dayIndex: day.dayIndex - 1, orderInDay: s.order - 1 })
      })
    })

    const spots = state.spots.map((spot) => {
      if (spot.tripId !== tripId) return spot
      const update = spotUpdates.get(spot.id)
      if (update) {
        return { ...spot, dayIndex: update.dayIndex, orderInDay: update.orderInDay }
      }
      return spot
    })

    set({ spots })
    setStorageItem(STORAGE_KEY, spots)
  },
}))
