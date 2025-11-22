'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Trophy, AlertTriangle, XCircle, CheckCircle, Target, Heart, Shield } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'
import GameStatusBar from '../../components/GameStatusBar'
import { GAME_CONFIG } from '../../config/data/gameConfig'

interface RoundData {
  round: number
  label?: string
  crimeRate: number
  arrestAccuracy: number
  communityTrust: number
  resources: number
}

type EndingType = 'good-governance' | 'bias' | 'inefficiency'

interface EndingInfo {
  type: EndingType
  title: string
  description: string
  icon: any
  color: string
  bgColor: string
  borderColor: string
  textColor: string
}

export default function GameEndingPage() {
  const [finalData, setFinalData] = useState<RoundData | null>(null)
  const [endingType, setEndingType] = useState<EndingType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const loadFinalData = async () => {
      if (typeof window !== 'undefined') {
        // 优先从当前游戏状态获取最新数据（因为用户可能通过调试面板修改了状态）
        const { GameStateManager } = await import('../../config/data/gameState')
        const currentState = GameStateManager.getCurrentState()
        
        // 如果当前回合是第三回合或更高，使用当前状态
        // 否则尝试从localStorage加载保存的第三回合数据
        let finalData: RoundData | null = null
        
        if (currentState.round >= GAME_CONFIG.maxRounds) {
          // 使用当前游戏状态
          finalData = {
            round: GAME_CONFIG.maxRounds,
            label: `After Round ${GAME_CONFIG.maxRounds}`,
            crimeRate: currentState.crimeRate,
            arrestAccuracy: currentState.arrestAccuracy,
            communityTrust: currentState.communityTrust,
            resources: currentState.resources
          }
        } else {
          // 尝试从localStorage加载第三回合的保存数据
          const roundDataKey = `roundData_round${GAME_CONFIG.maxRounds}`
          const saved = localStorage.getItem(roundDataKey)
          
          if (saved) {
            try {
              const parsed = JSON.parse(saved)
              finalData = parsed
            } catch (error) {
              console.error('Failed to parse final round data:', error)
            }
          }
        }
        
        // 如果还是没有数据，使用当前状态作为后备
        if (!finalData) {
          finalData = {
            round: GAME_CONFIG.maxRounds,
            label: `After Round ${GAME_CONFIG.maxRounds}`,
            crimeRate: currentState.crimeRate,
            arrestAccuracy: currentState.arrestAccuracy,
            communityTrust: currentState.communityTrust,
            resources: currentState.resources
          }
        }
        
        setFinalData(finalData)
        
        // 判断结局类型
        const ending = determineEnding(finalData)
        setEndingType(ending)
      }
      
      // 增加1秒加载时间，提升用户体验
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsLoading(false)
    }

    loadFinalData()
  }, [])

  // 判断结局类型
  const determineEnding = (data: RoundData): EndingType => {
    const { crimeRate, communityTrust, arrestAccuracy } = data
    
    // 调试日志
    console.log('Ending determination:', {
      crimeRate,
      communityTrust,
      arrestAccuracy,
      goodGovernance: crimeRate < 20 && communityTrust >= 80 && arrestAccuracy >= 75,
      bias: communityTrust < 40,
      inefficiency: crimeRate > 60 && arrestAccuracy < 60 && communityTrust >= 40
    })
    
    // 优先级1: 良好治理 - 所有指标都达到优秀标准
    // 使用 >= 而不是 >，因为边界值（如80.0, 75.0）应该算作优秀
    if (crimeRate < 20 && communityTrust >= 80 && arrestAccuracy >= 75) {
      return 'good-governance'
    }
    
    // 优先级2: 偏见结局 - 信任度极低（无论其他指标如何）
    // 注意：如果同时满足良好治理条件，已在上面返回，不会到这里
    if (communityTrust < 40) {
      return 'bias'
    }
    
    // 优先级3: 效率不佳 - 犯罪率高且准确率低
    // 且信任度 >= 40%（否则会被偏见结局捕获）
    if (crimeRate > 60 && arrestAccuracy < 60 && communityTrust >= 40) {
      return 'inefficiency'
    }
    
    // 默认：效率不佳（所有其他情况）
    // 包括：
    // - 信任度 >= 40%，但犯罪率 <= 60% 或准确率 >= 60%
    // - 其他未明确分类的情况
    return 'inefficiency'
  }

  // 获取结局信息
  const getEndingInfo = (type: EndingType): EndingInfo => {
    switch (type) {
      case 'good-governance':
        return {
          type: 'good-governance',
          title: 'Good Governance',
          description: 'AI effectively assisted human resources, and society generally accepted it. Through reasonable AI deployment and strategy selection, you successfully reduced crime rates, improved law enforcement accuracy, and won community trust. This is an ideal governance outcome.',
          icon: Trophy,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        }
      case 'bias':
        return {
          type: 'bias',
          title: 'Bias Ending',
          description: 'Community distrust. Although the AI system may be effective in some aspects, the community has developed serious distrust of the AI system\'s use. This may be due to data bias, excessive surveillance, or other factors that have deteriorated community relations.',
          icon: AlertTriangle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800'
        }
      case 'inefficiency':
        return {
          type: 'inefficiency',
          title: 'Inefficiency',
          description: 'Still human-dominated. The AI system failed to effectively improve law enforcement efficiency, crime rates remain high, and accuracy did not meet expectations. The system may lack sufficient data support or poor strategy selection, resulting in poor overall performance.',
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        }
    }
  }

  const endingInfo = endingType ? getEndingInfo(endingType) : null
  const EndingIcon = endingInfo?.icon || Trophy

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      {/* 游戏状态栏 */}
      <GameStatusBar />
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading game ending...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto max-w-4xl">
            {/* 结局展示卡片 */}
            {endingInfo && finalData && (
              <div className={`rounded-2xl shadow-xl border-2 ${endingInfo.borderColor} ${endingInfo.bgColor} p-8 mb-6`}>
                {/* 图标和标题 */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${endingInfo.bgColor} border-4 ${endingInfo.borderColor} mb-4`}>
                    <EndingIcon className={`w-12 h-12 ${endingInfo.color}`} />
                  </div>
                  <h1 className={`text-5xl font-bold mb-2 ${endingInfo.textColor}`}>
                    {endingInfo.title}
                  </h1>
                  <p className={`text-lg ${endingInfo.textColor} opacity-80 max-w-2xl mx-auto leading-relaxed`}>
                    {endingInfo.description}
                  </p>
                </div>

                {/* 最终指标展示 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-gray-600">Crime Rate</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {finalData.crimeRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {finalData.crimeRate < 20 ? '✓ Excellent' : finalData.crimeRate < 30 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </div>
                  
                  <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">Accuracy</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {finalData.arrestAccuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {finalData.arrestAccuracy > 75 ? '✓ Excellent' : finalData.arrestAccuracy > 60 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </div>
                  
                  <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-pink-600" />
                      <span className="text-sm font-medium text-gray-600">Trust</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {finalData.communityTrust.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {finalData.communityTrust > 80 ? '✓ Excellent' : finalData.communityTrust > 40 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </div>
                </div>

                {/* 查看详细结果按钮 */}
                <div className="mt-8 text-center">
                  <Link
                    href="/game-result"
                    className={`inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg ${
                      endingInfo.type === 'good-governance' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : endingInfo.type === 'bias'
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      setIsAnimating(true)
                      setTimeout(() => {
                        window.location.href = '/game-result'
                      }, 300)
                    }}
                  >
                    <span>View Detailed Results</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}

            {/* 如果没有数据 */}
            {!finalData && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <p className="text-yellow-800">No game data found. Please complete the game to view the ending.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

