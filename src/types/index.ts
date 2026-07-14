export interface Trip {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  coverImage?: string
  status: 'upcoming' | 'ongoing' | 'completed'
  createdAt: string
  updatedAt: string
  description?: string
}

export interface Spot {
  id: string
  tripId: string
  name: string
  address?: string
  lat?: number
  lng?: number
  category?: string
  coverImage?: string
  rating?: number
  wishlisted: boolean
  addedAt?: string
  dayIndex?: number
  orderInDay?: number
}

export interface DayPlan {
  id: string
  tripId: string
  date: string
  dayIndex: number
  spotIds: string[]
}

export interface CheckIn {
  id: string
  tripId: string
  spotId: string
  date: string
  photos: string[]
  notes?: string
  cost?: number
  category?: CheckInCategory
  createdAt: string
}

export interface Journal {
  id: string
  tripId?: string
  title: string
  content: string
  coverImage?: string
  createdAt: string
  updatedAt: string
  template?: string
  status?: 'draft' | 'published'
}

export type ListType = 'wish' | 'bucket' | 'couple' | 'friends' | 'family'

export interface List {
  id: string
  name: string
  type: ListType
  icon?: string
  description?: string
  items: ListItem[]
  createdAt: string
  updatedAt: string
}

export interface ListItem {
  id: string
  name: string
  destination?: string
  category?: string
  status: 'pending' | 'planned' | 'completed'
  completedAt?: string
  note?: string
}

export type CheckInCategory = 'sightseeing' | 'food' | 'shopping' | 'transport' | 'hotel' | 'other'

export type ThemeType = 'minimal' | 'warm' | 'morandi'

export type AIRouteDraftStatus = 'draft' | 'confirmed'

export interface AIRouteDraftMeta {
  tripId: string
  generatedAt: string
  status: AIRouteDraftStatus
}
