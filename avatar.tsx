import React, { useId } from 'react';
import { cn } from '@/lib/utils';

/* ────────────────────────────────────────────────────────
   BASE CHIBI CHARACTER  —  Sevenbooom / boombim aesthetic
   - Rounded-square head (not oval)
   - Large bowl-cut hair blob
   - Tiny dark oval eyes, NO eye white
   - Huge rosy blush circles (signature feature)
   - Compact body, short stub arms
   - Separate pantsColor for realistic top/bottom split
──────────────────────────────────────────────────────── */

interface ChibiProps {
  skinColor?: string;
  hairColor?: string;
  hairStyle?: 'bun' | 'bunDouble' | 'spiky' | 'pigtails' | 'short' | 'cap' | 'sidePart' | 'bucketHat' | 'snapback' | 'none';
  hairAccessory?: React.ReactNode;
  glasses?: boolean;
  eyeStyle?: 'dots' | 'crescent' | 'hearts' | 'starry';
  cheekColor?: string;
  blush?: boolean;
  expression?: 'happy' | 'sad' | 'surprised' | 'determined';
  outfitColor?: string;
  outfitStyle?: 'overalls' | 'dress' | 'jacket' | 'uniform' | 'coat' | 'hoodie';
  pantsColor?: string;
  collarColor?: string;
  bootColor?: string;
  item?: React.ReactNode;
  className?: string;
  isWalking?: boolean;
  style?: React.CSSProperties;
}

