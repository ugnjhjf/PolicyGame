'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface Question {
  id: number
  title: string
  text: string
  correctAnswer: boolean
  explanation: string
}

export interface QuizOverlayProps {
  isOpen: boolean
  onComplete: (score: number, total: number) => void
  questions: Question[]
}

// ─── Main component ─────────────────────────────────────────────────────────────

export function QuizOverlay({ isOpen, onComplete, questions }: QuizOverlayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const scoreRef = useRef(0)

  if (!isOpen) return null

  const question = questions[currentQuestionIndex]
  const total = questions.length
  const hasAnswered = selectedAnswer !== null
  const isCorrect = hasAnswered && selectedAnswer === question.correctAnswer
  const isLastQuestion = currentQuestionIndex === total - 1

  const handleAnswer = (answer: boolean) => {
    if (hasAnswered) return
    setSelectedAnswer(answer)
    if (answer === question.correctAnswer) scoreRef.current += 1
  }

  const handleNext = () => {
    if (!hasAnswered) return
    setSelectedAnswer(null)
    if (isLastQuestion) {
      onComplete(scoreRef.current, total)
      setCurrentQuestionIndex(0)
      scoreRef.current = 0
    } else {
      setCurrentQuestionIndex(i => i + 1)
    }
  }

  return (
    // No dark full-screen backdrop — floats over the game, bottom-anchored
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center pb-6 px-4 pointer-events-none">

      {/* Counter badge — floats above the card, left-aligned */}
      <div className="w-full max-w-2xl flex items-end mb-0 pointer-events-none">
        <div className="ml-6 mb-[-1px] z-10 pointer-events-auto">
          <div className="inline-flex items-center bg-white border border-gray-200 rounded-xl px-4 py-1.5 shadow-md">
            <span className="font-bold text-base text-gray-900 tracking-wide">
              {currentQuestionIndex + 1} / {total}
            </span>
          </div>
        </div>
      </div>

      {/* Main card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl px-7 py-6 pointer-events-auto border border-gray-100 relative"
        >
          {/* Feedback badge top-right */}
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute top-5 right-6 text-sm font-semibold px-3 py-1 rounded-full border ${
                isCorrect
                  ? 'text-green-600 border-green-300 bg-green-50'
                  : 'text-red-500 border-red-300 bg-red-50'
              }`}
            >
              {isCorrect ? 'Correct! ✓' : 'Not quite...'}
            </motion.div>
          )}

          {/* Character label */}
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
            {question.title}
          </p>

          {/* Question title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            True or False
          </h2>

          {/* Question text */}
          <p className="text-sm text-gray-700 leading-relaxed mb-5">
            {question.text}
          </p>

          {/* Explanation (shown after answering) */}
          <AnimatePresence>
            {hasAnswered && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-gray-500 italic leading-relaxed mb-5 overflow-hidden"
              >
                {question.explanation}
              </motion.p>
            )}
          </AnimatePresence>

          {/* True / False buttons */}
          <div className="flex gap-3">
            {([true, false] as boolean[]).map((option) => {
              const label = option ? 'True' : 'False'
              const isSelected = hasAnswered && selectedAnswer === option
              const isWrong = isSelected && !isCorrect
              const isRight = isSelected && isCorrect
              const isCorrectUnselected = hasAnswered && option === question.correctAnswer && !isSelected

              let btnClass = 'flex-1 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-200 '

              if (!hasAnswered) {
                btnClass += 'border-purple-300 text-gray-800 bg-white hover:bg-purple-50 hover:border-purple-500 cursor-pointer'
              } else if (isRight) {
                btnClass += 'border-green-500 bg-green-50 text-green-700'
              } else if (isWrong) {
                btnClass += 'border-red-400 bg-red-50 text-red-600 line-through'
              } else if (isCorrectUnselected) {
                btnClass += 'border-green-400 bg-green-50 text-green-700'
              } else {
                btnClass += 'border-gray-200 text-gray-400 bg-white'
              }

              return (
                <button
                  key={label}
                  onClick={() => handleAnswer(option)}
                  disabled={hasAnswered}
                  className={btnClass}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Continue button — bottom right */}
      <div className="w-full max-w-2xl flex justify-end mt-3 pointer-events-auto">
        <button
          onClick={handleNext}
          disabled={!hasAnswered}
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
            hasAnswered
              ? 'bg-gray-800 text-white hover:bg-gray-700 shadow-lg'
              : 'bg-gray-300 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>{isLastQuestion && hasAnswered ? 'Complete' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
