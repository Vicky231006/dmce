'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVisiblePlanets, VisiblePlanet } from '@/lib/planetPositions';
import { GlassCard } from '@/components/ui/GlassCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function PlanetIndicators({ planetName, onSelectPlanet, selectedPlanet }: { planetName: string; onSelectPlanet?: (name: string) => void; selectedPlanet?: string | null }) {
    const [visiblePlanets, setVisiblePlanets] = useState<VisiblePlanet[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const planets = getVisiblePlanets(planetName);
        setVisiblePlanets(planets);
    }, [planetName]);

    if (visiblePlanets.length === 0) return null;

    const getPlanetColor = (name: string): string => {
        const colors: Record<string, string> = {
            mercury: '#a5a5a5',
            venus: '#e3bb76',
            earth: '#4a90e2',
            mars: '#e27b58',
            jupiter: '#c88b3a',
            saturn: '#f4d03f',
            uranus: '#4fd0e7',
            neptune: '#4166f5',
            pluto: '#d3d3d3',
        };
        return colors[name.toLowerCase()] || '#ffffff';
    };

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="fixed right-6 bottom-6 z-[70] hidden md:block"
        >
            <GlassCard className="w-60 border-cyan-900/30 transition-all duration-300">
                {/* Header / Toggle */}
                <div
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                        Visible Planets
                    </h3>
                    {isCollapsed ? <ChevronUp size={16} className="text-cyan-400" /> : <ChevronDown size={16} className="text-cyan-400" />}
                </div>

                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 space-y-2">
                                {visiblePlanets.map((planet, idx) => (
                                    <motion.div
                                        key={planet.name}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`flex items-center justify-between text-sm group cursor-pointer p-1 rounded hover:bg-white/10 ${selectedPlanet?.toLowerCase() === planet.name.toLowerCase() ? 'bg-cyan-900/50 border-1 border-cyan-500/50' : ''}`}
                                        onClick={() => onSelectPlanet?.(planet.name)}
                                    >
                                        <span className="text-slate-100 capitalize font-mono text-xs">{planet.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-500 text-[10px] font-mono group-hover:text-cyan-400 transition-colors">
                                                {planet.azimuth.toFixed(0)}° Az
                                            </span>
                                            <div
                                                className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]"
                                                style={{ backgroundColor: getPlanetColor(planet.name), color: getPlanetColor(planet.name) }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>
        </motion.div>
    );
}
