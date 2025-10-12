// 游戏机制配置文件 - 包含所有参数的初始值和配置

export interface GameState {
  // 基础信息
  date: string
  actionPoints: number
  money: number
  
  // 城市状态指标
  caseCount: number
  arrests: number
  crimeRate: number
  arrestAccuracy: number
  communityTrust: number
  
  // 游戏控制状态
  isPlaying: boolean
}

export interface GameConfig {
  // 基础配置
  maxActionPoints: number
  minMoney: number
  maxMoney: number
  
  // 指标范围
  minCrimeRate: number
  maxCrimeRate: number
  minAccuracy: number
  maxAccuracy: number
  minTrust: number
  maxTrust: number
  
  // 游戏机制
  actionPointCost: {
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
  actionPoints: 5,
  money: 125000,
  
  // 城市状态指标
  caseCount: 23,
  arrests: 8,
  crimeRate: 12.5,
  arrestAccuracy: 78.3,
  communityTrust: 65.2,
  
  // 游戏控制状态
  isPlaying: false
}

// 游戏配置
export const GAME_CONFIG: GameConfig = {
  // 基础配置
  maxActionPoints: 10,
  minMoney: 0,
  maxMoney: 1000000,
  
  // 指标范围
  minCrimeRate: 0,
  maxCrimeRate: 100,
  minAccuracy: 0,
  maxAccuracy: 100,
  minTrust: 0,
  maxTrust: 100,
  
  // 游戏机制
  actionPointCost: {
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
      name: 'Surveillance Zone',
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
      effect: { arrests: 2, communityTrust: 5, crimeRate: -2 }
    },
    {
      id: 'budget_cut',
      name: '预算削减',
      description: '政府削减警务预算',
      effect: { money: -10000, policePresence: -5 }
    }
  ],
  
  // 每日事件
  dailyEvents: [
    {
      id: 'daily_patrol',
      name: '日常巡逻',
      description: '增加警力巡逻',
      cost: { actionPoints: 1 },
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
  
  // 金钱消耗
  moneyCosts: {
    deployResources: 5000,
    updateSurveillance: 3000,
    viewReports: 0,
    makeArrest: 2000
  }
}
