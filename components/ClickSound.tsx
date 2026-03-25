'use client'

import { useEffect, useRef } from 'react'

const CROSSHAIR_SIZE = 48  // px – tweak to taste
const FADE_DURATION  = 500 // ms

const CSS = `
@keyframes click-effect-fade {
  0%   { opacity: 1;   transform: translate(-50%, -50%) scale(1);   }
  100% { opacity: 0;   transform: translate(-50%, -50%) scale(1.4); }
}
.click-effect-img {
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  width: ${CROSSHAIR_SIZE}px;
  height: ${CROSSHAIR_SIZE}px;
  animation: click-effect-fade ${FADE_DURATION}ms ease-out forwards;
  user-select: none;
}
`

export default function ClickFeedback() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Inject keyframe CSS once
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)

    audioRef.current = new Audio('/sound/click.wav')
    audioRef.current.volume = 0.4

    const handleClick = (e: MouseEvent) => {
      // --- sound ---
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      }

      // --- crosshair image ---
      const img = document.createElement('img')
      img.src = '/effect/crosshair.png'
      img.className = 'click-effect-img'
      img.style.left = `${e.clientX}px`
      img.style.top  = `${e.clientY}px`
      document.body.appendChild(img)

      // Remove after animation completes
      setTimeout(() => img.remove(), FADE_DURATION)
    }

    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
      style.remove()
    }
  }, [])

  return null
}
