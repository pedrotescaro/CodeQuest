'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getUserData, getXpParaProximoNivel, UserData } from '@/lib/firestore';
import { categorias } from '@/lib/quizzes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CatMascot from '@/components/CatMascot';
import {
  Trophy, Flame, Zap, BookOpen, Play, ArrowRight,
  Code2, Terminal, Braces, ChevronRight, Target,
  TrendingUp, Calendar, Sparkles, Shield, Gamepad2,
} from 'lucide-react';

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
  if (!authLoading && user && userData) {
    const xpProgress = getXpParaProximoNivel(userData.xp);
    const progressPercent = (xpProgress.atual / xpProgress.necessario) * 100;
    const quizzesCompletos = Object.keys(userData.quizzesCompletos).length;

    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--background)' }}>
          {/* Hero Banner */}
          <section style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.06) 0%, rgba(124, 58, 237, 0.08) 50%, rgba(0, 212, 255, 0.04) 100%)',
            borderBottom: '1px solid var(--border-color)',
            padding: '48px 24px 40px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle glow */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <div style={{
                position: 'absolute', top: '-120px', right: '-120px', width: '400px', height: '400px',
                borderRadius: '50%', filter: 'blur(140px)',
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.06), transparent 70%)',
              }} />
              <div style={{
                position: 'absolute', bottom: '-120px', left: '-120px', width: '400px', height: '400px',
                borderRadius: '50%', filter: 'blur(140px)',
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.06), transparent 70%)',
              }} />
            </div>

            <div style={{
              maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10,
              display: 'flex', alignItems: 'center', gap: '40px',
              flexWrap: 'wrap',
            }}>
              {/* Left: Greeting */}
              <div className="animate-fade-in-up" style={{ flex: '1 1 400px' }}>
                <h1 style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  marginBottom: '12px',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}>
                  Pronto para jogar,{' '}
                  <span className="gradient-text">{userData.nome}</span>?
                </h1>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                  Continue sua jornada de programacao e ganhe recompensas.
                </p>

                {/* XP Progress Card */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '14px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={18} style={{ color: '#f59e0b' }} />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      NIVEL {userData.nivel}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <div className="progress-bar-bg" style={{ height: '10px' }}>
                      <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-muted)' }}>
                      {xpProgress.atual} / {xpProgress.necessario} XP
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Flame size={18} style={{ color: '#f59e0b' }} />
                    <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.875rem' }}>
                      {userData.ofensiva} {userData.ofensiva === 1 ? 'dia' : 'dias'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Daily Challenge Card */}
              <div className="animate-fade-in-up" style={{
                flex: '0 1 340px',
                background: 'var(--bg-card)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '28px',
                animationDelay: '0.15s',
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                  marginBottom: '16px',
                }}>
                  <Target size={12} />
                  Desafio do Dia
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  {dailyChallenge.nome}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '20px',
                  lineHeight: 1.6,
                }}>
                  {dailyChallenge.descricao}. Prove seus conhecimentos e ganhe XP em dobro hoje.
                </p>
                <Link
                  href={`/quiz/${dailyChallenge.id}`}
                  className="btn-3d"
                  style={{
                    padding: '12px 28px',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
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

          {/* Quiz Categories - Horizontal Scroll */}
          <section style={{ padding: '48px 24px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '20px',
              }}>
                Destaques da Semana
              </h2>

              <div className="horizontal-scroll">
                {categorias.map((cat, i) => {
                  const completado = userData.quizzesCompletos[cat.id];
                  return (
                    <Link
                      key={cat.id}
                      href={`/quiz/${cat.id}`}
                      className="animate-fade-in-up"
                      style={{
                        width: '220px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '14px',
                        padding: '20px',
                        textDecoration: 'none',
                        transition: 'all 0.25s ease',
                        animationDelay: `${i * 0.06}s`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.15)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--card-border)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '12px',
                        backgroundColor: `${cat.cor}15`,
                        color: cat.cor,
                      }}>
                        <Code2 size={20} />
                      </div>
                      <h3 style={{
                        fontSize: '0.95rem', fontWeight: 700,
                        color: 'var(--text-primary)', marginBottom: '4px',
                      }}>
                        {cat.nome}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        {cat.perguntas.length} perguntas
                      </p>
                      {completado ? (
                        <span style={{
                          fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', fontWeight: 600,
                          background: 'rgba(0, 212, 255, 0.08)', color: '#00d4ff',
                        }}>
                          Melhor: {completado.melhorScore}/{cat.perguntas.length}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', fontWeight: 600,
                          background: 'rgba(16, 185, 129, 0.08)', color: '#10b981',
                        }}>
                          Novo!
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <section style={{ padding: '0 24px 48px' }}>
            <div style={{
              maxWidth: '1280px', margin: '0 auto',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px',
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
      <section style={{
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
        {/* Background subtle orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '-160px', right: '-160px', width: '500px', height: '500px',
            borderRadius: '50%', filter: 'blur(150px)',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.07), transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-160px', left: '-160px', width: '500px', height: '500px',
            borderRadius: '50%', filter: 'blur(150px)',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.07), transparent 70%)',
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
        }}>
          {/* Mascot */}
          <div className="animate-fade-in" style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div className="animate-float">
                <CatMascot size={250} />
              </div>

              {/* Floating badges */}
              <div style={{
                position: 'absolute', top: '-16px', right: '-16px',
                padding: '5px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700,
                background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                animation: 'pulse-slow 2s ease-in-out infinite',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <Zap size={13} />
                +10 XP
              </div>
              <div style={{
                position: 'absolute', bottom: '40px', left: '-24px',
                padding: '5px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
                animation: 'pulse-slow 2s ease-in-out infinite',
                animationDelay: '1s',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <Flame size={13} />
                7 dias
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="animate-fade-in-up" style={{
            flex: '1 1 400px', textAlign: 'left',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              fontSize: '12px', fontWeight: 600, marginBottom: '24px',
              background: 'rgba(0, 212, 255, 0.06)', border: '1px solid rgba(0, 212, 255, 0.12)',
              color: '#00d4ff',
            }}>
              <Gamepad2 size={14} />
              Plataforma Gamificada de Programacao
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800,
              lineHeight: 1.1, marginBottom: '24px', color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
            }}>
              Domine a programacao.{' '}
              <span className="gradient-text-neon">Suba de nivel codando!</span>
            </h1>
            <p style={{ fontSize: '1.05rem', marginBottom: '32px', color: 'var(--text-secondary)', maxWidth: '540px', lineHeight: 1.7 }}>
              Transforme seu estudo em um jogo. Complete quizzes, ganhe XP e mantenha
              sua ofensiva de codigo ativa todos os dias.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/cadastro" className="btn-3d" style={{
                fontSize: '1rem', padding: '14px 32px', borderRadius: '12px',
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
                Saiba mais
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" style={{ padding: '96px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '64px',
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800,
                  lineHeight: 1.2, marginBottom: '16px', color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}>
                  A mecanica e simples.{' '}
                  <span className="gradient-text">O aprendizado e real.</span>
                </h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  O CodeQuest transforma o seu estudo de programacao. Ao inves de apenas ler, voce
                  testa seus conhecimentos de forma interativa e divertida.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="feature-border" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0, 212, 255, 0.08)',
                  }}>
                    <Terminal size={18} style={{ color: '#00d4ff' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                      Quizzes por Linguagem
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Teste seus conhecimentos em JavaScript, Python, SQL, React e mais.
                    </p>
                  </div>
                </div>

                <div className="feature-border" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(124, 58, 237, 0.08)',
                  }}>
                    <TrendingUp size={18} style={{ color: '#a78bfa' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                      Sistema de Progressao
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Acumule pontos de experiencia (XP) com seus acertos e veja seu perfil subir de nivel.
                    </p>
                  </div>
                </div>

                <div className="feature-border" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(245, 158, 11, 0.08)',
                  }}>
                    <Calendar size={18} style={{ color: '#f59e0b' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                      Ofensiva Diaria
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Mantenha a consistencia. Estudar um pouco todos os dias protege o seu combo de ofensiva.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mascot section */}
            <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative', padding: '40px', borderRadius: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--card-border)',
              }}>
                <div className="animate-float">
                  <CatMascot size={200} />
                </div>

                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)',
                  opacity: 0.5,
                }}>
                  {'// mascote oficial'}
                </div>
                <div style={{
                  position: 'absolute', bottom: '16px', right: '16px',
                  fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)',
                  opacity: 0.5,
                }}>
                  {'cat.study();'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{
          maxWidth: '960px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px',
        }}>
          {[
            { icon: <Zap size={24} style={{ color: '#00d4ff' }} />, value: '6+', desc: 'categorias', bg: 'rgba(0, 212, 255, 0.08)' },
            { icon: <Trophy size={24} style={{ color: '#f59e0b' }} />, value: 'XP', desc: 'gamificado', bg: 'rgba(245, 158, 11, 0.08)' },
            { icon: <Flame size={24} style={{ color: '#ef4444' }} />, value: '\u221E', desc: 'dias possiveis', bg: 'rgba(239, 68, 68, 0.08)' },
          ].map((stat, i) => (
            <div
              key={i}
              className="card animate-fade-in-up"
              style={{
                padding: '28px', textAlign: 'center',
                animationDelay: `${i * 0.12}s`,
              }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: stat.bg, margin: '0 auto 16px',
              }}>
                {stat.icon}
              </div>
              <div className="neon-text" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>{stat.value}</div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto', textAlign: 'center',
          borderRadius: '20px', padding: '48px', position: 'relative', overflow: 'hidden',
          background: 'var(--bg-card)',
          border: '1px solid var(--card-border)',
        }}>
          <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0, 212, 255, 0.08)',
            margin: '0 auto 20px', position: 'relative', zIndex: 10,
          }}>
            <Sparkles size={24} style={{ color: '#00d4ff' }} />
          </div>
          <h2 className="gradient-text" style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800,
            marginBottom: '16px', position: 'relative', zIndex: 10,
            letterSpacing: '-0.02em',
          }}>
            Pronto para a proxima fase?
          </h2>
          <p style={{
            marginBottom: '32px', fontSize: '1.05rem', color: 'var(--text-secondary)',
            position: 'relative', zIndex: 10, lineHeight: 1.7,
          }}>
            Sua jornada de programacao esta apenas comecando. Transforme cada quiz em uma nova conquista.
          </p>
          <Link href="/cadastro" className="btn-3d" style={{
            fontSize: '1rem', padding: '14px 32px', borderRadius: '12px',
            position: 'relative', zIndex: 10,
          }}>
            Criar Conta Gratuita
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: 800, marginBottom: '16px',
          color: 'var(--text-primary)', letterSpacing: '-0.02em',
        }}>
          Sua proxima conquista comeca <span className="neon-text">agora</span>.
        </h2>
        <p style={{ maxWidth: '540px', margin: '0 auto 32px', fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Nao perca tempo. Junte-se a outros devs, suba no ranking e transforme seus estudos em uma grande aventura.
        </p>
      </section>

      <Footer />
    </>
  );
}
