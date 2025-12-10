# PolicyGame RPG 改造方案 (RPG Transformation Plan)

## 项目现状分析 (Project Analysis)
**当前状态**:
- **技术栈**: Next.js 15, Tailwind CSS, React Hooks (State).
- **核心逻辑**: `engine/core` 包含一个目前已禁用的基于时间的模拟引擎 (`gameEngine.ts`, `indexCalculator.ts`)。
- **UI 交互**: 主地图包含可点击的地点（政府大楼、警局总部、数据中心），目前主要是简单的页面跳转或遮罩层。
- **核心玩法**: 原计划为回合制/实时模拟，包含随机事件（目前大部分功能已注释或禁用）。

**目标状态 (RPG 模式)**:
- **类型转变**: 从 模拟经营 (Simulation) -> 叙事/侦探 RPG (Narrative RPG / Detective Game)。
- **核心循环**: 探索地区 (Explore) -> 收集信息 (Gather Info) -> 归纳特征 (Summarize) -> 结合地图线索 (Combine Clues) -> 解决"事件" (Solve Event)。
- **关键特性**:
    - **探索 (Exploration)**: 深入查看 3 个核心区域（政府、警局、数据中心）的内部场景。
    - **物品/日志系统 (Inventory/Journal)**: 用于存储调查获得的 "信息 (Information)" 和 "线索 (Clues)"。
    - **推理系统 (Deduction System)**: 允许玩家组合已获得的信息，推导出结论。
    - **决策系统 (Decision Making)**: 基于玩家收集的证据进行非线性的剧情选择。

## 架构重构建议 (Proposed Architecture Changes)

### 1. 核心玩法变更 (Core Gameplay Changes)
- **取消室内漫游**: 不再进入建筑物内部。
- **地图交互**: 地图上会出现 **(!)** 图标。
- **对话系统 (VN Style)**: 点击 (!) 触发对话。界面变为 **Galgame 风格**（人物 2D 立绘 + 底部对话框）。
- **智能终端 (PDA System)**: 统一管理信息，包含两个标签页：
    - **线索记录 (Journal/Clues)**: 记录具体的剧情线索（例如："警长隐瞒了由于数据不足导致的错误逮捕"）。用于推理和解决事件。
    - **百科全书 (Encyclopedia)**: 记录通过游戏解锁的学术概念（例如："数据代表性不足 (Under-representation)" 的定义）。用于通过 Final Project 的教育目标。
    *设计思路：两者逻辑区分，但在 UI 上合并为一个入口。*

### 2. 数据模型与状态管理 (Data Model)
**新的 GameState**:
```typescript
interface RPGState {
  // 玩家状态
  player: {
    inventory: Item[];    // 物理道具
    journal: Clue[];      // 剧情线索
    encyclopedia: Concept[]; // 收集到的概念 (例如: "数据歧视"解释)
  };
  
  // 地图状态
  map: {
    activeEvents: MapEvent[]; // 当前地图上显示的 (!) 事件
    // MapEvent结构: { id: string, location: {x, y}, characterId: string, isCompleted: boolean }
  };

  // 剧情旗标
  flags: Record<string, boolean>; // 用于控制剧情进度
}
```

### 3. 系统模块 (System Modules)
- **Engine**: 彻底移除 `engine/core` 中的时间模拟及 `indexCalculator`。
- **UI Components**:
    - `DialogueOverlay`: 视觉小说风格对话框，支持显示立绘 (Left/Right/Center)。
    - `MapInteractiveLayer`: 在地图之上渲染 (!) 按钮的图层。
    - `EncyclopediaPanel`: "概念全书" 界面，查看已解锁的 AI 术语。
    - `JournalPanel`: 线索记录本。

## 开发路线图 (Development Roadmap)

### 第一阶段：清理与净化 (Phase 1: Cleanup)
**目标**: 移除不再需要的代码，为新系统腾出空间。
1.  **删除**: `engine/core` 下的模拟引擎代码。
2.  **删除/归档**: 旧的 DataCenter/PoliceHQ/Gov 详情页面（如果不再需要进入）。
3.  **Commit**: "Refactor: Remove legacy simulation engine and unused pages."

### 第二阶段：UI 框架搭建 (Phase 2: UI Framework)
**目标**: 实现 Galgame 风格的基础交互界面。
1.  **Map Interactive Layer**: 在主地图上实现可点击的 (!) 图标系统。
2.  **Visual Novel UI**: 创建通用的对话组件（立绘位 + 文本框）。
3.  **Encyclopedia UI**: 创建概念全书界面。
4.  **Commit**: "Feat: Implement VN-style dialogue and Encyclopedia UI."

### 第三阶段：内容与逻辑 (Phase 3: Content & Logic)
**目标**: 实现数据收集与对话流程。
1.  **State Management**: 实现新的 `RPGState` (使用 Zustand 或 Context)。
2.  **Interaction Logic**: 点击 (!) -> 打开对话 -> 对话中解锁 "概念" -> 存入百科。
3.  **Commit**: "Feat: Add interaction logic and state management."

## 验证计划 (Verification Plan)
1.  **清理验证**: 确保删除旧代码后项目仍能运行 ( `pnpm dev` 无报错)。
2.  **交互验证**: 点击地图上的 (!) 能正确弹出对话框。
3.  **功能验证**: 在对话中解锁一个新概念，能在 "百科全书" 中查看到。
