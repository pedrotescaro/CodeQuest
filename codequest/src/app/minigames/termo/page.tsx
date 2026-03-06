'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getUserData, saveTermoResult, UserData } from '@/lib/firestore';
import {
    getPalavrasDoDia,
    getDaySeed,
    checkGuess,
    isValidWord,
    getMaxAttempts,
    LetterResult,
    GameMode,
} from '@/lib/termoData';
import Navbar from '@/components/Navbar';
import { Coins, Trophy, Flame, ArrowLeft, HelpCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { DevTermoLogo } from '@/components/MinigameLogos';
import Link from 'next/link';

const WORD_LENGTH = 5;

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

const MODE_LABELS: Record<GameMode, string> = {
    solo: 'Solo',
    dupla: 'Dupla',
    quarteto: 'Quarteto',
};

const MODE_DESCRIPTIONS: Record<GameMode, string> = {
    solo: '1 palavra · 6 tentativas',
    dupla: '2 palavras · 7 tentativas',
    quarteto: '4 palavras · 9 tentativas',
};

const MODE_COINS: Record<GameMode, number> = {
    solo: 20,
    dupla: 40,
    quarteto: 80,
};

export default function DevTermoPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    // Mode selection (before game starts)
    const [gameMode, setGameMode] = useState<GameMode | null>(null);
    const [gameStarted, setGameStarted] = useState(false);

    const daySeed = useMemo(() => getDaySeed(), []);

    // Game state (initialized when mode is chosen)
    const [answers, setAnswers] = useState<string[]>([]);
    const [maxAttempts, setMaxAttempts] = useState(6);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [boardResults, setBoardResults] = useState<LetterResult[][][]>([]); // [boardIndex][guessIndex][letterIndex]
    const [boardWon, setBoardWon] = useState<boolean[]>([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [alreadyPlayed, setAlreadyPlayed] = useState(false);
    const [shake, setShake] = useState(false);
    const [invalidWord, setInvalidWord] = useState(false);
    const [moedasGanhas, setMoedasGanhas] = useState(0);
    const [showHelp, setShowHelp] = useState(false);

    // Keyboard letter states — merged across all boards
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

    // Start the game with a chosen mode
    const startGame = useCallback((mode: GameMode) => {
        const words = getPalavrasDoDia(mode);
        setGameMode(mode);
        setAnswers(words);
        setMaxAttempts(getMaxAttempts(mode));
        setBoardResults(words.map(() => []));
        setBoardWon(words.map(() => false));
        setGuesses([]);
        setCurrentGuess('');
        setLetterStates({});
        setGameOver(false);
        setWon(false);
        setGameStarted(true);
    }, []);

    const boardCount = answers.length;

    const submitGuess = useCallback(async () => {
        if (currentGuess.length !== WORD_LENGTH || gameOver || alreadyPlayed || !gameMode) return;

        const word = currentGuess.toUpperCase();

        // Validate word
        if (!isValidWord(word)) {
            setInvalidWord(true);
            setShake(true);
            setTimeout(() => { setShake(false); setInvalidWord(false); }, 1200);
            return;
        }

        const newGuesses = [...guesses, word];
        setGuesses(newGuesses);

        // Compute results for each board
        const newBoardResults = answers.map((answer, bIdx) => {
            if (boardWon[bIdx]) return boardResults[bIdx]; // already won, keep old
            return [...boardResults[bIdx], checkGuess(word, answer)];
        });
        setBoardResults(newBoardResults);

        // Check which boards are now won
        const newBoardWon = answers.map((_, bIdx) => {
            if (boardWon[bIdx]) return true;
            const lastResult = newBoardResults[bIdx][newBoardResults[bIdx].length - 1];
            return lastResult?.every(r => r.state === 'correct') ?? false;
        });
        setBoardWon(newBoardWon);

        // Update keyboard states — merge from all active boards
        const newStates = { ...letterStates };
        answers.forEach((_, bIdx) => {
            if (boardWon[bIdx]) return; // skip already-won boards for keyboard updates
            const lastResult = newBoardResults[bIdx][newBoardResults[bIdx].length - 1];
            if (!lastResult) return;
            lastResult.forEach(r => {
                const prev = newStates[r.letter];
                if (r.state === 'correct') newStates[r.letter] = 'correct';
                else if (r.state === 'present' && prev !== 'correct') newStates[r.letter] = 'present';
                else if (r.state === 'absent' && !prev) newStates[r.letter] = 'absent';
            });
        });
        setLetterStates(newStates);

        const allWon = newBoardWon.every(Boolean);
        const maxReached = newGuesses.length >= maxAttempts;

        if (allWon || maxReached) {
            setGameOver(true);
            setWon(allWon);
            if (user) {
                const coins = await saveTermoResult(user.uid, daySeed, allWon);
                setMoedasGanhas(allWon ? MODE_COINS[gameMode] : coins);
                const data = await getUserData(user.uid);
                setUserData(data);
            }
        }

        setCurrentGuess('');
    }, [currentGuess, guesses, gameOver, alreadyPlayed, answers, boardResults, boardWon, letterStates, user, daySeed, maxAttempts, gameMode]);

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
        if (!gameStarted) return;
        const handler = (e: KeyboardEvent) => {
            handleKey(e.key.toUpperCase());
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleKey, gameStarted]);

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

    // Dynamic cell size based on mode
    const cellSize = gameMode === 'quarteto' ? 40 : gameMode === 'dupla' ? 48 : 56;
    const cellFont = gameMode === 'quarteto' ? '1rem' : gameMode === 'dupla' ? '1.2rem' : '1.4rem';
    const boardGap = gameMode === 'quarteto' ? 12 : 20;

    // Render a single board
    const renderBoard = (boardIndex: number) => {
        const results = boardResults[boardIndex] || [];
        const isWon = boardWon[boardIndex];
        const currentGuessRow = results.length;

        return (
            <div key={boardIndex} style={{
                display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center',
                opacity: isWon ? 0.6 : 1,
                transition: 'opacity 0.3s ease',
                position: 'relative',
            }}>
                {isWon && (
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'rgba(16, 185, 129, 0.9)', color: 'white', padding: '4px 12px',
                        borderRadius: 8, fontWeight: 800, fontSize: '0.75rem', zIndex: 2,
                        letterSpacing: '0.05em',
                    }}>
                        ✓
                    </div>
                )}
                {Array.from({ length: maxAttempts }).map((_, rowIdx) => {
                    const isCurrentRow = rowIdx === currentGuessRow && !isWon;
                    const guess = results[rowIdx];

                    return (
                        <div key={rowIdx} style={{ display: 'flex', gap: gameMode === 'quarteto' ? '3px' : '5px' }} className={isCurrentRow && shake ? 'termo-shake' : ''}>
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
                                        width: cellSize, height: cellSize, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: gameMode === 'quarteto' ? 6 : 10, background: bg, border,
                                        fontSize: cellFont, fontWeight: 800, color,
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
        );
    };

    // Board grid layout
    const getBoardGridStyle = (): React.CSSProperties => {
        if (gameMode === 'quarteto') {
            return {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: `${boardGap}px`,
                justifyItems: 'center',
                marginBottom: '16px',
            };
        }
        if (gameMode === 'dupla') {
            return {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: `${boardGap}px`,
                justifyItems: 'center',
                marginBottom: '20px',
            };
        }
        return {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            marginBottom: '24px',
        };
    };

    const maxWidth = gameMode === 'quarteto' ? '620px' : gameMode === 'dupla' ? '580px' : '520px';

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '48px', paddingLeft: 'clamp(8px, 3vw, 24px)', paddingRight: 'clamp(8px, 3vw, 24px)', background: 'var(--background)' }}>
                <div style={{ maxWidth, margin: '0 auto' }}>

                    {/* Header */}
                    <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Link href="/minigames" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                                <ArrowLeft size={18} />
                            </Link>
                            <div>
                                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <DevTermoLogo size={28} /> DevTermo
                                    {gameMode && (
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                                            background: gameMode === 'quarteto' ? 'rgba(124, 58, 237, 0.15)' : gameMode === 'dupla' ? 'rgba(0, 212, 255, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                            color: gameMode === 'quarteto' ? '#a78bfa' : gameMode === 'dupla' ? '#00d4ff' : '#10b981',
                                        }}>
                                            {MODE_LABELS[gameMode]}
                                        </span>
                                    )}
                                </h1>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Palavra do dia — {daySeed}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {gameStarted && (
                                <button onClick={() => { setGameStarted(false); setGameMode(null); }} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <RotateCcw size={16} />
                                </button>
                            )}
                            <button onClick={() => setShowHelp(!showHelp)} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <HelpCircle size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Help */}
                    {showHelp && (
                        <div className="card animate-fade-in" style={{ padding: '16px', marginBottom: '16px' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Adivinhe palavras de <b>5 letras</b> sobre programação e tecnologia!<br /><br />
                                <b>Modos:</b><br />
                                🎯 <b>Solo</b> — 1 palavra, 6 tentativas<br />
                                👥 <b>Dupla</b> — 2 palavras simultâneas, 7 tentativas<br />
                                🔥 <b>Quarteto</b> — 4 palavras simultâneas, 9 tentativas<br /><br />
                                🟩 <span style={{ color: '#10b981', fontWeight: 600 }}>Verde</span> = letra correta na posição certa<br />
                                🟨 <span style={{ color: '#f59e0b', fontWeight: 600 }}>Amarelo</span> = letra existe mas posição errada<br />
                                ⬛ <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Cinza</span> = letra não existe na palavra<br /><br />
                                Apenas palavras válidas em <b>português</b> ou <b>inglês</b> são aceitas!<br />
                                Uma nova palavra por dia! Ganhe <Coins size={14} style={{ display: 'inline', color: '#f59e0b' }} /> moedas ao acertar.
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
                            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><DevTermoLogo size={64} /></div>
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

                    {/* Mode Selection */}
                    {!alreadyPlayed && !gameStarted && (
                        <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 4 }}>
                                Escolha o modo de jogo
                            </h2>
                            {(['solo', 'dupla', 'quarteto'] as GameMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => startGame(mode)}
                                    className="card"
                                    style={{
                                        padding: '20px', cursor: 'pointer', border: '2px solid var(--border-color)',
                                        background: 'var(--bg-surface)', borderRadius: 14,
                                        transition: 'all 0.2s ease', textAlign: 'left',
                                        display: 'flex', alignItems: 'center', gap: '16px',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = mode === 'quarteto' ? '#7c3aed' : mode === 'dupla' ? '#00d4ff' : '#10b981'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <div style={{
                                        width: 52, height: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem', fontWeight: 800,
                                        background: mode === 'quarteto' ? 'rgba(124, 58, 237, 0.12)' : mode === 'dupla' ? 'rgba(0, 212, 255, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                                        color: mode === 'quarteto' ? '#a78bfa' : mode === 'dupla' ? '#00d4ff' : '#10b981',
                                    }}>
                                        {mode === 'quarteto' ? '4' : mode === 'dupla' ? '2' : '1'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
                                            {MODE_LABELS[mode]}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {MODE_DESCRIPTIONS[mode]}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 4,
                                        fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b',
                                    }}>
                                        <Coins size={14} /> {MODE_COINS[mode]}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Game Board(s) */}
                    {!alreadyPlayed && gameStarted && (
                        <>
                            {/* Invalid word toast */}
                            {invalidWord && (
                                <div className="animate-fade-in" style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    padding: '10px 20px', marginBottom: '12px', borderRadius: 10,
                                    background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444', fontSize: '0.85rem', fontWeight: 700,
                                }}>
                                    <AlertTriangle size={16} /> Palavra não reconhecida!
                                </div>
                            )}

                            <div className="animate-fade-in-up" style={getBoardGridStyle()}>
                                {boardCount === 1 ? renderBoard(0) : (
                                    Array.from({ length: boardCount }).map((_, i) => renderBoard(i))
                                )}
                            </div>

                            {/* Game Over Message */}
                            {gameOver && (
                                <div className="card animate-scale-in" style={{ padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
                                    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}><DevTermoLogo size={52} /></div>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                                        {won ? 'Parabéns!' : 'Não foi dessa vez...'}
                                    </h2>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                                        {won
                                            ? `Acertou ${boardCount > 1 ? 'todas' : ''} em ${guesses.length} tentativa${guesses.length > 1 ? 's' : ''}!`
                                            : (
                                                <span>
                                                    {answers.map((a, i) => (
                                                        <span key={i}>
                                                            {i > 0 && ', '}
                                                            <b style={{ color: boardWon[i] ? '#10b981' : '#00d4ff' }}>{a}</b>
                                                        </span>
                                                    ))}
                                                </span>
                                            )
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
