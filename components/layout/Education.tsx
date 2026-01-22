'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { BookOpen, Telescope, Atom, ChevronRight } from 'lucide-react';

export function Education() {
    const mode = useAppStore(state => state.mode);

    const modules = [
        {
            title: "The Solar System",
            description: "Tour the 8 planets and learn about our cosmic neighborhood.",
            icon: Atom,
            level: "Beginner",
            xp: 100
        },
        {
            title: "Deep Space",
            description: "Explore nebulas, black holes, and galaxies far beyond our reach.",
            icon: Telescope,
            level: "Intermediate",
            xp: 200
        }
    ];

    return (
        <AnimatePresence>
            {mode === 'education' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-40 flex items-center justify-center bg-deep-space/90 backdrop-blur-xl"
                >
                    <div className="w-full max-w-5xl p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-4xl font-orbitron text-cyan-glow mb-2">COSMIC ACADEMY</h2>
                                <p className="text-star-white/60 font-mono">Expand your knowledge of the universe.</p>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-plasma-purple animate-pulse" />
                                <span className="text-sm font-orbitron text-star-white">0 XP</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-8 border-b border-white/10 mb-8">
                            <button className="pb-4 text-cyan-glow border-b-2 border-cyan-glow font-orbitron tracking-wider">
                                MODULES
                            </button>
                            <button className="pb-4 text-star-white/40 hover:text-star-white transition-colors font-orbitron tracking-wider">
                                THE ARCHIVES
                            </button>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            {modules.map((module, idx) => (
                                <div
                                    key={idx}
                                    className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-cyan-glow/50 transition-all duration-300 p-8 cursor-pointer"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-glow to-plasma-purple opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex justify-center mb-6">
                                        <module.icon size={48} className="text-star-white/20 group-hover:text-cyan-glow transition-colors duration-300" />
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-orbitron text-white group-hover:text-cyan-glow transition-colors">
                                            {module.title}
                                        </h3>
                                        <span className="px-2 py-1 rounded text-[10px] font-mono bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20">
                                            {module.level}
                                        </span>
                                    </div>

                                    <p className="text-star-white/60 text-sm mb-8 leading-relaxed">
                                        {module.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xs font-mono text-plasma-purple">
                                            +{module.xp} XP
                                        </span>
                                        <button className="flex items-center gap-2 text-sm font-orbitron text-white group-hover:translate-x-1 transition-transform">
                                            START MODULE <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
