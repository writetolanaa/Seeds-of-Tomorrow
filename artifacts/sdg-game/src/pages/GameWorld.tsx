import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useGame } from '@/context/GameContext';
import { ZONES } from '@/data/gameData';
import {
  WORLD_W, WORLD_H, PLAYER_SPEED, INTERACT_RADIUS, PLAYER_SPAWN,
  WORLD_NPCS, ZONE_REGIONS, WORLD_BUILDINGS, COLLISION_RECTS,
  type WorldNPC,
} from '@/data/worldMap';
import { motion, AnimatePresence } from 'framer-motion';
import { Warden1, Warden2, Warden3 } from '@/components/Sprites';
import {
  BalooSprite, PebblepuffSprite, LeafletSprite, ThinkletSprite, SparkleflameSprite,
  NPC_GrandmaRosa, NPC_YoungMaya, NPC_LeeFather,
  NPC_FarmerAli, NPC_CitizenMia, NPC_CitizenTom,
  NPC_MrBun, NPC_LittleZoe, NPC_GrandpaJoe,
  NPC_StudentSam, NPC_StudentAria, NPC_StudentLeo,
  NPC_Girl, NPC_Worker, NPC_Sibling,
} from '@/components/Sprites';

/* ── sprite map ── */
const SPRITE_MAP: Record<string, React.FC<any>> = {
  baloo: BalooSprite, pebblepuff: PebblepuffSprite, leaflet: LeafletSprite,
  thinklet: ThinkletSprite, sparkleflame: SparkleflameSprite,
  grandma: NPC_GrandmaRosa, youngmaya: NPC_YoungMaya, leefather: NPC_LeeFather,
  farmerali: NPC_FarmerAli, citizenmia: NPC_CitizenMia, citizentom: NPC_CitizenTom,
  mrbun: NPC_MrBun, littlezoe: NPC_LittleZoe, grandpajoe: NPC_GrandpaJoe,
  studentsam: NPC_StudentSam, studentaria: NPC_StudentAria, studentleo: NPC_StudentLeo,
  girl: NPC_Girl, worker: NPC_Worker, sibling: NPC_Sibling,
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
}: {
  npc: WorldNPC;
  onNext: () => void;
  onClose: () => void;
  onGoToPuzzle: (zoneId: string) => void;
  dialogIndex: number;
  completedZones: string[];
}) {
  const zone = ZONES[npc.zoneId];
  const isLast = dialogIndex >= npc.dialogues.length - 1;
  const isCompleted = completedZones.includes(npc.zoneId);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
    >
      <div className="bg-white/97 sketch-border rounded-2xl p-5 shadow-2xl relative">
        <div
          className="absolute -top-4 left-6 px-4 py-1 rounded-full text-white font-bold text-sm shadow-md"
          style={{ background: zone.themeColor }}
        >
          {npc.name} {npc.isLord ? '✨' : ''}
        </div>
        <p className="text-base text-gray-700 leading-relaxed mt-3 min-h-[2.5rem] font-sans">
          {npc.dialogues[dialogIndex]}
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
              style={{ background: zone.themeColor }}
            >
              Next ▶
            </button>
          ) : npc.isLord && !isCompleted ? (
            <button
              onClick={() => { onClose(); onGoToPuzzle(npc.zoneId); }}
              className="px-5 py-1.5 rounded-lg text-white text-sm font-bold shadow-md"
              style={{ background: zone.themeColor }}
            >
              🎮 Accept Quest!
            </button>
          ) : isCompleted ? (
            <button onClick={onClose} className="px-5 py-1.5 rounded-lg text-white text-sm font-bold" style={{ background: zone.themeColor }}>
              ✨ Zone Healed!
            </button>
          ) : (
            <button onClick={onClose} className="px-5 py-1.5 rounded-lg text-white text-sm font-bold" style={{ background: zone.themeColor }}>
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
  return (
    <svg
      width={WORLD_W}
      height={WORLD_H}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
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
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* World grass base */}
      <rect width={WORLD_W} height={WORLD_H} fill="url(#grass)" />

      {/* Decorative texture overlay */}
      <rect width={WORLD_W} height={WORLD_H} fill="url(#grass)" opacity="0.3" />

      {/* ── ZONE GROUND AREAS ── */}
      {ZONE_REGIONS.map(z => {
        const done = completedZones.includes(z.id);
        return (
          <g key={z.id}>
            <rect
              x={z.x} y={z.y} width={z.w} height={z.h}
              rx="20" ry="20"
              fill={done ? z.color : '#D7CCC8'}
              stroke={done ? z.borderColor : '#9E9E9E'}
              strokeWidth="4"
              strokeDasharray={done ? 'none' : '12 6'}
              filter="url(#shadow)"
            />
            {/* Zone name banner */}
            <rect x={z.x + z.w/2 - 90} y={z.y - 22} width="180" height="28" rx="14"
              fill={done ? z.borderColor : '#757575'} />
            <text x={z.x + z.w/2} y={z.y - 4} textAnchor="middle" fill="white"
              fontSize="13" fontWeight="bold" fontFamily="Nunito">
              {z.emoji} SDG {z.sdg}: {done ? '✓' : '?'}
            </text>
          </g>
        );
      })}

      {/* ── DIRT PATHS connecting zones ── */}
      {/* Center to NW (equality) */}
      <path d="M 1380 980 Q 900 780 460 620" stroke="#C8A96E" strokeWidth="50" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Center to N (health) */}
      <path d="M 1380 980 Q 1370 650 1380 520" stroke="#C8A96E" strokeWidth="50" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Center to NE (hunger) */}
      <path d="M 1380 980 Q 1800 700 2280 620" stroke="#C8A96E" strokeWidth="50" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Center to SW (poverty) */}
      <path d="M 1380 980 Q 950 1280 460 1480" stroke="#C8A96E" strokeWidth="50" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Center to SE (education) */}
      <path d="M 1380 980 Q 1800 1280 2280 1480" stroke="#C8A96E" strokeWidth="50" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* Path surface marks (lighter) */}
      <path d="M 1380 980 Q 900 780 460 620" stroke="#DDB97E" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M 1380 980 Q 1370 650 1380 520" stroke="#DDB97E" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M 1380 980 Q 1800 700 2280 620" stroke="#DDB97E" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M 1380 980 Q 950 1280 460 1480" stroke="#DDB97E" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M 1380 980 Q 1800 1280 2280 1480" stroke="#DDB97E" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* ── CENTRAL PLAZA (cobblestone) ── */}
      <circle cx="1380" cy="980" r="160" fill="url(#cobble)" stroke="#78909C" strokeWidth="5" filter="url(#shadow)" />
      <circle cx="1380" cy="980" r="160" fill="none" stroke="#90A4AE" strokeWidth="5" />
      <text x="1380" y="925" textAnchor="middle" fontSize="22" fontWeight="bold" fontFamily="Patrick Hand, cursive" fill="#455A64">🌍 World Center</text>
      <text x="1380" y="955" textAnchor="middle" fontSize="13" fontFamily="Nunito" fill="#607D8B">Heal the 5 zones to save the world!</text>

      {/* World center well */}
      <circle cx="1380" cy="990" r="30" fill="#90A4AE" stroke="#455A64" strokeWidth="3" />
      <circle cx="1380" cy="990" r="20" fill="#546E7A" />
      <text x="1380" y="996" textAnchor="middle" fontSize="16">💧</text>

      {/* ── RIVER (decorative) ── */}
      <path d="M 0 1180 Q 600 1100 1000 1150 Q 1400 1200 1800 1120 Q 2200 1040 2800 1100"
        stroke="#64B5F6" strokeWidth="36" fill="none" opacity="0.55" />
      <path d="M 0 1180 Q 600 1100 1000 1150 Q 1400 1200 1800 1120 Q 2200 1040 2800 1100"
        stroke="white" strokeWidth="14" fill="none" opacity="0.2" strokeDasharray="30 40" />

      {/* River ripples */}
      {[200, 500, 850, 1200, 1550, 1900, 2300, 2600].map((x, i) => (
        <ellipse key={i} cx={x} cy={1145 + (i % 2) * 20} rx="28" ry="8" fill="none" stroke="white" strokeWidth="2" opacity="0.35" />
      ))}

      {/* Bridge over river */}
      <rect x="1340" y="1130" width="80" height="50" rx="4" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="4" />
      <rect x="1325" y="1130" width="10" height="50" fill="#8D6E63" />
      <rect x="1415" y="1130" width="10" height="50" fill="#8D6E63" />

      {/* ── TREES scattered ── */}
      {[
        [720, 200], [820, 300], [950, 180], [1800, 200], [1900, 300], [2000, 180],
        [700, 1200], [820, 1300], [1800, 1200], [1950, 1280],
        [100, 700], [100, 800], [2650, 700], [2700, 800],
        [100, 1050], [120, 1150], [2680, 1050], [2700, 1150],
        [1050, 400], [1700, 400], [1050, 1550], [1700, 1550],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="-5" y="15" width="10" height="25" fill="#795548" />
          <ellipse cx="0" cy="0" rx="24" ry="28" fill={i % 3 === 0 ? "#558B2F" : i % 3 === 1 ? "#388E3C" : "#33691E"} />
          <ellipse cx="0" cy="-10" rx="17" ry="20" fill={i % 3 === 0 ? "#7CB342" : i % 3 === 1 ? "#43A047" : "#2E7D32"} />
        </g>
      ))}

      {/* ── FLOWERS ── */}
      {[
        [700, 700], [900, 650], [1150, 850], [1600, 850], [1800, 750],
        [700, 1350], [900, 1300], [1600, 1350], [1800, 1300],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <circle cx="0" cy="0" r="6" fill={['#FF80AB','#FFCC02','#80DEEA','#FFB74D','#CE93D8','#F48FB1'][i % 6]} />
          <circle cx="8" cy="-5" r="5" fill={['#F48FB1','#FFE082','#80CBC4','#FFCC80','#CE93D8','#FF80AB'][(i+1) % 6]} />
          <circle cx="-8" cy="-4" r="5" fill={['#CE93D8','#FFCC02','#80DEEA','#FFB74D','#F48FB1','#FFCC02'][(i+2) % 6]} />
        </g>
      ))}

      {/* ── FARM CROPS (hunger zone decoration) ── */}
      {[2100, 2180, 2260, 2340, 2420, 2500, 2580].map((x, i) => (
        <g key={i}>
          <rect x={x} y="590" width="12" height="30" fill="#795548" opacity="0.6" />
          <ellipse cx={x + 6} cy="590" rx="10" ry="14" fill={i % 2 === 0 ? "#FDD835" : "#8BC34A"} />
          <rect x={x} y="650" width="12" height="25" fill="#795548" opacity="0.6" />
          <ellipse cx={x + 6} cy="650" rx="10" ry="12" fill={i % 2 === 0 ? "#EF5350" : "#FDD835"} />
        </g>
      ))}

      {/* ── ZONE-SPECIFIC GROUND DETAILS ── */}
      {/* Poverty zone rubble */}
      {completedZones.includes('poverty') ? null : (
        <>
          {[200, 350, 500, 620].map((x, i) => (
            <g key={i} transform={`translate(${x},${1760 + (i%2)*30})`}>
              <ellipse cx="0" cy="0" rx="18" ry="8" fill="#9E9E9E" opacity="0.5" />
              <ellipse cx="10" cy="-4" rx="10" ry="6" fill="#BDBDBD" opacity="0.5" />
            </g>
          ))}
        </>
      )}

      {/* Education zone scattered books (when not healed) */}
      {!completedZones.includes('education') && (
        <>
          {[2100, 2250, 2400, 2550].map((x, i) => (
            <rect key={i} x={x} y={1830 + (i%2)*20} width="20" height="14" rx="2"
              fill={['#7986CB','#BA68C8','#FF8A65','#4DB6AC'][i]} opacity="0.7"
              transform={`rotate(${(i-1)*15} ${x+10} ${1840+(i%2)*20})`} />
          ))}
        </>
      )}
    </svg>
  );
}

