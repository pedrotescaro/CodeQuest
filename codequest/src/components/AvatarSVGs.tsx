'use client';

import React from 'react';

// ═══════════════════════════════════════════════════════
//  SVG BACKGROUNDS
// ═══════════════════════════════════════════════════════

export function BgPadrao() {
  return (
    <>
      <defs>
        <linearGradient id="bg_padrao" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#16213e" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bg_padrao)" />
      {/* Subtle grid lines */}
      {[40, 80, 120, 160].map(v => (
        <React.Fragment key={v}>
          <line x1={v} y1="0" x2={v} y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="0" y1={v} x2="200" y2={v} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        </React.Fragment>
      ))}
    </>
  );
}

export function BgMatrix() {
  return (
    <>
      <defs>
        <linearGradient id="bg_matrix" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1b0e" />
          <stop offset="100%" stopColor="#1a3a1a" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bg_matrix)" />
      {/* Matrix code rain columns */}
      {[20, 45, 70, 95, 120, 145, 170].map((x, i) => (
        <g key={x} opacity={0.15 + (i % 3) * 0.08}>
          {Array.from({ length: 6 }, (_, j) => (
            <text key={j} x={x} y={15 + j * 30 + (i * 11) % 20} fill="#00ff41" fontSize="10" fontFamily="monospace">
              {['0', '1', '{', '}', ';', '<', '>', '/', '=', '+'][((i * 3 + j * 7) % 10)]}
            </text>
          ))}
        </g>
      ))}
      {/* Green glow overlay */}
      <rect width="200" height="200" fill="url(#bg_matrix)" opacity="0.3" />
    </>
  );
}

export function BgGalaxy() {
  return (
    <>
      <defs>
        <radialGradient id="bg_galaxy" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#1a0a3e" />
          <stop offset="50%" stopColor="#0c0c2e" />
          <stop offset="100%" stopColor="#050510" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bg_galaxy)" />
      {/* Stars */}
      {[
        [25, 18, 1.5], [45, 42, 1], [170, 25, 2], [155, 55, 0.8], [30, 80, 1.2],
        [15, 140, 0.7], [50, 170, 1.8], [85, 20, 1], [130, 40, 0.6], [175, 90, 1.5],
        [160, 150, 1], [40, 120, 0.9], [110, 175, 1.3], [180, 170, 0.8], [70, 55, 0.5],
        [95, 160, 1.1], [145, 130, 0.7], [20, 50, 1.4], [185, 40, 0.6], [65, 145, 1],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity={0.5 + (i % 4) * 0.15} />
      ))}
      {/* Nebula glow */}
      <ellipse cx="60" cy="60" rx="40" ry="25" fill="#7c3aed" opacity="0.07" />
      <ellipse cx="150" cy="140" rx="35" ry="20" fill="#ec4899" opacity="0.06" />
      {/* Shooting star */}
      <line x1="30" y1="10" x2="60" y2="30" stroke="white" strokeWidth="0.8" opacity="0.3" />
    </>
  );
}

export function BgNeon() {
  return (
    <>
      <defs>
        <linearGradient id="bg_neon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a0030" />
          <stop offset="50%" stopColor="#000830" />
          <stop offset="100%" stopColor="#002020" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bg_neon)" />
      {/* City skyline silhouette */}
      <path d="M0 160 L0 140 L15 140 L15 120 L25 120 L25 100 L35 100 L35 130 L45 130 L45 105 L50 100 L55 105 L55 130 L65 130 L65 90 L80 90 L80 115 L90 115 L90 95 L100 85 L110 95 L110 120 L120 120 L120 100 L130 100 L130 80 L140 80 L140 110 L150 110 L150 95 L165 95 L165 130 L175 130 L175 110 L190 110 L190 135 L200 135 L200 160 Z" fill="#0a0a1a" />
      {/* Neon signs */}
      <rect x="28" y="105" width="4" height="10" fill="#ff00ff" opacity="0.6" rx="1" />
      <rect x="133" y="85" width="4" height="8" fill="#00ffff" opacity="0.6" rx="1" />
      <rect x="68" y="95" width="6" height="4" fill="#ff6600" opacity="0.5" rx="1" />
      <rect x="102" y="90" width="5" height="6" fill="#00ff88" opacity="0.5" rx="1" />
      {/* Windows */}
      {[
        [18, 125], [18, 132], [28, 108], [48, 112], [48, 120], [68, 98],
        [73, 98], [93, 100], [103, 100], [123, 105], [133, 88], [153, 100],
        [178, 115], [178, 122], [88, 120], [155, 108],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="3" height="3" fill={['#ffff00', '#00ffff', '#ff00ff', '#ffffff'][i % 4]} opacity="0.3" rx="0.5" />
      ))}
      {/* Ground reflection */}
      <rect x="0" y="160" width="200" height="40" fill="#0a0a20" />
      <line x1="0" y1="160" x2="200" y2="160" stroke="#ff00ff" strokeWidth="0.5" opacity="0.3" />
    </>
  );
}

