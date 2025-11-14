// 实时游戏数据文件 - 系统可实时查看和修改的游戏状态

import { GameState, INITIAL_GAME_STATE } from './gameConfig'

// 实时游戏状态 - 可以被系统实时查看和修改
export let currentGameState: GameState = { ...INITIAL_GAME_STATE }

// 游戏状态管理函数
export const GameStateManager = {
  // 获取当前游戏状态
  getCurrentState: (): GameState => {
    return { ...currentGameState }
  },

  // 更新游戏状态
  updateState: (updates: Partial<GameState>): void => {
    currentGameState = { ...currentGameState, ...updates }
  },

  // 重置游戏状态
  resetState: (): void => {
    currentGameState = { ...INITIAL_GAME_STATE }
  },

  // 增加资源
  addResources: (points: number): void => {
    const newPoints = Math.min(currentGameState.resources + points, 10)
    GameStateManager.updateState({ resources: newPoints })
  },

  // 消耗资源
  consumeResources: (points: number): boolean => {
    if (currentGameState.resources >= points) {
      GameStateManager.updateState({
        resources: currentGameState.resources - points
      })
      return true
    }
    return false
  },

  // 更新犯罪率
  updateCrimeRate: (change: number): void => {
    const newRate = Math.max(0, Math.min(100, currentGameState.crimeRate + change))
    GameStateManager.updateState({ crimeRate: newRate })
  },

  // 更新社区信任度
  updateCommunityTrust: (change: number): void => {
    const newTrust = Math.max(0, Math.min(100, currentGameState.communityTrust + change))
    GameStateManager.updateState({ communityTrust: newTrust })
  },

  // 更新抓捕准确率
  updateArrestAccuracy: (change: number): void => {
    const newAccuracy = Math.max(0, Math.min(100, currentGameState.arrestAccuracy + change))
    GameStateManager.updateState({ arrestAccuracy: newAccuracy })
  },


  // 推进日期
  advanceDate: (days: number = 1): void => {
    const currentDate = new Date(currentGameState.date)
    currentDate.setDate(currentDate.getDate() + days)
    GameStateManager.updateState({
      date: currentDate.toISOString().split('T')[0]
    })
  },

  // 获取状态摘要
  getStatusSummary: () => {
    return {
      date: currentGameState.date,
      resources: `${currentGameState.resources}/10`,
      crimeRate: `${currentGameState.crimeRate}%`,
      arrestAccuracy: `${currentGameState.arrestAccuracy}%`,
      communityTrust: `${currentGameState.communityTrust}%`
    }
  },

  // 检查游戏状态
  checkGameStatus: () => {
    const warnings = []

    if (currentGameState.resources === 0) {
      warnings.push('资源不足')
    }

    if (currentGameState.communityTrust < 30) {
      warnings.push('社区信任度过低')
    }

    return {
      isHealthy: warnings.length === 0,
      warnings
    }
  },

  // 游戏控制状态管理
  // 开始游戏
  startGame: (): void => {
    GameStateManager.updateState({ isPlaying: true })
  },

  // 暂停游戏
  pauseGame: (): void => {
    GameStateManager.updateState({ isPlaying: false })
  },

  // 切换游戏状态
  toggleGameState: (): void => {
    GameStateManager.updateState({ isPlaying: !currentGameState.isPlaying })
  },

  // 获取游戏状态
  getGameState: (): boolean => {
    return currentGameState.isPlaying
  }
}

// 导出当前状态（供其他模块使用）
export const getCurrentGameState = () => currentGameState
export const setCurrentGameState = (newState: GameState) => {
  currentGameState = { ...newState }
}
