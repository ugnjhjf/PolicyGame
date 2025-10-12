'use client'

import { useState, useEffect } from 'react'
import { Settings, RotateCcw, Plus, Minus } from 'lucide-react'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../../config/data'
import styles from '../../styles/animations.module.css'

interface DebugMenuProps {
  onStateChange?: (newState: GameState) => void
}

export default function DebugMenu({ onStateChange }: DebugMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)

  // 同步游戏状态
  useEffect(() => {
    const updateState = () => {
      const currentState = GameStateManager.getCurrentState()
      setGameState(currentState)
    }
    
    updateState()
    
    // 监听状态变化
    const interval = setInterval(updateState, 100)
    return () => clearInterval(interval)
  }, [])

  // 更新单个数值
  const updateValue = (key: keyof GameState, delta: number) => {
    const currentState = GameStateManager.getCurrentState()
    const newValue = Math.max(0, (currentState[key] as number) + delta)
    
    GameStateManager.updateState({ [key]: newValue })
    
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
  }

  // 直接设置数值
  const setValue = (key: keyof GameState, value: string) => {
    const numValue = parseFloat(value) || 0
    GameStateManager.updateState({ [key]: numValue })
    
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
            {/* 日期 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium w-24">日期:</label>
              <input
                type="date"
                value={gameState.date}
                onChange={(e) => setValue('date', e.target.value)}
                className="px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600"
              />
            </div>

            {/* 行动点 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium w-24">行动点:</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateValue('actionPoints', -1)}
                  className="p-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  value={gameState.actionPoints}
                  onChange={(e) => setValue('actionPoints', e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 text-center"
                  min="0"
                  max="10"
                />
                <button
                  onClick={() => updateValue('actionPoints', 1)}
                  className="p-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 金钱 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium w-24">金钱:</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateValue('money', -10000)}
                  className="p-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  value={gameState.money}
                  onChange={(e) => setValue('money', e.target.value)}
                  className="w-20 px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 text-center"
                  min="0"
                />
                <button
                  onClick={() => updateValue('money', 10000)}
                  className="p-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 案件数量 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium w-24">案件数:</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateValue('caseCount', -1)}
                  className="p-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  value={gameState.caseCount}
                  onChange={(e) => setValue('caseCount', e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 text-center"
                  min="0"
                />
                <button
                  onClick={() => updateValue('caseCount', 1)}
                  className="p-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 逮捕人数 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium w-24">逮捕数:</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateValue('arrests', -1)}
                  className="p-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  value={gameState.arrests}
                  onChange={(e) => setValue('arrests', e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 text-center"
                  min="0"
                />
                <button
                  onClick={() => updateValue('arrests', 1)}
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
            <h4 className="text-sm font-bold mb-2">状态摘要</h4>
            <div className="text-xs space-y-1">
              <div>行动点: {gameState.actionPoints}/10</div>
              <div>资金: ${gameState.money.toLocaleString()}</div>
              <div>犯罪率: {gameState.crimeRate}%</div>
              <div>信任度: {gameState.communityTrust}%</div>
            </div>
          </div>

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
