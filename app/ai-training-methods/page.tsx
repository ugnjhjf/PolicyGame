'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Brain, Zap, Target, Shield, Users, DollarSign, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'
import ProgressBar, { getStepsForPage } from '../../components/ProgressBar'

interface TrainingMethod {
  id: string
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
  imageUrl: string
  accuracy: number
  cost: number
  time: string
  difficulty: 'easy' | 'medium' | 'hard'
  pros: string[]
  cons: string[]
  features: string[]
}

const TRAINING_METHODS: TrainingMethod[] = [
  {
    id: 'gan',
    name: 'GAN (生成对抗网络)',
    description: '使用生成对抗网络技术训练AI模型，通过生成器和判别器的对抗学习提高模型性能',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    imageUrl: '/city_overview.png',
    accuracy: 85,
    cost: 15000,
    time: '2-3天',
    difficulty: 'hard',
    pros: [
      '生成高质量合成数据',
      '提高模型泛化能力',
      '减少数据偏见',
      '适应性强'
    ],
    cons: [
      '训练复杂',
      '计算资源需求大',
      '训练时间长',
      '调试困难'
    ],
    features: ['数据增强', '对抗训练', '生成模型', '深度学习']
  },
  {
    id: 'rag',
    name: 'RAG (检索增强生成)',
    description: '结合检索和生成技术，通过外部知识库增强AI模型的推理和决策能力',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    imageUrl: '/city_overview2 .png',
    accuracy: 92,
    cost: 12000,
    time: '1-2天',
    difficulty: 'medium',
    pros: [
      '知识更新及时',
      '推理能力强',
      '可解释性好',
      '成本相对较低'
    ],
    cons: [
      '依赖外部知识库',
      '检索延迟',
      '知识库维护成本',
      '可能检索到错误信息'
    ],
    features: ['知识检索', '增强生成', '实时更新', '可解释AI']
  },
  {
    id: 'transformer',
    name: 'Transformer架构',
    description: '基于注意力机制的深度学习架构，在自然语言处理和序列建模方面表现优异',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    imageUrl: '/city_overview3.png',
    accuracy: 88,
    cost: 10000,
    time: '1-2天',
    difficulty: 'medium',
    pros: [
      '并行计算效率高',
      '长序列处理能力强',
      '注意力机制优秀',
      '预训练模型丰富'
    ],
    cons: [
      '内存消耗大',
      '模型参数量大',
      '推理速度相对较慢'
    ],
    features: ['注意力机制', '并行计算', '序列建模', '预训练模型']
  },
  {
    id: 'federated',
    name: '联邦学习',
    description: '分布式机器学习方法，在保护数据隐私的同时实现多源数据协同训练',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    imageUrl: '/city_overview.png',
    accuracy: 80,
    cost: 8000,
    time: '3-5天',
    difficulty: 'hard',
    pros: [
      '保护数据隐私',
      '多源数据协同',
      '降低通信成本',
      '符合法规要求'
    ],
    cons: [
      '通信开销大',
      '模型收敛慢',
      '数据异构性挑战',
      '安全性要求高'
    ],
    features: ['隐私保护', '分布式训练', '数据协同', '安全通信']
  },
  {
    id: 'ensemble',
    name: '集成学习',
    description: '结合多个基础模型的预测结果，通过投票或平均等方式提高整体性能',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    imageUrl: '/city_overview2 .png',
    accuracy: 90,
    cost: 6000,
    time: '1天',
    difficulty: 'easy',
    pros: [
      '实现简单',
      '性能稳定',
      '成本较低',
      '易于理解和调试'
    ],
    cons: [
      '计算资源需求大',
      '模型存储空间大',
      '训练时间长',
      '可能过拟合'
    ],
    features: ['多模型融合', '投票机制', '性能稳定', '易于实现']
  }
]

export default function AITrainingMethodsPage() {
  const [selectedMethod, setSelectedMethod] = useState<TrainingMethod | null>(TRAINING_METHODS[0]) // 默认选择第一个
  const [isAnimating, setIsAnimating] = useState(false)

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
        // 跳转到部署区域页面
        window.location.href = '/deployment'
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
      case 'easy': return '简单'
      case 'medium': return '中等'
      case 'hard': return '困难'
      default: return '未知'
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToRight : styles.slideInFromLeft}`}>
      {/* 进度条 */}
      <ProgressBar steps={getStepsForPage('training')} />
      
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
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
                返回数据集选择
              </Link>
            </div>
            
            {/* 选择按钮 */}
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              选择此训练方式
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">训练方式列表</h2>
            <div className="space-y-3">
              {TRAINING_METHODS.map((method) => (
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
                      <span className="text-gray-600">准确率</span>
                      <span className="font-semibold text-green-600">{method.accuracy}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">成本</span>
                      <span className="font-semibold text-blue-600">¥{method.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">时间</span>
                      <span className="font-semibold text-purple-600">{method.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">难度</span>
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
                      <div className="text-sm text-gray-600">准确率</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">¥{selectedMethod.cost.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">成本</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{selectedMethod.time}</div>
                      <div className="text-sm text-gray-600">训练时间</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{getDifficultyText(selectedMethod.difficulty)}</div>
                      <div className="text-sm text-gray-600">难度</div>
                    </div>
                  </div>

                  {/* 优缺点对比 */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        优势
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
                        劣势
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

                  {/* 技术特性 */}
                  <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">技术特性</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMethod.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">请从左侧选择一个训练方式</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}