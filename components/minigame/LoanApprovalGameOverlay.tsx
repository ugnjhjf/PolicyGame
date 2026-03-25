'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Database, RotateCcw, Zap } from 'lucide-react'
import parameterData from '../../config/data/quiz/LoanApprovalGameParameter.json'

interface Criteria {
    id: string
    title: string
    description: string
    reliable_level: 'low' | 'middle' | 'high'
}

interface LoanApprovalGameOverlayProps {
    isOpen: boolean
    onClose: () => void
    onComplete: (success: boolean) => void
}

export function LoanApprovalGameOverlay({ isOpen, onClose, onComplete }: LoanApprovalGameOverlayProps) {
    const [slots, setSlots] = useState<(string | null)[]>([null, null, null])
    const [showResultOverlay, setShowResultOverlay] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [score, setScore] = useState({ correct: 0, wrong: 0, accuracy: 0 })
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    const criteria = parameterData as Criteria[]
    const availableItems = criteria.filter(c => !slots.includes(c.id))

    const handleSelectFromInventory = (id: string) => {
        const emptyIndex = slots.findIndex(s => s === null)
        if (emptyIndex !== -1) {
            const newSlots = [...slots]
            newSlots[emptyIndex] = id
            setSlots(newSlots)
            setHasSubmitted(false)
        }
    }

    const handleRemoveFromSlot = (index: number) => {
        const newSlots = [...slots]
        newSlots[index] = null
        setSlots(newSlots)
        setHasSubmitted(false)
    }

    const handleSubmit = () => {
        const filledSlots = slots.filter(s => s !== null) as string[]

        let correct = 0
        let wrong = 0

        filledSlots.forEach(id => {
            const item = criteria.find(c => c.id === id)
            if (item) {
                if (item.reliable_level === 'high') correct++
                else if (item.reliable_level === 'middle') {
                    // Middle might count as half points or just not correct for "perfect" score?
                    // For now, let's treat only HIGH as correct for the puzzle goal
                    wrong++
                }
                else wrong++
            }
        })

        // Calculate Accuracy Percentage
        // Goal: 3 'High' items
        let accuracy = 0
        if (wrong === 0 && correct === 3) accuracy = 98
        else if (wrong === 0 && correct < 3) accuracy = Math.round((correct / 3) * 80)
        else {
            const base = (correct / 3) * 100
            const penalty = wrong * 25
            accuracy = Math.max(10, Math.round(base - penalty))
        }

        setScore({ correct, wrong, accuracy })
        setHasSubmitted(true)
        setShowResultOverlay(true)
    }

    const handleImprove = () => {
        setShowResultOverlay(false)
    }

    const handleGenerateForecast = () => {
        // Success condition: All selected must be High reliability
        const isSuccess = score.correct === 3 && score.wrong === 0
        onComplete(isSuccess)
    }



    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col relative overflow-hidden bg-gray-50"
            >
                <GameHeader />

                {/* Main Content Area - Split Layout */}
                <div className="flex-1 flex flex-col relative">

                    {/* TOP HALF: Slots */}
                    <div className="flex-1 flex items-center justify-center relative overflow-visible">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />

                        {/* Fixed Info Panel on the right */}
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-[400px] min-h-[300px] bg-white rounded-2xl shadow-xl p-8 flex flex-col z-20 border border-gray-200">
                            <DatasetInfoPanel hoveredId={hoveredId} criteria={criteria} />
                        </div>

                        {/* Slots */}
                        <div className="flex items-center gap-12 relative z-10 px-12 mt-20 pr-[200px]">
                            {slots.map((slotId, index) => (
                                <DatasetSlotItem
                                    key={index}
                                    index={index}
                                    slotId={slotId}
                                    hasSubmitted={hasSubmitted}
                                    criteria={criteria}
                                    setHoveredId={setHoveredId}
                                    handleRemoveFromSlot={handleRemoveFromSlot}
                                />
                            ))}

                            {/* Submit Button */}
                            {!showResultOverlay && (
                                <StartTrainingButton slots={slots} handleSubmit={handleSubmit} />
                            )}
                        </div>
                    </div>

                    {/* BOTTOM HALF: Inventory Dock */}
                    <div className="h-64 bg-white border-t border-gray-200 flex flex-col items-center justify-center relative z-20 pb-4 w-full shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                        {!showResultOverlay && (
                            <InventoryDock
                                availableItems={availableItems}
                                setHoveredId={setHoveredId}
                                handleSelectFromInventory={handleSelectFromInventory}
                            />
                        )}
                    </div>
                </div>

                {/* RESULT SUMMARY OVERLAY */}
                <AnimatePresence>
                    {showResultOverlay && (
                        <motion.div
                            initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                            animate={{ backdropFilter: "blur(10px)", opacity: 1 }}
                            exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-12 bg-gray-900/60"
                        >
                            <ResultSummaryBoard
                                score={score}
                                handleImprove={handleImprove}
                                handleGenerateForecast={handleGenerateForecast}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

        </div>
    )
}

