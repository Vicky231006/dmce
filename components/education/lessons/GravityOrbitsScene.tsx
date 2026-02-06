'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, Trail, Line } from '@react-three/drei';

export function GravityOrbitsScene({ currentTime }: { currentTime: number }) {
    const earthRef = useRef<THREE.Mesh>(null);
    const satelliteRef = useRef<THREE.Mesh>(null);
    const secondSatelliteRef = useRef<THREE.Mesh>(null);
    const gridRef = useRef<THREE.Group>(null);

    // Create a gravity well grid
    const gridLines = useMemo(() => {
        const lines = [];
        const size = 20;
        const divisions = 20;
        const step = size / divisions;

        for (let i = -size / 2; i <= size / 2; i += step) {
            // Horizontal lines
            const pointsH = [];
            for (let j = -size / 2; j <= size / 2; j += step / 2) {
                const dist = Math.sqrt(i * i + j * j);
                const depression = Math.max(0, 5 - dist) * -1.5; // Gravity well shape
                pointsH.push(new THREE.Vector3(i, depression - 2, j));
            }
            lines.push(pointsH);

            // Vertical lines
            const pointsV = [];
            for (let j = -size / 2; j <= size / 2; j += step / 2) {
                const dist = Math.sqrt(j * j + i * i);
                const depression = Math.max(0, 5 - dist) * -1.5;
                pointsV.push(new THREE.Vector3(j, depression - 2, i));
            }
            lines.push(pointsV);
        }
        return lines;
    }, []);

    useFrame((state, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.2;
        }

        if (satelliteRef.current) {
            // Animation Phase: Launch & Orbit
            if (currentTime < 15) {
                // Pre-launch
                satelliteRef.current.position.set(0, 3.5, 0); // On top of Earth
                satelliteRef.current.visible = true;
            } else {
                // Orbiting
                const time = (currentTime - 15) * 0.5; // Speed multiplier
                // Elliptical orbit logic
                const a = 8; // Semi-major axis
                const b = 6; // Semi-minor axis
                satelliteRef.current.position.x = Math.cos(time) * a;
                satelliteRef.current.position.z = Math.sin(time) * b;
                // Tilt the orbit slightly
                satelliteRef.current.position.y = Math.sin(time) * 2;
            }
        }
    });

    return (
        <>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />

            {/* Earth */}
            <Sphere ref={earthRef} args={[3, 32, 32]}>
                <meshStandardMaterial
                    color="#1E90FF"
                    roughness={0.7}
                    emissive="#000033"
                    emissiveIntensity={0.2}
                />
            </Sphere>

            {/* Gravity Grid Visualization */}
            <group ref={gridRef}>
                {gridLines.map((points, i) => (
                    <Line
                        key={i}
                        points={points}
                        color="#44aaff"
                        transparent
                        opacity={0.3}
                        lineWidth={1}
                    />
                ))}
            </group>

            {/* Satellite with Trail */}
            <group>
                <Trail
                    width={2}
                    length={20}
                    color="#ffffff"
                    attenuation={(t) => t * t}
                >
                    <Sphere ref={satelliteRef} args={[0.3, 16, 16]}>
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
                    </Sphere>
                </Trail>
            </group>

            {/* Satellite 2 (Inner, Fast, Red) */}
            <group>
                <Trail width={1.5} length={10} color="#ff3333" attenuation={(t) => t * t}>
                    <Sphere ref={secondSatelliteRef} args={[0.2, 16, 16]} visible={false}>
                        <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.8} />
                    </Sphere>
                </Trail>
            </group>
        </>
    );
}
