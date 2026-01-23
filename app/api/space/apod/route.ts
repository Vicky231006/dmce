import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_APOD = {
    date: "2023-10-27",
    explanation: "What's happening in the center of our galaxy? To help find out, radio telescopes have been monitoring the mysterious Sgr A* for years. The result is a detailed image of the region around the supermassive black hole at the center of our Milky Way Galaxy.",
    hdurl: "https://apod.nasa.gov/apod/image/2310/SgrA_EHT_960.jpg",
    media_type: "image",
    service_version: "v1",
    title: "The Center of the Milky Way Galaxy",
    url: "https://apod.nasa.gov/apod/image/2310/SgrA_EHT_960.jpg"
};

export async function GET(req: NextRequest) {
    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;

    if (!apiKey) {
        console.warn('NASA API key not found, using fallback');
        return NextResponse.json(FALLBACK_APOD);
    }

    try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);

        if (!res.ok) {
            throw new Error(`NASA API Error: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching APOD:', error);
        return NextResponse.json(FALLBACK_APOD);
    }
}
