'use client'

import { Award, ArrowRight } from 'lucide-react'
import { GameOverlayShell } from './GameOverlayShell'

interface ChapterCompletionOverlayProps {
  isOpen: boolean
  onNext: () => void
}

export function ChapterCompletionOverlay({ isOpen, onNext }: ChapterCompletionOverlayProps) {
  return (
    <GameOverlayShell isOpen={isOpen} accentColor="purple">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-1">
        <Award className="w-8 h-8 text-purple-500" />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Chapter 1</p>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Chapter 1 Completed</h2>
        <p className="text-base text-purple-500 font-semibold">Bias Observed</p>
      </div>

      <div className="h-px w-24 bg-gray-100 my-1" />

      <p className="text-gray-500 max-w-md leading-relaxed text-sm">
        You have successfully identified the systemic biases affecting the city's policy enforcement. Before proceeding, let's verify your understanding of these critical concepts.
      </p>

      <button
        onClick={onNext}
        className="group mt-2 px-7 py-3 rounded-full bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm tracking-wide shadow transition-all active:scale-95 flex items-center gap-2"
      >
        <span>Check your understanding</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </GameOverlayShell>
  )
}
