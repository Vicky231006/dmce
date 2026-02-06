'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { PLANET_SURFACE_CONFIG } from '@/lib/nightSkyData';
import { SkyScene } from '@/components/nightsky/SkyScene';
import { ExitButton } from '@/components/nightsky/ExitButton';
import { DirectionIndicator } from '@/components/nightsky/DirectionIndicator';
import { ConstellationInfo } from '@/components/nightsky/ConstellationInfo';
import { PlanetIndicators } from '@/components/nightsky/PlanetIndicators';

interface NightSkyViewProps {
    planetName: string;
    onExit: () => void;
}

export function NightSkyView({ planetName, onExit }: NightSkyViewProps) {
    const [currentDirection, setCurrentDirection] = useState('North');
    const [hoveredConstellation, setHoveredConstellation] = useState<string | null>(null);
    const [selectedConstellation, setSelectedConstellation] = useState<string | null>(null);
    const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const config = PLANET_SURFACE_CONFIG[planetName.toLowerCase()] || PLANET_SURFACE_CONFIG['earth'];

    useEffect(() => {
        // Entrance animation complete
        setTimeout(() => setIsLoaded(true), 1000);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="fixed inset-0 z-[60] bg-black"
            >
                {/* 3D Canvas */}
                <Canvas
                    camera={{ position: [0, 2, 0.1], fov: 60, near: 0.1, far: 10000 }} // Increased Far plane to prevent culling
                    gl={{ antialias: true }}
                    dpr={[1, 2]}
                >
                    <SkyScene
                        config={config}
                        planetName={planetName}
                        onDirectionChange={setCurrentDirection}
                        onConstellationHover={setHoveredConstellation}
                        onConstellationClick={setSelectedConstellation}
                        selectedPlanet={selectedPlanet}
                    />
                </Canvas>

                {/* UI Overlays */}
                <ExitButton onExit={onExit} />
                <DirectionIndicator direction={currentDirection} />
                <ConstellationInfo
                    constellation={selectedConstellation || hoveredConstellation} // Show hovered if none selected for tooltip logic
                    isSelected={!!selectedConstellation}
                    onClose={() => setSelectedConstellation(null)}
                />
                <PlanetIndicators
                    planetName={planetName}
                    onSelectPlanet={setSelectedPlanet}
                    selectedPlanet={selectedPlanet}
                />
            </motion.div>
        </AnimatePresence>
    );
}
