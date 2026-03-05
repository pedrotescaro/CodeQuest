'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserData } from '@/lib/firestore';
import { Sun, Moon, LogOut, User, Menu, X, Search, Home, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    showSearch?: boolean;
}

export default function Navbar({ searchQuery, onSearchChange, showSearch = false }: NavbarProps) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [navSearch, setNavSearch] = useState(searchQuery || '');

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
            transition: 'all 0.3s ease',
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
                    href={user ? '/' : '/'}
                    style={{
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        textDecoration: 'none',
                        color: '#00d4ff',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                    }}
                >
                    {'<'}Code<span style={{ color: '#a78bfa' }}>Quest</span>{' />'}
                </Link>

                {/* Search Bar (center) */}
                {showSearch && user && (
                    <div style={{
                        flex: '0 1 400px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <Search size={16} style={{
                            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                            color: 'var(--text-muted)', pointerEvents: 'none',
                        }} />
                        <input
                            type="text"
                            placeholder="Buscar quizzes..."
                            value={navSearch}
                            onChange={(e) => {
                                setNavSearch(e.target.value);
                                onSearchChange?.(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && navSearch.trim()) {
                                    router.push(`/busca?q=${encodeURIComponent(navSearch.trim())}`);
                                }
                            }}
                            className="input-dark"
                            style={{
                                paddingLeft: '36px',
                                paddingRight: '12px',
                                height: '38px',
                                width: '100%',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
                            }}
                        />
                    </div>
                )}

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Nav links for authenticated users */}
                    {user && (
                        <>
                            <Link
                                href="/"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '5px',
                                    fontSize: '0.8rem', fontWeight: 600,
                                    color: 'var(--text-secondary)', textDecoration: 'none',
                                    padding: '6px 12px', borderRadius: '8px',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#00d4ff';
                                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.06)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <Home size={15} />
                                Home
                            </Link>
                            <Link
                                href="/dashboard"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '5px',
                                    fontSize: '0.8rem', fontWeight: 600,
                                    color: 'var(--text-secondary)', textDecoration: 'none',
                                    padding: '6px 12px', borderRadius: '8px',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#00d4ff';
                                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.06)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <LayoutDashboard size={15} />
                                Dashboard
                            </Link>
                        </>
                    )}

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label="Alternar tema"
                    >
                        {theme === 'dark' ? (
                            <Moon size={18} strokeWidth={2} />
                        ) : (
                            <Sun size={18} strokeWidth={2} />
                        )}
                    </button>

                    {user ? (
                        <>
                            <span style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)',
                                fontWeight: 500,
                            }}>
                                Ola, <span style={{ color: '#00d4ff', fontWeight: 600 }}>
                                    {userName || 'jogador'}
                                </span>
                            </span>

                            <button
                                onClick={handleLogout}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    fontFamily: 'inherit',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#ef4444';
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.background = 'none';
                                }}
                            >
                                <LogOut size={15} />
                                SAIR
                            </button>

                            <Link href="/perfil" className="btn-neon" style={{ fontSize: '0.8rem', padding: '8px 18px' }}>
                                <User size={15} />
                                MEU PERFIL
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    textDecoration: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#00d4ff';
                                    e.currentTarget.style.background = 'var(--hover-bg)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                Entrar
                            </Link>
                            <Link href="/cadastro" className="btn-3d" style={{
                                fontSize: '0.85rem',
                                padding: '8px 20px',
                                borderRadius: '10px',
                            }}>
                                Comecar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
