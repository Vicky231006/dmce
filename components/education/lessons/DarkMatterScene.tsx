'use client';

import { useRef, useMemo } from 'react';
import { useFrame, RootState } from '@react-three/fiber';
import * as THREE from 'three';
import { Line, Stars } from '@react-three/drei';

export function DarkMatterScene({ currentTime }: { currentTime: number }) {
    const starsRef = useRef<THREE.Group>(null);
    const gridRef = useRef<THREE.Group>(null);

    // Initial visible matter (Galaxies/Stars)
    // We reuse the 'universe-expand' concept from big bang but purely visual here
    const expansionScale = useMemo(() => {
        // Animation: 0-15s expansion
        if (currentTime < 15) {
            return 1 + (currentTime / 15) * 4; // Expand 1x to 5x
        }
        return 5;
    }, [currentTime]);

    // Dark Matter Web / Grid
    // Similar to Gravity Grid but larger scale and "wobbly"
    const gridLines = useMemo(() => {
        const lines = [];
        const size = 100;
        const divisions = 20;
        const step = size / divisions;

        for (let i = -size / 2; i <= size / 2; i += step) {
            // Horizontal lines
            const pointsH = [];
            for (let j = -size / 2; j <= size / 2; j += step / 2) {
                // Initial flatness, will warp in useFrame
                pointsH.push(new THREE.Vector3(i, 0, j));
            }
            lines.push(pointsH);

            // Vertical lines
            const pointsV = [];
            for (let j = -size / 2; j <= size / 2; j += step / 2) {
                pointsV.push(new THREE.Vector3(j, 0, i));
            }
            lines.push(pointsV);
        }
        return lines;
    }, []);

    useFrame((state: RootState, delta: number) => {
        // Slowly rotate the universe
        if (starsRef.current) {
            starsRef.current.rotation.y += delta * 0.02;

            // Apply scale
            starsRef.current.scale.setScalar(expansionScale);
        }

        // Animate the Dark Matter Grid (Warping effect)
        // Only visible after 30s usually, but we keep it updating or fade it in
        if (gridRef.current && currentTime > 20) {
            const time = state.clock.elapsedTime;

            gridRef.current.children.forEach((line: THREE.Object3D, i: number) => {
                // Type assertion for Line with geometry
                // Note: drei Line doesn't expose underlying geometry points easily for direct mutation in standard way without ref access to geometry.
                // However, we can just rotate/undulate the whole group for a "breathing" effect
            });

            // Global undulation for the "Dark Matter" presence
            gridRef.current.position.y = Math.sin(time * 0.5) * 2;
            gridRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
        }
    });

    // Opacity for Dark Matter Grid (Fade in 30s)
    const gridOpacity = Math.max(0, Math.min(0.3, (currentTime - 30) * 0.1));

    return (
        <>
            {/* Background ambiance */}
            <ambientLight intensity={0.1} />
            <pointLight position={[0, 0, 0]} intensity={1} distance={50} decay={2} />

            {/* Visible Universe (Stars/Galaxies) */}
            <group ref={starsRef}>
                <Stars radius={50} depth={20} count={3000} factor={4} saturation={0} fade speed={1} />

                {/* Central Galaxy Cluster */}
                <points>
                    <sphereGeometry args={[5, 32, 32]} />
                    <pointsMaterial color="#aaddee" size={0.2} transparent opacity={0.8} />
                </points>
            </group>

            {/* Dark Matter Visualization (The Invisible Web) */}
            {currentTime > 25 && (
                <group ref={gridRef}>
                    {gridLines.map((points, i) => (
                        <Line
                            key={i}
                            points={points}
                            color="#9370DB" // Medium Purple
                            transparent
                            opacity={gridOpacity}
                            lineWidth={1}
                            dashed
                            dashScale={2}
                            dashSize={1}
                            gapSize={1}
                        />
                    ))}
                    {/* Label/Hint */}
                    {currentTime > 30 && currentTime < 40 && (
                        <mesh position={[0, 5, 0]}>
                            {/* Placeholder for 3D Text or similar if available, or rely on narration */}
                        </mesh>
                    )}
                </group>
            )}
        </>
    );
}
