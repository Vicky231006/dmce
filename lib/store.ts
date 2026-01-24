import { create } from 'zustand';
import * as THREE from 'three';

// --- App State ---
interface AppState {
    mode: 'explore' | 'dashboard' | 'mission' | 'education';
    timelineIndex: number;
    isNeoOverlayOpen: boolean;
    // Dashboard Global State for AI Context
    dashboardOverlay: 'none' | 'calendar' | 'weather' | 'satellite';
    selectedCalendarEvent: any | null; // Using any to avoid circular dependency with calendarData for now
    selectedSatelliteImpact: any | null;

    setMode: (mode: AppState['mode']) => void;
    setTimelineIndex: (index: number) => void;
    setNeoOverlayOpen: (isOpen: boolean) => void;
    setDashboardOverlay: (overlay: AppState['dashboardOverlay']) => void;
    setSelectedCalendarEvent: (event: any | null) => void;
    setSelectedSatelliteImpact: (impact: any | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
    mode: 'explore',
    timelineIndex: 0,
    isNeoOverlayOpen: false,
    dashboardOverlay: 'none',
    selectedCalendarEvent: null,
    selectedSatelliteImpact: null,

    setMode: (mode) => set({ mode }),
    setTimelineIndex: (index) => set({ timelineIndex: index }),
    setNeoOverlayOpen: (isOpen) => set({ isNeoOverlayOpen: isOpen }),
    setDashboardOverlay: (overlay) => set({ dashboardOverlay: overlay }),
    setSelectedCalendarEvent: (event) => set({ selectedCalendarEvent: event }),
    setSelectedSatelliteImpact: (impact) => set({ selectedSatelliteImpact: impact }),
}));

// --- Time Control State ---
interface TimeState {
    isPaused: boolean;
    timeSpeed: number; // 0 = paused, 1 = real-time, 10 = 10x speed, 100 = 100x
    currentDate: Date;
    setSpeed: (speed: number) => void;
    togglePause: () => void;
}

export const useTimeStore = create<TimeState>((set) => ({
    isPaused: false,
    timeSpeed: 10, // Default: 10x speed for visible motion
    currentDate: new Date(),
    setSpeed: (speed) => set({ timeSpeed: speed }),
    togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}));

// --- Sidebar State ---
interface SidebarState {
    isOpen: boolean;
    selectedPlanet: string | null;
    isVisiting: boolean;
    activeTab: 'explore' | 'encyclopedia' | 'composition';
    setSelectedPlanet: (planet: string) => void;
    setIsVisiting: (visiting: boolean) => void;
    closeSidebar: () => void;
    setActiveTab: (tab: SidebarState['activeTab']) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    isOpen: false,
    selectedPlanet: null,
    isVisiting: false,
    activeTab: 'explore',
    setSelectedPlanet: (planet) => set({ isOpen: true, selectedPlanet: planet, isVisiting: false, activeTab: 'explore' }),
    setIsVisiting: (visiting) => set({ isVisiting: visiting }),
    closeSidebar: () => set({ isOpen: false, selectedPlanet: null, isVisiting: false }),
    setActiveTab: (tab) => set({ activeTab: tab }),
}));

// --- Solar System State ---
interface SolarSystemState {
    planets: Record<string, THREE.Object3D>;
    registerPlanet: (name: string, object: THREE.Object3D) => void;
    getPlanetByName: (name: string) => THREE.Object3D | undefined;
}

export const useSolarSystemStore = create<SolarSystemState>((set, get) => ({
    planets: {},
    registerPlanet: (name, object) => set((state) => ({ planets: { ...state.planets, [name]: object } })),
    getPlanetByName: (name) => get().planets[name],
}));
