'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Brain, Zap, Target, Shield, Users, Clock, TrendingUp, Heart } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'
import { GameStateManager } from '../../config/data'
import ProgressBar, { getStepsForPage } from '../../components/ProgressBar'
import GameStatusBar from '../../components/GameStatusBar'

interface TrainingMethod {
  id: string
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
  imageUrl: string
  accuracy: number
  resources: number
  time: string
  difficulty: 'easy' | 'medium' | 'hard'
  pros: string[]
  cons: string[]
  effects?: {
    crimeRate: number // 犯罪率变化
    accuracy: number // 准确率变化
    communityTrust: number // 社区信任度变化
  }
}

const TRAINING_METHODS: TrainingMethod[] = [
  {
    id: 'gan',
    name: 'GAN (Generative Adversarial Network)',
    description: 'Using generative adversarial network, improving model performance through adversarial learning between generator and discriminator',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    imageUrl: '/city_overview.png',
    accuracy: 85,
    resources: 5,
    time: '2-3 days',
    difficulty: 'hard',
    pros: [
      'Generate high-quality synthetic data',
      'Improve model generalization',
      'Reduce data bias',
      'Strong adaptability'
    ],
    cons: [
      'Complex training process',
      'High computational resource requirements',
      'Long training time',
      'Difficult to debug'
    ],
    effects: {
      crimeRate: -15,
      accuracy: 20,
      communityTrust: -10
    }
  },
  {
    id: 'transformer',
    name: 'Transformer Architecture',
    description: 'Excellent performance in natural language processing and sequence modeling',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    imageUrl: '/city_overview3.png',
    accuracy: 88,
    resources: 4,
    time: '1-2 days',
    difficulty: 'medium',
    pros: [
      'High parallel computing efficiency',
      'Strong long-sequence processing capability',
      'Excellent attention mechanism',
      'Rich pre-trained models'
    ],
    cons: [
      'High memory consumption',
      'Large model parameters',
      'Relatively slow inference speed'
    ],
    effects: {
      crimeRate: -8,
      accuracy: 2,
      communityTrust: 5
    }
  },
  {
    id: 'supervision',
    name: 'Supervision Learning',
    description: 'Train AI models using labeled data to learn patterns and make predictions',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    imageUrl: '/city_overview2 .png',
    accuracy: 92,
    resources: 4,
    time: '1-2 days',
    difficulty: 'medium',
    pros: [
      'High accuracy with labeled data',
      'Strong pattern recognition',
      'Good interpretability',
      'Relatively low resource consumption'
    ],
    cons: [
      'Requires large labeled dataset',
      'Data labeling cost',
      'May overfit to training data',
      'Limited to labeled patterns'
    ],
    effects: {
      crimeRate: -5,
      accuracy: -10,
      communityTrust: 20
    }
  }
]

// Round 2 Training Methods (Threshold Adjustment)
const ROUND2_TRAINING_METHODS: TrainingMethod[] = [
  {
    id: 'lower-threshold',
    name: 'Lower Threshold',
    description: 'Reduce the decision threshold to increase detection sensitivity, catching more potential cases but with higher false positive risk.',
    icon: TrendingUp,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    imageUrl: '/city_overview.png',
    accuracy: 90,
    resources: 5,
    time: '1-2 days',
    difficulty: 'medium',
    pros: [
      'Higher detection rate',
      'Catches more cases',
      'Better crime prevention',
      'Comprehensive coverage'
    ],
    cons: [
      'Higher false positive rate',
      'May reduce community trust',
      'Resource intensive',
      'Potential over-policing'
    ],
    effects: {
      crimeRate: -15,
      accuracy: 20,
      communityTrust: -10
    }
  },
  {
    id: 'raise-threshold',
    name: 'Raise Threshold',
    description: 'Increase the decision threshold to reduce false positives, focusing only on high-confidence cases to maintain accuracy.',
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    imageUrl: '/city_overview3.png',
    accuracy: 95,
    resources: 4,
    time: '1-2 days',
    difficulty: 'medium',
    pros: [
      'Lower false positive rate',
      'Higher accuracy',
      'Better community trust',
      'More conservative approach'
    ],
    cons: [
      'May miss some cases',
      'Lower detection rate',
      'Potential crime increase',
      'Less comprehensive coverage'
    ],
    effects: {
      crimeRate: 5,
      accuracy: -5,
      communityTrust: 10
    }
  },
  {
    id: 'region-optimized-threshold',
    name: 'Region-Optimized Threshold',
    description: 'Apply different threshold levels optimized for specific regions based on local crime patterns and community characteristics.',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    imageUrl: '/city_overview2 .png',
    accuracy: 88,
    resources: 4,
    time: '1-2 days',
    difficulty: 'medium',
    pros: [
      'Adaptive to local conditions',
      'Balanced approach',
      'Better regional accuracy',
      'Context-aware decisions'
    ],
    cons: [
      'Complex implementation',
      'Requires regional data',
      'May reduce overall trust',
      'Moderate effectiveness'
    ],
    effects: {
      crimeRate: -10,
      accuracy: 10,
      communityTrust: -5
    }
  }
]

// 根据 round 获取对应的训练方法
const getTrainingMethodsForRound = (round: number): TrainingMethod[] => {
  if (round === 2) {
    return ROUND2_TRAINING_METHODS
  }
  return TRAINING_METHODS
}

