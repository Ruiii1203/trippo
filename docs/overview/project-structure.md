# Trippo 项目结构说明

这份文档只描述当前工作区里**实际存在**的目录和文件，并说明它们分别承担什么职责、适合放什么内容、后续应该怎么维护。

它不负责定义产品需求，也不替代 PRD。它的作用只有两个：

1. 帮人快速看懂 `Trippo/` 现在是什么结构
2. 在目录变化时提供一个统一、稳定的更新入口

## 当前实际结构

```text
Trippo/
├── README.md
├── .gitignore
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── index.html
├── docs/
│   ├── coordination/
│   │   ├── ai-collaboration.md
│   │   ├── mode-prompts.md
│   │   ├── new-session-handoff.md
│   │   ├── project-maintenance.md
│   │   ├── status.md
│   │   └── v1-task-intake.md
│   ├── design/
│   │   ├── README.md
│   │   ├── figma-links.md
│   │   ├── product-structure.md
│   │   ├── ui-notes.md
│   │   └── user-flow.md
│   ├── overview/
│   │   ├── project-context.md
│   │   └── project-structure.md
│   ├── planning/
│   │   └── trippo-version-plan.md
│   └── prd/
│       └── trippo-prd-unified.md
├── demos/
│   ├── trippo-product-demo/
│   │   ├── _shared/
│   │   │   ├── fonts/
│   │   │   └── js/
│   │   ├── assets/
│   │   └── trippo-product-demo.html
│   └── trippo-product-showcase/
│       ├── _shared/
│       │   └── fonts/
│       ├── assets/
│       └── trippo-product-showcase.html
├── design-assets/
│   └── README.md
├── src/
│   ├── README.md
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   ├── pages/
│   │   ├── trip/
│   │   │   ├── TripListPage.tsx
│   │   │   ├── CreateTripPage.tsx
│   │   │   └── TripDetailPage.tsx
│   │   ├── spot/
│   │   │   ├── SpotSearchPage.tsx
│   │   │   └── WishlistPage.tsx
│   │   ├── route/
│   │   │   └── RoutePage.tsx
│   │   ├── checkin/
│   │   │   ├── CheckInEditPage.tsx
│   │   │   └── CheckInListPage.tsx
│   │   ├── journal/
│   │   │   ├── JournalListPage.tsx
│   │   │   └── JournalDetailPage.tsx
│   │   └── list/
│   │       ├── ListListPage.tsx
│   │       └── ListDetailPage.tsx
│   ├── stores/
│   │   ├── useTripStore.ts
│   │   ├── useSpotStore.ts
│   │   ├── useCheckInStore.ts
│   │   ├── useJournalStore.ts
│   │   └── useListStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── data/
│   │   ├── mockTrips.ts
│   │   ├── mockSpots.ts
│   │   ├── mockCheckIns.ts
│   │   ├── mockJournals.ts
│   │   └── mockLists.ts
│   ├── utils/
│   │   └── storage.ts
│   └── styles/
│       └── global.css
├── tests/
│   ├── README.md
│   ├── acceptance-v1.md
│   └── acceptance-v2.md
└── archive/
    ├── travel-feature-expansion-plan-v0.md
    └── travel-product-prd-v0.md
```

## 顶层目录

| 路径 | 作用 | 维护方式 |
|---|---|---|
| `README.md` | 项目总入口，告诉人先读什么、去哪里找产品口径、当前目录怎么分工。 | 当入口文档、协作方式、核心阅读顺序变化时更新。 |
| `.gitignore` | 忽略系统文件、依赖、构建产物和临时文件。 | 技术栈确定后按实际工程补充规则。 |
| `docs/` | 项目的正式文档目录。产品、规划、设计桥接、协作口径都放这里。 | 所有长期有效的信息优先沉淀到这里，不只留在聊天记录里。 |
| `demos/` | 可直接打开的 HTML 展示页。 | 当展示叙事、视觉表达或演示内容变化时更新。 |
| `design-assets/` | 设计阶段的原始素材和截图资源。 | 只放素材，不把正式说明文档混进来。 |
| `src/` | 后续真实业务代码目录。 | coding 开始后持续演进，前期不必为了“完整”而制造空文件。 |
| `tests/` | 验收、测试说明和后续测试产物目录。 | V1 范围或验收标准变化时更新；编码后再逐步补测试脚本。 |
| `archive/` | 历史资料归档目录。 | 只留档，不承载当前生效口径。 |

## `docs/` 目录

`docs/` 是当前项目最重要的目录，建议按“用途”而不是“作者”来组织。

| 子目录 | 作用 | 维护方式 |
|---|---|---|
| `docs/overview/` | 面向开工前阅读的压缩版上下文。 | 保持短、稳、清楚，不要把它写成 PRD 的副本。 |
| `docs/prd/` | 正式产品需求文档。 | 只有需求本身变化时才改。 |
| `docs/planning/` | 版本边界、优先级和迭代顺序。 | 当版本范围、节奏或依赖关系变化时更新。 |
| `docs/design/` | 设计与开发之间的桥接文档。 | 页面结构、用户流、交互说明有变化时更新。 |
| `docs/coordination/` | Work / Code / 新窗口之间的协作同步文档。 | 这部分需要高频维护，避免不同窗口口径漂移。 |

