import type { CheckIn } from '../types'

export const mockCheckIns: CheckIn[] = [
  {
    id: 'checkin-1',
    tripId: 'trip-demo-2',
    spotId: 'spot-8',
    date: '2026-06-15',
    photos: [],
    notes: '西湖的风景真的很美，傍晚时分沿着湖边散步特别舒服。',
    cost: 0,
    category: 'sightseeing',
    createdAt: '2026-06-15T10:30:00Z',
  },
  {
    id: 'checkin-2',
    tripId: 'trip-demo-2',
    spotId: 'spot-9',
    date: '2026-06-16',
    photos: [],
    notes: '灵隐寺很安静，香火旺盛，感觉心灵得到了净化。',
    cost: 45,
    category: 'sightseeing',
    createdAt: '2026-06-16T09:00:00Z',
  },
]
