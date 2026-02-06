'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { useEducationStore } from '@/lib/educationStore';

export default function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('return') || '/';
    const { unlockPremium } = useEducationStore();
    const [processing, setProcessing] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handlePayment = async () => {
        setProcessing(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProcessing(false);
        setCompleted(true);

        // Unlock premium access
        unlockPremium();

        // Redirect after showing success
        setTimeout(() => {
            router.push(returnUrl);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-deep-space via-[#0a0a1a] to-void-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-star-white/60 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-mono text-sm">Back</span>
                </button>

                {/* Payment Card */}
                <div className="relative">
                    {/* Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 blur-3xl rounded-3xl" />

                    <div className="relative bg-gradient-to-b from-[#0f0f1f] to-[#080810] border border-violet-500/30 rounded-2xl overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-violet-500/20 rounded-lg border border-violet-500/40">
                                    <Sparkles size={20} className="text-violet-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-orbitron text-white">Premium Access</h1>
                                    <p className="text-xs text-violet-300/60 font-mono">Advanced Space Series</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {completed ? (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-success-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={32} className="text-success-green" />
                                    </div>
                                    <h2 className="text-2xl font-orbitron text-white mb-2">Payment Successful!</h2>
                                    <p className="text-star-white/60 font-mono text-sm">Redirecting to lessons...</p>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Features */}
                                    <div className="mb-6 space-y-3">
                                        {[
                                            '5 Advanced Modules',
                                            'Expert-level Simulations',
                                            'Lifetime Access',
                                            'No Subscriptions'
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                                                    <Check size={12} className="text-violet-400" />
                                                </div>
                                                <span className="text-star-white/80 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Price */}
                                    <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-star-white/60 font-mono">Total</span>
                                            <span className="text-2xl font-orbitron text-white">₹1,000</span>
                                        </div>
                                        <p className="text-xs text-star-white/40 mt-1 font-mono">One-time payment</p>
                                    </div>

                                    {/* Dummy Payment Form */}
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="text-xs text-star-white/60 font-mono mb-2 block">Card Number</label>
                                            <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
                                                <CreditCard size={20} className="text-star-white/40" />
                                                <input
                                                    type="text"
                                                    placeholder="4242 4242 4242 4242"
                                                    className="bg-transparent text-white font-mono flex-1 outline-none placeholder:text-star-white/30"
                                                    defaultValue="4242 4242 4242 4242"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-star-white/60 font-mono mb-2 block">Expiry</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    defaultValue="12/28"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-mono outline-none placeholder:text-star-white/30"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-star-white/60 font-mono mb-2 block">CVC</label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    defaultValue="123"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-mono outline-none placeholder:text-star-white/30"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pay Button */}
                                    <button
                                        onClick={handlePayment}
                                        disabled={processing}
                                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-orbitron tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Shield size={20} />
                                                <span>Complete Payment</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Security Note */}
                                    <p className="text-center text-xs text-star-white/40 mt-4 font-mono">
                                        {/* 🔒 This is a demo payment page */}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
