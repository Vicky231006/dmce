# SpaceScope - Operator's Manual (`working.md`)

Welcome to the **SpaceScope** codebase. This document is designed to be the ultimate source of truth for how the application functions. Whether you are fixing a bug, adding a feature, or just exploring, this guide will tell you exactly which file controls what.

---

## 📂 System Architecture (Directory Map)

```
/
├── app/
│   ├── api/ai/chat/route.ts    # The backend for the AI Assistant (Gemini API)
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   └── page.tsx                # The main entry point (renders the Dashboard)
├── components/
│   ├── education/              # All 3D lesson logic (The "Simulation" mode)
│   │   ├── lessons/            # Individual Three.js scenes (Big Bang, Stars, etc.)
│   │   ├── LessonContainer.tsx # The game loop & scene manager
│   │   ├── QuizModal.tsx       # The quiz UI & scoring logic
│   │   └── ...
│   ├── layout/                 # Major UI blocks
│   │   ├── AIChat.tsx          # The AI chat interface
│   │   ├── Dashboard.tsx       # The main HUD (Calendar, Weather, Satellite)
│   │   ├── MissionTimeline.tsx # The "Mission" mode wrapper
│   │   └── ...
│   ├── timeline/               # Timeline specific components
│   │   ├── TimelineContainer.tsx # Scroll logic & event rendering
│   │   └── ...
│   └── ui/                     # Reusable atoms (Buttons, Cards, Glass effects)
├── lib/                        # The "Brain" of the app (Data & Logic)
│   ├── cache.ts                # IndexedDB caching layer for API requests
│   ├── calendarData.ts         # Astronomical events data
│   ├── dashboardData.ts        # Satellite & Weather fallback data
│   ├── educationStore.ts       # State for lesson progress (XP, unlocks)
│   ├── lessonData.ts           # CRITICAL: All lesson content (text, quizzes, animations)
│   ├── store.ts                # Global app state (Zustand)
│   └── timelineData.ts         # Timeline events data
└── public/                     # Static assets (images, icons)
```

---

## 🔧 Core Systems Deep Dive

### 1. The Dashboard (HUD)
**Goal**: Display real-time space data in a futuristic interface.

*   **Main Component**: `components/layout/Dashboard.tsx`
    *   **How it works**: It acts as the layout controller. It checks `useAppStore` to see which overlay is active (`dashboardOverlay`) and renders it.
    *   **Data Flow**:
        *   It calls `fetchData()` on mount.
        *   `getCachedData` (from `lib/cache.ts`) is used to fetch from APIs (NASA NEO, etc.).
        *   If the API fails or is rate-limited, it falls back to static data from `lib/dashboardData.ts`.
*   **The Cache (`lib/cache.ts`)**:
    *   Uses **IndexedDB** to store API responses.
    *   **Timeout**: Defaults to 15s. If an API takes longer, it throws a timeout error.
    *   **TTL**: Data is kept for 1 hour (3600s) by default.

### 2. Education Mode (Simulations)
**Goal**: Interactive 3D lessons with narration and quizzes.

*   **The Brain**: `lib/lessonData.ts`
    *   **This file controls EVERYTHING** in a lesson.
    *   `narration`: Array of text + timestamps.
    *   `animations`: Array of events (e.g., `{ type: 'supernova', timestamp: 60 }`) that the 3D scene listens for.
    *   `quiz`: The questions that appear at the end.
*   **The Engine**: `components/education/LessonContainer.tsx`
    *   It runs the `requestAnimationFrame` loop.
    *   It tracks `currentTime`.
    *   It passes `currentTime` to the 3D scenes (e.g., `BigBangScene.tsx`).
*   **3D Scenes**: `components/education/lessons/`
    *   These are **React Three Fiber** components.
    *   They use `useFrame` to update animations based on the `currentTime` prop passed from the container.

### 3. The Timeline (Mission Mode)
**Goal**: A scrollable journey through space history.

*   **Data Source**: `lib/timelineData.ts`
    *   Contains the array `SPACE_TIMELINE_EVENTS`.
    *   Each event has: `year`, `title`, `description`, `videoUrl` (background), and `stats`.
*   **Rendering**: `components/timeline/TimelineContainer.tsx`
    *   It listens to the scroll position of the `#mission-timeline-scroll-container`.
    *   It calculates which event is currently in view (`currentIndex`).
    *   It updates the global store (`setTimelineIndex`) so the AI knows what you are looking at.
    *   **Video Preloading**: It uses `lib/videoPreloader.ts` to fetch upcoming background videos for smooth playback.

### 4. The AI Assistant (ARIA)
**Goal**: A context-aware chatbot.

*   **UI**: `components/layout/AIChat.tsx`
*   **Context System**:
    *   Before sending a message, it grabs the state from `useAppStore`.
    *   **Dashboard Context**: "User is viewing Satellite Impact".
    *   **Timeline Context**: "User is looking at the Apollo 11 Landing (1969)".
    *   **Lesson Context**: "User is in the Star Life Cycle lesson".
*   **Backend**: `app/api/ai/chat/route.ts`
    *   Receives the user message + the context string.
    *   Sends it to Google Gemini.
    *   Returns the streaming response.

---

## 🛠 How-To Recipes (Common Tasks)

### "I want to change a Quiz Question"
1.  Open `lib/lessonData.ts`.
2.  Find the lesson constant (e.g., `LESSON_BIG_BANG`).
3.  Scroll down to the `quiz` array.
4.  Modify the `question`, `options`, or `correctAnswer` (0-3 index).
    *   *Tip: You can add as many questions as you want. The UI adapts automatically.*

### "I want to add an Event to the Timeline"
1.  Open `lib/timelineData.ts`.
2.  Add a new object to the `SPACE_TIMELINE_EVENTS` array.
    ```typescript
    {
        year: 2030,
        title: "Mars Colony",
        description: "First human settlement established.",
        videoUrl: "/videos/mars-colony.mp4", // Ensure this file exists in public/
        stats: [
            { label: "Population", value: "50" },
            { label: "Location", value: "Valles Marineris" }
        ]
    }
    ```
3.  The timeline will automatically render it in the correct order (assuming you inserted it in order).

### "I want to change the Dashboard Data (e.g., Satellite Stats)"
1.  Open `lib/dashboardData.ts`.
2.  Find `SATELLITE_DATA`.
3.  Edit the values (e.g., change "Active Fires" count).
    *   *Note: If the API is working, real data might override this. To force static data, you might need to disconnect the API call in `Dashboard.tsx`.*

### "I want to adjust the AI's Personality"
1.  Open `app/api/ai/chat/route.ts`.
2.  Find the `systemInstruction` string.
3.  Edit the prompt (e.g., "You are a sarcastic robot" or "You are a formal scientist").

### "I want to change the 3D Scene (e.g., make the sun bigger)"
1.  Identify the lesson (e.g., Star Life Cycle).
2.  Open `components/education/lessons/StarLifeCycleScene.tsx`.
3.  Find the mesh related to the sun (look for `<mesh>` or `<sphereGeometry>`).
4.  Adjust the `scale` prop or the geometry args.

---

## 🎨 Styling & Tech Stack

*   **Framework**: Next.js 15 (App Router).
*   **Styling**: Tailwind CSS.
    *   Colors are defined in `tailwind.config.ts` (e.g., `cyan-glow`, `void-black`).
*   **Animations**: Framer Motion (`<motion.div>`).
*   **3D**: React Three Fiber (@react-three/fiber) + Drei (@react-three/drei).
*   **Icons**: Lucide React.
