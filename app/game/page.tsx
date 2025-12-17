'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Tablet } from 'lucide-react'
import { INITIAL_RPG_STATE, RPGState, Concept, Clue, InvestigationReportData } from '../../types/rpg'
import { MapInteractiveLayer } from '../../components/map/MapInteractiveLayer'
import { DialogueOverlay } from '../../components/vn/DialogueOverlay'
import { PDAOverlay } from '../../components/pda/PDAOverlay'
import GameStatusBar from '../../components/GameStatusBar'
import { InvestigationReportOverlay } from '../../components/pda/InvestigationReportOverlay'
import { PDANotification, type PDANotificationProps } from '../../components/pda/PDANotification'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../../config/data'
import dialogueData from '../../config/data/dialogue'
import clueData from '../../config/data/journal'
import conceptData from '../../config/data/encyclopedia'
import annaConcept from '../../config/data/encyclopedia/anna.json'
import allReportData from '../../config/data/report'

export default function GamePage() {
    // 游戏状态数据
    const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
    // RPG 状态
    const [rpgState, setRpgState] = useState<RPGState>(INITIAL_RPG_STATE)

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
    const [dialogueContent, setDialogueContent] = useState<{ name: string; title?: string; traits?: string[]; text: string }>({ name: '', text: '' })
    const [currentEventId, setCurrentEventId] = useState<string | null>(null)

    // Notification State
    const [notification, setNotification] = useState<Omit<PDANotificationProps, 'isVisible' | 'onClose'> | null>(null)
    const [showNotification, setShowNotification] = useState(false)

    const triggerNotification = (title: string, message: string, type: PDANotificationProps['type'] = 'info', onClick?: () => void) => {
        setNotification({ title, message, type, onClick })
        setShowNotification(true)
    }

    // Dialogue Queue State
    const [dialogueQueue, setDialogueQueue] = useState<any[]>([])

    // Helper to start a dialogue sequence
    const startDialogue = (sequenceKey: keyof typeof dialogueData.events) => {
        // @ts-ignore - Dynamic key access
        const sequence = dialogueData.events[sequenceKey]
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

        if (!currentEventId) {
            // Check if it was Anna's dialogue
            // We can infer this if we just finished a dialogue and there is no currentEventId active
            // For robustness, we check if we just finished 'anna_dialogue' but we don't track the *active* dialogue name explicitly in state.
            // However, since Anna is the only one triggered without an event ID, we can treat "no event ID" + "dialogue finished" as tutorial end.

            // Dynamic Unlock from annaConcept
            const newConcepts = Object.values(annaConcept).map((c: any) => ({
                ...c,
                isRead: false
            }))

            if (newConcepts.length > 0) {
                setRpgState(prev => {
                    // Filter out already unlocked concepts to avoid duplicates
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
                    // Pre-set tab just in case, but rely on click for opening
                    setPdaTab('journal')
                }, 300)
            }

        } else if (event.status === 'investigating') {
            // Now handled by Report Overlay
        }
    }

    // 初始化游戏状态（移除实时同步）
    useEffect(() => {
        // 只进行一次初始状态同步
        const currentState = GameStateManager.getCurrentState()
        setGameState(currentState)

        // Tutorial Trigger
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
            // Step 1: Dialogue
            if (eventId === 'aunt_zhang') startDialogue('aunt_zhang_dialogue')
            else if (eventId === 'michael') startDialogue('michael_dialogue')
        } else if (event.status === 'investigating') {
            // Step 3: Investigation Logic

            // If not started or in progress, start timer
            if (event.progress === undefined || event.progress < 100) {
                // Simulate scanning
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
                // Step 4: Show Report if done
                // Load report data based on ID
                let data: InvestigationReportData | null = null;

                if (eventId === 'aunt_zhang') {
                    data = allReportData.aunt_zhang as InvestigationReportData
                } else if (eventId === 'michael') {
                    data = allReportData.michael as InvestigationReportData
                }

                if (data) {
                    setReportData(data)
                    setShowReport(true)

                    // Unlock Report in State if new
                    setRpgState(prev => {
                        // Check 'prev.player.reports'
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

        // Step 5: Unlock Concept after report is read
        if (!currentEventId) return

        const event = rpgState.map.activeEvents.find(e => e.id === currentEventId)
        // Only complete if report was finished
        if (event && event.status === 'investigating' && event.progress === 100) {
            let newConcept;
            if (currentEventId === 'aunt_zhang') newConcept = conceptData.concept_selection_bias
            else if (currentEventId === 'michael') newConcept = conceptData.concept_algorithmic_bias

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

    // ... (handleDialogueNext)

    return (
        <div className="min-h-screen relative pt-12">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/city_overview.png"
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
                {/* Semi-transparent mask */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Map Interaction Layer */}
                <MapInteractiveLayer
                    events={rpgState.map.activeEvents}
                    onEventSelect={handleMapEvent}
                />
            </div>

            {/* Top Status Bar */}
            <GameStatusBar />

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
            <div className="fixed bottom-4 right-4 z-10">
                <p className="text-xs text-white/60 font-medium">
                    Developer: Rokidna G
                </p>
            </div>
        </div>
    )
}
