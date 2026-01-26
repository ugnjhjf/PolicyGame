'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, User, MapPin, ChevronRight, Target, Briefcase, Activity, Search } from 'lucide-react'

export default function StoryPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/background/Introduction.png"
        alt="Cyberpunk City Background"
        fill
        className="object-cover opacity-60"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-black/50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_black_100%)] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col justify-center items-center lg:items-start lg:px-20">

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
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="font-serif text-3xl text-white max-w-3xl leading-relaxed font-light">
            <span>Background</span>
          </p>

          {/* Divider */}
          <div className="h-1 w-30 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" />        </motion.div>

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
              <h2 className="text-2xl font-serif font-bold text-white">Identity</h2>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-10 space-y-6 text-white leading-relaxed font-light shadow-2xl relative overflow-hidden group">
              <p className="text-2xl font-roboto">
                You are <strong className="text-white">head of department of AI Security</strong>, the city mayor requires your to balance the use of AI Safety & AI accuracy.
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
              <h2 className="text-2xl font-serif font-bold text-white">Your Tasks</h2>
            </div>
            <div className="font-roboto grid gap-4">
              {[
                {
                  label: "Step 1",
                  value: "Collect data",
                  icon: Search,
                  color: "blue"
                }, {
                  label: "Step 2",
                  value: "Analyze data",
                  icon: Target,
                  color: "blue"
                }, {
                  label: "Step 3",
                  value: "Optimize the AI model",
                  icon: Activity,
                  color: "blue"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl flex items-center gap-5 hover:bg-white/10 transition-colors">
                  <div className={`p-3 rounded-lg bg-${item.color}-500/20`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                  </div>
                  <div>
                    <div className="text-l font-mono text-gray-400 uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="text-xl text-white font-medium">{item.value}</div>
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
              <span>CONTINUE</span>
              <ChevronRight className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
            </a>
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
