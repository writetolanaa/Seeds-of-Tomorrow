import { useState, useEffect } from 'react';
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
  { id: 'food', emoji: '🍚', label: 'Food Pack', desc: 'Food +35', cost: 1, apply: (v: Villager) => ({ ...v, food: Math.min(100, v.food + 35) }) },
  { id: 'medicine', emoji: '💊', label: 'Medicine', desc: 'Health +30', cost: 2, apply: (v: Villager) => ({ ...v, health: Math.min(100, v.health + 30) }) },
  { id: 'shelter', emoji: '⛺', label: 'Temp Shelter', desc: 'Housing +20', cost: 1, apply: (v: Villager) => ({ ...v, housing: Math.min(100, v.housing + 20) }) },
];

const DEVELOPMENT_ACTIONS = [
  { id: 'job', emoji: '💼', label: 'Job Training', desc: 'Income +40, Education +15', cost: 3, requiresBasics: true, apply: (v: Villager) => ({ ...v, income: Math.min(100, v.income + 40), education: Math.min(100, v.education + 15) }) },
  { id: 'school', emoji: '📚', label: 'School Enroll', desc: 'Education +45, Income +10', cost: 2, requiresBasics: true, apply: (v: Villager) => ({ ...v, education: Math.min(100, v.education + 45), income: Math.min(100, v.income + 10) }) },
  { id: 'housing', emoji: '🏠', label: 'Fix Housing', desc: 'Housing +40', cost: 2, requiresBasics: false, apply: (v: Villager) => ({ ...v, housing: Math.min(100, v.housing + 40) }) },
  { id: 'micro', emoji: '🌱', label: 'Microfinance', desc: 'Income +50', cost: 3, requiresBasics: true, apply: (v: Villager) => ({ ...v, income: Math.min(100, v.income + 50) }) },
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
  const TOTAL_BUDGET = 12;
  const [villagers, setVillagers] = useState<Villager[]>(INITIAL_VILLAGERS.map(v => ({ ...v })));
  const [budget, setBudget] = useState(TOTAL_BUDGET);
  const [phase, setPhase] = useState<'emergency' | 'develop' | 'event' | 'final'>('emergency');
  const [round, setRound] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: 'info' | 'warn' | 'ok' | 'locked' }>({ text: 'PHASE 1: Emergency Aid — food and medicine first! Select a villager, then choose an action.', type: 'info' });
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
      setMsg({ text: 'PHASE 2: Long-term Development — jobs, school, and housing! Note: struggling villagers cannot train until fed and healthy.', type: 'info' });
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
    if (stab >= 65) setTimeout(onWin, 800);
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
    const won = stability >= 65;
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
              ? <p className="text-sm text-amber-700 bg-amber-50 rounded-xl p-3 border border-amber-200">💡 You kept people alive, but long-term development is what ends poverty. Jobs, education and housing create lasting change!</p>
              : <p className="text-sm text-gray-600">Try helping villagers' basic needs first (food, medicine), then invest in long-term development.</p>
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
          const isLocked = !isEmergency && a.requiresBasics && selectedVillager && getState(selectedVillager) === 'struggling';
          return (
            <motion.button key={a.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={() => isEmergency ? applyEmergency(a.id) : applyDevelopment(a.id)}
              disabled={budget < a.cost}
              className={cn('flex flex-col items-center px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all min-w-[80px]',
                isLocked ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed' :
                budget >= a.cost ? 'bg-white border-amber-400 hover:bg-amber-50 cursor-pointer' : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              <span className="text-xl">{a.emoji}</span>
              <span className="leading-tight">{a.label}</span>
              <span className="text-gray-400 font-normal text-[10px]">{a.desc}</span>
              <span className="text-amber-600 mt-0.5">{a.cost} 🪙</span>
              {isLocked && <span className="text-[9px] text-red-400">🔒 needs basics first</span>}
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

const EducationPuzzle = ({ onWin }: { onWin: () => void }) => {
  const [students, setStudents] = useState<Student[]>([
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
   PUZZLE MAP & SCREEN WRAPPER
═══════════════════════════════════════════════════════════════ */
const PUZZLE_MAP: Record<ZoneId, React.FC<{ onWin: () => void }>> = {
  poverty:   PovertyPuzzle,
  hunger:    HungerPuzzle,
  health:    HealthPuzzle,
  education: EducationPuzzle,
  equality:  EqualityPuzzle,
};

export default function PuzzleScreen() {
  const [location, setLocation] = useLocation();
  const zoneIdMatch = location.match(/\/puzzle\/(.*)/);
  const zoneId = zoneIdMatch?.[1] as ZoneId;
  const { completeZone } = useGame();
  const [won, setWon] = useState(false);

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
        <div className="ml-auto text-3xl">{zone.emoji}</div>
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
                <PuzzleComponent onWin={handleWin} />
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
