import { useState, useEffect } from 'react'
import Image from 'next/image'
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
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end pb-8">
      {/* ... (Character Portrait Layer remains same) ... */}
      <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none">
        {characterImage && (
          <div className="relative w-[90vh] h-[90vh] mb-[10vh] transition-all duration-500 animate-in fade-in slide-in-from-bottom-10">
            <Image
              src={characterImage.startsWith('/') ? characterImage : `/${characterImage}`}
              alt={characterName}
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        )}
      </div>

      {/* Dialogue Box */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pointer-events-auto">
        <div
          className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl cursor-pointer relative"
          onClick={(e) => {
            // Determine if we should handle click here or if it was a button click
            // Actually creating a clickable area for "fast forward" is good
            // But we don't want to block button clicks or slider
            if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'INPUT') return
            handleInteraction()
          }}
        >
          {/* Name Tag */}
          <div className="absolute -top-4 left-8 flex items-center gap-2">
            <div className="bg-blue-600 px-4 py-1 rounded-md shadow-lg border border-blue-400/50">
              <span className="text-white font-bold tracking-wide uppercase">{characterName}</span>
            </div>
            {characterTitle && (
              <div className="bg-gray-900 px-3 py-1 rounded-md border border-white/20">
                <span className="text-blue-200 text-sm font-medium">{characterTitle}</span>
              </div>
            )}
            {characterTraits && characterTraits.map((trait, index) => (
              <div key={index} className="bg-purple-900/80 px-2 py-1 rounded-md border border-purple-500/30 flex items-center justify-center min-w-[24px]">
                <span className="text-purple-200 text-xs font-semibold">{trait}</span>
              </div>
            ))}
          </div>

          {/* Speed Control Slider - Top Right */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 group hover:bg-black/60 transition-colors" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-gray-400 font-medium">Speed</span>
            <input
              type="range"
              min="1"
              max="1.5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-xs text-blue-300 w-8 text-right font-mono">{speed.toFixed(1)}x</span>
          </div>

          {/* Text Content */}
          <div
            className="min-h-[80px] text-lg text-gray-100 font-medium leading-relaxed mt-2 whitespace-pre-wrap"
            style={{ maxWidth: '30em' }}
          >
            {renderText()}
            {!isTypingComplete && <span className="animate-pulse ml-1">_</span>}
          </div>

          {/* Action Area */}
          <div className="mt-4 flex justify-end items-center gap-4">
            {choices && choices.length > 0 && isTypingComplete ? (
              <div className="flex gap-2">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      choice.action()
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors border border-white/20 hover:border-white/50"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleInteraction()
                }}
                className="group flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
              >
                <span className="text-sm font-semibold uppercase tracking-wider">
                  {isTypingComplete ? 'Next' : 'Skip'}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
