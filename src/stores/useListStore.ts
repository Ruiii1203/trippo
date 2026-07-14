import { create } from 'zustand'
import type { List, ListItem } from '../types'
import { getStorageItem, setStorageItem, generateId } from '../utils/storage'
import { mockLists } from '../data/mockLists'

interface ListState {
  lists: List[]
  loaded: boolean
  loadLists: () => void
  addList: (name: string, type: List['type']) => List
  updateList: (id: string, updates: Partial<List>) => void
  deleteList: (id: string) => void
  getListById: (id: string) => List | undefined
  addListItem: (listId: string, item: Omit<ListItem, 'id' | 'status'>) => ListItem
  updateListItem: (listId: string, itemId: string, updates: Partial<ListItem>) => void
  deleteListItem: (listId: string, itemId: string) => void
  toggleItemStatus: (listId: string, itemId: string, status: ListItem['status']) => void
  getListProgress: (listId: string) => { total: number; completed: number; percentage: number }
}

const STORAGE_KEY = 'lists'

export const useListStore = create<ListState>((set, get) => ({
  lists: [],
  loaded: false,

  loadLists: () => {
    const stored = getStorageItem<List[]>(STORAGE_KEY, [])
    if (stored.length > 0) {
      set({ lists: stored, loaded: true })
    } else {
      set({ lists: mockLists, loaded: true })
      setStorageItem(STORAGE_KEY, mockLists)
    }
  },

  addList: (name, type) => {
    const now = new Date().toISOString()
    const newList: List = {
      id: generateId(),
      name,
      type,
      items: [],
      createdAt: now,
      updatedAt: now,
    }
    const lists = [...get().lists, newList]
    set({ lists })
    setStorageItem(STORAGE_KEY, lists)
    return newList
  },

  updateList: (id, updates) => {
    const lists = get().lists.map((list) =>
      list.id === id
        ? { ...list, ...updates, updatedAt: new Date().toISOString() }
        : list
    )
    set({ lists })
    setStorageItem(STORAGE_KEY, lists)
  },

  deleteList: (id) => {
    const lists = get().lists.filter((list) => list.id !== id)
    set({ lists })
    setStorageItem(STORAGE_KEY, lists)
  },

  getListById: (id) => {
    return get().lists.find((list) => list.id === id)
  },

  addListItem: (listId, itemData) => {
    const now = new Date().toISOString()
    const newItem: ListItem = {
      ...itemData,
      id: generateId(),
      status: 'pending',
    }
    const lists = get().lists.map((list) =>
      list.id === listId
        ? { ...list, items: [...list.items, newItem], updatedAt: now }
        : list
    )
    set({ lists })
    setStorageItem(STORAGE_KEY, lists)
    return newItem
  },

  updateListItem: (listId, itemId, updates) => {
    const lists = get().lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
            updatedAt: new Date().toISOString(),
          }
        : list
    )
    set({ lists })
    setStorageItem(STORAGE_KEY, lists)
  },

  deleteListItem: (listId, itemId) => {
    const lists = get().lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.filter((item) => item.id !== itemId),
            updatedAt: new Date().toISOString(),
          }
        : list
    )
    set({ lists })
    setStorageItem(STORAGE_KEY, lists)
  },

  toggleItemStatus: (listId, itemId, status) => {
    const now = new Date().toISOString()
    const lists = get().lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    status,
                    completedAt: status === 'completed' ? now : undefined,
                  }
                : item
            ),
            updatedAt: now,
          }
        : list
    )
    set({ lists })
    setStorageItem(STORAGE_KEY, lists)
  },

  getListProgress: (listId) => {
    const list = get().lists.find((l) => l.id === listId)
    if (!list) return { total: 0, completed: 0, percentage: 0 }
    const total = list.items.length
    const completed = list.items.filter((item) => item.status === 'completed').length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percentage }
  },
}))