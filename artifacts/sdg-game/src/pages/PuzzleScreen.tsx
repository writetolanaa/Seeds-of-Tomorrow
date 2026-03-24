import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useGame } from '@/context/GameContext';
import { ZONES, type ZoneId } from '@/data/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import {
  NPC_LeeFather, NPC_LeeMom, NPC_GrandmaRosa, NPC_YoungMaya, NPC_BakerHelper,
  NPC_HouseKeeper, NPC_Trainer, NPC_FarmerAli, NPC_CitizenMia, NPC_CitizenTom,
  NPC_MrBun, NPC_LittleZoe, NPC_GrandpaJoe, NPC_DoctorLeaf,
  NPC_StudentSam, NPC_StudentAria, NPC_StudentLeo, NPC_TeacherThinklet,
  NPC_Girl, NPC_Worker, NPC_Sibling, NPC_Advocate,
} from '@/components/Sprites';

function triggerConfetti() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#FFD700','#FF6B6B','#4CAF50','#2196F3','#FF9800'] });
}

/* ── stat bar ── */
function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-bold mb-0.5">
        <span className="text-gray-600">{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }} animate={{ width: `${value}%` }} transition={{ duration: 0.6 }} />
      </div>
    </div>
  );
}

/* ── hint box ── */
function HintBox({ text, color = '#F59E0B' }: { text: string; color?: string }) {
  return (
    <div className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-center border-2" style={{ background: color + '18', borderColor: color + '66', color: '#374151' }}>
      {text}
    </div>
  );
}

