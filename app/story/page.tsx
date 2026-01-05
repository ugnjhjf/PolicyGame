'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, User, MapPin, ChevronRight, Target, Briefcase, Activity } from 'lucide-react'

export default function StoryPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background/Introduction.png"
          alt="Cyberpunk City Background"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,_black_100%)] pointer-events-none" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">

        {/* Navigation & Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <Link href="/" className="group flex items-center gap-2 text-blue-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-sm tracking-wider uppercase">Return to Main</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-blue-500/50">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span>SIMULATION MODULE: BRIEFING</span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400">
              Background
            </span>
          </h1>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left Column: Story Background */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">City Status</h2>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-10 space-y-6 text-white leading-relaxed font-light shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <div className="text-xs font-mono text-orange-400/50">LOC: NEW EDEN</div>
              </div>

              <p className="text-xl">
                <strong className="text-orange-400">In 2050.</strong> Artificial intelligence has become the backbone of urban security. The city has recoginze that AI can be a powerful tool, but it also has its limitations.
              </p>
              <p className="text-xl">
                As the <strong className="text-white font-medium">chief officer of department of AI Security</strong>, the city mayor requires your to balance the use of AI Safety & AI accuracy.
              </p>
              <p className="text-xl">
                Your mandate is clear but contradictory: <span className="text-orange-400 italic">Collect data. Analyze data. Optimize the AI model.</span> Every decision you made will siginificant affect the city.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Role & Objectives */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Your roles</h2>
            </div>

            <div className="grid gap-6">
              {[
                {
                  label: "Role",
                  value: "Chief Officer, Department of AI Security ",
                  icon: Briefcase,
                  color: "blue"
                },
                {
                  label: "PRIMARY OBJECTIVE",
                  value: "Balance the AI Safety & AI accuracy",
                  icon: Target,
                  color: "green"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl flex items-center gap-5 hover:bg-white/10 transition-colors">
                  <div className={`p-3 rounded-lg bg-${item.color}-500/20`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                  </div>
                  <div>
                    <div className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="text-white font-medium text-lg leading-tight">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>



          </motion.div>

        </div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center mt-16"
        >
          <Link href="/chapter" legacyBehavior>
            <a
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl rounded-none clip-path-hero transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span>COMMENCE OPERATION</span>
              <ChevronRight className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
            </a>
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
