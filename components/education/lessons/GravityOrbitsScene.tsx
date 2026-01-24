'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, Line } from '@react-three/drei';

export function GravityOrbitsScene({ currentTime }: { currentTime: number }) {
    const earthRef = useRef<THREE.Mesh>(null);
    const satelliteRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.1;
        }

        if (satelliteRef.current && currentTime > 60) {
            const t = state.clock.elapsedTime;
            satelliteRef.current.position.x = Math.cos(t) * 8;
            satelliteRef.current.position.z = Math.sin(t) * 8;
        }
    });

    return (
        <>
            {/* Earth */}
            <Sphere ref={earthRef} args={[3, 32, 32]}>
                <meshStandardMaterial color="#4444ff" roughness={0.5} />
            </Sphere>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            {/* Satellite/Moon */}
            <Sphere ref={satelliteRef} args={[0.5, 16, 16]} position={[8, 0, 0]}>
                <meshStandardMaterial color="#aaaaaa" />
            </Sphere>

            {/* Orbit Path */}
            {currentTime > 60 && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[7.9, 8.1, 64]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
                </mesh>
            )}
        </>
    );
}
