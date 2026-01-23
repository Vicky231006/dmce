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
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
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
          <Education />
          <AIChat />
        </>
      )}
    </div>
  );
}
