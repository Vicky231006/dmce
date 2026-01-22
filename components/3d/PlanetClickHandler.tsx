'use client';

import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PlanetClickHandlerProps {
    onPlanetClick: (planetName: string) => void;
}

export function PlanetClickHandler({ onPlanetClick }: PlanetClickHandlerProps) {
    const { camera, gl, scene } = useThree();
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            // Calculate mouse position in normalized device coordinates
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Update raycaster
            raycaster.current.setFromCamera(mouse.current, camera);

            // Get all objects in scene
            const intersects = raycaster.current.intersectObjects(scene.children, true);

            // Find first planet intersection
            for (const intersect of intersects) {
                // Traverse up to find the group/mesh with userData
                let obj = intersect.object;
                while (obj) {
                    if (obj.userData && obj.userData.type === 'planet') {
                        onPlanetClick(obj.userData.name);
                        return;
                    }
                    if (obj.parent) {
                        obj = obj.parent;
                    } else {
                        break;
                    }
                }
            }
        }

        gl.domElement.addEventListener('click', handleClick);
        return () => gl.domElement.removeEventListener('click', handleClick);
    }, [camera, gl, scene, onPlanetClick]);

    return null;
}
