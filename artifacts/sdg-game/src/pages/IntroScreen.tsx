import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

const SCENES = [
  {
    id: 'earth',
    bg: 'linear-gradient(180deg, #0a1628 0%, #0d2137 50%, #162840 100%)',
    content: (
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="relative"
        >
          <div className="w-64 h-64 rounded-full relative overflow-hidden shadow-2xl"
            style={{ background: 'radial-gradient(circle at 35% 30%, #1a6eb5, #0d3d6b 60%, #071f3a)' }}>
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(34,139,34,0.75) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(ellipse at 70% 35%, rgba(34,139,34,0.6) 0%, transparent 40%)' }} />
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(ellipse at 25% 75%, rgba(34,139,34,0.5) 0%, transparent 35%)' }} />
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.18) 0%, transparent 45%)' }} />
          </div>
          {['💨','🏭','🌡️','🌊'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              style={{ top: `${[10,60,75,20][i]}%`, left: `${[75,80,15,5][i]}%` }}
              animate={{ y: [0, -12, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
            >{emoji}</motion.div>
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          className="text-white text-2xl font-bold text-center max-w-sm leading-snug"
          style={{ fontFamily: 'Patrick Hand, cursive', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
        >
          Our world is in danger…
        </motion.p>
      </div>
    ),
  },
  {
    id: 'problems',
    bg: 'linear-gradient(180deg, #1a1a2e 0%, #2d1b4e 100%)',
    content: (
      <div className="flex flex-col items-center gap-6 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-7xl"
        >🌱</motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-white text-3xl font-bold text-center"
          style={{ fontFamily: 'Patrick Hand, cursive', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
        >
          17 Global Goals stand between<br />us and a better future.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3 text-2xl"
        >
          {['🏚️','🌾','🏥','🎓','⚖️','💧','🌊','🌲','🌡️','♻️'].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
            >{e}</motion.span>
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="text-white/80 text-lg text-center"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Poverty. Hunger. Health. Education. Equality.<br />
          Water. Oceans. Forests. Climate. Consumption.
        </motion.p>
      </div>
    ),
  },
  {
    id: 'hero',
    bg: 'linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    content: (
      <div className="flex flex-col items-center gap-6 max-w-lg">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-amber-300 text-xl text-center font-bold"
          style={{ fontFamily: 'Patrick Hand, cursive', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
        >A young warden has awakened…</motion.p>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 1.0, type: 'spring', stiffness: 120 }}
          className="relative"
        >
          <div className="w-40 h-40 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.25) 0%, rgba(255,215,0,0) 70%)', boxShadow: '0 0 60px 20px rgba(255,215,0,0.15)' }}>
            <span className="text-8xl">🌿</span>
          </div>
          {[0,60,120,180,240,300].map((deg, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-amber-400"
              style={{
                top: '50%', left: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${deg}deg) translateX(75px)`,
              }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-white text-2xl font-bold text-center"
          style={{ fontFamily: 'Patrick Hand, cursive', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
        >
          Chosen to heal the broken zones of the world,<br />
          guided by the Elemental Lords.
        </motion.h2>
      </div>
    ),
  },
  {
    id: 'title',
    bg: 'linear-gradient(180deg, #0a2408 0%, #1a4a0a 40%, #2d6b1a 100%)',
    content: (
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 1.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-8xl mb-2"
          >🌱</motion.div>
          <h1
            className="text-6xl md:text-7xl font-bold text-center"
            style={{
              fontFamily: 'Patrick Hand, cursive',
              color: '#A5D6A7',
              textShadow: '0 0 40px rgba(76,175,80,0.8), 0 4px 20px rgba(0,0,0,0.9)',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
            }}
          >
            Seeds of
            <br />Tomorrow
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-green-300/80 text-lg text-center"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          An SDG adventure across two worlds
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 1.2, duration: 1.5, repeat: Infinity }}
          className="text-white/60 text-sm mt-4"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Click anywhere to begin →
        </motion.div>
      </div>
    ),
    isLast: true,
  },
];

export default function IntroScreen() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [, setLocation] = useLocation();

  const currentScene = SCENES[sceneIdx];

  useEffect(() => {
    if (currentScene.isLast) return;
    const timer = setTimeout(() => {
      setSceneIdx(i => Math.min(i + 1, SCENES.length - 1));
    }, 4200);
    return () => clearTimeout(timer);
  }, [sceneIdx, currentScene.isLast]);

  const advance = () => {
    if (sceneIdx < SCENES.length - 1) {
      setSceneIdx(i => i + 1);
    } else {
      setLocation('/title');
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
      onClick={advance}
      onKeyDown={advance}
      tabIndex={0}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
          style={{ background: currentScene.bg }}
        />
      </AnimatePresence>

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id + '-content'}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative z-10 flex flex-col items-center px-8"
        >
          {currentScene.content}
        </motion.div>
      </AnimatePresence>

      {/* Scene dots */}
      <div className="absolute bottom-8 flex gap-2 z-10">
        {SCENES.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setSceneIdx(i); }}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{ background: i === sceneIdx ? 'white' : 'rgba(255,255,255,0.35)' }}
          />
        ))}
      </div>

      {/* Skip button */}
      {!currentScene.isLast && (
        <button
          className="absolute top-5 right-6 text-white/50 text-sm hover:text-white/80 transition-colors z-10"
          style={{ fontFamily: 'Nunito, sans-serif' }}
          onClick={(e) => { e.stopPropagation(); setLocation('/title'); }}
        >
          Skip intro →
        </button>
      )}
    </div>
  );
}
