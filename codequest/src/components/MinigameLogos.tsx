import React from 'react';

interface LogoProps {
  size?: number;
}

/**
 * DevTermo logo – a terminal/monitor with letter blocks à la Wordle
 */
export function DevTermoLogo({ size = 64 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      {/* Monitor body */}
      <rect x="8" y="10" width="104" height="78" rx="8" fill="#1a2332" stroke="#10b981" strokeWidth="2.5" />
      {/* Screen area */}
      <rect x="14" y="16" width="92" height="60" rx="4" fill="#0d1b2a" />
      {/* Letter grid - 5 columns, 3 rows shown */}
      {/* Row 1 – a correct row */}
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={`r1-${i}`} x={20 + i * 17} y={22} width="14" height="14" rx="2.5"
          fill="#10b981" />
      ))}
      {/* Row 2 – mixed */}
      {[
        '#10b981', '#3b3b4f', '#f59e0b', '#3b3b4f', '#10b981',
      ].map((c, i) => (
        <rect key={`r2-${i}`} x={20 + i * 17} y={40} width="14" height="14" rx="2.5"
          fill={c} />
      ))}
      {/* Row 3 – empty */}
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={`r3-${i}`} x={20 + i * 17} y={58} width="14" height="14" rx="2.5"
          fill="none" stroke="#2a3a4a" strokeWidth="1.5" />
      ))}
      {/* Letters on filled rows */}
      <g fill="white" fontSize="9" fontWeight="700" fontFamily="monospace" textAnchor="middle" dominantBaseline="central">
        {['C', 'O', 'D', 'E', 'R'].map((l, i) => (
          <text key={`t1-${i}`} x={27 + i * 17} y={29.5}>{l}</text>
        ))}
        {['A', 'R', 'R', 'A', 'Y'].map((l, i) => (
          <text key={`t2-${i}`} x={27 + i * 17} y={47.5}>{l}</text>
        ))}
      </g>
      {/* Monitor stand */}
      <rect x="48" y="88" width="24" height="6" rx="2" fill="#10b981" opacity="0.5" />
      <rect x="40" y="94" width="40" height="4" rx="2" fill="#10b981" opacity="0.3" />
      {/* Green glow */}
      <rect x="14" y="16" width="92" height="60" rx="4" fill="#10b981" opacity="0.04" />
      {/* Cursor blink line */}
      <rect x="20" y="60" width="8" height="2" rx="1" fill="#10b981" opacity="0.7" />
    </svg>
  );
}

/**
 * CodeRush logo – a lightning bolt with terminal bracket
 */
export function CodeRushLogo({ size = 64 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rushGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="rushBolt" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="60" cy="60" r="52" fill="#1a1a2e" stroke="#f59e0b" strokeWidth="2.5" />
      {/* Terminal brackets */}
      <path d="M28 40 L18 60 L28 80" stroke="#f59e0b" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <path d="M92 40 L102 60 L92 80" stroke="#f59e0b" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      {/* Lightning bolt – main */}
      <path d="M68 16 L45 58 L62 58 L50 104 L82 52 L64 52 Z" fill="url(#rushBolt)" />
      {/* Inner bolt highlight */}
      <path d="M66 22 L48 55 L62 55 L53 96 L78 55 L65 55 Z" fill="white" opacity="0.2" />
      {/* Speed lines */}
      <line x1="15" y1="50" x2="30" y2="52" stroke="#f59e0b" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      <line x1="12" y1="62" x2="28" y2="62" stroke="#f59e0b" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
      <line x1="15" y1="72" x2="30" y2="70" stroke="#f59e0b" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
      {/* Sparks */}
      <circle cx="42" cy="56" r="1.5" fill="#fcd34d" opacity="0.6" />
      <circle cx="76" cy="50" r="1.2" fill="#fcd34d" opacity="0.5" />
      <circle cx="55" cy="100" r="1.5" fill="#f59e0b" opacity="0.4" />
      {/* Glow behind bolt */}
      <ellipse cx="60" cy="60" rx="20" ry="30" fill="#f59e0b" opacity="0.06" />
    </svg>
  );
}

export const minigameLogos: Record<string, React.FC<LogoProps>> = {
  termo: DevTermoLogo,
  coderush: CodeRushLogo,
};
