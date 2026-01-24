'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, ArrowRight, RotateCcw } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';

interface LessonCompleteScreenProps {
    score: number;
    totalQuestions: number;
    xpEarned: number;
    onContinue: () => void;
    onRetake: () => void;
}

export function LessonCompleteScreen({ score, totalQuestions, xpEarned, onContinue, onRetake }: LessonCompleteScreenProps) {
    const percentage = (score / totalQuestions) * 100;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
            <div className="text-center max-w-2xl px-6 w-full">
                {/* Trophy Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.8, bounce: 0.5 }}
                    className="mb-12 relative inline-block"
                >
                    <div className="absolute inset-0 bg-cyan-glow/20 blur-3xl rounded-full animate-pulse" />
                    <Trophy size={120} className="relative z-10 text-cyan-glow drop-shadow-[0_0_30px_rgba(0,240,255,0.6)]" />

                    {/* Confetti particles could go here */}
                </motion.div>

                {/* Title */}
                <motion.h2
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl font-orbitron text-white mb-2 tracking-widest uppercase"
                >
                    Module Complete
                </motion.h2>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="h-[1px] w-32 bg-gradient-to-r from-transparent via-cyan-glow to-transparent mx-auto mb-8"
                />

                {/* Score Card */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 gap-4 mb-10 max-w-md mx-auto"
                >
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                        <span className="text-star-white/60 font-mono text-xs uppercase mb-2">Accuracy</span>
                        <span className={`text-4xl font-bold ${percentage >= 80 ? 'text-success-green' : 'text-warning-orange'}`}>
                            {percentage}%
                        </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-glow/10 to-plasma-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-star-white/60 font-mono text-xs uppercase mb-2">XP Earned</span>
                        <div className="flex items-center gap-2">
                            <Star size={24} className="text-plasma-purple fill-plasma-purple" />
                            <span className="text-4xl font-bold text-white">+{xpEarned}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Performance Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-lg text-star-white/80 mb-12 font-light"
                >
                    {percentage === 100
                        ? "Perfect execution, Commander! You've mastered this simulation. 🌟"
                        : percentage >= 80
                            ? "Excellent work! Your understanding of the cosmos is expanding. 🚀"
                            : percentage >= 60
                                ? "Good effort. Review the mission data to improve your score. 📚"
                                : "Mission incomplete. We recommend re-running the simulation. 💪"}
                </motion.p>

                {/* Actions */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex gap-6 justify-center"
                >
                    <button
                        onClick={onRetake}
                        className="px-8 py-3 rounded-full border border-white/20 text-star-white hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-2 group"
                    >
                        <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
                        <span className="font-orbitron text-sm tracking-wider">RETAKE</span>
                    </button>

                    <GlowButton onClick={onContinue}>
                        CONTINUE JOURNEY <ArrowRight size={18} className="ml-2" />
                    </GlowButton>
                </motion.div>
            </div>
        </motion.div>
    );
}
