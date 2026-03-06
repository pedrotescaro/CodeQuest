'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserData, getFullRanking, RankingPlayer, UserData } from '@/lib/firestore';
import { defaultAvatar } from '@/lib/avatarData';
import Navbar from '@/components/Navbar';
import AvatarPreview from '@/components/AvatarPreview';
import {
    Trophy, Flame, Zap, BookOpen, Crown, Medal, TrendingUp, Coins,
} from 'lucide-react';

export default function RankingPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [ranking, setRanking] = useState<RankingPlayer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }

        const load = async () => {
            const [data, lb] = await Promise.all([
                user ? getUserData(user.uid) : null,
                getFullRanking(50),
            ]);
            setUserData(data);
            setRanking(lb);
            setLoading(false);
        };

        if (user) load();
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #00d4ff', borderTopColor: 'transparent', margin: '0 auto 16px' }} className="animate-spin" />
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Carregando ranking...</p>
                </div>
            </div>
        );
    }

    const userRank = userData ? ranking.findIndex(p => p.nome === userData.nome) + 1 : 0;
    const medalColors = ['#f59e0b', '#94a3b8', '#CD7F32'];
    const medalEmojis = ['🥇', '🥈', '🥉'];

    // Top 3 for podium
    const top3 = ranking.slice(0, 3);
    const rest = ranking.slice(3);

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '48px', paddingLeft: 'clamp(8px, 3vw, 24px)', paddingRight: 'clamp(8px, 3vw, 24px)', background: 'var(--background)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                    {/* Header */}
                    <div className="animate-fade-in-up" style={{ marginBottom: '28px', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            <Crown size={28} style={{ color: '#f59e0b' }} />
                            <span className="gradient-text">Ranking Global</span>
                        </h1>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                            Os melhores devs do CodeQuest
                        </p>
                    </div>

                    {/* Your position card */}
                    {userRank > 0 && userData && (
                        <div className="card animate-fade-in-up" style={{
                            padding: '20px 24px', marginBottom: '28px',
                            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.06), rgba(124, 58, 237, 0.04))',
                            border: '1px solid rgba(0, 212, 255, 0.15)',
                            display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
                        }}>
                            <AvatarPreview config={userData.avatar || defaultAvatar} size={52} />
                            <div style={{ flex: 1, minWidth: 140 }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Sua Posição
                                </p>
                                <p style={{ fontSize: '1.4rem', fontWeight: 900 }}>
                                    <span className="gradient-text">#{userRank}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginLeft: 8 }}>
                                        de {ranking.length}
                                    </span>
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p className="neon-text" style={{ fontSize: '1.1rem', fontWeight: 800 }}>{userData.xp}</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>XP</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>Lv.{userData.nivel}</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nível</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444' }}>{userData.ofensiva}</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ofensiva</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Podium - Top 3 */}
                    {top3.length >= 3 && (
                        <div className="animate-fade-in-up" style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
                            gap: '12px', marginBottom: '32px', padding: '0 12px',
                        }}>
                            {/* 2nd place */}
                            <div style={{ flex: 1, maxWidth: 200, textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                                    <AvatarPreview config={top3[1].avatar || defaultAvatar} size={64} />
                                </div>
                                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {top3[1].nome}
                                </p>
                                <p className="neon-text" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{top3[1].xp} XP</p>
                                <div style={{
                                    marginTop: 8, height: 80, borderRadius: '12px 12px 0 0',
                                    background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.15), rgba(148, 163, 184, 0.05))',
                                    border: '1px solid rgba(148, 163, 184, 0.15)',
                                    borderBottom: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem',
                                }}>
                                    🥈
                                </div>
                            </div>

                            {/* 1st place */}
                            <div style={{ flex: 1, maxWidth: 220, textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                                    <div style={{ position: 'relative' }}>
                                        <AvatarPreview config={top3[0].avatar || defaultAvatar} size={80} />
                                        <span style={{
                                            position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                                            fontSize: '1.4rem',
                                        }}>👑</span>
                                    </div>
                                </div>
                                <p style={{ fontWeight: 800, fontSize: '1rem', color: '#f59e0b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {top3[0].nome}
                                </p>
                                <p className="neon-text" style={{ fontSize: '0.9rem', fontWeight: 800 }}>{top3[0].xp} XP</p>
                                <div style={{
                                    marginTop: 8, height: 110, borderRadius: '12px 12px 0 0',
                                    background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.03))',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                    borderBottom: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2.5rem',
                                }}>
                                    🥇
                                </div>
                            </div>

                            {/* 3rd place */}
                            <div style={{ flex: 1, maxWidth: 200, textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                                    <AvatarPreview config={top3[2].avatar || defaultAvatar} size={64} />
                                </div>
                                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {top3[2].nome}
                                </p>
                                <p className="neon-text" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{top3[2].xp} XP</p>
                                <div style={{
                                    marginTop: 8, height: 60, borderRadius: '12px 12px 0 0',
                                    background: 'linear-gradient(180deg, rgba(205, 127, 50, 0.12), rgba(205, 127, 50, 0.03))',
                                    border: '1px solid rgba(205, 127, 50, 0.15)',
                                    borderBottom: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.8rem',
                                }}>
                                    🥉
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Full list */}
                    <div className="card animate-fade-in-up" style={{ padding: '8px', overflow: 'hidden' }}>
                        {/* Header row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '48px 1fr 90px 70px 70px 70px',
                            gap: '8px', padding: '12px 14px',
                            borderBottom: '1px solid var(--border-color)',
                        }} className="ranking-header">
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>#</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jogador</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>XP</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Nível</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }} className="ranking-hide-mobile">Ofensiva</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }} className="ranking-hide-mobile">Quizzes</span>
                        </div>

                        {ranking.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <Trophy size={32} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
                                <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Nenhum jogador ainda.</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>Seja o primeiro a entrar no ranking!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {ranking.map((player, index) => {
                                    const isCurrentUser = userData ? player.nome === userData.nome : false;
                                    const isTop3 = index < 3;

                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '48px 1fr 90px 70px 70px 70px',
                                                gap: '8px',
                                                padding: '14px',
                                                borderRadius: '12px',
                                                alignItems: 'center',
                                                background: isCurrentUser
                                                    ? 'rgba(0, 212, 255, 0.06)'
                                                    : index % 2 === 0
                                                        ? 'transparent'
                                                        : 'var(--hover-bg)',
                                                border: isCurrentUser
                                                    ? '1px solid rgba(0, 212, 255, 0.15)'
                                                    : '1px solid transparent',
                                                transition: 'background 0.2s',
                                            }}
                                            className="ranking-row"
                                        >
                                            {/* Position */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {isTop3 ? (
                                                    <span style={{
                                                        width: 32, height: 32, borderRadius: 10,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.85rem', fontWeight: 800,
                                                        background: medalColors[index],
                                                        color: 'white',
                                                    }}>
                                                        {index + 1}
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        width: 32, height: 32, borderRadius: 10,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.8rem', fontWeight: 700,
                                                        background: 'var(--bg-surface)',
                                                        color: 'var(--text-secondary)',
                                                    }}>
                                                        {index + 1}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Player info */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                                <AvatarPreview config={player.avatar || defaultAvatar} size={36} />
                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{
                                                        fontWeight: isCurrentUser ? 700 : 600,
                                                        fontSize: '0.85rem',
                                                        color: isCurrentUser ? '#00d4ff' : 'var(--text-primary)',
                                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                    }}>
                                                        {player.nome}
                                                        {isCurrentUser && <span style={{ fontSize: '0.7rem', marginLeft: 4, opacity: 0.7 }}>(você)</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* XP */}
                                            <div style={{ textAlign: 'right' }}>
                                                <span className="neon-text" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                                                    {player.xp.toLocaleString('pt-BR')}
                                                </span>
                                            </div>

                                            {/* Level */}
                                            <div style={{ textAlign: 'center' }}>
                                                <span style={{
                                                    fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b',
                                                    background: 'rgba(245, 158, 11, 0.08)',
                                                    padding: '3px 10px', borderRadius: 999,
                                                }}>
                                                    {player.nivel}
                                                </span>
                                            </div>

                                            {/* Streak */}
                                            <div style={{ textAlign: 'center' }} className="ranking-hide-mobile">
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                                                    <Flame size={12} style={{ color: '#ef4444' }} />
                                                    {player.ofensiva}
                                                </span>
                                            </div>

                                            {/* Quizzes */}
                                            <div style={{ textAlign: 'center' }} className="ranking-hide-mobile">
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                                                    <BookOpen size={12} style={{ color: '#10b981' }} />
                                                    {player.quizzesCompletos}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
