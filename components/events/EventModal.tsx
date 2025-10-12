'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import styles from '../../styles/animations.module.css'

export interface EventData {
  id: string
  title: string
  description: string
  imageUrl?: string
  type: 'crime' | 'community' | 'system' | 'emergency'
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface EventModalProps {
  event: EventData | null
  isOpen: boolean
  onClose: () => void
  onNext: () => void
}

export default function EventModal({ event, isOpen, onClose, onNext }: EventModalProps) {
  if (!isOpen || !event) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 事件弹窗 */}
      <div className={`relative bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 ${styles.gpuAccelerated}`}>
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 事件内容 */}
        <div className="p-6">
          {/* 游戏暂停提示 */}
          <div className="mb-4 flex justify-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 border border-yellow-300 rounded-full">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-800">游戏已自动暂停</span>
            </div>
          </div>

          {/* 事件图片 */}
          {event.imageUrl && (
            <div className="mb-6">
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}

          {/* 事件标题 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {event.title}
          </h2>

          {/* 事件描述 */}
          <div className="text-gray-700 leading-relaxed mb-6">
            {event.description}
          </div>

          {/* 下一步按钮 */}
          <div className="flex justify-center">
            <button
              onClick={onNext}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
