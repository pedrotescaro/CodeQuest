'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getUserData, getXpParaProximoNivel, UserData } from '@/lib/firestore';
import { categorias } from '@/lib/quizzes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CatMascot from '@/components/CatMascot';

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

  // Pick a random "daily challenge" quiz
  const dailyChallenge = categorias[Math.floor(Date.now() / 86400000) % categorias.length];

  // If logged in, show the authenticated home (Bookadex-style layout)
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
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.12) 0%, rgba(124, 58, 237, 0.15) 50%, rgba(0, 212, 255, 0.08) 100%)',
            borderBottom: '1px solid var(--border-color)',
            padding: '48px 24px 40px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background glow */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <div style={{
                position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px',
                borderRadius: '50%', filter: 'blur(120px)',
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1), transparent 70%)',
              }} />
              <div style={{
                position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px',
                borderRadius: '50%', filter: 'blur(120px)',
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1), transparent 70%)',
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
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: '12px',
                  color: 'var(--text-primary)',
                }}>
                  Pronto para jogar,{' '}
                  <span className="gradient-text">{userData.nome}</span>?
                </h1>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Continue sua jornada de programação e ganhe recompensas.
                </p>

                {/* XP Progress Bar */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🏆</span>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      NÍVEL {userData.nivel}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <div className="progress-bar-bg" style={{ height: '12px' }}>
                      <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                      {xpProgress.atual} / {xpProgress.necessario} XP
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔥</span>
                    <span style={{ fontWeight: 700, color: '#ffa502', fontSize: '0.9rem' }}>
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
                borderRadius: '20px',
                padding: '28px',
                animationDelay: '0.2s',
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'rgba(255, 165, 2, 0.15)',
                  color: '#ffa502',
                  marginBottom: '16px',
                }}>
                  Desafio do Dia
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}>
                  {dailyChallenge.nome}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '20px',
                  lineHeight: 1.5,
                }}>
                  {dailyChallenge.descricao}. Prove seus conhecimentos e ganhe XP em dobro hoje.
                </p>
                <Link
                  href={`/quiz/${dailyChallenge.id}`}
                  className="btn-3d"
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    width: '100%',
                    textDecoration: 'none',
                  }}
                >
                  ▶ Jogar Quiz
                </Link>
              </div>
            </div>
          </section>

          {/* Quiz Categories Section */}
          <section style={{ padding: '48px 24px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: '1rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-secondary)',
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
                        borderRadius: '16px',
                        padding: '20px',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        animationDelay: `${i * 0.08}s`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 212, 255, 0.1)';
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
                        fontSize: '1.5rem', marginBottom: '12px',
                        backgroundColor: `${cat.cor}20`,
                      }}>
                        {cat.icone}
                      </div>
                      <h3 style={{
                        fontSize: '1rem', fontWeight: 700,
                        color: 'var(--text-primary)', marginBottom: '4px',
                      }}>
                        {cat.nome}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {cat.perguntas.length} perguntas
                      </p>
                      {completado ? (
                        <span style={{
                          fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 600,
                          background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff',
                        }}>
                          Melhor: {completado.melhorScore}/{cat.perguntas.length}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 600,
                          background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88',
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
                <div className="stat-card-icon" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>⚡</div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>XP Total</p>
                  <p className="neon-text" style={{ fontSize: '1.5rem', fontWeight: 900 }}>{userData.xp}</p>
                </div>
              </div>
              <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="stat-card-icon" style={{ background: 'rgba(255, 165, 2, 0.1)' }}>🏆</div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Nível Atual</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffa502' }}>{userData.nivel}</p>
                </div>
              </div>
              <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="stat-card-icon" style={{ background: 'rgba(255, 71, 87, 0.1)' }}>🔥</div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ofensiva</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ff4757' }}>
                    {userData.ofensiva} {userData.ofensiva === 1 ? 'dia' : 'dias'}
                  </p>
                </div>
              </div>
              <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="stat-card-icon" style={{ background: 'rgba(0, 255, 136, 0.1)' }}>📚</div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Quizzes Feitos</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#00ff88' }}>{quizzesCompletos}</p>
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
        {/* Background glow orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '-160px', right: '-160px', width: '500px', height: '500px',
            borderRadius: '50%', filter: 'blur(120px)',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.12), transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-160px', left: '-160px', width: '500px', height: '500px',
            borderRadius: '50%', filter: 'blur(120px)',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12), transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '800px', height: '800px', borderRadius: '50%', filter: 'blur(150px)',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.05), transparent 60%)',
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
                padding: '4px 12px', borderRadius: '999px', fontSize: '14px', fontWeight: 700,
                background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#0a0a0f',
                boxShadow: '0 0 15px rgba(0, 255, 136, 0.4)',
                animation: 'pulse-slow 2s ease-in-out infinite',
              }}>
                +10 XP
              </div>
              <div style={{
                position: 'absolute', bottom: '40px', left: '-24px',
                padding: '4px 12px', borderRadius: '999px', fontSize: '14px', fontWeight: 700,
                background: 'linear-gradient(135deg, #ffa502, #e69500)', color: '#0a0a0f',
                boxShadow: '0 0 15px rgba(255, 165, 2, 0.4)',
                animation: 'pulse-slow 2s ease-in-out infinite',
                animationDelay: '1s',
              }}>
                🔥 7 dias
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="animate-fade-in-up" style={{
            flex: '1 1 400px', textAlign: 'left',
          }}>
            <div style={{
              display: 'inline-block', padding: '6px 16px', borderRadius: '999px',
              fontSize: '12px', fontWeight: 700, marginBottom: '24px',
              background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.2)',
              color: '#00d4ff',
            }}>
              🎮 Plataforma Gamificada de Programação
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
              lineHeight: 1.1, marginBottom: '24px', color: 'var(--text-primary)',
            }}>
              Domine a programação.{' '}
              <span className="gradient-text-neon">Suba de nível codando!</span>
            </h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '32px', color: 'var(--text-secondary)', maxWidth: '540px' }}>
              Transforme seu estudo em um jogo. Complete quizzes, ganhe XP e mantenha
              sua ofensiva de código ativa todos os dias.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/cadastro" className="btn-3d" style={{
                fontSize: '1.1rem', padding: '16px 40px', borderRadius: '16px',
              }}>
                COMEÇAR AGORA
              </Link>
              <Link href="/#como-funciona" style={{
                fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                Saiba mais →
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
                  fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900,
                  lineHeight: 1.2, marginBottom: '16px', color: 'var(--text-primary)',
                }}>
                  A mecânica é simples.{' '}
                  <span className="gradient-text">O aprendizado é real.</span>
                </h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                  O CodeQuest transforma o seu estudo de programação. Ao invés de apenas ler, você
                  testa seus conhecimentos de forma interativa e divertida.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="feature-border">
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                    Quizzes por Linguagem
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Teste seus conhecimentos em JavaScript, Python, SQL, React e mais.
                  </p>
                </div>

                <div className="feature-border">
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                    Sistema de Progressão
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Acumule pontos de experiência (XP) com seus acertos e veja seu perfil subir de nível.
                  </p>
                </div>

                <div className="feature-border">
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                    Ofensiva Diária
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Mantenha a consistência. Estudar um pouco todos os dias protege o seu combo de ofensiva.
                  </p>
                </div>
              </div>
            </div>

            {/* Mascot section */}
            <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative', padding: '40px', borderRadius: '24px',
                background: 'rgba(22, 22, 42, 0.5)',
                border: '1px solid rgba(0, 212, 255, 0.12)',
                boxShadow: '0 0 60px rgba(0, 212, 255, 0.05)',
              }}>
                <div className="animate-float">
                  <CatMascot size={200} />
                </div>

                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  fontSize: '12px', fontFamily: 'monospace', color: 'rgba(0, 212, 255, 0.3)',
                }}>
                  {'// mascote oficial'}
                </div>
                <div style={{
                  position: 'absolute', bottom: '16px', right: '16px',
                  fontSize: '12px', fontFamily: 'monospace', color: 'rgba(124, 58, 237, 0.3)',
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
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px',
        }}>
          {[
            { icon: '⚡', value: '6+', desc: 'categorias' },
            { icon: '🏆', value: 'XP', desc: 'gamificado' },
            { icon: '🔥', value: '∞', desc: 'dias possíveis' },
          ].map((stat, i) => (
            <div
              key={i}
              className="card animate-fade-in-up"
              style={{
                padding: '24px', textAlign: 'center',
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{stat.icon}</div>
              <div className="neon-text" style={{ fontSize: '1.875rem', fontWeight: 900, marginBottom: '4px' }}>{stat.value}</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto', textAlign: 'center',
          borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(124, 58, 237, 0.08))',
          border: '1px solid rgba(0, 212, 255, 0.15)',
          boxShadow: '0 0 60px rgba(0, 212, 255, 0.05)',
        }}>
          <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
          <h2 className="gradient-text" style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900,
            marginBottom: '16px', position: 'relative', zIndex: 10,
          }}>
            Pronto para a próxima fase?
          </h2>
          <p style={{
            marginBottom: '32px', fontSize: '1.1rem', color: 'var(--text-secondary)',
            position: 'relative', zIndex: 10,
          }}>
            Sua jornada de programação está apenas começando. Transforme cada quiz em uma nova conquista.
          </p>
          <Link href="/cadastro" className="btn-3d" style={{
            fontSize: '1.1rem', padding: '16px 40px', borderRadius: '16px',
            position: 'relative', zIndex: 10,
          }}>
            CRIAR CONTA GRATUITA
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: 900, marginBottom: '16px', color: 'var(--text-primary)' }}>
          Sua próxima conquista começa <span className="neon-text">agora</span>.
        </h2>
        <p style={{ maxWidth: '540px', margin: '0 auto 32px', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Não perca tempo. Junte-se a outros devs, suba no ranking e transforme seus estudos em uma grande aventura.
        </p>
      </section>

      <Footer />
    </>
  );
}
