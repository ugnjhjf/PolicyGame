import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, HelpCircle, ArrowRight } from 'lucide-react'

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

// ─── Sub-components ─────────────────────────────────────────────────────────────

/** Horizontal progress dots showing question completion state. */
function ProgressBar({ questions, currentIndex }: { questions: Question[]; currentIndex: number }) {
  return (
    <div className="mb-8 flex gap-2">
      {questions.map((q, idx) => (
        <div
          key={q.id}
          className={`h-2 flex-1 rounded-full transition-colors ${
            idx < currentIndex ? 'bg-green-500' :
            idx === currentIndex ? 'bg-blue-500' : 'bg-gray-700'
          }`}
        />
      ))}
    </div>
  )
}

/** The True/False question card. */
function QuestionCard({
  question,
  index,
  total,
  onAnswer,
}: {
  question: Question
  index: number
  total: number
  onAnswer: (answer: boolean) => void
}) {
  return (
    <motion.div
      key="question"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-6 h-6 text-blue-400" />
        <span className="text-blue-400 font-bold uppercase tracking-wider text-sm">
          Question {index + 1} of {total}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">{question.title}</h3>
      <p className="text-xl text-gray-300 leading-relaxed mb-8">{question.text}</p>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onAnswer(true)}
          className="p-6 rounded-xl bg-gray-700 hover:bg-gray-600 border-2 border-transparent hover:border-blue-500 transition-all text-white font-bold text-lg"
        >
          True
        </button>
        <button
          onClick={() => onAnswer(false)}
          className="p-6 rounded-xl bg-gray-700 hover:bg-gray-600 border-2 border-transparent hover:border-blue-500 transition-all text-white font-bold text-lg"
        >
          False
        </button>
      </div>
    </motion.div>
  )
}

/** Feedback card shown after answering (correct / incorrect + explanation). */
function FeedbackCard({
  isCorrect,
  explanation,
  isLast,
  onNext,
}: {
  isCorrect: boolean
  explanation: string
  isLast: boolean
  onNext: () => void
}) {
  return (
    <motion.div
      key="feedback"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl p-8 shadow-2xl border ${
        isCorrect ? 'bg-green-900/20 border-green-500/50' : 'bg-red-900/20 border-red-500/50'
      }`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {isCorrect ? <Check className="w-7 h-7" /> : <X className="w-7 h-7" />}
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect...'}
          </h3>
          <p className="text-gray-400 text-sm">
            {isCorrect ? 'Good job!' : 'Review the concept below.'}
          </p>
        </div>
      </div>

      <div className="bg-black/30 rounded-xl p-6 mb-8 border border-white/5">
        <p className="text-lg text-gray-200 leading-relaxed">{explanation}</p>
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
      >
        <span>{isLast ? 'Complete Quiz' : 'Next Question'}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────

export function QuizOverlay({ isOpen, onComplete, questions }: QuizOverlayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const scoreRef = useRef(0) // Use ref to avoid stale-state issues in handleNext

  if (!isOpen) return null

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleAnswer = (answer: boolean) => {
    const correct = answer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    if (correct) scoreRef.current += 1
    setShowFeedback(true)
  }

  const handleNext = () => {
    setShowFeedback(false)
    if (isLastQuestion) {
      onComplete(scoreRef.current, questions.length)
    } else {
      setCurrentQuestionIndex(i => i + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl">
        <ProgressBar questions={questions} currentIndex={currentQuestionIndex} />

        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <QuestionCard
              question={currentQuestion}
              index={currentQuestionIndex}
              total={questions.length}
              onAnswer={handleAnswer}
            />
          ) : (
            <FeedbackCard
              isCorrect={isCorrect}
              explanation={currentQuestion.explanation}
              isLast={isLastQuestion}
              onNext={handleNext}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
