'use client';

import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export function DirectionIndicator({ direction }: { direction: string }) {
    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="fixed top-6 right-6 z-[70] flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg select-none"
        >
            <Compass size={24} className="text-cyan-400 animate-pulse" />
            <div>
                <div className="text-[10px] text-white/60 uppercase tracking-wider">Looking</div>
                <div className="text-xl font-bold font-mono text-cyan-400">{direction}</div>
            </div>
        </motion.div>
    );
}
