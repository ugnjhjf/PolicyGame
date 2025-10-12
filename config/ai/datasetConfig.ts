// AI数据集配置

export interface DatasetInfo {
  id: string
  name: string
  description: string
  imageUrl: string
  type: 'criminal' | 'behavioral' | 'demographic' | 'geographic'
  size: number // 数据集大小（条数）
  accuracy: number // 准确率（百分比）
  bias: 'low' | 'medium' | 'high' // 偏见程度
  cost: number // 成本
  features: string[] // 特征列表
  pros: string[] // 优点
  cons: string[] // 缺点
  recommended: boolean // 是否推荐
}

export const AI_DATASETS: DatasetInfo[] = [
  {
    id: 'criminal-history',
    name: '犯罪历史数据库',
    description: '包含过去5年所有犯罪记录的综合数据库，涵盖犯罪类型、时间、地点、嫌疑人特征等详细信息。',
    imageUrl: '/Introduction.png', // 使用现有图片作为示例
    type: 'criminal',
    size: 50000,
    accuracy: 85,
    bias: 'medium',
    cost: 10000,
    features: ['犯罪类型', '时间模式', '地点分布', '嫌疑人特征', '案件关联'],
    pros: ['数据全面', '历史完整', '模式识别强'],
    cons: ['可能存在历史偏见', '更新频率低'],
    recommended: true
  },
  {
    id: 'behavioral-patterns',
    name: '行为模式分析集',
    description: '基于社区行为数据的机器学习训练集，专注于识别异常行为模式和潜在风险指标。',
    imageUrl: '/Introduction.png',
    type: 'behavioral',
    size: 75000,
    accuracy: 78,
    bias: 'low',
    cost: 15000,
    features: ['行为轨迹', '时间规律', '社交网络', '活动模式', '异常检测'],
    pros: ['实时性强', '偏见较少', '预测准确'],
    cons: ['隐私敏感', '数据收集困难'],
    recommended: false
  },
  {
    id: 'demographic-profiles',
    name: '人口统计档案',
    description: '基于人口普查和社区调查的详细人口统计信息，用于分析犯罪与人口特征的关系。',
    imageUrl: '/Introduction.png',
    type: 'demographic',
    size: 30000,
    accuracy: 72,
    bias: 'high',
    cost: 5000,
    features: ['年龄分布', '收入水平', '教育程度', '职业类型', '居住区域'],
    pros: ['成本低廉', '数据稳定', '覆盖面广'],
    cons: ['偏见严重', '更新缓慢', '隐私问题'],
    recommended: false
  },
  {
    id: 'geographic-hotspots',
    name: '地理热点分析',
    description: '结合地理信息系统和犯罪热力图的空间数据分析集，用于识别高风险区域。',
    imageUrl: '/Introduction.png',
    type: 'geographic',
    size: 40000,
    accuracy: 80,
    bias: 'medium',
    cost: 8000,
    features: ['地理位置', '犯罪密度', '时间分布', '环境因素', '交通模式'],
    pros: ['空间分析强', '可视化好', '实用性强'],
    cons: ['地域局限', '环境依赖'],
    recommended: true
  }
]

export const getDatasetById = (id: string): DatasetInfo | undefined => {
  return AI_DATASETS.find(dataset => dataset.id === id)
}

export const getRecommendedDatasets = (): DatasetInfo[] => {
  return AI_DATASETS.filter(dataset => dataset.recommended)
}

export const getDatasetsByType = (type: DatasetInfo['type']): DatasetInfo[] => {
  return AI_DATASETS.filter(dataset => dataset.type === type)
}
