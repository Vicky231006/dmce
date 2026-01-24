'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, Html, Sparkles, Trail, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

export function BigBangScene({ currentTime, onPause }: { currentTime: number; onPause: () => void }) {
    const universeRef = useRef<THREE.Group>(null);
    const singularityRef = useRef<THREE.Mesh>(null);
    const [activeInfo, setActiveInfo] = useState<string | null>(null);

    // Animation States (45s Timeline - Compressed Singularity)
    const isSingularity = currentTime < 2;
    const isExplosion = currentTime >= 2 && currentTime < 6;
    const isExpansion = currentTime >= 2;
    const isQuarks = currentTime >= 6 && currentTime < 16;
    const isAtoms = currentTime >= 16;
    const isCMB = currentTime >= 26;
    const isStars = currentTime >= 33;

    const handleInteraction = (info: string) => {
        onPause();
        setActiveInfo(info);
    };

    useFrame((state, delta) => {
        if (universeRef.current && isExpansion) {
            // Logarithmic expansion
            const scale = 1 + Math.log(1 + (currentTime - 4)) * 8;
            universeRef.current.scale.setScalar(scale);
        }

        if (singularityRef.current) {
            if (isSingularity) {
                // Intense pulsing before bang
                const pulse = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.2 + (currentTime / 4) * 2;
                singularityRef.current.scale.setScalar(pulse);
                (singularityRef.current.material as THREE.MeshBasicMaterial).color.setHSL(0, 0, 1 - (currentTime / 8)); // Darken before bang
            } else {
                singularityRef.current.scale.setScalar(0);
            }
        }
    });

    return (
        <>
            {/* Info Overlay */}
            <Html fullscreen style={{ pointerEvents: 'none', zIndex: 100 }}>
                <AnimatePresence>
                    {activeInfo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/80 backdrop-blur-md"
                            onClick={() => setActiveInfo(null)}
                        >
                            <div className="bg-deep-space border border-cyan-glow p-8 rounded-2xl max-w-lg text-center shadow-[0_0_50px_rgba(0,240,255,0.4)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-cyan-glow/10 to-transparent pointer-events-none" />
                                <h3 className="text-2xl font-orbitron text-cyan-glow mb-4 relative z-10">
                                    {activeInfo === 'quark' ? 'THE PRIMORDIAL SOUP' : 'THE FIRST ATOM'}
                                </h3>
                                <p className="text-star-white/90 mb-6 text-lg leading-relaxed relative z-10">
                                    {activeInfo === 'quark'
                                        ? "A fraction of a second after the Big Bang, the universe was a seething plasma of quarks and gluons. It was too hot for protons or neutrons to form!"
                                        : "380,000 years later, the universe cooled to 3000K. Protons finally captured electrons, creating Hydrogen - the fuel for all future stars."}
                                </p>
                                <button
                                    className="px-8 py-3 bg-cyan-glow hover:bg-cyan-glow/80 text-black font-bold rounded-full font-orbitron text-sm tracking-widest transition-all hover:scale-105 active:scale-95 relative z-10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveInfo(null);
                                    }}
                                >
                                    CONTINUE JOURNEY
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Html>

            {/* Singularity */}
            <Sphere ref={singularityRef} args={[0.5, 64, 64]}>
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
                <pointLight intensity={5} distance={20} color="#ffffff" />
            </Sphere>

            {/* Main Universe Group */}
            <group ref={universeRef}>
                {isExpansion && (
                    <gridHelper args={[100, 50, 0x222222, 0x111111]} />
                )}

                {/* QUARK SOUP PHASE */}
                {isQuarks && (
                    <group>
                        {/* Background Sparkles */}
                        <Sparkles count={500} scale={20} size={4} speed={2} opacity={0.5} color="#ff00ff" />
                        <Sparkles count={500} scale={20} size={4} speed={2} opacity={0.5} color="#00ffff" />

                        {/* Interactive Quarks */}
                        {[...Array(8)].map((_, i) => (
                            <Float key={i} speed={0.5} rotationIntensity={0.5} floatIntensity={1}>
                                <group
                                    position={[
                                        (Math.random() - 0.5) * 8,
                                        (Math.random() - 0.5) * 8,
                                        (Math.random() - 0.5) * 8
                                    ]}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleInteraction('quark');
                                    }}
                                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                                    onPointerOut={() => document.body.style.cursor = 'auto'}
                                >
                                    {/* Hitbox - Increased Size */}
                                    <mesh visible={false}>
                                        <sphereGeometry args={[4, 16, 16]} />
                                        <meshBasicMaterial />
                                    </mesh>

                                    {/* Visuals */}
                                    <Trail width={2} length={4} color={new THREE.Color(i % 2 ? "#FFD700" : "#FFA500")} attenuation={(t) => t * t}>
                                        <Sphere args={[0.2, 16, 16]}>
                                            <meshBasicMaterial color={i % 2 ? "#FFD700" : "#FFA500"} toneMapped={false} />
                                            <pointLight intensity={1} distance={3} color={i % 2 ? "#FFD700" : "#FFA500"} />
                                        </Sphere>
                                    </Trail>

                                    <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
                                        <div className="text-xs font-mono text-white/70 bg-black/50 px-2 rounded border border-white/20">
                                            {i % 2 ? 'Photon' : 'Quark'}
                                        </div>
                                    </Html>
                                </group>
                            </Float>
                        ))}
                    </group>
                )}

                {/* ATOM FORMATION PHASE */}
                {isAtoms && (
                    <group>
                        {/* Hydrogen Atom Hero */}
                        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                            <group
                                position={[0, 0, 0]}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleInteraction('atom');
                                }}
                                onPointerOver={() => document.body.style.cursor = 'pointer'}
                                onPointerOut={() => document.body.style.cursor = 'auto'}
                            >
                                {/* Hitbox */}
                                <mesh visible={false}>
                                    <sphereGeometry args={[4, 16, 16]} />
                                    <meshBasicMaterial />
                                </mesh>

                                <Html position={[0, 2.5, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
                                    <div className="bg-cyan-glow/20 px-3 py-1.5 rounded-full text-xs font-bold text-cyan-glow border border-cyan-glow animate-bounce whitespace-nowrap backdrop-blur-sm">
                                        CLICK TO INSPECT HYDROGEN
                                    </div>
                                </Html>

                                {/* Proton */}
                                <Sphere args={[0.4, 32, 32]}>
                                    <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.8} />
                                    <pointLight intensity={2} distance={5} color="#ff0000" />
                                </Sphere>

                                {/* Electron Orbit */}
                                <group rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                                    <mesh>
                                        <ringGeometry args={[2, 2.05, 64]} />
                                        <meshBasicMaterial color="#4444ff" side={THREE.DoubleSide} transparent opacity={0.3} />
                                    </mesh>
                                    <Sphere args={[0.15, 16, 16]} position={[2, 0, 0]}>
                                        <meshBasicMaterial color="#00ffff" toneMapped={false} />
                                        <pointLight intensity={1} distance={2} color="#00ffff" />
                                    </Sphere>
                                </group>
                            </group>
                        </Float>

                        {/* Background Atoms */}
                        <Sparkles count={200} scale={30} size={2} speed={0.5} opacity={0.3} color="#ffffff" />
                    </group>
                )}

                {/* CMB RADIATION */}
                {isCMB && (
                    <group>
                        <mesh>
                            <sphereGeometry args={[60, 64, 64]} />
                            <meshBasicMaterial
                                color="#ff6600"
                                transparent
                                opacity={0.15}
                                side={THREE.BackSide}
                                blending={THREE.AdditiveBlending}
                            />
                        </mesh>
                        {/* Radiation Wave from Hydrogen */}
                        <RadiationWave startTime={26} currentTime={currentTime} />
                    </group>
                )}

                {/* STAR FORMATION */}
                {isStars && (
                    <group>
                        <StarFormation />
                    </group>
                )}
            </group>
        </>
    );
}

