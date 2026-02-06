export interface TimelineEvent {
    year: number;
    title: string;
    description: string;
    facts: string[];
    videoUrl: string; // YouTube embed URL
    videoId: string; // YouTube video ID
    thumbnail: string;
    significance: 'critical' | 'major';
    category: 'satellites' | 'human-spaceflight' | 'space-stations' | 'spacecraft' | 'telescopes' | 'mars-exploration' | 'deep-space' | 'commercial-space';
}

export const SPACE_TIMELINE_EVENTS: TimelineEvent[] = [
    {
        year: 1957,
        title: "Sputnik 1 - First Artificial Satellite",
        description: "The Soviet Union launched Sputnik 1, humanity's first artificial satellite. This 58cm sphere with four radio antennas marked the beginning of the Space Age and triggered the Space Race between the USSR and USA.",
        facts: [
            "Orbited Earth every 96 minutes",
            "Transmitted radio signals for 21 days",
            "Burned up in atmosphere after 3 months",
            "Sparked creation of NASA in 1958"
        ],
        videoUrl: "https://www.youtube.com/embed/DTDb3eKpPiw",
        videoId: "DTDb3eKpPiw",
        thumbnail: "https://img.youtube.com/vi/DTDb3eKpPiw/maxresdefault.jpg",
        significance: "critical",
        category: "satellites"
    },
    {
        year: 1961,
        title: "Yuri Gagarin - First Human in Space",
        description: "Soviet cosmonaut Yuri Gagarin became the first human to journey into outer space aboard Vostok 1. His 108-minute orbital flight made him an international hero and proved humans could survive space travel.",
        facts: [
            "Single orbit around Earth",
            "Reached altitude of 327 km",
            "Ejected and parachuted separately from capsule",
            "Famous quote: 'The Earth is blue'"
        ],
        videoUrl: "https://www.youtube.com/embed/KANuFlelQ5k",
        videoId: "KANuFlelQ5k",
        thumbnail: "https://img.youtube.com/vi/KANuFlelQ5k/maxresdefault.jpg",
        significance: "critical",
        category: "human-spaceflight"
    },
    {
        year: 1969,
        title: "Apollo 11 - First Humans on the Moon",
        description: "NASA's Apollo 11 mission achieved President Kennedy's goal of landing humans on the Moon. Neil Armstrong and Buzz Aldrin spent 21 hours on the lunar surface while Michael Collins orbited above.",
        facts: [
            "Neil Armstrong's first words: 'That's one small step for man...'",
            "Collected 21.5 kg of lunar material",
            "Left American flag and footprints (still there)",
            "Watched by 650 million people on TV"
        ],
        videoUrl: "https://www.youtube.com/embed/cwZb2mqId0A",
        videoId: "cwZb2mqId0A",
        thumbnail: "https://img.youtube.com/vi/cwZb2mqId0A/maxresdefault.jpg",
        significance: "critical",
        category: "human-spaceflight"
    },
    {
        year: 1971,
        title: "Salyut 1 - First Space Station",
        description: "The Soviet Union launched Salyut 1, the world's first space station. Though the first crew died during re-entry, it pioneered long-duration spaceflight and orbital laboratory research.",
        facts: [
            "Operated for 175 days in orbit",
            "Length: 15 meters",
            "One successful crewed mission (23 days)",
            "Foundation for future stations"
        ],
        videoUrl: "https://www.youtube.com/embed/hWUJi4uhreg",
        videoId: "hWUJi4uhreg",
        thumbnail: "https://img.youtube.com/vi/hWUJi4uhreg/maxresdefault.jpg",
        significance: "major",
        category: "space-stations"
    },
    {
        year: 1981,
        title: "Space Shuttle Columbia - First Reusable Spacecraft",
        description: "NASA's Space Shuttle Columbia completed the first orbital test flight of the Space Shuttle program. This marked the beginning of the era of reusable spacecraft, revolutionizing space access.",
        facts: [
            "First spacecraft to land like an airplane",
            "Flew 28 missions over 22 years",
            "Could carry 7 crew members",
            "Tragically lost in 2003 on re-entry"
        ],
        videoUrl: "https://www.youtube.com/embed/uVVZMEwtqS8",
        videoId: "uVVZMEwtqS8",
        thumbnail: "https://img.youtube.com/vi/uVVZMEwtqS8/maxresdefault.jpg",
        significance: "critical",
        category: "spacecraft"
    },
    {
        year: 1990,
        title: "Hubble Space Telescope Launch",
        description: "NASA deployed the Hubble Space Telescope into low Earth orbit. Despite initial mirror problems, it became humanity's most important optical telescope, revolutionizing our understanding of the universe.",
        facts: [
            "Orbits at 547 km altitude",
            "Travels at 27,000 km/h",
            "Has observed over 50,000 celestial objects",
            "Still operational after 30+ years"
        ],
        videoUrl: "https://www.youtube.com/embed/lzBO4LdxYl0",
        videoId: "lzBO4LdxYl0",
        thumbnail: "https://img.youtube.com/vi/lzBO4LdxYl0/maxresdefault.jpg",
        significance: "critical",
        category: "telescopes"
    },
    {
        year: 1998,
        title: "International Space Station (ISS) - First Module",
        description: "Russia launched Zarya, the first module of the International Space Station. This began the largest international space cooperation project, with 15 nations contributing to its construction.",
        facts: [
            "Size of a football field",
            "Continuously inhabited since 2000",
            "Orbits Earth every 90 minutes",
            "Visible from Earth with naked eye"
        ],
        videoUrl: "https://www.youtube.com/embed/SGP6Y0Pnhe4",
        videoId: "SGP6Y0Pnhe4",
        thumbnail: "https://img.youtube.com/vi/SGP6Y0Pnhe4/maxresdefault.jpg",
        significance: "critical",
        category: "space-stations"
    },
    {
        year: 2004,
        title: "Spirit and Opportunity - Mars Rovers",
        description: "NASA's twin rovers Spirit and Opportunity landed on Mars to search for evidence of past water. Opportunity continued operating for 15 years, far exceeding its 90-day mission.",
        facts: [
            "Spirit lasted 6 years (designed for 90 days)",
            "Opportunity lasted 15 years",
            "Traveled 45 km on Mars",
            "Confirmed Mars once had liquid water"
        ],
        videoUrl: "https://www.youtube.com/embed/8sHRwBKBiMY",
        videoId: "8sHRwBKBiMY",
        thumbnail: "https://img.youtube.com/vi/8sHRwBKBiMY/maxresdefault.jpg",
        significance: "major",
        category: "mars-exploration"
    },
    {
        year: 2012,
        title: "Curiosity Rover - Mars Science Laboratory",
        description: "NASA's Curiosity rover successfully landed on Mars using an innovative 'sky crane' system. Car-sized and nuclear-powered, it continues searching for signs of ancient microbial life.",
        facts: [
            "Size of a small car (900 kg)",
            "Nuclear-powered (plutonium battery)",
            "Has 17 cameras",
            "Still active, exploring Gale Crater"
        ],
        videoUrl: "https://www.youtube.com/embed/BudlaGh1A0o",
        videoId: "BudlaGh1A0o",
        thumbnail: "https://img.youtube.com/vi/BudlaGh1A0o/maxresdefault.jpg",
        significance: "critical",
        category: "mars-exploration"
    },
    {
        year: 2015,
        title: "New Horizons - First Pluto Flyby",
        description: "After a 9.5-year journey, NASA's New Horizons spacecraft made the first close flyby of Pluto, revealing a geologically active world with nitrogen ice plains and 3.5km high mountains.",
        facts: [
            "Traveled 5 billion km to reach Pluto",
            "Flyby speed: 50,000 km/h",
            "Discovered Pluto's heart-shaped glacier",
            "Continues into Kuiper Belt"
        ],
        videoUrl: "https://www.youtube.com/embed/g1fPhhTT2Oo",
        videoId: "g1fPhhTT2Oo",
        thumbnail: "https://img.youtube.com/vi/g1fPhhTT2Oo/maxresdefault.jpg",
        significance: "major",
        category: "deep-space"
    },
    {
        year: 2020,
        title: "SpaceX Crew Dragon - Commercial Crew Program",
        description: "SpaceX's Crew Dragon Demo-2 mission marked the first commercial spacecraft to carry humans to the ISS. This historic flight restored America's ability to launch astronauts from US soil.",
        facts: [
            "First private company to send humans to orbit",
            "Fully autonomous docking",
            "Can carry 7 crew members",
            "Reusable spacecraft"
        ],
        videoUrl: "https://www.youtube.com/embed/xY96v0OIcK4",
        videoId: "xY96v0OIcK4",
        thumbnail: "https://img.youtube.com/vi/xY96v0OIcK4/maxresdefault.jpg",
        significance: "critical",
        category: "commercial-space"
    },
    {
        year: 2021,
        title: "James Webb Space Telescope Launch",
        description: "NASA launched the James Webb Space Telescope, the most powerful space telescope ever built. With its 6.5m gold-coated mirror, it observes the universe in infrared, seeing farther than ever before.",
        facts: [
            "100x more powerful than Hubble",
            "Orbits Sun at L2 point (1.5M km from Earth)",
            "Mirror made of 18 gold-coated segments",
            "Can see galaxies from 13.6 billion years ago"
        ],
        videoUrl: "https://www.youtube.com/embed/7nT7JGZMbtM",
        videoId: "7nT7JGZMbtM",
        thumbnail: "https://img.youtube.com/vi/7nT7JGZMbtM/maxresdefault.jpg",
        significance: "critical",
        category: "telescopes"
    },
    {
        year: 2023,
        title: "Artemis I - Return to the Moon",
        description: "NASA's Artemis I mission successfully tested the Space Launch System (SLS) and Orion spacecraft in an uncrewed flight around the Moon, paving the way for humans to return to the lunar surface.",
        facts: [
            "SLS is the most powerful rocket ever built",
            "Orion traveled 2.2 million km",
            "Reached 432,000 km from Earth",
            "Sets stage for Artemis II (crewed) in 2025"
        ],
        videoUrl: "https://www.youtube.com/embed/Ke6XX8FHOHM",
        videoId: "Ke6XX8FHOHM",
        thumbnail: "https://img.youtube.com/vi/Ke6XX8FHOHM/maxresdefault.jpg",
        significance: "critical",
        category: "human-spaceflight"
    },
    {
        year: 2024,
        title: "Europa Clipper - Search for Life",
        description: "NASA launched Europa Clipper to Jupiter's moon Europa to investigate its subsurface ocean. This mission will determine if Europa's ocean could harbor life, one of humanity's most profound questions.",
        facts: [
            "Will make 49 flybys of Europa",
            "Arrives at Jupiter in 2030",
            "Europa's ocean may contain 2x Earth's water",
            "Ice shell is 15-25 km thick"
        ],
        videoUrl: "https://www.youtube.com/embed/AEyOoZ7JpyY",
        videoId: "AEyOoZ7JpyY",
        thumbnail: "https://img.youtube.com/vi/AEyOoZ7JpyY/maxresdefault.jpg",
        significance: "major",
        category: "deep-space"
    }
];

