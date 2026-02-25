import { useState } from 'react'
import Image from 'next/image'
import { AlertCircle, Search, MapPin, ArrowRight, X, Database } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapEvent } from '../../types/rpg'

interface MapInteractiveLayerProps {
  events: MapEvent[]
  onEventSelect: (eventId: string) => void
}

export function MapInteractiveLayer({ events, onEventSelect }: MapInteractiveLayerProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [confirmedEvents, setConfirmedEvents] = useState<Set<string>>(new Set())

  const handleEventClick = (eventId: string) => {
    if (confirmedEvents.has(eventId)) {
      onEventSelect(eventId)
    } else {
      setSelectedEventId(eventId)
    }
  }

  const handleConfirm = () => {
    if (selectedEventId) {
      setConfirmedEvents(prev => new Set(prev).add(selectedEventId))
      onEventSelect(selectedEventId)
      setSelectedEventId(null)
    }
  }

  const handleCancel = () => {
    setSelectedEventId(null)
  }

  return (
    <>
      <div className="absolute inset-0 z-10 pointer-events-none">
        {events.map((event) => {
          if (event.status === 'completed') return null

          const isInvestigating = event.status === 'investigating'

          return (
            <div
              key={event.id}
              className="absolute -ml-6 -mt-6 pointer-events-auto flex flex-col items-center group overflow-visible"
              style={{ left: `${event.x}%`, top: `${event.y}%` }}
            >
              <button
                onClick={() => handleEventClick(event.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-125 hover:z-50 transition-all duration-300 cursor-pointer overflow-hidden border-2 
                  ${isInvestigating
                      ? 'bg-blue-500 border-blue-300'
                      : 'bg-yellow-500 border-yellow-300'
                  }`}
                aria-label={isInvestigating ? `Investigate ${event.label}` : `Talk to ${event.label}`}
              >
                {/* Character Image */}
                {['aunt_zhang', 'michael', 'officer_chan'].includes(event.id) ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={
                        event.id === 'aunt_zhang' ? '/character/aunt_zhang/aunt_zhang_happy.png' :
                          event.id === 'michael' ? '/character/michael/michael_normal.png' :
                            '/character/officer_chan/officer_chan_normal.png'
                      }
                      alt={event.label}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <AlertCircle className="w-8 h-8 text-white" />
                )}

                {/* Status Indicators Overlay */}
                {event.status === 'investigating' && (
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                    <Search className={`w-6 h-6 ${event.progress === 100 ? 'text-green-400' : 'text-white'} drop-shadow-lg`} />
                    {(event.progress !== undefined && event.progress < 100) && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-gray-700/80 rounded-full overflow-hidden border border-white/20">
                        <div
                          className="h-full bg-blue-400 transition-all duration-300"
                          style={{ width: `${event.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </button>

              {/* Tooltip Removed */}

              {/* Character Name Label (Static) */}
              <div className="absolute top-full mt-2 px-3 py-1 text-xs font-bold rounded-full border shadow-lg whitespace-nowrap pointer-events-none bg-black/60 backdrop-blur-sm text-white border-white/20">
                {event.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedEventId && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-[2px]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-zinc-900/95 border-l-4 border-yellow-500 p-8 shadow-2xl max-w-sm w-full mx-4 relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute -right-4 -top-4 text-zinc-800 opacity-20 transform rotate-12 pointer-events-none">
                <MapPin className="w-32 h-32" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                Entre <span className="text-yellow-500">{events.find(e => e.id === selectedEventId)?.label}</span> ?
              </h2>

              <div className="h-0.5 w-16 bg-yellow-500/50 mb-8" />

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirm}
                  className="group flex items-center justify-between px-4 py-3 bg-zinc-800 hover:bg-yellow-600 border border-white/10 hover:border-yellow-400 text-white transition-all duration-200"
                >
                  <span className="font-bold uppercase tracking-wider">Yes</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleCancel}
                  className="group flex items-center justify-between px-4 py-3 bg-transparent hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-gray-400 hover:text-white transition-all duration-200"
                >
                  <span className="font-bold uppercase tracking-wider">No</span>
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
