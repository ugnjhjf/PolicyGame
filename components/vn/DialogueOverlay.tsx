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
  // Parsed segments structure: { type: 'normal' | 'red' | 'yellow' | 'bold', content: string }
  const [parsedSegments, setParsedSegments] = useState<{ type: string; content: string }[]>([])

  // Parse text whenever it changes
  useEffect(() => {
    if (!text) {
      setParsedSegments([])
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
  }, [text])

  // Handle "next"
  const handleInteraction = () => {
    if (onNext) onNext()
  }

  if (!isOpen) return null

  // Render text fully
  const renderText = () => {
    const elements = []

    for (let i = 0; i < parsedSegments.length; i++) {
      const segment = parsedSegments[i]
      const contentToShow = segment.content
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
    }

    return elements
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end pb-12 overflow-hidden">
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
        <div
          className="w-full text-center cursor-pointer select-none"
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName === 'BUTTON') return
            handleInteraction()
          }}
        >
          {/* Subtitle Text with Fade-in/Fade-out transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-2xl md:text-3xl font-bold leading-relaxed drop-shadow-md"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
            >
              <span className="text-blue-400 mr-2 uppercase tracking-wide">{characterName}:</span>
              <span className="text-white">
                {renderText()}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Action / Choices */}
          <div className="mt-6 flex justify-center items-center gap-4">
            {choices && choices.length > 0 ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-2 w-full max-w-md"
                >
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
                </motion.div>
              </AnimatePresence>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="animate-bounce text-yellow-500/80 mt-2"
                >
                  <ChevronRight className="w-8 h-8" />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
