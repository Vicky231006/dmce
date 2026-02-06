'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, Trail } from '@react-three/drei';

export function PlanetFormationScene({ currentTime }: { currentTime: number }) {
    const diskRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Points>(null);
    const planetesimalsRef = useRef<THREE.Group>(null);
    const formedPlanetsRef = useRef<THREE.Group>(null);

    // Dust particles (protoplanetary disk)
    const dustParticles = useMemo(() => {
        const count = 2000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color1 = new THREE.Color('#ffaa00');
        const color2 = new THREE.Color('#333333');

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 12; // Spread out more
            const spread = 0.5; // Thickness of disk

            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
            positions[i * 3 + 2] = Math.sin(angle) * radius;

            // Gradient color based on radius
            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }
        return { positions, colors };
    }, []);

    // Planetesimals (Rocks)
    const planetesimals = useMemo(() => {
        return [...Array(40)].map(() => ({
            radius: 4 + Math.random() * 8, // Distance from center
            angle: Math.random() * Math.PI * 2,
            speed: 0.2 + Math.random() * 0.5,
            size: 0.1 + Math.random() * 0.2,
            offsetY: (Math.random() - 0.5) * 0.5
        }));
    }, []);

    useFrame((state, delta) => {
        // Rotate Disk
        if (particlesRef.current) {
            particlesRef.current.rotation.y += delta * 0.05;
        }

        // Animate Planetesimals
        if (planetesimalsRef.current) {
            planetesimalsRef.current.children.forEach((child, i) => {
                const p = planetesimals[i];
                // Orbit
                child.position.x = Math.cos(state.clock.elapsedTime * p.speed + p.angle) * p.radius;
                child.position.z = Math.sin(state.clock.elapsedTime * p.speed + p.angle) * p.radius;
                child.rotation.x += delta;
                child.rotation.y += delta;
            });
        }

        // Animate Formed Planets
        if (formedPlanetsRef.current) {
            formedPlanetsRef.current.children.forEach((child, i) => {
                const speed = 0.3 / (i + 1); // Inner planets faster
                const radius = 5 + i * 3;

                child.position.x = Math.cos(state.clock.elapsedTime * speed) * radius;
                child.position.z = Math.sin(state.clock.elapsedTime * speed) * radius;
                child.rotation.y += delta;
            });
        }
    });

    // Phase opacity calculations
    const dustOpacity = Math.max(0, 1 - (currentTime - 22.5) / 5); // Fade out after 22.5s
    const planetsOpacity = Math.min(1, Math.max(0, (currentTime - 22.5) / 5)); // Fade in after 22.5s
    const planetesimalsScale = Math.min(1, Math.max(0, (currentTime - 7.5) / 5)); // Grow 7.5s-12.5s
    const planetesimalsOpacity = Math.max(0, 1 - (currentTime - 25) / 5); // Fade out as planets form

    return (
        <>
            {/* Young Star - Brightens over time */}
            <Sphere args={[2.5, 32, 32]}>
                <meshBasicMaterial color="#ffaa00" />
                <pointLight intensity={3} distance={100} decay={2} color="#ffcc00" />
            </Sphere>

            {/* Fill Light for visibility */}
            <hemisphereLight args={['#fff0e5', '#1a1a2e', 0.4]} />

            {/* Protoplanetary Disk (Particles) */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={dustParticles.positions.length / 3}
                        array={dustParticles.positions}
                        itemSize={3}
                        args={[dustParticles.positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={dustParticles.colors.length / 3}
                        array={dustParticles.colors}
                        itemSize={3}
                        args={[dustParticles.colors, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.15}
                    vertexColors
                    transparent
                    opacity={dustOpacity * 0.8}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Planetesimals (Rocks forming) */}
            {currentTime > 7.5 && (
                <group ref={planetesimalsRef}>
                    {planetesimals.map((p, i) => (
                        <Sphere
                            key={i}
                            args={[p.size * planetesimalsScale, 8, 8]}
                            position={[Math.cos(p.angle) * p.radius, p.offsetY, Math.sin(p.angle) * p.radius]}
                        >
                            <meshStandardMaterial
                                color="#d2b48c"
                                roughness={0.8}
                                emissive="#5a3a22"
                                emissiveIntensity={0.2}
                                transparent
                                opacity={planetesimalsOpacity}
                            />
                        </Sphere>
                    ))}
                </group>
            )}

            {/* Formed Planets (Appearing later) */}
            {currentTime > 22.5 && (
                <group ref={formedPlanetsRef}>
                    {/* Inner Rocky Planet 1 (Hot/Lava) */}
                    <Sphere args={[0.6, 32, 32]} position={[5, 0, 0]}>
                        <meshStandardMaterial
                            color="#ff4500"
                            roughness={0.7}
                            emissive="#8b0000"
                            emissiveIntensity={0.3}
                            transparent
                            opacity={planetsOpacity}
                        />
                    </Sphere>

                    {/* Inner Rocky Planet 2 (Earth-like) */}
                    <Sphere args={[0.7, 32, 32]} position={[8, 0, 0]}>
                        <meshStandardMaterial
                            color="#4facfe"
                            roughness={0.4}
                            emissive="#0055a4"
                            emissiveIntensity={0.2}
                            transparent
                            opacity={planetsOpacity}
                        />
                    </Sphere>

                    {/* Gas Giant 1 (Jupiter-like) */}
                    <Sphere args={[1.5, 32, 32]} position={[12, 0, 0]}>
                        <meshStandardMaterial
                            color="#DEB887"
                            roughness={0.4}
                            emissive="#8b4513"
                            emissiveIntensity={0.1}
                            transparent
                            opacity={planetsOpacity}
                        />
                    </Sphere>

                    {/* Gas Giant 2 (Saturn-like with Rings) */}
                    <group position={[16, 0, 0]}>
                        <Sphere args={[1.4, 32, 32]}>
                            <meshStandardMaterial
                                color="#f4d03f"
                                roughness={0.4}
                                emissive="#b8860b"
                                emissiveIntensity={0.15}
                                transparent
                                opacity={planetsOpacity}
                            />
                        </Sphere>
                        {/* Rings */}
                        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                            <ringGeometry args={[1.8, 2.5, 64]} />
                            <meshStandardMaterial
                                color="#e6ccb2"
                                side={THREE.DoubleSide}
                                transparent
                                opacity={planetsOpacity * 0.8}
                                emissive="#8b7355"
                                emissiveIntensity={0.1}
                            />
                        </mesh>
                    </group>
                </group>
            )}
        </>
    );
}
