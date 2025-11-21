'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, DollarSign, Users, Target, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'
import { AI_DATASETS, type DatasetInfo } from '../../config/ai/datasetConfig'
import ProgressBar, { getStepsForPage } from '../../components/ProgressBar'
import GameStatusBar from '../../components/GameStatusBar'

export default function AIDatasetPage() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetInfo | null>(AI_DATASETS[0]) // 默认选择第一个
  const [isAnimating, setIsAnimating] = useState(false)

  const handleDatasetSelect = (dataset: DatasetInfo) => {
    setSelectedDataset(dataset)
  }

  const handleConfirm = () => {
    if (selectedDataset) {
      // 保存选择的数据集到localStorage
      localStorage.setItem('selectedDataset', JSON.stringify(selectedDataset))
      console.log(`已选择数据集: ${selectedDataset.name} (仅视觉展示)`)
      
      // 添加退出动画
      setIsAnimating(true)
      setTimeout(() => {
        // 跳转到训练方式选择页面
        window.location.href = '/ai-training-methods'
      }, 300)
    }
  }


  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'criminal': return <Target className="w-5 h-5" />
      case 'behavioral': return <Users className="w-5 h-5" />
      case 'demographic': return <Users className="w-5 h-5" />
      case 'geographic': return <Target className="w-5 h-5" />
      default: return <Target className="w-5 h-5" />
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      {/* 游戏状态栏 */}
      <GameStatusBar />
      
      {/* 进度条 */}
      <ProgressBar steps={getStepsForPage('dataset')} />
      
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
                Back to main page
              </Link>
            </div>
            
            {/* 选择按钮 */}
            {selectedDataset && (
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Select Dataset
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧数据集列表 */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Dataset List</h2>
            <p className="text-sm text-gray-600">Select a suitable dataset to train your AI model</p>
          </div>
          
          <div className="space-y-1 p-2">
            {AI_DATASETS.map((dataset) => (
              <div
                key={dataset.id}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedDataset?.id === dataset.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                onClick={() => handleDatasetSelect(dataset)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getTypeIcon(dataset.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{dataset.name}</h3>
                      {dataset.recommended && (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Accuracy: {dataset.accuracy}%</span>
                      <span>Cost: ${dataset.cost.toLocaleString()}</span>
                    </div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getBiasColor(dataset.bias)}`}>
                      Bias: {dataset.bias}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧详情展示 */}
        <div className="flex-1 flex flex-col">
          {selectedDataset ? (
            <>
              {/* 数据集图片 */}
              <div className="h-64 bg-gray-100 relative overflow-hidden">
                <img
                  src={selectedDataset.imageUrl}
                  alt={selectedDataset.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  {selectedDataset.recommended ? (
                    <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full p-1" />
                  ) : (
                    <XCircle className="w-8 h-8 text-gray-400 bg-white rounded-full p-1" />
                  )}
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getBiasColor(selectedDataset.bias)} bg-white/90`}>
                    Bias Level: {selectedDataset.bias}
                  </div>
                </div>
              </div>

              {/* 数据集详细信息 */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl">
                  {/* 标题和类型 */}
                  <div className="flex items-center gap-3 mb-4">
                    {getTypeIcon(selectedDataset.type)}
                    <h2 className="text-2xl font-bold text-gray-900">{selectedDataset.name}</h2>
                  </div>

                  {/* 描述 */}
                  <div className="text-gray-700 leading-relaxed mb-6">
                    {selectedDataset.description}
                  </div>

                  {/* 基本指标 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Basic Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Accuracy:</span>
                          <span className="font-medium text-lg">{selectedDataset.accuracy}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Data Size:</span>
                          <span className="font-medium text-lg">{selectedDataset.size.toLocaleString()} records</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Cost:</span>
                          <span className="font-medium text-lg flex items-center gap-1">
                            <DollarSign className="w-5 h-5" />
                            {selectedDataset.cost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Bias Level:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBiasColor(selectedDataset.bias)}`}>
                            {selectedDataset.bias}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 特征列表 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Data Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDataset.features.map((feature, index) => (
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
                        Pros
                      </h3>
                      <ul className="space-y-2">
                        {selectedDataset.pros.map((pro, index) => (
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
                        {selectedDataset.cons.map((con, index) => (
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
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select Dataset</h3>
                <p className="text-gray-600">Please select a dataset from the left list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
