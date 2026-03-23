import React from 'react';
import { cn } from '@/lib/utils';

/* ────────────────────────────────────────────────────────
   BASE CHIBI CHARACTER
   All characters share the same structure:
   - Big round head, rosy cheeks, dot eyes, tiny nose
   - Short pudgy body, stumpy arms, little booted legs
   Props let us customise each one uniquely
──────────────────────────────────────────────────────── */

interface ChibiProps {
  /* head */
  skinColor?: string;
  hairColor?: string;
  hairStyle?: 'bun' | 'bunDouble' | 'spiky' | 'pigtails' | 'short' | 'cap' | 'none';
  hairAccessory?: React.ReactNode;
  /* face */
  eyeStyle?: 'dots' | 'crescent' | 'hearts' | 'starry';
  cheekColor?: string;
  blush?: boolean;
  expression?: 'happy' | 'sad' | 'surprised' | 'determined';
  /* body */
  outfitColor?: string;
  outfitStyle?: 'overalls' | 'dress' | 'jacket' | 'uniform' | 'coat';
  collarColor?: string;
  /* boots */
  bootColor?: string;
  /* item */
  item?: React.ReactNode;
  /* extra */
  className?: string;
  isWalking?: boolean;
  style?: React.CSSProperties;
}

export const ChibiCharacter = ({
  skinColor = '#FDDBB0',
  hairColor = '#3E2723',
  hairStyle = 'bun',
  hairAccessory,
  eyeStyle = 'dots',
  cheekColor = '#F48FB1',
  blush = true,
  expression = 'happy',
  outfitColor = '#EF9A9A',
  outfitStyle = 'overalls',
  collarColor = '#FFFFFF',
  bootColor = '#FFC107',
  item,
  className,
  isWalking,
  style,
}: ChibiProps) => {

  const mouthPath = {
    happy: `M 43 49 Q 50 56 57 49`,
    sad: `M 43 54 Q 50 48 57 54`,
    surprised: `M 47 52 Q 50 58 53 52`,
    determined: `M 43 51 L 57 51`,
  }[expression];

  const eyeEl = (cx: number, cy: number) => {
    if (eyeStyle === 'dots') return <circle cx={cx} cy={cy} r="3.5" fill={hairColor} />;
    if (eyeStyle === 'crescent') return <path d={`M ${cx-4} ${cy} Q ${cx} ${cy-6} ${cx+4} ${cy}`} fill="none" stroke={hairColor} strokeWidth="3" strokeLinecap="round" />;
    if (eyeStyle === 'hearts') return <path d={`M ${cx} ${cy+1} C ${cx} ${cy-2} ${cx-5} ${cy-3} ${cx-5} ${cy} C ${cx-5} ${cy+3} ${cx} ${cy+5} ${cx} ${cy+5} C ${cx} ${cy+5} ${cx+5} ${cy+3} ${cx+5} ${cy} C ${cx+5} ${cy-3} ${cx} ${cy-2} ${cx} ${cy+1} Z`} fill="#E91E63" />;
    if (eyeStyle === 'starry') return (
      <g>
        <circle cx={cx} cy={cy} r="4" fill={hairColor} />
        <circle cx={cx-1.5} cy={cy-1.5} r="1.2" fill="white" opacity="0.8" />
      </g>
    );
    return <circle cx={cx} cy={cy} r="3.5" fill={hairColor} />;
  };

  return (
    <svg
      viewBox="0 0 100 130"
      className={cn("w-full h-full drop-shadow-md", isWalking && "animate-walk", className)}
      style={style}
    >
      {/* ── HAIR BACK ── */}
      {hairStyle === 'bun' && (
        <>
          <circle cx="50" cy="16" r="10" fill={hairColor} />
          <path d="M 22 34 Q 20 15 50 12 Q 78 15 78 34" fill={hairColor} />
        </>
      )}
      {hairStyle === 'bunDouble' && (
        <>
          <circle cx="32" cy="14" r="9" fill={hairColor} />
          <circle cx="68" cy="14" r="9" fill={hairColor} />
          <path d="M 22 35 Q 22 14 50 12 Q 78 14 78 35" fill={hairColor} />
        </>
      )}
      {hairStyle === 'pigtails' && (
        <>
          <ellipse cx="18" cy="35" rx="9" ry="12" fill={hairColor} transform="rotate(-15 18 35)" />
          <ellipse cx="82" cy="35" rx="9" ry="12" fill={hairColor} transform="rotate(15 82 35)" />
          <path d="M 22 35 Q 22 14 50 12 Q 78 14 78 35" fill={hairColor} />
        </>
      )}
      {hairStyle === 'spiky' && (
        <>
          <path d="M 22 35 Q 28 10 38 14 Q 44 5 50 12 Q 56 5 62 14 Q 72 10 78 35 Z" fill={hairColor} />
        </>
      )}
      {hairStyle === 'short' && (
        <path d="M 22 38 Q 22 12 50 10 Q 78 12 78 38 Q 78 24 50 22 Q 22 24 22 38 Z" fill={hairColor} />
      )}
      {hairStyle === 'cap' && (
        <>
          <path d="M 22 35 Q 22 14 50 12 Q 78 14 78 35" fill={hairColor} />
          <rect x="18" y="23" width="64" height="10" rx="5" fill="#4A148C" />
          <rect x="15" y="29" width="70" height="7" rx="3.5" fill="#4A148C" />
        </>
      )}

      {/* ── HEAD ── */}
      <ellipse cx="50" cy="38" rx="28" ry="27" fill={skinColor} stroke={hairColor} strokeWidth="2.5" />

      {/* ── HAIR FRONT FRINGE ── */}
      {(hairStyle === 'bun' || hairStyle === 'short') && (
        <path d="M 23 32 Q 30 18 50 20 Q 70 18 77 32" fill={hairColor} />
      )}
      {hairStyle === 'bunDouble' && (
        <path d="M 23 32 Q 30 18 50 20 Q 70 18 77 32" fill={hairColor} />
      )}
      {hairStyle === 'pigtails' && (
        <path d="M 23 33 Q 32 18 50 20 Q 68 18 77 33" fill={hairColor} />
      )}

      {/* ── EYES ── */}
      {eyeEl(38, 38)}
      {eyeEl(62, 38)}

      {/* ── BLUSH ── */}
      {blush && (
        <>
          <ellipse cx="27" cy="44" rx="7" ry="4" fill={cheekColor} opacity="0.55" />
          <ellipse cx="73" cy="44" rx="7" ry="4" fill={cheekColor} opacity="0.55" />
        </>
      )}

      {/* ── NOSE ── */}
      <circle cx="50" cy="44" r="2" fill={cheekColor} opacity="0.7" />

      {/* ── MOUTH ── */}
      <path d={mouthPath} fill="none" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />

      {/* ── HAIR ACCESSORY ── */}
      {hairAccessory}

      {/* ── BODY / TORSO ── */}
      {outfitStyle === 'overalls' && (
        <>
          {/* white inner shirt */}
          <rect x="38" y="63" width="24" height="22" rx="6" fill={collarColor} />
          {/* overalls */}
          <rect x="32" y="64" width="36" height="30" rx="8" fill={outfitColor} stroke={hairColor} strokeWidth="2" />
          {/* bib */}
          <rect x="40" y="63" width="20" height="14" rx="5" fill={outfitColor} stroke={hairColor} strokeWidth="1.5" />
          {/* straps */}
          <path d="M 40 64 Q 36 61 34 65" fill="none" stroke={hairColor} strokeWidth="2" />
          <path d="M 60 64 Q 64 61 66 65" fill="none" stroke={hairColor} strokeWidth="2" />
          {/* button */}
          <circle cx="50" cy="70" r="2" fill={hairColor} />
        </>
      )}
      {outfitStyle === 'dress' && (
        <>
          <path d="M 38 64 Q 30 75 28 95 L 72 95 Q 70 75 62 64 Z" fill={outfitColor} stroke={hairColor} strokeWidth="2" />
          <rect x="38" y="63" width="24" height="16" rx="8" fill={outfitColor} stroke={hairColor} strokeWidth="2" />
          {/* collar */}
          <path d="M 42 64 Q 50 70 58 64" fill={collarColor} stroke={hairColor} strokeWidth="1.5" />
        </>
      )}
      {outfitStyle === 'jacket' && (
        <>
          <rect x="32" y="64" width="36" height="30" rx="8" fill={outfitColor} stroke={hairColor} strokeWidth="2" />
          {/* inner shirt */}
          <path d="M 44 64 Q 50 72 56 64" fill={collarColor} />
          {/* lapels */}
          <path d="M 44 64 L 40 80 L 50 78 L 60 80 L 56 64" fill={collarColor} stroke={hairColor} strokeWidth="1.5" />
          {/* zipper/buttons */}
          <circle cx="50" cy="71" r="1.5" fill={hairColor} />
          <circle cx="50" cy="78" r="1.5" fill={hairColor} />
        </>
      )}
      {outfitStyle === 'uniform' && (
        <>
          <rect x="34" y="64" width="32" height="28" rx="7" fill={outfitColor} stroke={hairColor} strokeWidth="2" />
          {/* collar band */}
          <rect x="43" y="63" width="14" height="10" rx="4" fill={collarColor} stroke={hairColor} strokeWidth="1.5" />
          {/* badge */}
          <rect x="36" y="70" width="10" height="8" rx="2" fill={collarColor} stroke={hairColor} strokeWidth="1" />
          <text x="41" y="77" textAnchor="middle" fontSize="5" fill={hairColor}>✦</text>
        </>
      )}
      {outfitStyle === 'coat' && (
        <>
          <rect x="30" y="64" width="40" height="32" rx="8" fill={outfitColor} stroke={hairColor} strokeWidth="2" />
          <rect x="44" y="63" width="12" height="18" rx="4" fill={collarColor} stroke={hairColor} strokeWidth="1.5" />
          <circle cx="50" cy="72" r="2" fill={hairColor} />
          <circle cx="50" cy="79" r="2" fill={hairColor} />
          <circle cx="50" cy="86" r="2" fill={hairColor} />
        </>
      )}

      {/* ── ARMS (grouped for walk-swing animation) ── */}
      <g className="chibi-arm-l">
        <ellipse cx="24" cy="75" rx="7" ry="10" fill={skinColor} stroke={hairColor} strokeWidth="2" />
      </g>
      <g className="chibi-arm-r">
        <ellipse cx="76" cy="75" rx="7" ry="10" fill={skinColor} stroke={hairColor} strokeWidth="2" />
      </g>

      {/* Item / prop held in right arm */}
      {item && (
        <g transform="translate(64, 62)">
          {item}
        </g>
      )}

      {/* ── LEGS / BOOTS (grouped for walk-step animation) ── */}
      <g className="chibi-leg-l">
        <rect x="38" y="92" width="11" height="18" rx="5" fill={outfitColor} stroke={hairColor} strokeWidth="2" />
        <rect x="35" y="104" width="17" height="12" rx="6" fill={bootColor} stroke={hairColor} strokeWidth="2" />
      </g>
      <g className="chibi-leg-r">
        <rect x="51" y="92" width="11" height="18" rx="5" fill={outfitColor} stroke={hairColor} strokeWidth="2" />
        <rect x="48" y="104" width="17" height="12" rx="6" fill={bootColor} stroke={hairColor} strokeWidth="2" />
      </g>
    </svg>
  );
};

