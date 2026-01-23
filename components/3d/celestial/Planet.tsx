'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, useTexture } from '@react-three/drei';
import { useTimeStore, useSolarSystemStore } from '@/lib/store';

interface PlanetProps {
    name: string;
    distance: number;
    size: number;
    orbitPeriod: number;
    color: string;
    parentName?: string;
    hasAtmosphere?: boolean;
    hasRings?: boolean;
}

export function Planet({
    name,
    distance,
    size,
    orbitPeriod,
    color,
    parentName,
    hasAtmosphere,
    hasRings
}: PlanetProps) {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const orbitRef = useRef(Math.random() * Math.PI * 2); // Random start angle
    const [hovered, setHovered] = useState(false);
    const { timeSpeed, isPaused } = useTimeStore();
    const { registerPlanet } = useSolarSystemStore();

    useEffect(() => {
        if (groupRef.current) {
            registerPlanet(name, groupRef.current);
        }
    }, [name, registerPlanet]);

    // Calculate orbital motion
    useFrame((state, delta) => {
        if (!groupRef.current || isPaused) return;

        // Update orbital angle
        const angularVelocity = (2 * Math.PI) / (orbitPeriod * 86400); // radians per second (scaled)
        const visualSpeedFactor = 86400;

        orbitRef.current += angularVelocity * delta * timeSpeed * visualSpeedFactor;

        // Calculate position (circular orbit)
        const x = distance * Math.cos(orbitRef.current);
        const z = distance * Math.sin(orbitRef.current);

        groupRef.current.position.set(x, 0, z);

        // Rotate planet on its axis
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.5 * delta * timeSpeed;
        }
    });

    // Hover effect
    useEffect(() => {
        if (meshRef.current) {
            if (hovered) {
                meshRef.current.scale.setScalar(1.1);
            } else {
                meshRef.current.scale.setScalar(1.0);
            }
        }
    }, [hovered]);

    // Texture Loading
    const texturePath = `/textures/planets/${name.toLowerCase()}_diffuse.jpg`;

    // We need to conditionally load textures because useTexture throws if file not found
    // Since we know exactly what we have, we can map it.
    const availableTextures = [
        'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
    ];

    const hasTexture = availableTextures.includes(name.toLowerCase());

    // Only call useTexture if we know we have it. 
    // Note: Hooks must be unconditional, but we can pass a fallback or handle it.
    // However, useTexture can take an array or string. If we pass a string that 404s, it might warn/error.
    // A safer way in R3F is to just try loading it if we are sure.
    // Since we verified the file list, we can be sure.

    // For planets without textures (Pluto), we'll skip texture prop.
    // But we can't conditionally call hooks.
    // So we'll use a "safe" texture for everyone, or just load it.
    // Actually, let's just use the texture if it's in our list.

    const texture = useTexture(
        hasTexture ? texturePath : '/textures/placeholder_planet.jpg'
    );

    // Saturn Rings
    const ringTexture = useTexture(
        name.toLowerCase() === 'saturn' ? '/textures/planets/saturn_ring.png' : '/textures/placeholder_planet.jpg'
    );

    return (
        <>
            {/* Orbit Path (visual guide) - Static, stays at center */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[distance - 0.05, distance + 0.05, 128]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
            </mesh>

            {/* Moving Group */}
            <group ref={groupRef}>
                {/* Main Planet Mesh */}
                <mesh
                    ref={meshRef}
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                    userData={{ name, type: 'planet' }}
                >
                    <sphereGeometry args={[size, 64, 64]} />
                    <meshStandardMaterial
                        map={hasTexture ? texture : undefined}
                        color={hasTexture ? '#ffffff' : color}
                        roughness={hasTexture ? 0.8 : 0.7}
                        metalness={hasTexture ? 0.1 : 0.2}
                        emissive={hasTexture ? '#000000' : color} // No emissive for textured planets
                        emissiveIntensity={hasTexture ? 0 : (hovered ? 0.5 : 0.15)} // Only show emissive for non-textured
                    />
                </mesh>

                {/* Atmosphere - Reduced opacity and size to be less intrusive */}
                {hasAtmosphere && (
                    <mesh>
                        <sphereGeometry args={[size * 1.1, 64, 64]} />
                        <meshBasicMaterial
                            color="#4A90E2"
                            transparent
                            opacity={0.05} // Very subtle
                            side={THREE.BackSide}
                        />
                    </mesh>
                )}

                {/* Rings */}
                {hasRings && (
                    <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                        <ringGeometry args={[size * 1.4, size * 2.5, 64]} />
                        <meshStandardMaterial
                            map={name.toLowerCase() === 'saturn' ? ringTexture : undefined}
                            color={name.toLowerCase() === 'saturn' ? '#ffffff' : "#FAD5A5"}
                            transparent
                            opacity={0.8}
                            side={THREE.DoubleSide}
                            emissive={name.toLowerCase() === 'saturn' ? "#ffffff" : "#FAD5A5"}
                            emissiveIntensity={0.1}
                        />
                    </mesh>
                )}

                {/* Label - Bracket Style */}
                <Html position={[0, size + 2, 0]} center style={{ pointerEvents: 'none' }}>
                    <div
                        className={`transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="flex flex-col items-center">
                            <div className="text-[10px] text-cyan-glow font-orbitron tracking-[0.2em] mb-1 uppercase">
                                {name}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-6 border-l border-t border-b border-cyan-glow/80" />
                                <div className="w-16 h-[1px] bg-cyan-glow/20" />
                                <div className="w-2 h-6 border-r border-t border-b border-cyan-glow/80" />
                            </div>
                        </div>
                    </div>
                </Html>
            </group>
        </>
    );
}
