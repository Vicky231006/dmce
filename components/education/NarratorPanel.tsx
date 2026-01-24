'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lesson } from '@/lib/lessonData';

interface NarratorPanelProps {
    lesson: Lesson;
    currentTime: number;
    onTimeChange: (time: number) => void;
    isPaused: boolean;
    onTogglePause: () => void;
    playbackSpeed: number;
    onSpeedChange: (speed: number) => void;
    onRestart: () => void;
}

export function NarratorPanel({
    lesson,
    currentTime,
    onTimeChange,
    isPaused,
    onTogglePause,
    playbackSpeed,
    onSpeedChange,
    onRestart
}: NarratorPanelProps) {
    const currentNarration = lesson.narration.find(n =>
        currentTime >= n.timestamp && currentTime < n.timestamp + n.duration
    );

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
            <div className="bg-deep-space/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-glow to-purple-500"
                        style={{ width: `${(currentTime / lesson.duration) * 100}%` }}
                    />
                </div>

                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-glow/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                            {lesson.icon}
                        </div>
                        {/* Audio Wave Animation */}
                        {!isPaused && (
                            <div className="absolute -bottom-1 -right-1 flex gap-0.5 h-3 items-end">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 bg-cyan-glow rounded-full"
                                        animate={{ height: [4, 12, 4] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-orbitron text-sm text-cyan-glow tracking-widest uppercase">
                                AI NARRATOR
                            </h3>
                            <div className="flex items-center gap-2">
                                {/* Speed Control */}
                                <button
                                    onClick={() => onSpeedChange(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}
                                    className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-cyan-glow transition-colors"
                                >
                                    {playbackSpeed}x
                                </button>
                                {/* Restart */}
                                <button
                                    onClick={onRestart}
                                    className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                    title="Restart Lesson"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentNarration?.text || 'default'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-lg text-star-white font-light leading-relaxed"
                            >
                                {currentNarration?.text || "Observing cosmic evolution..."}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-2 shrink-0">
                        <button
                            onClick={onTogglePause}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                        >
                            {isPaused ? (
                                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
