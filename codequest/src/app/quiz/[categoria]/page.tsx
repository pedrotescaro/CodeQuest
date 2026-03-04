'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { categorias } from '@/lib/quizzes';
import type { Pergunta } from '@/lib/quizzes';
import { gerarPerguntasComIA } from '@/lib/gemini';
import { saveQuizResult } from '@/lib/firestore';
import Link from 'next/link';
import { X, Code2, Zap, RefreshCw, CheckCircle2, XCircle, CircleDot, ChevronRight, Award, AlertCircle, Sparkles } from 'lucide-react';
import { languageIconMap } from '@/components/LanguageIcons';

const loadingMessages = [
    'A IA está preparando suas perguntas...',
    'Gerando desafios personalizados...',
    'Formulando questões inteligentes...',
    'Quase lá, calibrando dificuldade...',
    'Criando um quiz único para você...',
];

export default function QuizPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const categoriaId = params.categoria as string;

    const categoria = categorias.find((c) => c.id === categoriaId);

    const LangIcon = languageIconMap[categoriaId];

    const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
    const [carregandoPerguntas, setCarregandoPerguntas] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState(loadingMessages[0]);
    const [perguntaAtual, setPerguntaAtual] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
    const [acertos, setAcertos] = useState(0);
    const [respondida, setRespondida] = useState(false);
    const [finalizado, setFinalizado] = useState(false);
    const [xpGanho, setXpGanho] = useState(0);
    const [salvando, setSalvando] = useState(false);

    // Rotate loading messages
    useEffect(() => {
        if (!carregandoPerguntas) return;
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % loadingMessages.length;
            setLoadingMsg(loadingMessages[i]);
        }, 2500);
        return () => clearInterval(interval);
    }, [carregandoPerguntas]);

    // Generate questions with AI
    const carregarPerguntas = useCallback(async () => {
        if (!categoria) return;
        setCarregandoPerguntas(true);
        setErroCarregamento(false);
        try {
            const perguntasIA = await gerarPerguntasComIA(categoria.nome, categoriaId, 10);
            setPerguntas(perguntasIA);
        } catch (err) {
            console.error('Erro ao gerar perguntas, usando fallback:', err);
            // Fallback to static questions
            setPerguntas(categoria.perguntas);
        }
        setCarregandoPerguntas(false);
    }, [categoria, categoriaId]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user && categoria) {
            carregarPerguntas();
        }
    }, [user, authLoading, router, categoria]);

    const handleResposta = useCallback(
        (index: number) => {
            if (respondida || perguntas.length === 0) return;
            setRespostaSelecionada(index);
            setRespondida(true);
            const pergunta = perguntas[perguntaAtual];
            if (index === pergunta.respostaCorreta) {
                setAcertos((prev) => prev + 1);
            }
        },
        [respondida, perguntas, perguntaAtual]
    );

    const proximaPergunta = useCallback(async () => {
        if (perguntas.length === 0 || !user) return;
        if (perguntaAtual < perguntas.length - 1) {
            setPerguntaAtual((prev) => prev + 1);
            setRespostaSelecionada(null);
            setRespondida(false);
        } else {
            setSalvando(true);
            const totalAcertos = acertos;
            try {
                const xp = await saveQuizResult(user.uid, categoriaId, totalAcertos, perguntas.length);
                setXpGanho(xp);
            } catch (err) {
                console.error('Erro ao salvar resultado:', err);
            }
            setSalvando(false);
            setFinalizado(true);
        }
    }, [perguntas, user, perguntaAtual, acertos, categoriaId]);

    const jogarNovamente = useCallback(() => {
        setPerguntaAtual(0);
        setRespostaSelecionada(null);
        setAcertos(0);
        setRespondida(false);
        setFinalizado(false);
        setXpGanho(0);
        setPerguntas([]);
        carregarPerguntas();
    }, [carregarPerguntas]);

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    border: '4px solid #00d4ff', borderTopColor: 'transparent',
                }} className="animate-spin" />
            </div>
        );
    }

    if (!categoria) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <div style={{ textAlign: 'center' }}>
                    <AlertCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-primary)' }}>Categoria não encontrada</h1>
                    <Link href="/dashboard" style={{ color: '#00d4ff', fontWeight: 600, textDecoration: 'none' }}>
                        Voltar ao dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Loading screen while AI generates questions
    if (carregandoPerguntas) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--background)', padding: '24px',
            }}>
                <div style={{ textAlign: 'center', maxWidth: '420px', width: '100%' }}>
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '24px', margin: '0 auto 32px',
                        background: `${categoria.cor}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: `radial-gradient(circle, ${categoria.cor}20, transparent 70%)`,
                            animation: 'pulse 2s ease-in-out infinite',
                        }} />
                        {LangIcon ? <LangIcon size={56} /> : <Code2 size={56} style={{ color: categoria.cor }} />}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Sparkles size={20} style={{ color: '#a78bfa' }} className="animate-spin" />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                Gerando Quiz com IA
                            </h2>
                            <Sparkles size={20} style={{ color: '#00d4ff' }} className="animate-spin" />
                        </div>
                        <p style={{
                            color: 'var(--text-secondary)', fontSize: '0.9rem',
                            minHeight: '24px', transition: 'opacity 0.3s ease',
                        }}>
                            {loadingMsg}
                        </p>
                    </div>

                    {/* Loading bar animation */}
                    <div style={{
                        width: '100%', height: '6px', borderRadius: '3px',
                        background: 'var(--bg-surface-lighter)', overflow: 'hidden',
                        marginBottom: '16px',
                    }}>
                        <div style={{
                            width: '40%', height: '100%', borderRadius: '3px',
                            background: 'linear-gradient(90deg, #00d4ff, #a78bfa, #00d4ff)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s ease-in-out infinite, loadingSlide 2s ease-in-out infinite',
                        }} />
                    </div>

                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Perguntas únicas geradas por inteligência artificial
                    </p>

                    <style>{`
                        @keyframes loadingSlide {
                            0% { transform: translateX(-100%); }
                            50% { transform: translateX(150%); }
                            100% { transform: translateX(-100%); }
                        }
                        @keyframes shimmer {
                            0% { background-position: 200% 0; }
                            100% { background-position: -200% 0; }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    // Resultado final
    if (finalizado) {
        const pct = Math.round((acertos / perguntas.length) * 100);
        const ResultIcon = Award;
        const mensagem =
            pct >= 80 ? 'Incrível! Você domina esse assunto!'
                : pct >= 60 ? 'Muito bom! Continue praticando!'
                    : pct >= 40 ? 'Bom começo! Tente novamente para melhorar.'
                        : 'Continue estudando! A prática leva à perfeição.';

        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'var(--background)' }}>
                <div className="animate-scale-in" style={{ maxWidth: '460px', width: '100%' }}>
                    <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                            <ResultIcon size={48} style={{ color: pct >= 60 ? '#10b981' : '#f59e0b' }} />
                        </div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-primary)' }}>Quiz Finalizado!</h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{mensagem}</p>

                        <div style={{
                            borderRadius: '16px', padding: '24px', marginBottom: '24px',
                            background: 'rgba(0, 212, 255, 0.05)',
                            border: '1px solid rgba(0, 212, 255, 0.15)',
                        }}>
                            <div className="neon-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '4px' }}>
                                {acertos}/{perguntas.length}
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>respostas corretas</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Zap size={24} style={{ color: '#00d4ff' }} />
                            <span className="neon-text" style={{ fontSize: '1.5rem', fontWeight: 900 }}>+{xpGanho} XP</span>
                        </div>

                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            fontSize: '0.75rem', color: '#a78bfa', marginBottom: '32px',
                            padding: '4px 12px', borderRadius: '8px',
                            background: 'rgba(167, 139, 250, 0.08)',
                        }}>
                            <Sparkles size={12} /> Perguntas geradas por IA
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={jogarNovamente}
                                className="btn-3d"
                                style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <RefreshCw size={16} /> JOGAR NOVAMENTE
                            </button>
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

    if (perguntas.length === 0) return null;

    const pergunta = perguntas[perguntaAtual];
    const progresso = ((perguntaAtual) / perguntas.length) * 100;

    const getDifficultyStyle = () => {
        if (pergunta.dificuldade === 'facil') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.25)' };
        if (pergunta.dificuldade === 'medio') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.25)' };
        return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.25)' };
    };

    const diff = getDifficultyStyle();

    return (
        <div style={{ minHeight: '100vh', padding: '24px 16px', background: 'var(--background)' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Header */}
                <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <Link href="/dashboard" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <X size={16} /> Sair
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {LangIcon ? (
                            <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LangIcon size={20} />
                            </div>
                        ) : (
                            <Code2 size={20} style={{ color: '#00d4ff' }} />
                        )}
                        <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{categoria.nome}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {perguntaAtual + 1}/{perguntas.length}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-bg" style={{ height: '12px', marginBottom: '32px' }}>
                    <div className="progress-bar-fill" style={{ width: `${progresso}%` }} />
                </div>

                {/* Question Card */}
                <div className="card animate-fade-in-up" style={{ padding: '24px 32px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{
                            display: 'inline-block', fontSize: '12px', fontWeight: 700,
                            padding: '4px 12px', borderRadius: '8px',
                            background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`,
                        }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <CircleDot size={12} />
                                {pergunta.dificuldade === 'facil' ? 'Fácil' : pergunta.dificuldade === 'medio' ? 'Médio' : 'Difícil'}
                            </span>
                        </span>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '8px',
                            background: 'rgba(167, 139, 250, 0.08)', color: '#a78bfa',
                        }}>
                            <Sparkles size={10} /> IA
                        </span>
                    </div>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1.4, color: 'var(--text-primary)' }}>
                        {pergunta.pergunta}
                    </h2>
                </div>

                {/* Alternatives */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {pergunta.alternativas.map((alt, index) => {
                        const isCorrect = index === pergunta.respostaCorreta;
                        const isSelected = index === respostaSelecionada;

                        let bg = 'var(--bg-card)';
                        let border = 'var(--card-border)';
                        let textColor = 'var(--text-primary)';
                        let shadow = 'none';
                        let badgeBg = 'var(--bg-surface-lighter)';
                        let badgeColor = 'var(--text-muted)';
                        let opacity = 1;

                        if (respondida) {
                            if (isCorrect) {
                                bg = 'rgba(16, 185, 129, 0.08)'; border = 'rgba(16, 185, 129, 0.4)';
                                textColor = '#10b981'; shadow = '0 0 15px rgba(16, 185, 129, 0.1)';
                                badgeBg = '#10b981'; badgeColor = '#ffffff';
                            } else if (isSelected) {
                                bg = 'rgba(239, 68, 68, 0.08)'; border = 'rgba(239, 68, 68, 0.4)';
                                textColor = '#ef4444'; shadow = '0 0 15px rgba(239, 68, 68, 0.1)';
                                badgeBg = '#ef4444'; badgeColor = 'white';
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
                            background: respostaSelecionada === pergunta.respostaCorreta ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                            border: `1px solid ${respostaSelecionada === pergunta.respostaCorreta ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            color: respostaSelecionada === pergunta.respostaCorreta ? '#10b981' : '#ef4444',
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
                            {salvando ? 'SALVANDO...' : perguntaAtual < perguntas.length - 1 ? <><ChevronRight size={16} style={{ marginRight: '4px' }} /> PRÓXIMA PERGUNTA</> : <><Award size={16} style={{ marginRight: '4px' }} /> VER RESULTADO</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
