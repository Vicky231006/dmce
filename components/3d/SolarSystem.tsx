'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { Stars, OrbitControls } from '@react-three/drei';
import { Sun } from './celestial/Sun';
import { Planet } from './celestial/Planet';
import { AsteroidBelt } from './celestial/AsteroidBelt';
import { PlanetClickHandler } from './PlanetClickHandler';
import { CameraController } from './CameraController';
import { useSidebarStore, useAppStore } from '@/lib/store';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { NightSkyTransitionHandler } from '../nightsky/NightSkyTransitionHandler';

interface SolarSystemProps {
    loadState: string;
}

export function SolarSystem({ loadState }: SolarSystemProps) {
    const setSelectedPlanet = useSidebarStore(state => state.setSelectedPlanet);
    const [isWebGLSupported, setIsWebGLSupported] = useState(true);

    useEffect(() => {
        // Check WebGL support
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                setIsWebGLSupported(false);
            }
        } catch (e) {
            setIsWebGLSupported(false);
        }
    }, []);

    if (!isWebGLSupported) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-deep-space">
                <div className="text-center max-w-md p-8 bg-white/5 rounded-lg border border-warning-orange/30">
                    <h2 className="text-2xl font-orbitron text-warning-orange mb-4">
                        WebGL Not Supported
                    </h2>
                    <p className="text-star-white">
                        Your browser doesn't support WebGL, which is required for the 3D solar system.
                        Please use a modern browser like Chrome, Firefox, or Edge.
                    </p>
                </div>
            </div>
        );
    }

    const isNightSkyMode = useAppStore(state => state.isNightSkyMode);

    return (
        <Canvas
            camera={{ position: [0, 50, 100], fov: 60, near: 0.1, far: 2000 }}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isNightSkyMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]} // Device pixel ratio (performance)
        >
            <Suspense fallback={null}>
                {/* Lighting */}
                <ambientLight intensity={1.5} color="#ffffff" /> {/* Increased for better texture visibility */}
                <pointLight position={[0, 20, 0]} intensity={0.5} color="#4444ff" /> {/* Top fill light */}
                <pointLight position={[0, -20, 0]} intensity={0.2} color="#4444ff" /> {/* Bottom fill light */}

                {/* Starfield */}
                <Stars
                    radius={300}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={0.5}
                />

                {/* Sun (at center) */}
                <Sun />

                {/* Planets */}
                <Planet name="Mercury" distance={12} size={0.38} orbitPeriod={88} color="#8C7853" />
                <Planet name="Venus" distance={16} size={0.95} orbitPeriod={225} color="#FFC649" />
                <Planet name="Earth" distance={22} size={1.0} orbitPeriod={365} color="#4A90E2" hasAtmosphere />
                {/* Moon would need relative positioning logic, skipping for now to keep simple */}
                <Planet name="Mars" distance={28} size={0.53} orbitPeriod={687} color="#E27B58" />

                {/* Asteroid Belt */}
                <AsteroidBelt innerRadius={32} outerRadius={36} count={2000} />

                <Planet name="Jupiter" distance={48} size={3.5} orbitPeriod={4333} color="#C88B3A" />
                <Planet name="Saturn" distance={64} size={2.9} orbitPeriod={10759} color="#FAD5A5" hasRings />
                <Planet name="Uranus" distance={80} size={2.0} orbitPeriod={30687} color="#4FD0E0" />
                <Planet name="Neptune" distance={96} size={1.9} orbitPeriod={60190} color="#4166F5" />
                <Planet name="Pluto" distance={110} size={0.18} orbitPeriod={90560} color="#A08060" />

                {/* Camera Controls */}
                <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={5} // Allow getting closer
                    maxDistance={500}
                    maxPolarAngle={Math.PI}
                    enablePan
                    panSpeed={0.5}
                    rotateSpeed={0.5}
                    zoomSpeed={0.8}
                />

                <CameraController />

                {/* Click Handler */}
                <PlanetClickHandler onPlanetClick={setSelectedPlanet} />

                {/* Night Sky Transition Handler */}
                <NightSkyTransitionHandler />

                {/* Post-processing (Bloom for sun glow) */}
                <EffectComposer>
                    <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} intensity={1.5} />
                </EffectComposer>
            </Suspense>
        </Canvas>
    );
}
