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
    // 获取当前游戏状态（会从 localStorage 加载）
    setGameState(GameStateManager.getCurrentState())
    
    // 定期更新状态（每500ms）
    const interval = setInterval(() => {
      setGameState(GameStateManager.getCurrentState())
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  // 检查是否在 Game Ending 页面 (Removed)
  // const isGameEndingPage = pathname?.startsWith('/game-ending')
  
  // 仅在 Game 页面显示 Header (或者根据需求)
  // 之前的逻辑是 hide shadow on certain pages. 现在这些页面删除了。
  // 我们可以简化逻辑，或者直接保留 shadow on all remaining pages if suitable.
  // 既然只剩下 game, story, home. 
  // Home usually has its own layout or just big hero.
  // Game page likely needs the bar.
  
  const shouldHideShadow = false; // 简化为总是显示阴影，或者根据需要调整

  return (
    <div className="fixed top-0 left-0 right-0 z-10" style={{
      height: '48px',
      backdropFilter: 'blur(8px)',
      background: 'rgba(255, 255, 255, 0.95)',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      ...(shouldHideShadow ? {} : { boxShadow: '0 1px 3px rgba(0,0,0,0.02)' })
    }}>
      {/* 渐变带 */}
      <div className="absolute left-0 right-0 top-12 h-6 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))'
      }}></div>
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* 左侧：控制区 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Round */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: '#6B7280', strokeWidth: '1.5' }} />
              <span className="text-sm font-semibold" style={{ 
                color: '#1F2937',
                fontFeatureSettings: '"tnum" 1'
              }}>Round {gameState.round} / {GAME_CONFIG.maxRounds}</span>
            </div>
          </div>

          {/* 右侧：资源与KPI区 */}
          <div className="flex items-center gap-5">
            {/* 资源 */}
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer">
                <Zap className="w-4 h-4" style={{ color: '#6B7280', strokeWidth: '1.5' }} />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>Resources</span>
                  <span className="text-sm font-bold" style={{ 
                    color: '#EAB308',
                    fontFeatureSettings: '"tnum" 1'
                  }}>{gameState.resources}/10</span>
                </div>
              </div>
              {/* 悬浮提示 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-white text-gray-800 border border-gray-200 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                <div className="font-semibold">Resources</div>
                <div className="text-gray-500">Resources required for policy actions, restored each round</div>
              </div>
            </div>

            {/* 分隔符 */}
            <div className="w-px h-6" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}></div>

            {/* 犯罪率 */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 cursor-pointer">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: '#6B7280', strokeWidth: '1.5' }} />
                <span className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>Crime</span>
                <span className="text-sm font-bold" style={{ 
                  color: '#F97316',
                  fontFeatureSettings: '"tnum" 1'
                }}>{gameState.crimeRate}%</span>
              </div>
              {/* 悬浮提示 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-white border border-gray-200 text-gray-800 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                <div className="font-semibold">Crime Rate</div>
                <div className="text-gray-500">City crime rate percentage, lower is better</div>
              </div>
            </div>

            {/* 准确率 */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 cursor-pointer">
                <Target className="w-3.5 h-3.5" style={{ color: '#6B7280', strokeWidth: '1.5' }} />
                <span className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>Acc</span>
                <span className="text-sm font-bold" style={{ 
                  color: '#3B82F6',
                  fontFeatureSettings: '"tnum" 1'
                }}>{gameState.arrestAccuracy}%</span>
              </div>
              {/* 悬浮提示 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-white border border-gray-200 text-gray-800 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                <div className="font-semibold">Accuracy</div>
                <div className="text-gray-500">Arrest action accuracy rate, higher is better</div>
              </div>
            </div>

            {/* 信任度 */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 cursor-pointer">
                <Heart className="w-3.5 h-3.5" style={{ color: '#6B7280', strokeWidth: '1.5' }} />
                <span className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>Trust</span>
                <span className="text-sm font-bold" style={{ 
                  color: '#EC4899',
                  fontFeatureSettings: '"tnum" 1'
                }}>{gameState.communityTrust}%</span>
              </div>
              {/* 悬浮提示 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-white border border-gray-200 text-gray-800 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                <div className="font-semibold">Trust</div>
                <div className="text-gray-500">Community trust in police, higher is better</div>
              </div>
            </div>

            {/* 信息提示 */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 ml-2 cursor-pointer">
                <Info className="w-3.5 h-3.5" style={{ color: '#9CA3AF', strokeWidth: '1.5' }} />
              </div>
              {/* 悬浮提示 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-white border border-gray-200 text-gray-800 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                <div className="font-semibold">Tip</div>
                <div className="text-gray-500">Hover over indicators to view detailed information</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

