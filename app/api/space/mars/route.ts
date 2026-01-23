import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_MARS_DATA = {
    photos: [
        {
            id: 102693,
            sol: 1000,
            camera: {
                id: 20,
                name: "FHAZ",
                rover_id: 5,
                full_name: "Front Hazard Avoidance Camera"
            },
            img_src: "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG",
            earth_date: "2015-05-30",
            rover: {
                id: 5,
                name: "Curiosity",
                landing_date: "2012-08-06",
                launch_date: "2011-11-26",
                status: "active"
            }
        }
    ]
};

export async function GET(req: NextRequest) {
    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;

    if (!apiKey) {
        return NextResponse.json(FALLBACK_MARS_DATA);
    }

    try {
        // Fetch photos from Curiosity (Sol 1000 is a safe bet for good photos)
        const res = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${apiKey}`);

        if (!res.ok) {
            throw new Error(`NASA API Error: ${res.status}`);
        }

        const data = await res.json();

        if (!data.photos || data.photos.length === 0) {
            return NextResponse.json(FALLBACK_MARS_DATA);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching Mars photos:', error);
        return NextResponse.json(FALLBACK_MARS_DATA);
    }
}
