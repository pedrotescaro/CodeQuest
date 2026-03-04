'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserData, getLeaderboard, getXpParaProximoNivel, UserData } from '@/lib/firestore';
import { categorias } from '@/lib/quizzes';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

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
                        width: '64px', height: '64px', borderRadius: '50%',
                        border: '4px solid #00d4ff', borderTopColor: 'transparent',
                        margin: '0 auto 16px',
                    }} className="animate-spin" />
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Carregando...</p>
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
                        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: 'var(--text-primary)' }}>
                            Olá, <span className="gradient-text">{userData.nome}</span>! 👋
                        </h1>
                        <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>Continue sua jornada de programação.</p>
                    </div>

                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        {/* XP Card */}
                        <div className="card animate-fade-in-up" style={{ padding: '24px', animationDelay: '0.1s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(0, 212, 255, 0.1)',
                                }}>
                                    <span style={{ fontSize: '1.5rem' }}>⚡</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>XP Total</p>
                                    <p className="neon-text" style={{ fontSize: '1.5rem', fontWeight: 900 }}>{userData.xp}</p>
                                </div>
                            </div>
                            <div className="progress-bar-bg" style={{ height: '12px' }}>
                                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                            </div>
                            <p style={{ fontSize: '12px', marginTop: '4px', color: 'var(--text-secondary)' }}>
                                {xpProgress.atual}/{xpProgress.necessario} XP para o nível {userData.nivel + 1}
                            </p>
                        </div>

                        {/* Level Card */}
                        <div className="card animate-fade-in-up" style={{ padding: '24px', animationDelay: '0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(255, 165, 2, 0.1)',
                                }}>
                                    <span style={{ fontSize: '1.5rem' }}>🏆</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Nível</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffa502' }}>{userData.nivel}</p>
                                </div>
                            </div>
                        </div>

                        {/* Streak Card */}
                        <div className="card animate-fade-in-up" style={{ padding: '24px', animationDelay: '0.3s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(255, 71, 87, 0.1)',
                                }}>
                                    <span style={{ fontSize: '1.5rem' }}>🔥</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Ofensiva</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ff4757' }}>
                                        {userData.ofensiva} {userData.ofensiva === 1 ? 'dia' : 'dias'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                        {/* Quiz Categories */}
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', color: 'var(--text-primary)' }}>Escolha um Quiz</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                                {categorias.map((cat, i) => {
                                    const completado = userData.quizzesCompletos[cat.id];
                                    return (
                                        <Link
                                            key={cat.id}
                                            href={`/quiz/${cat.id}`}
                                            className="card animate-fade-in-up"
                                            style={{
                                                padding: '20px', cursor: 'pointer', textDecoration: 'none',
                                                animationDelay: `${0.1 * (i + 1)}s`,
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                                <div style={{
                                                    width: '56px', height: '56px', borderRadius: '12px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1.5rem', flexShrink: 0,
                                                    backgroundColor: `${cat.cor}20`,
                                                    transition: 'transform 0.2s',
                                                }}>
                                                    {cat.icone}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                                        {cat.nome}
                                                    </h3>
                                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{cat.descricao}</p>
                                                    {completado && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{
                                                                fontSize: '12px', padding: '2px 8px', borderRadius: '8px', fontWeight: 600,
                                                                background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff',
                                                            }}>
                                                                Melhor: {completado.melhorScore}/{cat.perguntas.length}
                                                            </span>
                                                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                                {completado.tentativas}x jogado
                                                            </span>
                                                        </div>
                                                    )}
                                                    {!completado && (
                                                        <span style={{
                                                            fontSize: '12px', padding: '2px 8px', borderRadius: '8px', fontWeight: 600,
                                                            background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88',
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
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', color: 'var(--text-primary)' }}>🏅 Ranking</h2>
                            <div className="card" style={{ padding: '20px' }}>
                                {leaderboard.length === 0 ? (
                                    <p style={{ fontSize: '14px', textAlign: 'center', padding: '16px 0', color: 'var(--text-secondary)' }}>
                                        Nenhum jogador ainda. Seja o primeiro!
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {leaderboard.map((player, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '12px',
                                                    padding: '12px', borderRadius: '12px',
                                                    background: index === 0 ? 'rgba(255, 165, 2, 0.08)'
                                                        : index === 1 ? 'rgba(192, 192, 192, 0.06)'
                                                            : index === 2 ? 'rgba(205, 127, 50, 0.06)' : 'transparent',
                                                    border: index < 3
                                                        ? `1px solid ${index === 0 ? 'rgba(255, 165, 2, 0.2)' : index === 1 ? 'rgba(192, 192, 192, 0.15)' : 'rgba(205, 127, 50, 0.15)'}`
                                                        : '1px solid transparent',
                                                }}
                                            >
                                                <span style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '14px', fontWeight: 900,
                                                    background: index === 0 ? '#ffa502' : index === 1 ? '#c0c0c0' : index === 2 ? '#CD7F32' : 'var(--bg-surface-lighter)',
                                                    color: index < 3 ? '#0a0a0f' : 'var(--text-secondary)',
                                                }}>
                                                    {index + 1}
                                                </span>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {player.nome}
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                        Nível {player.nivel} · 🔥 {player.ofensiva}
                                                    </p>
                                                </div>
                                                <span className="neon-text" style={{ fontSize: '14px', fontWeight: 900 }}>
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
