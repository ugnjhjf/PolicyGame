'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Brain, Scale, ChevronRight, Terminal, Lock, Ticket, Search } from 'lucide-react'
import { LoadingScreen } from '../components/LoadingScreen'

export default function Page() {
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [showLoading, setShowLoading] = useState(true)

  // Safety fallback: if image onLoad doesn't fire (e.g. cached), remove loading screen after a maximum of 2.5s
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isImageLoaded) {
      // Add a tiny delay to ensure paint is smooth
      timer = setTimeout(() => setShowLoading(false), 500)
    } else {
      timer = setTimeout(() => setShowLoading(false), 2500)
    }
    return () => clearTimeout(timer)
  }, [isImageLoaded])

  return (
    <>
      <AnimatePresence>
        {showLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <div className={`min-h-screen bg-white text-gray-900 relative overflow-hidden font-sans selection:bg-purple-100 selection:text-purple-900 transition-opacity duration-1000 ${showLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Background with white soft overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/background/Introduction.png`}
            alt="Cyberpunk City Background"
            fill
            className="object-cover opacity-20 grayscale"
            priority
            sizes="100vw"
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90 pointer-events-none" />
        </div>

      <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col justify-center items-center lg:items-start lg:px-20">

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl space-y-8 w-full"
        >

          {/* Title */}
          <h1 className="text-xl leading-none">
            <span className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 tracking-wider uppercase">
              AI Policy Strategist
            </span>
          </h1>

          {/* Divider */}
          <div className="h-1.5 w-24 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full" />
          
          {/* Description */}
          <p className="text-5xl md:text-6xl text-gray-900 max-w-3xl leading-tight font-light tracking-tight">
            <span className='text-purple-600 font-serif font-medium'>Explore</span> <span className='font-serif italic text-gray-500'>the AI literacy</span>
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
            {[
              { icon: Scale, label: "Bias", desc: "Common biases in AI models", color: "purple" },
              { icon: Lock, label: "Privacy", desc: "Risks of using data", color: "indigo" },
              { icon: Search, label: "Transparency", desc: "Black box problem", color: "blue" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1), duration: 0.5 }}
                className="bg-white/80 backdrop-blur-md border border-gray-200 p-8 rounded-2xl flex items-start gap-5 hover:bg-white hover:border-purple-200 transition-all cursor-default group shadow-sm hover:shadow-md"
              >
                <div className={`p-4 bg-${feature.color}-50 flex-shrink-0 rounded-xl group-hover:bg-${feature.color}-100 transition-colors`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-500`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-2xl mb-2">{feature.label}</h3>
                  <p className="text-base text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* START Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="pt-6"
          >
            <Link href="/story" legacyBehavior>
              <a
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gray-900 hover:bg-purple-600 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/25"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>BEGIN BRIEFING</span>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </a>
            </Link>
          </motion.div>

        </motion.div>
      </div>

      {/* Footer Metadata */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 right-8 flex items-center gap-6 text-xs text-gray-400 font-mono z-20 font-semibold uppercase tracking-wider"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-700">SERVER ONLINE</span>
        </div>
        <div className="px-3 py-1.5 border border-gray-200 rounded-full bg-white text-gray-500">PC_B1.0.0_f4a5acc</div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 flex flex-col items-end gap-1.5 opacity-20 pointer-events-none">
        <div className="w-24 h-1 bg-purple-600 rounded-full"></div>
        <div className="w-16 h-1 bg-purple-600 rounded-full"></div>
        <div className="w-8 h-1 bg-purple-600 rounded-full"></div>
      </div>

    </div>
    </>
  )
}
