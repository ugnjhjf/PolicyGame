import { AlertCircle, Search, CheckCircle } from 'lucide-react'
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
        <button
          key={event.id}
          onClick={() => onEventSelect(event.id)}
          className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 animate-bounce cursor-pointer pointer-events-auto group ${
            isInvestigating 
              ? 'bg-blue-500/90 hover:bg-blue-400' 
              : 'bg-yellow-500/90 hover:bg-yellow-400'
          }`}
          style={{ left: `${event.x}%`, top: `${event.y}%` }}
          aria-label={isInvestigating ? `Investigate ${event.label}` : `Talk to ${event.label}`}
        >
          {isInvestigating ? (
            <Search className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-8 h-8" />
          )}
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {isInvestigating ? 'Investigate Area' : 'New Event'}
          </div>
        </button>
      )})}
    </div>
  )
}
