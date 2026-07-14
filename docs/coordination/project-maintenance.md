# Trippo 项目维护文档

这份文档用于持续维护，不是一次性文档。

## 当前阶段

- 当前阶段：V2.0 功能已完成，进入产品验收与信息架构改版
- 当前目标：把主功能路线与入口层级调整到“像一个常规 App”，再进入 UI 细节打磨
- 当前版本重点：V2.0

## 本阶段已确认

- 产品名称：旅啵·Trippo
- 产品定位：懂你的旅行陪伴助手
- 技术实现先不在文档中绑定具体框架
- 先做移动端产品体验
- 地图底座优先按高德 API 思路理解
- App 内不做自建导航，地点支持跳第三方地图

## 当前已整理好的文件

- `docs/overview/project-context.md`
- `docs/overview/project-structure.md`
- `docs/overview/trippo-product-and-progress-summary.md`
- `docs/overview/trippo-functional-route-explainer.md`
- `docs/prd/trippo-prd-unified.md`
- `docs/planning/trippo-version-plan.md`
- `docs/design/product-structure.md`
- `docs/design/user-flow.md`
- `docs/design/ui-notes.md`
- `docs/design/v1-ui-optimization-scope.md`
- `docs/design/v2-product-route-and-ia-adjustment.md`
- `docs/design/figma-links.md`
- `docs/coordination/ai-collaboration.md`
- `docs/coordination/mode-prompts.md`
- `docs/coordination/status.md`
- `docs/coordination/new-session-handoff.md`
- `tests/acceptance-v1.md`
- `design-assets/README.md`
- `demos/trippo-product-demo/`
- `demos/trippo-product-showcase/`
- `src/` 下 V1.0 + V2.0 前端代码

## 当前待补内容

- 可选：自定义界面风格（主题切换功能）
- V2.0 信息架构改版落地（底部导航、入口层级、双入口规则）
- V2.0 回归验收补充（把信息架构相关验收项补齐）

## coding 前待办（已完成）

- ~~明确 V1.0 首批页面范围~~
- ~~明确 `src/` 下脚手架结构~~
- ~~补齐用户流与页面交互说明~~
- ~~确认首页、行程页、路线页、打卡页、手账页的最小闭环~~

## 新要求记录

### 2026-06-23

- 用户希望先把 `Trippo` 目录按步骤搭建起来，再开始 coding
- 用户希望用尽量少的文档满足：项目说明、AI 一致性、持续更新、定期维护
- 用户希望文档结构清晰，并明确哪些内容已整理、哪些可整理、哪些需持续完善

### 2026-06-24

- 当前工作区已补齐 `docs/coordination/status.md` 与 `docs/coordination/new-session-handoff.md`
- `docs/overview/project-structure.md` 已按当前真实文件系统更新为正式结构说明入口
- 后续不建议并行维护另一份同类结构说明文件，以避免目录口径分叉
- 已新增 `docs/coordination/mode-prompts.md`，用于在 work / code / design 切换时复用开始前、执行中、结束前的标准 prompt
- V1.0 技术栈确定：React 18 + Vite 5 + TypeScript 5 + Zustand 4 + React Router v6
- 状态管理方案：每个领域对象一个 zustand store（trip / spot / checkin / journal / list）
- 本地持久化：localStorage，key 加 `trippo_` 前缀
- 移动端优先：最大宽度 480px 居中，支持安全区适配
- 目录结构：`src/pages/` 按业务模块分，`src/stores/` 放状态，`src/types/` 放类型，`src/data/` 放 mock 数据，`src/utils/` 放工具函数，`src/styles/` 放全局样式
- 行程模块（列表 / 创建 / 详情）已完成最小实现并通过类型检查
- 景点与心愿清单模块已完成：搜索页 + 心愿单页 + 行程详情接入，通过类型检查
- V1.0 心愿清单是行程内的，不是 V2.0 的全局主题清单，Spot 带 tripId 字段
- 每日路线模块已完成：按天 Tab 切换 + 上移下移排序 + 从心愿单添加 + 移除
- 路线数据结构决策：基于 Spot.dayIndex + orderInDay 字段管理，不单独建 DayPlan 实体，简化状态
- 景点打卡模块已完成：打卡编辑页 + 打卡记录列表 + 路线页/行程详情接入，通过类型检查
- 打卡数据独立存储（checkins 数组），通过 tripId + spotId 关联，支持按行程/按景点查询
- 手账模块已完成：手账列表页 + 手账详情/编辑页 + 基于打卡素材生成草稿，通过类型检查
- V1.0 五大模块（行程、景点心愿、每日路线、打卡、手账）全部完成，核心闭环已跑通
- 新增 `docs/coordination/v1-task-intake.md`，用于在开始具体实现前先判断模式、V1.0 归属、影响范围与新增文件位置
- 后续每次新任务开始时，先判断属于 `code` 还是 `design`，再判断是否属于 V1.0 范围
- 若文档描述与当前文件系统不一致，需先指出差异，再继续执行
- `code` 模式下优先把结果落到 `src/`、`tests/` 和必要文档；`design` 模式下优先落到 `docs/design/`、`design-assets/` 和必要文档
- 不得把展示 Demo 误当成正式业务代码，也不得把 V2.0-V5.0 功能混入 V1.0 首版实现
- V1.0 体验打磨完成：页面切换动画、按钮交互反馈、卡片质感提升、底部面板优化、输入框聚焦效果、搜索标签动效
- V1.0 回归验收通过：A-E 五场景全量走查（环境入口 / 完整闭环 / 持久化 / 移动端适配 / 边界输入），无阻断性问题
- 回归验收发现 2 处非阻断可优化项：
  1. 心愿单卡片「加入路线」按钮仍显示「功能开发中」toast，建议接通到每日路线页
  2. 首次启动自动注入 mock 数据，无法体验零数据空状态，可考虑增加「清空体验数据」入口
