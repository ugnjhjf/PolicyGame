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
            color: "blue"
        },
        {
            id: 2,
            title: "Chapter 2",
            subtitle: "Privacy",
            description: "Balance surveillance capabilities.",
            icon: Shield,
            status: "locked",
            link: "#",
            color: "purple"
        },
        {
            id: 3,
            title: "Chapter 3",
            subtitle: "Transparency",
            description: "Ensure algorithmic accountability.",
            icon: Eye,
            status: "locked",
            link: "#",
            color: "cyan"
        }
    ]

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/background/Introduction.png"
                    alt="Cyberpunk City Background"
                    fill
                    className="object-cover opacity-30"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black_100%)] pointer-events-none" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '60px 60px' }}
            />

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">

                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Link href="/story" className="group flex items-center gap-2 text-blue-400 hover:text-white transition-colors w-fit">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono text-sm tracking-wider uppercase">Back to Briefing</span>
                    </Link>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-4">
                        <span className="font-serif text-3xl text-white font-light">
                            SELECT CHAPTER
                        </span>
                    </h1>

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
                  h-full bg-white/5 backdrop-blur-md border rounded-2xl p-6 lg:p-8 flex flex-col transition-all duration-300 relative overflow-hidden
                  ${chapter.status === 'active'
                                        ? 'border-blue-500/30 hover:border-blue-500 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:-translate-y-2'
                                        : 'border-white/5 opacity-60'}
                `}>

                                    {/* Status Indicator */}
                                    <div className="absolute top-4 right-4">
                                        {chapter.status === 'locked' ? (
                                            <div className="flex items-center gap-1 text-xs font-mono text-gray-500 bg-black/50 px-2 py-1 rounded">
                                                <Lock className="w-3 h-3" />
                                                LOCKED
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-xs font-mono text-green-400 bg-green-900/30 px-2 py-1 rounded animate-pulse">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                                AVAILABLE
                                            </div>
                                        )}
                                    </div>

                                    {/* Icon */}
                                    <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors
                    ${chapter.status === 'active' ? `bg-${chapter.color}-500/20 text-${chapter.color}-400` : 'bg-gray-800 text-gray-600'}
                  `}>
                                        <chapter.icon className="w-6 h-6" />
                                    </div>

                                    {/* Content */}
                                    <div className="mb-auto">
                                        <h3 className={`text-xl font-bold mb-2 ${chapter.status === 'active' ? 'text-white' : 'text-gray-500'}`}>
                                            {chapter.title}
                                        </h3>
                                        <div className={`font-serif text-4xl font-black mb-6  ${chapter.status === 'active' ? `text-${chapter.color}-400` : 'text-gray-600'}`}>
                                            {chapter.subtitle}
                                        </div>
                                        <p className="text-roboto text-xl text-white leading-relaxed font-light">
                                            {chapter.description}
                                        </p>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center">
                                        {chapter.status === 'active' ? (
                                            <div
                                                className="w-full relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 group-hover:bg-green-600 text-white font-bold text-lg rounded-none transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                                                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                                <Play className={`w-5 h-5 fill-current transition-transform duration-300 ${hoveredChapter === chapter.id ? 'translate-x-1' : ''}`} />
                                                <span>PLAY</span>
                                            </div>
                                        ) : (
                                            <div
                                                className="w-full relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 text-gray-500 font-bold text-lg rounded-none transition-all"
                                                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
                                            >
                                                <Lock className="w-5 h-5" />
                                                <span>COMING SOON</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Active Hover Effect Background */}
                                    {chapter.status === 'active' && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    )}

                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    )
}
