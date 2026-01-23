'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface VideoPlayerProps {
    videoUrl: string;
    thumbnail: string;
    isActive: boolean; // Is in viewport
    side: 'left' | 'right';
}

export function VideoPlayer({ videoUrl, thumbnail, isActive, side }: VideoPlayerProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });

    useEffect(() => {
        if (isInView && iframeRef.current) {
            // Auto-play when in viewport
            const playVideo = () => {
                iframeRef.current?.contentWindow?.postMessage(
                    '{"event":"command","func":"playVideo","args":""}',
                    '*'
                );
            };

            playVideo();
            // Retry after a short delay to ensure iframe is ready
            setTimeout(playVideo, 1000);
        } else if (!isInView && iframeRef.current) {
            // Pause when out of viewport
            iframeRef.current.contentWindow?.postMessage(
                '{"event":"command","func":"pauseVideo","args":""}',
                '*'
            );
        }
    }, [isInView]);

    return (
        <motion.div
            ref={ref}
            initial={{ x: side === 'left' ? -50 : 50, opacity: 0 }}
            animate={{ x: isInView ? 0 : (side === 'left' ? -50 : 50), opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full aspect-video rounded-lg overflow-hidden border border-cyan-glow/30 shadow-2xl bg-black"
        >
            {/* Thumbnail (shows while loading) */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${thumbnail})` }}
                >
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-cyan-glow border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            )}

            {/* YouTube iframe */}
            <iframe
                ref={iframeRef}
                src={`${videoUrl}?autoplay=${isActive ? 1 : 0}&mute=1&loop=1&controls=0&modestbranding=1&rel=0&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media"
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
                title="Timeline Video"
            />

            {/* Glow overlay */}
            <div className="absolute inset-0 pointer-events-none border-2 border-cyan-glow/20 rounded-lg" />
        </motion.div>
    );
}