## `docs/overview/`

| 文件 | 作用 | 维护方式 |
|---|---|---|
| `docs/overview/project-context.md` | 提供产品定位、版本顺序、V1 优先范围和核心对象的快速理解入口。 | 当产品边界、版本顺序、核心对象关系变化时更新。 |
| `docs/overview/project-structure.md` | 说明当前工作区的真实目录、文件职责和维护方式。 | 当目录实际变化时更新。新增、删除、重命名都应反映到这里。 |
| `docs/overview/trippo-product-and-progress-summary.md` | 用相对通俗的方式说明 Trippo 是什么，以及当前阶段已经完成了哪些工作。 | 当项目阶段发生明显变化，或需要对外/对内同步阶段总结时更新。 |
| `docs/overview/trippo-functional-route-explainer.md` | 用更通俗、非技术的方式说明 Trippo 当前更合理的功能路线与产品主线，方便产品继续改版。 | 当主导航、主路线或产品核心入口判断发生变化时更新。 |

说明：当前以 `project-structure.md` 作为正式入口，不建议并行维护另一个同类文件名，例如 `project-structure-current.md`，否则后续很容易出现两份结构说明互相漂移。

## `docs/prd/`

| 文件 | 作用 | 维护方式 |
|---|---|---|
| `docs/prd/trippo-prd-unified.md` | 当前唯一正式 PRD，覆盖 V1.0 到 V5.0 的整体需求蓝图。 | 只在产品需求本身变化时修改，不记录临时实现妥协。 |

## `docs/planning/`

| 文件 | 作用 | 维护方式 |
|---|---|---|
| `docs/planning/trippo-version-plan.md` | 说明每个版本做什么、为什么这样拆、当前优先做哪一段。 | 当版本边界、优先级或依赖关系变化时更新。 |

## `docs/design/`

这一层不是重复 PRD，而是把“产品想法”翻译成更接近设计与实现的文档。

| 文件 | 作用 | 维护方式 |
|---|---|---|
| `docs/design/README.md` | 设计文档目录说明。 | 当 `docs/design/` 结构变化时更新。 |
| `docs/design/product-structure.md` | 页面结构、导航关系、模块之间的组织方式。 | 当页面框架或导航关系变化时更新。 |
| `docs/design/user-flow.md` | 核心用户流和关键操作路径。 | 当 V1 页面流程变化时更新。 |
| `docs/design/ui-notes.md` | 页面状态、交互细节、组件行为和界面说明。 | 当交互规则、页面状态或组件口径变化时更新。 |
| `docs/design/figma-links.md` | Figma、截图、外部设计链接索引。 | 有新链接、新设计稿或新参考图时更新。 |
| `docs/design/v1-ui-optimization-scope.md` | 只针对当前已实现页面的 V1.0 UI 优化范围与优先级清单。 | 当 UI 优化范围、优先级或页面边界变化时更新。 |
| `docs/design/v2-product-route-and-ia-adjustment.md` | 基于 V2.0 当前产品形态验收，整理功能路线、一级入口与信息架构调整建议。 | 当主导航、功能归类或核心页面关系发生变化时更新。 |

## `docs/coordination/`

| 文件 | 作用 | 维护方式 |
|---|---|---|
| `docs/coordination/status.md` | 用最短的信息说明当前做到哪、下一步做什么、当前边界是什么。 | 每次任务结束后优先更新“已完成”“下一步”“当前口径”。 |
| `docs/coordination/project-maintenance.md` | 记录关键决定、新要求、维护规则和需要持续关注的问题。 | 有重要变化就更新，不必写成流水账。 |
| `docs/coordination/ai-collaboration.md` | 统一不同 AI 的产品身份、表达方式、版本边界和协作规则。 | 当产品定位、表达口径或边界变化时更新。 |
| `docs/coordination/new-session-handoff.md` | 新任务窗口的接力说明，用于快速恢复上下文。 | 当项目状态、推荐下一步或核心入口文件变化时更新。 |

## `demos/`

`demos/` 里放的是演示资产，不是正式业务代码。

| 路径 | 作用 | 维护方式 |
|---|---|---|
| `demos/trippo-product-demo/` | 当前更偏“产品总览 + 可交互体验”的 Demo 目录。 | 修改后应手动打开检查字体、脚本和页面交互是否正常。 |
| `demos/trippo-product-showcase/` | 更偏展示与说明的产品展示页目录。 | 当对外展示重点、视觉叙事或文案变化时更新。 |

### `demos/trippo-product-demo/`

