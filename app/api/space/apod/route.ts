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
    // Prototype: Return fallback data
    return NextResponse.json(FALLBACK_APOD);
}
