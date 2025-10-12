'use client'

import { useState, useEffect } from 'react'
import EventModal, { EventData } from './EventModal'
import { GameStateManager } from '../../config/data'

interface EventManagerProps {
  // 可以接收外部事件数据
  externalEvents?: EventData[]
}

export default function EventManager({ externalEvents = [] }: EventManagerProps) {
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [wasGamePlaying, setWasGamePlaying] = useState(false)

  // 处理事件显示
  const showEvent = (event: EventData) => {
    // 记录当前游戏状态
    const currentGameState = GameStateManager.getCurrentState()
    setWasGamePlaying(currentGameState.isPlaying)
    
    // 如果游戏正在运行，则暂停游戏
    if (currentGameState.isPlaying) {
      GameStateManager.pauseGame()
    }
    
    setCurrentEvent(event)
    setIsModalOpen(true)
  }

  // 处理下一步按钮点击
  const handleNext = () => {
    // 这里可以添加事件处理逻辑
    
    // 关闭弹窗
    closeEvent()
  }

  // 处理弹窗关闭
  const handleClose = () => {
    closeEvent()
  }

  // 关闭事件并恢复游戏状态
  const closeEvent = () => {
    setIsModalOpen(false)
    setCurrentEvent(null)
    
    // 如果之前游戏在运行，则恢复游戏状态
    if (wasGamePlaying) {
      GameStateManager.startGame()
    }
    
    // 重置状态
    setWasGamePlaying(false)
  }


  return (
    <div>
      {/* 事件弹窗 */}
      <EventModal
        event={currentEvent}
        isOpen={isModalOpen}
        onClose={handleClose}
        onNext={handleNext}
      />
    </div>
  )
}
