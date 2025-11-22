'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Users, Target, TrendingUp, Heart, Zap, Database, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'
import { getDatasetsForRound, type DatasetInfo } from '../../config/ai/datasetConfig'
import { GameStateManager } from '../../config/data'
import ProgressBar, { getStepsForPage } from '../../components/ProgressBar'
import GameStatusBar from '../../components/GameStatusBar'

export default function AIDatasetPage() {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([])
  const [selectedDataset, setSelectedDataset] = useState<DatasetInfo | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)

  useEffect(() => {
    // 获取当前 round
    const gameState = GameStateManager.getCurrentState()
    const round = gameState.round
    setCurrentRound(round)
    
    // 根据 round 加载对应的数据集
    const roundDatasets = getDatasetsForRound(round)
    setDatasets(roundDatasets)
    
    // 设置默认选择第一个
    if (roundDatasets.length > 0) {
      setSelectedDataset(roundDatasets[0])
    }
  }, [])

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

  const getBiasTextColor = (bias: string) => {
    switch (bias) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
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
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {currentRound === 2 ? 'Data Cleaning Options' : 'Dataset List'}
            </h2>
            <p className="text-sm text-gray-600">
              {currentRound === 2 
                ? 'Select a data cleaning approach for your dataset'
                : 'Select a suitable dataset to train your AI model'}
            </p>
          </div>
          
          <div className="space-y-1 p-2">
            {datasets.map((dataset) => (
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
                      <span>Resources: {dataset.resources}/10</span>
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
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedDataset ? (
            <div className="h-full flex flex-col">
              {/* 图片区域 */}
              <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50">
                <img
                  src={selectedDataset.imageUrl}
                  alt={selectedDataset.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getBiasColor(selectedDataset.bias)}`}>
                    Bias: {selectedDataset.bias}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${
                        selectedDataset.type === 'criminal' ? 'bg-purple-100' :
                        selectedDataset.type === 'behavioral' ? 'bg-blue-100' :
                        selectedDataset.type === 'geographic' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        {selectedDataset.type === 'criminal' ? (
                          <Target className={`w-6 h-6 text-purple-600`} />
                        ) : selectedDataset.type === 'behavioral' ? (
                          <Users className={`w-6 h-6 text-blue-600`} />
                        ) : selectedDataset.type === 'geographic' ? (
                          <Target className={`w-6 h-6 text-yellow-600`} />
                        ) : (
                          <Target className={`w-6 h-6 text-gray-600`} />
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedDataset.name}</h2>
                    </div>
                    <p className="text-gray-600 text-sm">{selectedDataset.description}</p>
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
                      <div className="text-2xl font-bold text-green-600">{selectedDataset.accuracy}%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <Database className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{selectedDataset.size.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Data Size</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <Zap className="w-5 h-5" style={{ color: '#A1A1AA' }} />
                      </div>
                      <div className="text-2xl font-bold" style={{ color: '#FDE047' }}>{selectedDataset.resources}/10</div>
                      <div className="text-sm text-gray-600">Resources</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <AlertTriangle className="w-5 h-5 text-gray-900" />
                      </div>
                      <div className={`text-2xl font-bold ${getBiasTextColor(selectedDataset.bias)}`}>
                        {selectedDataset.bias}
                      </div>
                      <div className="text-sm text-gray-600">Bias Level</div>
                    </div>
                  </div>

                  {/* 效果显示 */}
                  {selectedDataset.effects && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Effects on Game State</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5" style={{ color: '#A1A1AA' }} />
                            <span className="text-sm font-medium text-gray-600">Crime Rate</span>
                          </div>
                          <div className={`text-2xl font-bold ${
                            selectedDataset.effects.crimeRate > 0 ? 'text-red-600' : 
                            selectedDataset.effects.crimeRate < 0 ? 'text-green-600' : 
                            'text-gray-600'
                          }`}>
                            {selectedDataset.effects.crimeRate > 0 ? '+' : ''}{selectedDataset.effects.crimeRate}%
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5" style={{ color: '#A1A1AA' }} />
                            <span className="text-sm font-medium text-gray-600">Accuracy</span>
                          </div>
                          <div className={`text-2xl font-bold ${
                            selectedDataset.effects.accuracy > 0 ? 'text-green-600' : 
                            selectedDataset.effects.accuracy < 0 ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {selectedDataset.effects.accuracy > 0 ? '+' : ''}{selectedDataset.effects.accuracy}%
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-5 h-5" style={{ color: '#A1A1AA' }} />
                            <span className="text-sm font-medium text-gray-600">Community Trust</span>
                          </div>
                          <div className={`text-2xl font-bold ${
                            selectedDataset.effects.communityTrust > 0 ? 'text-green-600' : 
                            selectedDataset.effects.communityTrust < 0 ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {selectedDataset.effects.communityTrust > 0 ? '+' : ''}{selectedDataset.effects.communityTrust}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Please select a dataset from the left</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
