import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        if (!res.ok) throw new Error('Failed to fetch ISS data');
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { latitude: 0, longitude: 0, altitude: 400, velocity: 27600 },
            { status: 200 } // Return fallback with 200 for prototype stability
        );
    }
}
