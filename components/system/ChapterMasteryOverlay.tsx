'use client'

import { CheckCircle, Home, ArrowRight, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { GameOverlayShell } from './GameOverlayShell'

// ─── Sub-component ──────────────────────────────────────────────────────────────

interface ChallengeItemProps {
  completed: boolean
  label: React.ReactNode
  activeColorClass: string   // e.g. 'bg-yellow-400 border-yellow-400'
}

function ChallengeItem({ completed, label, activeColorClass }: ChallengeItemProps) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
      completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100'
    }`}>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          completed ? activeColorClass : 'border-gray-300 bg-transparent'
        }`}
      >
        {completed && <CheckCircle className="w-3 h-3 text-white" />}
      </div>
      <span className={`text-sm text-left ${completed ? 'text-gray-800' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────

interface ChapterMasteryOverlayProps {
  isOpen: boolean
  onClose: () => void
  challenges?: {
    aiSpecialist: boolean
    quizHunter: boolean
  }
}

export function ChapterMasteryOverlay({
  isOpen,
  onClose,
  challenges = { aiSpecialist: true, quizHunter: false },
}: ChapterMasteryOverlayProps) {
  const router = useRouter()

  return (
    <GameOverlayShell isOpen={isOpen} accentColor="green">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-1">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Chapter 1</p>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Chapter 1 Complete</h2>
        <p className="text-base text-green-500 font-semibold">You have mastered the basics of bias</p>
      </div>

      {/* Challenge Panel */}
      <div className="w-full bg-gray-50 rounded-xl border border-gray-100 p-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>Challenges</span>
        </h4>

        <div className="flex flex-col gap-2">
          <ChallengeItem
            completed={challenges.aiSpecialist}
            activeColorClass="bg-yellow-400 border-yellow-400"
            label={<><span className="font-bold text-yellow-500">AI Specialist:</span> Match solution first try</>}
          />
          <ChallengeItem
            completed={challenges.quizHunter}
            activeColorClass="bg-purple-400 border-purple-400"
            label={<><span className="font-bold text-purple-500">Quiz Hunter:</span> All questions correct</>}
          />
        </div>
      </div>

      <p className="text-gray-400 max-w-md leading-relaxed text-sm">
        Congratulations! You have successfully analyzed the policy, identified biases, and verified your understanding. The city is one step closer to fairness.
      </p>

      <div className="flex gap-3 mt-2">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-medium text-sm transition-all flex items-center gap-2"
        >
          <span>Next chapter</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm tracking-wide shadow transition-all active:scale-95 flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Menu</span>
        </button>
      </div>
    </GameOverlayShell>
  )
}
