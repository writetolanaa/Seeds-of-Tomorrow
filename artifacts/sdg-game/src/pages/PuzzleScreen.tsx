import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGame } from '@/context/GameContext';
import { ZONES, type ZoneId } from '@/data/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

/* ──────────────────────────────────────────────
   SDG 1 – No Poverty: Kind Neighborhood
   Match families to jobs + housing
────────────────────────────────────────────── */
const PovertyPuzzle = ({ onWin }: { onWin: () => void }) => {
  const families = [
    { id: 1, name: 'The Lees', need: 'job', icon: '👨‍👩‍👦', description: 'Dad lost his job last month' },
    { id: 2, name: 'Grandma Rosa', need: 'housing', icon: '👵', description: 'Her roof is broken and leaking' },
    { id: 3, name: 'Young Maya', need: 'training', icon: '👩‍🎓', description: 'Wants to learn new skills' },
  ];
  const resources = [
    { id: 'job', icon: '💼', label: 'Job Offer', desc: 'A local bakery needs workers' },
    { id: 'housing', icon: '🏠', label: 'New Home', desc: 'A warm repaired cottage' },
    { id: 'training', icon: '📋', label: 'Skills Program', desc: 'Free vocational training course' },
  ];

  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<{ id: number; correct: boolean } | null>(null);

  const handleResourceClick = (rid: string) => setSelected(rid);

  const handleFamilyClick = (fid: number, need: string) => {
    if (!selected || matched[fid]) return;
    const correct = selected === need;
    setFeedback({ id: fid, correct });
    setTimeout(() => {
      setFeedback(null);
      if (correct) {
        const newMatched = { ...matched, [fid]: selected };
        setMatched(newMatched);
        setSelected(null);
        if (Object.keys(newMatched).length === families.length) setTimeout(onWin, 600);
      } else {
        setSelected(null);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <p className="text-center text-gray-600 text-sm font-semibold">
        1️⃣ Pick a resource, 2️⃣ then click the right family!
      </p>

      {/* Resources */}
      <div className="flex gap-3 flex-wrap justify-center">
        {resources.map(r => (
          <button
            key={r.id}
            onClick={() => handleResourceClick(r.id)}
            className={cn(
              "flex flex-col items-center p-3 rounded-xl border-2 transition-all w-28",
              selected === r.id
                ? "border-amber-500 bg-amber-100 scale-105 shadow-lg"
                : "border-gray-300 bg-white hover:border-amber-400 hover:bg-amber-50"
            )}
          >
            <span className="text-3xl mb-1">{r.icon}</span>
            <span className="text-xs font-bold text-center">{r.label}</span>
            <span className="text-xs text-gray-500 text-center mt-1">{r.desc}</span>
          </button>
        ))}
      </div>

      <div className="text-2xl">↓</div>

      {/* Families */}
      <div className="flex gap-3 flex-wrap justify-center">
        {families.map(f => {
          const isMatched = matched[f.id];
          const isFeedback = feedback?.id === f.id;
          return (
            <button
              key={f.id}
              onClick={() => handleFamilyClick(f.id, f.need)}
              disabled={!!isMatched}
              className={cn(
                "flex flex-col items-center p-3 rounded-xl border-2 transition-all w-32",
                isMatched
                  ? "border-green-500 bg-green-100"
                  : isFeedback
                    ? feedback!.correct ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50 animate-shake"
                    : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
              )}
            >
              <span className="text-3xl mb-1">{f.icon}</span>
              <span className="text-xs font-bold text-center">{f.name}</span>
              <span className="text-xs text-gray-500 text-center mt-1">{f.description}</span>
              {isMatched && <span className="text-green-600 text-lg mt-1">✓</span>}
              {isFeedback && !feedback!.correct && <span className="text-red-500 text-sm mt-1">Not quite!</span>}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 text-center">✅ Matched: {Object.keys(matched).length}/{families.length}</p>
    </div>
  );
};

/* ──────────────────────────────────────────────
   SDG 2 – Zero Hunger: Grow & Serve
   Water crops to harvest, then feed citizens
────────────────────────────────────────────── */
const HungerPuzzle = ({ onWin }: { onWin: () => void }) => {
  const crops = [
    { id: 1, name: 'Carrot', icon: '🥕', needsWater: 2 },
    { id: 2, name: 'Tomato', icon: '🍅', needsWater: 3 },
    { id: 3, name: 'Corn', icon: '🌽', needsWater: 2 },
  ];
  const citizens = [
    { id: 1, name: 'Ali', wants: 1, icon: '🧑' },
    { id: 2, name: 'Mia', wants: 2, icon: '👧' },
    { id: 3, name: 'Tom', wants: 3, icon: '👦' },
  ];

  const [waterLevels, setWaterLevels] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [harvested, setHarvested] = useState<number[]>([]);
  const [fed, setFed] = useState<number[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<number | null>(null);
  const [phase, setPhase] = useState<'grow' | 'serve'>('grow');

  const water = (cropId: number) => {
    const crop = crops.find(c => c.id === cropId)!;
    const newLevels = { ...waterLevels, [cropId]: Math.min(waterLevels[cropId] + 1, crop.needsWater) };
    setWaterLevels(newLevels);
    if (newLevels[cropId] >= crop.needsWater && !harvested.includes(cropId)) {
      setTimeout(() => {
        setHarvested(prev => {
          const newH = [...prev, cropId];
          if (newH.length === crops.length) setPhase('serve');
          return newH;
        });
      }, 400);
    }
  };

  const handleFeedCitizen = (citizenId: number, wants: number) => {
    if (!selectedCrop || fed.includes(citizenId)) return;
    if (selectedCrop === wants) {
      const newFed = [...fed, citizenId];
      setFed(newFed);
      setSelectedCrop(null);
      if (newFed.length === citizens.length) setTimeout(onWin, 600);
    } else {
      setSelectedCrop(null);
    }
  };

  if (phase === 'serve') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
        <h3 className="font-display text-xl text-center text-amber-800">🎉 Harvest complete! Now feed everyone!</h3>
        <p className="text-sm text-gray-500 text-center">Pick a crop, then click the right person</p>

        <div className="flex gap-3 justify-center flex-wrap">
          {crops.map(crop => {
            const alreadyUsed = fed.some(cid => citizens.find(c => c.id === cid)?.wants === crop.id);
            return (
              <button
                key={crop.id}
                disabled={alreadyUsed}
                onClick={() => setSelectedCrop(crop.id)}
                className={cn(
                  "p-3 rounded-xl border-2 text-3xl transition-all",
                  alreadyUsed ? "opacity-30 border-gray-200" :
                    selectedCrop === crop.id ? "border-amber-500 bg-amber-100 scale-110" :
                      "border-gray-300 bg-white hover:border-amber-400"
                )}
              >
                {crop.icon}
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          {citizens.map(c => {
            const isFed = fed.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => handleFeedCitizen(c.id, c.wants)}
                disabled={isFed}
                className={cn(
                  "flex flex-col items-center p-3 rounded-xl border-2 transition-all w-28",
                  isFed ? "border-green-500 bg-green-100" : "border-gray-300 bg-white hover:border-amber-400 hover:bg-amber-50"
                )}
              >
                <span className="text-3xl">{c.icon}</span>
                <span className="text-sm font-bold mt-1">{c.name}</span>
                <span className="text-xs text-gray-500">wants: {crops.find(cr => cr.id === c.wants)?.icon}</span>
                {isFed && <span className="text-green-600 text-lg">😊</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <h3 className="font-display text-xl text-center text-amber-800">💧 Water your crops to make them grow!</h3>
      <p className="text-xs text-gray-500 text-center">Click the watering can on each crop until it's ready to harvest</p>
      <div className="flex gap-6 justify-center flex-wrap">
        {crops.map(crop => {
          const level = waterLevels[crop.id];
          const isReady = harvested.includes(crop.id);
          return (
            <div key={crop.id} className="flex flex-col items-center gap-2">
              <div className={cn("text-5xl transition-all", isReady && "scale-110")}>
                {isReady ? crop.icon : (level >= crop.needsWater - 1 ? '🌿' : level > 0 ? '🌱' : '🪨')}
              </div>
              <span className="text-sm font-bold">{crop.name}</span>
              <div className="flex gap-1">
                {Array.from({ length: crop.needsWater }).map((_, i) => (
                  <div key={i} className={cn("w-4 h-4 rounded-full border border-blue-300", i < level ? "bg-blue-400" : "bg-gray-200")} />
                ))}
              </div>
              {!isReady && (
                <button
                  onClick={() => water(crop.id)}
                  className="text-2xl hover:scale-125 transition-transform active:scale-100"
                  title="Water this crop!"
                >
                  🚿
                </button>
              )}
              {isReady && <span className="text-green-600 font-bold text-sm">✓ Ready!</span>}
            </div>
          );
        })}
      </div>
      <div className="text-sm text-amber-700 font-semibold">
        Harvested: {harvested.length}/{crops.length} crops
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   SDG 3 – Good Health: Oops! Hospital!
   Choose the right treatment for each patient
────────────────────────────────────────────── */
const HealthPuzzle = ({ onWin }: { onWin: () => void }) => {
  const patients = [
    {
      id: 1, name: 'Mr. Bun', icon: '🧔', issue: 'Too much junk food, stomachache!',
      options: [
        { text: '💊 Give stomach medicine', correct: false, feedback: "Medicine can help, but the real fix is better eating habits!" },
        { text: '🥗 Suggest a healthy diet plan', correct: true, feedback: "Perfect! Preventing the cause is the best medicine!" },
        { text: '🛌 Tell him to sleep more', correct: false, feedback: "Sleep is good, but won't fix the junk food habit!" },
      ]
    },
    {
      id: 2, name: 'Little Zoe', icon: '👧', issue: 'Stressed and can\'t focus at school!',
      options: [
        { text: '💊 Prescribe a focus pill', correct: false, feedback: "Medication isn't always the first answer for stress!" },
        { text: '📺 Let her watch more TV', correct: false, feedback: "That could make stress worse! She needs activity." },
        { text: '🏃 Exercise + counseling', correct: true, feedback: "Yes! Physical activity and talking about feelings is the best approach!" },
      ]
    },
    {
      id: 3, name: 'Grandpa Joe', icon: '👴', issue: 'Coughing from air pollution near his home!',
      options: [
        { text: '💊 Give cough drops forever', correct: false, feedback: "That only treats the symptom, not the cause!" },
        { text: '🌳 Move him to a clean air area + plant trees', correct: true, feedback: "Amazing! Fixing the environment IS healthcare!" },
        { text: '🚪 Keep him inside always', correct: false, feedback: "Isolation isn't a health solution. Clean air is!" },
      ]
    },
  ];

  const [current, setCurrent] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ text: string; correct: boolean } | null>(null);
  const [solved, setSolved] = useState(0);

  const handleAnswer = (opt: { text: string; correct: boolean; feedback: string }) => {
    setShowFeedback({ text: opt.feedback, correct: opt.correct });
    if (opt.correct) {
      setTimeout(() => {
        setShowFeedback(null);
        const newSolved = solved + 1;
        setSolved(newSolved);
        if (current < patients.length - 1) {
          setCurrent(c => c + 1);
        } else {
          setTimeout(onWin, 400);
        }
      }, 1800);
    } else {
      setTimeout(() => setShowFeedback(null), 1800);
    }
  };

  const patient = patients[current];

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      <div className="flex gap-2 justify-center">
        {patients.map((p, i) => (
          <div key={p.id} className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm",
            i < solved ? "border-green-500 bg-green-100 text-green-700" :
              i === current ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-50"
          )}>
            {i < solved ? '✓' : i + 1}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 sketch-border w-full text-center">
        <div className="text-5xl mb-2">{patient.icon}</div>
        <h3 className="font-bold text-lg">{patient.name}</h3>
        <p className="text-gray-600 mt-1 text-sm">"{patient.issue}"</p>
      </div>

      <AnimatePresence mode="wait">
        {showFeedback ? (
          <motion.div
            key="feedback"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "w-full p-4 rounded-xl text-center font-semibold text-sm",
              showFeedback.correct ? "bg-green-100 text-green-800 border-2 border-green-400" : "bg-red-100 text-red-800 border-2 border-red-400"
            )}
          >
            {showFeedback.correct ? "✅ " : "❌ "}{showFeedback.text}
          </motion.div>
        ) : (
          <motion.div key="options" className="flex flex-col gap-3 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xs text-center text-gray-500 font-semibold">Choose the best treatment:</p>
            {patient.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="w-full p-3 text-left rounded-xl border-2 border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 transition-all text-sm font-medium"
              >
                {opt.text}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ──────────────────────────────────────────────
   SDG 4 – Quality Education: My Real School
   Assign students to classes + activities
────────────────────────────────────────────── */
const EducationPuzzle = ({ onWin }: { onWin: () => void }) => {
  const students = [
    { id: 1, name: 'Sam', icon: '🧒', strength: 'math', mood: 60, needs: 'club' },
    { id: 2, name: 'Aria', icon: '👧', strength: 'art', mood: 50, needs: 'class' },
    { id: 3, name: 'Leo', icon: '👦', strength: 'science', mood: 40, needs: 'counseling' },
  ];
  const actions = [
    { id: 'class', icon: '📖', label: 'Science Class', desc: 'Boosts knowledge & focus' },
    { id: 'club', icon: '⚽', label: 'Sports Club', desc: 'Boosts happiness & social skills' },
    { id: 'counseling', icon: '💬', label: 'Counseling', desc: 'Reduces stress, improves wellbeing' },
  ];

  const [selected, setSelected] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<number, { action: string; mood: number }>>({});
  const [feedback, setFeedback] = useState<{ id: number; correct: boolean } | null>(null);

  const handleAssign = (studentId: number, needs: string) => {
    if (!selected || assigned[studentId]) return;
    const correct = selected === needs;
    setFeedback({ id: studentId, correct });
    setTimeout(() => {
      setFeedback(null);
      if (correct) {
        const newAssigned = { ...assigned, [studentId]: { action: selected, mood: 95 } };
        setAssigned(newAssigned);
        setSelected(null);
        if (Object.keys(newAssigned).length === students.length) setTimeout(onWin, 600);
      } else {
        setSelected(null);
      }
    }, 900);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto">
      <p className="text-sm text-center text-gray-600 font-semibold">
        🎓 Pick an activity, then assign it to the student who needs it most!
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        {actions.map(a => (
          <button
            key={a.id}
            onClick={() => setSelected(a.id)}
            className={cn(
              "flex flex-col items-center p-3 rounded-xl border-2 transition-all w-28",
              selected === a.id
                ? "border-purple-500 bg-purple-100 scale-105"
                : "border-gray-300 bg-white hover:border-purple-400"
            )}
          >
            <span className="text-3xl mb-1">{a.icon}</span>
            <span className="text-xs font-bold text-center">{a.label}</span>
            <span className="text-xs text-gray-400 text-center mt-1">{a.desc}</span>
          </button>
        ))}
      </div>

      <div className="w-full flex gap-3 flex-wrap justify-center">
        {students.map(s => {
          const isAssigned = assigned[s.id];
          const isFeedback = feedback?.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => handleAssign(s.id, s.needs)}
              disabled={!!isAssigned}
              className={cn(
                "flex flex-col items-center p-3 rounded-xl border-2 transition-all w-32",
                isAssigned ? "border-green-500 bg-green-50" :
                  isFeedback ? (feedback!.correct ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50") :
                    "border-gray-300 bg-white hover:border-purple-400"
              )}
            >
              <span className="text-3xl">{s.icon}</span>
              <span className="text-sm font-bold mt-1">{s.name}</span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${isAssigned ? isAssigned.mood : s.mood}%`, background: isAssigned ? '#4CAF50' : '#EF9A9A' }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">Mood: {isAssigned ? '😊 95%' : `😟 ${s.mood}%`}</span>
              {isFeedback && !feedback!.correct && <span className="text-red-500 text-xs mt-1">Try again!</span>}
              {isAssigned && <span className="text-green-600 text-sm font-bold mt-1">✓ Happy!</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   SDG 5 – Gender Equality: Switch the Shoes
   Spot the bias and choose the fair action
────────────────────────────────────────────── */
const EqualityPuzzle = ({ onWin }: { onWin: () => void }) => {
  const scenarios = [
    {
      id: 1,
      situation: "⚽ A girl wants to join the school football team, but the coach says \"Football is for boys!\"",
      options: [
        { text: '🚫 Let the coach decide – it\'s his team.', correct: false, feedback: "That keeps unfair rules in place. Everyone deserves equal opportunities!" },
        { text: '✊ Ask the school principal to allow girls on the team.', correct: true, feedback: "Exactly! Advocating for change creates a fairer school for everyone!" },
        { text: '🤷 Tell the girl to find another sport.', correct: false, feedback: "That's giving up on fairness. She should have the same chance as anyone!" },
      ]
    },
    {
      id: 2,
      situation: "💼 At work, two people do the same job. One gets paid 30% less because of their gender.",
      options: [
        { text: '💰 Accept it – it\'s always been this way.', correct: false, feedback: "\"It's always been this way\" is never a good reason to keep something unfair!" },
        { text: '📢 Report the pay gap to HR and ask for equal pay.', correct: true, feedback: "Yes! Equal pay for equal work is a basic right. Speak up!" },
        { text: '🤫 Stay quiet to avoid trouble.', correct: false, feedback: "Silence lets unfairness continue. Speaking up creates change!" },
      ]
    },
    {
      id: 3,
      situation: "🏠 At home, one sibling always does chores while the other is told \"You don't need to help, that's not for you.\"",
      options: [
        { text: '✓ That\'s normal – some people are better at chores.', correct: false, feedback: "Chores aren't \"for\" any one type of person. Everyone should share responsibilities!" },
        { text: '🤝 Suggest everyone takes turns with all chores equally.', correct: true, feedback: "Perfect! Equal sharing of responsibilities at home builds a fairer world!" },
        { text: '😤 Tell the sibling doing all the chores to complain more.', correct: false, feedback: "Complaining without action doesn't change systems. Suggesting fair rules does!" },
      ]
    },
  ];

  const [current, setCurrent] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ text: string; correct: boolean } | null>(null);
  const [solved, setSolved] = useState(0);
  const [equalityIndex, setEqualityIndex] = useState(20);

  const handleAnswer = (opt: { text: string; correct: boolean; feedback: string }) => {
    setShowFeedback({ text: opt.feedback, correct: opt.correct });
    if (opt.correct) {
      setEqualityIndex(prev => Math.min(100, prev + 27));
      setTimeout(() => {
        setShowFeedback(null);
        const newSolved = solved + 1;
        setSolved(newSolved);
        if (current < scenarios.length - 1) setCurrent(c => c + 1);
        else setTimeout(onWin, 400);
      }, 2000);
    } else {
      setTimeout(() => setShowFeedback(null), 2000);
    }
  };

  const scenario = scenarios[current];

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      {/* Equality Index */}
      <div className="w-full">
        <div className="flex justify-between text-sm font-bold text-orange-700 mb-1">
          <span>⚡ Equality Index</span>
          <span>{equalityIndex}%</span>
        </div>
        <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden sketch-border-sm">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${equalityIndex}%`, background: 'linear-gradient(90deg, #e67e22, #f1c40f)' }}
          />
        </div>
      </div>

      {/* Scenario */}
      <div className="bg-white rounded-2xl p-5 sketch-border w-full">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📍</span>
          <span className="text-sm font-bold text-gray-500">Scenario {current + 1} of {scenarios.length}</span>
        </div>
        <p className="text-sm leading-relaxed text-gray-700">{scenario.situation}</p>
      </div>

      <AnimatePresence mode="wait">
        {showFeedback ? (
          <motion.div
            key="feedback"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "w-full p-4 rounded-xl text-center font-semibold text-sm border-2",
              showFeedback.correct ? "bg-green-100 text-green-800 border-green-400" : "bg-red-100 text-red-800 border-red-400"
            )}
          >
            {showFeedback.correct ? "✅ " : "❌ "}{showFeedback.text}
          </motion.div>
        ) : (
          <motion.div key="options" className="flex flex-col gap-3 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xs text-center text-gray-500 font-semibold">What is the fairest action?</p>
            {scenario.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="w-full p-3 text-left rounded-xl border-2 border-gray-200 bg-white hover:border-orange-400 hover:bg-orange-50 transition-all text-sm font-medium"
              >
                {opt.text}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ──────────────────────────────────────────────
   Main Puzzle Screen
────────────────────────────────────────────── */
const PUZZLE_MAP: Record<ZoneId, React.FC<{ onWin: () => void }>> = {
  poverty: PovertyPuzzle,
  hunger: HungerPuzzle,
  health: HealthPuzzle,
  education: EducationPuzzle,
  equality: EqualityPuzzle,
};

function triggerConfetti() {
  const duration = 3500;
  const end = Date.now() + duration;
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
      <div
        className="px-4 py-3 flex items-center gap-3 text-white"
        style={{ background: zone.themeColor }}
      >
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

      {/* Puzzle area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white/90 rounded-2xl p-6 sketch-border screen-enter">
          <AnimatePresence mode="wait">
            {!won ? (
              <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-display text-2xl text-center mb-2" style={{ color: zone.themeColor }}>
                  🎮 {zone.description}
                </h2>
                <p className="text-sm text-center text-gray-500 mb-6">{zone.puzzleIntro}</p>
                <PuzzleComponent onWin={handleWin} />
              </motion.div>
            ) : (
              <motion.div
                key="won"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-5 text-center py-4"
              >
                <div className="text-6xl animate-bounce">🏆</div>
                <h3 className="font-display text-3xl" style={{ color: zone.themeColor }}>
                  Zone Healed!
                </h3>
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
