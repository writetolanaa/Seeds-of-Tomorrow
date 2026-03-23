import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/* ─── World constants ─────────────────────────────────────── */
const WORLD_W = 2400;
const WORLD_H = 900;
const DIVER_W = 52;
const DIVER_H = 64;
const SPEED = 4;
const INTERACT_R = 90;
const SPAWN = { x: 160, y: 420 };

/* ─── Item types ─────────────────────────────────────────── */
type Garbage = { id: string; type: 'bottle' | 'bag' | 'paper'; x: number; y: number; collected: boolean };
type Animal  = { id: string; type: 'fish' | 'turtle' | 'seahorse'; x: number; y: number; freed: boolean };

const INIT_GARBAGE: Garbage[] = [
  { id:'b1', type:'bottle',  x:310,  y:210, collected:false },
  { id:'b2', type:'bottle',  x:760,  y:470, collected:false },
  { id:'b3', type:'bottle',  x:1140, y:260, collected:false },
  { id:'b4', type:'bottle',  x:1570, y:380, collected:false },
  { id:'b5', type:'bottle',  x:1920, y:280, collected:false },
  { id:'g1', type:'bag',     x:420,  y:670, collected:false },
  { id:'g2', type:'bag',     x:870,  y:340, collected:false },
  { id:'g3', type:'bag',     x:1270, y:580, collected:false },
  { id:'g4', type:'bag',     x:1660, y:240, collected:false },
  { id:'g5', type:'bag',     x:1980, y:630, collected:false },
  { id:'p1', type:'paper',   x:550,  y:440, collected:false },
  { id:'p2', type:'paper',   x:980,  y:640, collected:false },
  { id:'p3', type:'paper',   x:1360, y:330, collected:false },
  { id:'p4', type:'paper',   x:1750, y:540, collected:false },
  { id:'p5', type:'paper',   x:2120, y:420, collected:false },
];

const INIT_ANIMALS: Animal[] = [
  { id:'f1', type:'fish',     x:620,  y:390, freed:false },
  { id:'f2', type:'fish',     x:1220, y:340, freed:false },
  { id:'f3', type:'fish',     x:1730, y:450, freed:false },
  { id:'t1', type:'turtle',   x:500,  y:700, freed:false },
  { id:'t2', type:'turtle',   x:1430, y:650, freed:false },
  { id:'s1', type:'seahorse', x:850,  y:560, freed:false },
  { id:'s2', type:'seahorse', x:1630, y:600, freed:false },
];

