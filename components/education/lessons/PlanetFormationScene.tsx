'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, Torus } from '@react-three/drei';

export function PlanetFormationScene({ currentTime }: { currentTime: number }) {
    const diskRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (diskRef.current) {
            diskRef.current.rotation.z += delta * 0.1;
        }
    });

    return (
        <>
            {/* Young Star */}
            <Sphere args={[2, 32, 32]}>
                <meshBasicMaterial color="#ffaa00" />
                <pointLight intensity={2} distance={100} />
            </Sphere>

            {/* Protoplanetary Disk */}
            <group ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
                <mesh>
                    <ringGeometry args={[3, 20, 64]} />
                    <meshBasicMaterial color="#888888" side={THREE.DoubleSide} transparent opacity={0.5} />
                </mesh>

                {/* Planetesimals (Simplified) */}
                {currentTime > 60 && (
                    <group>
                        {[...Array(10)].map((_, i) => (
                            <Sphere key={i} args={[0.2, 8, 8]} position={[5 + Math.random() * 10, Math.random(), 0]}>
                                <meshStandardMaterial color="#884400" />
                            </Sphere>
                        ))}
                    </group>
                )}
            </group>
        </>
    );
}
