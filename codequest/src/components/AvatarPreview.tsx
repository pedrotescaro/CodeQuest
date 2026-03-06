'use client';

import { AvatarConfig, getItem } from '@/lib/avatarData';

interface AvatarPreviewProps {
  config: AvatarConfig;
  size?: number;
  showBadge?: boolean;
  nivel?: number;
}

const fundoStyles: Record<string, { bg: string; effect?: string }> = {
  fundo_padrao:  { bg: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
  fundo_matrix:  { bg: 'linear-gradient(135deg, #0d1b0e, #1a3a1a)', effect: '💚' },
  fundo_galaxy:  { bg: 'linear-gradient(135deg, #0c0c2e, #1a0a3e, #0c0c2e)', effect: '✨' },
  fundo_neon:    { bg: 'linear-gradient(135deg, #1a0030, #000830, #002020)', effect: '🏙️' },
  fundo_fire:    { bg: 'linear-gradient(135deg, #1a0000, #3a0a00)', effect: '🔥' },
};

export default function AvatarPreview({ config, size = 120, showBadge, nivel }: AvatarPreviewProps) {
  const cabelo = getItem(config.cabelo);
  const rosto = getItem(config.rosto);
  const roupa = getItem(config.roupa);
  const acessorio = getItem(config.acessorio);
  const fundo = fundoStyles[config.fundo] || fundoStyles.fundo_padrao;

  const fontSize = size * 0.28;

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: fundo.bg,
      border: '3px solid rgba(0, 212, 255, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
    }}>
      {/* Background effect */}
      {fundo.effect && (
        <span style={{
          position: 'absolute',
          top: '8%',
          right: '12%',
          fontSize: size * 0.15,
          opacity: 0.5,
          pointerEvents: 'none',
        }}>
          {fundo.effect}
        </span>
      )}

      {/* Cabelo (topo) */}
      <span style={{ fontSize: fontSize * 0.75, lineHeight: 1, marginTop: -2 }}>
        {cabelo?.emoji || '💇'}
      </span>

      {/* Rosto (centro) */}
      <div style={{
        width: size * 0.45,
        height: size * 0.45,
        borderRadius: '50%',
        background: config.corPele,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <span style={{ fontSize: fontSize * 0.65 }}>
          {rosto?.emoji || '😊'}
        </span>
      </div>

      {/* Roupa (baixo) */}
      <span style={{ fontSize: fontSize * 0.65, lineHeight: 1, marginTop: -2 }}>
        {roupa?.emoji || '👕'}
      </span>

      {/* Acessório (canto) */}
      {acessorio && acessorio.id !== 'acessorio_nenhum' && (
        <span style={{
          position: 'absolute',
          bottom: '8%',
          right: '8%',
          fontSize: size * 0.18,
        }}>
          {acessorio.emoji}
        </span>
      )}

      {/* Level badge */}
      {showBadge && nivel !== undefined && (
        <div style={{
          position: 'absolute',
          bottom: -2,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          color: 'white',
          fontSize: size * 0.1,
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '999px',
          whiteSpace: 'nowrap',
        }}>
          Lvl {nivel}
        </div>
      )}
    </div>
  );
}
