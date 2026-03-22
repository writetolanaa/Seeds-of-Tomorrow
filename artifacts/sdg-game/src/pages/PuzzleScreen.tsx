import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGame } from '@/context/GameContext';
import { ZONES, type ZoneId } from '@/data/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import {
  NPC_LeeFather, NPC_LeeMom, NPC_GrandmaRosa, NPC_YoungMaya,
  NPC_BakerHelper, NPC_HouseKeeper, NPC_Trainer,
  NPC_FarmerAli, NPC_CitizenMia, NPC_CitizenTom,
  NPC_MrBun, NPC_LittleZoe, NPC_GrandpaJoe, NPC_DoctorLeaf,
  NPC_StudentSam, NPC_StudentAria, NPC_StudentLeo, NPC_TeacherThinklet,
  NPC_Girl, NPC_Worker, NPC_Sibling, NPC_Advocate,
} from '@/components/Sprites';

/* ── reusable NPC card ── */
function NpcCard({
  Sprite, label, sublabel, selected, matched, error, dim, onClick, size = 'md', bubble,
}: {
  Sprite: React.FC<any>;
  label: string;
  sublabel?: string;
  selected?: boolean;
  matched?: boolean;
  error?: boolean;
  dim?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  bubble?: string;
}) {
  const sz = { sm: 'w-16 h-16', md: 'w-20 h-20 md:w-24 md:h-24', lg: 'w-24 h-24 md:w-28 md:h-28' }[size];
  return (
    <motion.button
      onClick={onClick}
      disabled={matched || dim}
      whileHover={!matched && !dim ? { scale: 1.08 } : {}}
      whileTap={!matched && !dim ? { scale: 0.93 } : {}}
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-2xl border-2 cursor-pointer transition-all relative",
        matched && "border-green-500 bg-green-50",
        error && "border-red-400 bg-red-50 animate-shake",
        selected && !matched && "border-amber-500 bg-amber-50 shadow-lg",
        !matched && !error && !selected && "border-gray-200 bg-white hover:border-amber-300 hover:shadow-md",
        dim && "opacity-30 cursor-default",
      )}
    >
      {bubble && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-xl px-2 py-1 text-xs font-semibold text-gray-700 shadow whitespace-nowrap z-10">
          {bubble}
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
        </div>
      )}
      <div className={sz}>
        <Sprite />
      </div>
      <span className="text-xs font-bold text-gray-800 text-center leading-tight">{label}</span>
      {sublabel && <span className="text-[10px] text-gray-500 text-center leading-tight">{sublabel}</span>}
      {matched && <span className="text-green-600 text-base">✓</span>}
    </motion.button>
  );
}

