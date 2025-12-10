import { AlertCircle } from 'lucide-react'

interface MapEvent {
  id: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  label: string
}

const DEMO_EVENTS: MapEvent[] = [
  { id: 'police-hq', x: 20, y: 70, label: 'Police HQ' },
  { id: 'gov-complex', x: 50, y: 50, label: 'Government Complex' },
  { id: 'data-center', x: 80, y: 30, label: 'Data Center' },
]

interface MapInteractiveLayerProps {
  onEventSelect: (eventId: string) => void
}

export function MapInteractiveLayer({ onEventSelect }: MapInteractiveLayerProps) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {DEMO_EVENTS.map((event) => (
        <button
          key={event.id}
          onClick={() => onEventSelect(event.id)}
          className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-yellow-500/90 hover:bg-yellow-400 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 animate-bounce cursor-pointer pointer-events-auto group"
          style={{ left: `${event.x}%`, top: `${event.y}%` }}
          aria-label={`Investigate ${event.label}`}
        >
          <AlertCircle className="w-8 h-8" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Investigate: {event.label}
          </div>
        </button>
      ))}
    </div>
  )
}