/* ────────────────────────────────────────────────────────
   PLAYER WARDENS  (choose your character on title screen)
──────────────────────────────────────────────────────── */

export const Warden1 = ({ className, isWalking }: { className?: string; isWalking?: boolean }) => (
  <ChibiCharacter
    skinColor="#FDDBB0"
    hairColor="#2C1A0E"
    hairStyle="bun"
    eyeStyle="starry"
    cheekColor="#F48FB1"
    outfitColor="#A5D6A7"
    outfitStyle="overalls"
    collarColor="#FFFFFF"
    bootColor="#FFC107"
    item={<>
      <ellipse cx="3" cy="8" rx="8" ry="4" fill="#81C784" transform="rotate(-30 3 8)" stroke="#2C1A0E" strokeWidth="1.5" />
      <circle cx="10" cy="2" r="5" fill="#4CAF50" stroke="#2C1A0E" strokeWidth="1.5" />
    </>}
    hairAccessory={<circle cx="50" cy="8" r="5" fill="#F48FB1" stroke="#2C1A0E" strokeWidth="1.5" />}
    className={className}
    isWalking={isWalking}
  />
);

export const Warden2 = ({ className, isWalking }: { className?: string; isWalking?: boolean }) => (
  <ChibiCharacter
    skinColor="#FFE0B2"
    hairColor="#1A237E"
    hairStyle="spiky"
    eyeStyle="dots"
    cheekColor="#90CAF9"
    outfitColor="#64B5F6"
    outfitStyle="jacket"
    collarColor="#E3F2FD"
    bootColor="#1565C0"
    item={<>
      <ellipse cx="4" cy="6" rx="5" ry="8" fill="#29B6F6" stroke="#1A237E" strokeWidth="1.5" />
      <ellipse cx="4" cy="6" rx="3" ry="6" fill="#B3E5FC" opacity="0.6" />
    </>}
    className={className}
    isWalking={isWalking}
  />
);

