// 游戏机制配置文件 - 包含所有参数的初始值和配置

export interface GameState {
  // 基础信息
  date: string
  round: number
  resources: number

  // 城市状态指标
  crimeRate: number
  arrestAccuracy: number
  communityTrust: number
  caseFactor: number

  // 游戏控制状态
  isPlaying: boolean
}

export interface GameConfig {
  // 基础配置
  maxResources: number
  initialRound: number
  maxRounds: number

  // 指标范围
  minCrimeRate: number
  maxCrimeRate: number
  minAccuracy: number
  maxAccuracy: number
  minTrust: number
  maxTrust: number

  // 游戏机制
  resourceCost: {
    deployResources: number
    updateSurveillance: number
    viewReports: number
    makeArrest: number
  }

  // 区域配置
  districts: {
    central: {
      name: string
      population: number
      baseCrimeRate: number
      policePresence: number
      surveillance: number
    }
    surveillance: {
      name: string
      population: number
      baseCrimeRate: number
      policePresence: number
      surveillance: number
    }
  }
}

// 初始游戏状态
export const INITIAL_GAME_STATE: GameState = {
  // 基础信息
  date: '2025-01-01',
  round: 1,
  resources: 10,

  // 城市状态指标
  crimeRate: 10,
  arrestAccuracy: 10,
  communityTrust: 80,
  caseFactor: 50,

  // 游戏控制状态
  isPlaying: false
}

// 游戏配置
export const GAME_CONFIG: GameConfig = {
  // 基础配置
  maxResources: 10,
  initialRound: 1,
  maxRounds: 3,

  // 指标范围
  minCrimeRate: 0,
  maxCrimeRate: 100,
  minAccuracy: 0,
  maxAccuracy: 100,
  minTrust: 0,
  maxTrust: 100,

  // 游戏机制
  resourceCost: {
    deployResources: 2,
    updateSurveillance: 1,
    viewReports: 0,
    makeArrest: 3
  },

  // 区域配置
  districts: {
    central: {
      name: 'Central District',
      population: 125000,
      baseCrimeRate: 8.5,
      policePresence: 45,
      surveillance: 78
    },
    surveillance: {
      name: 'Police HQ',
      population: 85000,
      baseCrimeRate: 12.3,
      policePresence: 38,
      surveillance: 65
    }
  }
}

// 游戏事件配置
export const GAME_EVENTS = {
  // 随机事件
  randomEvents: [
    {
      id: 'crime_spike',
      name: '犯罪率激增',
      description: '某个区域犯罪率突然上升',
      effect: { crimeRate: 5, communityTrust: -3 }
    },
    {
      id: 'police_success',
      name: '警方成功行动',
      description: '成功破获重大案件',
      effect: { communityTrust: 5, crimeRate: -2 }
    },
  ],

  // 每日事件
  dailyEvents: [
    {
      id: 'daily_patrol',
      name: '日常巡逻',
      description: '增加警力巡逻',
      cost: { resources: 1 },
      effect: { crimeRate: -1, communityTrust: 1 }
    }
  ]
}

// 游戏平衡配置
export const GAME_BALANCE = {
  // 犯罪率影响因子
  crimeRateFactors: {
    policePresence: -0.1, // 每1%警力减少0.1%犯罪率
    surveillance: -0.05,  // 每1%监控减少0.05%犯罪率
    communityTrust: -0.08 // 每1%信任度减少0.08%犯罪率
  },

  // 信任度影响因子
  trustFactors: {
    arrestAccuracy: 0.2,  // 每1%准确率增加0.2%信任度
    crimeRate: -0.3,      // 每1%犯罪率减少0.3%信任度
    policePresence: 0.1   // 每1%警力增加0.1%信任度
  },

}
