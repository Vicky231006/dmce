'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useSolarSystemStore, useSidebarStore } from '@/lib/store';

export function Sun() {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const sunTexture = useTexture('/textures/planets/sun_diffuse.jpg');
    const { registerPlanet } = useSolarSystemStore();
    const { setSelectedPlanet } = useSidebarStore();
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (groupRef.current) {
            registerPlanet('Sun', groupRef.current);
        }
    }, [registerPlanet]);

    // Slow rotation
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
        }
    });

    // Hover effect
    useEffect(() => {
        if (meshRef.current) {
            document.body.style.cursor = hovered ? 'pointer' : 'auto';
        }
    }, [hovered]);

    return (
        <group ref={groupRef}>
            {/* Main Sun */}
            <mesh
                ref={meshRef}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlanet('Sun');
                }}
                userData={{ name: 'Sun', type: 'star' }}
            >
                <sphereGeometry args={[8, 64, 64]} />
                <meshBasicMaterial
                    map={sunTexture}
                    color="#ffffff" // White to let texture show true colors
                />
            </mesh>

            {/* Point Light */}
            <pointLight position={[0, 0, 0]} intensity={2.0} distance={1000} color="#ffffff" />

        </group>
    );
}