/* ─── SVG sprites ─────────────────────────────────────────── */
function DiverSprite({ facingLeft }: { facingLeft: boolean }) {
  return (
    <svg width={DIVER_W} height={DIVER_H} viewBox="0 0 52 64" style={{ transform: facingLeft ? 'scaleX(-1)' : 'none', overflow:'visible' }}>
      <defs>
        <radialGradient id="dhl" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dsh" cx="70%" cy="72%" r="58%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Tank */}
      <rect x="34" y="20" width="10" height="22" rx="5" fill="#64748b" />
      <rect x="34" y="20" width="10" height="22" rx="5" fill="url(#dhl)" />
      {/* Body / wetsuit */}
      <ellipse cx="24" cy="38" rx="13" ry="17" fill="#1e40af" />
      <ellipse cx="24" cy="38" rx="13" ry="17" fill="url(#dhl)" />
      <ellipse cx="24" cy="38" rx="13" ry="17" fill="url(#dsh)" />
      {/* Blue stripe */}
      <rect x="11" y="34" width="26" height="6" rx="3" fill="#2563eb" opacity="0.5" />
      {/* Arms */}
      <ellipse cx="10" cy="35" rx="5" ry="9" fill="#1e40af" />
      <ellipse cx="10" cy="35" rx="5" ry="9" fill="url(#dhl)" />
      <ellipse cx="38" cy="35" rx="5" ry="9" fill="#1e40af" />
      {/* Legs */}
      <ellipse cx="19" cy="54" rx="5" ry="7" fill="#1e40af" />
      <ellipse cx="29" cy="54" rx="5" ry="7" fill="#1e40af" />
      {/* Flippers */}
      <ellipse cx="18" cy="61" rx="8" ry="3.5" fill="#22c55e" />
      <ellipse cx="30" cy="61" rx="8" ry="3.5" fill="#22c55e" />
      {/* Head */}
      <ellipse cx="24" cy="18" rx="14" ry="13" fill="#fde68a" />
      <ellipse cx="24" cy="18" rx="14" ry="13" fill="url(#dhl)" />
      <ellipse cx="24" cy="18" rx="14" ry="13" fill="url(#dsh)" />
      {/* Mask */}
      <rect x="11" y="11" width="26" height="14" rx="6" fill="#0ea5e9" opacity="0.45" />
      <rect x="11" y="11" width="26" height="14" rx="6" fill="none" stroke="#0284c7" strokeWidth="2" />
      {/* Eyes behind mask */}
      <circle cx="19" cy="17" r="4" fill="#1e293b" />
      <circle cx="29" cy="17" r="4" fill="#1e293b" />
      <circle cx="21" cy="15.5" r="1.5" fill="#fff" />
      <circle cx="31" cy="15.5" r="1.5" fill="#fff" />
      {/* Mouth / regulator */}
      <ellipse cx="24" cy="25" rx="4" ry="2.5" fill="#94a3b8" />
      <path d="M26 25 Q30 28 32 26" stroke="#64748b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Specular */}
      <ellipse cx="17" cy="10" rx="5" ry="3" fill="#fff" opacity="0.5" />
      {/* Bubbles */}
      <circle cx="36" cy="18" r="3" fill="none" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.8" />
      <circle cx="40" cy="12" r="2" fill="none" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.6" />
      <circle cx="43" cy="7"  r="1.5" fill="none" stroke="#bae6fd" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function BottleSprite() {
  return (
    <svg width="28" height="40" viewBox="0 0 28 40">
      <rect x="9" y="0" width="10" height="6" rx="3" fill="#86efac" />
      <path d="M5 10 Q3 14 3 20 L3 34 Q3 38 14 38 Q25 38 25 34 L25 20 Q25 14 23 10 Z" fill="#bbf7d0" opacity="0.9" />
      <path d="M5 10 Q3 14 3 20 L3 34 Q3 38 14 38 Q25 38 25 34 L25 20 Q25 14 23 10 Z" fill="none" stroke="#4ade80" strokeWidth="1.5" />
      <ellipse cx="10" cy="18" rx="3" ry="6" fill="#fff" opacity="0.4" />
      <rect x="9" y="6" width="10" height="5" rx="2" fill="#4ade80" />
      {/* Water inside */}
      <path d="M6 26 Q14 22 22 26 L22 34 Q22 37 14 37 Q6 37 6 34 Z" fill="#60a5fa" opacity="0.35" />
    </svg>
  );
}

function BagSprite() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <path d="M6 12 Q4 16 5 20 Q6 28 10 32 Q14 36 18 36 Q22 36 26 32 Q30 28 31 20 Q32 16 30 12 Z" fill="#fde68a" opacity="0.85" />
      <path d="M6 12 Q4 16 5 20 Q6 28 10 32 Q14 36 18 36 Q22 36 26 32 Q30 28 31 20 Q32 16 30 12 Z" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
      {/* Knot */}
      <ellipse cx="18" cy="10" rx="4" ry="3" fill="#fbbf24" />
      <path d="M14 7 Q10 4 12 2 Q15 0 18 4 Q21 0 24 2 Q26 4 22 7" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
      {/* Gloss */}
      <ellipse cx="12" cy="20" rx="3" ry="6" fill="#fff" opacity="0.3" />
      {/* Content shadow */}
      <ellipse cx="18" cy="26" rx="8" ry="4" fill="#fbbf24" opacity="0.3" />
    </svg>
  );
}

