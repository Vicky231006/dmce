export interface LessonNarration {
    timestamp: number; // Seconds from start
    text: string;
    duration: number; // How long to display
}

export interface LessonAnimation {
    timestamp: number;
    type: 'particle-burst' | 'sphere-grow' | 'orbit-start' | 'color-change' | 'camera-move' | 'universe-expand' | 'atoms-form' | 'cmb-glow' | 'stars-ignite' | 'nebula-spin' | 'collapse' | 'supernova' | 'disk-spin' | 'planetesimals' | 'gravity-lines' | 'habitable-zone';
    params: any; // Animation-specific parameters
}

export interface LessonInteractive {
    id: string;
    label: string;
    type: 'slider' | 'toggle' | 'button';
    position: { x: number; y: number }; // Screen position (percentage)
    effect: (value: any) => void; // What it controls (handled in component)
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface Lesson {
    id: string;
    title: string;
    icon: string;
    duration: number; // Total seconds
    xpReward: number;
    isPremium?: boolean;
    narration: LessonNarration[];
    animations: LessonAnimation[];
    interactiveControls: LessonInteractive[];
    quiz: QuizQuestion[];
}

// LESSON 1: THE BIG BANG
export const LESSON_BIG_BANG: Lesson = {
    id: 'big-bang',
    title: 'The Big Bang',
    icon: '💥',
    duration: 45, // Compressed from 55s
    xpReward: 100,

    narration: [
        { timestamp: 0, text: "13.8 billion years ago, the universe began as a singularity.", duration: 2 },
        { timestamp: 2, text: "BANG! Space expanded faster than light. Energy burst outward.", duration: 4 },
        { timestamp: 6, text: "It was too hot for atoms. Only quarks and photons existed. Click them!", duration: 6 },
        { timestamp: 16, text: "After 380,000 years, atoms formed. Click the Hydrogen atom!", duration: 6 },
        { timestamp: 26, text: "First light! The Cosmic Microwave Background radiation released.", duration: 5 },
        { timestamp: 33, text: "Gravity pulled atoms together to form the first stars.", duration: 6 }
    ],

    animations: [
        { timestamp: 0, type: 'camera-move', params: { position: [0, 0, 50], lookAt: [0, 0, 0], duration: 2 } },
        { timestamp: 2, type: 'particle-burst', params: { origin: [0, 0, 0], count: 5000, velocity: 50, color: 0xffffff, trail: true, duration: 10 } },
        { timestamp: 4, type: 'universe-expand', params: { scale: { from: 1, to: 100 }, duration: 20, grid: true } },
        { timestamp: 16, type: 'atoms-form', params: { count: 500, electronOrbitSpeed: 2, showLabels: true, duration: 10 } },
        { timestamp: 26, type: 'cmb-glow', params: { color: 0xff6600, intensity: 0.8, pulse: true, duration: 8 } },
        { timestamp: 33, type: 'stars-ignite', params: { count: 200, fadeInDuration: 5, brightness: 1.5, duration: 10 } }
    ],

    interactiveControls: [],

    quiz: [
        { question: "How old is our universe?", options: ["6,000 years", "4.5 billion years", "13.8 billion years", "Infinite"], correctAnswer: 2, explanation: "The Big Bang occurred 13.8 billion years ago." },
        { question: "What was the first element?", options: ["Carbon", "Oxygen", "Hydrogen", "Iron"], correctAnswer: 2, explanation: "Hydrogen was the first and lightest atom to form." },
        { question: "What is the Cosmic Microwave Background(CMB)?", options: ["Star light", "Big Bang afterglow", "Radio signals", "Black hole energy"], correctAnswer: 1, explanation: "The CMB is ancient light released when atoms first formed." },
        { question: "What existed before the Big Bang?", options: ["Another universe", "Nothing (no space/time)", "Empty space", "A star"], correctAnswer: 1, explanation: "Time itself began at the Big Bang." },
        { question: "We are made of...", options: ["Earth mud", "Stardust", "Water", "Chemicals"], correctAnswer: 1, explanation: "Our atoms were forged in ancient stars." }
    ]
};

// LESSON 2: STAR LIFE CYCLE
export const LESSON_STAR_CYCLE: Lesson = {
    id: 'star-cycle',
    title: 'Star Life Cycle',
    icon: '⭐',
    duration: 80, // 1:20
    xpReward: 100,
    narration: [
        { timestamp: 0, text: "Stars are born in nebulas - giant clouds of dust and gas.", duration: 6 },
        { timestamp: 15, text: "Gravity pulls the cloud together until the core ignites. A star is born!", duration: 6 },
        { timestamp: 30, text: "It burns for billions of years, balancing gravity and fusion.", duration: 5 },
        { timestamp: 45, text: "When fuel runs out, it expands into a massive Red Giant.", duration: 6 },
        { timestamp: 60, text: "Massive stars end in a Supernova explosion.", duration: 5 },
        { timestamp: 70, text: "The core collapses into a Neutron Star or Black Hole.", duration: 6 }
    ],
    animations: [
        { timestamp: 0, type: 'nebula-spin', params: { color: 0xff00ff, duration: 15 } },
        { timestamp: 15, type: 'collapse', params: { duration: 10 } },
        { timestamp: 25, type: 'stars-ignite', params: { count: 1, brightness: 2, duration: 15 } },
        { timestamp: 45, type: 'sphere-grow', params: { scale: 10, color: 0xff4500, duration: 15 } },
        { timestamp: 60, type: 'supernova', params: { duration: 10 } }
    ],
    interactiveControls: [],
    quiz: [
        { question: "What pulls gas together to form a star?", options: ["Magnetism", "Gravity", "Fusion", "Electricity"], correctAnswer: 1, explanation: "Gravity pulls dust and gas together." },
        { question: "What powers a star?", options: ["Fire", "Fission", "Fusion", "Coal"], correctAnswer: 2, explanation: "Fusion converts hydrogen into helium." },
        { question: "What will our Sun become?", options: ["Black Hole", "Red Giant", "Supernova", "Neutron Star"], correctAnswer: 1, explanation: "Our Sun will expand into a Red Giant." },
        { question: "What creates gold?", options: ["Big Bang", "Small Stars", "Supernovae", "Planets"], correctAnswer: 2, explanation: "Supernovae forge heavy elements." },
        { question: "What is a black hole?", options: ["Hole in space", "Infinite density point", "Dark planet", "Antimatter"], correctAnswer: 1, explanation: "A region where gravity traps everything, even light." }
    ]
};

// LESSON 3: PLANET FORMATION
export const LESSON_PLANET_FORMATION: Lesson = {
    id: 'planet-formation',
    title: 'Planet Formation',
    icon: '🪐',
    duration: 35, // Speed up 2x (was 70)
    xpReward: 100,
    narration: [
        { timestamp: 0, text: "A disk of dust and gas spins around a young star.", duration: 3 },
        { timestamp: 7.5, text: "Dust grains collide and stick, growing into rocks.", duration: 3 },
        { timestamp: 15, text: "These rocks become planetesimals - building blocks of worlds.", duration: 3 },
        { timestamp: 22.5, text: "Near the star, only rock survives. Further out, ice forms gas giants.", duration: 3.5 },
        { timestamp: 30, text: "After millions of years, a solar system is born.", duration: 3 }
    ],
    animations: [
        { timestamp: 0, type: 'disk-spin', params: { duration: 7.5 } },
        { timestamp: 7.5, type: 'planetesimals', params: { count: 50, duration: 15 } },
        { timestamp: 22.5, type: 'camera-move', params: { position: [0, 50, 100], duration: 2.5 } }
    ],
    interactiveControls: [], // Removed Disk Temp
    quiz: [
        { question: "Where do planets come from?", options: ["Sun ejection", "Dust disk", "Asteroids", "Black holes"], correctAnswer: 1, explanation: "Planets form from the protoplanetary disk." },
        { question: "Why are inner planets rocky?", options: ["Gravity", "Too hot for gas", "Chance", "Magnetism"], correctAnswer: 1, explanation: "Heat prevents gas/ice accumulation nearby." },
        { question: "What is the Frost Line?", options: ["Space wall", "Where water freezes", "Galaxy edge", "Comet path"], correctAnswer: 1, explanation: "Distance where it's cold enough for ice." },
        { question: "How long does it take?", options: ["Days", "Years", "Millions of years", "Billions"], correctAnswer: 2, explanation: "Accretion takes millions of years." },
        { question: "Gas giants are made of...", options: ["Rock", "Hydrogen/Helium", "Water", "Iron"], correctAnswer: 1, explanation: "Mostly hydrogen and helium." }
    ]
};

// LESSON 4: GRAVITY & ORBITS
export const LESSON_GRAVITY_ORBITS: Lesson = {
    id: 'gravity-orbits',
    title: 'Gravity & Orbits',
    icon: '🌍',
    duration: 30, // Speed up 2x (was 60)
    xpReward: 100,
    narration: [
        { timestamp: 0, text: "Gravity keeps planets in orbit. It's like a constant free-fall.", duration: 3 },
        { timestamp: 7.5, text: "Throw a ball fast enough, and it curves around the Earth.", duration: 3 },
        { timestamp: 15, text: "Orbits are ellipses, not perfect circles.", duration: 2.5 },
        { timestamp: 22.5, text: "Closer planets must move faster to avoid falling in.", duration: 3 }
    ],
    animations: [
        { timestamp: 0, type: 'gravity-lines', params: { duration: 7.5 } },
        { timestamp: 7.5, type: 'orbit-start', params: { object: 'ball', speed: 'orbital', duration: 15 } }
    ],
    interactiveControls: [], // Removed Launch Speed
    quiz: [
        { question: "What is an orbit?", options: ["Floating", "Falling around Earth", "Flying", "Levitation"], correctAnswer: 1, explanation: "Constant free-fall matching the planet's curve." },
        { question: "Who discovered orbital laws?", options: ["Newton", "Einstein", "Kepler", "Galileo"], correctAnswer: 2, explanation: "Kepler described elliptical orbits." },
        { question: "If a satellite slows down...", options: ["Floats away", "Falls to Earth", "Nothing", "Spins faster"], correctAnswer: 1, explanation: "Gravity pulls it down." },
        { question: "Orbit shape?", options: ["Square", "Circle", "Ellipse", "Triangle"], correctAnswer: 2, explanation: "Orbits are elliptical." },
        { question: "Gravity in space?", options: ["No", "Yes, everywhere", "Only near planets", "Black holes only"], correctAnswer: 1, explanation: "Gravity extends infinitely." }
    ]
};

// LESSON 5: SEARCH FOR LIFE
export const LESSON_SEARCH_LIFE: Lesson = {
    id: 'search-life',
    title: 'The Search for Life',
    icon: '👽',
    duration: 37.5, // Speed up 2x (was 75)
    xpReward: 100,
    narration: [
        { timestamp: 0, text: "To find life, we look for the 'Goldilocks Zone' - just right for liquid water.", duration: 3.5 },
        { timestamp: 7.5, text: "Earth is perfect. Venus is too hot, Mars is too cold.", duration: 3 },
        { timestamp: 15, text: "We find exoplanets by watching stars dim as planets pass in front.", duration: 3.5 },
        { timestamp: 22.5, text: "We scan for biosignatures like oxygen and methane.", duration: 3 },
        { timestamp: 30, text: "With billions of stars, we are likely not alone.", duration: 3 }
    ],
    animations: [
        { timestamp: 0, type: 'habitable-zone', params: { duration: 15 } },
        { timestamp: 15, type: 'camera-move', params: { target: 'exoplanet', duration: 5 } }
    ],
    interactiveControls: [], // Removed Star Type
    quiz: [
        { question: "Goldilocks Zone?", options: ["Gold region", "Liquid water zone", "Bear zone", "Galaxy center"], correctAnswer: 1, explanation: "Temp allows liquid water." },
        { question: "Exoplanet?", options: ["Our planet", "Planet around other star", "Moon", "Asteroid"], correctAnswer: 1, explanation: "Planet outside our solar system." },
        { question: "How do we find them?", options: ["Direct sight", "Transit method", "Radio", "Probes"], correctAnswer: 1, explanation: "Dimming of stars." },
        { question: "Biosignature?", options: ["Autograph", "Chemical clue (Oxygen)", "Radio", "DNA"], correctAnswer: 1, explanation: "Gases suggesting life." },
        { question: "Drake Equation?", options: ["Gravity math", "Civilization probability", "Fuel", "Lifespan"], correctAnswer: 1, explanation: "Estimates alien civilizations." }
    ]
};

// PREMIUM LESSONS

export const LESSON_DARK_MATTER: Lesson = {
    id: 'dark-matter',
    title: 'Dark Matter & Dark Energy',
    icon: '🌑',
    duration: 80,
    xpReward: 150,
    isPremium: true,
    narration: [
        { timestamp: 0, text: "Only 5% of the universe is visible matter. The rest is dark.", duration: 6 },
        { timestamp: 15, text: "Dark matter is invisible but pulls galaxies together with gravity.", duration: 7 },
        { timestamp: 30, text: "Dark energy is even stranger — it pushes the universe apart.", duration: 6 },
        { timestamp: 45, text: "The universe is accelerating its expansion because of dark energy.", duration: 7 },
        { timestamp: 60, text: "We detect dark matter by how it bends light — gravitational lensing.", duration: 7 }
    ],
    animations: [
        { timestamp: 0, type: 'universe-expand', params: { scale: { from: 1, to: 50 }, duration: 15, grid: true } },
        { timestamp: 30, type: 'gravity-lines', params: { duration: 20 } }
    ],
    interactiveControls: [],
    quiz: [
        { question: "What percentage of the universe is visible matter?", options: ["50%", "27%", "5%", "95%"], correctAnswer: 2, explanation: "Only about 5% is ordinary matter." },
        { question: "What does dark matter do?", options: ["Emits light", "Provides gravity", "Creates black holes", "Produces heat"], correctAnswer: 1, explanation: "Dark matter has gravitational effects." },
        { question: "What does dark energy do?", options: ["Slows expansion", "Accelerates expansion", "Creates stars", "Nothing"], correctAnswer: 1, explanation: "Dark energy accelerates cosmic expansion." },
        { question: "How do we detect dark matter?", options: ["Telescopes", "Gravitational lensing", "Radio waves", "Sound"], correctAnswer: 1, explanation: "We observe how it bends light from distant objects." },
        { question: "Dark matter is made of...", options: ["Atoms", "Unknown particles", "Black holes", "Antimatter"], correctAnswer: 1, explanation: "We don't yet know what dark matter is made of." }
    ]
};

export const LESSON_STELLAR_DEATHS: Lesson = {
    id: 'stellar-deaths',
    title: 'Stellar Deaths — Supernovae & Beyond',
    icon: '💀',
    duration: 85,
    xpReward: 150,
    isPremium: true,
    narration: [
        { timestamp: 0, text: "Stars don't live forever. Their deaths shape the universe.", duration: 6 },
        { timestamp: 15, text: "Massive stars explode as supernovae — brighter than entire galaxies.", duration: 7 },
        { timestamp: 30, text: "These explosions create heavy elements like gold and uranium.", duration: 6 },
        { timestamp: 45, text: "What remains? Neutron stars or black holes.", duration: 5 },
        { timestamp: 60, text: "Smaller stars like our Sun become white dwarfs and fade away.", duration: 7 }
    ],
    animations: [
        { timestamp: 15, type: 'supernova', params: { duration: 15 } },
        { timestamp: 45, type: 'collapse', params: { duration: 10 } }
    ],
    interactiveControls: [],
    quiz: [
        { question: "What is a supernova?", options: ["New star", "Exploding star", "Black hole", "Galaxy"], correctAnswer: 1, explanation: "A supernova is a massive stellar explosion." },
        { question: "What creates gold?", options: ["Big Bang", "Stars fusing", "Supernovae", "Planets"], correctAnswer: 2, explanation: "Heavy elements are forged in supernova explosions." },
        { question: "What can a supernova leave behind?", options: ["Nothing", "Neutron star", "New galaxy", "Planet"], correctAnswer: 1, explanation: "Neutron stars or black holes remain." },
        { question: "What will our Sun become?", options: ["Black hole", "Neutron star", "White dwarf", "Supernova"], correctAnswer: 2, explanation: "Our Sun will become a white dwarf." },
        { question: "Neutron stars are...", options: ["Hot gas", "Incredibly dense", "Empty", "Made of light"], correctAnswer: 1, explanation: "Neutron stars are extremely dense." }
    ]
};

export const LESSON_BLACK_HOLES: Lesson = {
    id: 'black-holes',
    title: 'Black Holes & Spacetime',
    icon: '🕳️',
    duration: 90,
    xpReward: 150,
    isPremium: true,
    narration: [
        { timestamp: 0, text: "Black holes are regions where gravity is so strong, nothing escapes.", duration: 7 },
        { timestamp: 15, text: "They form when massive stars collapse completely.", duration: 6 },
        { timestamp: 30, text: "The event horizon is the point of no return.", duration: 5 },
        { timestamp: 45, text: "Time slows down near a black hole — this is called time dilation.", duration: 7 },
        { timestamp: 60, text: "Supermassive black holes sit at the center of most galaxies.", duration: 6 }
    ],
    animations: [
        { timestamp: 0, type: 'collapse', params: { duration: 15 } },
        { timestamp: 30, type: 'gravity-lines', params: { duration: 30 } }
    ],
    interactiveControls: [],
    quiz: [
        { question: "What is a black hole?", options: ["Empty space", "Region of extreme gravity", "Dark planet", "Wormhole"], correctAnswer: 1, explanation: "Black holes have gravity so strong nothing escapes." },
        { question: "What is the event horizon?", options: ["Black hole surface", "Point of no return", "Center", "Edge of space"], correctAnswer: 1, explanation: "The boundary beyond which nothing can escape." },
        { question: "What happens to time near a black hole?", options: ["Speeds up", "Slows down", "Stops", "Reverses"], correctAnswer: 1, explanation: "Time dilation causes time to slow down." },
        { question: "Where are supermassive black holes?", options: ["Nowhere", "Galaxy centers", "Everywhere", "Stars"], correctAnswer: 1, explanation: "Most galaxies have one at their center." },
        { question: "Can light escape a black hole?", options: ["Yes", "No", "Sometimes", "Only X-rays"], correctAnswer: 1, explanation: "Nothing can escape once past the event horizon." }
    ]
};

export const LESSON_EXOPLANETS: Lesson = {
    id: 'exoplanets',
    title: 'Exoplanets & Habitability',
    icon: '🌍',
    duration: 80,
    xpReward: 150,
    isPremium: true,
    narration: [
        { timestamp: 0, text: "Exoplanets are worlds orbiting other stars.", duration: 5 },
        { timestamp: 15, text: "We've discovered thousands using the transit and radial velocity methods.", duration: 7 },
        { timestamp: 30, text: "Some are rocky like Earth, others are gas giants larger than Jupiter.", duration: 6 },
        { timestamp: 45, text: "The habitable zone is where liquid water could exist.", duration: 6 },
        { timestamp: 60, text: "Proxima Centauri b is the closest known exoplanet to us.", duration: 6 }
    ],
    animations: [
        { timestamp: 0, type: 'habitable-zone', params: { duration: 30 } },
        { timestamp: 30, type: 'orbit-start', params: { object: 'exoplanet', speed: 'orbital', duration: 30 } }
    ],
    interactiveControls: [],
    quiz: [
        { question: "What is an exoplanet?", options: ["A moon", "Planet outside our solar system", "Asteroid", "Comet"], correctAnswer: 1, explanation: "Exoplanets orbit other stars." },
        { question: "How do we find exoplanets?", options: ["Direct photos", "Transit method", "Landing probes", "Radio signals"], correctAnswer: 1, explanation: "We watch stars dim as planets pass in front." },
        { question: "What is the habitable zone?", options: ["Hot zone", "Where water can be liquid", "Cold zone", "Radiation free"], correctAnswer: 1, explanation: "The distance where temperatures allow liquid water." },
        { question: "Closest exoplanet to Earth?", options: ["Mars", "Kepler-22b", "Proxima Centauri b", "TRAPPIST-1e"], correctAnswer: 2, explanation: "Proxima Centauri b is about 4 light-years away." },
        { question: "What makes a planet habitable?", options: ["Size only", "Water, atmosphere, temperature", "Being rocky", "Having moons"], correctAnswer: 1, explanation: "Multiple factors determine habitability." }
    ]
};

export const LESSON_ASTROBIOLOGY: Lesson = {
    id: 'astrobiology',
    title: 'Astrobiology & the Future of Humanity',
    icon: '🧬',
    duration: 85,
    xpReward: 150,
    isPremium: true,
    narration: [
        { timestamp: 0, text: "Astrobiology is the study of life in the universe.", duration: 5 },
        { timestamp: 15, text: "Life on Earth shows us what to look for elsewhere.", duration: 6 },
        { timestamp: 30, text: "Extremophiles survive in conditions once thought impossible.", duration: 6 },
        { timestamp: 45, text: "Mars and Europa are prime targets in our search for life.", duration: 6 },
        { timestamp: 60, text: "Humanity may one day become a multi-planetary species.", duration: 6 }
    ],
    animations: [
        { timestamp: 0, type: 'habitable-zone', params: { duration: 30 } },
        { timestamp: 45, type: 'camera-move', params: { target: 'mars', duration: 15 } }
    ],
    interactiveControls: [],
    quiz: [
        { question: "What is astrobiology?", options: ["Star study", "Study of life in universe", "Alien contact", "Space travel"], correctAnswer: 1, explanation: "Astrobiology searches for life beyond Earth." },
        { question: "What are extremophiles?", options: ["Aliens", "Life in extreme conditions", "Extinct species", "Bacteria only"], correctAnswer: 1, explanation: "Organisms that thrive in extreme environments." },
        { question: "Where might we find life in our solar system?", options: ["Venus surface", "Jupiter", "Europa", "Mercury"], correctAnswer: 2, explanation: "Europa's subsurface ocean is a promising target." },
        { question: "What do we search for on Mars?", options: ["Aliens", "Signs of past/present microbial life", "Plants", "Water creatures"], correctAnswer: 1, explanation: "We look for biosignatures and microbial evidence." },
        { question: "Why become multi-planetary?", options: ["Fun", "Survival of humanity", "Trade", "Tourism"], correctAnswer: 1, explanation: "Spreading to other worlds ensures our long-term survival." }
    ]
};

export const LESSONS = [
    LESSON_BIG_BANG,
    LESSON_STAR_CYCLE,
    LESSON_PLANET_FORMATION,
    LESSON_GRAVITY_ORBITS,
    LESSON_SEARCH_LIFE,
    LESSON_DARK_MATTER,
    LESSON_STELLAR_DEATHS,
    LESSON_BLACK_HOLES,
    LESSON_EXOPLANETS,
    LESSON_ASTROBIOLOGY
];
