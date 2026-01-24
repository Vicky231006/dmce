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
    duration: 70, // 1:10
    xpReward: 100,
    narration: [
        { timestamp: 0, text: "A disk of dust and gas spins around a young star.", duration: 6 },
        { timestamp: 15, text: "Dust grains collide and stick, growing into rocks.", duration: 6 },
        { timestamp: 30, text: "These rocks become planetesimals - building blocks of worlds.", duration: 6 },
        { timestamp: 45, text: "Near the star, only rock survives. Further out, ice forms gas giants.", duration: 7 },
        { timestamp: 60, text: "After millions of years, a solar system is born.", duration: 6 }
    ],
    animations: [
        { timestamp: 0, type: 'disk-spin', params: { duration: 15 } },
        { timestamp: 15, type: 'planetesimals', params: { count: 50, duration: 30 } },
        { timestamp: 45, type: 'camera-move', params: { position: [0, 50, 100], duration: 5 } }
    ],
    interactiveControls: [
        { id: 'disk-temp', label: 'Disk Temp', type: 'slider', position: { x: 5, y: 80 }, effect: (val) => console.log('Temp:', val) }
    ],
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
    duration: 60, // 1:00
    xpReward: 100,
    narration: [
        { timestamp: 0, text: "Gravity keeps planets in orbit. It's like a constant free-fall.", duration: 6 },
        { timestamp: 15, text: "Throw a ball fast enough, and it curves around the Earth.", duration: 6 },
        { timestamp: 30, text: "Orbits are ellipses, not perfect circles.", duration: 5 },
        { timestamp: 45, text: "Closer planets must move faster to avoid falling in.", duration: 6 }
    ],
    animations: [
        { timestamp: 0, type: 'gravity-lines', params: { duration: 15 } },
        { timestamp: 15, type: 'orbit-start', params: { object: 'ball', speed: 'orbital', duration: 30 } }
    ],
    interactiveControls: [
        { id: 'launch-speed', label: 'Launch Speed', type: 'slider', position: { x: 5, y: 80 }, effect: (val) => console.log('Speed:', val) }
    ],
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
    duration: 75, // 1:15
    xpReward: 100,
    narration: [
        { timestamp: 0, text: "To find life, we look for the 'Goldilocks Zone' - just right for liquid water.", duration: 7 },
        { timestamp: 15, text: "Earth is perfect. Venus is too hot, Mars is too cold.", duration: 6 },
        { timestamp: 30, text: "We find exoplanets by watching stars dim as planets pass in front.", duration: 7 },
        { timestamp: 45, text: "We scan for biosignatures like oxygen and methane.", duration: 6 },
        { timestamp: 60, text: "With billions of stars, we are likely not alone.", duration: 6 }
    ],
    animations: [
        { timestamp: 0, type: 'habitable-zone', params: { duration: 30 } },
        { timestamp: 30, type: 'camera-move', params: { target: 'exoplanet', duration: 10 } }
    ],
    interactiveControls: [
        { id: 'star-type', label: 'Star Type', type: 'slider', position: { x: 5, y: 80 }, effect: (val) => console.log('Star:', val) }
    ],
    quiz: [
        { question: "Goldilocks Zone?", options: ["Gold region", "Liquid water zone", "Bear zone", "Galaxy center"], correctAnswer: 1, explanation: "Temp allows liquid water." },
        { question: "Exoplanet?", options: ["Our planet", "Planet around other star", "Moon", "Asteroid"], correctAnswer: 1, explanation: "Planet outside our solar system." },
        { question: "How do we find them?", options: ["Direct sight", "Transit method", "Radio", "Probes"], correctAnswer: 1, explanation: "Dimming of stars." },
        { question: "Biosignature?", options: ["Autograph", "Chemical clue (Oxygen)", "Radio", "DNA"], correctAnswer: 1, explanation: "Gases suggesting life." },
        { question: "Drake Equation?", options: ["Gravity math", "Civilization probability", "Fuel", "Lifespan"], correctAnswer: 1, explanation: "Estimates alien civilizations." }
    ]
};

export const LESSONS = [LESSON_BIG_BANG, LESSON_STAR_CYCLE, LESSON_PLANET_FORMATION, LESSON_GRAVITY_ORBITS, LESSON_SEARCH_LIFE];
