'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, Brain, Scale, ChevronRight, Terminal, Lock } from 'lucide-react'

export default function Page() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background/Introduction.png"
          alt="Cyberpunk City Background"
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] pointer-events-none" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '50px 50px' }}
      />

      <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col justify-center items-center lg:items-start lg:px-20">

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl space-y-8"
        >
          {/* Header Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-300 text-xs font-bold tracking-widest uppercase">System Online</span>
          </div>

          {/* Title */}
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400">
              AI POLICY
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 mt-2">
              STRATEGIST
            </span>
          </h1>

          {/* Divider */}
          <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" />

          {/* Description */}
          <p className="text-2xl lg:text-3xl text-white max-w-3xl leading-relaxed font-light">
            Explore AI literacy framework through interactive experience <br />
            <span className="text-orange-400 font-medium">Train models. Shape policy. Define the future.</span>
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 w-full">
            {[
              { icon: Brain, label: "Bias", desc: "Common bias in AI models" },
              { icon: Scale, label: "Privacy", desc: "Risk of using data" },
              { icon: Shield, label: "Transparency", desc: "Black box problem" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1), duration: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl flex items-start gap-4 hover:bg-white/10 transition-colors cursor-default group"
              >
                <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-100 text-lg mb-1">{feature.label}</h3>
                  <p className="text-sm text-blue-200/70 leading-snug">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="pt-8"
          >
            <Link href="/story" legacyBehavior>
              <a
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-none clip-path-polygon transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <Terminal className="w-5 h-5" />
                <span>INITIALIZE SIMULATION</span>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </a>
            </Link>
          </motion.div>

          {/* Footer Metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="pt-12 flex items-center gap-6 text-xs text-white/20 font-mono"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse"></div>
              <span>SERVER: ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3" />
              <span>SECURE CONNECTION</span>
            </div>
            <div>VER 1.0.4</div>
          </motion.div>

        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 flex flex-col items-end gap-1 opacity-20 pointer-events-none">
        <div className="w-32 h-1 bg-white"></div>
        <div className="w-24 h-1 bg-white"></div>
        <div className="w-10 h-1 bg-white"></div>
      </div>

      <div className="absolute bottom-10 left-10 flex gap-2 opacity-20 pointer-events-none font-mono text-xs">
        <div>COORDINATES:</div>
        <div>34.0522° N, 118.2437° W</div>
      </div>

    </div>
  )
}
