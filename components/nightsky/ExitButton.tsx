'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';

export function ExitButton({ onExit }: { onExit: () => void }) {
    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="fixed top-6 left-6 z-[70]"
        >
            <GlowButton onClick={onExit} className="pl-4 pr-6 py-3 flex items-center gap-2">
                <ArrowLeft size={18} />
                <span>RETURN TO ORBIT</span>
            </GlowButton>
        </motion.div>
    );
}
