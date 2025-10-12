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

  // 增加行动点
  addActionPoints: (points: number): void => {
    const newPoints = Math.min(currentGameState.actionPoints + points, 10)
    GameStateManager.updateState({ actionPoints: newPoints })
  },

  // 消耗行动点
  consumeActionPoints: (points: number): boolean => {
    if (currentGameState.actionPoints >= points) {
      GameStateManager.updateState({ 
        actionPoints: currentGameState.actionPoints - points 
      })
      return true
    }
    return false
  },

  // 增加金钱
  addMoney: (amount: number): void => {
    const newMoney = Math.max(0, currentGameState.money + amount)
    GameStateManager.updateState({ money: newMoney })
  },

  // 消耗金钱
  consumeMoney: (amount: number): boolean => {
    if (currentGameState.money >= amount) {
      GameStateManager.updateState({ 
        money: currentGameState.money - amount 
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

  // 增加案件数量
  addCases: (count: number): void => {
    GameStateManager.updateState({ 
      caseCount: currentGameState.caseCount + count 
    })
  },

  // 增加逮捕数量
  addArrests: (count: number): void => {
    GameStateManager.updateState({ 
      arrests: currentGameState.arrests + count 
    })
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
      actionPoints: `${currentGameState.actionPoints}/10`,
      money: `$${currentGameState.money.toLocaleString()}`,
      caseCount: currentGameState.caseCount,
      arrests: currentGameState.arrests,
      crimeRate: `${currentGameState.crimeRate}%`,
      arrestAccuracy: `${currentGameState.arrestAccuracy}%`,
      communityTrust: `${currentGameState.communityTrust}%`
    }
  },

  // 检查游戏状态
  checkGameStatus: () => {
    const warnings = []
    
    if (currentGameState.actionPoints === 0) {
      warnings.push('行动点不足')
    }
    
    if (currentGameState.money < 10000) {
      warnings.push('资金不足')
    }
    
    if (currentGameState.crimeRate > 20) {
      warnings.push('犯罪率过高')
    }
    
    if (currentGameState.communityTrust < 30) {
      warnings.push('社区信任度过低')
    }
    
    return {
      isHealthy: warnings.length === 0,
      warnings
    }
  }
}

// 导出当前状态（供其他模块使用）
export const getCurrentGameState = () => currentGameState
export const setCurrentGameState = (newState: GameState) => {
  currentGameState = { ...newState }
}
