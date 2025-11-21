'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Database, Brain, MapPin, Building, Eye, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'
import ProgressBar, { getStepsForPage } from '../../components/ProgressBar'
import GameStatusBar from '../../components/GameStatusBar'
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
      case 'easy': return 'Easy'
      case 'medium': return 'Medium'
      case 'hard': return 'Hard'
      default: return 'Unknown'
    }
  }

  const totalCost = (summaryData.selectedDataset?.cost || 0) + 
                   (summaryData.selectedMethod?.cost || 0) + 
                   (summaryData.selectedArea?.deploymentCost || 0)

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      {/* 游戏状态栏 */}
      <GameStatusBar />
      
      <ProgressBar steps={getStepsForPage('summary')} />
      
      <div className="bg-white shadow-sm border-b mt-28">
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
                Back to Deployment Area
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
              <p className="text-gray-600">Please confirm your AI deployment configuration</p>
            </div>

            {(!summaryData.selectedDataset || !summaryData.selectedMethod || !summaryData.selectedArea) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">Missing Selections</h3>
                    <p className="text-yellow-700">Please ensure you have completed all steps:</p>
                    <ul className="mt-2 text-sm text-yellow-700">
                      {!summaryData.selectedDataset && <li>• Dataset Selection</li>}
                      {!summaryData.selectedMethod && <li>• Training Method Selection</li>}
                      {!summaryData.selectedArea && <li>• Deployment Area Selection</li>}
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
                    <h2 className="text-xl font-bold text-gray-900">Dataset Selection</h2>
                    <p className="text-gray-600">{summaryData.selectedDataset.name}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="ml-2 font-semibold text-green-600">{summaryData.selectedDataset.accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Data Size:</span>
                    <span className="ml-2 font-semibold">{summaryData.selectedDataset.size.toLocaleString()} records</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cost:</span>
                    <span className="ml-2 font-semibold text-blue-600">¥{summaryData.selectedDataset.cost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Bias Level:</span>
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
                    <h2 className="text-xl font-bold text-gray-900">Training Method</h2>
                    <p className="text-gray-600">{summaryData.selectedMethod.name}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="ml-2 font-semibold text-green-600">{summaryData.selectedMethod.accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cost:</span>
                    <span className="ml-2 font-semibold text-blue-600">¥{summaryData.selectedMethod.cost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Training Time:</span>
                    <span className="ml-2 font-semibold text-purple-600">{summaryData.selectedMethod.time}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Difficulty:</span>
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
                    <h2 className="text-xl font-bold text-gray-900">Deployment Area</h2>
                    <p className="text-gray-600">{summaryData.selectedArea.name}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Population:</span>
                    <span className="ml-2 font-semibold">{summaryData.selectedArea.population.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Crime Rate:</span>
                    <span className="ml-2 font-semibold text-red-600">{summaryData.selectedArea.crimeRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Police Presence:</span>
                    <span className="ml-2 font-semibold text-blue-600">{summaryData.selectedArea.policePresence}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Surveillance Coverage:</span>
                    <span className="ml-2 font-semibold text-purple-600">{summaryData.selectedArea.surveillance}%</span>
                  </div>
                </div>
              </div>
            )}

            {(summaryData.selectedDataset || summaryData.selectedMethod || summaryData.selectedArea) && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  Cost Summary
                </h2>
                <div className="space-y-3">
                  {summaryData.selectedDataset && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Dataset Cost:</span>
                      <span className="font-semibold text-gray-900">¥{summaryData.selectedDataset.cost.toLocaleString()}</span>
                    </div>
                  )}
                  {summaryData.selectedMethod && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Training Method Cost:</span>
                      <span className="font-semibold text-gray-900">¥{summaryData.selectedMethod.cost.toLocaleString()}</span>
                    </div>
                  )}
                  {summaryData.selectedArea && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Deployment Cost:</span>
                      <span className="font-semibold text-gray-900">¥{summaryData.selectedArea.deploymentCost.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total Cost:</span>
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
                  Expected Results
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Deployment Effectiveness:</span>
                    <span className="font-bold text-2xl text-green-600">{summaryData.selectedArea.effectiveness}%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Expected Accuracy:</span>
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