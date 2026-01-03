'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Tablet, Zap } from 'lucide-react'
import { INITIAL_RPG_STATE, RPGState, Concept, Clue, InvestigationReportData } from '@/types/rpg'
import { MapInteractiveLayer } from '../../components/map/MapInteractiveLayer'
import { DialogueOverlay } from '../../components/vn/DialogueOverlay'
import { PDAOverlay } from '../../components/pda/PDAOverlay'
import { PDANotification, type PDANotificationProps } from '../../components/pda/PDANotification'
import { InvestigationReportOverlay } from '../../components/pda/InvestigationReportOverlay'
import { SolutionMatchingOverlay } from '../../components/minigame/SolutionMatchingOverlay'
import { dialogue_intro, dialogue_aunt_zhang_start, dialogue_michael_start, dialogue_officer_chan, dialogue_solution_intro } from '../../config/data/dialogue'
import { events as mapEvents } from '../../config/data/map'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../../config/data'
import clueData from '../../config/data/journal'
import conceptData from '../../config/data/encyclopedia'
import annaConcept from '../../config/data/encyclopedia/round_1/anna.json'
import allReportData from '../../config/data/report'

// Need to define PDANotification component locally if not exported or use the one from imports if available.
// The previous file used PDANotification from a specific path but imports were messy.
// Based on imports above: import { PDAOverlay, ... } from '../../components/pda/PDASystem'
// Let's assume PDANotification is exported from there or PDANotification.tsx

