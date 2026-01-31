'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, useSidebarStore } from '@/lib/store';
import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, MessageSquare } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Context
    const selectedPlanet = useSidebarStore(state => state.selectedPlanet);
    const {
        mode,
        timelineIndex,
        isNeoOverlayOpen,
        dashboardOverlay,
        selectedCalendarEvent,
        selectedSatelliteImpact
    } = useAppStore();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Context construction
            let context = `User is in ${mode} mode.`;
            let timelineEvent = null;

            if (mode === 'explore' && selectedPlanet) {
                context += ` Viewing planet: ${selectedPlanet}.`;
            } else if (mode === 'mission') {
                // Import dynamically to avoid circular dependencies if possible, or just use the static data
                const { SPACE_TIMELINE_EVENTS } = await import('@/lib/timelineData');
                const event = SPACE_TIMELINE_EVENTS[timelineIndex];
                if (event) {
                    context += ` Viewing timeline event: ${event.title} (${event.year}).`;
                    timelineEvent = event;
                }
            } else if (mode === 'dashboard') {
                // Fetch current dashboard data to provide context
                try {
                    const [neoRes, issRes, marsRes, apodRes, weatherRes] = await Promise.all([
                        fetch('/api/space/neo'),
                        fetch('/api/space/iss'),
                        fetch('/api/space/mars'),
                        fetch('/api/space/apod'),
                        fetch('/api/space/weather')
                    ]);

                    const neo = await neoRes.json();
                    const iss = await issRes.json();
                    const mars = await marsRes.json();
                    const apod = await apodRes.json();
                    const weather = await weatherRes.json();

                    context += ` Viewing Mission Dashboard.
                    - APOD: ${apod.title} (${apod.explanation.substring(0, 100)}...)
                    - NEOs: ${neo.element_count} objects detected today.
                    - ISS Location: Lat ${iss.latitude?.toFixed(2)}, Lon ${iss.longitude?.toFixed(2)}.
                    - Mars: Latest photo from ${mars.photos?.[0]?.rover?.name} (Sol ${mars.photos?.[0]?.sol}).`;

                    // Add Overlay Specific Context
                    if (dashboardOverlay === 'calendar') {
                        context += `\nUser has the Astronomical Calendar open.`;
                        if (selectedCalendarEvent) {
                            context += `\nUser is viewing details for event: ${selectedCalendarEvent.title} on ${selectedCalendarEvent.date}.
                            - Type: ${selectedCalendarEvent.type}
                            - Description: ${selectedCalendarEvent.description}
                            - Visibility: ${selectedCalendarEvent.visibility || 'Global'}`;
                        }
                    } else if (dashboardOverlay === 'weather') {
                        context += `\nUser has the Cosmic Weather panel open.
                        - Solar Storm Status: ${weather.solarStorms.status} (KP: ${weather.solarStorms.kpIndex})
                        - Aurora Forecast: ${weather.auroraForecast.probability} probability in ${weather.auroraForecast.visibility}
                        - Radiation Level: ${weather.radiation.level}`;
                    } else if (dashboardOverlay === 'satellite') {
                        context += `\nUser has the Satellite Contributions panel open.`;
                        if (selectedSatelliteImpact) {
                            context += `\nUser is viewing impact analysis for: ${selectedSatelliteImpact.title}.
                            - Value: ${selectedSatelliteImpact.value}
                            - Description: ${selectedSatelliteImpact.description}`;
                        }
                    } else if (isNeoOverlayOpen) {
                        context += `\nUser has the Near-Earth Objects (NEO) overlay open.`;
                    }

                } catch (e) {
                    context += ` Viewing Mission Dashboard (Data unavailable).`;
                }
            }

            // Prepare history for API
            const history = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    history, // Send history
                    context,
                    timelineEvent
                })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.message,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('Chat Error:', error);
            let errorMessageContent = "I'm having trouble connecting to the neural network. Please check your API configuration.";

            if (error.message.includes('503')) {
                errorMessageContent = "My neural pathways are currently overloaded. Please try again in a moment.";
            } else if (error.message.includes('429')) {
                errorMessageContent = "I'm receiving too many requests at once. Please slow down, Commander.";
            }

            const errorMessage: Message = {
                role: 'assistant',
                content: errorMessageContent,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-24 md:bottom-8 z-[60] w-14 h-14 md:w-16 md:h-16 rounded-full bg-cyan-glow/20 backdrop-blur-md border border-cyan-glow/50 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] transition-all duration-500 group 
                ${((mode === 'dashboard' && !isNeoOverlayOpen) || mode === 'education') ? 'left-4 md:left-8' : 'right-4 md:right-8'}`}
            >
                <div className="absolute inset-0 rounded-full border border-cyan-glow/30 animate-ping opacity-20" />
                <Sparkles size={28} className="text-cyan-glow group-hover:text-white transition-colors" />
            </motion.button>

            {/* Chat Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`fixed bottom-40 md:bottom-28 w-[90vw] md:w-[400px] h-[50vh] md:h-[600px] z-[60] bg-deep-space/95 backdrop-blur-xl border border-cyan-glow/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 
                        ${((mode === 'dashboard' && !isNeoOverlayOpen) || mode === 'education') ? 'left-4 md:left-8' : 'right-4 md:right-8'}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-cyan-glow/20 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-glow to-plasma-purple flex items-center justify-center shadow-lg">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-orbitron text-cyan-glow">ARIA</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-[10px] text-star-white/60 font-mono uppercase tracking-wider">Online • {selectedPlanet || 'System'}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-white/10 text-star-white/60 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-glow/20 scrollbar-track-transparent">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                                    <Sparkles size={40} className="text-cyan-glow mb-4" />
                                    <p className="text-sm text-star-white/80">
                                        "I am ARIA. I have access to all mission data and telemetry. How can I assist you, Commander?"
                                    </p>
                                </div>
                            )}

                            {messages.map((message, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >


                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${message.role === 'user'
                                            ? 'bg-cyan-glow/20 text-white rounded-tr-sm border border-cyan-glow/20'
                                            : 'bg-white/10 text-star-white rounded-tl-sm border border-white/5'
                                            }`}
                                    >
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="text-cyan-glow font-bold" {...props} />,
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 rounded-2xl rounded-tl-sm p-4 flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce delay-100" />
                                        <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white/5 border-t border-cyan-glow/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your command..."
                                    className="flex-1 bg-deep-space/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-glow/50 transition-colors"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2.5 rounded-xl bg-cyan-glow/20 text-cyan-glow hover:bg-cyan-glow hover:text-deep-space disabled:opacity-50 disabled:hover:bg-cyan-glow/20 disabled:hover:text-cyan-glow transition-all"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
