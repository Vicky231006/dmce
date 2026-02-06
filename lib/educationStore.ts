import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LessonProgress {
    lessonId: string;
    completed: boolean;
    quizScore: number;
    xpEarned: number;
    lastPosition: number; // Timeline position for resume
    unlockedAt?: number;
}

interface EducationState {
    currentLesson: string | null;
    lessonProgress: Map<string, LessonProgress>;
    totalXP: number;
    hasPremiumAccess: boolean;

    setCurrentLesson: (id: string | null) => void;
    completeLesson: (id: string, score: number, maxScore: number) => void;
    updateProgress: (id: string, position: number) => void;
    unlockNextLesson: (currentId: string) => void;
    unlockPremium: () => void;
    resetProgress: () => void;
}

// Helper to serialize Map for persistence
const storage = {
    getItem: (name: string) => {
        const str = localStorage.getItem(name);
        if (!str) return null;
        const { state } = JSON.parse(str);
        return {
            state: {
                ...state,
                lessonProgress: new Map(state.lessonProgress),
            },
        };
    },
    setItem: (name: string, value: any) => {
        const { state } = value;
        const serializedState = {
            ...state,
            lessonProgress: Array.from(state.lessonProgress.entries()),
        };
        localStorage.setItem(name, JSON.stringify({ state: serializedState }));
    },
    removeItem: (name: string) => localStorage.removeItem(name),
};

export const useEducationStore = create<EducationState>()(
    persist(
        (set, get) => ({
            currentLesson: null,
            lessonProgress: new Map([
                ['big-bang', { lessonId: 'big-bang', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0, unlockedAt: Date.now() }],
                ['star-cycle', { lessonId: 'star-cycle', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                ['planet-formation', { lessonId: 'planet-formation', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                ['gravity-orbits', { lessonId: 'gravity-orbits', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                ['search-life', { lessonId: 'search-life', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                // Premium lessons
                ['dark-matter', { lessonId: 'dark-matter', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                ['stellar-deaths', { lessonId: 'stellar-deaths', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                ['black-holes', { lessonId: 'black-holes', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                ['exoplanets', { lessonId: 'exoplanets', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                ['astrobiology', { lessonId: 'astrobiology', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
            ]),
            totalXP: 0,
            hasPremiumAccess: false,

            setCurrentLesson: (id) => set({ currentLesson: id }),

            completeLesson: (id, score, maxScore) => set((state) => {
                const progress = state.lessonProgress.get(id);
                if (progress) {
                    const previousXP = progress.xpEarned;
                    const newXP = score * 20;
                    const xpDiff = Math.max(0, newXP - previousXP);

                    progress.completed = true;
                    progress.quizScore = Math.max(progress.quizScore, score);
                    progress.xpEarned = Math.max(progress.xpEarned, newXP);

                    state.lessonProgress.set(id, progress);

                    return {
                        lessonProgress: new Map(state.lessonProgress),
                        totalXP: state.totalXP + xpDiff
                    };
                }
                return state;
            }),

            updateProgress: (id, position) => set((state) => {
                const progress = state.lessonProgress.get(id);
                if (progress) {
                    progress.lastPosition = position;
                    state.lessonProgress.set(id, progress);
                    return { lessonProgress: new Map(state.lessonProgress) };
                }
                return state;
            }),

            unlockNextLesson: (currentId) => set((state) => {
                const lessonOrder = [
                    'big-bang', 'star-cycle', 'planet-formation', 'gravity-orbits', 'search-life',
                    'dark-matter', 'stellar-deaths', 'black-holes', 'exoplanets', 'astrobiology'
                ];
                const currentIndex = lessonOrder.indexOf(currentId);

                if (currentIndex !== -1 && currentIndex < lessonOrder.length - 1) {
                    const nextId = lessonOrder[currentIndex + 1];
                    const nextProgress = state.lessonProgress.get(nextId);

                    // For transition from free (search-life) to premium (dark-matter), require premium access
                    const isPremiumLesson = ['dark-matter', 'stellar-deaths', 'black-holes', 'exoplanets', 'astrobiology'].includes(nextId);
                    if (isPremiumLesson && !state.hasPremiumAccess) {
                        return state; // Don't unlock premium lessons without access
                    }

                    if (nextProgress && !nextProgress.unlockedAt) {
                        nextProgress.unlockedAt = Date.now();
                        state.lessonProgress.set(nextId, nextProgress);
                        return { lessonProgress: new Map(state.lessonProgress) };
                    }
                }
                return state;
            }),

            unlockPremium: () => set((state) => {
                // Unlock premium access and auto-unlock first premium lesson if search-life is completed
                const searchLifeProgress = state.lessonProgress.get('search-life');
                const darkMatterProgress = state.lessonProgress.get('dark-matter');

                if (searchLifeProgress?.completed && darkMatterProgress && !darkMatterProgress.unlockedAt) {
                    darkMatterProgress.unlockedAt = Date.now();
                    state.lessonProgress.set('dark-matter', darkMatterProgress);
                    return {
                        hasPremiumAccess: true,
                        lessonProgress: new Map(state.lessonProgress)
                    };
                }
                return { hasPremiumAccess: true };
            }),

            resetProgress: () => set((state) => ({
                currentLesson: null,
                lessonProgress: new Map([
                    ['big-bang', { lessonId: 'big-bang', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0, unlockedAt: Date.now() }],
                    ['star-cycle', { lessonId: 'star-cycle', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                    ['planet-formation', { lessonId: 'planet-formation', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                    ['gravity-orbits', { lessonId: 'gravity-orbits', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                    ['search-life', { lessonId: 'search-life', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                    ['dark-matter', { lessonId: 'dark-matter', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                    ['stellar-deaths', { lessonId: 'stellar-deaths', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                    ['black-holes', { lessonId: 'black-holes', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                    ['exoplanets', { lessonId: 'exoplanets', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                    ['astrobiology', { lessonId: 'astrobiology', completed: false, quizScore: 0, xpEarned: 0, lastPosition: 0 }],
                ]),
                totalXP: 0,
                // Preserve premium access - user paid for it, don't take it away on reset
                hasPremiumAccess: state.hasPremiumAccess
            }))
        }),
        {
            name: 'education-storage',
            storage: storage,
        }
    )
);
