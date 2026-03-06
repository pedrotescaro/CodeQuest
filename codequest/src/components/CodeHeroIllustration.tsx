'use client';

interface CodeHeroIllustrationProps {
  size?: number;
  className?: string;
}

export default function CodeHeroIllustration({ size = 320, className = '' }: CodeHeroIllustrationProps) {
  const w = size;
  const h = size * 0.85;

  return (
    <div className={className} style={{ position: 'relative', width: w, height: h }}>
      <svg
        viewBox="0 0 400 340"
        width={w}
        height={h}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 40px rgba(0, 212, 255, 0.15))' }}
      >
        <defs>
          <linearGradient id="termGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16162a" />
            <stop offset="100%" stopColor="#0f0f17" />
          </linearGradient>
          <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e1e38" />
            <stop offset="100%" stopColor="#16162a" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow ring */}
        <ellipse cx="200" cy="170" rx="185" ry="160" stroke="url(#glowGrad)" strokeWidth="1" opacity="0.4" />

        {/* Terminal window */}
        <rect x="50" y="40" width="300" height="220" rx="16" fill="url(#termGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Title bar */}
        <rect x="50" y="40" width="300" height="36" rx="16" fill="url(#barGrad)" />
        <rect x="50" y="60" width="300" height="16" fill="url(#barGrad)" />

        {/* Window dots */}
        <circle cx="72" cy="58" r="5" fill="#ef4444" opacity="0.9" />
        <circle cx="90" cy="58" r="5" fill="#f59e0b" opacity="0.9" />
        <circle cx="108" cy="58" r="5" fill="#10b981" opacity="0.9" />

        {/* Title text */}
        <text x="200" y="62" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.35)" fontFamily="monospace" fontWeight="600">
          codequest.tsx
        </text>

        {/* Code lines */}
        <g fontFamily="monospace" fontSize="12">
          {/* Line 1 */}
          <text x="70" y="100" fill="#64748b">1</text>
          <text x="92" y="100" fill="#c084fc">const</text>
          <text x="130" y="100" fill="#00d4ff">quest</text>
          <text x="168" y="100" fill="rgba(255,255,255,0.5)">=</text>
          <text x="180" y="100" fill="#fbbf24">{'"aprender"'}</text>
          <text x="260" y="100" fill="rgba(255,255,255,0.3)">;</text>

          {/* Line 2 */}
          <text x="70" y="122" fill="#64748b">2</text>

          {/* Line 3 */}
          <text x="70" y="144" fill="#64748b">3</text>
          <text x="92" y="144" fill="#c084fc">function</text>
          <text x="152" y="144" fill="#00d4ff" filter="url(#glow)">subirDeNivel</text>
          <text x="252" y="144" fill="rgba(255,255,255,0.5)">{'() {'}</text>

          {/* Line 4 */}
          <text x="70" y="166" fill="#64748b">4</text>
          <text x="108" y="166" fill="#c084fc">while</text>
          <text x="142" y="166" fill="rgba(255,255,255,0.5)">(</text>
          <text x="150" y="166" fill="#10b981">true</text>
          <text x="178" y="166" fill="rgba(255,255,255,0.5)">{')'}</text>
          <text x="186" y="166" fill="rgba(255,255,255,0.5)">{'{'}</text>

          {/* Line 5 */}
          <text x="70" y="188" fill="#64748b">5</text>
          <text x="124" y="188" fill="#f8fafc">xp</text>
          <text x="140" y="188" fill="rgba(255,255,255,0.5)">+=</text>
          <text x="158" y="188" fill="#fbbf24">quiz</text>
          <text x="186" y="188" fill="rgba(255,255,255,0.5)">();</text>

          {/* Line 6 */}
          <text x="70" y="210" fill="#64748b">6</text>
          <text x="108" y="210" fill="rgba(255,255,255,0.5)">{'}'}</text>

          {/* Line 7 */}
          <text x="70" y="232" fill="#64748b">7</text>
          <text x="92" y="232" fill="rgba(255,255,255,0.5)">{'}'}</text>
        </g>

        {/* Cursor blink on line 5 */}
        <rect x="194" y="178" width="8" height="14" rx="1" fill="#00d4ff" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0;0.8" dur="1.2s" repeatCount="indefinite" />
        </rect>

        {/* Floating elements outside terminal */}

        {/* Top-right bracket */}
        <g transform="translate(330, 30)" opacity="0.6">
          <text fontSize="28" fill="#7c3aed" fontFamily="monospace" fontWeight="bold">{'{ }'}</text>
        </g>

        {/* Bottom-left tag */}
        <g transform="translate(15, 275)" opacity="0.5">
          <text fontSize="24" fill="#00d4ff" fontFamily="monospace" fontWeight="bold">{'</>'}</text>
        </g>

        {/* Top-left hash */}
        <g transform="translate(20, 55)" opacity="0.4">
          <text fontSize="22" fill="#f59e0b" fontFamily="monospace" fontWeight="bold">#</text>
        </g>

        {/* Bottom-right lambda */}
        <g transform="translate(355, 240)" opacity="0.5">
          <text fontSize="22" fill="#10b981" fontFamily="monospace" fontWeight="bold">λ</text>
        </g>

        {/* Decorative dots */}
        <circle cx="370" cy="140" r="3" fill="#00d4ff" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="30" cy="170" r="3" fill="#7c3aed" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="355" cy="80" r="2" fill="#f59e0b" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Bottom reflection line */}
        <line x1="100" y1="290" x2="300" y2="290" stroke="url(#glowGrad)" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  );
}