| 路径 | 作用 | 维护方式 |
|---|---|---|
| `trippo-product-demo.html` | 主展示页。 | 修改后手动打开检查。 |
| `assets/` | 该 Demo 自己的资源目录。 | 只放本 Demo 独有资源。 |
| `assets/charts.js` | 页面图表和交互脚本。 | 交互变复杂时可再拆分。 |
| `_shared/fonts/` | Demo 使用的本地字体。 | 除非整体视觉系统调整，否则保持稳定。 |
| `_shared/js/` | 本地第三方脚本库。 | 不直接修改库内容，升级时记录版本和影响。 |

### `demos/trippo-product-showcase/`

| 路径 | 作用 | 维护方式 |
|---|---|---|
| `trippo-product-showcase.html` | 展示页主文件。 | 修改后手动打开检查。 |
| `assets/` | 展示页独有资源。 | 只放展示页独有资源。 |
| `_shared/fonts/` | 展示页使用的本地字体。 | 和展示页视觉系统一起维护。 |

## `design-assets/`

| 路径 | 作用 | 维护方式 |
|---|---|---|
| `design-assets/README.md` | 说明适合放什么素材，后续如何继续拆分。 | 当素材分类方式变化时更新。 |

这里适合放：

- 页面截图
- 灵感参考图
- 视觉风格参考
- 图标、插图源文件
- 宣传素材

如果素材需要文字解释，优先把说明写进 `docs/design/figma-links.md` 或相关设计文档，而不是塞进图片文件名里。

## `src/`

| 路径 | 作用 | 维护方式 |
|---|---|---|
| `src/README.md` | 代码目录说明与起步结构建议。 | 工程结构变化时更新。 |
| `src/main.tsx` | 应用入口，挂载 React 根节点。 | 稳定，除非技术栈变更。 |
| `src/App.tsx` | 路由配置与页面容器。 | 新增页面路由时更新。 |
| `src/pages/` | 页面级组件，按业务模块分子目录。 | 新增页面时添加。 |
| `src/stores/` | Zustand 状态管理，每个领域对象一个 store。 | 新增业务模块时添加。 |
| `src/types/` | TypeScript 类型定义。 | 新增数据结构时添加。 |
| `src/data/` | 本地 mock 数据与种子数据。 | 补充演示数据时更新。 |
| `src/utils/` | 通用工具函数。 | 新增通用能力时添加。 |
| `src/styles/` | 全局样式与主题变量。 | 视觉系统变化时更新。 |

当前 `src/` 已完成 V1.0 + V2.0 前端功能（React + Vite + TypeScript + Zustand），包括行程、景点、路线、打卡、手账五大模块以及主题清单模块。后续模块按相同结构逐步补充。

## `tests/`

| 路径 | 作用 | 维护方式 |
|---|---|---|
| `tests/README.md` | 说明测试目录可以放什么、如何从手工验收起步。 | 当测试组织方式变化时更新。 |
| `tests/acceptance-v1.md` | V1.0 的核心验收清单与测试记录。 | V1 范围、验收标准或阶段性测试结果变化时更新。 |
| `tests/acceptance-v2.md` | V2.0 的核心验收清单与测试记录。 | V2 范围、验收标准或阶段性测试结果变化时更新。 |

## `archive/`

| 路径 | 作用 | 维护方式 |
|---|---|---|
| `archive/travel-product-prd-v0.md` | 早期 PRD 版本留档。 | 只读保留。 |
| `archive/travel-feature-expansion-plan-v0.md` | 早期扩展规划留档。 | 只读保留。 |

## 文件职责分工

| 文件 | 主要职责 | 不适合承载的内容 |
|---|---|---|
| `README.md` | 项目总入口与导航 | 不写日常进展流水账 |
| `docs/coordination/status.md` | 当前状态和下一步 | 不写长篇历史过程 |
| `docs/coordination/project-maintenance.md` | 关键决定和维护记录 | 不当成开工必读总览 |
| `docs/overview/project-context.md` | 稳定背景和产品理解压缩版 | 不写短期任务细节 |
| `docs/overview/project-structure.md` | 当前真实目录与维护规则 | 不写产品需求本身 |
| `docs/prd/trippo-prd-unified.md` | 正式需求基线 | 不记录临时实现妥协 |
| `docs/planning/trippo-version-plan.md` | 版本边界和节奏 | 不写页面级执行细节 |
| `tests/acceptance-v1.md` | V1 是否达标的判断依据 | 不代替开发日志 |
| `demos/*` | 展示产品概念和演示体验 | 不代替真实业务代码 |

## 推荐维护顺序

1. 每次开始任务前先读：
   - `README.md`
   - `docs/coordination/status.md`
   - `docs/overview/project-context.md`
   - `docs/overview/project-structure.md`

2. 每次结束任务后至少更新：
   - `docs/coordination/status.md`
   - `docs/coordination/project-maintenance.md`

3. 如果目录结构变化，再更新：
   - `docs/overview/project-structure.md`

4. 如果 V1 范围或验收标准变化，再更新：
   - `docs/planning/trippo-version-plan.md`
   - `tests/acceptance-v1.md`
