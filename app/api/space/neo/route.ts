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
    // In a real app, we would use the real NASA API key
    // const apiKey = process.env.NASA_API_KEY;

    // For this prototype, we'll return the fallback data to avoid needing an API key immediately
    // But the structure is ready for real integration

    return NextResponse.json(FALLBACK_NEO_DATA);
}
