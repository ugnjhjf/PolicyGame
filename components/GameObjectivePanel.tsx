'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Circle } from 'lucide-react'
import { GameStateManager, type GameState } from '../config/data'

interface ObjectivePanelProps {
  className?: string
}

export default function GameObjectivePanel({ className = '' }: ObjectivePanelProps) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isDataCenterCompleted, setIsDataCenterCompleted] = useState(false)

  useEffect(() => {
    // 初始化游戏状态
    setGameState(GameStateManager.getCurrentState())
    
    // 检查 Data Center 是否完成（检查是否完成了整个流程：数据集、训练方式、部署区域）
    const checkDataCenterCompletion = () => {
      if (typeof window !== 'undefined') {
        const hasDataset = localStorage.getItem('selectedDataset') !== null
        const hasMethod = localStorage.getItem('selectedMethod') !== null
        const hasArea = localStorage.getItem('selectedArea') !== null
        setIsDataCenterCompleted(hasDataset && hasMethod && hasArea)
      }
    }
    
    checkDataCenterCompletion()
    
    // 定期检查状态更新（每500ms）
    const interval = setInterval(() => {
      setGameState(GameStateManager.getCurrentState())
      checkDataCenterCompletion()
    }, 500)
    
    // 监听 localStorage 变化
    const handleStorageChange = () => {
      checkDataCenterCompletion()
    }
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  if (!gameState) return null

  // 检查目标是否完成
  const isCrimeRateMet = gameState.crimeRate < 30
  const isAccuracyMet = gameState.arrestAccuracy > 60
  const isTrustMet = gameState.communityTrust > 40

  return (
    <div className={`fixed left-6 top-20 z-20 flex flex-col gap-4 ${className}`}>
      {/* Game Objective 方块 */}
      <div style={{
        backdropFilter: 'blur(4px) saturate(100%)',
        background: 'rgba(39, 39, 42, 0.75)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '16px',
        minWidth: '280px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#E4E4E7' }}>
          Game Objective
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {isCrimeRateMet ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-xs font-medium" style={{ color: '#A1A1AA' }}>
              Objective 1:
            </span>
            <div className="text-xs" style={{ color: '#E4E4E7' }}>
              Crime rate: &lt; 30%
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAccuracyMet ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-xs font-medium" style={{ color: '#A1A1AA' }}>
              Objective 2:
            </span>
            <div className="text-xs" style={{ color: '#E4E4E7' }}>
              Accurate rate: &gt; 60%
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isTrustMet ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-xs font-medium" style={{ color: '#A1A1AA' }}>
              Objective 3:
            </span>
            <div className="text-xs" style={{ color: '#E4E4E7' }}>
              Trust rate: &gt; 40%
            </div>
          </div>
        </div>
      </div>

      {/* Progress 方块 */}
      <div style={{
        backdropFilter: 'blur(4px) saturate(100%)',
        background: 'rgba(39, 39, 42, 0.75)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '16px',
        minWidth: '280px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#E4E4E7' }}>
          To-do list
        </h3>
        <div className="space-y-3">
          {/* Data Center */}
          <div className="flex items-center gap-3">
            {isDataCenterCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-sm" style={{ color: '#E4E4E7' }}>
              Data Center
            </span>
          </div>
          
          {/* Policy HQ */}
          <div className="flex items-center gap-3">
            <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="text-sm" style={{ color: '#E4E4E7' }}>
              Policy HQ
            </span>
          </div>
          
          {/* Government Complex */}
          <div className="flex items-center gap-3">
            <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="text-sm" style={{ color: '#E4E4E7' }}>
              Government Complex
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

