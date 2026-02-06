'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SolarSystem } from '@/components/3d/SolarSystem';
import { HUD } from '@/components/layout/HUD';
import { Dashboard } from '@/components/layout/Dashboard';
import { PlanetSidebar } from '@/components/sidebar/PlanetSidebar';
import { MissionTimeline } from '@/components/layout/MissionTimeline';
import { AIChat } from '@/components/layout/AIChat';
import { Navbar } from '@/components/ui/Navbar';
import { Education } from '@/components/layout/Education';
import { NightSkyView } from '@/components/nightsky/NightSkyView';
import { useAppStore, useSidebarStore } from '@/lib/store';

type LoadState =
  | 'INIT'           // Black screen
  | 'LOADING_ASSETS' // Textures loading
  | 'READY'          // Fade to 3D scene
  | 'HUD_ANIMATE'    // UI slides in
  | 'ACTIVE';        // Fully interactive

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function Home() {
  const [loadState, setLoadState] = useState<LoadState>('INIT');
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      // Wait 500ms
      await delay(500);
      setLoadState('LOADING_ASSETS');

      // Simulate texture loading with progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setLoadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);

      // Wait for "loading"
      await delay(2500);

      setLoadState('READY');
      await delay(500);

      setLoadState('HUD_ANIMATE');
      await delay(1000);

      setLoadState('ACTIVE');
    };

    sequence();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-void-black">
      {/* Loading Screen */}
      {loadState === 'LOADING_ASSETS' && (
        <div className="absolute inset-0 z-50 bg-void-black flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-orbitron text-cyan-glow mb-4">
              Initializing Solar System
            </h2>
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-glow to-plasma-purple"
                initial={{ width: 0 }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className="text-star-white/60 mt-2 font-mono text-sm">{loadProgress}%</p>
          </div>
        </div>
      )}

      {/* 3D Solar System */}
      <SolarSystem loadState={loadState} />

      {/* UI Overlay */}
      {(loadState === 'HUD_ANIMATE' || loadState === 'ACTIVE') && (
        <>
          <Navbar />
          <HUD isActive={loadState === 'ACTIVE'} />
          <Dashboard />
          <PlanetSidebar />
          <MissionTimeline />
          <MissionTimeline />
          <Education />
          <AIChat />

          <GlobalNightSkyWrapper />
        </>
      )}
    </div>
  );
}

function GlobalNightSkyWrapper() {
  const isNightSkyMode = useAppStore(state => state.isNightSkyMode);
  const selectedPlanet = useSidebarStore(state => state.selectedPlanet);
  const setNightSkyMode = useAppStore(state => state.setNightSkyMode);

  if (!isNightSkyMode || !selectedPlanet) return null;

  const handleExit = () => {
    // Trigger exit transition
    window.dispatchEvent(new CustomEvent('exitNightSky'));
    // setNightSkyMode(false) is handled in TransitionHandler after zoom out starts, 
    // but NightSkyView needs to stay mounted for its exit animation?
    // Actually NightSkyView has AnimatePresence internal? No, it uses AnimatePresence wrapper.
    // But if we return null here, it unmounts immediately.
    // We need to delay unmount or let TransitionHandler handle state.

    // Correct flow:
    // 1. Button Click -> dispatch exitNightSky
    // 2. TransitionHandler -> zooms out -> sets isNightSkyMode(false)
    // 3. This wrapper re-renders -> returns null -> NightSkyView unmounts

    // However, NightSkyView has `exit={{ opacity: 0 }}`. 
    // If we unmount it immediately when isNightSkyMode becomes false, do we see the exit animation?
    // Yes, providing AnimatePresence is used correctly. 
    // `NightSkyView` has AnimatePresence inside it? 
    // Let's check: Yes, it wraps contents in AnimatePresence.
    // BUT, if the Parent (this wrapper) unmounts the component entirely, the internal AnimatePresence might be cut off.
    // Ideally, isNightSkyMode should stay true until animation is done.

    // TransitionHandler Logic:
    // handleExit calls setNightSkyMode(false) IMMEDIATELY to show solar system?
    // "setNightSkyMode(false); // Show Solar System immediately for zoom out"
    // This means NightSkyView unmounts immediately when "Back" is clicked.

    // Issue: If NightSkyView unmounts immediately, we get a hard cut.
    // We want NightSkyView to fade out while Camera zooms out.
    // Solution: 
    // - TransitionHandler should NOT setNightSkyMode(false) immediately.
    // - It should wait for zoom out?
    // - OR, show Solar System (fade it in via opacity class) BUT keep NightSkyView mounted (fading it out via opacity).

    // Current SolarSystem logic uses `opacity-0` class based on isNightSkyMode.
    // If we set isNightSkyMode(false), SolarSystem becomes `opacity-100`.
    // At the same time, this wrapper unmounts NightSkyView.

    // We need NightSkyView to Fade Out.
    // If we set isNightSkyMode(false), NightSkyView is removed.
    // We need a separate state or delay.

    // Wait, NightSkyView component *itself* has AnimatePresence on its `motion.div`.
    // If we conditionally render it here:
    // <AnimatePresence>{isNightSkyMode && <NightSkyView ... />}</AnimatePresence>
    // Then Framer Motion handles the exit animation even if state becomes false.
  };

  return (
    <AnimatePresence>
      {isNightSkyMode && (
        <NightSkyView
          planetName={selectedPlanet}
          onExit={handleExit}
        />
      )}
    </AnimatePresence>
  );
}
