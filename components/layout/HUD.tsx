import { useSidebarStore, useTimeStore } from '@/lib/store';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface HUDProps {
    isActive: boolean;
}

export function HUD({ isActive }: HUDProps) {
    const { isPaused, togglePause, timeSpeed, setSpeed } = useTimeStore();
    const { selectedPlanet } = useSidebarStore();

    if (!isActive || selectedPlanet) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
            {/* Top Bar (Space Scope Header) - Moved to bottom on mobile */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-32 left-0 right-0 text-center md:static md:text-left pointer-events-auto"
            >
                <div className="inline-block md:block">
                    <h1 className="text-3xl font-orbitron text-cyan-glow tracking-wider">SPACESCOPE</h1>
                    <p className="text-xs text-star-white/60 font-mono tracking-[0.2em]">INTERPLANETARY EXPLORATION SYSTEM</p>
                </div>
            </motion.div>

            {/* Bottom Controls */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-end justify-center w-full md:justify-center pointer-events-auto mt-auto"
            >
                <div className="bg-deep-space/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-4">
                    <button
                        onClick={togglePause}
                        className="text-star-white hover:text-cyan-glow transition-colors"
                    >
                        {isPaused ? <Play size={24} /> : <Pause size={24} />}
                    </button>

                    <div className="h-8 w-[1px] bg-white/10" />

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-star-white/60">SPEED</span>
                        <div className="flex gap-1">
                            {[1, 10, 50, 100].map((speed) => (
                                <button
                                    key={speed}
                                    onClick={() => setSpeed(speed)}
                                    className={`px-2 py-1 rounded text-xs font-mono transition-colors ${timeSpeed === speed
                                        ? 'bg-cyan-glow/20 text-cyan-glow'
                                        : 'text-star-white/40 hover:text-star-white'
                                        }`}
                                >
                                    {speed}x
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
