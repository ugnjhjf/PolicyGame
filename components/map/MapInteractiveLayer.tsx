import { AlertCircle, Search, MapPin } from 'lucide-react'
import { MapEvent } from '../../types/rpg'

interface MapInteractiveLayerProps {
  events: MapEvent[]
  onEventSelect: (eventId: string) => void
}

export function MapInteractiveLayer({ events, onEventSelect }: MapInteractiveLayerProps) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {events.map((event) => {
        if (event.status === 'completed') return null // Or render a small checkmark

        const isInvestigating = event.status === 'investigating'

        return (
          <div
            key={event.id}
            className="absolute -ml-6 -mt-6 pointer-events-auto flex flex-col items-center group overflow-visible"
            style={{ left: `${event.x}%`, top: `${event.y}%` }}
          >
            <button
              onClick={() => onEventSelect(event.id)}
              className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 hover:z-50 transition-all duration-300 animate-bounce cursor-pointer overflow-visible ${isInvestigating
                ? 'bg-blue-500/90 hover:bg-blue-400'
                : 'bg-yellow-500/90 hover:bg-yellow-400'
                }`}
              aria-label={isInvestigating ? `Investigate ${event.label}` : `Talk to ${event.label}`}
            >
              {/* Icon based on status */}
              {event.status === 'available' && (
                <AlertCircle className="w-8 h-8 text-white drop-shadow-md animate-pulse" />
              )}
              {event.status === 'investigating' && (
                <div className="relative">
                  <Search className={`w-8 h-8 ${event.progress === 100 ? 'text-green-400 animate-bounce' : 'text-white'} drop-shadow-lg`} />
                  {/* Progress Bar */}
                  {(event.progress !== undefined && event.progress < 100) && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-gray-700/80 rounded-full overflow-hidden border border-white/20 backdrop-blur-sm">
                      <div
                        className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] transition-all duration-300"
                        style={{ width: `${event.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
              {event.status === 'completed' && (
                <MapPin className="w-8 h-8 text-gray-400" />
              )}
              {/* Tooltip - Inside button or outside? Outside better for static */}
            </button>

            {/* Tooltip (Hover) */}
            <div className="absolute bottom-full mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none transform -translate-y-2">
              {isInvestigating ? 'Investigate Area' : 'New Event'}
            </div>

            {/* Character Name Label (Static) */}
            <div className="absolute top-full mt-2 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/20 shadow-lg whitespace-nowrap pointer-events-none">
              {event.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
