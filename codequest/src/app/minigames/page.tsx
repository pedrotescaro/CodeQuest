'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserData, UserData } from '@/lib/firestore';
import { getDaySeed } from '@/lib/termoData';
import Navbar from '@/components/Navbar';
import { Gamepad2, Coins, Trophy, Flame, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const minigames = [
    {
        id: 'termo',
        nome: 'DevTermo',
        descricao: 'Adivinhe a palavra de programação do dia em 6 tentativas!',
        emoji: '🖥️',
        cor: '#10b981',
        corBg: 'rgba(16, 185, 129, 0.08)',
        href: '/minigames/termo',
        diario: true,
        recompensa: '20 moedas + 30 XP',
    },
    {
        id: 'coderush',
        nome: 'CodeRush',
        descricao: 'Escolha uma linguagem e digite o comando certo contra o tempo!',
        emoji: '⚡',
        cor: '#f59e0b',
        corBg: 'rgba(245, 158, 11, 0.08)',
        href: '/minigames/coderush',
        diario: false,
        recompensa: '5 moedas por 10 pts',
    },
];

export default function MinigamesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user) {
            getUserData(user.uid).then((data) => {
                setUserData(data);
                setLoading(false);
            });
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #00d4ff', borderTopColor: 'transparent', margin: '0 auto 16px' }} className="animate-spin" />
                </div>
            </div>
        );
    }

    const termoPlayed = userData?.minigames?.termo?.ultimoDia === getDaySeed();

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '48px', paddingLeft: 'clamp(8px, 3vw, 24px)', paddingRight: 'clamp(8px, 3vw, 24px)', background: 'var(--background)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                    {/* Header */}
                    <div className="animate-fade-in-up" style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Gamepad2 size={28} style={{ color: '#a78bfa' }} />
                            Minigames
                        </h1>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                            Jogue, ganhe moedas e desbloqueie itens na loja!
                        </p>
                    </div>

                    {/* Coins display */}
                    <div className="card animate-fade-in-up" style={{
                        padding: '16px 24px', marginBottom: '24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '12px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Coins size={24} style={{ color: '#f59e0b' }} />
                            <div>
                                <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>{userData?.moedas || 0}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>moedas disponíveis</p>
                            </div>
                        </div>
                        <Link href="/loja" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '0.8rem' }}>
                            🛒 Ir para Loja
                        </Link>
                    </div>

                    {/* Minigame stats */}
                    {userData?.minigames && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '28px' }}>
                            {userData.minigames.termo && (
                                <>
                                    <div className="stat-card animate-fade-in-up">
                                        <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                                            <Trophy size={18} style={{ color: '#10b981' }} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Termo Vitórias</p>
                                            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>{userData.minigames.termo.vitorias}</p>
                                        </div>
                                    </div>
                                    <div className="stat-card animate-fade-in-up">
                                        <div className="stat-card-icon" style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
                                            <Flame size={18} style={{ color: '#ef4444' }} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Melhor Sequência</p>
                                            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ef4444' }}>{userData.minigames.termo.melhorSequencia}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            {userData.minigames.codeRush && (
                                <div className="stat-card animate-fade-in-up">
                                    <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.08)' }}>
                                        <Zap size={18} style={{ color: '#f59e0b' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rush Recorde</p>
                                        <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>{userData.minigames.codeRush.melhorPontuacao}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Minigame cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {minigames.map((game, idx) => {
                            const played = game.id === 'termo' && termoPlayed;
                            return (
                                <Link
                                    key={game.id}
                                    href={game.href}
                                    className="card animate-fade-in-up"
                                    style={{
                                        textDecoration: 'none',
                                        padding: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        animationDelay: `${idx * 0.1}s`,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div style={{
                                        width: 64, height: 64, borderRadius: 16,
                                        background: game.corBg, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2rem', flexShrink: 0,
                                    }}>
                                        {game.emoji}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                {game.nome}
                                            </h3>
                                            {game.diario && (
                                                <span style={{
                                                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px',
                                                    borderRadius: 999, background: played ? 'rgba(100,116,139,0.1)' : 'rgba(0, 212, 255, 0.1)',
                                                    color: played ? 'var(--text-muted)' : '#00d4ff',
                                                }}>
                                                    {played ? '✓ Jogado hoje' : 'DIÁRIO'}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                                            {game.descricao}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
                                            <Coins size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {game.recompensa}
                                        </p>
                                    </div>

                                    <ArrowRight size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
