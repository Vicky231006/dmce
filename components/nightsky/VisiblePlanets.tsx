'use client';

import { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getVisiblePlanets, VisiblePlanet } from '@/lib/planetPositions';

export function VisiblePlanets({ planetName, selectedPlanet }: { planetName: string; selectedPlanet?: string | null }) {
    const [planets, setPlanets] = useState<VisiblePlanet[]>([]);

    useEffect(() => {
        const visible = getVisiblePlanets(planetName);
        setPlanets(visible);
    }, [planetName]);

    const getPlanetColor = (name: string): string => {
        const colors: Record<string, string> = {
            mercury: '#a5a5a5',
            venus: '#e3bb76',
            earth: '#4a90e2',
            mars: '#e27b58',
            jupiter: '#c88b3a',
            saturn: '#f4d03f',
            uranus: '#4fd0e7',
            neptune: '#4166f5',
            pluto: '#d3d3d3',
        };
        return colors[name.toLowerCase()] || '#ffffff';
    };

    return (
        <group>
            {planets.map(planet => {
                // Convert azimuth/altitude to 3D position
                // Azimuth 0 is North (-Z), 90 East (+X)
                // Altitude 0 is horizon, 90 is Zenith (+Y)

                // Convert to standard spherical:
                // theta (azimuth from +Z? No, from -Z)

                // Let's use our previous logic or fresh math:
                // Azimuth 0 -> -Z
                // Azimuth 90 -> +X
                // Altitude -> Rotation up from XZ plane

                const r = 700; // Distance

                // Convert degrees to radians
                const azRad = THREE.MathUtils.degToRad(planet.azimuth);
                const altRad = THREE.MathUtils.degToRad(planet.altitude);

                // Math for Y-up system where Azimuth 0 is -Z
                // x = r * cos(alt) * sin(az)
                // y = r * sin(alt)
                // z = -r * cos(alt) * cos(az)

                const x = r * Math.cos(altRad) * Math.sin(azRad);
                const y = r * Math.sin(altRad);
                const z = -r * Math.cos(altRad) * Math.cos(azRad);

                return (
                    <group key={planet.name} position={[x, y, z]}>
                        {/* Planet Sphere */}
                        <mesh>
                            <sphereGeometry args={[12, 16, 16]} />
                            <meshBasicMaterial color={getPlanetColor(planet.name)} />
                        </mesh>

                        {/* Label when selected */}
                        {selectedPlanet?.toLowerCase() === planet.name.toLowerCase() && (
                            <Html position={[0, 20, 0]} center distanceFactor={100} zIndexRange={[100, 0]}>
                                <div className="text-cyan-400 font-mono text-lg font-bold tracking-widest uppercase" style={{ textShadow: '0 0 10px cyan' }}>
                                    {planet.name}
                                </div>
                            </Html>
                        )}

                        {/* Glow/Halo */}
                        <mesh>
                            <sphereGeometry args={[16, 16, 16]} />
                            <meshBasicMaterial
                                color={getPlanetColor(planet.name)}
                                transparent
                                opacity={0.3}
                                blending={THREE.AdditiveBlending}
                            />
                        </mesh>

                        {/* Label removed, shown only on selection */}
                    </group>
                );
            })}
        </group>
    );
}
