'use client'

import { Map, Zap, CheckCircle, Database, Book } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export interface PDANotificationProps {
  isVisible: boolean
  title: string
  message: string
  type?: 'success' | 'alert' | 'info' | 'clue'
  onClose?: () => void
  onClick?: () => void
}

export function PDANotification({
  isVisible,
  title,
  message,
  type = 'info',
  onClose,
  onClick
}: PDANotificationProps) {
  const [show, setShow] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/sound/new_notes.wav')
    audioRef.current.volume = 0.7
  }, [])

  useEffect(() => {
    if (isVisible) {
      // Play sound for clue notifications
      if (type === 'clue' && audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        if (onClose) setTimeout(onClose, 300) // Wait for animation
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setShow(false)
    }
  }, [isVisible, onClose, type])

  if (!isVisible && !show) return null

  const typeStyles = {
    success: 'border-green-200 bg-white text-gray-800 shadow-lg',
    alert: 'border-red-200 bg-white text-gray-800 shadow-lg',
    info: 'border-blue-200 bg-white text-gray-800 shadow-lg',
    clue: 'border-yellow-200 bg-white text-gray-800 shadow-lg'
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    alert: <Zap className="w-5 h-5 text-red-500" />,
    info: <Book className="w-5 h-5 text-blue-500" />,
    clue: <Map className="w-5 h-5 text-yellow-500" />
  }

  return (
    <div
      onClick={onClick}
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        } ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}>
      <div className={`
        flex items-start gap-3 min-w-[320px] max-w-md p-4 rounded-lg border backdrop-blur-md shadow-2xl
        ${typeStyles[type]}
      `}>
        <div className="flex-shrink-0 mt-0.5">
          {icons[type]}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm uppercase tracking-wider mb-1 opacity-90">{title}</h4>
          <p className="text-sm opacity-80 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  )
}
