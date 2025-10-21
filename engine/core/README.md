# 核心引擎模块

这个模块包含游戏的核心运行机制，包括时间管理、状态更新等基础功能。

## 文件结构

```
engine/core/
├── README.md           # 说明文档
├── index.ts           # 统一导出
├── dateManager.ts     # 日期管理模块
├── gameEngine.ts      # 游戏引擎核心
└── indexCalculator.ts # 指数计算模块
```

## 功能说明

### dateManager.ts - 日期管理模块

负责处理游戏时间流逝和日期相关逻辑。

#### 主要功能
- **自动时间流逝**: 当游戏运行时，每3秒自动增加一天
- **跨月处理**: 正确处理月份天数差异（如1月31日→2月1日）
- **跨年处理**: 正确处理年份变化（如12月31日→1月1日）
- **闰年处理**: 正确处理闰年2月29日
- **日期验证**: 确保日期格式和有效性
- **日期计算**: 提供日期加减、差值计算等功能
- **数值计算委托**: 将案件和逮捕数量计算委托给indexCalculator

#### 使用方法
```typescript
import { dateManager } from '../../engine/core'

// 开始时间流逝
dateManager.startTimeFlow()

// 停止时间流逝
dateManager.stopTimeFlow()

// 手动推进一天
dateManager.advanceDay()

// 获取当前日期
const currentDate = dateManager.getCurrentDate()

// 设置日期
dateManager.setDate('2024-12-31')

// 测试日期逻辑（开发调试用）
dateManager.testDateLogic()
```

### indexCalculator.ts - 指数计算模块

负责处理游戏中的数值计算逻辑。

#### 主要功能
- **案件数量计算**: 根据犯罪率、社区信任度等因素计算每日案件数量
- **逮捕数量计算**: 根据案件数量和逮捕准确率计算每日逮捕数量
- **犯罪率变化计算**: 计算犯罪率的动态变化
- **社区信任度变化计算**: 计算社区信任度的动态变化
- **逮捕准确率变化计算**: 计算逮捕准确率的动态变化
- **配置管理**: 支持动态调整计算参数

#### 使用方法
```typescript
import { indexCalculator } from '../../engine/core'

// 计算每日案件数量
const newCases = indexCalculator.calculateDailyCases(gameState)

// 计算每日逮捕数量
const newArrests = indexCalculator.calculateDailyArrests(gameState, newCases)

// 更新配置
indexCalculator.updateConfig({
  baseCaseRate: 25.0,
  caseGenerationIntensity: 1.2
})
```

### gameEngine.ts - 游戏引擎核心

统一管理所有核心游戏机制。

#### 主要功能
- **引擎生命周期管理**: 启动、停止、销毁
- **状态监控**: 实时监控游戏状态变化
- **配置管理**: 动态调整引擎配置
- **模块协调**: 协调各个核心模块的工作
- **指数计算器集成**: 统一管理指数计算器配置和调用

#### 使用方法
```typescript
import { gameEngine } from '../../engine/core'

// 启动引擎
gameEngine.start()

// 停止引擎
gameEngine.stop()

// 获取引擎状态
const status = gameEngine.getEngineStatus()

// 更新配置
gameEngine.updateConfig({
  enableTimeFlow: true,
  enableAutoUpdate: true,
  indexCalculatorConfig: {
    baseCaseRate: 25.0,
    caseGenerationIntensity: 1.2
  }
})

// 获取指数计算器
const calculator = gameEngine.getIndexCalculator()

// 手动触发指数计算
const changes = gameEngine.calculateIndices()
```

## 集成说明

### 在游戏页面中使用

```typescript
import { initializeGameEngine } from '../../engine/core'

// 在组件挂载时初始化
useEffect(() => {
  initializeGameEngine()
}, [])
```

### 配置选项

```typescript
interface GameEngineConfig {
  enableTimeFlow: boolean      // 是否启用时间流逝
  enableAutoUpdate: boolean   // 是否启用自动状态更新
  stateCheckInterval: number  // 状态检查间隔（毫秒）
}
```

## 技术特点

- **类型安全**: 完整的 TypeScript 类型定义
- **模块化设计**: 各功能模块独立，易于维护
- **状态同步**: 与全局游戏状态管理器集成
- **性能优化**: 合理的时间间隔和状态检查频率
- **错误处理**: 完善的错误处理和日志记录
- **精确日期处理**: 逐天计算确保跨月跨年准确性
- **闰年支持**: 正确处理闰年2月29日
- **调试友好**: 内置测试功能验证日期逻辑

## 注意事项

1. 日期管理器会自动监听游戏状态，只有在 `isPlaying: true` 时才会推进时间
2. 引擎启动后会自动开始时间流逝，无需手动调用
3. 所有日期操作都会自动处理跨月、跨年、闰年等复杂情况
4. 使用逐天计算确保日期准确性，避免JavaScript Date对象的边界问题
5. 闰年判断遵循标准规则：能被4整除但不能被100整除，或能被400整除
6. 建议在应用卸载时调用 `destroy()` 方法清理资源
7. 调试面板中的"测试日期逻辑"按钮可以验证跨月跨年处理是否正确
