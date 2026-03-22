import { useLocation } from 'wouter';
import { useGame } from '@/context/GameContext';
import { ZONES, ZoneId } from '@/data/gameData';
import { motion } from 'framer-motion';
import { 
  SplashySprite, PebblepuffSprite, LeafletSprite, 
  SparkleflameSprite, BalooSprite, ThinkletSprite 
} from '@/components/Sprites';
import { cn } from '@/lib/utils';
import { Leaf, Droplets, Mountain, Zap, Scale, BookOpen } from 'lucide-react';

const MAP_NODES: { id: ZoneId; x: number; y: number; Icon: any; Sprite: any }[] = [
  { id: 'water', x: 20, y: 30, Icon: Droplets, Sprite: SplashySprite },
  { id: 'earth', x: 80, y: 25, Icon: Mountain, Sprite: PebblepuffSprite },
  { id: 'life', x: 50, y: 45, Icon: Leaf, Sprite: LeafletSprite },
  { id: 'energy', x: 25, y: 70, Icon: Zap, Sprite: SparkleflameSprite },
  { id: 'justice', x: 75, y: 75, Icon: Scale, Sprite: BalooSprite },
  { id: 'knowledge', x: 50, y: 85, Icon: BookOpen, Sprite: ThinkletSprite },
];

export default function WorldMap() {
  const [, setLocation] = useLocation();
  const { completedZones, getWorldHealPercent, playerName } = useGame();
  
  const healPercent = getWorldHealPercent();

  return (
    <div className="min-h-screen w-full relative flex flex-col p-4 md:p-8">
      {/* HUD */}
      <div className="flex items-center justify-between bg-card p-4 sketch-border sketch-shadow z-20 sticky top-0">
        <div>
          <h2 className="font-display text-xl">{playerName}'s Map</h2>
          <p className="text-sm text-muted-foreground text-center">Select a zone to heal</p>
        </div>
        
        <div className="flex flex-col items-end gap-2 w-1/3 min-w-[200px]">
          <div className="flex justify-between w-full text-sm font-bold font-display">
            <span>World Health</span>
            <span>{healPercent}%</span>
          </div>
          <div className="w-full h-4 bg-muted sketch-border-sm overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${healPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative mt-8 sketch-border sketch-shadow overflow-hidden bg-[url('/images/parchment-bg.png')] bg-cover">
        {/* Draw subtle connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
          <path d="M 20% 30% L 50% 45% L 80% 25%" stroke="var(--color-foreground)" strokeWidth="4" strokeDasharray="10 10" fill="none" />
          <path d="M 20% 30% L 25% 70% L 50% 85% L 75% 75% L 80% 25%" stroke="var(--color-foreground)" strokeWidth="4" strokeDasharray="10 10" fill="none" />
          <path d="M 50% 45% L 50% 85%" stroke="var(--color-foreground)" strokeWidth="4" strokeDasharray="10 10" fill="none" />
        </svg>

        {MAP_NODES.map((node) => {
          const zone = ZONES[node.id];
          const isCompleted = completedZones.includes(node.id);
          const { Sprite, Icon } = node;

          return (
            <motion.button
              key={node.id}
              onClick={() => setLocation(`/zone/${node.id}`)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 group",
                "flex flex-col items-center gap-2 transition-transform duration-300"
              )}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* The Node visually */}
              <div className={cn(
                "w-16 h-16 md:w-24 md:h-24 rounded-full sketch-border sketch-shadow flex items-center justify-center relative overflow-hidden transition-colors duration-500",
                isCompleted ? "bg-white" : "bg-muted grayscale"
              )}>
                <Icon size={32} className={cn("opacity-20 absolute", zone.colorClass)} />
                <div className="w-3/4 h-3/4 z-10">
                  <Sprite />
                </div>
                
                {/* Healing aura if completed */}
                {isCompleted && (
                  <div className={cn("absolute inset-0 opacity-20 animate-pulse", zone.bgColorClass)} />
                )}
              </div>

              {/* Label */}
              <div className="bg-card sketch-border-sm px-3 py-1 text-sm md:text-base font-display font-bold shadow-sm whitespace-nowrap">
                {zone.name}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