export function BgFire() {
  return (
    <>
      <defs>
        <linearGradient id="bg_fire" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#1a0000" />
          <stop offset="40%" stopColor="#3a0a00" />
          <stop offset="100%" stopColor="#1a0000" />
        </linearGradient>
        <linearGradient id="flame1" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff4500" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="flame2" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff6600" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffcc00" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bg_fire)" />
      {/* Flame shapes */}
      <path d="M20 200 Q30 150 25 130 Q35 155 40 120 Q45 160 50 200 Z" fill="url(#flame1)" />
      <path d="M60 200 Q70 140 65 110 Q80 145 85 100 Q90 155 95 200 Z" fill="url(#flame2)" />
      <path d="M110 200 Q120 155 115 135 Q125 150 130 115 Q135 160 140 200 Z" fill="url(#flame1)" />
      <path d="M150 200 Q160 145 155 120 Q170 150 175 110 Q178 160 185 200 Z" fill="url(#flame2)" />
      {/* Embers/sparks */}
      {[
        [30, 90, 1.5], [70, 70, 1], [120, 80, 1.2], [160, 60, 0.8],
        [45, 50, 0.7], [95, 55, 1], [140, 45, 0.9], [180, 75, 0.6],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 === 0 ? '#ff8c00' : '#ffcc00'} opacity={0.3 + (i % 3) * 0.1} />
      ))}
      {/* Heat haze */}
      <ellipse cx="100" cy="180" rx="100" ry="20" fill="#ff4500" opacity="0.08" />
    </>
  );
}

export const backgroundSVGs: Record<string, React.FC> = {
  fundo_padrao: BgPadrao,
  fundo_matrix: BgMatrix,
  fundo_galaxy: BgGalaxy,
  fundo_neon: BgNeon,
  fundo_fire: BgFire,
};

// ═══════════════════════════════════════════════════════
//  SVG HAIR
// ═══════════════════════════════════════════════════════

export function HairPadrao({ color }: { color?: string }) {
  const c = color || '#3d2b1f';
  return (
    <g>
      {/* Base hair shape - short neat style */}
      <ellipse cx="100" cy="62" rx="38" ry="15" fill={c} />
      <path d="M62 70 Q62 45 80 38 Q95 32 100 30 Q105 32 120 38 Q138 45 138 70 L135 68 Q135 50 100 42 Q65 50 65 68 Z" fill={c} />
      {/* Hair shine */}
      <path d="M78 42 Q90 36 102 38" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Side details */}
      <path d="M62 70 Q60 75 63 80" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M138 70 Q140 75 137 80" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function HairMoicano({ color }: { color?: string }) {
  const c = color || '#2196F3';
  return (
    <g>
      {/* Shaved sides */}
      <path d="M65 72 Q65 58 78 52 L82 55 Q70 60 70 72 Z" fill="#1a1a2e" opacity="0.5" />
      <path d="M135 72 Q135 58 122 52 L118 55 Q130 60 130 72 Z" fill="#1a1a2e" opacity="0.5" />
      {/* Mohawk spike */}
      <path d="M88 55 Q92 18 100 10 Q108 18 112 55 Z" fill={c} />
      {/* Mohawk details - ridges */}
      <path d="M92 50 Q96 22 100 15 Q104 22 108 50" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
      <path d="M95 48 Q98 28 100 20 Q102 28 105 48" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
      {/* Base connecting to head */}
      <path d="M85 60 Q90 52 100 48 Q110 52 115 60 L112 62 Q107 55 100 52 Q93 55 88 62 Z" fill={c} />
      {/* Glow effect */}
      <ellipse cx="100" cy="30" rx="8" ry="3" fill={c} opacity="0.3" filter="blur(2px)" />
    </g>
  );
}

