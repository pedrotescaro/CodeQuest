'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { getUserData, saveTermoResult, UserData } from '@/lib/firestore';
import { getPalavraDodia, getDaySeed, checkGuess, LetterResult } from '@/lib/termoData';
import Navbar from '@/components/Navbar';
import { Coins, Trophy, Flame, ArrowLeft, HelpCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

export default function DevTermoPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const [answer] = useState(() => getPalavraDodia());
    const [daySeed] = useState(() => getDaySeed());
    const [guesses, setGuesses] = useState<LetterResult[][]>([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [alreadyPlayed, setAlreadyPlayed] = useState(false);
    const [shake, setShake] = useState(false);
    const [moedasGanhas, setMoedasGanhas] = useState(0);
    const [showHelp, setShowHelp] = useState(false);

    // Keyboard letter states
    const [letterStates, setLetterStates] = useState<Record<string, 'correct' | 'present' | 'absent'>>({});

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user) {
            getUserData(user.uid).then((data) => {
                setUserData(data);
                if (data?.minigames?.termo?.ultimoDia === getDaySeed()) {
                    setAlreadyPlayed(true);
                }
                setLoading(false);
            });
        }
    }, [user, authLoading, router]);

    const submitGuess = useCallback(async () => {
        if (currentGuess.length !== WORD_LENGTH || gameOver || alreadyPlayed) return;

        const result = checkGuess(currentGuess.toUpperCase(), answer);
        const newGuesses = [...guesses, result];
        setGuesses(newGuesses);

        // Update keyboard
        const newStates = { ...letterStates };
        result.forEach(r => {
            const prev = newStates[r.letter];
            if (r.state === 'correct') newStates[r.letter] = 'correct';
            else if (r.state === 'present' && prev !== 'correct') newStates[r.letter] = 'present';
            else if (r.state === 'absent' && !prev) newStates[r.letter] = 'absent';
        });
        setLetterStates(newStates);

        const isWin = result.every(r => r.state === 'correct');
        const isLose = newGuesses.length >= MAX_ATTEMPTS && !isWin;

        if (isWin || isLose) {
            setGameOver(true);
            setWon(isWin);
            if (user) {
                const coins = await saveTermoResult(user.uid, daySeed, isWin);
                setMoedasGanhas(coins);
                const data = await getUserData(user.uid);
                setUserData(data);
            }
        }

        setCurrentGuess('');
    }, [currentGuess, guesses, gameOver, alreadyPlayed, answer, letterStates, user, daySeed]);

    const handleKey = useCallback((key: string) => {
        if (gameOver || alreadyPlayed) return;

        if (key === 'ENTER') {
            if (currentGuess.length === WORD_LENGTH) {
                submitGuess();
            } else {
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
        } else if (key === '⌫' || key === 'BACKSPACE') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
            setCurrentGuess(prev => prev + key);
        }
    }, [gameOver, alreadyPlayed, currentGuess, submitGuess]);

    // Physical keyboard support
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            handleKey(e.key.toUpperCase());
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleKey]);

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #00d4ff', borderTopColor: 'transparent', margin: '0 auto 16px' }} className="animate-spin" />
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Carregando...</p>
                </div>
            </div>
        );
    }

    const termoStats = userData?.minigames?.termo;

    const getLetterColor = (state: string) => {
        if (state === 'correct') return '#10b981';
        if (state === 'present') return '#f59e0b';
        if (state === 'absent') return 'var(--bg-surface-lighter)';
        return 'var(--bg-surface)';
    };

    const getLetterBorder = (state: string) => {
        if (state === 'correct') return '2px solid #10b981';
        if (state === 'present') return '2px solid #f59e0b';
        if (state === 'absent') return '2px solid var(--bg-surface-lighter)';
        return '2px solid var(--border-color)';
    };

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '48px', paddingLeft: 'clamp(8px, 3vw, 24px)', paddingRight: 'clamp(8px, 3vw, 24px)', background: 'var(--background)' }}>
                <div style={{ maxWidth: '520px', margin: '0 auto' }}>

                    {/* Header */}
                    <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Link href="/minigames" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                                <ArrowLeft size={18} />
                            </Link>
                            <div>
                                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                                    🖥️ DevTermo
                                </h1>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Palavra do dia — {daySeed}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowHelp(!showHelp)} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HelpCircle size={18} />
                        </button>
                    </div>

                    {/* Help */}
                    {showHelp && (
                        <div className="card animate-fade-in" style={{ padding: '16px', marginBottom: '16px' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Adivinhe a palavra de <b>5 letras</b> sobre programação/tecnologia em <b>6 tentativas</b>.<br /><br />
                                🟩 <span style={{ color: '#10b981', fontWeight: 600 }}>Verde</span> = letra correta na posição certa<br />
                                🟨 <span style={{ color: '#f59e0b', fontWeight: 600 }}>Amarelo</span> = letra existe mas posição errada<br />
                                ⬛ <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Cinza</span> = letra não existe na palavra<br /><br />
                                Uma nova palavra por dia! Ganhe <Coins size={14} style={{ display: 'inline', color: '#f59e0b' }} /> <b>20 moedas</b> ao acertar.
                            </p>
                        </div>
                    )}

                    {/* Stats bar */}
                    {termoStats && (
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            <div className="card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Trophy size={14} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{termoStats.vitorias}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>vitórias</span>
                            </div>
                            <div className="card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Flame size={14} style={{ color: '#ef4444' }} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{termoStats.sequencia}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>sequência</span>
                            </div>
                            <div className="card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Trophy size={14} style={{ color: '#f59e0b' }} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{termoStats.melhorSequencia}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>recorde</span>
                            </div>
                        </div>
                    )}

                    {/* Already played today */}
                    {alreadyPlayed && !gameOver && (
                        <div className="card animate-fade-in" style={{ padding: '32px', textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎯</div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                                Você já jogou hoje!
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                                Volte amanhã para uma nova palavra.
                            </p>
                            <Link href="/minigames" className="btn-neon" style={{ textDecoration: 'none' }}>
                                <RotateCcw size={16} /> Outros Minigames
                            </Link>
                        </div>
                    )}

                    {/* Board */}
                    {!alreadyPlayed && (
                        <>
                            <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
                                {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIdx) => {
                                    const isCurrentRow = rowIdx === guesses.length;
                                    const guess = guesses[rowIdx];

                                    return (
                                        <div key={rowIdx} style={{ display: 'flex', gap: '8px' }} className={isCurrentRow && shake ? 'termo-shake' : ''}>
                                            {Array.from({ length: WORD_LENGTH }).map((_, colIdx) => {
                                                let letter = '';
                                                let bg = 'var(--bg-surface)';
                                                let border = '2px solid var(--border-color)';
                                                let color = 'var(--text-primary)';

                                                if (guess) {
                                                    letter = guess[colIdx].letter;
                                                    bg = getLetterColor(guess[colIdx].state);
                                                    border = getLetterBorder(guess[colIdx].state);
                                                    color = guess[colIdx].state !== 'absent' ? 'white' : 'var(--text-primary)';
                                                } else if (isCurrentRow && colIdx < currentGuess.length) {
                                                    letter = currentGuess[colIdx];
                                                    border = '2px solid rgba(0, 212, 255, 0.4)';
                                                }

                                                return (
                                                    <div key={colIdx} style={{
                                                        width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        borderRadius: 10, background: bg, border,
                                                        fontSize: '1.4rem', fontWeight: 800, color,
                                                        transition: 'all 0.3s ease',
                                                        fontFamily: "'Inter', monospace",
                                                    }} className={guess ? 'termo-flip' : ''}>
                                                        {letter}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Game Over Message */}
                            {gameOver && (
                                <div className="card animate-scale-in" style={{ padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{won ? '🎉' : '😔'}</div>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                                        {won ? 'Parabéns!' : 'Não foi dessa vez...'}
                                    </h2>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                                        {won
                                            ? `Acertou em ${guesses.length} tentativa${guesses.length > 1 ? 's' : ''}!`
                                            : <>A palavra era: <b style={{ color: '#00d4ff' }}>{answer}</b></>
                                        }
                                    </p>
                                    {moedasGanhas > 0 && (
                                        <p style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700, marginTop: 8 }}>
                                            <Coins size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> +{moedasGanhas} moedas!
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Keyboard */}
                            {!gameOver && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                                    {KEYBOARD_ROWS.map((row, rIdx) => (
                                        <div key={rIdx} style={{ display: 'flex', gap: '5px' }}>
                                            {row.map(key => {
                                                const state = letterStates[key];
                                                const isWide = key === 'ENTER' || key === '⌫';
                                                let bg = 'var(--bg-surface-light)';
                                                let textColor = 'var(--text-primary)';

                                                if (state === 'correct') { bg = '#10b981'; textColor = 'white'; }
                                                else if (state === 'present') { bg = '#f59e0b'; textColor = 'white'; }
                                                else if (state === 'absent') { bg = 'var(--bg-surface)'; textColor = 'var(--text-muted)'; }

                                                return (
                                                    <button
                                                        key={key}
                                                        onClick={() => handleKey(key)}
                                                        style={{
                                                            width: isWide ? 64 : 38, height: 48,
                                                            borderRadius: 8, border: 'none',
                                                            background: bg, color: textColor,
                                                            fontSize: isWide ? '0.7rem' : '0.9rem',
                                                            fontWeight: 700, cursor: 'pointer',
                                                            fontFamily: 'inherit',
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                    >
                                                        {key}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
