import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useGame } from '@/context/GameContext';
import { ZONES } from '@/data/gameData';
import BuildingInterior, { ENTERABLE_BUILDINGS, type BuildingDef } from '@/pages/BuildingInterior';
import {
  WORLD_W, WORLD_H, PLAYER_SPEED, INTERACT_RADIUS, PLAYER_SPAWN,
  WORLD_NPCS, ZONE_REGIONS, WORLD_BUILDINGS, COLLISION_RECTS,
  type WorldNPC,
} from '@/data/worldMap';
import { motion, AnimatePresence } from 'framer-motion';
import { Warden1, Warden2, Warden3 } from '@/components/Sprites';
import {
  BalooSprite, PebblepuffSprite, LeafletSprite, ThinkletSprite, SparkleflameSprite,
  NPC_GrandmaRosa, NPC_YoungMaya,
  NPC_FarmerAli, NPC_CitizenMia, NPC_CitizenTom,
  NPC_MrBun, NPC_LittleZoe, NPC_GrandpaJoe,
  NPC_StudentSam, NPC_StudentAria,
  NPC_Girl, NPC_Worker,
  AquaSprite, CoralinaSprite, FerraSprite, GaiaSprite, ReevoSprite,
  VoltraSprite, GildaSprite, NexusSprite, MiraSprite, SkylarSprite,
} from '@/components/Sprites';

/* ── sprite map ── */
const SPRITE_MAP: Record<string, React.FC<any>> = {
  baloo: BalooSprite, pebblepuff: PebblepuffSprite, leaflet: LeafletSprite,
  thinklet: ThinkletSprite, sparkleflame: SparkleflameSprite,
  grandma: NPC_GrandmaRosa, youngmaya: NPC_YoungMaya,
  farmerali: NPC_FarmerAli, citizenmia: NPC_CitizenMia, citizentom: NPC_CitizenTom,
  mrbun: NPC_MrBun, littlezoe: NPC_LittleZoe, grandpajoe: NPC_GrandpaJoe,
  studentsam: NPC_StudentSam, studentaria: NPC_StudentAria,
  girl: NPC_Girl, worker: NPC_Worker,
  aqua: AquaSprite, coralina: CoralinaSprite, ferra: FerraSprite,
  gaia: GaiaSprite, reevo: ReevoSprite,
  voltra: VoltraSprite, gilda: GildaSprite, nexus: NexusSprite,
  mira: MiraSprite, skylar: SkylarSprite,
};

/* ── check AABB collision ── */
function wouldCollide(nx: number, ny: number, pw = 28, ph = 40): boolean {
  for (const r of COLLISION_RECTS) {
    if (nx < r.x + r.w && nx + pw > r.x && ny < r.y + r.h && ny + ph > r.y) return true;
  }
  return false;
}

