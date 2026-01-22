'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useSidebarStore, useSolarSystemStore } from '@/lib/store';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

export function CameraController() {
    const { camera, controls } = useThree();
    const { selectedPlanet, isVisiting } = useSidebarStore();
    const getPlanetByName = useSolarSystemStore(state => state.getPlanetByName);

    // Refs for animation
    const targetPosition = useRef(new THREE.Vector3());
    const targetLookAt = useRef(new THREE.Vector3());
    const isAnimating = useRef(false);

    useEffect(() => {
        if (selectedPlanet && isVisiting) {
            const planetObj = getPlanetByName(selectedPlanet);
            if (planetObj) {
                isAnimating.current = true;
            }
        } else if (!selectedPlanet) {
            // Reset to overview when deselected
            isAnimating.current = true;
        }
    }, [selectedPlanet, isVisiting, getPlanetByName]);

    useFrame((state, delta) => {
        const orbitControls = controls as unknown as { target: THREE.Vector3, update: () => void };
        if (!orbitControls) return;

        if (selectedPlanet) {
            const planetObj = getPlanetByName(selectedPlanet);
            if (!planetObj) return;

            // Get current planet position (world space)
            const planetPos = new THREE.Vector3();
            planetObj.getWorldPosition(planetPos);

            // Smoothly interpolate controls target to planet position
            // We use a smaller lerp factor for the target to make it feel "heavy" but responsive
            orbitControls.target.lerp(planetPos, 0.1);

            // If we want to "Fly To", we can also lerp the camera position
            if (isAnimating.current) {
                // Calculate dynamic offset based on planet size
                const box = new THREE.Box3().setFromObject(planetObj);
                const size = new THREE.Vector3();
                box.getSize(size);
                const maxDim = Math.max(size.x, size.y, size.z);

                // Calculate distance needed to fit planet in view
                // fov is vertical field of view in degrees
                const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 60;
                const distance = (maxDim / 2) / Math.tan(THREE.MathUtils.degToRad(fov / 2));

                // Add a small multiplier to not be *too* close (e.g. 1.5x radius)
                // We also want to be slightly above/angled
                const distFactor = 1.2; // Closer zoom to fill the screen
                const offset = new THREE.Vector3(distance * distFactor, distance * (distFactor * 0.2), distance * distFactor); // Lower angle

                const desiredCamPos = planetPos.clone().add(offset);

                // Lerp camera position
                camera.position.lerp(desiredCamPos, 0.05);

                // Stop "flying" when close enough, but keep tracking target
                if (camera.position.distanceTo(desiredCamPos) < 0.5) {
                    isAnimating.current = false;
                }
            }
            // Note: We DO NOT update camera position after isAnimating becomes false
            // This allows the user to rotate/pan freely around the moving target
        } else {
            // Reset view logic
            if (isAnimating.current) {
                const defaultTarget = new THREE.Vector3(0, 0, 0);
                const defaultPos = new THREE.Vector3(0, 50, 100);

                // Lerp target back to 0,0,0
                orbitControls.target.lerp(defaultTarget, 0.05);

                // Lerp camera back to overview
                camera.position.lerp(defaultPos, 0.05);

                // Stop animating when close enough
                if (camera.position.distanceTo(defaultPos) < 1 && orbitControls.target.distanceTo(defaultTarget) < 0.1) {
                    isAnimating.current = false;
                }
            }
        }
    });

    return null;
}