- 已新增 `docs/design/v1-ui-optimization-scope.md`，用于收敛当前已实现页面的 V1.0 UI 优化范围、优先级和页面边界，不直接展开 V2.0+ 页面
- 已新增 `docs/overview/trippo-product-and-progress-summary.md`，用于用一份相对通俗的说明同步“Trippo 是什么”以及“当前阶段已完成的工作”

### 2026-07-07

- UI 设计优化完成：暖橙主色 `#FF7A45` + 纯白背景，完善的 token 体系（颜色/字号/间距/圆角/阴影）
- V2.0 主题清单模块完成：新增 List / ListItem 类型、useListStore 状态管理、清单列表页、清单详情页
- 清单类型支持：人生/情侣/闺蜜/亲子/其他，清单项状态：想去/计划中/已完成
- 清单功能：增删改查、完成进度统计、清单转行程、本地持久化（trippo_lists）
- V2.0 花费统计完善：打卡新增 category 字段（景点/美食/购物/交通/住宿/其他），打卡列表页显示按分类统计和按天统计
- V2.0 手账模板库：经典/旅行/可爱/极简四套模板，创建手账时可选择模板，详情页应用模板样式
- 基于当前产品形态验收反馈，新增 `docs/design/v2-product-route-and-ia-adjustment.md`，重新梳理 Trippo 的一级功能路线与信息架构问题
- 当前新的结构判断是：主导航应优先收拢为“行程 / 心愿单 / 旅行手账”，而不是继续沿用“发现 / 清单 / 我的”式蓝图结构
- 当前新的产品规则是：心愿单与旅行手账都应同时支持“全局入口”与“行程内入口”两种进入方式
- 已新增 `docs/overview/trippo-functional-route-explainer.md`，用于用更通俗、非技术的方式向产品视角解释当前功能路线问题与推荐改法，便于继续修改

### 2026-07-08

- 产品验收反馈（严重）：Trippo 需要像常规 App 一样把主入口放在底部，并收拢为「行程 / 心愿单 / 旅行手账」
- 行程首页要求：进行中置顶，计划中与历史已完成各最多展示 2–3 个，并提供查看更多；行程状态统一为「计划中 / 进行中 / 已完成」
- 心愿单要求：作为独立入口，按类型（景点/美食/旅行地/清单）组织；清单功能内嵌在心愿单下；支持“全局按行程分类”与“行程内只看局部”
- 旅行手账要求：作为独立入口，按行程分类；支持“全局按行程分类”与“行程内只看局部”；未关联行程内容需合理归类

## 使用规则

每次任务完成后，如果出现以下任一情况，就更新这份文档：

- 产品边界有变化
- 新增了关键决定
- 新增了后续必须做的事情
- 某份核心文档被新建、重命名或废弃
- 某一版本的优先级发生变化

## 定期自检

建议每隔一段时间自检一次以下问题：

1. `project-context.md` 与正式 PRD 是否冲突
2. 版本规划与当前 coding 范围是否一致
3. 展示页、Demo、PRD 对产品定位的表述是否一致
4. 是否有已经废弃的说法仍留在文档里
5. 是否把未来版本功能误写进当前首版开发范围

## 下次开始前建议先读

1. `docs/overview/project-context.md`
2. `docs/overview/project-structure.md`
3. `docs/prd/trippo-prd-unified.md`
4. `docs/planning/trippo-version-plan.md`
5. `docs/design/product-structure.md`
6. `docs/coordination/status.md`
7. `docs/coordination/new-session-handoff.md`
8. 本文档
