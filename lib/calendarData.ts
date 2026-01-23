export interface CalendarEvent {
    date: string;
    title: string;
    description: string;
    type: 'eclipse' | 'meteor-shower' | 'conjunction' | 'mission' | 'other';
}

export const CALENDAR_DATA: { [year: number]: CalendarEvent[] } = {
    2025: [
        {
            date: "2025-03-14",
            title: "Total Lunar Eclipse",
            description: "Visible across the Americas, Europe, and Africa. The moon will turn a blood-red hue.",
            type: "eclipse"
        },
        {
            date: "2025-05-04",
            title: "Eta Aquarids Meteor Shower",
            description: "Peak activity with up to 60 meteors per hour, originating from Halley's Comet.",
            type: "meteor-shower"
        },
        {
            date: "2025-09-21",
            title: "Jupiter at Opposition",
            description: "Jupiter will be at its closest approach to Earth and its face will be fully illuminated by the Sun.",
            type: "conjunction"
        },
        {
            date: "2025-11-07",
            title: "Artemis II Launch (Projected)",
            description: "NASA's first crewed mission to the Moon in over 50 years.",
            type: "mission"
        }
    ],
    2026: [
        {
            date: "2026-02-17",
            title: "Annular Solar Eclipse",
            description: "A 'Ring of Fire' eclipse visible in Antarctica and parts of South America.",
            type: "eclipse"
        },
        {
            date: "2026-04-13",
            title: "Comet 2026/S1 Perihelion",
            description: "A newly discovered comet reaches its closest point to the Sun, potentially visible to the naked eye.",
            type: "other"
        },
        {
            date: "2026-08-12",
            title: "Perseids Meteor Shower Peak",
            description: "One of the best meteor showers of the year, producing up to 100 meteors per hour.",
            type: "meteor-shower"
        },
        {
            date: "2026-10-06",
            title: "Mars at Opposition",
            description: "Mars will be brighter than any other star or planet in the night sky, offering excellent viewing.",
            type: "conjunction"
        }
    ]
};
