'use client'

import { useState } from 'react'
import EventModal, { EventData } from './EventModal'

interface EventManagerProps {
  // 可以接收外部事件数据
  externalEvents?: EventData[]
}

export default function EventManager({ externalEvents = [] }: EventManagerProps) {
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 处理事件显示
  const showEvent = (event: EventData) => {
    // 实时模拟功能已移除，不再需要暂停游戏
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

  // 关闭事件
  const closeEvent = () => {
    setIsModalOpen(false)
    setCurrentEvent(null)
    
    // 实时模拟功能已移除，不再需要恢复游戏状态
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
