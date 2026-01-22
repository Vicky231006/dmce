'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
// We'll implement these panels next
// import { NEOPanel } from '@/components/panels/NEOPanel';
// import { ISSPanel } from '@/components/panels/ISSPanel';
// import { MarsPanel } from '@/components/panels/MarsPanel';
// import { APODPanel } from '@/components/panels/APODPanel';
// import { LaunchesPanel } from '@/components/panels/LaunchesPanel';
// import { NewsPanel } from '@/components/panels/NewsPanel';

export function Dashboard() {
    const mode = useAppStore(state => state.mode);

    return (
        <AnimatePresence>
            {mode === 'dashboard' && (
                <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="fixed right-0 top-0 h-screen w-[500px] z-20 overflow-y-auto bg-deep-space/80 backdrop-blur-xl border-l border-cyan-glow/20 shadow-2xl"
                >
                    <div className="p-6 space-y-6">
                        <h2 className="text-2xl font-orbitron text-cyan-glow mb-6">Mission Dashboard</h2>

                        {/* Placeholders for now until panels are implemented */}
                        <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="text-lg font-orbitron text-star-white mb-2">Near-Earth Objects</h3>
                            <p className="text-sm text-star-white/60">Loading live data...</p>
                        </div>

                        <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="text-lg font-orbitron text-star-white mb-2">ISS Position</h3>
                            <p className="text-sm text-star-white/60">Loading live data...</p>
                        </div>

                        <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="text-lg font-orbitron text-star-white mb-2">Mars Rover</h3>
                            <p className="text-sm text-star-white/60">Loading live data...</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