/* ── Dialogue component ── */
function Dialogue({
  npc, onNext, onClose, onGoToPuzzle, dialogIndex, completedZones,
  peopleLevelComplete, planetLevelComplete, prosperityLevelComplete, peaceLevelComplete,
}: {
  npc: WorldNPC;
  onNext: () => void;
  onClose: () => void;
  onGoToPuzzle: (zoneId: string) => void;
  dialogIndex: number;
  completedZones: string[];
  peopleLevelComplete: boolean;
  planetLevelComplete: boolean;
  prosperityLevelComplete: boolean;
  peaceLevelComplete: boolean;
}) {
  const zoneData = (ZONES as any)[npc.zoneId] ?? ZONES[npc.zoneId as keyof typeof ZONES];
  if (!zoneData) return null;
  const isLast = dialogIndex >= npc.dialogues.length - 1;
  const isCompleted = completedZones.includes(npc.zoneId);
  const isPlanetZone = zoneData.level === 'planet';
  const isProsperityZone = zoneData.level === 'prosperity';
  const isPeaceZone = zoneData.level === 'peace';
  const isPartnershipZone = zoneData.level === 'partnership';
  const isLocked =
    (isPlanetZone      && !peopleLevelComplete)      ||
    (isProsperityZone  && !planetLevelComplete)       ||
    (isPeaceZone       && !prosperityLevelComplete)   ||
    (isPartnershipZone && !peaceLevelComplete);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
    >
      <div className="bg-white/97 rounded-2xl p-5 shadow-2xl relative border-2" style={{ borderColor: zoneData.themeColor }}>
        <div
          className="absolute -top-4 left-6 px-4 py-1 rounded-full text-white font-bold text-sm shadow-md"
          style={{ background: zoneData.themeColor }}
        >
          {npc.name} {npc.isLord ? '✨' : ''}
          {isPlanetZone && <span className="ml-1 text-xs opacity-80">🌎</span>}
          {isProsperityZone && <span className="ml-1 text-xs opacity-80">🌟</span>}
        </div>
        <p className="text-base text-gray-700 leading-relaxed mt-3 min-h-[2.5rem] font-sans">
          {isLocked && isLast
            ? isProsperityZone  ? "🔒 The Prosperity level is still sealed... Complete all 5 Planet challenges first!"
            : isPeaceZone       ? "🔒 Peace Space is sealed... Complete all 5 Prosperity challenges to unlock it!"
            : isPartnershipZone ? "🔒 Partnership Space is sealed... Complete the Peace challenge to unlock it!"
                                : "🔒 The Planet level is still sealed... Complete all 5 People challenges first!"
            : npc.dialogues[dialogIndex]}
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border-2 border-gray-300 text-sm text-gray-500 hover:bg-gray-100 font-bold"
          >
            Close
          </button>
          {!isLast ? (
            <button
              onClick={onNext}
              className="px-5 py-1.5 rounded-lg text-white text-sm font-bold shadow-md"
              style={{ background: zoneData.themeColor }}
            >
              Next ▶
            </button>
          ) : npc.isLord && !isCompleted && !isLocked ? (
            <button
              onClick={() => { onClose(); onGoToPuzzle(npc.zoneId); }}
              className="px-5 py-1.5 rounded-lg text-white text-sm font-bold shadow-md"
              style={{ background: zoneData.themeColor }}
            >
              🎮 Accept Quest!
            </button>
          ) : isLocked ? (
            <button onClick={onClose} className="px-5 py-1.5 rounded-lg bg-gray-400 text-white text-sm font-bold">
              🔒 Locked
            </button>
          ) : isCompleted ? (
            <button onClick={onClose} className="px-5 py-1.5 rounded-lg text-white text-sm font-bold" style={{ background: zoneData.themeColor }}>
              ✨ Zone Healed!
            </button>
          ) : (
            <button onClick={onClose} className="px-5 py-1.5 rounded-lg text-white text-sm font-bold" style={{ background: zoneData.themeColor }}>
              Thanks! ✓
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── World Background SVG ── */
function WorldBackground({ completedZones }: { completedZones: string[] }) {
  const GATE_Y = 3100;
  const PLANET_CENTER_X = 1600;
  const PLANET_CENTER_Y = 3100;

  return (
    <svg
      width={WORLD_W}
      height={WORLD_H}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* People section textures */}
        <pattern id="grass" patternUnits="userSpaceOnUse" width="40" height="40">
          <rect width="40" height="40" fill="#8BC34A" />
          <ellipse cx="20" cy="20" rx="18" ry="16" fill="#7CB342" opacity="0.3" />
        </pattern>
        <pattern id="cobble" patternUnits="userSpaceOnUse" width="32" height="32">
          <rect width="32" height="32" fill="#B0BEC5" />
          <rect x="1" y="1" width="14" height="14" rx="2" fill="#90A4AE" />
          <rect x="17" y="1" width="14" height="14" rx="2" fill="#90A4AE" />
          <rect x="1" y="17" width="14" height="14" rx="2" fill="#90A4AE" />
          <rect x="17" y="17" width="14" height="14" rx="2" fill="#90A4AE" />
        </pattern>
        {/* Planet section textures */}
        <pattern id="ocean-bg" patternUnits="userSpaceOnUse" width="60" height="60">
          <rect width="60" height="60" fill="#1976D2" />
          <path d="M 0 30 Q 15 18 30 30 Q 45 42 60 30" stroke="#42A5F5" strokeWidth="4" fill="none" opacity="0.6" />
        </pattern>
        <pattern id="forest-bg" patternUnits="userSpaceOnUse" width="50" height="50">
          <rect width="50" height="50" fill="#388E3C" />
          <ellipse cx="25" cy="25" rx="20" ry="18" fill="#4CAF50" opacity="0.4" />
        </pattern>
        <pattern id="arctic-bg" patternUnits="userSpaceOnUse" width="50" height="50">
          <rect width="50" height="50" fill="#E3F2FD" />
          <ellipse cx="25" cy="25" rx="18" ry="14" fill="#BBDEFB" opacity="0.5" />
        </pattern>
        <pattern id="industrial-bg" patternUnits="userSpaceOnUse" width="40" height="40">
          <rect width="40" height="40" fill="#78909C" />
          <rect x="5" y="5" width="12" height="12" fill="#90A4AE" opacity="0.4" />
          <rect x="23" y="23" width="12" height="12" fill="#90A4AE" opacity="0.4" />
        </pattern>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2" />
        </filter>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* ── Clay 3D tree gradients ── */}
        <radialGradient id="treeHL" cx="32%" cy="26%" r="65%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="white" stopOpacity="0.50" />
          <stop offset="55%"  stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="treeSH" cx="72%" cy="80%" r="55%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="black" stopOpacity="0.20" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="plazaHL" cx="35%" cy="30%" r="70%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ════ PEOPLE SECTION BASE ════ */}
      <rect x="0" y="0" width={WORLD_W} height={GATE_Y} fill="url(#grass)" />

      {/* ════ TRANSITION / GATE ZONE ════ */}
      <rect x="0" y={GATE_Y} width={WORLD_W} height="300" fill="#263238" />
      {/* Transition gradient strips */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={i} x={i * WORLD_W / 8} y={GATE_Y} width={WORLD_W / 8} height="300"
          fill={i % 2 === 0 ? '#1A2B2E' : '#263238'} opacity="0.8" />
      ))}

      {/* Gate arch */}
      <ellipse cx={PLANET_CENTER_X} cy={GATE_Y + 40} rx="220" ry="110"
        fill="none" stroke="#00BCD4" strokeWidth="12" opacity="0.9" filter="url(#glow)" />
      <ellipse cx={PLANET_CENTER_X} cy={GATE_Y + 40} rx="200" ry="95"
        fill="none" stroke="#26C6DA" strokeWidth="6" opacity="0.7" />
      {/* Gate pillars */}
      <rect x={PLANET_CENTER_X - 230} y={GATE_Y - 40} width="30" height="180" rx="10" fill="#00838F" opacity="0.9" />
      <rect x={PLANET_CENTER_X + 200} y={GATE_Y - 40} width="30" height="180" rx="10" fill="#00838F" opacity="0.9" />
      {/* Gate top gems */}
      <circle cx={PLANET_CENTER_X - 215} cy={GATE_Y - 50} r="18" fill="#00BCD4" stroke="white" strokeWidth="3" />
      <circle cx={PLANET_CENTER_X + 215} cy={GATE_Y - 50} r="18" fill="#00BCD4" stroke="white" strokeWidth="3" />
      <text x={PLANET_CENTER_X - 215} y={GATE_Y - 44} textAnchor="middle" fontSize="14">🌎</text>
      <text x={PLANET_CENTER_X + 215} y={GATE_Y - 44} textAnchor="middle" fontSize="14">🌿</text>
      {/* Gate text */}
      <rect x={PLANET_CENTER_X - 180} y={GATE_Y + 55} width="360" height="40" rx="20" fill="#006064" />
      <text x={PLANET_CENTER_X} y={GATE_Y + 81} textAnchor="middle" fontSize="16" fontWeight="bold"
        fontFamily="Nunito" fill="white">🌍 Planet Level Gateway 🌎</text>
      {/* Gate path below */}
      <rect x={PLANET_CENTER_X - 60} y={GATE_Y + 95} width="120" height="210" rx="8" fill="#004D40" opacity="0.6" />

      {/* Star/sparkle decorations on gate */}
      {[-160, -100, 100, 160].map((ox, i) => (
        <text key={i} x={PLANET_CENTER_X + ox} y={GATE_Y + 20} textAnchor="middle" fontSize="18" opacity="0.8">✨</text>
      ))}

      {/* ════ PLANET SECTION BIOME BACKGROUNDS ════ */}
      {/* Overall planet base (medium teal-green) */}
      <rect x="0" y={2500} width={WORLD_W} height={WORLD_H - 2500} fill="#2E7D52" />

      {/* Water/Mountain biome (top-left planet) */}
      <rect x="0" y={2500} width="1150" height="1300" fill="#1976D2" opacity="0.55" />
      {/* Mountain peaks */}
      <polygon points="50,2800 200,2500 350,2800" fill="#455A64" opacity="0.7" />
      <polygon points="180,2780 350,2450 520,2780" fill="#546E7A" opacity="0.7" />
      <polygon points="50,2780 150,2550 250,2780" fill="#607D8B" opacity="0.5" />
      {/* Mountain snow caps */}
      <polygon points="200,2500 220,2540 180,2540" fill="white" opacity="0.85" />
      <polygon points="350,2450 375,2495 325,2495" fill="white" opacity="0.85" />
      {/* River flowing through water zone */}
      <path d="M 200 2500 Q 400 2700 500 2850 Q 600 3000 700 3100 Q 800 3200 900 3300"
        stroke="#29B6F6" strokeWidth="40" fill="none" opacity="0.6" />
      <path d="M 200 2500 Q 400 2700 500 2850 Q 600 3000 700 3100 Q 800 3200 900 3300"
        stroke="white" strokeWidth="16" fill="none" opacity="0.25" strokeDasharray="30 40" />
      {/* River ripples */}
      {[[380, 2700], [480, 2840], [580, 2980], [680, 3100], [800, 3240]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="22" ry="7" fill="none" stroke="white" strokeWidth="2" opacity="0.35" />
      ))}

      {/* Ocean biome (top-right planet) */}
      <rect x="2050" y={2500} width="1150" height="1300" fill="url(#ocean-bg)" opacity="0.9" />
      {/* Ocean waves */}
      {[2600, 2700, 2800, 2900, 3000, 3100, 3200].map((y, i) => (
        <path key={i} d={`M 2100 ${y} Q 2350 ${y - 25} 2600 ${y} Q 2850 ${y + 25} 3100 ${y}`}
          stroke="#1565C0" strokeWidth="6" fill="none" opacity="0.4" />
      ))}
      {/* Coral reef circles */}
      {[[2400, 2750], [2550, 2820], [2700, 2770], [2850, 2840]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="22" fill={['#FF7043', '#EC407A', '#AB47BC', '#FF8F00'][i]} opacity="0.5" />
          <circle cx={x} cy={y} r="12" fill={['#FF5722', '#E91E63', '#9C27B0', '#FF6F00'][i]} opacity="0.6" />
        </g>
      ))}
      {/* Fish silhouettes */}
      {[[2300, 2680], [2450, 2730], [2650, 2710], [2800, 2760]].map(([x, y], i) => (
        <text key={i} x={x} y={y} fontSize="18" opacity="0.5">🐠</text>
      ))}
      {/* Sandy shore */}
      <path d="M 2050 2600 Q 2150 2580 2250 2600 Q 2350 2620 2280 2640 L 2050 2640 Z"
        fill="#FFF176" opacity="0.5" />

      {/* Forest/Jungle biome (bottom-left planet) */}
      <rect x="0" y="3450" width="1150" height="1150" fill="url(#forest-bg)" opacity="0.80" />
      {/* Dense jungle trees in background */}
      {[[60,3520],[150,3480],[230,3510],[320,3490],[400,3520],[480,3480],[560,3505],[640,3490],[720,3520],[800,3480],[880,3510],[950,3490]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="-4" y="20" width="8" height="40" fill="#3E2723" opacity="0.5" />
          <ellipse cx="0" cy="0" rx="25" ry="30" fill={i % 3 === 0 ? '#1B5E20' : i % 3 === 1 ? '#2E7D32' : '#33691E'} opacity="0.7" />
          <ellipse cx="0" cy="-10" rx="18" ry="22" fill={i % 3 === 0 ? '#388E3C' : i % 3 === 1 ? '#43A047' : '#2E7D32'} opacity="0.7" />
        </g>
      ))}
      {/* Jungle floor leaves */}
      {[[100,3600],[250,3650],[380,3610],[520,3640],[660,3605],[790,3645]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="28" ry="12" fill="#558B2F" opacity="0.6" transform={`rotate(${i * 30} ${x} ${y})`} />
      ))}

      {/* Arctic/Climate biome (bottom-right planet) */}
      <rect x="2050" y="3450" width="1150" height="1150" fill="url(#arctic-bg)" opacity="0.80" />
      {/* Melting ice flows */}
      {[[2150, 3600], [2350, 3550], [2550, 3600], [2750, 3570], [2950, 3600]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="80" ry="22" fill="#B3E5FC" opacity="0.6" />
      ))}
      {/* Cracked ice patterns */}
      <path d="M 2100 3750 L 2300 3700 L 2500 3760 L 2700 3710 L 2900 3750" stroke="#90CAF9" strokeWidth="4" fill="none" opacity="0.6" strokeDasharray="20 12" />
      <path d="M 2200 3850 L 2400 3820 L 2600 3870 L 2800 3830" stroke="#90CAF9" strokeWidth="3" fill="none" opacity="0.5" strokeDasharray="15 10" />
      {/* Snowflake decorations */}
      {[[2180, 3550], [2420, 3510], [2650, 3545], [2900, 3520]].map(([x, y], i) => (
        <text key={i} x={x} y={y} fontSize="20" opacity="0.5">❄️</text>
      ))}
      {/* Storm clouds */}
      <ellipse cx="2600" cy="3490" rx="120" ry="50" fill="#78909C" opacity="0.5" />
      <ellipse cx="2750" cy="3480" rx="90" ry="40" fill="#607D8B" opacity="0.4" />

      {/* Industrial/Consumption biome (bottom-center) */}
      <rect x="1000" y="3950" width="1200" height="650" fill="url(#industrial-bg)" opacity="0.95" />
      {/* Smoke stacks */}
      {[[1150, 4010], [1280, 3990], [1420, 4010], [1560, 3985], [1700, 4010], [1840, 3990]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 10} y={y} width="20" height="80" fill="#37474F" opacity="0.8" />
          <ellipse cx={x} cy={y - 15} rx="16" ry="25" fill="#B0BEC5" opacity="0.5" />
          <ellipse cx={x + 8} cy={y - 35} rx="12" ry="18" fill="#CFD8DC" opacity="0.4" />
        </g>
      ))}
      {/* Conveyor belt visual */}
      <path d="M 1080 4350 L 2120 4350" stroke="#455A64" strokeWidth="20" opacity="0.6" />
      <path d="M 1080 4350 L 2120 4350" stroke="#78909C" strokeWidth="8" strokeDasharray="30 20" opacity="0.5" />

      {/* ════ PEOPLE ZONE GROUND AREAS ════ */}
      {ZONE_REGIONS.filter(z => z.level === 'people').map(z => {
        const done = completedZones.includes(z.id);
        return (
          <g key={z.id}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="20" ry="20"
              fill={done ? z.color : '#D7CCC8'}
              stroke={done ? z.borderColor : '#9E9E9E'}
              strokeWidth="4" strokeDasharray={done ? 'none' : '12 6'}
              filter="url(#shadow)" />
            {/* Big floating banner — sits above any buildings */}
            <rect x={z.x + z.w / 2 - 150} y={z.y - 68} width="300" height="52" rx="26"
              fill={done ? z.borderColor : '#616161'} filter="url(#shadow)" />
            <rect x={z.x + z.w / 2 - 150} y={z.y - 68} width="300" height="52" rx="26"
              fill="white" opacity="0.12" />
            <text x={z.x + z.w / 2} y={z.y - 50} textAnchor="middle" fill="white"
              fontSize="11" fontFamily="Nunito" opacity="0.85">
              {done ? '✅ Zone Healed!' : '🔒 Undiscovered'}
            </text>
            <text x={z.x + z.w / 2} y={z.y - 28} textAnchor="middle" fill="white"
              fontSize="20" fontWeight="bold" fontFamily="Patrick Hand, cursive">
              {z.emoji} SDG {z.sdg} · {z.name}
            </text>
          </g>
        );
      })}

      {/* ════ PLANET ZONE GROUND AREAS ════ */}
      {ZONE_REGIONS.filter(z => z.level === 'planet').map(z => {
        const done = completedZones.includes(z.id);
        return (
          <g key={z.id}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="24" ry="24"
              fill={done ? z.color : 'rgba(255,255,255,0.18)'}
              stroke={done ? z.borderColor : '#80CBC4'}
              strokeWidth="5" strokeDasharray={done ? 'none' : '14 7'}
              filter="url(#shadow)" />
            {/* Big floating banner */}
            <rect x={z.x + z.w / 2 - 160} y={z.y - 70} width="320" height="54" rx="27"
              fill={done ? z.borderColor : '#00838F'} filter="url(#shadow)" />
            <rect x={z.x + z.w / 2 - 160} y={z.y - 70} width="320" height="54" rx="27"
              fill="white" opacity="0.12" />
            <text x={z.x + z.w / 2} y={z.y - 52} textAnchor="middle" fill="white"
              fontSize="11" fontFamily="Nunito" opacity="0.88">
              {done ? '✅ Zone Healed!' : '🔒 Undiscovered'}
            </text>
            <text x={z.x + z.w / 2} y={z.y - 30} textAnchor="middle" fill="white"
              fontSize="20" fontWeight="bold" fontFamily="Patrick Hand, cursive">
              {z.emoji} SDG {z.sdg} · {z.name}
            </text>
          </g>
        );
      })}

      {/* ════════════════════════════════════════════════════════════
           MAIN LEVEL CORRIDOR  People → Gate → Planet → Gate → Prosperity
           Drawn first so all zones/buildings sit on top
      ════════════════════════════════════════════════════════════ */}
      {/* Wide asphalt road base */}
      <rect x="1520" y="1060" width="120" height="2100" fill="#8D8D8D" opacity="0.5" />
      {/* Road surface */}
      <rect x="1540" y="1060" width="80" height="2100" fill="#9E9E9E" opacity="0.55" />
      {/* Centre dashes — People to gate */}
      {Array.from({ length: 18 }).map((_, i) => (
        <rect key={`rd-p-${i}`} x="1574" y={1120 + i * 110} width="12" height="60"
          fill="rgba(255,255,200,0.55)" rx="3" />
      ))}
      {/* Planet section road (gate exit → Planet hub → Prosperity gate) */}
      <rect x="1520" y="3400" width="120" height="1280" fill="#607D8B" opacity="0.45" />
      <rect x="1540" y="3400" width="80"  height="1280" fill="#78909C" opacity="0.5" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={`rd-pl-${i}`} x="1574" y={3440 + i * 120} width="12" height="70"
          fill="rgba(200,230,255,0.5)" rx="3" />
      ))}
      {/* Prosperity section road (gate exit → Prosperity hub) */}
      <rect x="1520" y="4920" width="120" height="820" fill="#455A64" opacity="0.4" />
      <rect x="1540" y="4920" width="80"  height="820" fill="#546E7A" opacity="0.45" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={`rd-pr-${i}`} x="1574" y={4960 + i * 110} width="12" height="65"
          fill="rgba(255,215,0,0.4)" rx="3" />
      ))}
      {/* Benches along the main road — People section */}
      {[1250, 1450, 1700, 1900, 2100].map((y, i) => (
        <g key={`bench-l-${i}`} transform={`translate(1490, ${y})`}>
          <rect x="0" y="0" width="35" height="12" rx="4" fill="#8D6E63" />
          <rect x="5" y="12" width="5" height="12" rx="2" fill="#6D4C41" />
          <rect x="25" y="12" width="5" height="12" rx="2" fill="#6D4C41" />
        </g>
      ))}
      {[1250, 1450, 1700, 1900, 2100].map((y, i) => (
        <g key={`bench-r-${i}`} transform={`translate(1635, ${y})`}>
          <rect x="0" y="0" width="35" height="12" rx="4" fill="#8D6E63" />
          <rect x="5" y="12" width="5" height="12" rx="2" fill="#6D4C41" />
          <rect x="25" y="12" width="5" height="12" rx="2" fill="#6D4C41" />
        </g>
      ))}

      {/* ════ PEOPLE DIRT PATHS ════ */}
      {/* Center to NW (equality) */}
      <path d="M 1580 1060 Q 1000 700 540 420" stroke="#C8A96E" strokeWidth="55" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M 1580 1060 Q 1000 700 540 420" stroke="#DDB97E" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Center to N (health) */}
      <path d="M 1580 1060 Q 1580 700 1580 370" stroke="#C8A96E" strokeWidth="55" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M 1580 1060 Q 1580 700 1580 370" stroke="#DDB97E" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Center to NE (hunger) */}
      <path d="M 1580 1060 Q 2200 700 2660 420" stroke="#C8A96E" strokeWidth="55" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M 1580 1060 Q 2200 700 2660 420" stroke="#DDB97E" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Center to SW (poverty) */}
      <path d="M 1580 1060 Q 1000 1400 540 1680" stroke="#C8A96E" strokeWidth="55" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M 1580 1060 Q 1000 1400 540 1680" stroke="#DDB97E" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Center to SE (education) */}
      <path d="M 1580 1060 Q 2200 1400 2660 1680" stroke="#C8A96E" strokeWidth="55" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M 1580 1060 Q 2200 1400 2660 1680" stroke="#DDB97E" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Path from People center down to gate (now enhanced by main road above) */}
      <path d="M 1580 1060 Q 1580 1700 1600 2150" stroke="#C8A96E" strokeWidth="55" fill="none" strokeLinecap="round" opacity="0.35" />
      <path d="M 1580 1060 Q 1580 1700 1600 2150" stroke="#DDB97E" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.25" />

      {/* ════ PEOPLE CENTRAL PLAZA ════ */}
      <circle cx="1580" cy="1060" r="180" fill="url(#cobble)" stroke="#78909C" strokeWidth="6" filter="url(#shadow)" />
      <circle cx="1580" cy="1060" r="180" fill="none" stroke="#90A4AE" strokeWidth="5" />
      <text x="1580" y="990" textAnchor="middle" fontSize="22" fontWeight="bold" fontFamily="Patrick Hand, cursive" fill="#455A64">🌍 People World</text>
      <text x="1580" y="1020" textAnchor="middle" fontSize="13" fontFamily="Nunito" fill="#607D8B">Heal 5 zones to unlock the Planet!</text>

      {/* ════ PEOPLE DIRECTIONAL SIGNPOST (center plaza) ════ */}
      <g transform="translate(1580, 880)">
        {/* Wooden post */}
        <rect x="-5" y="-10" width="10" height="240" rx="4" fill="#6D4C41" />
        <rect x="-2" y="-10" width="3" height="240" rx="2" fill="rgba(255,255,255,0.18)" />

        {/* ↑ HEALTH — top board */}
        {(() => { const done = completedZones.includes('health'); return (
          <g>
            <rect x="-90" y="-36" width="180" height="36" rx="10" fill={done ? '#2E7D32' : '#546E7A'} filter="url(#shadow)" />
            <text x="0" y="-13" textAnchor="middle" fontSize="15" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">🏥 SDG 3 · Health ↑</text>
            {done && <text x="0" y="-34" textAnchor="middle" fontSize="10" fill="#A5D6A7">✓ Healed!</text>}
          </g>
        ); })()}

        {/* ← EQUALITY and HUNGER → — middle row */}
        {(() => { const done = completedZones.includes('equality'); return (
          <g>
            <rect x="-185" y="14" width="170" height="36" rx="10" fill={done ? '#E65100' : '#546E7A'} filter="url(#shadow)" />
            <polygon points="-185,14 -185,50 -202,32" fill={done ? '#E65100' : '#546E7A'} />
            <text x="-100" y="37" textAnchor="middle" fontSize="14" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">⚡ SDG 5 · Equality</text>
          </g>
        ); })()}
        {(() => { const done = completedZones.includes('hunger'); return (
          <g>
            <rect x="15" y="14" width="170" height="36" rx="10" fill={done ? '#F57F17' : '#546E7A'} filter="url(#shadow)" />
            <polygon points="185,14 185,50 202,32" fill={done ? '#F57F17' : '#546E7A'} />
            <text x="100" y="37" textAnchor="middle" fontSize="14" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">🌾 SDG 2 · Hunger</text>
          </g>
        ); })()}

        {/* ← POVERTY and EDUCATION → — bottom row */}
        {(() => { const done = completedZones.includes('poverty'); return (
          <g>
            <rect x="-185" y="62" width="170" height="36" rx="10" fill={done ? '#B71C1C' : '#546E7A'} filter="url(#shadow)" />
            <polygon points="-185,62 -185,98 -202,80" fill={done ? '#B71C1C' : '#546E7A'} />
            <text x="-100" y="85" textAnchor="middle" fontSize="14" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">🏘️ SDG 1 · Poverty</text>
          </g>
        ); })()}
        {(() => { const done = completedZones.includes('education'); return (
          <g>
            <rect x="15" y="62" width="170" height="36" rx="10" fill={done ? '#4A148C' : '#546E7A'} filter="url(#shadow)" />
            <polygon points="185,62 185,98 202,80" fill={done ? '#4A148C' : '#546E7A'} />
            <text x="100" y="85" textAnchor="middle" fontSize="14" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">🎓 SDG 4 · Education</text>
          </g>
        ); })()}

        {/* ↓ PLANET GATEWAY — bottom board */}
        <g>
          <rect x="-80" y="98" width="160" height="28" rx="7" fill="#006064" filter="url(#shadow)" />
          <text x="0" y="117" textAnchor="middle" fontSize="10" fill="#80DEEA" fontFamily="Nunito" fontWeight="bold">↓ Planet Gateway</text>
        </g>
      </g>

      {/* ════ MID-PATH SIGNS ════ */}
      {/* Health path — midpoint ~(1580, 550) */}
      {(() => { const done = completedZones.includes('health'); return (
        <g transform="translate(1640, 555)">
          <rect x="-4" y="-5" width="7" height="55" rx="3" fill="#6D4C41" />
          <rect x="-55" y="-20" width="110" height="22" rx="5" fill={done ? '#2E7D32' : '#9E9E9E'} />
          <text x="0" y="-5" textAnchor="middle" fontSize="9" fill="white" fontFamily="Nunito" fontWeight="bold">🏥 Leaflet's Clinic ↑</text>
        </g>
      ); })()}

      {/* Equality path — midpoint ~(890, 720) */}
      {(() => { const done = completedZones.includes('equality'); return (
        <g transform="translate(890, 730)">
          <rect x="-4" y="-5" width="7" height="55" rx="3" fill="#6D4C41" />
          <rect x="-105" y="-20" width="100" height="22" rx="5" fill={done ? '#FF8F00' : '#9E9E9E'} />
          <polygon points="-105,-20 -105,2 -116,-9" fill={done ? '#FF8F00' : '#9E9E9E'} />
          <text x="-55" y="-5" textAnchor="middle" fontSize="9" fill="white" fontFamily="Nunito" fontWeight="bold">⚡ Equality ←</text>
        </g>
      ); })()}

      {/* Hunger path — midpoint ~(2240, 720) */}
      {(() => { const done = completedZones.includes('hunger'); return (
        <g transform="translate(2240, 730)">
          <rect x="-4" y="-5" width="7" height="55" rx="3" fill="#6D4C41" />
          <rect x="5" y="-20" width="100" height="22" rx="5" fill={done ? '#F57F17' : '#9E9E9E'} />
          <polygon points="105,-20 105,2 116,-9" fill={done ? '#F57F17' : '#9E9E9E'} />
          <text x="55" y="-5" textAnchor="middle" fontSize="9" fill="white" fontFamily="Nunito" fontWeight="bold">→ Hunger 🌾</text>
        </g>
      ); })()}

      {/* Poverty path — midpoint ~(870, 1340) */}
      {(() => { const done = completedZones.includes('poverty'); return (
        <g transform="translate(870, 1340)">
          <rect x="-4" y="-5" width="7" height="55" rx="3" fill="#6D4C41" />
          <rect x="-105" y="-20" width="100" height="22" rx="5" fill={done ? '#C62828' : '#9E9E9E'} />
          <polygon points="-105,-20 -105,2 -116,-9" fill={done ? '#C62828' : '#9E9E9E'} />
          <text x="-55" y="-5" textAnchor="middle" fontSize="9" fill="white" fontFamily="Nunito" fontWeight="bold">⬅ Poverty 🏘️</text>
        </g>
      ); })()}

      {/* Education path — midpoint ~(2250, 1340) */}
      {(() => { const done = completedZones.includes('education'); return (
        <g transform="translate(2250, 1340)">
          <rect x="-4" y="-5" width="7" height="55" rx="3" fill="#6D4C41" />
          <rect x="5" y="-20" width="100" height="22" rx="5" fill={done ? '#4A148C' : '#9E9E9E'} />
          <polygon points="105,-20 105,2 116,-9" fill={done ? '#4A148C' : '#9E9E9E'} />
          <text x="55" y="-5" textAnchor="middle" fontSize="9" fill="white" fontFamily="Nunito" fontWeight="bold">Education 🎓 →</text>
        </g>
      ); })()}

      {/* ════ PLANET PATHS ════ */}
      {/* Center to NW (water) */}
      <path d={`M ${PLANET_CENTER_X} ${PLANET_CENTER_Y} Q 1000 2900 560 2890`} stroke="#29B6F6" strokeWidth="48" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d={`M ${PLANET_CENTER_X} ${PLANET_CENTER_Y} Q 1000 2900 560 2890`} stroke="#81D4FA" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.4" />
      {/* Center to NE (ocean) */}
      <path d={`M ${PLANET_CENTER_X} ${PLANET_CENTER_Y} Q 2150 2900 2640 2890`} stroke="#0288D1" strokeWidth="48" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d={`M ${PLANET_CENTER_X} ${PLANET_CENTER_Y} Q 2150 2900 2640 2890`} stroke="#29B6F6" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.4" />
      {/* Center to SW (forest) */}
      <path d={`M ${PLANET_CENTER_X} ${PLANET_CENTER_Y} Q 1000 3700 560 3790`} stroke="#2E7D32" strokeWidth="48" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d={`M ${PLANET_CENTER_X} ${PLANET_CENTER_Y} Q 1000 3700 560 3790`} stroke="#66BB6A" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.4" />
      {/* Center to SE (climate) */}
      <path d={`M ${PLANET_CENTER_X} ${PLANET_CENTER_Y} Q 2150 3700 2640 3790`} stroke="#E64A19" strokeWidth="48" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d={`M ${PLANET_CENTER_X} ${PLANET_CENTER_Y} Q 2150 3700 2640 3790`} stroke="#FF8A65" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.4" />
      {/* Center to S (consumption) */}
      <path d={`M ${PLANET_CENTER_X} ${PLANET_CENTER_Y} Q 1600 3700 1600 4260`} stroke="#558B2F" strokeWidth="48" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d={`M ${PLANET_CENTER_X} ${PLANET_CENTER_Y} Q 1600 3700 1600 4260`} stroke="#AED581" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.4" />
      {/* Planet hub down from gate */}
      <path d={`M ${PLANET_CENTER_X} 2500 Q ${PLANET_CENTER_X} 2800 ${PLANET_CENTER_X} ${PLANET_CENTER_Y}`} stroke="#00BCD4" strokeWidth="52" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d={`M ${PLANET_CENTER_X} 2500 Q ${PLANET_CENTER_X} 2800 ${PLANET_CENTER_X} ${PLANET_CENTER_Y}`} stroke="#80DEEA" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.4" />

      {/* ════ PLANET CENTRAL PLAZA ════ */}
      <circle cx={PLANET_CENTER_X} cy={PLANET_CENTER_Y} r="190" fill="#00464D" stroke="#00838F" strokeWidth="7" filter="url(#shadow)" />
      <circle cx={PLANET_CENTER_X} cy={PLANET_CENTER_Y} r="190" fill="none" stroke="#00BCD4" strokeWidth="5" opacity="0.7" />
      <text x={PLANET_CENTER_X} y={PLANET_CENTER_Y - 50} textAnchor="middle" fontSize="22" fontWeight="bold" fontFamily="Patrick Hand, cursive" fill="#80DEEA">🌎 Planet World</text>
      <text x={PLANET_CENTER_X} y={PLANET_CENTER_Y - 22} textAnchor="middle" fontSize="13" fontFamily="Nunito" fill="#4DD0E1">Heal 5 planet zones to save Earth!</text>

      {/* ════ PLANET DIRECTIONAL SIGNPOST ════ */}
      <g transform={`translate(${PLANET_CENTER_X + 220}, ${PLANET_CENTER_Y - 80})`}>
        <rect x="-5" y="-10" width="10" height="200" rx="4" fill="#004D40" />
        <rect x="-2" y="-10" width="3" height="200" rx="2" fill="rgba(0,188,212,0.3)" />
        {/* ← WATER */}
        {(() => { const done = completedZones.includes('water'); return (
          <g>
            <rect x="-175" y="0" width="160" height="34" rx="10" fill={done ? '#0277BD' : '#455A64'} filter="url(#shadow)" />
            <polygon points="-175,0 -175,34 -196,17" fill={done ? '#0277BD' : '#455A64'} />
            <text x="-95" y="22" textAnchor="middle" fontSize="13" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">💧 SDG 6 · Water</text>
          </g>
        ); })()}
        {/* OCEAN → */}
        {(() => { const done = completedZones.includes('ocean'); return (
          <g>
            <rect x="15" y="0" width="160" height="34" rx="10" fill={done ? '#006064' : '#455A64'} filter="url(#shadow)" />
            <polygon points="175,0 175,34 196,17" fill={done ? '#006064' : '#455A64'} />
            <text x="95" y="22" textAnchor="middle" fontSize="13" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">SDG 14 · Ocean 🐠</text>
          </g>
        ); })()}
        {/* ← FOREST */}
        {(() => { const done = completedZones.includes('forest'); return (
          <g>
            <rect x="-175" y="46" width="160" height="34" rx="10" fill={done ? '#1B5E20' : '#455A64'} filter="url(#shadow)" />
            <polygon points="-175,46 -175,80 -196,63" fill={done ? '#1B5E20' : '#455A64'} />
            <text x="-95" y="68" textAnchor="middle" fontSize="13" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">🌿 SDG 15 · Forest</text>
          </g>
        ); })()}
        {/* CLIMATE → */}
        {(() => { const done = completedZones.includes('climate'); return (
          <g>
            <rect x="15" y="46" width="160" height="34" rx="10" fill={done ? '#BF360C' : '#455A64'} filter="url(#shadow)" />
            <polygon points="175,46 175,80 196,63" fill={done ? '#BF360C' : '#455A64'} />
            <text x="95" y="68" textAnchor="middle" fontSize="13" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">SDG 13 · Climate 🌡️</text>
          </g>
        ); })()}
        {/* ↓ CONSUMPTION */}
        {(() => { const done = completedZones.includes('consumption'); return (
          <g>
            <rect x="-80" y="92" width="160" height="34" rx="10" fill={done ? '#558B2F' : '#455A64'} filter="url(#shadow)" />
            <text x="0" y="114" textAnchor="middle" fontSize="13" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">♻️ SDG 12 · Consumption ↓</text>
          </g>
        ); })()}
      </g>

      {/* ════ PEOPLE SECTION RIVER ════ */}
      <path d="M 0 1350 Q 700 1280 1200 1320 Q 1600 1360 2100 1290 Q 2600 1220 3200 1280"
        stroke="#64B5F6" strokeWidth="38" fill="none" opacity="0.5" />
      <path d="M 0 1350 Q 700 1280 1200 1320 Q 1600 1360 2100 1290 Q 2600 1220 3200 1280"
        stroke="white" strokeWidth="14" fill="none" opacity="0.2" strokeDasharray="30 40" />
      {[200, 500, 850, 1200, 1600, 1950, 2350, 2750, 3050].map((x, i) => (
        <ellipse key={i} cx={x} cy={1315 + (i % 2) * 20} rx="28" ry="8" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
      ))}
      {/* Bridge */}
      <rect x={1550} y={1290} width="80" height="52" rx="4" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="4" />
      <rect x={1535} y={1290} width="12" height="52" fill="#8D6E63" />
      <rect x={1625} y={1290} width="12" height="52" fill="#8D6E63" />

      {/* ════ PEOPLE TREES — clay 3D ════ */}
      {[
        [820, 200], [920, 310], [1060, 190], [2100, 200], [2200, 310], [2300, 190],
        [820, 1380], [940, 1460], [2100, 1380], [2250, 1440],
        [100, 800], [110, 950], [2980, 800], [2990, 950],
        [1150, 480], [2010, 480], [1150, 1680], [2010, 1680],
      ].map(([x, y], i) => {
        const base = [['#558B2F','#33691E'],['#388E3C','#1B5E20'],['#33691E','#1B5E20']][i % 3];
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            {/* Ground shadow */}
            <ellipse cx="0" cy="42" rx="18" ry="6" fill="rgba(0,0,0,0.18)" />
            {/* Trunk — clay cylinder */}
            <rect x="-6" y="14" width="12" height="32" rx="5" fill="#8D6E63" />
            <rect x="-6" y="14" width="12" height="32" rx="5" fill="url(#treeHL)" />
            {/* Back crown sphere */}
            <ellipse cx="0" cy="-4" rx="27" ry="30" fill={base[1]} />
            <ellipse cx="0" cy="-4" rx="27" ry="30" fill="url(#treeHL)" />
            <ellipse cx="0" cy="-4" rx="27" ry="30" fill="url(#treeSH)" />
            {/* Front crown sphere (slightly lighter, offset up-left) */}
            <ellipse cx="-4" cy="-12" rx="20" ry="22" fill={base[0]} />
            <ellipse cx="-4" cy="-12" rx="20" ry="22" fill="url(#treeHL)" />
            <ellipse cx="-4" cy="-12" rx="20" ry="22" fill="url(#treeSH)" />
            {/* Specular highlight */}
            <ellipse cx="-10" cy="-22" rx="7" ry="5" fill="white" opacity="0.35" />
          </g>
        );
      })}

      {/* Flowers */}
      {[
        [820, 780], [1000, 740], [1250, 940], [1800, 940], [2050, 850],
        [820, 1500], [1000, 1460], [1800, 1510], [2050, 1460],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <circle cx="0" cy="0" r="6" fill={['#FF80AB','#FFCC02','#80DEEA','#FFB74D','#CE93D8','#F48FB1'][i % 6]} />
          <circle cx="9" cy="-5" r="5" fill={['#F48FB1','#FFE082','#80CBC4','#FFCC80','#CE93D8','#FF80AB'][(i+1) % 6]} />
          <circle cx="-9" cy="-4" r="5" fill={['#CE93D8','#FFCC02','#80DEEA','#FFB74D','#F48FB1','#FFCC02'][(i+2) % 6]} />
        </g>
      ))}

      {/* Farm crops (hunger zone) */}
      {[2380, 2460, 2540, 2620, 2700, 2780, 2860, 2940].map((x, i) => (
        <g key={i}>
          <rect x={x} y="600" width="12" height="32" fill="#795548" opacity="0.6" />
          <ellipse cx={x + 6} cy="600" rx="11" ry="15" fill={i % 2 === 0 ? '#FDD835' : '#8BC34A'} />
          <rect x={x} y="670" width="12" height="26" fill="#795548" opacity="0.6" />
          <ellipse cx={x + 6} cy="670" rx="11" ry="13" fill={i % 2 === 0 ? '#EF5350' : '#FDD835'} />
        </g>
      ))}

      {/* ════ PLANET JUNGLE TREES — clay 3D ════ */}
      {[[280,3560],[340,3590],[430,3545],[510,3580],[600,3555],[680,3590],[760,3560],[840,3590]].map(([x, y], i) => {
        const base = i % 2 === 0 ? ['#388E3C','#1B5E20'] : ['#43A047','#2E7D32'];
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <ellipse cx="0" cy="52" rx="20" ry="7" fill="rgba(0,0,0,0.20)" />
            <rect x="-7" y="18" width="14" height="40" rx="6" fill="#5D4037" />
            <rect x="-7" y="18" width="14" height="40" rx="6" fill="url(#treeHL)" />
            <ellipse cx="0" cy="-2" rx="32" ry="36" fill={base[1]} />
            <ellipse cx="0" cy="-2" rx="32" ry="36" fill="url(#treeHL)" />
            <ellipse cx="0" cy="-2" rx="32" ry="36" fill="url(#treeSH)" />
            <ellipse cx="8" cy="-16" rx="22" ry="25" fill={base[0]} />
            <ellipse cx="8" cy="-16" rx="22" ry="25" fill="url(#treeHL)" />
            <ellipse cx="8" cy="-16" rx="22" ry="25" fill="url(#treeSH)" />
            <ellipse cx="-6" cy="-19" rx="14" ry="16" fill="#66BB6A" />
            <ellipse cx="-6" cy="-19" rx="14" ry="16" fill="url(#treeHL)" />
            <ellipse cx="-6" cy="-19" rx="14" ry="16" fill="url(#treeSH)" />
            <ellipse cx="-12" cy="-28" rx="6" ry="5" fill="white" opacity="0.30" />
          </g>
        );
      })}

      {/* ════ OCEAN ZONE FISH & DETAILS ════ */}
      {[[2350,2680],[2500,2750],[2700,2700],[2900,2760],[3050,2720]].map(([x, y], i) => (
        <text key={i} x={x} y={y} fontSize="20" opacity="0.6">{['🐟','🐠','🐬','🦈','🦑'][i]}</text>
      ))}

      {/* ════════════════════════════════════════════════════
          RICH CITY DETAILS — fountain, lamps, shops, houses
          ════════════════════════════════════════════════════ */}

      {/* ── DECORATIVE POND (west, off health path) ── */}
      <g transform="translate(960, 440)">
        {[0,40,80,120,160,200,240,280,320].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return <ellipse key={i} cx={88*Math.cos(rad)} cy={54*Math.sin(rad)} rx="9" ry="5.5"
            fill={['#BCAAA4','#D7CCC8','#A1887F','#EFEBE9'][i%4]} />;
        })}
        <ellipse cx="0" cy="0" rx="82" ry="50" fill="#4FC3F7" opacity="0.75" />
        <ellipse cx="0" cy="0" rx="82" ry="50" fill="none" stroke="#29B6F6" strokeWidth="3" opacity="0.9" />
        <ellipse cx="-20" cy="-10" rx="18" ry="10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="25" cy="14" rx="13" ry="7" fill="none" stroke="white" strokeWidth="1.5" opacity="0.35" />
        <ellipse cx="-34" cy="-4" rx="13" ry="9" fill="#2E7D32" opacity="0.85" />
        <circle cx="-34" cy="-4" r="4" fill="#FF80AB" opacity="0.95" />
        <ellipse cx="22" cy="-18" rx="11" ry="8" fill="#388E3C" opacity="0.85" />
        <circle cx="22" cy="-18" r="3.5" fill="#FFCC02" opacity="0.95" />
        <ellipse cx="38" cy="18" rx="12" ry="8" fill="#2E7D32" opacity="0.85" />
        <circle cx="38" cy="18" r="3.5" fill="#FF80AB" opacity="0.95" />
        <line x1="-68" y1="32" x2="-68" y2="-10" stroke="#795548" strokeWidth="2.5" />
        <ellipse cx="-68" cy="-12" rx="4" ry="9" fill="#8D6E63" />
        <line x1="-77" y1="36" x2="-77" y2="-2" stroke="#6D4C41" strokeWidth="2" />
        <ellipse cx="-77" cy="-4" rx="4" ry="8" fill="#795548" />
        <text x="0" y="72" textAnchor="middle" fontSize="11" fontFamily="Nunito" fill="#37474F" fontWeight="bold">🌊 Reflection Pond</text>
      </g>

      {/* ── DECORATIVE POND (east, near hunger path) ── */}
      <g transform="translate(2120, 430)">
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return <ellipse key={i} cx={72*Math.cos(rad)} cy={46*Math.sin(rad)} rx="8" ry="5"
            fill={['#BCAAA4','#D7CCC8','#A1887F'][i%3]} />;
        })}
        <ellipse cx="0" cy="0" rx="65" ry="41" fill="#4FC3F7" opacity="0.70" />
        <ellipse cx="0" cy="0" rx="65" ry="41" fill="none" stroke="#29B6F6" strokeWidth="2.5" opacity="0.9" />
        <ellipse cx="-18" cy="-8" rx="14" ry="8" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
        <ellipse cx="-26" cy="8" rx="11" ry="7" fill="#388E3C" opacity="0.85" />
        <circle cx="-26" cy="8" r="3.5" fill="#F48FB1" opacity="0.95" />
        <ellipse cx="22" cy="-14" rx="10" ry="7" fill="#2E7D32" opacity="0.85" />
        <circle cx="22" cy="-14" r="3" fill="#FFCC02" opacity="0.95" />
        <text x="0" y="62" textAnchor="middle" fontSize="11" fontFamily="Nunito" fill="#37474F" fontWeight="bold">🌸 Blossom Pond</text>
      </g>

      {/* ── PLAZA FOUNTAIN (center of plaza) ── */}
      <g transform="translate(1580, 1055)">
        <ellipse cx="2" cy="6" rx="65" ry="27" fill="rgba(0,0,0,0.2)" />
        {/* Stone outer basin */}
        <ellipse cx="0" cy="0" rx="62" ry="25" fill="#CFD8DC" />
        <ellipse cx="0" cy="0" rx="62" ry="25" fill="url(#treeHL)" opacity="0.4" />
        <ellipse cx="0" cy="0" rx="62" ry="25" fill="none" stroke="#90A4AE" strokeWidth="3.5" />
        {/* Water in basin */}
        <ellipse cx="0" cy="0" rx="54" ry="20" fill="#4FC3F7" opacity="0.65" />
        <ellipse cx="-18" cy="-4" rx="12" ry="6" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="20" cy="6" rx="9" ry="5" fill="none" stroke="white" strokeWidth="1.5" opacity="0.35" />
        {/* Center pedestal */}
        <ellipse cx="0" cy="-1" rx="14" ry="6" fill="#B0BEC5" />
        <rect x="-6" y="-26" width="12" height="27" rx="5" fill="#90A4AE" />
        <rect x="-4" y="-26" width="3" height="27" rx="2" fill="rgba(255,255,255,0.25)" />
        {/* Upper bowl */}
        <ellipse cx="0" cy="-28" rx="18" ry="7" fill="#CFD8DC" />
        <ellipse cx="0" cy="-28" rx="18" ry="7" fill="none" stroke="#90A4AE" strokeWidth="2" />
        {/* Water jets */}
        <path d="M -6 -26 Q -36 -52 -50 -14" fill="none" stroke="#81D4FA" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
        <path d="M 6 -26 Q 36 -52 50 -14" fill="none" stroke="#81D4FA" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
        <path d="M 0 -30 Q -4 -56 0 -48 Q 4 -56 0 -30" fill="#81D4FA" opacity="0.7" />
        {/* Drop sparkles */}
        <circle cx="-50" cy="-14" r="4" fill="#29B6F6" opacity="0.8" />
        <circle cx="50" cy="-14" r="4" fill="#29B6F6" opacity="0.8" />
        <circle cx="0" cy="-54" r="4" fill="#4FC3F7" opacity="0.85" />
        <circle cx="-25" cy="-44" r="2.5" fill="#81D4FA" opacity="0.7" />
        <circle cx="25" cy="-44" r="2.5" fill="#81D4FA" opacity="0.7" />
      </g>

      {/* ── PARK BENCHES around plaza ── */}
      {[
        [1410, 1000], [1750, 1000], [1410, 1130], [1750, 1130],
        [1490, 890], [1670, 890],
      ].map(([bx, by], i) => (
        <g key={i} transform={`translate(${bx},${by})`}>
          <rect x="-18" y="0" width="36" height="4" rx="2" fill="#5D4037" />
          <rect x="-18" y="-10" width="36" height="10" rx="2" fill="#8D6E63" />
          <rect x="-18" y="-10" width="36" height="10" rx="2" fill="url(#treeHL)" opacity="0.3" />
          <rect x="-14" y="4" width="5" height="10" rx="2" fill="#4E342E" />
          <rect x="9" y="4" width="5" height="10" rx="2" fill="#4E342E" />
        </g>
      ))}

      {/* ── PLAZA FLOWER BEDS ── */}
      {[
        [1445, 960], [1715, 960], [1445, 1155], [1715, 1155],
        [1580, 870],
      ].map(([fx, fy], bi) => (
        <g key={bi} transform={`translate(${fx},${fy})`}>
          <ellipse cx="0" cy="0" rx="30" ry="18" fill="#388E3C" opacity="0.6" />
          {[0,36,72,108,144,180,216,252,288,324].map((a,i) => {
            const r = (a * Math.PI) / 180;
            const colors = ['#FF80AB','#FFCC02','#80DEEA','#FFB74D','#CE93D8','#F48FB1','#FF8A65','#80CBC4'];
            return <circle key={i} cx={22*Math.cos(r)} cy={14*Math.sin(r)} r="5"
              fill={colors[i % colors.length]} opacity="0.9" />;
          })}
          <circle cx="0" cy="0" r="5" fill="#FFF9C4" opacity="0.9" />
        </g>
      ))}

      {/* ── CROSSWALK MARKINGS at path intersections ── */}
      {[1548, 1556, 1564, 1572, 1580, 1588, 1596, 1604, 1612].map((x, i) => (
        <rect key={i} x={x} y="1175" width="6" height="18" rx="1" fill="white" opacity="0.55" />
      ))}
      {[1548, 1556, 1564, 1572, 1580, 1588, 1596, 1604, 1612].map((x, i) => (
        <rect key={i} x={x} y="940" width="6" height="18" rx="1" fill="white" opacity="0.45" />
      ))}

      {/* ── STONE BRIDGE UPGRADE ── */}
      <g transform="translate(1550, 1290)">
        {/* Bridge deck */}
        <rect x="0" y="0" width="80" height="52" rx="4" fill="#D7CCC8" />
        {/* Stone texture */}
        {[0,20,40,60].map((ox,i) => <rect key={i} x={ox} y="0" width="18" height="52" rx="2" fill="none" stroke="#A1887F" strokeWidth="1.5" opacity="0.4" />)}
        {/* Railings */}
        <rect x="0" y="0" width="80" height="8" rx="3" fill="#8D6E63" />
        <rect x="0" y="44" width="80" height="8" rx="3" fill="#8D6E63" />
        {/* Railing posts */}
        {[4,18,32,46,60,74].map((x,i) => <rect key={i} x={x} y="0" width="5" height="52" rx="2" fill="#795548" />)}
        {/* Bridge pillars */}
        <rect x="-12" y="0" width="14" height="52" rx="4" fill="#8D6E63" />
        <rect x="78" y="0" width="14" height="52" rx="4" fill="#8D6E63" />
        {/* Lanterns on bridge ends */}
        <rect x="-10" y="-12" width="10" height="12" rx="3" fill="#FFF176" />
        <ellipse cx="-5" cy="-18" rx="10" ry="8" fill="#FFF9C4" opacity="0.3" />
        <rect x="80" y="-12" width="10" height="12" rx="3" fill="#FFF176" />
        <ellipse cx="85" cy="-18" rx="10" ry="8" fill="#FFF9C4" opacity="0.3" />
      </g>

      {/* ── STREET LAMPS — health path (N) ── */}
      {[350, 500, 660, 820].map((y, i) => (
        <g key={`lh${i}`} transform={`translate(${1630+i*4},${y})`}>
          <ellipse cx="0" cy="52" rx="11" ry="5" fill="rgba(0,0,0,0.22)" />
          <rect x="-4" y="0" width="8" height="54" rx="4" fill="#455A64" />
          <rect x="-2" y="0" width="3" height="54" rx="2" fill="rgba(255,255,255,0.2)" />
          <path d="M 0 8 Q 22 8 26 -4" fill="none" stroke="#455A64" strokeWidth="6" strokeLinecap="round" />
          <rect x="18" y="-16" width="20" height="14" rx="5" fill="#FFF176" />
          <ellipse cx="28" cy="-9" rx="20" ry="16" fill="#FFF9C4" opacity="0.28" />
        </g>
      ))}

      {/* ── STREET LAMPS — equality path (NW) ── */}
      {[[870,730],[780,610],[680,490],[570,370]].map(([lx,ly],i) => (
        <g key={`le${i}`} transform={`translate(${lx},${ly})`}>
          <ellipse cx="0" cy="52" rx="11" ry="5" fill="rgba(0,0,0,0.22)" />
          <rect x="-4" y="0" width="8" height="54" rx="4" fill="#455A64" />
          <rect x="-2" y="0" width="3" height="54" rx="2" fill="rgba(255,255,255,0.2)" />
          <path d="M 0 8 Q 22 8 26 -4" fill="none" stroke="#455A64" strokeWidth="6" strokeLinecap="round" />
          <rect x="18" y="-16" width="20" height="14" rx="5" fill="#FFF176" />
          <ellipse cx="28" cy="-9" rx="20" ry="16" fill="#FFF9C4" opacity="0.28" />
        </g>
      ))}

      {/* ── STREET LAMPS — hunger path (NE) ── */}
      {[[2230,730],[2310,610],[2400,490],[2500,370]].map(([lx,ly],i) => (
        <g key={`lhu${i}`} transform={`translate(${lx},${ly})`}>
          <ellipse cx="0" cy="52" rx="11" ry="5" fill="rgba(0,0,0,0.22)" />
          <rect x="-4" y="0" width="8" height="54" rx="4" fill="#455A64" />
          <rect x="-2" y="0" width="3" height="54" rx="2" fill="rgba(255,255,255,0.2)" />
          <path d="M 0 8 Q 22 8 26 -4" fill="none" stroke="#455A64" strokeWidth="6" strokeLinecap="round" />
          <rect x="18" y="-16" width="20" height="14" rx="5" fill="#FFF176" />
          <ellipse cx="28" cy="-9" rx="20" ry="16" fill="#FFF9C4" opacity="0.28" />
        </g>
      ))}

      {/* ── STREET LAMPS — poverty path (SW) ── */}
      {[[870,1200],[780,1370],[680,1540],[560,1700]].map(([lx,ly],i) => (
        <g key={`lp${i}`} transform={`translate(${lx},${ly})`}>
          <ellipse cx="0" cy="52" rx="11" ry="5" fill="rgba(0,0,0,0.22)" />
          <rect x="-4" y="0" width="8" height="54" rx="4" fill="#546E7A" />
          <path d="M 0 8 Q 22 8 26 -4" fill="none" stroke="#546E7A" strokeWidth="6" strokeLinecap="round" />
          <rect x="18" y="-16" width="20" height="14" rx="5" fill="#FFF176" />
          <ellipse cx="28" cy="-9" rx="20" ry="16" fill="#FFF9C4" opacity="0.28" />
        </g>
      ))}

      {/* ── STREET LAMPS — education path (SE) ── */}
      {[[2230,1200],[2310,1370],[2400,1540],[2510,1700]].map(([lx,ly],i) => (
        <g key={`led${i}`} transform={`translate(${lx},${ly})`}>
          <ellipse cx="0" cy="52" rx="11" ry="5" fill="rgba(0,0,0,0.22)" />
          <rect x="-4" y="0" width="8" height="54" rx="4" fill="#546E7A" />
          <path d="M 0 8 Q 22 8 26 -4" fill="none" stroke="#546E7A" strokeWidth="6" strokeLinecap="round" />
          <rect x="18" y="-16" width="20" height="14" rx="5" fill="#FFF176" />
          <ellipse cx="28" cy="-9" rx="20" ry="16" fill="#FFF9C4" opacity="0.28" />
        </g>
      ))}

      {/* ── STREET LAMPS — around plaza (6 evenly spaced) ── */}
      {[0,60,120,180,240,300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const lx = 1580 + 210 * Math.cos(rad);
        const ly = 1060 + 210 * Math.sin(rad);
        return (
          <g key={`plz${i}`} transform={`translate(${lx},${ly})`}>
            <ellipse cx="0" cy="50" rx="9" ry="4" fill="rgba(0,0,0,0.2)" />
            <rect x="-3.5" y="0" width="7" height="52" rx="3.5" fill="#37474F" />
            <circle cx="0" cy="-2" r="10" fill="#FFF176" />
            <circle cx="0" cy="-2" r="10" fill="#FFD54F" opacity="0.5" />
            <ellipse cx="0" cy="-2" rx="24" ry="20" fill="#FFF9C4" opacity="0.22" />
          </g>
        );
      })}

      {/* ── COFFEE SHOP (on health path east side) ── */}
      <g transform="translate(1830, 570)">
        {/* Building shadow */}
        <rect x="4" y="6" width="120" height="90" rx="8" fill="rgba(0,0,0,0.25)" />
        {/* Building body */}
        <rect x="0" y="0" width="120" height="90" rx="8" fill="#FFF8E1" />
        <rect x="0" y="0" width="120" height="90" rx="8" fill="url(#treeHL)" opacity="0.3" />
        {/* Side panel */}
        <rect x="0" y="0" width="10" height="90" rx="4" fill="#FFECB3" />
        {/* Awning */}
        <path d="M -10 32 Q 60 22 130 32 L 130 48 Q 60 38 -10 48 Z" fill="#E53935" />
        <path d="M -10 32 Q 60 22 130 32 L 130 48 Q 60 38 -10 48 Z" fill="url(#treeHL)" opacity="0.25" />
        {[0,15,30,45,60,75,90,105,120].map((x,i) => (
          <line key={i} x1={x-10} y1="32" x2={x-10} y2="48" stroke="white" strokeWidth="2" opacity="0.4" />
        ))}
        {/* Sign */}
        <rect x="15" y="10" width="90" height="18" rx="6" fill="#4E342E" />
        <text x="60" y="22.5" textAnchor="middle" fontSize="10" fill="#FFF9C4" fontFamily="Nunito" fontWeight="bold">☕ CAFÉ VERDE</text>
        {/* Windows */}
        <rect x="12" y="52" width="30" height="24" rx="4" fill="#BBDEFB" opacity="0.8" />
        <rect x="16" y="52" width="5" height="24" fill="white" opacity="0.3" />
        <rect x="78" y="52" width="30" height="24" rx="4" fill="#BBDEFB" opacity="0.8" />
        <rect x="82" y="52" width="5" height="24" fill="white" opacity="0.3" />
        {/* Door */}
        <rect x="48" y="60" width="24" height="30" rx="5" fill="#8D6E63" />
        <circle cx="68" cy="76" r="2.5" fill="#FFD54F" />
        {/* Outdoor tables */}
        {[-50, -80].map((ox,i) => (
          <g key={i} transform={`translate(${ox}, 72)`}>
            <circle cx="0" cy="0" r="14" fill="#FFECB3" stroke="#8D6E63" strokeWidth="2" />
            <circle cx="0" cy="0" r="5" fill="#BCAAA4" />
            <ellipse cx="0" cy="-18" rx="18" ry="12" fill="#E53935" opacity="0.8" />
            <path d="M 0 -6 L 0 -18" stroke="#8D6E63" strokeWidth="2" />
          </g>
        ))}
        {/* Potted plants outside */}
        <g transform="translate(-10, 55)">
          <rect x="-5" y="10" width="10" height="8" rx="2" fill="#8D6E63" />
          <ellipse cx="0" cy="8" rx="9" ry="12" fill="#388E3C" />
          <ellipse cx="-2" cy="2" rx="5" ry="7" fill="#43A047" />
        </g>
        <g transform="translate(130, 55)">
          <rect x="-5" y="10" width="10" height="8" rx="2" fill="#8D6E63" />
          <ellipse cx="0" cy="8" rx="9" ry="12" fill="#388E3C" />
          <ellipse cx="-2" cy="2" rx="5" ry="7" fill="#43A047" />
        </g>
      </g>

      {/* ── COFFEE SHOP (on equality/poverty west side) ── */}
      <g transform="translate(580, 800)">
        <rect x="4" y="5" width="100" height="80" rx="7" fill="rgba(0,0,0,0.22)" />
        <rect x="0" y="0" width="100" height="80" rx="7" fill="#FFF3E0" />
        <rect x="0" y="0" width="100" height="80" rx="7" fill="url(#treeHL)" opacity="0.25" />
        <path d="M -8 28 Q 50 20 108 28 L 108 42 Q 50 34 -8 42 Z" fill="#0288D1" />
        {[0,14,28,42,56,70,84].map((x,i) => (
          <line key={i} x1={x-8} y1="28" x2={x-8} y2="42" stroke="white" strokeWidth="1.5" opacity="0.4" />
        ))}
        <rect x="10" y="8" width="80" height="16" rx="5" fill="#01579B" />
        <text x="50" y="19.5" textAnchor="middle" fontSize="9" fill="#E1F5FE" fontFamily="Nunito" fontWeight="bold">☕ BEAN & BREW</text>
        <rect x="10" y="46" width="28" height="22" rx="4" fill="#B3E5FC" opacity="0.8" />
        <rect x="62" y="46" width="28" height="22" rx="4" fill="#B3E5FC" opacity="0.8" />
        <rect x="38" y="54" width="24" height="26" rx="4" fill="#6D4C41" />
        <circle cx="58" cy="68" r="2" fill="#FFD54F" />
      </g>

      {/* ── TOWN HOUSES with balconies — west side ── */}
      {[[500, 230],[640, 300],[480, 500],[600, 420]].map(([hx,hy],i) => {
        const colors = ['#FFF8E1','#E8F5E9','#F3E5F5','#E3F2FD'];
        const roofColors = ['#EF9A9A','#A5D6A7','#CE93D8','#90CAF9'];
        const awningColors = ['#E53935','#2E7D32','#7B1FA2','#1565C0'];
        return (
          <g key={i} transform={`translate(${hx},${hy})`}>
            {/* Shadow */}
            <rect x="5" y="6" width="90" height="110" rx="6" fill="rgba(0,0,0,0.22)" />
            {/* Main walls */}
            <rect x="0" y="0" width="90" height="110" rx="6" fill={colors[i % 4]} />
            <rect x="0" y="0" width="90" height="110" rx="6" fill="url(#treeHL)" opacity="0.25" />
            {/* Side depth */}
            <rect x="0" y="0" width="8" height="110" rx="3" fill="rgba(0,0,0,0.1)" />
            {/* Roof */}
            <path d="M -8 0 L 45 -32 L 98 0 Z" fill={roofColors[i % 4]} />
            <path d="M -8 0 L 45 -32 L 98 0 Z" fill="url(#treeHL)" opacity="0.3" />
            {/* Balcony floor */}
            <rect x="15" y="35" width="60" height="7" rx="3" fill="#D7CCC8" />
            <rect x="15" y="35" width="60" height="7" rx="3" fill="url(#treeHL)" opacity="0.3" />
            {/* Balcony railings */}
            {[18,28,38,48,58,68].map((rx2,ri) => (
              <rect key={ri} x={rx2} y="20" width="4" height="22" rx="2" fill="#BCAAA4" />
            ))}
            <rect x="15" y="20" width="60" height="5" rx="2.5" fill="#BCAAA4" />
            {/* Balcony window */}
            <rect x="30" y="22" width="30" height="18" rx="4" fill="#B3E5FC" opacity="0.8" />
            <rect x="34" y="22" width="5" height="18" fill="white" opacity="0.3" />
            {/* Awning over balcony */}
            <path d={`M 10 42 Q 45 36 80 42 L 80 50 Q 45 44 10 50 Z`} fill={awningColors[i % 4]} />
            {/* Main windows */}
            <rect x="10" y="62" width="28" height="22" rx="4" fill="#B3E5FC" opacity="0.8" />
            <rect x="52" y="62" width="28" height="22" rx="4" fill="#B3E5FC" opacity="0.8" />
            {/* Door */}
            <rect x="30" y="80" width="30" height="30" rx="5" fill="#8D6E63" />
            <rect x="32" y="82" width="12" height="14" rx="2" fill="#B3E5FC" opacity="0.5" />
            <rect x="46" y="82" width="12" height="14" rx="2" fill="#B3E5FC" opacity="0.5" />
            <circle cx="57" cy="97" r="2.5" fill="#FFD54F" />
            {/* Flower box on balcony */}
            <rect x="20" y="40" width="50" height="8" rx="3" fill="#6D4C41" />
            {[28,38,48,58].map((fx,fi) => (
              <circle key={fi} cx={fx} cy="38" r="5" fill={['#FF80AB','#FFCC02','#FF8A65','#CE93D8'][fi]} />
            ))}
          </g>
        );
      })}

      {/* ── TOWN HOUSES with balconies — east side ── */}
      {[[2550, 230],[2680, 300],[2560, 500],[2700, 420]].map(([hx,hy],i) => {
        const colors = ['#FFF3E0','#E8EAF6','#FCE4EC','#E0F7FA'];
        const roofColors = ['#FF8A65','#7986CB','#F48FB1','#4DD0E1'];
        const awningColors = ['#0288D1','#7B1FA2','#E53935','#00838F'];
        return (
          <g key={i} transform={`translate(${hx},${hy})`}>
            <rect x="5" y="6" width="90" height="110" rx="6" fill="rgba(0,0,0,0.22)" />
            <rect x="0" y="0" width="90" height="110" rx="6" fill={colors[i % 4]} />
            <rect x="0" y="0" width="90" height="110" rx="6" fill="url(#treeHL)" opacity="0.25" />
            <rect x="0" y="0" width="8" height="110" rx="3" fill="rgba(0,0,0,0.1)" />
            <path d="M -8 0 L 45 -32 L 98 0 Z" fill={roofColors[i % 4]} />
            <path d="M -8 0 L 45 -32 L 98 0 Z" fill="url(#treeHL)" opacity="0.3" />
            <rect x="15" y="35" width="60" height="7" rx="3" fill="#D7CCC8" />
            {[18,28,38,48,58,68].map((rx2,ri) => (
              <rect key={ri} x={rx2} y="20" width="4" height="22" rx="2" fill="#BCAAA4" />
            ))}
            <rect x="15" y="20" width="60" height="5" rx="2.5" fill="#BCAAA4" />
            <rect x="30" y="22" width="30" height="18" rx="4" fill="#BBDEFB" opacity="0.8" />
            <rect x="34" y="22" width="5" height="18" fill="white" opacity="0.3" />
            <path d="M 10 42 Q 45 36 80 42 L 80 50 Q 45 44 10 50 Z" fill={awningColors[i % 4]} />
            <rect x="10" y="62" width="28" height="22" rx="4" fill="#BBDEFB" opacity="0.8" />
            <rect x="52" y="62" width="28" height="22" rx="4" fill="#BBDEFB" opacity="0.8" />
            <rect x="30" y="80" width="30" height="30" rx="5" fill="#6D4C41" />
            <rect x="32" y="82" width="12" height="14" rx="2" fill="#BBDEFB" opacity="0.5" />
            <rect x="46" y="82" width="12" height="14" rx="2" fill="#BBDEFB" opacity="0.5" />
            <circle cx="57" cy="97" r="2.5" fill="#FFD54F" />
            <rect x="20" y="40" width="50" height="8" rx="3" fill="#5D4037" />
            {[28,38,48,58].map((fx,fi) => (
              <circle key={fi} cx={fx} cy="38" r="5" fill={['#FFB74D','#CE93D8','#80DEEA','#F48FB1'][fi]} />
            ))}
          </g>
        );
      })}

      {/* ── VINES on some buildings ── */}
      <g opacity="0.75">
        <path d="M 500 320 Q 510 340 505 360 Q 515 380 508 400" fill="none" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" />
        <circle cx="510" cy="340" r="5" fill="#43A047" />
        <circle cx="505" cy="360" r="6" fill="#2E7D32" />
        <circle cx="508" cy="380" r="5" fill="#43A047" />
        <path d="M 2680 320 Q 2690 345 2685 365 Q 2695 385 2688 405" fill="none" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" />
        <circle cx="2690" cy="345" r="5" fill="#43A047" />
        <circle cx="2685" cy="365" r="6" fill="#2E7D32" />
      </g>

      {/* ── EXTRA FLOWER PATCHES along paths ── */}
      {[
        [700,680],[720,720],[750,760],
        [1100,400],[1120,440],[1080,460],
        [2300,680],[2320,720],[2280,760],
        [750,1460],[720,1490],[700,1520],
        [2300,1440],[2320,1470],[2360,1500],
      ].map(([fx, fy], i) => (
        <g key={i} transform={`translate(${fx},${fy})`}>
          {[0,72,144,216,288].map((a,j) => {
            const r2 = (a * Math.PI) / 180;
            return <circle key={j} cx={10*Math.cos(r2)} cy={8*Math.sin(r2)} r="5"
              fill={['#FF80AB','#FFCC02','#80DEEA','#FFB74D','#CE93D8'][(i+j) % 5]} opacity="0.88" />;
          })}
          <circle cx="0" cy="0" r="4" fill="#FFF9C4" />
          <line x1="0" y1="5" x2="0" y2="15" stroke="#4CAF50" strokeWidth="2" />
        </g>
      ))}

      {/* ── DECORATIVE SLABS / PAVEMENT on paths ── */}
      {[200,400,600,800].map((offset, i) => (
        <g key={i} opacity="0.25">
          <rect x={1562} y={1060 - offset} width="36" height="20" rx="3" fill="none" stroke="#90A4AE" strokeWidth="1.5" />
          <rect x={1562} y={1060 - offset - 22} width="36" height="20" rx="3" fill="none" stroke="#90A4AE" strokeWidth="1.5" />
        </g>
      ))}

      {/* ── PLANET SECTION: STREET LAMPS ── */}
      {[[900,2750],[1100,2850],[1300,2980],[900,3300],[1100,3400],[1300,3550]].map(([lx,ly],i) => (
        <g key={`pl${i}`} transform={`translate(${lx},${ly})`}>
          <ellipse cx="0" cy="50" rx="10" ry="4" fill="rgba(0,0,0,0.22)" />
          <rect x="-3.5" y="0" width="7" height="52" rx="3.5" fill="#006064" />
          <path d="M 0 8 Q 20 8 24 -3" fill="none" stroke="#006064" strokeWidth="5" strokeLinecap="round" />
          <rect x="16" y="-14" width="18" height="12" rx="4" fill="#80DEEA" opacity="0.9" />
          <ellipse cx="25" cy="-8" rx="18" ry="14" fill="#E0F7FA" opacity="0.2" />
        </g>
      ))}

      {/* ── PLANET PLAZA FOUNTAIN ── */}
      <g transform={`translate(${PLANET_CENTER_X - 100}, ${PLANET_CENTER_Y + 30})`}>
        <ellipse cx="0" cy="4" rx="40" ry="18" fill="rgba(0,0,0,0.3)" />
        <ellipse cx="0" cy="0" rx="38" ry="16" fill="#006064" />
        <ellipse cx="0" cy="0" rx="33" ry="13" fill="#00BCD4" opacity="0.6" />
        <ellipse cx="-10" cy="-3" rx="8" ry="5" fill="none" stroke="#80DEEA" strokeWidth="1.5" opacity="0.6" />
        <rect x="-3" y="-18" width="6" height="20" rx="3" fill="#00838F" />
        <ellipse cx="0" cy="-20" rx="10" ry="4" fill="#006064" />
        <path d="M -3 -18 Q -16 -32 -26 -10" fill="none" stroke="#4DD0E1" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
        <path d="M 3 -18 Q 16 -32 26 -10" fill="none" stroke="#4DD0E1" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
      </g>

      {/* ── PLANET SECTION BENCHES ── */}
      {[[PLANET_CENTER_X-200, PLANET_CENTER_Y+100],[PLANET_CENTER_X+150, PLANET_CENTER_Y+80]].map(([bx,by],i) => (
        <g key={i} transform={`translate(${bx},${by})`}>
          <rect x="-18" y="-10" width="36" height="10" rx="2" fill="#004D40" />
          <rect x="-18" y="-10" width="36" height="10" rx="2" fill="url(#treeHL)" opacity="0.3" />
          <rect x="-18" y="0" width="36" height="4" rx="2" fill="#00695C" />
          <rect x="-14" y="4" width="5" height="10" rx="2" fill="#004D40" />
          <rect x="9" y="4" width="5" height="10" rx="2" fill="#004D40" />
        </g>
      ))}

      {/* Poverty zone rubble (if not healed) */}
      {!completedZones.includes('poverty') && (
        [260, 410, 560, 680].map((x, i) => (
          <g key={i} transform={`translate(${x},${1960 + (i%2)*30})`}>
            <ellipse cx="0" cy="0" rx="18" ry="8" fill="#9E9E9E" opacity="0.5" />
            <ellipse cx="10" cy="-4" rx="10" ry="6" fill="#BDBDBD" opacity="0.5" />
          </g>
        ))
      )}

      {/* Education scattered books (if not healed) */}
      {!completedZones.includes('education') && (
        [2380, 2530, 2680, 2830].map((x, i) => (
          <rect key={i} x={x} y={1950 + (i%2)*20} width="20" height="14" rx="2"
            fill={['#7986CB','#BA68C8','#FF8A65','#4DB6AC'][i]} opacity="0.7"
            transform={`rotate(${(i-1)*15} ${x+10} ${1960+(i%2)*20})`} />
        ))
      )}

      {/* ════════════════════════════════════════════════
          PROSPERITY LEVEL — SDG 7-11 — y=4700 to 7200
          ════════════════════════════════════════════════ */}

      {/* Prosperity Gate (transition from Planet at y=4600) */}
      {(() => {
        const PG_Y = 4640;
        const PG_X = 1600;
        return (
          <g>
            <rect x="0" y={PG_Y} width={WORLD_W} height="280" fill="#2A2060" />
            {[0,1,2,3,4,5,6,7].map(i => (
              <rect key={i} x={i * WORLD_W / 8} y={PG_Y} width={WORLD_W / 8} height="280"
                fill={i % 2 === 0 ? '#231A50' : '#2A2060'} opacity="0.85" />
            ))}
            {/* Stars/city-lights in the gate zone */}
            {[[200,4660],[450,4680],[750,4655],[1100,4670],[1450,4660],[1900,4680],[2200,4660],[2650,4675],[2950,4660]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="2.5" fill="#FFD700" opacity="0.7" />
            ))}
            {/* Gate arch */}
            <ellipse cx={PG_X} cy={PG_Y + 50} rx="230" ry="120"
              fill="none" stroke="#FFD700" strokeWidth="12" opacity="0.9" filter="url(#glow)" />
            <ellipse cx={PG_X} cy={PG_Y + 50} rx="210" ry="105"
              fill="none" stroke="#FFF176" strokeWidth="5" opacity="0.6" />
            {/* Pillars */}
            <rect x={PG_X - 240} y={PG_Y - 30} width="28" height="180" rx="12" fill="#F9A825" opacity="0.9" />
            <rect x={PG_X + 212} y={PG_Y - 30} width="28" height="180" rx="12" fill="#F9A825" opacity="0.9" />
            <circle cx={PG_X - 226} cy={PG_Y - 42} r="20" fill="#FFD700" stroke="white" strokeWidth="3" />
            <circle cx={PG_X + 226} cy={PG_Y - 42} r="20" fill="#FFD700" stroke="white" strokeWidth="3" />
            <text x={PG_X - 226} y={PG_Y - 36} textAnchor="middle" fontSize="14">⚡</text>
            <text x={PG_X + 226} y={PG_Y - 36} textAnchor="middle" fontSize="14">🏙️</text>
            <rect x={PG_X - 190} y={PG_Y + 70} width="380" height="40" rx="20" fill="#F9A825" />
            <text x={PG_X} y={PG_Y + 96} textAnchor="middle" fontSize="16" fontWeight="bold"
              fontFamily="Nunito" fill="#1A1040">🌟 Prosperity Level Gateway 🌟</text>
            <rect x={PG_X - 60} y={PG_Y + 110} width="120" height="210" rx="8" fill="#F57F17" opacity="0.4" />
          </g>
        );
      })()}

      {/* Prosperity base background — bright futuristic cityscape */}
      <rect x="0" y="4920" width={WORLD_W} height={WORLD_H - 4920} fill="#1A3D5C" />
      {/* City skyline silhouette far back */}
      {[[100,4980,60,160],[220,5010,40,130],[310,4970,80,170],[430,5000,50,150],[560,4975,70,165],
        [700,5005,45,135],[810,4980,65,155],[920,5010,35,125],[1050,4975,80,170],[1150,5000,50,145],
        [1650,4975,80,170],[1750,5005,50,140],[1850,4980,60,160],[1950,5010,40,125],[2050,4975,75,165],
        [2200,5000,55,150],[2320,4980,65,160],[2440,5005,45,135],[2560,4975,80,170],[2700,5010,40,125],
        [2810,4980,70,165],[2950,5000,55,145],[3050,4975,60,160]].map(([x,y,w,h],i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill={i%3===0?'#1E4D7B':i%3===1?'#163D63':'#1A4A74'} opacity="0.9" />
      ))}
      {/* City windows glowing */}
      {[[120,5000],[135,5030],[155,5000],[230,5020],[320,4990],[340,5020],[350,4990],
        [450,5010],[570,4990],[590,5020],[720,5010],[830,4995],[1070,4990],[1090,5015],
        [1660,4990],[1680,5020],[1770,5010],[1870,4995],[1970,5020],[2060,4990],[2085,5015],
        [2210,5005],[2230,5030],[2330,4995],[2450,5010],[2580,4990],[2720,5015],[2830,4995],[2960,5005]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="8" height="5" rx="1"
          fill={['#FFD700','#00E5FF','#76FF03','#FF6D00','#E040FB'][i%5]} opacity="0.65" />
      ))}
      {/* Ground level: smart city road grid */}
      <rect x="0" y="5440" width={WORLD_W} height="80" fill="#263238" opacity="0.7" />
      <rect x="0" y="6600" width={WORLD_W} height="80" fill="#263238" opacity="0.7" />

      {/* ════ PROSPERITY ZONE GROUND AREAS ════ */}
      {ZONE_REGIONS.filter(z => z.level === 'prosperity').map(z => {
        const done = completedZones.includes(z.id);
        return (
          <g key={z.id}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="24" ry="24"
              fill={done ? z.color : 'rgba(255,255,255,0.14)'}
              stroke={done ? z.borderColor : '#F9A825'}
              strokeWidth="5" strokeDasharray={done ? 'none' : '14 7'}
              filter="url(#shadow)" />
            {/* Big floating banner */}
            <rect x={z.x + z.w / 2 - 160} y={z.y - 70} width="320" height="54" rx="27"
              fill={done ? z.borderColor : '#E65100'} filter="url(#shadow)" />
            <rect x={z.x + z.w / 2 - 160} y={z.y - 70} width="320" height="54" rx="27"
              fill="white" opacity="0.12" />
            <text x={z.x + z.w / 2} y={z.y - 52} textAnchor="middle" fill="white"
              fontSize="11" fontFamily="Nunito" opacity="0.88">
              {done ? '✅ Zone Healed!' : '🔒 Undiscovered'}
            </text>
            <text x={z.x + z.w / 2} y={z.y - 30} textAnchor="middle" fill="white"
              fontSize="20" fontWeight="bold" fontFamily="Patrick Hand, cursive">
              {z.emoji} SDG {z.sdg} · {z.name}
            </text>
          </g>
        );
      })}

      {/* ════ PROSPERITY PATHS ════ */}
      {/* Prosperity hub center */}
      {(() => {
        const PC_X = 1580;
        const PC_Y = 5700;
        return (
          <g>
            <circle cx={PC_X} cy={PC_Y} r="185" fill="#1E3C6E" stroke="#F9A825" strokeWidth="7" filter="url(#shadow)" />
            <circle cx={PC_X} cy={PC_Y} r="185" fill="none" stroke="#FFD700" strokeWidth="5" opacity="0.7" />
            <text x={PC_X} y={PC_Y - 45} textAnchor="middle" fontSize="22" fontWeight="bold" fontFamily="Patrick Hand, cursive" fill="#FFD700">🌟 Prosperity World</text>
            <text x={PC_X} y={PC_Y - 18} textAnchor="middle" fontSize="13" fontFamily="Nunito" fill="#FFF176">SDGs 7–11: Build a better future!</text>
            {/* Paths to zones */}
            <path d={`M ${PC_X} ${PC_Y} Q 900 5300 540 5160`} stroke="#F9A825" strokeWidth="48" fill="none" strokeLinecap="round" opacity="0.45" />
            <path d={`M ${PC_X} ${PC_Y} Q 900 5300 540 5160`} stroke="#FFD700" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.35" />
            <path d={`M ${PC_X} ${PC_Y} Q ${PC_X} 5300 ${PC_X} 5160`} stroke="#1565C0" strokeWidth="48" fill="none" strokeLinecap="round" opacity="0.45" />
            <path d={`M ${PC_X} ${PC_Y} Q ${PC_X} 5300 ${PC_X} 5160`} stroke="#64B5F6" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.35" />
            <path d={`M ${PC_X} ${PC_Y} Q 2200 5300 2660 5160`} stroke="#E65100" strokeWidth="48" fill="none" strokeLinecap="round" opacity="0.45" />
            <path d={`M ${PC_X} ${PC_Y} Q 2200 5300 2660 5160`} stroke="#FF8A65" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.35" />
            <path d={`M ${PC_X} ${PC_Y} Q 900 6200 540 6320`} stroke="#6A1B9A" strokeWidth="48" fill="none" strokeLinecap="round" opacity="0.45" />
            <path d={`M ${PC_X} ${PC_Y} Q 900 6200 540 6320`} stroke="#CE93D8" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.35" />
            <path d={`M ${PC_X} ${PC_Y} Q 2200 6200 2660 6320`} stroke="#00695C" strokeWidth="48" fill="none" strokeLinecap="round" opacity="0.45" />
            <path d={`M ${PC_X} ${PC_Y} Q 2200 6200 2660 6320`} stroke="#80CBC4" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.35" />
            {/* Prosperity signpost */}
            <g transform={`translate(${PC_X + 210}, ${PC_Y - 90})`}>
              <rect x="-4" y="-10" width="8" height="200" rx="4" fill="#F9A825" />
              {(() => { const done = completedZones.includes('energy'); return (
                <g>
                  <rect x="-170" y="0" width="155" height="32" rx="10" fill={done ? '#F9A825' : '#37474F'} filter="url(#shadow)" />
                  <polygon points="-170,0 -170,32 -192,16" fill={done ? '#F9A825' : '#37474F'} />
                  <text x="-93" y="21" textAnchor="middle" fontSize="12" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">⚡ SDG 7 · Energy</text>
                </g>
              ); })()}
              {(() => { const done = completedZones.includes('innovation'); return (
                <g>
                  <rect x="-85" y="40" width="170" height="32" rx="10" fill={done ? '#1565C0' : '#37474F'} filter="url(#shadow)" />
                  <text x="0" y="61" textAnchor="middle" fontSize="12" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">🔬 SDG 9 · Innovation</text>
                </g>
              ); })()}
              {(() => { const done = completedZones.includes('industry'); return (
                <g>
                  <rect x="15" y="0" width="155" height="32" rx="10" fill={done ? '#E65100' : '#37474F'} filter="url(#shadow)" />
                  <polygon points="170,0 170,32 192,16" fill={done ? '#E65100' : '#37474F'} />
                  <text x="93" y="21" textAnchor="middle" fontSize="12" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">SDG 8 · Industry 🏭</text>
                </g>
              ); })()}
              {(() => { const done = completedZones.includes('communities'); return (
                <g>
                  <rect x="-170" y="80" width="155" height="32" rx="10" fill={done ? '#6A1B9A' : '#37474F'} filter="url(#shadow)" />
                  <polygon points="-170,80 -170,112 -192,96" fill={done ? '#6A1B9A' : '#37474F'} />
                  <text x="-93" y="101" textAnchor="middle" fontSize="12" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">SDG 10 · Communities</text>
                </g>
              ); })()}
              {(() => { const done = completedZones.includes('cities'); return (
                <g>
                  <rect x="15" y="80" width="155" height="32" rx="10" fill={done ? '#00695C' : '#37474F'} filter="url(#shadow)" />
                  <polygon points="170,80 170,112 192,96" fill={done ? '#00695C' : '#37474F'} />
                  <text x="93" y="101" textAnchor="middle" fontSize="12" fill="white" fontFamily="Patrick Hand, cursive" fontWeight="bold">SDG 11 · Cities 🏙️</text>
                </g>
              ); })()}
            </g>
          </g>
        );
      })()}

      {/* ════ PROSPERITY DECORATIONS ════ */}
      {/* Solar panel arrays in energy zone */}
      {[240,300,360,420,480,540,600,660,720,780].map((x,i) => (
        <g key={i} transform={`translate(${x},${5240 + (i%2)*35})`}>
          <rect x="-22" y="-4" width="44" height="28" rx="3" fill="#1565C0" opacity="0.8" />
          <rect x="-22" y="-4" width="44" height="28" rx="3" fill="#1976D2" opacity="0.4" />
          <line x1="-22" y1="10" x2="22" y2="10" stroke="#90CAF9" strokeWidth="1.5" opacity="0.7" />
          <line x1="0" y1="-4" x2="0" y2="24" stroke="#90CAF9" strokeWidth="1.5" opacity="0.7" />
          <rect x="-3" y="24" width="6" height="12" rx="2" fill="#37474F" />
        </g>
      ))}
      {/* Wind turbines in energy zone */}
      {[[180,5095],[340,5070],[520,5090]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="-4" y="0" width="8" height="120" rx="3" fill="#90A4AE" opacity="0.8" />
          <g transform="rotate(30)">
            <ellipse cx="0" cy="-50" rx="4" ry="45" fill="#B0BEC5" opacity="0.85" />
          </g>
          <g transform="rotate(150)">
            <ellipse cx="0" cy="-50" rx="4" ry="45" fill="#B0BEC5" opacity="0.85" />
          </g>
          <g transform="rotate(270)">
            <ellipse cx="0" cy="-50" rx="4" ry="45" fill="#B0BEC5" opacity="0.85" />
          </g>
          <circle cx="0" cy="0" r="6" fill="#78909C" />
        </g>
      ))}
      {/* Factory smokestacks (industry zone) */}
      {[2360,2450,2540,2640,2740,2840,2940].map((x,i) => (
        <g key={i}>
          <rect x={x - 10} y={5040} width="20" height="100" fill="#37474F" opacity="0.85" />
          <ellipse cx={x} cy={5035} rx="15" ry="24" fill={i%2===0?'#B0BEC5':'#CFD8DC'} opacity="0.5" />
          <ellipse cx={x+5} cy={5010} rx="10" ry="16" fill={i%2===0?'#CFD8DC':'#ECEFF1'} opacity="0.4" />
        </g>
      ))}
      {/* Research lab equipment (innovation zone) */}
      {[[1280,5150],[1360,5120],[1480,5140],[1600,5115],[1720,5140],[1840,5120]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="-8" y="-20" width="16" height="35" rx="6" fill={['#1565C0','#0D47A1','#1976D2'][i%3]} opacity="0.75" />
          <circle cx="0" cy="-24" r="8" fill="#64B5F6" opacity="0.6" />
          <text x="0" y="-22" textAnchor="middle" fontSize="8" opacity="0.9">{['🔬','💡','🧪','🔭','📡','⚗️'][i]}</text>
        </g>
      ))}
      {/* Community gardens (communities zone) */}
      {[[240,6230],[300,6250],[360,6225],[420,6245],[480,6228],[540,6248],[600,6230],[660,6248],[720,6225]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="-14" y="-6" width="28" height="14" rx="4" fill="#795548" opacity="0.6" />
          <ellipse cx="0" cy="-10" rx="12" ry="8" fill={i%3===0?'#66BB6A':i%3===1?'#EF5350':'#FDD835'} opacity="0.75" />
        </g>
      ))}
      {/* Smart city green rooftops (cities zone) */}
      {[[2330,6130],[2380,6115],[2460,6120],[2510,6130],[2610,6115],[2680,6120],[2780,6130],[2850,6140],[2960,6120]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="-20" y="-8" width="40" height="14" rx="3" fill="#2E7D32" opacity="0.6" />
          <ellipse cx="-8" cy="-10" rx="5" ry="4" fill="#4CAF50" opacity="0.7" />
          <ellipse cx="6" cy="-12" rx="6" ry="5" fill="#66BB6A" opacity="0.7" />
        </g>
      ))}

      {/* ════ CHERRY BLOSSOM TREES — Smart City zone ════ */}
      {[[2210,6090],[2960,6100],[2380,6440],[2840,6420],[2120,6380],[3000,6380]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <ellipse cx="0" cy="38" rx="16" ry="5" fill="rgba(0,0,0,0.18)" />
          <rect x="-5" y="8" width="10" height="34" rx="4" fill="#6D4C41" />
          <rect x="-5" y="8" width="10" height="34" rx="4" fill="rgba(255,255,255,0.18)" />
          {/* Trunk fork */}
          <rect x="-2" y="4" width="5" height="16" rx="3" fill="#6D4C41" transform="rotate(-18)" />
          <rect x="0" y="4" width="5" height="14" rx="3" fill="#6D4C41" transform="rotate(16)" />
          {/* Back canopy */}
          <ellipse cx="0" cy="-8" rx="34" ry="28" fill="#F48FB1" />
          <ellipse cx="0" cy="-8" rx="34" ry="28" fill="rgba(255,255,255,0.22)" />
          <ellipse cx="0" cy="-8" rx="34" ry="28" fill="rgba(0,0,0,0.08)" />
          {/* Mid canopy cluster */}
          <ellipse cx="-14" cy="-18" rx="22" ry="18" fill="#F06292" />
          <ellipse cx="-14" cy="-18" rx="22" ry="18" fill="rgba(255,255,255,0.20)" />
          <ellipse cx="12" cy="-20" rx="20" ry="16" fill="#E91E63" />
          <ellipse cx="12" cy="-20" rx="20" ry="16" fill="rgba(255,255,255,0.18)" />
          {/* Highlight */}
          <ellipse cx="-8" cy="-26" rx="8" ry="5" fill="white" opacity="0.32" />
          {/* Blossoms */}
          {[[-16,-6],[6,-14],[20,-2],[-8,-22],[2,0]].map(([bx,by],bi) => (
            <circle key={bi} cx={bx} cy={by} r="3" fill="#FCE4EC" opacity="0.85" />
          ))}
        </g>
      ))}

      {/* ════ NEON SIGNS on Prosperity city skyline ════ */}
      {[[150,4995,'⚡'],[400,5005,'💡'],[820,5000,'🔬'],[1700,4995,'🌟'],[2100,5010,'🏭'],[2700,5000,'🌿'],[2960,4995,'⚡']].map(([x,y,emo],i) => (
        <g key={i}>
          <rect x={+x - 14} y={+y - 12} width="28" height="18" rx="5"
            fill={['#E65100','#1565C0','#6A1B9A','#F9A825','#37474F','#2E7D32','#B71C1C'][i % 7]} opacity="0.85" />
          <text x={x} y={+y + 2} textAnchor="middle" fontSize="11">{emo}</text>
        </g>
      ))}

      {/* ════ PLANET: extra ocean corals + seaweed ════ */}
      {[[2280,2900],[2400,2960],[2560,2910],[2720,2970],[2900,2930],[3060,2960]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          {/* Seaweed strands */}
          <path d={`M 0 20 Q -6 10 0 0 Q 6 -10 0 -20 Q -6 -30 0 -40`}
            stroke={['#00E676','#69F0AE','#00BCD4','#00ACC1'][i%4]} strokeWidth="3" fill="none" opacity="0.6" />
          <path d={`M 8 20 Q 14 10 8 0 Q 2 -8 8 -18`}
            stroke={['#00BCD4','#00E676','#69F0AE'][i%3]} strokeWidth="2" fill="none" opacity="0.5" />
          {/* Coral blob */}
          <circle cx="-6" cy="-42" r="5" fill={['#FF7043','#EC407A','#AB47BC','#FF8F00','#E91E63','#7B1FA2'][i]} opacity="0.7" />
          <circle cx="2" cy="-46" r="4" fill={['#FF5722','#E91E63','#9C27B0','#F57C00','#AD1457','#512DA8'][i]} opacity="0.7" />
          <circle cx="-2" cy="-50" r="3" fill="white" opacity="0.4" />
        </g>
      ))}

      {/* ════ PLANET: climate zone lava cracks ════ */}
      {[[2360,3600],[2480,3680],[2620,3620],[2780,3660],[2900,3600]].map(([x,y],i) => (
        <path key={i}
          d={`M ${x} ${y} Q ${x+30} ${y-14} ${x+60} ${y+10} Q ${x+90} ${y+28} ${x+120} ${y+8}`}
          stroke={i%2===0?'#FF3D00':'#FF6D00'} strokeWidth="4" fill="none" opacity="0.5" strokeLinecap="round" />
      ))}

      {/* ════════════════════════════════════════════════════════════
           PEACE LEVEL GATEWAY  (y=7200-7500)
      ════════════════════════════════════════════════════════════ */}
      {(() => {
        const PCE_GY = 7200;
        const PCE_CX = 1600;
        return (
          <g>
            {/* Dark transition band */}
            <rect x="0" y={PCE_GY} width={WORLD_W} height="300" fill="#0D1B2A" />
            {[0,1,2,3,4,5,6,7].map(i => (
              <rect key={i} x={i * WORLD_W / 8} y={PCE_GY} width={WORLD_W / 8} height="300"
                fill={i % 2 === 0 ? '#0A1628' : '#0D1B2A'} opacity="0.9" />
            ))}
            {/* Stars in transition */}
            {[[200,7230],[500,7210],[850,7240],[1200,7220],[1650,7210],[2000,7235],[2400,7215],[2800,7240],[3050,7220]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="2" fill="white" opacity={0.5 + (i%3)*0.2} />
            ))}
            {/* Gate arch */}
            <ellipse cx={PCE_CX} cy={PCE_GY + 60} rx="240" ry="120"
              fill="none" stroke="#3949AB" strokeWidth="12" opacity="0.9" filter="url(#glow)" />
            <ellipse cx={PCE_CX} cy={PCE_GY + 60} rx="218" ry="106"
              fill="none" stroke="#7986CB" strokeWidth="5" opacity="0.7" />
            {/* Pillars */}
            <rect x={PCE_CX - 248} y={PCE_GY - 20} width="26" height="190" rx="12" fill="#283593" opacity="0.9" />
            <rect x={PCE_CX + 222} y={PCE_GY - 20} width="26" height="190" rx="12" fill="#283593" opacity="0.9" />
            <circle cx={PCE_CX - 235} cy={PCE_GY - 34} r="22" fill="#3949AB" stroke="white" strokeWidth="3" />
            <circle cx={PCE_CX + 235} cy={PCE_GY - 34} r="22" fill="#3949AB" stroke="white" strokeWidth="3" />
            <text x={PCE_CX - 235} y={PCE_GY - 26} textAnchor="middle" fontSize="16">⚖️</text>
            <text x={PCE_CX + 235} y={PCE_GY - 26} textAnchor="middle" fontSize="16">🕊️</text>
            {/* Banner */}
            <rect x={PCE_CX - 200} y={PCE_GY + 78} width="400" height="44" rx="22" fill="#1A237E" />
            <text x={PCE_CX} y={PCE_GY + 106} textAnchor="middle" fontSize="16" fontWeight="bold"
              fontFamily="Nunito" fill="white">⚖️ Peace Space Gateway 🕊️</text>
            {/* Path below */}
            <rect x={PCE_CX - 60} y={PCE_GY + 122} width="120" height="180" rx="8" fill="#1A237E" opacity="0.35" />
          </g>
        );
      })()}

      {/* ════ PEACE SPACE BIOME BACKGROUND (y=7400-9200) ════ */}
      <rect x="0" y="7400" width={WORLD_W} height="1800" fill="#1A1E3C" />
      {/* Starfield */}
      {Array.from({length: 60}).map((_,i) => {
        const sx = ((i * 137 + 50) % WORLD_W);
        const sy = 7420 + ((i * 97 + 30) % 1760);
        return <circle key={`pce-star-${i}`} cx={sx} cy={sy} r={i%5===0?2.5:1.5} fill="white" opacity={0.3 + (i%4)*0.15} />;
      })}
      {/* Aurora bands */}
      <path d="M 0 7700 Q 800 7640 1600 7700 Q 2400 7760 3200 7700" stroke="#3F51B5" strokeWidth="80" fill="none" opacity="0.18" />
      <path d="M 0 7820 Q 800 7760 1600 7820 Q 2400 7880 3200 7820" stroke="#5C6BC0" strokeWidth="50" fill="none" opacity="0.14" />
      <path d="M 0 7950 Q 800 7890 1600 7950 Q 2400 8010 3200 7950" stroke="#7986CB" strokeWidth="35" fill="none" opacity="0.12" />
      {/* Dove silhouettes */}
      {[[400,7600],[900,7650],[1450,7580],[2100,7640],[2700,7600]].map(([x,y],i) => (
        <text key={i} x={x} y={y} fontSize="22" opacity="0.3">🕊️</text>
      ))}
      {/* Scales of justice decorations */}
      {[[600,8100],[1200,8050],[1900,8100],[2600,8060]].map(([x,y],i) => (
        <text key={i} x={x} y={y} fontSize="28" opacity="0.2">⚖️</text>
      ))}

      {/* ════ PEACE ZONE GROUND AREAS ════ */}
      {ZONE_REGIONS.filter(z => z.level === 'peace').map(z => {
        const done = completedZones.includes(z.id);
        return (
          <g key={z.id}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="24" ry="24"
              fill={done ? z.color : 'rgba(63,81,181,0.15)'}
              stroke={done ? z.borderColor : '#5C6BC0'}
              strokeWidth="5" strokeDasharray={done ? 'none' : '14 7'}
              filter="url(#shadow)" />
            <rect x={z.x + z.w / 2 - 170} y={z.y - 70} width="340" height="54" rx="27"
              fill={done ? z.borderColor : '#283593'} filter="url(#shadow)" />
            <rect x={z.x + z.w / 2 - 170} y={z.y - 70} width="340" height="54" rx="27"
              fill="white" opacity="0.10" />
            <text x={z.x + z.w / 2} y={z.y - 52} textAnchor="middle" fill="white"
              fontSize="11" fontFamily="Nunito" opacity="0.88">
              {done ? '✅ Peace Restored!' : '🔒 Undiscovered'}
            </text>
            <text x={z.x + z.w / 2} y={z.y - 30} textAnchor="middle" fill="white"
              fontSize="20" fontWeight="bold" fontFamily="Patrick Hand, cursive">
              {z.emoji} SDG {z.sdg} · {z.name}
            </text>
          </g>
        );
      })}

      {/* ════ PEACE HUB ════ */}
      {(() => {
        const PHX = 1580, PHY = 8100;
        return (
          <g>
            <circle cx={PHX} cy={PHY} r="180" fill="#1A237E" stroke="#3949AB" strokeWidth="7" filter="url(#shadow)" />
            <circle cx={PHX} cy={PHY} r="180" fill="none" stroke="#7986CB" strokeWidth="4" opacity="0.6" />
            <text x={PHX} y={PHY - 40} textAnchor="middle" fontSize="22" fontWeight="bold" fontFamily="Patrick Hand, cursive" fill="#C5CAE9">⚖️ Peace Space</text>
            <text x={PHX} y={PHY - 12} textAnchor="middle" fontSize="12" fontFamily="Nunito" fill="#9FA8DA">SDG 16: Justice & Strong Institutions</text>
            {/* Road to peace zone */}
            <path d={`M ${PHX} ${PHY} Q 1300 7900 1000 7750`} stroke="#283593" strokeWidth="44" fill="none" strokeLinecap="round" opacity="0.5" />
            <path d={`M ${PHX} ${PHY} Q 1300 7900 1000 7750`} stroke="#3949AB" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.4" />
          </g>
        );
      })()}

      {/* ════ PEACE ROAD EXTENSION (y=7400-9200) ════ */}
      <rect x="1520" y="7500" width="120" height="800" fill="#283593" opacity="0.4" />
      <rect x="1540" y="7500" width="80"  height="800" fill="#3949AB" opacity="0.35" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={`rd-pce-${i}`} x="1574" y={7540 + i * 110} width="12" height="65"
          fill="rgba(200,210,255,0.5)" rx="3" />
      ))}

      {/* ════════════════════════════════════════════════════════════
           PARTNERSHIP LEVEL GATEWAY  (y=9100-9400)
      ════════════════════════════════════════════════════════════ */}
      {(() => {
        const PAR_GY = 9100;
        const PAR_CX = 1600;
        return (
          <g>
            <rect x="0" y={PAR_GY} width={WORLD_W} height="260" fill="#1A0030" />
            {[0,1,2,3,4,5,6,7].map(i => (
              <rect key={i} x={i * WORLD_W / 8} y={PAR_GY} width={WORLD_W / 8} height="260"
                fill={i % 2 === 0 ? '#150025' : '#1A0030'} opacity="0.9" />
            ))}
            {[[250,9130],[600,9110],[1000,9140],[1400,9120],[1800,9110],[2200,9135],[2600,9115],[2950,9130]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="2.5" fill="#E040FB" opacity={0.4 + (i%3)*0.2} />
            ))}
            {/* Gate */}
            <ellipse cx={PAR_CX} cy={PAR_GY + 60} rx="245" ry="122"
              fill="none" stroke="#7B1FA2" strokeWidth="12" opacity="0.9" filter="url(#glow)" />
            <ellipse cx={PAR_CX} cy={PAR_GY + 60} rx="222" ry="108"
              fill="none" stroke="#CE93D8" strokeWidth="5" opacity="0.7" />
            <rect x={PAR_CX - 254} y={PAR_GY - 18} width="26" height="192" rx="12" fill="#4A148C" opacity="0.9" />
            <rect x={PAR_CX + 228} y={PAR_GY - 18} width="26" height="192" rx="12" fill="#4A148C" opacity="0.9" />
            <circle cx={PAR_CX - 241} cy={PAR_GY - 32} r="22" fill="#7B1FA2" stroke="white" strokeWidth="3" />
            <circle cx={PAR_CX + 241} cy={PAR_GY - 32} r="22" fill="#7B1FA2" stroke="white" strokeWidth="3" />
            <text x={PAR_CX - 241} y={PAR_GY - 24} textAnchor="middle" fontSize="16">🤝</text>
            <text x={PAR_CX + 241} y={PAR_GY - 24} textAnchor="middle" fontSize="16">🌍</text>
            <rect x={PAR_CX - 205} y={PAR_GY + 80} width="410" height="44" rx="22" fill="#4A148C" />
            <text x={PAR_CX} y={PAR_GY + 108} textAnchor="middle" fontSize="16" fontWeight="bold"
              fontFamily="Nunito" fill="white">🤝 Partnership Space Gateway 🌍</text>
            <rect x={PAR_CX - 60} y={PAR_GY + 124} width="120" height="180" rx="8" fill="#4A148C" opacity="0.35" />
          </g>
        );
      })()}

      {/* ════ PARTNERSHIP SPACE BIOME BACKGROUND (y=9300-11000) ════ */}
      <rect x="0" y="9300" width={WORLD_W} height="1700" fill="#0D0020" />
      {/* Galaxy backdrop */}
      {Array.from({length: 80}).map((_,i) => {
        const sx = ((i * 179 + 70) % WORLD_W);
        const sy = 9320 + ((i * 113 + 40) % 1660);
        const col = ['#CE93D8','#F48FB1','#80DEEA','#FFD700','white'][i%5];
        return <circle key={`par-star-${i}`} cx={sx} cy={sy} r={i%6===0?3:i%3===0?2:1.2} fill={col} opacity={0.2 + (i%5)*0.12} />;
      })}
      {/* Nebula clouds */}
      <ellipse cx="800"  cy="9700" rx="400" ry="180" fill="#7B1FA2" opacity="0.08" />
      <ellipse cx="2400" cy="9800" rx="350" ry="160" fill="#4A148C" opacity="0.10" />
      <ellipse cx="1600" cy="10200" rx="500" ry="220" fill="#6A1B9A" opacity="0.09" />
      {/* Globe/network decorations */}
      {[[500,9600],[1100,9650],[2000,9600],[2700,9640]].map(([x,y],i) => (
        <text key={i} x={x} y={y} fontSize="30" opacity="0.2">🌐</text>
      ))}
      {[[700,10100],[1400,10050],[2100,10100],[2850,10070]].map(([x,y],i) => (
        <text key={i} x={x} y={y} fontSize="24" opacity="0.18">🤝</text>
      ))}
      {/* Network connection lines */}
      {[[500,9700,1100,9750],[1100,9750,2000,9700],[2000,9700,2700,9740],[700,10150,1400,10100],[1400,10100,2100,10150]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#CE93D8" strokeWidth="2" opacity="0.15" strokeDasharray="12 8" />
      ))}

      {/* ════ PARTNERSHIP ZONE GROUND AREAS ════ */}
      {ZONE_REGIONS.filter(z => z.level === 'partnership').map(z => {
        const done = completedZones.includes(z.id);
        return (
          <g key={z.id}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="24" ry="24"
              fill={done ? z.color : 'rgba(123,31,162,0.15)'}
              stroke={done ? z.borderColor : '#9C27B0'}
              strokeWidth="5" strokeDasharray={done ? 'none' : '14 7'}
              filter="url(#shadow)" />
            <rect x={z.x + z.w / 2 - 175} y={z.y - 70} width="350" height="54" rx="27"
              fill={done ? z.borderColor : '#4A148C'} filter="url(#shadow)" />
            <rect x={z.x + z.w / 2 - 175} y={z.y - 70} width="350" height="54" rx="27"
              fill="white" opacity="0.10" />
            <text x={z.x + z.w / 2} y={z.y - 52} textAnchor="middle" fill="white"
              fontSize="11" fontFamily="Nunito" opacity="0.88">
              {done ? '✅ Global Partnerships Forged!' : '🔒 Undiscovered'}
            </text>
            <text x={z.x + z.w / 2} y={z.y - 30} textAnchor="middle" fill="white"
              fontSize="20" fontWeight="bold" fontFamily="Patrick Hand, cursive">
              {z.emoji} SDG {z.sdg} · {z.name}
            </text>
          </g>
        );
      })}

      {/* ════ PARTNERSHIP HUB ════ */}
      {(() => {
        const PAX = 1580, PAY = 9900;
        return (
          <g>
            <circle cx={PAX} cy={PAY} r="185" fill="#1A0035" stroke="#7B1FA2" strokeWidth="7" filter="url(#shadow)" />
            <circle cx={PAX} cy={PAY} r="185" fill="none" stroke="#CE93D8" strokeWidth="4" opacity="0.6" />
            <text x={PAX} y={PAY - 40} textAnchor="middle" fontSize="22" fontWeight="bold" fontFamily="Patrick Hand, cursive" fill="#CE93D8">🤝 Partnership Space</text>
            <text x={PAX} y={PAY - 12} textAnchor="middle" fontSize="12" fontFamily="Nunito" fill="#E1BEE7">SDG 17: Partnerships for the Goals</text>
            {/* Road to partnership zone */}
            <path d={`M ${PAX} ${PAY} Q 1300 9700 1000 9570`} stroke="#4A148C" strokeWidth="44" fill="none" strokeLinecap="round" opacity="0.5" />
            <path d={`M ${PAX} ${PAY} Q 1300 9700 1000 9570`} stroke="#7B1FA2" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.4" />
          </g>
        );
      })()}

      {/* ════ PARTNERSHIP ROAD EXTENSION (y=9400-11000) ════ */}
      <rect x="1520" y="9400" width="120" height="900" fill="#4A148C" opacity="0.35" />
      <rect x="1540" y="9400" width="80"  height="900" fill="#6A1B9A" opacity="0.3" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={`rd-par-${i}`} x="1574" y={9440 + i * 110} width="12" height="65"
          fill="rgba(230,180,255,0.45)" rx="3" />
      ))}

      {/* ════ ROAD BETWEEN PEACE AND PARTNERSHIP ════ */}
      <rect x="1520" y="8950" width="120" height="160" fill="#1A0030" opacity="0.5" />
      <rect x="1540" y="8950" width="80" height="160" fill="#2A0050" opacity="0.45" />
      {[0,1,2].map(i => (
        <rect key={`rd-mid-${i}`} x="1574" y={8960 + i * 50} width="12" height="30"
          fill="rgba(220,180,255,0.45)" rx="3" />
      ))}
    </svg>
  );
}

