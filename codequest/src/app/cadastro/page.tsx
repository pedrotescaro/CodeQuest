'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CatMascot from '@/components/CatMascot';
import { ArrowLeft, Rocket } from 'lucide-react';

export default function CadastroPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { signup, loginWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            await signup(nome, email, senha);
            router.push('/');
        } catch {
            setErro('Erro ao criar conta. Verifique os dados e tente novamente.');
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--background)' }}>
            {/* Left - Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '48px 72px',
                background: 'var(--bg-surface)',
            }}>
                <Link
                    href="/"
                    style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        marginBottom: '48px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        width: 'fit-content',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                    <ArrowLeft size={16} />
                    Voltar ao inicio
                </Link>

                <div style={{ maxWidth: '400px', width: '100%' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        Crie sua conta
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>
                        Comece a ganhar XP e subir de nivel agora mesmo.
                    </p>

                    {erro && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                            color: '#ef4444',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            marginBottom: '24px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                        }}>
                            {erro}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                                Nome
                            </label>
                            <input
                                id="signup-name"
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Seu nome de dev"
                                required
                                className="input-dark"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                                E-mail
                            </label>
                            <input
                                id="signup-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="voce@email.com"
                                required
                                className="input-dark"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                                Senha
                            </label>
                            <input
                                id="signup-password"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Minimo 6 caracteres"
                                required
                                className="input-dark"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-3d"
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '10px',
                                fontSize: '0.95rem',
                                opacity: loading ? 0.6 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Criando...' : 'Comecar Agora'}
                        </button>
                    </form>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        margin: '24px 0',
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>ou</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                    </div>

                    <button
                        onClick={async () => {
                            setErro('');
                            setGoogleLoading(true);
                            try {
                                await loginWithGoogle();
                                router.push('/');
                            } catch {
                                setErro('Erro ao entrar com Google. Tente novamente.');
                            }
                            setGoogleLoading(false);
                        }}
                        disabled={googleLoading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '10px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            cursor: googleLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'all 0.2s ease',
                            opacity: googleLoading ? 0.6 : 1,
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                            e.currentTarget.style.background = 'var(--hover-bg)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.background = 'var(--bg-card)';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        {googleLoading ? 'Entrando...' : 'Cadastrar com Google'}
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '32px', fontSize: '0.85rem' }}>
                        Ja tem uma conta?{' '}
                        <Link href="/login" style={{ color: '#00d4ff', fontWeight: 600, textDecoration: 'none' }}>
                            Entrar
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right - Decorative Panel */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.03), rgba(0, 212, 255, 0.05))',
            }}
                className="hidden lg:flex"
            >
                <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.04), transparent 70%)',
                }} />

                <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                        <div className="animate-float">
                            <CatMascot size={160} />
                        </div>
                    </div>
                    <h2 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
                        Level up
                        <br />
                        seu codigo.
                    </h2>
                    <p style={{ fontSize: '1rem', maxWidth: '340px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        JavaScript, Python, SQL, React... Domine tudo com quizzes interativos e um sistema de progressao viciante.
                    </p>
                </div>
            </div>
        </div>
    );
}