export const Warden3 = ({ className, isWalking }: { className?: string; isWalking?: boolean }) => (
  <ChibiCharacter
    skinColor="#FDDBB0"
    hairColor="#4A148C"
    hairStyle="pigtails"
    eyeStyle="hearts"
    cheekColor="#CE93D8"
    outfitColor="#CE93D8"
    outfitStyle="dress"
    collarColor="#F3E5F5"
    bootColor="#AB47BC"
    item={<>
      <line x1="4" y1="16" x2="4" y2="0" stroke="#4A148C" strokeWidth="2" />
      <polygon points="4,-2 0,4 8,4" fill="#FFD700" stroke="#4A148C" strokeWidth="1" />
      <circle cx="4" cy="-2" r="4" fill="#FFD700" stroke="#4A148C" strokeWidth="1" />
    </>}
    hairAccessory={<>
      <circle cx="32" cy="17" r="4" fill="#FFD700" stroke="#4A148C" strokeWidth="1.5" />
      <circle cx="68" cy="17" r="4" fill="#FFD700" stroke="#4A148C" strokeWidth="1.5" />
    </>}
    className={className}
    isWalking={isWalking}
  />
);

/* ────────────────────────────────────────────────────────
   ELEMENTAL LORDS  (zone guardians, larger + more ornate)
──────────────────────────────────────────────────────── */