export const ChibiCharacter = ({
  skinColor   = '#F5D8B8',
  hairColor   = '#1A1A1A',
  hairStyle   = 'short',
  hairAccessory,
  glasses     = false,
  eyeStyle    = 'dots',
  cheekColor  = '#F4907A',
  blush       = true,
  expression  = 'happy',
  outfitColor = '#B0C4DE',
  outfitStyle = 'overalls',
  pantsColor  = '#4A6A8E',
  collarColor = '#F0EDE8',
  bootColor   = '#E8E4DC',
  item,
  className,
  isWalking,
  style,
}: ChibiProps) => {
  const uid = useId().replace(/:/g, '');

  const HL  = `url(#${uid}hl)`;
  const SH  = `url(#${uid}sh)`;
  const BHL = `url(#${uid}bhl)`;
  const BSH = `url(#${uid}bsh)`;

  const mouthPath = {
    happy:      `M 44 72 Q 50 79 56 72`,
    sad:        `M 44 76 Q 50 70 56 76`,
    surprised:  `M 47 73 Q 50 80 53 73`,
    determined: `M 44 75 L 56 75`,
  }[expression];

  const eyeEl = (cx: number, cy: number) => {
    if (eyeStyle === 'crescent') return (
      <path d={`M ${cx-5} ${cy+2} Q ${cx} ${cy-5} ${cx+5} ${cy+2}`}
        fill="none" stroke={hairColor} strokeWidth="3" strokeLinecap="round" />
    );
    if (eyeStyle === 'hearts') return (
      <path d={`M ${cx} ${cy+1} C ${cx} ${cy-2} ${cx-4} ${cy-3} ${cx-4} ${cy} C ${cx-4} ${cy+3} ${cx} ${cy+5} ${cx} ${cy+5} C ${cx} ${cy+5} ${cx+4} ${cy+3} ${cx+4} ${cy} C ${cx+4} ${cy-3} ${cx} ${cy-2} ${cx} ${cy+1} Z`}
        fill="#E91E63" />
    );
    if (eyeStyle === 'starry') return (
      <g>
        <ellipse cx={cx} cy={cy} rx="4" ry="5" fill={hairColor} />
        <circle cx={cx-1.5} cy={cy-2} r="1.2" fill="white" opacity="0.85" />
      </g>
    );
    return <ellipse cx={cx} cy={cy} rx="4" ry="5" fill={hairColor} />;
  };

  const browEl = (cx: number) => {
    const y = 44;
    if (expression === 'sad')
      return <path d={`M ${cx-5} ${y-1} Q ${cx} ${y+3} ${cx+5} ${y-1}`}
        fill="none" stroke={hairColor} strokeWidth="2" strokeLinecap="round" opacity="0.65" />;
    if (expression === 'surprised')
      return <path d={`M ${cx-5} ${y+1} Q ${cx} ${y-3} ${cx+5} ${y+1}`}
        fill="none" stroke={hairColor} strokeWidth="2" strokeLinecap="round" opacity="0.65" />;
    if (expression === 'determined')
      return <line x1={cx-5} y1={y} x2={cx+5} y2={y}
        stroke={hairColor} strokeWidth="2" strokeLinecap="round" opacity="0.65" />;
    return null;
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 175"
      className={cn("w-full h-full", className)}
      style={{ filter: 'drop-shadow(1px 4px 8px rgba(0,0,0,0.28))', ...style }}
    >
      <defs>
        <radialGradient id={`${uid}hl`} cx="32%" cy="24%" r="66%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="white" stopOpacity="0.52" />
          <stop offset="55%"  stopColor="white" stopOpacity="0.14" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}sh`} cx="74%" cy="82%" r="52%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="black" stopOpacity="0.20" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}bhl`} cx="30%" cy="15%" r="72%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="white" stopOpacity="0.45" />
          <stop offset="55%"  stopColor="white" stopOpacity="0.10" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}bsh`} cx="76%" cy="90%" r="50%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="black" stopOpacity="0.18" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}blush`} x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      {/* ════ HAIR BACK — large rounded blob (the dominant silhouette) ════ */}
      {hairStyle !== 'none' && hairStyle !== 'snapback' && hairStyle !== 'bucketHat' && hairStyle !== 'cap' && (
        <ellipse cx="50" cy="38" rx="40" ry="36" fill={hairColor} />
      )}
      {/* Bun on top */}
      {hairStyle === 'bun' && (
        <>
          <circle cx="50" cy="4" r="13" fill={hairColor} />
          <circle cx="50" cy="4" r="13" fill={HL} opacity="0.3" />
        </>
      )}
      {/* Double buns */}
      {hairStyle === 'bunDouble' && (
        <>
          <circle cx="27" cy="6" r="12" fill={hairColor} />
          <circle cx="27" cy="6" r="12" fill={HL} opacity="0.3" />
          <circle cx="73" cy="6" r="12" fill={hairColor} />
          <circle cx="73" cy="6" r="12" fill={HL} opacity="0.3" />
        </>
      )}
      {/* Pigtail extensions */}
      {hairStyle === 'pigtails' && (
        <>
          <ellipse cx="11" cy="50" rx="12" ry="20" fill={hairColor} transform="rotate(-10 11 50)" />
          <ellipse cx="89" cy="50" rx="12" ry="20" fill={hairColor} transform="rotate(10 89 50)" />
        </>
      )}

      {/* Snapback hat */}
      {hairStyle === 'snapback' && (
        <>
          <ellipse cx="50" cy="38" rx="40" ry="36" fill={hairColor} />
          <path d="M 14 32 Q 14 2 50 2 Q 86 2 86 32 Z" fill={outfitColor} />
          <path d="M 14 32 Q 14 2 50 2 Q 86 2 86 32 Z" fill={HL} opacity="0.40" />
          <path d="M 14 32 Q 14 2 50 2 Q 86 2 86 32 Z" fill={SH} opacity="0.18" />
          <rect x="12" y="28" width="76" height="9" rx="4.5" fill={hairColor} opacity="0.55" />
          <path d="M 8 33 Q 50 27 92 33 L 91 43 Q 50 37 9 43 Z" fill={outfitColor} />
          <path d="M 8 33 Q 50 27 92 33 L 91 43 Q 50 37 9 43 Z" fill={SH} opacity="0.35" />
          <circle cx="50" cy="3" r="4" fill={outfitColor} />
          <text x="50" y="21" textAnchor="middle" fontSize="8" fill="white"
            fontFamily="Nunito" fontWeight="bold" opacity="0.9">YOUTH</text>
        </>
      )}

      {/* Bucket hat */}
      {hairStyle === 'bucketHat' && (
        <>
          <ellipse cx="50" cy="38" rx="40" ry="36" fill={hairColor} />
          <rect x="16" y="4" width="68" height="36" rx="20" fill={outfitColor} />
          <rect x="16" y="4" width="68" height="36" rx="20" fill={HL} opacity="0.35" />
          <rect x="16" y="4" width="68" height="36" rx="20" fill={SH} opacity="0.18" />
          <ellipse cx="50" cy="34" rx="42" ry="9" fill={outfitColor} />
          <ellipse cx="50" cy="34" rx="42" ry="9" fill={SH} opacity="0.28" />
          <path d="M 16 26 Q 50 22 84 26" fill="none" stroke="white" strokeWidth="2" opacity="0.28" />
        </>
      )}

      {/* Cap */}
      {hairStyle === 'cap' && (
        <>
          <ellipse cx="50" cy="38" rx="40" ry="36" fill={hairColor} />
          <rect x="13" y="12" width="74" height="26" rx="16" fill="#4A148C" />
          <rect x="13" y="12" width="74" height="26" rx="16" fill={HL} opacity="0.3" />
          <rect x="10" y="28" width="80" height="10" rx="5" fill="#4A148C" />
        </>
      )}

      {/* ════ EAR ════ */}
      <ellipse cx="17" cy="54" rx="6.5" ry="8" fill={skinColor} />
      <ellipse cx="17" cy="54" rx="6.5" ry="8" fill={HL} opacity="0.5" />
      <ellipse cx="17.5" cy="54" rx="3.5" ry="4.5" fill={cheekColor} opacity="0.28" />

      {/* ════ FACE — sevenbooom rounded-square block ════ */}
      <rect x="16" y="28" width="68" height="54" rx="24" fill={skinColor} />
      <rect x="16" y="28" width="68" height="54" rx="24" fill={HL} />
      <rect x="16" y="28" width="68" height="54" rx="24" fill={SH} />
      {/* Specular vinyl gloss */}
      <ellipse cx="29" cy="38" rx="14" ry="9" fill="white" opacity="0.36" />

      {/* ════ HAIR FRONT FRINGE — straight bang across forehead ════ */}
      {(hairStyle === 'short' || hairStyle === 'spiky') && (
        <path d="M 16 43 Q 16 26 50 24 Q 84 26 84 43 Q 82 32 50 30 Q 18 32 16 43 Z"
          fill={hairColor} />
      )}
      {hairStyle === 'bun' && (
        <path d="M 17 42 Q 19 26 50 24 Q 81 26 83 42 Q 79 30 50 28 Q 21 30 17 42 Z"
          fill={hairColor} />
      )}
      {(hairStyle === 'bunDouble' || hairStyle === 'pigtails') && (
        <path d="M 17 42 Q 19 26 50 24 Q 81 26 83 42 Q 79 30 50 28 Q 21 30 17 42 Z"
          fill={hairColor} />
      )}
      {hairStyle === 'sidePart' && (
        <path d="M 17 42 Q 17 24 40 22 Q 60 21 76 26 Q 60 24 46 30 Q 26 34 20 42 Z"
          fill={hairColor} />
      )}

      {/* ════ EYES — tiny sevenbooom-style dark ovals ════ */}
      {eyeEl(36, 52)}
      {eyeEl(64, 52)}

      {/* ════ EYEBROWS (only for non-happy expressions) ════ */}
      {browEl(36)}
      {browEl(64)}

      {/* ════ ROSY CHEEKS — the sevenbooom signature ════ */}
      {blush && (
        <>
          <circle cx="22" cy="63" r="14" fill={cheekColor} opacity="0.78"
            filter={`url(#${uid}blush)`} />
          <circle cx="78" cy="63" r="14" fill={cheekColor} opacity="0.78"
            filter={`url(#${uid}blush)`} />
        </>
      )}

      {/* ════ NOSE — tiny soft dot ════ */}
      <circle cx="50" cy="66" r="2.2" fill={cheekColor} opacity="0.55" />

      {/* ════ MOUTH ════ */}
      <path d={mouthPath} fill="none" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />

      {/* ════ GLASSES ════ */}
      {glasses && (
        <g>
          <circle cx="36" cy="52" r="9" fill="none" stroke={hairColor} strokeWidth="2" opacity="0.88" />
          <circle cx="36" cy="52" r="9" fill="#E3F2FD" opacity="0.16" />
          <circle cx="64" cy="52" r="9" fill="none" stroke={hairColor} strokeWidth="2" opacity="0.88" />
          <circle cx="64" cy="52" r="9" fill="#E3F2FD" opacity="0.16" />
          <line x1="45" y1="52" x2="55" y2="52" stroke={hairColor} strokeWidth="2" />
          <line x1="27" y1="51" x2="22" y2="50" stroke={hairColor} strokeWidth="1.8" />
          <line x1="73" y1="51" x2="78" y2="50" stroke={hairColor} strokeWidth="1.8" />
        </g>
      )}

      {/* ════ HAIR ACCESSORY ════ */}
      {hairAccessory}

      {/* ════ NECK ════ */}
      <rect x="44" y="80" width="12" height="8" rx="6" fill={skinColor} />
      <rect x="44" y="80" width="12" height="8" rx="6" fill={HL} opacity="0.5" />

      {/* ════ BODY — compact sevenbooom torso ════ */}
      <rect x="22" y="84" width="56" height="8" rx="6" fill={outfitColor} />
      <rect x="22" y="84" width="56" height="8" rx="6" fill={BHL} />

      {outfitStyle === 'overalls' && (
        <>
          <rect x="26" y="86" width="48" height="20" rx="9" fill={collarColor} />
          <rect x="26" y="86" width="48" height="20" rx="9" fill={BHL} opacity="0.45" />
          <rect x="36" y="85" width="28" height="16" rx="8" fill={outfitColor} />
          <rect x="36" y="85" width="28" height="16" rx="8" fill={BHL} />
          <rect x="24" y="92" width="52" height="17" rx="9" fill={outfitColor} />
          <rect x="24" y="92" width="52" height="17" rx="9" fill={BHL} />
          <rect x="24" y="92" width="52" height="17" rx="9" fill={BSH} />
          <path d="M 36 87 Q 32 83 28 87" fill="none" stroke={outfitColor} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 64 87 Q 68 83 72 87" fill="none" stroke={outfitColor} strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="50" cy="90" r="2.5" fill={hairColor} opacity="0.45" />
        </>
      )}
      {outfitStyle === 'dress' && (
        <>
          <rect x="26" y="83" width="48" height="18" rx="10" fill={outfitColor} />
          <rect x="26" y="83" width="48" height="18" rx="10" fill={BHL} />
          <path d="M 26 96 Q 13 108 12 114 L 88 114 Q 87 108 74 96 Z" fill={outfitColor} />
          <path d="M 26 96 Q 13 108 12 114 L 88 114 Q 87 108 74 96 Z" fill={BHL} opacity="0.5" />
          <path d="M 26 96 Q 13 108 12 114 L 88 114 Q 87 108 74 96 Z" fill={BSH} />
          <path d="M 39 84 Q 50 93 61 84" fill={collarColor} opacity="0.9" />
        </>
      )}
      {outfitStyle === 'jacket' && (
        <>
          <rect x="24" y="83" width="52" height="25" rx="11" fill={outfitColor} />
          <rect x="24" y="83" width="52" height="25" rx="11" fill={BHL} />
          <rect x="24" y="83" width="52" height="25" rx="11" fill={BSH} />
          <path d="M 42 84 Q 50 94 58 84" fill={collarColor} />
          <path d="M 42 84 L 39 100 L 50 98 L 61 100 L 58 84" fill={collarColor} opacity="0.82" />
          <circle cx="50" cy="92" r="2" fill={hairColor} opacity="0.45" />
          <circle cx="50" cy="99" r="2" fill={hairColor} opacity="0.45" />
        </>
      )}
      {outfitStyle === 'uniform' && (
        <>
          <rect x="26" y="83" width="48" height="25" rx="11" fill={outfitColor} />
          <rect x="26" y="83" width="48" height="25" rx="11" fill={BHL} />
          <rect x="26" y="83" width="48" height="25" rx="11" fill={BSH} />
          <rect x="39" y="82" width="22" height="12" rx="7" fill={collarColor} />
          <rect x="28" y="90" width="14" height="9" rx="3" fill={collarColor} opacity="0.85" />
          <text x="35" y="97" textAnchor="middle" fontSize="5" fill={hairColor}>✦</text>
        </>
      )}
      {outfitStyle === 'coat' && (
        <>
          <rect x="22" y="83" width="56" height="26" rx="12" fill={outfitColor} />
          <rect x="22" y="83" width="56" height="26" rx="12" fill={BHL} />
          <rect x="22" y="83" width="56" height="26" rx="12" fill={BSH} />
          <rect x="40" y="82" width="20" height="20" rx="9" fill={collarColor} opacity="0.9" />
          <circle cx="50" cy="93" r="2.2" fill={hairColor} opacity="0.55" />
          <circle cx="50" cy="100" r="2.2" fill={hairColor} opacity="0.55" />
        </>
      )}
      {outfitStyle === 'hoodie' && (
        <>
          <rect x="22" y="83" width="56" height="26" rx="12" fill={outfitColor} />
          <rect x="22" y="83" width="56" height="26" rx="12" fill={BHL} />
          <rect x="22" y="83" width="56" height="26" rx="12" fill={BSH} />
          <path d="M 26 84 Q 28 77 50 77 Q 72 77 74 84 L 74 89 Q 64 84 50 84 Q 36 84 26 89 Z"
            fill={outfitColor} />
          <path d="M 26 84 Q 28 77 50 77 Q 72 77 74 84 L 74 89 Q 64 84 50 84 Q 36 84 26 89 Z"
            fill={BHL} />
          <line x1="47" y1="84" x2="45" y2="98" stroke={collarColor} strokeWidth="1.8" opacity="0.65" />
          <line x1="53" y1="84" x2="55" y2="98" stroke={collarColor} strokeWidth="1.8" opacity="0.65" />
          <ellipse cx="45" cy="99" rx="2.5" ry="2.5" fill={collarColor} opacity="0.75" />
          <ellipse cx="55" cy="99" rx="2.5" ry="2.5" fill={collarColor} opacity="0.75" />
        </>
      )}

      {/* ════ ARMS — full-length animated (chibi-arm-l/r for CSS walk anim) ════ */}
      <g className="chibi-arm-l">
        {/* Upper arm */}
        <ellipse cx="13" cy="96" rx="10" ry="16" fill={outfitColor} />
        <ellipse cx="13" cy="96" rx="10" ry="16" fill={BHL} />
        {/* Lower arm / forearm */}
        <ellipse cx="13" cy="114" rx="8.5" ry="12" fill={outfitColor} />
        <ellipse cx="13" cy="114" rx="8.5" ry="12" fill={BHL} opacity="0.5" />
        {/* Hand */}
        <ellipse cx="13" cy="124" rx="8" ry="6" fill={skinColor} />
        <ellipse cx="13" cy="124" rx="8" ry="6" fill={HL} opacity="0.5" />
      </g>
      <g className="chibi-arm-r">
        {/* Upper arm */}
        <ellipse cx="87" cy="96" rx="10" ry="16" fill={outfitColor} />
        <ellipse cx="87" cy="96" rx="10" ry="16" fill={BHL} />
        {/* Lower arm / forearm */}
        <ellipse cx="87" cy="114" rx="8.5" ry="12" fill={outfitColor} />
        <ellipse cx="87" cy="114" rx="8.5" ry="12" fill={BHL} opacity="0.5" />
        {/* Hand */}
        <ellipse cx="87" cy="124" rx="8" ry="6" fill={skinColor} />
        <ellipse cx="87" cy="124" rx="8" ry="6" fill={HL} opacity="0.5" />
      </g>

      {/* Item / prop held in right hand area */}
      {item && <g transform="translate(72, 100)">{item}</g>}

      {/* ════ PANTS waistband ════ */}
      <rect x="24" y="106" width="52" height="10" rx="7" fill={pantsColor} />
      <rect x="24" y="106" width="52" height="10" rx="7" fill={BSH} opacity="0.25" />

      {/* ════ LEGS — slightly shorter, animated (chibi-leg-l/r) ════ */}
      <g className="chibi-leg-l">
        {/* Thigh */}
        <rect x="28" y="114" width="19" height="22" rx="9" fill={pantsColor} />
        <rect x="28" y="114" width="19" height="22" rx="9" fill={BSH} opacity="0.22" />
        {/* Knee cap */}
        <ellipse cx="37" cy="136" rx="9" ry="5" fill={pantsColor} />
        <ellipse cx="37" cy="136" rx="9" ry="5" fill={BSH} opacity="0.35" />
        {/* Shin */}
        <rect x="29" y="134" width="17" height="20" rx="8" fill={pantsColor} />
        <rect x="29" y="134" width="17" height="20" rx="8" fill={BSH} opacity="0.18" />
        {/* Sock */}
        <rect x="29" y="150" width="17" height="7" rx="4" fill="white" opacity="0.88" />
        {/* Shoe */}
        <path d="M 24 155 L 24 163 Q 24 168 31 168 L 50 168 Q 57 168 57 162 L 55 155 Q 52 152 46 152 L 28 152 Z" fill={bootColor} />
        <path d="M 24 155 L 24 163 Q 24 168 31 168 L 50 168 Q 57 168 57 162 L 55 155 Q 52 152 46 152 L 28 152 Z" fill={HL} opacity="0.35" />
        <ellipse cx="38" cy="159" rx="10" ry="3.5" fill="white" opacity="0.20" />
      </g>
      <g className="chibi-leg-r">
        {/* Thigh */}
        <rect x="53" y="114" width="19" height="22" rx="9" fill={pantsColor} />
        <rect x="53" y="114" width="19" height="22" rx="9" fill={BSH} opacity="0.22" />
        {/* Knee cap */}
        <ellipse cx="62" cy="136" rx="9" ry="5" fill={pantsColor} />
        <ellipse cx="62" cy="136" rx="9" ry="5" fill={BSH} opacity="0.35" />
        {/* Shin */}
        <rect x="54" y="134" width="17" height="20" rx="8" fill={pantsColor} />
        <rect x="54" y="134" width="17" height="20" rx="8" fill={BSH} opacity="0.18" />
        {/* Sock */}
        <rect x="54" y="150" width="17" height="7" rx="4" fill="white" opacity="0.88" />
        {/* Shoe */}
        <path d="M 43 155 L 43 163 Q 43 168 50 168 L 69 168 Q 76 168 76 162 L 76 155 Q 73 152 69 152 L 47 152 Z" fill={bootColor} />
        <path d="M 43 155 L 43 163 Q 43 168 50 168 L 69 168 Q 76 168 76 162 L 76 155 Q 73 152 69 152 L 47 152 Z" fill={HL} opacity="0.35" />
        <ellipse cx="62" cy="159" rx="10" ry="3.5" fill="white" opacity="0.20" />
      </g>
    </svg>
  );
};

