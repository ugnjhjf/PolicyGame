import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950 text-white font-mono"
    >
      <div className="relative flex flex-col items-center">
        {/* Cyberpunk Outer Ring */}
        <div className="absolute inset-0 -m-8 rounded-full border border-purple-500/20 animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-0 -m-4 rounded-full border border-indigo-500/30 animate-[spin_3s_linear_infinite_reverse]" />
        
        {/* Core Spinner */}
        <div className="w-16 h-16 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin mb-10 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
        
        <h2 className="text-xl font-bold tracking-[0.3em] text-purple-400 mb-3 drop-shadow-md">INITIALIZING</h2>
        
        <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-500 tracking-[0.2em] animate-pulse">ESTABLISHING SECURE CONNECTION</p>
            <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 w-full animate-[shimmer_2s_infinite]" />
            </div>
        </div>
      </div>
    </motion.div>
  )
}
