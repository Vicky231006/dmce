'use client';

import { motion } from 'framer-motion';
import { Lock, CheckCircle, Play, Star } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useEducationStore } from '@/lib/educationStore';
import { LESSONS } from '@/lib/lessonData';

export function LessonSelectionScreen({ onSelectLesson }: { onSelectLesson: (id: string) => void }) {
    const { lessonProgress, totalXP } = useEducationStore();

    const isLessonUnlocked = (index: number) => {
        if (index === 0) return true;
        const previousLesson = LESSONS[index - 1];
        const progress = lessonProgress.get(previousLesson.id);
        return progress?.completed || false;
    };

    return (
        <div className="min-h-screen p-4 md:p-8 pt-24 md:pt-24 bg-gradient-to-b from-deep-space to-void-black">
            {/* Header */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-orbitron text-cyan-glow mb-4">
                    COSMIC ACADEMY
                </h1>
                <p className="text-xl text-star-white/80 font-mono tracking-wide">
                    Master the Mysteries of the Universe
                </p>

                {/* Overall Progress */}
                <div className="mt-8 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-star-white/60 font-orbitron">TOTAL PROGRESS</span>
                        <span className="text-sm text-cyan-glow font-mono">{totalXP} XP</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-glow to-plasma-purple"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (totalXP / (LESSONS.length * 100)) * 100)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Lesson Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pb-72 md:pb-20">
                {LESSONS.map((lesson, index) => {
                    const progress = lessonProgress.get(lesson.id);
                    const isUnlocked = isLessonUnlocked(index);
                    const isCompleted = progress?.completed || false;

                    return (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard
                                glow={isUnlocked && !isCompleted}
                                className={`relative overflow-hidden transition-all duration-300 h-full flex flex-col ${isUnlocked
                                    ? 'cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                                    : 'opacity-50 cursor-not-allowed grayscale'
                                    }`}
                                onClick={() => isUnlocked && onSelectLesson(lesson.id)}
                            >
                                {/* Lock Overlay */}
                                {!isUnlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] z-10">
                                        <div className="flex flex-col items-center gap-2">
                                            <Lock size={48} className="text-star-white/40" />
                                            <span className="text-xs font-mono text-star-white/40 uppercase tracking-widest">Locked</span>
                                        </div>
                                    </div>
                                )}

                                {/* Completed Checkmark */}
                                {isCompleted && (
                                    <div className="absolute top-4 right-4 z-10 bg-deep-space/80 rounded-full p-1 border border-success-green/50">
                                        <CheckCircle size={24} className="text-success-green" />
                                    </div>
                                )}

                                <div className="p-8 flex flex-col h-full">
                                    {/* Icon */}
                                    <div className="text-6xl mb-6 text-center transform group-hover:scale-110 transition-transform duration-500">
                                        {lesson.icon}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-orbitron text-white text-center mb-2 tracking-wide">
                                        {lesson.title}
                                    </h3>

                                    {/* Lesson Number */}
                                    <p className="text-xs font-mono text-cyan-glow/60 text-center mb-6 uppercase tracking-[0.2em]">
                                        Module 0{index + 1}
                                    </p>

                                    <div className="mt-auto">
                                        {/* Progress */}
                                        {isCompleted ? (
                                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-star-white/60 font-mono">Status</span>
                                                    <span className="text-success-green font-orbitron tracking-wider">COMPLETED</span>
                                                </div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-star-white/60 font-mono">Quiz Score</span>
                                                    <span className="text-cyan-glow font-mono">{progress?.quizScore}/5</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-star-white/60 font-mono">XP Earned</span>
                                                    <span className="text-plasma-purple font-mono">+{progress?.xpEarned}</span>
                                                </div>
                                            </div>
                                        ) : isUnlocked ? (
                                            <div className="text-center space-y-4">
                                                <div className="inline-flex items-center gap-2 bg-cyan-glow/10 border border-cyan-glow/50 px-6 py-3 rounded-full group-hover:bg-cyan-glow/20 transition-colors">
                                                    <Play size={18} className="text-cyan-glow fill-cyan-glow" />
                                                    <span className="text-cyan-glow font-orbitron text-sm tracking-wider">START SIMULATION</span>
                                                </div>
                                                <div className="flex items-center justify-center gap-2 text-xs text-star-white/40 font-mono">
                                                    <Star size={12} className="text-plasma-purple" />
                                                    <span>{lesson.xpReward} XP AVAILABLE</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/5">
                                                <p className="text-xs text-star-white/40 font-mono">
                                                    Complete previous module to unlock
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
