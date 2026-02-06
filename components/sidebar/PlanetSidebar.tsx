'use client';

import { usePathname } from 'next/navigation';

import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore, useTimeStore, useAppStore } from '@/lib/store';
import { X, ChevronLeft, ChevronRight, Telescope, Globe, Orbit, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLANET_DATA } from '@/lib/planetData';
import { useState, useEffect } from 'react';

// --- UI Components ---

// Hexagonal Button
function HexButton({
    children,
    onClick,
    active = false,
    className
}: {
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative h-12 w-full flex items-center justify-center px-6 clip-hex transition-all duration-300 group",
                active
                    ? "bg-cyan-glow/20 text-cyan-glow border-cyan-glow shadow-[0_0_15px_rgba(0,217,255,0.3)]"
                    : "bg-deep-space/80 text-star-white/80 hover:text-cyan-glow hover:bg-cyan-glow/10",
                className
            )}
        >
            {/* Hex Borders (Simulated with pseudo-elements or SVG in real prod, using CSS borders for prototype) */}
            <div className={cn(
                "absolute inset-0 border-y border-white/10 group-hover:border-cyan-glow/50 transition-colors",
                active && "border-cyan-glow"
            )} />
            <div className={cn(
                "absolute inset-0 border-x border-white/10 scale-x-[0.98] group-hover:border-cyan-glow/50 transition-colors",
                active && "border-cyan-glow"
            )} />

            <span className="relative z-10 font-orbitron tracking-wider text-sm flex items-center gap-2">
                {children}
            </span>
        </button>
    );
}

// --- Views ---

// Helper to get texture path
const getTexturePath = (planetName: string) => {
    const normalized = planetName.toLowerCase();
    const available = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    if (available.includes(normalized)) {
        return `/textures/planets/${normalized}_diffuse.jpg`;
    }
    return '/textures/placeholder_planet.jpg';
};

