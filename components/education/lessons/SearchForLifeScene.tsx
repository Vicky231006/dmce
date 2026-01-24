'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere } from '@react-three/drei';

export function SearchForLifeScene({ currentTime }: { currentTime: number }) {
    const starRef = useRef<THREE.Mesh>(null);

    return (
        <>
            {/* Star */}
            <Sphere ref={starRef} args={[2, 32, 32]}>
                <meshBasicMaterial color="#ffaa00" />
                <pointLight intensity={1.5} distance={100} />
            </Sphere>

            {/* Habitable Zone */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[8, 12, 64]} />
                <meshBasicMaterial color="#00ff00" transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>

            {/* Planets */}
            <group>
                {/* Too Hot */}
                <Sphere args={[0.5, 32, 32]} position={[5, 0, 0]}>
                    <meshStandardMaterial color="#ff4400" />
                </Sphere>

                {/* Just Right (Earth-like) */}
                <Sphere args={[0.6, 32, 32]} position={[10, 0, 0]}>
                    <meshStandardMaterial color="#4444ff" />
                </Sphere>

                {/* Too Cold */}
                <Sphere args={[0.4, 32, 32]} position={[15, 0, 0]}>
                    <meshStandardMaterial color="#88aaff" />
                </Sphere>
            </group>

            <ambientLight intensity={0.2} />
        </>
    );
}
