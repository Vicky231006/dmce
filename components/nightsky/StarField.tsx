'use client';

import { useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';

export function StarField({ config }: { config: any }) {
    const starsRef = useRef<THREE.Points>(null);

    // Force safe culling settings on the instance directly
    useLayoutEffect(() => {
        if (starsRef.current) {
            starsRef.current.frustumCulled = false;
            // Ensure the geometry knows it's infinite to prevent any camera angle culling
            if (starsRef.current.geometry) {
                starsRef.current.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);
            }
        }
    });

    // Memoize geometry generation
    const geometry = useMemo(() => {
        const starCount = config.starsVisible || true ? 6000 : 3000;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        const colorOptions = [
            new THREE.Color('#ffffff'), // White
            new THREE.Color('#ffe4b5'), // Moccasin (G/K stars)
            new THREE.Color('#b0e0e6'), // PowderBlue (O/B stars)
            new THREE.Color('#ffdab9'), // PeachPuff
        ];

        for (let i = 0; i < starCount; i++) {
            // Random position on celestial sphere
            const radius = 900;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            // We want full sphere of stars
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.cos(phi);
            positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

            // Colors
            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Size based on magnitude/randomness
            sizes[i] = Math.random() * 2 + 0.5;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Fix culling issues by setting infinite bounding sphere
        geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);

        return geo;
    }, [config.starsVisible]);

    return (
        <points ref={starsRef} geometry={geometry} frustumCulled={false}>
            <pointsMaterial
                size={2.5}
                sizeAttenuation={true}
                vertexColors={true}
                transparent={true}
                opacity={1.0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
