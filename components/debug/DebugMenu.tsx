'use client'

import { useState, useEffect } from 'react'
import { Settings, RotateCcw, Plus, Minus } from 'lucide-react'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../../config/data'
// import { initializeGameEngine } from '../../engine/core' // 已移除实时模拟功能
import styles from '../../styles/animations.module.css'

interface DebugMenuProps {
  onStateChange?: (newState: GameState) => void
  onTriggerEmergencySelector?: () => void
  onToggleRealTimeMetrics?: () => void
}

export default function DebugMenu({ onStateChange, onTriggerEmergencySelector, onToggleRealTimeMetrics }: DebugMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)

  // 初始化游戏状态（移除实时同步）
  useEffect(() => {
    // 只进行一次初始状态同步
    const currentState = GameStateManager.getCurrentState()
    setGameState(currentState)
  }, [])

  // 更新单个数值
  const updateValue = (key: keyof GameState, delta: number) => {
    const currentState = GameStateManager.getCurrentState()
    const newValue = Math.max(0, (currentState[key] as number) + delta)
    
    console.log(`[DebugMenu] 更新 ${key}: ${currentState[key]} -> ${newValue}`)
    GameStateManager.updateState({ [key]: newValue })
    
    // 更新本地状态
    setGameState(GameStateManager.getCurrentState())
    
    // 通知父组件状态变化
    if (onStateChange) {
      onStateChange(GameStateManager.getCurrentState())
    }
  }

  // 重置所有数据
  const resetToInitial = () => {
    GameStateManager.resetState()
    setGameState(INITIAL_GAME_STATE)
    
    if (onStateChange) {
      onStateChange(INITIAL_GAME_STATE)
    }
    
    // 实时模拟功能已移除，不再需要重新初始化游戏引擎
  }

  // 验证日期格式
  const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateString)) {
      return false
    }
    
    const date = new Date(dateString)
    return date.toISOString().split('T')[0] === dateString
  }

  // 直接设置数值
  const setValue = (key: keyof GameState, value: string) => {
    // 特殊处理日期字段
    if (key === 'date') {
      // 验证日期格式
      if (isValidDate(value)) {
        GameStateManager.updateState({ [key]: value })
      } else {
        return
      }
    } else {
      const numValue = parseFloat(value) || 0
      GameStateManager.updateState({ [key]: numValue })
    }
    
    // 更新本地状态
    setGameState(GameStateManager.getCurrentState())
    
    if (onStateChange) {
      onStateChange(GameStateManager.getCurrentState())
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 主菜单按钮 */}
      <div className="flex flex-col items-end gap-2 mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title={isOpen ? "关闭调试菜单" : "打开调试菜单"}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* 调试面板 */}
      {isOpen && (
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-2xl w-80 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            调试菜单
          </h3>
          
          <div className="space-y-3">
            {/* 游戏状态控制 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium w-24">游戏状态:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => GameStateManager.pauseGame()}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                    !gameState.isPlaying 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  暂停
                </button>
                <button
                  onClick={() => GameStateManager.startGame()}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                    gameState.isPlaying 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  运行
                </button>
              </div>
            </div>

            {/* 日期 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium w-24">日期:</label>
              <input
                type="date"
                value={gameState.date}
                onChange={(e) => setValue('date', e.target.value)}
                className="px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600"
                min="2020-01-01"
                max="2030-12-31"
              />
            </div>

            {/* 资源 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium w-24">资源:</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateValue('resources', -1)}
                  className="p-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  value={gameState.resources}
                  onChange={(e) => setValue('resources', e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 text-center"
                  min="0"
                  max="10"
                />
                <button
                  onClick={() => updateValue('resources', 1)}
                  className="p-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>


            {/* 犯罪率 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium w-24">犯罪率:</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateValue('crimeRate', -1)}
                  className="p-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  value={gameState.crimeRate}
                  onChange={(e) => setValue('crimeRate', e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 text-center"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <button
                  onClick={() => updateValue('crimeRate', 1)}
                  className="p-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 逮捕准确率 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium w-24">准确率:</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateValue('arrestAccuracy', -1)}
                  className="p-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  value={gameState.arrestAccuracy}
                  onChange={(e) => setValue('arrestAccuracy', e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 text-center"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <button
                  onClick={() => updateValue('arrestAccuracy', 1)}
                  className="p-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 社区信任度 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium w-24">信任度:</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateValue('communityTrust', -1)}
                  className="p-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  value={gameState.communityTrust}
                  onChange={(e) => setValue('communityTrust', e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 text-center"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <button
                  onClick={() => updateValue('communityTrust', 1)}
                  className="p-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* 状态摘要 */}
          <div className="mt-4 pt-3 border-t border-gray-700">
            <h4 className="text-sm font-bold mb-2">实时状态摘要</h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>游戏状态:</span>
                <span className={`font-mono ${gameState.isPlaying ? 'text-green-400' : 'text-red-400'}`}>
                  {gameState.isPlaying ? '运行中' : '已暂停'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>日期:</span>
                <span className="font-mono">{gameState.date}</span>
              </div>
              <div className="flex justify-between">
                <span>资源:</span>
                <span className="font-mono">{gameState.resources}/10</span>
              </div>
              <div className="flex justify-between">
                <span>犯罪率:</span>
                <span className="font-mono">{gameState.crimeRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>准确率:</span>
                <span className="font-mono">{gameState.arrestAccuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span>信任度:</span>
                <span className="font-mono">{gameState.communityTrust}%</span>
              </div>
            </div>
          </div>


          {/* 紧急事件选择器按钮 */}
          {onTriggerEmergencySelector && (
            <div className="mt-4 pt-3 border-t border-gray-700">
              <button
                onClick={onTriggerEmergencySelector}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 mb-2"
                title="打开紧急事件选择器"
              >
                🚨 紧急事件选择器
              </button>
            </div>
          )}

          {/* 实时运算控制按钮 */}
          {onToggleRealTimeMetrics && (
            <div className="mt-4 pt-3 border-t border-gray-700">
              <button
                onClick={onToggleRealTimeMetrics}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 mb-2"
                title="切换实时指标计算"
              >
                📊 实时运算控制
              </button>
            </div>
          )}

          {/* 重置按钮 */}
          <div className="mt-4 pt-3 border-t border-gray-700">
            <button
              onClick={resetToInitial}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-all duration-200 hover:scale-105"
              title="重置所有数据到初始状态"
            >
              <RotateCcw className="w-4 h-4" />
              重置所有数据
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
