import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ASSETS_TO_PRELOAD = [
  "/background/Introduction.png",
  "/background/city_overview.png",
  "/background/city_overview2 .png",
  "/background/city_overview3.png",
  "/background/city_overview4.png",
  "/background/city_overview5.png",
  "/character/anna/anna_awkward.png",
  "/character/anna/anna_confuse.png",
  "/character/anna/anna_holding.png",
  "/character/anna/anna_normal.png",
  "/character/anna/anna_pointing.png",
  "/character/anna/anna_stand.png",
  "/character/anna/anna_suprise.png",
  "/character/anna/anna_unhappy.png",
  "/character/anna/anna_waving.png",
  "/character/aunt_zhang/aunt_zhang_angry.png",
  "/character/aunt_zhang/aunt_zhang_confuse.png",
  "/character/aunt_zhang/aunt_zhang_happy.png",
  "/character/michael/michael_confuse.png",
  "/character/michael/michael_normal.png",
  "/character/michael/michael_thinking.png",
  "/character/officer_chan/officer_chan_normal.png",
  "/effect/crosshair.png",
  "/sound/click.wav",
  "/sound/correct_1.wav",
  "/sound/correct_2.wav",
  "/sound/error.wav",
  "/sound/new_notes.wav"
]

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [loadedCount, setLoadedCount] = useState(0)
  const totalAssets = ASSETS_TO_PRELOAD.length
  
  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    if (totalAssets === 0) {
      onComplete();
      return;
    }

    const handleAssetChange = () => {
      if (isCancelled) return;
      loaded++;
      setLoadedCount(loaded);
      
      // Complete when all assets are loaded
      if (loaded >= totalAssets) {
        setTimeout(() => {
          if (!isCancelled) onComplete();
        }, 500); // Give a short half-second polish buffer
      }
    };

    // Begin fetching all assets in parallel
    ASSETS_TO_PRELOAD.forEach((path) => {
      const isAudio = path.endsWith('.wav') || path.endsWith('.mp3');
      const fullPath = `${basePath}${path}`;
      
      if (isAudio) {
        const audio = new Audio();
        audio.oncanplaythrough = handleAssetChange;
        audio.onerror = handleAssetChange; // Ensure errors don't hang the screen
        audio.src = fullPath;
      } else {
        const img = new Image();
        img.onload = handleAssetChange;
        img.onerror = handleAssetChange; // Ensure errors don't hang the screen
        img.src = fullPath;
      }
    });

    // Fallback: maximum 10s wait
    const timer = setTimeout(() => {
      if (!isCancelled) onComplete();
    }, 10000);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [onComplete]);

  const progressPercentage = Math.round((loadedCount / totalAssets) * 100)

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
        
        <h2 className="text-xl font-bold tracking-[0.3em] text-purple-400 mb-3 drop-shadow-md">
          {loadedCount >= totalAssets ? "READY" : "INITIALIZING"}
        </h2>
        
        <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-500 tracking-[0.2em] animate-pulse">
               ESTABLISHING SECURE CONNECTION ({progressPercentage}%)
            </p>
            <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mt-2 relative">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
        </div>
      </div>
    </motion.div>
  )
}