function RadiationWave({ startTime, currentTime }: { startTime: number, currentTime: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            const elapsed = currentTime - startTime;
            if (elapsed >= 0 && elapsed < 5) {
                // Expand rapidly
                const scale = 1 + elapsed * 15;
                meshRef.current.scale.setScalar(scale);

                // Fade out
                const opacity = Math.max(0, 1 - (elapsed / 4));
                (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
            } else if (elapsed >= 5) {
                meshRef.current.scale.setScalar(0);
            }
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#FFFF00" transparent opacity={1} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
    );
}

function StarFormation() {
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 200; i++) {
            const r = 10 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            temp.push({ pos: new THREE.Vector3(x, y, z), speed: 0.5 + Math.random() });
        }
        return temp;
    }, []);

    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!meshRef.current) return;

        particles.forEach((particle, i) => {
            // Move towards center
            if (particle.pos.length() > 0.5) {
                particle.pos.lerp(new THREE.Vector3(0, 0, 0), 0.02 * particle.speed);
            }
            dummy.position.copy(particle.pos);
            dummy.scale.setScalar(Math.max(0.1, 1 - particle.pos.length() / 30));
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, 200]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial color="#ffaa00" toneMapped={false} />
            </instancedMesh>
            {/* Core Glow */}
            <Sphere args={[2, 32, 32]}>
                <meshBasicMaterial color="#ffaa00" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
                <pointLight intensity={2} distance={20} color="#ffaa00" />
            </Sphere>
        </group>
    );
}
