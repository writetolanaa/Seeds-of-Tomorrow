import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useGame } from '@/context/GameContext';
import { ZONES, type ZoneId } from '@/data/gameData';
import { Button, DialogBox } from '@/components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Warden1, Warden2, Warden3,
  BalooSprite, PebblepuffSprite, LeafletSprite,
  ThinkletSprite, SparkleflameSprite
} from '@/components/Sprites';

const LORD_SPRITES: Record<ZoneId, React.FC<any>> = {
  poverty: BalooSprite,
  hunger: PebblepuffSprite,
  health: LeafletSprite,
  education: ThinkletSprite,
  equality: SparkleflameSprite,
};

const ZONE_SCENES: Record<ZoneId, { broken: string; healed: string }> = {
  poverty: {
    broken: 'linear-gradient(180deg, #607D8B 0%, #90A4AE 60%, #78909C 100%)',
    healed: 'linear-gradient(180deg, #81C784 0%, #A5D6A7 60%, #C8E6C9 100%)',
  },
  hunger: {
    broken: 'linear-gradient(180deg, #8D6E63 0%, #A1887F 60%, #BCAAA4 100%)',
    healed: 'linear-gradient(180deg, #FFF9C4 0%, #F9FBE7 60%, #DCEDC8 100%)',
  },
  health: {
    broken: 'linear-gradient(180deg, #78909C 0%, #90A4AE 60%, #B0BEC5 100%)',
    healed: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 60%, #A5D6A7 100%)',
  },
  education: {
    broken: 'linear-gradient(180deg, #7B1FA2 20%, #9C27B0 60%, #CE93D8 100%)',
    healed: 'linear-gradient(180deg, #EDE7F6 0%, #D1C4E9 60%, #F3E5F5 100%)',
  },
  equality: {
    broken: 'linear-gradient(180deg, #5D4037 0%, #8D6E63 60%, #BCAAA4 100%)',
    healed: 'linear-gradient(180deg, #FFF3E0 0%, #FFE0B2 60%, #FFCC80 100%)',
  },
};

export default function ZoneInterior() {
  const [location, setLocation] = useLocation();
  const zoneIdMatch = location.match(/\/zone\/(.*)/);
  const zoneId = zoneIdMatch?.[1] as ZoneId;
  const { completedZones, playerCharacter } = useGame();

  const [dialogIndex, setDialogIndex] = useState(0);

  useEffect(() => {
    if (!zoneId || !ZONES[zoneId]) setLocation('/map');
  }, [zoneId, setLocation]);

  if (!zoneId || !ZONES[zoneId]) return null;

  const zone = ZONES[zoneId];
  const isCompleted = completedZones.includes(zoneId);
  const Sprite = LORD_SPRITES[zoneId];
  const PlayerSprite = [Warden1, Warden2, Warden3][playerCharacter - 1] ?? Warden1;
  const scene = ZONE_SCENES[zoneId];

  const dialogs = isCompleted
    ? [
        { speaker: zone.lordName, text: zone.healedDesc },
        { speaker: zone.lordName, text: zone.successFact },
        { speaker: '✨ Warden', text: "We did it! This part of the world is healed! On to the next zone!" },
      ]
    : [
        { speaker: zone.lordName, text: zone.brokenDesc },
        { speaker: zone.lordName, text: zone.puzzleIntro },
      ];

  const handleNextDialog = () => {
    if (dialogIndex < dialogs.length - 1) setDialogIndex(i => i + 1);
  };

  const isDialogDone = dialogIndex >= dialogs.length - 1;

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden flex flex-col"
      style={{ background: isCompleted ? scene.healed : scene.broken, transition: 'background 1.5s ease' }}
    >
      {/* Particle effects when healed */}
      {isCompleted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${10 + i * 8}%`,
                top: `${20 + (i % 3) * 20}%`,
                animation: `float ${2 + (i % 3) * 0.5}s ease-in-out ${i * 0.2}s infinite`,
              }}
            >
              {['🌸', '⭐', '✨', '🌿', '💚', '🌟'][i % 6]}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 z-20">
        <button
          onClick={() => setLocation('/map')}
          className="bg-white/90 sketch-border-sm px-4 py-2 font-bold text-sm hover:bg-white transition-colors"
        >
          ← Back to Map
        </button>
        <div
          className="px-4 py-2 rounded-full text-white font-bold text-sm shadow-md"
          style={{ background: zone.themeColor }}
        >
          SDG {zone.sdg}: {zone.sdgTitle}
        </div>
      </div>

      {/* Scene area */}
      <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
        {/* Zone name plate */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white/90 sketch-border-sm px-6 py-2 text-center">
            <h2 className="font-display text-xl" style={{ color: zone.themeColor }}>{zone.name}</h2>
            <p className="text-sm text-gray-500">{zone.description}</p>
          </div>
        </div>

        {/* Elemental Lord */}
        <motion.div
          className="absolute w-40 h-40 md:w-52 md:h-52"
          style={{ right: '12%', top: '15%' }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className={cn('w-full h-full', !isCompleted && 'grayscale opacity-70')}>
            <Sprite />
          </div>
        </motion.div>

        {/* Player character */}
        <motion.div
          className="absolute w-28 h-28 md:w-36 md:h-36"
          style={{ left: '10%', bottom: '30%' }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <PlayerSprite />
        </motion.div>

        {/* Scene environment elements */}
        {isCompleted ? (
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-6 text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {zone.id === 'poverty' && <>🏡 🌸 🏡</>}
            {zone.id === 'hunger' && <>🌾 🥕 🌽</>}
            {zone.id === 'health' && <>🌿 💊 ✨</>}
            {zone.id === 'education' && <>📚 🎓 ⭐</>}
            {zone.id === 'equality' && <>⚡ 🌟 ⚡</>}
          </motion.div>
        ) : (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 text-4xl opacity-60">
            {zone.id === 'poverty' && <>🏚️ 💔 🏚️</>}
            {zone.id === 'hunger' && <>🪨 💧 🪨</>}
            {zone.id === 'health' && <>😷 🤕 😷</>}
            {zone.id === 'education' && <>📖 😟 📖</>}
            {zone.id === 'equality' && <>⚠️ 😠 ⚠️</>}
          </div>
        )}

        {/* Start Puzzle Button */}
        <AnimatePresence>
          {!isCompleted && isDialogDone && (
            <motion.div
              className="absolute z-30"
              style={{ bottom: '38%', left: '50%', transform: 'translateX(-50%)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <button
                onClick={() => setLocation(`/puzzle/${zoneId}`)}
                className="text-xl py-3 px-8 text-white font-bold rounded-xl shadow-lg sketch-border"
                style={{ background: zone.themeColor, animation: 'float 1.5s ease-in-out infinite' }}
              >
                🎮 Start Challenge!
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Return to map when done */}
        {isCompleted && isDialogDone && (
          <motion.div
            className="absolute z-30"
            style={{ bottom: '38%', left: '50%', transform: 'translateX(-50%)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <button
              onClick={() => setLocation('/map')}
              className="text-xl py-3 px-8 text-white font-bold rounded-xl shadow-lg sketch-border"
              style={{ background: '#4CAF50' }}
            >
              🗺️ Back to World Map
            </button>
          </motion.div>
        )}
      </div>

      {/* Dialog box */}
      <AnimatePresence mode="wait">
        <DialogBox
          key={dialogIndex}
          speaker={dialogs[dialogIndex].speaker}
          text={dialogs[dialogIndex].text}
          onNext={handleNextDialog}
          color={zone.themeColor}
        />
      </AnimatePresence>
    </div>
  );
}
