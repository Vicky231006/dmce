'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Lesson, LessonAnimation } from '@/lib/lessonData';

interface AnimationControllerProps {
    lesson: Lesson;
    currentTime: number; // Current playback position
    isPaused: boolean;
    sceneRef: React.RefObject<THREE.Group | null>;
}

export function AnimationController({ lesson, currentTime, isPaused, sceneRef }: AnimationControllerProps) {
    const { camera } = useThree();
    const activeAnimations = useRef<Map<string, any>>(new Map());

    // Camera animation state
    const cameraAnimRef = useRef<{
        active: boolean;
        startPos: THREE.Vector3;
        endPos: THREE.Vector3;
        startLookAt: THREE.Vector3;
        endLookAt: THREE.Vector3;
        startTime: number;
        duration: number;
    } | null>(null);

    useEffect(() => {
        // Find animations that should be active at currentTime
        const relevantAnimations = lesson.animations.filter(
            anim => anim.timestamp <= currentTime && anim.timestamp + (anim.params.duration || 5) >= currentTime
        );

        relevantAnimations.forEach(anim => {
            const key = `${anim.timestamp}-${anim.type}`;
            if (!activeAnimations.current.has(key)) {
                // Trigger new animation
                triggerAnimation(anim);
                activeAnimations.current.set(key, anim);
            }
        });

    }, [currentTime, lesson]);

    const triggerAnimation = (anim: LessonAnimation) => {
        switch (anim.type) {
            case 'particle-burst':
                if (sceneRef.current) createParticleBurst(anim.params, sceneRef.current);
                break;
            case 'camera-move':
                startCameraMove(anim.params);
                break;
            case 'universe-expand':
                // Handled by scene specific logic or global uniform updates
                break;
            // Add more animation types
        }
    };

    const startCameraMove = (params: any) => {
        const startPos = camera.position.clone();
        const endPos = params.position ? new THREE.Vector3(...params.position) : startPos;

        // Assume looking at 0,0,0 or handling lookAt if provided
        const currentLookAt = new THREE.Vector3(0, 0, 0); // Simplified assumption or track it
        const endLookAt = params.lookAt ? new THREE.Vector3(...params.lookAt) : new THREE.Vector3(0, 0, 0);

        cameraAnimRef.current = {
            active: true,
            startPos,
            endPos,
            startLookAt: currentLookAt,
            endLookAt,
            startTime: Date.now(),
            duration: params.duration * 1000
        };
    };

    const createParticleBurst = (params: any, scene: THREE.Group) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(params.count * 3);
        const velocities = new Float32Array(params.count * 3);

        for (let i = 0; i < params.count; i++) {
            // Random direction
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = params.origin[0];
            positions[i * 3 + 1] = params.origin[1];
            positions[i * 3 + 2] = params.origin[2];

            const speed = params.velocity * (0.5 + Math.random() * 0.5);
            velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
            velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            velocities[i * 3 + 2] = Math.cos(phi) * speed;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        const material = new THREE.PointsMaterial({
            color: params.color,
            size: 0.2,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData = {
            type: 'particle-burst',
            startTime: Date.now(),
            duration: params.duration * 1000
        };

        scene.add(particles);
    };

    useFrame((state, delta) => {
        if (isPaused) return;

        // Update Camera
        if (cameraAnimRef.current && cameraAnimRef.current.active) {
            const anim = cameraAnimRef.current;
            const elapsed = Date.now() - anim.startTime;
            const progress = Math.min(elapsed / anim.duration, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            camera.position.lerpVectors(anim.startPos, anim.endPos, ease);
            // camera.lookAt(new THREE.Vector3().lerpVectors(anim.startLookAt, anim.endLookAt, ease)); // Optional if controls don't override

            if (progress >= 1) {
                cameraAnimRef.current = null;
            }
        }

        if (!sceneRef.current) return;

        // Update particles
        sceneRef.current.children.forEach((child) => {
            if (child.userData.type === 'particle-burst') {
                const particles = child as THREE.Points;
                const positions = particles.geometry.attributes.position.array as Float32Array;
                const velocities = particles.geometry.attributes.velocity.array as Float32Array;

                for (let i = 0; i < positions.length / 3; i++) {
                    positions[i * 3] += velocities[i * 3] * delta;
                    positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
                    positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
                }

                particles.geometry.attributes.position.needsUpdate = true;

                // Fade out
                const elapsed = Date.now() - child.userData.startTime;
                const material = particles.material as THREE.PointsMaterial;
                if (elapsed > child.userData.duration) {
                    material.opacity -= delta;
                    if (material.opacity <= 0) {
                        sceneRef.current?.remove(child);
                        (child as THREE.Points).geometry.dispose();
                        ((child as THREE.Points).material as THREE.Material).dispose();
                    }
                }
            }
        });
    });

    return null;
}
