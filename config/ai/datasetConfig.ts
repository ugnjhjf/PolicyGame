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
  resources: number // 资源消耗
  features: string[] // 特征列表
  pros: string[] // 优点
  cons: string[] // 缺点
  recommended: boolean // 是否推荐
}

export const AI_DATASETS: DatasetInfo[] = [
  {
    id: 'criminal-history',
    name: 'Criminal History Database',
    description: 'Comprehensive database containing all criminal records from the past 5 years, covering detailed information on crime types, time, location, suspect characteristics, and more.',
    imageUrl: '/Introduction.png', // 使用现有图片作为示例
    type: 'criminal',
    size: 50000,
    accuracy: 85,
    bias: 'medium',
    resources: 3,
    features: ['Crime Type', 'Time Patterns', 'Location Distribution', 'Suspect Characteristics', 'Case Correlation'],
    pros: ['Comprehensive data', 'Complete history', 'Strong pattern recognition'],
    cons: ['May contain historical bias', 'Low update frequency'],
    recommended: true
  },
  {
    id: 'behavioral-patterns',
    name: 'Behavioral Pattern Analysis',
    description: 'Machine learning training set based on community behavioral data, focusing on identifying abnormal behavior patterns and potential risk indicators.',
    imageUrl: '/Introduction.png',
    type: 'behavioral',
    size: 75000,
    accuracy: 78,
    bias: 'low',
    resources: 4,
    features: ['Behavior Trajectory', 'Time Patterns', 'Social Networks', 'Activity Patterns', 'Anomaly Detection'],
    pros: ['Strong real-time capability', 'Less bias', 'Accurate predictions'],
    cons: ['Privacy sensitive', 'Difficult data collection'],
    recommended: false
  },
  {
    id: 'demographic-profiles',
    name: 'Demographic Profiles',
    description: 'Detailed demographic information based on census and community surveys, used to analyze the relationship between crime and population characteristics.',
    imageUrl: '/Introduction.png',
    type: 'demographic',
    size: 30000,
    accuracy: 72,
    bias: 'high',
    resources: 2,
    features: ['Age Distribution', 'Income Level', 'Education Level', 'Occupation Type', 'Residential Area'],
    pros: ['Low resource consumption', 'Stable data', 'Wide coverage'],
    cons: ['Severe bias', 'Slow updates', 'Privacy concerns'],
    recommended: false
  },
  {
    id: 'geographic-hotspots',
    name: 'Geographic Hotspot Analysis',
    description: 'Spatial data analysis set combining geographic information systems and crime heat maps, used to identify high-risk areas.',
    imageUrl: '/Introduction.png',
    type: 'geographic',
    size: 40000,
    accuracy: 80,
    bias: 'medium',
    resources: 3,
    features: ['Geographic Location', 'Crime Density', 'Time Distribution', 'Environmental Factors', 'Traffic Patterns'],
    pros: ['Strong spatial analysis', 'Good visualization', 'High practicality'],
    cons: ['Geographic limitations', 'Environmental dependency'],
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
