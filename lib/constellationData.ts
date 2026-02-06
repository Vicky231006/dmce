export interface Star {
    name: string;
    ra: number; // Right Ascension (0-360 degrees)
    dec: number; // Declination (-90 to +90 degrees)
    magnitude: number; // Brightness (lower = brighter)
    color: string; // Star color
}

export interface Constellation {
    id: string;
    name: string;
    nameLatin: string;
    description: string;
    mythology: string;
    stars: Star[];
    connections: number[][]; // Array of [starIndex1, starIndex2] pairs
    boundingBox: {
        raMin: number;
        raMax: number;
        decMin: number;
        decMax: number;
    };
}

// COMPLETE CONSTELLATION DATA (Top 15 most recognizable)
export const CONSTELLATIONS: Constellation[] = [
    {
        id: 'ursa-major',
        name: 'Big Dipper / Ursa Major',
        nameLatin: 'Ursa Major',
        description: 'The Great Bear, containing the Big Dipper asterism. One of the most recognizable patterns in the northern sky.',
        mythology: 'In Greek mythology, Zeus placed the bear in the sky to protect it from hunters.',
        stars: [
            { name: 'Dubhe', ra: 165.93, dec: 61.75, magnitude: 1.79, color: '#ffe4b5' },
            { name: 'Merak', ra: 165.46, dec: 56.38, magnitude: 2.37, color: '#ffffff' },
            { name: 'Phecda', ra: 178.46, dec: 53.69, magnitude: 2.44, color: '#ffffff' },
            { name: 'Megrez', ra: 183.86, dec: 57.03, magnitude: 3.31, color: '#ffffff' },
            { name: 'Alioth', ra: 193.51, dec: 55.96, magnitude: 1.77, color: '#ffffff' },
            { name: 'Mizar', ra: 200.98, dec: 54.93, magnitude: 2.27, color: '#ffffff' },
            { name: 'Alkaid', ra: 206.89, dec: 49.31, magnitude: 1.86, color: '#ffe4b5' },
        ],
        connections: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], // Bowl and handle
            [0, 3], // Connect bowl
        ],
        boundingBox: { raMin: 155, raMax: 215, decMin: 45, decMax: 65 },
    },

    {
        id: 'orion',
        name: 'Orion',
        nameLatin: 'Orion',
        description: 'The Hunter. Features the famous Orion\'s Belt - three bright stars in a row. Visible worldwide.',
        mythology: 'Orion was a legendary hunter in Greek mythology, placed in the stars by Zeus.',
        stars: [
            { name: 'Betelgeuse', ra: 88.79, dec: 7.41, magnitude: 0.50, color: '#ff4500' }, // Red supergiant
            { name: 'Rigel', ra: 78.63, dec: -8.20, magnitude: 0.13, color: '#b0e0e6' }, // Blue supergiant
            { name: 'Bellatrix', ra: 81.28, dec: 6.35, magnitude: 1.64, color: '#b0e0e6' },
            { name: 'Alnitak', ra: 85.19, dec: -1.94, magnitude: 1.77, color: '#b0e0e6' }, // Belt
            { name: 'Alnilam', ra: 84.05, dec: -1.20, magnitude: 1.69, color: '#b0e0e6' }, // Belt
            { name: 'Mintaka', ra: 83.00, dec: -0.30, magnitude: 2.23, color: '#b0e0e6' }, // Belt
            { name: 'Saiph', ra: 86.94, dec: -9.67, magnitude: 2.09, color: '#b0e0e6' },
        ],
        connections: [
            [0, 2], [2, 5], [5, 3], [3, 4], [4, 6], [6, 1], [1, 0], // Body outline
            [3, 4], [4, 5], // Belt emphasized
        ],
        boundingBox: { raMin: 75, raMax: 95, decMin: -12, decMax: 12 },
    },

    {
        id: 'cassiopeia',
        name: 'Cassiopeia',
        nameLatin: 'Cassiopeia',
        description: 'The Queen. Distinctive W or M shape, depending on orientation. Always visible in northern hemisphere.',
        mythology: 'Queen Cassiopeia was placed in the sky as punishment for her vanity.',
        stars: [
            { name: 'Schedar', ra: 10.13, dec: 56.54, magnitude: 2.23, color: '#ffa500' },
            { name: 'Caph', ra: 3.31, dec: 59.15, magnitude: 2.27, color: '#ffffff' },
            { name: 'Navi', ra: 14.18, dec: 60.72, magnitude: 2.47, color: '#ffe4b5' },
            { name: 'Ruchbah', ra: 21.45, dec: 60.24, magnitude: 2.68, color: '#ffffff' },
            { name: 'Segin', ra: 25.65, dec: 63.67, magnitude: 3.38, color: '#b0e0e6' },
        ],
        connections: [
            [1, 0], [0, 2], [2, 3], [3, 4], // W shape
        ],
        boundingBox: { raMin: 0, raMax: 30, decMin: 55, decMax: 65 },
    },

    {
        id: "leo",
        name: "Leo",
        nameLatin: "Leo",
        description: "The Lion. Easily recognizable zodiac constellation. Contains the bright star Regulus.",
        mythology: "The Nemean Lion killed by nearby Hercules during his twelve labors.",
        stars: [
            { name: "Regulus", ra: 152.09, dec: 11.97, magnitude: 1.35, color: "#b0e0e6" },
            { name: "Denebola", ra: 177.26, dec: 14.57, magnitude: 2.14, color: "#ffffff" },
            { name: "Algieba", ra: 155.02, dec: 19.84, magnitude: 2.22, color: "#ffe4b5" },
            { name: "Zosma", ra: 169.52, dec: 20.52, magnitude: 2.56, color: "#ffffff" },
            { name: "Rasalas", ra: 148.8, dec: 23.77, magnitude: 3.88, color: "#ffe4b5" },
            { name: "Adhafera", ra: 154.2, dec: 23.41, magnitude: 3.44, color: "#ffffff" }
        ],
        connections: [
            [0, 2], [2, 4], [4, 5], [5, 2], // Sickle/Head
            [2, 3], [3, 1], [0, 1] // Body
        ],
        boundingBox: { raMin: 145, raMax: 180, decMin: 5, decMax: 33 }
    },
    {
        id: "taurus",
        name: "Taurus",
        nameLatin: "Taurus",
        description: "The Bull. Contains the Pleiades star cluster and the red giant Aldebaran.",
        mythology: "Zeus disguised himself as a white bull to abduct Europa.",
        stars: [
            { name: "Aldebaran", ra: 68.98, dec: 16.51, magnitude: 0.85, color: "#ff4500" },
            { name: "Elnath", ra: 81.57, dec: 28.6, magnitude: 1.68, color: "#b0e0e6" },
            { name: "Alcyone", ra: 56.85, dec: 24.1, magnitude: 2.85, color: "#b0e0e6" }, // Pleiades brightest
            { name: "Tianguan", ra: 84.4, dec: 21.14, magnitude: 2.96, color: "#b0e0e6" }
        ],
        connections: [
            [0, 2], // Face to Pleiades
            [0, 3], [0, 1] // Horns
        ],
        boundingBox: { raMin: 50, raMax: 90, decMin: 10, decMax: 30 }
    },
    {
        id: "scorpius",
        name: "Scorpius",
        nameLatin: "Scorpius",
        description: "The Scorpion. Large southern constellation with the red supergiant Antares.",
        mythology: "The scorpion that killed Orion.",
        stars: [
            { name: "Antares", ra: 247.35, dec: -26.43, magnitude: 1.09, color: "#ff4500" },
            { name: "Shaula", ra: 263.4, dec: -37.1, magnitude: 1.63, color: "#b0e0e6" },
            { name: "Sargas", ra: 264.3, dec: -42.9, magnitude: 1.86, color: "#ffffff" },
            { name: "Dschubba", ra: 240.0, dec: -22.6, magnitude: 2.32, color: "#b0e0e6" },
            { name: "Wei", ra: 253.0, dec: -39.0, magnitude: 2.29, color: "#ffe4b5" }
        ],
        connections: [[3, 0], [0, 4], [4, 2], [2, 1]], // Simplified body/tail
        boundingBox: { raMin: 230, raMax: 270, decMin: -45, decMax: -10 }
    },
    {
        id: "gemini",
        name: "Gemini",
        nameLatin: "Gemini",
        description: "The Twins. Features the bright stars Castor and Pollux.",
        mythology: "The twins Castor and Pollux of Greek mythology.",
        stars: [
            { name: "Pollux", ra: 116.3, dec: 28.0, magnitude: 1.14, color: "#ffe4b5" },
            { name: "Castor", ra: 113.6, dec: 31.8, magnitude: 1.93, color: "#ffffff" },
            { name: "Alhena", ra: 99.4, dec: 16.4, magnitude: 1.9, color: "#ffffff" }
        ],
        connections: [[1, 0], [0, 2]],
        boundingBox: { raMin: 90, raMax: 120, decMin: 10, decMax: 35 }
    },
    {
        id: 'cygnus',
        name: 'Cygnus',
        nameLatin: 'Cygnus',
        description: 'The Swan. Dominated by the bright star Deneb. Represents a swan flying south along the Milky Way.',
        mythology: 'Orpheus was transformed into a swan after his death to be placed next to his lyre.',
        stars: [
            { name: 'Deneb', ra: 310.36, dec: 45.28, magnitude: 1.25, color: '#ffffff' },
            { name: 'Sadr', ra: 305.55, dec: 40.25, magnitude: 2.23, color: '#ffe4b5' },
            { name: 'Gienah', ra: 311.45, dec: 33.97, magnitude: 2.48, color: '#ffe4b5' },
            { name: 'Albireo', ra: 292.68, dec: 27.96, magnitude: 3.05, color: '#ffd700' }, // Gold/Blue double
            { name: 'Fawaris', ra: 294.5, dec: 44.9, magnitude: 2.87, color: '#ffffff' }
        ],
        connections: [[0, 1], [1, 2], [1, 3], [1, 4]], // Cross shape
        boundingBox: { raMin: 290, raMax: 320, decMin: 25, decMax: 60 }
    },
    {
        id: 'lyra',
        name: 'Lyra',
        nameLatin: 'Lyra',
        description: 'The Harp. Small but distinct constellation containing Vega, the fifth brightest star in the sky.',
        mythology: 'The lyre of Orpheus, the legendary musician.',
        stars: [
            { name: 'Vega', ra: 279.23, dec: 38.78, magnitude: 0.03, color: '#b0e0e6' }, // Blue-white
            { name: 'Sheliak', ra: 282.5, dec: 33.36, magnitude: 3.52, color: '#ffffff' },
            { name: 'Sulafat', ra: 284.0, dec: 32.68, magnitude: 3.25, color: '#b0e0e6' }
        ],
        connections: [[0, 1], [1, 2], [2, 0]], // Triangle/Parallelogram
        boundingBox: { raMin: 275, raMax: 290, decMin: 30, decMax: 45 }
    },
    {
        id: 'aquila',
        name: 'Aquila',
        nameLatin: 'Aquila',
        description: 'The Eagle. Contains Altair. forms the Summer Triangle with Vega and Deneb.',
        mythology: 'The eagle that carried Zeus\'s thunderbolts.',
        stars: [
            { name: 'Altair', ra: 297.7, dec: 8.87, magnitude: 0.77, color: '#ffffff' },
            { name: 'Alshain', ra: 298.8, dec: 6.4, magnitude: 3.71, color: '#ffe4b5' },
            { name: 'Tarazed', ra: 296.6, dec: 10.6, magnitude: 2.72, color: '#ffa500' }
        ],
        connections: [[0, 1], [0, 2]], // Simple wings
        boundingBox: { raMin: 290, raMax: 305, decMin: 0, decMax: 15 }
    },
    {
        id: 'pegasus',
        name: 'Pegasus',
        nameLatin: 'Pegasus',
        description: 'The Winged Horse. Recognized by the Great Square of Pegasus.',
        mythology: 'The winged horse sprung from the blood of Medusa.',
        stars: [
            { name: 'Markab', ra: 346.1, dec: 15.2, magnitude: 2.49, color: '#b0e0e6' },
            { name: 'Scheat', ra: 345.9, dec: 28.1, magnitude: 2.44, color: '#ff4500' },
            { name: 'Algenib', ra: 2.1, dec: 15.1, magnitude: 2.83, color: '#b0e0e6' },
            { name: 'Alpheratz', ra: 1.5, dec: 29.1, magnitude: 2.06, color: '#b0e0e6' } // Shared with Andromeda
        ],
        connections: [[0, 1], [1, 3], [3, 2], [2, 0]], // Great Square
        boundingBox: { raMin: 340, raMax: 10, decMin: 10, decMax: 35 }
    },
    {
        id: 'andromeda',
        name: 'Andromeda',
        nameLatin: 'Andromeda',
        description: 'The Princess. Contains the Andromeda Galaxy (M31). Connected to Pegasus.',
        mythology: 'Chained to a rock as a sacrifice to the sea monster Cetus.',
        stars: [
            { name: 'Alpheratz', ra: 1.5, dec: 29.1, magnitude: 2.06, color: '#b0e0e6' },
            { name: 'Mirach', ra: 17.4, dec: 35.6, magnitude: 2.07, color: '#ff4500' },
            { name: 'Almach', ra: 30.9, dec: 42.3, magnitude: 2.10, color: '#ffa500' }
        ],
        connections: [[0, 1], [1, 2]], // Chain
        boundingBox: { raMin: 0, raMax: 40, decMin: 25, decMax: 45 }
    },
    {
        id: 'crux',
        name: 'Southern Cross',
        nameLatin: 'Crux',
        description: 'The smallest but one of the most distinctive constellations. Crucial for navigation in the south.',
        mythology: 'Used by sailors for navigation due to pointing South.',
        stars: [
            { name: 'Acrux', ra: 186.6, dec: -63.1, magnitude: 0.77, color: '#b0e0e6' },
            { name: 'Mimosa', ra: 191.9, dec: -59.7, magnitude: 1.25, color: '#b0e0e6' },
            { name: 'Gacrux', ra: 187.8, dec: -57.1, magnitude: 1.63, color: '#ff4500' },
            { name: 'Delta Crucis', ra: 183.8, dec: -58.7, magnitude: 2.79, color: '#b0e0e6' }
        ],
        connections: [[0, 2], [1, 3]], // Cross
        boundingBox: { raMin: 180, raMax: 200, decMin: -65, decMax: -55 }
    },
    {
        id: 'centaurus',
        name: 'Centaurus',
        nameLatin: 'Centaurus',
        description: 'The Centaur. Contains Alpha Centauri, the closest star system to the Solar System.',
        mythology: 'Chiron, the wise centaur.',
        stars: [
            { name: 'Rigil Kentaurus', ra: 219.9, dec: -60.8, magnitude: -0.01, color: '#ffe4b5' },
            { name: 'Hadar', ra: 210.8, dec: -60.4, magnitude: 0.61, color: '#b0e0e6' }
        ],
        connections: [[1, 0]], // Pointers to Crux
        boundingBox: { raMin: 200, raMax: 230, decMin: -65, decMax: -55 }
    },
    {
        id: 'canis-major',
        name: 'Canis Major',
        nameLatin: 'Canis Major',
        description: 'The Great Dog. Contains Sirius, the brightest star in the night sky.',
        mythology: 'One of Orion\'s two hunting dogs.',
        stars: [
            { name: 'Sirius', ra: 101.3, dec: -16.7, magnitude: -1.46, color: '#b0e0e6' }, // Brightest!
            { name: 'Adhara', ra: 104.7, dec: -28.9, magnitude: 1.5, color: '#b0e0e6' },
            { name: 'Wezen', ra: 106.1, dec: -26.4, magnitude: 1.83, color: '#ffe4b5' },
            { name: 'Mirzam', ra: 95.7, dec: -17.9, magnitude: 1.98, color: '#b0e0e6' }
        ],
        connections: [[0, 3], [0, 2], [2, 1]], // Dog body
        boundingBox: { raMin: 90, raMax: 110, decMin: -35, decMax: -10 }
    },
    {
        id: 'carina',
        name: 'Carina',
        nameLatin: 'Carina',
        description: 'The Keel. Contains Canopus, the second brightest star.',
        mythology: 'Part of the ship Argo Navis.',
        stars: [
            { name: 'Canopus', ra: 95.9, dec: -52.7, magnitude: -0.72, color: '#ffe4b5' },
            { name: 'Miaplacidus', ra: 140.3, dec: -69.7, magnitude: 1.67, color: '#b0e0e6' },
            { name: 'Avior', ra: 125.6, dec: -59.5, magnitude: 1.86, color: '#ffa500' }
        ],
        connections: [[0, 2], [2, 1]],
        boundingBox: { raMin: 90, raMax: 150, decMin: -75, decMax: -50 }
    },
    {
        id: 'virgo',
        name: 'Virgo',
        nameLatin: 'Virgo',
        description: 'The Virgin. Largest constellation of the Zodiac. Contains Spica.',
        mythology: 'Associated with Demeter and the harvest.',
        stars: [
            { name: 'Spica', ra: 201.3, dec: -11.16, magnitude: 0.98, color: '#b0e0e6' },
            { name: 'Porrima', ra: 190.4, dec: -1.45, magnitude: 2.74, color: '#ffe4b5' },
            { name: 'Vindemiatrix', ra: 195.5, dec: 10.96, magnitude: 2.85, color: '#ffe4b5' }
        ],
        connections: [[0, 1], [1, 2]],
        boundingBox: { raMin: 180, raMax: 210, decMin: -15, decMax: 15 }
    },
    {
        id: 'sagittarius',
        name: 'Sagittarius',
        nameLatin: 'Sagittarius',
        description: 'The Archer. Look towards the center of the Milky Way. Features the "Teapot" asterism.',
        mythology: 'A centaur pointing an arrow at Antares (in Scorpius).',
        stars: [
            { name: 'Kaus Australis', ra: 276.1, dec: -34.4, magnitude: 1.79, color: '#b0e0e6' },
            { name: 'Nunki', ra: 283.8, dec: -26.3, magnitude: 2.05, color: '#b0e0e6' },
            { name: 'Ascella', ra: 285.9, dec: -29.9, magnitude: 2.6, color: '#ffffff' },
            { name: 'Kaus Media', ra: 273.9, dec: -29.8, magnitude: 2.72, color: '#ffa500' }
        ],
        connections: [[0, 3], [3, 1], [1, 2], [2, 0]], // Teapot shape
        boundingBox: { raMin: 270, raMax: 290, decMin: -40, decMax: -20 }
    }
];

