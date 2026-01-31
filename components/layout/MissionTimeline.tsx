import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { TimelineContainer } from '@/components/timeline/TimelineContainer';
import { ChevronLeft } from 'lucide-react';

export function MissionTimeline() {
    const mode = useAppStore(state => state.mode);
    const setMode = useAppStore(state => state.setMode);

    return (
        <AnimatePresence>
            {mode === 'mission' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-40 bg-void-black overflow-y-auto snap-y snap-mandatory scroll-smooth"
                    id="mission-timeline-scroll-container"
                >
                    {/* Back Button (Fixed) */}
                    <div className="fixed top-24 right-4 md:top-6 md:right-6 z-50">
                        <button
                            onClick={() => setMode('explore')}
                            className="flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:h-auto md:px-6 md:py-3 rounded-full bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all group shadow-lg"
                        >
                            <span className="md:hidden text-lg">✕</span>
                            <span className="hidden md:flex items-center gap-2">
                                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="font-orbitron text-sm tracking-wider">EXIT TIMELINE</span>
                            </span>
                        </button>
                    </div>

                    <TimelineContainer />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
