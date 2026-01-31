'use client';

import { useAppStore } from '@/lib/store';
import { Rocket, LayoutDashboard, GraduationCap, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Navbar() {
    const { mode, setMode } = useAppStore();

    const navItems = [
        { id: 'explore', label: 'EXPLORE', icon: Rocket },
        { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
        { id: 'education', label: 'EDUCATION', icon: GraduationCap },
        { id: 'mission', label: 'MISSION', icon: Radio },
    ] as const;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100]">
            <div className="flex items-center gap-1 p-1 bg-deep-space/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl w-[95vw] md:w-auto max-w-fit mx-auto overflow-x-auto">
                {navItems.map((item) => {
                    const isActive = mode === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setMode(item.id)}
                            className={cn(
                                "relative flex items-center justify-center gap-2 px-3 md:px-6 py-2 rounded-full transition-all duration-300 flex-1 md:flex-initial min-w-[40px]",
                                isActive ? "text-deep-space" : "text-star-white hover:text-cyan-glow"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-cyan-glow rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2 font-orbitron text-xs md:text-sm tracking-wider whitespace-nowrap">
                                <Icon size={16} className="shrink-0" />
                                <span className="hidden sm:inline">{item.label}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