/* ── Building renderer — clay toy 3D isometric style ── */
function Buildings() {
  const D = 14; /* isometric depth offset in px */

  /* Label tag helper */
  const Label = ({ mx, y, color, text }: { mx: number; y: number; color: string; text: string }) => (
    <>
      <rect x={mx - 44} y={y - 30} width="88" height="20" rx="10" fill="white" opacity="0.92" />
      <rect x={mx - 44} y={y - 30} width="88" height="20" rx="10" fill={color} opacity="0.20" />
      <text x={mx} y={y - 16} textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="Nunito" fill={color}>{text}</text>
    </>
  );

  return (
    <svg width={WORLD_W} height={WORLD_H} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <defs>
        <radialGradient id="bldHL" cx="30%" cy="20%" r="70%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="white" stopOpacity="0.42" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bldSH" cx="75%" cy="85%" r="55%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="black" stopOpacity="0.20" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
      </defs>

      {WORLD_BUILDINGS.map((b, i) => {
        const mx = b.x + b.w / 2;

        if (['cottage', 'clinic', 'shop', 'barn'].includes(b.type)) {
          const rx = b.x, ry = b.y, rw = b.w, rh = b.h;
          const roofPeak = ry - rh * 0.48;
          return (
            <g key={i}>
              {/* Ground shadow */}
              <ellipse cx={mx + D/2} cy={ry + rh + D + 8} rx={rw * 0.48} ry={9} fill="rgba(0,0,0,0.18)" />
              {/* Isometric right side face */}
              <polygon
                points={`${rx+rw},${ry} ${rx+rw+D},${ry-D} ${rx+rw+D},${ry+rh-D} ${rx+rw},${ry+rh}`}
                fill={b.color} style={{ filter: 'brightness(0.68)' }} />
              {/* Isometric roof side face */}
              <polygon
                points={`${rx+rw},${ry} ${rx+rw+D},${ry-D} ${mx+D},${roofPeak-D} ${mx},${roofPeak}`}
                fill={b.roofColor} style={{ filter: 'brightness(0.72)' }} />
              {/* Front wall */}
              <rect x={rx} y={ry} width={rw} height={rh} rx="7" fill={b.color} />
              <rect x={rx} y={ry} width={rw} height={rh} rx="7" fill="url(#bldHL)" />
              <rect x={rx} y={ry} width={rw} height={rh} rx="7" fill="url(#bldSH)" />
              {/* Roof front face */}
              <polygon points={`${rx - 8},${ry}  ${mx},${roofPeak}  ${rx + rw + 8},${ry}`}
                fill={b.roofColor} />
              <polygon points={`${rx - 8},${ry}  ${mx},${roofPeak}  ${rx + rw + 8},${ry}`}
                fill="url(#bldHL)" />
              {/* Windows */}
              <rect x={rx + rw * 0.12} y={ry + rh * 0.22} width={rw * 0.24} height={rh * 0.26} rx="4"
                fill="#B3E5FC" />
              <rect x={rx + rw * 0.12} y={ry + rh * 0.22} width={rw * 0.24} height={rh * 0.26} rx="4"
                fill="url(#bldHL)" opacity="0.5" />
              <rect x={rx + rw * 0.62} y={ry + rh * 0.22} width={rw * 0.24} height={rh * 0.26} rx="4"
                fill="#B3E5FC" />
              <rect x={rx + rw * 0.62} y={ry + rh * 0.22} width={rw * 0.24} height={rh * 0.26} rx="4"
                fill="url(#bldHL)" opacity="0.5" />
              {/* Door */}
              <rect x={mx - rw * 0.13} y={ry + rh * 0.55} width={rw * 0.26} height={rh * 0.44} rx="5"
                fill="#795548" />
              <rect x={mx - rw * 0.13} y={ry + rh * 0.55} width={rw * 0.26} height={rh * 0.44} rx="5"
                fill="url(#bldHL)" opacity="0.4" />
              {b.type === 'clinic' && (
                <>
                  <rect x={mx - 5} y={ry + rh * 0.04} width={10} height={26} rx="3" fill="white" />
                  <rect x={mx - 13} y={ry + rh * 0.04 + 8} width={26} height={10} rx="3" fill="white" />
                  <circle cx={mx} cy={ry + rh * 0.04 + 13} r="6" fill="#4CAF50" opacity="0.3" />
                </>
              )}
              {b.label && <Label mx={mx} y={ry} color={b.roofColor} text={b.label} />}
            </g>
          );
        }

        if (b.type === 'tower') {
          const rx = b.x, ry = b.y, rw = b.w, rh = b.h;
          return (
            <g key={i}>
              <ellipse cx={mx + D/2} cy={ry + rh + D + 6} rx={rw * 0.42} ry={8} fill="rgba(0,0,0,0.16)" />
              {/* Isometric right side */}
              <polygon points={`${rx+rw},${ry} ${rx+rw+D},${ry-D} ${rx+rw+D},${ry+rh-D} ${rx+rw},${ry+rh}`}
                fill={b.color} style={{ filter: 'brightness(0.62)' }} />
              {/* Roof right side */}
              <polygon points={`${rx+rw},${ry} ${rx+rw+D},${ry-D} ${rx+rw+D},${ry+rh*0.17-D} ${rx+rw},${ry+rh*0.17}`}
                fill={b.roofColor} style={{ filter: 'brightness(0.68)' }} />
              {/* Front wall */}
              <rect x={rx} y={ry} width={rw} height={rh} rx="5" fill={b.color} />
              <rect x={rx} y={ry} width={rw} height={rh} rx="5" fill="url(#bldHL)" />
              <rect x={rx} y={ry} width={rw} height={rh} rx="5" fill="url(#bldSH)" />
              {/* Roof band */}
              <rect x={rx} y={ry} width={rw} height={rh * 0.18} rx="5" fill={b.roofColor} />
              <rect x={rx} y={ry} width={rw} height={rh * 0.18} rx="5" fill="url(#bldHL)" />
              {/* Windows grid */}
              {[0,1,2].flatMap(r => [0,1].map(c => (
                <g key={`${r}-${c}`}>
                  <rect x={rx + rw * 0.10 + c * rw * 0.46} y={ry + rh * 0.26 + r * rh * 0.22}
                    width={rw * 0.32} height={rh * 0.16} rx="3" fill="#FFF9C4" />
                  <rect x={rx + rw * 0.10 + c * rw * 0.46} y={ry + rh * 0.26 + r * rh * 0.22}
                    width={rw * 0.32} height={rh * 0.16} rx="3" fill="url(#bldHL)" opacity="0.5" />
                </g>
              )))}
              {b.label && <Label mx={mx} y={ry} color={b.roofColor} text={b.label} />}
            </g>
          );
        }

        if (b.type === 'school') {
          const rx = b.x, ry = b.y, rw = b.w, rh = b.h;
          const roofPeak = ry - rh * 0.52;
          return (
            <g key={i}>
              <ellipse cx={mx + D/2} cy={ry + rh + D + 10} rx={rw * 0.48} ry={10} fill="rgba(0,0,0,0.20)" />
              {/* Right side */}
              <polygon points={`${rx+rw},${ry} ${rx+rw+D},${ry-D} ${rx+rw+D},${ry+rh-D} ${rx+rw},${ry+rh}`}
                fill={b.color} style={{ filter: 'brightness(0.62)' }} />
              <polygon points={`${rx+rw},${ry} ${rx+rw+D},${ry-D} ${mx+D},${roofPeak-D} ${mx},${roofPeak}`}
                fill={b.roofColor} style={{ filter: 'brightness(0.68)' }} />
              {/* Front wall */}
              <rect x={rx} y={ry} width={rw} height={rh} rx="7" fill={b.color} />
              <rect x={rx} y={ry} width={rw} height={rh} rx="7" fill="url(#bldHL)" />
              <rect x={rx} y={ry} width={rw} height={rh} rx="7" fill="url(#bldSH)" />
              {/* Roof + steeple */}
              <polygon points={`${rx-10},${ry} ${mx},${roofPeak} ${rx+rw+10},${ry}`} fill={b.roofColor} />
              <polygon points={`${rx-10},${ry} ${mx},${roofPeak} ${rx+rw+10},${ry}`} fill="url(#bldHL)" />
              <rect x={mx - 18} y={roofPeak - 30} width="36" height="28" rx="4" fill={b.color} />
              <polygon points={`${mx-20},${roofPeak-30} ${mx},${roofPeak-55} ${mx+20},${roofPeak-30}`} fill={b.roofColor} />
              <ellipse cx={mx} cy={roofPeak - 18} rx="8" ry="7" fill="#FFD700" />
              {/* Windows */}
              {[-0.35, 0, 0.35].map((off, wi) => (
                <g key={wi}>
                  <rect x={mx + off * rw - 12} y={ry + rh * 0.18} width="24" height={rh * 0.23} rx="4"
                    fill="#FFF9C4" />
                  <rect x={mx + off * rw - 12} y={ry + rh * 0.18} width="24" height={rh * 0.23} rx="4"
                    fill="url(#bldHL)" opacity="0.5" />
                </g>
              ))}
              {/* Door */}
              <rect x={mx - 18} y={ry + rh * 0.52} width="36" height={rh * 0.47} rx="5" fill="#4A148C" />
              <rect x={mx - 18} y={ry + rh * 0.52} width="36" height={rh * 0.47} rx="5" fill="url(#bldHL)" opacity="0.3" />
              {b.label && <Label mx={mx} y={ry} color="#4A148C" text={b.label} />}
            </g>
          );
        }

        if (b.type === 'factory') {
          const rx = b.x, ry = b.y, rw = b.w, rh = b.h;
          return (
            <g key={i}>
              <ellipse cx={mx + D/2} cy={ry + rh + D + 8} rx={rw * 0.44} ry={8} fill="rgba(0,0,0,0.28)" />
              {/* Isometric side */}
              <polygon points={`${rx+rw},${ry} ${rx+rw+D},${ry-D} ${rx+rw+D},${ry+rh-D} ${rx+rw},${ry+rh}`}
                fill={b.color} style={{ filter: 'brightness(0.58)' }} />
              {/* Roof side */}
              <polygon points={`${rx+rw},${ry} ${rx+rw+D},${ry-D} ${rx+rw+D},${ry+rh*0.14-D} ${rx+rw},${ry+rh*0.14}`}
                fill={b.roofColor} style={{ filter: 'brightness(0.65)' }} />
              {/* Front */}
              <rect x={rx} y={ry} width={rw} height={rh} rx="5" fill={b.color} />
              <rect x={rx} y={ry} width={rw} height={rh} rx="5" fill="url(#bldHL)" />
              <rect x={rx} y={ry} width={rw} height={rh} rx="5" fill="url(#bldSH)" />
              <rect x={rx} y={ry} width={rw} height={rh * 0.14} fill={b.roofColor} />
              <rect x={rx} y={ry} width={rw} height={rh * 0.14} fill="url(#bldHL)" />
              {/* Chimney */}
              <rect x={mx - 12} y={ry - 38} width="18" height="44" rx="5" fill="#37474F" />
              <rect x={mx - 12} y={ry - 38} width="18" height="44" rx="5" fill="url(#bldHL)" opacity="0.4" />
              <ellipse cx={mx - 3} cy={ry - 46} rx="11" ry="20" fill="#B0BEC5" opacity="0.45" />
              {/* Windows */}
              {[0,1].flatMap(r => [0,1,2].map(c => (
                <g key={`${r}-${c}`}>
                  <rect x={rx + rw * 0.06 + c * rw * 0.30} y={ry + rh * 0.24 + r * rh * 0.33}
                    width={rw * 0.22} height={rh * 0.22} rx="3" fill="#FFF9C4" opacity="0.85" />
                  <rect x={rx + rw * 0.06 + c * rw * 0.30} y={ry + rh * 0.24 + r * rh * 0.33}
                    width={rw * 0.22} height={rh * 0.22} rx="3" fill="url(#bldHL)" opacity="0.4" />
                </g>
              )))}
              {b.label && <Label mx={mx} y={ry - 40} color={b.roofColor} text={b.label} />}
            </g>
          );
        }

        if (b.type === 'lighthouse') {
          const rx = b.x, ry = b.y, rw = b.w, rh = b.h;
          return (
            <g key={i}>
              <ellipse cx={mx + D/2} cy={ry + rh + D + 5} rx={rw * 0.42} ry={6} fill="rgba(0,0,0,0.20)" />
              {/* Side (slightly darker for lighthouse stripes) */}
              <polygon points={`${rx+rw},${ry} ${rx+rw+D},${ry-D} ${rx+rw+D},${ry+rh-D} ${rx+rw},${ry+rh}`}
                fill="rgba(0,0,0,0.25)" />
              {/* Front body with red/white stripes */}
              <rect x={rx} y={ry} width={rw} height={rh} rx="6" fill="white" />
              {[0,1,2,3,4].map(si => (
                <rect key={si} x={rx} y={ry + si * rh / 5} width={rw} height={rh / 5}
                  fill={si % 2 === 0 ? 'white' : '#EF5350'} />
              ))}
              <rect x={rx} y={ry} width={rw} height={rh} rx="6" fill="url(#bldHL)" opacity="0.6" />
              <rect x={rx} y={ry} width={rw} height={rh} rx="6" fill="url(#bldSH)" opacity="0.5" />
              {/* Lantern top */}
              <ellipse cx={mx} cy={ry} rx={rw * 0.72} ry={13} fill="#FFF176" />
              <ellipse cx={mx} cy={ry} rx={rw * 0.72} ry={13} fill="url(#bldHL)" />
              <ellipse cx={mx} cy={ry} rx={9} ry={9} fill="#FFD700" />
              {b.label && <Label mx={mx} y={ry} color={b.roofColor} text={b.label} />}
            </g>
          );
        }

        if (b.type === 'treehouse') {
          const rx = b.x, ry = b.y, rw = b.w, rh = b.h;
          const houseX = rx + 10, houseW = rw - 20, houseH = rh * 0.68;
          return (
            <g key={i}>
              {/* Tree trunk (clay cylinder) */}
              <rect x={mx - 9} y={ry + houseH - 22} width="18" height="60" rx="8" fill="#6D4C41" />
              <rect x={mx - 9} y={ry + houseH - 22} width="18" height="60" rx="8" fill="url(#bldHL)" opacity="0.4" />
              {/* Tree canopy (clay 3D sphere) */}
              <ellipse cx={mx} cy={ry + houseH - 28} rx={rw * 0.58} ry={rh * 0.38} fill="#2E7D32" />
              <ellipse cx={mx} cy={ry + houseH - 28} rx={rw * 0.58} ry={rh * 0.38} fill="url(#bldHL)" />
              <ellipse cx={mx} cy={ry + houseH - 28} rx={rw * 0.58} ry={rh * 0.38} fill="url(#bldSH)" />
              <ellipse cx={mx - rw*0.2} cy={ry + houseH - 36} rx={rw * 0.15} ry={rh * 0.12} fill="white" opacity="0.25" />
              {/* Isometric right side of house */}
              <polygon points={`${houseX+houseW},${ry} ${houseX+houseW+D},${ry-D} ${houseX+houseW+D},${ry+houseH-D} ${houseX+houseW},${ry+houseH}`}
                fill={b.color} style={{ filter: 'brightness(0.65)' }} />
              {/* House */}
              <rect x={houseX} y={ry} width={houseW} height={houseH} rx="6" fill={b.color} />
              <rect x={houseX} y={ry} width={houseW} height={houseH} rx="6" fill="url(#bldHL)" />
              <rect x={houseX} y={ry} width={houseW} height={houseH} rx="6" fill="url(#bldSH)" />
              {/* Roof */}
              <polygon points={`${rx+6},${ry} ${mx},${ry - rh * 0.42} ${rx+rw-6},${ry}`} fill={b.roofColor} />
              <polygon points={`${rx+6},${ry} ${mx},${ry - rh * 0.42} ${rx+rw-6},${ry}`} fill="url(#bldHL)" />
              {b.label && <Label mx={mx} y={ry} color={b.roofColor} text={b.label} />}
            </g>
          );
        }

        /* well */
        return (
          <g key={i}>
            <ellipse cx={mx + D/2} cy={b.y + 60 + D} rx={36} ry={10} fill="rgba(0,0,0,0.18)" />
            <circle cx={mx} cy={b.y + 50} r="36" fill={b.color} />
            <circle cx={mx} cy={b.y + 50} r="36" fill="url(#bldHL)" />
            <circle cx={mx} cy={b.y + 50} r="36" fill="url(#bldSH)" />
            <circle cx={mx} cy={b.y + 50} r="24" fill={b.roofColor} />
            <circle cx={mx} cy={b.y + 50} r="24" fill="url(#bldHL)" />
            <text x={mx} y={b.y + 57} textAnchor="middle" fontSize="20">💧</text>
            {b.label && <Label mx={mx} y={b.y + 10} color={b.roofColor} text={b.label} />}
          </g>
        );
      })}

      {/* ══════ ENTERABLE BUILDINGS ══════ */}

      {/* GREENHOUSE (SDG 2 - Hunger, zone center) */}
      <g transform="translate(2570, 310)">
        {/* Shadow */}
        <ellipse cx="90" cy="142" rx="80" ry="16" fill="rgba(0,0,0,0.18)" />
        {/* Main glass house structure */}
        <rect x="10" y="40" width="160" height="100" rx="6" fill="#C8E6C9" stroke="#388E3C" strokeWidth="3" />
        <rect x="10" y="40" width="160" height="100" rx="6" fill="url(#bldHL)" opacity="0.4" />
        {/* Glass panes */}
        {[30,70,110,150].map(x => (
          <line key={x} x1={x} y1="40" x2={x} y2="140" stroke="#388E3C" strokeWidth="1.5" opacity="0.5" />
        ))}
        <line x1="10" y1="90" x2="170" y2="90" stroke="#388E3C" strokeWidth="1.5" opacity="0.5" />
        {/* Triangular roof */}
        <polygon points="0,42 90,0 180,42" fill="#2E7D32" />
        <polygon points="0,42 90,0 180,42" fill="url(#bldHL)" opacity="0.3" />
        <line x1="0" y1="42" x2="90" y2="0" stroke="#1B5E20" strokeWidth="2" />
        <line x1="90" y1="0" x2="180" y2="42" stroke="#1B5E20" strokeWidth="2" />
        {/* Door */}
        <rect x="72" y="95" width="36" height="45" rx="18" fill="#1B5E20" />
        <rect x="76" y="99" width="28" height="37" rx="14" fill="#388E3C" opacity="0.6" />
        <circle cx="100" cy="118" r="3" fill="#A5D6A7" />
        {/* Plants visible through glass */}
        {[25,60,100,140].map((x,i) => (
          <g key={i} transform={`translate(${x}, 100)`}>
            <rect x="-4" y="0" width="8" height="15" rx="3" fill="#6D4C41" />
            <ellipse cx="0" cy="-4" rx="8" ry="10" fill={['#66BB6A','#4CAF50','#81C784','#43A047'][i]} />
          </g>
        ))}
        {/* Sign */}
        <rect x="25" y="-24" width="130" height="26" rx="8" fill="#1B5E20" />
        <text x="90" y="-7" textAnchor="middle" fontSize="13" fontFamily="Patrick Hand, cursive" fill="white" fontWeight="bold">🌿 Community Greenhouse</text>
        {/* Enter prompt hint */}
        <rect x="50" y="142" width="80" height="20" rx="10" fill="#2E7D32" opacity="0.85" />
        <text x="90" y="156" textAnchor="middle" fontSize="10" fontFamily="Nunito" fill="white">[E] Enter</text>
      </g>

      {/* HOSPITAL / HEALTH CLINIC (SDG 3 - Health, zone center) */}
      <g transform="translate(1490, 280)">
        <ellipse cx="90" cy="140" rx="80" ry="15" fill="rgba(0,0,0,0.18)" />
        {/* Main building */}
        <rect x="5" y="30" width="170" height="110" rx="8" fill="#E3F2FD" stroke="#1565C0" strokeWidth="3" />
        <rect x="5" y="30" width="170" height="110" rx="8" fill="url(#bldHL)" opacity="0.35" />
        {/* Windows */}
        {[25, 115].map(x => (
          <g key={x}>
            <rect x={x} y="48" width="30" height="30" rx="4" fill="#90CAF9" stroke="#1565C0" strokeWidth="1.5" />
            <line x1={x} y1="63" x2={x+30} y2="63" stroke="#1565C0" strokeWidth="1" />
            <line x1={x+15} y1="48" x2={x+15} y2="78" stroke="#1565C0" strokeWidth="1" />
          </g>
        ))}
        {/* Red cross */}
        <rect x="75" y="44" width="30" height="52" rx="6" fill="#F44336" />
        <rect x="62" y="58" width="56" height="22" rx="6" fill="#F44336" />
        <rect x="78" y="47" width="24" height="46" rx="4" fill="white" opacity="0.3" />
        {/* Flat roof */}
        <rect x="0" y="24" width="180" height="14" rx="6" fill="#1565C0" />
        <rect x="0" y="24" width="180" height="14" rx="6" fill="url(#bldHL)" opacity="0.3" />
        {/* Door */}
        <rect x="70" y="96" width="40" height="44" rx="6" fill="#1565C0" />
        <rect x="74" y="100" width="32" height="36" rx="4" fill="#42A5F5" opacity="0.5" />
        <circle cx="102" cy="118" r="3" fill="#BBDEFB" />
        {/* Sign */}
        <rect x="20" y="-22" width="140" height="26" rx="8" fill="#1565C0" />
        <text x="90" y="-5" textAnchor="middle" fontSize="12" fontFamily="Patrick Hand, cursive" fill="white" fontWeight="bold">🏥 Health Clinic</text>
        <rect x="52" y="140" width="76" height="20" rx="10" fill="#1565C0" opacity="0.85" />
        <text x="90" y="154" textAnchor="middle" fontSize="10" fontFamily="Nunito" fill="white">[E] Enter</text>
      </g>

      {/* SCHOOL (SDG 4 - Education, zone center) */}
      <g transform="translate(2560, 1540)">
        <ellipse cx="100" cy="152" rx="90" ry="16" fill="rgba(0,0,0,0.18)" />
        {/* Main building */}
        <rect x="0" y="35" width="200" height="117" rx="6" fill="#EDE7F6" stroke="#6A1B9A" strokeWidth="3" />
        <rect x="0" y="35" width="200" height="117" rx="6" fill="url(#bldHL)" opacity="0.3" />
        {/* Roof / top band */}
        <rect x="0" y="25" width="200" height="18" rx="5" fill="#6A1B9A" />
        <rect x="0" y="25" width="200" height="18" rx="5" fill="url(#bldHL)" opacity="0.3" />
        {/* Bell tower */}
        <rect x="82" y="0" width="36" height="30" rx="4" fill="#7B1FA2" />
        <polygon points="82,0 100,-16 118,0" fill="#4A148C" />
        <circle cx="100" cy="14" r="6" fill="#CE93D8" />
        <line x1="100" y1="14" x2="100" y2="20" stroke="#4A148C" strokeWidth="2" />
        {/* Windows */}
        {[20, 80, 140].map(x => (
          <g key={x}>
            <rect x={x} y="50" width="28" height="32" rx="4" fill="#CE93D8" stroke="#6A1B9A" strokeWidth="1.5" />
            <line x1={x} y1="66" x2={x+28} y2="66" stroke="#6A1B9A" strokeWidth="1" />
            <line x1={x+14} y1="50" x2={x+14} y2="82" stroke="#6A1B9A" strokeWidth="1" />
          </g>
        ))}
        {/* Door */}
        <rect x="78" y="96" width="44" height="56" rx="8" fill="#6A1B9A" />
        <rect x="82" y="100" width="36" height="48" rx="6" fill="#9C27B0" opacity="0.4" />
        <circle cx="114" cy="124" r="3" fill="#E1BEE7" />
        {/* Steps */}
        <rect x="70" y="148" width="60" height="6" rx="3" fill="#9E9E9E" />
        <rect x="64" y="152" width="72" height="5" rx="2.5" fill="#BDBDBD" />
        {/* Sign */}
        <rect x="22" y="-22" width="156" height="26" rx="8" fill="#4A148C" />
        <text x="100" y="-5" textAnchor="middle" fontSize="12" fontFamily="Patrick Hand, cursive" fill="white" fontWeight="bold">🏫 The Learning Academy</text>
        <rect x="60" y="152" width="80" height="20" rx="10" fill="#6A1B9A" opacity="0.85" />
        <text x="100" y="166" textAnchor="middle" fontSize="10" fontFamily="Nunito" fill="white">[E] Enter</text>
      </g>

    </svg>
  );
}

