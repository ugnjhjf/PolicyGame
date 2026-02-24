'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Tablet } from 'lucide-react'
import { MapInteractiveLayer } from '../../components/map/MapInteractiveLayer'
import GameObjectivePanel from '../../components/GameObjectivePanel'
import { GameOverlays, DevToolsPanel } from '../../components/game'
import { useGameState } from '../../hooks/useGameState'

export default function GamePage() {
    const state = useGameState()

    return (
        <div className="min-h-screen relative pt-0">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/background/city_overview.png"
                    alt="City Overview"
                    fill
                    className="object-cover"
                    priority
                    quality={75}
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAxAPwCdABmX/9k="
                    unoptimized
                />
                {/* Permanent brightness reduction */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: state.showDialogue ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-none"
                />

                <MapInteractiveLayer
                    events={state.rpgState.map.activeEvents}
                    onEventSelect={state.handleMapEvent}
                />
            </div>

            <GameObjectivePanel
                tasks={{
                    zhangCompleted: state.rpgState.map.activeEvents.find(e => e.id === 'aunt_zhang')?.status === 'completed',
                    chanCompleted: state.rpgState.map.activeEvents.find(e => e.id === 'officer_chan')?.status === 'completed',
                    michaelCompleted: state.rpgState.map.activeEvents.find(e => e.id === 'michael')?.status === 'completed'
                }}
                onTaskClick={state.handleMapEvent}
                isVisible={state.rpgState.map.activeEvents.length > 0}
            />

            {/* PDA Button */}
            <div className="fixed bottom-8 left-8 z-30">
                <button
                    onClick={() => {
                        state.setPdaTab('journal')
                        state.setShowPDA(true)
                    }}
                    className="group flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-lg hover:bg-blue-500 hover:scale-110 transition-all duration-300"
                    title="Open PDA (Journal & Encyclopedia)"
                >
                    <Tablet className="w-8 h-8 text-white" />
                    <div className="absolute left-full ml-4 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Open PDA
                    </div>
                </button>
            </div>

            {/* All Popups and Overlays */}
            <GameOverlays 
                state={state} 
                setReportData={state.setReportData as any} 
                setShowReport={state.setShowReport as any} 
                setShowPDA={state.setShowPDA as any} 
                setPdaSelectedId={state.setPdaSelectedId as any} 
            />

            {/* Dev Tools Footer & Panel */}
            <DevToolsPanel 
                isDevMode={state.isDevMode} 
                setIsDevMode={state.setIsDevMode} 
                onUnlockAll={state.handleDevUnlockAll} 
            />
        </div>
    )
}
