'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Shield, TrendingUp, Zap, AlertTriangle, Target } from 'lucide-react'
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
  features: string[]
}

interface SummaryData {
  selectedStrategy: PoliceStrategy | null
}

// 根据策略 ID 获取对应的图标组件
const getStrategyIcon = (strategyId: string) => {
  switch (strategyId) {
    case 'hotspot_patrol':
      return Target
    case 'proportional_patrol':
      return Shield
    case 'random_patrol':
      return Zap
    default:
      return Shield
  }
}

export default function PoliceHQSummaryPage() {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    selectedStrategy: null
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const strategyStr = localStorage.getItem('policeHQSelectedStrategy')
        
        const strategy = strategyStr ? JSON.parse(strategyStr) : null
        
        setSummaryData({
          selectedStrategy: strategy
        })
      } catch (error) {
        console.error('解析localStorage数据失败:', error)
      }
      
      // 增加1秒加载时间，提升用户体验
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  const handleConfirm = () => {
    console.log('总结确认，准备部署 (仅视觉展示)')
    
    // 添加退出动画
    setIsAnimating(true)
    setTimeout(() => {
      // 跳转到部署状态页面
      window.location.href = '/police-hq/deployment-status'
    }, 300)
  }

  const totalResources = summaryData.selectedStrategy?.resources || 0

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      {/* 游戏状态栏 */}
      <GameStatusBar />
      
      <ProgressBar steps={getStepsForPage('summary', 'policehq')} />
      
      <div className="bg-white shadow-sm border-b mt-28">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/police-hq/strategy" 
                className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                onClick={(e) => {
                  e.preventDefault()
                  setIsAnimating(true)
                  setTimeout(() => {
                    window.location.href = '/police-hq/strategy'
                  }, 300)
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Strategy
              </Link>
            </div>
            
            <button
              onClick={handleConfirm}
              disabled={!summaryData.selectedStrategy}
              className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 shadow-lg ${
                summaryData.selectedStrategy
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              Confirm & Deploy
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your selections...</p>
            </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Selection Summary</h1>
              <p className="text-gray-600">Please confirm your police strategy configuration</p>
            </div>

            {!summaryData.selectedStrategy && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">Missing Selection</h3>
                    <p className="text-yellow-700">Please ensure you have completed the strategy selection step.</p>
                  </div>
                </div>
              </div>
            )}

            {summaryData.selectedStrategy && (() => {
              const StrategyIcon = getStrategyIcon(summaryData.selectedStrategy.id)
              return (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${summaryData.selectedStrategy.bgColor}`}>
                      <StrategyIcon className={`w-6 h-6 ${summaryData.selectedStrategy.color}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Police Strategy</h2>
                      <p className="text-gray-600">{summaryData.selectedStrategy.name}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                  </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Resources:</span>
                    <span className="ml-2 font-semibold text-blue-600">{summaryData.selectedStrategy.resources}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Criminal:</span>
                    <span className="ml-2 font-semibold text-red-600">{summaryData.selectedStrategy.crimeReduction > 0 ? '-' : '+'}{Math.abs(summaryData.selectedStrategy.crimeReduction)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Accuracy:</span>
                    <span className={`ml-2 font-semibold ${summaryData.selectedStrategy.accuracyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summaryData.selectedStrategy.accuracyChange >= 0 ? '+' : ''}{summaryData.selectedStrategy.accuracyChange}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Trust:</span>
                    <span className={`ml-2 font-semibold ${summaryData.selectedStrategy.trustChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summaryData.selectedStrategy.trustChange >= 0 ? '+' : ''}{summaryData.selectedStrategy.trustChange}
                    </span>
                  </div>
                </div>
                </div>
              )
            })()}

            {summaryData.selectedStrategy && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  Resources Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Strategy Resources:</span>
                    <span className="font-semibold text-gray-900">{summaryData.selectedStrategy.resources}/10</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total Resources:</span>
                      <span className="text-2xl font-bold text-blue-600">{totalResources}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {summaryData.selectedStrategy && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Expected Results
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Crime Reduction:</span>
                    <span className="font-bold text-2xl text-red-600">
                      {summaryData.selectedStrategy.crimeReduction > 0 ? '-' : '+'}{Math.abs(summaryData.selectedStrategy.crimeReduction)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Accuracy Change:</span>
                    <span className={`font-bold text-2xl ${summaryData.selectedStrategy.accuracyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summaryData.selectedStrategy.accuracyChange >= 0 ? '+' : ''}{summaryData.selectedStrategy.accuracyChange}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Trust Change:</span>
                    <span className={`font-bold text-2xl ${summaryData.selectedStrategy.trustChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summaryData.selectedStrategy.trustChange >= 0 ? '+' : ''}{summaryData.selectedStrategy.trustChange}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

