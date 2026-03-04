'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CatMascot from '@/components/CatMascot';

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
        <div style={{ minHeight: '100vh', display: 'flex', background: '#0a0a0f' }}>
            {/* Left – Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '48px 96px',
                background: 'var(--color-surface)',
            }}>
                <Link
                    href="/"
                    style={{
                        fontSize: '14px',
                        color: '#7a8ba7',
                        marginBottom: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                    }}
                >
                    ← Voltar ao início
                </Link>

                <div style={{ maxWidth: '420px', width: '100%' }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '8px', color: '#e2e8f0' }}>
                        Crie sua conta
                    </h1>
                    <p style={{ color: '#7a8ba7', marginBottom: '32px' }}>
                        Comece a ganhar XP e subir de nível agora mesmo.
                    </p>

                    {erro && (
                        <div style={{
                            background: 'rgba(255, 71, 87, 0.1)',
                            border: '1px solid rgba(255, 71, 87, 0.3)',
                            color: '#ff4757',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            marginBottom: '24px',
                            fontSize: '14px',
                            fontWeight: 500,
                        }}>
                            {erro}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#e2e8f0' }}>
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
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#e2e8f0' }}>
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
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#e2e8f0' }}>
                                Senha
                            </label>
                            <input
                                id="signup-password"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
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
                                padding: '16px',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                opacity: loading ? 0.5 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'CRIANDO...' : 'COMEÇAR AGORA'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', color: '#7a8ba7', marginTop: '32px', fontSize: '14px' }}>
                        Já tem uma conta?{' '}
                        <Link href="/login" style={{ color: '#00d4ff', fontWeight: 600, textDecoration: 'none' }}>
                            Entrar
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right – Dark Neon Panel */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(0, 212, 255, 0.08))',
            }}
                className="hidden lg:flex"
            >
                <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.08), transparent 70%)',
                }} />

                <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                        <div className="animate-float">
                            <CatMascot size={160} />
                        </div>
                    </div>
                    <h2 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '16px' }}>
                        Level up
                        <br />
                        seu código.
                    </h2>
                    <p style={{ fontSize: '1.1rem', maxWidth: '360px', color: '#7a8ba7' }}>
                        JavaScript, Python, SQL, React... Domine tudo com quizzes interativos e um sistema de progressão viciante.
                    </p>
                </div>
            </div>
        </div>
    );
}
