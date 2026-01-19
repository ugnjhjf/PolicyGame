'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Circle } from 'lucide-react'
import { GameStateManager, type GameState, GAME_CONFIG } from '../config/data'

interface ObjectivePanelProps {
  className?: string
  tasks?: {
    zhangCompleted: boolean
    chanCompleted: boolean
    michaelCompleted: boolean
  }
  onTaskClick?: (taskId: string) => void
}

export default function GameObjectivePanel({ className = '', tasks, onTaskClick }: ObjectivePanelProps) {
  const [gameState, setGameState] = useState<GameState | null>(null)

  useEffect(() => {
    // 初始化游戏状态
    setGameState(GameStateManager.getCurrentState())

    // 定期检查状态更新（每500ms）
    const interval = setInterval(() => {
      const currentState = GameStateManager.getCurrentState()
      setGameState(currentState)
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (!gameState) return null

  // 检查目标是否完成
  const isCrimeRateMet = gameState.crimeRate < 30
  const isAccuracyMet = gameState.arrestAccuracy > 60
  const isTrustMet = gameState.communityTrust > 40

  const { zhangCompleted, chanCompleted, michaelCompleted } = tasks || { zhangCompleted: false, chanCompleted: false, michaelCompleted: false }

  const handleTaskClick = (taskId: string) => {
    if (onTaskClick) {
      onTaskClick(taskId)
    }
  }

  return (
    <div className={`fixed left-6 top-20 z-20 flex flex-col gap-4 ${className}`}>


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
          {/* Aunt Zhang */}
          <div
            onClick={() => handleTaskClick('aunt_zhang')}
            className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
          >
            {zhangCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-sm" style={{ color: '#E4E4E7' }}>
              Talk to Aunt Zhang
            </span>
          </div>

          {/* Officer Chan */}
          <div
            onClick={() => handleTaskClick('officer_chan')}
            className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
          >
            {chanCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-sm" style={{ color: '#E4E4E7' }}>
              Talk to Officer Chan
            </span>
          </div>

          {/* Michael */}
          <div
            onClick={() => handleTaskClick('michael')}
            className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
          >
            {michaelCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-sm" style={{ color: '#E4E4E7' }}>
              Talk to Michael
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

