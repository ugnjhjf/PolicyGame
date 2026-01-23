'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  isVisible?: boolean
}

export default function GameObjectivePanel({ className = '', tasks, onTaskClick, isVisible = true }: ObjectivePanelProps) {
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1.15,
            originX: 0,
            originY: 0
          }}
          exit={{ opacity: 0, x: -50 }}
          transition={{
            opacity: { duration: 0.5 },
            x: { duration: 0.5 }
          }}
          className={`fixed left-6 top-20 z-20 flex flex-col gap-4 ${className}`}
        >

          {/* Progress Panel with Blinking Highlight */}
          <motion.div
            style={{
              position: 'relative',
              backdropFilter: 'blur(4px) saturate(100%)',
              background: 'rgba(39, 39, 42, 0.75)',
              borderRadius: '8px',
              padding: '16px',
              minWidth: '280px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
            animate={{
              borderColor: [
                'rgba(255,255,255,0.05)',
                'rgba(234, 179, 8, 0.8)', // yellow-500
                'rgba(255,255,255,0.05)'
              ],
              boxShadow: [
                '0 0 0 rgba(0,0,0,0)',
                '0 0 15px rgba(234, 179, 8, 0.3)', // yellow glow
                '0 0 0 rgba(0,0,0,0)'
              ]
            }}
            transition={{
              duration: 1,
              repeat: 3,
              times: [0, 0.5, 1],
              ease: "easeInOut"
            }}
          >
            <h3 className="text-l font-semibold mb-1" style={{ color: '#66CCFF' }}>
              Task 1
            </h3>
            <h3 className="text-l font-semibold mb-3" style={{ color: '#E4E4E7' }}>
              Meet with the community
            </h3>
            <hr className="border-white/10 mb-4" />
            <div className="space-y-3">
              {/* Aunt Zhang */}
              <div
                onClick={() => handleTaskClick('aunt_zhang')}
                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
              >
                <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <AnimatePresence mode="wait">
                    {zhangCompleted ? (
                      <motion.div
                        key="connected"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: [0.5, 1.2, 1] }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.4, ease: "backOut" }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="disconnected"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Circle className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-sm" style={{ color: '#E4E4E7' }}>
                  Talk to Aunt Zhang
                </span>
              </div>

              {/* Officer Chan */}
              <div
                onClick={() => handleTaskClick('officer_chan')}
                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
              >
                <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <AnimatePresence mode="wait">
                    {chanCompleted ? (
                      <motion.div
                        key="connected"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: [0.5, 1.2, 1] }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.4, ease: "backOut" }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="disconnected"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Circle className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-sm" style={{ color: '#E4E4E7' }}>
                  Talk to Officer Chan
                </span>
              </div>

              {/* Michael */}
              <div
                onClick={() => handleTaskClick('michael')}
                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
              >
                <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <AnimatePresence mode="wait">
                    {michaelCompleted ? (
                      <motion.div
                        key="connected"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: [0.5, 1.2, 1] }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.4, ease: "backOut" }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="disconnected"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Circle className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-sm" style={{ color: '#E4E4E7' }}>
                  Talk to Michael
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

