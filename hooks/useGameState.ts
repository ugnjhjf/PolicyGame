import { useState, useEffect, useCallback } from 'react'
import { INITIAL_RPG_STATE, RPGState, InvestigationReportData } from '@/types/rpg'
import { dialogue_intro, dialogue_aunt_zhang_start, dialogue_michael_start, dialogue_officer_chan, dialogue_solution_intro, dialogue_solution_outro } from '../config/data/dialogue'
import clueData from '../config/data/journal'
import conceptData from '../config/data/encyclopedia'
import annaConcept from '../config/data/encyclopedia/round_1/anna.json'
import allReportData from '../config/data/report'
import type { PDANotificationProps } from '../components/pda/PDANotification'

export function useGameState() {
    // Game and RPG States
    const [rpgState, setRpgState] = useState<RPGState>(INITIAL_RPG_STATE)
    
    // Minigame States
    const [showSolutionGame, setShowSolutionGame] = useState(false)
    const [solutionPlacements, setSolutionPlacements] = useState<Record<string, string>>({})
    const [isSolutionComplete, setIsSolutionComplete] = useState(false)
    const [showLoanGame, setShowLoanGame] = useState(false)
    const [challengeStatus, setChallengeStatus] = useState({ aiSpecialist: false, quizHunter: false })

    // UI States
    const [showPDA, setShowPDA] = useState(false)
    const [pdaTab, setPdaTab] = useState<'journal' | 'encyclopedia' | 'reports'>('journal')
    const [pdaSelectedId, setPdaSelectedId] = useState<string | null>(null)
    const [currentEventId, setCurrentEventId] = useState<string | null>(null)
    
    // Core Overlay Flow States
    const [showChapterCompletion, setShowChapterCompletion] = useState(false)
    const [showQuiz, setShowQuiz] = useState(false)
    const [showMasteryOverlay, setShowMasteryOverlay] = useState(false)
    const [showReport, setShowReport] = useState(false)
    const [reportData, setReportData] = useState<InvestigationReportData | null>(null)
    
    // Dialogue States
    const [showDialogue, setShowDialogue] = useState(false)
    const [dialogueContent, setDialogueContent] = useState<{ name: string; title?: string; image?: string; traits?: string[]; text: string }>({ name: '', text: '' })
    const [dialogueQueue, setDialogueQueue] = useState<any[]>([])
    const [currentDialogueId, setCurrentDialogueId] = useState<string | null>(null)

    // Notification State
    const [notification, setNotification] = useState<Omit<PDANotificationProps, 'isVisible' | 'onClose'> | null>(null)
    const [showNotification, setShowNotification] = useState(false)

    // Tutorial / Intro Statess
    const [hasViewedPolicyIntro, setHasViewedPolicyIntro] = useState(false)
    const [isDevMode, setIsDevMode] = useState(false)

    // Initialization
    useEffect(() => {
        startDialogue('anna_dialogue')
    }, [])

    // Final Event Unlock logic
    useEffect(() => {
        if (rpgState.player.reports.length >= 3) {
            setRpgState(prev => {
                if (prev.map.activeEvents.some(e => e.id === 'town_hall')) return prev
                return {
                    ...prev,
                    map: {
                        activeEvents: [
                            ...prev.map.activeEvents,
                            { id: 'town_hall', x: 58, y: 28, label: 'Department of AI', status: 'available' }
                        ]
                    }
                }
            })
        }
    }, [rpgState.player.reports.length])

    // Soft-lock prevention for Loan Game
    useEffect(() => {
        const auntZhang = rpgState.map.activeEvents.find(e => e.id === 'aunt_zhang')
        const hasOfficerChan = rpgState.map.activeEvents.some(e => e.id === 'officer_chan')
        
        if (auntZhang?.status === 'completed' && !hasOfficerChan && !showLoanGame) {
            setShowLoanGame(true)
        }
    }, [rpgState.map.activeEvents, showLoanGame])

    // Action Handlers
    const triggerNotification = (title: string, message: string, type: PDANotificationProps['type'] = 'info', onClick?: () => void) => {
        setNotification({ title, message, type, onClick })
        setShowNotification(true)
    }

    const handleNotificationClose = useCallback(() => {
        setShowNotification(false)
    }, [])

    const startDialogue = (sequenceKey: string) => {
        let sequence: any[] = []
        setCurrentDialogueId(sequenceKey)

        if (sequenceKey === 'anna_dialogue') sequence = (dialogue_intro as any).anna_dialogue
        else if (sequenceKey === 'aunt_zhang_dialogue') sequence = (dialogue_aunt_zhang_start as any).aunt_zhang_dialogue
        else if (sequenceKey === 'michael_dialogue') sequence = (dialogue_michael_start as any).michael_dialogue
        else if (sequenceKey === 'officer_chan_dialogue') sequence = (dialogue_officer_chan as any).officer_chan_dialogue
        else if (sequenceKey === 'solution_intro') sequence = (dialogue_solution_intro as any).solution_intro
        else if (sequenceKey === 'solution_outro') sequence = (dialogue_solution_outro as any).solution_outro

        if (sequence && sequence.length > 0) {
            setDialogueQueue(sequence)
            setDialogueContent(sequence[0])
            setShowDialogue(true)
        }
    }

    const handleDialogueNext = () => {
        if (dialogueQueue.length > 1) {
            const nextQueue = dialogueQueue.slice(1)
            setDialogueQueue(nextQueue)
            setDialogueContent(nextQueue[0])
            return
        }

        setShowDialogue(false)
        setDialogueQueue([])

        if (currentEventId === 'town_hall') {
            setHasViewedPolicyIntro(true)
            setShowSolutionGame(true)
            return
        }

        if (currentDialogueId === 'anna_dialogue') {
            const newConcepts = Object.values(annaConcept).map((c: any) => ({ ...c, isRead: false }))
            setRpgState(prev => {
                const existingIds = new Set(prev.player.encyclopedia.map(c => c.id))
                const uniqueNewConcepts = newConcepts.filter((c: any) => !existingIds.has(c.id))

                return {
                    ...prev,
                    player: {
                        ...prev.player,
                        encyclopedia: [...prev.player.encyclopedia, ...uniqueNewConcepts]
                    },
                    map: {
                        activeEvents: [
                            { id: 'aunt_zhang', x: 48, y: 85, label: 'Aunt Zhang\'s Shop', status: 'available' as const }
                        ]
                    }
                }
            })
            return
        }

        if (!currentEventId) {
            if (isSolutionComplete) {
                setShowChapterCompletion(true)
                return
            }

            const newConcepts = Object.values(annaConcept).map((c: any) => ({ ...c, isRead: false }))
            if (newConcepts.length > 0) {
                setRpgState(prev => {
                    const existingIds = new Set(prev.player.encyclopedia.map(c => c.id))
                    const uniqueNewConcepts = newConcepts.filter((c: any) => !existingIds.has(c.id))
                    if (uniqueNewConcepts.length === 0) return prev
                    return {
                        ...prev,
                        player: { ...prev.player, encyclopedia: [...prev.player.encyclopedia, ...uniqueNewConcepts] }
                    }
                })
            }
            return
        }

        const event = rpgState.map.activeEvents.find(e => e.id === currentEventId)
        if (!event) return

        if (event.status === 'available') {
            let newClue;
            if (currentEventId === 'aunt_zhang') newClue = clueData.clue_zhang_ledger
            else if (currentEventId === 'michael') newClue = clueData.clue_michael_cctv
            else if (currentEventId === 'officer_chan') newClue = clueData.clue_officer_chan

            if (newClue) {
                setRpgState(prev => ({
                    ...prev,
                    player: { ...prev.player, journal: [...prev.player.journal, newClue] },
                    map: {
                        activeEvents: prev.map.activeEvents.map(e =>
                            e.id === currentEventId ? { ...e, status: 'investigating' } : e
                        )
                    }
                }))

                setTimeout(() => {
                    triggerNotification(
                        'New Clue Discovered',
                        newClue.title.split('(')[0].trim(),
                        'clue',
                        () => {
                            setPdaSelectedId(newClue.id)
                            setPdaTab('journal')
                            setShowPDA(true)
                            setShowNotification(false)
                        }
                    )
                    setPdaTab('journal')
                }, 300)
            }
        }
    }

    const handleMapEvent = (eventId: string) => {
        setCurrentEventId(eventId)
        const event = rpgState.map.activeEvents.find(e => e.id === eventId)
        if (!event) return

        if (event.status === 'available') {
            if (eventId === 'aunt_zhang') startDialogue('aunt_zhang_dialogue')
            else if (eventId === 'michael') startDialogue('michael_dialogue')
            else if (eventId === 'officer_chan') startDialogue('officer_chan_dialogue')
            else if (eventId === 'town_hall') {
                if (hasViewedPolicyIntro) setShowSolutionGame(true)
                else startDialogue('solution_intro')
            } else if (eventId === 'collect_data_zhang') {
                setShowLoanGame(true)
            }
        } else if (event.status === 'investigating') {
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
                            player: { ...prev.player, reports: [...prev.player.reports, data!] }
                        }
                    })
                }
            }
        }
    }

    const handleLoanGameComplete = (success: boolean) => {
        if (success) {
            setShowLoanGame(false)
            setRpgState(prev => ({
                ...prev,
                map: {
                    ...prev.map,
                    activeEvents: [
                        ...prev.map.activeEvents.filter(e => e.id !== 'collect_data_zhang'), // Ensure data collection is gone if it was there
                        { id: 'officer_chan', x: 58, y: 60, label: 'Officer Chan\'s Patrol', status: 'available' as const }
                    ]
                }
            }))
            setTimeout(() => {
                triggerNotification('Milestone Unlocked', 'Data Collection Problem Solved')
            }, 500)
        } else {
            setShowLoanGame(false)
        }
    }

    const handleSolutionComplete = (remainingAttempts: number) => {
        setIsSolutionComplete(true)
        setShowSolutionGame(false)
        setChallengeStatus(prev => ({ ...prev, aiSpecialist: remainingAttempts === 2 }))

        setRpgState(prev => ({
            ...prev,
            map: {
                ...prev.map,
                activeEvents: prev.map.activeEvents.filter(e => e.id !== 'town_hall')
            }
        }))
        setCurrentEventId(null)
        startDialogue('solution_outro')
    }

    const handleReportClose = () => {
        setShowReport(false)
        setPdaTab('reports')

        if (!currentEventId) return
        const event = rpgState.map.activeEvents.find(e => e.id === currentEventId)
        if (event && event.status === 'investigating' && event.progress === 100) {
            let newConcept;
            if (currentEventId === 'aunt_zhang') newConcept = conceptData.concept_selection_bias
            else if (currentEventId === 'michael') newConcept = conceptData.concept_algorithmic_bias
            else if (currentEventId === 'officer_chan') newConcept = conceptData.concept_confirmation_bias

            if (newConcept) {
                setRpgState(prev => {
                    const nextEvents = prev.map.activeEvents.map(e =>
                        e.id === currentEventId ? { ...e, status: 'completed' as const } : e
                    )
                    
                    if (currentEventId === 'officer_chan') {
                        nextEvents.push({ id: 'michael', x: 65, y: 35, label: 'Michael\'s Office', status: 'available' as const })
                    }
                    
                    return {
                    ...prev,
                    player: {
                        ...prev.player,
                        encyclopedia: [...prev.player.encyclopedia, newConcept]
                    },
                    map: {
                        activeEvents: nextEvents
                    }
                }})
            }

            if (currentEventId === 'aunt_zhang') {
                setShowLoanGame(true)
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
            const playerState = { ...prev.player }
            if (type === 'journal') {
                playerState.journal = playerState.journal.map(item => item.id === id ? { ...item, isRead: true } : item)
            } else if (type === 'encyclopedia') {
                playerState.encyclopedia = playerState.encyclopedia.map(item => item.id === id ? { ...item, isRead: true } : item)
            } else if (type === 'reports') {
                playerState.reports = playerState.reports.map(item => item.fileId === id ? { ...item, isRead: true } : item)
            }
            return { ...prev, player: playerState }
        })
    }

    const handleDevUnlockAll = () => {
        setShowDialogue(false)
        setDialogueQueue([])
        setHasViewedPolicyIntro(true)

        const allClues = Object.values(clueData).map((c: any) => ({ ...c, isRead: true }))
        const allConcepts = Object.values(conceptData).map((c: any) => ({ ...c, isRead: true }))
        const allReports = Object.values(allReportData).map((r: any) => ({ ...r, isRead: true }))

        setRpgState(prev => {
            const eventsToUse = prev.map.activeEvents.length > 0
                ? prev.map.activeEvents
                : [
                    { id: 'aunt_zhang', x: 48, y: 85, label: 'Aunt Zhang\'s Shop', status: 'available' as const },
                    { id: 'officer_chan', x: 58, y: 60, label: 'Officer Chan\'s Patrol', status: 'available' as const },
                    { id: 'michael', x: 65, y: 35, label: 'Michael\'s Office', status: 'available' as const }
                ] as any[]

            return {
                ...prev,
                player: {
                    ...prev.player,
                    inventory: prev.player.inventory,
                    journal: allClues,
                    encyclopedia: allConcepts,
                    reports: allReports
                },
                map: { activeEvents: eventsToUse.map(e => ({ ...e, status: 'completed' })) }
            }
        })

        triggerNotification('DEV TOOL', 'All content unlocked & Intro Skipped!', 'success')
        setShowPDA(true)
    }

    return {
        // State
        rpgState, showSolutionGame, solutionPlacements, showLoanGame,
        challengeStatus, showPDA, pdaTab, pdaSelectedId, currentEventId,
        showChapterCompletion, showQuiz, showMasteryOverlay, showReport, reportData,
        showDialogue, dialogueContent, notification, showNotification, isDevMode,
        
        // State setters (only the necessary ones)
        setSolutionPlacements, setPdaTab, setShowPDA, setShowQuiz,
        setChallengeStatus, setShowChapterCompletion, setShowMasteryOverlay, setIsDevMode,
        
        // Handlers
        handleMapEvent, handleDialogueNext, handleLoanGameComplete, handleSolutionComplete,
        handleReportClose, handleReportNavigate, handleMarkAsRead, handleNotificationClose,
        handleDevUnlockAll
    }
}
