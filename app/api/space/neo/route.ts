import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, checkRateLimit } from '@/lib/cache';

// Mock data for fallback/prototype
const FALLBACK_NEO_DATA = {
    element_count: 3,
    near_earth_objects: {
        "2023-10-27": [
            {
                id: "1",
                name: "(2023 UQ1)",
                estimated_diameter: { kilometers: { min: 0.1, max: 0.2 } },
                is_potentially_hazardous_asteroid: false,
                close_approach_data: [{
                    miss_distance: { kilometers: "1200000" },
                    relative_velocity: { kilometers_per_hour: "45000" }
                }]
            },
            {
                id: "2",
                name: "(2023 VK)",
                estimated_diameter: { kilometers: { min: 0.05, max: 0.12 } },
                is_potentially_hazardous_asteroid: true,
                close_approach_data: [{
                    miss_distance: { kilometers: "800000" },
                    relative_velocity: { kilometers_per_hour: "62000" }
                }]
            }
        ]
    }
};

export async function GET(req: NextRequest) {
    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;

    if (!apiKey) {
        return NextResponse.json(FALLBACK_NEO_DATA);
    }

    try {
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`);

        if (!res.ok) {
            throw new Error(`NASA API Error: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching NEO data:', error);
        return NextResponse.json(FALLBACK_NEO_DATA);
    }
}
