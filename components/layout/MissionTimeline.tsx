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
                    <div className="fixed top-6 right-6 z-50">
                        <button
                            onClick={() => setMode('explore')}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-deep-space/80 backdrop-blur-xl border border-white/10 text-star-white hover:bg-white/10 hover:border-cyan-glow/50 transition-all group shadow-lg"
                        >
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-orbitron text-sm tracking-wider">EXIT TIMELINE</span>
                        </button>
                    </div>

                    <TimelineContainer />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
