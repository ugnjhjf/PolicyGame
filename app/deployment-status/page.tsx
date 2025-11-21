'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, Database, Brain, Settings, RotateCcw, TestTube, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'
import ProgressBar, { getStepsForPage } from '../../components/ProgressBar'
import GameStatusBar from '../../components/GameStatusBar'

interface LoadingStage {
  id: string
  title: string
  description: string
  icon: any
  color: string
  bgColor: string
}

const LOADING_STAGES: LoadingStage[] = [
  {
    id: 'import',
    title: 'Importing Training Data',
    description: 'Importing training samples from the selected dataset, preparing for model training...',
    icon: Database,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'train',
    title: 'Training Model',
    description: 'Training the AI model using the selected training method, optimizing model parameters...',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 'adjust',
    title: 'Adjusting Parameters',
    description: 'Adjusting model hyperparameters based on training results to improve model performance...',
    icon: Settings,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    id: 'retrain',
    title: 'Retraining',
    description: 'Retraining the model with optimized parameters to ensure the best results...',
    icon: RotateCcw,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    id: 'test',
    title: 'Testing Results',
    description: 'Validating model performance on the test set, evaluating accuracy and effectiveness...',
    icon: TestTube,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 'complete',
    title: 'Complete',
    description: 'AI model training completed and successfully deployed to the selected area!',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }
]

export default function DeploymentStatusPage() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showText, setShowText] = useState(true)

  useEffect(() => {
    const runDeploymentProcess = async () => {
      // 12秒总时长，每2秒一个阶段
      for (let i = 0; i < LOADING_STAGES.length; i++) {
        // 显示当前阶段
        setCurrentStageIndex(i)
        setShowText(true)
        
        // 等待2秒
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 如果不是最后一个阶段，添加淡化效果
        if (i < LOADING_STAGES.length - 1) {
          setShowText(false)
          await new Promise(resolve => setTimeout(resolve, 300)) // 淡化时间
        }
      }
      
      // 完成部署
      setIsLoading(false)
    }
    
    runDeploymentProcess()
  }, [])

  const handleReturnToGame = () => {
    setIsAnimating(true)
    setTimeout(() => {
      window.location.href = '/game'
    }, 300)
  }

  const currentStage = LOADING_STAGES[currentStageIndex]

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      {/* 游戏状态栏 */}
      <GameStatusBar />
      
      {/* 进度条 */}
      <ProgressBar steps={getStepsForPage('status')} />
      
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b mt-28">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {!isLoading && (
              <button
                onClick={handleReturnToGame}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Back to Game
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          {/* 加载动画 */}
          {isLoading && (
            <div className="mb-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`p-3 rounded-full ${currentStage.bgColor}`}>
                    <currentStage.icon className={`w-8 h-8 ${currentStage.color}`} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 阶段标题和描述 */}
          {isLoading && (
            <div className="min-h-[120px] flex flex-col justify-center">
              <div 
                className={`transition-all duration-500 ${
                  showText ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                }`}
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentStage.title}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {currentStage.description}
                </p>
              </div>
            </div>
          )}

          {/* 进度指示器 */}
          {isLoading && (
            <div className="mt-8">
              <div className="flex justify-center space-x-2 mb-4">
                {LOADING_STAGES.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index <= currentStageIndex 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Step {currentStageIndex + 1} / {LOADING_STAGES.length}
              </p>
            </div>
          )}

          {/* 完成状态 */}
          {!isLoading && (
            <div className={`mt-8 ${styles.fadeIn}`}>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Deployment Complete!</h2>
                <p className="text-green-700">
                  The AI model has been successfully deployed to the selected area. You can now start using AI-assisted decision-making features.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