export default function AITrainingMethodsPage() {
  const [trainingMethods, setTrainingMethods] = useState<TrainingMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<TrainingMethod | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)

  useEffect(() => {
    // 获取当前 round
    const gameState = GameStateManager.getCurrentState()
    const round = gameState.round
    setCurrentRound(round)
    
    // 根据 round 加载对应的训练方法
    const roundMethods = getTrainingMethodsForRound(round)
    setTrainingMethods(roundMethods)
    
    // 设置默认选择第一个
    if (roundMethods.length > 0) {
      setSelectedMethod(roundMethods[0])
    }
  }, [])

  const handleMethodSelect = (method: TrainingMethod) => {
    setSelectedMethod(method)
  }

  const handleConfirm = () => {
    if (selectedMethod) {
      // 保存选择的训练方式到localStorage
      localStorage.setItem('selectedMethod', JSON.stringify(selectedMethod))
      console.log(`已选择训练方式: ${selectedMethod.name} (仅视觉展示)`)
      
      // 添加退出动画
      setIsAnimating(true)
      setTimeout(() => {
        // 跳转到总结页面
        window.location.href = '/ai-summary'
      }, 300)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Easy'
      case 'medium': return 'Medium'
      case 'hard': return 'Hard'
      default: return 'Unknown'
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToRight : styles.slideInFromLeft}`}>
      {/* 游戏状态栏 */}
      <GameStatusBar />
      
      {/* 进度条 */}
      <ProgressBar steps={getStepsForPage('training')} />
      
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b mt-28">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/ai-dataset" 
                className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                onClick={(e) => {
                  e.preventDefault()
                  setIsAnimating(true)
                  setTimeout(() => {
                    window.location.href = '/ai-dataset'
                  }, 300)
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dataset Selection
              </Link>
            </div>
            
            {/* 选择按钮 */}
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Select Training Method
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容 - 左右分栏布局 */}
      <div className="flex-1 flex">
        {/* 左侧训练方式列表 */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Training Methods</h2>
            <div className="space-y-3">
              {trainingMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => handleMethodSelect(method)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedMethod?.id === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${method.bgColor}`}>
                      <method.icon className={`w-5 h-5 ${method.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{method.name}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{method.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Accuracy</span>
                      <span className="font-semibold text-green-600">{method.accuracy}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Resources</span>
                      <span className="font-semibold" style={{ color: '#FDE047' }}>{method.resources}/10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-semibold text-purple-600">{method.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Difficulty</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(method.difficulty)}`}>
                        {getDifficultyText(method.difficulty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧详情展示 */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedMethod ? (
            <div className="h-full flex flex-col">
              {/* 图片区域 */}
              <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50">
                <img
                  src={selectedMethod.imageUrl}
                  alt={selectedMethod.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedMethod.difficulty)}`}>
                    {getDifficultyText(selectedMethod.difficulty)}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${selectedMethod.bgColor}`}>
                        <selectedMethod.icon className={`w-6 h-6 ${selectedMethod.color}`} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedMethod.name}</h2>
                    </div>
                    <p className="text-gray-600 text-sm">{selectedMethod.description}</p>
                  </div>
                </div>
              </div>

              {/* 详细信息区域 */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl">
                  {/* 关键指标 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">{selectedMethod.accuracy}%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <Zap className="w-5 h-5" style={{ color: '#A1A1AA' }} />
                      </div>
                      <div className="text-2xl font-bold" style={{ color: '#FDE047' }}>{selectedMethod.resources}/10</div>
                      <div className="text-sm text-gray-600">Resources</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{selectedMethod.time}</div>
                      <div className="text-sm text-gray-600">Training Time</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{getDifficultyText(selectedMethod.difficulty)}</div>
                      <div className="text-sm text-gray-600">Difficulty</div>
                    </div>
                  </div>

                  {/* 效果显示 */}
                  {selectedMethod.effects && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Effects on Game State</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5" style={{ color: '#A1A1AA' }} />
                            <span className="text-sm font-medium text-gray-600">Crime Rate</span>
                          </div>
                          <div className={`text-2xl font-bold ${
                            selectedMethod.effects.crimeRate > 0 ? 'text-red-600' : 
                            selectedMethod.effects.crimeRate < 0 ? 'text-green-600' : 
                            'text-gray-600'
                          }`}>
                            {selectedMethod.effects.crimeRate > 0 ? '+' : ''}{selectedMethod.effects.crimeRate}%
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5" style={{ color: '#A1A1AA' }} />
                            <span className="text-sm font-medium text-gray-600">Accuracy</span>
                          </div>
                          <div className={`text-2xl font-bold ${
                            selectedMethod.effects.accuracy > 0 ? 'text-green-600' : 
                            selectedMethod.effects.accuracy < 0 ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {selectedMethod.effects.accuracy > 0 ? '+' : ''}{selectedMethod.effects.accuracy}%
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-5 h-5" style={{ color: '#A1A1AA' }} />
                            <span className="text-sm font-medium text-gray-600">Community Trust</span>
                          </div>
                          <div className={`text-2xl font-bold ${
                            selectedMethod.effects.communityTrust > 0 ? 'text-green-600' : 
                            selectedMethod.effects.communityTrust < 0 ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {selectedMethod.effects.communityTrust > 0 ? '+' : ''}{selectedMethod.effects.communityTrust}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 优缺点对比 */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Pros
                      </h3>
                      <ul className="space-y-2">
                        {selectedMethod.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        Cons
                      </h3>
                      <ul className="space-y-2">
                        {selectedMethod.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Please select a training method from the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}