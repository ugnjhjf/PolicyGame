import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, Save, LayoutDashboard } from 'lucide-react'
import parameterData from '../../config/data/quiz/SolutionMatchGameParameter.json'

// --- Types ---
interface SolutionCard {
    id: string
    title: string
    description: string
    correctFor: 'bias_confirmation' | 'bias_selection' | 'bias_algorithmic' | null // null for distractors
    feedback: string
    type: 'correct' | 'distractor'
}

interface Slot {
    id: string
    title: string
    description: string
    icon: string
}

const CARDS: SolutionCard[] = parameterData.CARDS as SolutionCard[]
const SLOTS: Slot[] = parameterData.SLOTS as Slot[]

interface SolutionMatchingOverlayProps {
    isOpen: boolean
    onClose: () => void
    initialPlacements?: Record<string, string> // slotId -> cardId
    onSaveState: (placements: Record<string, string>) => void
    onComplete: (remainingAttempts: number) => void
}

export function SolutionMatchingOverlay({
    isOpen,
    onClose,
    initialPlacements = {},
    onSaveState,
    onComplete
}: SolutionMatchingOverlayProps) {
    // --- State ---
    const [placements, setPlacements] = useState<Record<string, string>>(initialPlacements)
    const [results, setResults] = useState<Record<string, 'correct' | 'wrong' | null>>({})
    const getUnplacedCards = () => {
        const placedCardIds = Object.values(placements)
        return CARDS.filter(c => !placedCardIds.includes(c.id))
    }

    // --- Logic ---
    const [draggingSource, setDraggingSource] = useState<'left' | 'right' | null>(null)
    const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null)

    // --- Logic ---
    const handleDragStart = (source: 'left' | 'right') => {
        setDraggingSource(source)
    }

    const handleDrag = (info: any) => {
        const point = info.point
        const elements = document.elementsFromPoint(point.x, point.y)
        const slotElement = elements.find(el => el.getAttribute('data-slot-id'))

        if (slotElement) {
            setHoveredSlotId(slotElement.getAttribute('data-slot-id'))
        } else {
            setHoveredSlotId(null)
        }
    }

    const handleDragEnd = (cardId: string, info: any) => {
        setDraggingSource(null)
        setHoveredSlotId(null)

        const point = info.point
        const elements = document.elementsFromPoint(point.x, point.y)
        const slotElement = elements.find(el => el.getAttribute('data-slot-id'))

        if (slotElement) {
            const slotId = slotElement.getAttribute('data-slot-id')!

            setPlacements(prev => {
                const next = { ...prev }
                const oldSlotId = Object.keys(next).find(key => next[key] === cardId)
                if (oldSlotId) delete next[oldSlotId]
                next[slotId] = cardId
                return next
            })

            setResults(prev => {
                const next = { ...prev }
                const oldSlotId = Object.keys(placements).find(key => placements[key] === cardId)
                if (oldSlotId) next[oldSlotId] = null
                next[slotId] = null
                return next
            })
        } else {
            const currentSlot = Object.keys(placements).find(key => placements[key] === cardId)
            if (currentSlot) {
                setPlacements(prev => {
                    const next = { ...prev }
                    delete next[currentSlot]
                    return next
                })
                setResults(prev => ({ ...prev, [currentSlot!]: null }))
            }
        }
    }

    const handleSubmit = () => {
        const newResults: Record<string, 'correct' | 'wrong'> = {}
        let allCorrect = true

        SLOTS.forEach(slot => {
            const cardId = placements[slot.id]
            if (!cardId) {
                allCorrect = false
                return
            }

            const card = CARDS.find(c => c.id === cardId)!
            if (card.correctFor === slot.id) {
                newResults[slot.id] = 'correct'
            } else {
                newResults[slot.id] = 'wrong'
                allCorrect = false
            }
        })

        setResults(newResults)

        if (allCorrect) {
            setTimeout(() => {
                onComplete(1)
            }, 1000)
        }
    }

    const handleExit = () => {
        onSaveState(placements)
        onClose()
    }

    if (!isOpen) return null

    return (
        // White background, full-screen but light
        <div className="fixed inset-0 z-[70] bg-white/95 backdrop-blur-sm text-gray-900 flex flex-col animate-in fade-in duration-300">

            {/* Header — white with subtle bottom border */}
            <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-100 rounded-xl">
                        <LayoutDashboard className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-0.5">Policy Game</p>
                        <h2 className="text-xl font-bold text-gray-900">Policy Synthesis Board</h2>
                    </div>
                </div>
                <p className="text-sm text-gray-400">Match the correct intervention to each identified bias.</p>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 flex p-8 gap-8 relative overflow-y-auto bg-gray-50">

                {/* Left: Problem Slots */}
                <div
                    className="flex-[1.2] flex flex-col gap-6 max-w-2xl relative transition-all duration-200"
                    style={{ zIndex: draggingSource === 'left' ? 50 : 10 }}
                >
                    {SLOTS.map(slot => {
                        const filledCardId = placements[slot.id]
                        const filledCard = CARDS.find(c => c.id === filledCardId)
                        const result = results[slot.id]
                        const isHovered = hoveredSlotId === slot.id

                        return (
                            <ProblemSlotItem
                                key={slot.id}
                                slot={slot}
                                filledCard={filledCard}
                                result={result}
                                isHovered={isHovered}
                                handleDragStart={handleDragStart}
                                handleDrag={handleDrag}
                                handleDragEnd={handleDragEnd}
                            />
                        )
                    })}
                </div>

                {/* Center: Arrow */}
                <div className="w-24 flex flex-col items-center justify-center gap-4">
                    <ArrowRight className="w-8 h-8 text-gray-300 animate-pulse" />
                </div>

                {/* Right: Solution Cards Pool */}
                <div
                    className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col relative transition-all duration-200 shadow-sm"
                    style={{ zIndex: draggingSource === 'right' ? 50 : 10 }}
                >
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Available Interventions
                    </h3>

                    <div className="grid grid-cols-1 gap-4 content-start pr-2">
                        {getUnplacedCards().map(card => (
                            <DraggableCard
                                key={card.id}
                                card={card}
                                onDragStart={() => handleDragStart('right')}
                                onDrag={handleDrag}
                                onDragEnd={handleDragEnd}
                            />
                        ))}
                    </div>

                    {/* Submit Bar */}
                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                        <button
                            onClick={handleExit}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save & Exit</span>
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-7 py-2.5 rounded-full bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm tracking-wide shadow transition-all active:scale-95"
                        >
                            Verify Alignment
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}