/* ── PLAYER SIZE in world ── */
const PLAYER_W = 52;
const PLAYER_H = 72;

/* ── MAIN GAME WORLD ── */
export default function GameWorld() {
  const [, setLocation] = useLocation();
  const { completedZones, playerCharacter, playerName, getWorldHealPercent, peopleLevelComplete, planetLevelComplete, prosperityLevelComplete, peaceLevelComplete, peopleProgress, planetProgress } = useGame();

  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const playerElemRef = useRef<HTMLDivElement>(null);
  const playerNameElemRef = useRef<HTMLDivElement>(null);
  const playerPos = useRef({ ...PLAYER_SPAWN });
  const keysRef = useRef(new Set<string>());
  const animRef = useRef(0);
  const touchDirRef = useRef({ dx: 0, dy: 0 });
  const isMovingRef = useRef(false);
  const facingRef = useRef<'left' | 'right'>('right');
  const [focused, setFocused] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [nearNPC, setNearNPC] = useState<WorldNPC | null>(null);
  const nearNPCIdRef = useRef<string | null>(null);

  const [talkingNPC, setTalkingNPC] = useState<WorldNPC | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);

  const [nearBuilding, setNearBuilding] = useState<BuildingDef | null>(null);
  const nearBuildingRef = useRef<BuildingDef | null>(null);
  const [activeBuilding, setActiveBuilding] = useState<BuildingDef | null>(null);

  const [levelBanner, setLevelBanner] = useState<string | null>(null);
  const prevLevelRef = useRef<'people' | 'planet'>('people');

  const PlayerSprite = [Warden1, Warden2, Warden3][playerCharacter - 1] ?? Warden1;

  /* ── camera + player DOM update (no React re-render) ── */
  const updateDOM = useCallback(() => {
    const { x, y } = playerPos.current;

    if (playerElemRef.current) {
      playerElemRef.current.style.left = `${x - PLAYER_W / 2}px`;
      playerElemRef.current.style.top = `${y - PLAYER_H}px`;
    }
    if (playerNameElemRef.current) {
      playerNameElemRef.current.style.left = `${x}px`;
      playerNameElemRef.current.style.top = `${y + 4}px`;
    }

    if (worldRef.current) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const camX = Math.max(0, Math.min(x - vw / 2, WORLD_W - vw));
      const camY = Math.max(0, Math.min(y - vh / 2, WORLD_H - vh));
      worldRef.current.style.transform = `translate(${-camX}px, ${-camY}px)`;
    }

    const dot = document.getElementById('minimap-player');
    if (dot) {
      dot.setAttribute('cx', String(x));
      dot.setAttribute('cy', String(y));
    }

    // Level zone transition banner
    const newLevel: 'people' | 'planet' = y > 2400 ? 'planet' : 'people';
    if (newLevel !== prevLevelRef.current) {
      prevLevelRef.current = newLevel;
      setLevelBanner(newLevel === 'planet' ? '🌎 Welcome to the Planet Level!' : '🌍 Back to the People Level');
      setTimeout(() => setLevelBanner(null), 3000);
    }
  }, []);

  /* ── NPC + building proximity check ── */
  const checkProximity = useCallback(() => {
    const { x, y } = playerPos.current;
    let closest: WorldNPC | null = null;
    let closestDist = INTERACT_RADIUS;
    for (const npc of WORLD_NPCS) {
      const d = Math.hypot(npc.x - x, npc.y - y);
      if (d < closestDist) { closest = npc; closestDist = d; }
    }
    const newId = closest?.id ?? null;
    if (newId !== nearNPCIdRef.current) {
      nearNPCIdRef.current = newId;
      setNearNPC(closest);
    }

    // Building proximity check (entrance = bottom-center of building)
    let nearB: BuildingDef | null = null;
    for (const b of ENTERABLE_BUILDINGS) {
      const entranceX = b.x + b.width / 2;
      const entranceY = b.y + b.height;
      const d = Math.hypot(entranceX - x, entranceY - y);
      if (d < 100) { nearB = b; break; }
    }
    if (nearB?.id !== nearBuildingRef.current?.id) {
      nearBuildingRef.current = nearB;
      setNearBuilding(nearB);
    }
  }, []);

  /* ── auto-focus ── */
  useEffect(() => {
    const t = setTimeout(() => containerRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  /* ── game loop ── */
  useEffect(() => {
    const MOVE_KEYS = new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d','W','A','S','D',' ']);
    const onKeyDown = (e: KeyboardEvent) => {
      if (MOVE_KEYS.has(e.key)) e.preventDefault();
      keysRef.current.add(e.key);
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        if (nearBuildingRef.current) {
          setActiveBuilding(nearBuildingRef.current);
        } else if (nearNPCIdRef.current) {
          const npc = WORLD_NPCS.find(n => n.id === nearNPCIdRef.current);
          if (npc) { setTalkingNPC(npc); setDialogIndex(0); }
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp);

    let frameCount = 0;
    const loop = () => {
      frameCount++;
      const k = keysRef.current;
      const td = touchDirRef.current;
      let dx = td.dx;
      let dy = td.dy;

      if (k.has('ArrowLeft')  || k.has('a') || k.has('A')) dx -= PLAYER_SPEED;
      if (k.has('ArrowRight') || k.has('d') || k.has('D')) dx += PLAYER_SPEED;
      if (k.has('ArrowUp')    || k.has('w') || k.has('W')) dy -= PLAYER_SPEED;
      if (k.has('ArrowDown')  || k.has('s') || k.has('S')) dy += PLAYER_SPEED;

      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

      if (dx !== 0 || dy !== 0) {
        const { x, y } = playerPos.current;
        const nx = x + dx;
        const ny = y + dy;
        if (!wouldCollide(nx - PLAYER_W / 2, ny - PLAYER_H)) {
          playerPos.current.x = Math.max(PLAYER_W / 2, Math.min(WORLD_W - PLAYER_W / 2, nx));
        }
        if (!wouldCollide(playerPos.current.x - PLAYER_W / 2, ny - PLAYER_H)) {
          playerPos.current.y = Math.max(PLAYER_H, Math.min(WORLD_H - 20, ny));
        }
        if (dx < 0) facingRef.current = 'left';
        if (dx > 0) facingRef.current = 'right';
        isMovingRef.current = true;
      } else {
        isMovingRef.current = false;
      }

      if (playerElemRef.current) {
        playerElemRef.current.style.transform = `scaleX(${facingRef.current === 'left' ? -1 : 1})`;
        if (isMovingRef.current) {
          playerElemRef.current.classList.add('player-walking');
        } else {
          playerElemRef.current.classList.remove('player-walking');
        }
      }

      updateDOM();
      if (frameCount % 6 === 0) checkProximity();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    updateDOM();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [updateDOM, checkProximity]);

  /* ── D-PAD ── */
  const startTouch = (dx: number, dy: number) => { touchDirRef.current = { dx, dy }; };
  const stopTouch = () => { touchDirRef.current = { dx: 0, dy: 0 }; };

  /* ── dialogue ── */
  const handleDialogNext = () => {
    if (talkingNPC && dialogIndex < talkingNPC.dialogues.length - 1) setDialogIndex(i => i + 1);
  };
  const handleDialogClose = () => { setTalkingNPC(null); setDialogIndex(0); };
  const handleGoToPuzzle = useCallback((zoneId: string) => {
    setTalkingNPC(null);
    setDialogIndex(0);
    setTimeout(() => setLocation(`/puzzle/${zoneId}`), 150);
  }, [setLocation]);

  const healPct = getWorldHealPercent();

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={() => containerRef.current?.focus()}
      onKeyDown={(e) => {
        const MOVE_KEYS = new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d','W','A','S','D',' ']);
        if (MOVE_KEYS.has(e.key)) e.preventDefault();
        keysRef.current.add(e.key);
        if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && nearNPCIdRef.current) {
          const npc = WORLD_NPCS.find(n => n.id === nearNPCIdRef.current);
          if (npc) { setTalkingNPC(npc); setDialogIndex(0); }
        }
      }}
      onKeyUp={(e) => keysRef.current.delete(e.key)}
      className="fixed inset-0 overflow-hidden bg-black outline-none"
      style={{ cursor: 'default' }}
    >
      {/* ── CLICK TO PLAY overlay ── */}
      {!focused && (
        <div
          className="absolute inset-0 z-[999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
        >
          <div className="bg-white rounded-3xl px-10 py-6 text-center shadow-2xl animate-bounce">
            <div className="text-4xl mb-2">🎮</div>
            <div className="text-2xl font-black text-amber-700" style={{ fontFamily: 'Patrick Hand, sans-serif' }}>Click to Play!</div>
            <div className="text-sm text-gray-500 mt-1">Then use Arrow Keys or WASD to walk</div>
          </div>
        </div>
      )}

      {/* ── WORLD CONTAINER ── */}
      <div
        ref={worldRef}
        style={{ position: 'absolute', width: WORLD_W, height: WORLD_H, willChange: 'transform' }}
      >
        <WorldBackground completedZones={completedZones} />
        <Buildings />

        {/* ── WANDERING AMBIENT PETS (non-interactive) ── */}
        {([
          // People zone pets
          { emoji:'🐱', x:420,  y:1760, dur:'3.2s', anim:1 },
          { emoji:'🐶', x:680,  y:480,  dur:'4.1s', anim:2 },
          { emoji:'🐥', x:1350, y:400,  dur:'2.8s', anim:3 },
          { emoji:'🐇', x:2880, y:1660, dur:'3.6s', anim:4 },
          { emoji:'🐈', x:290,  y:520,  dur:'5.0s', anim:5 },
          { emoji:'🦆', x:2440, y:1700, dur:'3.9s', anim:6 },
          // Planet zone pets
          { emoji:'🐸', x:360,  y:2970, dur:'4.5s', anim:2 },
          { emoji:'🦜', x:430,  y:3850, dur:'2.5s', anim:3 },
          { emoji:'🦋', x:1680, y:4280, dur:'3.0s', anim:5 },
          { emoji:'🐢', x:2700, y:3860, dur:'6.0s', anim:1 },
          { emoji:'🦌', x:620,  y:3780, dur:'4.2s', anim:4 },
          // Prosperity zone pets
          { emoji:'🤖', x:1700, y:5160, dur:'2.2s', anim:6 },
          { emoji:'🐱', x:350,  y:6350, dur:'4.8s', anim:1 },
          { emoji:'🐕', x:700,  y:6360, dur:'3.4s', anim:2 },
          { emoji:'🐦', x:2600, y:6340, dur:'3.1s', anim:3 },
          { emoji:'🐰', x:2900, y:5100, dur:'3.8s', anim:4 },
        ] as {emoji:string;x:number;y:number;dur:string;anim:number}[]).map((pet, idx) => (
          <div
            key={`pet-${idx}`}
            className="absolute pointer-events-none select-none"
            style={{
              left: pet.x,
              top: pet.y,
              fontSize: 22,
              lineHeight: 1,
              animation: `petWander${pet.anim} ${pet.dur} ease-in-out infinite alternate`,
              zIndex: 10,
            }}
          >
            {pet.emoji}
          </div>
        ))}

        {/* ── NPCs ── */}
        {WORLD_NPCS.filter(npc => !npc.isHidden).map(npc => {
          const Sprite = SPRITE_MAP[npc.spriteKey];
          if (!Sprite) return null;
          const isNear = nearNPCIdRef.current === npc.id;
          const isDone = completedZones.includes(npc.zoneId);
          const zoneData = ZONES[npc.zoneId as keyof typeof ZONES];
          return (
            <React.Fragment key={npc.id}>
              <div
                style={{
                  position: 'absolute',
                  left: npc.x - 24,
                  top: npc.y - 64,
                  width: 48, height: 64,
                  cursor: 'pointer',
                  transform: `scaleX(${npc.facing === 'left' ? -1 : 1})`,
                }}
                onClick={() => { if (!talkingNPC) { setTalkingNPC(npc); setDialogIndex(0); } }}
              >
                <div style={{ width: '100%', height: '100%', filter: isDone && npc.isLord ? 'drop-shadow(0 0 10px gold)' : undefined }}>
                  <Sprite />
                </div>
              </div>
              {/* NPC labels outside scaleX wrapper so they never flip */}
              {isNear && !talkingNPC && (
                <div style={{
                  position: 'absolute',
                  left: npc.x, top: npc.y - 92,
                  transform: 'translateX(-50%)',
                  background: '#FFD700', border: '2px solid #F57F17',
                  borderRadius: '50%', width: 24, height: 24,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: 13,
                  animation: 'bounce 0.6s ease-in-out infinite alternate',
                  pointerEvents: 'none', zIndex: 110,
                }}>!</div>
              )}
              <div style={{
                position: 'absolute',
                left: npc.x, top: npc.y + 6,
                transform: 'translateX(-50%)',
                background: 'white', border: `1.5px solid ${zoneData?.themeColor || '#ccc'}`,
                borderRadius: 8, padding: '1px 5px',
                fontSize: 9, fontWeight: 'bold', whiteSpace: 'nowrap', color: '#333',
                pointerEvents: 'none', zIndex: 105,
              }}>{npc.name}</div>
              {npc.isLord && (
                <div style={{
                  position: 'absolute',
                  left: npc.x, top: npc.y - 80,
                  transform: 'translateX(-50%)',
                  fontSize: 14, pointerEvents: 'none', zIndex: 112,
                }}>👑</div>
              )}
            </React.Fragment>
          );
        })}

        {/* ── PLAYER sprite (scaleX flipped by game loop) ── */}
        <div
          ref={playerElemRef}
          style={{
            position: 'absolute', width: PLAYER_W, height: PLAYER_H,
            transformOrigin: 'center bottom', zIndex: 100,
          }}
        >
          <PlayerSprite />
        </div>
        {/* ── PLAYER name tag (separate, never flips) ── */}
        <div
          ref={playerNameElemRef}
          style={{
            position: 'absolute', zIndex: 101,
            transform: 'translateX(-50%)',
            background: '#4CAF50', color: 'white',
            borderRadius: 8, padding: '1px 6px',
            fontSize: 9, fontWeight: 'bold', whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >{playerName}</div>
      </div>

      {/* ── HUD ── */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-40 pointer-events-none">
        {/* Left: Dual progress */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg min-w-[220px] pointer-events-auto">
          <div className="flex justify-between text-xs font-bold text-green-700 mb-1">
            <span>🌍 World Healing</span>
            <span>{healPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${healPct}%`, background: 'linear-gradient(90deg, #4CAF50, #8BC34A)' }} />
          </div>
          {/* People progress */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-amber-700 w-16">👥 People</span>
            <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(peopleProgress / 5) * 100}%`, background: '#FF8F00' }} />
            </div>
            <span className="text-[10px] font-bold text-amber-700">{peopleProgress}/5</span>
          </div>
          {/* Planet progress */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-teal-700 w-16">🌎 Planet</span>
            <div className="flex-1 h-2 bg-teal-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(planetProgress / 5) * 100}%`, background: '#00838F' }} />
            </div>
            <span className="text-[10px] font-bold text-teal-700">{peopleLevelComplete ? `${planetProgress}/5` : '🔒'}</span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="bg-black/60 text-white rounded-2xl px-3 py-2 text-xs font-bold shadow-lg">
          <div>WASD / ↑↓←→ to walk</div>
          <div>E or Space to talk</div>
          <div>Click NPCs to chat</div>
        </div>
      </div>

      {/* ── LEVEL BANNER ── */}
      <AnimatePresence>
        {levelBanner && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50 px-8 py-3 rounded-2xl text-white font-black text-lg shadow-2xl"
            style={{ background: levelBanner.includes('Planet') ? '#006064' : '#2E7D32' }}
          >
            {levelBanner}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── D-PAD ── */}
      <div className="absolute bottom-6 left-6 z-40 select-none">
        <div style={{ display: 'grid', gridTemplateColumns: '68px 68px 68px', gridTemplateRows: '68px 68px 68px', gap: 6 }}>
          <div />
          <DPadBtn label="▲" onStart={() => startTouch(0, -PLAYER_SPEED * 2)} onEnd={stopTouch} />
          <div />
          <DPadBtn label="◀" onStart={() => startTouch(-PLAYER_SPEED * 2, 0)} onEnd={stopTouch} />
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12 }} />
          <DPadBtn label="▶" onStart={() => startTouch(PLAYER_SPEED * 2, 0)} onEnd={stopTouch} />
          <div />
          <DPadBtn label="▼" onStart={() => startTouch(0, PLAYER_SPEED * 2)} onEnd={stopTouch} />
          <div />
        </div>
      </div>

      {/* ── TALK BUTTON ── */}
      {nearNPC && !talkingNPC && (
        <button
          className="absolute bottom-6 right-6 z-40 bg-yellow-400 border-4 border-yellow-600 rounded-full w-20 h-20 text-3xl font-bold shadow-xl"
          onTouchStart={(e) => { e.preventDefault(); setTalkingNPC(nearNPC); setDialogIndex(0); }}
          onClick={() => { setTalkingNPC(nearNPC); setDialogIndex(0); }}
        >
          💬
        </button>
      )}

      {/* ── NEAR NPC PROMPT ── */}
      <AnimatePresence>
        {nearNPC && !talkingNPC && !nearBuilding && (
          <motion.div
            key={nearNPC.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 bg-black/70 text-white px-5 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-xl"
          >
            <span className="text-yellow-300 text-lg">!</span>
            Press <kbd className="bg-white/20 px-2 py-0.5 rounded-lg font-mono">E</kbd> to talk to <strong>{nearNPC.name}</strong>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NEAR BUILDING PROMPT ── */}
      <AnimatePresence>
        {nearBuilding && !activeBuilding && (
          <motion.div
            key={nearBuilding.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 text-white px-5 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-xl"
            style={{ background: 'rgba(30,70,30,0.88)' }}
          >
            <span className="text-2xl">{nearBuilding.emoji}</span>
            Press <kbd className="bg-white/20 px-2 py-0.5 rounded-lg font-mono">E</kbd> to enter <strong>{nearBuilding.name}</strong>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BUILDING INTERIOR ── */}
      {activeBuilding && (
        <BuildingInterior
          building={activeBuilding}
          playerCharacter={playerCharacter}
          onClose={() => setActiveBuilding(null)}
          onTalkToNPC={(zoneId) => {
            const npc = WORLD_NPCS.find(n => n.zoneId === zoneId && n.isLord);
            if (npc) { setTalkingNPC(npc); setDialogIndex(0); }
          }}
        />
      )}

      {/* ── DIALOGUE ── */}
      <AnimatePresence>
        {talkingNPC && (
          <Dialogue
            key={talkingNPC.id + dialogIndex}
            npc={talkingNPC}
            onNext={handleDialogNext}
            onClose={handleDialogClose}
            onGoToPuzzle={handleGoToPuzzle}
            dialogIndex={dialogIndex}
            completedZones={completedZones}
            peopleLevelComplete={peopleLevelComplete}
            planetLevelComplete={planetLevelComplete}
            prosperityLevelComplete={prosperityLevelComplete}
            peaceLevelComplete={peaceLevelComplete}
          />
        )}
      </AnimatePresence>

      {/* ── MAP TOGGLE BUTTON ── */}
      <button
        onClick={() => setShowMap(m => !m)}
        className="absolute top-3 right-3 z-40 bg-white/90 hover:bg-white rounded-xl px-3 py-2 shadow-lg border border-gray-300 text-sm font-bold text-gray-700 flex items-center gap-1.5 transition-all"
      >
        🗺️ {showMap ? 'Hide Map' : 'World Map'}
      </button>

      {/* ── MINI MAP ── */}
      {showMap && (
        <div className="absolute top-12 right-3 z-40">
          <div className="bg-white/95 rounded-2xl p-3 shadow-xl" style={{ border: '2px solid #bbb' }}>
            <svg width="180" height="200" viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}>
              {/* People section */}
              <rect x="0" y="0" width={WORLD_W} height="2200" fill="#8BC34A" />
              {/* People-Planet Gate */}
              <rect x="0" y="2200" width={WORLD_W} height="300" fill="#263238" />
              {/* Planet section */}
              <rect x="0" y="2500" width={WORLD_W} height="2140" fill="#2E7D52" />
              {/* Planet-Prosperity Gate */}
              <rect x="0" y="4640" width={WORLD_W} height="280" fill="#2A2060" />
              {/* Prosperity section */}
              <rect x="0" y="4920" width={WORLD_W} height="2280" fill="#1A3D5C" />
              {/* Prosperity-Peace Gate */}
              <rect x="0" y="7200" width={WORLD_W} height="300" fill="#0D1B2A" />
              {/* Peace section */}
              <rect x="0" y="7500" width={WORLD_W} height="1600" fill="#1A1E3C" />
              {/* Peace-Partnership Gate */}
              <rect x="0" y="9100" width={WORLD_W} height="260" fill="#1A0030" />
              {/* Partnership section */}
              <rect x="0" y="9360" width={WORLD_W} height={WORLD_H - 9360} fill="#0D0020" />
              {/* Zone regions */}
              {ZONE_REGIONS.map(z => (
                <rect key={z.id} x={z.x} y={z.y} width={z.w} height={z.h}
                  fill={completedZones.includes(z.id)
                    ? z.color
                    : z.level === 'partnership' ? 'rgba(156,39,176,0.18)'
                    : z.level === 'peace'        ? 'rgba(57,73,171,0.18)'
                    : z.level === 'prosperity'   ? 'rgba(249,168,37,0.15)'
                    : z.level === 'planet'        ? 'rgba(255,255,255,0.15)'
                    :                              '#D7CCC8'}
                  stroke={z.borderColor} strokeWidth="18" rx="20" />
              ))}
              {/* Gate markers */}
              <rect x={WORLD_W/2-150} y="2200" width="300" height="80" fill="#00BCD4" opacity="0.7" />
              <rect x={WORLD_W/2-150} y="4640" width="300" height="80" fill="#F9A825" opacity="0.7" />
              <rect x={WORLD_W/2-150} y="7200" width="300" height="80" fill="#3949AB" opacity="0.7" />
              <rect x={WORLD_W/2-150} y="9100" width="300" height="80" fill="#7B1FA2" opacity="0.7" />
              {/* Level labels */}
              <text x="80" y="140" fontSize="110" fill="#fff" opacity="0.6" fontFamily="sans-serif" fontWeight="bold">P</text>
              <text x="80" y="3400" fontSize="110" fill="#fff" opacity="0.6" fontFamily="sans-serif" fontWeight="bold">🌍</text>
              <text x="80" y="6200" fontSize="110" fill="#FFD700" opacity="0.5" fontFamily="sans-serif" fontWeight="bold">🌟</text>
              <text x="80" y="8100" fontSize="110" fill="#C5CAE9" opacity="0.5" fontFamily="sans-serif" fontWeight="bold">⚖</text>
              <text x="80" y="9900" fontSize="110" fill="#CE93D8" opacity="0.4" fontFamily="sans-serif" fontWeight="bold">🤝</text>
              {/* Player dot */}
              <circle cx={playerPos.current.x} cy={playerPos.current.y} r="55" fill="#E53935" stroke="white" strokeWidth="22" id="minimap-player" />
            </svg>
            <div className="text-[9px] text-center text-gray-500 mt-1 font-bold">🗺️ World Map — all 5 levels</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── D-pad button ── */
function DPadBtn({ label, onStart, onEnd }: { label: string; onStart: () => void; onEnd: () => void }) {
  return (
    <button
      className="bg-white/80 border-2 border-gray-400 rounded-xl text-gray-700 font-bold text-xl flex items-center justify-center shadow-md active:bg-gray-200 select-none"
      style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
      onTouchStart={(e) => { e.preventDefault(); onStart(); }}
      onTouchEnd={(e) => { e.preventDefault(); onEnd(); }}
      onMouseDown={onStart}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
    >
      {label}
    </button>
  );
}
