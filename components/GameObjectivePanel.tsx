'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Circle } from 'lucide-react'

interface ObjectivePanelProps {
  className?: string
  tasks?: {
    zhangCompleted: boolean
    chanCompleted: boolean
    michaelCompleted: boolean
  }
  onTaskClick?: (taskId: string) => void
  isVisible?: boolean
}

export default function GameObjectivePanel({ className = '', tasks, onTaskClick, isVisible = true }: ObjectivePanelProps) {
  const popSoundRef = useRef<HTMLAudioElement | null>(null)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    popSoundRef.current = new Audio(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/sound/new_notes.wav`)
    popSoundRef.current.volume = 0.7
  }, [])

  // Play once when the panel first becomes visible
  useEffect(() => {
    if (isVisible && !hasPlayedRef.current) {
      hasPlayedRef.current = true
      popSoundRef.current?.play().catch(() => {})
    }
  }, [isVisible])

  const { zhangCompleted, chanCompleted, michaelCompleted } = tasks || { zhangCompleted: false, chanCompleted: false, michaelCompleted: false }

  const handleTaskClick = (taskId: string) => {
    if (onTaskClick) {
      onTaskClick(taskId)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1.15,
            originX: 0,
            originY: 0
          }}
          exit={{ opacity: 0, x: -50 }}
          transition={{
            opacity: { duration: 0.5 },
            x: { duration: 0.5 }
          }}
          className={`fixed left-6 top-20 z-20 flex flex-col gap-4 ${className}`}
        >

          {/* Progress Panel with Blinking Highlight */}
          <motion.div
            style={{
              position: 'relative',
              backdropFilter: 'blur(8px)',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '16px',
              minWidth: '280px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
            animate={{
              borderColor: [
                'rgba(0,0,0,0.08)',
                'rgba(59, 130, 246, 0.5)', // blue-500
                'rgba(0,0,0,0.08)'
              ],
              boxShadow: [
                '0 4px 20px rgba(0,0,0,0.05)',
                '0 4px 20px rgba(59, 130, 246, 0.2)', // blue glow
                '0 4px 20px rgba(0,0,0,0.05)'
              ]
            }}
            transition={{
              duration: 1,
              repeat: 3,
              times: [0, 0.5, 1],
              ease: "easeInOut"
            }}
          >
            <h3 className="text-l font-semibold mb-1" style={{ color: '#3B82F6' }}>
              Task 1
            </h3>
            <h3 className="text-l font-semibold mb-3" style={{ color: '#1F2937' }}>
              Meet with the community
            </h3>
            <hr className="border-black/5 mb-4" />
            <div className="space-y-3">
              <TaskItem 
                completed={zhangCompleted} 
                label="Talk to Aunt Zhang" 
                onClick={() => handleTaskClick('aunt_zhang')} 
              />
              <TaskItem 
                completed={chanCompleted} 
                label="Talk to Officer Chan" 
                onClick={() => handleTaskClick('officer_chan')} 
              />
              <TaskItem 
                completed={michaelCompleted} 
                label="Talk to Michael" 
                onClick={() => handleTaskClick('michael')} 
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TaskItem({ 
  completed, 
  label, 
  onClick 
}: { 
  completed: boolean
  label: string
  onClick: () => void 
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer hover:bg-black/5 p-1 rounded transition-colors"
    >
      <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="connected"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: [0.5, 1.2, 1] }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, ease: "backOut" }}
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
            </motion.div>
          ) : (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Circle className="w-5 h-5 text-gray-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-sm font-medium text-gray-700">
        {label}
      </span>
    </div>
  )
}
