// 指数计算模块 - 处理游戏数值计算逻辑

import { GameStateManager } from '../../config/data'

export interface IndexCalculatorConfig {
  // 基础案件生成率（每天）
  baseCaseRate: number
  // 最小准确率
  minAccuracyRate: number
  // 最小逮捕增加
  minArrestIncrease: number
  // 随机因子范围
  randomFactorRange: {
    min: number
    max: number
  }
}

export class IndexCalculator {
  private config: IndexCalculatorConfig

  constructor(config?: Partial<IndexCalculatorConfig>) {
    this.config = {
      baseCaseRate: 20.0,
      minAccuracyRate: 0.1,
      minArrestIncrease: 0.01,
      randomFactorRange: {
        min: 0.7,
        max: 1.3
      },
      ...config
    }
  }

  // 计算每日案件数量
  calculateDailyCases(gameState: any): number {
    // 基础案件生成率（每天）
    const baseCaseRate = this.config.baseCaseRate
    
    // 犯罪率影响因子
    const crimeRateFactor = (gameState.crimeRate / 100)
    
    // 社区信任度影响因子（信任度越低，案件越多）
    const trustFactor = (100 - gameState.communityTrust) / 100
    
    // 随机因子（增加不确定性）
    const randomFactor = this.getRandomFactor()
    
    // 权重公式计算
    const newDailyCases = Math.round(baseCaseRate * crimeRateFactor * trustFactor * randomFactor)
    
    console.log(`[Cases计算] 犯罪率: ${gameState.crimeRate}%, 今日新案件增加: ${newDailyCases.toFixed(2)}`)
    
    // 限制为整数
    return newDailyCases
  }

  // 计算每日逮捕数量
  calculateDailyArrests(gameState: any, newCases: number): number {
    // 计算因子
    const accuracyRate = Math.max(gameState.arrestAccuracy / 100, this.config.minAccuracyRate)
    const falseArrestRate = 100 - accuracyRate
    const randomFactor = this.getRandomFactor()
    
    // 总计算公式：最终逮捕人数 = (新案件数 × 错抓率 × 随机数) 
    const newArrests = newCases * falseArrestRate * randomFactor
    
    if (newArrests >= newCases) {
      return newCases
    } else{
      return newArrests
    }
  }

  // 计算犯罪率变化
  calculateDailyCrimeRateChange(gameState: any): number {
    // 简单的随机变化
    const randomChange = (Math.random() - 0.5) * 6 // -3 到 +3
    return Math.round(randomChange * 10) / 10 // 保留一位小数
  }

  // 计算社区信任度变化
  calculateDailyCommunityTrustChange(gameState: any): number {
    // 简单的随机变化
    const randomChange = (Math.random() - 0.5) * 6 // -3 到 +3
    return Math.round(randomChange * 10) / 10 // 保留一位小数
  }

  // 计算逮捕准确率变化
  calculateDailyArrestAccuracyChange(gameState: any): number {
    // 简单的随机变化
    const randomChange = (Math.random() - 0.5) * 6 // -3 到 +3
    return Math.round(randomChange * 10) / 10 // 保留一位小数
  }


  // 获取随机因子
  private getRandomFactor(): number {
    const { min, max } = this.config.randomFactorRange
    return min + Math.random() * (max - min)
  }

  // 更新配置
  updateConfig(newConfig: Partial<IndexCalculatorConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  // 获取当前配置
  getConfig(): IndexCalculatorConfig {
    return { ...this.config }
  }
}

// 创建默认实例
export const indexCalculator = new IndexCalculator()
