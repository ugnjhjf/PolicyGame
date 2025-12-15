'use client'

import { Map, Zap, CheckCircle, Database, Book } from 'lucide-react'
import { useEffect, useState } from 'react'

export interface PDANotificationProps {
  isVisible: boolean
  title: string
  message: string
  type?: 'success' | 'alert' | 'info' | 'clue'
  onClose?: () => void
}

export function PDANotification({
  isVisible,
  title,
  message,
  type = 'info',
  onClose
}: PDANotificationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        if (onClose) setTimeout(onClose, 300) // Wait for animation
      }, 4000)
      return () => clearTimeout(timer)
    } else {
      setShow(false)
    }
  }, [isVisible, onClose])

  if (!isVisible && !show) return null

  // Styles based on type
  const typeStyles = {
    success: 'border-green-500 bg-black/80 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]',
    alert: 'border-red-500 bg-black/80 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    info: 'border-purple-500 bg-black/80 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    clue: 'border-yellow-500 bg-black/80 text-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    alert: <Zap className="w-5 h-5 text-red-400" />,
    info: <Book className="w-5 h-5 text-blue-400" />,
    clue: <Map className="w-5 h-5 text-yellow-400" />
  }

  return (
    <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${
      show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
    }`}>
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