/* ────────────────────────────────────────────────────────
   PLAYER WARDENS
──────────────────────────────────────────────────────── */

/* Warden1 — Eco Saver (Environment archetype)
   Forest-green jacket, earthy browns, carries a seedling, determined look */
export const Warden1 = ({ className, isWalking }: { className?: string; isWalking?: boolean }) => (
  <ChibiCharacter
    skinColor="#F2D5B0"
    hairColor="#2C1A08"
    hairStyle="sidePart"
    eyeStyle="dots"
    cheekColor="#C8A878"
    blush={true}
    expression="determined"
    outfitColor="#3A6B3A"
    outfitStyle="jacket"
    pantsColor="#4A3A20"
    collarColor="#D4E8C8"
    bootColor="#5C4020"
    item={<>
      {/* Small seedling sprout */}
      <line x1="4" y1="16" x2="4" y2="4" stroke="#2C5C18" strokeWidth="2" />
      <ellipse cx="4" cy="4" rx="4" ry="6" fill="#4CAF50" />
      <ellipse cx="4" cy="4" rx="4" ry="6" fill="white" opacity="0.22" />
      <ellipse cx="0" cy="8" rx="3.5" ry="2" fill="#66BB6A" transform="rotate(-30 0 8)" />
      <ellipse cx="8" cy="8" rx="3.5" ry="2" fill="#66BB6A" transform="rotate(30 8 8)" />
      <rect x="2" y="14" width="4" height="4" rx="2" fill="#8B5E3C" opacity="0.85" />
    </>}
    className={className}
    isWalking={isWalking}
  />
);

