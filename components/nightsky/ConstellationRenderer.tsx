'use client';

import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Constellation, raDecToXYZ } from '@/lib/constellationData';

interface ConstellationRendererProps {
    constellations: Constellation[];
    onHover: (id: string | null) => void;
    onClick: (id: string | null) => void;
}

export function ConstellationRenderer({ constellations, onHover, onClick }: ConstellationRendererProps) {
    const groupRef = useRef<THREE.Group>(null);
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const { camera, gl } = useThree();
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Set raycaster threshold for line detection
    useEffect(() => {
        raycaster.current.params.Line.threshold = 2; // Easier to hit lines
        raycaster.current.params.Points.threshold = 3;
    }, []);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const rect = gl.domElement.getBoundingClientRect();
            mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.current.setFromCamera(mouse.current, camera);

            if (groupRef.current) {
                // Intersect recursive
                const intersects = raycaster.current.intersectObjects(groupRef.current.children, true);

                let foundId: string | null = null;

                for (const hit of intersects) {
                    // Traverse up to find group with userData
                    let obj: THREE.Object3D | null = hit.object;
                    while (obj) {
                        if (obj.userData && obj.userData.constellationId) {
                            foundId = obj.userData.constellationId;
                            break;
                        }
                        obj = obj.parent;
                    }
                    if (foundId) break;
                }

                if (foundId !== hoveredId) {
                    setHoveredId(foundId);
                    onHover(foundId);
                    gl.domElement.style.cursor = foundId ? 'pointer' : 'default';
                }
            }
        };

        const handleClick = () => {
            if (hoveredId) {
                onClick(hoveredId);
            }
        };

        // Add event listeners to canvas
        // We can't easily add to window if the canvas is part of React tree, better to use R3F events
        // But since we are inside a component, adding to domElement is fine.
        // However, cleanup is important.

        gl.domElement.addEventListener('mousemove', handleMouseMove);
        gl.domElement.addEventListener('click', handleClick);

        return () => {
            gl.domElement.removeEventListener('mousemove', handleMouseMove);
            gl.domElement.removeEventListener('click', handleClick);
            gl.domElement.style.cursor = 'default';
        };
    }, [camera, gl, onHover, onClick, hoveredId]);

    return (
        <group ref={groupRef}>
            {constellations.map(constellation => (
                <SingleConstellation
                    key={constellation.id}
                    constellation={constellation}
                    isHovered={hoveredId === constellation.id}
                />
            ))}
        </group>
    );
}

function SingleConstellation({ constellation, isHovered }: { constellation: Constellation, isHovered: boolean }) {
    // Create stars
    const starPositions = constellation.stars.map(star =>
        raDecToXYZ(star.ra, star.dec, 800) // 800 units out
    );

    // Create connecting lines
    const linePoints: THREE.Vector3[] = [];

    constellation.connections.forEach(([i, j]) => {
        linePoints.push(new THREE.Vector3(...starPositions[i]));
        linePoints.push(new THREE.Vector3(...starPositions[j]));
    });

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);

    return (
        <group userData={{ constellationId: constellation.id }}>
            {/* Stars Points - Render larger dots for constellation stars */}
            {constellation.stars.map((star, idx) => {
                const [x, y, z] = starPositions[idx];
                // Brighter stars are bigger
                const size = Math.max(1.5, 3.5 - star.magnitude);

                return (
                    <mesh key={idx} position={[x, y, z]} frustumCulled={false}>
                        <sphereGeometry args={[size, 8, 8]} />
                        <meshBasicMaterial
                            color={star.color}
                            transparent opacity={isHovered ? 1 : 0.8}
                        />
                    </mesh>
                );
            })}

            <lineSegments geometry={lineGeometry} frustumCulled={false}>
                <lineBasicMaterial
                    color={isHovered ? "#00ffff" : "#00d9ff"}
                    transparent
                    opacity={isHovered ? 0.8 : 0.3}
                    linewidth={1} // WebGL limitation, will be 1px
                    depthTest={true} // Visible BEHIND opaque objects (ground)
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>

            {/* Invisible hitbox for raycasting tolerance */}
            {constellation.stars.map((star, idx) => {
                const [x, y, z] = starPositions[idx];
                return (
                    <mesh key={`hit-${idx}`} position={[x, y, z]} visible={false}>
                        <sphereGeometry args={[15, 8, 8]} />
                        <meshBasicMaterial />
                    </mesh>
                );
            })}
        </group>
    );
}
