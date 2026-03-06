'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserData, getLeaderboard, getXpParaProximoNivel, UserData } from '@/lib/firestore';
import { categorias } from '@/lib/quizzes';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    Zap, Trophy, Flame, Code2, Medal, Target, BookOpen,
    Play, ArrowRight, ChevronRight, Sparkles, TrendingUp,
} from 'lucide-react';
import { languageIconMap } from '@/components/LanguageIcons';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [leaderboard, setLeaderboard] = useState<
        { nome: string; xp: number; nivel: number; ofensiva: number }[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            loadData();
        }
    }, [user, authLoading]);

    async function loadData() {
        try {
            const [data, lb] = await Promise.all([
                getUserData(user!.uid),
                getLeaderboard(),
            ]);
            setUserData(data);
            setLeaderboard(lb);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
        }
        setLoading(false);
    }

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        border: '3px solid #00d4ff', borderTopColor: 'transparent',
                        margin: '0 auto 16px',
                    }} className="animate-spin" />
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Carregando...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Erro ao carregar dados do perfil.</p>
            </div>
        );
    }

    const xpProgress = getXpParaProximoNivel(userData.xp);
    const progressPercent = (xpProgress.atual / xpProgress.necessario) * 100;
    const quizzesCompletos = Object.keys(userData.quizzesCompletos).length;
    const totalQuizzes = categorias.length;
    const completionPercent = totalQuizzes > 0 ? Math.round((quizzesCompletos / totalQuizzes) * 100) : 0;
    const dailyChallenge = categorias[Math.floor(Date.now() / 86400000) % categorias.length];

    // Find user position in leaderboard
    const userRank = leaderboard.findIndex(p => p.nome === userData.nome) + 1;

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--background)' }}>

                {/* ===== HERO BANNER ===== */}
                <section className="dash-hero" style={{
                    background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #a78bfa 100%)',
                    borderRadius: '0 0 32px 32px',
                    padding: 'clamp(24px, 5vw, 48px) clamp(12px, 3vw, 24px) clamp(24px, 5vw, 40px)',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Background decorative blurs */}
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                        <div style={{
                            position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px',
                            borderRadius: '50%', filter: 'blur(120px)',
                            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12), transparent 70%)',
                        }} />
                        <div style={{
                            position: 'absolute', bottom: '-100px', left: '-100px', width: '350px', height: '350px',
                            borderRadius: '50%', filter: 'blur(120px)',
                            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.1), transparent 70%)',
                        }} />
                    </div>

                    <div style={{
                        maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10,
                        display: 'flex', alignItems: 'center', gap: 'clamp(20px, 4vw, 40px)',
                        flexWrap: 'wrap',
                    }} className="dash-hero-flex">

                        {/* Left: Greeting + XP Progress */}
                        <div className="animate-fade-in-up dash-hero-left" style={{ flex: '1 1 340px' }}>
                            <h1 style={{
                                fontSize: 'clamp(1.25rem, 4vw, 2.4rem)',
                                fontWeight: 800, lineHeight: 1.2, marginBottom: '8px',
                                color: '#ffffff', letterSpacing: '-0.02em',
                            }}>
                                Dashboard de{' '}
                                <span style={{ color: '#fbbf24' }}>{userData.nome}</span>
                            </h1>
                            <p style={{
                                fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                                color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px', lineHeight: 1.6,
                            }}>
                                Acompanhe seu progresso e continue evoluindo.
                            </p>

                            {/* Glass XP Card */}
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.10)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.20)',
                                borderRadius: '16px',
                                padding: '20px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                            }}>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                                    marginBottom: '16px',
                                }}>
                                    <div>
                                        <p style={{
                                            fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
                                            letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.7)',
                                            marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px',
                                        }}>
                                            <Trophy size={16} style={{ color: '#00d4ff' }} />
                                            Nivel {userData.nivel}
                                        </p>
                                        <p style={{
                                            fontWeight: 900, fontSize: '1.5rem', color: '#ffffff',
                                            display: 'flex', alignItems: 'center', gap: '8px', lineHeight: 1,
                                        }}>
                                            {xpProgress.atual}
                                            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)' }}>
                                                / {xpProgress.necessario} XP
                                            </span>
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Flame size={24} style={{ color: userData.ofensiva > 0 ? '#fbbf24' : 'rgba(255,255,255,0.4)' }} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px', color: '#ffffff' }}>
                                            {userData.ofensiva} {userData.ofensiva === 1 ? 'dia' : 'dias'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{
                                    width: '100%', background: 'rgba(0, 0, 0, 0.20)',
                                    borderRadius: '999px', height: '12px', overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${progressPercent}%`, height: '12px', borderRadius: '999px',
                                        background: 'linear-gradient(90deg, #00d4ff, #a78bfa)',
                                        transition: 'width 1s ease-out',
                                    }} />
                                </div>
                            </div>
                        </div>

                        {/* Right: Daily Challenge Card */}
                        <div className="animate-fade-in-up dash-hero-right" style={{
                            flex: '0 1 340px', minWidth: 0,
                            background: 'var(--bg-card)',
                            border: '2px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '20px',
                            padding: 'clamp(16px, 4vw, 28px)',
                            animationDelay: '0.15s',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '5px 14px', borderRadius: '8px',
                                fontSize: '0.7rem', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                                background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b',
                                marginBottom: '16px',
                            }}>
                                <Target size={12} />
                                Desafio do Dia
                            </div>
                            <h3 style={{
                                fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)',
                                marginBottom: '10px', letterSpacing: '-0.01em',
                            }}>
                                {dailyChallenge.nome}
                            </h3>
                            <p style={{
                                fontSize: '0.875rem', color: 'var(--text-secondary)',
                                marginBottom: '24px', lineHeight: 1.6,
                            }}>
                                {dailyChallenge.descricao}. Prove seus conhecimentos e ganhe XP em dobro hoje.
                            </p>
                            <Link
                                href={`/quiz/${dailyChallenge.id}`}
                                className="btn-3d"
                                style={{
                                    padding: '14px 28px', borderRadius: '12px',
                                    fontSize: '0.9rem', width: '100%', textDecoration: 'none',
                                }}
                            >
                                <Play size={16} fill="white" />
                                Jogar Quiz
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ===== QUICK STATS ===== */}
                <section style={{ padding: 'clamp(24px, 4vw, 40px) clamp(8px, 3vw, 24px) 0' }}>
                    <div className="dashboard-stats-grid" style={{
                        maxWidth: '1280px', margin: '0 auto',
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px',
                    }}>
                        <div className="stat-card animate-fade-in-up">
                            <div className="stat-card-icon" style={{ background: 'rgba(0, 212, 255, 0.08)' }}>
                                <Zap size={20} style={{ color: '#00d4ff' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>XP Total</p>
                                <p className="neon-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{userData.xp}</p>
                            </div>
                        </div>
                        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.08)' }}>
                                <Trophy size={20} style={{ color: '#f59e0b' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nivel</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{userData.nivel}</p>
                            </div>
                        </div>
                        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="stat-card-icon" style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
                                <Flame size={20} style={{ color: '#ef4444' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ofensiva</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>
                                    {userData.ofensiva} {userData.ofensiva === 1 ? 'dia' : 'dias'}
                                </p>
                            </div>
                        </div>
                        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                                <BookOpen size={20} style={{ color: '#10b981' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quizzes</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{quizzesCompletos}/{totalQuizzes}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== MAIN CONTENT: quizzes + leaderboard ===== */}
                <section style={{ padding: 'clamp(24px, 4vw, 40px) clamp(8px, 3vw, 24px) clamp(32px, 5vw, 48px)' }}>
                    <div className="dashboard-main-grid" style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>

                        {/* Left: Quiz Categories */}
                        <div>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                marginBottom: '20px',
                            }}>
                                <h2 style={{
                                    fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase',
                                    letterSpacing: '0.08em', color: 'var(--text-primary)',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                }}>
                                    <Sparkles size={18} style={{ color: '#00d4ff' }} />
                                    Escolha um Quiz
                                </h2>
                                <span style={{
                                    fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)',
                                    background: 'var(--bg-surface)', padding: '4px 12px', borderRadius: '8px',
                                }}>
                                    {completionPercent}% completo
                                </span>
                            </div>

                            {/* Quiz progress bar */}
                            <div style={{
                                width: '100%', background: 'var(--bg-surface-light)',
                                borderRadius: '999px', height: '6px', overflow: 'hidden',
                                marginBottom: '24px',
                            }}>
                                <div style={{
                                    width: `${completionPercent}%`, height: '6px', borderRadius: '999px',
                                    background: 'linear-gradient(90deg, #10b981, #00d4ff)',
                                    transition: 'width 1s ease-out',
                                }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                {categorias.map((cat, i) => {
                                    const completado = userData.quizzesCompletos[cat.id];
                                    const LangIcon = languageIconMap[cat.id];
                                    const scorePercent = completado
                                        ? Math.round((completado.melhorScore / cat.perguntas.length) * 100)
                                        : 0;
                                    return (
                                        <Link
                                            key={cat.id}
                                            href={`/quiz/${cat.id}`}
                                            className="dash-quiz-card animate-fade-in-up"
                                            style={{
                                                display: 'block',
                                                background: `linear-gradient(160deg, ${cat.cor}10, var(--bg-card) 40%)`,
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '18px',
                                                padding: '0',
                                                textDecoration: 'none',
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',
                                                animationDelay: `${0.06 * (i + 1)}s`,
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.borderColor = `${cat.cor}40`;
                                                e.currentTarget.style.boxShadow = `0 12px 36px rgba(0, 0, 0, 0.15), 0 0 20px ${cat.cor}12`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.borderColor = 'var(--card-border)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            {/* Top color band */}
                                            <div style={{
                                                height: '4px',
                                                background: `linear-gradient(90deg, ${cat.cor}, ${cat.cor}60)`,
                                            }} />
                                            <div style={{ padding: '20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                                    <div style={{
                                                        width: '52px', height: '52px', borderRadius: '14px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        flexShrink: 0,
                                                        backgroundColor: `${cat.cor}15`,
                                                        border: `1px solid ${cat.cor}20`,
                                                        overflow: 'hidden',
                                                    }}>
                                                        {LangIcon ? <LangIcon size={30} /> : <Code2 size={24} style={{ color: cat.cor }} />}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <h3 style={{
                                                            fontSize: '1rem', fontWeight: 700,
                                                            color: 'var(--text-primary)', marginBottom: '4px',
                                                        }}>
                                                            {cat.nome}
                                                        </h3>
                                                        <p style={{
                                                            fontSize: '0.82rem', color: 'var(--text-secondary)',
                                                            marginBottom: '12px', lineHeight: 1.4,
                                                        }}>
                                                            {cat.descricao}
                                                        </p>

                                                        {completado ? (
                                                            <>
                                                                {/* Score progress mini bar */}
                                                                <div style={{
                                                                    width: '100%', background: 'var(--bg-surface-light)',
                                                                    borderRadius: '999px', height: '4px', overflow: 'hidden',
                                                                    marginBottom: '8px',
                                                                }}>
                                                                    <div style={{
                                                                        width: `${scorePercent}%`, height: '4px', borderRadius: '999px',
                                                                        background: scorePercent === 100
                                                                            ? 'linear-gradient(90deg, #10b981, #059669)'
                                                                            : `linear-gradient(90deg, ${cat.cor}, ${cat.cor}80)`,
                                                                        transition: 'width 0.8s ease-out',
                                                                    }} />
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                                    <span style={{
                                                                        fontSize: '0.72rem', padding: '3px 10px', borderRadius: '8px', fontWeight: 600,
                                                                        background: 'rgba(0, 212, 255, 0.08)', color: '#00d4ff',
                                                                    }}>
                                                                        Melhor: {completado.melhorScore}/{cat.perguntas.length}
                                                                    </span>
                                                                    <span style={{
                                                                        fontSize: '0.72rem', color: 'var(--text-muted)',
                                                                    }}>
                                                                        {completado.tentativas}x jogado
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span style={{
                                                                fontSize: '0.72rem', padding: '3px 10px', borderRadius: '8px', fontWeight: 600,
                                                                background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                            }}>
                                                                <Sparkles size={10} />
                                                                Novo!
                                                            </span>
                                                        )}
                                                    </div>
                                                    <ChevronRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '4px' }} />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Leaderboard + Quick Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Your Rank Card */}
                            {userRank > 0 && (
                                <div className="animate-fade-in-up" style={{
                                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.06), rgba(124, 58, 237, 0.04))',
                                    border: '1px solid rgba(0, 212, 255, 0.12)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '14px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                                        fontSize: '1.2rem', fontWeight: 800, color: 'white',
                                    }}>
                                        #{userRank}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Sua Posicao
                                        </p>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                            Top {Math.max(1, Math.round((userRank / Math.max(leaderboard.length, 1)) * 100))}% dos jogadores
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Leaderboard */}
                            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                <h2 style={{
                                    fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px',
                                    color: 'var(--text-primary)', textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                }}>
                                    <Medal size={18} style={{ color: '#f59e0b' }} />
                                    Ranking
                                </h2>
                                <div style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '18px',
                                    padding: '8px',
                                    overflow: 'hidden',
                                }}>
                                    {leaderboard.length === 0 ? (
                                        <p style={{ fontSize: '0.85rem', textAlign: 'center', padding: '24px 16px', color: 'var(--text-secondary)' }}>
                                            Nenhum jogador ainda. Seja o primeiro!
                                        </p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {leaderboard.map((player, index) => {
                                                const isCurrentUser = player.nome === userData.nome;
                                                const medalColors = ['#f59e0b', '#94a3b8', '#CD7F32'];
                                                return (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '12px',
                                                            padding: '12px 14px', borderRadius: '12px',
                                                            background: isCurrentUser
                                                                ? 'rgba(0, 212, 255, 0.06)'
                                                                : index === 0 ? 'rgba(245, 158, 11, 0.04)'
                                                                    : 'transparent',
                                                            border: isCurrentUser
                                                                ? '1px solid rgba(0, 212, 255, 0.15)'
                                                                : index < 3
                                                                    ? `1px solid ${medalColors[index]}18`
                                                                    : '1px solid transparent',
                                                            transition: 'background 0.2s',
                                                        }}
                                                    >
                                                        <span style={{
                                                            width: '32px', height: '32px', borderRadius: '10px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '0.8rem', fontWeight: 800, flexShrink: 0,
                                                            background: index < 3 ? medalColors[index] : 'var(--bg-surface-lighter)',
                                                            color: index < 3 ? 'white' : 'var(--text-secondary)',
                                                        }}>
                                                            {index + 1}
                                                        </span>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <p style={{
                                                                fontWeight: isCurrentUser ? 700 : 600,
                                                                fontSize: '0.85rem',
                                                                color: isCurrentUser ? '#00d4ff' : 'var(--text-primary)',
                                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                            }}>
                                                                {player.nome} {isCurrentUser && '(voce)'}
                                                            </p>
                                                            <p style={{
                                                                fontSize: '0.72rem', color: 'var(--text-muted)',
                                                                display: 'flex', alignItems: 'center', gap: '4px',
                                                            }}>
                                                                Lv.{player.nivel}
                                                                <span>·</span>
                                                                <Flame size={10} style={{ color: '#ef4444' }} />
                                                                {player.ofensiva}
                                                            </p>
                                                        </div>
                                                        <span className="neon-text" style={{ fontSize: '0.85rem', fontWeight: 800, flexShrink: 0 }}>
                                                            {player.xp}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <h2 style={{
                                    fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px',
                                    color: 'var(--text-primary)', textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                }}>
                                    <TrendingUp size={18} style={{ color: '#10b981' }} />
                                    Acoes Rapidas
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Link href="/perfil" style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '14px 16px', borderRadius: '14px',
                                        background: 'var(--bg-card)', border: '1px solid var(--card-border)',
                                        textDecoration: 'none', transition: 'all 0.2s ease',
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--card-border)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '10px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'rgba(124, 58, 237, 0.08)',
                                        }}>
                                            <Trophy size={16} style={{ color: '#7c3aed' }} />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                                            Ver meu Perfil
                                        </span>
                                        <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                                    </Link>
                                    <Link href="/busca" style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '14px 16px', borderRadius: '14px',
                                        background: 'var(--bg-card)', border: '1px solid var(--card-border)',
                                        textDecoration: 'none', transition: 'all 0.2s ease',
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--card-border)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '10px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'rgba(0, 212, 255, 0.08)',
                                        }}>
                                            <Code2 size={16} style={{ color: '#00d4ff' }} />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                                            Explorar Quizzes
                                        </span>
                                        <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