/* ──────────────────────────────────────────────
   SDG 1 – No Poverty
──────────────────────────────────────────────── */
const PovertyPuzzle = ({ onWin }: { onWin: () => void }) => {
  const resources = [
    { id: 'job', Sprite: NPC_BakerHelper, label: 'Baker Maya', sublabel: 'Has a job offer!', bubble: '💼 We\'re hiring!' },
    { id: 'housing', Sprite: NPC_HouseKeeper, label: 'Builder Ben', sublabel: 'Has a new cottage!', bubble: '🏠 Home ready!' },
    { id: 'training', Sprite: NPC_Trainer, label: 'Coach Lily', sublabel: 'Runs a skills class!', bubble: '📋 Free training!' },
  ];
  const families = [
    { id: 1, need: 'job', Sprite: NPC_LeeFather, label: 'The Lees', sublabel: 'Dad needs a job', bubble: '😟 No work...' },
    { id: 2, need: 'housing', Sprite: NPC_GrandmaRosa, label: 'Grandma Rosa', sublabel: 'Roof is broken', bubble: '😢 Leaking roof' },
    { id: 3, need: 'training', Sprite: NPC_YoungMaya, label: 'Young Maya', sublabel: 'Wants new skills', bubble: '🌟 I want to learn!' },
  ];

  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<number | null>(null);
  const [hint, setHint] = useState('Click a helper NPC above, then click the right family!');

  const handleResource = (rid: string, name: string) => {
    setSelected(rid);
    setHint(`You picked ${name}! Now find the right family for them 👇`);
  };

  const handleFamily = (fid: number, need: string, name: string) => {
    if (!selected || matched[fid]) return;
    if (selected === need) {
      const newM = { ...matched, [fid]: true };
      setMatched(newM);
      setSelected(null);
      setHint(Object.keys(newM).length < families.length ? '🎉 Great match! Keep going!' : '');
      if (Object.keys(newM).length === families.length) setTimeout(onWin, 700);
    } else {
      setError(fid);
      setHint(`❌ Hmm, try a different helper for ${name}!`);
      setTimeout(() => { setError(null); setSelected(null); }, 900);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm font-semibold text-amber-800 text-center">
        {hint}
      </div>

      {/* Helper NPCs */}
      <div>
        <p className="text-xs text-center text-gray-500 mb-3 font-bold uppercase tracking-wide">Community Helpers</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {resources.map(r => {
            const alreadyUsed = Object.entries(matched).some(([fid, done]) => {
              if (!done) return false;
              const fam = families.find(f => f.id === Number(fid));
              return fam?.need === r.id;
            });
            return (
              <NpcCard
                key={r.id}
                Sprite={r.Sprite}
                label={r.label}
                sublabel={r.sublabel}
                bubble={!alreadyUsed && !selected ? r.bubble : undefined}
                selected={selected === r.id}
                matched={alreadyUsed}
                onClick={() => !alreadyUsed && handleResource(r.id, r.label)}
                size="md"
              />
            );
          })}
        </div>
      </div>

      <div className="w-full flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-lg">↓</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Family NPCs */}
      <div>
        <p className="text-xs text-center text-gray-500 mb-3 font-bold uppercase tracking-wide">Families who need help</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {families.map(f => (
            <NpcCard
              key={f.id}
              Sprite={f.Sprite}
              label={f.label}
              sublabel={f.sublabel}
              bubble={!matched[f.id] ? f.bubble : '😊 Thank you!'}
              matched={matched[f.id]}
              error={error === f.id}
              onClick={() => handleFamily(f.id, f.need, f.label)}
              size="md"
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">Matched: {Object.keys(matched).length}/{families.length}</p>
    </div>
  );
};

/* ──────────────────────────────────────────────
   SDG 2 – Zero Hunger
──────────────────────────────────────────────── */
const HungerPuzzle = ({ onWin }: { onWin: () => void }) => {
  const crops = [
    { id: 1, emoji: '🥕', name: 'Carrot', max: 2 },
    { id: 2, emoji: '🍅', name: 'Tomato', max: 3 },
    { id: 3, emoji: '🌽', name: 'Corn', max: 2 },
  ];
  const citizens = [
    { id: 1, Sprite: NPC_CitizenMia, name: 'Mia', wants: 1, bubble: '🥕 I love carrots!' },
    { id: 2, Sprite: NPC_FarmerAli, name: 'Ali', wants: 2, bubble: '🍅 Tomatoes please!' },
    { id: 3, Sprite: NPC_CitizenTom, name: 'Tom', wants: 3, bubble: '🌽 Any corn left?' },
  ];

  const [water, setWater] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [harvested, setHarvested] = useState<number[]>([]);
  const [fed, setFed] = useState<number[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<number | null>(null);
  const [phase, setPhase] = useState<'grow' | 'serve'>('grow');
  const [hint, setHint] = useState('Water each crop by clicking the 🚿 until it\'s ready!');

  const doWater = (id: number) => {
    const crop = crops.find(c => c.id === id)!;
    const next = Math.min(water[id] + 1, crop.max);
    const newW = { ...water, [id]: next };
    setWater(newW);
    if (next >= crop.max && !harvested.includes(id)) {
      setTimeout(() => {
        setHarvested(prev => {
          const h = [...prev, id];
          if (h.length === crops.length) {
            setPhase('serve');
            setHint('All crops harvested! Pick a food, then give it to the right person!');
          }
          return h;
        });
      }, 300);
    }
  };

  const handleFeed = (citizenId: number, wants: number, name: string) => {
    if (!selectedCrop || fed.includes(citizenId)) return;
    if (selectedCrop === wants) {
      const newFed = [...fed, citizenId];
      setFed(newFed);
      setSelectedCrop(null);
      setHint(newFed.length < citizens.length ? `🎉 ${name} is happy! Keep feeding!` : '');
      if (newFed.length === citizens.length) setTimeout(onWin, 700);
    } else {
      setSelectedCrop(null);
      setHint(`❌ That's not what ${name} wanted! Try again.`);
    }
  };

  if (phase === 'serve') {
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm font-semibold text-amber-800 text-center">
          {hint}
        </div>
        <div>
          <p className="text-xs text-center text-gray-500 mb-3 font-bold uppercase tracking-wide">🌾 Harvested Crops</p>
          <div className="flex gap-4 justify-center">
            {crops.map(c => {
              const used = fed.some(fid => citizens.find(ci => ci.id === fid)?.wants === c.id);
              return (
                <motion.button
                  key={c.id}
                  onClick={() => !used && setSelectedCrop(c.id)}
                  disabled={used}
                  whileHover={!used ? { scale: 1.15 } : {}}
                  whileTap={!used ? { scale: 0.9 } : {}}
                  className={cn(
                    "w-16 h-16 rounded-2xl border-2 text-3xl flex items-center justify-center transition-all",
                    used ? "opacity-30 border-gray-200 cursor-default" :
                      selectedCrop === c.id ? "border-amber-500 bg-amber-100 shadow-lg scale-110" :
                        "border-gray-300 bg-white hover:border-amber-400"
                  )}
                >
                  {c.emoji}
                </motion.button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-xs text-center text-gray-500 mb-3 font-bold uppercase tracking-wide">🧑 Hungry Villagers</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {citizens.map(c => (
              <NpcCard
                key={c.id}
                Sprite={c.Sprite}
                label={c.name}
                bubble={fed.includes(c.id) ? '😊 Thank you!' : c.bubble}
                matched={fed.includes(c.id)}
                onClick={() => handleFeed(c.id, c.wants, c.name)}
                size="md"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm font-semibold text-amber-800 text-center">
        {hint}
      </div>
      <div className="flex gap-6 justify-center flex-wrap">
        {crops.map(c => {
          const lvl = water[c.id];
          const ready = harvested.includes(c.id);
          return (
            <div key={c.id} className="flex flex-col items-center gap-2 bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm">
              <div className={cn("text-5xl transition-all", ready ? "scale-125" : lvl > 0 ? "scale-110" : "scale-100")}>
                {ready ? c.emoji : lvl >= c.max - 1 ? '🌿' : lvl > 0 ? '🌱' : '🪨'}
              </div>
              <p className="font-bold text-sm">{c.name}</p>
              <div className="flex gap-1">
                {Array.from({ length: c.max }).map((_, i) => (
                  <div key={i} className={cn("w-5 h-5 rounded-full border-2 border-blue-300 flex items-center justify-center text-xs",
                    i < lvl ? "bg-blue-400 text-white" : "bg-gray-100")}>{i < lvl ? '💧' : ''}</div>
                ))}
              </div>
              {!ready ? (
                <motion.button
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => doWater(c.id)}
                  className="text-3xl cursor-pointer select-none"
                >🚿</motion.button>
              ) : (
                <span className="text-green-600 font-bold text-sm">✓ Ready!</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">Harvested: {harvested.length}/{crops.length}</p>
    </div>
  );
};

/* ──────────────────────────────────────────────
   SDG 3 – Good Health
──────────────────────────────────────────────── */
const HealthPuzzle = ({ onWin }: { onWin: () => void }) => {
  const patients = [
    {
      Sprite: NPC_MrBun, name: 'Mr. Bun', issue: 'Tummy hurts from junk food!',
      options: [
        { label: 'Give medicine', emoji: '💊', correct: false, feedback: "Medicine masks it — but the real fix is eating better!" },
        { label: 'Healthy diet plan', emoji: '🥗', correct: true, feedback: "Yes! Preventing the cause is the best cure!" },
        { label: 'Just sleep more', emoji: '🛌', correct: false, feedback: "Good idea but won't fix the junk food habit!" },
      ],
    },
    {
      Sprite: NPC_LittleZoe, name: 'Little Zoe', issue: 'Stressed & can\'t focus at school!',
      options: [
        { label: 'Focus pill', emoji: '💊', correct: false, feedback: "Medication isn't the first answer to stress." },
        { label: 'More screen time', emoji: '📺', correct: false, feedback: "Screens can increase stress, not reduce it!" },
        { label: 'Exercise + talk it out', emoji: '🏃', correct: true, feedback: "Brilliant! Movement & counseling are the best combo!" },
      ],
    },
    {
      Sprite: NPC_GrandpaJoe, name: 'Grandpa Joe', issue: 'Coughing from polluted air!',
      options: [
        { label: 'Cough drops forever', emoji: '💊', correct: false, feedback: "That only treats symptoms, not the cause!" },
        { label: 'Clean air + plant trees', emoji: '🌳', correct: true, feedback: "Amazing! A healthy environment IS healthcare!" },
        { label: 'Stay inside always', emoji: '🚪', correct: false, feedback: "Isolation isn't a solution — clean air is the answer!" },
      ],
    },
  ];

  const [current, setCurrent] = useState(0);
  const [solved, setSolved] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null);

  const handleAnswer = (opt: { label: string; emoji: string; correct: boolean; feedback: string }) => {
    setFeedback({ text: opt.feedback, correct: opt.correct });
    if (opt.correct) {
      setTimeout(() => {
        setFeedback(null);
        const ns = solved + 1;
        setSolved(ns);
        if (current < patients.length - 1) setCurrent(c => c + 1);
        else setTimeout(onWin, 400);
      }, 2000);
    } else {
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const p = patients[current];

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      {/* Progress dots */}
      <div className="flex gap-3 justify-center">
        {patients.map((pt, i) => (
          <div key={i} className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold",
            i < solved ? "border-green-500 bg-green-100 text-green-700" :
              i === current ? "border-blue-400 bg-blue-100 text-blue-700" : "border-gray-300 bg-gray-50 text-gray-400"
          )}>
            {i < solved ? '✓' : i + 1}
          </div>
        ))}
      </div>

      {/* Patient NPC */}
      <motion.div key={current} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center gap-2">
        <div className="w-28 h-28">
          <p.Sprite />
        </div>
        <div className="bg-white rounded-2xl sketch-border px-4 py-3 text-center max-w-xs">
          <p className="font-bold text-base">{p.name}</p>
          <p className="text-sm text-gray-600 mt-1">"{p.issue}"</p>
        </div>
      </motion.div>

      {/* Doctor NPC */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14">
          <NPC_DoctorLeaf />
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs font-semibold text-green-800">
          What's the best treatment? 🩺
        </div>
      </div>

      <AnimatePresence mode="wait">
        {feedback ? (
          <motion.div
            key="fb"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn("w-full p-4 rounded-xl text-center font-semibold text-sm border-2",
              feedback.correct ? "bg-green-100 text-green-800 border-green-400" : "bg-red-100 text-red-800 border-red-400")}
          >
            {feedback.correct ? '✅ ' : '❌ '}{feedback.text}
          </motion.div>
        ) : (
          <motion.div key="opts" className="flex gap-3 justify-center flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {p.options.map((opt, i) => (
              <motion.button
                key={i}
                onClick={() => handleAnswer(opt)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white hover:border-green-400 hover:shadow-md transition-all w-28"
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-xs font-bold text-center">{opt.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ──────────────────────────────────────────────
   SDG 4 – Quality Education
──────────────────────────────────────────────── */
const EducationPuzzle = ({ onWin }: { onWin: () => void }) => {
  const activities = [
    { id: 'club', Sprite: NPC_TeacherThinklet, label: 'Sports Coach', sublabel: '⚽ Join the club!', bubble: 'Physical fun!' },
    { id: 'class', Sprite: NPC_TeacherThinklet, label: 'Sci Teacher', sublabel: '🔬 Lab time!', bubble: 'Explore science!' },
    { id: 'counseling', Sprite: NPC_TeacherThinklet, label: 'Counselor', sublabel: '💬 Talk it out', bubble: 'I\'m here for you!' },
  ];
  const students = [
    { id: 1, Sprite: NPC_StudentSam, name: 'Sam', needs: 'club', issue: 'Lonely & needs friends', bubble: '😟 No friends yet...' },
    { id: 2, Sprite: NPC_StudentAria, name: 'Aria', needs: 'class', issue: 'Loves science, no lab!', bubble: '🔬 I want to experiment!' },
    { id: 3, Sprite: NPC_StudentLeo, name: 'Leo', needs: 'counseling', issue: 'Stressed & overwhelmed', bubble: '😰 Too much pressure!' },
  ];

  const [selected, setSelected] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<number | null>(null);
  const [hint, setHint] = useState('Click a teacher or coach, then click the right student!');

  const handleActivity = (id: string, label: string) => {
    setSelected(id);
    setHint(`${label} is ready! Find the right student for them 👇`);
  };

  const handleStudent = (sid: number, needs: string, name: string) => {
    if (!selected || assigned[sid]) return;
    if (selected === needs) {
      const newA = { ...assigned, [sid]: true };
      setAssigned(newA);
      setSelected(null);
      setHint(Object.keys(newA).length < students.length ? `🎉 ${name} is so happy! Keep going!` : '');
      if (Object.keys(newA).length === students.length) setTimeout(onWin, 700);
    } else {
      setError(sid);
      setHint(`❌ ${name} needs something different! Try another option.`);
      setTimeout(() => { setError(null); setSelected(null); }, 900);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 text-sm font-semibold text-purple-800 text-center">
        {hint}
      </div>

      <div>
        <p className="text-xs text-center text-gray-500 mb-3 font-bold uppercase tracking-wide">Staff & Teachers</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {activities.map((a, i) => {
            const used = Object.entries(assigned).some(([sid, ok]) => {
              if (!ok) return false;
              return students.find(s => s.id === Number(sid))?.needs === a.id;
            });
            return (
              <NpcCard
                key={a.id + i}
                Sprite={a.Sprite}
                label={a.label}
                sublabel={a.sublabel}
                bubble={!used && !selected ? a.bubble : undefined}
                selected={selected === a.id && !used}
                matched={used}
                dim={used}
                onClick={() => !used && handleActivity(a.id, a.label)}
              />
            );
          })}
        </div>
      </div>

      <div className="w-full flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-lg">↓</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div>
        <p className="text-xs text-center text-gray-500 mb-3 font-bold uppercase tracking-wide">Students</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {students.map(s => (
            <NpcCard
              key={s.id}
              Sprite={s.Sprite}
              label={s.name}
              sublabel={s.issue}
              bubble={assigned[s.id] ? '😊 Thank you!' : s.bubble}
              matched={assigned[s.id]}
              error={error === s.id}
              onClick={() => handleStudent(s.id, s.needs, s.name)}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">Helped: {Object.keys(assigned).length}/{students.length} students</p>
    </div>
  );
};

/* ──────────────────────────────────────────────
   SDG 5 – Gender Equality
──────────────────────────────────────────────── */
const EqualityPuzzle = ({ onWin }: { onWin: () => void }) => {
  const scenarios = [
    {
      NpcA: NPC_Girl, nameA: 'Zara', bubbleA: '⚽ I want to play!',
      NpcB: NPC_Worker, nameB: 'Coach Rex', bubbleB: '🚫 Girls can\'t play!',
      situation: 'Coach Rex won\'t let Zara join the football team because she\'s a girl.',
      choices: [
        { Sprite: NPC_Advocate, label: 'Advocate Ana', action: 'Ask the principal to allow all genders on teams', correct: true, feedback: '✅ Yes! Equal access to sports is a right for everyone!' },
        { Sprite: NPC_Sibling, label: 'Bystander Bo', action: 'Say nothing, it\'s the coach\'s rule', correct: false, feedback: '❌ Silence keeps unfair rules alive. We need to speak up!' },
        { Sprite: NPC_Worker, label: 'Bystander Cal', action: 'Tell Zara to find a different sport', correct: false, feedback: '❌ She deserves equal access, not to be pushed away!' },
      ],
    },
    {
      NpcA: NPC_Worker, nameA: 'Priya', bubbleA: '💼 Same work, less pay?',
      NpcB: NPC_Worker, nameB: 'Manager Ed', bubbleB: '💸 It\'s always been this way',
      situation: 'Priya does the same job as her colleague but earns 30% less because of her gender.',
      choices: [
        { Sprite: NPC_Advocate, label: 'Advocate Ana', action: 'Report the pay gap to HR', correct: true, feedback: '✅ Speaking up creates change! Equal pay for equal work!' },
        { Sprite: NPC_Sibling, label: 'Bystander Bo', action: 'Accept it quietly', correct: false, feedback: '❌ "It\'s always been this way" is never a good reason!' },
        { Sprite: NPC_Girl, label: 'Bystander Cam', action: 'Quit and find another job', correct: false, feedback: '❌ Running away doesn\'t fix the system. Advocating does!' },
      ],
    },
    {
      NpcA: NPC_Sibling, nameA: 'Jamie', bubbleA: '🧹 I do all the chores!',
      NpcB: NPC_Worker, nameB: 'Parent Pat', bubbleB: '🏠 That\'s just how it is',
      situation: 'Jamie does all the chores while their sibling is told "that\'s not for you."',
      choices: [
        { Sprite: NPC_Advocate, label: 'Fair Fern', action: 'Suggest everyone shares chores equally', correct: true, feedback: '✅ Equal sharing of responsibilities builds a fairer home!' },
        { Sprite: NPC_Worker, label: 'Bystander Bo', action: 'Agree — some people are better at chores', correct: false, feedback: '❌ Chores aren\'t "for" any one type of person!' },
        { Sprite: NPC_Girl, label: 'Bystander Cal', action: 'Tell Jamie to complain loudly', correct: false, feedback: '❌ Complaining without suggesting fairness doesn\'t help!' },
      ],
    },
  ];

  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null);
  const [solved, setSolved] = useState(0);
  const [equalityBar, setEqualityBar] = useState(15);

  const handleChoice = (choice: { correct: boolean; feedback: string }) => {
    setFeedback({ text: choice.feedback, correct: choice.correct });
    if (choice.correct) {
      setEqualityBar(p => Math.min(100, p + 28));
      setTimeout(() => {
        setFeedback(null);
        const ns = solved + 1;
        setSolved(ns);
        if (current < scenarios.length - 1) setCurrent(c => c + 1);
        else setTimeout(onWin, 400);
      }, 2100);
    } else {
      setTimeout(() => setFeedback(null), 2100);
    }
  };

  const s = scenarios[current];

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto">
      {/* Equality bar */}
      <div className="w-full">
        <div className="flex justify-between text-sm font-bold text-orange-700 mb-1">
          <span>⚡ Equality Index</span>
          <span>{equalityBar}%</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #FF8F00, #FFC107)' }}
            animate={{ width: `${equalityBar}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* Scenario NPCs */}
      <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <div className="flex items-end justify-center gap-6 mb-3">
          <NpcCard Sprite={s.NpcA} label={s.nameA} bubble={s.bubbleA} size="lg" />
          <div className="text-3xl self-center pb-8">😤</div>
          <NpcCard Sprite={s.NpcB} label={s.nameB} bubble={s.bubbleB} size="lg" />
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-center text-gray-700 font-medium">
          {s.situation}
        </div>
      </motion.div>

      <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Who does the fairest thing?</p>

      <AnimatePresence mode="wait">
        {feedback ? (
          <motion.div
            key="fb"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn("w-full p-4 rounded-xl text-center font-semibold text-sm border-2",
              feedback.correct ? "bg-green-100 text-green-800 border-green-400" : "bg-red-100 text-red-800 border-red-400")}
          >
            {feedback.text}
          </motion.div>
        ) : (
          <motion.div key="choices" className="flex gap-3 justify-center flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {s.choices.map((c, i) => (
              <NpcCard
                key={i}
                Sprite={c.Sprite}
                label={c.label}
                sublabel={c.action}
                onClick={() => handleChoice(c)}
                size="sm"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ──────────────────────────────────────────────
   Main Puzzle Screen
──────────────────────────────────────────────── */
const PUZZLE_MAP: Record<ZoneId, React.FC<{ onWin: () => void }>> = {
  poverty: PovertyPuzzle,
  hunger: HungerPuzzle,
  health: HealthPuzzle,
  education: EducationPuzzle,
  equality: EqualityPuzzle,
};

function triggerConfetti() {
  const end = Date.now() + 3500;
  const colors = ['#4CAF50', '#81C784', '#FFD700', '#FF80AB', '#64B5F6'];
  const fire = () => {
    if (Date.now() > end) return;
    confetti({ particleCount: 40, spread: 80, origin: { x: Math.random() * 0.6 + 0.2, y: 0.5 }, colors });
    requestAnimationFrame(fire);
  };
  fire();
}

export default function PuzzleScreen() {
  const [location, setLocation] = useLocation();
  const zoneIdMatch = location.match(/\/puzzle\/(.*)/);
  const zoneId = zoneIdMatch?.[1] as ZoneId;
  const { completeZone } = useGame();
  const [won, setWon] = useState(false);

  if (!zoneId || !ZONES[zoneId]) {
    setLocation('/map');
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
      <div className="px-4 py-3 flex items-center gap-3 text-white" style={{ background: zone.themeColor }}>
        <button
          onClick={() => setLocation(`/zone/${zoneId}`)}
          className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-sm font-bold transition-colors"
        >
          ← Back
        </button>
        <div>
          <div className="font-display text-xl">{zone.name} Challenge</div>
          <div className="text-sm opacity-90">SDG {zone.sdg}: {zone.sdgTitle}</div>
        </div>
        <div className="ml-auto text-3xl">{zone.emoji}</div>
      </div>

      {/* Puzzle */}
      <div className="flex-1 flex items-start justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white/90 rounded-2xl p-6 sketch-border screen-enter mt-2">
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
              <motion.div
                key="won"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-5 text-center py-6"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0], y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-7xl"
                >🏆</motion.div>
                <h3 className="font-display text-3xl" style={{ color: zone.themeColor }}>Zone Healed!</h3>
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 max-w-md">
                  <p className="text-sm leading-relaxed text-gray-700">{zone.successFact}</p>
                </div>
                <button
                  onClick={() => setLocation(`/zone/${zoneId}`)}
                  className="text-lg py-3 px-8 text-white font-bold rounded-xl shadow-lg sketch-border"
                  style={{ background: zone.themeColor }}
                >
                  🌟 See the Healed Zone!
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
