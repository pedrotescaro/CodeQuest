'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserData, getLeaderboard, getXpParaProximoNivel, UserData } from '@/lib/firestore';
import { categorias } from '@/lib/quizzes';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
    Zap, Trophy, Flame, Code2, Medal, TrendingUp, ChevronRight,
    Database, Cpu, FileCode, Palette, Atom, Terminal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
    javascript: FileCode,
    python: Terminal,
    htmlcss: Palette,
    logica: Cpu,
    sql: Database,
    react: Atom,
};

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

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '48px', paddingLeft: '24px', paddingRight: '24px', background: 'var(--background)' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    {/* Welcome Header */}
                    <div className="animate-fade-in-up" style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                            Ola, <span className="gradient-text">{userData.nome}</span>!
                        </h1>
                        <p style={{ marginTop: '4px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Continue sua jornada de programacao.</p>
                    </div>

                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        {/* XP Card */}
                        <div className="card animate-fade-in-up" style={{ padding: '24px', animationDelay: '0.1s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(0, 212, 255, 0.08)',
                                }}>
                                    <Zap size={20} style={{ color: '#00d4ff' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>XP Total</p>
                                    <p className="neon-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{userData.xp}</p>
                                </div>
                            </div>
                            <div className="progress-bar-bg" style={{ height: '8px' }}>
                                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                            </div>
                            <p style={{ fontSize: '0.75rem', marginTop: '6px', color: 'var(--text-muted)' }}>
                                {xpProgress.atual}/{xpProgress.necessario} XP para o nivel {userData.nivel + 1}
                            </p>
                        </div>

                        {/* Level Card */}
                        <div className="card animate-fade-in-up" style={{ padding: '24px', animationDelay: '0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(245, 158, 11, 0.08)',
                                }}>
                                    <Trophy size={20} style={{ color: '#f59e0b' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>Nivel</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{userData.nivel}</p>
                                </div>
                            </div>
                        </div>

                        {/* Streak Card */}
                        <div className="card animate-fade-in-up" style={{ padding: '24px', animationDelay: '0.3s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(239, 68, 68, 0.08)',
                                }}>
                                    <Flame size={20} style={{ color: '#ef4444' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>Ofensiva</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>
                                        {userData.ofensiva} {userData.ofensiva === 1 ? 'dia' : 'dias'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                        {/* Quiz Categories */}
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Escolha um Quiz</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                                {categorias.map((cat, i) => {
                                    const completado = userData.quizzesCompletos[cat.id];
                                    const CatIcon = categoryIcons[cat.id] || Code2;
                                    return (
                                        <Link
                                            key={cat.id}
                                            href={`/quiz/${cat.id}`}
                                            className="card animate-fade-in-up"
                                            style={{
                                                padding: '20px', cursor: 'pointer', textDecoration: 'none',
                                                animationDelay: `${0.08 * (i + 1)}s`,
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                                <div style={{
                                                    width: '48px', height: '48px', borderRadius: '12px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                    backgroundColor: `${cat.cor}15`,
                                                    color: cat.cor,
                                                    transition: 'transform 0.2s',
                                                }}>
                                                    <CatIcon size={22} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                                        {cat.nome}
                                                    </h3>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{cat.descricao}</p>
                                                    {completado && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{
                                                                fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 600,
                                                                background: 'rgba(0, 212, 255, 0.08)', color: '#00d4ff',
                                                            }}>
                                                                Melhor: {completado.melhorScore}/{cat.perguntas.length}
                                                            </span>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                {completado.tentativas}x jogado
                                                            </span>
                                                        </div>
                                                    )}
                                                    {!completado && (
                                                        <span style={{
                                                            fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 600,
                                                            background: 'rgba(16, 185, 129, 0.08)', color: '#10b981',
                                                        }}>
                                                            Novo!
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Leaderboard */}
                        <div>
                            <h2 style={{
                                fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)',
                                display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.01em',
                            }}>
                                <Medal size={20} style={{ color: '#f59e0b' }} />
                                Ranking
                            </h2>
                            <div className="card" style={{ padding: '20px' }}>
                                {leaderboard.length === 0 ? (
                                    <p style={{ fontSize: '0.85rem', textAlign: 'center', padding: '16px 0', color: 'var(--text-secondary)' }}>
                                        Nenhum jogador ainda. Seja o primeiro!
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {leaderboard.map((player, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '12px',
                                                    padding: '12px', borderRadius: '10px',
                                                    background: index === 0 ? 'rgba(245, 158, 11, 0.06)'
                                                        : index === 1 ? 'rgba(148, 163, 184, 0.04)'
                                                            : index === 2 ? 'rgba(205, 127, 50, 0.04)' : 'transparent',
                                                    border: index < 3
                                                        ? `1px solid ${index === 0 ? 'rgba(245, 158, 11, 0.12)' : index === 1 ? 'rgba(148, 163, 184, 0.1)' : 'rgba(205, 127, 50, 0.1)'}`
                                                        : '1px solid transparent',
                                                }}
                                            >
                                                <span style={{
                                                    width: '30px', height: '30px', borderRadius: '8px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.8rem', fontWeight: 800,
                                                    background: index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : index === 2 ? '#CD7F32' : 'var(--bg-surface-lighter)',
                                                    color: index < 3 ? 'white' : 'var(--text-secondary)',
                                                }}>
                                                    {index + 1}
                                                </span>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {player.nome}
                                                    </p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        Nivel {player.nivel}
                                                        <span style={{ color: 'var(--text-muted)' }}>·</span>
                                                        <Flame size={11} style={{ color: '#ef4444' }} />
                                                        {player.ofensiva}
                                                    </p>
                                                </div>
                                                <span className="neon-text" style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                                                    {player.xp} XP
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
