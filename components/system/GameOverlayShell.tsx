'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GameOverlayShellProps {
  isOpen: boolean
  accentColor: string // tailwind colour name, e.g. 'blue', 'green'
  children: ReactNode
}

/**
 * Shared full-screen overlay wrapper used by game chapter overlays.
 * White card style matching the Google AI Quests quiz theme.
 */
export function GameOverlayShell({ isOpen, accentColor, children }: GameOverlayShellProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-gray-100 w-full max-w-2xl rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle top accent line */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 rounded-t-2xl`} />

          <div className="relative z-10 flex flex-col items-center text-center gap-6 pt-2">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
