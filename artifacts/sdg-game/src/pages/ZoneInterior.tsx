import { useState, useEffect } from 'react';
import { useLocation, params } from 'wouter';
import { useGame } from '@/context/GameContext';
import { ZONES, ZoneId } from '@/data/gameData';
import { Button, DialogBox } from '@/components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Warden1, Warden2, Warden3,
  SplashySprite, PebblepuffSprite, LeafletSprite, 
  SparkleflameSprite, BalooSprite, ThinkletSprite 
} from '@/components/Sprites';

const LORD_SPRITES: Record<ZoneId, any> = {
  water: SplashySprite,
  earth: PebblepuffSprite,
  life: LeafletSprite,
  energy: SparkleflameSprite,
  justice: BalooSprite,
  knowledge: ThinkletSprite
};

export default function ZoneInterior() {
  const [location, setLocation] = useLocation();
  const zoneIdMatch = location.match(/\/zone\/(.*)/);
  const zoneId = zoneIdMatch?.[1] as ZoneId;
  const { completedZones, playerCharacter } = useGame();
  
  const [dialogIndex, setDialogIndex] = useState(0);

  // Redirect if invalid zone
  useEffect(() => {
    if (!zoneId || !ZONES[zoneId]) {
      setLocation('/map');
    }
  }, [zoneId, setLocation]);

  if (!zoneId || !ZONES[zoneId]) return null;

  const zone = ZONES[zoneId];
  const isCompleted = completedZones.includes(zoneId);
  const Sprite = LORD_SPRITES[zoneId];
  const PlayerSprite = [Warden1, Warden2, Warden3][playerCharacter - 1];

  // Dialog sequence
  const dialogs = isCompleted 
    ? [
        { speaker: zone.lordName, text: zone.healedDesc },
        { speaker: zone.lordName, text: zone.successFact },
        { speaker: zone.lordName, text: "Thank you for healing this part of the world!" }
      ]
    : [
        { speaker: zone.lordName, text: zone.brokenDesc },
        { speaker: zone.lordName, text: zone.puzzleIntro }
      ];

  const handleNextDialog = () => {
    if (dialogIndex < dialogs.length - 1) {
      setDialogIndex(i => i + 1);
    }
  };

  const isDialogDone = dialogIndex >= dialogs.length - 1;

  return (
    <div className={cn(
      "min-h-screen w-full relative overflow-hidden transition-colors duration-1000",
      isCompleted ? "bg-white" : "bg-neutral-300"
    )}>
      {/* Background tint based on completion */}
      <div className={cn(
        "absolute inset-0 opacity-30 transition-opacity duration-1000",
        isCompleted ? zone.bgColorClass : "bg-black"
      )} />

      {/* Header */}
      <div className="absolute top-4 left-4 z-20">
        <Button variant="secondary" onClick={() => setLocation('/map')}>← Back to Map</Button>
      </div>

      {/* Scene */}
      <div className="absolute inset-0 flex items-center justify-center">
        
        {/* Lord Character */}
        <motion.div 
          className="w-48 h-48 md:w-64 md:h-64 absolute"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 50, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className={cn("w-full h-full transition-all duration-1000", !isCompleted && "grayscale opacity-80")}>
            <Sprite />
          </div>
        </motion.div>

        {/* Player Character */}
        <motion.div 
          className="w-32 h-32 md:w-40 md:h-40 absolute"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: -100, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <PlayerSprite />
        </motion.div>

      </div>

      {/* Interactions */}
      <AnimatePresence>
        {!isCompleted && isDialogDone && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 mt-32"
          >
            <Button 
              className="text-2xl py-4 px-8 animate-pulse"
              onClick={() => setLocation(`/puzzle/${zoneId}`)}
            >
              Start Puzzle!
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogue System */}
      <AnimatePresence mode="wait">
        <DialogBox 
          key={dialogIndex}
          speaker={dialogs[dialogIndex].speaker}
          text={dialogs[dialogIndex].text}
          onNext={handleNextDialog}
        />
      </AnimatePresence>
    </div>
  );
}