/* ── Building renderer ── */
function Buildings() {
  return (
    <svg width={WORLD_W} height={WORLD_H} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      {WORLD_BUILDINGS.map((b, i) => {
        const mx = b.x + b.w / 2;
        if (b.type === 'cottage' || b.type === 'clinic' || b.type === 'shop' || b.type === 'barn') {
          return (
            <g key={i}>
              {/* Shadow */}
              <ellipse cx={mx} cy={b.y + b.h + 10} rx={b.w * 0.45} ry={10} fill="rgba(0,0,0,0.15)" />
              {/* Wall */}
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="6" fill={b.color} stroke="#5D4037" strokeWidth="2.5" />
              {/* Roof */}
              <polygon points={`${b.x - 8},${b.y}  ${mx},${b.y - b.h * 0.45}  ${b.x + b.w + 8},${b.y}`}
                fill={b.roofColor} stroke="#5D4037" strokeWidth="2.5" />
              {/* Window */}
              <rect x={b.x + b.w * 0.18} y={b.y + b.h * 0.25} width={b.w * 0.22} height={b.h * 0.25} rx="3"
                fill="#B3E5FC" stroke="#5D4037" strokeWidth="1.5" />
              <rect x={b.x + b.w * 0.60} y={b.y + b.h * 0.25} width={b.w * 0.22} height={b.h * 0.25} rx="3"
                fill="#B3E5FC" stroke="#5D4037" strokeWidth="1.5" />
              {/* Door */}
              <rect x={mx - b.w * 0.12} y={b.y + b.h * 0.55} width={b.w * 0.24} height={b.h * 0.44} rx="4"
                fill="#5D4037" />
              {/* Clinic cross */}
              {b.type === 'clinic' && (
                <>
                  <rect x={mx - 5} y={b.y + b.h * 0.05} width={10} height={26} rx="3" fill="white" stroke="#4CAF50" strokeWidth="1.5" />
                  <rect x={mx - 13} y={b.y + b.h * 0.05 + 8} width={26} height={10} rx="3" fill="white" stroke="#4CAF50" strokeWidth="1.5" />
                </>
              )}
              {/* Label */}
              {b.label && (
                <>
                  <rect x={mx - 35} y={b.y - 30} width="70" height="18" rx="9" fill="white" stroke={b.roofColor} strokeWidth="1.5" />
                  <text x={mx} y={b.y - 17} textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="Nunito" fill={b.roofColor}>{b.label}</text>
                </>
              )}
            </g>
          );
        }
        if (b.type === 'tower') {
          return (
            <g key={i}>
              <ellipse cx={mx} cy={b.y + b.h + 8} rx={b.w * 0.4} ry={8} fill="rgba(0,0,0,0.12)" />
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill={b.color} stroke="#5D4037" strokeWidth="2.5" />
              <rect x={b.x} y={b.y} width={b.w} height={b.h * 0.2} rx="4" fill={b.roofColor} stroke="#5D4037" strokeWidth="2" />
              {[0, 1, 2].map(r => [0, 1].map(c => (
                <rect key={`${r}-${c}`}
                  x={b.x + b.w * 0.15 + c * b.w * 0.45} y={b.y + b.h * 0.28 + r * b.h * 0.22}
                  width={b.w * 0.25} height={b.h * 0.16} rx="2"
                  fill="#FFF9C4" stroke="#5D4037" strokeWidth="1.5" />
              )))}
            </g>
          );
        }
        if (b.type === 'school') {
          return (
            <g key={i}>
              <ellipse cx={mx} cy={b.y + b.h + 10} rx={b.w * 0.45} ry={10} fill="rgba(0,0,0,0.18)" />
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="6" fill={b.color} stroke="#4A148C" strokeWidth="3" />
              <polygon points={`${b.x - 10},${b.y}  ${mx},${b.y - b.h * 0.5}  ${b.x + b.w + 10},${b.y}`}
                fill={b.roofColor} stroke="#4A148C" strokeWidth="3" />
              {/* Bell tower */}
              <rect x={mx - 18} y={b.y - b.h * 0.5 - 30} width="36" height="28" rx="4" fill={b.color} stroke="#4A148C" strokeWidth="2" />
              <polygon points={`${mx - 20},${b.y - b.h * 0.5 - 30}  ${mx},${b.y - b.h * 0.5 - 55}  ${mx + 20},${b.y - b.h * 0.5 - 30}`}
                fill={b.roofColor} stroke="#4A148C" strokeWidth="2" />
              <ellipse cx={mx} cy={b.y - b.h * 0.5 - 18} rx="8" ry="7" fill="#FFD700" />
              {/* Windows row */}
              {[-0.35, 0, 0.35].map((off, wi) => (
                <rect key={wi} x={mx + off * b.w - 12} y={b.y + b.h * 0.2} width="24" height={b.h * 0.22} rx="3"
                  fill="#FFF9C4" stroke="#4A148C" strokeWidth="2" />
              ))}
              {/* Door */}
              <rect x={mx - 18} y={b.y + b.h * 0.52} width="36" height={b.h * 0.47} rx="4" fill="#4A148C" />
              {b.label && (
                <>
                  <rect x={mx - 45} y={b.y - 30} width="90" height="20" rx="10" fill="white" stroke="#4A148C" strokeWidth="2" />
                  <text x={mx} y={b.y - 15} textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="Nunito" fill="#4A148C">{b.label}</text>
                </>
              )}
            </g>
          );
        }
        // well
        return (
          <g key={i}>
            <circle cx={mx} cy={b.y + 50} r="36" fill="#90A4AE" stroke="#455A64" strokeWidth="3" />
            <circle cx={mx} cy={b.y + 50} r="24" fill="#546E7A" />
            <text x={mx} y={b.y + 57} textAnchor="middle" fontSize="20">💧</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── PLAYER SIZE in world ── */
const PLAYER_W = 52;
const PLAYER_H = 72;

/* ── MAIN GAME WORLD ── */
export default function GameWorld() {
  const [, setLocation] = useLocation();
  const { completedZones, playerCharacter, playerName, getWorldHealPercent } = useGame();

  const worldRef = useRef<HTMLDivElement>(null);
  const playerElemRef = useRef<HTMLDivElement>(null);
  const playerPos = useRef({ ...PLAYER_SPAWN });
  const keysRef = useRef(new Set<string>());
  const animRef = useRef(0);
  const touchDirRef = useRef({ dx: 0, dy: 0 });
  const isMovingRef = useRef(false);
  const facingRef = useRef<'left' | 'right'>('right');
  const walkFrameRef = useRef(0);

  const [nearNPC, setNearNPC] = useState<WorldNPC | null>(null);
  const nearNPCIdRef = useRef<string | null>(null);

  const [talkingNPC, setTalkingNPC] = useState<WorldNPC | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);

  const PlayerSprite = [Warden1, Warden2, Warden3][playerCharacter - 1] ?? Warden1;

  /* ── camera + player DOM update (no React re-render) ── */
  const updateDOM = useCallback(() => {
    const { x, y } = playerPos.current;

    if (playerElemRef.current) {
      playerElemRef.current.style.left = `${x - PLAYER_W / 2}px`;
      playerElemRef.current.style.top = `${y - PLAYER_H}px`;
    }

    if (worldRef.current) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const camX = Math.max(0, Math.min(x - vw / 2, WORLD_W - vw));
      const camY = Math.max(0, Math.min(y - vh / 2, WORLD_H - vh));
      worldRef.current.style.transform = `translate(${-camX}px, ${-camY}px)`;
    }

    // Update minimap player dot
    const dot = document.getElementById('minimap-player');
    if (dot) {
      dot.setAttribute('cx', String(x));
      dot.setAttribute('cy', String(y));
    }
  }, []);

  /* ── NPC proximity check ── */
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
  }, []);

  /* ── game loop ── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && nearNPCIdRef.current) {
        const npc = WORLD_NPCS.find(n => n.id === nearNPCIdRef.current);
        if (npc) { setTalkingNPC(npc); setDialogIndex(0); }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', onKeyDown);
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

      // normalise diagonal
      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

      if (dx !== 0 || dy !== 0) {
        const { x, y } = playerPos.current;
        const nx = x + dx;
        const ny = y + dy;

        if (!wouldCollide(nx - PLAYER_W / 2, ny - PLAYER_H)) playerPos.current.x = Math.max(PLAYER_W / 2, Math.min(WORLD_W - PLAYER_W / 2, nx));
        if (!wouldCollide(playerPos.current.x - PLAYER_W / 2, ny - PLAYER_H)) playerPos.current.y = Math.max(PLAYER_H, Math.min(WORLD_H - 20, ny));

        if (dx < 0) facingRef.current = 'left';
        if (dx > 0) facingRef.current = 'right';
        isMovingRef.current = true;
      } else {
        isMovingRef.current = false;
      }

      // walk animation — flip + CSS walking class
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

  /* ── D-PAD touch handler ── */
  const startTouch = (dx: number, dy: number) => { touchDirRef.current = { dx, dy }; };
  const stopTouch = () => { touchDirRef.current = { dx: 0, dy: 0 }; };

  /* ── dialogue ── */
  const handleDialogNext = () => {
    if (talkingNPC && dialogIndex < talkingNPC.dialogues.length - 1) {
      setDialogIndex(i => i + 1);
    }
  };

  const handleDialogClose = () => {
    setTalkingNPC(null);
    setDialogIndex(0);
  };

  const handleGoToPuzzle = useCallback((zoneId: string) => {
    setTalkingNPC(null);
    setDialogIndex(0);
    setTimeout(() => setLocation(`/puzzle/${zoneId}`), 150);
  }, [setLocation]);

  const healPct = getWorldHealPercent();

  return (
    <div className="fixed inset-0 overflow-hidden bg-black" style={{ cursor: 'default' }}>
      {/* ── WORLD CONTAINER ── */}
      <div
        ref={worldRef}
        style={{
          position: 'absolute',
          width: WORLD_W,
          height: WORLD_H,
          willChange: 'transform',
        }}
      >
        {/* Terrain SVG */}
        <WorldBackground completedZones={completedZones} />

        {/* Buildings SVG */}
        <Buildings />

        {/* ── NPCs ── */}
        {WORLD_NPCS.map(npc => {
          const Sprite = SPRITE_MAP[npc.spriteKey];
          if (!Sprite) return null;
          const isNear = nearNPCIdRef.current === npc.id;
          const isDone = completedZones.includes(npc.zoneId);
          return (
            <div
              key={npc.id}
              style={{
                position: 'absolute',
                left: npc.x - 24,
                top: npc.y - 64,
                width: 48,
                height: 64,
                cursor: 'pointer',
                transform: `scaleX(${npc.facing === 'left' ? -1 : 1})`,
              }}
              onClick={() => {
                if (!talkingNPC) { setTalkingNPC(npc); setDialogIndex(0); }
              }}
            >
              {/* NPC sprite */}
              <div style={{ width: '100%', height: '100%', filter: isDone && npc.isLord ? 'drop-shadow(0 0 10px gold)' : undefined }}>
                <Sprite />
              </div>

              {/* Interaction indicator */}
              {isNear && !talkingNPC && (
                <div style={{
                  position: 'absolute',
                  top: -28,
                  left: '50%',
                  transform: 'scaleX(-1) translateX(50%)',
                  background: '#FFD700',
                  border: '2px solid #F57F17',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: 13,
                  animation: 'bounce 0.6s ease-in-out infinite alternate',
                }}>!</div>
              )}

              {/* Name tag */}
              <div style={{
                position: 'absolute',
                bottom: -20,
                left: '50%',
                transform: 'scaleX(-1) translateX(50%)',
                background: 'white',
                border: '1.5px solid #ccc',
                borderRadius: 8,
                padding: '1px 5px',
                fontSize: 9,
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                color: '#333',
                pointerEvents: 'none',
              }}>{npc.name}</div>

              {/* Lord crown */}
              {npc.isLord && (
                <div style={{
                  position: 'absolute',
                  top: -14,
                  left: '50%',
                  transform: 'scaleX(-1) translateX(50%)',
                  fontSize: 14,
                  pointerEvents: 'none',
                }}>👑</div>
              )}
            </div>
          );
        })}

        {/* ── PLAYER ── */}
        <div
          ref={playerElemRef}
          style={{
            position: 'absolute',
            width: PLAYER_W,
            height: PLAYER_H,
            transformOrigin: 'center bottom',
            zIndex: 100,
          }}
        >
          <PlayerSprite />
          {/* Player label */}
          <div style={{
            position: 'absolute',
            bottom: -18,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#4CAF50',
            color: 'white',
            borderRadius: 8,
            padding: '1px 6px',
            fontSize: 9,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}>{playerName}</div>
        </div>
      </div>

      {/* ── HUD ── */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-40 pointer-events-none">
        {/* Left: World Healing */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 sketch-border-sm shadow-lg min-w-[200px] pointer-events-auto">
          <div className="flex justify-between text-xs font-bold text-green-700 mb-1">
            <span>🌍 World Healing</span>
            <span>{healPct}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${healPct}%`, background: 'linear-gradient(90deg, #4CAF50, #8BC34A)' }} />
          </div>
          <div className="text-[10px] text-gray-500 mt-1">{completedZones.length}/5 zones healed</div>
        </div>

        {/* Right: Controls hint */}
        <div className="bg-black/60 text-white rounded-2xl px-3 py-2 text-xs font-bold shadow-lg">
          <div>WASD / ↑↓←→ to walk</div>
          <div>E or Space to talk</div>
          <div>Click NPCs to chat</div>
        </div>
      </div>

      {/* ── MOBILE D-PAD ── */}
      <div className="absolute bottom-6 left-6 z-40 select-none md:hidden">
        <div style={{ display: 'grid', gridTemplateColumns: '52px 52px 52px', gridTemplateRows: '52px 52px 52px', gap: 4 }}>
          {/* Up */}
          <div />
          <DPadBtn label="▲" onStart={() => startTouch(0, -PLAYER_SPEED)} onEnd={stopTouch} />
          <div />
          {/* Left / Down / Right */}
          <DPadBtn label="◀" onStart={() => startTouch(-PLAYER_SPEED, 0)} onEnd={stopTouch} />
          <DPadBtn label="●" onStart={() => {}} onEnd={stopTouch} />
          <DPadBtn label="▶" onStart={() => startTouch(PLAYER_SPEED, 0)} onEnd={stopTouch} />
          {/* Down */}
          <div />
          <DPadBtn label="▼" onStart={() => startTouch(0, PLAYER_SPEED)} onEnd={stopTouch} />
          <div />
        </div>
      </div>

      {/* ── TALK BUTTON (mobile) ── */}
      {nearNPC && !talkingNPC && (
        <button
          className="absolute bottom-6 right-6 z-40 bg-yellow-400 border-4 border-yellow-600 rounded-full w-16 h-16 text-2xl font-bold shadow-xl md:hidden"
          onTouchStart={() => { setTalkingNPC(nearNPC); setDialogIndex(0); }}
          onClick={() => { setTalkingNPC(nearNPC); setDialogIndex(0); }}
        >
          💬
        </button>
      )}

      {/* ── NEAR NPC PROMPT (desktop) ── */}
      <AnimatePresence>
        {nearNPC && !talkingNPC && (
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
          />
        )}
      </AnimatePresence>

      {/* ── MINI MAP ── */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white/90 rounded-xl p-2 shadow-lg sketch-border-sm">
          <svg width="160" height="110" viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}>
            <rect width={WORLD_W} height={WORLD_H} fill="#8BC34A" rx="20" />
            {ZONE_REGIONS.map(z => (
              <rect key={z.id} x={z.x} y={z.y} width={z.w} height={z.h}
                fill={completedZones.includes(z.id) ? z.color : '#D7CCC8'}
                stroke={z.borderColor} strokeWidth="15" rx="20" />
            ))}
            {/* River */}
            <path d="M 0 1180 Q 1400 1200 2800 1100" stroke="#64B5F6" strokeWidth="40" fill="none" />
            {/* Player dot */}
            <circle cx={playerPos.current.x} cy={playerPos.current.y} r="40" fill="#E53935" stroke="white" strokeWidth="20" id="minimap-player" />
          </svg>
        </div>
      </div>
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
