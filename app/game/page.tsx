'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import GameStatusBar from '../../components/GameStatusBar'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../../config/data'

export default function GamePage() {
  // 游戏状态数据
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)

  // 初始化游戏状态（移除实时同步）
  useEffect(() => {
    // 只进行一次初始状态同步
    const currentState = GameStateManager.getCurrentState()
    setGameState(currentState)
    
    // 保存初始状态（如果还没有保存过）
    if (typeof window !== 'undefined') {
      const initialDataKey = 'roundData_initial'
      if (!localStorage.getItem(initialDataKey)) {
        const initialData = {
          round: 0,
          label: 'Initial',
          crimeRate: currentState.crimeRate,
          arrestAccuracy: currentState.arrestAccuracy,
          communityTrust: currentState.communityTrust,
          resources: currentState.resources
        }
        localStorage.setItem(initialDataKey, JSON.stringify(initialData))
      }
    }
  }, [])

  return (
    <div className="min-h-screen relative pt-12">
      {/* 背景图片 */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/city_overview.png"
          alt="City Overview"
          fill
          className="object-cover"
          priority
          quality={75}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        {/* 半透明遮罩层，确保内容可读性 */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* TODO: Implement new Map Interaction Layer with (!) icons */}
        
      </div>

      {/* 顶部城市状态栏 - TBD if needed for RPG mode */}
      <div className="absolute top-0 w-full z-20">
         {/* Placeholder for status bar if we keep it, o/w remove later */}
      </div>

      {/* 开发者署名 */}
      <div className="fixed bottom-4 right-4 z-10">
        <p className="text-xs text-white/60 font-medium">
          Developer: Rokidna G
        </p>
      </div>

    </div>
  )
}
