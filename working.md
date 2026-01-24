# SpaceScope - Behind the Scenes (`working.md`)

This document serves as a guide to the SpaceScope codebase, explaining how the key features work and where to find the code responsible for them.

## 1. The Dashboard & Data
**Goal**: Display real-time space data (NEOs, ISS, Weather, etc.).

*   **Data Source**: `lib/dashboardData.ts` contains the static fallback data and types.
*   **Fetching & Caching**: `lib/cache.ts` handles data fetching with a caching layer (IndexedDB) to prevent rate limits and improve performance. It has a default timeout of 15s.
*   **UI Component**: `components/layout/Dashboard.tsx` is the main view.
    *   **Global State**: It uses `useAppStore` (from `lib/store.ts`) to track which overlay is open (`dashboardOverlay`).
    *   **Overlays**: The Calendar, Weather, and Satellite panels are conditionally rendered overlays within this file.
    *   **Calendar Logic**: The "Optimal Viewing Location" and event data come from `lib/calendarData.ts`.

## 2. Education Mode (The Lessons)
**Goal**: Interactive 3D lessons with narration, animations, and quizzes.

*   **Lesson Configuration**: `lib/lessonData.ts` is the **most important file** for content. It defines:
    *   **Narration**: Timed subtitles.
    *   **Animations**: Timed events (e.g., 'big-bang', 'stars-ignite') that trigger changes in the 3D scene.
    *   **Quiz**: The questions, options, and correct answers for each lesson. **Edit this file to change quiz questions.**
*   **The Game Loop**: `components/education/LessonContainer.tsx` manages the lesson state (time, pause/play, completion).
    *   It renders the 3D scene using React Three Fiber (`<Canvas>`).
    *   It checks if the lesson time has finished to trigger the quiz.
*   **3D Scenes**: Located in `components/education/lessons/`. Each lesson has its own scene file (e.g., `BigBangScene.tsx`).
*   **Quiz System**: `components/education/QuizModal.tsx` handles the quiz UI and scoring.
    *   **Scoring Logic**: It tracks the score and passes it to the parent component upon completion.

## 3. The AI Assistant (ARIA)
**Goal**: A context-aware chatbot that knows what the user is looking at.

*   **UI Component**: `components/layout/AIChat.tsx` handles the chat interface.
*   **Context Injection**: Before sending a message to the API, it checks the global store (`useAppStore`) to see what is open (e.g., "User is viewing Satellite Impact"). It appends this context to the system prompt.
*   **API Route**: `app/api/ai/chat/route.ts` receives the message + context and calls the Google Gemini API.

## 4. Global State Management
**Goal**: Share state (like "which planet is selected" or "is the dashboard open") across components.

*   **Store**: `lib/store.ts` uses `zustand` to create a global store.
    *   `useAppStore`: General app state (mode, overlays).
    *   `useSidebarStore`: Sidebar specific state.

## How to Make Common Changes

### "I want to change a quiz question."
1.  Open `lib/lessonData.ts`.
2.  Find the lesson (e.g., `LESSON_BIG_BANG`).
3.  Scroll to the `quiz` array.
4.  Edit the `question`, `options`, or `correctAnswer` (index of the correct option).

### "I want to change the text in a lesson."
1.  Open `lib/lessonData.ts`.
2.  Find the `narration` array in the target lesson.
3.  Edit the `text` field.

### "I want to add a new dashboard panel."
1.  Add the data structure to `lib/dashboardData.ts`.
2.  Update `lib/store.ts` to add a new overlay type (if needed).
3.  Edit `components/layout/Dashboard.tsx` to add the button and the overlay UI.

### "I want to adjust the 3D scene."
1.  Go to `components/education/lessons/`.
2.  Open the specific scene file (e.g., `BigBangScene.tsx`).
3.  Adjust the Three.js objects (meshes, lights, particles).
