'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPACE_TIMELINE_EVENTS, FUTURE_TIMELINE_EVENTS } from '@/lib/timelineData';
import { TimelineEvent } from './TimelineEvent';
import { YearTransition } from './YearTransition';
import { YearIntroAnimation } from './YearIntroAnimation';
import { TimelineTransitionCard } from './TimelineTransitionCard';
import { VideoPreloader } from '@/lib/videoPreloader';
import { useAppStore } from '@/lib/store';

export function TimelineContainer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isYearIntro, setIsYearIntro] = useState(true);
    const preloaderRef = useRef<VideoPreloader | null>(null);
    const setTimelineIndex = useAppStore(state => state.setTimelineIndex);
    const timelineMode = useAppStore(state => state.timelineMode);

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

            const wrapper = document.getElementById('mission-timeline-scroll-container');
            const scrollY = wrapper ? wrapper.scrollTop : window.scrollY;
            const viewportHeight = window.innerHeight;

            // Calculate timeline boundaries
            const pastTimelineHeight = SPACE_TIMELINE_EVENTS.length * viewportHeight * 1.5;
            const transitionCardHeight = viewportHeight;
            const futureTimelineStart = pastTimelineHeight + transitionCardHeight;

            // Determine which timeline section user is in
            if (scrollY < pastTimelineHeight) {
                // User is in past timeline
                const index = Math.floor(scrollY / (viewportHeight * 1.5));
                const clampedIndex = Math.max(0, Math.min(index, SPACE_TIMELINE_EVENTS.length - 1));

                if (clampedIndex !== currentIndex) {
                    setCurrentIndex(clampedIndex);
                    setTimelineIndex(clampedIndex);
                }

                preloaderRef.current?.preloadVideosAroundIndex(clampedIndex, SPACE_TIMELINE_EVENTS);
            } else if (scrollY >= futureTimelineStart && timelineMode === 'future') {
                // User is in future timeline
                const relativeScroll = scrollY - futureTimelineStart;
                const index = Math.floor(relativeScroll / (viewportHeight * 1.5));
                const clampedIndex = Math.max(0, Math.min(index, FUTURE_TIMELINE_EVENTS.length - 1));

                if (clampedIndex !== currentIndex) {
                    setCurrentIndex(clampedIndex);
                    setTimelineIndex(clampedIndex);
                }

                preloaderRef.current?.preloadVideosAroundIndex(clampedIndex, FUTURE_TIMELINE_EVENTS);
            }
        };

        const wrapper = document.getElementById('mission-timeline-scroll-container');
        const target = wrapper || window;

        target.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => target.removeEventListener('scroll', handleScroll);
    }, [currentIndex, setTimelineIndex, timelineMode]);

    return (
        <div ref={containerRef} className="relative bg-void-black min-h-screen pt-64 md:pt-0">
            {/* Year Intro - Only on initial load */}
            <AnimatePresence>
                {isYearIntro && <YearIntroAnimation year={1957} />}
            </AnimatePresence>

            {/* PAST TIMELINE - Always rendered */}
            <motion.div
                className="pb-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: isYearIntro ? 0 : 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
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
                        <div className="snap-start snap-always h-screen flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full md:w-auto md:h-auto transform scale-[0.85] md:scale-100 origin-center flex items-center justify-center">
                                <TimelineEvent
                                    event={event}
                                    index={index}
                                    isActive={currentIndex === index}
                                    side={index % 2 === 0 ? 'left' : 'right'}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* TRANSITION CARD - Between past and future */}
            <TimelineTransitionCard />

            {/* FUTURE TIMELINE - Conditionally rendered */}
            <AnimatePresence>
                {timelineMode === 'future' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="pb-[50vh]"
                    >
                        {(() => {
                            // Group events by year
                            const eventsByYear: { [key: number]: typeof FUTURE_TIMELINE_EVENTS } = {};
                            FUTURE_TIMELINE_EVENTS.forEach(event => {
                                if (!eventsByYear[event.year]) {
                                    eventsByYear[event.year] = [];
                                }
                                eventsByYear[event.year].push(event);
                            });

                            const years = Object.keys(eventsByYear).map(Number).sort();
                            let cardIndex = 0;

                            return years.map((year, yearIndex) => (
                                <div key={year}>
                                    {/* Year Transition - ONE per year */}
                                    <div className="snap-start snap-always h-screen flex items-center justify-center">
                                        <YearTransition
                                            year={year}
                                            title="" // No title, just year
                                            isActive={currentIndex === cardIndex}
                                        />
                                    </div>

                                    {/* All mission cards for this year */}
                                    {eventsByYear[year].map((event, eventIndex) => {
                                        const currentCardIndex = cardIndex;
                                        cardIndex++;

                                        return (
                                            <div key={event.year + event.title}>
                                                {/* Event Card */}
                                                <div className="snap-start snap-always h-screen flex items-center justify-center overflow-hidden">
                                                    <div className="w-full h-full md:w-auto md:h-auto transform scale-[0.85] md:scale-100 origin-center flex items-center justify-center">
                                                        <TimelineEvent
                                                            event={event}
                                                            index={currentCardIndex}
                                                            isActive={currentIndex === currentCardIndex}
                                                            side={currentCardIndex % 2 === 0 ? 'left' : 'right'}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ));
                        })()}

                        {/* End of Timeline - Warp Back */}
                        <div
                            className="h-[50vh] flex items-center justify-center snap-start"
                            onMouseEnter={() => {
                                const wrapper = document.getElementById('mission-timeline-scroll-container');
                                if (wrapper) {
                                    setTimeout(() => {
                                        wrapper.scrollTo({ top: 0, behavior: 'smooth' });
                                    }, 4000); // 4 seconds delay before warping
                                }
                            }}
                        >
                            <div className="text-center">
                                <p className="text-star-white/40 font-orbitron mb-2">End of Timeline</p>
                                <p className="text-cyan-glow/60 text-sm animate-pulse">Warping to Start...</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