export const BalooSprite = ({ className }: { className?: string }) => (
  /* SDG 1 – Poverty – carries a little house */
  <ChibiCharacter
    skinColor="#FFCCBC"
    hairColor="#4E342E"
    hairStyle="short"
    eyeStyle="starry"
    cheekColor="#EF9A9A"
    expression="happy"
    outfitColor="#E53935"
    outfitStyle="overalls"
    collarColor="#FFFFFF"
    bootColor="#BF360C"
    item={<>
      <rect x="-2" y="4" width="16" height="12" rx="2" fill="#FFCCBC" stroke="#4E342E" strokeWidth="1.5" />
      <polygon points="-4,4 8,-4 20,4" fill="#E53935" stroke="#4E342E" strokeWidth="1.5" />
    </>}
    className={cn("animate-float drop-shadow-lg", className)}
    style={{ animationDuration: '3.5s' }}
  />
);

export const PebblepuffSprite = ({ className }: { className?: string }) => (
  /* SDG 2 – Hunger – carries wheat stalks */
  <ChibiCharacter
    skinColor="#FFE0B2"
    hairColor="#5D4037"
    hairStyle="bunDouble"
    eyeStyle="crescent"
    cheekColor="#FFAB91"
    expression="happy"
    outfitColor="#FF8F00"
    outfitStyle="overalls"
    collarColor="#FFF8E1"
    bootColor="#E65100"
    item={<>
      <line x1="4" y1="18" x2="4" y2="0" stroke="#5D4037" strokeWidth="2" />
      <ellipse cx="4" cy="-2" rx="4" ry="6" fill="#FDD835" stroke="#5D4037" strokeWidth="1.5" />
      <line x1="8" y1="14" x2="10" y2="2" stroke="#5D4037" strokeWidth="1.5" />
      <ellipse cx="11" cy="0" rx="3" ry="5" fill="#FDD835" stroke="#5D4037" strokeWidth="1.5" />
    </>}
    className={cn("animate-float drop-shadow-lg", className)}
    style={{ animationDuration: '4s' }}
  />
);

