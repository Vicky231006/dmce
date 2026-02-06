'use client';

import * as THREE from 'three';

export function SaturnRingsFromSurface() {
    // Viewed from surface (equator roughly), rings are a thin line overhead spanning the sky
    // Or if at latitude, a majestic arc.
    // We'll render a massive half-ring geometry to look like an arc.

    return (
        <group rotation={[0.2, 0, 0]}> {/* Tilt slightly */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 200, 0]}>
                <ringGeometry args={[300, 450, 128, 1, 0, Math.PI]} />
                <meshStandardMaterial
                    color="#fad5a5"
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                    emissive="#fad5a5"
                    emissiveIntensity={0.2}
                />
            </mesh>
            {/* Shadow on part of it? No, keep simple for now */}
        </group>
    );
}
