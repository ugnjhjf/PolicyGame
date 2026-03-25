import Image from 'next/image'
import { AlertCircle, Search } from 'lucide-react'
import { MapEvent } from '../../types/rpg'

interface MapInteractiveLayerProps {
  events: MapEvent[]
  onEventSelect: (eventId: string) => void
}

export function MapInteractiveLayer({ events, onEventSelect }: MapInteractiveLayerProps) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {events.map((event) => (
        <EventMarker key={event.id} event={event} onEventSelect={onEventSelect} />
      ))}
    </div>
  )
}

function EventMarker({ event, onEventSelect }: { event: MapEvent, onEventSelect: (eventId: string) => void }) {
  if (event.status === 'completed') return null

  const isInvestigating = event.status === 'investigating'

  return (
    <div
      className="absolute -ml-6 -mt-6 pointer-events-auto flex flex-col items-center group overflow-visible"
      style={{ left: `${event.x}%`, top: `${event.y}%` }}
    >
      <button
        onClick={() => onEventSelect(event.id)}
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

      {/* Character Name Label (Static) */}
      <div className="absolute top-full mt-2 px-3 py-1 text-xs font-bold rounded-full border shadow-lg whitespace-nowrap pointer-events-none bg-black/60 backdrop-blur-sm text-white border-white/20">
        {event.label}
      </div>
    </div>
  )
}
