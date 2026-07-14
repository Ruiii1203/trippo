import type { List } from '../types'

export const mockLists: List[] = [
  {
    id: 'list-bucket',
    name: '人生必去清单',
    type: 'bucket',
    icon: '🌍',
    description: '这一生一定要去一次的地方',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-07-01T12:00:00Z',
    items: [
      {
        id: 'item-1',
        name: '圣托里尼看日落',
        destination: '希腊',
        category: '景点',
        status: 'pending',
      },
      {
        id: 'item-2',
        name: '冰岛极光之旅',
        destination: '冰岛',
        category: '景点',
        status: 'pending',
      },
      {
        id: 'item-3',
        name: '巴厘岛度假',
        destination: '印度尼西亚',
        category: '度假',
        status: 'completed',
        completedAt: '2025-12-15T00:00:00Z',
        note: '太美了，一定要再来一次',
      },
      {
        id: 'item-4',
        name: '纽约时代广场跨年',
        destination: '美国',
        category: '体验',
        status: 'pending',
      },
      {
        id: 'item-5',
        name: '马尔代夫潜水',
        destination: '马尔代夫',
        category: '体验',
        status: 'planned',
      },
    ],
  },
  {
    id: 'list-couple',
    name: '情侣必做清单',
    type: 'couple',
    icon: '💑',
    description: '和心爱的人一起完成的旅行',
    createdAt: '2026-06-10T00:00:00Z',
    updatedAt: '2026-07-05T18:00:00Z',
    items: [
      {
        id: 'item-6',
        name: '东京迪士尼约会',
        destination: '日本',
        category: '乐园',
        status: 'completed',
        completedAt: '2026-06-20T00:00:00Z',
      },
      {
        id: 'item-7',
        name: '巴黎铁塔下求婚',
        destination: '法国',
        category: '体验',
        status: 'pending',
      },
      {
        id: 'item-8',
        name: '三亚海边度假',
        destination: '中国',
        category: '度假',
        status: 'planned',
      },
      {
        id: 'item-9',
        name: '云南大理古城漫步',
        destination: '中国',
        category: '景点',
        status: 'pending',
      },
    ],
  },
  {
    id: 'list-friends',
    name: '闺蜜旅行清单',
    type: 'friends',
    icon: '👭',
    description: '和姐妹们一起疯玩的地方',
    createdAt: '2026-06-15T00:00:00Z',
    updatedAt: '2026-07-03T10:00:00Z',
    items: [
      {
        id: 'item-10',
        name: '泰国芭提雅',
        destination: '泰国',
        category: '度假',
        status: 'completed',
        completedAt: '2026-05-01T00:00:00Z',
      },
      {
        id: 'item-11',
        name: '成都火锅之旅',
        destination: '中国',
        category: '美食',
        status: 'pending',
      },
      {
        id: 'item-12',
        name: '厦门鼓浪屿',
        destination: '中国',
        category: '景点',
        status: 'pending',
      },
    ],
  },
  {
    id: 'list-family',
    name: '亲子旅行清单',
    type: 'family',
    icon: '👨‍👩‍👧',
    description: '带孩子一起探索世界',
    createdAt: '2026-06-20T00:00:00Z',
    updatedAt: '2026-07-01T08:00:00Z',
    items: [
      {
        id: 'item-13',
        name: '上海迪士尼',
        destination: '中国',
        category: '乐园',
        status: 'completed',
        completedAt: '2026-01-15T00:00:00Z',
      },
      {
        id: 'item-14',
        name: '珠海长隆海洋王国',
        destination: '中国',
        category: '乐园',
        status: 'pending',
      },
      {
        id: 'item-15',
        name: '日本环球影城',
        destination: '日本',
        category: '乐园',
        status: 'planned',
      },
    ],
  },
]

export const listTypeConfig = {
  bucket: { name: '人生清单', icon: '🌍', color: '#FF7A45' },
  couple: { name: '情侣清单', icon: '💑', color: '#FF6B9D' },
  friends: { name: '闺蜜清单', icon: '👭', color: '#C084FC' },
  family: { name: '亲子清单', icon: '👨‍👩‍👧', color: '#4ADE80' },
  wish: { name: '心愿清单', icon: '⭐', color: '#F59E0B' },
}

export const checkInCategoryConfig = {
  sightseeing: { name: '景点', icon: '🏛️', color: '#FF7A45' },
  food: { name: '美食', icon: '🍜', color: '#F59E0B' },
  shopping: { name: '购物', icon: '🛍️', color: '#C084FC' },
  transport: { name: '交通', icon: '🚗', color: '#3B82F6' },
  hotel: { name: '住宿', icon: '🏨', color: '#10B981' },
  other: { name: '其他', icon: '📝', color: '#6B7280' },
}

export const journalTemplates = {
  classic: { name: '经典', description: '简约优雅的手账风格' },
  travel: { name: '旅行', description: '充满旅途气息的设计' },
  cute: { name: '可爱', description: '活泼可爱的视觉风格' },
  minimal: { name: '极简', description: '纯粹的文字记录' },
}

export const themeConfig = {
  minimal: { name: '极简', description: '纯净白色背景' },
  warm: { name: '暖橙', description: '温暖的橙色主题' },
  morandi: { name: '莫兰迪', description: '柔和的莫兰迪色系' },
}