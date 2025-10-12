# 游戏数据配置系统

## 文件结构

```
config/data/
├── gameConfig.ts    # 游戏机制配置文件
├── gameState.ts     # 实时游戏数据文件
├── index.ts         # 统一导出文件
└── README.md        # 说明文档
```

## 功能说明

### gameConfig.ts
- **INITIAL_GAME_STATE**: 游戏初始状态
- **GAME_CONFIG**: 游戏配置参数
- **GAME_EVENTS**: 游戏事件配置
- **GAME_BALANCE**: 游戏平衡配置

### gameState.ts
- **currentGameState**: 实时游戏状态
- **GameStateManager**: 游戏状态管理函数集合

## 使用方法

### 1. 导入配置
```typescript
import { INITIAL_GAME_STATE, GAME_CONFIG } from '@/config/data'
```

### 2. 管理游戏状态
```typescript
import { GameStateManager } from '@/config/data'

// 获取当前状态
const currentState = GameStateManager.getCurrentState()

// 更新状态
GameStateManager.updateState({ actionPoints: 5 })

// 消耗行动点
const success = GameStateManager.consumeActionPoints(2)

// 增加金钱
GameStateManager.addMoney(10000)
```

### 3. 状态监控
```typescript
// 获取状态摘要
const summary = GameStateManager.getStatusSummary()

// 检查游戏状态
const status = GameStateManager.checkGameStatus()
```

## 状态栏参数

| 参数 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| date | string | '2024-01-15' | 当前日期 |
| actionPoints | number | 5 | 行动点 (0-10) |
| money | number | 125000 | 资金 |
| caseCount | number | 23 | 案件数量 |
| arrests | number | 8 | 逮捕人数 |
| crimeRate | number | 12.5 | 犯罪率 (0-100%) |
| arrestAccuracy | number | 78.3 | 逮捕准确率 (0-100%) |
| communityTrust | number | 65.2 | 社区信任度 (0-100%) |

## 扩展功能

### 添加新的状态参数
1. 在 `GameState` 接口中添加新字段
2. 在 `INITIAL_GAME_STATE` 中设置初始值
3. 在 `GameStateManager` 中添加相应的管理函数

### 添加新的配置参数
1. 在 `GameConfig` 接口中添加新字段
2. 在 `GAME_CONFIG` 中设置配置值
3. 在相关逻辑中使用新配置
