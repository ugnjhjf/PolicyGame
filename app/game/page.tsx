'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Tablet } from 'lucide-react'
import GameStatusBar from '../../components/GameStatusBar'
import { MapInteractiveLayer } from '../../components/map/MapInteractiveLayer'
import { DialogueOverlay } from '../../components/vn/DialogueOverlay'
import { PDAOverlay } from '../../components/pda/PDAOverlay'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../../config/data'

export default function GamePage() {
  // 游戏状态数据
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  // UI 状态
  const [showPDA, setShowPDA] = useState(false)
  const [showDialogue, setShowDialogue] = useState(false)
  const [currentEventId, setCurrentEventId] = useState<string | null>(null)
  
  // 处理地图事件点击
  const handleMapEvent = (eventId: string) => {
    setCurrentEventId(eventId)
    // 模拟打开对话
    setShowDialogue(true)
  }

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
        
        {/* Map Interaction Layer */}
        <MapInteractiveLayer onEventSelect={handleMapEvent} />
      </div>

      {/* 顶部城市状态栏 - TBD if needed for RPG mode */}
      <GameStatusBar />

      {/* PDA Button */}
      <div className="fixed bottom-8 left-8 z-30">
        <button 
          onClick={() => setShowPDA(true)}
          className="group flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-lg hover:bg-blue-500 hover:scale-110 transition-all duration-300"
          title="Open PDA (Journal & Encyclopedia)"
        >
          <Tablet className="w-8 h-8 text-white" />
          <div className="absolute left-full ml-4 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Open PDA
          </div>
        </button>
      </div>

      {/* Overlays */}
      <DialogueOverlay
        isOpen={showDialogue}
        characterName={currentEventId === 'police-hq' ? "Chief Officer" : "System AI"}
        // Placeholder text
        text={`Welcome to the ${currentEventId?.replace('-', ' ')}. This is a demonstration of the dialogue system.`}
        onNext={() => setShowDialogue(false)}
      />

      <PDAOverlay
        isOpen={showPDA}
        onClose={() => setShowPDA(false)}
        concepts={[
          {
            id: 'c1',
            title: 'Algorithmic Bias',
            category: 'Ethics',
            description: 'Systematic and repeatable errors in a computer system that create unfair outcomes, such as privileging one arbitrary group of users over others.',
            unlockedAt: '2023-10-01'
          }
        ]}
        clues={[
          {
            id: 'l1',
            title: 'Suspicious Log File',
            content: 'Found a log file indicating that 40% of training data was discarded without review.',
            regionId: 'Data Center',
            timestamp: 'Day 1'
          }
        ]}
      />

      {/* 开发者署名 */}
      <div className="fixed bottom-4 right-4 z-10">
        <p className="text-xs text-white/60 font-medium">
          Developer: Rokidna G
        </p>
      </div>

    </div>
  )
}
