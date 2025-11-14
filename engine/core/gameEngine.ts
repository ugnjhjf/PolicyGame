// 游戏核心引擎 - 统一管理所有核心游戏机制

import { GameStateManager } from '../../config/data'
import { dateManager, initializeDateManager } from './dateManager'
import { indexCalculator, IndexCalculatorConfig } from './indexCalculator'

export interface GameEngineConfig {
  // 是否启用自动时间流逝
  enableTimeFlow: boolean
  // 是否启用自动状态更新
  enableAutoUpdate: boolean
  // 状态检查间隔（毫秒）
  stateCheckInterval: number
  // 指数计算器配置
  indexCalculatorConfig?: Partial<IndexCalculatorConfig>
}

export class GameEngine {
  private config: GameEngineConfig
  private isRunning: boolean = false

  constructor(config: GameEngineConfig = {
    enableTimeFlow: false, // 默认禁用自动时间流逝
    enableAutoUpdate: false, // 默认禁用自动状态更新
    stateCheckInterval: 100, // 保留配置但不使用
    indexCalculatorConfig: {}
  }) {
    this.config = config
    
    // 初始化指数计算器配置
    if (config.indexCalculatorConfig) {
      indexCalculator.updateConfig(config.indexCalculatorConfig)
    }
  }

  // 启动游戏引擎 - 已移除自动功能
  start(): void {
    if (this.isRunning) {
      return
    }

    this.isRunning = true
    
    // 实时模拟功能已移除，不再自动启动日期管理器
    console.warn('[GameEngine] 自动状态更新功能已移除')
  }

  // 停止游戏引擎 - 已移除自动功能
  stop(): void {
    if (!this.isRunning) {
      return
    }

    this.isRunning = false
    
    // 实时模拟功能已移除，不再需要停止任何定时器
  }


  // 获取引擎状态
  getEngineStatus(): {
    isRunning: boolean
    timeFlowEnabled: boolean
    autoUpdateEnabled: boolean
    indexCalculatorConfig: IndexCalculatorConfig
  } {
    return {
      isRunning: this.isRunning,
      timeFlowEnabled: this.config.enableTimeFlow,
      autoUpdateEnabled: this.config.enableAutoUpdate,
      indexCalculatorConfig: indexCalculator.getConfig()
    }
  }

  // 获取指数计算器实例
  getIndexCalculator() {
    return indexCalculator
  }

  // 更新指数计算器配置
  updateIndexCalculatorConfig(newConfig: Partial<IndexCalculatorConfig>): void {
    indexCalculator.updateConfig(newConfig)
    this.config.indexCalculatorConfig = { ...this.config.indexCalculatorConfig, ...newConfig }
  }

  // 手动触发指数计算
  calculateIndices(): {
    dailyCases: number
    dailyArrests: number
    crimeRateChange: number
    communityTrustChange: number
    arrestAccuracyChange: number
  } {
    const gameState = GameStateManager.getCurrentState()
    
    const dailyCases = indexCalculator.calculateDailyCases(gameState)
    
    return {
      dailyCases,
      dailyArrests: indexCalculator.calculateDailyArrests(gameState, dailyCases),
      crimeRateChange: indexCalculator.calculateDailyCrimeRateChange(gameState),
      communityTrustChange: indexCalculator.calculateDailyCommunityTrustChange(gameState),
      arrestAccuracyChange: indexCalculator.calculateDailyArrestAccuracyChange(gameState)
    }
  }

  // 更新配置
  updateConfig(newConfig: Partial<GameEngineConfig>): void {
    this.config = { ...this.config, ...newConfig }
    
    // 更新指数计算器配置
    if (newConfig.indexCalculatorConfig) {
      indexCalculator.updateConfig(newConfig.indexCalculatorConfig)
    }
    
    // 如果引擎正在运行，重新启动以应用新配置
    if (this.isRunning) {
      this.stop()
      this.start()
    }
  }

  // 销毁引擎
  destroy(): void {
    this.stop()
    dateManager.destroy()
  }
}

// 创建默认的游戏引擎实例
export const gameEngine = new GameEngine()

// 初始化游戏引擎 - 已移除自动启动功能
export const initializeGameEngine = () => {
  // 实时模拟功能已移除，此方法不再自动启动引擎
  console.warn('[GameEngine] 自动启动功能已移除')
}
