'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, Float, Html, Sparkles } from '@react-three/drei';

export function StarLifeCycleScene({ currentTime }: { currentTime: number }) {
    const starRef = useRef<THREE.Mesh>(null);
    const supernovaRef = useRef<THREE.Group>(null);

    // Animation States (80s Timeline)
    const isNebula = currentTime < 30;
    const isCollapse = currentTime >= 15 && currentTime < 30;
    const isMainSequence = currentTime >= 30 && currentTime < 45;
    const isRedGiant = currentTime >= 45 && currentTime < 60;
    const isSupernova = currentTime >= 60 && currentTime < 70;
    const isRemnant = currentTime >= 70;

    return (
        <>
            {/* NEBULA & COLLAPSE PHASE */}
            {isNebula && (
                <NebulaParticles currentTime={currentTime} isCollapse={isCollapse} />
            )}

            {/* STAR EVOLUTION */}
            {(isMainSequence || isRedGiant || isRemnant) && (
                <group>
                    <Sphere ref={starRef} args={[1, 64, 64]}>
                        <meshStandardMaterial toneMapped={false} />
                        <pointLight intensity={2} distance={50} color="#ffffff" />
                    </Sphere>
                    <StarUpdater
                        starRef={starRef}
                        currentTime={currentTime}
                        isMainSequence={isMainSequence}
                        isRedGiant={isRedGiant}
                        isRemnant={isRemnant}
                    />
                </group>
            )}

            {/* SUPERNOVA */}
            {isSupernova && (
                <group ref={supernovaRef}>
                    <mesh>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
                    </mesh>
                    <SupernovaParticles currentTime={currentTime} />
                    <pointLight intensity={10} distance={100} color="#ffffff" />
                </group>
            )}

            {/* LABELS */}
            <Html position={[0, -15, 0]} center style={{ pointerEvents: 'none', width: '300px' }}>
                <div className="text-center flex flex-col items-center justify-center">
                    <h3 className="text-3xl font-orbitron text-cyan-glow animate-pulse drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
                        {isNebula && !isCollapse && "STELLAR NURSERY"}
                        {isCollapse && "GRAVITATIONAL COLLAPSE"}
                        {isMainSequence && "MAIN SEQUENCE STAR"}
                        {isRedGiant && "RED GIANT PHASE"}
                        {isSupernova && "SUPERNOVA!"}
                        {isRemnant && "NEUTRON STAR REMNANT"}
                    </h3>
                    <p className="text-star-white/80 mt-2 font-mono text-sm bg-black/50 px-4 py-1 rounded">
                        {isNebula && !isCollapse && "Gas and dust float in space..."}
                        {isCollapse && "Gravity pulls everything to the center..."}
                        {isMainSequence && "Fusion ignites! A stable star is born."}
                        {isRedGiant && "The star runs out of fuel and expands."}
                        {isSupernova && "Core collapse triggers a massive explosion!"}
                        {isRemnant && "Only the dense core remains."}
                    </p>
                </div>
            </Html>
        </>
    );
}

function NebulaParticles({ currentTime, isCollapse }: { currentTime: number, isCollapse: boolean }) {
    const pointsRef = useRef<THREE.Points>(null);

    // Create particles
    const particles = useMemo(() => {
        const count = 3000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const originalPos = new Float32Array(count * 3);

        const color1 = new THREE.Color("#ff00ff");
        const color2 = new THREE.Color("#00ffff");

        for (let i = 0; i < count; i++) {
            const r = 20 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            originalPos[i * 3] = x;
            originalPos[i * 3 + 1] = y;
            originalPos[i * 3 + 2] = z;

            const color = Math.random() > 0.5 ? color1 : color2;
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 0.5;
        }

        return { positions, colors, sizes, originalPos };
    }, []);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        // Rotate the whole nebula
        pointsRef.current.rotation.y += delta * 0.05;

        // Handle Collapse
        if (isCollapse) {
            const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
            const progress = (currentTime - 15) / 15; // 0 to 1

            // Lerp towards center
            for (let i = 0; i < 3000; i++) {
                const ox = particles.originalPos[i * 3];
                const oy = particles.originalPos[i * 3 + 1];
                const oz = particles.originalPos[i * 3 + 2];

                // Move towards 0,0,0 based on progress
                // We want them to end up very close to center at progress = 1
                const factor = 1 - Math.pow(progress, 2); // Ease in

                positions[i * 3] = ox * factor;
                positions[i * 3 + 1] = oy * factor;
                positions[i * 3 + 2] = oz * factor;
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[particles.colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[particles.sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.8}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function StarUpdater({ starRef, currentTime, isMainSequence, isRedGiant, isRemnant }: any) {
    useFrame(() => {
        if (!starRef.current) return;

        if (isMainSequence) {
            // Stable Yellow Star
            starRef.current.scale.setScalar(2);
            (starRef.current.material as THREE.MeshStandardMaterial).color.setHex(0xffcc00);
            (starRef.current.material as THREE.MeshStandardMaterial).emissive.setHex(0xffaa00);
            (starRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2;
        } else if (isRedGiant) {
            // Expand to Red Giant
            const progress = (currentTime - 45) / 15;
            const scale = 2 + progress * 8; // Grow from 2 to 10
            starRef.current.scale.setScalar(scale);

            // Shift color to Red
            const color = new THREE.Color(0xffcc00).lerp(new THREE.Color(0xff0000), progress);
            (starRef.current.material as THREE.MeshStandardMaterial).color.copy(color);
            (starRef.current.material as THREE.MeshStandardMaterial).emissive.setHex(0x550000);
        } else if (isRemnant) {
            // White Dwarf / Neutron Star
            starRef.current.scale.setScalar(0.5);
            (starRef.current.material as THREE.MeshStandardMaterial).color.setHex(0x00ffff);
            (starRef.current.material as THREE.MeshStandardMaterial).emissive.setHex(0x00ffff);
            (starRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 5;
        }
    });
    return null;
}

function SupernovaParticles({ currentTime }: { currentTime: number }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            const progress = (currentTime - 60) / 10;
            const scale = 1 + progress * 30;
            groupRef.current.scale.setScalar(scale);
            groupRef.current.rotation.z += delta * 5;
        }
    });

    return (
        <group ref={groupRef}>
            <Sparkles count={1000} scale={2} size={20} speed={5} color="#ffaa00" />
            <mesh>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
            </mesh>
        </group>
    );
}
