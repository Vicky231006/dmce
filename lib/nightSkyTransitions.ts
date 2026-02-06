import * as THREE from 'three';
import { gsap } from 'gsap';

export function zoomInToPlanet(
    camera: THREE.Camera,
    controls: any,
    targetPlanet: THREE.Object3D,
    onComplete: () => void
) {
    // Save current camera position (could be stored in store if needed global, but passed instance is fine)
    // const startPosition = camera.position.clone();

    // Calculate target position (just above planet surface)
    const planetPosition = new THREE.Vector3();
    targetPlanet.getWorldPosition(planetPosition);

    // Need planet radius. Assuming standard scaled size or retrieving from geometry if mesh.
    // If targetPlanet is a Group, we might need to find the Mesh child.
    let planetRadius = 2; // Default fallback
    const mesh = targetPlanet.children.find(c => c.type === 'Mesh') as THREE.Mesh;
    if (mesh && mesh.geometry && mesh.geometry.boundingSphere) {
        planetRadius = mesh.geometry.boundingSphere.radius * mesh.scale.x;
        // Note: scale is applied to object, bounding sphere is local usually.
        // But we just need a rough "surface" point
        // In SpaceScope, planets scale is 1 unit = ? km. 
        // Actually we are scaling them up for visibility usually.
        // We will just zoom "Close" to the center.
    }

    // Target: Just slightly offset from center towards camera
    const direction = new THREE.Vector3().subVectors(camera.position, planetPosition).normalize();
    const targetPosition = planetPosition.clone().add(direction.multiplyScalar(planetRadius * 1.5)); // 1.5x radius

    // Disable controls during transition
    if (controls) controls.enabled = false;

    // 1. Zoom Camera to Planet
    gsap.to(camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
            camera.lookAt(planetPosition);
        },
        onComplete: () => {
            // 2. Fade to black
            const fadeOverlay = document.createElement('div');
            fadeOverlay.id = 'night-sky-fade';
            fadeOverlay.style.cssText = `
         position: fixed;
         inset: 0;
         background: black;
         z-index: 9999;
         opacity: 0;
         pointer-events: none;
         transition: opacity 1s ease;
       `;
            document.body.appendChild(fadeOverlay);

            // Force reflow
            fadeOverlay.getBoundingClientRect();
            fadeOverlay.style.opacity = '1';

            setTimeout(() => {
                onComplete(); // Mount NightSkyView

                // Fade out is handled by NightSkyView's entrance animation or we remove this Overlay
                setTimeout(() => {
                    fadeOverlay.style.opacity = '0';
                    setTimeout(() => fadeOverlay.remove(), 1000);
                }, 500);
            }, 1000);
        }
    });
}

export function zoomOutFromPlanet(
    camera: THREE.Camera,
    controls: any,
    originalPosition: THREE.Vector3,
    originalRotation: THREE.Euler, // Not really used if we use lookAt
    onComplete: () => void
) {
    // Disable controls during transition
    if (controls) controls.enabled = false;

    // Fade IN black
    const fadeOverlay = document.createElement('div');
    fadeOverlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: black;
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 1s ease;
  `;
    document.body.appendChild(fadeOverlay);

    // Force reflow
    fadeOverlay.getBoundingClientRect();
    fadeOverlay.style.opacity = '1';

    setTimeout(() => {
        onComplete(); // Unmount NightSkyView, return to Solar System scene

        // Reset Camera (teleport behind black screen)
        camera.position.copy(originalPosition);
        // camera.rotation.copy(originalRotation); 
        // Better to just let controls handle lookAt or reset controls
        if (controls) {
            controls.enabled = true;
            controls.update();
        }

        // Fade OUT black
        fadeOverlay.style.opacity = '0';
        setTimeout(() => fadeOverlay.remove(), 1000);

    }, 1000);
}
