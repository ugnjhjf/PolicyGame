'use client'

import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, Users, Shield, Clock, TrendingUp, Zap } from 'lucide-react'
import { GameStateManager } from '../../../config/data'
import styles from '../../../styles/animations.module.css'
import eventData from './crime-surge-event.json'

interface EventOption {
  id: string
  title: string
  description: string
  resources: number
  effects: {
    crimeRate: number
    communityTrust: number
    resources: number
  }
  requirements: {
    resources: number
  }
}

interface CrimeSurgeEventProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (optionId: string) => void
}

export default function CrimeSurgeEvent({ isOpen, onClose, onComplete }: CrimeSurgeEventProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [gameState, setGameState] = useState(GameStateManager.getCurrentState())
  const hasAppliedCrimeIncrease = useRef(false)

  // 初始化游戏状态（移除实时同步）
  useEffect(() => {
    setGameState(GameStateManager.getCurrentState())
  }, [])

  // 事件触发时自动应用犯罪率上升20%（只执行一次）
  useEffect(() => {
    if (isOpen && !hasAppliedCrimeIncrease.current) {
      const currentState = GameStateManager.getCurrentState()
      const newCrimeRate = Math.min(100, currentState.crimeRate + 20)
      console.log(`犯罪率上升: ${currentState.crimeRate}% -> ${newCrimeRate}%`)
      GameStateManager.updateState({
        crimeRate: newCrimeRate
      })
      hasAppliedCrimeIncrease.current = true
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOptionSelect = (option: EventOption) => {
    setSelectedOption(option.id)
  }

  const handleConfirm = () => {
    if (selectedOption) {
      const option = eventData.options.find(opt => opt.id === selectedOption)
      if (option) {
        // 检查资源是否足够
        if (gameState.resources >= option.requirements.resources) {
          
          // 应用效果
          GameStateManager.updateState({
            crimeRate: Math.max(0, gameState.crimeRate + option.effects.crimeRate),
            communityTrust: Math.max(0, Math.min(100, gameState.communityTrust + option.effects.communityTrust)),
            resources: gameState.resources + option.effects.resources
          })
          
          onComplete(selectedOption)
        } else {
          alert('资源不足，无法执行此选项！')
        }
      }
    }
  }

  const canAfford = (option: EventOption) => {
    return gameState.resources >= option.requirements.resources
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 事件弹窗 */}
      <div className={`relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto ${styles.gpuAccelerated}`}>
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
        >
          <AlertTriangle className="w-5 h-5" />
        </button>

        {/* 弹窗内容 */}
        <div className="p-6">
          {/* 紧急状态提示 */}
          <div className="mb-4 flex justify-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 border border-red-300 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-800">紧急事件 - 游戏已自动暂停</span>
            </div>
          </div>

          {/* 事件图片 */}
          <div className="mb-6">
            <div className="relative overflow-hidden rounded-lg shadow-md">
              <img
                src={eventData.imageUrl}
                alt={eventData.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-6 h-6" />
                  <span className="text-xl font-bold">紧急状态</span>
                </div>
                <p className="text-sm opacity-90">犯罪率上升 {eventData.details.crimeIncrease}</p>
              </div>
            </div>
          </div>

          {/* 事件标题 */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{eventData.title}</h2>

          {/* 事件描述 */}
          <div className="text-gray-700 leading-relaxed mb-6">
            {eventData.description}
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">犯罪率上升</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{eventData.details.crimeIncrease}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">报告案件</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{eventData.details.reportedCases}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">警力缺口</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{eventData.details.policeShortage}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">响应时间</span>
              </div>
              <div className="text-2xl font-bold text-gray-600">{eventData.details.responseTime}</div>
            </div>
          </div>

          {/* 选项列表 */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">选择应对策略</h3>
            <div className="space-y-3">
              {eventData.options.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedOption === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : canAfford(option)
                      ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      : 'border-red-200 bg-red-50 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => canAfford(option) && handleOptionSelect(option)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{option.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-blue-600">
                          <Zap className="w-4 h-4" />
                          <span>资源: {option.resources}</span>
                        </div>
                      </div>
                    </div>
                    {selectedOption === option.id && (
                      <div className="ml-4 text-blue-500">
                        <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-100 flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 确认按钮 */}
          <div className="flex justify-center">
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className={`px-8 py-3 font-medium rounded-lg transition-all duration-200 ${
                selectedOption
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedOption ? '执行策略' : '请选择一个策略'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
