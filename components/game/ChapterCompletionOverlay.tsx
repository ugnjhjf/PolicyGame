'use client'

import { Award, ArrowRight } from 'lucide-react'
import { GameOverlayShell } from './GameOverlayShell'

interface ChapterCompletionOverlayProps {
  isOpen: boolean
  onNext: () => void
}

export function ChapterCompletionOverlay({ isOpen, onNext }: ChapterCompletionOverlayProps) {
  return (
    <GameOverlayShell isOpen={isOpen} accentColor="blue">
      <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
        <Award className="w-10 h-10 text-blue-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-white tracking-tight">Chapter 1 Completed</h2>
        <p className="text-xl text-blue-200">Bias Observed</p>
      </div>

      <div className="h-px w-32 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-2" />

      <p className="text-gray-300 max-w-lg leading-relaxed">
        You have successfully identified the systemic biases affecting the city's policy enforcement. Before proceeding, let's verify your understanding of these critical concepts.
      </p>

      <button
        onClick={onNext}
        className="group mt-6 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-3"
      >
        <span>Check your understanding</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </GameOverlayShell>
  )
}