export function HairLongo({ color }: { color?: string }) {
  const c = color || '#1a0a2e';
  return (
    <g>
      {/* Main long hair flowing down */}
      <path d="M62 65 Q58 50 70 38 Q85 28 100 26 Q115 28 130 38 Q142 50 138 65 L140 80 Q142 100 140 120 Q138 135 130 140 L120 138 Q130 130 130 110 Q132 90 130 72 L130 65" fill={c} />
      <path d="M62 65 L60 80 Q58 100 60 120 Q62 135 70 140 L80 138 Q70 130 70 110 Q68 90 70 72 L70 65" fill={c} />
      {/* Center top */}
      <ellipse cx="100" cy="58" rx="38" ry="14" fill={c} />
      <path d="M68 60 Q68 40 85 32 Q95 28 100 26 Q105 28 115 32 Q132 40 132 60" fill={c} />
      {/* Hair strands */}
      <path d="M70 70 Q68 95 72 125" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />
      <path d="M80 65 Q78 90 80 120" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
      <path d="M130 70 Q132 95 128 125" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />
      <path d="M120 65 Q122 90 120 120" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
      {/* Hair shine */}
      <path d="M78 38 Q90 30 110 34" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function HairCacheado({ color }: { color?: string }) {
  const c = color || '#2c1810';
  return (
    <g>
      {/* Curly volume - multiple overlapping circles */}
      {/* Top row */}
      <circle cx="78" cy="48" r="12" fill={c} />
      <circle cx="95" cy="42" r="13" fill={c} />
      <circle cx="112" cy="42" r="13" fill={c} />
      <circle cx="126" cy="48" r="12" fill={c} />
      {/* Middle row */}
      <circle cx="68" cy="60" r="11" fill={c} />
      <circle cx="85" cy="52" r="12" fill={c} />
      <circle cx="100" cy="48" r="14" fill={c} />
      <circle cx="115" cy="52" r="12" fill={c} />
      <circle cx="132" cy="60" r="11" fill={c} />
      {/* Side volumes */}
      <circle cx="60" cy="72" r="10" fill={c} />
      <circle cx="58" cy="85" r="9" fill={c} />
      <circle cx="140" cy="72" r="10" fill={c} />
      <circle cx="142" cy="85" r="9" fill={c} />
      {/* Curl details - lighter rings */}
      <circle cx="80" cy="46" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="105" cy="42" r="4" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <circle cx="120" cy="48" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="65" cy="68" r="4" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <circle cx="135" cy="68" r="4" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* Highlight */}
      <path d="M82 40 Q95 34 108 38" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function HairColorido({ color }: { color?: string }) {
  return (
    <g>
      <defs>
        <linearGradient id="hair_rgb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff00ff" />
          <stop offset="33%" stopColor="#00ffff" />
          <stop offset="66%" stopColor="#ff00ff" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
        <linearGradient id="hair_rgb_glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#00ffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Spiky RGB hair */}
      <path d="M70 65 Q65 42 75 22 Q82 35 85 55 Q88 30 95 15 Q98 38 98 50 Q100 20 105 8 Q108 35 105 50 Q108 25 118 18 Q116 40 115 55 Q120 32 130 25 Q128 48 125 65 Z" fill="url(#hair_rgb)" />
      {/* Base connecting */}
      <path d="M65 68 Q65 52 80 44 Q92 38 100 36 Q108 38 120 44 Q135 52 135 68 L130 65 Q130 55 100 42 Q70 55 70 65 Z" fill="url(#hair_rgb)" />
      {/* Glow effect */}
      <path d="M70 65 Q65 42 75 22 Q82 35 85 55 Q88 30 95 15 Q98 38 98 50 Q100 20 105 8 Q108 35 105 50 Q108 25 118 18 Q116 40 115 55 Q120 32 130 25 Q128 48 125 65 Z" fill="url(#hair_rgb_glow)" />
      {/* Sparkle effects */}
      <circle cx="82" cy="30" r="2" fill="white" opacity="0.6" />
      <circle cx="105" cy="18" r="1.5" fill="white" opacity="0.5" />
      <circle cx="125" cy="32" r="1.5" fill="white" opacity="0.4" />
    </g>
  );
}

export const hairSVGs: Record<string, React.FC<{ color?: string }>> = {
  cabelo_padrao: HairPadrao,
  cabelo_moicano: HairMoicano,
  cabelo_longo: HairLongo,
  cabelo_cacheado: HairCacheado,
  cabelo_colorido: HairColorido,
};

// ═══════════════════════════════════════════════════════
//  SVG FACES
// ═══════════════════════════════════════════════════════

export function FacePadrao() {
  return (
    <g>
      {/* Eyes */}
      <ellipse cx="88" cy="78" rx="4.5" ry="5" fill="white" />
      <ellipse cx="112" cy="78" rx="4.5" ry="5" fill="white" />
      <circle cx="89" cy="78" r="2.5" fill="#1a1a2e" />
      <circle cx="113" cy="78" r="2.5" fill="#1a1a2e" />
      {/* Eye shine */}
      <circle cx="90.5" cy="76.5" r="1" fill="white" />
      <circle cx="114.5" cy="76.5" r="1" fill="white" />
      {/* Eyebrows */}
      <path d="M82 72 Q88 69 94 72" stroke="#3d2b1f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M106 72 Q112 69 118 72" stroke="#3d2b1f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M98 84 Q100 87 102 84" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Friendly smile */}
      <path d="M90 92 Q95 98 100 98 Q105 98 110 92" stroke="#c0392b" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Rosy cheeks */}
      <ellipse cx="82" cy="90" rx="5" ry="3" fill="#ff6b6b" opacity="0.15" />
      <ellipse cx="118" cy="90" rx="5" ry="3" fill="#ff6b6b" opacity="0.15" />
    </g>
  );
}

export function FaceOculos() {
  return (
    <g>
      {/* Eyes behind glasses */}
      <ellipse cx="88" cy="78" rx="3.5" ry="4" fill="white" />
      <ellipse cx="112" cy="78" rx="3.5" ry="4" fill="white" />
      <circle cx="88.5" cy="78" r="2" fill="#1a1a2e" />
      <circle cx="112.5" cy="78" r="2" fill="#1a1a2e" />
      <circle cx="89.5" cy="76.5" r="0.8" fill="white" />
      <circle cx="113.5" cy="76.5" r="0.8" fill="white" />
      {/* Glasses frames - round nerdy style */}
      <circle cx="88" cy="78" r="11" fill="none" stroke="#333" strokeWidth="2.5" />
      <circle cx="112" cy="78" r="11" fill="none" stroke="#333" strokeWidth="2.5" />
      {/* Glasses bridge */}
      <path d="M99 78 Q100 75 101 78" stroke="#333" strokeWidth="2" fill="none" />
      {/* Glasses arms */}
      <line x1="77" y1="76" x2="65" y2="74" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <line x1="123" y1="76" x2="135" y2="74" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      {/* Lens reflection */}
      <path d="M82 72 Q85 70 88 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
      <path d="M106 72 Q109 70 112 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
      {/* Eyebrows over glasses */}
      <path d="M80 66 Q88 62 96 66" stroke="#3d2b1f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M104 66 Q112 62 120 66" stroke="#3d2b1f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M98 86 Q100 89 102 86" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Small smile */}
      <path d="M92 94 Q96 98 100 98 Q104 98 108 94" stroke="#c0392b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Rosy cheeks */}
      <ellipse cx="80" cy="90" rx="4" ry="2.5" fill="#ff6b6b" opacity="0.12" />
      <ellipse cx="120" cy="90" rx="4" ry="2.5" fill="#ff6b6b" opacity="0.12" />
    </g>
  );
}

