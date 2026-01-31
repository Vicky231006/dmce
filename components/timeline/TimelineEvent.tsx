'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TimelineEvent as Event } from '@/lib/timelineData';
import { VideoPlayer } from './VideoPlayer';
import { cn } from '@/lib/utils';

interface TimelineEventProps {
    event: Event;
    index: number;
    isActive: boolean;
    side: 'left' | 'right';
}

export function TimelineEvent({ event, index, isActive, side }: TimelineEventProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: '-20% 0px -20% 0px' });

    // Info card on left, video on right for even indices
    // Video on left, info card on right for odd indices
    const infoOnLeft = index % 2 === 0;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0.3 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center px-4 py-12 md:px-8 md:py-20"
        >
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
                {/* Left Card */}
                {infoOnLeft ? (
                    <InfoCard event={event} side="left" isActive={isActive} />
                ) : (
                    <VideoPlayer
                        videoUrl={event.videoUrl}
                        thumbnail={event.thumbnail}
                        isActive={isActive}
                        side="left"
                    />
                )}

                {/* Right Card */}
                {infoOnLeft ? (
                    <VideoPlayer
                        videoUrl={event.videoUrl}
                        thumbnail={event.thumbnail}
                        isActive={isActive}
                        side="right"
                    />
                ) : (
                    <InfoCard event={event} side="right" isActive={isActive} />
                )}
            </div>
        </motion.div>
    );
}

function InfoCard({ event, side, isActive }: { event: Event; side: 'left' | 'right'; isActive: boolean }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });

    return (
        <motion.div
            ref={ref}
            initial={{ x: side === 'left' ? -50 : 50, opacity: 0 }}
            animate={{ x: isInView ? 0 : (side === 'left' ? -50 : 50), opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="p-8 bg-deep-space/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group hover:border-cyan-glow/30 transition-colors">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-glow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Year Badge */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-block px-4 py-2 mb-4 bg-cyan-glow/20 border border-cyan-glow rounded-full"
                >
                    <span className="text-cyan-glow font-orbitron font-bold text-lg">{event.year}</span>
                </motion.div>

                {/* Title */}
                <h2 className="text-3xl font-orbitron text-star-white mb-4 leading-tight relative z-10">
                    {event.title}
                </h2>

                {/* Description */}
                <p className="text-star-white/80 mb-6 leading-relaxed relative z-10">
                    {event.description}
                </p>

                {/* Key Facts */}
                <div className="space-y-3 relative z-10">
                    <h3 className="text-sm font-orbitron text-cyan-glow uppercase tracking-wider mb-3">
                        Key Facts
                    </h3>
                    {event.facts.map((fact, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="flex items-start gap-3"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow mt-2 flex-shrink-0" />
                            <span className="text-sm text-star-white/70">{fact}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Significance Badge */}
                <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                    <span className={cn(
                        "inline-block px-3 py-1 rounded text-xs font-bold border",
                        event.significance === 'critical'
                            ? 'bg-warning-orange/20 text-warning-orange border-warning-orange/30'
                            : 'bg-plasma-purple/20 text-plasma-purple border-plasma-purple/30'
                    )}>
                        {event.significance === 'critical' ? '⭐ Critical Milestone' : '🚀 Major Achievement'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