export const LeafletSprite = ({ className }: { className?: string }) => (
  /* SDG 3 – Health – carries a big leaf + cross */
  <ChibiCharacter
    skinColor="#C8E6C9"
    hairColor="#1B5E20"
    hairStyle="bun"
    eyeStyle="crescent"
    cheekColor="#A5D6A7"
    expression="happy"
    outfitColor="#FFFFFF"
    outfitStyle="coat"
    collarColor="#E8F5E9"
    bootColor="#2E7D32"
    item={<>
      <path d="M 4 16 Q -4 8 2 0 Q 10 -4 14 4 Q 20 12 10 16 Z" fill="#4CAF50" stroke="#1B5E20" strokeWidth="1.5" />
      <rect x="1" y="3" width="3" height="10" rx="1" fill="white" />
      <rect x="-1" y="6" width="7" height="3" rx="1" fill="white" />
    </>}
    hairAccessory={<>
      <circle cx="50" cy="9" r="5" fill="#4CAF50" stroke="#1B5E20" strokeWidth="1.5" />
      <text x="50" y="13" textAnchor="middle" fontSize="6" fill="white">+</text>
    </>}
    className={cn("animate-float drop-shadow-lg", className)}
    style={{ animationDuration: '2.5s' }}
  />
);

export const ThinkletSprite = ({ className }: { className?: string }) => (
  /* SDG 4 – Education – carries a book, wears cap */
  <ChibiCharacter
    skinColor="#E8EAF6"
    hairColor="#4A148C"
    hairStyle="cap"
    eyeStyle="dots"
    cheekColor="#CE93D8"
    expression="determined"
    outfitColor="#7B1FA2"
    outfitStyle="uniform"
    collarColor="#F3E5F5"
    bootColor="#4A148C"
    item={<>
      <rect x="-2" y="2" width="18" height="14" rx="2" fill="#FFEE58" stroke="#4A148C" strokeWidth="1.5" />
      <rect x="-2" y="2" width="18" height="4" rx="2" fill="#FFC107" stroke="#4A148C" strokeWidth="1" />
      <line x1="1" y1="9" x2="13" y2="9" stroke="#4A148C" strokeWidth="1" />
      <line x1="1" y1="12" x2="10" y2="12" stroke="#4A148C" strokeWidth="1" />
    </>}
    className={cn("animate-float drop-shadow-lg", className)}
    style={{ animationDuration: '2.8s' }}
  />
);

export const SparkleflameSprite = ({ className }: { className?: string }) => (
  /* SDG 5 – Gender Equality – carries a balance scale */
  <ChibiCharacter
    skinColor="#FFF3E0"
    hairColor="#BF360C"
    hairStyle="pigtails"
    eyeStyle="starry"
    cheekColor="#FFCC02"
    expression="happy"
    outfitColor="#FF6F00"
    outfitStyle="jacket"
    collarColor="#FFF9C4"
    bootColor="#E65100"
    item={<>
      <line x1="8" y1="8" x2="8" y2="2" stroke="#BF360C" strokeWidth="2" />
      <line x1="0" y1="5" x2="16" y2="5" stroke="#BF360C" strokeWidth="2" />
      <ellipse cx="1" cy="8" rx="4" ry="3" fill="#FFCC02" stroke="#BF360C" strokeWidth="1" />
      <ellipse cx="15" cy="8" rx="4" ry="3" fill="#FFCC02" stroke="#BF360C" strokeWidth="1" />
    </>}
    hairAccessory={<>
      <circle cx="32" cy="18" r="4" fill="#FFCC02" stroke="#BF360C" strokeWidth="1.5" />
      <circle cx="68" cy="18" r="4" fill="#FFCC02" stroke="#BF360C" strokeWidth="1.5" />
    </>}
    className={cn("animate-float drop-shadow-lg", className)}
    style={{ animationDuration: '2s' }}
  />
);

/* ────────────────────────────────────────────────────────
   NPC CHARACTERS  (appear inside puzzles)
──────────────────────────────────────────────────────── */

/* --- SDG 1: Poverty NPCs --- */

export const NPC_LeeFather = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FDDBB0" hairColor="#3E2723" hairStyle="short" eyeStyle="dots"
    cheekColor="#EF9A9A" expression="sad" outfitColor="#546E7A" outfitStyle="jacket"
    collarColor="#ECEFF1" bootColor="#37474F"
    item={<text x="0" y="10" fontSize="14">💼</text>}
    className={className} />
);

export const NPC_LeeMom = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FDDBB0" hairColor="#3E2723" hairStyle="bun" eyeStyle="dots"
    cheekColor="#F48FB1" expression="sad" outfitColor="#78909C" outfitStyle="dress"
    collarColor="#ECEFF1" bootColor="#546E7A"
    className={className} />
);

export const NPC_GrandmaRosa = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFCCBC" hairColor="#9E9E9E" hairStyle="bun" eyeStyle="crescent"
    cheekColor="#EF9A9A" expression="sad" outfitColor="#BDBDBD" outfitStyle="coat"
    collarColor="#EEEEEE" bootColor="#757575"
    item={<text x="-4" y="10" fontSize="14">🏚️</text>}
    className={className} />
);

