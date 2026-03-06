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

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

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

                {/* Search Bar (center) - desktop only */}
                {showSearch && user && (
                    <div className="nav-search-bar" style={{
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
                    {/* Nav links for authenticated users - DESKTOP */}
                    {user && (
                        <div className="nav-desktop-links">
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
                        </div>
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
                            <span className="nav-desktop-links" style={{
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
                                className="nav-desktop-links"
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

                            <Link href="/perfil" className="btn-neon nav-desktop-links" style={{ fontSize: '0.8rem', padding: '8px 18px' }}>
                                <User size={15} />
                                MEU PERFIL
                            </Link>

                            {/* Mobile hamburger */}
                            <button
                                className="nav-mobile-toggle"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Menu"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="nav-desktop-links"
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

                            {/* Mobile hamburger for unauthenticated */}
                            <button
                                className="nav-mobile-toggle"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Menu"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="nav-mobile-menu">
                    {/* Mobile menu header with logo + close */}
                    <div className="nav-mobile-menu-header">
                        <Link
                            href={user ? '/' : '/'}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                fontSize: '1.35rem',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                textDecoration: 'none',
                                color: '#00d4ff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                            }}
                        >
                            {'<'}Code<span style={{ color: '#a78bfa' }}>Quest</span>{' />'}
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            aria-label="Fechar menu"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {/* Mobile search */}
                    {showSearch && user && (
                        <div className="nav-mobile-search" style={{ position: 'relative' }}>
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
                                        setMobileMenuOpen(false);
                                    }
                                }}
                                className="input-dark"
                                style={{
                                    paddingLeft: '36px',
                                    paddingRight: '12px',
                                    height: '44px',
                                    width: '100%',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                }}
                            />
                        </div>
                    )}

                    {user ? (
                        <>
                            <div style={{
                                padding: '12px 16px', marginBottom: '8px',
                                borderRadius: '12px', background: 'rgba(0, 212, 255, 0.04)',
                                border: '1px solid rgba(0, 212, 255, 0.08)',
                            }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logado como</p>
                                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#00d4ff' }}>{userName || 'jogador'}</p>
                            </div>

                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    fontSize: '0.95rem', fontWeight: 600,
                                    color: 'var(--text-primary)', textDecoration: 'none',
                                    padding: '14px 16px', borderRadius: '12px',
                                    transition: 'background 0.2s',
                                }}
                            >
                                <Home size={18} /> Home
                            </Link>
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    fontSize: '0.95rem', fontWeight: 600,
                                    color: 'var(--text-primary)', textDecoration: 'none',
                                    padding: '14px 16px', borderRadius: '12px',
                                    transition: 'background 0.2s',
                                }}
                            >
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            <Link
                                href="/perfil"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    fontSize: '0.95rem', fontWeight: 600,
                                    color: 'var(--text-primary)', textDecoration: 'none',
                                    padding: '14px 16px', borderRadius: '12px',
                                    transition: 'background 0.2s',
                                }}
                            >
                                <User size={18} /> Meu Perfil
                            </Link>

                            <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }} />

                            <button
                                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    fontSize: '0.95rem', fontWeight: 600,
                                    color: '#ef4444', background: 'none',
                                    border: 'none', cursor: 'pointer',
                                    padding: '14px 16px', borderRadius: '12px',
                                    fontFamily: 'inherit', width: '100%',
                                    transition: 'background 0.2s',
                                }}
                            >
                                <LogOut size={18} /> Sair
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    fontSize: '0.95rem', fontWeight: 600,
                                    color: 'var(--text-primary)', textDecoration: 'none',
                                    padding: '14px 16px', borderRadius: '12px',
                                }}
                            >
                                Entrar
                            </Link>
                            <Link
                                href="/cadastro"
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn-3d"
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.95rem', padding: '14px 16px', borderRadius: '12px',
                                    textDecoration: 'none',
                                }}
                            >
                                Comecar Agora
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
