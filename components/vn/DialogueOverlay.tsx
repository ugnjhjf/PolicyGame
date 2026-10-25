import { useEffect, useMemo, useState } from 'react'
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
  text: string
  choices?: DialogueOption[]
  onNext?: () => void
}

export function DialogueOverlay({
  isOpen,
  characterName,
  characterImage,
  text,
  choices,
  onNext
}: DialogueProps) {
  // Parsed segments structure: { type: 'normal' | 'red' | 'yellow' | 'bold', content: string }
  const parsedSegments = useMemo(() => {
    if (!text) return []
    const parts = text.split(/(<red>.*?<\/red>|<yellow>.*?<\/yellow>|<b>.*?<\/b>)/g)
    return parts.map(part => {
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
    }).filter(s => s.content.length > 0)
  }, [text])

  if (!isOpen) return null

  // Render text fully
  const renderText = () => {
    return parsedSegments.map((segment, i) => {
      switch (segment.type) {
        case 'red': return <span key={i} className="text-red-500">{segment.content}</span>
        case 'yellow': return <span key={i} className="text-yellow-400">{segment.content}</span>
        case 'bold': return <span key={i} className="font-bold text-white">{segment.content}</span>
        default: return <span key={i}>{segment.content}</span>
      }
    })
  }

  return (
    <div className="fixed inset-0 h-dvh md:h-auto z-50 pointer-events-none flex flex-col md:justify-end md:pb-12 overflow-hidden">
      {/* On phones the portrait has its own centered stage above the dialogue box. */}
      <div className="relative z-0 flex-1 min-h-0 flex items-center justify-center overflow-hidden pointer-events-none md:absolute md:inset-0 md:flex-none md:items-end md:overflow-visible">
        {characterImage && <CharacterImage image={characterImage} name={characterName} />}
      </div>

      {/* The mobile conversation lives in a visual-novel chat box below the portrait. */}
      <div className="relative z-10 w-[calc(100%-1.5rem)] md:w-full max-w-5xl max-h-[42dvh] md:max-h-[55dvh] overflow-y-auto mx-auto mb-[max(0.75rem,env(safe-area-inset-bottom))] md:mb-0 pointer-events-auto flex flex-col items-center">
        <div
          data-testid="dialogue-box"
          className="w-full min-h-[160px] md:min-h-0 p-4 md:p-0 bg-slate-950/90 md:bg-transparent border border-white/25 md:border-0 rounded-2xl md:rounded-none shadow-2xl md:shadow-none backdrop-blur-md md:backdrop-blur-none text-left md:text-center cursor-pointer select-none flex flex-col"
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName === 'BUTTON') return
            onNext?.()
          }}
        >
          <SubtitleText text={text} characterName={characterName} renderText={renderText} />

          <div className="mt-auto pt-3 md:mt-6 md:pt-0 flex justify-end md:justify-center items-center gap-4">
            <DialogueChoices choices={choices} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CharacterImage({ image, name }: { image: string, name: string }) {
  const [visibleImage, setVisibleImage] = useState(image)

  useEffect(() => {
    if (image === visibleImage) return

    // Keep the current portrait painted until the next pose has decoded.
    // Changing the src before that can briefly leave an empty image on phones.
    const nextSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${image.startsWith('/') ? image : `/${image}`}`
    const preload = new window.Image()
    let cancelled = false
    preload.src = nextSrc
    preload.decode().then(() => {
      if (!cancelled) setVisibleImage(image)
    }).catch(() => {
      // A missing portrait should not blank the one already on screen.
    })
    return () => { cancelled = true }
  }, [image, visibleImage])

  return (
    <div className="relative shrink-0 md:shrink w-[120vw] max-w-none h-full md:w-[110vh] md:h-[110vh] md:mb-[-15vh]">
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${visibleImage.startsWith('/') ? visibleImage : `/${visibleImage}`}`}
        alt={name}
        fill
        className="object-contain object-bottom"
        priority
      />
    </div>
  )
}

function SubtitleText({ text, characterName, renderText }: { text: string, characterName: string, renderText: () => React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="text-base sm:text-lg md:text-3xl font-medium md:font-bold leading-relaxed md:drop-shadow-md"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
      >
        <span className="inline-block md:hidden mb-3 px-3 py-1 rounded-full border border-blue-300/30 bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-widest">{characterName}</span>
        <span className="hidden md:inline text-blue-400 mr-2 uppercase tracking-wide">{characterName}:</span>
        <span className="block md:inline text-white">
          {renderText()}
        </span>
      </motion.div>
    </AnimatePresence>
  )
}

function DialogueChoices({ choices }: { choices?: DialogueOption[] }) {
  if (choices && choices.length > 0) {
    return (
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
              className="w-full px-4 sm:px-6 py-3 bg-black/60 hover:bg-yellow-500/80 hover:text-black text-white text-sm sm:text-lg font-medium rounded border-l-4 border-yellow-500 transition-all text-left"
            >
              {choice.text}
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 animate-bounce text-yellow-400 md:text-yellow-500/80 mt-1 md:mt-2"
      >
        <span className="md:hidden text-[10px] font-bold uppercase tracking-wider">Tap to continue</span>
        <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
      </motion.div>
    </AnimatePresence>
  )
}
