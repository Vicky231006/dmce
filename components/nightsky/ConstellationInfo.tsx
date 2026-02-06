'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { CONSTELLATIONS } from '@/lib/constellationData';
// Assuming useChatStore or similar is used for Global event dispatch or we maintain the CustomEvent approach
// Since the prompt suggests CustomEvent or similar for AI, we'll implement the CustomEvent dispatch 
// but also ensure MissionControl is listening for it, or use the store if possible.
// For now, I'll stick to the window dispatch pattern requested in the prompt, 
// OR I will perform a cleaner integration by updating the chat store directly if I can find it.
// Checking imports... I see `components/layout/AIChat.tsx` depends on `useAppStore`.
// I will just use the CustomEvent pattern for simplicity as per the prompt instructions, 
// but I should really verify how to trigger AI. 
// Ah, `MissionControl` or `AIChat` probably doesn't listen to window events by default.
// The prompt says: "window.dispatchEvent(new CustomEvent('openAI'..."
// I will implement exactly that, and then I might need to add the listener in AIChat if it doesn't exist.

function ConstellationInfo({ constellation, isSelected, onClose }: { constellation: string | null, isSelected: boolean, onClose: () => void }) {
    if (!constellation) return null;

    const data = CONSTELLATIONS.find(c => c.id === constellation);
    if (!data) return null;

    const handleAskAI = () => {
        window.dispatchEvent(new CustomEvent('openAI', {
            detail: {
                contextStr: `User is viewing the constellation ${data.name} (${data.nameLatin}). Description: ${data.description}. Mythology: ${data.mythology}.`,
                prompt: `Tell me more about the ${data.name} constellation.`
            }
        }));
        onClose();
    };

    return (
        <AnimatePresence>
            {isSelected ? (
                // Full detail modal (when clicked)
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-xl w-full"
                    >
                        <GlassCard className="p-8 border-cyan-500/30 shadow-[0_0_50px_-10px_rgba(8,145,178,0.3)]">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6 border-b border-white/10 pb-4">
                                <div>
                                    <h2 className="text-3xl font-bold font-mono text-cyan-400 mb-1 tracking-tighter">
                                        {data.name}
                                    </h2>
                                    <p className="text-sm text-cyan-100/60 italic font-serif">
                                        {data.nameLatin}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2 text-cyan-200">
                                    <BookOpen size={16} />
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Description</h3>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {data.description}
                                </p>
                            </div>

                            {/* Mythology */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2 text-purple-300">
                                    <Sparkles size={16} />
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Mythology</h3>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-purple-500/50 pl-4">
                                    "{data.mythology}"
                                </p>
                            </div>

                            {/* AI Button */}
                            <GlowButton
                                onClick={handleAskAI}
                                className="w-full flex justify-center py-3 text-base"
                            >
                                <Sparkles size={18} className="mr-2 animate-pulse" />
                                Ask ARIA about {data.name}
                            </GlowButton>
                        </GlassCard>
                    </motion.div>
                </motion.div>
            ) : (
                // Quick hover tooltip
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[70] pointer-events-none"
                >
                    <div className="bg-black/80 backdrop-blur-xl border border-cyan-500/40 rounded-full px-8 py-3 shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]">
                        <p className="text-cyan-300 font-mono text-base font-bold text-center">
                            {data.name}
                        </p>
                        <p className="text-cyan-100/50 text-[10px] uppercase tracking-widest text-center mt-1">
                            Click for details
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export { ConstellationInfo };
