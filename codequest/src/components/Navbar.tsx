'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserData } from '@/lib/firestore';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (user) {
            getUserData(user.uid).then((data) => {
                if (data) setUserName(data.nome);
            });
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-color)',
            transition: 'background 0.3s ease',
        }}>
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 24px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <Link
                    href={user ? '/dashboard' : '/'}
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        letterSpacing: '-0.02em',
                        textDecoration: 'none',
                        color: '#00d4ff',
                        textShadow: '0 0 10px rgba(0, 212, 255, 0.5), 0 0 30px rgba(0, 212, 255, 0.2)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {'<'}Code<span style={{ color: '#a78bfa' }}>Quest</span>{' />'}
                </Link>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label="Alternar tema"
                    >
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </button>

                    {user ? (
                        <>
                            <span style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)',
                                fontWeight: 500,
                            }}>
                                Olá, <span style={{ color: '#00d4ff', fontWeight: 700 }}>
                                    {userName || 'jogador'}
                                </span>
                            </span>

                            <button
                                onClick={handleLogout}
                                style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s',
                                    textTransform: 'uppercase',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff4757')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                            >
                                SAIR
                            </button>

                            <Link href="/perfil" className="btn-neon">
                                MEU PERFIL
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/#como-funciona"
                                style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    textDecoration: 'none',
                                    textTransform: 'uppercase',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                            >
                                COMO FUNCIONA
                            </Link>
                            <Link
                                href="/login"
                                style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    textDecoration: 'none',
                                    textTransform: 'uppercase',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                            >
                                ENTRAR
                            </Link>
                            <Link href="/cadastro" className="btn-3d" style={{
                                fontSize: '0.85rem',
                                padding: '8px 20px',
                                borderRadius: '12px',
                            }}>
                                COMEÇAR
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
