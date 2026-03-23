import { motion, AnimatePresence } from 'framer-motion';

export interface BuildingDef {
  id: string;
  name: string;
  emoji: string;
  npcName: string;
  npcEmoji: string;
  zoneId: string;
  description: string;
  wallColor: string;
  floorColor: string;
  accentColor: string;
  /** world-space entrance position */
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ENTERABLE_BUILDINGS: BuildingDef[] = [
  {
    id: 'greenhouse',
    name: 'Community Greenhouse',
    emoji: '🌿',
    npcName: 'Pebblepuff',
    npcEmoji: '🌾',
    zoneId: 'hunger',
    description: 'A warm, glass-roofed greenhouse full of growing food for the whole community. Find Pebblepuff tending the crops inside.',
    wallColor: '#2E7D32',
    floorColor: '#388E3C',
    accentColor: '#A5D6A7',
    x: 2220, y: 60, width: 180, height: 130,
  },
  {
    id: 'hospital',
    name: 'Community Health Clinic',
    emoji: '🏥',
    npcName: 'Leaflet',
    npcEmoji: '💊',
    zoneId: 'health',
    description: 'A bright, welcoming clinic open to everyone. Leaflet the healer is waiting inside to share knowledge about universal healthcare.',
    wallColor: '#1565C0',
    floorColor: '#1976D2',
    accentColor: '#BBDEFB',
    x: 1140, y: 55, width: 180, height: 130,
  },
  {
    id: 'school',
    name: 'The Learning Academy',
    emoji: '🏫',
    npcName: 'Thinklet',
    npcEmoji: '📚',
    zoneId: 'education',
    description: 'A lively school buzzing with curious minds. Thinklet is in the classroom ready to challenge how you think about education.',
    wallColor: '#6A1B9A',
    floorColor: '#7B1FA2',
    accentColor: '#E1BEE7',
    x: 2220, y: 1360, width: 200, height: 140,
  },
];

interface Props {
  building: BuildingDef | null;
  onClose: () => void;
  onTalkToNPC: (zoneId: string) => void;
}

export default function BuildingInterior({ building, onClose, onTalkToNPC }: Props) {
  if (!building) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="interior-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.7, y: 60, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          onClick={e => e.stopPropagation()}
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{ width: 520, maxWidth: '95vw', background: building.wallColor }}
        >
          {/* Room ceiling / roof label */}
          <div className="px-6 pt-5 pb-3 flex items-center gap-3"
            style={{ background: `${building.wallColor}ee` }}>
            <span className="text-4xl">{building.emoji}</span>
            <div>
              <div className="text-white font-bold text-xl" style={{ fontFamily: 'Patrick Hand, cursive' }}>
                {building.name}
              </div>
              <div className="text-white/70 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {building.description}
              </div>
            </div>
          </div>

          {/* Interior room scene */}
          <div className="relative" style={{ height: 280, background: building.floorColor }}>
            {/* Back wall */}
            <div className="absolute inset-x-0 top-0 h-40 rounded-t-none"
              style={{ background: `${building.accentColor}40` }} />

            {/* Windows */}
            {[80, 340].map(x => (
              <div key={x} className="absolute top-6 rounded-lg border-4 border-white/40"
                style={{ left: x, width: 60, height: 70, background: 'rgba(135,206,235,0.55)', boxShadow: '0 0 12px rgba(255,255,255,0.3)' }}>
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/50" />
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/50" />
              </div>
            ))}

            {/* Floor tiles */}
            <div className="absolute bottom-0 inset-x-0 h-28 grid grid-cols-8 gap-0">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border border-black/10 rounded-sm"
                  style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }} />
              ))}
            </div>

            {/* NPC character */}
            <motion.div
              className="absolute bottom-24 left-1/2 flex flex-col items-center gap-2"
              style={{ transform: 'translateX(-50%)' }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-7xl drop-shadow-lg"
              >{building.npcEmoji}</motion.div>
              <div className="bg-white/90 rounded-full px-3 py-0.5 text-xs font-bold shadow"
                style={{ color: building.wallColor, fontFamily: 'Nunito, sans-serif' }}>
                {building.npcName}
              </div>
            </motion.div>

            {/* Speech bubble */}
            <motion.div
              className="absolute bottom-36 text-sm font-bold px-3 py-2 rounded-2xl shadow-lg"
              style={{
                left: '52%', maxWidth: 160,
                background: 'white',
                color: building.wallColor,
                fontFamily: 'Patrick Hand, cursive',
                fontSize: 13,
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="absolute bottom-0 left-6 w-3 h-3 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
              Hello, Warden! I've been waiting for you!
            </motion.div>
          </div>

          {/* Action buttons */}
          <div className="px-6 py-4 flex gap-3 items-center"
            style={{ background: `${building.wallColor}dd` }}>
            <button
              className="flex-1 py-3 rounded-2xl font-bold text-white text-base transition-all hover:brightness-110 active:scale-95"
              style={{ background: building.accentColor.replace(')', ', 0.9)').replace('rgb', 'rgba'), color: building.wallColor, fontFamily: 'Patrick Hand, cursive', fontSize: 16 }}
              onClick={() => { onTalkToNPC(building.zoneId); onClose(); }}
            >
              💬 Talk to {building.npcName}
            </button>
            <button
              className="px-5 py-3 rounded-2xl font-bold text-white/80 border border-white/30 text-sm hover:bg-white/10 active:scale-95 transition-all"
              style={{ fontFamily: 'Nunito, sans-serif' }}
              onClick={onClose}
            >
              🚪 Leave
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
