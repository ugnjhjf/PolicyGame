import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export interface DialogueOption {
  id: string
  text: string
  action: () => void
}

export interface DialogueProps {
  isOpen: boolean
  characterName: string
  characterImage?: string // URL to image
  characterTitle?: string
  characterTraits?: string[]
  text: string
  choices?: DialogueOption[]
  onNext?: () => void
  isTyping?: boolean
}

export function DialogueOverlay({
  isOpen,
  characterName,
  characterTitle,
  characterTraits,
  characterImage,
  text,
  choices,
  onNext,
  isTyping: externalIsTyping = false
}: DialogueProps) {
  const [visibleChars, setVisibleChars] = useState(0)
  // Parsed segments structure: { type: 'normal' | 'red' | 'yellow' | 'bold', content: string }
  const [parsedSegments, setParsedSegments] = useState<{ type: string; content: string }[]>([])
  const [totalLength, setTotalLength] = useState(0)
  const [speed, setSpeed] = useState(1.0) // 1.0x to 1.5x

  // Parse text whenever it changes
  useEffect(() => {
    if (!text) {
      setParsedSegments([])
      setTotalLength(0)
      return
    }

    const parts = text.split(/(<red>.*?<\/red>|<yellow>.*?<\/yellow>|<b>.*?<\/b>)/g)
    const segments = parts.map(part => {
      if (part.startsWith('<red>') && part.endsWith('</red>')) {
        return { type: 'red', content: part.replace(/<\/?red>/g, '') }
      }
      if (part.startsWith('<yellow>') && part.endsWith('</yellow>')) {
        return { type: 'yellow', content: part.replace(/<\/?yellow>/g, '') }
      }
      if (part.startsWith('<b>') && part.endsWith('</b>')) {
        return { type: 'bold', content: part.replace(/<\/?b>/g, '') }
      }
      return { type: 'normal', content: part }
    }).filter(s => s.content.length > 0) // Filter out empty strings from split

    setParsedSegments(segments)
    const len = segments.reduce((acc, s) => acc + s.content.length, 0)
    setTotalLength(len)
    setVisibleChars(0) // Reset typing
  }, [text])

  // Typing effect ticking
  useEffect(() => {
    if (visibleChars >= totalLength) return

    const baseDelay = 30
    const delay = baseDelay / speed

    const timer = setInterval(() => {
      setVisibleChars(prev => {
        if (prev >= totalLength) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, delay)

    return () => clearInterval(timer)
  }, [visibleChars, totalLength, speed])

  // Handle "force finish" or "next"
  const handleInteraction = () => {
    if (visibleChars < totalLength) {
      // Fast forward
      setVisibleChars(totalLength)
    } else {
      // Proceed
      if (onNext) onNext()
    }
  }

  if (!isOpen) return null

  // Render logic based on visibleChars
  const renderText = () => {
    let currentCount = 0
    const elements = []

    for (let i = 0; i < parsedSegments.length; i++) {
      const segment = parsedSegments[i]
      const remainingBudget = visibleChars - currentCount

      if (remainingBudget <= 0) break

      let contentToShow = segment.content
      if (remainingBudget < segment.content.length) {
        contentToShow = segment.content.slice(0, remainingBudget)
      }

      const key = i
      if (segment.type === 'red') {
        elements.push(<span key={key} className="text-red-500">{contentToShow}</span>)
      } else if (segment.type === 'yellow') {
        elements.push(<span key={key} className="text-yellow-400">{contentToShow}</span>)
      } else if (segment.type === 'bold') {
        elements.push(<span key={key} className="font-bold text-white">{contentToShow}</span>)
      } else {
        elements.push(<span key={key}>{contentToShow}</span>)
      }

      currentCount += segment.content.length
    }

    return elements
  }

  const isTypingComplete = visibleChars >= totalLength

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end pb-12 overflow-hidden">
      {/* ... (Character Portrait Layer remains same) ... */}
      <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none">
        <AnimatePresence mode="popLayout">
          {characterImage && (
            <motion.div
              key={characterImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-[110vh] h-[110vh] mb-[-15vh]"
            >
              <Image
                src={characterImage.startsWith('/') ? characterImage : `/${characterImage}`}
                alt={characterName}
                fill
                className="object-contain object-bottom"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtitle Area */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pointer-events-auto flex flex-col items-center">

        {/* Speed Control - Subtle (Opacity on hover) */}
        <div className="mb-2 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
          <span className="text-[10px] text-gray-300 uppercase tracking-widest">Speed</span>
          <input
            type="range"
            min="1"
            max="1.5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>

        <div
          className="w-full text-center cursor-pointer select-none"
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName === 'BUTTON') return
            handleInteraction()
          }}
        >
          {/* Subtitle Text */}
          <div className="text-2xl md:text-3xl font-bold leading-relaxed drop-shadow-md" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            <span className="text-blue-400 mr-2 uppercase tracking-wide">{characterName}:</span>
            <span className="text-white">
              {renderText()}
              {!isTypingComplete && <span className="animate-pulse ml-1 opacity-80">_</span>}
            </span>
          </div>

          {/* Extra Info (Title/Traits) - Optional, small below or adjacent. Ignoring for pure CoD style unless critical? 
              User asked for "Name: (Content)", so skipping traits/title for now to keep it clean.
          */}

          {/* Action / Choices */}
          <div className="mt-6 flex justify-center items-center gap-4">
            {choices && choices.length > 0 && isTypingComplete ? (
              <div className="flex flex-col gap-2 w-full max-w-md">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      choice.action()
                    }}
                    className="w-full px-6 py-3 bg-black/60 hover:bg-yellow-500/80 hover:text-black text-white text-lg font-medium rounded border-l-4 border-yellow-500 transition-all text-left"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            ) : (
              // Invisible click area is main interaction, but visual cue is helpful
              isTypingComplete && (
                <div className="animate-bounce text-yellow-500/80 mt-2">
                  <ChevronRight className="w-8 h-8" />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
