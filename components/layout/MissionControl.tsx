'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export function MissionControl() {
    const mode = useAppStore(state => state.mode);
    const setMode = useAppStore(state => state.setMode);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

        // Simulate AI response for prototype
        setTimeout(() => {
            const assistantMessage: Message = {
                role: 'assistant',
                content: "I'm ARIA, your mission co-pilot. I can help you explore the solar system, but my communication systems are currently running in simulation mode. Connect me to the neural network (Gemini API) to unlock full functionality!",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {mode === 'mission' && (
                <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="fixed bottom-0 left-0 right-0 h-[60vh] z-30 bg-deep-space/95 backdrop-blur-xl border-t border-cyan-glow/30 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-cyan-glow/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-glow to-plasma-purple flex items-center justify-center">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-orbitron text-cyan-glow">ARIA</h3>
                                <p className="text-xs text-star-white/60">Astronomical Research & Information Assistant</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setMode('explore')}
                            className="text-star-white hover:text-cyan-glow transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center max-w-md">
                                    <Sparkles size={48} className="text-cyan-glow mx-auto mb-4" />
                                    <h4 className="text-xl font-orbitron text-cyan-glow mb-2">
                                        Welcome, Explorer
                                    </h4>
                                    <p className="text-star-white/80 text-sm">
                                        Ask me anything about space, celestial objects, or request a quiz to test your knowledge!
                                    </p>
                                </div>
                            </div>
                        )}

                        {messages.map((message, idx) => (
                            <div
                                key={idx}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-4 rounded-lg ${message.role === 'user'
                                            ? 'bg-cyan-glow/20 border border-cyan-glow/30'
                                            : 'bg-white/5 border border-white/10'
                                        }`}
                                >
                                    <p className="text-sm text-star-white leading-relaxed">
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-cyan-glow rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-cyan-glow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-cyan-glow rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-deep-space/80 backdrop-blur-xl border-t border-cyan-glow/20">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask ARIA anything about space..."
                                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-glow/50 outline-none text-star-white placeholder-star-white/40 transition-all"
                                disabled={isLoading}
                            />
                            <GlowButton
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="px-6"
                            >
                                <Send size={20} />
                            </GlowButton>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
