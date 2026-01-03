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
  isTyping = false
}: DialogueProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end pb-8">
      {/* ... (Character Portrait Layer remains same) ... */}
      <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none">
        {characterImage && (
          <div className="relative w-[60vh] h-[80vh] mb-[10vh] transition-all duration-500 animate-in fade-in slide-in-from-bottom-10">
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
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl">
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

          {/* Text Content */}
          {/* Text Content */}
          <div className="min-h-[80px] text-lg text-gray-100 font-medium leading-relaxed mt-2 whitespace-pre-wrap">
            {text.split(/(<red>.*?<\/red>|<yellow>.*?<\/yellow>|<b>.*?<\/b>)/g).map((part, index) => {
              if (part.startsWith('<red>') && part.endsWith('</red>')) {
                return <span key={index} className="text-red-500">{part.replace(/<\/?red>/g, '')}</span>
              }
              if (part.startsWith('<yellow>') && part.endsWith('</yellow>')) {
                return <span key={index} className="text-yellow-400">{part.replace(/<\/?yellow>/g, '')}</span>
              }
              if (part.startsWith('<b>') && part.endsWith('</b>')) {
                return <span key={index} className="font-bold text-white">{part.replace(/<\/?b>/g, '')}</span>
              }
              return part
            })}
            {isTyping && <span className="animate-pulse ml-1">|</span>}
          </div>

          {/* Action Area */}
          <div className="mt-4 flex justify-end items-center gap-4">
            {choices && choices.length > 0 ? (
              <div className="flex gap-2">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={choice.action}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors border border-white/20 hover:border-white/50"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={onNext}
                className="group flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
              >
                <span className="text-sm font-semibold uppercase tracking-wider">Next</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
