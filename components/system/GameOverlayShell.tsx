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
 * Provides a dark backdrop with blur, an animated card, and an accent-coloured decoration blob.
 */
export function GameOverlayShell({ isOpen, accentColor, children }: GameOverlayShellProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-gray-900 border border-${accentColor}-500/30 w-full max-w-2xl rounded-2xl p-8 shadow-2xl relative overflow-hidden`}
        >
          {/* Background decoration */}
          <div className={`absolute top-0 right-0 w-64 h-64 bg-${accentColor}-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />

          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