/* Warden2 — Scholar (Educational archetype)
   Navy jacket, glasses, side-part hair, carries a book, bright curious eyes */
export const Warden2 = ({ className, isWalking }: { className?: string; isWalking?: boolean }) => (
  <ChibiCharacter
    skinColor="#F0D4AA"
    hairColor="#1A1A1A"
    hairStyle="sidePart"
    eyeStyle="starry"
    cheekColor="#E8A880"
    blush={true}
    glasses={true}
    expression="happy"
    outfitColor="#1E3A6E"
    outfitStyle="uniform"
    pantsColor="#16294E"
    collarColor="#E8F0FF"
    bootColor="#2A2A3A"
    item={<>
      {/* Open book */}
      <rect x="-6" y="0" width="20" height="15" rx="2" fill="#F5F0E8" stroke="#8B6A3A" strokeWidth="1.2" />
      <line x1="4" y1="0" x2="4" y2="15" stroke="#8B6A3A" strokeWidth="1.2" />
      <line x1="-3" y1="4" x2="2" y2="4" stroke="#9AACCA" strokeWidth="1" opacity="0.7" />
      <line x1="-3" y1="7" x2="2" y2="7" stroke="#9AACCA" strokeWidth="1" opacity="0.7" />
      <line x1="-3" y1="10" x2="2" y2="10" stroke="#9AACCA" strokeWidth="1" opacity="0.7" />
      <line x1="6" y1="4" x2="11" y2="4" stroke="#9AACCA" strokeWidth="1" opacity="0.7" />
      <line x1="6" y1="7" x2="11" y2="7" stroke="#9AACCA" strokeWidth="1" opacity="0.7" />
      <line x1="6" y1="10" x2="11" y2="10" stroke="#9AACCA" strokeWidth="1" opacity="0.7" />
    </>}
    className={className}
    isWalking={isWalking}
  />
);

