export const COSMIC_WEATHER_DATA = {
    solarStorms: {
        status: "MODERATE",
        kpIndex: 4.5,
        lastFlare: "M1.2 Class (2 hours ago)",
        windSpeed: "450 km/s"
    },
    auroraForecast: {
        visibility: "High Latitudes",
        probability: "65%",
        nextPeak: "22:00 UTC"
    },
    radiation: {
        level: "NORMAL",
        flux: "10^-6 Watts/m2",
        risk: "Low"
    }
};

export const SATELLITE_DATA = {
    contributions: [
        {
            id: 1,
            title: "Climate Monitoring",
            description: "Tracking global temperature rise and ice cap melting rates.",
            value: "-2.4% Ice Loss/Yr",
            trend: "down"
        },
        {
            id: 2,
            title: "Disaster Response",
            description: "Real-time flood mapping and wildfire tracking.",
            value: "4 Active Fires",
            trend: "up"
        },
        {
            id: 3,
            title: "Agriculture",
            description: "Optimizing crop yields through soil moisture analysis.",
            value: "+18% Yield",
            trend: "up"
        }
    ],
    graphData: [
        { year: 2020, coverage: 85 },
        { year: 2021, coverage: 88 },
        { year: 2022, coverage: 92 },
        { year: 2023, coverage: 95 },
        { year: 2024, coverage: 98 }
    ]
};
