'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Brain, Zap, Target, Shield, Users, DollarSign, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'

interface TrainingMethod {
  id: string
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
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
      '训练复杂度高',
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
      '依赖外部数据源',
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
      '训练数据需求多',
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
      '协调复杂度高',
      '通信开销大',
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
      '推理时间较长',
      '性能提升有限'
    ],
    features: ['多模型融合', '投票机制', '性能稳定', '易于实现']
  }
]

export default function AITrainingMethodsPage() {
  const [selectedMethod, setSelectedMethod] = useState<TrainingMethod | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleMethodSelect = (method: TrainingMethod) => {
    setSelectedMethod(method)
    setShowModal(true)
  }

  const handleConfirm = () => {
    if (selectedMethod) {
      // 纯视觉展示，不进行任何游戏数值操作
      console.log(`已选择训练方式: ${selectedMethod.name} (仅视觉展示)`)
      
      // 添加退出动画
      setIsAnimating(true)
      setTimeout(() => {
        alert(`已选择训练方式: ${selectedMethod.name}\n\n注意：这只是视觉展示，不会影响游戏数值`)
      }, 300)
    }
    setShowModal(false)
    setSelectedMethod(null)
  }

  const handleClose = () => {
    setShowModal(false)
    setSelectedMethod(null)
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
    <div className={`min-h-screen bg-gray-50 ${isAnimating ? styles.slideOutToRight : styles.slideInFromLeft}`}>
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/ai-dataset" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
            <h1 className="text-2xl font-bold text-gray-900">AI训练方式选择</h1>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">选择AI训练方式</h2>
          <p className="text-gray-600">选择适合的训练方式来训练您的AI模型，不同的训练方式将影响模型的性能、成本和训练时间。</p>
        </div>

        {/* 训练方式列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRAINING_METHODS.map((method) => {
            const IconComponent = method.icon
            return (
              <div
                key={method.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => handleMethodSelect(method)}
              >
                {/* 训练方式图标和标题 */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${method.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${method.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(method.difficulty)}`}>
                        难度: {getDifficultyText(method.difficulty)}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{method.description}</p>
                  
                  {/* 训练方式指标 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">准确率:</span>
                      <span className="font-medium">{method.accuracy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">成本:</span>
                      <span className="font-medium flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {method.cost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">训练时间:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {method.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 训练方式详情弹窗 */}
      {showModal && selectedMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* 弹窗内容 */}
          <div className={`relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto ${styles.gpuAccelerated}`}>
            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
            >
              <XCircle className="w-5 h-5" />
            </button>

            {/* 弹窗内容 */}
            <div className="p-6">
              {/* 训练方式标题和图标 */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-lg ${selectedMethod.bgColor}`}>
                  <selectedMethod.icon className={`w-8 h-8 ${selectedMethod.color}`} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedMethod.name}</h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedMethod.difficulty)}`}>
                    难度: {getDifficultyText(selectedMethod.difficulty)}
                  </div>
                </div>
              </div>

              {/* 训练方式描述 */}
              <div className="text-gray-700 leading-relaxed mb-6">
                {selectedMethod.description}
              </div>

              {/* 训练方式详细信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* 基本指标 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">基本指标</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">准确率:</span>
                      <span className="font-medium">{selectedMethod.accuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">成本:</span>
                      <span className="font-medium flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {selectedMethod.cost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">训练时间:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedMethod.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">难度:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedMethod.difficulty)}`}>
                        {getDifficultyText(selectedMethod.difficulty)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 技术特征 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">技术特征</h3>
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

              {/* 优缺点 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    优点
                  </h3>
                  <ul className="space-y-2">
                    {selectedMethod.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    缺点
                  </h3>
                  <ul className="space-y-2">
                    {selectedMethod.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 确认按钮 */}
              <div className="flex justify-center">
                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  选择此训练方式
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
