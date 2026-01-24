'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { LessonInteractive } from '@/lib/lessonData';

export function InteractiveControls({ controls, currentTime }: { controls: LessonInteractive[], currentTime: number }) {
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-end gap-4">
            {/* Toggle Button */}
            <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="pointer-events-auto w-10 h-10 rounded-full bg-deep-space/80 border border-cyan-glow/30 text-cyan-glow flex items-center justify-center hover:bg-cyan-glow/20 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
                {isMinimized ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </button>

            <AnimatePresence>
                {!isMinimized && (
                    <div className="space-y-4">
                        {controls.map((control, idx) => (
                            <motion.div
                                key={control.id}
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 100, opacity: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="pointer-events-auto"
                            >
                                <GlassCard className="p-5 w-72 backdrop-blur-xl bg-deep-space/80 border-cyan-glow/20">
                                    <label className="block text-xs text-cyan-glow font-orbitron mb-3 tracking-wider uppercase flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-cyan-glow rounded-full animate-pulse" />
                                        {control.label}
                                    </label>

                                    {control.type === 'slider' && (
                                        <div className="relative pt-1">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                onChange={(e) => control.effect(parseInt(e.target.value))}
                                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-glow [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,240,255,0.5)] hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                                            />
                                            <div className="flex justify-between mt-2 text-[10px] text-star-white/40 font-mono">
                                                <span>MIN</span>
                                                <span>MAX</span>
                                            </div>
                                        </div>
                                    )}

                                    {control.type === 'toggle' && (
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <span className="text-sm text-star-white/80 group-hover:text-white transition-colors">Activate System</span>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => control.effect(e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-glow/50 peer-checked:shadow-[0_0_10px_rgba(0,240,255,0.3)]"></div>
                                            </div>
                                        </label>
                                    )}

                                    {control.type === 'button' && (
                                        <button
                                            onClick={() => control.effect(true)}
                                            className="w-full px-4 py-3 bg-cyan-glow/10 border border-cyan-glow/50 rounded hover:bg-cyan-glow/20 hover:border-cyan-glow transition-all text-cyan-glow font-orbitron text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] active:scale-95"
                                        >
                                            ENGAGE
                                        </button>
                                    )}
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
