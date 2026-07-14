# Trippo 模式切换 Prompt

这份文档用于支持 Trippo 在 `work / code / design` 多模式之间切换时，保持稳定口径。

当前默认前提：

- 当前项目：`Trippo`
- 当前默认版本范围：以 `docs/coordination/status.md` 为准（当前为 V2.0 验收与改版）
- 不提前实现 `V3.0` 到 `V5.0`
- 如果文档与当前文件系统不一致，先指出，再继续

## Prompt 1

用于在 `code` 和 `design` 模式中，正式开始这份产品创作工作。

```text
当前项目是 Trippo。

你现在将作为当前任务的执行者参与这次产品创作工作，模式可能是 code，也可能是 design。请先遵守以下统一要求：

1. 当前默认只做 `status.md` 指定的“当前版本重点”（当前为 V2.0 验收与改版）
2. 不要提前实现或展开 V3.0-V5.0 的功能
3. 如果文档描述与当前文件系统不一致，请先指出，再继续
4. 先判断这次任务属于当前重点的哪一部分（例如：信息架构改版 / 心愿单改版 / 手账入口改版 / UI 细节打磨）
5. 所有输出都要尽量落到当前项目目录中，而不是只停留在对话里

Trippo 当前已实现 V1.0 + V2.0（行程、心愿单、路线、打卡、手账、主题清单、花费统计、手账模板），当前正在根据验收反馈做“入口与结构改版”。

请先基于当前任务目标做这几件事：

1. 判断当前任务更适合归入 code 还是 design
2. 判断它是否属于 V1.0 范围
3. 指出它会影响哪些已有文件或目录
4. 如果需要新增文件，先说明应该放在哪里最合理
5. 再开始执行

额外要求：

- 如果你处于 code 模式，优先把成果落在 `src/`、`tests/`、必要的文档更新里
- 如果你处于 design 模式，优先把成果落在 `docs/design/`、`design-assets/`、必要的文档更新里
- 不要把展示 Demo 误当成正式业务代码
- 不要把未来版本功能混入当前首版实现

开始前，先用简短文字输出：

1. 你判断当前任务属于什么模式
2. 它是否属于 V1.0
3. 你准备先做什么

然后再继续执行。
```

## Prompt 2

用于每次开始工作前输入，要求 AI 先阅读必要文档，再继续工作。

```text
当前项目是 Trippo。

请先阅读以下文件，并把它们作为本次任务的主要上下文来源：

- README.md
- docs/coordination/status.md
- docs/coordination/new-session-handoff.md
- docs/overview/project-context.md
- docs/overview/project-structure.md
- docs/prd/trippo-prd-unified.md
- docs/planning/trippo-version-plan.md
- docs/design/product-structure.md
- docs/design/user-flow.md
- docs/design/ui-notes.md
- docs/coordination/ai-collaboration.md
- docs/coordination/project-maintenance.md
- tests/acceptance-v1.md

然后请检查当前 Trippo 根目录的实际结构，确认它是否与文档描述一致。

要求：

1. 当前默认只做 `docs/coordination/status.md` 指定的“当前版本重点”（当前为 V2.0 验收与改版）
2. 不要提前实现 V3.0-V5.0
3. 如果文档与当前文件系统不一致，请先指出再继续
4. 如果本次任务会新增或修改文件，请先判断这些文件放在哪个目录最合适

在正式开始执行前，请先输出：

1. 你理解的当前项目阶段
2. 这次任务属于当前版本重点的哪一部分
3. 当前工作区是否存在需要先处理的不一致
4. 你建议的下一步

确认完以上内容后，再继续执行当前任务。
```

## Prompt 3

用于每次结束工作前输入，要求 AI 对需要持续维护的文档做必要更新。

```text
在结束这次任务前，请先不要直接停止。

请基于本次实际完成的工作，检查并更新 Trippo 中需要持续维护的文档。更新时只改真正需要改的部分，不要无意义重写。

请至少检查以下文件：

- docs/coordination/status.md
- docs/coordination/project-maintenance.md
- docs/overview/project-structure.md
- docs/coordination/new-session-handoff.md
- docs/design/ui-notes.md
- docs/design/user-flow.md
- tests/acceptance-v1.md
- tests/acceptance-v2.md

更新规则：

1. 如果本次完成了新功能、阶段目标变化了，更新 `docs/coordination/status.md`
2. 如果本次新增了关键决定、约束、待办或新文件，更新 `docs/coordination/project-maintenance.md`
3. 如果本次改动了目录结构、新增了重要文件、重命名了路径，更新 `docs/overview/project-structure.md`
4. 如果本次影响了页面流程、交互规则、页面状态，更新 `docs/design/ui-notes.md` 或 `docs/design/user-flow.md`
5. 如果本次影响了 V1 验收范围、验收结果或阶段性测试结论，更新 `tests/acceptance-v1.md`
5b. 如果本次影响了 V2 验收范围、验收结果或阶段性测试结论，更新 `tests/acceptance-v2.md`
6. 如果“下次继续做什么”或“开始前必读什么”发生了变化，更新 `docs/coordination/new-session-handoff.md`

额外要求：

- 不要把无实际意义的过程流水账写进文档
- 不要创建重复职责的新文档，优先更新现有文档
- 如果某个文件检查后不需要更新，请保持不动

最后请输出：

1. 你更新了哪些文件
2. 每个文件为什么需要更新
3. 哪些文件你检查过但不需要更新

确认文档已经处理完，再结束本次任务。
```

