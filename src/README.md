# src 目录说明

Trippo V1.0 前端应用代码目录，基于 React 18 + Vite + TypeScript + Zustand。

## 技术栈

- **框架**：React 18
- **构建工具**：Vite 5
- **语言**：TypeScript 5
- **路由**：React Router v6
- **状态管理**：Zustand 4
- **本地持久化**：localStorage

## 目录结构

```text
src/
├── main.tsx              # 应用入口
├── App.tsx               # 路由配置与根组件
├── vite-env.d.ts         # Vite 类型声明
├── pages/                # 页面级组件（按业务模块分）
│   ├── trip/             # 行程模块页面
│   │   ├── TripListPage.tsx
│   │   ├── CreateTripPage.tsx
│   │   └── TripDetailPage.tsx
│   ├── spot/             # 景点模块页面
│   │   ├── SpotSearchPage.tsx
│   │   └── WishlistPage.tsx
│   ├── route/            # 路线模块页面
│   │   └── RoutePage.tsx
│   ├── checkin/          # 打卡模块页面
│   │   ├── CheckInEditPage.tsx
│   │   └── CheckInListPage.tsx
│   └── journal/          # 手账模块页面
│       ├── JournalListPage.tsx
│       └── JournalDetailPage.tsx
├── stores/               # Zustand 状态管理
│   ├── useTripStore.ts
│   ├── useSpotStore.ts
│   ├── useCheckInStore.ts
│   └── useJournalStore.ts
├── types/                # TypeScript 类型定义
│   └── index.ts
├── data/                 # 本地 mock 数据与种子数据
│   ├── mockTrips.ts
│   ├── mockSpots.ts
│   ├── mockCheckIns.ts
│   └── mockJournals.ts
├── utils/                # 通用工具函数
│   └── storage.ts
└── styles/               # 全局样式与主题变量
    └── global.css
```

## 模块拆分原则

- **按业务领域拆分**：每个核心对象（trip / spot / checkin / journal）对应独立的 pages、stores、types
- **页面层**：`pages/` 下按业务模块分子目录，只处理 UI 渲染和用户交互
- **状态层**：`stores/` 管理业务状态和数据操作，与页面分离
- **类型层**：`types/` 统一定义数据结构，避免循环依赖
- **工具层**：`utils/` 放纯函数工具，如存储、格式化等

## 当前进度

V1.0 五大模块全部完成，核心闭环已跑通：
- 行程模块（列表 / 创建 / 详情）
- 景点模块（搜索 / 心愿清单）
- 每日路线模块（按天规划 / 排序）
- 景点打卡模块（编辑 / 记录列表）
- 手账模块（草稿生成 / 查看 / 编辑）

下一步：V1.0 整体体验走查和细节打磨。
