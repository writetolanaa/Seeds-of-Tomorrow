import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGame } from '@/context/GameContext';
import { ZONES, ZoneId } from '@/data/gameData';
import { Button } from '@/components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

// --- PUZZLE IMPLEMENTATIONS --- //

// 1. Splashy: Pipe Rotation (Click to rotate 90deg, goal is all 0deg)
const WaterPuzzle = ({ onWin }: { onWin: () => void }) => {
  const [pipes, setPipes] = useState([90, 270, 180, 90]);
  
  const rotate = (idx: number) => {
    const newPipes = [...pipes];
    newPipes[idx] = (newPipes[idx] + 90) % 360;
    setPipes(newPipes);
    if (newPipes.every(p => p === 0)) {
      setTimeout(onWin, 500);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-64 mx-auto">
      {pipes.map((rot, i) => (
        <motion.div
          key={i}
          className="w-24 h-24 bg-card sketch-border flex items-center justify-center cursor-pointer"
          animate={{ rotate: rot }}
          onClick={() => rotate(i)}
        >
          {/* Simple straight pipe SVG */}
          <div className="w-full h-8 bg-blue-400 border-y-4 border-ink relative" />
        </motion.div>
      ))}
      <p className="col-span-2 text-center mt-4 font-display text-muted-foreground">Click pieces to connect the flow straight across!</p>
    </div>
  );
};

// 2. Pebblepuff: Sorting (Click item, then bin)
const EarthPuzzle = ({ onWin }: { onWin: () => void }) => {
  const items = [
    { id: 1, name: 'Apple Core', type: 'compost', icon: '🍎' },
    { id: 2, name: 'Plastic Bottle', type: 'recycle', icon: '🥤' },
    { id: 3, name: 'Newspaper', type: 'recycle', icon: '📰' }
  ];
  const [sorted, setSorted] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleBinClick = (binType: string) => {
    if (selectedItem === null) return;
    const item = items.find(i => i.id === selectedItem);
    if (item?.type === binType) {
      const newSorted = [...sorted, selectedItem];
      setSorted(newSorted);
      setSelectedItem(null);
      if (newSorted.length === items.length) setTimeout(onWin, 500);
    } else {
      // Error feedback could go here
      setSelectedItem(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      <div className="flex gap-4 min-h-[4rem]">
        {items.filter(i => !sorted.includes(i.id)).map(item => (
          <button 
            key={item.id}
            onClick={() => setSelectedItem(item.id)}
            className={cn("text-4xl p-2 sketch-border transition-all", selectedItem === item.id ? "bg-primary/30 scale-110" : "bg-card hover:bg-muted")}
          >
            {item.icon}
          </button>
        ))}
        {sorted.length === items.length && <div className="text-2xl font-display text-primary">All Sorted!</div>}
      </div>
      <div className="flex gap-8 w-full justify-center">
        {['compost', 'recycle'].map(bin => (
          <button 
            key={bin}
            onClick={() => handleBinClick(bin)}
            className="flex-1 max-w-[120px] aspect-square bg-card sketch-border sketch-shadow-hover flex flex-col items-center justify-center cursor-pointer hover:-translate-y-2 transition-transform"
          >
            <span className="text-3xl mb-2">{bin === 'compost' ? '🪱' : '♻️'}</span>
            <span className="font-display capitalize">{bin}</span>
          </button>
        ))}
      </div>
      <p className="text-center font-display text-muted-foreground">Select an item, then select the correct bin.</p>
    </div>
  );
};

// 3. Leaflet: Quiz
const LifePuzzle = ({ onWin }: { onWin: () => void }) => {
  const [step, setStep] = useState(0);
  const questions = [
    { q: "What helps forests grow?", a: "Planting native trees", wrong: "Paving over soil" },
    { q: "Why are bees important?", a: "They pollinate plants", wrong: "They make loud noises" },
  ];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      if (step === questions.length - 1) setTimeout(onWin, 500);
      else setStep(s => s + 1);
    }
  };

  if (step >= questions.length) return null;
  const q = questions[step];

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Tree growth visual */}
      <div className="text-6xl">{step === 0 ? '🌱' : '🌿'}</div>
      <h3 className="text-2xl font-display text-center">{q.q}</h3>
      <div className="flex flex-col gap-4 w-full">
        {/* Randomize order ideally, but keeping static for simplicity here */}
        <Button variant="secondary" onClick={() => handleAnswer(false)}>{q.wrong}</Button>
        <Button onClick={() => handleAnswer(true)}>{q.a}</Button>
      </div>
    </div>
  );
};

