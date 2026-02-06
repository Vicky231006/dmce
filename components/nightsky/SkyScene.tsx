'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CONSTELLATIONS } from '@/lib/constellationData';
import { StarField } from '@/components/nightsky/StarField';
import { ConstellationRenderer } from '@/components/nightsky/ConstellationRenderer';
import { VisiblePlanets } from '@/components/nightsky/VisiblePlanets';
import { SaturnRingsFromSurface } from '@/components/nightsky/SaturnRingsFromSurface';

interface SkySceneProps {
    config: any;
    planetName: string;
    onDirectionChange: (dir: string) => void;
    onConstellationHover: (id: string | null) => void;
    onConstellationClick: (id: string | null) => void;
    selectedPlanet?: string | null;
}

export function SkyScene({
    config,
    planetName,
    onDirectionChange,
    onConstellationHover,
    onConstellationClick,
    selectedPlanet
}: SkySceneProps) {
    const { camera } = useThree();
    const groundRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
        // Set initial camera to look North (Z-axis negative usually or positive depending on coord system)
        // We'll reset rotation to be looking "forward"
        camera.rotation.set(0, 0, 0);
    }, [camera]);

    // Track camera direction
    useFrame(() => {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        // Calculate cardinal direction
        // angle in xz plane
        const angle = Math.atan2(direction.x, direction.z) * (180 / Math.PI);
        let cardinal = 'North';

        // 0 is South in Three.js (looking down +Z) if initial look is (0,0,-1)
        // Actually default look is (0,0,-1) which is -Z.
        // atan2(0, -1) = 180 or -180.
        // Let's debug direction visually or assume standard:
        // +Z is South, -Z is North, +X is East, -X is West

        // Using mapping suitable for user experience:
        // angle is -180 to 180.

        if (Math.abs(angle) > 135) cardinal = 'North'; // -Z
        else if (Math.abs(angle) < 45) cardinal = 'South'; // +Z
        else if (angle < -45 && angle > -135) cardinal = 'East'; // -X (wait, West?)
        // Let's simplify: 
        // If x is positive (Right), East? 
        // If we map 0 as South (+Z).
        // Then 90 (+X) is East? No, standard Right Hand Rule
        // +X is East, -Z is North.

        if (Math.abs(angle) > 135) cardinal = 'North';
        else if (Math.abs(angle) < 45) cardinal = 'South';
        else if (angle > 45 && angle < 135) cardinal = 'East';
        else cardinal = 'West';

        onDirectionChange(cardinal);
    });

    return (
        <>
            {/* Ground Plane */}
            <mesh
                ref={groundRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]} // Center at origin, camera is at 1.7
            >
                <circleGeometry args={[1000, 64]} />
                <meshLambertMaterial
                    color={config.groundColor}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Horizon Glow (for planets with atmosphere) */}
            {config.atmosphereGlow && (
                <mesh position={[0, -50, 0]}>
                    <sphereGeometry args={[900, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshBasicMaterial
                        color={config.glowColor}
                        transparent
                        opacity={0.15}
                        side={THREE.BackSide}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* Stars */}
            <StarField config={config} />

            {/* Constellations */}
            <ConstellationRenderer
                constellations={CONSTELLATIONS}
                onHover={onConstellationHover}
                onClick={onConstellationClick}
            />

            {/* Visible Planets */}
            <VisiblePlanets planetName={planetName} selectedPlanet={selectedPlanet} />

            {/* Saturn Rings (if viewing from Saturn) */}
            {planetName.toLowerCase() === 'saturn' && <SaturnRingsFromSurface />}

            {/* Lighting */}
            <ambientLight intensity={0.3} /> {/* Increased from 0.2 to 0.3 */}
            <hemisphereLight
                args={[config.skyColor, config.groundColor, 0.3]}
            />
            {config.atmosphereGlow && (
                <pointLight position={[0, 50, -100]} color={config.glowColor} intensity={0.5} distance={300} />
            )}
            <pointLight position={[0, 10, 0]} intensity={0.3} /> {/* Stronger local illumination */}
            <directionalLight
                position={[50, 100, 50]}
                intensity={0.7}
                color="#b0c4de"
                castShadow
            /> {/* Moonlight effect */}
            {/* Sun Light (if day or visible) - but this is Night Sky view, so strictly starlight usually */}

            {/* Camera Controls - Configured for "First Person" Head Rotation */}
            {/* Target is at head position (0,2,0). Camera is slightly offset. 
                Negative rotateSpeed inverts the orbit drag to feel like "looking" instead of "rotating object". */}
            <OrbitControls
                enablePan={false}
                enableZoom={false}
                minPolarAngle={0.001} // Almost Zenith (Up)
                maxPolarAngle={Math.PI - 0.001} // Almost Nadir (Down)
                rotateSpeed={-0.5} // Inverted for FPS feel
                target={[0, 2, 0]} // Pivot point
            />
        </>
    );
}
