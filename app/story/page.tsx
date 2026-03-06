'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BookOpen, User, MapPin, ChevronRight, Target, Briefcase, Activity, Search } from 'lucide-react'

export default function StoryPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

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

      <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col justify-center items-center lg:px-20 overflow-hidden">

        {/* Navigation & Header */}
        <div className="absolute top-8 left-4 lg:left-20 right-4 lg:right-20 flex justify-between items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentPage === 1 ? (
              <Link href="/" className="group flex items-center gap-2 text-blue-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono text-sm tracking-wider uppercase">Return to Main</span>
              </Link>
            ) : (
              <button onClick={() => setCurrentPage(1)} className="group flex items-center gap-2 text-blue-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono text-sm tracking-wider uppercase">Previous</span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 mt-8 mx-auto"
        >
          <p className="font-serif text-3xl text-white max-w-3xl leading-relaxed font-light flex flex-col items-center">
            <span>{currentPage === 1 ? 'Background' : 'Objectives'}</span>
          </p>

          {/* Divider */}
          <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="w-full max-w-4xl mx-auto min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentPage === 1 && (
              <motion.div
                key="page1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 w-full"
              >
                <div className="flex justify-center items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white">Your role</h2>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-10 space-y-6 text-white leading-relaxed font-light shadow-2xl relative overflow-hidden group max-w-2xl mx-auto text-center">
                  <p className="text-2xl font-roboto">
                    You are <strong className="text-white">head of department of AI Security</strong>. The city mayor requires you to balance the use of AI Safety & AI accuracy.
                  </p>
                </div>
              </motion.div>
            )}

            {currentPage === 2 && (
              <motion.div
                key="page2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="space-y-8 w-full"
              >
                <div className="flex justify-center items-center gap-3 mb-6">
                  <div className="p-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg">
                    <User className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white">Your Tasks</h2>
                </div>
                <div className="font-roboto flex flex-col gap-4 max-w-2xl mx-auto">
                  {[
                    {
                      label: "Step 1",
                      value: "Collect data",
                      number: "1",
                      color: "blue"
                    }, {
                      label: "Step 2",
                      value: "Analyze data",
                      number: "2",
                      color: "blue"
                    }, {
                      label: "Step 3",
                      value: "Optimize the AI model",
                      number: "3",
                      color: "blue"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl flex items-center gap-5 hover:bg-white/10 transition-colors">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-lg bg-${item.color}-500/20`}>
                        <span className={`text-2xl font-bold font-mono text-${item.color}-400`}>{item.number}</span>
                      </div>
                      <div>
                        <div className="text-l font-mono text-gray-400 uppercase tracking-wider mb-1 text-left">{item.label}</div>
                        <div className="text-2xl text-white font-medium text-left">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center mt-16"
        >
          {currentPage === 1 ? (
            <button
              onClick={() => setCurrentPage(2)}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl rounded-none clip-path-hero transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span>NEXT</span>
              <ChevronRight className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
            </button>
          ) : (
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
          )}
        </motion.div>

      </div>
    </div>
  )
}