/* Warden3 — Community Activist (Social archetype) — COMPLETELY redesigned
   Warm coral coat, single bun, earthy skin, carries a globe, no hearts/purple */
export const Warden3 = ({ className, isWalking }: { className?: string; isWalking?: boolean }) => (
  <ChibiCharacter
    skinColor="#E8C49A"
    hairColor="#3A1808"
    hairStyle="bun"
    eyeStyle="dots"
    cheekColor="#D48A6A"
    blush={true}
    expression="determined"
    outfitColor="#C4572A"
    outfitStyle="coat"
    pantsColor="#6B3A20"
    collarColor="#F5E8D8"
    bootColor="#3A2010"
    item={<>
      {/* Small globe */}
      <circle cx="4" cy="8" r="8" fill="#1565C0" />
      <circle cx="4" cy="8" r="8" fill="white" opacity="0.12" />
      <ellipse cx="4" cy="8" rx="3" ry="8" fill="none" stroke="#E3F2FD" strokeWidth="0.8" opacity="0.6" />
      <ellipse cx="4" cy="8" rx="8" ry="3" fill="none" stroke="#E3F2FD" strokeWidth="0.8" opacity="0.6" />
      <path d="M -4 8 Q 4 4 12 8" fill="none" stroke="#E3F2FD" strokeWidth="0.8" opacity="0.6" />
      <ellipse cx="1" cy="5" rx="2" ry="1.5" fill="#388E3C" opacity="0.7" />
      <ellipse cx="7" cy="10" rx="2.5" ry="1.5" fill="#388E3C" opacity="0.7" />
    </>}
    className={className}
    isWalking={isWalking}
  />
);

/* ────────────────────────────────────────────────────────
   ELEMENTAL LORDS
──────────────────────────────────────────────────────── */

export const BalooSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter
    skinColor="#F0C8A0"
    hairColor="#2C1810"
    hairStyle="short"
    eyeStyle="starry"
    cheekColor="#E8907A"
    blush={true}
    expression="happy"
    outfitColor="#C4602E"
    outfitStyle="overalls"
    pantsColor="#6B3A20"
    collarColor="#F5EDE0"
    bootColor="#E8DDD0"
    item={<>
      <rect x="-2" y="4" width="16" height="12" rx="2" fill="#F5E0C8" stroke="#6B3A20" strokeWidth="1.5" />
      <polygon points="-4,4 8,-4 20,4" fill="#C4602E" stroke="#6B3A20" strokeWidth="1.5" />
    </>}
    className={cn("animate-float drop-shadow-lg", className)}
    style={{ animationDuration: '3.5s' }}
  />
);

export const PebblepuffSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter
    skinColor="#F0D4AA"
    hairColor="#3A2818"
    hairStyle="bunDouble"
    eyeStyle="crescent"
    cheekColor="#E8A870"
    blush={true}
    expression="happy"
    outfitColor="#C89340"
    outfitStyle="overalls"
    pantsColor="#6B4A18"
    collarColor="#FDF5E0"
    bootColor="#E8D8B0"
    item={<>
      <line x1="4" y1="18" x2="4" y2="0" stroke="#3A2818" strokeWidth="2" />
      <ellipse cx="4" cy="-2" rx="4" ry="6" fill="#E8C840" stroke="#3A2818" strokeWidth="1.5" />
      <line x1="8" y1="14" x2="10" y2="2" stroke="#3A2818" strokeWidth="1.5" />
      <ellipse cx="11" cy="0" rx="3" ry="5" fill="#E8C840" stroke="#3A2818" strokeWidth="1.5" />
    </>}
    className={cn("animate-float drop-shadow-lg", className)}
    style={{ animationDuration: '4s' }}
  />
);

export const LeafletSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter
    skinColor="#D8EED8"
    hairColor="#1A4A1A"
    hairStyle="bun"
    eyeStyle="crescent"
    cheekColor="#8EC88E"
    blush={true}
    expression="happy"
    outfitColor="#FFFFFF"
    outfitStyle="coat"
    pantsColor="#2E5A2E"
    collarColor="#E8F5E8"
    bootColor="#E8E8E8"
    item={<>
      <path d="M 4 16 Q -4 8 2 0 Q 10 -4 14 4 Q 20 12 10 16 Z" fill="#5A9A5A" stroke="#1A4A1A" strokeWidth="1.5" />
      <rect x="1" y="3" width="3" height="10" rx="1" fill="white" />
      <rect x="-1" y="6" width="7" height="3" rx="1" fill="white" />
    </>}
    hairAccessory={<>
      <circle cx="50" cy="8" r="5" fill="#5A9A5A" stroke="#1A4A1A" strokeWidth="1.5" />
      <text x="50" y="12" textAnchor="middle" fontSize="6" fill="white">+</text>
    </>}
    className={cn("animate-float drop-shadow-lg", className)}
    style={{ animationDuration: '2.5s' }}
  />
);

export const ThinkletSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter
    skinColor="#E8EAF6"
    hairColor="#1A1A4A"
    hairStyle="snapback"
    eyeStyle="dots"
    cheekColor="#9090CC"
    blush={true}
    expression="determined"
    outfitColor="#2A3A7A"
    outfitStyle="uniform"
    pantsColor="#1A2A5A"
    collarColor="#E8EAF6"
    bootColor="#D8DAE8"
    item={<>
      <rect x="-2" y="2" width="18" height="14" rx="2" fill="#E8D840" stroke="#1A1A4A" strokeWidth="1.5" />
      <rect x="-2" y="2" width="18" height="4" rx="2" fill="#C8B830" stroke="#1A1A4A" strokeWidth="1" />
      <line x1="1" y1="9" x2="13" y2="9" stroke="#1A1A4A" strokeWidth="1" />
      <line x1="1" y1="12" x2="10" y2="12" stroke="#1A1A4A" strokeWidth="1" />
    </>}
    className={cn("animate-float drop-shadow-lg", className)}
    style={{ animationDuration: '2.8s' }}
  />
);

