'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Circle } from 'lucide-react'
import { GameStateManager, type GameState, GAME_CONFIG } from '../config/data'

interface ObjectivePanelProps {
  className?: string
}

export default function GameObjectivePanel({ className = '' }: ObjectivePanelProps) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isDataCenterCompleted, setIsDataCenterCompleted] = useState(false)
  const [isPoliceHQCompleted, setIsPoliceHQCompleted] = useState(false)
  const [isGovernmentViewed, setIsGovernmentViewed] = useState(false)

  useEffect(() => {
    // 初始化游戏状态
    setGameState(GameStateManager.getCurrentState())
    
    // 检查 Data Center 是否完成（需要完成整个流程到 deployment-status 阶段）
    const checkDataCenterCompletion = () => {
      if (typeof window !== 'undefined' && gameState) {
        // 检查是否完成了 deployment-status 阶段（本回合完成标记）
        const roundKey = `dataCenterCompleted_round${gameState.round}`
        const isRoundCompleted = localStorage.getItem(roundKey) === 'true'
        
        // 同时检查是否有所有必需的选择（向后兼容）
        const hasDataset = localStorage.getItem('selectedDataset') !== null
        const hasMethod = localStorage.getItem('selectedMethod') !== null
        
        // 只有当完成 deployment-status 且所有选择都存在时，才认为完成
        setIsDataCenterCompleted(isRoundCompleted && hasDataset && hasMethod)
      }
    }

    // 检查 Police HQ 是否完成（需要完成整个流程到 deployment-status 阶段）
    const checkPoliceHQCompletion = () => {
      if (typeof window !== 'undefined' && gameState) {
        // 检查是否完成了 deployment-status 阶段（本回合完成标记）
        const roundKey = `policeHQCompleted_round${gameState.round}`
        const isRoundCompleted = localStorage.getItem(roundKey) === 'true'
        
        // 同时检查是否有策略选择
        const hasStrategy = localStorage.getItem('policeHQSelectedStrategy') !== null
        
        // 只有当完成 deployment-status 且策略选择存在时，才认为完成
        setIsPoliceHQCompleted(isRoundCompleted && hasStrategy)
      }
    }

    // 检查 Government Complex 是否已查看
    const checkGovernmentViewed = () => {
      if (typeof window !== 'undefined' && gameState) {
        const viewKey = `governmentViewed_round${gameState.round}`
        const isViewed = localStorage.getItem(viewKey) === 'true'
        setIsGovernmentViewed(isViewed)
      }
    }
    
    // 定期检查状态更新（每500ms）
    const interval = setInterval(() => {
      const currentState = GameStateManager.getCurrentState()
      setGameState(currentState)
      // 在更新 gameState 后检查完成状态
      if (currentState) {
        const dataCenterRoundKey = `dataCenterCompleted_round${currentState.round}`
        const isDataCenterRoundCompleted = localStorage.getItem(dataCenterRoundKey) === 'true'
        const hasDataset = localStorage.getItem('selectedDataset') !== null
        const hasMethod = localStorage.getItem('selectedMethod') !== null
        setIsDataCenterCompleted(isDataCenterRoundCompleted && hasDataset && hasMethod)

        const policeHQRoundKey = `policeHQCompleted_round${currentState.round}`
        const isPoliceHQRoundCompleted = localStorage.getItem(policeHQRoundKey) === 'true'
        const hasStrategy = localStorage.getItem('policeHQSelectedStrategy') !== null
        setIsPoliceHQCompleted(isPoliceHQRoundCompleted && hasStrategy)

        const governmentViewKey = `governmentViewed_round${currentState.round}`
        const isGovernmentViewed = localStorage.getItem(governmentViewKey) === 'true'
        setIsGovernmentViewed(isGovernmentViewed)
      }
    }, 500)
    
    // 监听 localStorage 变化
    const handleStorageChange = () => {
      checkDataCenterCompletion()
      checkPoliceHQCompletion()
      checkGovernmentViewed()
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
          
          {/* Police HQ */}
          <div className="flex items-center gap-3">
            {isPoliceHQCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-sm" style={{ color: '#E4E4E7' }}>
              Police HQ
            </span>
          </div>
          
          {/* Government Complex */}
          <div className="flex items-center gap-3">
            {isGovernmentViewed ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-sm" style={{ color: '#E4E4E7' }}>
              Government Complex
            </span>
          </div>
        </div>

        {/* Next Round / See Result 按钮 */}
        {isDataCenterCompleted && isPoliceHQCompleted && isGovernmentViewed && gameState && (
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && gameState) {
                // 获取最新游戏状态并保存当前回合的数据
                const currentState = GameStateManager.getCurrentState()
                const roundData = {
                  round: currentState.round,
                  label: `After Round ${currentState.round}`,
                  crimeRate: currentState.crimeRate,
                  arrestAccuracy: currentState.arrestAccuracy,
                  communityTrust: currentState.communityTrust,
                  resources: currentState.resources
                }
                const roundDataKey = `roundData_round${currentState.round}`
                localStorage.setItem(roundDataKey, JSON.stringify(roundData))
                
                if (currentState.round >= GAME_CONFIG.maxRounds) {
                  // 第三回合后，跳转到结局页面
                  window.location.href = '/game-ending'
                } else {
                  // 进入下一回合
                  const nextRound = Math.min(currentState.round + 1, GAME_CONFIG.maxRounds)
                  
                  // 更新 round（其他状态会自动保留，因为 updateState 只更新传入的字段）
                  GameStateManager.updateState({ round: nextRound })
                  
                  // 重置 Data Center 相关状态
                  localStorage.removeItem('selectedDataset')
                  localStorage.removeItem('selectedMethod')
                  const dataCenterRoundKey = `dataCenterCompleted_round${currentState.round}`
                  localStorage.removeItem(dataCenterRoundKey)
                  
                  // 重置 Police HQ 相关状态
                  localStorage.removeItem('policeHQSelectedStrategy')
                  const policeHQRoundKey = `policeHQCompleted_round${currentState.round}`
                  localStorage.removeItem(policeHQRoundKey)
                  
                  // 重置 Government 查看状态
                  const governmentViewKey = `governmentViewed_round${currentState.round}`
                  localStorage.removeItem(governmentViewKey)
                  
                  // 刷新页面以更新状态
                  window.location.reload()
                }
              }
            }}
            className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <span>{(gameState && gameState.round >= GAME_CONFIG.maxRounds) ? 'See Result' : 'Next Round'}</span>
          </button>
        )}
      </div>
    </div>
  )
}

