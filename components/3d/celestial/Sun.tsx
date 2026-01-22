'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

export function Sun() {
    const meshRef = useRef<THREE.Mesh>(null);
    const sunTexture = useTexture('/textures/planets/sun_diffuse.jpg');

    // Slow rotation
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
        }
    });

    return (
        <group>
            {/* Main Sun */}
            <mesh ref={meshRef}>
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