// --- Sub-components ---

function getReliabilityColor(level: string) {
    switch (level) {
        case 'high': return 'bg-green-100 border-green-300 text-green-700'
        case 'middle': return 'bg-yellow-100 border-yellow-300 text-yellow-700'
        case 'low': return 'bg-red-100 border-red-300 text-red-700'
        default: return 'bg-gray-100 border-gray-300 text-gray-700'
    }
}

function getReliabilityLabel(level: string) {
    switch (level) {
        case 'high': return 'Highly Reliable'
        case 'middle': return 'Moderate Reliability'
        case 'low': return 'Low Reliability'
        default: return 'Unknown'
    }
}

function DatasetSlotItem({ index, slotId, hasSubmitted, criteria, setHoveredId, handleRemoveFromSlot }: any) {
    const item = criteria.find((c: any) => c.id === slotId)
    const isFilled = !!item

    let borderColor = 'border-gray-300 bg-white shadow-sm'
    let iconColor = 'text-gray-400 bg-gray-50 border-gray-100'

    if (hasSubmitted && isFilled) {
        if (item.reliable_level === 'high') {
            borderColor = 'border-green-400 bg-green-50 shadow-green-100/50'
            iconColor = 'text-green-600 bg-white border-green-200'
        } else if (item.reliable_level === 'middle') {
            borderColor = 'border-yellow-400 bg-yellow-50 shadow-yellow-100/50'
            iconColor = 'text-yellow-600 bg-white border-yellow-200'
        } else {
            borderColor = 'border-red-400 bg-red-50 shadow-red-100/50'
            iconColor = 'text-red-500 bg-white border-red-200'
        }
    } else if (isFilled) {
        borderColor = 'border-purple-300 bg-purple-50 shadow-purple-100/50 shadow-lg'
        iconColor = 'text-purple-600 bg-white border-purple-200'
    }

    return (
        <div className="relative group">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => { if (isFilled && slotId) setHoveredId(slotId) }}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => isFilled && handleRemoveFromSlot(index)}
                className={`w-40 h-56 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-visible ${borderColor} ${!isFilled && 'border-dashed'}`}
            >
                {isFilled ? (
                    <>
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 border shadow-sm ${iconColor}`}>
                            <Database className="w-6 h-6" />
                        </div>
                        <div className="text-center px-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">Dataset</span>
                            <span className={`text-[15px] font-bold text-gray-900 leading-tight block ${hasSubmitted ? 'opacity-50' : ''}`}>{item.title}</span>
                        </div>

                        {hasSubmitted && (
                            <motion.div
                                initial={{ x: "-50%", y: "-50%", scale: 0.5, opacity: 0 }}
                                animate={{ x: "-50%", y: "-50%", scale: 1, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className={`absolute top-0 left-1/2 w-[110%] py-1.5 rounded-full shadow-lg flex items-center justify-center z-20 border ${getReliabilityColor(item.reliable_level)}`}
                            >
                                <span className="font-bold text-[10px] py-1 uppercase tracking-widest whitespace-nowrap">
                                    {getReliabilityLabel(item.reliable_level)}
                                </span>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <>
                        <span className="text-gray-400 font-bold text-lg mb-2">Slot {index + 1}</span>
                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Empty</span>
                    </>
                )}
            </motion.button>
        </div>
    )
}

function ResultSummaryBoard({ score, handleImprove, handleGenerateForecast }: any) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full h-full max-w-4xl grid grid-cols-2 gap-6"
        >
            <AccuracyCard score={score} />
            <ApplicationResultCard score={score} handleImprove={handleImprove} handleGenerateForecast={handleGenerateForecast} />
        </motion.div>
    )
}

function AccuracyCard({ score }: any) {
    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div>
                <div className="flex items-start justify-between mb-8">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                        <Zap className={`w-8 h-8 ${score.accuracy > 80 ? 'text-purple-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Model Confidence</span>
                    </div>
                </div>
                <div className="mb-4">
                    <h3 className="text-7xl font-bold text-gray-900 tracking-tighter">
                        {score.accuracy}%
                    </h3>
                    <p className="font-semibold text-gray-500 text-lg mt-2">Accuracy Rate</p>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span>Performance</span>
                    <span>Target: 85%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score.accuracy}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${score.accuracy > 80 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-orange-400 to-red-500'}`}
                    />
                </div>
            </div>
        </div>
    )
}

function ApplicationResultCard({ score, handleImprove, handleGenerateForecast }: any) {
    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <span className="text-gray-900 font-black text-lg uppercase tracking-wider">Application Result</span>
                <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm" />
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm" />
                </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-4 relative w-full px-2 mb-4">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="w-full h-px bg-gray-200 border-t border-dashed border-gray-300" />
                    <div className="w-full h-px bg-gray-200 border-t border-dashed border-gray-300" />
                    <div className="w-full h-px bg-gray-200 border-t border-dashed border-gray-300" />
                </div>
                {Array.from({ length: 5 }).map((_, index) => {
                    const noise = (Math.sin(index * 123.45) * 15)
                    const baseAccuracy = score.accuracy
                    const correctRate = Math.min(95, Math.max(10, baseAccuracy + noise))
                    const remaining = 100 - correctRate
                    const unsureRate = remaining * 0.6
                    const failRate = remaining * 0.4
                    return (
                        <div key={index} className="flex flex-col items-center gap-3 h-full justify-end w-full group/bar relative">
                            <div className="absolute bottom-full mb-3 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white border border-gray-200 text-xs p-3 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-10 font-medium">
                                <div className="text-green-600 mb-1">Correct: {Math.round(correctRate)}%</div>
                                <div className="text-yellow-600 mb-1">Unsure: {Math.round(unsureRate)}%</div>
                                <div className="text-red-500">Fail: {Math.round(failRate)}%</div>
                            </div>
                            <div className="w-full h-[80%] bg-gray-100 border border-gray-200 rounded-xl overflow-hidden flex flex-col-reverse relative shadow-inner">
                                <motion.div initial={{ height: 0 }} animate={{ height: `${correctRate}%` }} transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }} className="w-full bg-green-500 hover:bg-green-400 transition-colors" />
                                <motion.div initial={{ height: 0 }} animate={{ height: `${unsureRate}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.5 + index * 0.1 }} className="w-full bg-yellow-400 hover:bg-yellow-300 transition-colors" />
                                <motion.div initial={{ height: 0 }} animate={{ height: `${failRate}%` }} transition={{ duration: 1, ease: "easeOut", delay: 1 + index * 0.1 }} className="w-full bg-red-500 hover:bg-red-400 transition-colors" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Grp {String.fromCharCode(65 + index)}</span>
                        </div>
                    )
                })}
            </div>
            
            <div className="flex gap-4 mt-auto">
                <button onClick={handleImprove} className="flex-1 h-14 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full font-bold text-sm uppercase tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95">
                    <RotateCcw className="w-4 h-4" /> Improve
                </button>
                <button onClick={handleGenerateForecast} className={`flex-[1.5] h-14 rounded-full font-bold text-sm uppercase tracking-wide shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 ${score.correct === 3 && score.wrong === 0 ? 'bg-gray-900 hover:bg-purple-600 text-white shadow-purple-500/25 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}>
                    <Zap className="w-4 h-4 fill-current" /> Finish
                </button>
            </div>
        </div>
    )
}

function GameHeader() {
    return (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center bg-white/80 backdrop-blur-md px-10 py-4 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                Model Training Dataset
            </h2>
            <p className="text-sm font-semibold mt-1 text-gray-500">
                Select <span className="text-purple-600 font-bold">3 highly reliable parameters</span> for the AI model.
            </p>
        </div>
    )
}

function DatasetInfoPanel({ hoveredId, criteria }: { hoveredId: string | null, criteria: Criteria[] }) {
    return (
        <AnimatePresence mode="wait">
            {hoveredId ? (() => {
                const item = criteria.find(i => i.id === hoveredId)
                if (!item) return null
                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="h-full flex flex-col"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                                <FileText className="w-7 h-7 text-purple-600" />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-purple-500 block mb-1">Content Preview</span>
                                <h4 className="font-bold text-xl leading-tight text-gray-900">{item.title}</h4>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 w-full mb-6" />
                        <p className="text-base font-medium text-gray-600 leading-relaxed flex-1">
                            {item.description}
                        </p>
                    </motion.div>
                )
            })() : (
                <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-gray-400 flex-1 py-12"
                >
                    <Database className="w-16 h-16 mb-4 text-gray-200" />
                    <p className="font-bold text-sm tracking-widest uppercase text-center text-gray-400">Hover over a dataset<br />to view details</p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function StartTrainingButton({ slots, handleSubmit }: any) {
    const isReady = slots.every((s: string | null) => s !== null)
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={isReady ? handleSubmit : undefined}
            disabled={!isReady}
            className={`absolute -bottom-24 left-1/3 -translate-x-1/2 px-10 py-4 rounded-full text-sm uppercase tracking-wider font-bold transition-all flex items-center gap-3 z-50 ${isReady
                ? 'bg-gray-900 text-white hover:bg-purple-600 shadow-xl shadow-purple-500/20 hover:-translate-y-1 active:scale-95 cursor-pointer'
                : 'bg-gray-200 border border-gray-300 text-gray-400 shadow-sm cursor-not-allowed'
                }`}
        >
            TRAIN MODEL
            <Zap className={`w-5 h-5 ${isReady ? 'fill-current' : 'fill-gray-400'}`} />
        </motion.button>
    )
}

function InventoryDock({ availableItems, setHoveredId, handleSelectFromInventory }: any) {
    return (
        <div className="flex items-center justify-center gap-6 px-12 py-6 w-full flex-wrap">
            {availableItems.map((item: any) => (
                <div key={item.id} className="relative">
                    <motion.button
                        layoutId={item.id}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => handleSelectFromInventory(item.id)}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-36 h-40 bg-white border border-gray-200 shadow-sm rounded-2xl flex flex-col items-center justify-center gap-3 group hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 flex-shrink-0"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors border border-gray-100 group-hover:border-purple-100">
                            <FileText className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
                        </div>
                        <span className="text-base font-bold text-gray-700 text-center px-4 leading-tight group-hover:text-purple-700">
                            {item.title}
                        </span>
                    </motion.button>
                </div>
            ))}
        </div>
    )
}