function PaperSprite() {
  return (
    <svg width="34" height="32" viewBox="0 0 34 32">
      <path d="M2 6 Q6 2 12 3 L30 5 Q34 6 33 12 L31 26 Q30 31 24 30 L6 28 Q1 27 2 21 Z" fill="#f1f5f9" />
      <path d="M2 6 Q6 2 12 3 L30 5 Q34 6 33 12 L31 26 Q30 31 24 30 L6 28 Q1 27 2 21 Z" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="8" y1="12" x2="26" y2="13" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="8" y1="17" x2="24" y2="18" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="8" y1="22" x2="20" y2="23" stroke="#94a3b8" strokeWidth="1.2" />
      <text x="10" y="10" fontSize="6" fill="#ef4444" fontWeight="bold">TRASH</text>
    </svg>
  );
}

function FishInNetSprite() {
  return (
    <svg width="56" height="44" viewBox="0 0 56 44">
      {/* Net */}
      <rect x="2" y="4" width="52" height="36" rx="6" fill="none" stroke="#ca8a04" strokeWidth="1.5" opacity="0.7" />
      {[0,1,2,3].map(i => <line key={`h${i}`} x1="2" y1={4+i*10} x2="54" y2={4+i*10} stroke="#ca8a04" strokeWidth="1" opacity="0.5" />)}
      {[0,1,2,3,4].map(i => <line key={`v${i}`} x1={2+i*13} y1="4" x2={2+i*13} y2="40" stroke="#ca8a04" strokeWidth="1" opacity="0.5" />)}
      {/* Fish body */}
      <ellipse cx="26" cy="22" rx="16" ry="9" fill="#fb923c" />
      <ellipse cx="26" cy="22" rx="16" ry="9" fill="url(#dhl)" />
      <path d="M42 22 L52 14 L52 30 Z" fill="#fb923c" />
      <ellipse cx="16" cy="20" rx="5" ry="4" fill="#fff" opacity="0.3" />
      <circle cx="14" cy="20" r="3" fill="#1e293b" />
      <circle cx="13" cy="19" r="1" fill="#fff" />
      <path d="M22 18 Q26 14 30 18 M22 26 Q26 30 30 26" stroke="#ea580c" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Distress */}
      <text x="32" y="10" fontSize="8">😰</text>
    </svg>
  );
}

function TurtleInPlasticSprite() {
  return (
    <svg width="60" height="52" viewBox="0 0 60 52">
      {/* Plastic rings */}
      <ellipse cx="28" cy="26" rx="25" ry="16" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 4" opacity="0.8" />
      <ellipse cx="28" cy="26" rx="16" ry="10" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 3" opacity="0.7" />
      {/* Shell */}
      <ellipse cx="28" cy="28" rx="18" ry="14" fill="#16a34a" />
      <ellipse cx="28" cy="28" rx="18" ry="14" fill="url(#dhl)" opacity="0.6" />
      <path d="M14 28 Q28 18 42 28 Q28 38 14 28 Z" fill="#15803d" opacity="0.4" />
      {[[-4,-5],[4,-6],[8,0],[4,6],[-4,5],[-8,0]].map(([dx,dy],i) =>
        <ellipse key={i} cx={28+dx*1.3} cy={28+dy*1.2} rx="5" ry="4" fill="#166534" opacity="0.4" />
      )}
      {/* Head */}
      <ellipse cx="28" cy="14" rx="8" ry="7" fill="#4ade80" />
      <circle cx="25" cy="12" r="2.5" fill="#1e293b" />
      <circle cx="31" cy="12" r="2.5" fill="#1e293b" />
      <circle cx="24" cy="11" r="1" fill="#fff" />
      <circle cx="30" cy="11" r="1" fill="#fff" />
      {/* Legs */}
      {[[-18,30],[-18,20],[44,20],[44,30]].map(([lx,ly],i) =>
        <ellipse key={i} cx={lx} cy={ly} rx="7" ry="4" fill="#4ade80" />
      )}
      <text x="38" y="8" fontSize="8">😣</text>
    </svg>
  );
}