export const NPC_YoungMaya = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FDDBB0" hairColor="#1A237E" hairStyle="pigtails" eyeStyle="starry"
    cheekColor="#90CAF9" expression="determined" outfitColor="#3F51B5" outfitStyle="uniform"
    collarColor="#E8EAF6" bootColor="#283593"
    item={<text x="-4" y="10" fontSize="14">📋</text>}
    className={className} />
);

export const NPC_BakerHelper = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFECB3" hairColor="#4E342E" hairStyle="short" eyeStyle="dots"
    cheekColor="#FFAB91" expression="happy" outfitColor="#FFFFFF" outfitStyle="coat"
    collarColor="#FFF8E1" bootColor="#795548"
    item={<text x="-4" y="10" fontSize="14">🍞</text>}
    hairAccessory={<rect x="40" y="18" width="20" height="8" rx="4" fill="white" stroke="#4E342E" strokeWidth="1.5" />}
    className={className} />
);

export const NPC_HouseKeeper = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FDDBB0" hairColor="#2E7D32" hairStyle="bun" eyeStyle="crescent"
    cheekColor="#A5D6A7" expression="happy" outfitColor="#4CAF50" outfitStyle="overalls"
    collarColor="#E8F5E9" bootColor="#1B5E20"
    item={<text x="-4" y="10" fontSize="14">🏠</text>}
    className={className} />
);

export const NPC_Trainer = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFECB3" hairColor="#4A148C" hairStyle="cap" eyeStyle="dots"
    cheekColor="#CE93D8" expression="happy" outfitColor="#7B1FA2" outfitStyle="jacket"
    collarColor="#F3E5F5" bootColor="#4A148C"
    item={<text x="-4" y="10" fontSize="14">📋</text>}
    className={className} />
);

/* --- SDG 2: Hunger NPCs --- */

export const NPC_FarmerAli = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFCCBC" hairColor="#3E2723" hairStyle="short" eyeStyle="dots"
    cheekColor="#FFAB91" expression="sad" outfitColor="#8D6E63" outfitStyle="overalls"
    collarColor="#EFEBE9" bootColor="#4E342E"
    item={<text x="-4" y="10" fontSize="14">🧑‍🌾</text>}
    className={className} />
);

export const NPC_CitizenMia = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FDDBB0" hairColor="#1B5E20" hairStyle="pigtails" eyeStyle="crescent"
    cheekColor="#F48FB1" expression="happy" outfitColor="#81C784" outfitStyle="dress"
    collarColor="#E8F5E9" bootColor="#388E3C"
    item={<text x="-4" y="10" fontSize="14">🥕</text>}
    className={className} />
);

export const NPC_CitizenTom = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFE0B2" hairColor="#5D4037" hairStyle="spiky" eyeStyle="dots"
    cheekColor="#FFAB91" expression="sad" outfitColor="#FF8F00" outfitStyle="jacket"
    collarColor="#FFF8E1" bootColor="#E65100"
    item={<text x="-4" y="10" fontSize="14">🌽</text>}
    className={className} />
);

/* --- SDG 3: Health NPCs --- */

export const NPC_MrBun = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFCCBC" hairColor="#4E342E" hairStyle="short" eyeStyle="dots"
    cheekColor="#FFAB91" expression="sad" outfitColor="#607D8B" outfitStyle="jacket"
    collarColor="#ECEFF1" bootColor="#37474F"
    item={<text x="-4" y="10" fontSize="14">🍔</text>}
    className={className} />
);

export const NPC_LittleZoe = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FDDBB0" hairColor="#6A1B9A" hairStyle="bunDouble" eyeStyle="crescent"
    cheekColor="#CE93D8" expression="sad" outfitColor="#AB47BC" outfitStyle="uniform"
    collarColor="#F3E5F5" bootColor="#6A1B9A"
    item={<text x="-4" y="10" fontSize="14">😣</text>}
    className={className} />
);

export const NPC_GrandpaJoe = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFCCBC" hairColor="#B0BEC5" hairStyle="short" eyeStyle="crescent"
    cheekColor="#EF9A9A" expression="sad" outfitColor="#90A4AE" outfitStyle="coat"
    collarColor="#ECEFF1" bootColor="#607D8B"
    item={<text x="-4" y="10" fontSize="14">😷</text>}
    className={className} />
);

