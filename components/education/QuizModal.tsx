'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { Check, X, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '@/lib/lessonData';

interface QuizModalProps {
    quiz: QuizQuestion[];
    onComplete: (score: number) => void;
}

export function QuizModal({ quiz, onComplete }: QuizModalProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState<boolean[]>([]);

    const question = quiz[currentQuestion];
    const isLastQuestion = currentQuestion === quiz.length - 1;
    const isCorrect = selectedAnswer === question.correctAnswer;

    const handleSubmit = () => {
        if (selectedAnswer === null) return;

        setShowExplanation(true);

        if (isCorrect) {
            setScore(score + 1);
            setAnswers([...answers, true]);
        } else {
            setAnswers([...answers, false]);
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            // Quiz complete
            onComplete(score); // Score is already updated by handleSubmit
        } else {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
            <GlassCard className="max-w-2xl w-full mx-4 p-8 border-cyan-glow/30 shadow-[0_0_100px_rgba(0,240,255,0.1)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-orbitron text-cyan-glow tracking-wider flex items-center gap-3">
                            <HelpCircle className="text-cyan-glow" />
                            KNOWLEDGE CHECK
                        </h2>
                        <p className="text-xs text-star-white/60 font-mono mt-1">Verify your understanding of the simulation.</p>
                    </div>

                    <div className="flex gap-2">
                        {quiz.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-colors duration-300 ${idx < currentQuestion
                                    ? answers[idx]
                                        ? 'bg-success-green shadow-[0_0_10px_rgba(0,255,100,0.5)]'
                                        : 'bg-warning-orange shadow-[0_0_10px_rgba(255,100,0,0.5)]'
                                    : idx === currentQuestion
                                        ? 'bg-cyan-glow animate-pulse'
                                        : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-xl text-white mb-8 leading-relaxed font-light">
                            {question.question}
                        </h3>

                        {/* Options */}
                        <div className="space-y-4 mb-8">
                            {question.options.map((option, idx) => {
                                const isSelected = selectedAnswer === idx;
                                const isCorrectAnswer = idx === question.correctAnswer;
                                const shouldHighlight = showExplanation && (isSelected || isCorrectAnswer);

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => !showExplanation && setSelectedAnswer(idx)}
                                        disabled={showExplanation}
                                        className={`w-full text-left p-5 rounded-xl border transition-all duration-200 relative overflow-hidden group ${shouldHighlight
                                            ? isCorrectAnswer
                                                ? 'bg-success-green/10 border-success-green text-white'
                                                : 'bg-warning-orange/10 border-warning-orange text-white'
                                            : isSelected
                                                ? 'bg-cyan-glow/10 border-cyan-glow text-white shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                                                : 'bg-white/5 border-white/10 text-star-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white'
                                            } ${showExplanation && !shouldHighlight ? 'opacity-50' : 'opacity-100'} ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <span className="text-base">{option}</span>
                                            {showExplanation && isCorrectAnswer && (
                                                <Check size={20} className="text-success-green" />
                                            )}
                                            {showExplanation && isSelected && !isCorrectAnswer && (
                                                <X size={20} className="text-warning-orange" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        {showExplanation && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-5 rounded-xl border ${isCorrect
                                    ? 'bg-success-green/5 border-success-green/20'
                                    : 'bg-warning-orange/5 border-warning-orange/20'
                                    } mb-8`}
                            >
                                <p className={`text-xs font-orbitron mb-2 tracking-wider uppercase ${isCorrect ? 'text-success-green' : 'text-warning-orange'
                                    }`}>
                                    {isCorrect ? '✓ Correct Analysis' : '✗ Incorrect Analysis'}
                                </p>
                                <p className="text-star-white/90 text-sm leading-relaxed">
                                    {question.explanation}
                                </p>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <div className="text-xs font-mono text-star-white/40">
                                QUESTION {currentQuestion + 1} / {quiz.length}
                            </div>

                            {!showExplanation ? (
                                <GlowButton
                                    onClick={handleSubmit}
                                    disabled={selectedAnswer === null}
                                >
                                    SUBMIT ANSWER
                                </GlowButton>
                            ) : (
                                <GlowButton onClick={handleNext}>
                                    {isLastQuestion ? 'COMPLETE MODULE' : 'NEXT QUESTION'}
                                </GlowButton>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </GlassCard>
        </motion.div>
    );
}
