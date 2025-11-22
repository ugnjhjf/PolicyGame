'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Shield, Users, Target, AlertTriangle, Zap, Clock } from 'lucide-react'
import Link from 'next/link'
import styles from '../../../styles/animations.module.css'
import ProgressBar, { getStepsForPage } from '../../../components/ProgressBar'
import GameStatusBar from '../../../components/GameStatusBar'

interface PoliceStrategy {
  id: string
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
  resources: number
  crimeReduction: number
  accuracyChange: number
  trustChange: number
  pros: string[]
  cons: string[]
}

const POLICE_STRATEGIES: PoliceStrategy[] = [
  {
    id: 'hotspot_patrol',
    name: 'Hotspot Patrol',
    description: 'Focus police patrols on high-crime areas and known criminal hotspots to maximize crime reduction',
    icon: Target,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    resources: 4,
    crimeReduction: 15,
    accuracyChange: 5,
    trustChange: -10,
    pros: [
      'High crime reduction in target areas',
      'Effective against known hotspots',
      'Quick visible results',
      'Strong deterrent effect'
    ],
    cons: [
      'May reduce community trust',
      'Can displace crime to other areas',
      'May create tension with communities',
      'Requires accurate hotspot identification'
    ]
  },
  {
    id: 'proportional_patrol',
    name: 'Proportional Patrol',
    description: 'Distribute police patrols proportionally based on area population and crime statistics',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    resources: 3,
    crimeReduction: 8,
    accuracyChange: 2,
    trustChange: 5,
    pros: [
      'Balanced resource allocation',
      'Fair distribution of police presence',
      'Moderate crime reduction',
      'Maintains community trust'
    ],
    cons: [
      'May not address high-crime areas effectively',
      'Limited impact on crime hotspots',
      'Requires accurate data for distribution',
      'Moderate effectiveness overall'
    ]
  },
  {
    id: 'random_patrol',
    name: 'Random Patrol',
    description: 'Deploy police patrols randomly across different areas to create unpredictability and deter crime',
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    resources: 2,
    crimeReduction: 5,
    accuracyChange: -3,
    trustChange: 8,
    pros: [
      'Low resource consumption',
      'Unpredictable presence deters crime',
      'Improves community trust',
      'Covers wide area'
    ],
    cons: [
      'Limited crime reduction',
      'May miss high-crime areas',
      'Less effective than targeted approaches',
      'Lower overall effectiveness'
    ]
  }
]

export default function PoliceStrategyPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<PoliceStrategy | null>(POLICE_STRATEGIES[0]) // 默认选择第一个
  const [isAnimating, setIsAnimating] = useState(false)

  const handleStrategySelect = (strategy: PoliceStrategy) => {
    setSelectedStrategy(strategy)
  }

  const handleConfirm = () => {
    if (selectedStrategy) {
      // 保存选择的策略到localStorage
      localStorage.setItem('policeHQSelectedStrategy', JSON.stringify(selectedStrategy))
      console.log(`已选择警察策略: ${selectedStrategy.name} (仅视觉展示)`)
      
      // 添加退出动画
      setIsAnimating(true)
      setTimeout(() => {
        // 跳转到总结页面
        window.location.href = '/police-hq/summary'
      }, 300)
    }
  }

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 80) return 'text-green-600 bg-green-100'
    if (effectiveness >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getEffectivenessText = (effectiveness: number) => {
    if (effectiveness >= 80) return 'Excellent'
    if (effectiveness >= 70) return 'Good'
    return 'Fair'
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      {/* 游戏状态栏 */}
      <GameStatusBar />
      
      {/* 进度条 */}
      <ProgressBar steps={getStepsForPage('strategy', 'policehq')} />
      
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b mt-28">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/game" 
                className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                onClick={(e) => {
                  e.preventDefault()
                  setIsAnimating(true)
                  setTimeout(() => {
                    window.location.href = '/game'
                  }, 300)
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Game
              </Link>
            </div>
            
            {/* 选择按钮 */}
            {selectedStrategy && (
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Select Strategy
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧策略列表 */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Police Strategies</h2>
            <p className="text-sm text-gray-600">Select a strategy to deploy police forces</p>
          </div>
          
          <div className="space-y-1 p-2">
            {POLICE_STRATEGIES.map((strategy) => (
              <div
                key={strategy.id}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedStrategy?.id === strategy.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                onClick={() => handleStrategySelect(strategy)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-lg ${strategy.bgColor}`}>
                      <strategy.icon className={`w-5 h-5 ${strategy.color}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{strategy.name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Resources: {strategy.resources}/10</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="text-red-600">Criminal: {strategy.crimeReduction > 0 ? '-' : '+'}{Math.abs(strategy.crimeReduction)}</span>
                      <span className={`${strategy.accuracyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>Accuracy: {strategy.accuracyChange >= 0 ? '+' : ''}{strategy.accuracyChange}</span>
                      <span className={`${strategy.trustChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>Trust: {strategy.trustChange >= 0 ? '+' : ''}{strategy.trustChange}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧详情展示 */}
        <div className="flex-1 flex flex-col">
          {selectedStrategy ? (
            <>
              {/* 策略图片 */}
              <div className="h-64 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  <div className={`p-8 rounded-2xl ${selectedStrategy.bgColor}`}>
                    <selectedStrategy.icon className={`w-24 h-24 ${selectedStrategy.color}`} />
                  </div>
                </div>
              </div>

              {/* 策略详细信息 */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl">
                  {/* 标题和类型 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${selectedStrategy.bgColor}`}>
                      <selectedStrategy.icon className={`w-8 h-8 ${selectedStrategy.color}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStrategy.name}</h2>
                  </div>

                  {/* 描述 */}
                  <div className="text-gray-700 leading-relaxed mb-6">
                    {selectedStrategy.description}
                  </div>

                  {/* 关键指标 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Resources:</span>
                          <span className="font-medium text-lg">{selectedStrategy.resources}/10</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Criminal:</span>
                          <span className="font-medium text-lg text-red-600">{selectedStrategy.crimeReduction > 0 ? '-' : '+'}{Math.abs(selectedStrategy.crimeReduction)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Accuracy:</span>
                          <span className={`font-medium text-lg ${selectedStrategy.accuracyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedStrategy.accuracyChange >= 0 ? '+' : ''}{selectedStrategy.accuracyChange}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Trust:</span>
                          <span className={`font-medium text-lg ${selectedStrategy.trustChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedStrategy.trustChange >= 0 ? '+' : ''}{selectedStrategy.trustChange}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 优缺点 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Pros
                      </h3>
                      <ul className="space-y-2">
                        {selectedStrategy.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Cons
                      </h3>
                      <ul className="space-y-2">
                        {selectedStrategy.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select Strategy</h3>
                <p className="text-gray-600">Please select a strategy from the list on the left to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