export function FaceSunglasses() {
  return (
    <g>
      {/* Cool sunglasses - angular style */}
      <defs>
        <linearGradient id="sunglass_lens" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="40%" stopColor="#2a2a4e" />
          <stop offset="100%" stopColor="#0a0a1e" />
        </linearGradient>
      </defs>
      {/* Left lens */}
      <path d="M76 72 L98 72 L96 86 Q92 90 82 90 Q76 88 74 84 Z" fill="url(#sunglass_lens)" stroke="#444" strokeWidth="2" />
      {/* Right lens */}
      <path d="M102 72 L124 72 L126 84 Q124 88 118 90 Q108 90 104 86 Z" fill="url(#sunglass_lens)" stroke="#444" strokeWidth="2" />
      {/* Bridge */}
      <path d="M98 76 Q100 74 102 76" stroke="#444" strokeWidth="2.5" fill="none" />
      {/* Arms */}
      <line x1="76" y1="74" x2="64" y2="72" stroke="#444" strokeWidth="2" strokeLinecap="round" />
      <line x1="124" y1="74" x2="136" y2="72" stroke="#444" strokeWidth="2" strokeLinecap="round" />
      {/* Lens reflection lines */}
      <line x1="80" y1="75" x2="88" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />
      <line x1="108" y1="75" x2="116" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />
      {/* Confident eyebrows */}
      <path d="M78 68 Q86 63 96 67" stroke="#3d2b1f" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M104 67 Q114 63 122 68" stroke="#3d2b1f" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M98 88 Q100 91 102 88" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Confident smirk */}
      <path d="M92 96 Q98 100 108 95" stroke="#c0392b" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function FaceMascara() {
  return (
    <g>
      {/* Hacker mask - covers top half of face */}
      <defs>
        <linearGradient id="mask_grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0d0d1a" />
        </linearGradient>
      </defs>
      {/* Mask shape */}
      <path d="M68 68 Q68 60 80 58 Q92 56 100 55 Q108 56 120 58 Q132 60 132 68 L132 88 Q130 92 120 94 Q110 96 100 96 Q90 96 80 94 Q70 92 68 88 Z" fill="url(#mask_grad)" stroke="#333" strokeWidth="1.5" />
      {/* Eye holes with glowing eyes */}
      <ellipse cx="86" cy="76" rx="8" ry="6" fill="#0a0a0a" />
      <ellipse cx="114" cy="76" rx="8" ry="6" fill="#0a0a0a" />
      {/* Glowing eyes */}
      <ellipse cx="86" cy="76" rx="4" ry="3" fill="#00ff41" opacity="0.8" />
      <ellipse cx="114" cy="76" rx="4" ry="3" fill="#00ff41" opacity="0.8" />
      {/* Eye glow */}
      <ellipse cx="86" cy="76" rx="6" ry="4" fill="#00ff41" opacity="0.15" />
      <ellipse cx="114" cy="76" rx="6" ry="4" fill="#00ff41" opacity="0.15" />
      {/* Pupil slits */}
      <ellipse cx="86" cy="76" rx="1.5" ry="3" fill="#003300" />
      <ellipse cx="114" cy="76" rx="1.5" ry="3" fill="#003300" />
      {/* Mask texture lines */}
      <path d="M72 72 L128 72" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      <path d="M70 80 L130 80" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      <path d="M72 88 L128 88" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      {/* Mouth slit */}
      <path d="M92 100 Q96 103 100 103 Q104 103 108 100" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

export const faceSVGs: Record<string, React.FC> = {
  rosto_padrao: FacePadrao,
  rosto_oculos: FaceOculos,
  rosto_sunglasses: FaceSunglasses,
  rosto_mascara: FaceMascara,
};

// ═══════════════════════════════════════════════════════
//  SVG CLOTHES
// ═══════════════════════════════════════════════════════

export function ClothePadrao({ skinColor }: { skinColor: string }) {
  return (
    <g>
      {/* Neck */}
      <rect x="92" y="104" width="16" height="10" fill={skinColor} rx="3" />
      {/* T-shirt body */}
      <path d="M72 118 Q72 112 80 110 L92 112 Q96 114 100 114 Q104 114 108 112 L120 110 Q128 112 128 118 L132 155 Q132 162 125 165 L75 165 Q68 162 68 155 Z" fill="#4a90d9" />
      {/* Collar */}
      <path d="M88 112 Q96 118 100 118 Q104 118 112 112" stroke="#3a7bc8" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Sleeves */}
      <path d="M72 118 L58 128 Q55 130 56 134 L62 132 L72 124 Z" fill="#4a90d9" />
      <path d="M128 118 L142 128 Q145 130 144 134 L138 132 L128 124 Z" fill="#4a90d9" />
      {/* Sleeve cuffs */}
      <path d="M56 132 L62 134" stroke="#3a7bc8" strokeWidth="1.5" fill="none" />
      <path d="M144 132 L138 134" stroke="#3a7bc8" strokeWidth="1.5" fill="none" />
      {/* Shirt fold lines */}
      <path d="M95 130 Q98 145 96 158" stroke="rgba(0,0,0,0.08)" strokeWidth="1" fill="none" />
      <path d="M108 125 Q106 140 108 155" stroke="rgba(0,0,0,0.08)" strokeWidth="1" fill="none" />
      {/* Bottom hem */}
      <path d="M70 162 L130 162" stroke="#3a7bc8" strokeWidth="1.5" fill="none" />
    </g>
  );
}

export function ClotheHoodie({ skinColor }: { skinColor: string }) {
  return (
    <g>
      {/* Neck */}
      <rect x="92" y="104" width="16" height="10" fill={skinColor} rx="3" />
      {/* Hoodie body */}
      <path d="M68 118 Q68 110 78 108 L90 111 Q96 114 100 114 Q104 114 110 111 L122 108 Q132 110 132 118 L136 160 Q136 168 128 170 L72 170 Q64 168 64 160 Z" fill="#555" />
      {/* Hood */}
      <path d="M78 108 Q75 100 80 95 Q90 88 100 86 Q110 88 120 95 Q125 100 122 108" fill="#4a4a4a" stroke="#3a3a3a" strokeWidth="1" />
      {/* Hood inner */}
      <path d="M82 108 Q80 102 84 98 Q92 92 100 90 Q108 92 116 98 Q120 102 118 108" fill="#3a3a3a" />
      {/* Pocket */}
      <path d="M82 142 L118 142 Q120 142 120 144 L120 156 Q120 158 118 158 L82 158 Q80 158 80 156 L80 144 Q80 142 82 142 Z" fill="#4a4a4a" stroke="#3a3a3a" strokeWidth="1" />
      {/* Pocket line */}
      <line x1="100" y1="142" x2="100" y2="158" stroke="#3a3a3a" strokeWidth="0.8" />
      {/* Drawstrings */}
      <line x1="94" y1="108" x2="92" y2="128" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="106" y1="108" x2="108" y2="128" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
      {/* Drawstring tips */}
      <circle cx="92" cy="129" r="1.5" fill="#aaa" />
      <circle cx="108" cy="129" r="1.5" fill="#aaa" />
      {/* Sleeves */}
      <path d="M68 118 L52 130 Q48 133 50 138 L56 135 L68 126 Z" fill="#555" />
      <path d="M132 118 L148 130 Q152 133 150 138 L144 135 L132 126 Z" fill="#555" />
      {/* Fold lines */}
      <path d="M90 120 Q92 138 90 155" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" fill="none" />
      {/* Zipper */}
      <line x1="100" y1="110" x2="100" y2="142" stroke="#888" strokeWidth="1.5" />
      {/* Zipper teeth marks */}
      {[115, 120, 125, 130, 135].map(y => (
        <React.Fragment key={y}>
          <line x1="98" y1={y} x2="100" y2={y} stroke="#999" strokeWidth="0.8" />
          <line x1="100" y1={y} x2="102" y2={y} stroke="#999" strokeWidth="0.8" />
        </React.Fragment>
      ))}
    </g>
  );
}

export function ClotheFormal({ skinColor }: { skinColor: string }) {
  return (
    <g>
      {/* Neck */}
      <rect x="92" y="104" width="16" height="10" fill={skinColor} rx="3" />
      {/* White shirt underneath */}
      <path d="M85 112 L100 120 L115 112 L115 165 L85 165 Z" fill="#f5f5f5" />
      {/* Suit jacket */}
      <path d="M68 118 Q68 110 78 108 L88 112 L100 120 L112 112 L122 108 Q132 110 132 118 L136 160 Q136 168 128 170 L72 170 Q64 168 64 160 Z" fill="#1a2744" />
      {/* Jacket lapels */}
      <path d="M88 112 L96 128 L100 120 Z" fill="#152238" />
      <path d="M112 112 L104 128 L100 120 Z" fill="#152238" />
      {/* Lapel edges */}
      <path d="M88 112 L96 128" stroke="#0f1a2e" strokeWidth="1" fill="none" />
      <path d="M112 112 L104 128" stroke="#0f1a2e" strokeWidth="1" fill="none" />
      {/* Collar */}
      <path d="M86 110 Q92 106 100 108 Q108 106 114 110" stroke="#ddd" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Tie */}
      <path d="M98 114 L96 118 L100 140 L104 118 L102 114 Z" fill="#c0392b" />
      <path d="M97 114 L100 118 L103 114 Z" fill="#e74c3c" />
      {/* Tie knot */}
      <ellipse cx="100" cy="115" rx="3" ry="2" fill="#a93226" />
      {/* Sleeve ends */}
      <path d="M68 118 L52 130 Q48 133 50 138 L56 135 L68 126 Z" fill="#1a2744" />
      <path d="M132 118 L148 130 Q152 133 150 138 L144 135 L132 126 Z" fill="#1a2744" />
      {/* Button */}
      <circle cx="100" cy="148" r="2" fill="#1a2744" stroke="#333" strokeWidth="0.5" />
      {/* Jacket pocket lines */}
      <line x1="76" y1="142" x2="88" y2="142" stroke="#0f1a2e" strokeWidth="1" strokeLinecap="round" />
      <line x1="112" y1="142" x2="124" y2="142" stroke="#0f1a2e" strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

export function ClotheMatrix({ skinColor }: { skinColor: string }) {
  return (
    <g>
      <defs>
        <linearGradient id="matrix_cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
      </defs>
      {/* Neck */}
      <rect x="92" y="104" width="16" height="10" fill={skinColor} rx="3" />
      {/* Matrix jacket */}
      <path d="M65 118 Q65 108 78 106 L90 110 Q96 114 100 114 Q104 114 110 110 L122 106 Q135 108 135 118 L140 165 Q140 175 130 178 L70 178 Q60 175 60 165 Z" fill="url(#matrix_cloth)" />
      {/* High collar */}
      <path d="M82 108 Q82 98 88 94 Q96 90 100 90 Q104 90 112 94 Q118 98 118 108" fill="#0a0a0a" stroke="#222" strokeWidth="1" />
      <path d="M85 108 Q85 100 90 97 Q96 93 100 93 Q104 93 110 97 Q115 100 115 108" fill="#111" />
      {/* Jacket front opening */}
      <line x1="100" y1="108" x2="100" y2="178" stroke="#222" strokeWidth="1.5" />
      {/* Matrix code on jacket */}
      <text x="75" y="135" fill="#00ff41" fontSize="5" fontFamily="monospace" opacity="0.15">01</text>
      <text x="78" y="148" fill="#00ff41" fontSize="5" fontFamily="monospace" opacity="0.1">10</text>
      <text x="120" y="138" fill="#00ff41" fontSize="5" fontFamily="monospace" opacity="0.12">11</text>
      <text x="115" y="155" fill="#00ff41" fontSize="5" fontFamily="monospace" opacity="0.1">00</text>
      {/* Sleeve extensions */}
      <path d="M65 118 L46 132 Q42 136 44 142 L50 138 L65 126 Z" fill="url(#matrix_cloth)" />
      <path d="M135 118 L154 132 Q158 136 156 142 L150 138 L135 126 Z" fill="url(#matrix_cloth)" />
      {/* Belt */}
      <rect x="68" y="158" width="64" height="4" fill="#222" rx="1" />
      <rect x="96" y="157" width="8" height="6" fill="#444" rx="1" />
      {/* Subtle edge highlights */}
      <path d="M65 120 L60 165" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      <path d="M135 120 L140 165" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
    </g>
  );
}

export function ClotheAstronauta({ skinColor }: { skinColor: string }) {
  return (
    <g>
      <defs>
        <linearGradient id="astro_suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#c0c0c0" />
        </linearGradient>
      </defs>
      {/* Helmet ring */}
      <ellipse cx="100" cy="105" rx="22" ry="6" fill="#bbb" stroke="#999" strokeWidth="1.5" />
      {/* Suit body */}
      <path d="M62 115 Q62 108 76 106 L88 110 Q96 114 100 114 Q104 114 112 110 L124 106 Q138 108 138 115 L142 162 Q142 172 132 175 L68 175 Q58 172 58 162 Z" fill="url(#astro_suit)" />
      {/* Suit details - panels */}
      <path d="M80 115 L80 170" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      <path d="M120 115 L120 170" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      {/* Chest panel */}
      <rect x="86" y="118" width="28" height="22" fill="#ddd" stroke="#bbb" strokeWidth="1" rx="3" />
      {/* Buttons/indicators on panel */}
      <circle cx="92" cy="125" r="2" fill="#ef4444" />
      <circle cx="100" cy="125" r="2" fill="#22c55e" />
      <circle cx="108" cy="125" r="2" fill="#3b82f6" />
      {/* Panel lines */}
      <line x1="88" y1="132" x2="112" y2="132" stroke="#bbb" strokeWidth="0.5" />
      <rect x="90" y="134" width="20" height="3" fill="#ccc" rx="1" />
      {/* Belt/life support */}
      <rect x="68" y="150" width="64" height="6" fill="#999" rx="2" />
      <rect x="94" y="149" width="12" height="8" fill="#777" rx="2" />
      {/* Suit pockets */}
      <rect x="70" y="134" width="8" height="10" fill="#d0d0d0" stroke="#bbb" strokeWidth="0.5" rx="1" />
      <rect x="122" y="134" width="8" height="10" fill="#d0d0d0" stroke="#bbb" strokeWidth="0.5" rx="1" />
      {/* Arm joints */}
      <path d="M62 115 L45 128 Q40 132 42 138 L50 134 L62 124 Z" fill="url(#astro_suit)" />
      <path d="M138 115 L155 128 Q160 132 158 138 L150 134 L138 124 Z" fill="url(#astro_suit)" />
      {/* Flag patch */}
      <rect x="123" y="118" width="8" height="5" fill="#3b82f6" rx="0.5" />
      <line x1="123" y1="120" x2="131" y2="120" stroke="white" strokeWidth="0.5" />
      <line x1="123" y1="121.5" x2="131" y2="121.5" stroke="#ef4444" strokeWidth="0.5" />
    </g>
  );
}

export const clothesSVGs: Record<string, React.FC<{ skinColor: string }>> = {
  roupa_padrao: ClothePadrao,
  roupa_hoodie: ClotheHoodie,
  roupa_formal: ClotheFormal,
  roupa_matrix: ClotheMatrix,
  roupa_astronauta: ClotheAstronauta,
};

// ═══════════════════════════════════════════════════════
//  SVG ACCESSORIES
// ═══════════════════════════════════════════════════════

export function AccFone() {
  return (
    <g>
      {/* Headband */}
      <path d="M62 68 Q60 48 75 38 Q88 30 100 28 Q112 30 125 38 Q140 48 138 68" stroke="#333" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M62 68 Q60 48 75 38 Q88 30 100 28 Q112 30 125 38 Q140 48 138 68" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Padding on top */}
      <path d="M85 30 Q92 26 100 25 Q108 26 115 30" stroke="#444" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Left ear cup */}
      <ellipse cx="60" cy="76" rx="10" ry="14" fill="#333" stroke="#222" strokeWidth="1.5" />
      <ellipse cx="59" cy="76" rx="7" ry="11" fill="#2a2a2a" />
      {/* Left cup detail */}
      <circle cx="59" cy="76" r="4" fill="none" stroke="#444" strokeWidth="0.8" />
      {/* Right ear cup */}
      <ellipse cx="140" cy="76" rx="10" ry="14" fill="#333" stroke="#222" strokeWidth="1.5" />
      <ellipse cx="141" cy="76" rx="7" ry="11" fill="#2a2a2a" />
      {/* Right cup detail */}
      <circle cx="141" cy="76" r="4" fill="none" stroke="#444" strokeWidth="0.8" />
      {/* LED accent */}
      <circle cx="59" cy="76" r="2" fill="#00d4ff" opacity="0.6" />
      <circle cx="141" cy="76" r="2" fill="#00d4ff" opacity="0.6" />
    </g>
  );
}

export function AccCafe() {
  return (
    <g transform="translate(140, 120) scale(0.8)">
      {/* Cup body */}
      <path d="M0 0 L4 40 Q5 45 15 45 Q25 45 26 40 L30 0 Z" fill="#f5f5f0" stroke="#ddd" strokeWidth="1" />
      {/* Cup rim */}
      <ellipse cx="15" cy="0" rx="16" ry="4" fill="#fff" stroke="#ddd" strokeWidth="1" />
      {/* Handle */}
      <path d="M30 10 Q42 12 42 22 Q42 32 30 34" stroke="#ddd" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Coffee liquid */}
      <ellipse cx="15" cy="5" rx="12" ry="3" fill="#6b3a1f" opacity="0.7" />
      {/* Steam */}
      <path d="M8 -5 Q6 -15 10 -20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M15 -8 Q13 -18 17 -25" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M22 -4 Q20 -14 24 -19" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Heart on cup */}
      <path d="M12 18 Q12 14 15 14 Q18 14 18 18 Q18 14 21 14 Q24 14 24 18 Q24 24 18 28 Q12 24 12 18 Z" fill="#e74c3c" opacity="0.4" transform="scale(0.6) translate(6, 10)" />
    </g>
  );
}

export function AccGato() {
  return (
    <g transform="translate(130, 130) scale(0.7)">
      {/* Cat body */}
      <ellipse cx="25" cy="40" rx="18" ry="14" fill="#ff9966" />
      {/* Cat head */}
      <circle cx="25" cy="22" r="14" fill="#ff9966" />
      {/* Ears */}
      <path d="M14 14 L10 2 L20 10 Z" fill="#ff9966" />
      <path d="M36 14 L40 2 L30 10 Z" fill="#ff9966" />
      <path d="M15 13 L12 4 L19 11 Z" fill="#ffb088" />
      <path d="M35 13 L38 4 L31 11 Z" fill="#ffb088" />
      {/* Eyes */}
      <ellipse cx="20" cy="20" rx="3" ry="3.5" fill="#2a2a2a" />
      <ellipse cx="30" cy="20" rx="3" ry="3.5" fill="#2a2a2a" />
      <circle cx="19" cy="19" r="1" fill="white" />
      <circle cx="29" cy="19" r="1" fill="white" />
      {/* Nose */}
      <path d="M24 24 L25 26 L26 24 Z" fill="#ff6b6b" />
      {/* Mouth */}
      <path d="M25 26 Q22 28 20 27" stroke="#cc6644" strokeWidth="0.8" fill="none" />
      <path d="M25 26 Q28 28 30 27" stroke="#cc6644" strokeWidth="0.8" fill="none" />
      {/* Whiskers */}
      <line x1="14" y1="23" x2="2" y2="21" stroke="#cc8866" strokeWidth="0.6" />
      <line x1="14" y1="25" x2="2" y2="26" stroke="#cc8866" strokeWidth="0.6" />
      <line x1="36" y1="23" x2="48" y2="21" stroke="#cc8866" strokeWidth="0.6" />
      <line x1="36" y1="25" x2="48" y2="26" stroke="#cc8866" strokeWidth="0.6" />
      {/* Tail */}
      <path d="M43 40 Q55 30 52 18" stroke="#ff9966" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Stripes */}
      <path d="M18 32 Q25 28 32 32" stroke="#e88855" strokeWidth="1" fill="none" />
      <path d="M16 38 Q25 34 34 38" stroke="#e88855" strokeWidth="1" fill="none" />
    </g>
  );
}

export function AccCoroa() {
  return (
    <g>
      <defs>
        <linearGradient id="crown_gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="50%" stopColor="#ffaa00" />
          <stop offset="100%" stopColor="#ff8c00" />
        </linearGradient>
      </defs>
      {/* Crown base */}
      <path d="M72 52 L72 38 L80 46 L88 30 L96 44 L100 26 L104 44 L112 30 L120 46 L128 38 L128 52 Z" fill="url(#crown_gold)" stroke="#cc8800" strokeWidth="1" />
      {/* Crown band */}
      <rect x="72" y="48" width="56" height="6" fill="url(#crown_gold)" stroke="#cc8800" strokeWidth="0.5" rx="1" />
      {/* Jewels */}
      <circle cx="84" cy="51" r="2.5" fill="#e74c3c" />
      <circle cx="100" cy="51" r="3" fill="#3b82f6" />
      <circle cx="116" cy="51" r="2.5" fill="#22c55e" />
      {/* Crown point jewels */}
      <circle cx="88" cy="32" r="1.5" fill="#e74c3c" />
      <circle cx="100" cy="28" r="2" fill="#9333ea" />
      <circle cx="112" cy="32" r="1.5" fill="#e74c3c" />
      {/* Shine effects */}
      <path d="M76 42 L82 44" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
      <path d="M96 36 L102 38" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
      {/* Crown glow */}
      <ellipse cx="100" cy="40" rx="30" ry="8" fill="#ffd700" opacity="0.08" />
    </g>
  );
}

export function AccRaio() {
  return (
    <g>
      {/* Electric aura - outer ring */}
      <circle cx="100" cy="100" r="92" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.15" />
      <circle cx="100" cy="100" r="85" fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity="0.1" />
      {/* Lightning bolts around the avatar */}
      {/* Top-right */}
      <path d="M140 30 L135 48 L145 45 L132 65" stroke="#00d4ff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Top-left */}
      <path d="M60 35 L65 50 L55 48 L68 62" stroke="#7c3aed" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Bottom-right */}
      <path d="M155 120 L145 135 L155 132 L140 148" stroke="#00d4ff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Bottom-left */}
      <path d="M45 125 L55 138 L45 136 L58 150" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Electric sparks */}
      {[
        [148, 55, 3], [52, 55, 2.5], [160, 100, 2], [40, 100, 2],
        [150, 145, 2.5], [50, 150, 2], [130, 20, 2], [70, 22, 2],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 === 0 ? '#00d4ff' : '#7c3aed'} opacity={0.2 + (i % 3) * 0.1} />
      ))}
      {/* Center energy glow */}
      <circle cx="100" cy="100" r="50" fill="#00d4ff" opacity="0.03" />
    </g>
  );
}

