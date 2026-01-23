'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SPACE_TIMELINE_EVENTS } from '@/lib/timelineData';
import { TimelineEvent } from './TimelineEvent';
import { YearTransition } from './YearTransition';
import { YearIntroAnimation } from './YearIntroAnimation';
import { VideoPreloader } from '@/lib/videoPreloader';
import { useAppStore } from '@/lib/store';

export function TimelineContainer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isYearIntro, setIsYearIntro] = useState(true);
    const preloaderRef = useRef<VideoPreloader | null>(null);
    const setTimelineIndex = useAppStore(state => state.setTimelineIndex);

    // Initialize preloader
    useEffect(() => {
        preloaderRef.current = new VideoPreloader();
    }, []);

    // Year intro animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsYearIntro(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    // Scroll tracking & video preloading
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            // If using wrapper, get scroll from wrapper
            const wrapper = document.getElementById('mission-timeline-scroll-container');
            const scrollY = wrapper ? wrapper.scrollTop : window.scrollY;
            const viewportHeight = window.innerHeight;

            // Calculate current event index based on scroll
            // Assuming each event takes up roughly 1.5 viewport heights including transition
            const index = Math.floor(scrollY / (viewportHeight * 1.5));
            const clampedIndex = Math.max(0, Math.min(index, SPACE_TIMELINE_EVENTS.length - 1));

            if (clampedIndex !== currentIndex) {
                setCurrentIndex(clampedIndex);
                setTimelineIndex(clampedIndex); // Update global store for AI context
            }

            // Preload videos around current position
            preloaderRef.current?.preloadVideosAroundIndex(clampedIndex, SPACE_TIMELINE_EVENTS);
        };

        // Attach listener to wrapper if it exists, otherwise window
        const wrapper = document.getElementById('mission-timeline-scroll-container');
        const target = wrapper || window;

        target.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => target.removeEventListener('scroll', handleScroll);
    }, [currentIndex, setTimelineIndex]);

    return (
        <div ref={containerRef} className="relative bg-void-black min-h-screen">
            {/* Year Intro */}
            {isYearIntro && <YearIntroAnimation year={SPACE_TIMELINE_EVENTS[0].year} />}

            {/* Timeline Events */}
            <div className="pb-[50vh]">
                {SPACE_TIMELINE_EVENTS.map((event, index) => (
                    <div key={event.year + event.title}>
                        {/* Year Transition (between events) */}
                        {index > 0 && (
                            <div className="snap-start snap-always h-screen flex items-center justify-center">
                                <YearTransition
                                    year={event.year}
                                    title={event.title}
                                    isActive={currentIndex === index}
                                />
                            </div>
                        )}

                        {/* Event Card */}
                        <div className="snap-start snap-always h-screen flex items-center justify-center">
                            <TimelineEvent
                                event={event}
                                index={index}
                                isActive={currentIndex === index}
                                side={index % 2 === 0 ? 'left' : 'right'}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Exit Animation Placeholder */}
            {/* Exit Animation Placeholder (Triggers Loop) */}
            <div
                className="h-[50vh] flex items-center justify-center snap-start"
                onMouseEnter={() => {
                    const wrapper = document.getElementById('mission-timeline-scroll-container');
                    if (wrapper) {
                        wrapper.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }}
            >
                <div className="text-center">
                    <p className="text-star-white/40 font-orbitron mb-2">End of Timeline</p>
                    <p className="text-cyan-glow/60 text-sm animate-pulse">Warping to Start...</p>
                </div>
            </div>
        </div>
    );
}
