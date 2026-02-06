'use client';

import { useState } from 'react';
import { Eye, Sparkles, Thermometer, ArrowDown } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';

import { PLANET_DATA } from '@/lib/planetData';

export function SurfaceTab({ planet }: { planet: string }) {
    const planetData = PLANET_DATA[planet.toLowerCase()];

    // Fallback if data not found
    if (!planetData) return null;

    const surfaceInfo = {
        description: `The surface of ${planet} offers a unique perspective on the cosmos. Experience the terrain and view the stars from a new world.`,
        temp: planetData.temperature.average,
        gravity: planetData.gravity
    };

    const handleViewNightSky = () => {
        // Dispatch event for the 3D scene to handle the transition
        // The scene will call the callback when transition is done to show the UI
        window.dispatchEvent(new CustomEvent('enterNightSky', {
            detail: {
                planetName: planet,
                onComplete: () => {
                    // Global store update happens in TransitionHandler
                }
            }
        }));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h3 className="text-lg font-mono font-bold text-cyan-400 border-b border-white/10 pb-2">Surface Features</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    {surfaceInfo.description}
                </p>
            </div>

            {/* Night Sky Button */}
            <div className="p-1 rounded-xl bg-gradient-to-br from-cyan-900/50 to-blue-900/20 border border-cyan-500/30">
                <div className="bg-black/40 rounded-lg p-5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-cyan-500/20 rounded-lg shrink-0">
                            <Eye size={24} className="text-cyan-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-100 font-mono">Night Sky View</h4>
                            <p className="text-xs text-slate-400 mt-1">
                                Stand on the surface and look at the stars
                            </p>
                        </div>
                    </div>

                    <GlowButton onClick={handleViewNightSky} className="w-full justify-center">
                        <Sparkles size={16} className="mr-2" />
                        Enter Surface View
                    </GlowButton>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1 text-white/40">
                        <Thermometer size={12} />
                        <span className="text-[10px] uppercase tracking-wider">Temp</span>
                    </div>
                    <div className="text-sm font-mono text-cyan-400">
                        {surfaceInfo.temp}
                    </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1 text-white/40">
                        <ArrowDown size={12} />
                        <span className="text-[10px] uppercase tracking-wider">Gravity</span>
                    </div>
                    <div className="text-sm font-mono text-cyan-400">
                        {surfaceInfo.gravity}
                    </div>
                </div>
            </div>
        </div>
    );
}
