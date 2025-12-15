'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Tablet } from 'lucide-react'
import GameStatusBar from '../../components/GameStatusBar'
import { MapInteractiveLayer } from '../../components/map/MapInteractiveLayer'
import { DialogueOverlay } from '../../components/vn/DialogueOverlay'
import { PDAOverlay } from '../../components/pda/PDAOverlay'
import { PDANotification, type PDANotificationProps } from '../../components/pda/PDANotification'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../../config/data'
import { type RPGState, INITIAL_RPG_STATE } from '../../types/rpg'
import dialogueData from '../../config/data/dialogue'
import clueData from '../../config/data/journal'
import conceptData from '../../config/data/encyclopedia'

export default function GamePage() {
  // 游戏状态数据
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  // RPG 状态
  const [rpgState, setRpgState] = useState<RPGState>(INITIAL_RPG_STATE)
  
  // 覆盖初始事件
  useEffect(() => {
     setRpgState(prev => ({
        ...prev,
        map: {
            activeEvents: [
                {
                    id: 'aunt_zhang',
                    x: 35,
                    y: 65,
                    label: 'Aunt Zhang\'s Shop',
                    status: 'available'
                },
                {
                    id: 'michael',
                    x: 65,
                    y: 35,
                    label: 'Michael\'s Office',
                    status: 'available'
                }
            ]
        }
     }))
  }, [])

  // UI 状态
  const [showPDA, setShowPDA] = useState(false)
  const [pdaTab, setPdaTab] = useState<'journal' | 'encyclopedia'>('journal')
  const [showDialogue, setShowDialogue] = useState(false)
  const [dialogueContent, setDialogueContent] = useState<{ name: string; title?: string; traits?: string[]; text: string }>({ name: '', text: '' })
  const [currentEventId, setCurrentEventId] = useState<string | null>(null)
  
  // Notification State
  const [notification, setNotification] = useState<Omit<PDANotificationProps, 'isVisible' | 'onClose'> | null>(null)
  const [showNotification, setShowNotification] = useState(false)

  const triggerNotification = (title: string, message: string, type: PDANotificationProps['type'] = 'info') => {
      setNotification({ title, message, type })
      setShowNotification(true)
  }
  
  // Dialogue Queue State
  const [dialogueQueue, setDialogueQueue] = useState<any[]>([])
  
  // Helper to start a dialogue sequence
  const startDialogue = (sequenceKey: keyof typeof dialogueData.events) => {
      // @ts-ignore - Dynamic key access
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

    if (eventId === 'aunt_zhang') {
        if (event.status === 'available') {
            startDialogue('aunt_zhang_dialogue')
        } else if (event.status === 'investigating') {
            startDialogue('aunt_zhang_analysis')
        }
    } else if (eventId === 'michael') {
        if (event.status === 'available') {
            startDialogue('michael_dialogue')
        } else if (event.status === 'investigating') {
            startDialogue('michael_analysis')
        }
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
          // Add Clue Phase
          let newClue;
          if (currentEventId === 'aunt_zhang') newClue = clueData.clue_zhang_ledger
          else if (currentEventId === 'michael') newClue = clueData.clue_michael_cctv
          
          if (newClue) {
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
              
              setTimeout(() => {
                  triggerNotification('New Clue Discovered', newClue.title.split('(')[0].trim(), 'clue')
                  setPdaTab('journal')
              }, 300)
          }

      } else if (event.status === 'investigating') {
          // Unlock Concept Phase
          let newConcept;
          if (currentEventId === 'aunt_zhang') newConcept = conceptData.concept_selection_bias
          else if (currentEventId === 'michael') newConcept = conceptData.concept_algorithmic_bias

          if (newConcept) {
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
                  triggerNotification('PDA Encyclopedia Updated', `Unlocked: ${newConcept.title.split('(')[0].trim()}`, 'info')
                  setPdaTab('encyclopedia')
                  setShowPDA(true)
              }, 300)
          }
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
          onClick={() => {
              setPdaTab('journal')
              setShowPDA(true)
          }}
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
        characterTitle={dialogueContent.title}
        characterTraits={dialogueContent.traits}
        text={dialogueContent.text}
        onNext={handleDialogueNext}
      />

      <PDAOverlay
        isOpen={showPDA}
        onClose={() => setShowPDA(false)}
        activeTab={pdaTab}
        concepts={rpgState.player.encyclopedia}
        clues={rpgState.player.journal}
      />

      {/* Notifications */}
      {notification && (
        <PDANotification
            isVisible={showNotification}
            title={notification.title}
            message={notification.message}
            type={notification.type}
            onClose={() => setShowNotification(false)}
        />
      )}

      {/* Developer */}
      <div className="fixed bottom-4 right-4 z-10">
        <p className="text-xs text-white/60 font-medium">
          Developer: Rokidna G
        </p>
      </div>

    </div>
  )
}
