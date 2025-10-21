// 日期管理模块 - 处理游戏时间流逝和跨年逻辑

import { GameStateManager } from '../../config/data'
import { indexCalculator } from './indexCalculator'

export interface DateManagerConfig {
  // 时间流逝间隔（毫秒）
  timeInterval: number
  // 是否启用自动时间流逝
  autoTimeFlow: boolean
}

export class DateManager {
  private intervalId: NodeJS.Timeout | null = null
  private config: DateManagerConfig

  constructor(config: DateManagerConfig = {
    timeInterval: 3000, // 3秒
    autoTimeFlow: true
  }) {
    this.config = config
  }

  // 开始时间流逝
  startTimeFlow(): void {
    if (this.intervalId) {
      this.stopTimeFlow()
    }

    
    this.intervalId = setInterval(() => {
      const gameState = GameStateManager.getCurrentState()
      
      // 只有在游戏运行状态时才推进时间
      if (gameState.isPlaying) {
        this.advanceDay()
      } else {
      }
    }, this.config.timeInterval)
  }

  // 停止时间流逝
  stopTimeFlow(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  // 推进一天
  advanceDay(): void {
    const currentState = GameStateManager.getCurrentState()
    const newDate = this.addDays(currentState.date, 1)
    
    // 使用indexCalculator计算每日案件和逮捕数量
    const newCases = indexCalculator.calculateDailyCases(currentState)
    const newArrests = indexCalculator.calculateDailyArrests(currentState, newCases)
    
    // 计算每日指数变化
    const crimeRateChange = indexCalculator.calculateDailyCrimeRateChange(currentState)
    const communityTrustChange = indexCalculator.calculateDailyCommunityTrustChange(currentState)
    const arrestAccuracyChange = indexCalculator.calculateDailyArrestAccuracyChange(currentState)
    
    // 确保案件数量不会小于逮捕数量
    const finalCases = Math.max(newCases, newArrests)
    const finalArrests = Math.min(newArrests, finalCases)
    
    // 更新游戏状态（包括日期、案件、逮捕数量和指数变化）
    GameStateManager.updateState({ 
      date: newDate,
      caseCount: finalCases,
      arrests: finalArrests,
      crimeRate: Math.round(Math.max(0, Math.min(100, currentState.crimeRate + crimeRateChange)) * 10) / 10,
      communityTrust: Math.round(Math.max(0, Math.min(100, currentState.communityTrust + communityTrustChange)) * 10) / 10,
      arrestAccuracy: Math.round(Math.max(0, Math.min(100, currentState.arrestAccuracy + arrestAccuracyChange)) * 10) / 10
    })
  }

  // 添加指定天数到日期（正确处理跨月、跨年、闰年）
  addDays(dateString: string, days: number): string {
    const date = new Date(dateString)
    
    // 使用循环逐天添加，确保正确处理跨月跨年
    for (let i = 0; i < days; i++) {
      this.addOneDay(date)
    }
    
    return this.formatDate(date)
  }

  // 添加一天（处理跨月跨年逻辑）
  private addOneDay(date: Date): void {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    // 获取当前月份的天数
    const daysInCurrentMonth = this.getDaysInMonth(year, month)
    
    if (day < daysInCurrentMonth) {
      // 当前月还有剩余天数，直接加1
      date.setDate(day + 1)
    } else {
      // 需要跨月
      if (month < 12) {
        // 跨到下个月
        date.setMonth(month) // 设置为下个月（month是1-based，setMonth是0-based）
        date.setDate(1) // 设置为1号
      } else {
        // 跨年
        date.setFullYear(year + 1)
        date.setMonth(0) // 设置为1月（0-based）
        date.setDate(1) // 设置为1号
      }
    }
  }

  // 格式化日期为 YYYY-MM-DD 格式
  private formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 检查是否为闰年
  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }

  // 获取月份的天数（处理闰年）
  private getDaysInMonth(year: number, month: number): number {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    
    if (month === 2 && this.isLeapYear(year)) {
      return 29
    }
    
    return daysInMonth[month - 1]
  }


  // 获取当前游戏日期
  getCurrentDate(): string {
    const gameState = GameStateManager.getCurrentState()
    return gameState.date
  }

  // 设置游戏日期
  setDate(dateString: string): void {
    // 验证日期格式
    if (!this.isValidDate(dateString)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD')
    }
    
    GameStateManager.updateState({ date: dateString })
  }

  // 验证日期格式
  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateString)) {
      return false
    }
    
    const date = new Date(dateString)
    return date.toISOString().split('T')[0] === dateString
  }

  // 获取日期信息
  getDateInfo(dateString: string): {
    year: number
    month: number
    day: number
    dayOfWeek: string
    isLeapYear: boolean
  } {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayOfWeek = dayNames[date.getDay()]
    
    return {
      year,
      month,
      day,
      dayOfWeek,
      isLeapYear: this.isLeapYear(year)
    }
  }

  // 计算两个日期之间的天数差
  getDaysDifference(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }



  // 更新配置
  updateConfig(newConfig: Partial<DateManagerConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  // 销毁管理器
  destroy(): void {
    this.stopTimeFlow()
  }
}

// 创建默认的日期管理器实例
export const dateManager = new DateManager()

// 自动启动时间流逝（如果游戏正在运行）
export const initializeDateManager = () => {
  const gameState = GameStateManager.getCurrentState()
  
  
  if (gameState.isPlaying) {
    dateManager.startTimeFlow()
  }
  
  // 游戏状态检查现在由游戏引擎处理
}