export const SparkleflameSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter
    skinColor="#FFF0E0"
    hairColor="#4A1A0A"
    hairStyle="pigtails"
    eyeStyle="starry"
    cheekColor="#E8A060"
    blush={true}
    expression="happy"
    outfitColor="#B54A1A"
    outfitStyle="jacket"
    pantsColor="#4A1A0A"
    collarColor="#FDF5E0"
    bootColor="#E0D8C8"
    item={<>
      <line x1="8" y1="8" x2="8" y2="2" stroke="#4A1A0A" strokeWidth="2" />
      <line x1="0" y1="5" x2="16" y2="5" stroke="#4A1A0A" strokeWidth="2" />
      <ellipse cx="1" cy="8" rx="4" ry="3" fill="#D4A030" stroke="#4A1A0A" strokeWidth="1" />
      <ellipse cx="15" cy="8" rx="4" ry="3" fill="#D4A030" stroke="#4A1A0A" strokeWidth="1" />
    </>}
    hairAccessory={<>
      <circle cx="29" cy="20" r="4" fill="#D4A030" stroke="#4A1A0A" strokeWidth="1.5" />
      <circle cx="71" cy="20" r="4" fill="#D4A030" stroke="#4A1A0A" strokeWidth="1.5" />
    </>}
    className={cn("animate-float drop-shadow-lg", className)}
    style={{ animationDuration: '2s' }}
  />
);

/* ────────────────────────────────────────────────────────
   NPC CHARACTERS
──────────────────────────────────────────────────────── */

export const NPC_LeeFather = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0D0A0" hairColor="#2A1A10" hairStyle="short" eyeStyle="dots"
    cheekColor="#E8A880" expression="sad" outfitColor="#5A6A74" outfitStyle="jacket"
    pantsColor="#2A3040" collarColor="#E8EDF0" bootColor="#D8D4CC"
    item={<text x="0" y="10" fontSize="14">💼</text>}
    className={className} />
);

export const NPC_LeeMom = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0D0A0" hairColor="#2A1A10" hairStyle="bun" eyeStyle="dots"
    cheekColor="#E8A098" expression="sad" outfitColor="#7A8A94" outfitStyle="dress"
    pantsColor="#4A5A60" collarColor="#E8EDF0" bootColor="#C8C4BC"
    className={className} />
);

export const NPC_GrandmaRosa = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F5CCA8" hairColor="#9A9A9A" hairStyle="bun" eyeStyle="crescent"
    cheekColor="#E8A098" expression="sad" outfitColor="#AAAAAA" outfitStyle="coat"
    pantsColor="#707070" collarColor="#F0F0F0" bootColor="#C8C8C8"
    item={<text x="-4" y="10" fontSize="14">🏚️</text>}
    className={className} />
);

export const NPC_YoungMaya = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0D0A0" hairColor="#1A1A4A" hairStyle="pigtails" eyeStyle="starry"
    cheekColor="#8898C8" expression="determined" outfitColor="#3A4A8A" outfitStyle="uniform"
    pantsColor="#1A2A5A" collarColor="#E0E4F5" bootColor="#D0D4E8"
    item={<text x="-4" y="10" fontSize="14">📋</text>}
    className={className} />
);

export const NPC_BakerHelper = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F5E0B8" hairColor="#3A2010" hairStyle="short" eyeStyle="dots"
    cheekColor="#E8A878" expression="happy" outfitColor="#FFFFFF" outfitStyle="coat"
    pantsColor="#4A3A28" collarColor="#FDF8E8" bootColor="#D8CCAA"
    item={<text x="-4" y="10" fontSize="14">🍞</text>}
    hairAccessory={<rect x="38" y="20" width="24" height="8" rx="4" fill="white" stroke="#3A2010" strokeWidth="1.5" />}
    className={className} />
);

export const NPC_HouseKeeper = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0D0A0" hairColor="#1A3A1A" hairStyle="bun" eyeStyle="crescent"
    cheekColor="#7AAA7A" expression="happy" outfitColor="#5A8A5A" outfitStyle="overalls"
    pantsColor="#2A4A2A" collarColor="#E8F5E8" bootColor="#C8D8C0"
    item={<text x="-4" y="10" fontSize="14">🏠</text>}
    className={className} />
);

export const NPC_Trainer = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F5E0B8" hairColor="#1A1A4A" hairStyle="snapback" eyeStyle="dots"
    cheekColor="#9090CC" blush={true} expression="happy" outfitColor="#4A2A7A" outfitStyle="jacket"
    pantsColor="#1A0A3A" collarColor="#F0EBF5" bootColor="#D8D4E8"
    item={<text x="-4" y="10" fontSize="14">📋</text>}
    className={className} />
);

export const NPC_FarmerAli = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0C890" hairColor="#2A1A10" hairStyle="short" eyeStyle="dots"
    cheekColor="#E8A878" expression="sad" outfitColor="#8A6A4A" outfitStyle="overalls"
    pantsColor="#4A3020" collarColor="#EDE8D8" bootColor="#C8B898"
    item={<text x="-4" y="10" fontSize="14">🧑‍🌾</text>}
    className={className} />
);

export const NPC_CitizenMia = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0D0A0" hairColor="#1A3A1A" hairStyle="pigtails" eyeStyle="crescent"
    cheekColor="#E8A098" expression="happy" outfitColor="#7AAA74" outfitStyle="dress"
    pantsColor="#3A5A34" collarColor="#E8F5E4" bootColor="#C8D8C0"
    item={<text x="-4" y="10" fontSize="14">🥕</text>}
    className={className} />
);

export const NPC_CitizenTom = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F5DCB0" hairColor="#3A2010" hairStyle="spiky" eyeStyle="dots"
    cheekColor="#E8A878" expression="sad" outfitColor="#B87A30" outfitStyle="jacket"
    pantsColor="#4A3010" collarColor="#FDF5E0" bootColor="#D4C498"
    item={<text x="-4" y="10" fontSize="14">🌽</text>}
    className={className} />
);

