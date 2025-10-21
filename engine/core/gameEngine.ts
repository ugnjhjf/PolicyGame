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
  private stateCheckInterval: NodeJS.Timeout | null = null

  constructor(config: GameEngineConfig = {
    enableTimeFlow: true,
    enableAutoUpdate: true,
    stateCheckInterval: 100,
    indexCalculatorConfig: {}
  }) {
    this.config = config
    
    // 初始化指数计算器配置
    if (config.indexCalculatorConfig) {
      indexCalculator.updateConfig(config.indexCalculatorConfig)
    }
  }

  // 启动游戏引擎
  start(): void {
    if (this.isRunning) {
      return
    }

    this.isRunning = true
    
    // 初始化日期管理器
    if (this.config.enableTimeFlow) {
      initializeDateManager()
    }

    // 启动状态检查
    if (this.config.enableAutoUpdate) {
      this.startStateCheck()
    }
  }

  // 停止游戏引擎
  stop(): void {
    if (!this.isRunning) {
      return
    }

    this.isRunning = false
    
    // 停止日期管理器
    dateManager.stopTimeFlow()
    
    // 停止状态检查
    this.stopStateCheck()

  }

  // 启动状态检查
  private startStateCheck(): void {
    this.stateCheckInterval = setInterval(() => {
      this.updateGameState()
    }, this.config.stateCheckInterval)
  }

  // 停止状态检查
  private stopStateCheck(): void {
    if (this.stateCheckInterval) {
      clearInterval(this.stateCheckInterval)
      this.stateCheckInterval = null
    }
  }


  // 更新游戏状态
  private updateGameState(): void {
    const gameState = GameStateManager.getCurrentState()
    
    // 根据游戏状态控制日期管理器
    if (gameState.isPlaying && !dateManager['intervalId']) {
      dateManager.startTimeFlow()
    } else if (!gameState.isPlaying && dateManager['intervalId']) {
      dateManager.stopTimeFlow()
    }

    // 只有在游戏运行状态时才进行状态更新
    if (!gameState.isPlaying) {
      return
    }

    // 检查游戏状态健康度
    const status = GameStateManager.checkGameStatus()
    if (!status.isHealthy) {
      console.warn('[GameEngine] 游戏状态不健康:', status.warnings)
    }
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
    crimeRateChange: number
    communityTrustChange: number
    arrestAccuracyChange: number
  } {
    const gameState = GameStateManager.getCurrentState()
    
    return {
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

// 自动启动游戏引擎
export const initializeGameEngine = () => {
  gameEngine.start()
}
