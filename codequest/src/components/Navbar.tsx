'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50" style={{
            background: 'rgba(10, 10, 15, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
        }}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-2xl font-black tracking-tight transition-all duration-300 hover:scale-105"
                    style={{
                        color: '#00d4ff',
                        textShadow: '0 0 10px rgba(0, 212, 255, 0.5), 0 0 30px rgba(0, 212, 255, 0.2)',
                    }}
                >
                    {'<'}Code<span style={{ color: '#a78bfa' }}>Quest</span>{' />'}
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-sm font-semibold transition-colors duration-200"
                                style={{ color: '#e2e8f0' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#e2e8f0')}
                            >
                                DASHBOARD
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-semibold transition-colors duration-200"
                                style={{ color: '#7a8ba7' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff4757')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#7a8ba7')}
                            >
                                SAIR
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/#como-funciona"
                                className="text-sm font-semibold transition-colors duration-200 hidden sm:block"
                                style={{ color: '#e2e8f0' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#e2e8f0')}
                            >
                                COMO FUNCIONA
                            </Link>
                            <Link
                                href="/login"
                                className="text-sm font-semibold transition-colors duration-200"
                                style={{ color: '#e2e8f0' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#e2e8f0')}
                            >
                                ENTRAR
                            </Link>
                            <Link href="/cadastro" className="btn-3d text-sm py-2 px-5 rounded-xl">
                                COMEÇAR
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