export const NPC_MrBun = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0C890" hairColor="#3A2010" hairStyle="short" eyeStyle="dots"
    cheekColor="#E8A878" expression="sad" outfitColor="#5A6A74" outfitStyle="jacket"
    pantsColor="#2A3040" collarColor="#E8EDF0" bootColor="#C8C4BC"
    item={<text x="-4" y="10" fontSize="14">🍔</text>}
    className={className} />
);

export const NPC_LittleZoe = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0D0A0" hairColor="#3A1A5A" hairStyle="bunDouble" eyeStyle="crescent"
    cheekColor="#CC8AAA" expression="sad" outfitColor="#8A5AA8" outfitStyle="uniform"
    pantsColor="#3A1A5A" collarColor="#F0EBF5" bootColor="#D0C8E0"
    item={<text x="-4" y="10" fontSize="14">😣</text>}
    className={className} />
);

export const NPC_GrandpaJoe = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F5CCA8" hairColor="#9AA0A8" hairStyle="short" eyeStyle="crescent"
    cheekColor="#E8A098" expression="sad" outfitColor="#8A9AA4" outfitStyle="coat"
    pantsColor="#4A5A60" collarColor="#E8EDF0" bootColor="#C8C4BC"
    item={<text x="-4" y="10" fontSize="14">😷</text>}
    className={className} />
);

export const NPC_DoctorLeaf = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#D8EED8" hairColor="#1A4A1A" hairStyle="bun" eyeStyle="crescent"
    cheekColor="#8EC88E" expression="happy" outfitColor="#FFFFFF" outfitStyle="coat"
    pantsColor="#2E5A2E" collarColor="#E8F5E8" bootColor="#E8E8E8"
    item={<text x="-4" y="10" fontSize="14">🩺</text>}
    hairAccessory={<>
      <circle cx="50" cy="8" r="5" fill="#5A9A5A" stroke="#1A4A1A" strokeWidth="1.5" />
      <text x="50" y="12" textAnchor="middle" fontSize="6" fill="white">+</text>
    </>}
    className={className} />
);

export const NPC_StudentSam = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0D0A0" hairColor="#3A2010" hairStyle="short" eyeStyle="dots"
    cheekColor="#E8A878" expression="sad" outfitColor="#2A4A8A" outfitStyle="uniform"
    pantsColor="#1A2A5A" collarColor="#E0E8F5" bootColor="#D0D4E8"
    item={<text x="-4" y="10" fontSize="14">🧮</text>}
    className={className} />
);

export const NPC_StudentAria = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0C890" hairColor="#3A0A2A" hairStyle="pigtails" eyeStyle="hearts"
    cheekColor="#E898A8" expression="happy" outfitColor="#9A3A68" outfitStyle="uniform"
    pantsColor="#4A1A38" collarColor="#FCE4EC" bootColor="#E0C8D4"
    item={<text x="-4" y="10" fontSize="14">🎨</text>}
    className={className} />
);

export const NPC_StudentLeo = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F5DCB0" hairColor="#1A1A4A" hairStyle="spiky" eyeStyle="dots"
    cheekColor="#8898C8" expression="sad" outfitColor="#3A4A8A" outfitStyle="jacket"
    pantsColor="#1A2A5A" collarColor="#E0E4F5" bootColor="#D0D4E8"
    item={<text x="-4" y="10" fontSize="14">🔬</text>}
    className={className} />
);

export const NPC_TeacherThinklet = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#E8EAF6" hairColor="#1A1A4A" hairStyle="cap" eyeStyle="dots"
    cheekColor="#9090CC" expression="happy" outfitColor="#3A2A7A" outfitStyle="coat"
    pantsColor="#1A0A4A" collarColor="#F0EBF5" bootColor="#D0CCE0"
    item={<text x="-4" y="10" fontSize="14">📚</text>}
    className={className} />
);

export const NPC_Girl = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0D0A0" hairColor="#2A1A10" hairStyle="bun" eyeStyle="starry"
    cheekColor="#E8A098" expression="determined" outfitColor="#A83A3A" outfitStyle="uniform"
    pantsColor="#4A1A1A" collarColor="#FFE8E8" bootColor="#D8C8C8"
    item={<text x="-4" y="10" fontSize="14">⚽</text>}
    className={className} />
);

export const NPC_Worker = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F5E0B8" hairColor="#3A2010" hairStyle="short" eyeStyle="dots"
    cheekColor="#E8A878" expression="sad" outfitColor="#485A64" outfitStyle="jacket"
    pantsColor="#202E34" collarColor="#E8EDF0" bootColor="#C8C4BC"
    item={<text x="-4" y="10" fontSize="14">💼</text>}
    className={className} />
);

export const NPC_Sibling = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F0D0A0" hairColor="#3A2010" hairStyle="spiky" eyeStyle="dots"
    cheekColor="#E8A878" expression="sad" outfitColor="#B86040" outfitStyle="overalls"
    pantsColor="#5A2A18" collarColor="#FBE9E7" bootColor="#D4B898"
    item={<text x="-4" y="10" fontSize="14">🧹</text>}
    className={className} />
);

export const NPC_Advocate = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F5DCB0" hairColor="#4A1A0A" hairStyle="pigtails" eyeStyle="starry"
    cheekColor="#E8A060" expression="determined" outfitColor="#B55A1A" outfitStyle="jacket"
    pantsColor="#4A2010" collarColor="#FDF5E0" bootColor="#D4C498"
    item={<text x="-4" y="10" fontSize="14">📢</text>}
    className={className} />
);

/* ── PLANET LEVEL LORDS ── */

export const AquaSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#C8E8F8" hairColor="#1A4A6A" hairStyle="pigtails" eyeStyle="crescent"
    cheekColor="#6AB0D8" expression="determined" outfitColor="#3A8AC0" outfitStyle="dress"
    pantsColor="#1A5A8A" collarColor="#E0F0FA" bootColor="#D0E8F4"
    item={<text x="-4" y="10" fontSize="14">💧</text>}
    hairAccessory={<>
      <ellipse cx="29" cy="16" rx="5" ry="8" fill="#6AB0D8" opacity="0.75" />
      <ellipse cx="71" cy="16" rx="5" ry="8" fill="#6AB0D8" opacity="0.75" />
    </>}
    className={cn("drop-shadow-md", className)} />
);

