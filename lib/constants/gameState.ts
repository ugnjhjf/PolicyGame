// 游戏状态常量
export const INITIAL_GAME_STATE = {
  date: '2024-01-15',
  actionPoints: 5,
  money: 125000,
  caseCount: 23,
  arrests: 8,
  crimeRate: 12.5,
  arrestAccuracy: 78.3,
  communityTrust: 65.2
} as const

// 游戏配置常量
export const GAME_CONFIG = {
  MAX_ACTION_POINTS: 10,
  MIN_MONEY: 0,
  MAX_CRIME_RATE: 100,
  MAX_ACCURACY: 100,
  MAX_TRUST: 100
} as const

// 状态栏图标配置
export const STATUS_ICONS = {
  date: 'Calendar',
  actionPoints: 'Zap',
  money: 'DollarSign',
  caseCount: 'FileText',
  arrests: 'Users',
  crimeRate: 'TrendingUp',
  arrestAccuracy: 'Target',
  communityTrust: 'Heart'
} as const
