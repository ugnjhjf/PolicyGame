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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col relative overflow-hidden"
            >
                <GameHeader />

                {/* Main Content Area - Split Layout */}
                <div className="flex-1 flex flex-col relative">

                    {/* TOP HALF: Slots */}
                    <div className="flex-1 flex items-center justify-center relative overflow-visible">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />

                        {/* Fixed Info Panel on the right */}
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-[400px] min-h-[300px] bg-white rounded-2xl shadow-2xl p-8 flex flex-col z-20 border border-slate-200">
                            <DatasetInfoPanel hoveredId={hoveredId} criteria={criteria} />
                        </div>

                        {/* Slots */}
                        <div className="flex items-center gap-12 relative z-10 px-12 mt-16 pr-[200px]">
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
                    <div className="h-56 flex flex-col items-center justify-center relative z-20 pb-8 w-full">
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
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-12 bg-slate-900/60"
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

// --- Sub-components to flatten HTML structure ---

function getReliabilityColor(level: string) {
    switch (level) {
        case 'high': return 'bg-green-400 border-green-300 text-green-950'
        case 'middle': return 'bg-yellow-400 border-yellow-300 text-yellow-950'
        case 'low': return 'bg-red-400 border-red-300 text-red-950'
        default: return 'bg-slate-400 border-slate-300 text-slate-950'
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

    let borderColor = 'border-slate-600'
    let iconColor = 'text-slate-600'

    if (hasSubmitted && isFilled) {
        if (item.reliable_level === 'high') {
            borderColor = 'border-green-500'
            iconColor = 'text-green-500'
        } else if (item.reliable_level === 'middle') {
            borderColor = 'border-yellow-500'
            iconColor = 'text-yellow-500'
        } else {
            borderColor = 'border-red-500'
            iconColor = 'text-red-500'
        }
    } else if (isFilled) {
        borderColor = 'border-purple-400'
        iconColor = 'text-purple-400'
    }

    return (
        <div className="relative group">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => { if (isFilled && slotId) setHoveredId(slotId) }}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => isFilled && handleRemoveFromSlot(index)}
                className={`w-40 h-56 rounded-2xl border-2 border-dashed ${borderColor} bg-transparent flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-visible`}
            >
                {isFilled ? (
                    <>
                        <div className={`w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 ${iconColor} border border-slate-200`}>
                            <Database className="w-8 h-8" />
                        </div>
                        <div className="text-center px-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">Dataset</span>
                            <span className={`text-[18px] font-bold text-white leading-tight block ${hasSubmitted ? 'opacity-40' : ''}`}>{item.title}</span>
                        </div>

                        {hasSubmitted && (
                            <motion.div
                                initial={{ x: "-50%", y: "-50%", scale: 0.5, opacity: 0 }}
                                animate={{ x: "-50%", y: "-50%", scale: 1, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className={`absolute top-1/2 left-1/2 w-[110%] py-2 rounded-full shadow-xl flex items-center justify-center z-20 border-2 ${getReliabilityColor(item.reliable_level)}`}
                            >
                                <span className="font-bold text-[10px] py-2 uppercase tracking-wider whitespace-nowrap">
                                    {getReliabilityLabel(item.reliable_level)}
                                </span>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <>
                        <span className="text-slate-400 font-bold text-lg mb-2">Slot {index + 1}</span>
                        <span className="text-slate-500 text-xs uppercase tracking-widest">Empty</span>
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
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div>
                <div className="flex items-start justify-between">
                    <div className="p-3 bg-slate-700/50 rounded-2xl border border-slate-600">
                        <Zap className={`w-8 h-8 ${score.accuracy > 80 ? 'text-yellow-400' : ''}`} />
                    </div>
                    <div className="text-right">
                        <span className=" text-sm font-bold tracking-wider uppercase">Model Confidence</span>
                    </div>
                </div>
                <div className="mt-8">
                    <h3 className="text-7xl font-bold text-white tracking-tighter">
                        {score.accuracy}%
                    </h3>
                    <p className=" font-medium text-lg mt-2">Accuracy Rate</p>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold  uppercase tracking-widest">
                    <span>Accuracy</span>
                    <span>Target: 85%</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score.accuracy}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${score.accuracy > 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-orange-400 to-red-500'}`}
                    />
                </div>
            </div>
        </div>
    )
}

function ApplicationResultCard({ score, handleImprove, handleGenerateForecast }: any) {
    return (
        <div className="bg-gradient-to-br from-slate-900/90 to-blue-950/50 border border-slate-600 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <span className="text-white font-bold text-l uppercase tracking-wide">Application Result</span>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-4 relative w-full px-2">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                    <div className="w-full h-px bg-slate-500 border-t border-dashed border-slate-500" />
                    <div className="w-full h-px bg-slate-500 border-t border-dashed border-slate-500" />
                    <div className="w-full h-px bg-slate-500 border-t border-dashed border-slate-500" />
                </div>
                {Array.from({ length: 5 }).map((_, index) => {
                    const noise = (Math.sin(index * 123.45) * 15)
                    const baseAccuracy = score.accuracy
                    const correctRate = Math.min(95, Math.max(10, baseAccuracy + noise))
                    const remaining = 100 - correctRate
                    const unsureRate = remaining * 0.6
                    const failRate = remaining * 0.4
                    return (
                        <div key={index} className="flex flex-col items-center gap-2 h-full justify-end w-full group/bar relative">
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-[10px] p-2 rounded shadow-xl border border-slate-700 pointer-events-none whitespace-nowrap z-10">
                                <div className="text-green-400">Correct: {Math.round(correctRate)}%</div>
                                <div className="text-yellow-400">Unsure: {Math.round(unsureRate)}%</div>
                                <div className="text-red-400">Fail: {Math.round(failRate)}%</div>
                            </div>
                            <div className="w-full h-[80%] bg-slate-800/50 rounded-lg overflow-hidden flex flex-col-reverse relative">
                                <motion.div initial={{ height: 0 }} animate={{ height: `${correctRate}%` }} transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }} className="w-full bg-green-500/80 hover:bg-green-400 transition-colors" />
                                <motion.div initial={{ height: 0 }} animate={{ height: `${unsureRate}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.5 + index * 0.1 }} className="w-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors" />
                                <motion.div initial={{ height: 0 }} animate={{ height: `${failRate}%` }} transition={{ duration: 1, ease: "easeOut", delay: 1 + index * 0.1 }} className="w-full bg-red-500/80 hover:bg-red-400 transition-colors" />
                            </div>
                            <span className="text-[10px] font-bold uppercase">Grp {String.fromCharCode(65 + index)}</span>
                        </div>
                    )
                })}
            </div>
            <button onClick={handleImprove} className="h-16 mt-4 bg-white hover:bg-slate-200 text-slate-900 rounded-full font-extrabold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95">
                <RotateCcw className="w-5 h-5" /> Improve Forecast Accuracy
            </button>
            <button onClick={handleGenerateForecast} className={`h-16 mt-4 rounded-full font-extrabold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${score.correct === 3 && score.wrong === 0 ? 'bg-green-400 hover:bg-green-300 text-green-950 shadow-[0_0_30px_rgba(74,222,128,0.4)]' : 'bg-slate-700 hover:bg-slate-600 text-slate-300 opacity-50 cursor-not-allowed'}`}>
                <Zap className="w-5 h-5 fill-current" /> Generate Forecast
            </button>
        </div>
    )
}

function GameHeader() {
    return (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                Dataset Selection
            </h2>
            <p className=" text-base mt-3 text-center">
                Select <span className="text-purple-400 font-bold">3 reliable data parameters</span> for the AI model.
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
                            <div className="p-4 bg-slate-100 rounded-xl">
                                <FileText className="w-8 h-8 text-slate-700" />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-1">Dataset</span>
                                <h4 className="font-bold text-2xl leading-tight text-slate-900">{item.title}</h4>
                            </div>
                        </div>
                        <div className="h-px bg-slate-200 w-full mb-6" />
                        <p className="text-lg text-slate-600 leading-relaxed flex-1">
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
                    className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 flex-1 py-12"
                >
                    <Database className="w-16 h-16 mb-4" />
                    <p className="font-semibold text-lg text-center">Hover over a dataset<br />to view details</p>
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
            className={`absolute -bottom-28 left-1/3 -translate-x-1/2 px-10 py-4 rounded-full text-xl font-bold transition-all flex items-center gap-3 z-50 ${isReady
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-slate-300 text-slate-500 shadow-md cursor-not-allowed opacity-80'
                }`}
        >
            Start Training
            <Zap className={`w-6 h-6 ${isReady ? 'fill-white' : 'fill-slate-500'}`} />
        </motion.button>
    )
}

function InventoryDock({ availableItems, setHoveredId, handleSelectFromInventory }: any) {
    return (
        <div className="flex items-center justify-center gap-8 px-12 py-4 w-full flex-wrap">
            {availableItems.map((item: any) => (
                <div key={item.id} className="relative">
                    <motion.button
                        layoutId={item.id}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => handleSelectFromInventory(item.id)}
                        whileHover={{ scale: 1.05, y: -10 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-40 h-48 bg-white border border-slate-200 shadow-md rounded-2xl flex flex-col items-center justify-center gap-4 group hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-200 flex-shrink-0"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <FileText className="w-6 h-6 text-slate-400 group-hover:text-purple-600" />
                        </div>
                        <span className="text-[24px] font-bold text-slate-800 text-center px-2 leading-tight group-hover:text-purple-700">
                            {item.title}
                        </span>
                    </motion.button>
                </div>
            ))}
        </div>
    )
}