function SeahorseInDebrisSprite() {
  return (
    <svg width="44" height="60" viewBox="0 0 44 60">
      {/* Rope/debris wrapping */}
      <path d="M8 10 Q18 6 30 10 Q38 18 36 30 Q34 42 26 50 Q18 58 10 54 Q2 50 4 38 Q6 26 8 10" fill="none" stroke="#a16207" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
      {/* Seahorse body */}
      <path d="M22 8 Q30 10 32 18 Q34 26 30 32 Q26 38 22 44 Q18 50 14 48 Q10 46 12 40 Q14 36 18 34 Q22 32 24 26 Q26 20 22 14 Z" fill="#f97316" />
      <path d="M22 8 Q30 10 32 18 Q34 26 30 32 Q26 38 22 44 Q18 50 14 48 Q10 46 12 40 Q14 36 18 34 Q22 32 24 26 Q26 20 22 14 Z" fill="url(#dhl)" opacity="0.6" />
      {/* Ridges */}
      {[14,20,26,32,38].map(y =>
        <path key={y} d={`M18 ${y} Q24 ${y-2} 28 ${y}`} fill="none" stroke="#ea580c" strokeWidth="1.5" />
      )}
      {/* Head */}
      <ellipse cx="22" cy="8" rx="9" ry="8" fill="#fb923c" />
      <circle cx="19" cy="6" r="3" fill="#1e293b" />
      <circle cx="18" cy="5" r="1" fill="#fff" />
      {/* Snout */}
      <ellipse cx="28" cy="8" rx="6" ry="2.5" fill="#fed7aa" />
      {/* Crown */}
      <path d="M16 2 L18 -2 L20 2 L22 -2 L24 2" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="28" y="2" fontSize="8">😟</text>
    </svg>
  );
}

/* ─── E-prompt badge ─────────────────────────────────────── */
function EPrompt({ label }: { label: string }) {
  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
      className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-white whitespace-nowrap"
      style={{ background: '#0ea5e9', boxShadow: '0 3px 0 #0284c7,0 4px 12px #0ea5e966' }}>
      <span className="bg-white text-sky-700 rounded px-1.5 py-0.5 text-[11px] font-black">E</span>
      {label}
    </motion.div>
  );
}

/* ─── Freed animal particle ──────────────────────────────── */
function FreedParticle({ x, y }: { x: number; y: number }) {
  return (
    <motion.div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', fontSize: 24, zIndex: 50 }}
      initial={{ y: 0, opacity: 1 }} animate={{ y: -80, opacity: 0 }} transition={{ duration: 1.2 }}>
      ✨🎉
    </motion.div>
  );
}