export const NPC_DoctorLeaf = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#C8E6C9" hairColor="#1B5E20" hairStyle="bun" eyeStyle="crescent"
    cheekColor="#A5D6A7" expression="happy" outfitColor="#FFFFFF" outfitStyle="coat"
    collarColor="#E8F5E9" bootColor="#2E7D32"
    item={<text x="-4" y="10" fontSize="14">🩺</text>}
    hairAccessory={<>
      <circle cx="50" cy="9" r="5" fill="#4CAF50" stroke="#1B5E20" strokeWidth="1.5" />
      <text x="50" y="13" textAnchor="middle" fontSize="6" fill="white">+</text>
    </>}
    className={className} />
);

/* --- SDG 4: Education NPCs --- */

export const NPC_StudentSam = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FDDBB0" hairColor="#5D4037" hairStyle="short" eyeStyle="dots"
    cheekColor="#FFAB91" expression="sad" outfitColor="#1565C0" outfitStyle="uniform"
    collarColor="#E3F2FD" bootColor="#0D47A1"
    item={<text x="-4" y="10" fontSize="14">🧮</text>}
    className={className} />
);

export const NPC_StudentAria = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFCCBC" hairColor="#880E4F" hairStyle="pigtails" eyeStyle="hearts"
    cheekColor="#F48FB1" expression="happy" outfitColor="#E91E63" outfitStyle="uniform"
    collarColor="#FCE4EC" bootColor="#880E4F"
    item={<text x="-4" y="10" fontSize="14">🎨</text>}
    className={className} />
);

export const NPC_StudentLeo = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFE0B2" hairColor="#1A237E" hairStyle="spiky" eyeStyle="dots"
    cheekColor="#90CAF9" expression="sad" outfitColor="#3F51B5" outfitStyle="jacket"
    collarColor="#E8EAF6" bootColor="#1A237E"
    item={<text x="-4" y="10" fontSize="14">🔬</text>}
    className={className} />
);

export const NPC_TeacherThinklet = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#E8EAF6" hairColor="#4A148C" hairStyle="cap" eyeStyle="dots"
    cheekColor="#CE93D8" expression="happy" outfitColor="#512DA8" outfitStyle="coat"
    collarColor="#F3E5F5" bootColor="#311B92"
    item={<text x="-4" y="10" fontSize="14">📚</text>}
    className={className} />
);

/* --- SDG 5: Equality NPCs --- */

export const NPC_Girl = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FDDBB0" hairColor="#3E2723" hairStyle="bun" eyeStyle="starry"
    cheekColor="#F48FB1" expression="determined" outfitColor="#EF5350" outfitStyle="uniform"
    collarColor="#FFEBEE" bootColor="#C62828"
    item={<text x="-4" y="10" fontSize="14">⚽</text>}
    className={className} />
);

export const NPC_Worker = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFECB3" hairColor="#4E342E" hairStyle="short" eyeStyle="dots"
    cheekColor="#FFAB91" expression="sad" outfitColor="#455A64" outfitStyle="jacket"
    collarColor="#ECEFF1" bootColor="#263238"
    item={<text x="-4" y="10" fontSize="14">💼</text>}
    className={className} />
);

export const NPC_Sibling = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FDDBB0" hairColor="#5D4037" hairStyle="spiky" eyeStyle="dots"
    cheekColor="#FFAB91" expression="sad" outfitColor="#FF7043" outfitStyle="overalls"
    collarColor="#FBE9E7" bootColor="#BF360C"
    item={<text x="-4" y="10" fontSize="14">🧹</text>}
    className={className} />
);

export const NPC_Advocate = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFE0B2" hairColor="#BF360C" hairStyle="pigtails" eyeStyle="starry"
    cheekColor="#FFCC02" expression="determined" outfitColor="#FF6F00" outfitStyle="jacket"
    collarColor="#FFF9C4" bootColor="#E65100"
    item={<text x="-4" y="10" fontSize="14">📢</text>}
    className={className} />
);

/* ── PLANET LEVEL LORDS ── */

