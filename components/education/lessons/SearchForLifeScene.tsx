'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, Html } from '@react-three/drei';

export function SearchForLifeScene({ currentTime }: { currentTime: number }) {
    const starRef = useRef<THREE.Mesh>(null);
    const starLightRef = useRef<THREE.PointLight>(null);
    const planetsRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        // Pulse Habitable Zone
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;

        // Orbit Planets
        if (planetsRef.current) {
            planetsRef.current.children.forEach((planet, i) => {
                // Different speeds
                const speed = 0.5 / (i + 1);
                const radius = 5 + i * 5; // 5, 10, 15

                // Transit Animation Logic (approximate for demo)
                // At 30s+, we want to show dipping light. Use a specific alignment or just let them orbit.
                // For "Transit Method" visual, we can just dim the star when any planet crosses Z-axis approx?
                // Let's keep it simple: Standard orbits, but manipulate star brightness based on angle.

                const angle = state.clock.elapsedTime * speed;
                planet.position.x = Math.cos(angle) * radius;
                planet.position.z = Math.sin(angle) * radius;

                // Dim Star if planet is "in front" ( Transit)
                // Assuming Camera is at +Z or similar, transit happens when z > 0 and x ~ 0? 
                // Actually camera moves. Let's simplfy:
                // If currentTime > 15 (Transit Lesson segment), artificially dim star if planet 1 (Earth-like) is passing
                if (currentTime > 15 && currentTime < 22.5 && i === 1) {
                    // Check alignment (simplified)
                    const transit = Math.abs(Math.sin(angle)) > 0.9 && Math.cos(angle) > 0; // Front pass
                    if (transit && starLightRef.current) {
                        starLightRef.current.intensity = THREE.MathUtils.lerp(starLightRef.current.intensity, 0.8, delta * 5);
                    } else if (starLightRef.current) {
                        starLightRef.current.intensity = THREE.MathUtils.lerp(starLightRef.current.intensity, 1.5, delta * 2);
                    }
                }
            });
        }
    });

    return (
        <>
            {/* Star */}
            <Sphere ref={starRef} args={[2, 32, 32]}>
                <meshBasicMaterial color="#ffaa00" />
                <pointLight ref={starLightRef} intensity={1.5} distance={100} decay={2} />
            </Sphere>

            {/* Habitable Zone Visualization */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[9, 11, 64]} />
                <meshBasicMaterial
                    color="#00ff00"
                    transparent
                    opacity={0.3 + (Math.sin(currentTime) * 0.1)}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Label for Habitable Zone (only at start) */}
            {currentTime < 7.5 && (
                <Html position={[10, 0, 0]} center>
                    <div className="text-green-400 font-bold text-xs bg-black/50 px-2 py-1 rounded border border-green-500/50">
                        Goldilocks Zone
                    </div>
                </Html>
            )}

            {/* Planets */}
            <group ref={planetsRef}>
                {/* Too Hot (Mercury-like) */}
                <Sphere args={[0.5, 32, 32]} position={[5, 0, 0]}>
                    <meshStandardMaterial
                        color="#ff4400"
                        emissive="#8B0000"
                        emissiveIntensity={0.4}
                        roughness={0.8}
                    />
                </Sphere>

                {/* Just Right (Earth-like) */}
                <Sphere args={[0.6, 32, 32]} position={[10, 0, 0]}>
                    <meshStandardMaterial
                        color="#4444ff"
                        emissive="#00008B"
                        emissiveIntensity={0.3}
                        roughness={0.5}
                        metalness={0.1}
                    />
                    {currentTime > 22.5 && (
                        <Html position={[0, 1.5, 0]} center>
                            <div className="text-cyan-300 font-bold text-xs animate-bounce">
                                Biosignatures Detected!
                            </div>
                        </Html>
                    )}
                </Sphere>

                {/* Too Cold (Ice planet) */}
                <Sphere args={[0.4, 32, 32]} position={[15, 0, 0]}>
                    <meshStandardMaterial
                        color="#88aaff"
                        emissive="#4682B4"
                        emissiveIntensity={0.3}
                        roughness={0.2}
                    />
                </Sphere>
            </group>

            <ambientLight intensity={0.1} />
        </>
    );
}