// Stage 1: Mini Card (Planet Preview)
function MiniCard({ planet, onExplore }: { planet: string; onExplore: () => void }) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed left-1/2 -translate-x-1/2 md:translate-x-0 md:left-20 top-24 md:top-1/2 -translate-y-0 md:-translate-y-1/2 w-[90vw] md:w-[300px] z-50 max-w-[350px] scale-75 md:scale-100 origin-top"
        >
            <div className="relative bg-deep-space/90 backdrop-blur-xl border border-cyan-glow/30 p-1 clip-corners">
                {/* Decorative Lines */}
                <div className="absolute -left-2 top-10 bottom-10 w-[2px] bg-cyan-glow/50" />
                <div className="absolute -right-2 top-10 bottom-10 w-[2px] bg-cyan-glow/50" />

                <div className="bg-black/40 p-6 flex flex-col items-center gap-6 relative">
                    {/* Mobile Header (Fixed absolute to screen to avoid overlap) - Moved to bottom 
                    <div className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 w-full text-center z-[60] pointer-events-none">
                        <div className="bg-deep-space/80 backdrop-blur-md border border-cyan-glow/30 rounded-full py-1 px-4 inline-block shadow-lg">
                            <h3 className="text-cyan-glow font-orbitron text-xs tracking-[0.2em] uppercase glow-text whitespace-nowrap">SPACE SCOPE</h3>
                        </div>
                    </div>*/}

                    {/* Planet Preview Circle */}
                    <div className="w-32 h-32 rounded-full bg-black relative shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 flex items-center justify-center overflow-hidden">
                        <div
                            className="w-full h-full bg-cover bg-center opacity-90 transition-transform duration-700 hover:scale-110"
                            style={{ backgroundImage: `url('${getTexturePath(planet)}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                        <span className="absolute bottom-4 text-xs font-orbitron text-star-white/60">PREVIEW</span>
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-orbitron text-cyan-glow tracking-widest uppercase mb-1">{planet}</h2>
                        <div className="h-[1px] w-12 bg-cyan-glow/50 mx-auto mb-4" />

                        <button
                            onClick={onExplore}
                            className="group relative px-8 py-2 bg-cyan-glow/10 hover:bg-cyan-glow/20 border border-cyan-glow/50 transition-all"
                        >
                            <span className="font-orbitron text-cyan-glow tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">EXPLORE</span>
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-glow" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-glow" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Stage 2: Main Menu
function MainMenu({
    planet,
    onViewChange,
    onVisit,
    onSwitch,
    onReset
}: {
    planet: string;
    onViewChange: (view: string) => void;
    onVisit: () => void;
    onSwitch: () => void;
    onReset: () => void;
}) {
    const { isPaused, togglePause } = useTimeStore();

    return (
        <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="fixed left-0 top-1/2 -translate-y-1/2 md:translate-x-0 md:left-20 md:-translate-y-1/2 w-[250px] md:w-[300px] z-50 scale-50 md:scale-100 origin-left md:origin-top -ml-2 md:ml-0"
        >
            <div className="bg-deep-space/90 backdrop-blur-xl border border-cyan-glow/30 p-6 md:p-8 clip-corners relative">
                {/* Decorative Lines */}
                <div className="absolute -left-1 top-10 bottom-10 w-[2px] bg-cyan-glow/50" />
                <div className="absolute -right-1 top-10 bottom-10 w-[2px] bg-cyan-glow/50" />

                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-4xl font-orbitron text-white tracking-widest uppercase mb-1">{planet}</h2>
                    <span className="text-xs font-mono text-cyan-glow tracking-[0.5em] mb-8">PLANET</span>

                    <div className="w-full space-y-3">
                        <HexButton onClick={onVisit} active>
                            VISIT <ChevronRight size={16} />
                        </HexButton>

                        <HexButton onClick={togglePause}>
                            {isPaused ? 'RESUME' : 'ORBIT'}
                        </HexButton>

                        <HexButton onClick={() => onViewChange('encyclopedia')}>
                            ENCYCLOPEDIA <ChevronRight size={16} />
                        </HexButton>

                        <HexButton onClick={() => onViewChange('structure')}>
                            STRUCTURE <ChevronRight size={16} />
                        </HexButton>
                    </div>

                    {/* Bottom Tools */}
                    <div className="flex gap-12 mt-8">
                        <div
                            onClick={() => onSwitch()}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                        >
                            <div className="w-12 h-12 border border-cyan-glow/30 rotate-45 flex items-center justify-center group-hover:bg-cyan-glow/10 transition-colors">
                                <div className="-rotate-45"><ChevronLeft size={20} className="text-cyan-glow" /></div>
                            </div>
                            <span className="text-[10px] font-orbitron text-star-white/60 mt-2">SWITCH</span>
                        </div>

                        <div
                            onClick={onReset}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                        >
                            <div className="w-12 h-12 border border-cyan-glow/30 rotate-45 flex items-center justify-center group-hover:bg-cyan-glow/10 transition-colors">
                                <div className="-rotate-45"><Orbit size={20} className="text-cyan-glow" /></div>
                            </div>
                            <span className="text-[10px] font-orbitron text-star-white/60 mt-2">SYSTEM</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Stage 3: Details View (Encyclopedia/Structure)
function DetailsView({ planet, view, onBack }: { planet: string; view: 'encyclopedia' | 'structure'; onBack: () => void }) {
    const data = PLANET_DATA[planet.toLowerCase()];

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed left-0 top-0 h-screen w-full md:w-[450px] z-50 bg-deep-space/95 backdrop-blur-xl border-r border-cyan-glow/30"
        >
            {/* Header with Integrated Back Button */}
            <div className="relative p-6 md:p-8 border-b border-cyan-glow/20 bg-black/40 flex items-center pt-24 md:pt-8">
                <button
                    onClick={onBack}
                    className="mr-6 p-2 text-cyan-glow hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                    <ChevronLeft size={32} />
                </button>
                <div>
                    <h2 className="text-3xl font-orbitron text-white tracking-widest uppercase">{planet}</h2>
                </div>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto h-[calc(100vh-140px)]">
                <h3 className="text-xl font-orbitron text-white mb-6 uppercase tracking-wider border-b border-white/10 pb-2">
                    {view === 'encyclopedia' ? 'ENCYCLOPEDIA' : 'INTERNAL STRUCTURE'}
                </h3>

                {view === 'encyclopedia' && data && (
                    <div className="space-y-1">
                        <DataRow label="EQUATORIAL DIAMETER" value={data.diameter} />
                        <DataRow label="MASS" value={data.mass} />
                        <DataRow label="MEAN DIST. FROM SUN" value={data.distanceFromSun} />
                        <DataRow label="ROTATION PERIOD" value={data.dayLength} />
                        <DataRow label="SOLAR ORBIT PERIOD" value={data.yearLength} />
                        <DataRow label="SURFACE GRAVITY" value={data.gravity} />
                        <DataRow label="SURFACE TEMPERATURE" value={data.temperature.average} />

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-star-white/80 leading-relaxed text-sm">
                                {data.overview}
                            </p>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-lg font-orbitron text-white mb-4 uppercase">ATMOSPHERE</h4>
                            <p className="text-star-white/80 leading-relaxed text-sm">
                                {data.surfaceComposition}
                            </p>
                        </div>
                    </div>
                )}

                {view === 'structure' && data && (
                    <div className="space-y-6">
                        {data.structure.map((layer, idx) => (
                            <div key={idx} className="bg-white/5 p-6 rounded border border-white/10">
                                <h4 className="text-cyan-glow font-orbitron mb-2 text-lg">{layer.name}</h4>
                                <p className="text-sm text-star-white/80 leading-relaxed">{layer.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div >
    );
}

function DataRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-white/5 hover:bg-white/5 px-2 transition-colors">
            <span className="text-xs font-orbitron text-star-white/70 uppercase tracking-wider">{label}</span>
            <span className="text-sm font-orbitron text-cyan-glow uppercase">{value}</span>
        </div>
    );
}

// Stage 4: Planet Switcher
function PlanetSwitcher({ onSelect, onBack }: { onSelect: (planet: string) => void; onBack: () => void }) {
    const planets = [
        { name: 'Sun', type: 'Star' },
        { name: 'Mercury', type: 'Planet' },
        { name: 'Venus', type: 'Planet' },
        { name: 'Earth', type: 'Planet' },
        { name: 'Mars', type: 'Planet' },
        { name: 'Jupiter', type: 'Planet' },
        { name: 'Saturn', type: 'Planet' },
        { name: 'Uranus', type: 'Planet' },
        { name: 'Neptune', type: 'Planet' },
        { name: 'Pluto', type: 'Dwarf Planet' }
    ];

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
            <div className="relative w-full max-w-[800px] bg-deep-space/90 border border-cyan-glow/30 p-6 md:p-8 clip-corners max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-cyan-glow/20 pb-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-cyan-glow hover:text-white transition-colors"
                    >
                        <ChevronLeft size={24} />
                        <span className="font-orbitron text-sm">BACK</span>
                    </button>
                    <h2 className="text-lg md:text-2xl font-orbitron text-white tracking-widest uppercase">SELECT DESTINATION</h2>
                    <div className="w-8" /> {/* Spacer for centering */}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {planets.map((p) => (
                        <button
                            key={p.name}
                            onClick={() => onSelect(p.name)}
                            className="group relative aspect-square bg-white/5 border border-white/10 hover:border-cyan-glow/50 hover:bg-cyan-glow/10 rounded-xl flex flex-col items-center justify-center gap-4 transition-all"
                        >
                            <div
                                className="w-16 h-16 rounded-full bg-black shadow-lg group-hover:scale-110 transition-transform duration-300 bg-cover bg-center border border-white/20"
                                style={{ backgroundImage: `url('${getTexturePath(p.name)}')` }}
                            />
                            <div className="text-center">
                                <div className="font-orbitron text-cyan-glow text-sm tracking-wider">{p.name.toUpperCase()}</div>
                                <div className="text-[10px] text-star-white/50 font-mono mt-1">{p.type.toUpperCase()}</div>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20 group-hover:border-cyan-glow transition-colors" />
                            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20 group-hover:border-cyan-glow transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// --- Main Sidebar Component ---

export function PlanetSidebar() {
    const { selectedPlanet, closeSidebar, setIsVisiting, setSelectedPlanet } = useSidebarStore();
    const { mode } = useAppStore();
    const [viewState, setViewState] = useState<'mini' | 'menu' | 'details' | 'switcher'>('mini');
    const [detailType, setDetailType] = useState<'encyclopedia' | 'structure'>('encyclopedia');
    const pathname = usePathname();

    // Reset state when planet changes
    useEffect(() => {
        if (selectedPlanet) {
            setViewState('mini');
        }
    }, [selectedPlanet]);

    // Close sidebar on route (mode) change
    useEffect(() => {
        if (selectedPlanet) {
            closeSidebar();
            setViewState('mini');
        }
    }, [pathname, mode, closeSidebar]);

    if (!selectedPlanet) return null;

    return (
        <AnimatePresence mode="wait">
            {viewState === 'mini' && (
                <MiniCard
                    key="mini"
                    planet={selectedPlanet}
                    onExplore={() => setViewState('menu')}
                />
            )}

            {viewState === 'menu' && (
                <MainMenu
                    key="menu"
                    planet={selectedPlanet}
                    onViewChange={(type) => {
                        setDetailType(type as any);
                        setViewState('details');
                    }}
                    onVisit={() => {
                        setIsVisiting(true);
                    }}
                    onSwitch={() => setViewState('switcher')}
                    onReset={() => closeSidebar()}
                />
            )}

            {viewState === 'details' && (
                <DetailsView
                    key="details"
                    planet={selectedPlanet}
                    view={detailType}
                    onBack={() => setViewState('menu')}
                />
            )}

            {viewState === 'switcher' && (
                <PlanetSwitcher
                    key="switcher"
                    onBack={() => setViewState('menu')}
                    onSelect={(planet) => {
                        setSelectedPlanet(planet);
                        setViewState('mini');
                    }}
                />
            )}
        </AnimatePresence>
    );
}
