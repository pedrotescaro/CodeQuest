'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useRef, useCallback } from 'react';
import { getUserData, getXpParaProximoNivel, UserData } from '@/lib/firestore';
import { categorias } from '@/lib/quizzes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CodeHeroIllustration from '@/components/CodeHeroIllustration';
import {
  Trophy, Flame, Zap, BookOpen, Play, ArrowRight,
  Code2, Terminal, ChevronRight, ChevronLeft, Target,
  TrendingUp, Calendar, Sparkles, Shield, Gamepad2,
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
  return (
    <>
      <Navbar />

      {/* Hero */}
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
        {/* Background gradient orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '-200px', right: '-100px', width: '600px', height: '600px',
            borderRadius: '50%', filter: 'blur(180px)',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.10), transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-200px', left: '-100px', width: '600px', height: '600px',
            borderRadius: '50%', filter: 'blur(180px)',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.10), transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', top: '30%', left: '50%', width: '400px', height: '400px',
            borderRadius: '50%', filter: 'blur(150px)', transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.04), transparent 70%)',
          }} />
        </div>

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
          {/* Text - comes first for importance */}
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
              <Gamepad2 size={14} />
              Plataforma Gamificada de Programacao
            </div>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800,
              lineHeight: 1.08, marginBottom: '24px', color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
            }}>
              Aprenda codigo{' '}
              <span className="gradient-text-neon">jogando quizzes.</span>
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', marginBottom: '36px',
              color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.7,
            }}>
              Complete desafios, ganhe XP, suba de nivel e construa uma ofensiva diaria.
              O jeito mais divertido de dominar programacao.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/cadastro" className="btn-3d" style={{
                fontSize: '1rem', padding: '16px 36px', borderRadius: '14px',
              }}>
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

            {/* Social proof mini-stats */}
            <div style={{
              display: 'flex', gap: '32px', marginTop: '48px', flexWrap: 'wrap',
            }}>
              {[
                { value: '6+', label: 'Linguagens' },
                { value: '100+', label: 'Perguntas' },
                { value: '100%', label: 'Gratuito' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'left' }}>
                  <p className="neon-text" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '2px' }}>{s.value}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="animate-fade-in landing-illustration" style={{
            flex: '1 1 360px', display: 'flex', justifyContent: 'center',
          }}>
            <div style={{ position: 'relative' }}>
              <div className="animate-float">
                <CodeHeroIllustration size={380} />
              </div>

              {/* Floating badges */}
              <div style={{
                position: 'absolute', top: '10px', right: '-10px',
                padding: '7px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                backdropFilter: 'blur(12px)',
                animation: 'pulse-slow 3s ease-in-out infinite',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <Zap size={13} />
                +10 XP
              </div>
              <div style={{
                position: 'absolute', bottom: '50px', left: '-20px',
                padding: '7px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                backdropFilter: 'blur(12px)',
                animation: 'pulse-slow 3s ease-in-out infinite',
                animationDelay: '1.5s',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <Flame size={13} />
                Ofensiva: 7 dias
              </div>
              <div style={{
                position: 'absolute', bottom: '0px', right: '20px',
                padding: '7px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                background: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                backdropFilter: 'blur(12px)',
                animation: 'pulse-slow 3s ease-in-out infinite',
                animationDelay: '0.8s',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <Trophy size={13} />
                Nivel 5
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona - Steps Section */}
      <section id="como-funciona" style={{ padding: '100px 24px', position: 'relative' }}>
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
              <Shield size={14} />
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
              jornada interativa e recompensadora.
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
                icon: <Terminal size={24} style={{ color: '#00d4ff' }} />,
                title: 'Escolha um Quiz',
                desc: 'Selecione entre JavaScript, Python, SQL, React e outras linguagens populares.',
                accent: '#00d4ff',
              },
              {
                step: '02',
                icon: <TrendingUp size={24} style={{ color: '#a78bfa' }} />,
                title: 'Responda e Ganhe XP',
                desc: 'Cada resposta correta vale pontos de experiencia. Acumule XP e suba de nivel.',
                accent: '#a78bfa',
              },
              {
                step: '03',
                icon: <Calendar size={24} style={{ color: '#f59e0b' }} />,
                title: 'Construa sua Ofensiva',
                desc: 'Jogue todo dia e mantenha seu combo ativo. Consistencia e a chave do progresso.',
                accent: '#f59e0b',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="card animate-fade-in-up landing-step-card"
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
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.95rem' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Showcase */}
      <section style={{ padding: '64px 24px 80px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800,
              color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '12px',
            }}>
              Quizzes para todas as <span className="neon-text">linguagens</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Escolha sua linguagem favorita e comece a praticar agora.
            </p>
          </div>

          <div className="landing-langs-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
          }}>
            {categorias.slice(0, 6).map((cat, i) => {
              const LangIcon = languageIconMap[cat.id];
              return (
                <Link
                  key={cat.id}
                  href="/cadastro"
                  className="animate-fade-in-up"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '12px', padding: '28px 16px',
                    borderRadius: '16px', textDecoration: 'none',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--card-border)',
                    transition: 'all 0.3s ease',
                    animationDelay: `${i * 0.08}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = `${cat.cor}40`;
                    e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.15), 0 0 20px ${cat.cor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--card-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${cat.cor}12`, overflow: 'hidden',
                  }}>
                    {LangIcon ? <LangIcon size={28} /> : <Code2 size={22} style={{ color: cat.cor }} />}
                  </div>
                  <span style={{
                    fontSize: '0.85rem', fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}>
                    {cat.nome}
                  </span>
                  <span style={{
                    fontSize: '0.72rem', color: 'var(--text-muted)',
                  }}>
                    {cat.perguntas.length} perguntas
                  </span>
                </Link>
              );
            })}
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
            <Sparkles size={26} style={{ color: '#00d4ff' }} />
          </div>
          <h2 className="gradient-text" style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800,
            marginBottom: '16px', position: 'relative', zIndex: 10,
            letterSpacing: '-0.02em',
          }}>
            Pronto para a proxima fase?
          </h2>
          <p style={{
            marginBottom: '36px', fontSize: '1.1rem', color: 'var(--text-secondary)',
            position: 'relative', zIndex: 10, lineHeight: 1.7,
            maxWidth: '520px', margin: '0 auto 36px',
          }}>
            Sua jornada de programacao esta apenas comecando.
            Crie sua conta gratuita e transforme cada quiz em uma nova conquista.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
            <Link href="/cadastro" className="btn-3d" style={{
              fontSize: '1rem', padding: '16px 36px', borderRadius: '14px',
            }}>
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
