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
  pros: string[] // 优点
  cons: string[] // 缺点
  recommended: boolean // 是否推荐
  effects?: {
    crimeRate: number // 犯罪率变化
    accuracy: number // 准确率变化
    communityTrust: number // 社区信任度变化
  }
}

export const AI_DATASETS: DatasetInfo[] = [
  {
    id: 'criminal-history',
    name: 'Criminal History Database',
    description: 'Comprehensive database containing all criminal records from the past 5 years, covering detailed information on crime types, time, location, suspect characteristics, and more.',
    imageUrl: '/background/Introduction.png', // 使用现有图片作为示例
    type: 'criminal',
    size: 50000,
    accuracy: 85,
    bias: 'high',
    resources: 3,
    pros: ['Comprehensive data', 'Complete history', 'Strong pattern recognition'],
    cons: ['May contain historical bias', 'Low update frequency'],
    recommended: true,
    effects: {
      crimeRate: -10,
      accuracy: 15,
      communityTrust: -10
    }
  },
  {
    id: 'behavioral-patterns',
    name: 'Behavioral Pattern Analysis',
    description: 'Machine learning training set based on community behavioral data, focusing on identifying abnormal behavior patterns and potential risk indicators.',
    imageUrl: '/background/Introduction.png',
    type: 'behavioral',
    size: 75000,
    accuracy: 78,
    bias: 'low',
    resources: 4,
    pros: ['Strong real-time capability', 'Less bias', 'Accurate predictions'],
    cons: ['Privacy sensitive', 'Difficult data collection'],
    recommended: false,
    effects: {
      crimeRate: -8,
      accuracy: 10,
      communityTrust: 0
    }
  },
  {
    id: 'geographic-hotspots',
    name: 'Geographic Hotspot Analysis',
    description: 'Spatial data analysis set combining geographic information systems and crime heat maps, used to identify high-risk areas.',
    imageUrl: '/background/Introduction.png',
    type: 'geographic',
    size: 40000,
    accuracy: 80,
    bias: 'medium',
    resources: 3,
    pros: ['Strong spatial analysis', 'Good visualization', 'High practicality'],
    cons: ['Geographic limitations', 'Environmental dependency'],
    recommended: true,
    effects: {
      crimeRate: -3,
      accuracy: -5,
      communityTrust: 15
    }
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

// Round 2 Data Cleaning 选项
export const ROUND2_DATASETS: DatasetInfo[] = [
  {
    id: 'no-data-cleaning',
    name: 'No Data Cleaning',
    description: 'Use raw data without any cleaning or preprocessing. This approach preserves all original data but may include noise and bias.',
    imageUrl: '/background/Introduction.png',
    type: 'criminal',
    size: 50000,
    accuracy: 75,
    bias: 'high',
    resources: 3,
    pros: ['Preserves all data', 'No data loss', 'Quick to implement', 'Low resource cost'],
    cons: ['May contain noise', 'High bias risk', 'Lower accuracy', 'Potential fairness issues'],
    recommended: false,
    effects: {
      crimeRate: -5,
      accuracy: 10,
      communityTrust: -5
    }
  },
  {
    id: 'remove-sensitive-data',
    name: 'Remove Sensitive Data',
    description: 'Remove sensitive personal information and protected attributes from the dataset to reduce privacy concerns and potential discrimination.',
    imageUrl: '/background/Introduction.png',
    type: 'behavioral',
    size: 45000,
    accuracy: 70,
    bias: 'medium',
    resources: 4,
    pros: ['Better privacy protection', 'Reduced discrimination risk', 'Compliance with regulations', 'Improved community trust'],
    cons: ['Lower accuracy', 'May lose important patterns', 'Higher crime rate risk', 'Data quality reduction'],
    recommended: true,
    effects: {
      crimeRate: 10,
      accuracy: -10,
      communityTrust: 10
    }
  },
  {
    id: 'community-co-labeling',
    name: 'Community Representative Co-labeling',
    description: 'Engage community representatives to collaboratively label and review data, ensuring diverse perspectives and reducing bias.',
    imageUrl: '/background/Introduction.png',
    type: 'geographic',
    size: 50000,
    accuracy: 85,
    bias: 'low',
    resources: 4,
    pros: ['Community involvement', 'Reduced bias', 'Higher accuracy', 'Strong community trust'],
    cons: ['Time consuming', 'Requires coordination', 'Higher resource cost', 'Complex process'],
    recommended: true,
    effects: {
      crimeRate: -10,
      accuracy: 10,
      communityTrust: 15
    }
  }
]

// 根据 round 获取对应的数据集
export const getDatasetsForRound = (round: number): DatasetInfo[] => {
  if (round === 2) {
    return ROUND2_DATASETS
  }
  return AI_DATASETS
}
