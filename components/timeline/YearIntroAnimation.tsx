'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function YearIntroAnimation({ year }: { year: number }) {
    const [count, setCount] = useState(1900);

    useEffect(() => {
        const duration = 1500; // 1.5 seconds
        const steps = year - 1900;
        const increment = duration / steps;

        const interval = setInterval(() => {
            setCount(prev => {
                if (prev >= year) {
                    clearInterval(interval);
                    return year;
                }
                return prev + 1;
            });
        }, increment);

        return () => clearInterval(interval);
    }, [year]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
            {/* Particle background */}
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 100 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-glow rounded-full"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                            opacity: Math.random() * 0.5 + 0.3,
                        }}
                        animate={{
                            y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
                            opacity: [null, 0],
                        }}
                        transition={{
                            duration: Math.random() * 2 + 1,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                ))}
            </div>

            {/* Year Counter */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative z-10"
            >
                <h1 className="text-[120px] font-orbitron font-bold text-cyan-glow">
                    {count}
                </h1>
                <motion.div
                    className="absolute inset-0 blur-3xl bg-cyan-glow/30"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>
        </motion.div>
    );
}