## 使用建议

- 开始一个具体任务前，先用 `Prompt 2`
- 确认进入执行状态后，用 `Prompt 1`
- 每次准备结束当前轮工作时，用 `Prompt 3`

如果后续 Trippo 的协作方式、目录结构或文档体系变化，这份文件也应一起更新。

## 更短版

下面这 3 份是更适合日常直接复制的短版。

### 短版 1

用于正式进入 `code` 或 `design` 模式执行任务。

```text
当前项目是 Trippo。

当前默认只做 `docs/coordination/status.md` 指定的“当前版本重点”，不提前实现 V3.0-V5.0。若文档与当前文件系统不一致，请先指出再继续。

Trippo V1.0 当前只聚焦：
- 行程列表与创建行程
- 景点搜索与心愿清单
- 每日路线与排序
- 景点打卡
- 手账草稿生成与查看

请先判断：
1. 当前任务属于 code 还是 design
2. 它是否属于 V1.0
3. 会影响哪些已有文件或目录
4. 如果需要新增文件，最适合放在哪里

然后再开始执行。

要求：
- code 模式优先落到 `src/`、`tests/` 和必要文档
- design 模式优先落到 `docs/design/`、`design-assets/` 和必要文档
- 不要把 Demo 当成正式业务代码
- 不要把未来版本功能混入当前首版实现
```

### 短版 2

用于每次开始工作前，让 AI 先读文档再继续。

```text
当前项目是 Trippo。

请先阅读以下文件，并把它们作为本次任务的主要上下文来源：

- README.md
- docs/coordination/status.md
- docs/coordination/new-session-handoff.md
- docs/overview/project-context.md
- docs/overview/project-structure.md
- docs/prd/trippo-prd-unified.md
- docs/planning/trippo-version-plan.md
- docs/design/product-structure.md
- docs/design/user-flow.md
- docs/design/ui-notes.md
- docs/coordination/ai-collaboration.md
- docs/coordination/project-maintenance.md
- tests/acceptance-v1.md

然后检查当前 Trippo 根目录的实际结构，确认它是否与文档描述一致。

要求：
- 当前默认只做 `docs/coordination/status.md` 指定的“当前版本重点”
- 不要提前实现 V3.0-V5.0
- 如果文档与文件系统不一致，请先指出再继续
- 如果本次任务会新增或修改文件，请先判断这些文件最适合放在哪个目录

正式执行前，请先输出：
1. 当前项目阶段
2. 这次任务属于当前版本重点的哪一部分
3. 当前是否有需要先处理的不一致
4. 你建议的下一步
```

### 短版 3

用于每次结束工作前，让 AI 更新必要文档。

```text
结束本次任务前，请先检查并更新 Trippo 中需要持续维护的文档，只改真正需要改的部分，不要无意义重写。

请至少检查：
- docs/coordination/status.md
- docs/coordination/project-maintenance.md
- docs/overview/project-structure.md
- docs/coordination/new-session-handoff.md
- docs/design/ui-notes.md
- docs/design/user-flow.md
- tests/acceptance-v1.md

规则：
- 新功能、阶段目标变化：更新 `docs/coordination/status.md`
- 新决定、约束、待办、新文件：更新 `docs/coordination/project-maintenance.md`
- 目录结构或路径变化：更新 `docs/overview/project-structure.md`
- 页面流程、交互、状态变化：更新 `docs/design/ui-notes.md` 或 `docs/design/user-flow.md`
- V1 验收范围、结果或阶段性测试变化：更新 `tests/acceptance-v1.md`
- 下次继续做什么或开始前必读内容变化：更新 `docs/coordination/new-session-handoff.md`

不要新增重复职责的新文档。最后请输出：
1. 你更新了哪些文件
2. 为什么更新这些文件
3. 哪些文件你检查过但不需要更新
```
