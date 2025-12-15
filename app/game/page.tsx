'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Tablet } from 'lucide-react'
import GameStatusBar from '../../components/GameStatusBar'
import { MapInteractiveLayer } from '../../components/map/MapInteractiveLayer'
import { DialogueOverlay } from '../../components/vn/DialogueOverlay'
import { PDAOverlay } from '../../components/pda/PDAOverlay'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../../config/data'
import { type RPGState, INITIAL_RPG_STATE } from '../../types/rpg'
import dialogueData from '../../config/data/dialogue'

export default function GamePage() {
  // 游戏状态数据
  // 游戏状态数据
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  // RPG 状态
  const [rpgState, setRpgState] = useState<RPGState>(INITIAL_RPG_STATE)
  
  // 覆盖初始事件为 Aunt Zhang
  useEffect(() => {
     setRpgState(prev => ({
        ...prev,
        map: {
            activeEvents: [{
                id: 'aunt_zhang',
                x: 35,
                y: 65,
                label: 'Aunt Zhang\'s Shop',
                status: 'available'
            }]
        }
     }))
  }, [])

  // UI 状态
  const [showPDA, setShowPDA] = useState(false)
  const [showDialogue, setShowDialogue] = useState(false)
  const [dialogueContent, setDialogueContent] = useState({ name: '', text: '' })
  const [currentEventId, setCurrentEventId] = useState<string | null>(null)
  
  // Dialogue Queue State
  const [dialogueQueue, setDialogueQueue] = useState<any[]>([])
  
  // Helper to start a dialogue sequence
  const startDialogue = (sequenceKey: keyof typeof dialogueData.events) => {
      const sequence = dialogueData.events[sequenceKey]
      if (sequence && sequence.length > 0) {
          setDialogueQueue(sequence)
          setDialogueContent(sequence[0])
          setShowDialogue(true)
      }
  }

  // 处理地图事件点击
  const handleMapEvent = (eventId: string) => {
    setCurrentEventId(eventId)
    const event = rpgState.map.activeEvents.find(e => e.id === eventId)
    if (!event) return

    if (event.status === 'available') {
        // Step 1: 人物对话
        startDialogue('aunt_zhang_start')
    } else if (event.status === 'investigating') {
        // Step 3: 调查分析
        startDialogue('aunt_zhang_analysis')
    }
  }

  const handleDialogueNext = () => {
      // Check if there are more lines
      if (dialogueQueue.length > 1) {
          const nextQueue = dialogueQueue.slice(1)
          setDialogueQueue(nextQueue)
          setDialogueContent(nextQueue[0])
          return
      }
      
      // End of dialogue
      setShowDialogue(false)
      setDialogueQueue([])
      
      if (!currentEventId) return

      const event = rpgState.map.activeEvents.find(e => e.id === currentEventId)
      if (!event) return

      if (event.status === 'available') {
          // Transition to Investigating
          // Add Clue
          const newClue = {
              id: 'clue_zhang_ledger',
              title: '张阿姨的手写账本 (Zhang\'s Ledger)',
              content: '一本沾着油渍的笔记本，密密麻麻记录着每天的现金流水，金额其实非常可观。',
              regionId: 'Central District',
              timestamp: 'Day 1',
              isRead: false
          }
          
          setRpgState(prev => ({
              ...prev,
              player: {
                  ...prev.player,
                  journal: [...prev.player.journal, newClue]
              },
              map: {
                  activeEvents: prev.map.activeEvents.map(e => 
                      e.id === currentEventId ? { ...e, status: 'investigating' } : e
                  )
              }
          }))
          
          // Show small notification (Native for now)
          setTimeout(() => alert("获得线索：张阿姨的手写账本"), 300)

      } else if (event.status === 'investigating') {
          // Transition to Completed
          // Unlock Concept
          const newConcept = {
              id: 'concept_selection_bias',
              title: 'Selection Bias (选择性偏差)',
              category: 'Data Bias',
              description: '如果在数据采集阶段，样本的选择不够全面（例如只覆盖数字用户），模型就会对未被选中的群体（如老年人、现金使用者）产生系统性的认知盲区。',
              unlockedAt: 'Day 1',
              isRead: false
          }

          setRpgState(prev => ({
              ...prev,
              player: {
                  ...prev.player,
                  encyclopedia: [...prev.player.encyclopedia, newConcept]
              },
              map: {
                  activeEvents: prev.map.activeEvents.map(e => 
                      e.id === currentEventId ? { ...e, status: 'completed' } : e
                  )
              }
          }))

          setTimeout(() => {
              alert("PDA更新：解锁词条 Selection Bias")
              setShowPDA(true)
          }, 300)
      }
  }

  // 初始化游戏状态（移除实时同步）
  useEffect(() => {
    // 只进行一次初始状态同步
    const currentState = GameStateManager.getCurrentState()
    setGameState(currentState)
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
        <MapInteractiveLayer 
            events={rpgState.map.activeEvents}
            onEventSelect={handleMapEvent} 
        />
      </div>

      {/* 顶部城市状态栏 */}
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
        characterName={dialogueContent.name}
        text={dialogueContent.text}
        onNext={handleDialogueNext}
      />

      <PDAOverlay
        isOpen={showPDA}
        onClose={() => setShowPDA(false)}
        concepts={rpgState.player.encyclopedia}
        clues={rpgState.player.journal}
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
