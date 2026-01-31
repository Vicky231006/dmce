'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { getCachedData } from '@/lib/cache';
import { X, Calendar, ChevronLeft, ChevronRight, Telescope, Sparkles, Rocket, LayoutDashboard, MessageSquare, Globe, Thermometer, Flame, Sprout, Activity } from 'lucide-react';
import { CALENDAR_DATA } from '@/lib/calendarData';
import { COSMIC_WEATHER_DATA, SATELLITE_DATA } from '@/lib/dashboardData';

export function Dashboard() {
    const {
        mode,
        isNeoOverlayOpen,
        setNeoOverlayOpen,
        dashboardOverlay,
        setDashboardOverlay,
        selectedSatelliteImpact,
        setSelectedSatelliteImpact
    } = useAppStore();

    const [neoData, setNeoData] = useState<any>(null);
    const [issData, setIssData] = useState<any>(null);
    const [marsData, setMarsData] = useState<any>(null);
    const [apodData, setApodData] = useState<any>(null);
    const [weatherData, setWeatherData] = useState<any>(null);

    // Local Overlay States
    const [selectedMarsPhoto, setSelectedMarsPhoto] = useState<string | null>(null);
    const [selectedApod, setSelectedApod] = useState<any>(null);
    const [calendarYear, setCalendarYear] = useState(2026);
    const [hoveredCalendarEvent, setHoveredCalendarEvent] = useState<number | null>(null);

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
                3600000,
                { element_count: 0, near_earth_objects: {} },
                10000
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
                86400000,
                null,
                10000
            );
            setApodData(apod);
        } catch (e) { console.error(e); }

        // ISS Data (Cache for 1 minute)
        try {
            const iss = await getCachedData(
                'iss-data',
                async () => {
                    const res = await fetch('/api/space/iss');
                    if (!res.ok) throw new Error('Failed to fetch ISS');
                    return res.json();
                },
                60000,
                { latitude: 51.5074, longitude: -0.1278, altitude: 408, velocity: 27580 },
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
                86400000,
                { photos: [] },
                10000
            );
            setMarsData(mars);
        } catch (e) { console.error(e); }

        // Cosmic Weather Data (Cache for 1 minute)
        try {
            const weather = await getCachedData(
                'weather-data',
                async () => {
                    const res = await fetch('/api/space/weather');
                    if (!res.ok) throw new Error('Failed to fetch Weather');
                    return res.json();
                },
                60000,
                COSMIC_WEATHER_DATA,
                10000
            );
            setWeatherData(weather);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (mode === 'dashboard') {
            fetchData();
            const interval = setInterval(fetchData, 60000);
            return () => clearInterval(interval);
        }
    }, [mode]);

    // Helper to get icon for satellite impact
    const getImpactIcon = (title: string) => {
        if (title.toLowerCase().includes('climate')) return <Thermometer size={80} className="text-cyan-glow opacity-50" />;
        if (title.toLowerCase().includes('disaster') || title.toLowerCase().includes('fire')) return <Flame size={80} className="text-red-400 opacity-50" />;
        if (title.toLowerCase().includes('agriculture') || title.toLowerCase().includes('crop')) return <Sprout size={80} className="text-green-400 opacity-50" />;
        return <Activity size={80} className="text-cyan-glow opacity-50" />;
    };

    return (
        <AnimatePresence>
            {mode === 'dashboard' && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Main Dashboard Sidebar */}
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed right-0 top-0 h-screen w-full md:w-[500px] z-20 overflow-y-auto bg-deep-space/80 backdrop-blur-xl border-l border-cyan-glow/20 shadow-2xl pt-20 md:pt-0"
                    >
                        <div className="p-4 md:p-6 space-y-6">
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
                                                            {/* {Math.round(neo.estimated_diameter.meters.estimated_diameter_max)}m */}
                                                            {neo.estimated_diameter?.meters?.estimated_diameter_max
                                                                ? `${Math.round(neo.estimated_diameter.meters.estimated_diameter_max)}m`
                                                                : 'N/A'}
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
                                                    className="w-full h-full pointer-events-none"
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
                                    </div>
                                ) : (
                                    <p className="text-sm text-star-white/60 animate-pulse">Establishing link...</p>
                                )}
                            </div>

                            {/* Astronomical Calendar Panel */}
                            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-lg font-orbitron text-star-white mb-2">Astronomical Calendar</h3>
                                <p className="text-xs text-star-white/60 mb-4">Track upcoming celestial events, eclipses, and meteor showers.</p>
                                <button
                                    onClick={() => setDashboardOverlay('calendar')}
                                    className="w-full py-3 bg-white/5 hover:bg-cyan-glow/10 border border-white/10 hover:border-cyan-glow/50 rounded flex items-center justify-center gap-2 transition-all group"
                                >
                                    <Calendar size={16} className="text-cyan-glow" />
                                    <span className="font-orbitron text-sm text-star-white group-hover:text-white tracking-wider">VIEW CALENDAR</span>
                                </button>
                            </div>

                            {/* Cosmic Weather Panel */}
                            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-lg font-orbitron text-star-white mb-2">Real-time Cosmic Weather</h3>
                                {weatherData ? (
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        <div className="bg-black/20 p-2 rounded border border-white/5 text-center">
                                            <p className="text-[10px] text-star-white/40 uppercase">SOLAR</p>
                                            <p className="text-xs font-bold text-yellow-400">{weatherData.solarStorms.status}</p>
                                        </div>
                                        <div className="bg-black/20 p-2 rounded border border-white/5 text-center">
                                            <p className="text-[10px] text-star-white/40 uppercase">AURORA</p>
                                            <p className="text-xs font-bold text-green-400">{weatherData.auroraForecast.probability}</p>
                                        </div>
                                        <div className="bg-black/20 p-2 rounded border border-white/5 text-center">
                                            <p className="text-[10px] text-star-white/40 uppercase">RAD</p>
                                            <p className="text-xs font-bold text-blue-400">{weatherData.radiation.level}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-star-white/60 animate-pulse mb-4">Scanning space weather...</p>
                                )}
                                <button
                                    onClick={() => setDashboardOverlay('weather')}
                                    className="w-full py-3 bg-white/5 hover:bg-cyan-glow/10 border border-white/10 hover:border-cyan-glow/50 rounded flex items-center justify-center gap-2 transition-all group"
                                >
                                    <Sparkles size={16} className="text-cyan-glow" />
                                    <span className="font-orbitron text-sm text-star-white group-hover:text-white tracking-wider">WEATHER DATA</span>
                                </button>
                            </div>

                            {/* Satellite Contributions Panel */}
                            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-lg font-orbitron text-star-white mb-2">Satellite Contributions</h3>
                                <p className="text-xs text-star-white/60 mb-4">Real-world impact of space technology on Earth.</p>
                                <button
                                    onClick={() => setDashboardOverlay('satellite')}
                                    className="w-full py-3 bg-white/5 hover:bg-cyan-glow/10 border border-white/10 hover:border-cyan-glow/50 rounded flex items-center justify-center gap-2 transition-all group"
                                >
                                    <Rocket size={16} className="text-cyan-glow" />
                                    <span className="font-orbitron text-sm text-star-white group-hover:text-white tracking-wider">VIEW IMPACT</span>
                                </button>
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
                        {dashboardOverlay === 'calendar' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/80 backdrop-blur-md p-4 pt-24 md:pt-4"
                            >
                                <div className="w-full max-w-4xl bg-deep-space/95 border border-cyan-glow/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] relative">
                                    {/* Header */}
                                    <div className="p-4 md:p-6 border-b border-cyan-glow/20 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setDashboardOverlay('none')}
                                                className="p-2 rounded-full hover:bg-white/10 text-cyan-glow transition-colors"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <div>
                                                <h2 className="text-xl md:text-2xl font-orbitron text-white tracking-widest">ASTRONOMICAL CALENDAR</h2>
                                                <p className="text-xs text-cyan-glow font-mono tracking-[0.3em]">MAJOR EVENTS</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pl-12 md:pl-0">
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
                                    </div>
                                    {/* Content */}
                                <div className="flex-1 overflow-y-auto p-8 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                    {CALENDAR_DATA[calendarYear]?.map((event, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            onMouseEnter={() => setHoveredCalendarEvent(idx)}
                                            onMouseLeave={() => setHoveredCalendarEvent(null)}
                                            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-glow/50 rounded-xl p-6 transition-all cursor-default"
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-glow to-transparent rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="grid grid-cols-1 xl:grid-cols-[6rem_1fr_auto] gap-4 xl:gap-6 items-start">
                                                <div className="w-full xl:w-auto flex items-center xl:block gap-4 border-b xl:border-b-0 border-white/10 pb-2 xl:pb-0">
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

                                                <div className="flex-shrink-0 relative">
                                                    <Telescope className="text-white/20 group-hover:text-cyan-glow transition-colors" size={32} />

                                                    {/* Hover Overlay */}
                                                    <AnimatePresence>
                                                        {hoveredCalendarEvent === idx && (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                                                className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-64 bg-deep-space/95 border border-cyan-glow/30 rounded-lg p-4 shadow-xl z-50 pointer-events-none"
                                                            >
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Globe size={14} className="text-cyan-glow" />
                                                                    <span className="text-[10px] font-orbitron text-cyan-glow uppercase tracking-wider">VISIBILITY</span>
                                                                </div>
                                                                <p className="text-xs text-white leading-relaxed">{event.visibility}</p>
                                                            </motion.div>
                                                        )}
                                                        
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                </div>

                                
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Cosmic Weather Overlay */}
                    <AnimatePresence>
                        {dashboardOverlay === 'weather' && weatherData && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                            >
                                <div className="w-full max-w-4xl bg-deep-space/95 border border-cyan-glow/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-[80vh]">
                                    <div className="p-6 border-b border-cyan-glow/20 bg-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setDashboardOverlay('none')}
                                                className="p-2 rounded-full hover:bg-white/10 text-cyan-glow transition-colors"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <div>
                                                <h2 className="text-2xl font-orbitron text-white tracking-widest">COSMIC WEATHER</h2>
                                                <p className="text-xs text-cyan-glow font-mono tracking-[0.3em]">REAL-TIME ALERTS</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Solar Storms */}
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-yellow-400/50 transition-colors">
                                                <h3 className="text-lg font-orbitron text-yellow-400 mb-4">Solar Storms</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-xs text-star-white/60 uppercase">STATUS</p>
                                                        <p className="text-2xl font-bold text-white">{weatherData.solarStorms.status}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-star-white/60 uppercase">KP INDEX</p>
                                                        <p className="text-xl font-mono text-white">{weatherData.solarStorms.kpIndex}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-star-white/60 uppercase">LAST FLARE</p>
                                                        <p className="text-sm text-white">{weatherData.solarStorms.lastFlare}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Aurora Forecast */}
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-green-400/50 transition-colors">
                                                <h3 className="text-lg font-orbitron text-green-400 mb-4">Aurora Forecast</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-xs text-star-white/60 uppercase">VISIBILITY</p>
                                                        <p className="text-xl font-bold text-white">{weatherData.auroraForecast.visibility}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-star-white/60 uppercase">PROBABILITY</p>
                                                        <p className="text-2xl font-mono text-white">{weatherData.auroraForecast.probability}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-star-white/60 uppercase">NEXT PEAK</p>
                                                        <p className="text-sm text-white">{weatherData.auroraForecast.nextPeak}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Radiation Alerts */}
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-400/50 transition-colors">
                                                <h3 className="text-lg font-orbitron text-blue-400 mb-4">Radiation</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-xs text-star-white/60 uppercase">LEVEL</p>
                                                        <p className="text-2xl font-bold text-white">{weatherData.radiation.level}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-star-white/60 uppercase">FLUX</p>
                                                        <p className="text-sm font-mono text-white">{weatherData.radiation.flux}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-star-white/60 uppercase">RISK</p>
                                                        <p className="text-xl text-white">{weatherData.radiation.risk}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Satellite Contributions Overlay */}
                    <AnimatePresence>
                        {dashboardOverlay === 'satellite' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                            >
                                <div className="w-full max-w-5xl bg-deep-space/95 border border-cyan-glow/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] relative">
                                    <div className="p-6 border-b border-cyan-glow/20 bg-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setDashboardOverlay('none')}
                                                className="p-2 rounded-full hover:bg-white/10 text-cyan-glow transition-colors"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <div>
                                                <h2 className="text-2xl font-orbitron text-white tracking-widest">SATELLITE CONTRIBUTIONS</h2>
                                                <p className="text-xs text-cyan-glow font-mono tracking-[0.3em]">EARTH IMPACT ANALYSIS</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                            {/* Impact Cards */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-orbitron text-star-white mb-4">Key Impact Areas</h3>
                                                {SATELLITE_DATA.contributions.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-glow/50 hover:bg-white/10 transition-all cursor-pointer group"
                                                        onClick={() => setSelectedSatelliteImpact(item)}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-bold text-white group-hover:text-cyan-glow transition-colors">{item.title}</h4>
                                                            <span className={`text-xs px-2 py-0.5 rounded ${item.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white'}`}>
                                                                {item.trend === 'up' ? '▲ POSITIVE' : '● STABLE'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-star-white/80 mb-3">{item.description}</p>
                                                        <p className="text-xl font-mono text-cyan-glow">{item.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Graph Visualization */}
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col h-[400px]">
                                                <h3 className="text-lg font-orbitron text-star-white mb-6">Global Coverage Trend</h3>
                                                <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4 border-b border-white/10 relative">
                                                    {/* Grid lines */}
                                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
                                                        <div className="w-full h-px bg-white" />
                                                        <div className="w-full h-px bg-white" />
                                                        <div className="w-full h-px bg-white" />
                                                        <div className="w-full h-px bg-white" />
                                                    </div>

                                                    {SATELLITE_DATA.graphData.map((data, idx) => (
                                                        <div key={idx} className="flex flex-col items-center gap-2 group w-full z-10 h-full justify-end">
                                                            <div
                                                                className="w-full bg-cyan-glow/20 border-t border-x border-cyan-glow/50 rounded-t-sm relative group-hover:bg-cyan-glow/40 transition-all"
                                                                style={{ height: `${data.coverage}%` }}
                                                            >
                                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                                                                    {data.coverage}% Coverage
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-star-white/60">{data.year}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Impact Overlay */}
                                    <AnimatePresence>
                                        {selectedSatelliteImpact && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 50 }}
                                                className="absolute inset-0 z-50 bg-deep-space/95 backdrop-blur-xl flex flex-col"
                                            >
                                                <div className="p-6 border-b border-cyan-glow/20 bg-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => setSelectedSatelliteImpact(null)}
                                                            className="p-2 rounded-full hover:bg-white/10 text-cyan-glow transition-colors"
                                                        >
                                                            <ChevronLeft size={24} />
                                                        </button>
                                                        <div>
                                                            <h2 className="text-xl font-orbitron text-white tracking-widest">{selectedSatelliteImpact.title.toUpperCase()}</h2>
                                                            <p className="text-xs text-cyan-glow font-mono tracking-[0.3em]">IMPACT ANALYSIS</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 overflow-y-auto p-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-6">
                                                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                                                <h3 className="text-lg font-orbitron text-cyan-glow mb-4">Satellite Enabled Solution</h3>
                                                                <p className="text-star-white/80 leading-relaxed">
                                                                    By utilizing advanced satellite imagery and real-time data processing, we have achieved a <span className="text-white font-bold">{selectedSatelliteImpact.value}</span> improvement.
                                                                    This allows for precise monitoring and rapid response capabilities that were previously impossible.
                                                                </p>
                                                            </div>
                                                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 opacity-60">
                                                                <h3 className="text-lg font-orbitron text-red-400 mb-4">Pre-Satellite Era</h3>
                                                                <p className="text-star-white/80 leading-relaxed">
                                                                    Before satellite integration, data collection was manual, sporadic, and often delayed by days or weeks.
                                                                    Coverage was limited to accessible ground stations, leaving vast blind spots in global monitoring.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-black/30 rounded-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group p-8">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-glow/10 to-transparent" />

                                                            {/* Dynamic Icon */}
                                                            <div className="relative z-10 mb-6 p-6 rounded-full bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                                                                {getImpactIcon(selectedSatelliteImpact.title)}
                                                            </div>

                                                            <div className="text-center relative z-10">
                                                                <p className="text-xs text-cyan-glow font-mono uppercase tracking-[0.2em] mb-2">LIVE MONITORING</p>
                                                                <p className="text-2xl font-bold text-white mb-1">{selectedSatelliteImpact.value}</p>
                                                                <p className="text-xs text-star-white/60">Real-time data stream active</p>
                                                            </div>

                                                            {/* Scanning Effect */}
                                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-glow/5 to-transparent h-[200%] w-full animate-scan pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
                                <div className="w-full max-w-5xl bg-deep-space/95 border border-cyan-glow/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh]">
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
                                                            <p className="text-white font-mono">{neo.estimated_diameter?.meters?.estimated_diameter_max
                                                                ? `${Math.round(neo.estimated_diameter.meters.estimated_diameter_max)} meters`
                                                                : 'N/A'}</p>
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
