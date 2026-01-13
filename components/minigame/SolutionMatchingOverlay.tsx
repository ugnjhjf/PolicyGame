import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, Save, LayoutDashboard } from 'lucide-react'

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

const CARDS: SolutionCard[] = [
    {
        id: 'card_blind_review',
        title: 'Blind Review Protocol',
        description: 'Force initial judgment based on objective evidence before seeing AI score.',
        correctFor: 'bias_confirmation',
        feedback: "Incorrect! Breaking the loop of 'finding evidence to support the AI'.",
        type: 'correct'
    },
    {
        id: 'card_multi_source',
        title: 'Multi-source Sampling',
        description: 'Collect offline records and paper trails to supplement digital data.',
        correctFor: 'bias_selection',
        feedback: "Incorrect! Bringing the 'forgotten' population back into the dataset.",
        type: 'correct'
    },
    {
        id: 'card_fairness_constraints',
        title: 'Fairness Constraints',
        description: 'Mathematically constrain the model to cap False Positive Rates.',
        correctFor: 'bias_algorithmic',
        feedback: "Incorrect! Modifying the objective function to value fairness over pure profit.",
        type: 'correct'
    },
    {
        id: 'card_delete_labels',
        title: 'Remove "Race" Label',
        description: 'Simply delete sensitive columns like race or gender from the dataset.',
        correctFor: null,
        feedback: "Incorrect. AI will use 'Proxy Variables' (like zip code) to reconstruct the bias.",
        type: 'distractor'
    },
    {
        id: 'card_more_compute',
        title: 'Increase Computing Power',
        description: 'Use larger supercomputers to process data faster.',
        correctFor: null,
        feedback: "Incorrect. Faster processing just means executing the bias more efficiently.",
        type: 'distractor'
    }
]

const SLOTS: Slot[] = [
    {
        id: 'bias_confirmation',
        title: 'Confirmation Bias',
        description: 'Officer Chan: "AI said bad, so I look for bad."',
        icon: '🔍'
    },
    {
        id: 'bias_selection',
        title: 'Selection Bias',
        description: 'Aunt Zhang: "I pay cash, so I don\'t exist."',
        icon: '📊'
    },
    {
        id: 'bias_algorithmic',
        title: 'Algorithmic Bias',
        description: 'Dr. Chen: "Profits up, who cares if we wrongly flag a few?"',
        icon: '⚖️'
    }
]

interface SolutionMatchingOverlayProps {
    isOpen: boolean
    onClose: () => void
    initialPlacements?: Record<string, string> // slotId -> cardId
    onSaveState: (placements: Record<string, string>) => void
    onComplete: () => void
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
    // Available cards are those NOT in any placement
    // BUT we want to show all cards on the right initially? 
    // Actually, normally items move FROM list TO slot.
    // To simplify: We render "Unplaced Cards" on the right.

    // We need to keep track of where each card is.
    // Helper to get unplaced cards
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

        // Simple hit detection using elementFromPoint is tricky with framer motion's drag
        // creating a "clone" is better but complex.
        // Let's rely on the pointer event from onDragEnd info? not directly available.
        // Alternative: MouseUp event listener globally?

        // We will use a simpler approach:
        // We detect if the point (info.point) is inside a slot rect.
        const point = info.point

        // We need refs to valid drop targets.
        // Since we are continuously re-rendering, let's just use document.elementsFromPoint
        // Check for 'data-slot-id'
        const elements = document.elementsFromPoint(point.x, point.y)
        const slotElement = elements.find(el => el.getAttribute('data-slot-id'))

        if (slotElement) {
            const slotId = slotElement.getAttribute('data-slot-id')!

            // Move card to slot
            setPlacements(prev => {
                const next = { ...prev }

                // Check if card was already placed in another slot and remove it
                const oldSlotId = Object.keys(next).find(key => next[key] === cardId)
                if (oldSlotId) {
                    delete next[oldSlotId]
                }

                // Assign to new slot (overwriting if something was there)
                next[slotId] = cardId
                return next
            })

            // Reset results
            setResults(prev => {
                const next = { ...prev }
                // Find old slot to clear its result too
                const oldSlotId = Object.keys(placements).find(key => placements[key] === cardId)
                if (oldSlotId) {
                    delete next[oldSlotId] // actually set to null? keys are string.
                    next[oldSlotId] = null
                }
                next[slotId] = null
                return next
            })
        } else {
            // Check if dropped back on "Unplaced" area (or just outside any slot)
            // If dropped outside slot, return to pool (remove from placements)
            // But we need to identify WHICH placement was removed if it was already placed?
            // Actually this handleDragEnd logic handles moving FROM pool and FROM slot.

            // If card was in a slot (is in placements), remove it logic:
            // Find if cardId was in placements
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
        let hasErrors = false

        SLOTS.forEach(slot => {
            const cardId = placements[slot.id]
            if (!cardId) {
                // Empty slot
                allCorrect = false
                return
            }

            const card = CARDS.find(c => c.id === cardId)!
            if (card.correctFor === slot.id) {
                newResults[slot.id] = 'correct'
            } else {
                newResults[slot.id] = 'wrong'
                allCorrect = false
                hasErrors = true
            }
        })

        setResults(newResults)

        if (allCorrect) {
            // Success!
            setTimeout(() => {
                onComplete()
            }, 1000)
        }
    }

