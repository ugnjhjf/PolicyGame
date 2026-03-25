'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Play, Eye, Shield, Database } from 'lucide-react'

export default function ChapterPage() {
    const [hoveredChapter, setHoveredChapter] = useState<number | null>(null)

    const chapters = [
        {
            id: 1,
            title: "Chapter 1",
            subtitle: "Bias",
            description: "Identify and mitigate algorithmic bias.",
            icon: Database,
            status: "active",
            link: "/game",
            color: "purple"
        },
        {
            id: 2,
            title: "Chapter 2",
            subtitle: "Privacy",
            description: "Balance surveillance capabilities.",
            icon: Shield,
            status: "locked",
            link: "#",
            color: "indigo"
        },
        {
            id: 3,
            title: "Chapter 3",
            subtitle: "Transparency",
            description: "Ensure algorithmic accountability.",
            icon: Eye,
            status: "locked",
            link: "#",
            color: "blue"
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 relative overflow-hidden font-sans selection:bg-purple-100">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/background/Introduction.png`}
                    alt="Cyberpunk City Background"
                    fill
                    className="object-cover opacity-10 grayscale"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-white/80 pointer-events-none" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">

                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 mt-4"
                >
                    <Link href="/story" className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 w-fit">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono text-xs tracking-wider uppercase">Back to Briefing</span>
                    </Link>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        <span className="font-serif text-gray-900 font-medium tracking-tight">
                            Select Assignment
                        </span>
                    </h1>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full mx-auto" />
                </motion.div>

                {/* Chapters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {chapters.map((chapter, idx) => (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                        >
                            <Link
                                href={chapter.link}
                                className={`block h-full relative group ${chapter.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={(e) => chapter.status === 'locked' && e.preventDefault()}
                                onMouseEnter={() => setHoveredChapter(chapter.id)}
                                onMouseLeave={() => setHoveredChapter(null)}
                            >
                                <div className={`
                                    h-full bg-white border rounded-2xl p-6 lg:p-8 flex flex-col transition-all duration-300 relative overflow-hidden shadow-sm
                                    ${chapter.status === 'active'
                                        ? 'border-gray-200 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1'
                                        : 'border-gray-100 bg-gray-50/50 opacity-80'}
                                `}>

                                    {/* Status Indicator */}
                                    <div className="absolute top-5 right-5 z-20">
                                        {chapter.status === 'locked' ? (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                                                <Lock className="w-3 h-3" />
                                                LOCKED
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                AVAILABLE
                                            </div>
                                        )}
                                    </div>

                                    {/* Icon */}
                                    <div className={`
                                        w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors z-10 relative
                                        ${chapter.status === 'active' ? `bg-${chapter.color}-50 border border-${chapter.color}-100 text-${chapter.color}-600 group-hover:bg-${chapter.color}-100` : 'bg-gray-100 text-gray-400 border border-gray-200'}
                                    `}>
                                        <chapter.icon className="w-7 h-7" />
                                    </div>

                                    {/* Content */}
                                    <div className="mb-auto z-10 relative">
                                        <h3 className={`text-sm font-bold tracking-widest uppercase mb-2 ${chapter.status === 'active' ? 'text-gray-400' : 'text-gray-400'}`}>
                                            {chapter.title}
                                        </h3>
                                        <div className={`font-serif text-4xl font-black mb-4 tracking-tight ${chapter.status === 'active' ? `text-gray-900 group-hover:text-${chapter.color}-600 transition-colors` : 'text-gray-400'}`}>
                                            {chapter.subtitle}
                                        </div>
                                        <p className={`text-base leading-relaxed ${chapter.status === 'active' ? 'text-gray-600' : 'text-gray-400'}`}>
                                            {chapter.description}
                                        </p>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center z-10 relative">
                                        {chapter.status === 'active' ? (
                                            <div
                                                className="w-full relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 group-hover:bg-purple-600 text-white font-bold text-sm rounded-full transition-all duration-300"
                                            >
                                                <Play className={`w-4 h-4 fill-current transition-transform duration-300 ${hoveredChapter === chapter.id ? 'translate-x-1' : ''}`} />
                                                <span>PLAY</span>
                                            </div>
                                        ) : (
                                            <div
                                                className="w-full relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-100 text-gray-400 font-bold text-sm rounded-full transition-all border border-gray-200"
                                            >
                                                <Lock className="w-4 h-4" />
                                                <span>COMING SOON</span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    )
}
