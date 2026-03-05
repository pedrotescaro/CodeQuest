'use client';

import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { getUserData, UserData } from '@/lib/firestore';
import { categorias } from '@/lib/quizzes';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Code2, Search, ArrowLeft, Play } from 'lucide-react';
import { languageIconMap } from '@/components/LanguageIcons';

function BuscaContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [searchQuery, setSearchQuery] = useState(query);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            getUserData(user.uid).then((data) => {
                if (data) setUserData(data);
            });
        }
    }, [user, authLoading, router]);

    const filteredCategorias = categorias.filter((cat) =>
        cat.nome.toLowerCase().includes(query.toLowerCase()) ||
        cat.descricao.toLowerCase().includes(query.toLowerCase()) ||
        cat.id.toLowerCase().includes(query.toLowerCase())
    );

    if (authLoading) {
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

    return (
        <>
            <Navbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                showSearch={true}
            />
            <div style={{
                minHeight: '100vh', paddingTop: '80px', paddingBottom: '48px',
                paddingLeft: '24px', paddingRight: '24px', background: 'var(--background)',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    {/* Back link */}
                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none',
                            marginBottom: '32px', transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                        <ArrowLeft size={16} />
                        Voltar ao inicio
                    </Link>

                    {/* Header */}
                    <div className="animate-fade-in-up" style={{ marginBottom: '40px' }}>
                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800,
                            color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px',
                        }}>
                            Resultados para {'"'}
                            <span className="gradient-text">{query}</span>
                            {'"'}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Encontramos {filteredCategorias.length} {filteredCategorias.length === 1 ? 'desafio baseado' : 'desafios baseados'} na sua busca.
                        </p>
                    </div>

                    {/* Results */}
                    {filteredCategorias.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '20px',
                        }}>
                            {filteredCategorias.map((cat, i) => {
                                const completado = userData?.quizzesCompletos[cat.id];
                                const LangIcon = languageIconMap[cat.id];
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/quiz/${cat.id}`}
                                        className="card animate-fade-in-up"
                                        style={{
                                            padding: '0', textDecoration: 'none',
                                            overflow: 'hidden', cursor: 'pointer',
                                            animationDelay: `${i * 0.08}s`,
                                        }}
                                    >
                                        {/* Color banner */}
                                        <div style={{
                                            height: '100px',
                                            background: `linear-gradient(135deg, ${cat.cor}30, ${cat.cor}10)`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            position: 'relative',
                                        }}>
                                            <div style={{
                                                width: '56px', height: '56px', borderRadius: '14px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                backgroundColor: `${cat.cor}20`, border: `1px solid ${cat.cor}25`,
                                                overflow: 'hidden',
                                            }}>
                                                {LangIcon ? <LangIcon size={32} /> : <Code2 size={26} style={{ color: cat.cor }} />}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '20px' }}>
                                            <h3 style={{
                                                fontSize: '1.1rem', fontWeight: 700,
                                                color: 'var(--text-primary)', marginBottom: '6px',
                                            }}>
                                                {cat.nome}
                                            </h3>
                                            <p style={{
                                                fontSize: '0.85rem', color: 'var(--text-secondary)',
                                                marginBottom: '16px', lineHeight: 1.5,
                                            }}>
                                                {cat.descricao}
                                            </p>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{
                                                        fontSize: '0.75rem', padding: '3px 10px', borderRadius: '8px',
                                                        fontWeight: 600, background: 'var(--bg-surface-light)',
                                                        color: 'var(--text-muted)',
                                                    }}>
                                                        {cat.perguntas.length} perguntas
                                                    </span>
                                                    {completado && (
                                                        <span style={{
                                                            fontSize: '0.75rem', padding: '3px 10px', borderRadius: '8px',
                                                            fontWeight: 600, background: 'rgba(0, 212, 255, 0.08)',
                                                            color: '#00d4ff',
                                                        }}>
                                                            Melhor: {completado.melhorScore}/{cat.perguntas.length}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    fontSize: '0.8rem', fontWeight: 600, color: '#00d4ff',
                                                }}>
                                                    <Play size={14} fill="#00d4ff" />
                                                    Jogar
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center', padding: '80px 20px',
                            color: 'var(--text-muted)',
                        }}>
                            <Search size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                                Nenhum quiz encontrado
                            </p>
                            <p style={{ fontSize: '0.9rem' }}>
                                Tente buscar por outra linguagem ou categoria.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default function BuscaPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        border: '3px solid #00d4ff', borderTopColor: 'transparent',
                        margin: '0 auto 16px',
                    }} className="animate-spin" />
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Buscando...</p>
                </div>
            </div>
        }>
            <BuscaContent />
        </Suspense>
    );
}