    const handleExit = () => {
        onSaveState(placements)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[70] bg-gray-950/95 backdrop-blur-md text-white flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-4 bg-gray-900 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-4">
                    <LayoutDashboard className="w-8 h-8 text-blue-400" />
                    <div>
                        <h2 className="text-2xl font-bold tracking-wider">POLICY SYNTHESIS BOARD</h2>
                        <p className="text-sm text-gray-400">Match the correct intervention to each identified bias.</p>
                    </div>
                </div>

            </div>

            {/* Main Game Area */}
            {/* Removed overflow-hidden to allow dragging outside of containers */}
            <div className="flex-1 flex p-8 gap-8 relative overflow-y-auto">

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
                            <div
                                key={slot.id}
                                data-slot-id={slot.id}
                                className={`relative p-6 rounded-xl border-2 transition-all duration-200 min-h-[160px] flex flex-col justify-center
                                    ${result === 'correct' ? 'border-green-500 bg-green-950/20' :
                                        result === 'wrong' ? 'border-red-500 bg-red-950/20' :
                                            isHovered ? 'border-yellow-400 bg-yellow-900/10 scale-[1.02] shadow-[0_0_15px_rgba(250,204,21,0.3)]' :
                                                'border-white/10 bg-white/5 hover:border-blue-400/50'}`}
                            >
                                {/* Slot Label */}
                                <div className="absolute top-4 left-4 flex items-center gap-2 opacity-50">
                                    <span className="text-3xl">{slot.icon}</span>
                                    <span className="font-bold uppercase tracking-widest text-xl">{slot.title}</span>
                                </div>
                                <p className="mt-8 text-gray-400 text-xl mb-4 leading-relaxed">{slot.description}</p>

                                {/* Drop Zone Content */}
                                <div className="flex-1 flex items-center justify-center p-2 rounded-lg border border-dashed border-white/20 bg-black/20">
                                    {filledCard ? (
                                        <DraggableCard
                                            key={filledCard.id}
                                            card={filledCard}
                                            onDragStart={() => handleDragStart('left')}
                                            onDrag={handleDrag}
                                            onDragEnd={handleDragEnd}
                                            isPlaced={true}
                                        />
                                    ) : (
                                        <span className={`text-sm font-mono transition-colors ${isHovered ? 'text-yellow-400' : 'text-gray-600'}`}>
                                            {isHovered ? 'DROP TO ASSIGN' : 'DRAG SOLUTION HERE'}
                                        </span>
                                    )}
                                </div>

                                {/* Feedback Overlay */}
                                {result && (
                                    <div className={`absolute top-4 right-4 flex items-center gap-2 
                                        ${result === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                                        {result === 'correct' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                    </div>
                                )}

                                {result === 'wrong' && filledCard && (
                                    <div className="absolute -bottom-2 translate-y-full left-0 right-0 bg-red-900/90 text-white text-xs p-2 rounded mt-2 border border-red-500 z-10 shadow-xl">
                                        <div className="font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Error Analysis:</div>
                                        {filledCard.feedback}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Center: Action */}
                <div className="w-24 flex flex-col items-center justify-center gap-4">
                    <ArrowRight className="w-8 h-8 text-gray-700 animate-pulse" />
                </div>

                {/* Right: Solution Cards Pool */}
                <div
                    className="flex-1 bg-black/40 rounded-xl border border-white/10 p-6 flex flex-col relative transition-all duration-200"
                    style={{ zIndex: draggingSource === 'right' ? 50 : 10 }}
                >
                    <h3 className="text-gray-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Available Interventions
                    </h3>

                    {/* Removed overflow-y-auto to prevent clipping during drag */}
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
                    <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-end gap-4">
                        <button
                            onClick={handleExit}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/5 text-sm font-medium"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save & Exit</span>
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-bold tracking-wider shadow-lg shadow-blue-900/20 active:scale-95 transition-all w-full md:w-auto"
                        >
                            VERIFY ALIGNMENT
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

// Separate component for drag logic to keep it clean
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
            whileDrag={{ scale: 1.05, zIndex: 100, cursor: 'grabbing' }}
            onDragStart={onDragStart}
            onDrag={(e, info) => onDrag && onDrag(info)}
            onDragEnd={(e, info) => onDragEnd(card.id, info)}
            // Reset position on drag end if not dropped? Framer motion handles layoutId animations automatically if we used reorder,
            // but for free drag we rely on React state updates to "snap" it to the new parent div.
            // layout prop makes it animate from old position to new position.
            layoutId={card.id}
            initial={false}
            className={`cursor-grab active:cursor-grabbing bg-gray-800 hover:bg-gray-750 border border-white/10 p-4 rounded-lg shadow-lg group relative w-full
                ${isPlaced ? 'h-full flex flex-col justify-center' : ''}`}
        >
            <div className="flex items-start gap-3">
                <div className={`w-2 h-full rounded-full absolute left-0 top-0 bottom-0 ${card.type === 'correct' ? 'bg-blue-500/0 group-hover:bg-blue-500/50' : 'bg-orange-500/0 group-hover:bg-orange-500/50'} transition-colors`} />
                <div className="flex-1 py-1">
                    <h4 className="font-bold text-blue-100 text-xl mb-2 group-hover:text-blue-400 transition-colors">{card.title}</h4>
                    <p className="text-lg text-gray-400 leading-relaxed">{card.description}</p>
                </div>
            </div>
        </motion.div>
    )
}
