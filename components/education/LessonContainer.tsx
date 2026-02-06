'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars, OrbitControls } from '@react-three/drei';
import { Lesson } from '@/lib/lessonData';
import { useEducationStore } from '@/lib/educationStore';
import { NarratorPanel } from './NarratorPanel';
import { InteractiveControls } from './InteractiveControls';
import { QuizModal } from './QuizModal';
import { LessonCompleteScreen } from './LessonCompleteScreen';
import { AnimationController } from './AnimationController';
import { BigBangScene } from './lessons/BigBangScene';
import { StarLifeCycleScene } from './lessons/StarLifeCycleScene';
import { PlanetFormationScene } from './lessons/PlanetFormationScene';
import { GravityOrbitsScene } from './lessons/GravityOrbitsScene';
import { SearchForLifeScene } from './lessons/SearchForLifeScene';
import { DarkMatterScene } from './lessons/DarkMatterScene';

interface LessonContainerProps {
    lesson: Lesson;
    onExit: () => void;
}

export function LessonContainer({ lesson, onExit }: LessonContainerProps) {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showComplete, setShowComplete] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);

    const { completeLesson, unlockNextLesson } = useEducationStore();
    const sceneRef = useRef<THREE.Group>(null);

    // Timer Loop
    useEffect(() => {
        let animationFrame: number;
        let lastTime = Date.now();

        const loop = () => {
            const now = Date.now();
            const delta = (now - lastTime) / 1000;
            lastTime = now;

            if (!isPaused && !showQuiz && !showComplete && currentTime < lesson.duration) {
                setCurrentTime(prev => Math.min(prev + (delta * playbackSpeed), lesson.duration));
            }

            if (currentTime >= lesson.duration && !showQuiz && !showComplete) {
                setIsPaused(true);
                setShowQuiz(true);
            }

            animationFrame = requestAnimationFrame(loop);
        };

        animationFrame = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrame);
    }, [isPaused, showQuiz, showComplete, currentTime, lesson.duration, playbackSpeed]);

    const handleQuizComplete = (score: number) => {
        setQuizScore(score);
        const earned = score * 20; // 20 XP per question
        setXpEarned(earned);

        completeLesson(lesson.id, score, lesson.quiz.length);
        unlockNextLesson(lesson.id);

        setShowQuiz(false);
        setShowComplete(true);
    };

    const handleRestart = () => {
        setCurrentTime(0);
        setIsPaused(false);
        setShowQuiz(false);
        setShowComplete(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [0, 0, 50], fov: 60 }}
                className="absolute inset-0 z-0"
                gl={{ antialias: true }}
            >
                <color attach="background" args={['#000000']} />
                <ambientLight intensity={0.2} />
                <Stars radius={300} depth={50} count={5000} factor={4} fade speed={0.5} />

                <group ref={sceneRef}>
                    {/* Scene Content */}
                    {lesson.id === 'big-bang' && <BigBangScene currentTime={currentTime} onPause={() => setIsPaused(true)} />}
                    {lesson.id === 'star-cycle' && <StarLifeCycleScene currentTime={currentTime} />}
                    {lesson.id === 'planet-formation' && <PlanetFormationScene currentTime={currentTime} />}
                    {lesson.id === 'gravity-orbits' && <GravityOrbitsScene currentTime={currentTime} />}
                    {lesson.id === 'search-life' && <SearchForLifeScene currentTime={currentTime} />}
                    {lesson.id === 'dark-matter' && <DarkMatterScene currentTime={currentTime} />}
                </group>

                <AnimationController
                    lesson={lesson}
                    currentTime={currentTime}
                    isPaused={isPaused}
                    sceneRef={sceneRef}
                />

                <OrbitControls enablePan={false} maxDistance={200} minDistance={10} />
            </Canvas>

            {/* UI Overlays */}
            {!showQuiz && !showComplete && (
                <>
                    <NarratorPanel
                        lesson={lesson}
                        currentTime={currentTime}
                        onTimeChange={setCurrentTime}
                        isPaused={isPaused}
                        onTogglePause={() => setIsPaused(!isPaused)}
                        playbackSpeed={playbackSpeed}
                        onSpeedChange={setPlaybackSpeed}
                        onRestart={handleRestart}
                    />

                    <InteractiveControls
                        controls={lesson.interactiveControls}
                        currentTime={currentTime}
                    />

                    {/* Exit Button */}
                    <button
                        onClick={onExit}
                        className="fixed top-24 right-4 md:top-8 md:right-8 z-40 px-3 py-2 md:px-4 md:py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors font-orbitron text-xs tracking-widest flex items-center justify-center"
                    >
                        <span className="md:hidden text-lg">✕</span>
                        <span className="hidden md:inline">EXIT SIMULATION</span>
                    </button>
                </>
            )}

            {/* Quiz */}
            {showQuiz && (
                <QuizModal
                    quiz={lesson.quiz}
                    onComplete={handleQuizComplete}
                />
            )}

            {/* Completion Screen */}
            {showComplete && (
                <LessonCompleteScreen
                    score={quizScore}
                    totalQuestions={lesson.quiz.length}
                    xpEarned={xpEarned}
                    onContinue={onExit}
                    onRetake={() => {
                        setShowComplete(false);
                        setCurrentTime(0);
                        setIsPaused(false);
                    }}
                />
            )}
        </div>
    );
}