function DraggableCard({
    card,
    onDragStart,
    onDrag,
    onDragEnd,
    isPlaced = false
}: {
    card: SolutionCard,
    onDragStart?: () => void,
    onDrag?: (info: any) => void,
    onDragEnd: (id: string, info: any) => void,
    isPlaced?: boolean
}) {
    return (
        <motion.div
            drag
            dragSnapToOrigin
            dragElastic={0.1}
            dragMomentum={false}
            whileDrag={{ scale: 1.04, zIndex: 100, cursor: 'grabbing', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            onDragStart={onDragStart}
            onDrag={(e, info) => onDrag && onDrag(info)}
            onDragEnd={(e, info) => onDragEnd(card.id, info)}
            layoutId={card.id}
            initial={false}
            className={`cursor-grab active:cursor-grabbing bg-white border-2 border-purple-200 hover:border-purple-400 p-4 rounded-2xl shadow-sm group transition-colors relative w-full
                ${isPlaced ? 'h-full flex flex-col justify-center' : ''}`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1 py-1">
                    <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-purple-600 transition-colors">{card.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                </div>
            </div>
        </motion.div>
    )
}

// Sub-components

function ProblemSlotItem({ slot, filledCard, result, isHovered, handleDragStart, handleDrag, handleDragEnd }: any) {
    return (
        <div
            data-slot-id={slot.id}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-200 min-h-[160px] flex flex-col justify-center bg-white
                ${result === 'correct' ? 'border-green-400 bg-green-50' :
                    result === 'wrong' ? 'border-red-400 bg-red-50' :
                        isHovered ? 'border-purple-400 bg-purple-50 scale-[1.02] shadow-md' :
                            'border-gray-200 hover:border-purple-300'}`}
        >
            <div className="absolute top-4 left-4 flex items-center gap-2 opacity-40">
                <span className="text-2xl">{slot.icon}</span>
                <span className="font-bold uppercase tracking-widest text-sm text-gray-500">{slot.title}</span>
            </div>
            <p className="mt-8 text-gray-600 text-sm mb-4 leading-relaxed">{slot.description}</p>

            <div className={`flex-1 flex items-center justify-center p-2 rounded-xl border-2 border-dashed transition-colors
                ${isHovered ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                {filledCard ? (
                    <DraggableCard
                        card={filledCard}
                        onDragStart={() => handleDragStart('left')}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                        isPlaced={true}
                    />
                ) : (
                    <span className={`text-xs font-mono font-semibold transition-colors ${isHovered ? 'text-purple-500' : 'text-gray-400'}`}>
                        {isHovered ? 'Drop to assign' : 'Drag solution here'}
                    </span>
                )}
            </div>

            {result && (
                <div className={`absolute top-4 right-4 flex items-center gap-2 
                    ${result === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
                    {result === 'correct' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
            )}

            {result === 'wrong' && filledCard && (
                <div className="absolute -bottom-2 translate-y-full left-0 right-0 bg-red-50 text-red-700 text-xs p-3 rounded-xl mt-2 border border-red-200 z-10 shadow-md">
                    <div className="font-bold flex items-center gap-1 mb-1"><AlertTriangle className="w-3 h-3" /> Error Analysis:</div>
                    {filledCard.feedback}
                </div>
            )}
        </div>
    )
}
