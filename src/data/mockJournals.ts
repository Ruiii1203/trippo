import type { Journal } from '../types'

export const mockJournals: Journal[] = [
  {
    id: 'journal-draft-1',
    tripId: 'trip-demo-1',
    title: '东京之旅（草稿）',
    content: `东京五日游即将开始，先记录一下计划。

第一天：抵达成田机场，入住酒店，晚上去秋叶原逛一逛。

第二天：浅草寺、上野公园、东京塔。

第三天：迪士尼乐园。

第四天：银座购物、筑地市场、涩谷十字路口。

第五天：返程。`,
    coverImage: '',
    createdAt: '2026-07-08T14:00:00Z',
    updatedAt: '2026-07-08T14:00:00Z',
    template: 'travel',
    status: 'draft',
  },
  {
    id: 'journal-1',
    tripId: 'trip-demo-2',
    title: '杭州周末小记',
    content: `这次杭州之行虽然只有短短两天，但收获满满。

第一天去了西湖，傍晚时分沿着湖边散步，微风拂面，看着夕阳洒在湖面上，整个人都放松下来了。西湖的风景真的名不虚传，随便一拍都是画。

第二天去了灵隐寺，寺庙很安静，香火旺盛。走在林间小道上，听着钟声，感觉心灵都得到了净化。门票45块钱，很值得。

杭州是一座让人来了就不想走的城市，下次还要再来。`,
    coverImage: '',
    createdAt: '2026-06-17T10:00:00Z',
    updatedAt: '2026-06-17T10:00:00Z',
    template: 'classic',
    status: 'published',
  },
  {
    id: 'journal-2',
    tripId: 'trip-demo-1',
    title: '东京准备清单',
    content: `出发前准备：
- 护照、签证
- 日元现金
- 随身WiFi
- 转换插头
- 攻略打印版

期待这次旅行！`,
    coverImage: '',
    createdAt: '2026-07-05T09:00:00Z',
    updatedAt: '2026-07-05T09:00:00Z',
    template: 'minimal',
    status: 'published',
  },
]