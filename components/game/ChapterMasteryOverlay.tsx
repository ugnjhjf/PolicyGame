import { motion, AnimatePresence } from 'framer-motion'
import { Award, CheckCircle, Home, ArrowRight, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChapterMasteryOverlayProps {
    isOpen: boolean
    onClose: () => void
    challenges?: {
        aiSpecialist: boolean
        quizHunter: boolean
    }
}

export function ChapterMasteryOverlay({ isOpen, onClose, challenges = { aiSpecialist: true, quizHunter: false } }: ChapterMasteryOverlayProps) {
    const router = useRouter()
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-900 border border-green-500/30 w-full max-w-2xl rounded-2xl p-8 shadow-2xl relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col items-center text-center gap-6">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-bold text-white tracking-tight">Chapter 1 Complete</h2>
                            <p className="text-xl text-green-200">You have mastered the basics of bias</p>
                        </div>

                        {/* Challenge Panel */}
                        <div className="w-full bg-black/40 rounded-xl border border-white/10 p-4 backdrop-blur-sm">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>Challenges</span>
                            </h4>

                            <div className="flex flex-col gap-3">
                                {/* Challenge 1: AI Specialist */}
                                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                                        ${challenges.aiSpecialist ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600 bg-transparent'}`}>
                                        {challenges.aiSpecialist && <CheckCircle className="w-4 h-4 text-black" />}
                                    </div>
                                    <span className={`text-md text-left ${challenges.aiSpecialist ? 'text-white' : 'text-gray-500'}`}>
                                        <span className="font-bold text-yellow-500">AI Specialist:</span> Match solution first try
                                    </span>
                                </div>

                                {/* Challenge 2: Quiz Hunter */}
                                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                                        ${challenges.quizHunter ? 'bg-blue-500 border-blue-500' : 'border-gray-600 bg-transparent'}`}>
                                        {challenges.quizHunter && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className={`text-md text-left ${challenges.quizHunter ? 'text-white' : 'text-gray-500'}`}>
                                        <span className="font-bold text-blue-400">Quiz Hunter:</span> All questions correct
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-green-500/50 to-transparent my-2" />

                        <p className="text-gray-300 max-w-lg leading-relaxed">
                            Congratulations! You have successfully analyzed the policy, identified biases, and verified your understanding. The city is one step closer to fairness.
                        </p>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/5 flex items-center gap-2"
                            >
                                <span>Next chapter</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="group px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                <span>Return to Menu</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
