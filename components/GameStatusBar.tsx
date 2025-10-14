'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Calendar, Zap, Target, Heart, Info, TrendingUp } from 'lucide-react'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../config/data'
import { GAME_CONFIG } from '../config/data/gameConfig'

export default function GameStatusBar() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  const pathname = usePathname()

  useEffect(() => {
    // 获取当前游戏状态
    setGameState(GameStateManager.getCurrentState())
  }, [])

  // 检查是否在 Data Center 相关页面
  const isDataCenterPage = pathname?.startsWith('/ai-dataset') || 
                           pathname?.startsWith('/ai-training-methods') || 
                           pathname?.startsWith('/deployment') || 
                           pathname?.startsWith('/ai-summary') ||
                           pathname?.startsWith('/deployment-status')

  return (
    <div className="fixed top-0 left-0 right-0 z-10" style={{
      height: '48px',
      backdropFilter: 'blur(4px) saturate(100%)',
      background: 'rgba(39, 39, 42, 0.75)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      ...(isDataCenterPage ? {} : { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' })
    }}>
      {/* 暗色渐变带 */}
      <div className="absolute left-0 right-0 top-12 h-8 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(24, 24, 27, 0.4), rgba(24, 24, 27, 0))'
      }}></div>
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* 左侧：控制区 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Round */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
              <span className="text-sm font-medium" style={{ 
                color: '#E4E4E7',
                fontFeatureSettings: '"tnum" 1'
              }}>Round {gameState.round} / {GAME_CONFIG.maxRounds}</span>
            </div>
          </div>

          {/* 右侧：资源与KPI区 */}
          <div className="flex items-center gap-5">
            {/* 资源 */}
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer">
                <Zap className="w-4 h-4" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Resources</span>
                  <span className="text-sm font-bold" style={{ 
                    color: '#FDE047',
                    fontFeatureSettings: '"tnum" 1'
                  }}>{gameState.resources}/10</span>
                </div>
              </div>
              {/* 悬浮提示 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                <div className="font-semibold">Resources</div>
                <div className="text-gray-300">执行政策行动所需的资源，每回合恢复</div>
              </div>
            </div>

            {/* 分隔符 */}
            <div className="w-px h-6" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}></div>

            {/* 犯罪率 */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 cursor-pointer">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Crime</span>
                <span className="text-sm font-bold" style={{ 
                  color: '#FDBA74',
                  fontFeatureSettings: '"tnum" 1'
                }}>{gameState.crimeRate}%</span>
              </div>
              {/* 悬浮提示 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                <div className="font-semibold">Crime Rate</div>
                <div className="text-gray-300">城市犯罪率百分比，越低越好</div>
              </div>
            </div>

            {/* 准确率 */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 cursor-pointer">
                <Target className="w-3.5 h-3.5" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Acc</span>
                <span className="text-sm font-bold" style={{ 
                  color: '#93C5FD',
                  fontFeatureSettings: '"tnum" 1'
                }}>{gameState.arrestAccuracy}%</span>
              </div>
              {/* 悬浮提示 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                <div className="font-semibold">Accuracy</div>
                <div className="text-gray-300">抓捕行动准确率，越高越好</div>
              </div>
            </div>

            {/* 信任度 */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 cursor-pointer">
                <Heart className="w-3.5 h-3.5" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Trust</span>
                <span className="text-sm font-bold" style={{ 
                  color: '#F9A8D4',
                  fontFeatureSettings: '"tnum" 1'
                }}>{gameState.communityTrust}%</span>
              </div>
              {/* 悬浮提示 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                <div className="font-semibold">Trust</div>
                <div className="text-gray-300">社区对警方的信任度，越高越好</div>
              </div>
            </div>

            {/* 信息提示 */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 ml-2 cursor-pointer">
                <Info className="w-3.5 h-3.5" style={{ color: '#71717A', strokeWidth: '1.5' }} />
              </div>
              {/* 悬浮提示 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                <div className="font-semibold">提示</div>
                <div className="text-gray-300">将鼠标悬浮到指标上查看详细介绍</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