export const CoralinaSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#D8F4F4" hairColor="#0A3A3A" hairStyle="bunDouble" eyeStyle="starry"
    cheekColor="#6AC8C8" expression="happy" outfitColor="#2A7A80" outfitStyle="dress"
    pantsColor="#0A4A50" collarColor="#D8F0F0" bootColor="#C8E8E8"
    item={<text x="-4" y="10" fontSize="14">🐠</text>}
    hairAccessory={<>
      <ellipse cx="27" cy="12" rx="7" ry="7" fill="#4AC8C8" />
      <ellipse cx="73" cy="12" rx="7" ry="7" fill="#4AC8C8" />
    </>}
    className={cn("drop-shadow-md", className)} />
);

export const FerraSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#D0E8D0" hairColor="#1A3A1A" hairStyle="bun" eyeStyle="crescent"
    cheekColor="#7AAA7A" expression="happy" outfitColor="#3A6A3A" outfitStyle="overalls"
    pantsColor="#1A3A1A" collarColor="#E8F5E8" bootColor="#C8D8C0"
    item={<text x="-4" y="10" fontSize="14">🌿</text>}
    hairAccessory={<>
      <ellipse cx="50" cy="10" rx="12" ry="6" fill="#4A8A4A" opacity="0.9" />
      <ellipse cx="36" cy="14" rx="8" ry="4" fill="#5A9A5A" opacity="0.8" />
      <ellipse cx="64" cy="14" rx="8" ry="4" fill="#5A9A5A" opacity="0.8" />
    </>}
    className={cn("drop-shadow-md", className)} />
);

export const GaiaSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#F5E0C0" hairColor="#5A1A0A" hairStyle="spiky" eyeStyle="starry"
    cheekColor="#E8A060" expression="determined" outfitColor="#B84A18" outfitStyle="jacket"
    pantsColor="#5A1A0A" collarColor="#FBE9E7" bootColor="#D4A888"
    item={<text x="-4" y="10" fontSize="14">🌡️</text>}
    hairAccessory={<>
      {[35, 42, 50, 58, 65].map((x, i) => (
        <ellipse key={i} cx={x} cy={9 - i % 2 * 3} rx="3" ry="6"
          fill={i % 2 === 0 ? '#C85A18' : '#E8A840'} opacity="0.9" />
      ))}
    </>}
    className={cn("drop-shadow-md", className)} />
);

export const ReevoSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#D8EAC8" hairColor="#2A4A1A" hairStyle="cap" eyeStyle="dots"
    cheekColor="#8AAA6A" expression="happy" outfitColor="#4A7A2A" outfitStyle="uniform"
    pantsColor="#2A4A1A" collarColor="#F0F8E8" bootColor="#C8D8B8"
    item={<text x="-4" y="10" fontSize="14">♻️</text>}
    hairAccessory={<>
      <rect x="44" y="6" width="12" height="12" rx="4" fill="#7AB83A" stroke="#2A4A1A" strokeWidth="1.5" />
      <circle cx="50" cy="4" r="3.5" fill="#C8FF80" />
    </>}
    className={cn("drop-shadow-md", className)} />
);

export const SplashySprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#C8E8F8" hairColor="#1A4A6A" hairStyle="spiky" eyeStyle="crescent"
    cheekColor="#6AB0D8" expression="happy" outfitColor="#3A8AC0" outfitStyle="overalls"
    pantsColor="#1A5A8A" collarColor="#E0F0FA" bootColor="#D0E8F4"
    className={cn("animate-float drop-shadow-lg", className)} />
);

/* ── PROSPERITY LEVEL LORDS ── */

export const VoltraSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFF9C4" hairColor="#F57F17" hairStyle="spiky" eyeStyle="starry"
    cheekColor="#FFD54F" expression="determined" outfitColor="#F9A825" outfitStyle="jacket"
    pantsColor="#E65100" collarColor="#FFFDE7" bootColor="#FF8F00"
    item={<text x="-4" y="10" fontSize="14">⚡</text>}
    hairAccessory={<>
      {[36, 44, 50, 56, 64].map((x, i) => (
        <ellipse key={i} cx={x} cy={8 - (i === 2 ? 4 : 0)} rx="3.5" ry="7"
          fill={i % 2 === 0 ? '#F9A825' : '#FFF176'} opacity="0.92" />
      ))}
    </>}
    className={cn("drop-shadow-md", className)} />
);

export const GildaSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFCDD2" hairColor="#4A1A0A" hairStyle="sidePart" eyeStyle="dots"
    cheekColor="#EF9A9A" expression="determined" outfitColor="#E65100" outfitStyle="uniform"
    pantsColor="#BF360C" collarColor="#FBE9E7" bootColor="#D4A888"
    item={<text x="-4" y="10" fontSize="14">🔧</text>}
    className={cn("drop-shadow-md", className)} />
);

export const NexusSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#E8EAF6" hairColor="#1A237E" hairStyle="short" eyeStyle="starry"
    cheekColor="#9FA8DA" expression="happy" outfitColor="#1565C0" outfitStyle="coat"
    pantsColor="#0D47A1" collarColor="#E3F2FD" bootColor="#1565C0"
    item={<text x="-4" y="10" fontSize="14">🔬</text>}
    glasses={true}
    className={cn("drop-shadow-md", className)} />
);

export const MiraSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#E8D5C4" hairColor="#4A148C" hairStyle="bunDouble" eyeStyle="crescent"
    cheekColor="#CE93D8" expression="happy" outfitColor="#6A1B9A" outfitStyle="dress"
    pantsColor="#4A148C" collarColor="#F3E5F5" bootColor="#CE93D8"
    item={<text x="-4" y="10" fontSize="14">🏘️</text>}
    hairAccessory={<>
      <ellipse cx="27" cy="11" rx="7" ry="7" fill="#AB47BC" />
      <ellipse cx="73" cy="11" rx="7" ry="7" fill="#AB47BC" />
    </>}
    className={cn("drop-shadow-md", className)} />
);

export const SkylarSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#E0F2F1" hairColor="#004D40" hairStyle="short" eyeStyle="crescent"
    cheekColor="#80CBC4" expression="happy" outfitColor="#00695C" outfitStyle="hoodie"
    pantsColor="#004D40" collarColor="#E0F2F1" bootColor="#26A69A"
    item={<text x="-4" y="10" fontSize="14">🏙️</text>}
    hairAccessory={<>
      <rect x="38" y="4" width="24" height="10" rx="5" fill="#00897B" opacity="0.8" />
    </>}
    className={cn("drop-shadow-md", className)} />
);