export const FUTURE_TIMELINE_EVENTS: TimelineEvent[] = [
    {
        year: 2026,
        title: "Artemis II - Crewed Lunar Flyby",
        description: "NASA's Artemis II will be the first crewed mission to the Moon since 1972. A crew of four will perform a 10-day lunar flyby to validate the Orion spacecraft's life support systems before landing missions begin.",
        facts: [
            "Crew: Wiseman, Glover, Koch, Hansen",
            "Launch: No Earlier Than (NET) March 2026",
            "First woman and person of color on a lunar mission",
            "Mission Duration: ~10 days"
        ],
        videoUrl: "https://www.youtube.com/embed/uPOjG7Nc-Ps",
        videoId: "uPOjG7Nc-Ps",
        thumbnail: "https://img.youtube.com/vi/uPOjG7Nc-Ps/maxresdefault.jpg",
        significance: "critical",
        category: "human-spaceflight"
    },
    {
        year: 2026,
        title: "MMX - Martian Moons eXploration",
        description: "JAXA's MMX mission will explore Mars' moons, Phobos and Deimos. It aims to land on Phobos, deploy a rover (IDEFIX), and return samples to Earth to determine the moons' origins.",
        facts: [
            "Launch: Late 2026",
            "First sample return from a Martian moon",
            "Carries French-German rover 'IDEFIX'",
            "Sample Return to Earth: ~2031"
        ],
        videoUrl: "https://www.youtube.com/embed/-a0e8AKOWg0",
        videoId: "-a0e8AKOWg0",
        thumbnail: "https://img.youtube.com/vi/-a0e8AKOWg0/maxresdefault.jpg",
        significance: "major",
        category: "deep-space"
    },
    {
        year: 2027,
        title: "Gaganyaan - India's Crewed Mission",
        description: "ISRO's first crewed spaceflight mission. It will launch 3 astronauts into a 400 km orbit for a 3-day mission, demonstrating India's human spaceflight capability.",
        facts: [
            "Launch: Planned for 2027 (Uncrewed G1 in 2026)",
            "Launch Vehicle: LVM3 (Human Rated)",
            "Crew Module: 5.3 metric tons",
            "Splashdown: Indian Ocean"
        ],
        videoUrl: "https://www.youtube.com/embed/aTQ2EZYtJ04",
        videoId: "aTQ2EZYtJ04",
        thumbnail: "https://img.youtube.com/vi/aTQ2EZYtJ04/maxresdefault.jpg",
        significance: "critical",
        category: "human-spaceflight"
    },
    {
        year: 2028,
        title: "Chandrayaan-4 - Lunar Sample Return",
        description: "ISRO's ambitious mission to collect and return lunar soil to Earth. Unlike previous missions, Chandrayaan-4 involves a complex multi-launch architecture where different modules will launch separately and dock in lunar orbit before descending to the surface.",
        facts: [
            "First Indian mission to bring back lunar soil",
            "Involves two separate LVM3 rocket launches",
            "Modules will dock and undock in lunar orbit",
            "Targeting the lunar South Pole region (Shiv Shakti Point area)"
        ],
        videoUrl: "https://www.youtube.com/embed/GIsjx78A-Xg",
        videoId: "GIsjx78A-Xg",
        thumbnail: "https://img.youtube.com/vi/GIsjx78A-Xg/maxresdefault.jpg",
        significance: "critical",
        category: "deep-space"
    },
    {
        year: 2028,
        title: "Dragonfly - Titan Rotorcraft",
        description: "NASA's nuclear-powered drone will fly on Saturn's moon Titan. It will hop between locations to analyze the moon's prebiotic chemistry and dense atmosphere.",
        facts: [
            "Launch: July 2028",
            "First powered flight on another planet's moon",
            "Nuclear powered (MMRTG)",
            "Titan has a dense nitrogen atmosphere"
        ],
        videoUrl: "https://www.youtube.com/embed/QBsoAw3kdsc",
        videoId: "QBsoAw3kdsc",
        thumbnail: "https://img.youtube.com/vi/QBsoAw3kdsc/maxresdefault.jpg",
        significance: "major",
        category: "deep-space"
    },
    {
        year: 2028,
        title: "Tianwen-3 - Mars Sample Return",
        description: "China's ambitious mission to collect Martian surface samples and return them to Earth. If successful, it could be the first mission to bring Mars rocks back to humanity.",
        facts: [
            "Launch: Late 2028",
            "Two launches: Lander & Orbiter",
            "Uses robotic arm and drill",
            "Sample Return: ~2031"
        ],
        videoUrl: "https://www.youtube.com/embed/jdMQAfEIE0k",
        videoId: "jdMQAfEIE0k",
        thumbnail: "https://img.youtube.com/vi/jdMQAfEIE0k/maxresdefault.jpg",
        significance: "critical",
        category: "deep-space"
    },
    {
        year: 2028,
        title: "ExoMars - Rosalind Franklin Rover",
        description: "ESA's rover will search for signs of past life on Mars. It features a unique drill capable of extracting samples from 2 meters deep, protecting them from surface radiation.",
        facts: [
            "Launch: Late 2028 (with NASA partnership)",
            "Drill Depth: 2 meters (6.5 ft)",
            "Landing Site: Oxia Planum",
            "Laboratory: Onboard molecular analysis"
        ],
        videoUrl: "https://www.youtube.com/embed/22H-it-R--I",
        videoId: "22H-it-R--I",
        thumbnail: "https://img.youtube.com/vi/22H-it-R--I/maxresdefault.jpg",
        significance: "major",
        category: "deep-space"
    }
];

