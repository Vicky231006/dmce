import { CONSTELLATIONS } from './constellationData';

export const getSystemContext = () => {
    // ... existing logic placeholder if needed, or we just export the new one
    // For now, assuming this file might exist or needs to be adaptable. 
    // I will write the specific function requested.
    return "You are ARIA, an advanced AI assistant for space exploration.";
};

export function getNightSkyContextForAI(planetName: string, constellationId?: string): string {
    const planet = planetName.charAt(0).toUpperCase() + planetName.slice(1);

    let context = `
User is currently in NIGHT SKY VIEW mode.
- Viewing from: ${planet}'s surface
- Looking up at the stars from a first-person perspective
- Can see constellations, stars, and other visible planets
`;

    if (constellationId) {
        const constellation = CONSTELLATIONS.find(c => c.id === constellationId);
        if (constellation) {
            context += `
- Currently viewing: ${constellation.name} (${constellation.nameLatin})
- Description: ${constellation.description}
- Mythology: ${constellation.mythology}

The user may ask:
- How to find this constellation
- What stars make up this constellation
- The mythology behind it
- When it's visible from ${planet}
- How it compares to Earth's view
`;
        }
    }

    context += `
When responding:
- Explain how the night sky looks different from ${planet} compared to Earth
- Reference the constellations visible
- Mention any planets visible in the sky
- Use terms like "looking north" or "overhead"
- Be descriptive and immersive
`;

    return context;
}
