import { Zap } from 'lucide-react'

// Explicitly type the dispatch function for boolean state
interface DevToolsPanelProps {
  isDevMode: boolean
  setIsDevMode: (val: boolean) => void
  onUnlockAll: () => void
}

export function DevToolsPanel({ isDevMode, setIsDevMode, onUnlockAll }: DevToolsPanelProps) {
  return (
    <>
      <div className="fixed bottom-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-none">
        <p className="text-xs text-white/60 font-medium pointer-events-auto">
          Developer: Rokidna G
        </p>
      </div>

      <div className="fixed top-20 right-4 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsDevMode(!isDevMode)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all border ${
            isDevMode
              ? 'bg-red-500/80 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
              : 'bg-black/40 text-gray-400 border-white/10 hover:bg-black/60 hover:text-white'
          }`}
        >
          {isDevMode ? 'DEV MODE: ON' : 'DEV MODE'}
        </button>

        {isDevMode && (
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-2xl animate-in slide-in-from-right-4 fade-in duration-200">
            <div className="flex flex-col gap-2">
              <h4 className="text-xs text-blue-300 font-bold uppercase mb-1">Debug Controls</h4>
              <button
                onClick={onUnlockAll}
                className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-between gap-3 group"
              >
                <span>UNLOCK ALL CONTENT</span>
                <Zap className="w-3 h-3 group-hover:text-yellow-400 transition-colors" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
