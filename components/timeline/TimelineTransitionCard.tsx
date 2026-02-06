'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Rocket } from 'lucide-react';

export function TimelineTransitionCard() {
    const timelineMode = useAppStore(state => state.timelineMode);
    const setTimelineMode = useAppStore(state => state.setTimelineMode);

    const handleExploreFuture = () => {
        setTimelineMode('future');

        // Scroll to next screen (will snap to the 2026 year card)
        setTimeout(() => {
            const wrapper = document.getElementById('mission-timeline-scroll-container');
            if (wrapper) {
                const currentScroll = wrapper.scrollTop;
                const viewportHeight = window.innerHeight;

                // Scroll down by one viewport height to reach the next card
                wrapper.scrollTo({
                    top: currentScroll + viewportHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
    };

    const handleGoToStart = () => {
        const wrapper = document.getElementById('mission-timeline-scroll-container');
        if (wrapper) {
            wrapper.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Reset to past mode if in future
        if (timelineMode === 'future') {
            setTimeout(() => setTimelineMode('past'), 500);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center snap-start relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        background: [
                            'radial-gradient(circle at 50% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 50%, rgba(183, 148, 246, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%)',
                        ],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0"
                />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-glow rounded-full"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                            opacity: 0,
                        }}
                        animate={{
                            y: [null, -100],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            delay: Math.random() * 2,
                            repeat: Infinity,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-8 max-w-5xl w-full">
                {/* Title */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-4"
                >
                    <h2 className="text-6xl md:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-plasma-purple mb-4">
                        WHAT'S NEXT?
                    </h2>
                    <motion.div
                        className="h-1 bg-gradient-to-r from-transparent via-cyan-glow to-transparent mx-auto"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        style={{ width: '60%' }}
                    />
                </motion.div>

                {/* Buttons Container */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center"
                >
                    {/* Explore Future Missions Button */}
                    {timelineMode === 'past' && (
                        <motion.button
                            onClick={handleExploreFuture}
                            className="group relative w-full md:w-80 h-16 px-8 bg-cyan-glow/10 backdrop-blur-xl border-2 border-cyan-glow/50 rounded-lg overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-cyan-glow/0 group-hover:bg-cyan-glow/20 transition-all duration-300" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_40px_rgba(0,217,255,0.6)]" />

                            {/* Button content */}
                            <div className="relative z-10 flex items-center justify-center gap-3 h-full">
                                <Rocket className="w-6 h-6 text-cyan-glow group-hover:animate-pulse" />
                                <span className="font-orbitron font-bold text-cyan-glow uppercase tracking-wider text-sm md:text-base">
                                    Explore Future Missions
                                </span>
                            </div>
                        </motion.button>
                    )}
                </motion.div>

                {/* Decorative line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="mx-auto mt-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
            </div>
        </div>
    );
}