export default function GamePage() {
    // 游戏状态数据
    const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
    // RPG 状态
    const [rpgState, setRpgState] = useState<RPGState>(INITIAL_RPG_STATE)

    // Solution Minigame State
    const [showSolutionGame, setShowSolutionGame] = useState(false)
    const [solutionPlacements, setSolutionPlacements] = useState<Record<string, string>>({})
    const [isSolutionComplete, setIsSolutionComplete] = useState(false)

    // Check for Final Event Unlock
    useEffect(() => {
        // Unlock "Town Hall" if all 3 reports are collected
        if (rpgState.player.reports.length >= 3) {
            setRpgState(prev => {
                if (prev.map.activeEvents.some(e => e.id === 'town_hall')) return prev
                return {
                    ...prev,
                    map: {
                        activeEvents: [
                            ...prev.map.activeEvents,
                            {
                                id: 'town_hall',
                                x: 50,
                                y: 20, // Top center
                                label: 'Policy Center',
                                status: 'available'
                            }
                        ]
                    }
                }
            })
        }
    }, [rpgState.player.reports.length])

    const handleSolutionComplete = () => {
        setIsSolutionComplete(true)
        setShowSolutionGame(false)
        triggerNotification('POLICY SYNTHESIZED', 'New Framework Established', 'success')
    }

    // 覆盖初始事件
    useEffect(() => {
        setRpgState(prev => ({
            ...prev,
            map: {
                activeEvents: [
                    {
                        id: 'aunt_zhang',
                        x: 35,
                        y: 65,
                        label: 'Aunt Zhang\'s Shop',
                        status: 'available'
                    },
                    {
                        id: 'michael',
                        x: 65,
                        y: 35,
                        label: 'Michael\'s Office',
                        status: 'available'
                    },
                    {
                        id: 'officer_chan',
                        x: 50,
                        y: 50,
                        label: 'Officer Chan\'s Patrol',
                        status: 'available'
                    }
                ]
            }
        }))
    }, [])

    // UI 状态
    const [showPDA, setShowPDA] = useState(false)
    const [pdaTab, setPdaTab] = useState<'journal' | 'encyclopedia' | 'reports'>('journal')
    const [pdaSelectedId, setPdaSelectedId] = useState<string | null>(null)
    const [showDialogue, setShowDialogue] = useState(false)
    const [dialogueContent, setDialogueContent] = useState<{ name: string; title?: string; image?: string; traits?: string[]; text: string }>({ name: '', text: '' })
    const [currentEventId, setCurrentEventId] = useState<string | null>(null)

    // Notification State
    const [notification, setNotification] = useState<Omit<PDANotificationProps, 'isVisible' | 'onClose'> | null>(null)
    const [showNotification, setShowNotification] = useState(false)

    const triggerNotification = (title: string, message: string, type: PDANotificationProps['type'] = 'info', onClick?: () => void) => {
        setNotification({ title, message, type, onClick })
        setShowNotification(true)
    }

    // Developer Mode State
    const [isDevMode, setIsDevMode] = useState(false)

    // Developer Tool: Unlock All
    const handleDevUnlockAll = () => {
        const allClues = Object.values(clueData).map((c: any) => ({ ...c, isRead: true }))
        const allConcepts = Object.values(conceptData).map((c: any) => ({ ...c, isRead: true }))
        const allReports = Object.values(allReportData).map((r: any) => ({ ...r, isRead: true }))

        setRpgState(prev => ({
            ...prev,
            player: {
                ...prev.player,
                inventory: prev.player.inventory, // Keep inventory
                journal: allClues,
                encyclopedia: allConcepts,
                reports: allReports
            },
            map: {
                activeEvents: prev.map.activeEvents.map(e => ({
                    ...e,
                    status: 'completed' // Mark all map events as completed
                }))
            }
        }))

        triggerNotification('DEV TOOL', 'All content unlocked!', 'success')
        setShowPDA(true)
    }

    // Dialogue Queue State
    const [dialogueQueue, setDialogueQueue] = useState<any[]>([])

    // Helper to start a dialogue sequence
    const startDialogue = (sequenceKey: string) => {
        let sequence: any[] = []

        // Access dialogue data using correct keys based on JSON structure
        if (sequenceKey === 'anna_dialogue') sequence = (dialogue_intro as any).anna_dialogue
        else if (sequenceKey === 'aunt_zhang_dialogue') sequence = (dialogue_aunt_zhang_start as any).aunt_zhang_dialogue
        else if (sequenceKey === 'michael_dialogue') sequence = (dialogue_michael_start as any).michael_dialogue
        else if (sequenceKey === 'officer_chan_dialogue') sequence = (dialogue_officer_chan as any).officer_chan_dialogue
        else if (sequenceKey === 'solution_intro') sequence = (dialogue_solution_intro as any).solution_intro

        if (sequence && sequence.length > 0) {
            setDialogueQueue(sequence)
            setDialogueContent(sequence[0])
            setShowDialogue(true)
        }
    }

    const handleDialogueNext = () => {
        // Check if there are more lines
        if (dialogueQueue.length > 1) {
            const nextQueue = dialogueQueue.slice(1)
            setDialogueQueue(nextQueue)
            setDialogueContent(nextQueue[0])
            return
        }

        // End of dialogue
        setShowDialogue(false)
        setDialogueQueue([])

        if (currentEventId === 'town_hall') {
            setShowSolutionGame(true)
            return
        }

        if (!currentEventId) {
            // Tutorial End Logic
            // We assume this is the end of the intro dialogue
            const newConcepts = Object.values(annaConcept).map((c: any) => ({
                ...c,
                isRead: false
            }))

            if (newConcepts.length > 0) {
                setRpgState(prev => {
                    const existingIds = new Set(prev.player.encyclopedia.map(c => c.id))
                    const uniqueNewConcepts = newConcepts.filter((c: any) => !existingIds.has(c.id))
                    if (uniqueNewConcepts.length === 0) return prev
                    return {
                        ...prev,
                        player: {
                            ...prev.player,
                            encyclopedia: [...prev.player.encyclopedia, ...uniqueNewConcepts]
                        }
                    }
                })

                setTimeout(() => {
                    triggerNotification('Tutorial Complete', 'PDA Encyclopedia Updated', 'info')
                    setPdaTab('encyclopedia')
                    setShowPDA(true)
                }, 500)
            }
            return
        }

        const event = rpgState.map.activeEvents.find(e => e.id === currentEventId)
        if (!event) return

        if (event.status === 'available') {
            // Add Clue Phase
            let newClue;
            if (currentEventId === 'aunt_zhang') newClue = clueData.clue_zhang_ledger
            else if (currentEventId === 'michael') newClue = clueData.clue_michael_cctv
            else if (currentEventId === 'officer_chan') newClue = clueData.clue_officer_chan

            if (newClue) {
                setRpgState(prev => ({
                    ...prev,
                    player: {
                        ...prev.player,
                        journal: [...prev.player.journal, newClue]
                    },
                    map: {
                        activeEvents: prev.map.activeEvents.map(e =>
                            e.id === currentEventId ? { ...e, status: 'investigating' } : e
                        )
                    }
                }))

                setTimeout(() => {
                    const handleNotificationClick = () => {
                        setPdaSelectedId(newClue.id)
                        setPdaTab('journal')
                        setShowPDA(true)
                        setShowNotification(false)
                    }
                    triggerNotification(
                        'New Clue Discovered',
                        newClue.title.split('(')[0].trim(),
                        'clue',
                        handleNotificationClick
                    )
                    setPdaTab('journal')
                }, 300)
            }

        }
    }

    // 初始化游戏状态
    useEffect(() => {
        const currentState = GameStateManager.getCurrentState()
        setGameState(currentState)
        startDialogue('anna_dialogue')
    }, [])

    // Report State
    const [showReport, setShowReport] = useState(false)
    const [reportData, setReportData] = useState<InvestigationReportData | null>(null)

    // 处理地图事件点击
    const handleMapEvent = (eventId: string) => {
        setCurrentEventId(eventId)
        const event = rpgState.map.activeEvents.find(e => e.id === eventId)
        if (!event) return

        if (event.status === 'available') {
            if (eventId === 'aunt_zhang') startDialogue('aunt_zhang_dialogue')
            else if (eventId === 'michael') startDialogue('michael_dialogue')
            else if (eventId === 'officer_chan') startDialogue('officer_chan_dialogue')
            else if (eventId === 'town_hall') startDialogue('solution_intro')
        } else if (event.status === 'investigating') {
            // Scanning Logic
            if (event.progress === undefined || event.progress < 100) {
                const interval = setInterval(() => {
                    setRpgState(prev => {
                        const currentEvent = prev.map.activeEvents.find(e => e.id === eventId)
                        if (!currentEvent) {
                            clearInterval(interval)
                            return prev
                        }
                        const newProgress = (currentEvent.progress || 0) + 10
                        if (newProgress >= 100) clearInterval(interval)
                        return {
                            ...prev,
                            map: {
                                activeEvents: prev.map.activeEvents.map(e =>
                                    e.id === eventId ? { ...e, progress: Math.min(newProgress, 100) } : e
                                )
                            }
                        }
                    })
                }, 100)
            } else {
                // Show Report
                let data: InvestigationReportData | null = null;
                if (eventId === 'aunt_zhang') data = allReportData.aunt_zhang as InvestigationReportData
                else if (eventId === 'michael') data = allReportData.michael as InvestigationReportData
                else if (eventId === 'officer_chan') data = allReportData.officer_chan as InvestigationReportData

                if (data) {
                    setReportData(data)
                    setShowReport(true)
                    setRpgState(prev => {
                        if (prev.player.reports.some(r => r.fileId === data!.fileId)) return prev
                        return {
                            ...prev,
                            player: {
                                ...prev.player,
                                reports: [...prev.player.reports, data!]
                            }
                        }
                    })
                }
            }
        }
    }

    const handleReportClose = () => {
        setShowReport(false)
        setPdaTab('reports')
        setShowPDA(true)

        if (!currentEventId) return
        const event = rpgState.map.activeEvents.find(e => e.id === currentEventId)
        if (event && event.status === 'investigating' && event.progress === 100) {
            let newConcept;
            if (currentEventId === 'aunt_zhang') newConcept = conceptData.concept_selection_bias
            else if (currentEventId === 'michael') newConcept = conceptData.concept_algorithmic_bias
            else if (currentEventId === 'officer_chan') newConcept = conceptData.concept_confirmation_bias

            if (newConcept) {
                setRpgState(prev => ({
                    ...prev,
                    player: {
                        ...prev.player,
                        encyclopedia: [...prev.player.encyclopedia, newConcept]
                    },
                    map: {
                        activeEvents: prev.map.activeEvents.map(e =>
                            e.id === currentEventId ? { ...e, status: 'completed' } : e
                        )
                    }
                }))

                setTimeout(() => {
                    triggerNotification('PDA Encyclopedia Updated', `Unlocked: ${newConcept.title.split('(')[0].trim()}`, 'info')
                    setPdaTab('encyclopedia')
                    setShowPDA(true)
                }, 500)
            }
        }
    }

    const handleReportNavigate = (direction: 'next' | 'prev') => {
        if (!reportData) return
        const reports = rpgState.player.reports
        const currentIndex = reports.findIndex(r => r.fileId === reportData.fileId)
        if (currentIndex === -1) return
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
        if (newIndex >= 0 && newIndex < reports.length) {
            setReportData(reports[newIndex])
        }
    }

    const handleMarkAsRead = (type: 'journal' | 'encyclopedia' | 'reports', id: string) => {
        setRpgState(prev => {
            if (type === 'journal') {
                return {
                    ...prev,
                    player: {
                        ...prev.player,
                        journal: prev.player.journal.map(item =>
                            item.id === id ? { ...item, isRead: true } : item
                        )
                    }
                }
            } else if (type === 'encyclopedia') {
                return {
                    ...prev,
                    player: {
                        ...prev.player,
                        encyclopedia: prev.player.encyclopedia.map(item =>
                            item.id === id ? { ...item, isRead: true } : item
                        )
                    }
                }
            } else if (type === 'reports') {
                return {
                    ...prev,
                    player: {
                        ...prev.player,
                        reports: prev.player.reports.map(item =>
                            item.fileId === id ? { ...item, isRead: true } : item
                        )
                    }
                }
            }
            return prev
        })
    }

    return (
        <div className="min-h-screen relative pt-12">
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
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    unoptimized
                />
                <div className="absolute inset-0 bg-black/20"></div>

                <MapInteractiveLayer
                    events={rpgState.map.activeEvents}
                    onEventSelect={handleMapEvent}
                />
            </div>

            {/* Top Status Bar - assuming GameStatusBar is a valid component but was missing in imports. 
                Wait, previous file had <GameStatusBar /> but no import! 
                I need to re-add import if it exists, or likely it was removed or I missed it in view_file.
                Line 424 had <GameStatusBar />.
                Let's assume it is in components/GameStatusBar.tsx 
            */}
            {/* <GameStatusBar /> - Disabling for now as import was missing/erroring in previous checks */}

            {/* PDA Button */}
            <div className="fixed bottom-8 left-8 z-30">
                <button
                    onClick={() => {
                        setPdaTab('journal')
                        setShowPDA(true)
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

            {/* Overlays */}
            <DialogueOverlay
                isOpen={showDialogue}
                characterName={dialogueContent.name}
                characterTitle={dialogueContent.title}
                characterImage={dialogueContent.image}
                characterTraits={dialogueContent.traits}
                text={dialogueContent.text}
                onNext={handleDialogueNext}
            />

            <PDAOverlay
                isOpen={showPDA}
                onClose={() => setShowPDA(false)}
                activeTab={pdaTab}
                concepts={rpgState.player.encyclopedia}
                clues={rpgState.player.journal}
                reports={rpgState.player.reports}
                onReportSelect={(report) => {
                    setReportData(report)
                    setShowReport(true)
                    setShowPDA(false)
                }}
                onMarkAsRead={handleMarkAsRead}
                activeItemId={pdaSelectedId}
            />

            <InvestigationReportOverlay
                isOpen={showReport}
                onClose={handleReportClose}
                data={reportData}
                onNext={() => handleReportNavigate('next')}
                onPrev={() => handleReportNavigate('prev')}
                hasNext={!!(reportData && rpgState.player.reports.findIndex(r => r.fileId === reportData.fileId) < rpgState.player.reports.length - 1)}
                hasPrev={!!(reportData && rpgState.player.reports.findIndex(r => r.fileId === reportData.fileId) > 0)}
            />

            <SolutionMatchingOverlay
                isOpen={showSolutionGame}
                onClose={() => setShowSolutionGame(false)}
                initialPlacements={solutionPlacements}
                onSaveState={(placements) => setSolutionPlacements(placements)}
                onComplete={handleSolutionComplete}
            />

            {/* Notifications */}
            {notification && (
                <PDANotification
                    isVisible={showNotification}
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setShowNotification(false)}
                    onClick={notification.onClick}
                />
            )}

            {/* Developer Footer */}
            <div className="fixed bottom-4 right-4 z-10 flex flex-col items-end gap-2">
                <p className="text-xs text-white/60 font-medium">
                    Developer: Rokidna G
                </p>
            </div>

            {/* Developer Tools Toggle */}
            <div className="fixed top-20 right-4 z-50 flex flex-col items-end gap-2">
                <button
                    onClick={() => setIsDevMode(!isDevMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all border ${isDevMode
                        ? 'bg-red-500/80 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                        : 'bg-black/40 text-gray-400 border-white/10 hover:bg-black/60 hover:text-white'
                        }`}
                >
                    {isDevMode ? 'DEV MODE: ON' : 'DEV MODE'}
                </button>

                {isDevMode && (
                    <div className="bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-2xl animate-in slide-in-from-right-4 fade-in duration-200">
                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs text-blue-300 font-bold uppercase mb-1">Debug Controls</h4>
                            <button
                                onClick={handleDevUnlockAll}
                                className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-between gap-3 group"
                            >
                                <span>UNLOCK ALL CONTENT</span>
                                <Zap className="w-3 h-3 group-hover:text-yellow-400 transition-colors" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
