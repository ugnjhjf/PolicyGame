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
  text: string
  choices?: DialogueOption[]
  onNext?: () => void
  isTyping?: boolean
}

export function DialogueOverlay({
  isOpen,
  characterName,
  characterImage,
  text,
  choices,
  onNext,
  isTyping = false
}: DialogueProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end pb-8">
      {/* Character Portrait Layer */}
      <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none">
        {characterImage ? (
           <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] animate-in fade-in slide-in-from-bottom-10 duration-500">
             <Image
               src={characterImage}
               alt={characterName}
               fill
               className="object-contain object-bottom"
               priority
             />
           </div>
        ) : (
          // Placeholder silhouette
          <div className="w-[300px] h-[400px] bg-gradient-to-t from-black/50 to-transparent rounded-t-full mx-auto" />
        )}
      </div>

      {/* Dialogue Box */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pointer-events-auto">
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl">
          {/* Name Tag */}
          <div className="absolute -top-4 left-8 bg-blue-600 px-4 py-1 rounded-md shadow-lg border border-blue-400/50">
            <span className="text-white font-bold tracking-wide uppercase">{characterName}</span>
          </div>

          {/* Text Content */}
          <div className="min-h-[80px] text-lg text-gray-100 font-medium leading-relaxed mt-2">
            {text}
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
