'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { categorias } from '@/lib/quizzes';
import { saveQuizResult } from '@/lib/firestore';
import Link from 'next/link';
import { X, Code2, Zap, RefreshCw, ArrowLeft, CheckCircle2, XCircle, CircleDot, ChevronRight, Award, AlertCircle } from 'lucide-react';

export default function QuizPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const categoriaId = params.categoria as string;

    const categoria = categorias.find((c) => c.id === categoriaId);

    const [perguntaAtual, setPerguntaAtual] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
    const [acertos, setAcertos] = useState(0);
    const [respondida, setRespondida] = useState(false);
    const [finalizado, setFinalizado] = useState(false);
    const [xpGanho, setXpGanho] = useState(0);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleResposta = useCallback(
        (index: number) => {
            if (respondida || !categoria) return;
            setRespostaSelecionada(index);
            setRespondida(true);
            const pergunta = categoria.perguntas[perguntaAtual];
            if (index === pergunta.respostaCorreta) {
                setAcertos((prev) => prev + 1);
            }
        },
        [respondida, categoria, perguntaAtual]
    );

    const proximaPergunta = useCallback(async () => {
        if (!categoria || !user) return;
        if (perguntaAtual < categoria.perguntas.length - 1) {
            setPerguntaAtual((prev) => prev + 1);
            setRespostaSelecionada(null);
            setRespondida(false);
        } else {
            setSalvando(true);
            const totalAcertos = acertos;
            try {
                const xp = await saveQuizResult(user.uid, categoriaId, totalAcertos, categoria.perguntas.length);
                setXpGanho(xp);
            } catch (err) {
                console.error('Erro ao salvar resultado:', err);
            }
            setSalvando(false);
            setFinalizado(true);
        }
    }, [categoria, user, perguntaAtual, respostaSelecionada, acertos, categoriaId]);

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    border: '4px solid #00d4ff', borderTopColor: 'transparent',
                }} className="animate-spin" />
            </div>
        );
    }

    if (!categoria) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
                <div style={{ textAlign: 'center' }}>
                    <AlertCircle size={48} style={{ color: '#7a8ba7', marginBottom: '16px' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', color: '#e2e8f0' }}>Categoria não encontrada</h1>
                    <Link href="/dashboard" style={{ color: '#00d4ff', fontWeight: 600, textDecoration: 'none' }}>
                        Voltar ao dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Resultado final
    if (finalizado) {
        const pct = Math.round((acertos / categoria.perguntas.length) * 100);
        const ResultIcon = Award;
        const mensagem =
            pct >= 80 ? 'Incrível! Você domina esse assunto!'
                : pct >= 60 ? 'Muito bom! Continue praticando!'
                    : pct >= 40 ? 'Bom começo! Tente novamente para melhorar.'
                        : 'Continue estudando! A prática leva à perfeição.';

        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: '#0a0a0f' }}>
                <div className="animate-scale-in" style={{ maxWidth: '460px', width: '100%' }}>
                    <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                            <ResultIcon size={48} style={{ color: pct >= 60 ? '#10b981' : '#f59e0b' }} />
                        </div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 900, marginBottom: '8px', color: '#e2e8f0' }}>Quiz Finalizado!</h1>
                        <p style={{ color: '#7a8ba7', marginBottom: '24px' }}>{mensagem}</p>

                        <div style={{
                            borderRadius: '16px', padding: '24px', marginBottom: '24px',
                            background: 'rgba(0, 212, 255, 0.05)',
                            border: '1px solid rgba(0, 212, 255, 0.15)',
                        }}>
                            <div className="neon-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '4px' }}>
                                {acertos}/{categoria.perguntas.length}
                            </div>
                            <p style={{ fontSize: '14px', color: '#7a8ba7' }}>respostas corretas</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                            <Zap size={24} style={{ color: '#00d4ff' }} />
                            <span className="neon-text" style={{ fontSize: '1.5rem', fontWeight: 900 }}>+{xpGanho} XP</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link
                                href={`/quiz/${categoriaId}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPerguntaAtual(0);
                                    setRespostaSelecionada(null);
                                    setAcertos(0);
                                    setRespondida(false);
                                    setFinalizado(false);
                                    setXpGanho(0);
                                }}
                                className="btn-3d"
                                style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem', textAlign: 'center', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <RefreshCw size={16} /> JOGAR NOVAMENTE
                            </Link>
                            <Link
                                href="/dashboard"
                                style={{
                                    display: 'block', width: '100%', padding: '16px', borderRadius: '12px',
                                    fontSize: '1rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none',
                                    background: 'rgba(0, 212, 255, 0.08)', color: '#00d4ff',
                                    border: '1px solid rgba(0, 212, 255, 0.15)',
                                }}
                            >
                                VOLTAR AO DASHBOARD
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const pergunta = categoria.perguntas[perguntaAtual];
    const progresso = ((perguntaAtual) / categoria.perguntas.length) * 100;

    const getDifficultyStyle = () => {
        if (pergunta.dificuldade === 'facil') return { bg: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', border: 'rgba(0, 255, 136, 0.2)' };
        if (pergunta.dificuldade === 'medio') return { bg: 'rgba(255, 165, 2, 0.1)', color: '#ffa502', border: 'rgba(255, 165, 2, 0.2)' };
        return { bg: 'rgba(255, 71, 87, 0.1)', color: '#ff4757', border: 'rgba(255, 71, 87, 0.2)' };
    };

    const diff = getDifficultyStyle();

    return (
        <div style={{ minHeight: '100vh', padding: '24px 16px', background: '#0a0a0f' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Header */}
                <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <Link href="/dashboard" style={{ color: '#7a8ba7', fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <X size={16} /> Sair
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Code2 size={20} style={{ color: '#00d4ff' }} />
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#e2e8f0' }}>{categoria.nome}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#7a8ba7' }}>
                        {perguntaAtual + 1}/{categoria.perguntas.length}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-bg" style={{ height: '12px', marginBottom: '32px' }}>
                    <div className="progress-bar-fill" style={{ width: `${progresso}%` }} />
                </div>

                {/* Question Card */}
                <div className="card animate-fade-in-up" style={{ padding: '24px 32px', marginBottom: '24px' }}>
                    <span style={{
                        display: 'inline-block', fontSize: '12px', fontWeight: 700,
                        padding: '4px 12px', borderRadius: '8px', marginBottom: '16px',
                        background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`,
                    }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CircleDot size={12} />
                            {pergunta.dificuldade === 'facil' ? 'Fácil' : pergunta.dificuldade === 'medio' ? 'Médio' : 'Difícil'}
                        </span>
                    </span>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1.4, color: '#e2e8f0' }}>
                        {pergunta.pergunta}
                    </h2>
                </div>

                {/* Alternatives */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {pergunta.alternativas.map((alt, index) => {
                        const isCorrect = index === pergunta.respostaCorreta;
                        const isSelected = index === respostaSelecionada;

                        let bg = 'var(--color-card)';
                        let border = 'rgba(0, 212, 255, 0.1)';
                        let textColor = '#e2e8f0';
                        let shadow = 'none';
                        let badgeBg = 'var(--color-surface-lighter)';
                        let badgeColor = '#7a8ba7';
                        let opacity = 1;

                        if (respondida) {
                            if (isCorrect) {
                                bg = 'rgba(0, 255, 136, 0.08)'; border = 'rgba(0, 255, 136, 0.4)';
                                textColor = '#00ff88'; shadow = '0 0 15px rgba(0, 255, 136, 0.15)';
                                badgeBg = '#00ff88'; badgeColor = '#0a0a0f';
                            } else if (isSelected) {
                                bg = 'rgba(255, 71, 87, 0.08)'; border = 'rgba(255, 71, 87, 0.4)';
                                textColor = '#ff4757'; shadow = '0 0 15px rgba(255, 71, 87, 0.15)';
                                badgeBg = '#ff4757'; badgeColor = 'white';
                            } else {
                                opacity = 0.4;
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleResposta(index)}
                                disabled={respondida}
                                style={{
                                    width: '100%', textAlign: 'left', padding: '16px 20px',
                                    borderRadius: '12px', fontWeight: 600, fontSize: '1rem',
                                    transition: 'all 0.2s',
                                    background: bg, border: `1px solid ${border}`, color: textColor,
                                    boxShadow: shadow, opacity, cursor: respondida ? 'default' : 'pointer',
                                    fontFamily: 'inherit',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{
                                        width: '32px', height: '32px', borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '14px', fontWeight: 900, flexShrink: 0,
                                        background: badgeBg, color: badgeColor,
                                    }}>
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span>{alt}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Feedback + Next */}
                {respondida && (
                    <div className="animate-fade-in-up">
                        <div style={{
                            padding: '16px', borderRadius: '12px', marginBottom: '16px',
                            background: respostaSelecionada === pergunta.respostaCorreta ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 71, 87, 0.08)',
                            border: `1px solid ${respostaSelecionada === pergunta.respostaCorreta ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 71, 87, 0.3)'}`,
                            color: respostaSelecionada === pergunta.respostaCorreta ? '#00ff88' : '#ff4757',
                        }}>
                            <p style={{ fontWeight: 700 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    {respostaSelecionada === pergunta.respostaCorreta
                                        ? <><CheckCircle2 size={16} /> Correto! +10 XP</>
                                        : <><XCircle size={16} /> Errado! A resposta certa era: {pergunta.alternativas[pergunta.respostaCorreta]}</>}
                                </span>
                            </p>
                        </div>

                        <button
                            onClick={proximaPergunta}
                            disabled={salvando}
                            className="btn-3d"
                            style={{
                                width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem',
                                opacity: salvando ? 0.5 : 1,
                            }}
                        >
                            {salvando ? 'SALVANDO...' : perguntaAtual < categoria.perguntas.length - 1 ? <><ChevronRight size={16} style={{ marginRight: '4px' }} /> PRÓXIMA PERGUNTA</> : <><Award size={16} style={{ marginRight: '4px' }} /> VER RESULTADO</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
