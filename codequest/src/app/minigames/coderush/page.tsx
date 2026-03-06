'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getUserData, saveCodeRushResult, UserData } from '@/lib/firestore';
import { codeLanguages, CodeLanguage, CodeChallenge, normalizeCommand } from '@/lib/codeRushData';
import Navbar from '@/components/Navbar';
import { Coins, Trophy, Clock, ArrowLeft, Zap, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { languageIconMap } from '@/components/LanguageIcons';
import { CodeRushLogo } from '@/components/MinigameLogos';
import Link from 'next/link';

const GAME_DURATION = 60; // seconds

type GamePhase = 'select' | 'playing' | 'ended';

export default function CodeRushPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const [phase, setPhase] = useState<GamePhase>('select');
    const [selectedLang, setSelectedLang] = useState<CodeLanguage | null>(null);
    const [challenge, setChallenge] = useState<CodeChallenge | null>(null);
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [combo, setCombo] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [moedasGanhas, setMoedasGanhas] = useState(0);
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [aiHintActive, setAiHintActive] = useState(false);
    const [aiHintTyping, setAiHintTyping] = useState(false);
    const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user) {
            getUserData(user.uid).then((data) => {
                setUserData(data);
                setLoading(false);
            });
        }
    }, [user, authLoading, router]);

    const getNextChallenge = useCallback((lang: CodeLanguage, used: Set<number>) => {
        const available = lang.desafios
            .map((d, i) => ({ d, i }))
            .filter(({ i }) => !used.has(i));

        if (available.length === 0) {
            // Reset if all used
            const idx = Math.floor(Math.random() * lang.desafios.length);
            return { challenge: lang.desafios[idx], idx, newUsed: new Set<number>([idx]) };
        }

        const pick = available[Math.floor(Math.random() * available.length)];
        const newUsed = new Set(used);
        newUsed.add(pick.i);
        return { challenge: pick.d, idx: pick.i, newUsed };
    }, []);

    const startGame = useCallback((lang: CodeLanguage) => {
        setSelectedLang(lang);
        setScore(0);
        setCombo(0);
        setTimeLeft(GAME_DURATION);
        setShowHint(false);
        setAiHintActive(false);
        setAiHintTyping(false);
        setFeedback(null);
        setUserInput('');

        const { challenge: first, idx, newUsed } = getNextChallenge(lang, new Set());
        setChallenge(first);
        setChallengeIdx(idx);
        setUsedIndices(newUsed);
        setPhase('playing');

        // Start timer
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setPhase('ended');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setTimeout(() => inputRef.current?.focus(), 100);
    }, [getNextChallenge]);

    // Save results when game ends
    useEffect(() => {
        if (phase === 'ended' && user && score > 0) {
            saveCodeRushResult(user.uid, score).then(coins => {
                setMoedasGanhas(coins);
                getUserData(user.uid).then(setUserData);
            });
        }
    }, [phase, user, score]);

    // Cleanup timer
    useEffect(() => {
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const handleSubmit = useCallback(() => {
        if (!challenge || !selectedLang || phase !== 'playing') return;

        const userNorm = normalizeCommand(userInput);
        const correctNorm = normalizeCommand(challenge.comando);
        const isCorrect = userNorm === correctNorm;

        if (isCorrect) {
            const newCombo = combo + 1;
            const points = 10 + (newCombo > 1 ? newCombo * 2 : 0);
            setScore(prev => prev + points);
            setCombo(newCombo);
            setFeedback('correct');
        } else {
            setCombo(0);
            setFeedback('wrong');
        }

        setTimeout(() => {
            setFeedback(null);
            setShowHint(false);
            setAiHintActive(false);
            setAiHintTyping(false);
            setUserInput('');
            const { challenge: next, idx, newUsed } = getNextChallenge(selectedLang, usedIndices);
            setChallenge(next);
            setChallengeIdx(idx);
            setUsedIndices(newUsed);
            inputRef.current?.focus();
        }, 800);
    }, [challenge, selectedLang, userInput, combo, phase, getNextChallenge, usedIndices]);

    const activateAiHint = useCallback(() => {
        if (!challenge || aiHintActive) return;
        setShowHint(true);
        setAiHintTyping(true);
        // Simulate AI "thinking" before showing inline suggestion
        if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = setTimeout(() => {
            setAiHintTyping(false);
            setAiHintActive(true);
        }, 800);
    }, [challenge, aiHintActive]);

    const acceptAiSuggestion = useCallback(() => {
        if (!aiHintActive || !challenge) return;
        setUserInput(challenge.comando);
        inputRef.current?.focus();
    }, [aiHintActive, challenge]);

    // Cleanup hint timeout
    useEffect(() => {
        return () => { if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current); };
    }, []);

    const handleSkip = useCallback(() => {
        if (!selectedLang || phase !== 'playing') return;
        setCombo(0);
        setShowHint(false);
        setAiHintActive(false);
        setAiHintTyping(false);
        setUserInput('');
        setFeedback(null);
        const { challenge: next, idx, newUsed } = getNextChallenge(selectedLang, usedIndices);
        setChallenge(next);
        setChallengeIdx(idx);
        setUsedIndices(newUsed);
        inputRef.current?.focus();
    }, [selectedLang, phase, getNextChallenge, usedIndices]);

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #00d4ff', borderTopColor: 'transparent', margin: '0 auto 16px' }} className="animate-spin" />
                </div>
            </div>
        );
    }

    const crStats = userData?.minigames?.codeRush;

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '48px', paddingLeft: 'clamp(8px, 3vw, 24px)', paddingRight: 'clamp(8px, 3vw, 24px)', background: 'var(--background)' }}>
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>

                    {/* Header */}
                    <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Link href="/minigames" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CodeRushLogo size={28} /> CodeRush
                            </h1>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Digite o comando certo o mais rápido possível!
                            </p>
                        </div>
                    </div>

                    {/* SELECT LANGUAGE PHASE */}
                    {phase === 'select' && (
                        <div className="animate-fade-in-up">
                            {/* Stats */}
                            {crStats && (
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                    <div className="card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Trophy size={14} style={{ color: '#f59e0b' }} />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{crStats.melhorPontuacao}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>recorde</span>
                                    </div>
                                    <div className="card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Zap size={14} style={{ color: '#00d4ff' }} />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{crStats.partidasJogadas}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>partidas</span>
                                    </div>
                                </div>
                            )}

                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                                Escolha a linguagem:
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                                {codeLanguages.map(lang => (
                                    <button
                                        key={lang.id}
                                        onClick={() => startGame(lang)}
                                        className="card"
                                        style={{
                                            padding: '20px', textAlign: 'center', cursor: 'pointer',
                                            border: '1px solid var(--card-border)',
                                            background: 'var(--bg-card)', fontFamily: 'inherit',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = lang.cor;
                                            e.currentTarget.style.boxShadow = `0 4px 20px ${lang.cor}20`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--card-border)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                                            {languageIconMap[lang.id]
                                                ? React.createElement(languageIconMap[lang.id], { size: 40 })
                                                : <span style={{ fontSize: '2rem' }}>{lang.icone}</span>
                                            }
                                        </div>
                                        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{lang.nome}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                            {lang.desafios.length} desafios
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PLAYING PHASE */}
                    {phase === 'playing' && challenge && (
                        <div className="animate-fade-in">
                            {/* HUD */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div className="card" style={{
                                        padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6,
                                        borderColor: timeLeft <= 10 ? '#ef4444' : undefined,
                                    }}>
                                        <Clock size={14} style={{ color: timeLeft <= 10 ? '#ef4444' : '#00d4ff' }} />
                                        <span style={{ fontSize: '1rem', fontWeight: 800, color: timeLeft <= 10 ? '#ef4444' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                                            {timeLeft}s
                                        </span>
                                    </div>
                                    <div className="card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Zap size={14} style={{ color: '#f59e0b' }} />
                                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b' }}>{score}</span>
                                    </div>
                                </div>
                                {combo > 1 && (
                                    <div style={{
                                        padding: '6px 14px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 800,
                                        background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white',
                                    }}>
                                        🔥 x{combo} COMBO
                                    </div>
                                )}
                            </div>

                            {/* Challenge card */}
                            <div className="card" style={{
                                padding: '24px', marginBottom: '16px',
                                borderColor: feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : undefined,
                                transition: 'border-color 0.3s',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    {selectedLang && languageIconMap[selectedLang.id]
                                        ? React.createElement(languageIconMap[selectedLang.id], { size: 24 })
                                        : <span style={{ fontSize: '1.2rem' }}>{selectedLang?.icone}</span>
                                    }
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                        {selectedLang?.nome}
                                    </span>
                                </div>

                                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.5 }}>
                                    {challenge.descricao}
                                </p>

                                {/* AI-style inline autocomplete input */}
                                <div style={{ position: 'relative' }}>
                                    {/* Ghost text layer (behind input) */}
                                    <div
                                        aria-hidden
                                        style={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '12px 16px',
                                            fontFamily: "'Courier New', monospace",
                                            fontSize: '0.95rem',
                                            pointerEvents: 'none',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {/* Invisible spacer matching typed text */}
                                        <span style={{ visibility: 'hidden', whiteSpace: 'pre' }}>
                                            {userInput}
                                        </span>
                                        {/* Ghost suggestion text */}
                                        {aiHintActive && challenge && (() => {
                                            const cmd = challenge.comando;
                                            const lower = userInput.toLowerCase();
                                            const cmdLower = cmd.toLowerCase();
                                            const ghostText = cmdLower.startsWith(lower) && userInput.length > 0
                                                ? cmd.slice(userInput.length)
                                                : userInput.length === 0
                                                    ? cmd
                                                    : '';
                                            if (!ghostText) return null;
                                            return (
                                                <span style={{
                                                    color: '#7c3aed',
                                                    opacity: 0.5,
                                                    whiteSpace: 'pre',
                                                    fontStyle: 'italic',
                                                }}>
                                                    {ghostText}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    {/* Real input on top */}
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSubmit();
                                            if (e.key === 'Tab' && aiHintActive) {
                                                e.preventDefault();
                                                acceptAiSuggestion();
                                            }
                                        }}
                                        placeholder={!aiHintActive ? 'Digite o comando aqui...' : ''}
                                        className="input-dark"
                                        style={{
                                            fontFamily: "'Courier New', monospace",
                                            fontSize: '0.95rem',
                                            paddingRight: '90px',
                                            background: 'transparent',
                                            position: 'relative',
                                            caretColor: '#00d4ff',
                                        }}
                                        autoComplete="off"
                                        spellCheck={false}
                                        disabled={!!feedback}
                                    />

                                    {/* AI thinking indicator */}
                                    {aiHintTyping && (
                                        <div className="animate-fade-in" style={{
                                            position: 'absolute', top: -28, right: 0,
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            padding: '4px 10px', borderRadius: 8,
                                            background: 'rgba(124, 58, 237, 0.1)',
                                            border: '1px solid rgba(124, 58, 237, 0.2)',
                                        }}>
                                            <Sparkles size={12} style={{ color: '#7c3aed' }} />
                                            <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>IA pensando...</span>
                                            <span className="animate-pulse" style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed', display: 'inline-block' }} />
                                        </div>
                                    )}

                                    {/* Tab to accept hint */}
                                    {aiHintActive && challenge && (() => {
                                        const cmd = challenge.comando;
                                        const lower = userInput.toLowerCase();
                                        const cmdLower = cmd.toLowerCase();
                                        const hasGhost = cmdLower.startsWith(lower) || userInput.length === 0;
                                        if (!hasGhost) return null;
                                        return (
                                            <div style={{
                                                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                                display: 'flex', alignItems: 'center', gap: 4,
                                                padding: '3px 8px', borderRadius: 6,
                                                background: 'rgba(124, 58, 237, 0.12)',
                                                border: '1px solid rgba(124, 58, 237, 0.25)',
                                            }}>
                                                <span style={{ fontSize: '0.65rem', color: '#7c3aed', fontWeight: 700 }}>Tab</span>
                                                <span style={{ fontSize: '0.6rem', color: 'rgba(124,58,237,0.6)' }}>aceitar</span>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* AI hint label when active */}
                                {aiHintActive && (
                                    <div className="animate-fade-in" style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        marginTop: 8, padding: '6px 10px', borderRadius: 8,
                                        background: 'rgba(124, 58, 237, 0.06)',
                                        border: '1px solid rgba(124, 58, 237, 0.12)',
                                    }}>
                                        <Sparkles size={12} style={{ color: '#7c3aed' }} />
                                        <span style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 600 }}>Sugestão da IA</span>
                                        {challenge?.dica && (
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 4 }}>
                                                — {challenge.dica}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Feedback */}
                                {feedback && (
                                    <div className="animate-scale-in" style={{
                                        marginTop: 12, padding: '10px 14px', borderRadius: 10,
                                        background: feedback === 'correct' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                        border: `1px solid ${feedback === 'correct' ? '#10b981' : '#ef4444'}`,
                                        fontSize: '0.85rem', fontWeight: 600,
                                        color: feedback === 'correct' ? '#10b981' : '#ef4444',
                                    }}>
                                        {feedback === 'correct'
                                            ? `✅ Correto! +${10 + (combo > 0 ? combo * 2 : 0)} pts`
                                            : <>❌ Resposta: <code style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: 4 }}>{challenge.comando}</code></>
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleSubmit} className="btn-neon" style={{ flex: 1, justifyContent: 'center' }} disabled={!!feedback || !userInput.trim()}>
                                    <ChevronRight size={16} /> Enviar
                                </button>
                                <button onClick={activateAiHint} className="btn-ghost" style={{
                                    fontSize: '0.8rem', padding: '8px 14px',
                                    borderColor: aiHintActive ? '#7c3aed' : undefined,
                                    color: aiHintActive ? '#7c3aed' : undefined,
                                }} disabled={showHint || !!feedback}>
                                    <Sparkles size={14} /> IA Hint
                                </button>
                                <button onClick={handleSkip} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '8px 14px' }} disabled={!!feedback}>
                                    Pular
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ENDED PHASE */}
                    {phase === 'ended' && (
                        <div className="animate-scale-in">
                            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
                                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                                    <CodeRushLogo size={64} />
                                </div>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                                    Tempo esgotado!
                                </h2>
                                <p style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>
                                    <span className="gradient-text">{score}</span> <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>pontos</span>
                                </p>

                                {crStats && score > (crStats.melhorPontuacao || 0) && (
                                    <p style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700, marginBottom: 8 }}>
                                        🎉 Novo recorde!
                                    </p>
                                )}

                                {moedasGanhas > 0 && (
                                    <p style={{ fontSize: '0.95rem', color: '#f59e0b', fontWeight: 700, marginBottom: 16 }}>
                                        <Coins size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> +{moedasGanhas} moedas
                                    </p>
                                )}

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button onClick={() => { setPhase('select'); setMoedasGanhas(0); }} className="btn-neon">
                                        <RotateCcw size={16} /> Jogar de Novo
                                    </button>
                                    <Link href="/minigames" className="btn-ghost" style={{ textDecoration: 'none' }}>
                                        Voltar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