// 4. Sparkleflame: Toggles
const EnergyPuzzle = ({ onWin }: { onWin: () => void }) => {
  const [switches, setSwitches] = useState([false, false, false]);
  
  const toggle = (idx: number) => {
    const next = [...switches];
    next[idx] = !next[idx];
    setSwitches(next);
    if (next.every(s => s === true)) setTimeout(onWin, 500);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      <div className="flex gap-8">
        {switches.map((isOn, i) => (
          <div key={i} className="flex flex-col items-center gap-4">
            {/* Turbine icon rotating if ON */}
            <div className={cn("text-5xl transition-transform duration-1000 origin-center", isOn && "animate-spin")}>
              {isOn ? '🌀' : '⚙️'}
            </div>
            <button 
              onClick={() => toggle(i)}
              className={cn("w-12 h-24 sketch-border rounded-full relative transition-colors", isOn ? "bg-green-400" : "bg-red-400")}
            >
              <div className={cn("w-10 h-10 rounded-full bg-white sketch-border-sm absolute left-1 transition-all duration-300", isOn ? "top-1" : "bottom-1")} />
            </button>
          </div>
        ))}
      </div>
      <p className="text-center font-display text-muted-foreground">Turn on all the wind turbines!</p>
    </div>
  );
};

// 5. Baloo: Choice
const JusticePuzzle = ({ onWin }: { onWin: () => void }) => {
  const [chosen, setChosen] = useState(false);

  const handleChoice = (fair: boolean) => {
    if (fair) {
      setChosen(true);
      setTimeout(onWin, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <div className="text-6xl transition-transform duration-1000" style={{ transform: chosen ? 'rotate(0deg)' : 'rotate(15deg)' }}>
        ⚖️
      </div>
      <h3 className="text-xl font-display text-center">Your friend drops their lunch by accident. What do you do?</h3>
      <div className="flex flex-col gap-4 w-full">
        <Button variant="secondary" onClick={() => handleChoice(false)}>Laugh and walk away</Button>
        <Button onClick={() => handleChoice(true)}>Share half of my sandwich</Button>
      </div>
    </div>
  );
};

// 6. Thinklet: Memory (Simplified to 2 pairs for brevity)
const KnowledgePuzzle = ({ onWin }: { onWin: () => void }) => {
  const initialCards = ['A', 'B', 'A', 'B'];
  // Keep things simple: just match A-A, B-B
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const handleFlip = (idx: number) => {
    if (flipped.includes(idx) || matched.includes(idx) || flipped.length === 2) return;
    
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (initialCards[newFlipped[0]] === initialCards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
        if (matched.length + 2 === initialCards.length) setTimeout(onWin, 500);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-64 mx-auto">
      {initialCards.map((val, i) => {
        const isVisible = flipped.includes(i) || matched.includes(i);
        return (
          <button 
            key={i}
            onClick={() => handleFlip(i)}
            className={cn(
              "h-24 sketch-border flex items-center justify-center text-3xl font-display transition-all duration-300",
              isVisible ? "bg-white" : "bg-primary"
            )}
          >
            {isVisible ? val : '?'}
          </button>
        );
      })}
      <p className="col-span-2 text-center font-display text-muted-foreground mt-4">Match the pairs of knowledge!</p>
    </div>
  );
};


// --- MAIN PUZZLE SCREEN COMPONENT --- //
export default function PuzzleScreen() {
  const [location, setLocation] = useLocation();
  const zoneIdMatch = location.match(/\/puzzle\/(.*)/);
  const zoneId = zoneIdMatch?.[1] as ZoneId;
  const { completeZone } = useGame();
  
  const [won, setWin] = useState(false);

  useEffect(() => {
    if (!zoneId || !ZONES[zoneId]) {
      setLocation('/map');
    }
  }, [zoneId, setLocation]);

  if (!zoneId || !ZONES[zoneId]) return null;
  const zone = ZONES[zoneId];

  const handleWin = () => {
    setWin(true);
    completeZone(zoneId);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const PuzzleComponent = {
    water: WaterPuzzle,
    earth: EarthPuzzle,
    life: LifePuzzle,
    energy: EnergyPuzzle,
    justice: JusticePuzzle,
    knowledge: KnowledgePuzzle,
  }[zoneId];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Dynamic background styling */}
      <div className={cn("absolute inset-0 opacity-10 pointer-events-none", zone.bgColorClass)} />
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 w-full max-w-2xl bg-card p-8 sketch-border sketch-shadow relative"
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white sketch-border-sm px-6 py-2">
          <h2 className={cn("font-display text-2xl font-bold", zone.colorClass)}>{zone.name} Challenge</h2>
        </div>

        <div className="mt-8 min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!won ? (
              <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                <PuzzleComponent onWin={handleWin} />
              </motion.div>
            ) : (
              <motion.div key="won" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6 text-center">
                <h3 className="text-4xl font-display text-primary">Success!</h3>
                <p className="text-xl font-body leading-relaxed">{zone.successFact}</p>
                <Button onClick={() => setLocation(`/zone/${zoneId}`)} className="mt-4">
                  See the healed zone!
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
