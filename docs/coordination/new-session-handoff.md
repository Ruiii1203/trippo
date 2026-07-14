# Trippo 新任务窗口接力文件

这份文件用于在 **新任务窗口** 中快速恢复当前工作上下文，避免重新解释项目背景。

## 这是什么项目

- 产品名称：旅啵·Trippo
- 产品定位：懂你的旅行陪伴助手
- 当前阶段：V2.0 功能已完成，进入产品验收与信息架构改版
- 当前技术栈：React 18 + Vite 5 + TypeScript 5 + Zustand 4 + React Router v6
- 当前数据方案：纯前端 + localStorage 本地持久化 + mock 数据（无后端）
- 开发策略：先把 V2.0 的产品形态和主入口结构调整到“像一个正常 App”，不提前进入 V3.0-V5.0 的新功能开发

## 当前一致口径

### 只做

- V1.0 核心闭环：行程、景点心愿、每日路线、打卡、手账
- V2.0 增强能力：主题清单、花费统计、手账模板
- 以及当前正在进行的：信息架构改版（底部导航、入口层级、全局/行程内视图）

### 不做

- 心情推荐 / MBTI / 星座推荐
- 独自旅行模式
- 多人协作
- AI 增强能力
- 重社交
- 旅游交易能力

## 当前已存在的核心文件

### 必读

- `docs/coordination/status.md`
- `docs/overview/project-context.md`
- `docs/prd/trippo-prd-unified.md`
- `docs/planning/trippo-version-plan.md`
- `docs/coordination/ai-collaboration.md`
- `docs/coordination/project-maintenance.md`

### 其他已存在文件

- `README.md`
- `tests/acceptance-v1.md`
- `demos/trippo-product-demo/trippo-product-demo.html`

## 当前状态摘要

- 项目骨架已经建过
- PRD 和版本规划已经归档
- 已有一个可打开的 Demo
- 已建立 Work / Code 共享用的同步文档体系
- V1.0 前端脚手架已初始化（React + Vite + TypeScript + Zustand）
- V1.0 五大模块全部完成：行程、景点心愿、每日路线、打卡、手账
- 核心闭环已跑通：行程 → 景点搜索 → 心愿单 → 路线规划 → 打卡 → 手账
- 体验打磨完成：页面切换动画、按钮交互反馈、卡片质感提升、底部面板优化等
- V1.0 回归验收通过：A-E 五场景全量走查，无阻断性问题
- V2.0 三大新增模块已实现：主题清单、花费统计、手账模板
- 当前产品验收入口：开发服务器（http://localhost:5175/）
- 当前最合理的下一步是：根据验收反馈做信息架构改版（行程/心愿单/旅行手账三大入口）

## 重要提醒

当前工作区里实际存在的目录结构，和此前规划过的“完整 Trippo 结构”可能不完全一致。

例如：

- `docs/design/`
- `src/`
- `design-assets/`
- `archive/`

在之前的对话中，这些目录已经被讨论、规划、甚至部分建立过；但你在新窗口里开始工作前，**必须先检查当前工作区里它们是否真的存在**，不要只依赖旧对话记忆。

也就是说：

1. 先读文档
2. 再检查当前文件系统
3. 再决定是继续开发，还是先补齐目录

## 当前推荐的下一步

新窗口继续工作时，先确认要做哪件事：

1. **体验当前产品形态**：启动开发服务器 `npm run dev`，打开预览走查（以 status.md 记录的端口为准）
2. **信息架构改版**：底部导航改为「行程 / 心愿单 / 旅行手账」，并落实“双入口规则”
3. **心愿单改版**：独立入口 + 分类展示 + 清单内嵌 + 行程内只看局部
4. **旅行手账改版**：独立入口 + 按行程分类 + 行程内只看局部
5. **工程化**：测试、构建、CI/CD 等

如果是要继续写代码，建议先读 `src/README.md` 了解代码结构。

## 给新窗口 AI 的开场 prompt

你可以直接复制下面这段，作为新任务窗口的第一条消息：

```text
当前项目是 Trippo（旅啵），V2.0 功能已完成，正在做产品验收与信息架构改版。

请先阅读以下文件，并以这些文件作为本次任务的唯一产品上下文来源：

- docs/coordination/new-session-handoff.md
- docs/coordination/status.md
- docs/overview/project-context.md
- docs/prd/trippo-prd-unified.md
- docs/planning/trippo-version-plan.md
- docs/coordination/ai-collaboration.md
- docs/coordination/project-maintenance.md
- tests/acceptance-v1.md
- tests/acceptance-v2.md
- src/README.md

然后请先检查当前 Trippo 根目录的实际结构，确认它是否与文档描述一致。

先不要直接执行，请先输出：
1. 你理解的当前项目阶段
2. 你读到的实际目录结构
3. 当前 V1.0 的完成情况
4. 本次任务最合理的下一步

要求：
- 当前默认只做 V2.0 的验收与改版，不要提前实现 V3.0-V5.0
- 如果文档与当前文件系统不一致，请先指出再继续
```

## 结束本次窗口前要做什么

如果新窗口产生了真实进展，请在结束前至少更新：

- `docs/coordination/status.md`
- `docs/coordination/project-maintenance.md`

如果影响 V1.0 验收，再更新：

- `tests/acceptance-v1.md`

如果影响 V2.0 验收，再更新：

- `tests/acceptance-v2.md`
