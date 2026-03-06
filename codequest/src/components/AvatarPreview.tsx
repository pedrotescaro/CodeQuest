'use client';

import React from 'react';
import { AvatarConfig } from '@/lib/avatarData';
import { backgroundSVGs, hairSVGs, faceSVGs, clothesSVGs, accessorySVGs } from './AvatarSVGs';

interface AvatarPreviewProps {
  config: AvatarConfig;
  size?: number;
  showBadge?: boolean;
  nivel?: number;
}

export default function AvatarPreview({ config, size = 120, showBadge, nivel }: AvatarPreviewProps) {
  const BgComponent = backgroundSVGs[config.fundo] || backgroundSVGs.fundo_padrao;
  const HairComponent = hairSVGs[config.cabelo] || hairSVGs.cabelo_padrao;
  const FaceComponent = faceSVGs[config.rosto] || faceSVGs.rosto_padrao;
  const ClotheComponent = clothesSVGs[config.roupa] || clothesSVGs.roupa_padrao;
  const AccComponent = config.acessorio !== 'acessorio_nenhum' ? accessorySVGs[config.acessorio] : null;

  const uid = React.useId();

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid rgba(0, 212, 255, 0.25)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
        }}
      >
        <defs>
          <clipPath id={`avatar_clip_${uid}`}>
            <circle cx="100" cy="100" r="98" />
          </clipPath>
        </defs>
        <g clipPath={`url(#avatar_clip_${uid})`}>
          {/* Layer 1: Background */}
          <BgComponent />

          {/* Layer 2: Body / Neck area — skin tone ellipse */}
          <ellipse cx="100" cy="108" rx="18" ry="12" fill={config.corPele} />

          {/* Layer 3: Clothes */}
          <ClotheComponent skinColor={config.corPele} />

          {/* Layer 4: Head — skin circle */}
          <circle cx="100" cy="78" r="35" fill={config.corPele} />
          {/* Subtle head shadow */}
          <circle cx="100" cy="78" r="35" fill="rgba(0,0,0,0.04)" />

          {/* Layer 5: Ears */}
          <ellipse cx="64" cy="80" rx="6" ry="8" fill={config.corPele} />
          <ellipse cx="64" cy="80" rx="4" ry="6" fill="rgba(0,0,0,0.05)" />
          <ellipse cx="136" cy="80" rx="6" ry="8" fill={config.corPele} />
          <ellipse cx="136" cy="80" rx="4" ry="6" fill="rgba(0,0,0,0.05)" />

          {/* Layer 6: Face features */}
          <FaceComponent />

          {/* Layer 7: Hair */}
          <HairComponent />

          {/* Layer 8: Accessory (on top of everything) */}
          {AccComponent && <AccComponent />}
        </g>
      </svg>

      {/* Level badge (HTML for better text rendering) */}
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
          zIndex: 1,
        }}>
          Lvl {nivel}
        </div>
      )}
    </div>
  );
}
