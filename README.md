# Trippo 旅啵

这是「旅啵·Trippo」旅行助手 App 的产品与代码工作目录，统一管理 PRD、版本规划、设计上下文、可运行 Demo 和前端实现代码。

## 当前状态

V1.0 核心闭环已完成并可运行，包含五大模块：行程、景点心愿清单、每日路线规划、景点打卡、手账草稿生成与查看。

- **技术栈**：React 18 + Vite 5 + TypeScript 5 + Zustand 4 + React Router v6
- **数据方案**：本地 localStorage 持久化 + mock 数据（无后端、无账号体系）
- **移动端优先**：最大宽度 480px 居中，支持安全区适配
- **开发服务器**：运行 `npm run dev` 启动，默认端口 5173

## 目录结构

```text
Trippo/
├── README.md
├── .gitignore
├── docs/
│   ├── overview/
│   │   ├── project-context.md
│   │   └── project-structure.md
│   ├── prd/
│   │   └── trippo-prd-unified.md
│   ├── planning/
│   │   └── trippo-version-plan.md
│   └── design/
│       ├── README.md
│       ├── product-structure.md
│       ├── user-flow.md
│       ├── ui-notes.md
│       └── figma-links.md
│   └── coordination/
│       ├── ai-collaboration.md
│       └── project-maintenance.md
├── demos/
│   ├── trippo-product-demo/
│   └── trippo-product-showcase/
├── src/
│   └── README.md
├── tests/
│   ├── README.md
│   └── acceptance-v1.md
├── design-assets/
│   └── README.md
└── archive/
    ├── travel-product-prd-v0.md
    └── travel-feature-expansion-plan-v0.md
```

## 各目录用途

- `docs/overview/`：面向开发前阅读的上下文压缩版，帮助快速理解产品边界。
- `docs/coordination/`：AI 协作口径、持续维护、关键变化记录。
- `docs/prd/`：当前正式 PRD，作为功能口径基准。
- `docs/planning/`：版本路线、迭代顺序、阶段目标。
- `docs/design/`：页面结构、用户流、交互规则、视觉说明、截图索引。
- `demos/`：可运行原型和 HTML 方案展示。
- `design-assets/`：截图、灵感图、视觉素材等原始资源。
- `src/`：V1.0 前端实现代码（React + TypeScript + Vite）。
- `tests/`：验收记录、测试用例、测试脚本或检查清单。
- `archive/`：历史草稿与早期方案，只做留档。

## 如何启动开发服务器

```bash
cd Trippo
npm install    # 首次运行需要
npm run dev    # 启动开发服务器，默认 http://localhost:5173
```

## 如何阅读项目

建议每次开始新任务时，按下面顺序阅读：

1. `docs/overview/project-context.md`
2. `docs/overview/project-structure.md`
3. `docs/prd/trippo-prd-unified.md`
4. `docs/planning/trippo-version-plan.md`
5. `docs/design/product-structure.md`
6. `docs/coordination/project-maintenance.md`
7. `demos/trippo-product-demo/trippo-product-demo.html`

## 如何打开 Demo

请直接打开：

```text
demos/trippo-product-demo/trippo-product-demo.html
```

不要只移动单个 `.html` 文件。这个 Demo 依赖同级目录中的 `assets/` 和 `_shared/`，如果只拷贝 HTML，字体、图表和交互脚本会失效。

## 版本说明

- **V1.0**：核心闭环（行程 → 景点 → 路线 → 打卡 → 手账），已完成，纯前端 + localStorage
- **V2.0+**：主题清单、推荐、独旅模式、协作、AI 等，尚未实现

当前默认只做 V1.0，不提前实现 V2.0 及以上功能。
