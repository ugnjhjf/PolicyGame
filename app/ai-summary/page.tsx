'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Database, Brain, MapPin, Building, Eye, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'
import ProgressBar, { getStepsForPage } from '../../components/ProgressBar'
import { type DatasetInfo } from '../../config/ai/datasetConfig'

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
}

interface DeploymentArea {
  id: string
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
  population: number
  crimeRate: number
  policePresence: number
  surveillance: number
  deploymentCost: number
  effectiveness: number
}

interface SummaryData {
  selectedDataset: DatasetInfo | null
  selectedMethod: TrainingMethod | null
  selectedArea: DeploymentArea | null
}

export default function AISummaryPage() {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    selectedDataset: null,
    selectedMethod: null,
    selectedArea: null
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const datasetStr = localStorage.getItem('selectedDataset')
        const methodStr = localStorage.getItem('selectedMethod')
        const areaStr = localStorage.getItem('selectedArea')
        
        const dataset = datasetStr ? JSON.parse(datasetStr) : null
        const method = methodStr ? JSON.parse(methodStr) : null
        const area = areaStr ? JSON.parse(areaStr) : null
        
        setSummaryData({
          selectedDataset: dataset,
          selectedMethod: method,
          selectedArea: area
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
      window.location.href = '/deployment-status'
    }, 300)
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

  const totalCost = (summaryData.selectedDataset?.cost || 0) + 
                   (summaryData.selectedMethod?.cost || 0) + 
                   (summaryData.selectedArea?.deploymentCost || 0)

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      <ProgressBar steps={getStepsForPage('summary')} />
      
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/deployment" 
                className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                onClick={(e) => {
                  e.preventDefault()
                  setIsAnimating(true)
                  setTimeout(() => {
                    window.location.href = '/deployment'
                  }, 300)
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                返回部署区域选择
              </Link>
            </div>
            
            <button
              onClick={handleConfirm}
              disabled={!summaryData.selectedDataset || !summaryData.selectedMethod || !summaryData.selectedArea}
              className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 shadow-lg ${
                summaryData.selectedDataset && summaryData.selectedMethod && summaryData.selectedArea
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              确认并部署
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载您的选择...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">选择总结</h1>
              <p className="text-gray-600">请确认您的AI部署配置</p>
            </div>

            {(!summaryData.selectedDataset || !summaryData.selectedMethod || !summaryData.selectedArea) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">缺少选择信息</h3>
                    <p className="text-yellow-700">请确保您已完成所有步骤的选择：</p>
                    <ul className="mt-2 text-sm text-yellow-700">
                      {!summaryData.selectedDataset && <li>• 数据集选择</li>}
                      {!summaryData.selectedMethod && <li>• AI训练方式选择</li>}
                      {!summaryData.selectedArea && <li>• 部署区域选择</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {summaryData.selectedDataset && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">数据集选择</h2>
                    <p className="text-gray-600">{summaryData.selectedDataset.name}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">准确率:</span>
                    <span className="ml-2 font-semibold text-green-600">{summaryData.selectedDataset.accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">数据量:</span>
                    <span className="ml-2 font-semibold">{summaryData.selectedDataset.size.toLocaleString()}条</span>
                  </div>
                  <div>
                    <span className="text-gray-600">成本:</span>
                    <span className="ml-2 font-semibold text-blue-600">¥{summaryData.selectedDataset.cost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">偏见程度:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${summaryData.selectedDataset.bias === 'low' ? 'bg-green-100 text-green-600' : summaryData.selectedDataset.bias === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                      {summaryData.selectedDataset.bias}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {summaryData.selectedMethod && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">AI训练方式</h2>
                    <p className="text-gray-600">{summaryData.selectedMethod.name}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">准确率:</span>
                    <span className="ml-2 font-semibold text-green-600">{summaryData.selectedMethod.accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">成本:</span>
                    <span className="ml-2 font-semibold text-blue-600">¥{summaryData.selectedMethod.cost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">训练时间:</span>
                    <span className="ml-2 font-semibold text-purple-600">{summaryData.selectedMethod.time}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">难度:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getDifficultyColor(summaryData.selectedMethod.difficulty)}`}>
                      {getDifficultyText(summaryData.selectedMethod.difficulty)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {summaryData.selectedArea && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">部署区域</h2>
                    <p className="text-gray-600">{summaryData.selectedArea.name}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">人口:</span>
                    <span className="ml-2 font-semibold">{summaryData.selectedArea.population.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">犯罪率:</span>
                    <span className="ml-2 font-semibold text-red-600">{summaryData.selectedArea.crimeRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">警力覆盖:</span>
                    <span className="ml-2 font-semibold text-blue-600">{summaryData.selectedArea.policePresence}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">监控覆盖:</span>
                    <span className="ml-2 font-semibold text-purple-600">{summaryData.selectedArea.surveillance}%</span>
                  </div>
                </div>
              </div>
            )}

            {(summaryData.selectedDataset || summaryData.selectedMethod || summaryData.selectedArea) && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  成本总结
                </h2>
                <div className="space-y-3">
                  {summaryData.selectedDataset && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">数据集成本:</span>
                      <span className="font-semibold text-gray-900">¥{summaryData.selectedDataset.cost.toLocaleString()}</span>
                    </div>
                  )}
                  {summaryData.selectedMethod && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">训练方式成本:</span>
                      <span className="font-semibold text-gray-900">¥{summaryData.selectedMethod.cost.toLocaleString()}</span>
                    </div>
                  )}
                  {summaryData.selectedArea && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">部署成本:</span>
                      <span className="font-semibold text-gray-900">¥{summaryData.selectedArea.deploymentCost.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">总成本:</span>
                      <span className="text-2xl font-bold text-blue-600">¥{totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {summaryData.selectedArea && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  预期效果
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">部署效果:</span>
                    <span className="font-bold text-2xl text-green-600">{summaryData.selectedArea.effectiveness}%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">预计准确率:</span>
                    <span className="font-bold text-2xl text-blue-600">
                      {summaryData.selectedMethod ? summaryData.selectedMethod.accuracy : 0}%
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