/* Aqua – SDG 6 Clean Water (blue water spirit, flowing hair, droplet wand) */
export const AquaSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#B3E5FC" hairColor="#0277BD" hairStyle="pigtails" eyeStyle="crescent"
    cheekColor="#81D4FA" expression="determined" outfitColor="#29B6F6" outfitStyle="dress"
    collarColor="#E1F5FE" bootColor="#0288D1"
    item={<text x="-4" y="10" fontSize="14">💧</text>}
    hairAccessory={<>
      <ellipse cx="32" cy="12" rx="5" ry="7" fill="#81D4FA" opacity="0.8" />
      <ellipse cx="68" cy="12" rx="5" ry="7" fill="#81D4FA" opacity="0.8" />
    </>}
    className={cn("drop-shadow-md", className)} />
);

/* Coralina – SDG 14 Ocean (teal coral guardian, star eyes, sea-green outfit) */
export const CoralinaSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#E0F7FA" hairColor="#004D40" hairStyle="bunDouble" eyeStyle="starry"
    cheekColor="#80DEEA" expression="happy" outfitColor="#00838F" outfitStyle="dress"
    collarColor="#E0F7FA" bootColor="#006064"
    item={<text x="-4" y="10" fontSize="14">🐠</text>}
    hairAccessory={<>
      <ellipse cx="32" cy="10" rx="6" ry="6" fill="#4DD0E1" />
      <ellipse cx="68" cy="10" rx="6" ry="6" fill="#4DD0E1" />
    </>}
    className={cn("drop-shadow-md", className)} />
);

/* Ferra – SDG 15 Forest (deep green jungle spirit, leaf crown, mossy outfit) */
export const FerraSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#C8E6C9" hairColor="#1B5E20" hairStyle="bun" eyeStyle="crescent"
    cheekColor="#A5D6A7" expression="happy" outfitColor="#2E7D32" outfitStyle="overalls"
    collarColor="#E8F5E9" bootColor="#1B5E20"
    item={<text x="-4" y="10" fontSize="14">🌿</text>}
    hairAccessory={<>
      <ellipse cx="50" cy="10" rx="10" ry="5" fill="#388E3C" opacity="0.9" />
      <ellipse cx="37" cy="13" rx="7" ry="4" fill="#43A047" opacity="0.8" />
      <ellipse cx="63" cy="13" rx="7" ry="4" fill="#43A047" opacity="0.8" />
    </>}
    className={cn("drop-shadow-md", className)} />
);

/* Gaia – SDG 13 Climate (warm ember tone, fiery hair, glowing eyes, earth outfit) */
export const GaiaSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#FFE0B2" hairColor="#BF360C" hairStyle="spiky" eyeStyle="starry"
    cheekColor="#FFAB91" expression="determined" outfitColor="#E64A19" outfitStyle="jacket"
    collarColor="#FBE9E7" bootColor="#BF360C"
    item={<text x="-4" y="10" fontSize="14">🌡️</text>}
    hairAccessory={<>
      {[35, 42, 50, 58, 65].map((x, i) => (
        <ellipse key={i} cx={x} cy={9 - i % 2 * 3} rx="3" ry="6" fill={i % 2 === 0 ? '#FF6F00' : '#FFAB40'} opacity="0.9" />
      ))}
    </>}
    className={cn("drop-shadow-md", className)} />
);

/* Reevo – SDG 12 Consumption (silver-green recycler bot, antenna, eco outfit) */
export const ReevoSprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#DCEDC8" hairColor="#33691E" hairStyle="cap" eyeStyle="dots"
    cheekColor="#AED581" expression="happy" outfitColor="#558B2F" outfitStyle="uniform"
    collarColor="#F1F8E9" bootColor="#33691E"
    item={<text x="-4" y="10" fontSize="14">♻️</text>}
    hairAccessory={<>
      <rect x="45" y="4" width="10" height="12" rx="3" fill="#8BC34A" stroke="#33691E" strokeWidth="1.5" />
      <circle cx="50" cy="3" r="3" fill="#CCFF90" />
    </>}
    className={cn("drop-shadow-md", className)} />
);

/* ── Keep SplashySprite as fallback (unused but exported) ── */
export const SplashySprite = ({ className }: { className?: string }) => (
  <ChibiCharacter skinColor="#B3E5FC" hairColor="#01579B" hairStyle="spiky" eyeStyle="crescent"
    cheekColor="#81D4FA" expression="happy" outfitColor="#29B6F6" outfitStyle="overalls"
    collarColor="#E1F5FE" bootColor="#0277BD"
    className={cn("animate-float drop-shadow-lg", className)} />
);
