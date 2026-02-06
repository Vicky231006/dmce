export const PLANET_SURFACE_CONFIG: Record<string, any> = {
    earth: {
        groundColor: '#2d5016', // Dark green (grass/forest)
        groundTexture: 'earth_ground.jpg', // Optional texture
        skyColor: '#000814', // Deep blue-black
        atmosphereGlow: true,
        glowColor: '#1e3a8a', // Blue atmospheric glow
        horizonFog: true,
    },

    mars: {
        groundColor: '#8b4513', // Rust red
        skyColor: '#4a0e0e', // Dark reddish (Mars sky at night)
        atmosphereGlow: false, // Thin atmosphere
        horizonFog: false,
    },

    moon: {
        groundColor: '#36454f', // Gray lunar regolith
        skyColor: '#000000', // Pure black (no atmosphere)
        atmosphereGlow: false,
        starsVisible: true, // More stars visible without atmosphere
    },

    mercury: {
        groundColor: '#4a4a4a', // Dark gray
        skyColor: '#000000',
        atmosphereGlow: false,
    },

    venus: {
        groundColor: '#8b7355', // Brownish-tan
        skyColor: '#1a0a00', // Very dark (thick clouds block most light)
        atmosphereGlow: true,
        glowColor: '#ffaa00', // Orange glow
        note: 'Venus has thick clouds - stars barely visible',
    },

    jupiter: {
        groundColor: '#d4a574', // Tan/brown (cloud tops)
        skyColor: '#1a1200',
        atmosphereGlow: true,
        glowColor: '#ff8c00',
        note: 'Standing on cloud layer, turbulent atmosphere',
    },

    saturn: {
        groundColor: '#e6d7a3', // Pale gold
        skyColor: '#0d0d0d',
        atmosphereGlow: true,
        glowColor: '#ffd700',
        rings: {
            visible: true,
            arc: 'massive arcs across sky', // Rings are HUGE from surface
        },
    },

    uranus: {
        groundColor: '#4fd0e7', // Pale blue
        skyColor: '#001a1a',
        atmosphereGlow: true,
        glowColor: '#00bfff',
    },

    neptune: {
        groundColor: '#4166f5', // Deep blue
        skyColor: '#000d1a',
        atmosphereGlow: true,
        glowColor: '#1e90ff',
    },

    pluto: {
        groundColor: '#7a6a5c', // Gray-brown
        skyColor: '#000000',
        atmosphereGlow: false,
        note: 'Very faint sunlight, stars extremely bright',
    },

    sun: {
        groundColor: '#ffaa00',
        skyColor: '#000000',
        atmosphereGlow: true,
        glowColor: '#ff4500'
    }
};
