'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
// We'll implement these panels next
// import { NEOPanel } from '@/components/panels/NEOPanel';
// import { ISSPanel } from '@/components/panels/ISSPanel';
// import { MarsPanel } from '@/components/panels/MarsPanel';
// import { APODPanel } from '@/components/panels/APODPanel';
// import { LaunchesPanel } from '@/components/panels/LaunchesPanel';
// import { NewsPanel } from '@/components/panels/NewsPanel';

import { useState, useEffect } from 'react';
import { getCachedData } from '@/lib/cache';
import { X, Calendar, ChevronLeft, ChevronRight, Telescope } from 'lucide-react';
import { CALENDAR_DATA } from '@/lib/calendarData';

export function Dashboard() {
    const { mode, isNeoOverlayOpen, setNeoOverlayOpen } = useAppStore();
    const [neoData, setNeoData] = useState<any>(null);
    const [issData, setIssData] = useState<any>(null);
    const [marsData, setMarsData] = useState<any>(null);
    const [apodData, setApodData] = useState<any>(null);

    // Overlay States
    const [selectedMarsPhoto, setSelectedMarsPhoto] = useState<string | null>(null);
    const [selectedApod, setSelectedApod] = useState<any>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarYear, setCalendarYear] = useState(2026);

    const fetchData = async () => {
        // NEO Data (Cache for 1 hour)
        try {
            const neo = await getCachedData(
                'neo-data',
                async () => {
                    const res = await fetch('/api/space/neo');
                    if (!res.ok) throw new Error('Failed to fetch NEO');
                    return res.json();
                },
                3600000, // 1 hour TTL
                { element_count: 0, near_earth_objects: {} }, // Fallback
                10000 // 10s timeout
            );
            setNeoData(neo);
        } catch (e) { console.error(e); }

        // APOD Data (Cache for 24 hours)
        try {
            const apod = await getCachedData(
                'apod-data',
                async () => {
                    const res = await fetch('/api/space/apod');
                    if (!res.ok) throw new Error('Failed to fetch APOD');
                    return res.json();
                },
                86400000, // 24 hours TTL
                null, // No fallback needed initially, UI handles null
                10000
            );
            setApodData(apod);
        } catch (e) { console.error(e); }

        // ISS Data (Cache for 1 minute - essentially polling)
        try {
            const iss = await getCachedData(
                'iss-data',
                async () => {
                    const res = await fetch('/api/space/iss');
                    if (!res.ok) throw new Error('Failed to fetch ISS');
                    return res.json();
                },
                60000, // 1 min TTL
                { latitude: 51.5074, longitude: -0.1278, altitude: 408, velocity: 27580 }, // Fallback (London approx)
                10000
            );
            setIssData(iss);
        } catch (e) { console.error(e); }

        // Mars Data (Cache for 24 hours)
        try {
            const mars = await getCachedData(
                'mars-data',
                async () => {
                    const res = await fetch('/api/space/mars');
                    if (!res.ok) throw new Error('Failed to fetch Mars');
                    return res.json();
                },
                86400000, // 24 hours TTL
                { photos: [] }, // Fallback
                10000
            );
            setMarsData(mars);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (mode === 'dashboard') {
            fetchData();
            // Poll every minute
            const interval = setInterval(fetchData, 60000);
            return () => clearInterval(interval);
        }
    }, [mode]);

    return (
        <AnimatePresence>
            {mode === 'dashboard' && (
                <>
                    {/* Backdrop to block canvas interaction */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed right-0 top-0 h-screen w-[500px] z-20 overflow-y-auto bg-deep-space/80 backdrop-blur-xl border-l border-cyan-glow/20 shadow-2xl"
                    >
                        <div className="p-6 space-y-6">
                            <h2 className="text-2xl font-orbitron text-cyan-glow mb-6">Mission Dashboard</h2>

                            {/* NEO Panel */}
                            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-lg font-orbitron text-star-white mb-4">Near-Earth Objects (Today)</h3>
                                {neoData ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                            <div>
                                                <p className="text-3xl font-bold text-white leading-none">{neoData.element_count}</p>
                                                <p className="text-[10px] text-star-white/60 uppercase tracking-wider">Objects Detected</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-cyan-glow animate-pulse">● Live Tracking</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-glow/20 pr-2">
                                            {Object.values(neoData.near_earth_objects).flat().slice(0, 5).map((neo: any) => (
                                                <div key={neo.id} className="bg-black/20 p-3 rounded border border-white/5 hover:border-cyan-glow/30 transition-colors">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-sm font-bold text-white">{neo.name}</p>
                                                        {neo.is_potentially_hazardous_asteroid && (
                                                            <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">HAZARDOUS</span>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-star-white/70">
                                                        <div>
                                                            <span className="block text-star-white/40">DIAMETER</span>
                                                            {Math.round(neo.estimated_diameter.meters.estimated_diameter_max)}m
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block text-star-white/40">MISS DISTANCE</span>
                                                            {(parseInt(neo.close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(1)}M km
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setNeoOverlayOpen(true)}
                                            className="w-full mt-2 py-2 bg-white/5 hover:bg-cyan-glow/10 border border-white/10 hover:border-cyan-glow/50 rounded flex items-center justify-center gap-2 transition-all group"
                                        >
                                            <Telescope size={14} className="text-cyan-glow" />
                                            <span className="font-orbitron text-xs text-star-white group-hover:text-white tracking-wider">VIEW ALL OBJECTS</span>
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-star-white/60 animate-pulse">Scanning deep space...</p>
                                )}
                            </div>

                            {/* ISS Panel */}
                            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-lg font-orbitron text-star-white mb-2">ISS Position</h3>
                                {issData ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-star-white/60">Latitude</span>
                                            <span className="text-sm text-cyan-glow">{issData.latitude?.toFixed(4)}°</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-star-white/60">Longitude</span>
                                            <span className="text-sm text-cyan-glow">{issData.longitude?.toFixed(4)}°</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-star-white/60">Velocity</span>
                                            <span className="text-sm text-cyan-glow">{Math.round(issData.velocity)} km/h</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-star-white/60 animate-pulse">Tracking station...</p>
                                )}
                            </div>

                            {/* APOD Panel */}
                            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-lg font-orbitron text-star-white mb-2">Astronomy Picture of the Day</h3>
                                {apodData ? (
                                    <div className="space-y-4">
                                        <div
                                            className="aspect-video rounded-lg overflow-hidden bg-black relative group cursor-pointer border border-transparent hover:border-cyan-glow/50 transition-all"
                                            onClick={() => setSelectedApod(apodData)}
                                        >
                                            {apodData.media_type === 'image' ? (
                                                <img
                                                    src={apodData.url}
                                                    alt={apodData.title}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                                                />
                                            ) : (
                                                <iframe
                                                    src={apodData.url}
                                                    title={apodData.title}
                                                    className="w-full h-full pointer-events-none" // Disable interaction in preview
                                                    allowFullScreen
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-cyan-glow font-orbitron text-sm tracking-widest">VIEW FULLSCREEN</span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent pointer-events-none">
                                                <p className="text-xs text-white truncate">{apodData.title}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-star-white/60 line-clamp-3">{apodData.explanation}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-star-white/60 animate-pulse">Retrieving cosmic imagery...</p>
                                )}
                            </div>

                            {/* Mars Panel */}
                            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-lg font-orbitron text-star-white mb-2">Latest from Mars</h3>
                                {marsData && marsData.photos && marsData.photos.length > 0 ? (
                                    <div className="space-y-4">
                                        <div
                                            className="aspect-video rounded-lg overflow-hidden bg-black relative group cursor-pointer border border-transparent hover:border-cyan-glow/50 transition-all"
                                            onClick={() => setSelectedMarsPhoto(marsData.photos[0].img_src)}
                                        >
                                            <img
                                                src={marsData.photos[0].img_src}
                                                alt="Mars Rover"
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-cyan-glow font-orbitron text-sm tracking-widest">VIEW FULLSCREEN</span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent pointer-events-none">
                                                <p className="text-xs text-white">{marsData.photos[0].camera.full_name}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-star-white/60">Rover: {marsData.photos[0].rover.name} • Sol: {marsData.photos[0].sol}</p>

                                        {/* Calendar Button */}
                                        <button
                                            onClick={() => setShowCalendar(true)}
                                            className="w-full mt-4 py-3 bg-white/5 hover:bg-cyan-glow/10 border border-white/10 hover:border-cyan-glow/50 rounded flex items-center justify-center gap-2 transition-all group"
                                        >
                                            <Calendar size={16} className="text-cyan-glow" />
                                            <span className="font-orbitron text-sm text-star-white group-hover:text-white tracking-wider">ASTRONOMICAL CALENDAR</span>
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-star-white/60 animate-pulse">Establishing link...</p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Mars Photo Overlay */}
                    <AnimatePresence>
                        {selectedMarsPhoto && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-8"
                                onClick={() => setSelectedMarsPhoto(null)}
                            >
                                <button
                                    className="absolute top-8 right-8 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    onClick={() => setSelectedMarsPhoto(null)}
                                >
                                    <X size={32} />
                                </button>
                                <motion.img
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    src={selectedMarsPhoto}
                                    alt="Mars Fullscreen"
                                    className="max-w-full max-h-full rounded-lg shadow-2xl border border-white/10"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* APOD Overlay */}
                    <AnimatePresence>
                        {selectedApod && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-8"
                                onClick={() => setSelectedApod(null)}
                            >
                                <button
                                    className="absolute top-8 right-8 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
                                    onClick={() => setSelectedApod(null)}
                                >
                                    <X size={32} />
                                </button>
                                <div className="max-w-6xl w-full max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                                    {selectedApod.media_type === 'image' ? (
                                        <motion.img
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            src={selectedApod.url}
                                            alt={selectedApod.title}
                                            className="max-w-full max-h-[80vh] rounded-lg shadow-2xl border border-white/10"
                                        />
                                    ) : (
                                        <div className="w-full aspect-video">
                                            <iframe
                                                src={selectedApod.url}
                                                title={selectedApod.title}
                                                className="w-full h-full rounded-lg border border-white/10"
                                                allowFullScreen
                                            />
                                        </div>
                                    )}
                                    <div className="mt-4 text-center max-w-3xl">
                                        <h2 className="text-2xl font-orbitron text-white mb-2">{selectedApod.title}</h2>
                                        <p className="text-sm text-star-white/80 leading-relaxed">{selectedApod.explanation}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Calendar Overlay */}
                    <AnimatePresence>
                        {showCalendar && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                            >
                                <div className="w-full max-w-4xl bg-deep-space/95 border border-cyan-glow/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                                    {/* Header */}
                                    <div className="p-6 border-b border-cyan-glow/20 bg-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setShowCalendar(false)}
                                                className="p-2 rounded-full hover:bg-white/10 text-cyan-glow transition-colors"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <div>
                                                <h2 className="text-2xl font-orbitron text-white tracking-widest">ASTRONOMICAL CALENDAR</h2>
                                                <p className="text-xs text-cyan-glow font-mono tracking-[0.3em]">MAJOR EVENTS</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 bg-black/30 rounded-full p-1 border border-white/10">
                                            <button
                                                onClick={() => setCalendarYear(2025)}
                                                className={`px-4 py-1.5 rounded-full text-sm font-orbitron transition-all ${calendarYear === 2025 ? 'bg-cyan-glow text-black' : 'text-star-white/60 hover:text-white'}`}
                                            >
                                                2025
                                            </button>
                                            <button
                                                onClick={() => setCalendarYear(2026)}
                                                className={`px-4 py-1.5 rounded-full text-sm font-orbitron transition-all ${calendarYear === 2026 ? 'bg-cyan-glow text-black' : 'text-star-white/60 hover:text-white'}`}
                                            >
                                                2026
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 overflow-y-auto p-8 space-y-4">
                                        {CALENDAR_DATA[calendarYear]?.map((event, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-glow/50 rounded-xl p-6 transition-all"
                                            >
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-glow to-transparent rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                                    <div className="flex-shrink-0 w-24 text-center">
                                                        <span className="block text-3xl font-bold text-white">{new Date(event.date).getDate()}</span>
                                                        <span className="text-xs font-orbitron text-cyan-glow uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-xl font-orbitron text-white">{event.title}</h3>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded border ${event.type === 'eclipse' ? 'border-purple-500 text-purple-400 bg-purple-500/10' :
                                                                event.type === 'meteor-shower' ? 'border-blue-500 text-blue-400 bg-blue-500/10' :
                                                                    event.type === 'mission' ? 'border-green-500 text-green-400 bg-green-500/10' :
                                                                        'border-gray-500 text-gray-400 bg-gray-500/10'
                                                                } uppercase tracking-wider`}>
                                                                {event.type.replace('-', ' ')}
                                                            </span>
                                                        </div>
                                                        <p className="text-star-white/80 leading-relaxed">{event.description}</p>
                                                    </div>

                                                    <div className="flex-shrink-0">
                                                        <Telescope className="text-white/20 group-hover:text-cyan-glow transition-colors" size={32} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* NEO Overlay */}
                    <AnimatePresence>
                        {isNeoOverlayOpen && neoData && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                            >
                                <div className="w-full max-w-5xl bg-deep-space/95 border border-cyan-glow/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                                    {/* Header */}
                                    <div className="p-6 border-b border-cyan-glow/20 bg-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setNeoOverlayOpen(false)}
                                                className="p-2 rounded-full hover:bg-white/10 text-cyan-glow transition-colors"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <div>
                                                <h2 className="text-2xl font-orbitron text-white tracking-widest">NEAR-EARTH OBJECTS</h2>
                                                <p className="text-xs text-cyan-glow font-mono tracking-[0.3em]">LIVE TRACKING DATA</p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-white leading-none">{neoData.element_count}</p>
                                            <p className="text-[10px] text-star-white/60 uppercase tracking-wider">TOTAL OBJECTS TODAY</p>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 overflow-y-auto p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.values(neoData.near_earth_objects).flat().map((neo: any) => (
                                                <motion.div
                                                    key={neo.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`p-4 rounded-xl border ${neo.is_potentially_hazardous_asteroid ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'} hover:border-cyan-glow/50 transition-all group`}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-glow transition-colors">{neo.name}</h3>
                                                            <p className="text-xs text-star-white/60">ID: {neo.id}</p>
                                                        </div>
                                                        {neo.is_potentially_hazardous_asteroid && (
                                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/20 border border-red-500/30">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                                <span className="text-[10px] font-bold text-red-400 tracking-wider">HAZARDOUS</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-star-white/40 uppercase tracking-wider">DIAMETER (MAX)</p>
                                                            <p className="text-white font-mono">{Math.round(neo.estimated_diameter.meters.estimated_diameter_max)} meters</p>
                                                        </div>
                                                        <div className="space-y-1 text-right">
                                                            <p className="text-[10px] text-star-white/40 uppercase tracking-wider">MISS DISTANCE</p>
                                                            <p className="text-cyan-glow font-mono">{(parseInt(neo.close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(2)}M km</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-star-white/40 uppercase tracking-wider">VELOCITY</p>
                                                            <p className="text-white font-mono">{Math.round(parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour)).toLocaleString()} km/h</p>
                                                        </div>
                                                        <div className="space-y-1 text-right">
                                                            <p className="text-[10px] text-star-white/40 uppercase tracking-wider">MAGNITUDE</p>
                                                            <p className="text-white font-mono">{neo.absolute_magnitude_h}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                                                        <span className="text-[10px] text-star-white/40">CLOSE APPROACH</span>
                                                        <span className="text-xs text-white">{neo.close_approach_data[0].close_approach_date_full}</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
}
