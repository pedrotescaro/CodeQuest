'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserData, getXpParaProximoNivel, UserData } from '@/lib/firestore';
import { categorias } from '@/lib/quizzes';
import Navbar from '@/components/Navbar';
import {
    Trophy, Zap, Flame, BookOpen, Settings, LogOut, Code2, User,
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

export default function PerfilPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            getUserData(user.uid).then((data) => {
                setUserData(data);
                setLoading(false);
            });
        }
    }, [user, authLoading]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

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
    const totalTentativas = Object.values(userData.quizzesCompletos).reduce((sum, q) => sum + q.tentativas, 0);

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '48px', paddingLeft: '24px', paddingRight: '24px', background: 'var(--background)' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                    {/* Profile Card */}
                    <div className="card animate-fade-in-up" style={{
                        padding: '32px',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        flexWrap: 'wrap',
                    }}>
                        {/* Avatar */}
                        <div className="profile-avatar">
                            <User size={32} />
                            <div className="profile-level-badge">
                                Lvl {userData.nivel}
                            </div>
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <h1 style={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: 'var(--text-primary)',
                                marginBottom: '4px',
                                letterSpacing: '-0.02em',
                            }}>
                                {userData.nome}
                            </h1>
                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)',
                                marginBottom: '16px',
                            }}>
                                {userData.email}
                            </p>

                            {/* XP Bar */}
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                        Nivel {userData.nivel}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                        {xpProgress.atual}/{xpProgress.necessario} XP
                                    </span>
                                </div>
                                <div className="progress-bar-bg" style={{ height: '8px' }}>
                                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button className="btn-neon" style={{ fontSize: '0.8rem', padding: '8px 18px' }}>
                                    <Settings size={14} />
                                    Editar Perfil
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="btn-outline-neon"
                                    style={{ fontSize: '0.8rem', padding: '8px 18px' }}
                                >
                                    <LogOut size={14} />
                                    Sair da Conta
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '16px',
                        marginBottom: '32px',
                    }}>
                        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.08)' }}>
                                <Trophy size={20} style={{ color: '#f59e0b' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Nivel Atual
                                </p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{userData.nivel}</p>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                            <div className="stat-card-icon" style={{ background: 'rgba(0, 212, 255, 0.08)' }}>
                                <Zap size={20} style={{ color: '#00d4ff' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Experiencia
                                </p>
                                <p className="neon-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{userData.xp} XP</p>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="stat-card-icon" style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
                                <Flame size={20} style={{ color: '#ef4444' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Ofensiva
                                </p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>
                                    {userData.ofensiva} {userData.ofensiva === 1 ? 'dia' : 'dias'}
                                </p>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                            <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                                <BookOpen size={20} style={{ color: '#10b981' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Quizzes Concluidos
                                </p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{quizzesCompletos}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quiz History */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <h2 style={{
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            marginBottom: '16px',
                            letterSpacing: '-0.01em',
                        }}>
                            Historico de Quizzes
                        </h2>

                        <div className="card" style={{ padding: '24px' }}>
                            {quizzesCompletos === 0 ? (
                                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '14px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(0, 212, 255, 0.06)', margin: '0 auto 12px',
                                    }}>
                                        <BookOpen size={24} style={{ color: 'var(--text-muted)' }} />
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem' }}>
                                        Nenhum quiz completado ainda
                                    </p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                                        Comece um quiz para ver seu historico aqui!
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {categorias.map((cat) => {
                                        const completado = userData.quizzesCompletos[cat.id];
                                        if (!completado) return null;
                                        const CatIcon = categoryIcons[cat.id] || Code2;

                                        return (
                                            <div key={cat.id} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px',
                                                padding: '14px',
                                                borderRadius: '12px',
                                                background: 'var(--bg-surface)',
                                                border: '1px solid var(--card-border)',
                                            }}>
                                                <div style={{
                                                    width: '40px', height: '40px', borderRadius: '10px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                    backgroundColor: `${cat.cor}15`,
                                                    color: cat.cor,
                                                }}>
                                                    <CatIcon size={18} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                                        {cat.nome}
                                                    </p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                        {completado.tentativas}x jogado
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p className="neon-text" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                                        {completado.melhorScore}/{cat.perguntas.length}
                                                    </p>
                                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                        melhor score
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
