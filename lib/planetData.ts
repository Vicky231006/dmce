interface PlanetData {
    overview: string;
    type: string;
    diameter: string;
    mass: string;
    gravity: string;
    dayLength: string;
    yearLength: string;
    distanceFromSun: string;
    moons: string;
    discovery: string;
    facts: string[];
    atmosphere?: Array<{ name: string; percentage: number }>;
    structure: Array<{ name: string; description: string }>;
    surfaceComposition?: string;
    temperature: {
        average: string;
        range: string;
    };
}

export const PLANET_DATA: Record<string, PlanetData> = {
    sun: {
        overview: "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core. The Sun radiates this energy mainly as light, ultraviolet, and infrared radiation, and is the most important source of energy for life on Earth.",
        type: "Yellow Dwarf Star",
        diameter: "1.4 million km",
        mass: "1.989 × 10³⁰ kg",
        gravity: "274 m/s²",
        dayLength: "25 Earth days (Equator)",
        yearLength: "230 million years (Galactic Year)",
        distanceFromSun: "0 km (Center)",
        moons: "8 Planets (Satellites)",
        discovery: "Known since prehistoric times.",
        facts: [
            "The Sun accounts for 99.86% of the mass in the solar system",
            "One million Earths could fit inside the Sun",
            "The Sun travels at 220 km per second around the Milky Way",
            "Light from the Sun takes 8 minutes and 20 seconds to reach Earth"
        ],
        atmosphere: [
            { name: "Hydrogen", percentage: 73.46 },
            { name: "Helium", percentage: 24.85 },
            { name: "Oxygen", percentage: 0.77 },
            { name: "Carbon", percentage: 0.29 }
        ],
        structure: [
            { name: "Core", description: "Nuclear fusion reactor (15 million °C)" },
            { name: "Radiative Zone", description: "Energy travels outwards as photons" },
            { name: "Convective Zone", description: "Hot plasma rises, cools, and sinks" },
            { name: "Photosphere", description: "Visible surface (5,500 °C)" },
            { name: "Corona", description: "Outermost atmosphere (1 million °C)" }
        ],
        surfaceComposition: "Composed entirely of hydrogen and helium plasma. There is no solid surface.",
        temperature: {
            average: "5,500°C (Surface)",
            range: "15,000,000°C (Core)"
        }
    },
    mercury: {
        overview: "Mercury is the smallest planet in our solar system and the closest to the Sun. Its surface resembles our Moon, covered with impact craters. Despite being the closest planet to the Sun, it's not the hottest due to its lack of atmosphere.",
        type: "Terrestrial",
        diameter: "4,879 km",
        mass: "3.3 × 10²³ kg",
        gravity: "3.7 m/s²",
        dayLength: "176 Earth days",
        yearLength: "88 Earth days",
        distanceFromSun: "57.9 million km",
        moons: "0",
        discovery: "Known to ancient civilizations; first observed through telescope by Galileo Galilei in the early 1600s.",
        facts: [
            "Mercury has no atmosphere to trap heat, so temperatures vary wildly from -173°C at night to 427°C during the day",
            "A year on Mercury is shorter than its day",
            "Mercury is shrinking as its core cools",
            "You could fit Mercury inside the Atlantic Ocean"
        ],
        atmosphere: [
            { name: "Oxygen", percentage: 42 },
            { name: "Sodium", percentage: 29 },
            { name: "Hydrogen", percentage: 22 },
            { name: "Helium", percentage: 6 },
            { name: "Potassium", percentage: 1 }
        ],
        structure: [
            { name: "Core", description: "Large iron core (75% of planet's diameter)" },
            { name: "Mantle", description: "Silicate rock layer" },
            { name: "Crust", description: "Thin rocky surface with craters" }
        ],
        surfaceComposition: "Rocky surface composed primarily of silicate rocks and metals, heavily cratered from billions of years of asteroid impacts.",
        temperature: {
            average: "167°C",
            range: "-173°C to 427°C"
        }
    },

    venus: {
        overview: "Venus is the second planet from the Sun and Earth's closest planetary neighbor. Often called Earth's twin due to similar size, Venus has a thick toxic atmosphere that traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system.",
        type: "Terrestrial",
        diameter: "12,104 km",
        mass: "4.87 × 10²⁴ kg",
        gravity: "8.9 m/s²",
        dayLength: "243 Earth days",
        yearLength: "225 Earth days",
        distanceFromSun: "108.2 million km",
        moons: "0",
        discovery: "Known to ancient civilizations; observed by Galileo Galilei in 1610.",
        facts: [
            "Venus rotates backwards compared to most planets (retrograde rotation)",
            "A day on Venus is longer than a year on Venus",
            "Venus is the brightest natural object in the night sky after the Moon",
            "The surface pressure is 92 times that of Earth—equivalent to being 900m underwater"
        ],
        atmosphere: [
            { name: "Carbon Dioxide", percentage: 96.5 },
            { name: "Nitrogen", percentage: 3.5 },
            { name: "Sulfur Dioxide", percentage: 0.015 }
        ],
        structure: [
            { name: "Core", description: "Iron core (partially molten)" },
            { name: "Mantle", description: "Rocky mantle" },
            { name: "Crust", description: "Volcanic surface with lava plains" }
        ],
        surfaceComposition: "Volcanic rock and lava plains cover most of the surface. The planet has more volcanoes than any other planet in the solar system.",
        temperature: {
            average: "464°C",
            range: "462°C to 471°C"
        }
    },

    earth: {
        overview: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is covered with water, and the atmosphere protects life from harmful solar radiation.",
        type: "Terrestrial",
        diameter: "12,742 km",
        mass: "5.97 × 10²⁴ kg",
        gravity: "9.8 m/s²",
        dayLength: "24 hours",
        yearLength: "365.25 days",
        distanceFromSun: "149.6 million km",
        moons: "1 (The Moon)",
        discovery: "N/A - Our home planet",
        facts: [
            "Earth is the only planet not named after a god",
            "Earth's rotation is gradually slowing down",
            "The Earth's core is as hot as the surface of the Sun (6,000°C)",
            "Earth's magnetic field protects us from solar wind"
        ],
        atmosphere: [
            { name: "Nitrogen", percentage: 78 },
            { name: "Oxygen", percentage: 21 },
            { name: "Argon", percentage: 0.9 },
            { name: "Carbon Dioxide", percentage: 0.04 }
        ],
        structure: [
            { name: "Inner Core", description: "Solid iron-nickel core" },
            { name: "Outer Core", description: "Liquid iron-nickel layer" },
            { name: "Mantle", description: "Thick layer of hot rock" },
            { name: "Crust", description: "Thin solid outermost layer" }
        ],
        surfaceComposition: "71% water (oceans, lakes, rivers), 29% land (continents, islands). Diverse geology including mountains, valleys, plains, and polar ice caps.",
        temperature: {
            average: "15°C",
            range: "-89°C to 58°C"
        }
    },

    mars: {
        overview: "Mars is the fourth planet from the Sun and the second-smallest planet. Often called the Red Planet due to iron oxide (rust) on its surface. Mars has the largest volcano and the deepest canyon in the solar system.",
        type: "Terrestrial",
        diameter: "6,779 km",
        mass: "6.42 × 10²³ kg",
        gravity: "3.7 m/s²",
        dayLength: "24.6 hours",
        yearLength: "687 Earth days",
        distanceFromSun: "227.9 million km",
        moons: "2 (Phobos, Deimos)",
        discovery: "Known to ancient civilizations; first telescopic observation by Galileo Galilei in 1610.",
        facts: [
            "Mars has the largest dust storms in the solar system, lasting for months",
            "Olympus Mons on Mars is the tallest volcano in the solar system (21 km high)",
            "Mars has ice caps at both poles made of water and carbon dioxide",
            "A year on Mars has 687 Earth days but 668 Martian days (sols)"
        ],
        atmosphere: [
            { name: "Carbon Dioxide", percentage: 95.3 },
            { name: "Nitrogen", percentage: 2.7 },
            { name: "Argon", percentage: 1.6 },
            { name: "Oxygen", percentage: 0.13 }
        ],
        structure: [
            { name: "Core", description: "Iron, nickel, and sulfur core" },
            { name: "Mantle", description: "Silicate rock mantle" },
            { name: "Crust", description: "Rocky crust rich in iron oxide" }
        ],
        surfaceComposition: "Iron-rich rocky surface giving the planet its distinctive red color. Features massive volcanoes, deep canyons (Valles Marineris), and evidence of ancient river beds.",
        temperature: {
            average: "-63°C",
            range: "-140°C to 20°C"
        }
    },

    jupiter: {
        overview: "Jupiter is the fifth planet from the Sun and the largest in the solar system. It's a gas giant with a mass more than twice that of all other planets combined. Jupiter's Great Red Spot is a giant storm that has raged for hundreds of years.",
        type: "Gas Giant",
        diameter: "139,820 km",
        mass: "1.90 × 10²⁷ kg",
        gravity: "24.8 m/s²",
        dayLength: "10 hours",
        yearLength: "12 Earth years",
        distanceFromSun: "778.5 million km",
        moons: "95 known moons",
        discovery: "Known to ancient civilizations; Galileo discovered its four largest moons in 1610.",
        facts: [
            "Jupiter's Great Red Spot is a storm larger than Earth",
            "Jupiter has the shortest day of all planets (10 hours)",
            "Jupiter's magnetic field is 20,000 times stronger than Earth's",
            "If Jupiter were hollow, more than 1,000 Earths could fit inside"
        ],
        atmosphere: [
            { name: "Hydrogen", percentage: 90 },
            { name: "Helium", percentage: 10 },
            { name: "Methane", percentage: 0.3 },
            { name: "Ammonia", percentage: 0.026 }
        ],
        structure: [
            { name: "Core", description: "Dense core of rock, metal, and hydrogen compounds" },
            { name: "Metallic Hydrogen", description: "Layer of liquid metallic hydrogen" },
            { name: "Molecular Hydrogen", description: "Thick layer of liquid hydrogen" },
            { name: "Atmosphere", description: "Gaseous outer layer with visible cloud bands" }
        ],
        temperature: {
            average: "-110°C",
            range: "-145°C (cloud tops)"
        }
    },

    saturn: {
        overview: "Saturn is the sixth planet from the Sun and the second-largest in the solar system. Famous for its spectacular ring system, Saturn is a gas giant made mostly of hydrogen and helium. It's the least dense planet—it would float in water!",
        type: "Gas Giant",
        diameter: "116,460 km",
        mass: "5.68 × 10²⁶ kg",
        gravity: "10.4 m/s²",
        dayLength: "10.7 hours",
        yearLength: "29 Earth years",
        distanceFromSun: "1.43 billion km",
        moons: "146 known moons",
        discovery: "Known to ancient civilizations; Galileo first observed through telescope in 1610; rings discovered by Christiaan Huygens in 1655.",
        facts: [
            "Saturn's rings are made of billions of pieces of ice and rock",
            "Saturn is the least dense planet and would float on water",
            "A day on Saturn is only 10.7 hours long",
            "Saturn's moon Titan has a dense atmosphere and liquid methane lakes"
        ],
        atmosphere: [
            { name: "Hydrogen", percentage: 96 },
            { name: "Helium", percentage: 3 },
            { name: "Methane", percentage: 0.4 },
            { name: "Ammonia", percentage: 0.01 }
        ],
        structure: [
            { name: "Core", description: "Dense core of rock and ice" },
            { name: "Metallic Hydrogen", description: "Layer of liquid metallic hydrogen" },
            { name: "Molecular Hydrogen", description: "Thick layer of liquid hydrogen" },
            { name: "Atmosphere", description: "Gaseous outer layer" },
            { name: "Rings", description: "Iconic ring system made of ice and rock particles" }
        ],
        temperature: {
            average: "-140°C",
            range: "-178°C (cloud tops)"
        }
    },

    uranus: {
        overview: "Uranus is the seventh planet from the Sun and the third-largest. It's an ice giant with a unique sideways rotation—its axis is tilted by 98 degrees. This gives Uranus extreme seasons that last over 20 years each.",
        type: "Ice Giant",
        diameter: "50,724 km",
        mass: "8.68 × 10²⁵ kg",
        gravity: "8.7 m/s²",
        dayLength: "17.2 hours",
        yearLength: "84 Earth years",
        distanceFromSun: "2.87 billion km",
        moons: "27 known moons",
        discovery: "Discovered by William Herschel in 1781—first planet discovered with a telescope.",
        facts: [
            "Uranus rotates on its side (98° tilt)",
            "Uranus is the coldest planet in the solar system (-224°C)",
            "A season on Uranus lasts about 21 Earth years",
            "Uranus appears blue-green due to methane in its atmosphere"
        ],
        atmosphere: [
            { name: "Hydrogen", percentage: 83 },
            { name: "Helium", percentage: 15 },
            { name: "Methane", percentage: 2.3 }
        ],
        structure: [
            { name: "Core", description: "Rocky core with ice" },
            { name: "Mantle", description: "Icy mantle of water, methane, and ammonia" },
            { name: "Atmosphere", description: "Gaseous layer of hydrogen, helium, and methane" }
        ],
        temperature: {
            average: "-195°C",
            range: "-224°C (coldest recorded)"
        }
    },

    neptune: {
        overview: "Neptune is the eighth and farthest planet from the Sun. It's an ice giant with the strongest winds in the solar system, reaching speeds of 2,100 km/h. Neptune was the first planet located through mathematical predictions rather than observation.",
        type: "Ice Giant",
        diameter: "49,244 km",
        mass: "1.02 × 10²⁶ kg",
        gravity: "11.2 m/s²",
        dayLength: "16 hours",
        yearLength: "165 Earth years",
        distanceFromSun: "4.5 billion km",
        moons: "14 known moons",
        discovery: "Predicted mathematically by Urbain Le Verrier and discovered by Johann Galle in 1846.",
        facts: [
            "Neptune has the strongest winds in the solar system",
            "Neptune was discovered through mathematics before being seen",
            "A year on Neptune equals 165 Earth years",
            "Neptune's moon Triton orbits backwards (retrograde)"
        ],
        atmosphere: [
            { name: "Hydrogen", percentage: 80 },
            { name: "Helium", percentage: 19 },
            { name: "Methane", percentage: 1.5 }
        ],
        structure: [
            { name: "Core", description: "Rocky core with ice" },
            { name: "Mantle", description: "Icy mantle of water, methane, and ammonia" },
            { name: "Atmosphere", description: "Deep atmosphere with dynamic weather systems" }
        ],
        temperature: {
            average: "-200°C",
            range: "-218°C (cloud tops)"
        }
    },

    pluto: {
        overview: "Pluto is a dwarf planet in the Kuiper Belt, a ring of icy bodies beyond Neptune. Once considered the ninth planet, it was reclassified in 2006. Despite its small size, Pluto has five known moons and a heart-shaped glacier on its surface.",
        type: "Dwarf Planet",
        diameter: "2,376 km",
        mass: "1.31 × 10²² kg",
        gravity: "0.6 m/s²",
        dayLength: "6.4 Earth days",
        yearLength: "248 Earth years",
        distanceFromSun: "5.9 billion km",
        moons: "5 (Charon, Styx, Nix, Kerberos, Hydra)",
        discovery: "Discovered by Clyde Tombaugh in 1930; visited by New Horizons spacecraft in 2015.",
        facts: [
            "Pluto's largest moon Charon is so big that Pluto and Charon orbit each other",
            "Pluto has a heart-shaped glacier called Tombaugh Regio",
            "A year on Pluto lasts 248 Earth years",
            "Pluto hasn't completed one full orbit since its discovery in 1930"
        ],
        atmosphere: [
            { name: "Nitrogen", percentage: 90 },
            { name: "Methane", percentage: 10 },
            { name: "Carbon Monoxide", percentage: 0.5 }
        ],
        structure: [
            { name: "Core", description: "Rocky core" },
            { name: "Ice Mantle", description: "Water ice mantle" },
            { name: "Crust", description: "Frozen nitrogen, methane, and carbon monoxide" }
        ],
        surfaceComposition: "Surface covered in frozen nitrogen, methane, and carbon monoxide ice. Features mountains made of water ice and a smooth plain (Sputnik Planitia).",
        temperature: {
            average: "-232°C",
            range: "-240°C to -218°C"
        }
    },

    moon: {
        overview: "The Moon is Earth's only natural satellite and the fifth-largest moon in the solar system. It's the brightest object in our night sky and has been a source of wonder throughout human history. The Moon's gravitational influence produces ocean tides on Earth.",
        type: "Natural Satellite",
        diameter: "3,474 km",
        mass: "7.35 × 10²² kg",
        gravity: "1.6 m/s²",
        dayLength: "27.3 Earth days",
        yearLength: "27.3 Earth days (same as day)",
        distanceFromSun: "149.6 million km (orbits Earth)",
        moons: "0",
        discovery: "Known since prehistoric times; first humans landed in 1969 (Apollo 11).",
        facts: [
            "The Moon is gradually moving away from Earth at 3.8 cm per year",
            "The same side of the Moon always faces Earth (tidal locking)",
            "Moon dust smells like gunpowder according to Apollo astronauts",
            "The Moon's surface has over 300,000 craters larger than 1 km"
        ],
        structure: [
            { name: "Core", description: "Small iron-rich core" },
            { name: "Mantle", description: "Rocky mantle" },
            { name: "Crust", description: "Rocky crust covered in regolith (moon dust)" }
        ],
        surfaceComposition: "Rocky surface covered in regolith (fine dust). Features include maria (dark volcanic plains), highlands (bright mountainous regions), and countless impact craters.",
        temperature: {
            average: "-23°C",
            range: "-173°C to 127°C"
        }
    }
};