/* ─── Ocean background ───────────────────────────────────── */
function OceanBackground() {
  const coralPositions = [200,500,900,1300,1700,2100];
  const rockPositions  = [350,700,1100,1500,1900,2250];
  const weedPositions  = Array.from({ length: 18 }, (_, i) => 100 + i * 130);

  return (
    <svg width={WORLD_W} height={WORLD_H} style={{ position:'absolute', top:0, left:0 }}>
      <defs>
        <linearGradient id="oceanBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0ea5e9" />
          <stop offset="40%"  stopColor="#0369a1" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
        <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <radialGradient id="coralHL" cx="30%" cy="25%" r="65%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="blur2"><feGaussianBlur stdDeviation="2" /></filter>
      </defs>

      {/* Ocean water */}
      <rect width={WORLD_W} height={WORLD_H} fill="url(#oceanBg)" />

      {/* Light rays */}
      {[200,600,1000,1400,1800,2200].map((x,i) => (
        <path key={i} d={`M${x} 0 L${x-60} ${WORLD_H} M${x} 0 L${x+60} ${WORLD_H}`}
          stroke="#fff" strokeWidth="20" opacity="0.04" />
      ))}

      {/* Sandy floor */}
      <path d={`M0 ${WORLD_H-120} Q400 ${WORLD_H-140} 800 ${WORLD_H-110} Q1200 ${WORLD_H-130} 1600 ${WORLD_H-115} Q2000 ${WORLD_H-140} ${WORLD_W} ${WORLD_H-120} L${WORLD_W} ${WORLD_H} L0 ${WORLD_H} Z`}
        fill="url(#sandGrad)" />

      {/* Seaweed */}
      {weedPositions.map((x,i) => {
        const h = 60 + (i%3)*30;
        return (
          <path key={i} d={`M${x} ${WORLD_H-120} Q${x-15} ${WORLD_H-120-h/2} ${x} ${WORLD_H-120-h}`}
            stroke="#22c55e" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.75" />
        );
      })}

      {/* Rocks */}
      {rockPositions.map((x,i) => (
        <ellipse key={i} cx={x} cy={WORLD_H-112} rx={20+i%3*8} ry={14+i%2*6} fill="#475569" />
      ))}

      {/* Coral clusters */}
      {coralPositions.map((x,i) => {
        const colors = ['#f43f5e','#fb923c','#a855f7','#ec4899','#f97316','#e11d48'];
        const c = colors[i%colors.length];
        return (
          <g key={i}>
            <ellipse cx={x}    cy={WORLD_H-130} rx="10" ry="22" fill={c} opacity="0.85" />
            <ellipse cx={x+15} cy={WORLD_H-125} rx="8"  ry="18" fill={c} opacity="0.7" />
            <ellipse cx={x-12} cy={WORLD_H-128} rx="9"  ry="20" fill={c} opacity="0.8" />
            <ellipse cx={x}    cy={WORLD_H-130} rx="10" ry="22" fill="url(#coralHL)" />
          </g>
        );
      })}

      {/* Background fish (ambient) */}
      {[400,1000,1600,2100].map((x,i) => (
        <g key={i} opacity="0.25">
          <ellipse cx={x} cy={150+i*40} rx="18" ry="10" fill="#7dd3fc" />
          <path d={`M${x+18} ${150+i*40} L${x+30} ${145+i*40} L${x+30} ${155+i*40} Z`} fill="#7dd3fc" />
        </g>
      ))}

      {/* Bubbles (ambient) */}
      {[300,700,1100,1500,1900].map((x,i) => (
        <g key={i} opacity="0.3">
          <circle cx={x}    cy={80+i*30}  r="5"  fill="none" stroke="#bae6fd" strokeWidth="1.5" />
          <circle cx={x+20} cy={60+i*25}  r="3"  fill="none" stroke="#bae6fd" strokeWidth="1" />
          <circle cx={x+10} cy={100+i*20} r="4"  fill="none" stroke="#bae6fd" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function OceanDiverRPG() {
  const [, setLocation] = useLocation();
  const { completeZone } = useGame();

  const [garbage, setGarbage] = useState<Garbage[]>(INIT_GARBAGE.map(g => ({ ...g })));
  const [animals, setAnimals]  = useState<Animal[]>(INIT_ANIMALS.map(a => ({ ...a })));
  const [particles, setParticles] = useState<{ id: string; x: number; y: number }[]>([]);
  const [nearGarbage, setNearGarbage] = useState<Garbage | null>(null);
  const [nearAnimal,  setNearAnimal]  = useState<Animal | null>(null);
  const [won, setWon] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const posRef   = useRef({ ...SPAWN });
  const keysRef  = useRef<Record<string, boolean>>({});
  const facingRef = useRef(false);
  const rafRef   = useRef<number>(0);
  const worldRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const garbageRef = useRef(garbage);
  const animalsRef = useRef(animals);
  garbageRef.current = garbage;
  animalsRef.current = animals;

  const garbageCollected = garbage.filter(g => g.collected).length;
  const animalsFreed     = animals.filter(a => a.freed).length;
  const totalGarbage     = garbage.length;
  const totalAnimals     = animals.length;

  /* ── Game loop ── */
  const loop = useCallback(() => {
    const keys = keysRef.current;
    const pos  = posRef.current;

    let dx = 0, dy = 0;
    if (keys['ArrowLeft']  || keys['a'] || keys['A']) { dx -= SPEED; facingRef.current = true; }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) { dx += SPEED; facingRef.current = false; }
    if (keys['ArrowUp']    || keys['w'] || keys['W']) dy -= SPEED;
    if (keys['ArrowDown']  || keys['s'] || keys['S']) dy += SPEED;

    if (dx && dy) { const f = 1 / Math.SQRT2; dx *= f; dy *= f; }

    pos.x = Math.max(0, Math.min(WORLD_W - DIVER_W, pos.x + dx));
    pos.y = Math.max(0, Math.min(WORLD_H - DIVER_H, pos.y + dy));

    /* Camera */
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const camX = Math.max(0, Math.min(WORLD_W - vw, pos.x + DIVER_W / 2 - vw / 2));
    const camY = Math.max(0, Math.min(WORLD_H - vh, pos.y + DIVER_H / 2 - vh / 2));

    if (worldRef.current) {
      worldRef.current.style.transform = `translate(${-camX}px,${-camY}px)`;
    }
    if (playerRef.current) {
      playerRef.current.style.left = `${pos.x}px`;
      playerRef.current.style.top  = `${pos.y}px`;
    }

    /* Proximity */
    const cx = pos.x + DIVER_W / 2;
    const cy = pos.y + DIVER_H / 2;

    const closeGarbage = garbageRef.current.find(
      g => !g.collected && Math.hypot(g.x - cx, g.y - cy) < INTERACT_R
    ) ?? null;
    const closeAnimal = animalsRef.current.find(
      a => !a.freed && Math.hypot(a.x - cx, a.y - cy) < INTERACT_R
    ) ?? null;

    setNearGarbage(closeGarbage);
    setNearAnimal(closeAnimal);

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  /* ── Key listeners ── */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if ((e.key === 'e' || e.key === 'E') && !won) {
        const g = nearGarbage;
        const a = nearAnimal;
        if (g) {
          setGarbage(prev => prev.map(item => item.id === g.id ? { ...item, collected: true } : item));
        } else if (a) {
          setAnimals(prev => prev.map(item => item.id === a.id ? { ...item, freed: true } : item));
          setParticles(p => [...p, { id: a.id + Date.now(), x: a.x, y: a.y - 30 }]);
          setTimeout(() => setParticles(p => p.filter(pp => pp.id !== a.id + Date.now())), 1400);
        }
      }
      if (e.key === ' ' || e.key === 'ArrowUp') e.preventDefault();
    };
    const up = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [nearGarbage, nearAnimal, won]);

  /* ── Win condition ── */
  useEffect(() => {
    if (!won && garbageCollected === totalGarbage && animalsFreed === totalAnimals && totalGarbage > 0) {
      setWon(true);
      completeZone('ocean');
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 }, colors: ['#0ea5e9','#22c55e','#f59e0b','#a855f7'] });
    }
  }, [garbageCollected, animalsFreed]);

  /* ── Particle cleanup ── */
  useEffect(() => {
    if (particles.length === 0) return;
    const t = setTimeout(() => setParticles([]), 2000);
    return () => clearTimeout(t);
  }, [particles]);

  const GARBAGE_ICONS: Record<Garbage['type'], string> = { bottle: '🍶', bag: '🛍️', paper: '📰' };
  const ANIMAL_LABELS: Record<Animal['type'], string>   = { fish: 'Free the fish!', turtle: 'Free the turtle!', seahorse: 'Free the seahorse!' };

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0369a1', cursor: 'none' }}>
      {/* World container */}
      <div ref={worldRef} style={{ position: 'absolute', width: WORLD_W, height: WORLD_H, willChange: 'transform' }}>
        <OceanBackground />

        {/* Garbage items */}
        {garbage.map(g => !g.collected && (
          <div key={g.id} style={{ position: 'absolute', left: g.x - 17, top: g.y - 20 }}>
            {g.type === 'bottle' && <BottleSprite />}
            {g.type === 'bag'    && <BagSprite />}
            {g.type === 'paper'  && <PaperSprite />}
          </div>
        ))}

        {/* Trapped animals */}
        {animals.map(a => !a.freed && (
          <div key={a.id} style={{ position: 'absolute', left: a.x - 28, top: a.y - 22 }}>
            {a.type === 'fish'     && <FishInNetSprite />}
            {a.type === 'turtle'   && <TurtleInPlasticSprite />}
            {a.type === 'seahorse' && <SeahorseInDebrisSprite />}
          </div>
        ))}

        {/* Freed particles */}
        {particles.map(p => <FreedParticle key={p.id} x={p.x} y={p.y} />)}

        {/* Diver player */}
        <div ref={playerRef} style={{ position: 'absolute', width: DIVER_W, height: DIVER_H }}>
          <div style={{ position: 'relative' }}>
            <AnimatePresence>
              {nearGarbage && <EPrompt key="g" label={`Pick up ${nearGarbage.type}!`} />}
              {nearAnimal && !nearGarbage && <EPrompt key="a" label={ANIMAL_LABELS[nearAnimal.type]} />}
            </AnimatePresence>
            <DiverSprite facingLeft={facingRef.current} />
          </div>
        </div>
      </div>

      {/* HUD */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
        <div className="rounded-2xl px-4 py-2 text-white text-sm font-bold"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div className="text-sky-300 text-xs mb-1">🤿 SDG 14 – Life Below Water</div>
          <div className="flex gap-4">
            <span>🗑️ Garbage: <b className="text-yellow-300">{garbageCollected}/{totalGarbage}</b></span>
            <span>🐠 Animals: <b className="text-green-300">{animalsFreed}/{totalAnimals}</b></span>
          </div>
        </div>
        <button onClick={() => setLocation('/world')}
          className="rounded-xl px-3 py-1.5 text-sm font-bold text-white transition-all"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          ← World Map
        </button>
      </div>

      {/* Controls tip */}
      <div className="absolute top-4 right-4 rounded-2xl px-4 py-2 text-xs text-white/80 z-20"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="font-bold mb-1 text-white">🎮 Controls</div>
        <div>WASD / Arrows — swim</div>
        <div>E — collect / free</div>
      </div>

      {/* Intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center"
            style={{ background: 'rgba(3,105,161,0.85)', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full mx-4 rounded-3xl p-8 text-center text-white"
              style={{ background: 'rgba(14,165,233,0.25)', border: '2px solid rgba(255,255,255,0.25)' }}>
              <div className="text-6xl mb-4">🤿</div>
              <h2 className="text-3xl font-display mb-2">Ocean Rescue!</h2>
              <p className="text-sky-200 text-sm mb-6 leading-relaxed">
                Our ocean is filled with garbage and trapped animals! Swim around, collect all the waste (bottles, bags, papers) and free the animals stuck in nets and plastic by pressing <b className="text-white">E</b>.
              </p>
              <div className="flex gap-3 text-sm text-sky-200 mb-6 justify-center flex-wrap">
                <span>🍶 5 Bottles</span>
                <span>🛍️ 5 Bags</span>
                <span>📰 5 Papers</span>
                <span>🐟 Fish × 3</span>
                <span>🐢 Turtles × 2</span>
                <span>🦄 Seahorses × 2</span>
              </div>
              <button onClick={() => setShowIntro(false)}
                className="w-full py-4 rounded-2xl text-white font-display text-xl font-bold"
                style={{ background: '#0ea5e9', boxShadow: '0 4px 0 #0284c7' }}>
                🌊 Dive In!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win overlay */}
      <AnimatePresence>
        {won && (
          <motion.div key="win" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center"
            style={{ background: 'rgba(3,105,161,0.8)', backdropFilter: 'blur(6px)' }}>
            <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full mx-4 rounded-3xl p-8 text-center text-white"
              style={{ background: 'rgba(14,165,233,0.3)', border: '2px solid rgba(255,255,255,0.3)' }}>
              <motion.div animate={{ y: [0,-15,0], rotate:[0,-5,5,-5,0] }} transition={{ repeat: Infinity, duration: 2.5 }}
                className="text-7xl mb-4">🏆</motion.div>
              <h2 className="font-display text-4xl mb-2">Ocean Healed!</h2>
              <p className="text-sky-200 mb-4">You collected {totalGarbage} pieces of garbage and freed {totalAnimals} ocean animals!</p>
              <div className="bg-white/10 rounded-2xl p-4 mb-6 text-sm text-sky-100 leading-relaxed">
                Every year, 8 million tonnes of plastic enter our oceans. Marine animals mistake plastic for food — your actions today represent real impact for millions of sea creatures!
              </div>
              <button onClick={() => setLocation('/world')}
                className="w-full py-4 rounded-2xl text-white font-display text-xl font-bold"
                style={{ background: '#22c55e', boxShadow: '0 4px 0 #15803d' }}>
                🌟 Return to World!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
