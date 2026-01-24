import { NextResponse } from 'next/server';

export async function GET() {
    // Simulate real-time data variation
    const solarStatus = Math.random() > 0.7 ? "HIGH" : Math.random() > 0.4 ? "MODERATE" : "LOW";
    const kpIndex = (Math.random() * 9).toFixed(1);
    const auroraProb = Math.floor(Math.random() * 100);

    const data = {
        solarStorms: {
            status: solarStatus,
            kpIndex: parseFloat(kpIndex),
            lastFlare: `M${(Math.random() * 5).toFixed(1)} Class (${Math.floor(Math.random() * 5) + 1} hours ago)`,
            windSpeed: `${Math.floor(Math.random() * 400 + 300)} km/s`
        },
        auroraForecast: {
            visibility: auroraProb > 70 ? "Mid Latitudes" : "High Latitudes",
            probability: `${auroraProb}%`,
            nextPeak: `${Math.floor(Math.random() * 23)}:00 UTC`
        },
        radiation: {
            level: Math.random() > 0.8 ? "ELEVATED" : "NORMAL",
            flux: `10^-${Math.floor(Math.random() * 3 + 5)} Watts/m2`,
            risk: Math.random() > 0.8 ? "Medium" : "Low"
        }
    };

    return NextResponse.json(data);
}