// Helper function to convert RA/Dec to 3D positions
export function raDecToXYZ(ra: number, dec: number, distance: number = 100): [number, number, number] {
    const raRad = (ra * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;

    // Convert standard astronomical coords (Right Ascension, Declination) to 3D Cartesian
    // NOTE: This is a simplified mapping. In three.js, Y is typically "up" (Celestial North).
    // RA maps to angle around Y axis. Dec maps to angle from XZ plane.
    // Standard conversion with Y as up:
    const phi = (90 - dec) * (Math.PI / 180); // Polar angle from Y axis
    const theta = ra * (Math.PI / 180); // Azimuthal angle in XZ plane

    // Typically:
    // x = r * sin(phi) * cos(theta)
    // z = r * sin(phi) * sin(theta)
    // y = r * cos(phi)

    // But let's align with the provided snippet logic or adjust for typical skyboxes:
    // The provided snippet in user instructions was:
    // x = distance * cos(dec) * cos(ra)
    // y = distance * sin(dec)
    // z = distance * cos(dec) * sin(ra)

    // This assumes Z is "North" or something and Y is "Up" in dec?
    // Let's stick to the prompt's math for consistency if it produces valid results, 
    // but just ensuring it maps logically to a sphere.

    const x = distance * Math.cos(decRad) * Math.cos(raRad);
    const y = distance * Math.sin(decRad);
    const z = distance * Math.cos(decRad) * Math.sin(raRad);

    return [x, y, z];
}
