'use client';

import { useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useEducationStore } from '@/lib/educationStore';
import { LESSONS } from '@/lib/lessonData';
import { LessonSelectionScreen } from '@/components/education/LessonSelectionScreen';
import { LessonContainer } from '@/components/education/LessonContainer';

export function Education() {
    const mode = useAppStore(state => state.mode);
    const { currentLesson, setCurrentLesson, resetProgress } = useEducationStore();

    const activeLesson = LESSONS.find(l => l.id === currentLesson);

    // Reset selection on mount to ensure menu is shown first
    useEffect(() => {
        setCurrentLesson(null);
    }, []);

    // Reset selection on mount if we want to force menu (optional, but requested by user)
    // However, if we want to allow resuming, we might need a "Resume" button in the menu instead.
    // For now, per user request "click on panel -> see menu", we should ensure we don't auto-enter.
    // But we also need to handle the case where the user *just* selected a lesson.
    // The issue is likely that the store persists the selection.
    // We should probably clear the selection when the user *exits* the lesson, which we do.
    // But if they refresh the page while in a lesson, it might persist.
    // Let's add an effect to clear it if we are entering "education" mode from elsewhere?
    // Actually, the user said "when i click on panel its directly starting the lesson".
    // This implies the state is preserved. Let's clear it on mount of this component.

    // useEffect(() => {
    //    setCurrentLesson(null);
    // }, []); 
    // Wait, if we do this, it might flicker or break selection if this component re-mounts.
    // Better approach: The "Education" component is mounted when mode === 'education'.
    // So clearing on mount is correct for "entering the mode".

    // import { useEffect } from 'react';

    // ... inside component
    // useEffect(() => {
    //     setCurrentLesson(null);
    // }, []);

    // Let's add the import and the effect.

    return (
        <AnimatePresence>
            {mode === 'education' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-deep-space"
                >
                    {!activeLesson ? (
                        <>
                            <LessonSelectionScreen onSelectLesson={setCurrentLesson} />
                            <button
                                onClick={resetProgress}
                                className="fixed bottom-8 right-8 z-50 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 hover:bg-red-500/20 transition-colors font-orbitron text-xs tracking-widest uppercase"
                            >
                                RESET ALL PROGRESS
                            </button>
                        </>
                    ) : (
                        <LessonContainer
                            lesson={activeLesson}
                            onExit={() => setCurrentLesson(null)}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
