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
    const { signup } = useAuth();
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
            router.push('/dashboard');
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
