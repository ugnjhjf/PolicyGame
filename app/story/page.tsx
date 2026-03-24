'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User, MapPin, ChevronRight } from 'lucide-react'

export default function StoryPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="absolute inset-0 z-0 bg-gray-50 text-gray-900 font-sans selection:bg-purple-100">
      {/* Light Background */}
      <Image
        src="/background/Introduction.png"
        alt="City Background"
        fill
        className="object-cover opacity-10 grayscale"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-white/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col justify-center items-center lg:px-20 overflow-hidden">

        {/* Navigation & Header */}
        <div className="absolute top-8 left-4 lg:left-12 right-4 lg:right-12 flex justify-between items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentPage === 1 ? (
              <Link href="/" className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono text-xs tracking-wider uppercase">Return to Main</span>
              </Link>
            ) : (
              <button onClick={() => setCurrentPage(1)} className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono text-xs tracking-wider uppercase">Previous</span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 mt-4 mx-auto"
        >
          <p className="font-serif text-3xl font-medium text-gray-900 max-w-3xl leading-relaxed flex flex-col items-center">
            <span>{currentPage === 1 ? 'Background Briefing' : 'Mission Objectives'}</span>
          </p>

          {/* Divider */}
          <div className="h-1.5 w-24 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full mx-auto mt-4" />
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
                className="space-y-6 w-full max-w-2xl mx-auto"
              >
                <div className="flex justify-center items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <MapPin className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">Your role</h2>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-10 space-y-6 text-gray-700 leading-relaxed font-light shadow-md relative overflow-hidden group text-center">
                  <p className="text-2xl font-medium">
                    You are <strong className="text-indigo-600 font-bold">head of department of AI Security</strong>. The city mayor requires you to balance the use of AI Safety & AI accuracy.
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
                className="space-y-6 w-full max-w-2xl mx-auto"
              >
                <div className="flex justify-center items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Your Tasks</h2>
                </div>
                
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Step 1", value: "Collect data", number: "1", color: "purple" },
                    { label: "Step 2", value: "Analyze data", number: "2", color: "indigo" },
                    { label: "Step 3", value: "Optimize the AI model", number: "3", color: "blue" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 p-6 rounded-2xl flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-${item.color}-50 border border-${item.color}-100 shrink-0`}>
                        <span className={`text-2xl font-bold font-mono text-${item.color}-600`}>{item.number}</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                        <div className="text-xl text-gray-900 font-semibold">{item.value}</div>
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
          className="flex justify-center mt-12"
        >
          {currentPage === 1 ? (
            <button
              onClick={() => setCurrentPage(2)}
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gray-900 hover:bg-purple-600 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span>NEXT STAGE</span>
              <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </button>
          ) : (
            <Link href="/chapter" legacyBehavior>
              <a
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gray-900 hover:bg-purple-600 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span>CONTINUE</span>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </a>
            </Link>
          )}
        </motion.div>

      </div>
    </div>
  )
}
