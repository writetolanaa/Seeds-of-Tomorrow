import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGame } from '@/context/GameContext';
import { Warden1, Warden2, Warden3 } from '@/components/Sprites';
import { Button } from '@/components/UI';
import { motion } from 'framer-motion';

export default function TitleScreen() {
  const [, setLocation] = useLocation();
  const { startGame, resetGame, isStarted, playerName, playerCharacter } = useGame();
  const [name, setName] = useState('');
  const [selectedChar, setSelectedChar] = useState<number>(1);

  const handleStart = () => {
    startGame(name || 'Warden', selectedChar);
    setLocation('/world');
  };

  const handleContinue = () => {
    setLocation('/world');
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to erase all progress?")) {
      resetGame();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('/images/title-illustration.png')] bg-cover bg-center" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="z-10 flex flex-col items-center max-w-xl w-full bg-card/90 backdrop-blur-sm p-8 sketch-border sketch-shadow"
      >
        <div className="text-5xl mb-1">🌱</div>
        <h1 className="text-5xl md:text-6xl font-display text-center text-foreground mb-1 leading-tight">
          Seeds of Tomorrow
        </h1>
        <h2 className="text-base font-body text-muted-foreground text-center mb-6">
          An SDG Adventure · Elemental Lords
        </h2>

        {isStarted ? (
          <div className="flex flex-col items-center gap-6 w-full">
            <p className="text-xl">Welcome back, {playerName}!</p>
            <div className="w-32 h-32">
              {playerCharacter === 1 && <Warden1 />}
              {playerCharacter === 2 && <Warden2 />}
              {playerCharacter === 3 && <Warden3 />}
            </div>
            <div className="flex gap-4 w-full">
              <Button onClick={handleContinue} className="flex-1">Continue Journey</Button>
              <Button onClick={handleReset} variant="danger" className="flex-1">New Game</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            <div>
              <label className="block font-display text-lg mb-2">Your Name:</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full p-3 text-lg bg-background sketch-border-sm focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={15}
              />
            </div>

            <div>
              <label className="block font-display text-lg mb-4 text-center">Choose your Warden:</label>
              <div className="flex justify-between gap-3">
                {([
                  { num: 1, label: 'Eco Saver',  sub: 'Environment', color: '#3A6B3A' },
                  { num: 2, label: 'Scholar',     sub: 'Education',   color: '#1E3A6E' },
                  { num: 3, label: 'Activist',    sub: 'Community',   color: '#C4572A' },
                ] as const).map(({ num, label, sub, color }) => (
                  <button
                    key={num}
                    onClick={() => setSelectedChar(num)}
                    className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-all ${
                      selectedChar === num
                        ? 'bg-primary/20 sketch-border sketch-shadow scale-105'
                        : 'hover:bg-black/5 sketch-border-sm opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full aspect-square">
                      {num === 1 && <Warden1 />}
                      {num === 2 && <Warden2 />}
                      {num === 3 && <Warden3 />}
                    </div>
                    <span className="mt-1 text-xs font-bold leading-tight" style={{ color }}>{label}</span>
                    <span className="text-[10px] text-gray-500 leading-tight">{sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleStart} className="w-full mt-4 text-xl py-4">
              Start Adventure
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