export const accessorySVGs: Record<string, React.FC> = {
  acessorio_fone: AccFone,
  acessorio_cafe: AccCafe,
  acessorio_gato: AccGato,
  acessorio_coroa: AccCoroa,
  acessorio_raio: AccRaio,
};

// ═══════════════════════════════════════════════════════
//  ITEM PREVIEW SVG (for store cards)
// ═══════════════════════════════════════════════════════

export function ItemPreviewSVG({ itemId, size = 64 }: { itemId: string; size?: number }) {
  const renderContent = () => {
    // Hair previews
    if (itemId.startsWith('cabelo_')) {
      const HairComp = hairSVGs[itemId];
      if (!HairComp) return null;
      return (
        <g transform="translate(0, 20)">
          <HairComp />
        </g>
      );
    }
    // Face previews
    if (itemId.startsWith('rosto_')) {
      const FaceComp = faceSVGs[itemId];
      if (!FaceComp) return null;
      return (
        <>
          <circle cx="100" cy="85" r="35" fill="#f4c28d" />
          <FaceComp />
        </>
      );
    }
    // Clothing previews
    if (itemId.startsWith('roupa_')) {
      const ClotheComp = clothesSVGs[itemId];
      if (!ClotheComp) return null;
      return (
        <g transform="translate(0, -15)">
          <ClotheComp skinColor="#f4c28d" />
        </g>
      );
    }
    // Accessory previews
    if (itemId.startsWith('acessorio_') && itemId !== 'acessorio_nenhum') {
      const AccComp = accessorySVGs[itemId];
      if (!AccComp) return null;
      return <AccComp />;
    }
    // Background previews
    if (itemId.startsWith('fundo_')) {
      const BgComp = backgroundSVGs[itemId];
      if (!BgComp) return null;
      return (
        <>
          <BgComp />
          <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        </>
      );
    }
    return null;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ borderRadius: '50%', overflow: 'hidden' }}
    >
      <defs>
        <clipPath id={`preview_clip_${itemId}`}>
          <circle cx="100" cy="100" r="98" />
        </clipPath>
      </defs>
      <g clipPath={`url(#preview_clip_${itemId})`}>
        <rect width="200" height="200" fill="#1a1a2e" />
        {renderContent()}
      </g>
    </svg>
  );
}
