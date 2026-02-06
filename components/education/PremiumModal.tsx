'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PremiumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
    const router = useRouter();

    const handleUnlock = () => {
        router.push('/payment?return=/');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 flex items-center justify-center z-[101] p-4"
                    >
                        <div className="relative w-full max-w-lg">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-plasma-purple/20 via-violet-500/10 to-plasma-purple/20 blur-3xl rounded-3xl" />

                            {/* Card */}
                            <div className="relative bg-gradient-to-b from-[#0a0a1a] to-[#050510] border border-violet-500/30 rounded-2xl overflow-hidden shadow-2xl">
                                {/* Subtle top glow */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 text-star-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
                                >
                                    <X size={20} />
                                </button>

                                {/* Content */}
                                <div className="p-8 md:p-10">
                                    {/* Icon */}
                                    <div className="flex justify-center mb-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-violet-500/30 blur-xl rounded-full" />
                                            <div className="relative w-16 h-16 bg-gradient-to-br from-violet-600/20 to-purple-900/20 border border-violet-500/40 rounded-2xl flex items-center justify-center">
                                                <Sparkles size={28} className="text-violet-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-2xl md:text-3xl font-orbitron text-white text-center mb-3 tracking-wide">
                                        Unlock Advanced Exploration
                                    </h2>

                                    {/* Subtitle */}
                                    <p className="text-violet-300/80 text-center text-sm md:text-base mb-6 font-mono">
                                        Go beyond the basics. See the universe the way scientists do.
                                    </p>

                                    {/* Body */}
                                    <p className="text-star-white/60 text-center text-sm leading-relaxed mb-8">
                                        This module is part of our <span className="text-violet-400">Advanced Space Series</span> — interactive simulations, deeper concepts, and expert-level insights designed for learners who want more than surface-level explanations.
                                    </p>

                                    {/* Price */}
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-6 py-3">
                                            <span className="text-2xl font-orbitron text-violet-300">₹1,000</span>
                                            <span className="text-violet-400/60 text-sm">— Lifetime Access</span>
                                        </div>
                                        <p className="text-xs text-star-white/40 mt-2 font-mono">
                                            One-time unlock. No subscriptions.
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={handleUnlock}
                                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-orbitron tracking-wider rounded-xl transition-all duration-300 shadow-lg shadow-violet-900/30 hover:shadow-violet-800/40"
                                        >
                                            Unlock Premium Module
                                        </button>

                                        <button
                                            onClick={onClose}
                                            className="w-full py-3 text-star-white/50 hover:text-white font-mono text-sm transition-colors"
                                        >
                                            Maybe later
                                        </button>
                                    </div>
                                </div>

                                {/* Bottom border glow */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
