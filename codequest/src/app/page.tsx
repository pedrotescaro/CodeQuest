'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useRef, useCallback } from 'react';
import { getUserData, getXpParaProximoNivel, UserData } from '@/lib/firestore';
import { categorias } from '@/lib/quizzes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Trophy, Flame, Zap, BookOpen, Play, ArrowRight,
  Code2, Terminal, ChevronRight, ChevronLeft, Target,
  TrendingUp, Sparkles, Shield, Gamepad2,
  Search,
} from 'lucide-react';
import { languageIconMap } from '@/components/LanguageIcons';

const codeSymbols = ['{ }', '</ >', 'const', '( )', '=>', '[ ]', '===', '&&', '||', '!=', 'if', '++', 'fn', '0x', '/**/', '#!'];

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (user) {
      getUserData(user.uid).then((data) => {
        if (data) setUserData(data);
      });
    }
  }, [user]);

  const dailyChallenge = categorias[Math.floor(Date.now() / 86400000) % categorias.length];

  // ===========================
  // AUTHENTICATED HOME
  // ===========================
  const [searchQuery, setSearchQuery] = useState('');

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollAmount = 240;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let autoScrollInterval: NodeJS.Timeout;
    let isPaused = false;

    const startAutoScroll = () => {
      autoScrollInterval = setInterval(() => {
        if (isPaused) return;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 5) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: 220, behavior: 'smooth' });
        }
      }, 3000);
    };

    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons();
    startAutoScroll();

    return () => {
      clearInterval(autoScrollInterval);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('scroll', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const terminalLines = [
    { text: '> codequest.init()', color: '#00d4ff' },
    { text: '✓ Loading quiz engine...', color: '#10b981' },
    { text: '✓ AI question generator ready', color: '#10b981' },
    { text: '✓ 18+ programming languages loaded', color: '#10b981' },
    { text: '> player.start({ mode: "learn" })', color: '#a78bfa' },
    { text: '🚀 Ready to code!', color: '#f59e0b' },
  ];

  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (authLoading || user) return;
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= terminalLines.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(timer);
  }, [authLoading, user]);

  if (!authLoading && user && userData) {
    const xpProgress = getXpParaProximoNivel(userData.xp);
    const progressPercent = (xpProgress.atual / xpProgress.necessario) * 100;
    const quizzesCompletos = Object.keys(userData.quizzesCompletos).length;
    const filteredCategorias = categorias.filter((cat) =>
      cat.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <>
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} showSearch={true} />
        <div style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--background)' }}>
          {/* Hero Banner - Bookadex-inspired with gradient and rounded bottom */}
          <section className="hero-section" style={{
            background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #a78bfa 100%)',
            borderRadius: '0 0 32px 32px',
            padding: 'clamp(24px, 5vw, 56px) clamp(12px, 3vw, 24px) clamp(24px, 5vw, 48px)',
            position: 'relative',
            overflow: 'visible',
          }}>
            {/* Background decorative elements */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <div style={{
                position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px',
                borderRadius: '50%', filter: 'blur(120px)',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12), transparent 70%)',
              }} />
              <div style={{
                position: 'absolute', bottom: '-100px', left: '-100px', width: '350px', height: '350px',
                borderRadius: '50%', filter: 'blur(120px)',
                background: 'radial-gradient(circle, rgba(0, 0, 0, 0.1), transparent 70%)',
              }} />
            </div>

            <div style={{
              maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10,
              display: 'flex', alignItems: 'center', gap: 'clamp(20px, 4vw, 40px)',
              flexWrap: 'wrap',
            }} className="hero-flex">
              {/* Left: Greeting + XP Progress */}
              <div className="animate-fade-in-up hero-left" style={{ flex: '1 1 300px' }}>
                <h1 style={{
                  fontSize: 'clamp(1.25rem, 4vw, 2.8rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: '12px',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  wordBreak: 'break-word' as const,
                  overflowWrap: 'break-word' as const,
                }}>
                  Pronto para jogar,{' '}
                  <span style={{ color: '#fbbf24' }}>{userData.nome}</span>?
                </h1>
                <p style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px', lineHeight: 1.6 }}>
                  Continue sua jornada de programacao e ganhe recompensas.
                </p>

                {/* XP Progress Card - Bookadex-style glass card */}
                <div className="xp-card" style={{
                  background: 'rgba(255, 255, 255, 0.10)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                }}>
                  {/* Top row: level info left, streak right */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                    marginBottom: '16px',
                  }}>
                    {/* Left: Level + XP */}
                    <div>
                      <p style={{
                        fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px',
                      }}>
                        <Trophy size={16} style={{ color: '#00d4ff' }} />
                        Nível {userData.nivel}
                      </p>
                      <p style={{
                        fontWeight: 900, fontSize: '1.5rem', color: '#ffffff',
                        display: 'flex', alignItems: 'center', gap: '8px', lineHeight: 1,
                      }}>
                        {xpProgress.atual}
                        <span style={{ fontSize: '1rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)' }}>
                          / {xpProgress.necessario} XP
                        </span>
                      </p>
                    </div>
                    {/* Right: Streak */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Flame size={24} style={{ color: userData.ofensiva > 0 ? '#00d4ff' : 'rgba(255,255,255,0.4)' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px', color: '#ffffff' }}>
                        {userData.ofensiva} {userData.ofensiva === 1 ? 'dia' : 'dias'}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{
                    width: '100%', background: 'rgba(0, 0, 0, 0.20)',
                    borderRadius: '999px', height: '12px', overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${progressPercent}%`, height: '12px', borderRadius: '999px',
                      background: 'linear-gradient(90deg, #00d4ff, #a78bfa)',
                      transition: 'width 1s ease-out',
                    }} />
                  </div>
                </div>
              </div>

              {/* Right: Daily Challenge Card - dark card */}
              <div className="animate-fade-in-up daily-card hero-right" style={{
                flex: '0 1 340px',
                minWidth: 0,
                background: 'var(--bg-card)',
                border: '2px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: 'clamp(16px, 4vw, 32px)',
                animationDelay: '0.15s',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 14px',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#f59e0b',
                  marginBottom: '16px',
                }}>
                  <Target size={12} />
                  Desafio do Dia
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                  letterSpacing: '-0.01em',
                }}>
                  {dailyChallenge.nome}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '24px',
                  lineHeight: 1.6,
                }}>
                  {dailyChallenge.descricao}. Prove seus conhecimentos e ganhe XP em dobro hoje.
                </p>
                <Link
                  href={`/quiz/${dailyChallenge.id}`}
                  className="btn-3d"
                  style={{
                    padding: '14px 28px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    width: '100%',
                    textDecoration: 'none',
                  }}
                >
                  <Play size={16} fill="white" />
                  Jogar Quiz
                </Link>
              </div>
            </div>
          </section>

          {/* Quiz Categories - Improved Carousel */}
          <section className="carousel-section" style={{
            padding: 'clamp(20px, 5vw, 56px) clamp(8px, 3vw, 24px)',
            background: 'var(--bg-card)',
            border: '1px solid var(--card-border)',
            borderRadius: '24px',
            margin: '24px clamp(8px, 2vw, 16px) 0',
            position: 'relative',
          }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              {/* Section header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px',
              }}>
                <h2 style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                  color: 'var(--text-primary)',
                }}>
                  Destaques da Semana
                </h2>
              </div>

              <div style={{ position: 'relative' }}>
                {/* Floating arrow LEFT */}
                <button
                  onClick={() => scrollCarousel('left')}
                  aria-label="Anterior"
                  className={`carousel-arrow-btn ${canScrollLeft ? 'carousel-arrow-active' : ''}`}
                  style={{
                    position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)',
                    zIndex: 10,
                    width: '48px', height: '48px', borderRadius: '50%',
                    border: '2px solid',
                    borderColor: canScrollLeft ? 'rgba(0, 212, 255, 0.4)' : 'var(--border-color)',
                    background: canScrollLeft ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(124, 58, 237, 0.10))' : 'var(--bg-surface)',
                    color: canScrollLeft ? '#00d4ff' : 'var(--text-muted)',
                    cursor: canScrollLeft ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    opacity: canScrollLeft ? 1 : 0.3,
                    boxShadow: canScrollLeft ? '0 4px 20px rgba(0, 212, 255, 0.2), 0 0 40px rgba(0, 212, 255, 0.05)' : 'none',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={(e) => {
                    if (canScrollLeft) {
                      e.currentTarget.style.borderColor = '#00d4ff';
                      e.currentTarget.style.boxShadow = '0 6px 28px rgba(0, 212, 255, 0.35), 0 0 60px rgba(0, 212, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = canScrollLeft ? 'rgba(0, 212, 255, 0.4)' : 'var(--border-color)';
                    e.currentTarget.style.boxShadow = canScrollLeft ? '0 4px 20px rgba(0, 212, 255, 0.2), 0 0 40px rgba(0, 212, 255, 0.05)' : 'none';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  <ChevronLeft size={24} strokeWidth={2.5} />
                </button>

                {/* Floating arrow RIGHT */}
                <button
                  onClick={() => scrollCarousel('right')}
                  aria-label="Próximo"
                  className={`carousel-arrow-btn ${canScrollRight ? 'carousel-arrow-active' : ''}`}
                  style={{
                    position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)',
                    zIndex: 10,
                    width: '48px', height: '48px', borderRadius: '50%',
                    border: '2px solid',
                    borderColor: canScrollRight ? 'rgba(0, 212, 255, 0.4)' : 'var(--border-color)',
                    background: canScrollRight ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(124, 58, 237, 0.10))' : 'var(--bg-surface)',
                    color: canScrollRight ? '#00d4ff' : 'var(--text-muted)',
                    cursor: canScrollRight ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    opacity: canScrollRight ? 1 : 0.3,
                    boxShadow: canScrollRight ? '0 4px 20px rgba(0, 212, 255, 0.2), 0 0 40px rgba(0, 212, 255, 0.05)' : 'none',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={(e) => {
                    if (canScrollRight) {
                      e.currentTarget.style.borderColor = '#00d4ff';
                      e.currentTarget.style.boxShadow = '0 6px 28px rgba(0, 212, 255, 0.35), 0 0 60px rgba(0, 212, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = canScrollRight ? 'rgba(0, 212, 255, 0.4)' : 'var(--border-color)';
                    e.currentTarget.style.boxShadow = canScrollRight ? '0 4px 20px rgba(0, 212, 255, 0.2), 0 0 40px rgba(0, 212, 255, 0.05)' : 'none';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  <ChevronRight size={24} strokeWidth={2.5} />
                </button>

                {/* Fade edges */}
                {canScrollLeft && (
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '50px',
                    background: 'linear-gradient(to right, var(--bg-card), transparent)',
                    zIndex: 3, pointerEvents: 'none', borderRadius: '12px 0 0 12px',
                  }} />
                )}
                {canScrollRight && (
                  <div style={{
                    position: 'absolute', right: 0, top: 0, bottom: 0, width: '50px',
                    background: 'linear-gradient(to left, var(--bg-card), transparent)',
                    zIndex: 3, pointerEvents: 'none', borderRadius: '0 12px 12px 0',
                  }} />
                )}

                <div ref={carouselRef} className="horizontal-scroll" style={{ gap: '20px', paddingBottom: '12px', paddingLeft: '28px', paddingRight: '28px' }}>
                  {filteredCategorias.map((cat, i) => {
                  const completado = userData.quizzesCompletos[cat.id];
                  const LangIcon = languageIconMap[cat.id];
                  return (
                    <Link
                      key={cat.id}
                      href={`/quiz/${cat.id}`}
                      className="animate-fade-in-up carousel-card"
                      style={{
                        width: '200px',
                        minHeight: '280px',
                        background: `linear-gradient(160deg, ${cat.cor}18, var(--bg-card) 40%)`,
                        border: '1px solid var(--card-border)',
                        borderRadius: '18px',
                        padding: '0',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        animationDelay: `${i * 0.06}s`,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        position: 'relative' as const,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                        e.currentTarget.style.borderColor = `${cat.cor}40`;
                        e.currentTarget.style.boxShadow = `0 16px 40px rgba(0, 0, 0, 0.2), 0 0 20px ${cat.cor}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.borderColor = 'var(--card-border)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Top color band / "cover" area */}
                      <div className="carousel-card-cover" style={{
                        height: '140px',
                        background: `linear-gradient(135deg, ${cat.cor}25, ${cat.cor}08)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        borderBottom: `1px solid ${cat.cor}15`,
                      }}>
                        <div style={{
                          position: 'absolute', inset: 0, opacity: 0.05,
                          backgroundImage: `radial-gradient(circle at 30% 40%, ${cat.cor}, transparent 50%), radial-gradient(circle at 70% 60%, ${cat.cor}, transparent 50%)`,
                        }} />
                        <div className="carousel-card-icon" style={{
                          width: '64px', height: '64px', borderRadius: '16px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: `${cat.cor}20`,
                          border: `1px solid ${cat.cor}25`,
                          overflow: 'hidden',
                        }}>
                          {LangIcon ? <LangIcon size={36} /> : <Code2 size={30} style={{ color: cat.cor }} />}
                        </div>
                      </div>

                      {/* Content area */}
                      <div style={{ padding: '16px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{
                          fontSize: '1rem', fontWeight: 700,
                          color: 'var(--text-primary)', marginBottom: '4px',
                        }}>
                          {cat.nome}
                        </h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.4 }}>
                          {cat.perguntas.length} perguntas
                        </p>
                        <div style={{ marginTop: 'auto' }}>
                          {completado ? (
                            <span style={{
                              fontSize: '0.72rem', padding: '4px 10px', borderRadius: '8px', fontWeight: 600,
                              background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff',
                              display: 'inline-block',
                            }}>
                              Melhor: {completado.melhorScore}/{cat.perguntas.length}
                            </span>
                          ) : (
                            <span style={{
                              fontSize: '0.72rem', padding: '4px 10px', borderRadius: '8px', fontWeight: 600,
                              background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                              display: 'inline-block',
                            }}>
                              Novo!
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              </div>
              {filteredCategorias.length === 0 && (
                <div style={{
                  textAlign: 'center', padding: '40px 20px',
                  color: 'var(--text-muted)', fontSize: '0.9rem',
                }}>
                  <Search size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
                  <p>Nenhum quiz encontrado para &ldquo;{searchQuery}&rdquo;</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Stats */}
          <section className="stats-grid-wrapper" style={{ padding: 'clamp(24px, 5vw, 40px) clamp(8px, 3vw, 24px) clamp(32px, 5vw, 48px)' }}>
            <div className="stats-grid" style={{
              maxWidth: '1280px', margin: '0 auto',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px',
            }}>
              <div className="stat-card animate-fade-in-up">
                <div className="stat-card-icon" style={{ background: 'rgba(0, 212, 255, 0.08)' }}>
                  <Zap size={20} style={{ color: '#00d4ff' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>XP Total</p>
                  <p className="neon-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{userData.xp}</p>
                </div>
              </div>
              <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.08)' }}>
                  <Trophy size={20} style={{ color: '#f59e0b' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nivel Atual</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{userData.nivel}</p>
                </div>
              </div>
              <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="stat-card-icon" style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
                  <Flame size={20} style={{ color: '#ef4444' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ofensiva</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>
                    {userData.ofensiva} {userData.ofensiva === 1 ? 'dia' : 'dias'}
                  </p>
                </div>
              </div>
              <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                  <BookOpen size={20} style={{ color: '#10b981' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quizzes Feitos</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{quizzesCompletos}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  // ===========================
  // LANDING PAGE (not logged in)
  // ===========================

  const matrixChars = ['0', '1', '{', '}', '<', '>', '/', '=', ';', '(', ')', '[', ']', '#', '*', '+', '&', '|', '!', '?', '@', '$', '%', '^'];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="landing-hero" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Matrix rain background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`matrix-${i}`}
              style={{
                position: 'absolute',
                left: `${(i * 3.33) % 100}%`,
                top: 0,
                fontSize: `${10 + (i % 3) * 2}px`,
                fontFamily: 'monospace',
                color: i % 3 === 0 ? 'rgba(0, 212, 255, 0.06)' : i % 3 === 1 ? 'rgba(124, 58, 237, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                animation: `matrixRain ${12 + (i * 2) % 15}s linear infinite`,
                animationDelay: `${(i * 0.7) % 8}s`,
                whiteSpace: 'nowrap',
                userSelect: 'none',
                lineHeight: 1.8,
                letterSpacing: '4px',
                writingMode: 'vertical-rl',
              }}
            >
              {Array.from({ length: 30 }).map((_, j) => matrixChars[(i + j) % matrixChars.length]).join(' ')}
            </div>
          ))}
        </div>

        {/* Background gradient orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '-200px', right: '-100px', width: '600px', height: '600px',
            borderRadius: '50%', filter: 'blur(180px)',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.12), transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-200px', left: '-100px', width: '600px', height: '600px',
            borderRadius: '50%', filter: 'blur(180px)',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12), transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', top: '40%', left: '20%', width: '300px', height: '300px',
            borderRadius: '50%', filter: 'blur(120px)',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06), transparent 70%)',
            animation: 'neuralPulse 6s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', top: '20%', right: '20%', width: '250px', height: '250px',
            borderRadius: '50%', filter: 'blur(100px)',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.05), transparent 70%)',
            animation: 'neuralPulse 8s ease-in-out infinite',
            animationDelay: '3s',
          }} />
        </div>

        {/* Scan line effect */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.08), transparent)',
          animation: 'scanLine 8s linear infinite',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Code particles */}
        <div className="code-particles">
          {codeSymbols.map((symbol, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 6.25) % 100}%`,
                animationDuration: `${15 + (i * 3) % 20}s`,
                animationDelay: `${(i * 1.7) % 10}s`,
                fontSize: `${12 + (i % 4) * 4}px`,
              }}
            >
              {symbol}
            </span>
          ))}
        </div>

        <div style={{
          maxWidth: '1280px', margin: '0 auto', display: 'flex',
          alignItems: 'center', gap: '48px', position: 'relative', zIndex: 10,
          flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
        }} className="landing-hero-flex">
          {/* Text */}
          <div className="animate-fade-in-up landing-text" style={{
            flex: '1 1 420px', textAlign: 'left',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              fontSize: '12px', fontWeight: 600, marginBottom: '28px',
              background: 'rgba(0, 212, 255, 0.06)', border: '1px solid rgba(0, 212, 255, 0.12)',
              color: '#00d4ff',
            }}>
              <Sparkles size={14} />
              Quizzes com IA Generativa
            </div>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800,
              lineHeight: 1.08, marginBottom: '24px', color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
            }}>
              Aprenda a programar{' '}
              <span className="gradient-text-neon">com inteligencia artificial.</span>
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', marginBottom: '36px',
              color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.7,
            }}>
              Perguntas geradas por IA, adaptadas ao seu nivel.
              Complete quizzes, ganhe XP, suba de nivel e domine qualquer linguagem.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/cadastro" className="btn-3d" style={{
                fontSize: '1rem', padding: '16px 36px', borderRadius: '14px',
              }}>
                <Code2 size={18} />
                Comecar Agora
                <ArrowRight size={18} />
              </Link>
              <Link href="/#como-funciona" style={{
                fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 4px', borderRadius: '8px',
                transition: 'color 0.2s ease',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                Como funciona
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex', gap: '32px', marginTop: '48px', flexWrap: 'wrap',
            }}>
              {[
                { value: '18+', label: 'Linguagens' },
                { value: 'IA', label: 'Perguntas unicas' },
                { value: '100%', label: 'Gratuito' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'left' }}>
                  <p className="neon-text" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '2px' }}>{s.value}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal / Code illustration */}
          <div className="animate-fade-in landing-illustration" style={{
            flex: '1 1 400px', display: 'flex', justifyContent: 'center', maxWidth: '500px',
          }}>
            <div style={{ position: 'relative', width: '100%' }}>
              {/* Main terminal */}
              <div className="landing-code-terminal animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="terminal-header">
                  <div className="terminal-dot" style={{ background: '#ef4444' }} />
                  <div className="terminal-dot" style={{ background: '#f59e0b' }} />
                  <div className="terminal-dot" style={{ background: '#10b981' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px', fontFamily: 'monospace' }}>codequest.ts</span>
                </div>
                <pre>
                  {terminalLines.slice(0, visibleLines).map((line, i) => (
                    <div key={i} className="animate-fade-in" style={{
                      color: line.color,
                      animationDelay: `${i * 0.1}s`,
                    }}>
                      {line.text}
                    </div>
                  ))}
                  {visibleLines < terminalLines.length && (
                    <span style={{
                      display: 'inline-block',
                      width: '8px', height: '16px',
                      background: '#00d4ff',
                      animation: 'typewriter-blink 1s step-end infinite',
                      verticalAlign: 'middle',
                    }} />
                  )}
                </pre>
              </div>

              {/* Clean status bar under terminal */}
              <div className="landing-terminal-status" style={{
                display: 'flex', gap: '16px', marginTop: '16px',
                justifyContent: 'center', flexWrap: 'wrap',
              }}>
                {[
                  { icon: <Zap size={12} />, text: '+10 XP', color: '#10b981' },
                  { icon: <Sparkles size={12} />, text: 'IA Ativa', color: '#a78bfa' },
                  { icon: <Flame size={12} />, text: '7 dias', color: '#f59e0b' },
                ].map((badge, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '12px', fontWeight: 600, color: badge.color,
                    opacity: 0.8,
                  }}>
                    {badge.icon}
                    {badge.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona - Steps Section */}
      <section id="como-funciona" style={{ padding: '100px 24px', position: 'relative' }}>
        {/* Neural network background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.03 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={`node-${i}`}
                cx={`${15 + (i * 12) % 85}%`}
                cy={`${20 + (i * 17) % 60}%`}
                r="3"
                fill="#00d4ff"
              >
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${3 + i}s`} repeatCount="indefinite" />
              </circle>
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`line-${i}`}
                x1={`${15 + (i * 12) % 85}%`}
                y1={`${20 + (i * 17) % 60}%`}
                x2={`${15 + ((i + 2) * 12) % 85}%`}
                y2={`${20 + ((i + 2) * 17) % 60}%`}
                stroke="#00d4ff"
                strokeWidth="0.5"
              >
                <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${4 + i}s`} repeatCount="indefinite" />
              </line>
            ))}
          </svg>
        </div>

        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              fontSize: '12px', fontWeight: 600, marginBottom: '20px',
              background: 'rgba(124, 58, 237, 0.06)', border: '1px solid rgba(124, 58, 237, 0.12)',
              color: '#a78bfa',
            }}>
              <Terminal size={14} />
              Como funciona
            </div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800,
              lineHeight: 1.15, marginBottom: '16px', color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>
              A mecanica e simples.{' '}
              <span className="gradient-text">O aprendizado e real.</span>
            </h2>
            <p style={{
              fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7,
              maxWidth: '600px', margin: '0 auto',
            }}>
              Em tres passos, voce transforma seus estudos de programacao em uma
              jornada interativa com inteligencia artificial.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="landing-steps-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                step: '01',
                icon: <Code2 size={24} style={{ color: '#00d4ff' }} />,
                title: 'Escolha um Quiz',
                desc: 'Selecione entre JavaScript, Python, SQL, React e mais 14 linguagens e tecnologias.',
                accent: '#00d4ff',
                code: 'quiz.select("python")',
              },
              {
                step: '02',
                icon: <Sparkles size={24} style={{ color: '#a78bfa' }} />,
                title: 'IA Gera as Perguntas',
                desc: 'Cada sessao traz perguntas unicas geradas por inteligencia artificial, adaptadas ao tema.',
                accent: '#a78bfa',
                code: 'ai.generate({ unique: true })',
              },
              {
                step: '03',
                icon: <TrendingUp size={24} style={{ color: '#f59e0b' }} />,
                title: 'Ganhe XP e Suba de Nivel',
                desc: 'Acumule pontos, mantenha sua ofensiva diaria e desbloqueie recompensas na loja.',
                accent: '#f59e0b',
                code: 'player.levelUp()',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="card landing-feature-card animate-fade-in-up"
                style={{
                  padding: '36px 28px',
                  animationDelay: `${i * 0.12}s`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Step number watermark */}
                <div style={{
                  position: 'absolute', top: '12px', right: '20px',
                  fontSize: '4rem', fontWeight: 900, lineHeight: 1,
                  color: item.accent, opacity: 0.06,
                  fontFamily: 'monospace',
                }}>
                  {item.step}
                </div>

                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${item.accent}12`, marginBottom: '20px',
                  border: `1px solid ${item.accent}18`,
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px',
                  color: 'var(--text-primary)',
                }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '16px' }}>
                  {item.desc}
                </p>
                <code style={{
                  fontSize: '0.75rem', fontFamily: 'monospace', padding: '4px 10px',
                  background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.08)',
                  borderRadius: '6px', color: item.accent,
                }}>
                  {item.code}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section style={{ padding: '40px 24px 100px', position: 'relative' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              fontSize: '12px', fontWeight: 600, marginBottom: '20px',
              background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.12)',
              color: '#10b981',
            }}>
              <Sparkles size={14} />
              Inteligencia Artificial
            </div>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 800,
              color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '12px',
            }}>
              Powered by <span className="neon-text">Gemini AI</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
              Cada quiz e uma experiencia nova. A IA gera perguntas ineditas, com diferentes dificuldades e topicos.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {[
              { icon: <Sparkles size={22} style={{ color: '#00d4ff' }} />, title: 'Perguntas Unicas', desc: 'Nunca repete. Cada sessao gera questoes completamente novas com IA.', accent: '#00d4ff' },
              { icon: <Target size={22} style={{ color: '#a78bfa' }} />, title: 'Niveis Adaptados', desc: 'Facil, medio e dificil — distribuidos de forma inteligente em cada quiz.', accent: '#a78bfa' },
              { icon: <Shield size={22} style={{ color: '#10b981' }} />, title: 'Fallback Seguro', desc: 'Se a IA estiver indisponivel, o quiz funciona com perguntas estaticas curadas.', accent: '#10b981' },
              { icon: <Gamepad2 size={22} style={{ color: '#f59e0b' }} />, title: 'Minigames Extras', desc: 'DevTermo e CodeRush — minigames de programacao para ganhar moedas.', accent: '#f59e0b' },
            ].map((feat, i) => (
              <div key={i} className="card landing-feature-card animate-fade-in-up" style={{
                padding: '28px 24px', animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${feat.accent}10`, marginBottom: '16px',
                  border: `1px solid ${feat.accent}15`,
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Showcase */}
      <section className="langs-showcase-section" style={{ padding: '60px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background blurs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-120px', left: '10%', width: '400px', height: '400px',
            borderRadius: '50%', filter: 'blur(140px)', opacity: 0.08,
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-100px', right: '10%', width: '350px', height: '350px',
            borderRadius: '50%', filter: 'blur(140px)', opacity: 0.06,
            background: 'linear-gradient(135deg, #7c3aed, #f59e0b)',
          }} />
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px', marginBottom: '16px',
              background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.15)',
              fontSize: '0.8rem', fontWeight: 600, color: '#00d4ff',
            }}>
              <Code2 size={14} />
              {categorias.length} linguagens e tecnologias
            </div>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 800,
              color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '14px',
              lineHeight: 1.2,
            }}>
              Quizzes para todas as{' '}
              <span className="gradient-text">linguagens</span>
            </h2>
            <p style={{
              fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', color: 'var(--text-secondary)',
              lineHeight: 1.7, maxWidth: '560px', margin: '0 auto',
            }}>
              De JavaScript a Flutter, de Git a C++ — escolha sua trilha favorita e 
              domine cada tecnologia com quizzes gerados por IA.
            </p>
          </div>

          {/* Languages grid - all languages */}
          <div className="landing-langs-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '16px',
          }}>
            {categorias.map((cat, i) => {
              const LangIcon = languageIconMap[cat.id];
              return (
                <Link
                  key={cat.id}
                  href="/cadastro"
                  className="lang-card animate-fade-in-up"
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: '14px', padding: '18px 16px',
                    borderRadius: '16px', textDecoration: 'none',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--card-border)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDelay: `${i * 0.04}s`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.borderColor = `${cat.cor}50`;
                    e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.12), 0 0 30px ${cat.cor}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = 'var(--card-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Color accent line at top */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: `linear-gradient(90deg, ${cat.cor}, ${cat.cor}60)`,
                    opacity: 0.7, borderRadius: '16px 16px 0 0',
                  }} />
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${cat.cor}15`, overflow: 'hidden',
                  }}>
                    {LangIcon ? <LangIcon size={26} /> : <Code2 size={20} style={{ color: cat.cor }} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span style={{
                      fontSize: '0.9rem', fontWeight: 700,
                      color: 'var(--text-primary)', display: 'block',
                      marginBottom: '2px',
                    }}>
                      {cat.nome}
                    </span>
                    <span style={{
                      fontSize: '0.72rem', color: 'var(--text-muted)',
                      display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden', lineHeight: 1.4,
                    }}>
                      {cat.descricao}
                    </span>
                  </div>
                  <ChevronRight size={16} style={{
                    color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0,
                    opacity: 0.5,
                  }} />
                </Link>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link
              href="/cadastro"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px', borderRadius: '12px', textDecoration: 'none',
                background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0, 212, 255, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.25)';
              }}
            >
              Explorar todas as trilhas
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div className="landing-cta-card" style={{
          maxWidth: '900px', margin: '0 auto', textAlign: 'center',
          borderRadius: '24px', padding: '60px 48px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.06), rgba(124, 58, 237, 0.06))',
          border: '1px solid var(--card-border)',
        }}>
          <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />

          {/* Decorative gradient blur */}
          <div style={{
            position: 'absolute', top: '-80px', right: '-80px', width: '250px', height: '250px',
            borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none',
            background: 'rgba(0, 212, 255, 0.08)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px',
            borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none',
            background: 'rgba(124, 58, 237, 0.08)',
          }} />

          <div style={{
            width: '60px', height: '60px', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            margin: '0 auto 24px', position: 'relative', zIndex: 10,
          }}>
            <Terminal size={26} style={{ color: '#00d4ff' }} />
          </div>
          <h2 className="gradient-text" style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800,
            marginBottom: '16px', position: 'relative', zIndex: 10,
            letterSpacing: '-0.02em',
          }}>
            {'>'} Pronto para codar?
          </h2>
          <p style={{
            marginBottom: '36px', fontSize: '1.1rem', color: 'var(--text-secondary)',
            position: 'relative', zIndex: 10, lineHeight: 1.7,
            maxWidth: '520px', margin: '0 auto 36px',
          }}>
            Crie sua conta gratuita e deixe a IA gerar desafios sob medida para sua evolucao.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
            <Link href="/cadastro" className="btn-3d" style={{
              fontSize: '1rem', padding: '16px 36px', borderRadius: '14px',
            }}>
              <Code2 size={18} />
              Criar Conta Gratuita
              <ArrowRight size={18} />
            </Link>
            <Link href="/login" style={{
              fontSize: '1rem', fontWeight: 600, padding: '16px 28px', borderRadius: '14px',
              color: 'var(--text-primary)', textDecoration: 'none',
              background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
              transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                e.currentTarget.style.color = '#00d4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              Ja tenho conta
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