/* ── token chip ── */
function TokenChip({ count, max }: { count: number; max: number }) {
  return (
    <div className="flex gap-1 flex-wrap justify-center">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={cn('w-6 h-6 rounded-full border-2 text-xs flex items-center justify-center font-bold transition-all',
          i < count ? 'bg-yellow-400 border-yellow-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-300'
        )}>{i < count ? '🪙' : ''}</div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SDG 1 – No Poverty: Community Helper
   Two-phase RPG chapter: Emergency Aid → Long-term Development
   Based on UN SDG 1 design principles
═══════════════════════════════════════════════════════════════ */

type VillagerState = 'struggling' | 'surviving' | 'thriving';

type Villager = {
  id: number;
  Sprite: React.FC;
  name: string;
  story: string;
  food: number;
  health: number;
  income: number;
  education: number;
  housing: number;
  state: VillagerState;
  helpedThisRound: string[];
};

const INITIAL_VILLAGERS: Villager[] = [
  { id: 1, Sprite: NPC_LeeFather, name: 'Papa Kofi', story: 'Lost his job, family is hungry', food: 15, health: 25, income: 10, education: 20, housing: 50, state: 'struggling', helpedThisRound: [] },
  { id: 2, Sprite: NPC_LeeMom, name: 'Amara', story: 'Single mom, leaking roof, no income', food: 30, health: 45, income: 15, education: 35, housing: 15, state: 'struggling', helpedThisRound: [] },
  { id: 3, Sprite: NPC_YoungMaya, name: 'Teen Jada', story: 'Dropped out of school, no skills', food: 50, health: 60, income: 5, education: 10, housing: 40, state: 'surviving', helpedThisRound: [] },
  { id: 4, Sprite: NPC_GrandmaRosa, name: 'Elder Rosa', story: 'No pension, health declining', food: 35, health: 20, income: 20, education: 30, housing: 45, state: 'struggling', helpedThisRound: [] },
];

const getState = (v: Villager): VillagerState => {
  if (v.food < 40 || v.health < 40) return 'struggling';
  if (v.income >= 55 && v.education >= 55 && v.housing >= 55) return 'thriving';
  return 'surviving';
};

const communityStability = (vs: Villager[]) => {
  const scores = vs.map(v => {
    const s = getState(v);
    if (s === 'thriving') return 100;
    if (s === 'surviving') return 50;
    return 0;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / vs.length);
};

const EMERGENCY_ACTIONS = [
  { id: 'food', emoji: '🍚', label: 'Food Pack', desc: 'Food +45', cost: 1, apply: (v: Villager) => ({ ...v, food: Math.min(100, v.food + 45) }) },
  { id: 'medicine', emoji: '💊', label: 'Medicine', desc: 'Health +40', cost: 1, apply: (v: Villager) => ({ ...v, health: Math.min(100, v.health + 40) }) },
  { id: 'shelter', emoji: '⛺', label: 'Temp Shelter', desc: 'Housing +30', cost: 1, apply: (v: Villager) => ({ ...v, housing: Math.min(100, v.housing + 30) }) },
];

const DEVELOPMENT_ACTIONS = [
  { id: 'job', emoji: '💼', label: 'Job Training', desc: 'Income +50, Edu +20', cost: 2, requiresBasics: false, apply: (v: Villager) => ({ ...v, income: Math.min(100, v.income + 50), education: Math.min(100, v.education + 20) }) },
  { id: 'school', emoji: '📚', label: 'School Enroll', desc: 'Education +55, Income +15', cost: 1, requiresBasics: false, apply: (v: Villager) => ({ ...v, education: Math.min(100, v.education + 55), income: Math.min(100, v.income + 15) }) },
  { id: 'housing', emoji: '🏠', label: 'Fix Housing', desc: 'Housing +50', cost: 1, requiresBasics: false, apply: (v: Villager) => ({ ...v, housing: Math.min(100, v.housing + 50) }) },
  { id: 'micro', emoji: '🌱', label: 'Microfinance', desc: 'Income +60', cost: 2, requiresBasics: false, apply: (v: Villager) => ({ ...v, income: Math.min(100, v.income + 60) }) },
];

const COMMUNITY_EVENTS = [
  { text: '🏭 A community factory opened! All employed villagers earn +10 income.', apply: (vs: Villager[]) => vs.map(v => ({ ...v, income: getState(v) !== 'struggling' && v.income > 30 ? Math.min(100, v.income + 10) : v.income })) },
  { text: '⚡ Power outage! Housing suffers -15 for struggling families.', apply: (vs: Villager[]) => vs.map(v => ({ ...v, housing: getState(v) === 'struggling' ? Math.max(0, v.housing - 15) : v.housing })) },
  { text: '🏫 Free community class! Educated villagers gain +10 more education.', apply: (vs: Villager[]) => vs.map(v => ({ ...v, education: v.education >= 40 ? Math.min(100, v.education + 10) : v.education })) },
];

const STATE_LABEL: Record<VillagerState, { emoji: string; label: string; color: string; bg: string }> = {
  struggling: { emoji: '😢', label: 'Struggling', color: '#EF4444', bg: '#FEF2F2' },
  surviving:  { emoji: '😐', label: 'Surviving',  color: '#F59E0B', bg: '#FFFBEB' },
  thriving:   { emoji: '😊', label: 'Thriving',   color: '#10B981', bg: '#F0FDF4' },
};

const PovertyPuzzle = ({ onWin }: { onWin: () => void }) => {
  const TOTAL_BUDGET = 18;
  const [villagers, setVillagers] = useState<Villager[]>(INITIAL_VILLAGERS.map(v => ({ ...v })));
  const [budget, setBudget] = useState(TOTAL_BUDGET);
  const [phase, setPhase] = useState<'emergency' | 'develop' | 'event' | 'final'>('emergency');
  const [round, setRound] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: 'info' | 'warn' | 'ok' | 'locked' }>({ text: 'PHASE 1: Emergency Aid — give food & medicine to everyone! You have 18 🪙. Select a villager, then pick an action.', type: 'info' });
  const [eventText, setEventText] = useState('');

  const vs = villagers.map(v => ({ ...v, state: getState(v) }));
  const stability = communityStability(vs);

  const applyEmergency = (actionId: string) => {
    if (selected === null) { setMsg({ text: '👆 Select a villager card first!', type: 'warn' }); return; }
    const action = EMERGENCY_ACTIONS.find(a => a.id === actionId)!;
    if (budget < action.cost) { setMsg({ text: `❌ Not enough tokens! Need ${action.cost} 🪙`, type: 'warn' }); return; }
    const v = villagers.find(v => v.id === selected)!;
    if (v.helpedThisRound.includes(actionId)) { setMsg({ text: `Already gave ${action.label} to ${v.name} this round!`, type: 'warn' }); return; }
    setVillagers(prev => prev.map(p => p.id === selected ? { ...action.apply(p), helpedThisRound: [...p.helpedThisRound, actionId] } : p));
    setBudget(b => b - action.cost);
    setSelected(null);
    setMsg({ text: `✅ Gave ${action.label} to ${v.name}! ${budget - action.cost} tokens left.`, type: 'ok' });
  };

  const applyDevelopment = (actionId: string) => {
    if (selected === null) { setMsg({ text: '👆 Select a villager card first!', type: 'warn' }); return; }
    const action = DEVELOPMENT_ACTIONS.find(a => a.id === actionId)!;
    if (budget < action.cost) { setMsg({ text: `❌ Not enough tokens! Need ${action.cost} 🪙`, type: 'warn' }); return; }
    const v = villagers.find(v => v.id === selected)!;
    const vState = getState(v);
    if (action.requiresBasics && vState === 'struggling') {
      setMsg({ text: `🔒 ${v.name} can't focus on ${action.label} while hungry or sick! Help their basic needs first.`, type: 'locked' });
      return;
    }
    if (v.helpedThisRound.includes(actionId)) { setMsg({ text: `Already applied ${action.label} to ${v.name} this round!`, type: 'warn' }); return; }
    setVillagers(prev => prev.map(p => p.id === selected ? { ...action.apply(p), helpedThisRound: [...p.helpedThisRound, actionId] } : p));
    setBudget(b => b - action.cost);
    setSelected(null);
    setMsg({ text: `✅ ${action.label} for ${v.name}! ${budget - action.cost} tokens left.`, type: 'ok' });
  };

  const advancePhase = () => {
    if (phase === 'emergency') {
      // Community effect: employed villagers inspire others
      const employedCount = vs.filter(v => v.income > 40).length;
      setVillagers(prev => prev.map(v => ({
        ...v, helpedThisRound: [],
        food: employedCount >= 2 ? Math.min(100, v.food + 5) : v.food,
      })));
      setBudget(TOTAL_BUDGET);
      setPhase('develop');
      setSelected(null);
      setMsg({ text: 'PHASE 2: Long-term Development — give everyone jobs, school, and fix housing! 18 🪙 fresh budget. Each person needs all three to thrive!', type: 'info' });
    } else if (phase === 'develop') {
      const ev = COMMUNITY_EVENTS[Math.floor(Math.random() * COMMUNITY_EVENTS.length)];
      setEventText(ev.text);
      setVillagers(ev.apply);
      setPhase('event');
    }
  };

  const finishRound = () => {
    const updatedVs = villagers.map(v => ({ ...v, state: getState(v) }));
    const stab = communityStability(updatedVs);
    setPhase('final');
    if (stab >= 50) setTimeout(onWin, 800);
  };

  const MSG_COLORS = { info: '#3B82F6', warn: '#F59E0B', ok: '#10B981', locked: '#EF4444' };

  const resetGame = () => {
    setVillagers(INITIAL_VILLAGERS.map(v => ({ ...v })));
    setBudget(TOTAL_BUDGET);
    setPhase('emergency');
    setRound(1);
    setSelected(null);
    setMsg({ text: 'PHASE 1: Emergency Aid — food and medicine first!', type: 'info' });
  };

  /* ── EVENT SCREEN ── */
  if (phase === 'event') return (
    <div className="flex flex-col items-center gap-5 text-center max-w-md mx-auto">
      <div className="text-5xl">📰</div>
      <h3 className="font-display text-xl text-orange-700">Community Event!</h3>
      <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4 text-sm font-medium text-gray-700 leading-relaxed">{eventText}</div>
      <div className="w-full bg-white rounded-2xl border-2 border-green-200 p-4">
        <p className="text-xs font-bold text-gray-500 mb-2">COMMUNITY STABILITY</p>
        <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #F59E0B, #10B981)' }} animate={{ width: `${stability}%` }} />
        </div>
        <p className="text-sm font-bold text-gray-700 mt-1">{stability}% stable</p>
      </div>
      <button onClick={finishRound} className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition-colors">
        See Final Results →
      </button>
    </div>
  );

  /* ── FINAL SCREEN ── */
  if (phase === 'final') {
    const won = stability >= 50;
    const updatedVs = villagers.map(v => ({ ...v, state: getState(v) }));
    const thrivingCount = updatedVs.filter(v => v.state === 'thriving').length;
    const onlyShortTerm = updatedVs.every(v => v.income < 40 && v.education < 40);
    return (
      <div className="flex flex-col items-center gap-4 text-center max-w-md mx-auto">
        {won ? (
          <>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-6xl">🏘️</motion.div>
            <h3 className="font-display text-2xl text-green-700">Village is Thriving!</h3>
            <p className="text-sm text-gray-600"><strong>{thrivingCount}/4</strong> villagers reached stability. Community Stability: <strong>{stability}%</strong></p>
          </>
        ) : (
          <>
            <div className="text-5xl">😔</div>
            <h3 className="font-display text-xl text-red-700">Still Struggling... ({stability}% stability)</h3>
            {onlyShortTerm
              ? <p className="text-sm text-amber-700 bg-amber-50 rounded-xl p-3 border border-amber-200">💡 You kept people alive, but long-term development is what ends poverty. In Phase 2, give everyone Job Training + School + Fix Housing!</p>
              : <p className="text-sm text-gray-600">💡 Tip: In Phase 2, give <b>every</b> villager Job Training (💼), School (📚), and Fix Housing (🏠) — each costs just 1-2 🪙!</p>
            }
            <button onClick={resetGame} className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl mt-1 hover:bg-orange-600">↩ Try Again</button>
          </>
        )}
        <div className="w-full space-y-2 mt-2">
          {updatedVs.map(v => {
            const s = STATE_LABEL[v.state];
            return (
              <div key={v.id} className="flex items-center gap-3 rounded-xl border p-2.5 text-left" style={{ background: s.bg }}>
                <div className="w-9 h-11 shrink-0"><v.Sprite /></div>
                <div className="flex-1">
                  <p className="font-bold text-xs">{v.name}</p>
                  <p className="text-[10px] text-gray-500">{v.story}</p>
                </div>
                <div className="text-right">
                  <p className="text-base">{s.emoji}</p>
                  <p className="text-[10px] font-bold" style={{ color: s.color }}>{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── MAIN GAMEPLAY ── */
  const isEmergency = phase === 'emergency';
  const activeActions = isEmergency ? EMERGENCY_ACTIONS : DEVELOPMENT_ACTIONS;
  const selectedVillager = selected !== null ? vs.find(v => v.id === selected) : null;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className={cn('px-3 py-1.5 rounded-xl text-sm font-bold border', isEmergency ? 'bg-red-50 border-red-300 text-red-700' : 'bg-blue-50 border-blue-300 text-blue-700')}>
          {isEmergency ? '🚨 Phase 1: Emergency Aid' : '🌱 Phase 2: Development'}
        </div>
        <div className="flex flex-col items-center">
          <TokenChip count={budget} max={TOTAL_BUDGET} />
          <p className="text-[10px] text-gray-500 mt-0.5">{budget} tokens left</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-1.5 text-sm font-bold text-green-700">
          🏘️ {stability}% stable
        </div>
      </div>

      {/* Community stability bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #EF4444, #F59E0B, #10B981)' }} animate={{ width: `${stability}%` }} transition={{ duration: 0.8 }} />
      </div>

      {/* Message */}
      <div className="w-full px-4 py-2 rounded-xl text-xs font-semibold border-2 leading-relaxed"
        style={{ background: MSG_COLORS[msg.type] + '15', borderColor: MSG_COLORS[msg.type] + '55', color: '#374151' }}>
        {msg.text}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap justify-center">
        {(activeActions as Array<{ id: string; emoji: string; label: string; desc: string; cost: number; requiresBasics?: boolean }>).map(a => {
          return (
            <motion.button key={a.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={() => isEmergency ? applyEmergency(a.id) : applyDevelopment(a.id)}
              disabled={budget < a.cost}
              className={cn('flex flex-col items-center px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all min-w-[80px]',
                budget >= a.cost ? 'bg-white border-amber-400 hover:bg-amber-50 cursor-pointer' : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              <span className="text-xl">{a.emoji}</span>
              <span className="leading-tight">{a.label}</span>
              <span className="text-gray-400 font-normal text-[10px]">{a.desc}</span>
              <span className="text-amber-600 mt-0.5">{a.cost} 🪙</span>
            </motion.button>
          );
        })}
      </div>

      {/* Villager cards */}
      <div className="grid grid-cols-2 gap-2">
        {vs.map(v => {
          const s = STATE_LABEL[v.state];
          return (
            <motion.div key={v.id} whileHover={{ scale: 1.02 }}
              onClick={() => { setSelected(v.id); setMsg({ text: `Selected ${v.name}! Now pick an action above.`, type: 'info' }); }}
              className={cn('rounded-2xl border-2 p-3 cursor-pointer transition-all',
                selected === v.id ? 'border-amber-500 shadow-lg' : 'border-gray-200 hover:border-amber-300'
              )}
              style={{ background: selected === v.id ? '#FFFBEB' : s.bg }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-11 shrink-0"><v.Sprite /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[11px] leading-tight truncate">{v.name}</p>
                  <p className="text-[9px] text-gray-500 leading-tight">{v.story}</p>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5" style={{ background: s.color + '20', color: s.color }}>
                    {s.emoji} {s.label}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <StatBar label="🍚 Food" value={v.food} color="#F59E0B" />
                <StatBar label="💊 Health" value={v.health} color="#EF4444" />
                <StatBar label="💰 Income" value={v.income} color="#8B5CF6" />
                {!isEmergency && <StatBar label="📚 Education" value={v.education} color="#3B82F6" />}
                {!isEmergency && <StatBar label="🏠 Housing" value={v.housing} color="#10B981" />}
              </div>
              {v.helpedThisRound.length > 0 && (
                <div className="mt-1.5 flex gap-1 flex-wrap">
                  {v.helpedThisRound.map(a => <span key={a} className="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">✓ {a}</span>)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={advancePhase}
        className={cn('w-full py-3 font-bold rounded-xl shadow-md transition-colors text-white',
          isEmergency ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
        )}
      >
        {isEmergency ? '✅ Done with Emergency Aid → Move to Development' : '🎯 Apply Investments & See Community Impact'}
      </motion.button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SDG 2 – Zero Hunger: Grow & Serve
   Farm plots → grow → harvest → feed citizens
═══════════════════════════════════════════════════════════════ */
type Plot = { id: number; crop: string | null; stage: number; watered: number };
type Citizen2 = { id: number; Sprite: React.FC; name: string; wants: string; hunger: number; fed: boolean };

const CROPS = [
  { id: 'carrot', emoji: '🥕', name: 'Carrot', waterNeeded: 2 },
  { id: 'tomato', emoji: '🍅', name: 'Tomato', waterNeeded: 3 },
  { id: 'corn',   emoji: '🌽', name: 'Corn',   waterNeeded: 2 },
  { id: 'potato', emoji: '🥔', name: 'Potato', waterNeeded: 2 },
];

const HungerPuzzle = ({ onWin }: { onWin: () => void }) => {
  const [plots, setPlots] = useState<Plot[]>(Array.from({ length: 6 }, (_, i) => ({ id: i, crop: null, stage: 0, watered: 0 })));
  const [seed, setSeed] = useState<string | null>(null);
  const [harvest, setHarvest] = useState<Record<string, number>>({});
  const [citizens, setCitizens] = useState<Citizen2[]>([
    { id: 1, Sprite: NPC_CitizenMia,  name: 'Mia',  wants: 'carrot', hunger: 85, fed: false },
    { id: 2, Sprite: NPC_FarmerAli,   name: 'Ali',  wants: 'tomato', hunger: 90, fed: false },
    { id: 3, Sprite: NPC_CitizenTom,  name: 'Tom',  wants: 'corn',   hunger: 75, fed: false },
    { id: 4, Sprite: NPC_LeeMom,      name: 'Lily', wants: 'potato', hunger: 80, fed: false },
  ]);
  const [selectedHarvest, setSelectedHarvest] = useState<string | null>(null);
  const [phase, setPhase] = useState<'farm' | 'serve'>('farm');
  const [waste, setWaste] = useState(0);
  const [hint, setHint] = useState('Pick a seed type, then click an empty plot to plant!');

  const totalHarvested = Object.values(harvest).reduce((s, n) => s + n, 0);
  const fedAll = citizens.every(c => c.fed);

  // Hunger timer
  useEffect(() => {
    if (phase !== 'serve') return;
    const t = setInterval(() => {
      setCitizens(prev => prev.map(c => c.fed ? c : { ...c, hunger: Math.min(100, c.hunger + 2) }));
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => { if (fedAll) setTimeout(onWin, 700); }, [fedAll]);

  const plotCrop = (pid: number) => {
    if (!seed) { setHint('👆 First pick a seed type below!'); return; }
    setPlots(prev => prev.map(p => p.id === pid && !p.crop ? { ...p, crop: seed, stage: 1, watered: 0 } : p));
    setHint(`Planted! Now click 💧 to water it until it's ready.`);
  };

  const waterPlot = (pid: number) => {
    setPlots(prev => prev.map(p => {
      if (p.id !== pid || !p.crop || p.stage === 3) return p;
      const crop = CROPS.find(c => c.id === p.crop)!;
      const nw = p.watered + 1;
      const ns = nw >= crop.waterNeeded ? 3 : nw >= 1 ? 2 : 1;
      if (ns === 3 && p.stage < 3) setHint(`🌟 ${crop.name} is ready to harvest! Click it!`);
      return { ...p, watered: nw, stage: ns };
    }));
  };

  const harvestPlot = (pid: number) => {
    const p = plots.find(pl => pl.id === pid)!;
    if (p.stage < 3) { setHint('Not ready yet! Keep watering 💧'); return; }
    const crop = CROPS.find(c => c.id === p.crop)!;
    setHarvest(h => ({ ...h, [p.crop!]: (h[p.crop!] ?? 0) + 1 }));
    setPlots(prev => prev.map(pl => pl.id === pid ? { id: pid, crop: null, stage: 0, watered: 0 } : pl));
    setHint(`Harvested ${crop.emoji} ${crop.name}! Check your basket →`);

    const allReady = citizens.every(c => (harvest[c.wants] ?? 0) + (c.wants === p.crop ? 1 : 0) >= 1);
    if (allReady) { setTimeout(() => { setPhase('serve'); setHint('All needed crops harvested! Now feed the hungry citizens!'); }, 300); }
  };

  const feedCitizen = (cid: number, wants: string) => {
    if (!selectedHarvest) { setHint('Pick a food from your basket first!'); return; }
    if (selectedHarvest !== wants) {
      const crop = CROPS.find(c => c.id === selectedHarvest)!;
      const wantedCrop = CROPS.find(c => c.id === wants)!;
      setWaste(w => w + 1);
      setHint(`❌ They want ${wantedCrop.emoji} not ${crop.emoji}! Wasted food increases hunger globally.`);
      setHarvest(h => ({ ...h, [selectedHarvest]: Math.max(0, (h[selectedHarvest] ?? 0) - 1) }));
      setSelectedHarvest(null);
      return;
    }
    setCitizens(prev => prev.map(c => c.id === cid ? { ...c, fed: true, hunger: 0 } : c));
    setHarvest(h => ({ ...h, [selectedHarvest]: Math.max(0, (h[selectedHarvest] ?? 0) - 1) }));
    setSelectedHarvest(null);
    const c = citizens.find(ci => ci.id === cid)!;
    setHint(`🎉 ${c.name} is happy! Keep feeding!`);
  };

  const stageEmoji = (p: Plot) => {
    if (!p.crop) return '🟫';
    if (p.stage === 1) return '🌱';
    if (p.stage === 2) return '🌿';
    const crop = CROPS.find(c => c.id === p.crop)!;
    return crop.emoji;
  };

  if (phase === 'serve') return (
    <div className="flex flex-col gap-4 w-full">
      <HintBox text={hint} />
      {waste > 0 && <div className="text-xs text-center text-red-600 font-bold">🗑️ Food wasted: {waste} portions — better crop matching reduces waste!</div>}

      {/* Basket */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide text-center mb-2">🧺 Your Harvest Basket</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {CROPS.map(c => (
            (harvest[c.id] ?? 0) > 0 && (
              <motion.button key={c.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedHarvest(selectedHarvest === c.id ? null : c.id)}
                className={cn('px-4 py-3 rounded-2xl border-2 flex flex-col items-center gap-1 font-bold text-sm transition-all',
                  selectedHarvest === c.id ? 'border-green-500 bg-green-50 shadow-lg scale-105' : 'border-gray-300 bg-white hover:border-green-400'
                )}
              >
                <span className="text-3xl">{c.emoji}</span>
                <span>{c.name}</span>
                <span className="text-xs text-gray-500">×{harvest[c.id]}</span>
              </motion.button>
            )
          ))}
        </div>
      </div>

      {/* Citizens */}
      <div className="grid grid-cols-2 gap-3">
        {citizens.map(c => (
          <motion.div key={c.id} whileHover={!c.fed ? { scale: 1.03 } : {}} onClick={() => !c.fed && feedCitizen(c.id, c.wants)}
            className={cn('bg-white rounded-2xl border-2 p-3 text-center cursor-pointer transition-all',
              c.fed ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-amber-400'
            )}
          >
            <div className="w-14 h-14 mx-auto"><c.Sprite /></div>
            <p className="font-bold text-sm mt-1">{c.name}</p>
            {c.fed ? (
              <p className="text-green-600 font-bold text-sm">😊 Full & happy!</p>
            ) : (
              <>
                <p className="text-xs text-gray-500">Wants: {CROPS.find(cr => cr.id === c.wants)?.emoji} {CROPS.find(cr => cr.id === c.wants)?.name}</p>
                <StatBar label="Hunger" value={c.hunger} color={c.hunger > 80 ? '#EF4444' : '#F59E0B'} />
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <HintBox text={hint} />

      {/* Seed selector */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide text-center mb-2">🌾 Choose a Seed</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {CROPS.map(c => (
            <motion.button key={c.id} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => { setSeed(c.id); setHint(`${c.emoji} ${c.name} selected! Click an empty 🟫 plot to plant.`); }}
              className={cn('flex flex-col items-center px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all',
                seed === c.id ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-300 bg-white hover:border-green-400'
              )}
            >
              <span className="text-2xl">{c.emoji}</span>
              <span>{c.name}</span>
              <span className="text-gray-400">💧×{c.waterNeeded}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Farm grid */}
      <div className="grid grid-cols-3 gap-3">
        {plots.map(p => (
          <div key={p.id} className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 flex flex-col items-center gap-2">
            <motion.div className="text-4xl cursor-pointer" whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (!p.crop) plotCrop(p.id);
                else if (p.stage === 3) harvestPlot(p.id);
              }}
            >
              {stageEmoji(p)}
            </motion.div>
            {p.crop && p.stage < 3 && (
              <motion.button whileHover={{ scale: 1.2, rotate: -15 }} whileTap={{ scale: 0.85 }}
                onClick={() => waterPlot(p.id)} className="text-2xl cursor-pointer"
              >💧</motion.button>
            )}
            {p.crop && (
              <div className="flex gap-0.5">
                {Array.from({ length: CROPS.find(c => c.id === p.crop)!.waterNeeded }).map((_, i) => (
                  <div key={i} className={cn('w-3 h-3 rounded-full border', i < p.watered ? 'bg-blue-400 border-blue-500' : 'bg-gray-100 border-gray-300')} />
                ))}
              </div>
            )}
            {p.stage === 3 && <p className="text-[10px] font-bold text-green-600 animate-pulse">Tap to harvest!</p>}
          </div>
        ))}
      </div>

      {/* Needed crops */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <p className="text-xs font-bold text-blue-800 mb-2">Citizens need:</p>
        <div className="flex gap-3 flex-wrap">
          {citizens.map(c => {
            const crop = CROPS.find(cr => cr.id === c.wants)!;
            const available = (harvest[c.wants] ?? 0) > 0;
            return (
              <span key={c.id} className={cn('text-xs px-2 py-1 rounded-full font-bold', available ? 'bg-green-200 text-green-800' : 'bg-blue-100 text-blue-700')}>
                {c.name}: {crop.emoji} {available ? '✓' : ''}
              </span>
            );
          })}
        </div>
      </div>

      {totalHarvested > 0 && (
        <div className="text-xs text-center text-green-700 font-bold">
          🧺 Basket: {Object.entries(harvest).filter(([,v]) => v > 0).map(([k, v]) => `${CROPS.find(c => c.id === k)?.emoji}×${v}`).join('  ')}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SDG 3 – Good Health: Oops! Hospital!
   Manage patients, resources, and treatments
═══════════════════════════════════════════════════════════════ */
type Patient = {
  id: number; Sprite: React.FC; name: string; age: number;
  issue: string; issueType: string; health: number;
  needs: string; recovery: number; admitted: boolean; treated: boolean; cured: boolean;
};
type Hospital = { beds: number; medicine: number; counselors: number; reputation: number };

const HealthPuzzle = ({ onWin }: { onWin: () => void }) => {
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, Sprite: NPC_MrBun,     name: 'Mr. Bun',  age: 42, issue: 'Overeating & poor diet 🍔',       issueType: 'diet',    health: 30, needs: 'diet',     recovery: 0, admitted: false, treated: false, cured: false },
    { id: 2, Sprite: NPC_LittleZoe, name: 'Zoe',       age: 9,  issue: 'Stress & anxiety 😰',              issueType: 'stress',  health: 40, needs: 'counsel',  recovery: 0, admitted: false, treated: false, cured: false },
    { id: 3, Sprite: NPC_GrandpaJoe,name: 'Grandpa J', age: 71, issue: 'Breathing problems 🫁',            issueType: 'lung',    health: 20, needs: 'medicine', recovery: 0, admitted: false, treated: false, cured: false },
    { id: 4, Sprite: NPC_YoungMaya, name: 'Maya',      age: 17, issue: 'Sports injury, needs rest 🦵',    issueType: 'injury',  health: 50, needs: 'rest',     recovery: 0, admitted: false, treated: false, cured: false },
  ]);
  const [hospital, setHospital] = useState<Hospital>({ beds: 3, medicine: 4, counselors: 2, reputation: 60 });
  const [selected, setSelected] = useState<number | null>(null);
  const [event, setEvent] = useState<string | null>(null);
  const [day, setDay] = useState(1);
  const [hint, setHint] = useState('Click "Admit" to bring in a patient, then assign the right treatment!');
  const [phase, setPhase] = useState<'manage' | 'results'>('manage');

  const TREATMENTS = [
    { id: 'diet',    label: '🥗 Diet Plan',    desc: 'Best for overeating/obesity',   cost: { medicine: 0, beds: 0, counselors: 0 } },
    { id: 'medicine',label: '💊 Medicine',     desc: 'Best for infections/breathing', cost: { medicine: 1, beds: 0, counselors: 0 } },
    { id: 'rest',    label: '🛌 Rest & Rehab', desc: 'Best for injuries/fatigue',     cost: { medicine: 0, beds: 1, counselors: 0 } },
    { id: 'counsel', label: '🧠 Counseling',   desc: 'Best for stress/mental health', cost: { medicine: 0, beds: 0, counselors: 1 } },
    { id: 'exercise',label: '🏃 Exercise',     desc: 'Good for general wellness',     cost: { medicine: 0, beds: 0, counselors: 0 } },
  ];

  const RANDOM_EVENTS = [
    '⚡ Flu season! All untreated patients lose -10 health.',
    '🌞 Health awareness campaign! Reputation +15.',
    '🏥 Supply donation! +2 medicine received.',
  ];

  const admitPatient = (pid: number) => {
    const p = patients.find(pt => pt.id === pid)!;
    if (p.admitted) return;
    if (hospital.beds <= 0) { setHint('❌ No beds available! Discharge a cured patient first.'); return; }
    setPatients(prev => prev.map(pt => pt.id === pid ? { ...pt, admitted: true } : pt));
    setHospital(h => ({ ...h, beds: h.beds - 1 }));
    setHint(`${p.name} admitted. Pick the right treatment!`);
    setSelected(pid);
  };

  const applyTreatment = (pid: number, tid: string) => {
    const p = patients.find(pt => pt.id === pid)!;
    const t = TREATMENTS.find(tr => tr.id === tid)!;

    if (t.cost.medicine > hospital.medicine) { setHint('❌ Not enough medicine in stock!'); return; }
    if (t.cost.beds > 0 && hospital.beds < 0) { setHint('❌ No beds available!'); return; }
    if (t.cost.counselors > hospital.counselors) { setHint('❌ No counselors available!'); return; }

    const correct = tid === p.needs;
    const healthGain = correct ? 55 : 20;
    const repChange = correct ? 10 : -5;

    setHospital(h => ({
      ...h,
      medicine: h.medicine - t.cost.medicine,
      counselors: h.counselors - t.cost.counselors,
      reputation: Math.min(100, Math.max(0, h.reputation + repChange)),
    }));

    setPatients(prev => prev.map(pt => pt.id === pid ? {
      ...pt, treated: true, health: Math.min(100, pt.health + healthGain),
      recovery: healthGain, cured: pt.health + healthGain >= 75,
    } : pt));

    setHint(correct
      ? `✅ Perfect treatment for ${p.name}! +${healthGain} health.`
      : `⚠️ That partially helps but wasn't ideal for ${p.name}'s condition.`
    );
    setSelected(null);
  };

  const endDay = () => {
    const ev = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    setEvent(ev);
    if (ev.includes('Flu')) setPatients(prev => prev.map(p => !p.treated ? { ...p, health: Math.max(0, p.health - 10) } : p));
    if (ev.includes('medicine')) setHospital(h => ({ ...h, medicine: h.medicine + 2 }));
    if (ev.includes('Reputation')) setHospital(h => ({ ...h, reputation: Math.min(100, h.reputation + 15) }));

    setDay(d => d + 1);
    const curedAll = patients.every(p => p.cured);
    if (curedAll || day >= 3) {
      setPhase('results');
      if (curedAll || patients.filter(p => p.cured).length >= 3) setTimeout(onWin, 800);
    }
    setTimeout(() => setEvent(null), 2500);
  };

  const dischargePatient = (pid: number) => {
    const p = patients.find(pt => pt.id === pid)!;
    if (!p.cured) return;
    setPatients(prev => prev.map(pt => pt.id === pid ? { ...pt, admitted: false } : pt));
    setHospital(h => ({ ...h, beds: h.beds + 1 }));
    setHint(`${p.name} discharged — bed freed!`);
  };

  const curedCount = patients.filter(p => p.cured).length;

  if (phase === 'results') return (
    <div className="flex flex-col items-center gap-5 text-center max-w-md mx-auto">
      <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl">🏥</motion.div>
      <h3 className="font-display text-2xl text-green-700">Hospital Report</h3>
      <p className="text-sm text-gray-600">Healed <strong>{curedCount}/4</strong> patients</p>
      <StatBar label="Hospital Reputation" value={hospital.reputation} color="#3B82F6" />
      <div className="w-full grid grid-cols-2 gap-2">
        {patients.map(p => (
          <div key={p.id} className={cn('flex items-center gap-2 rounded-xl p-2 border-2', p.cured ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50')}>
            <div className="w-10 h-10"><p.Sprite /></div>
            <div className="text-left">
              <p className="text-xs font-bold">{p.name}</p>
              <StatBar label="Health" value={p.health} color={p.cured ? '#10B981' : '#EF4444'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Hospital Dashboard */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { icon: '🛏️', label: 'Beds', value: hospital.beds },
          { icon: '💊', label: 'Medicine', value: hospital.medicine },
          { icon: '🧠', label: 'Counselors', value: hospital.counselors },
          { icon: '⭐', label: 'Rep', value: hospital.reputation + '%' },
        ].map(r => (
          <div key={r.label} className="bg-blue-50 border border-blue-200 rounded-xl p-2">
            <div className="text-xl">{r.icon}</div>
            <div className="text-xs font-bold text-blue-800">{r.value}</div>
            <div className="text-[10px] text-gray-500">{r.label}</div>
          </div>
        ))}
      </div>

      <HintBox text={hint} color="#3B82F6" />

      <AnimatePresence>
        {event && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-yellow-100 border-2 border-yellow-400 rounded-xl px-4 py-2 text-sm font-bold text-yellow-800 text-center"
          >📰 {event}</motion.div>
        )}
      </AnimatePresence>

      {/* Patient Queue */}
      <div className="grid grid-cols-2 gap-2">
        {patients.map(p => (
          <div key={p.id} className={cn('bg-white rounded-2xl border-2 p-2.5 transition-all',
            selected === p.id ? 'border-blue-500 shadow-lg' :
              p.cured ? 'border-green-400 bg-green-50' :
                p.admitted ? 'border-blue-300' : 'border-gray-200'
          )}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 shrink-0"><p.Sprite /></div>
              <div>
                <p className="font-bold text-xs">{p.name}, {p.age}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{p.issue}</p>
              </div>
            </div>
            <StatBar label="Health" value={p.health} color={p.health > 70 ? '#10B981' : p.health > 40 ? '#F59E0B' : '#EF4444'} />
            <div className="mt-2">
              {!p.admitted && !p.cured && (
                <button onClick={() => admitPatient(p.id)} className="w-full py-1 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600">
                  🏥 Admit Patient
                </button>
              )}
              {p.admitted && !p.treated && (
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-center text-blue-700">Assign Treatment:</p>
                  <div className="grid grid-cols-1 gap-0.5">
                    {TREATMENTS.map(t => (
                      <button key={t.id} onClick={() => applyTreatment(p.id, t.id)}
                        className="py-1 px-2 bg-white border border-blue-300 text-[10px] font-bold rounded-lg hover:bg-blue-50 text-left"
                      >
                        {t.label} <span className="text-gray-400 font-normal">— {t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {p.treated && !p.cured && (
                <div className="text-[10px] text-center text-orange-600 font-bold">⏳ Recovering... ({p.health}% health)</div>
              )}
              {p.cured && (
                <button onClick={() => dischargePatient(p.id)} className="w-full py-1 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600">
                  ✅ Discharge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
        <span>Day {day}/3 • Cured: {curedCount}/4</span>
        <span>🏥 Rep: {hospital.reputation}%</span>
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={endDay}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-colors"
      >
        ⏭ End Day {day} & See Results
      </motion.button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SDG 4 – Quality Education: My Real School
   Schedule classes & activities, run days, track student growth
═══════════════════════════════════════════════════════════════ */
type Student = {
  id: number; Sprite: React.FC; name: string;
  knowledge: number; happiness: number; energy: number;
  morning: string | null; afternoon: string | null;
};

/* ═══════════════════════════════════════════════════════════════
   SDG 4 – General Knowledge Quiz
   20 fascinating world facts — score 70%+ to win!
═══════════════════════════════════════════════════════════════ */
const GK_QUESTIONS = [
  { q: "What percentage of Earth's surface is covered by water?", choices: ["50%","60%","71%","85%"], answer: 2, fact: "Despite this, only 3% is fresh water — and most of that is frozen in glaciers!" },
  { q: "Which country has more natural lakes than the rest of the world combined?", choices: ["Russia","Finland","Canada","USA"], answer: 2, fact: "Canada has over 2 million lakes — more than 60% of all lakes on Earth!" },
  { q: "What is the most spoken language by total number of speakers worldwide?", choices: ["English","Spanish","Mandarin Chinese","Hindi"], answer: 2, fact: "Mandarin Chinese has over 1.1 billion total speakers, putting it at #1 in the world!" },
  { q: "Which is actually the LARGEST desert on Earth by area?", choices: ["Sahara","Gobi","Arabian Desert","Antarctica"], answer: 3, fact: "Antarctica is a cold desert! The Sahara is only the largest HOT desert." },
  { q: "How many bones does a healthy adult human body have?", choices: ["150","176","206","254"], answer: 2, fact: "Babies are born with ~270 bones; many fuse together as we grow into adulthood!" },
  { q: "Which tiny creature can survive the vacuum of outer space?", choices: ["Cockroach","Scorpion","Tardigrade","Mite"], answer: 2, fact: "Tardigrades (water bears) can survive space, extreme radiation, and even volcanoes!" },
  { q: "How many countries are members of the United Nations?", choices: ["150","172","193","215"], answer: 2, fact: "The UN was founded in 1945 with just 51 member states. Now it's nearly 200!" },
  { q: "What percentage of Earth's fresh water is locked in glaciers and ice caps?", choices: ["25%","40%","55%","~69%"], answer: 3, fact: "That's why melting glaciers are such a serious threat to global freshwater supplies!" },
  { q: "Which planet in our solar system has the most moons?", choices: ["Jupiter","Saturn","Uranus","Neptune"], answer: 1, fact: "Saturn has 146 confirmed moons — including Titan, which has its own thick atmosphere!" },
  { q: "Approximately how many languages are spoken around the world?", choices: ["~500","~2,000","~7,000","~15,000"], answer: 2, fact: "Over half of these languages have fewer than 10,000 speakers and are endangered!" },
  { q: "About how many trees exist on Earth?", choices: ["300 billion","1 trillion","3 trillion","10 trillion"], answer: 2, fact: "That's ~420 trees per person — but we cut down 15 billion trees every year." },
  { q: "What is the deepest known point on Earth?", choices: ["Java Trench","Tonga Trench","Puerto Rico Trench","Mariana Trench"], answer: 3, fact: "The Mariana Trench reaches 11 km deep — deeper than Mount Everest is tall!" },
  { q: "Which continent has the most countries?", choices: ["Asia","Africa","Europe","Americas"], answer: 1, fact: "Africa has 54 countries — nearly double Asia (48) or Europe (44)!" },
  { q: "What gas makes up about 78% of Earth's atmosphere?", choices: ["Oxygen","Carbon Dioxide","Nitrogen","Argon"], answer: 2, fact: "Oxygen is only 21%! Nitrogen is mostly inert but vital for making proteins in living things." },
  { q: "How long does a single plastic bottle take to decompose?", choices: ["10 years","50 years","200 years","450 years"], answer: 3, fact: "A bottle used for just 10 minutes outlasts you, your children, and your grandchildren!" },
  { q: "About what fraction of the world's food calories come from just 3 crops?", choices: ["1 in 4","1 in 3","About half","Over 60%"], answer: 3, fact: "Rice, wheat, and corn provide over 60% of all calories humans eat worldwide!" },
  { q: "What is the smallest country in the world by area?", choices: ["Monaco","Nauru","Vatican City","San Marino"], answer: 2, fact: "Vatican City covers only 0.44 km² — smaller than most large shopping malls!" },
  { q: "How fast does light travel through space?", choices: ["30,000 km/s","150,000 km/s","300,000 km/s","1,000,000 km/s"], answer: 2, fact: "Light from the Sun takes ~8 minutes to reach Earth, traveling 150 million km!" },
  { q: "Which material is the most recycled in the world?", choices: ["Plastic","Glass","Paper","Steel"], answer: 3, fact: "Steel is infinitely recyclable without losing quality — and saves 75% of the energy to produce it!" },
  { q: "How many species of insects are estimated to exist on Earth?", choices: ["~100,000","~1 million","~5.5 million","~50 million"], answer: 2, fact: "We've formally described only ~1 million so far — the rest are still undiscovered!" },
];

function GeneralKnowledgeQuiz({ onWin }: { onWin: () => void }) {
  const [started, setStarted] = useState(false);
  const [questions] = useState(() => [...GK_QUESTIONS].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-5 text-center py-4">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="text-5xl">🎓</motion.div>
        <h3 className="font-display text-xl text-purple-800">Let's reform the exam system!</h3>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 text-left text-sm text-gray-700 leading-relaxed max-w-sm">
          <p className="mb-2">📚 The old way of learning — memorising answers and forgetting them — isn't working for millions of students.</p>
          <p className="mb-2">💡 <strong>What if exams tested real curiosity instead?</strong> Try these questions and see if <em>understanding the world</em> feels different from rote memorisation.</p>
          <p>✅ Answer <strong>70%</strong> correctly to prove that genuine learning makes a difference!</p>
        </div>
        <button onClick={() => setStarted(true)}
          className="w-full py-3 rounded-2xl font-bold text-white text-base"
          style={{ background: '#7C3AED' }}>
          Start the Quiz →
        </button>
      </div>
    );
  }

  const q = questions[idx];
  const WIN_COUNT = Math.ceil(questions.length * 0.7);

  function pick(i: number) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.answer) setCorrect(c => c + 1);
  }

  function next() {
    const nextIdx = idx + 1;
    if (nextIdx >= questions.length) {
      setDone(true);
      const finalScore = correct + (selected === q.answer ? 1 : 0);
      if (finalScore >= WIN_COUNT) setTimeout(onWin, 1500);
    } else {
      setIdx(nextIdx);
      setSelected(null);
      setAnswered(false);
    }
  }

  if (done) {
    const finalScore = correct;
    const passed = finalScore >= WIN_COUNT;
    return (
      <div className="flex flex-col items-center gap-5 text-center py-4">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="text-6xl">
          {passed ? '🏆' : '📚'}
        </motion.div>
        <h3 className="font-display text-2xl" style={{ color: passed ? '#7C3AED' : '#DC2626' }}>
          {passed ? 'Brilliant Scholar!' : 'Keep Learning!'}
        </h3>
        <div className={cn('rounded-2xl p-4 border-2 w-full max-w-xs', passed ? 'bg-purple-50 border-purple-300' : 'bg-red-50 border-red-300')}>
          <div className="text-4xl font-black" style={{ color: passed ? '#7C3AED' : '#DC2626' }}>{finalScore}/{questions.length}</div>
          <div className="text-sm mt-1 text-gray-600">You need {WIN_COUNT}+ to pass (70%)</div>
        </div>
        {!passed && <p className="text-xs text-gray-500 max-w-xs">Tip: Some answers are surprising — like Antarctica being the biggest desert!</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
          <div className="h-full rounded-full bg-purple-500 transition-all duration-500" style={{ width: `${(idx / questions.length) * 100}%` }} />
        </div>
        <span className="text-xs font-bold text-gray-500">{idx}/{questions.length}</span>
        <span className="text-xs font-bold text-green-600">✓ {correct}</span>
      </div>

      <motion.div key={idx} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4">
        <div className="text-xs font-bold text-purple-400 mb-1">QUESTION {idx + 1} OF {questions.length}</div>
        <p className="font-bold text-gray-800 text-sm leading-relaxed">{q.q}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-2">
        {q.choices.map((choice, i) => {
          const isCorrect = i === q.answer;
          const isSelected = i === selected;
          let bg = 'bg-white border-gray-200 hover:border-purple-300';
          if (answered) {
            if (isCorrect) bg = 'bg-green-100 border-green-500';
            else if (isSelected) bg = 'bg-red-100 border-red-400';
            else bg = 'bg-gray-50 border-gray-200 opacity-60';
          }
          return (
            <motion.button key={i} whileHover={!answered ? { scale: 1.02 } : {}} whileTap={!answered ? { scale: 0.97 } : {}}
              onClick={() => pick(i)}
              className={cn('border-2 rounded-xl p-3 text-sm font-semibold text-left transition-all', bg)}>
              <span className="text-purple-500 font-black mr-1">{['A','B','C','D'][i]}.</span>{choice}
              {answered && isCorrect && <span className="ml-1">✅</span>}
              {answered && isSelected && !isCorrect && <span className="ml-1">❌</span>}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={cn('rounded-xl px-4 py-3 text-xs font-semibold border', selected === q.answer ? 'bg-green-50 border-green-300 text-green-800' : 'bg-amber-50 border-amber-300 text-amber-800')}>
            💡 {q.fact}
          </motion.div>
        )}
      </AnimatePresence>

      {answered && (
        <button onClick={next} className="w-full py-3 rounded-xl font-bold text-white text-sm" style={{ background: '#7C3AED' }}>
          {idx + 1 >= questions.length ? '📊 See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

const EducationPuzzle = GeneralKnowledgeQuiz;

const _OriginalEducationPuzzle = ({ onWin: _onWin }: { onWin: () => void }) => {
  const [students] = useState<Student[]>([
    { id: 1, Sprite: NPC_StudentSam,  name: 'Sam',  knowledge: 20, happiness: 30, energy: 90, morning: null, afternoon: null },
    { id: 2, Sprite: NPC_StudentAria, name: 'Aria', knowledge: 35, happiness: 45, energy: 85, morning: null, afternoon: null },
    { id: 3, Sprite: NPC_StudentLeo,  name: 'Leo',  knowledge: 15, happiness: 20, energy: 70, morning: null, afternoon: null },
    { id: 4, Sprite: NPC_YoungMaya,   name: 'Maya', knowledge: 40, happiness: 55, energy: 95, morning: null, afternoon: null },
  ]);
  const [day, setDay] = useState(1);
  const [phase, setPhase] = useState<'plan' | 'results' | 'event' | 'final'>('plan');
  const [event, setEvent] = useState<{ text: string; effect: () => void } | null>(null);
  const [hint, setHint] = useState('Assign each student a morning class and an afternoon activity!');
  const [selected, setSelected] = useState<number | null>(null);
  const [slot, setSlot] = useState<'morning' | 'afternoon' | null>(null);

  const CLASSES = [
    { id: 'math',    emoji: '🧮', label: 'Math',    knowledge: 25, energy: -15, happiness: 0  },
    { id: 'science', emoji: '🔬', label: 'Science', knowledge: 20, energy: -10, happiness: 5  },
    { id: 'arts',    emoji: '🎨', label: 'Arts',    knowledge: 10, energy: -5,  happiness: 15 },
    { id: 'reading', emoji: '📚', label: 'Reading', knowledge: 15, energy: -10, happiness: 5  },
  ];
  const ACTIVITIES = [
    { id: 'sports',     emoji: '⚽', label: 'Sports',      knowledge: 0,  energy: 20,  happiness: 25 },
    { id: 'clubs',      emoji: '🎭', label: 'Drama Club',   knowledge: 5,  energy: 5,   happiness: 20 },
    { id: 'counseling', emoji: '💬', label: 'Counseling',   knowledge: 0,  energy: 15,  happiness: 30 },
    { id: 'study',      emoji: '📖', label: 'Study Hall',   knowledge: 20, energy: -5,  happiness: -5 },
  ];

  const EVENTS = [
    { text: '📝 Surprise Exam! Knowledge matters — studied students do better.', effect: () => setStudents(prev => prev.map(s => ({ ...s, knowledge: s.knowledge < 40 ? Math.max(0, s.knowledge - 10) : s.knowledge }))) },
    { text: '🎉 School Fair today! Everyone gains +10 happiness!', effect: () => setStudents(prev => prev.map(s => ({ ...s, happiness: Math.min(100, s.happiness + 10) }))) },
    { text: '😴 Burnout warning! Low-energy students struggle.', effect: () => setStudents(prev => prev.map(s => ({ ...s, knowledge: s.energy < 30 ? Math.max(0, s.knowledge - 10) : s.knowledge }))) },
  ];

  const assign = (item: { id: string }) => {
    if (selected === null || !slot) return;
    setStudents(prev => prev.map(s => s.id === selected ? { ...s, [slot]: item.id } : s));
    setSlot(null);
  };

  const runDay = () => {
    const allAssigned = students.every(s => s.morning && s.afternoon);
    if (!allAssigned) { setHint('❗ Assign both morning AND afternoon for every student first!'); return; }

    setStudents(prev => prev.map(s => {
      const cls = CLASSES.find(c => c.id === s.morning)!;
      const act = ACTIVITIES.find(a => a.id === s.afternoon)!;
      return {
        ...s,
        knowledge:  Math.min(100, Math.max(0, s.knowledge  + cls.knowledge  + act.knowledge)),
        happiness:  Math.min(100, Math.max(0, s.happiness  + cls.happiness  + act.happiness)),
        energy:     Math.min(100, Math.max(0, s.energy     + cls.energy     + act.energy)),
        morning: null, afternoon: null,
      };
    }));

    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    ev.effect();
    setEvent(ev);
    setPhase('event');
    setTimeout(() => {
      setEvent(null);
      if (day >= 2) {
        setPhase('final');
        const passing = students.filter(s => s.knowledge >= 55 && s.happiness >= 50).length;
        if (passing >= 3) setTimeout(onWin, 600);
      } else {
        setDay(d => d + 1);
        setPhase('plan');
        setHint(`Day 2! Students need rest — balance challenging classes with fun activities!`);
      }
    }, 2500);
  };

  const allAssigned = students.every(s => s.morning && s.afternoon);
  const passing = students.filter(s => s.knowledge >= 55 && s.happiness >= 50).length;

  if (phase === 'final') return (
    <div className="flex flex-col items-center gap-5 max-w-md mx-auto text-center">
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-6xl">🏫</motion.div>
      <h3 className="font-display text-2xl text-purple-700">School Report Card!</h3>
      <p className="text-sm text-gray-600"><strong>{passing}/4</strong> students thriving (knowledge ≥ 55 & happiness ≥ 50)</p>
      {passing < 3 && <p className="text-xs text-red-500">Tip: balance tough subjects with fun activities, and watch energy levels!</p>}
      <div className="w-full grid grid-cols-2 gap-2">
        {students.map(s => (
          <div key={s.id} className={cn('rounded-xl border-2 p-3', s.knowledge >= 55 && s.happiness >= 50 ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white')}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9"><s.Sprite /></div>
              <p className="font-bold text-xs">{s.name}</p>
              {s.knowledge >= 55 && s.happiness >= 50 && <span className="ml-auto text-green-600 text-sm">⭐</span>}
            </div>
            <StatBar label="Knowledge" value={s.knowledge} color="#7C3AED" />
            <StatBar label="Happiness" value={s.happiness} color="#EC4899" />
            <StatBar label="Energy"    value={s.energy}    color="#10B981" />
          </div>
        ))}
      </div>
      {passing < 3 && (
        <button onClick={() => {
          setStudents([
            { id: 1, Sprite: NPC_StudentSam,  name: 'Sam',  knowledge: 20, happiness: 30, energy: 90, morning: null, afternoon: null },
            { id: 2, Sprite: NPC_StudentAria, name: 'Aria', knowledge: 35, happiness: 45, energy: 85, morning: null, afternoon: null },
            { id: 3, Sprite: NPC_StudentLeo,  name: 'Leo',  knowledge: 15, happiness: 20, energy: 70, morning: null, afternoon: null },
            { id: 4, Sprite: NPC_YoungMaya,   name: 'Maya', knowledge: 40, happiness: 55, energy: 95, morning: null, afternoon: null },
          ]);
          setDay(1); setPhase('plan'); setHint('Try again! Balance learning with wellbeing.');
        }} className="px-5 py-2 bg-purple-500 text-white font-bold rounded-xl">↩ Try Again</button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <div className="bg-purple-50 border border-purple-200 rounded-xl px-3 py-1.5 text-sm font-bold text-purple-800">📅 Day {day}/2</div>
        <div className="text-xs text-gray-500">{allAssigned ? '✅ All assigned!' : `${students.filter(s => s.morning && s.afternoon).length}/4 scheduled`}</div>
      </div>

      <HintBox text={hint} color="#7C3AED" />

      <AnimatePresence>
        {event && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-yellow-100 border-2 border-yellow-400 rounded-xl px-4 py-3 text-sm font-bold text-yellow-800 text-center"
          >📰 {event.text}</motion.div>
        )}
      </AnimatePresence>

      {/* Students */}
      <div className="grid grid-cols-2 gap-2">
        {students.map(s => (
          <motion.div key={s.id} whileHover={{ scale: 1.02 }}
            onClick={() => { setSelected(s.id); setSlot(null); setHint(`${s.name} selected! Now pick morning class then afternoon activity below.`); }}
            className={cn('bg-white rounded-2xl border-2 p-2.5 cursor-pointer transition-all',
              selected === s.id ? 'border-purple-500 shadow-lg' : 'border-gray-200 hover:border-purple-300'
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-9 h-10 shrink-0"><s.Sprite /></div>
              <div>
                <p className="font-bold text-xs">{s.name}</p>
                <div className="flex gap-1 mt-0.5">
                  <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-bold', s.morning ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400')}>
                    {s.morning ? `🌅 ${CLASSES.find(c=>c.id===s.morning)?.label}` : '🌅 ?'}
                  </span>
                  <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-bold', s.afternoon ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400')}>
                    {s.afternoon ? `🌇 ${ACTIVITIES.find(a=>a.id===s.afternoon)?.label}` : '🌇 ?'}
                  </span>
                </div>
              </div>
            </div>
            <StatBar label="📚" value={s.knowledge} color="#7C3AED" />
            <StatBar label="😊" value={s.happiness}  color="#EC4899" />
            <StatBar label="⚡" value={s.energy}     color="#10B981" />
          </motion.div>
        ))}
      </div>

      {selected !== null && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
          <div className="flex gap-2 mb-2">
            <button onClick={() => setSlot('morning')}
              className={cn('flex-1 py-1 text-xs font-bold rounded-lg border-2 transition-all', slot === 'morning' ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white')}>
              🌅 Morning Class
            </button>
            <button onClick={() => setSlot('afternoon')}
              className={cn('flex-1 py-1 text-xs font-bold rounded-lg border-2 transition-all', slot === 'afternoon' ? 'border-orange-500 bg-orange-100' : 'border-gray-300 bg-white')}>
              🌇 Afternoon Activity
            </button>
          </div>
          {slot === 'morning' && (
            <div className="grid grid-cols-2 gap-1">
              {CLASSES.map(c => (
                <button key={c.id} onClick={() => assign(c)} className="flex items-center gap-2 p-2 bg-white border-2 border-blue-200 rounded-xl hover:border-blue-500 text-xs font-bold transition-all">
                  <span className="text-lg">{c.emoji}</span>
                  <span>{c.label}<br/><span className="text-gray-400 font-normal">+{c.knowledge}📚 {c.happiness > 0 ? `+${c.happiness}😊` : ''}</span></span>
                </button>
              ))}
            </div>
          )}
          {slot === 'afternoon' && (
            <div className="grid grid-cols-2 gap-1">
              {ACTIVITIES.map(a => (
                <button key={a.id} onClick={() => assign(a)} className="flex items-center gap-2 p-2 bg-white border-2 border-orange-200 rounded-xl hover:border-orange-500 text-xs font-bold transition-all">
                  <span className="text-lg">{a.emoji}</span>
                  <span>{a.label}<br/><span className="text-gray-400 font-normal">{a.happiness > 0 ? `+${a.happiness}😊` : ''} {a.energy > 0 ? `+${a.energy}⚡` : ''}</span></span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={runDay}
        disabled={!allAssigned}
        className={cn('w-full py-3 font-bold rounded-xl shadow-md transition-colors text-white',
          allAssigned ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-300 cursor-not-allowed'
        )}
      >
        🔔 Ring the Bell — Run Day {day}!
      </motion.button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SDG 5 – Gender Equality: Switch the Shoes
   Navigate scenarios, implement policies, raise equality index
═══════════════════════════════════════════════════════════════ */
type Scenario = {
  location: string; icon: string;
  situation: string;
  characters: { Sprite: React.FC; name: string; gender: string; quote: string }[];
  choices: { Sprite: React.FC; label: string; action: string; correct: boolean; feedback: string; policy: string }[];
};

const EqualityPuzzle = ({ onWin }: { onWin: () => void }) => {
  const [gender, setGender] = useState<string | null>(null);
  const [equalityIndex, setEqualityIndex] = useState(12);
  const [current, setCurrent] = useState(0);
  const [policies, setPolicies] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null);
  const [solved, setSolved] = useState(0);
  const [hint, setHint] = useState('');
  const [phase, setPhase] = useState<'gender' | 'play' | 'final'>('gender');

  const GENDER_PERSPECTIVES: Record<string, { bias: string; color: string }> = {
    female: { bias: 'You may face pay gaps, fewer leadership opportunities, and social stereotypes.', color: '#EC4899' },
    male: { bias: 'You\'ll see how male privilege operates — and how you can use it to advocate for fairness.', color: '#3B82F6' },
    nonbinary: { bias: 'You experience unique challenges when systems only recognize two genders.', color: '#8B5CF6' },
  };

  const SCENARIOS: Scenario[] = [
    {
      location: '⚽ School Sports',
      icon: '🏫',
      situation: 'Coach Rex won\'t let Zara join the football team — "It\'s a boys\' sport."',
      characters: [
        { Sprite: NPC_Girl,    name: 'Zara', gender: 'female', quote: '⚽ I want to play!' },
        { Sprite: NPC_Worker,  name: 'Rex',  gender: 'male',   quote: '🚫 Not for girls!' },
      ],
      choices: [
        { Sprite: NPC_Advocate, label: 'Fair Fern', action: 'Petition the principal for gender-inclusive team policies', correct: true, feedback: '✅ Systemic change! Inclusive sports policies help everyone.', policy: '🏅 Inclusive Sports Policy' },
        { Sprite: NPC_Sibling,  label: 'Bystander Bo', action: 'Say nothing — don\'t want trouble', correct: false, feedback: '❌ Silence maintains unfair rules. Speak up!', policy: '' },
        { Sprite: NPC_Worker,   label: 'Bystander Cal', action: 'Tell Zara to try gymnastics instead', correct: false, feedback: '❌ Redirecting isn\'t equality — she deserves equal access!', policy: '' },
      ],
    },
    {
      location: '💼 The Workplace',
      icon: '🏢',
      situation: 'Priya earns 30% less than her male colleague doing identical work. HR says "That\'s just how it\'s always been."',
      characters: [
        { Sprite: NPC_Worker,  name: 'Priya', gender: 'female', quote: '💰 Same work, less pay?' },
        { Sprite: NPC_Worker,  name: 'HR Ed', gender: 'male',   quote: '📊 That\'s policy...' },
      ],
      choices: [
        { Sprite: NPC_Sibling, label: 'Bystander Sam', action: 'Accept it — risk of conflict too high', correct: false, feedback: '❌ Accepting inequality perpetuates it for everyone.', policy: '' },
        { Sprite: NPC_Advocate, label: 'Advocate Ana', action: 'File a formal pay equity complaint and educate the team', correct: true, feedback: '✅ Pay equity advocacy creates lasting systemic change!', policy: '💸 Equal Pay Policy' },
        { Sprite: NPC_Girl, label: 'Bystander Cam', action: 'Tell Priya to quietly negotiate alone', correct: false, feedback: '⚠️ Individual negotiation helps one person, not the system.', policy: '' },
      ],
    },
    {
      location: '🏠 Home Life',
      icon: '🏡',
      situation: 'Jamie does ALL the household chores while their sibling is exempt because "That\'s just how families work."',
      characters: [
        { Sprite: NPC_Sibling, name: 'Jamie', gender: 'nonbinary', quote: '🧹 Why only me?' },
        { Sprite: NPC_Worker,  name: 'Parent', gender: 'male',     quote: '🏠 Tradition!' },
      ],
      choices: [
        { Sprite: NPC_Advocate, label: 'Fair Fern', action: 'Propose a shared chores roster for the whole family', correct: true, feedback: '✅ Equitable home division is the foundation of gender equality!', policy: '🧹 Shared Responsibility Charter' },
        { Sprite: NPC_Worker, label: 'Bystander Bo', action: 'Agree — some people are naturally better at chores', correct: false, feedback: '❌ Chores aren\'t biological destiny — fairness is a choice!', policy: '' },
        { Sprite: NPC_Girl, label: 'Bystander Ria', action: 'Tell Jamie to just do it — avoid conflict', correct: false, feedback: '❌ Avoiding conflict means accepting unfair burdens forever.', policy: '' },
      ],
    },
    {
      location: '🎓 University',
      icon: '🎓',
      situation: 'A scholarship committee overlooks equally qualified female applicants, saying "We need strong male engineers."',
      characters: [
        { Sprite: NPC_StudentAria, name: 'Aria', gender: 'female', quote: '📐 I\'m equally qualified!' },
        { Sprite: NPC_TeacherThinklet, name: 'Prof', gender: 'male', quote: '🔩 We need "strong" engineers' },
      ],
      choices: [
        { Sprite: NPC_Worker, label: 'Bystander Sam', action: 'Accept — maybe try art school instead', correct: false, feedback: '❌ Steering people away from fields they\'re qualified for is bias!', policy: '' },
        { Sprite: NPC_Girl, label: 'Bystander Val', action: 'Whisper about it privately', correct: false, feedback: '❌ Quiet complaints don\'t reform selection processes.', policy: '' },
        { Sprite: NPC_Advocate, label: 'Advocate Ana', action: 'Demand blind application review and bias training for committee', correct: true, feedback: '✅ Blind review + bias training creates fair opportunity for all!', policy: '🎓 Blind Scholarship Review' },
      ],
    },
  ];

  const handleChoice = (choice: Scenario['choices'][number]) => {
    setFeedback({ text: choice.feedback, correct: choice.correct });
    if (choice.correct) {
      setEqualityIndex(v => Math.min(100, v + 22));
      if (choice.policy) setPolicies(prev => [...prev, choice.policy]);
      setTimeout(() => {
        setFeedback(null);
        setSolved(s => s + 1);
        if (current < SCENARIOS.length - 1) {
          setCurrent(c => c + 1);
          setHint('');
        } else {
          setPhase('final');
          setTimeout(onWin, 600);
        }
      }, 2200);
    } else {
      setEqualityIndex(v => Math.max(0, v - 5));
      setTimeout(() => setFeedback(null), 2200);
    }
  };

  if (phase === 'gender') return (
    <div className="flex flex-col items-center gap-5 text-center max-w-md mx-auto">
      <div className="text-5xl">👟</div>
      <h3 className="font-display text-xl text-orange-700">Switch the Shoes</h3>
      <p className="text-sm text-gray-600">Choose a perspective to walk through daily scenarios and fight inequality!</p>
      <div className="grid grid-cols-3 gap-3 w-full">
        {(['female', 'male', 'nonbinary'] as const).map(g => (
          <motion.button key={g} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            onClick={() => { setGender(g); setHint(''); }}
            className={cn('flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all font-bold capitalize',
              gender === g ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-gray-200 bg-white hover:border-orange-300'
            )}
          >
            <span className="text-3xl">{g === 'female' ? '👩' : g === 'male' ? '👨' : '🧑'}</span>
            <span className="text-sm">{g === 'nonbinary' ? 'Non-binary' : g.charAt(0).toUpperCase() + g.slice(1)}</span>
          </motion.button>
        ))}
      </div>
      {gender && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-300 rounded-xl p-4 text-sm text-gray-700"
        >
          <p className="font-bold mb-1" style={{ color: GENDER_PERSPECTIVES[gender].color }}>As a {gender === 'nonbinary' ? 'non-binary' : gender} person:</p>
          <p>{GENDER_PERSPECTIVES[gender].bias}</p>
        </motion.div>
      )}
      {gender && (
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
          onClick={() => { setPhase('play'); setHint('Read the situation and choose the most equitable response!'); }}
          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg"
        >
          👟 Step Into Their Shoes →
        </motion.button>
      )}
    </div>
  );

  if (phase === 'final') return (
    <div className="flex flex-col items-center gap-5 text-center max-w-md mx-auto">
      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 1 }} className="text-6xl">⚖️</motion.div>
      <h3 className="font-display text-2xl text-orange-700">Equality Achieved!</h3>
      <p className="text-sm text-gray-600">Equality Index: <strong>{equalityIndex}%</strong></p>
      <StatBar label="Equality Index" value={equalityIndex} color="#F59E0B" />
      <div className="w-full bg-orange-50 border border-orange-200 rounded-xl p-4 text-left">
        <p className="font-bold text-sm text-orange-800 mb-2">Policies Enacted:</p>
        {policies.map(p => <p key={p} className="text-sm text-gray-700">✅ {p}</p>)}
      </div>
    </div>
  );

  const s = SCENARIOS[current];

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      {/* Equality bar */}
      <div>
        <div className="flex justify-between text-xs font-bold text-orange-700 mb-1">
          <span>⚖️ Equality Index</span>
          <span>{equalityIndex}%</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #F97316, #FCD34D)' }}
            animate={{ width: `${equalityIndex}%` }} transition={{ duration: 0.7 }} />
        </div>
      </div>

      {/* Perspective badge */}
      <div className="flex items-center gap-2 justify-center">
        <span className="text-sm">{gender === 'female' ? '👩' : gender === 'male' ? '👨' : '🧑'}</span>
        <span className="text-xs font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-full">Playing as: {gender === 'nonbinary' ? 'Non-binary' : gender}</span>
        <span className="text-xs text-gray-400">{current + 1}/{SCENARIOS.length}</span>
      </div>

      {/* Scenario */}
      <motion.div key={current} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-3">
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-orange-700 mb-1">{s.icon} {s.location}</p>
          <p className="text-sm text-gray-700 font-medium">{s.situation}</p>
        </div>

        {/* Characters */}
        <div className="flex justify-center gap-6">
          {s.characters.map(ch => (
            <div key={ch.name} className="flex flex-col items-center gap-1">
              <div className="relative">
                <div className="w-14 h-14"><ch.Sprite /></div>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-xl px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap shadow">
                  {ch.quote}
                </div>
              </div>
              <p className="text-[10px] font-bold text-gray-700">{ch.name}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <p className="text-xs font-bold text-center text-gray-600">Who should act? Pick the best response:</p>

      <AnimatePresence mode="wait">
        {feedback ? (
          <motion.div key="fb" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            className={cn('p-4 rounded-2xl border-2 text-sm font-semibold text-center',
              feedback.correct ? 'bg-green-100 text-green-800 border-green-400' : 'bg-red-100 text-red-800 border-red-400'
            )}
          >
            {feedback.text}
          </motion.div>
        ) : (
          <motion.div key="choices" className="grid grid-cols-1 gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {s.choices.map((c, i) => (
              <motion.button key={i} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleChoice(c)}
                className="flex items-center gap-3 bg-white border-2 border-orange-200 hover:border-orange-500 rounded-2xl px-4 py-3 text-left transition-all"
              >
                <div className="w-10 h-10 shrink-0"><c.Sprite /></div>
                <div>
                  <p className="font-bold text-sm">{c.label}</p>
                  <p className="text-xs text-gray-600">{c.action}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Policy board */}
      {policies.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-[10px] font-bold text-green-800 mb-1">Policies enacted:</p>
          <div className="flex flex-wrap gap-1">
            {policies.map(p => <span key={p} className="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">{p}</span>)}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SDG 6 – Clean Water: Water Stories
   Detect pollution in 3 river segments, deploy the right tools
═══════════════════════════════════════════════════════════════ */

type PollutionType = 'oil' | 'trash' | 'chemicals' | 'waste';
type ToolType = 'absorbent' | 'net' | 'neutralizer' | 'filter';

interface RiverSegment { id: string; name: string; emoji: string; pollutionType: PollutionType; pollution: number; health: number; }
interface CleaningTool { id: ToolType; name: string; emoji: string; desc: string; effectOn: PollutionType[]; count: number; }

const INITIAL_SEGMENTS: RiverSegment[] = [
  { id: 'upstream', name: 'Upstream Mountains', emoji: '🏔️', pollutionType: 'chemicals', pollution: 75, health: 30 },
  { id: 'midstream', name: 'Midstream Village', emoji: '🏘️', pollutionType: 'trash', pollution: 60, health: 40 },
  { id: 'downstream', name: 'Downstream Delta', emoji: '🌊', pollutionType: 'oil', pollution: 50, health: 50 },
];
const CLEANING_TOOLS: CleaningTool[] = [
  { id: 'absorbent', name: 'Absorbent Pad', emoji: '🧽', desc: 'Soaks up oil spills', effectOn: ['oil', 'waste'], count: 3 },
  { id: 'net', name: 'Trash Net', emoji: '🕸️', desc: 'Collects floating trash & debris', effectOn: ['trash'], count: 3 },
  { id: 'neutralizer', name: 'Neutralizer', emoji: '⚗️', desc: 'Breaks down chemical pollutants', effectOn: ['chemicals', 'waste'], count: 3 },
  { id: 'filter', name: 'Filter Unit', emoji: '🔬', desc: 'Purifies all pollutant types', effectOn: ['oil', 'trash', 'chemicals', 'waste'], count: 2 },
];

function WaterPuzzle({ onWin }: { onWin: () => void }) {
  const [segments, setSegments] = useState<RiverSegment[]>(INITIAL_SEGMENTS.map(s => ({ ...s })));
  const [tools, setTools] = useState<CleaningTool[]>(CLEANING_TOOLS.map(t => ({ ...t })));
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [log, setLog] = useState<string[]>(['💧 River pollution detected! Select a tool, then click a river segment.']);
  const [feedback, setFeedback] = useState<{ segId: string; msg: string; ok: boolean } | null>(null);

  const allClean = segments.every(s => s.pollution <= 20);

  useEffect(() => { if (allClean) onWin(); }, [allClean, onWin]);

  const applyTool = (seg: RiverSegment) => {
    if (!selectedTool) { setLog(l => ['⚠️ Pick a tool first!', ...l]); return; }
    const tool = tools.find(t => t.id === selectedTool)!;
    if (tool.count <= 0) { setLog(l => ['❌ Out of that tool! Try another.', ...l]); return; }

    const isEffective = tool.effectOn.includes(seg.pollutionType);
    const reduction = isEffective ? 32 + Math.floor(Math.random() * 15) : 10;
    const healthGain = isEffective ? 20 : 5;

    setSegments(prev => prev.map(s => s.id === seg.id
      ? { ...s, pollution: Math.max(0, s.pollution - reduction), health: Math.min(100, s.health + healthGain) }
      : s));
    setTools(prev => prev.map(t => t.id === selectedTool ? { ...t, count: t.count - 1 } : t));

    const msg = isEffective
      ? `✅ ${tool.emoji} ${tool.name} worked great on ${seg.name}! Pollution −${reduction}%`
      : `⚠️ ${tool.emoji} ${tool.name} isn't ideal here. Only −${reduction}% removed.`;
    setFeedback({ segId: seg.id, msg, ok: isEffective });
    setLog(l => [msg, ...l.slice(0, 3)]);
    setTimeout(() => setFeedback(null), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* River segments */}
      <div className="grid grid-cols-3 gap-3">
        {segments.map(seg => (
          <motion.button key={seg.id}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => applyTool(seg)}
            className={cn("rounded-xl p-3 text-left border-3 transition-all",
              selectedTool ? 'border-blue-400 cursor-pointer hover:bg-blue-50' : 'border-gray-200 cursor-default',
              seg.pollution <= 20 && 'border-green-400 bg-green-50'
            )}
            style={{ borderWidth: 3 }}
          >
            <div className="text-2xl mb-1">{seg.pollution <= 20 ? '✅' : seg.emoji}</div>
            <div className="font-bold text-xs mb-1">{seg.name}</div>
            {/* Pollution bar */}
            <div className="text-[10px] text-gray-500 mb-0.5">Pollution: {seg.pollution}%</div>
            <div className="h-2 bg-red-100 rounded-full overflow-hidden mb-1">
              <motion.div className="h-full rounded-full" animate={{ width: `${seg.pollution}%` }}
                style={{ background: seg.pollution > 60 ? '#EF5350' : seg.pollution > 30 ? '#FF8F00' : '#66BB6A' }} />
            </div>
            {/* Health bar */}
            <div className="text-[10px] text-gray-500 mb-0.5">Health: {seg.health}%</div>
            <div className="h-2 bg-green-100 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-green-500" animate={{ width: `${seg.health}%` }} />
            </div>
            {/* Pollution type badge */}
            <div className="mt-1.5 text-[9px] px-2 py-0.5 rounded-full font-bold text-center"
              style={{ background: seg.pollutionType === 'oil' ? '#FF8F00' : seg.pollutionType === 'chemicals' ? '#7B1FA2' : '#00838F', color: 'white' }}>
              {seg.pollutionType === 'oil' ? '🛢️ Oil' : seg.pollutionType === 'chemicals' ? '⚗️ Chemicals' : '🗑️ Trash'}
            </div>
            {feedback?.segId === seg.id && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={cn("text-[10px] mt-1 font-bold", feedback.ok ? 'text-green-600' : 'text-orange-500')}>
                {feedback.ok ? '✅ Effective!' : '⚠️ Weak effect'}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Tool selector */}
      <div>
        <div className="text-xs font-bold text-gray-500 mb-2">🧰 Cleanup Tools — select then click a segment:</div>
        <div className="grid grid-cols-2 gap-2">
          {tools.map(tool => (
            <button key={tool.id}
              onClick={() => setSelectedTool(tool.id === selectedTool ? null : tool.id)}
              disabled={tool.count <= 0}
              className={cn("p-2 rounded-xl border-2 text-left transition-all",
                selectedTool === tool.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300',
                tool.count <= 0 && 'opacity-40 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{tool.emoji}</span>
                <div>
                  <div className="font-bold text-xs">{tool.name}</div>
                  <div className="text-[10px] text-gray-500">{tool.desc}</div>
                </div>
                <div className={cn("ml-auto text-xs font-black px-2 py-0.5 rounded-full", tool.count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400')}>×{tool.count}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Log */}
      <div className="bg-blue-50 rounded-xl p-3 text-xs space-y-1 max-h-24 overflow-y-auto">
        {log.map((l, i) => <div key={i} className="text-blue-800">{l}</div>)}
      </div>
      {selectedTool && (
        <HintBox text={`${tools.find(t=>t.id===selectedTool)?.emoji} ${tools.find(t=>t.id===selectedTool)?.name} selected — now click a river segment to deploy!`} color="#0288D1" />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SDG 14 – Life Below Water: Ocean Cleanup Crew
   Clean 4 ocean zones, rescue marine life
═══════════════════════════════════════════════════════════════ */

type OceanPollution = 'plastics' | 'oil' | 'chemicals' | 'ghost_nets';
type OceanTool = 'skimmer' | 'nets' | 'filter' | 'rescue';

interface OceanZone { id: string; name: string; emoji: string; pollution: OceanPollution; level: number; marineHealth: number; rescued: boolean; }
interface OceanCleanTool { id: OceanTool; name: string; emoji: string; desc: string; cleans: OceanPollution[]; count: number; }

const OCEAN_ZONES: OceanZone[] = [
  { id: 'coast', name: 'Sandy Coast', emoji: '🏖️', pollution: 'plastics', level: 80, marineHealth: 20, rescued: false },
  { id: 'reef', name: 'Coral Reef', emoji: '🪸', pollution: 'chemicals', level: 70, marineHealth: 25, rescued: false },
  { id: 'open', name: 'Open Ocean', emoji: '🌊', pollution: 'oil', level: 65, marineHealth: 35, rescued: false },
  { id: 'deep', name: 'Deep Sea Floor', emoji: '🐙', pollution: 'ghost_nets', level: 60, marineHealth: 30, rescued: false },
];
const OCEAN_TOOLS: OceanCleanTool[] = [
  { id: 'skimmer', name: 'Skimmer Boat', emoji: '⛵', desc: 'Removes oil slicks', cleans: ['oil'], count: 3 },
  { id: 'nets', name: 'Clean Nets', emoji: '🕸️', desc: 'Collects plastics & ghost nets', cleans: ['plastics', 'ghost_nets'], count: 3 },
  { id: 'filter', name: 'Chemical Filter', emoji: '🧪', desc: 'Neutralizes chemical waste', cleans: ['chemicals', 'oil'], count: 2 },
  { id: 'rescue', name: 'Rescue Team', emoji: '🤿', desc: 'Saves marine life from all threats', cleans: ['plastics', 'oil', 'chemicals', 'ghost_nets'], count: 2 },
];

function OceanPuzzle({ onWin }: { onWin: () => void }) {
  const [, goTo] = useLocation();
  const [zones, setZones] = useState<OceanZone[]>(OCEAN_ZONES.map(z => ({ ...z })));
  const [tools, setTools] = useState<OceanCleanTool[]>(OCEAN_TOOLS.map(t => ({ ...t })));
  const [selectedTool, setSelectedTool] = useState<OceanTool | null>(null);
  const [log, setLog] = useState<string[]>(['🌊 Ocean under threat! Select a cleanup tool, then click a zone to deploy it.']);
  const [feedback, setFeedback] = useState<{ zoneId: string; ok: boolean } | null>(null);

  const allClear = zones.every(z => z.level <= 20);
  useEffect(() => { if (allClear) onWin(); }, [allClear, onWin]);

  const applyOceanTool = (zone: OceanZone) => {
    if (!selectedTool) { setLog(l => ['⚠️ Choose a tool first!', ...l]); return; }
    const tool = tools.find(t => t.id === selectedTool)!;
    if (tool.count <= 0) { setLog(l => ['❌ No more uses left for that tool!', ...l]); return; }

    const effective = tool.cleans.includes(zone.pollution);
    const reduction = effective ? 35 + Math.floor(Math.random() * 15) : 10;
    const healthGain = effective ? 25 : 8;

    setZones(prev => prev.map(z => z.id === zone.id
      ? { ...z, level: Math.max(0, z.level - reduction), marineHealth: Math.min(100, z.marineHealth + healthGain), rescued: effective && zone.level - reduction <= 20 }
      : z));
    setTools(prev => prev.map(t => t.id === selectedTool ? { ...t, count: t.count - 1 } : t));

    const msg = effective
      ? `🌊 ${tool.emoji} ${tool.name} cleared ${zone.name}! Pollution −${reduction}%`
      : `⚠️ ${tool.emoji} Not the right tool for ${zone.name}. Only −${reduction}% removed.`;
    setFeedback({ zoneId: zone.id, ok: effective });
    setLog(l => [msg, ...l.slice(0, 3)]);
    setTimeout(() => setFeedback(null), 1500);
  };

  const pollutionColor = (p: OceanPollution) =>
    p === 'plastics' ? '#29B6F6' : p === 'oil' ? '#795548' : p === 'chemicals' ? '#AB47BC' : '#607D8B';
  const pollutionLabel = (p: OceanPollution) =>
    p === 'plastics' ? '♻️ Plastics' : p === 'oil' ? '🛢️ Oil' : p === 'chemicals' ? '⚗️ Chemicals' : '🕸️ Ghost Nets';

  return (
    <div className="flex flex-col gap-4">
      {/* Ocean Diver RPG banner */}
      <button onClick={() => goTo('/ocean-diver')}
        className="w-full rounded-2xl p-4 text-white text-left flex items-center gap-4 transition-all active:scale-95"
        style={{ background: 'linear-gradient(135deg,#0369a1,#0ea5e9)', boxShadow: '0 4px 0 #0284c7,0 6px 20px #0ea5e955' }}>
        <span className="text-5xl">🤿</span>
        <div className="flex-1">
          <div className="font-display text-xl leading-tight">Ocean Diver RPG</div>
          <div className="text-sky-200 text-xs mt-0.5">Swim through the ocean, collect garbage and free trapped animals!</div>
        </div>
        <span className="text-2xl">▶</span>
      </button>

      <div className="text-center text-xs text-gray-400 font-semibold uppercase tracking-wider">— or clean up via strategy below —</div>

      <div className="grid grid-cols-2 gap-3">
        {zones.map(zone => (
          <motion.button key={zone.id}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => applyOceanTool(zone)}
            className={cn("rounded-xl p-3 text-left border-3 transition-all",
              selectedTool ? 'border-cyan-400 hover:bg-cyan-50' : 'border-gray-200',
              zone.level <= 20 && 'border-green-400 bg-green-50'
            )}
            style={{ borderWidth: 3, background: zone.level <= 20 ? '#E8F5E9' : '#E0F7FA' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{zone.level <= 20 ? '✅' : zone.emoji}</span>
              <span className="font-bold text-xs">{zone.name}</span>
            </div>
            <div className="text-[10px] text-gray-500 mb-0.5">Pollution: {zone.level}%</div>
            <div className="h-2 bg-red-100 rounded-full overflow-hidden mb-1">
              <motion.div className="h-full rounded-full" animate={{ width: `${zone.level}%` }}
                style={{ background: zone.level > 60 ? '#EF5350' : zone.level > 30 ? '#FF8F00' : '#66BB6A' }} />
            </div>
            <div className="text-[10px] text-gray-500 mb-0.5">Marine Health: {zone.marineHealth}%</div>
            <div className="h-2 bg-cyan-100 rounded-full overflow-hidden mb-1">
              <motion.div className="h-full rounded-full bg-cyan-500" animate={{ width: `${zone.marineHealth}%` }} />
            </div>
            <div className="text-[9px] px-2 py-0.5 rounded-full font-bold inline-block" style={{ background: pollutionColor(zone.pollution), color: 'white' }}>
              {pollutionLabel(zone.pollution)}
            </div>
            {zone.rescued && <div className="text-[10px] text-green-600 font-bold mt-1">🐠 Marine life rescued!</div>}
            {feedback?.zoneId === zone.id && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className={cn("text-[10px] font-bold mt-1", feedback.ok ? 'text-green-600' : 'text-orange-500')}>
                {feedback.ok ? '✅ Effective!' : '⚠️ Wrong tool'}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div>
        <div className="text-xs font-bold text-gray-500 mb-2">🧰 Cleanup Fleet:</div>
        <div className="grid grid-cols-2 gap-2">
          {tools.map(tool => (
            <button key={tool.id}
              onClick={() => setSelectedTool(tool.id === selectedTool ? null : tool.id)}
              disabled={tool.count <= 0}
              className={cn("p-2 rounded-xl border-2 text-left transition-all",
                selectedTool === tool.id ? 'border-cyan-500 bg-cyan-50 shadow-md' : 'border-gray-200 hover:border-cyan-300',
                tool.count <= 0 && 'opacity-40 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{tool.emoji}</span>
                <div>
                  <div className="font-bold text-xs">{tool.name}</div>
                  <div className="text-[10px] text-gray-500">{tool.desc}</div>
                </div>
                <div className={cn("ml-auto text-xs font-black px-2 py-0.5 rounded-full", tool.count > 0 ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-400')}>×{tool.count}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-cyan-50 rounded-xl p-3 text-xs space-y-1 max-h-20 overflow-y-auto">
        {log.map((l, i) => <div key={i} className="text-cyan-800">{l}</div>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SDG 15 – Life on Land: Forest Guardian
   3×3 grid of forest cells, restore across 3 seasons
═══════════════════════════════════════════════════════════════ */

type CellState = 'degraded' | 'seedling' | 'growing' | 'healthy' | 'fire' | 'logging' | 'disease';

interface ForestCell { id: number; state: CellState; animal?: string; }

const CELL_EMOJI: Record<CellState, string> = {
  degraded: '🏜️', seedling: '🌱', growing: '🌿', healthy: '🌳', fire: '🔥', logging: '🪓', disease: '🍂',
};
const CELL_COLOR: Record<CellState, string> = {
  degraded: '#EFEBE9', seedling: '#DCEDC8', growing: '#A5D6A7', healthy: '#2E7D32', fire: '#FF5722', logging: '#795548', disease: '#FBC02D',
};
const CELL_LABEL: Record<CellState, string> = {
  degraded: 'Barren', seedling: 'Seedling', growing: 'Growing', healthy: 'Healthy Forest!', fire: 'On Fire!', logging: 'Being Logged', disease: 'Disease',
};
const THREAT_ACTIONS: Record<string, { label: string; emoji: string; fixes: CellState[] }> = {
  plant: { label: 'Plant Tree', emoji: '🌱', fixes: ['degraded'] },
  water: { label: 'Water & Nurture', emoji: '💧', fixes: ['seedling', 'growing'] },
  protect: { label: 'Protect Zone', emoji: '🛡️', fixes: ['healthy'] },
  fight_fire: { label: 'Fight Fire', emoji: '🚒', fixes: ['fire'] },
  stop_logging: { label: 'Stop Loggers', emoji: '🚔', fixes: ['logging'] },
  treat_disease: { label: 'Treat Disease', emoji: '💊', fixes: ['disease'] },
};

function makeCells(): ForestCell[] {
  return [
    { id: 0, state: 'degraded' }, { id: 1, state: 'growing' }, { id: 2, state: 'fire' },
    { id: 3, state: 'logging' }, { id: 4, state: 'degraded' }, { id: 5, state: 'growing' },
    { id: 6, state: 'seedling' }, { id: 7, state: 'disease' }, { id: 8, state: 'degraded' },
  ];
}

const SEASON_EVENTS: { msg: string; threat?: CellState; targetId?: number }[] = [
  { msg: '🔥 Dry season! A new wildfire breaks out in the east.', threat: 'fire', targetId: 5 },
  { msg: '🪓 Illegal loggers spotted near the northern grove!', threat: 'logging', targetId: 1 },
  { msg: '🍂 A disease is spreading through the understory.', threat: 'disease', targetId: 6 },
];

function ForestPuzzle({ onWin }: { onWin: () => void }) {
  const [cells, setCells] = useState<ForestCell[]>(makeCells());
  const [season, setSeason] = useState(1);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>(['🌿 The forest needs your help! Select an action, then click a forest cell.']);
  const [actionsLeft, setActionsLeft] = useState(6);
  const [phase, setPhase] = useState<'action' | 'event' | 'done'>('action');
  const [eventMsg, setEventMsg] = useState<string | null>(null);

  const healthyCount = cells.filter(c => c.state === 'healthy').length;
  const progress = Math.round((healthyCount / 9) * 100);

  const applyAction = (cell: ForestCell) => {
    if (!selectedAction || actionsLeft <= 0 || phase !== 'action') return;
    const action = THREAT_ACTIONS[selectedAction];
    if (!action.fixes.includes(cell.state)) {
      setLog(l => [`⚠️ ${action.emoji} ${action.label} doesn't help a "${CELL_LABEL[cell.state]}" cell. Try another action!`, ...l.slice(0, 3)]);
      return;
    }
    const nextState: Record<CellState, CellState> = {
      degraded: 'seedling', seedling: 'growing', growing: 'healthy', healthy: 'healthy',
      fire: 'degraded', logging: 'degraded', disease: 'growing',
    };
    const outcome = nextState[cell.state];
    setCells(prev => prev.map(c => c.id === cell.id ? { ...c, state: outcome } : c));
    setLog(l => [`✅ ${action.emoji} Cell #${cell.id + 1}: ${CELL_LABEL[cell.state]} → ${CELL_LABEL[outcome]}`, ...l.slice(0, 3)]);
    const newActionsLeft = actionsLeft - 1;
    setActionsLeft(newActionsLeft);

    if (newActionsLeft <= 0) {
      setPhase('event');
      const evt = SEASON_EVENTS[season - 1];
      if (evt) {
        setEventMsg(evt.msg);
        if (evt.threat && evt.targetId !== undefined) {
          setCells(prev => prev.map(c => c.id === evt.targetId ? { ...c, state: evt.threat! } : c));
        }
        setTimeout(() => {
          setEventMsg(null);
          if (season >= 3) {
            setPhase('done');
          } else {
            setSeason(s => s + 1);
            setActionsLeft(6);
            setPhase('action');
            setLog(l => [`🌻 Season ${season + 1} begins! You have 6 actions.`, ...l.slice(0, 3)]);
          }
        }, 2500);
      }
    }
  };

  useEffect(() => {
    if (phase === 'done' && healthyCount >= 6) onWin();
  }, [phase, healthyCount, onWin]);

  return (
    <div className="flex flex-col gap-4">
      {/* Season progress */}
      <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-2">
        <div className="text-sm font-bold text-green-800">🌿 Season {season}/3 &nbsp;|&nbsp; Actions left: {actionsLeft}</div>
        <div className="text-sm font-bold text-green-800">Forest Cover: {progress}% ({healthyCount}/9 cells)</div>
      </div>

      {/* Forest grid */}
      <div className="grid grid-cols-3 gap-2">
        {cells.map(cell => (
          <motion.button key={cell.id}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => applyAction(cell)}
            disabled={phase !== 'action'}
            className="rounded-xl p-3 flex flex-col items-center gap-1 border-2 transition-all"
            style={{ background: CELL_COLOR[cell.state] + '55', borderColor: CELL_COLOR[cell.state] }}
          >
            <span className="text-3xl">{CELL_EMOJI[cell.state]}</span>
            <span className="text-[10px] font-bold" style={{ color: CELL_COLOR[cell.state] === '#2E7D32' ? 'white' : CELL_COLOR[cell.state] }}>
              {CELL_LABEL[cell.state]}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Action selector */}
      <div>
        <div className="text-xs font-bold text-gray-500 mb-2">🌳 Choose your action:</div>
        <div className="grid grid-cols-3 gap-1.5">
          {Object.entries(THREAT_ACTIONS).map(([key, action]) => (
            <button key={key}
              onClick={() => setSelectedAction(key === selectedAction ? null : key)}
              disabled={phase !== 'action'}
              className={cn("p-2 rounded-lg border-2 text-center transition-all text-xs font-bold",
                selectedAction === key ? 'border-green-600 bg-green-100 shadow-md' : 'border-gray-200 hover:border-green-400 bg-white',
                phase !== 'action' && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="text-xl">{action.emoji}</div>
              <div className="text-[10px] leading-tight">{action.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Event banner */}
      <AnimatePresence>
        {eventMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-orange-100 border-2 border-orange-400 rounded-xl px-4 py-3 text-sm font-bold text-orange-800 text-center">
            {eventMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log */}
      <div className="bg-green-50 rounded-xl p-3 text-xs space-y-1 max-h-20 overflow-y-auto">
        {log.map((l, i) => <div key={i} className="text-green-800">{l}</div>)}
      </div>

      {phase === 'done' && healthyCount < 6 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 text-sm text-red-700 font-bold text-center">
          🌳 {healthyCount}/9 cells healthy. Need 6+ to win. Keep planting! Reload to try again.
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SDG 13 – Climate Action: Climate Diary
   Choose policies across 3 years, stabilize climate metrics
═══════════════════════════════════════════════════════════════ */

interface ClimatePolicy { id: string; name: string; emoji: string; desc: string; co2: number; temp: number; bio: number; cost: number; }

const CLIMATE_POLICIES: ClimatePolicy[] = [
  { id: 'solar', name: 'Solar & Wind Energy', emoji: '☀️', desc: 'Replace fossil fuels with renewables', co2: -18, temp: -0.15, bio: +8, cost: 3 },
  { id: 'forest', name: 'Reforestation', emoji: '🌳', desc: 'Plant 1 billion trees to absorb CO₂', co2: -12, temp: -0.1, bio: +15, cost: 2 },
  { id: 'industrial', name: 'Emissions Cap', emoji: '🏭', desc: 'Limit industrial carbon emissions', co2: -15, temp: -0.12, bio: +5, cost: 3 },
  { id: 'transit', name: 'Green Transport', emoji: '🚌', desc: 'Electrify buses, trains, cars', co2: -10, temp: -0.08, bio: +3, cost: 2 },
  { id: 'awareness', name: 'Public Education', emoji: '📢', desc: 'Teach sustainable living', co2: -6, temp: -0.05, bio: +6, cost: 1 },
  { id: 'ocean', name: 'Ocean Protection', emoji: '🌊', desc: 'Restore coastal ecosystems', co2: -8, temp: -0.06, bio: +12, cost: 2 },
];

const CLIMATE_EVENTS: { msg: string; co2: number; temp: number; bio: number }[] = [
  { msg: '🌪️ Extreme storm damages coastal cities — CO₂ spikes from emergency power use', co2: +8, temp: +0.1, bio: -5 },
  { msg: '🌡️ Record heatwave hits — biodiversity takes a hit but clean energy adoption rises', co2: -3, temp: +0.12, bio: -8 },
  { msg: '🌱 International climate treaty signed! Bonus CO₂ reduction from global cooperation', co2: -10, temp: -0.05, bio: +5 },
];

function ClimatePuzzle({ onWin }: { onWin: () => void }) {
  const [year, setYear] = useState(1);
  const [co2, setCo2] = useState(415); // target < 400
  const [temp, setTemp] = useState(1.1); // target < 1.5
  const [bio, setBio] = useState(38); // target > 60
  const [budget, setBudget] = useState(8);
  const [chosen, setChosen] = useState<string[]>([]);
  const [phase, setPhase] = useState<'choose' | 'event' | 'done'>('choose');
  const [eventMsg, setEventMsg] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>(['🌍 Climate crisis! Choose wise policies each year to stabilize Earth.']);

  const won = co2 <= 400 && bio >= 60;
  const lost = year > 3 && !won;

  useEffect(() => { if (won) onWin(); }, [won, onWin]);

  const togglePolicy = (id: string) => {
    const policy = CLIMATE_POLICIES.find(p => p.id === id)!;
    if (chosen.includes(id)) {
      setChosen(c => c.filter(x => x !== id));
      setBudget(b => b + policy.cost);
    } else {
      if (budget < policy.cost) return;
      setChosen(c => [...c, id]);
      setBudget(b => b - policy.cost);
    }
  };

  const applyYear = () => {
    if (chosen.length === 0) return;
    const policies = chosen.map(id => CLIMATE_POLICIES.find(p => p.id === id)!);
    let dCo2 = policies.reduce((s, p) => s + p.co2, 0);
    let dTemp = policies.reduce((s, p) => s + p.temp, 0);
    let dBio = policies.reduce((s, p) => s + p.bio, 0);

    // Natural drift
    dCo2 += 3; dTemp += 0.05; dBio -= 2;

    const evt = CLIMATE_EVENTS[year - 1];
    setPhase('event');
    setEventMsg(evt.msg);

    const finalCo2 = Math.round(co2 + dCo2 + evt.co2);
    const finalTemp = Math.round((temp + dTemp + evt.temp) * 100) / 100;
    const finalBio = Math.round(Math.max(0, Math.min(100, bio + dBio + evt.bio)));

    setTimeout(() => {
      setCo2(finalCo2);
      setTemp(finalTemp);
      setBio(finalBio);
      setLog(l => [`📊 Year ${year}: CO₂ ${co2>finalCo2?'↓':'↑'} → ${finalCo2}ppm | Temp ${finalTemp}°C | Biodiversity ${finalBio}%`, ...l.slice(0, 3)]);
      setEventMsg(null);
      if (year >= 3) {
        setPhase('done');
      } else {
        setYear(y => y + 1);
        setChosen([]);
        setBudget(8);
        setPhase('choose');
      }
    }, 2500);
  };

  const co2Target = co2 <= 400;
  const tempTarget = temp <= 1.5;
  const bioTarget = bio >= 60;

  return (
    <div className="flex flex-col gap-4">
      {/* Climate dashboard */}
      <div className="grid grid-cols-3 gap-2 bg-orange-50 rounded-xl p-3">
        <div className="text-center">
          <div className="text-xs font-bold text-gray-500">🌡️ CO₂</div>
          <div className={cn("text-lg font-black", co2Target ? 'text-green-600' : 'text-red-600')}>{co2}ppm</div>
          <div className="text-[10px] text-gray-400">Target: ≤400</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold text-gray-500">🔥 Temp Rise</div>
          <div className={cn("text-lg font-black", tempTarget ? 'text-green-600' : 'text-red-600')}>{temp}°C</div>
          <div className="text-[10px] text-gray-400">Target: ≤1.5°C</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold text-gray-500">🌿 Biodiversity</div>
          <div className={cn("text-lg font-black", bioTarget ? 'text-green-600' : 'text-red-600')}>{bio}%</div>
          <div className="text-[10px] text-gray-400">Target: ≥60%</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm font-bold">
        <span className="text-orange-700">📅 Year {year}/3</span>
        <span className="text-orange-700">💰 Budget: {budget} points</span>
        <span className="text-orange-700">✓ Chosen: {chosen.length}</span>
      </div>

      {/* Policy cards */}
      {phase === 'choose' && (
        <div className="grid grid-cols-2 gap-2">
          {CLIMATE_POLICIES.map(p => {
            const isChosen = chosen.includes(p.id);
            const canAfford = budget >= p.cost || isChosen;
            return (
              <button key={p.id}
                onClick={() => togglePolicy(p.id)}
                disabled={!canAfford}
                className={cn("p-2.5 rounded-xl border-2 text-left transition-all",
                  isChosen ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 hover:border-orange-400 bg-white',
                  !canAfford && 'opacity-40 cursor-not-allowed'
                )}
              >
                <div className="flex items-start gap-1.5">
                  <span className="text-xl">{p.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-xs">{p.name}</div>
                    <div className="text-[10px] text-gray-500">{p.desc}</div>
                    <div className="flex gap-2 mt-1 text-[9px] font-bold">
                      <span className="text-green-600">CO₂ {p.co2}</span>
                      <span className="text-blue-600">Temp {p.temp}</span>
                      <span className="text-purple-600">Bio +{p.bio}</span>
                      <span className="text-orange-600 ml-auto">💰{p.cost}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Simulate year button */}
      {phase === 'choose' && (
        <button
          onClick={applyYear}
          disabled={chosen.length === 0}
          className={cn("w-full py-3 rounded-xl font-black text-white text-sm shadow-lg transition-all",
            chosen.length > 0 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'
          )}
        >
          🌍 Simulate Year {year} →
        </button>
      )}

      {/* Event / Result */}
      <AnimatePresence>
        {eventMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-orange-100 border-2 border-orange-400 rounded-xl px-4 py-3 text-sm font-bold text-orange-800 text-center">
            {eventMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'done' && lost && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 text-sm text-red-700 font-bold text-center">
          🌡️ Climate targets missed. CO₂: {co2} | Biodiversity: {bio}%. Need ≤400ppm & ≥60%. Try again!
        </div>
      )}

      {/* Log */}
      <div className="bg-orange-50 rounded-xl p-3 text-xs space-y-1 max-h-20 overflow-y-auto">
        {log.map((l, i) => <div key={i} className="text-orange-800">{l}</div>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SDG 12 – Responsible Consumption: Reuse Please!
   Sort 12 waste items, then craft new products
═══════════════════════════════════════════════════════════════ */

type WasteCategory = 'recyclable' | 'reusable' | 'compostable' | 'hazardous';

interface WasteItem { id: number; name: string; emoji: string; category: WasteCategory; hint: string; }

const WASTE_ITEMS: WasteItem[] = [
  { id: 1,  name: 'Glass Bottle',    emoji: '🍾', category: 'recyclable',  hint: 'Glass can be melted and remade endlessly!' },
  { id: 2,  name: 'Banana Peel',     emoji: '🍌', category: 'compostable', hint: 'Organic waste turns into rich soil nutrients!' },
  { id: 3,  name: 'Old Chair',       emoji: '🪑', category: 'reusable',    hint: 'Furniture can be repaired or donated!' },
  { id: 4,  name: 'Car Battery',     emoji: '🔋', category: 'hazardous',   hint: 'Batteries contain toxic chemicals — handle safely!' },
  { id: 5,  name: 'Newspaper',       emoji: '📰', category: 'recyclable',  hint: 'Paper can be recycled into new paper products!' },
  { id: 6,  name: 'Leftover Rice',   emoji: '🍚', category: 'compostable', hint: 'Food scraps decompose into compost!' },
  { id: 7,  name: 'Broken Phone',    emoji: '📱', category: 'reusable',    hint: 'E-waste has valuable metals that can be extracted!' },
  { id: 8,  name: 'Paint Can',       emoji: '🪣', category: 'hazardous',   hint: 'Chemical paints require special disposal!' },
  { id: 9,  name: 'Plastic Bottle',  emoji: '🥤', category: 'recyclable',  hint: 'Plastics 1 and 2 are widely recycled!' },
  { id: 10, name: 'Coffee Grounds',  emoji: '☕', category: 'compostable', hint: 'Coffee grounds enrich garden soil!' },
  { id: 11, name: 'Vintage Lamp',    emoji: '🪔', category: 'reusable',    hint: 'Vintage items can be restored and resold!' },
  { id: 12, name: 'Cleaning Spray',  emoji: '🧴', category: 'hazardous',   hint: 'Chemical cleaners pollute waterways if dumped!' },
];

const BIN_CONFIG: { category: WasteCategory; label: string; emoji: string; color: string }[] = [
  { category: 'recyclable',  label: 'Recyclable',  emoji: '♻️', color: '#0288D1' },
  { category: 'reusable',    label: 'Reusable',    emoji: '🔄', color: '#558B2F' },
  { category: 'compostable', label: 'Compostable', emoji: '🌱', color: '#795548' },
  { category: 'hazardous',   label: 'Hazardous',   emoji: '⚠️', color: '#BF360C' },
];

type CraftRecipe = { name: string; emoji: string; materials: WasteCategory[]; points: number };
const CRAFT_RECIPES: CraftRecipe[] = [
  { name: 'Garden Planter', emoji: '🪴', materials: ['recyclable', 'compostable'], points: 15 },
  { name: 'Refurbished Gadget', emoji: '🖥️', materials: ['reusable', 'recyclable'], points: 20 },
  { name: 'Compost Bag', emoji: '🌿', materials: ['compostable', 'compostable'], points: 10 },
  { name: 'Safe Disposal Kit', emoji: '🧯', materials: ['hazardous', 'recyclable'], points: 12 },
];

function ConsumptionPuzzle({ onWin }: { onWin: () => void }) {
  const [items] = useState<WasteItem[]>(WASTE_ITEMS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'sorting' | 'crafting' | 'done'>('sorting');
  const [sorted, setSorted] = useState<{ item: WasteItem; correct: boolean }[]>([]);
  const [craftScores, setCraftScores] = useState<CraftRecipe[]>([]);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selectedBin, setSelectedBin] = useState<WasteCategory | null>(null);
  const [craftLog, setCraftLog] = useState<string[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<Record<WasteCategory, number>>({
    recyclable: 0, reusable: 0, compostable: 0, hazardous: 0,
  });

  const efficiency = sorted.length > 0 ? Math.round((sorted.filter(s => s.correct).length / sorted.length) * 100) : 0;

  const handleSort = (category: WasteCategory) => {
    if (phase !== 'sorting' || currentIdx >= items.length) return;
    const item = items[currentIdx];
    const correct = item.category === category;
    const newSorted = [...sorted, { item, correct }];
    setSorted(newSorted);
    setFeedback({ msg: correct ? `✅ Correct! ${item.hint}` : `❌ ${item.name} goes to ${BIN_CONFIG.find(b=>b.category===item.category)?.label}. ${item.hint}`, ok: correct });

    setAvailableMaterials(prev => ({ ...prev, [item.category]: prev[item.category] + 1 }));

    setTimeout(() => {
      setFeedback(null);
      if (currentIdx + 1 >= items.length) {
        setPhase('crafting');
      } else {
        setCurrentIdx(i => i + 1);
      }
    }, 1800);
  };

  const handleCraft = (recipe: CraftRecipe) => {
    const mats = { ...availableMaterials };
    const needed = [...recipe.materials];
    for (const mat of needed) {
      if ((mats[mat] || 0) <= 0) {
        setCraftLog(l => [`❌ Not enough ${mat} materials to craft ${recipe.name}!`, ...l]);
        return;
      }
      mats[mat]--;
    }
    setAvailableMaterials(mats);
    setCraftScores(prev => [...prev, recipe]);
    setCraftLog(l => [`✅ Crafted: ${recipe.emoji} ${recipe.name} (+${recipe.points} points)!`, ...l]);
  };

  const totalCraftPoints = craftScores.reduce((s, r) => s + r.points, 0);

  useEffect(() => {
    if (phase === 'done' && efficiency >= 70) onWin();
  }, [phase, efficiency, onWin]);

  const finishCrafting = () => {
    setPhase('done');
    if (efficiency < 70) return;
    onWin();
  };

  const currentItem = items[currentIdx];

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-2">
        <span className="text-xs font-bold text-green-800">Sorted: {sorted.length}/{items.length}</span>
        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${(sorted.length / items.length) * 100}%` }} />
        </div>
        <span className={cn("text-xs font-bold", efficiency >= 70 ? 'text-green-700' : 'text-red-600')}>Accuracy: {efficiency}%</span>
      </div>

      {phase === 'sorting' && currentItem && (
        <>
          {/* Current item */}
          <motion.div key={currentIdx} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="flex flex-col items-center gap-2 py-4 bg-white rounded-2xl border-2 border-gray-200">
            <span className="text-6xl">{currentItem.emoji}</span>
            <div className="font-black text-xl">{currentItem.name}</div>
            <div className="text-sm text-gray-500">Which bin does this go in?</div>
          </motion.div>

          {/* Bins */}
          <div className="grid grid-cols-2 gap-2">
            {BIN_CONFIG.map(bin => (
              <motion.button key={bin.category}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => handleSort(bin.category)}
                className="p-3 rounded-xl border-3 font-bold text-white text-sm transition-all shadow-md"
                style={{ background: bin.color, borderColor: bin.color, borderWidth: 3 }}
              >
                <span className="text-2xl block mb-1">{bin.emoji}</span>
                {bin.label}
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div key="fb" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={cn("rounded-xl px-4 py-2.5 text-sm font-semibold text-center",
                  feedback.ok ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-red-50 text-red-800 border-2 border-red-300'
                )}>
                {feedback.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {phase === 'crafting' && (
        <>
          <div className="bg-green-50 rounded-xl p-3">
            <div className="font-bold text-sm text-green-800 mb-2">🏭 Sorting Complete! Accuracy: {efficiency}%</div>
            <div className="text-xs text-gray-600">Materials collected:</div>
            <div className="flex gap-2 flex-wrap mt-1">
              {BIN_CONFIG.map(b => (
                <span key={b.category} className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white" style={{ background: b.color }}>
                  {b.emoji} {b.label}: {availableMaterials[b.category]}
                </span>
              ))}
            </div>
          </div>

          <div className="text-xs font-bold text-gray-500">🛠️ Craft products from your sorted materials:</div>
          <div className="grid grid-cols-2 gap-2">
            {CRAFT_RECIPES.map(recipe => (
              <button key={recipe.name}
                onClick={() => handleCraft(recipe)}
                className="p-2.5 rounded-xl border-2 border-green-300 hover:border-green-500 bg-white text-left transition-all"
              >
                <div className="text-2xl mb-1">{recipe.emoji}</div>
                <div className="font-bold text-xs">{recipe.name}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  Needs: {recipe.materials.map(m => BIN_CONFIG.find(b=>b.category===m)?.emoji).join(' + ')}
                </div>
                <div className="text-[10px] text-green-600 font-bold">+{recipe.points} points</div>
              </button>
            ))}
          </div>

          {craftLog.slice(0, 3).map((l, i) => (
            <div key={i} className="text-xs font-semibold text-center" style={{ color: l.startsWith('✅') ? '#2E7D32' : '#C62828' }}>{l}</div>
          ))}

          <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-2">
            <span className="text-sm font-bold text-green-800">🏆 Craft Points: {totalCraftPoints}</span>
            <span className="text-sm font-bold text-green-800">Items Crafted: {craftScores.length}</span>
          </div>

          <button
            onClick={finishCrafting}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-sm shadow-lg"
          >
            ✅ Complete Challenge!
          </button>
        </>
      )}

      {phase === 'done' && efficiency < 70 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">😔</div>
          <div className="font-bold text-red-700">Accuracy {efficiency}% — need 70%+. Practice makes perfect!</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SDG 2 – Food Conveyor: Catch to Donate • Let Pass to Compost
═══════════════════════════════════════════════════════════════ */
type ConveyorFood = {
  emoji: string;
  name: string;
  tag: 'DONATE' | 'COMPOST';
  tagColor: string;
  reason: string;
};

const FOOD_ITEMS: ConveyorFood[] = [
  { emoji: '🍱', name: 'Surplus Bento',    tag: 'DONATE',  tagColor: '#f59e0b', reason: 'Extra portions — catch for the food bank!' },
  { emoji: '🥛', name: 'Expiring Milk',    tag: 'DONATE',  tagColor: '#f59e0b', reason: 'Expires today — donate while still safe!' },
  { emoji: '🧃', name: 'Juice Box',        tag: 'DONATE',  tagColor: '#f59e0b', reason: 'Closing-time surplus — donate!' },
  { emoji: '🥧', name: 'Extra Pie',        tag: 'DONATE',  tagColor: '#f59e0b', reason: 'End-of-day extra — donate!' },
  { emoji: '🍚', name: 'Leftover Rice',    tag: 'DONATE',  tagColor: '#f59e0b', reason: 'Still safe — donate to shelter!' },
  { emoji: '🥐', name: 'Day-old Croissant',tag: 'DONATE',  tagColor: '#f59e0b', reason: "Yesterday's bread — donate!" },
  { emoji: '🫙', name: 'Canned Beans',     tag: 'DONATE',  tagColor: '#f59e0b', reason: 'Long shelf life — donate to the food pantry!' },
  { emoji: '🍎', name: 'Extra Apples',     tag: 'DONATE',  tagColor: '#f59e0b', reason: 'Surplus fruit — donate!' },
  { emoji: '🍞', name: 'Extra Loaves',     tag: 'DONATE',  tagColor: '#f59e0b', reason: 'Too much bread baked — donate!' },
  { emoji: '🥫', name: 'Tinned Soup',      tag: 'DONATE',  tagColor: '#f59e0b', reason: 'Great for shelters — donate!' },
  { emoji: '🦠', name: 'Moldy Bread',      tag: 'COMPOST', tagColor: '#22c55e', reason: 'Unsafe mold — compost it!' },
  { emoji: '🥩', name: 'Spoiled Meat',     tag: 'COMPOST', tagColor: '#22c55e', reason: 'Expired — compost for safety!' },
  { emoji: '🍳', name: 'Burnt Dish',       tag: 'COMPOST', tagColor: '#22c55e', reason: 'Completely burnt — compost!' },
  { emoji: '🥜', name: 'Rancid Nuts',      tag: 'COMPOST', tagColor: '#22c55e', reason: 'Gone rancid — compost!' },
  { emoji: '🥗', name: 'Wilted Salad',     tag: 'COMPOST', tagColor: '#22c55e', reason: 'Limp and brown — compost!' },
  { emoji: '🍅', name: 'Overripe Tomato',  tag: 'COMPOST', tagColor: '#22c55e', reason: 'Fermented and mushy — compost!' },
  { emoji: '🍌', name: 'Black Banana',     tag: 'COMPOST', tagColor: '#22c55e', reason: 'Way too overripe — compost!' },
  { emoji: '🧀', name: 'Fuzzy Cheese',     tag: 'COMPOST', tagColor: '#22c55e', reason: 'Mold all the way through — compost!' },
  { emoji: '🍄', name: 'Slimy Mushrooms',  tag: 'COMPOST', tagColor: '#22c55e', reason: 'Gone bad — compost!' },
  { emoji: '🫐', name: 'Crushed Berries',  tag: 'COMPOST', tagColor: '#22c55e', reason: 'Squashed and mouldy — compost!' },
];

function shuffleItems(): ConveyorFood[] {
  return [...FOOD_ITEMS].sort(() => Math.random() - 0.5).slice(0, 20);
}

const BELT_TOTAL_MS = 7000;
const ZONE_ENTER_MS = 2200;
const ZONE_EXIT_MS  = 4800;
const WIN_THRESHOLD = 13;

function RestaurantConveyorPuzzle({ onWin }: { onWin: () => void }) {
  const [items] = useState<ConveyorFood[]>(() => shuffleItems());
  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [acted, setActed] = useState(false);
  const [actedRef] = useState({ current: false });
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);

  const current = items[idx];
  const pos = Math.min(100, (elapsed / BELT_TOTAL_MS) * 100);
  const inZone = elapsed >= ZONE_ENTER_MS && elapsed < ZONE_EXIT_MS && !acted;

  useEffect(() => {
    actedRef.current = acted;
  }, [acted]);

  useEffect(() => {
    if (done || feedback) return;
    const t = setInterval(() => {
      setElapsed(e => e + 80);
    }, 80);
    return () => clearInterval(t);
  }, [idx, done, feedback]);

  useEffect(() => {
    if (elapsed >= BELT_TOTAL_MS && !actedRef.current && !feedback && !done) {
      resolveAction(false);
    }
  }, [elapsed]);

  function resolveAction(playerCaught: boolean) {
    if (actedRef.current) return;
    actedRef.current = true;
    setActed(true);
    const item = items[idx];
    const isCorrect = playerCaught ? item.tag === 'DONATE' : item.tag === 'COMPOST';
    if (isCorrect) setCorrect(c => c + 1);
    else setWrong(w => w + 1);
    setFeedback({
      ok: isCorrect,
      msg: isCorrect
        ? `✅ Correct! ${item.reason}`
        : playerCaught
          ? `❌ That should be composted! ${item.reason}`
          : `❌ That needed to be donated! ${item.reason}`,
    });
    setTimeout(() => {
      const next = idx + 1;
      if (next >= items.length) { setDone(true); }
      else {
        actedRef.current = false;
        setIdx(next); setElapsed(0); setActed(false); setFeedback(null);
      }
    }, 2000);
  }

  useEffect(() => {
    if (done && correct >= WIN_THRESHOLD) setTimeout(onWin, 1200);
  }, [done]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
        <span className="text-3xl">🍴</span>
        <div className="flex-1 text-white">
          <div className="font-display text-lg leading-tight">Chef's Conveyor</div>
          <div className="text-xs opacity-80">🤲 CATCH to donate • 🌿 Let PASS to compost</div>
        </div>
        <div className="text-right text-white text-sm font-bold">
          <div>Item {Math.min(idx + 1, items.length)}/{items.length}</div>
          <div className="flex gap-2 mt-0.5">
            <span className="bg-green-500 rounded px-1.5 py-0.5 text-xs">✅ {correct}</span>
            <span className="bg-red-500 rounded px-1.5 py-0.5 text-xs">❌ {wrong}</span>
          </div>
        </div>
      </div>

      {done ? (
        <div className={cn('rounded-2xl p-6 text-center border-4', correct >= WIN_THRESHOLD ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-300')}>
          <div className="text-5xl mb-3">{correct >= WIN_THRESHOLD ? '🏆' : '😔'}</div>
          <div className="font-display text-2xl mb-2" style={{ color: correct >= WIN_THRESHOLD ? '#16a34a' : '#dc2626' }}>
            {correct >= WIN_THRESHOLD ? 'Food Rescue Hero!' : 'Keep Practicing!'}
          </div>
          <div className="text-lg font-bold text-gray-700 mb-1">{correct}/{items.length} correct</div>
          <div className="text-sm text-gray-500">
            {correct >= WIN_THRESHOLD
              ? 'Amazing! You reduced food waste and fed more people.'
              : `Need ${WIN_THRESHOLD}+. DONATE items → CATCH, COMPOST items → let PASS!`}
          </div>
        </div>
      ) : (
        <>
          {/* Conveyor belt */}
          <div className="relative rounded-2xl overflow-hidden border-4 border-gray-700" style={{ background: '#1e293b', height: 170 }}>
            {/* Moving belt stripes */}
            <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg,#334155 0,#334155 28px,#1e293b 28px,#1e293b 32px)' }} />

            {/* Left end: compost bin */}
            <div className="absolute left-0 top-0 bottom-0 w-14 flex flex-col items-center justify-center gap-1"
              style={{ background: 'linear-gradient(90deg,#0f172a,#1e293b)', borderRight: '2px solid #334155' }}>
              <span className="text-2xl">🌿</span>
              <span className="text-[8px] font-black text-green-400 text-center leading-tight">COM<br/>POST</span>
            </div>

            {/* Right end: kitchen source */}
            <div className="absolute right-0 top-0 bottom-0 w-14 flex flex-col items-center justify-center gap-1"
              style={{ background: 'linear-gradient(270deg,#0f172a,#1e293b)', borderLeft: '2px solid #334155' }}>
              <span className="text-2xl">🍴</span>
              <span className="text-[8px] font-black text-purple-400 text-center leading-tight">KITCH<br/>EN</span>
            </div>

            {/* Catch zone (center) */}
            <div className="absolute top-0 bottom-0 transition-all duration-200"
              style={{
                left: '32%', right: '28%',
                background: inZone ? 'rgba(251,191,36,0.20)' : 'rgba(255,255,255,0.03)',
                border: inZone ? '2px solid #fbbf24' : '2px dashed rgba(255,255,255,0.12)',
                borderRadius: 8,
              }}>
              <div className="absolute top-2 left-0 right-0 text-center">
                <div className="text-[9px] font-black" style={{ color: inZone ? '#fbbf24' : 'rgba(255,255,255,0.25)' }}>
                  🎯 CATCH ZONE
                </div>
                {inZone && <div className="text-[8px] text-yellow-300 font-bold animate-pulse">← ITEM IS HERE →</div>}
              </div>
              {/* Donation basket visual */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <div className="text-[9px] font-bold text-amber-400 flex items-center gap-1">
                  📦 <span style={{ color: inZone ? '#fbbf24' : 'rgba(255,255,255,0.25)' }}>Donation Basket</span>
                </div>
              </div>
            </div>

            {/* Food item on belt */}
            {!feedback && (
              <div className="absolute top-1/2 flex flex-col items-center gap-1 transition-none"
                style={{ right: `${pos}%`, transform: 'translate(50%, -60%)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                  style={{ background: 'linear-gradient(135deg,#f8fafc,#e2e8f0)', boxShadow: '0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.9)' }}>
                  <span className="text-2xl">{current.emoji}</span>
                </div>
                <div className="text-[8px] font-black text-white text-center px-1.5 py-0.5 rounded-full"
                  style={{ background: current.tagColor }}>
                  {current.tag}
                </div>
              </div>
            )}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div key="fb" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={cn('rounded-xl px-4 py-3 text-sm font-semibold text-center border-2',
                  feedback.ok ? 'bg-green-50 text-green-800 border-green-300' : 'bg-red-50 text-red-800 border-red-300')}>
                {feedback.msg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CATCH button */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => resolveAction(true)}
            disabled={!inZone || acted || !!feedback}
            className="w-full py-5 rounded-2xl text-white font-display text-xl font-black transition-all disabled:opacity-40"
            style={{
              background: inZone && !acted && !feedback ? '#f59e0b' : '#78716c',
              boxShadow: inZone && !acted && !feedback ? '0 6px 0 #b45309, 0 8px 24px rgba(245,158,11,0.5)' : '0 4px 0 #57534e',
            }}>
            🤲 CATCH &amp; DONATE!
            <div className="text-xs font-normal opacity-80">
              {inZone && !acted ? 'Item is in the zone — catch it!' : 'Wait for item to reach the catch zone…'}
            </div>
          </motion.button>

          {/* Legend */}
          <div className="flex gap-2 text-[10px] text-gray-500 justify-center flex-wrap">
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-bold">🟡 DONATE → CATCH 🤲</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">🟢 COMPOST → Let PASS 🌿</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Hunger Hub: choose between Farm game or Restaurant game ── */
function HungerHub({ onWin }: { onWin: () => void }) {
  const [mode, setMode] = useState<'select' | 'farm' | 'restaurant'>('select');
  if (mode === 'farm') return <HungerPuzzle onWin={onWin} />;
  if (mode === 'restaurant') return <RestaurantConveyorPuzzle onWin={onWin} />;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-gray-500 text-sm">Choose how you want to fight hunger today!</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button onClick={() => setMode('farm')}
          className="rounded-2xl p-5 border-4 border-green-300 bg-green-50 hover:bg-green-100 text-left transition-all active:scale-95 flex flex-col gap-2">
          <span className="text-4xl">🌾</span>
          <div className="font-display text-xl text-green-800">Farm & Feed</div>
          <div className="text-sm text-green-700">Plant crops, harvest them, and feed hungry citizens before their hunger peaks.</div>
        </button>
        <button onClick={() => setMode('restaurant')}
          className="rounded-2xl p-5 border-4 border-purple-300 bg-purple-50 hover:bg-purple-100 text-left transition-all active:scale-95 flex flex-col gap-2">
          <span className="text-4xl">🍴</span>
          <div className="font-display text-xl text-purple-800">Conveyor Rescue</div>
          <div className="text-sm text-purple-700">Items slide down the belt — CATCH food to donate, or let spoiled food PASS to compost!</div>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PUZZLE MAP & SCREEN WRAPPER
═══════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════
   SDG 7 — ENERGY PUZZLE  (Voltra's Energy Fields)
   Match each city to its ideal clean energy source.
════════════════════════════════════════════════════════════════ */
const EN_CITIES = [
  { id:'c1', name:'Solar Falls',  need:'solar', emoji:'🏙️' },
  { id:'c2', name:'Windy Heights',need:'wind',  emoji:'🏘️' },
  { id:'c3', name:'River Bend',   need:'hydro', emoji:'🌆' },
  { id:'c4', name:'Green Valleys',need:'solar', emoji:'🌇' },
  { id:'c5', name:'Shore Town',   need:'wind',  emoji:'🌃' },
  { id:'c6', name:'Mountain City',need:'hydro', emoji:'🏔️' },
];
const EN_SOURCES = [
  { id:'solar', emoji:'☀️', name:'Solar Panel',  color:'#FF8F00' },
  { id:'wind',  emoji:'💨', name:'Wind Turbine', color:'#1565C0' },
  { id:'hydro', emoji:'💧', name:'Hydropower',   color:'#00838F' },
];

function EnergyPuzzle({ onWin }: { onWin: () => void }) {
  const [cities, setCities] = useState(EN_CITIES.map(c => ({ ...c, assigned: '' })));
  const [selected, setSelected] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>(['⚡ Select an energy source, then click a city to power it!']);
  const allPowered = cities.every(c => c.assigned === c.need);
  useEffect(() => { if (allPowered) onWin(); }, [allPowered, onWin]);
  const assign = (cid: string) => {
    if (!selected) { setLog(l => ['⚠️ Choose an energy source first!', ...l.slice(0,3)]); return; }
    const city = cities.find(c => c.id === cid)!;
    if (city.assigned === city.need) return;
    const ok = selected === city.need;
    setCities(p => p.map(c => c.id === cid ? { ...c, assigned: selected } : c));
    const src = EN_SOURCES.find(s => s.id === selected)!;
    setLog(l => [ok
      ? `✅ ${city.name} powered by ${src.name}! Perfect match!`
      : `⚠️ ${city.name} needs a different source. Try again!`, ...l.slice(0,3)]);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center text-sm font-semibold text-yellow-700 bg-yellow-50 rounded-xl p-2">
        ⚡ Match each city to the right clean energy source to restore power!
      </div>
      <div className="flex gap-3 justify-center flex-wrap">
        {EN_SOURCES.map(src => (
          <motion.button key={src.id} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(selected === src.id ? null : src.id)}
            className={cn('flex flex-col items-center p-3 rounded-xl border-3 font-bold text-sm transition-all',
              selected === src.id ? 'shadow-lg bg-yellow-50' : 'bg-white border-gray-200')}
            style={{ borderWidth: 3, borderColor: selected === src.id ? src.color : '#e5e7eb' }}>
            <span className="text-3xl">{src.emoji}</span>
            <span className="text-xs mt-1">{src.name}</span>
            {selected === src.id && <span className="text-[10px] text-green-600 font-bold">Selected ✓</span>}
          </motion.button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cities.map(city => {
          const powered = city.assigned === city.need;
          const wrong = city.assigned && !powered;
          return (
            <motion.button key={city.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => assign(city.id)}
              className={cn('rounded-xl p-3 text-left border-3 transition-all',
                powered ? 'border-green-400 bg-green-50' :
                wrong   ? 'border-red-300 bg-red-50' :
                selected ? 'border-blue-300 hover:bg-blue-50 cursor-pointer' : 'border-gray-200')}
              style={{ borderWidth: 3 }}>
              <div className="text-2xl mb-1">{powered ? '⚡✅' : city.emoji}</div>
              <div className="font-bold text-xs">{city.name}</div>
              <div className="text-[10px] text-gray-500 mt-1">Needs: {EN_SOURCES.find(s=>s.id===city.need)?.emoji} {city.need}</div>
              {city.assigned && <div className={cn('text-[10px] font-bold mt-0.5', powered ? 'text-green-600' : 'text-red-500')}>
                {powered ? '✅ Powered!' : `❌ Wrong source`}
              </div>}
            </motion.button>
          );
        })}
      </div>
      <div className="bg-gray-800 rounded-xl p-3 max-h-24 overflow-y-auto">
        {log.map((l, i) => <div key={i} className="text-xs text-gray-200 font-mono mb-0.5">{l}</div>)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SDG 8 — INDUSTRY / DECENT WORK PUZZLE  (Gilda's Factory Town)
   Match workers to fair jobs by skill & wage requirements.
════════════════════════════════════════════════════════════════ */
const WORKERS = [
  { id:'w1', name:'Aisha', skill:'tech',    emoji:'👩‍💻', exp:'3 yrs' },
  { id:'w2', name:'Marco', skill:'craft',   emoji:'👨‍🔧', exp:'5 yrs' },
  { id:'w3', name:'Lena',  skill:'care',    emoji:'👩‍⚕️', exp:'2 yrs' },
  { id:'w4', name:'Kwame', skill:'trade',   emoji:'🧑‍🌾', exp:'4 yrs' },
  { id:'w5', name:'Sana',  skill:'edu',     emoji:'👩‍🏫', exp:'6 yrs' },
];
const JOBS = [
  { id:'j1', title:'Software Dev',   need:'tech',  wage:'Fair ✅', emoji:'💻', benefits:'Health+Pension' },
  { id:'j2', title:'Master Craftsman',need:'craft', wage:'Fair ✅', emoji:'🔨', benefits:'Safety+Bonus'   },
  { id:'j3', title:'Community Nurse', need:'care',  wage:'Fair ✅', emoji:'💊', benefits:'Health+Leave'   },
  { id:'j4', title:'Agri-Expert',     need:'trade', wage:'Fair ✅', emoji:'🌾', benefits:'Training+Land'  },
  { id:'j5', title:'Teacher',         need:'edu',   wage:'Fair ✅', emoji:'📚', benefits:'Pension+CPD'    },
];

function IndustryPuzzle({ onWin }: { onWin: () => void }) {
  const [matches, setMatches] = useState<Record<string,string>>({});
  const [selWorker, setSelWorker] = useState<string|null>(null);
  const [log, setLog] = useState<string[]>(['🏭 Select a worker, then click a fair job to match them!']);
  const matched = Object.keys(matches).length;
  useEffect(() => { if (matched === WORKERS.length) onWin(); }, [matched, onWin]);
  const assign = (jid: string) => {
    if (!selWorker) { setLog(l => ['⚠️ Select a worker first!', ...l.slice(0,3)]); return; }
    if (Object.values(matches).includes(jid)) { setLog(l => ['❌ That job is taken!', ...l.slice(0,3)]); return; }
    if (matches[selWorker]) { setLog(l => ['⚠️ Worker already placed. Select a different one.', ...l.slice(0,3)]); return; }
    const w = WORKERS.find(x => x.id === selWorker)!;
    const j = JOBS.find(x => x.id === jid)!;
    const ok = w.skill === j.need;
    if (ok) {
      setMatches(p => ({ ...p, [selWorker]: jid }));
      setLog(l => [`✅ ${w.name} → ${j.title}: Great skills match! ${j.benefits}`, ...l.slice(0,3)]);
    } else {
      setLog(l => [`❌ ${w.name} isn't right for ${j.title}. Skills don't match!`, ...l.slice(0,3)]);
    }
    setSelWorker(null);
  };
  const matchedJobFor = (wid: string) => matches[wid] ? JOBS.find(j => j.id === matches[wid]) : null;
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center text-sm font-semibold text-orange-700 bg-orange-50 rounded-xl p-2">
        🏭 Match each worker to a decent job that fits their skills!
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-gray-500 mb-2">👷 Workers ({matched}/{WORKERS.length} placed)</div>
          <div className="flex flex-col gap-2">
            {WORKERS.map(w => {
              const job = matchedJobFor(w.id);
              return (
                <motion.button key={w.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => !job && setSelWorker(selWorker === w.id ? null : w.id)}
                  className={cn('rounded-xl p-2 text-left border-2 transition-all',
                    job ? 'border-green-400 bg-green-50' :
                    selWorker === w.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50')}>
                  <span className="text-xl mr-2">{w.emoji}</span>
                  <span className="text-xs font-bold">{w.name}</span>
                  <span className="text-[10px] text-gray-500 ml-1">({w.skill}, {w.exp})</span>
                  {job && <div className="text-[10px] text-green-600 font-bold mt-0.5">→ {job.title} ✅</div>}
                  {selWorker === w.id && !job && <div className="text-[10px] text-orange-600 font-bold">Selected — pick a job →</div>}
                </motion.button>
              );
            })}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-500 mb-2">💼 Fair Jobs</div>
          <div className="flex flex-col gap-2">
            {JOBS.map(j => {
              const taken = Object.values(matches).includes(j.id);
              return (
                <motion.button key={j.id} whileHover={{ scale: taken ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => !taken && assign(j.id)}
                  className={cn('rounded-xl p-2 text-left border-2 transition-all',
                    taken ? 'border-green-400 bg-green-50 opacity-70' :
                    selWorker ? 'border-blue-300 bg-blue-50 cursor-pointer' : 'border-gray-200 bg-white')}>
                  <span className="text-xl mr-2">{j.emoji}</span>
                  <span className="text-xs font-bold">{j.title}</span>
                  <div className="text-[10px] text-gray-500">{j.wage} · {j.benefits}</div>
                  {taken && <div className="text-[10px] text-green-600 font-bold">✅ Filled!</div>}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-gray-800 rounded-xl p-3 max-h-20 overflow-y-auto">
        {log.map((l, i) => <div key={i} className="text-xs text-gray-200 font-mono mb-0.5">{l}</div>)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SDG 9 — INNOVATION PUZZLE  (Nexus Innovation Hub)
   Fund infrastructure projects to unlock economic connections.
════════════════════════════════════════════════════════════════ */
const INFRA_PROJECTS = [
  { id:'p1', name:'High-Speed Rail',      emoji:'🚆', cost:3, impact:35, desc:'Connect 3 cities, cut emissions 40%' },
  { id:'p2', name:'Rural Internet Grid',  emoji:'📡', cost:2, impact:28, desc:'Bring broadband to 500k people'      },
  { id:'p3', name:'Clean Water Pipeline', emoji:'🚰', cost:2, impact:32, desc:'Safe water for 200k households'       },
  { id:'p4', name:'Solar Farm',           emoji:'☀️', cost:2, impact:25, desc:'Power 80k homes with clean energy'   },
  { id:'p5', name:'Smart Bridge',         emoji:'🌉', cost:3, impact:30, desc:'Trade link, 20k daily commuters'     },
  { id:'p6', name:'Innovation Lab',       emoji:'🔬', cost:1, impact:18, desc:'100 local startups incubated/year'   },
];
const INFRA_BUDGET = 8;
const INFRA_TARGET = 80;

function InnovationPuzzle({ onWin }: { onWin: () => void }) {
  const [funded, setFunded] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([`🔬 You have ${INFRA_BUDGET} budget tokens. Fund projects to reach ${INFRA_TARGET}+ impact!`]);
  const spent = funded.reduce((s, id) => s + (INFRA_PROJECTS.find(p => p.id === id)?.cost ?? 0), 0);
  const impact = funded.reduce((s, id) => s + (INFRA_PROJECTS.find(p => p.id === id)?.impact ?? 0), 0);
  const won = impact >= INFRA_TARGET;
  useEffect(() => { if (won) onWin(); }, [won, onWin]);
  const toggle = (pid: string) => {
    const proj = INFRA_PROJECTS.find(p => p.id === pid)!;
    if (funded.includes(pid)) {
      setFunded(f => f.filter(x => x !== pid));
      setLog(l => [`💸 Defunded: ${proj.name} (−${proj.cost} tokens)`, ...l.slice(0,3)]);
    } else if (spent + proj.cost > INFRA_BUDGET) {
      setLog(l => [`❌ Not enough budget! (${INFRA_BUDGET - spent} remaining)`, ...l.slice(0,3)]);
    } else {
      setFunded(f => [...f, pid]);
      setLog(l => [`✅ Funded: ${proj.name} (+${proj.impact} impact, −${proj.cost} tokens)`, ...l.slice(0,3)]);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 justify-center text-sm font-bold">
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-xl">
          💰 Budget: {INFRA_BUDGET - spent}/{INFRA_BUDGET}
        </div>
        <div className={cn('px-4 py-2 rounded-xl font-bold', impact >= INFRA_TARGET ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800')}>
          🚀 Impact: {impact}/{INFRA_TARGET} {impact >= INFRA_TARGET && '🎉'}
        </div>
      </div>
      {/* Progress bar */}
      <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
          animate={{ width: `${Math.min(100, impact / INFRA_TARGET * 100)}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {INFRA_PROJECTS.map(proj => {
          const isFunded = funded.includes(proj.id);
          const cantAfford = !isFunded && spent + proj.cost > INFRA_BUDGET;
          return (
            <motion.button key={proj.id} whileHover={{ scale: cantAfford ? 1 : 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => toggle(proj.id)}
              className={cn('rounded-xl p-3 text-left border-3 transition-all',
                isFunded   ? 'border-purple-400 bg-purple-50' :
                cantAfford ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' :
                             'border-gray-200 bg-white hover:bg-purple-50 cursor-pointer')}
              style={{ borderWidth: 3 }}>
              <div className="text-2xl mb-1">{proj.emoji}</div>
              <div className="font-bold text-xs">{proj.name}</div>
              <div className="text-[10px] text-gray-500 my-0.5">{proj.desc}</div>
              <div className="flex gap-2 text-[10px] font-bold mt-1">
                <span className="text-orange-600">💰 {proj.cost}</span>
                <span className="text-blue-600">🚀 +{proj.impact}</span>
                {isFunded && <span className="text-green-600">✅ Funded</span>}
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="bg-gray-800 rounded-xl p-3 max-h-20 overflow-y-auto">
        {log.map((l, i) => <div key={i} className="text-xs text-gray-200 font-mono mb-0.5">{l}</div>)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SDG 10 — COMMUNITIES PUZZLE  (Mira's Community Housing)
   Distribute resources fairly so every community thrives.
════════════════════════════════════════════════════════════════ */
const COMM_NEEDS = [
  { id:'n1', name:'Highland Village',  emoji:'🏔️', need:30, color:'#7B1FA2', desc:'Needs: schools & roads' },
  { id:'n2', name:'Coastal Flats',     emoji:'🌊', need:25, color:'#1565C0', desc:'Needs: flood barriers'  },
  { id:'n3', name:'Urban District',    emoji:'🏙️', need:20, color:'#E65100', desc:'Needs: affordable homes'},
  { id:'n4', name:'Farming Plains',    emoji:'🌾', need:25, color:'#2E7D32', desc:'Needs: irrigation & markets'},
];
const COMM_TOTAL = 100;

function CommunitiesPuzzle({ onWin }: { onWin: () => void }) {
  const [alloc, setAlloc] = useState<Record<string,number>>({ n1:25, n2:25, n3:25, n4:25 });
  const [locked, setLocked] = useState(false);
  const [log, setLog] = useState<string[]>(['🏘️ Distribute 100 resource points. Each community needs its minimum!']);
  const total = Object.values(alloc).reduce((a,b)=>a+b,0);
  const allMet = COMM_NEEDS.every(n => (alloc[n.id]??0) >= n.need);
  useEffect(() => { if (locked && allMet) onWin(); }, [locked, allMet, onWin]);
  const change = (id: string, delta: number) => {
    if (locked) return;
    const cur = alloc[id] ?? 0;
    const newVal = Math.max(0, Math.min(50, cur + delta));
    const diff = newVal - cur;
    const remaining = COMM_TOTAL - total;
    if (diff > 0 && remaining < diff) { setLog(l => ['❌ No resources left to allocate!', ...l.slice(0,3)]); return; }
    setAlloc(p => ({ ...p, [id]: newVal }));
  };
  const commit = () => {
    if (total !== COMM_TOTAL) { setLog(l => [`⚠️ Must allocate exactly ${COMM_TOTAL} points (${total} used)`, ...l.slice(0,3)]); return; }
    setLocked(true);
    if (allMet) setLog(['✅ Every community reached their minimum! Inequalities reduced!']);
    else setLog([`❌ ${COMM_NEEDS.filter(n=>alloc[n.id]<n.need).map(n=>n.name).join(', ')} didn't get enough!`]);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center bg-purple-50 rounded-xl p-3">
        <span className="text-sm font-bold text-purple-800">💰 Remaining: {COMM_TOTAL - total}/{COMM_TOTAL}</span>
        <div className="h-3 w-40 bg-gray-200 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full bg-purple-500" animate={{ width: `${total}%` }} />
        </div>
        <span className="text-xs text-gray-600">{total}/100 used</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {COMM_NEEDS.map(n => {
          const v = alloc[n.id] ?? 0;
          const met = v >= n.need;
          return (
            <div key={n.id} className={cn('rounded-xl p-3 border-3', met ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white')}
              style={{ borderWidth: 3, borderColor: met ? '#4CAF50' : n.color+'55' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{n.emoji}</span>
                <div>
                  <div className="font-bold text-xs">{n.name}</div>
                  <div className="text-[10px] text-gray-500">{n.desc}</div>
                  <div className="text-[10px] font-bold" style={{ color: n.color }}>Min needed: {n.need}</div>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <motion.div className="h-full rounded-full" animate={{ width: `${(v/50)*100}%` }}
                  style={{ background: met ? '#4CAF50' : n.color }} />
              </div>
              <div className="flex items-center gap-2 justify-center">
                <button onClick={() => change(n.id, -5)}
                  className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-lg hover:bg-red-200 disabled:opacity-40"
                  disabled={locked}>−</button>
                <span className="font-bold text-sm w-8 text-center">{v}</span>
                <button onClick={() => change(n.id, 5)}
                  className="w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold text-lg hover:bg-green-200 disabled:opacity-40"
                  disabled={locked}>+</button>
                {met && <span className="text-green-600 text-sm">✅</span>}
              </div>
            </div>
          );
        })}
      </div>
      {!locked && (
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={commit}
          className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700">
          🏘️ Distribute Resources!
        </motion.button>
      )}
      <div className="bg-gray-800 rounded-xl p-3 max-h-20 overflow-y-auto">
        {log.map((l, i) => <div key={i} className="text-xs text-gray-200 font-mono mb-0.5">{l}</div>)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SDG 11 — CITIES PUZZLE  (Skylar's Smart City)
   Choose sustainable options to build a smart city!
════════════════════════════════════════════════════════════════ */
const CITY_CHOICES = [
  { id:'ch1', category:'Transport',  options:[
    { label:'Electric Bus Fleet', score:30, emoji:'🚌' },
    { label:'Highway Expansion',  score:5,  emoji:'🛣️' },
  ]},
  { id:'ch2', category:'Housing',    options:[
    { label:'Green Affordable Homes', score:28, emoji:'🏡' },
    { label:'Luxury Tower Blocks',    score:8,  emoji:'🏢' },
  ]},
  { id:'ch3', category:'Energy',     options:[
    { label:'Solar Microgrids',   score:25, emoji:'☀️' },
    { label:'Coal Power Station', score:3,  emoji:'🏭' },
  ]},
  { id:'ch4', category:'Waste',      options:[
    { label:'Circular Recycling Hub', score:22, emoji:'♻️' },
    { label:'Open Landfill',          score:4,  emoji:'🗑️' },
  ]},
];
const CITY_TARGET = 90;

function CitiesPuzzle({ onWin }: { onWin: () => void }) {
  const [picks, setPicks] = useState<Record<string,number>>({});
  const [log, setLog] = useState<string[]>(['🏙️ Choose the most sustainable option for each city system!']);
  const score = Object.entries(picks).reduce((s, [cid, oi]) => {
    const ch = CITY_CHOICES.find(c => c.id === cid);
    return s + (ch?.options[oi]?.score ?? 0);
  }, 0);
  const maxScore = CITY_CHOICES.reduce((s, c) => s + Math.max(...c.options.map(o=>o.score)), 0);
  const allPicked = Object.keys(picks).length === CITY_CHOICES.length;
  const won = allPicked && score >= CITY_TARGET;
  useEffect(() => { if (won) onWin(); }, [won, onWin]);
  const pick = (cid: string, oi: number) => {
    const ch = CITY_CHOICES.find(c => c.id === cid)!;
    setPicks(p => ({ ...p, [cid]: oi }));
    setLog(l => [`${ch.options[oi].score >= 20 ? '✅' : '⚠️'} ${ch.category}: "${ch.options[oi].label}" chosen`, ...l.slice(0,3)]);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 justify-center">
        <div className={cn('px-4 py-2 rounded-xl font-bold text-sm',
          score >= CITY_TARGET ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800')}>
          🌆 Sustainability Score: {score}/{maxScore} {won && '🎉'}
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-green-400"
          animate={{ width: `${(score/maxScore)*100}%` }} />
      </div>
      <div className="flex flex-col gap-3">
        {CITY_CHOICES.map(ch => (
          <div key={ch.id} className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs font-bold text-gray-600 mb-2">🏗️ {ch.category}</div>
            <div className="flex gap-2">
              {ch.options.map((opt, oi) => {
                const chosen = picks[ch.id] === oi;
                const isGreen = opt.score >= 20;
                return (
                  <motion.button key={oi} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => pick(ch.id, oi)}
                    className={cn('flex-1 rounded-xl p-3 border-3 text-left transition-all text-sm',
                      chosen ? (isGreen ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50')
                               : 'border-gray-200 bg-white hover:bg-blue-50 cursor-pointer')}
                    style={{ borderWidth: 3 }}>
                    <div className="text-2xl mb-1">{opt.emoji}</div>
                    <div className="font-bold text-xs">{opt.label}</div>
                    {chosen && <div className={cn('text-[10px] font-bold mt-1', isGreen ? 'text-green-600' : 'text-red-500')}>
                      {isGreen ? `+${opt.score} points ✅` : `Only +${opt.score} pts ⚠️`}
                    </div>}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {allPicked && !won && (
        <div className="text-center text-red-600 text-sm font-bold">
          ⚠️ Need {CITY_TARGET}+ points. Try more sustainable choices!
          <button onClick={() => { setPicks({}); setLog(['🔄 Reset! Try again with better choices!']); }}
            className="ml-3 px-3 py-1 bg-red-100 rounded-lg text-red-700 hover:bg-red-200">Reset</button>
        </div>
      )}
      <div className="bg-gray-800 rounded-xl p-3 max-h-20 overflow-y-auto">
        {log.map((l, i) => <div key={i} className="text-xs text-gray-200 font-mono mb-0.5">{l}</div>)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SDG 16 — JUSTICE QUEST  (Justia's Peace Court)
   Judge 5 court cases by weighing the evidence correctly.
════════════════════════════════════════════════════════════════ */
const COURT_CASES = [
  { id:'case1', title:'The Contaminated River',
    evidence:['Factory X recorded dumping chemicals 3 nights in a row', 'River fish population dropped 70%', 'Locals report rashes from water use'],
    options:['Fine Factory X & order cleanup','Ignore — need economic growth','Blame the weather'],
    correct:0, explanation:'All evidence points to Factory X. Polluters must be held accountable.' },
  { id:'case2', title:'The Disappearing Land Deed',
    evidence:['Elder Maria held land title for 40 years', 'Developer claims a newer document (unsigned)','No court approved any transfer'],
    options:['Uphold elder\'s original title','Grant developer the land','Split the land 50/50'],
    correct:0, explanation:'An unsigned, unapproved document cannot override a valid 40-year title.' },
  { id:'case3', title:'The Silenced Whistleblower',
    evidence:['Sam reported corruption in writing to authorities', 'Sam was fired the next week', 'Law requires protected status for whistleblowers'],
    options:['Reinstate Sam + investigate corruption','Employer\'s right to fire anyone','Sam should have stayed quiet'],
    correct:0, explanation:'Whistleblower protection laws exist to encourage reporting of corruption.' },
  { id:'case4', title:'The Biased Election',
    evidence:['Voting machines failed in 3 opposition districts only', 'Turnout in those areas was near zero','Repair logs show sabotage'],
    options:['Order a re-vote in affected districts','Certify results as-is','Declare the winner by margin'],
    correct:0, explanation:'Deliberate sabotage of voting infrastructure invalidates those results.' },
  { id:'case5', title:'The Child Labour Factory',
    evidence:['8 children aged 10-14 found working night shifts', 'Factory cited "vocational training"','All children missed school for 6 months'],
    options:['Shut factory, reunite kids with school','Label it \'training\', allow to continue','Fine factory $100 only'],
    correct:0, explanation:'Children\'s right to education and freedom from labour exploitation must be protected.' },
];

function JusticeQuestPuzzle({ onWin }: { onWin: () => void }) {
  const [caseIdx, setCaseIdx] = useState(0);
  const [verdicts, setVerdicts] = useState<Record<string,number>>({});
  const [showResult, setShowResult] = useState(false);
  const [log, setLog] = useState<string[]>(['⚖️ Review the evidence and choose the just verdict for each case!']);
  const done = caseIdx >= COURT_CASES.length;
  const score = done ? COURT_CASES.filter(c => verdicts[c.id] === c.correct).length : 0;
  useEffect(() => { if (done && score >= 4) onWin(); }, [done, score, onWin]);
  const judge = (optIdx: number) => {
    const c = COURT_CASES[caseIdx];
    const ok = optIdx === c.correct;
    setVerdicts(p => ({ ...p, [c.id]: optIdx }));
    setShowResult(true);
    setLog(l => [ok ? `✅ Correct verdict! ${c.explanation}` : `❌ ${c.explanation}`, ...l.slice(0,3)]);
  };
  const next = () => { setShowResult(false); setCaseIdx(i => i+1); };
  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="text-5xl">{score >= 4 ? '⚖️✅' : '⚖️❌'}</div>
        <div className="text-xl font-bold text-center">{score >= 4 ? `Justice served! ${score}/5 correct!` : `Only ${score}/5 correct. Justice needs improvement.`}</div>
        {score < 4 && <motion.button whileHover={{ scale: 1.04 }} onClick={() => { setCaseIdx(0); setVerdicts({}); setShowResult(false); setLog(['⚖️ Try again! Review the evidence carefully.']); }}
          className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl">🔄 Retry</motion.button>}
        <div className="bg-gray-800 rounded-xl p-3 w-full max-h-24 overflow-y-auto">
          {log.map((l, i) => <div key={i} className="text-xs text-gray-200 font-mono mb-0.5">{l}</div>)}
        </div>
      </div>
    );
  }
  const c = COURT_CASES[caseIdx];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-indigo-700">⚖️ Case {caseIdx+1}/{COURT_CASES.length}</span>
        <span className="text-xs text-gray-500">Need 4/5 to win</span>
      </div>
      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
        <div className="font-bold text-indigo-800 mb-2">📋 {c.title}</div>
        <div className="text-xs font-bold text-gray-600 mb-1">Evidence:</div>
        <ul className="list-disc pl-4">
          {c.evidence.map((e, i) => <li key={i} className="text-xs text-gray-700 mb-0.5">• {e}</li>)}
        </ul>
      </div>
      {!showResult ? (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-600">Your Verdict:</div>
          {c.options.map((opt, oi) => (
            <motion.button key={oi} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => judge(oi)}
              className="rounded-xl p-3 text-left border-2 border-indigo-200 bg-white hover:bg-indigo-50 text-sm font-medium">
              {['A','B','C'][oi]}. {opt}
            </motion.button>
          ))}
        </div>
      ) : (
        <div className={cn('rounded-xl p-4 text-sm', verdicts[c.id] === c.correct ? 'bg-green-50 border-2 border-green-400' : 'bg-red-50 border-2 border-red-300')}>
          <div className="font-bold mb-1">{verdicts[c.id] === c.correct ? '✅ Correct!' : '❌ Wrong verdict!'}</div>
          <div className="text-gray-700">{c.explanation}</div>
          <motion.button whileHover={{ scale: 1.04 }} onClick={next}
            className="mt-3 bg-indigo-600 text-white font-bold px-5 py-2 rounded-xl">
            {caseIdx + 1 < COURT_CASES.length ? 'Next Case →' : 'See Results'}
          </motion.button>
        </div>
      )}
      <div className="bg-gray-800 rounded-xl p-3 max-h-20 overflow-y-auto">
        {log.map((l, i) => <div key={i} className="text-xs text-gray-200 font-mono mb-0.5">{l}</div>)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SDG 17 — GLOBAL LINK PUZZLE  (Accord's Global Summit)
   Memory match: pair nations/orgs to their SDG partnership.
════════════════════════════════════════════════════════════════ */
const GP_PAIRS = [
  { id:'gp1', a:'🇰🇪 Kenya', b:'🌱 Reforestation Fund',    topic:'Forest & Climate' },
  { id:'gp2', a:'🇸🇪 Sweden', b:'💡 Clean Tech Transfer',   topic:'Energy Access' },
  { id:'gp3', a:'🇧🇩 Bangladesh', b:'🌊 Flood Adaptation',  topic:'Climate Resilience' },
  { id:'gp4', a:'🇩🇪 Germany', b:'🚌 E-Mobility Aid',       topic:'Sustainable Cities' },
  { id:'gp5', a:'🇲🇽 Mexico', b:'🤝 Education Exchange',    topic:'Quality Education' },
  { id:'gp6', a:'🇮🇳 India', b:'☀️ Solar Export Pact',      topic:'Clean Energy' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function GlobalLinkPuzzle({ onWin }: { onWin: () => void }) {
  const cards = useMemo(() => shuffle(
    GP_PAIRS.flatMap(p => [
      { uid: p.id+'a', pairId: p.id, text: p.a, side: 'a' as const },
      { uid: p.id+'b', pairId: p.id, text: p.b, side: 'b' as const },
    ])
  ), []);
  const [flipped, setFlipped]   = useState<string[]>([]);
  const [matched, setMatched]   = useState<string[]>([]);
  const [locked, setLocked]     = useState(false);
  const [log, setLog]           = useState<string[]>(['🤝 Match each nation to its partnership project!']);
  const won = matched.length === GP_PAIRS.length * 2;
  useEffect(() => { if (won) onWin(); }, [won, onWin]);
  const flip = (uid: string) => {
    if (locked || flipped.includes(uid) || matched.includes(uid)) return;
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setLocked(true);
      const [a, b] = next.map(id => cards.find(c => c.uid === id)!);
      if (a.pairId === b.pairId) {
        const pair = GP_PAIRS.find(p => p.id === a.pairId)!;
        setMatched(m => [...m, a.uid, b.uid]);
        setLog(l => [`✅ Matched! ${a.text} ↔ ${b.text} (${pair.topic})`, ...l.slice(0,3)]);
        setFlipped([]);
        setLocked(false);
      } else {
        setLog(l => [`❌ No match. Try again!`, ...l.slice(0,3)]);
        setTimeout(() => { setFlipped([]); setLocked(false); }, 900);
      }
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between text-sm font-bold">
        <span className="text-purple-700">🤝 Matched: {matched.length/2}/{GP_PAIRS.length} pairs</span>
        <span className="text-gray-500">Click 2 cards to match!</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => {
          const isFlipped  = flipped.includes(card.uid);
          const isMatched  = matched.includes(card.uid);
          const visible    = isFlipped || isMatched;
          return (
            <motion.button key={card.uid}
              whileHover={{ scale: visible ? 1 : 1.06 }} whileTap={{ scale: 0.95 }}
              onClick={() => flip(card.uid)}
              className={cn('rounded-xl p-2 border-2 text-center min-h-[70px] flex items-center justify-center transition-all text-xs font-bold',
                isMatched  ? 'border-green-400 bg-green-50 text-green-800' :
                isFlipped  ? 'border-purple-400 bg-purple-50 text-purple-800' :
                             'border-gray-300 bg-indigo-700 text-indigo-700 hover:bg-indigo-600 cursor-pointer')}>
              {visible ? card.text : '🌐'}
            </motion.button>
          );
        })}
      </div>
      <div className="bg-gray-800 rounded-xl p-3 max-h-20 overflow-y-auto">
        {log.map((l, i) => <div key={i} className="text-xs text-gray-200 font-mono mb-0.5">{l}</div>)}
      </div>
    </div>
  );
}

const PUZZLE_MAP: Partial<Record<ZoneId, React.FC<{ onWin: () => void }>>> = {
  poverty:     PovertyPuzzle,
  hunger:      HungerHub,
  health:      HealthPuzzle,
  education:   EducationPuzzle,
  equality:    EqualityPuzzle,
  water:       WaterPuzzle,
  ocean:       OceanPuzzle,
  forest:      ForestPuzzle,
  climate:     ClimatePuzzle,
  consumption: ConsumptionPuzzle,
  energy:      EnergyPuzzle,
  industry:    IndustryPuzzle,
  innovation:  InnovationPuzzle,
  communities: CommunitiesPuzzle,
  cities:      CitiesPuzzle,
  peace:       JusticeQuestPuzzle,
  partnership: GlobalLinkPuzzle,
};

export default function PuzzleScreen() {
  const [location, setLocation] = useLocation();
  const zoneIdMatch = location.match(/\/puzzle\/(.*)/);
  const zoneId = zoneIdMatch?.[1] as ZoneId;
  const { completeZone } = useGame();
  const [won, setWon] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);

  if (!zoneId || !ZONES[zoneId]) {
    setLocation('/world');
    return null;
  }

  const zone = ZONES[zoneId];
  const PuzzleComponent = PUZZLE_MAP[zoneId];

  const handleWin = () => {
    setWon(true);
    completeZone(zoneId);
    triggerConfetti();
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: zone.bgColor }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 text-white shrink-0" style={{ background: zone.themeColor }}>
        <button onClick={() => setLocation('/world')} className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-sm font-bold transition-colors">
          ← World Map
        </button>
        <div>
          <div className="font-display text-xl">{zone.name} Challenge</div>
          <div className="text-sm opacity-90">SDG {zone.sdg}: {zone.sdgTitle}</div>
        </div>
        {!won && (
          <button
            onClick={() => { setPuzzleKey(k => k + 1); }}
            className="ml-auto bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-sm font-bold transition-colors flex items-center gap-1"
            title="Restart this puzzle">
            ↩ Restart
          </button>
        )}
        <div className={won ? 'ml-auto' : ''}>
          <span className="text-3xl">{zone.emoji}</span>
        </div>
      </div>

      {/* Puzzle content */}
      <div className="flex-1 flex items-start justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white/90 rounded-2xl p-5 sketch-border screen-enter mt-2 mb-6">
          <AnimatePresence mode="wait">
            {!won ? (
              <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-display text-2xl text-center mb-1" style={{ color: zone.themeColor }}>
                  🎮 {zone.description}
                </h2>
                <p className="text-sm text-center text-gray-500 mb-5">{zone.puzzleIntro}</p>
                {PuzzleComponent
                  ? <PuzzleComponent key={puzzleKey} onWin={handleWin} />
                  : <div className="text-center text-gray-400 py-8">🚧 Mini-game coming soon!</div>
                }
              </motion.div>
            ) : (
              <motion.div key="won" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-5 text-center py-6"
              >
                <motion.div animate={{ rotate: [0, -10, 10, -10, 0], y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-7xl">🏆</motion.div>
                <h3 className="font-display text-3xl" style={{ color: zone.themeColor }}>Zone Healed!</h3>
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 max-w-md">
                  <p className="text-sm leading-relaxed text-gray-700">{zone.successFact}</p>
                </div>
                <button onClick={() => setLocation('/world')} className="text-lg py-3 px-8 text-white font-bold rounded-xl shadow-lg sketch-border" style={{ background: zone.themeColor }}>
                  🌟 Return to World!
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
