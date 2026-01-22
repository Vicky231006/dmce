'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface AsteroidBeltProps {
    innerRadius: number;
    outerRadius: number;
    count: number;
}

export function AsteroidBelt({ innerRadius, outerRadius, count }: AsteroidBeltProps) {
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            const verticalOffset = (Math.random() - 0.5) * 2;

            positions[i * 3] = radius * Math.cos(angle);
            positions[i * 3 + 1] = verticalOffset;
            positions[i * 3 + 2] = radius * Math.sin(angle);
        }

        return positions;
    }, [count, innerRadius, outerRadius]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color="#888888"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}
