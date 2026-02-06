'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useSolarSystemStore, useAppStore } from '@/lib/store';
import { zoomInToPlanet, zoomOutFromPlanet } from '@/lib/nightSkyTransitions';
import * as THREE from 'three';

export function NightSkyTransitionHandler() {
    const { camera, controls } = useThree();
    const getPlanetByName = useSolarSystemStore(state => state.getPlanetByName);

    const setNightSkyMode = useAppStore(state => state.setNightSkyMode);

    // Store original position to return to
    const originalPosRef = useRef(new THREE.Vector3(0, 50, 100));
    const originalRotRef = useRef(new THREE.Euler());

    useEffect(() => {
        const handleEnter = (e: Event) => {
            const customEvent = e as CustomEvent;
            const { planetName, onComplete } = customEvent.detail;

            const planetObj = getPlanetByName(planetName);
            if (!planetObj) {
                console.error(`Planet ${planetName} not found in store`);
                return;
            }

            console.log(`Starting transition to ${planetName}`);

            // Save current position
            originalPosRef.current.copy(camera.position);
            originalRotRef.current.copy(camera.rotation);

            // Execute Transition
            zoomInToPlanet(
                camera,
                controls,
                planetObj,
                () => {
                    setNightSkyMode(true); // Hide Solar System
                    onComplete();
                }
            );
        };

        const handleExit = () => {
            console.log('Starting exit transition');
            setNightSkyMode(false); // Show Solar System immediately for zoom out

            zoomOutFromPlanet(
                camera,
                controls,
                originalPosRef.current,
                originalRotRef.current,
                () => {
                    console.log('Exit transition complete');
                }
            );
        };

        window.addEventListener('enterNightSky', handleEnter);
        window.addEventListener('exitNightSky', handleExit);

        return () => {
            window.removeEventListener('enterNightSky', handleEnter);
            window.removeEventListener('exitNightSky', handleExit);
        };
    }, [camera, controls, getPlanetByName, setNightSkyMode]);

    return null;
}
