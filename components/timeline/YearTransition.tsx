'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface YearTransitionProps {
    year: number;
    title: string;
    isActive: boolean;
}

export function YearTransition({ year, title, isActive }: YearTransitionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: '0px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="h-screen flex items-center justify-center relative overflow-hidden"
        >
            {/* Animated background */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        background: [
                            'radial-gradient(circle at 50% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 50%, rgba(183, 148, 246, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%)',
                        ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl px-8">
                {/* Year */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: isInView ? 1 : 0, rotate: isInView ? 0 : -180 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-8"
                >
                    <h2 className="text-8xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-plasma-purple">
                        {year}
                    </h2>
                    <motion.div
                        className="h-1 bg-gradient-to-r from-transparent via-cyan-glow to-transparent mt-4"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isInView ? 1 : 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    />
                </motion.div>

                {/* Title (Movie Style) */}
                <motion.h3
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-3xl font-orbitron text-star-white tracking-wide"
                >
                    {title}
                </motion.h3>

                {/* Decorative elements */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isInView ? '100%' : 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
            </div>

            {/* Particles */}
            {isInView && (
                <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => (
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
            )}
        </motion.div>
    );
}
