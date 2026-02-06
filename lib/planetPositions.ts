import * as THREE from 'three';

export interface PlanetPosition {
    name: string;
    azimuth: number;
    altitude: number;
    visible: boolean;
}

export interface VisiblePlanet {
    name: string;
    azimuth: number;
    altitude: number;
    brightness: number;
}

export function getPlanetPositionInSky(
    observerPlanet: string,
    targetPlanet: string,
    currentDate: Date = new Date()
): PlanetPosition | null {
    // Simplified orbital calculations for visualization
    // Uses circular orbits approx for now

    const orbitalData: Record<string, { distance: number; period: number }> = {
        mercury: { distance: 0.39, period: 88 },
        venus: { distance: 0.72, period: 225 },
        earth: { distance: 1.0, period: 365 },
        mars: { distance: 1.52, period: 687 },
        jupiter: { distance: 5.2, period: 4333 },
        saturn: { distance: 9.54, period: 10759 },
        uranus: { distance: 19.19, period: 30687 },
        neptune: { distance: 30.07, period: 60190 },
        pluto: { distance: 39.48, period: 90560 }
    };

    // Normalize names
    const obs = observerPlanet.toLowerCase();
    const tgt = targetPlanet.toLowerCase();

    const observerData = orbitalData[obs];
    const targetData = orbitalData[tgt];

    if (!observerData || !targetData) return null;

    // Calculate days since arbitrary epoch (J2000)
    const daysSinceEpoch = (currentDate.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24);

    // Calculate orbital angles (mean anomaly approx)
    const observerAngle = (2 * Math.PI * daysSinceEpoch) / observerData.period;
    const targetAngle = (2 * Math.PI * daysSinceEpoch) / targetData.period;

    // Positions in heliocentric coordinates (2D top-down view)
    const observerPos = new THREE.Vector2(
        observerData.distance * Math.cos(observerAngle),
        observerData.distance * Math.sin(observerAngle)
    );

    const targetPos = new THREE.Vector2(
        targetData.distance * Math.cos(targetAngle),
        targetData.distance * Math.sin(targetAngle)
    );

    // Relative position vector from observer to target
    const relative = new THREE.Vector2().subVectors(targetPos, observerPos);

    // Calculate Azimuth (bearing)
    // In our top down view, angle relative to the "sun" direction or fixed stars
    // Let's assume standard math angle
    let azimuth = Math.atan2(relative.y, relative.x) * (180 / Math.PI);
    if (azimuth < 0) azimuth += 360;

    // Calculate Distance
    const distance = relative.length();

    // Simple Altitude Calculation
    // This is tricky without full 3D orbital inclinations.
    // We will simulate it by pretending planets are essentially on the ecliptic
    // but give them slight random variations or based on time of day vs sun?
    // Actually, "Night Sky" implies we are on the surface away from the sun.
    // We need to know where the Sun is relative to the observer to know if it's "Night".
    // But the prompt says "Night Sky View" - users might force it even if day.
    // We'll just return the geometric position.
    // For altitude, let's assume they are roughly on the ecliptic, which changes based on observer tilt.
    // Simplified: Randomize altitude slightly around 0-45 degrees for visual flair, 
    // or use a calculated one if we assume the observer is looking "out" from the planet equator at midnight.

    // If we are "at night", looking away from Sun.
    // The planets visible would be those "behind" us relative to the sun (Superior planets at opposition)
    // or those at wide elongations (Inferior).
    // Let's just calculate a plausible altitude.
    const altitude = (Math.sin(daysSinceEpoch * 0.01) * 30 + 30); // Oscillate between 0 and 60 degrees for demo

    // Visibility: Just check if it's above horizon (Altitude > 0)
    const visible = altitude > 0;

    return { name: tgt, azimuth, altitude, visible };
}

function calculateBrightness(planet: string): number {
    // Simplified magnitudes
    const magnitudes: Record<string, number> = {
        mercury: -0.5,
        venus: -4.4,
        mars: -2.0, // varies wildly, taking bright
        jupiter: -2.7,
        saturn: 0.4,
        uranus: 5.7,
        neptune: 7.8,
        pluto: 14 // invisible to naked eye but we might show it
    };
    return magnitudes[planet] || 0;
}

export function getVisiblePlanets(observerPlanet: string): VisiblePlanet[] {
    const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    const visible: VisiblePlanet[] = [];

    planets.forEach(planet => {
        if (planet === observerPlanet.toLowerCase()) return;

        // We add some deterministic "randomness" based on date if we want, or just use the math
        const position = getPlanetPositionInSky(observerPlanet, planet);

        // Manual override to ensure at least some are visible for the demo
        // If fewer than 2 are visible, force some simple ones
        const demoForce = true;

        if (position && (position.visible || demoForce)) {
            visible.push({
                name: planet,
                azimuth: position.azimuth,
                altitude: position.visible ? position.altitude : Math.random() * 45 + 10, // Force up if demo
                brightness: calculateBrightness(planet),
            });
        }
    });

    return visible.slice(0, 5); // Limit to 5 max for UI clutter
}
