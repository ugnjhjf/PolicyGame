'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, DollarSign, Users, Target, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'
import { AI_DATASETS, type DatasetInfo } from '../../config/ai/datasetConfig'

export default function AIDatasetPage() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetInfo | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleDatasetSelect = (dataset: DatasetInfo) => {
    setSelectedDataset(dataset)
    setShowModal(true)
  }

  const handleConfirm = () => {
    if (selectedDataset) {
      // 纯视觉展示，不进行任何游戏数值操作
      console.log(`已选择数据集: ${selectedDataset.name} (仅视觉展示)`)
      // 跳转到训练方式选择页面
      window.location.href = '/ai-training-methods'
    }
    setShowModal(false)
    setSelectedDataset(null)
  }

  const handleClose = () => {
    setShowModal(false)
    setSelectedDataset(null)
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
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/game" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              返回游戏
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">AI数据集选择</h1>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">选择AI训练数据集</h2>
          <p className="text-gray-600">选择合适的数据集来训练您的AI模型，不同的数据集将影响模型的性能和偏见程度。</p>
        </div>

        {/* 数据集列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_DATASETS.map((dataset) => (
            <div
              key={dataset.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleDatasetSelect(dataset)}
            >
              {/* 数据集图片 */}
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={dataset.imageUrl}
                  alt={dataset.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  {dataset.recommended ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getBiasColor(dataset.bias)}`}>
                    偏见: {dataset.bias}
                  </div>
                </div>
              </div>

              {/* 数据集信息 */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(dataset.type)}
                  <h3 className="text-lg font-semibold text-gray-900">{dataset.name}</h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dataset.description}</p>
                
                {/* 数据集指标 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">准确率:</span>
                    <span className="font-medium">{dataset.accuracy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">数据量:</span>
                    <span className="font-medium">{dataset.size.toLocaleString()}条</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">成本:</span>
                    <span className="font-medium flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {dataset.cost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 数据集详情弹窗 */}
      {showModal && selectedDataset && (
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
              {/* 数据集图片 */}
              <div className="mb-6">
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <img
                    src={selectedDataset.imageUrl}
                    alt={selectedDataset.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {selectedDataset.recommended ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* 数据集标题 */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedDataset.name}</h2>

              {/* 数据集描述 */}
              <div className="text-gray-700 leading-relaxed mb-6">
                {selectedDataset.description}
              </div>

              {/* 数据集详细信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* 基本指标 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">基本指标</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">准确率:</span>
                      <span className="font-medium">{selectedDataset.accuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">数据量:</span>
                      <span className="font-medium">{selectedDataset.size.toLocaleString()}条</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">成本:</span>
                      <span className="font-medium flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {selectedDataset.cost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">偏见程度:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBiasColor(selectedDataset.bias)}`}>
                        {selectedDataset.bias}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 特征列表 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">数据特征</h3>
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
                    优点
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
                    缺点
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

              {/* 确认按钮 */}
              <div className="flex justify-center">
                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  选择此数据集
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
