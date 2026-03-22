import { useLocation } from 'wouter';
import { useGame } from '@/context/GameContext';
import { ZONES, ZONE_ORDER, type ZoneId } from '@/data/gameData';
import { motion } from 'framer-motion';

function IsometricMap({ completedZones, onZoneClick }: { completedZones: ZoneId[], onZoneClick: (id: ZoneId) => void }) {
  const done = (id: ZoneId) => completedZones.includes(id);

  return (
    <div className="relative w-full" style={{ paddingBottom: '75%', minHeight: 400 }}>
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8e6f5" />
            <stop offset="100%" stopColor="#e8f5e9" />
          </linearGradient>
          <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#81C784" />
            <stop offset="100%" stopColor="#4CAF50" />
          </linearGradient>
          <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#64B5F6" />
            <stop offset="100%" stopColor="#42A5F5" />
          </linearGradient>
          <filter id="dropShadow">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.25" />
          </filter>
          <filter id="healGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background */}
        <rect width="800" height="600" fill="url(#skyGrad)" />

        {/* Ground / grass field */}
        <ellipse cx="400" cy="420" rx="390" ry="200" fill="url(#grassGrad)" opacity="0.9" />
        <ellipse cx="400" cy="430" rx="380" ry="185" fill="#A5D6A7" opacity="0.6" />

        {/* Dirt paths between zones */}
        {/* Central crossing paths */}
        <path d="M 200 380 Q 380 340 560 310 Q 640 350 680 400" stroke="#C8A96E" strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M 380 340 Q 380 260 400 200 Q 420 180 450 160" stroke="#C8A96E" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M 200 380 Q 240 320 280 260 Q 320 220 350 190" stroke="#C8A96E" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M 560 310 Q 600 380 620 430" stroke="#C8A96E" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.7" />

        {/* Stepping stones on path */}
        {[220,280,340,400,460,520].map((x,i) => (
          <ellipse key={i} cx={x} cy={360 - i*4} rx="10" ry="6" fill="#BCA06B" opacity="0.8" />
        ))}

        {/* River at bottom */}
        <path d="M 0 520 Q 200 490 400 510 Q 600 530 800 500" stroke="url(#riverGrad)" strokeWidth="36" fill="none" opacity="0.7" />
        <path d="M 0 520 Q 200 490 400 510 Q 600 530 800 500" stroke="white" strokeWidth="10" fill="none" opacity="0.25" strokeDasharray="20 30" />
        {/* River ripples */}
        {[100,250,420,590,720].map((x,i) => (
          <ellipse key={i} cx={x} cy={508 + (i%2)*8} rx="20" ry="6" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
        ))}

        {/* Trees decorative */}
        {[
          [60, 320], [100, 350], [730, 290], [760, 340],
          [80, 450], [730, 450], [400, 480], [300, 460],
          [520, 460]
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <ellipse cx="0" cy="-30" rx="18" ry="22" fill={i % 2 === 0 ? "#388E3C" : "#43A047"} />
            <ellipse cx="0" cy="-42" rx="13" ry="16" fill={i % 2 === 0 ? "#43A047" : "#2E7D32"} />
            <rect x="-4" y="-10" width="8" height="20" fill="#795548" />
          </g>
        ))}

        {/* Flowers scattered */}
        {[[150,400],[350,430],[560,390],[180,350],[680,370]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <circle cx="0" cy="0" r="5" fill={['#FF80AB','#FFCC02','#80DEEA','#FFB74D','#CE93D8'][i]} />
            <circle cx="6" cy="-4" r="4" fill={['#F48FB1','#FFE082','#80CBC4','#FFCC80','#CE93D8'][i]} />
          </g>
        ))}

        {/* ── ZONE 1: BALOO'S VILLAGE (bottom-left) ── */}
        <ZoneBuilding
          id="poverty"
          x={160} y={340}
          done={done('poverty')}
          onClick={() => onZoneClick('poverty')}
          color="#e74c3c"
          doneColor="#FFD700"
          label="Baloo's Village"
          sdg="SDG 1"
          buildingType="village"
        />

        {/* ── ZONE 2: PEBBLEPUFF'S FARM (top-right) ── */}
        <ZoneBuilding
          id="hunger"
          x={590} y={230}
          done={done('hunger')}
          onClick={() => onZoneClick('hunger')}
          color="#f39c12"
          doneColor="#FFD700"
          label="Pebblepuff's Farm"
          sdg="SDG 2"
          buildingType="farm"
        />

        {/* ── ZONE 3: LEAFLET'S CLINIC (top-center) ── */}
        <ZoneBuilding
          id="health"
          x={380} y={160}
          done={done('health')}
          onClick={() => onZoneClick('health')}
          color="#27ae60"
          doneColor="#FFD700"
          label="Leaflet's Clinic"
          sdg="SDG 3"
          buildingType="clinic"
        />

        {/* ── ZONE 4: THINKLET'S ACADEMY (bottom-right) ── */}
        <ZoneBuilding
          id="education"
          x={620} y={380}
          done={done('education')}
          onClick={() => onZoneClick('education')}
          color="#8e44ad"
          doneColor="#FFD700"
          label="Thinklet's Academy"
          sdg="SDG 4"
          buildingType="school"
        />

        {/* ── ZONE 5: SPARKLEFLAME'S CITY (top-left) ── */}
        <ZoneBuilding
          id="equality"
          x={230} y={215}
          done={done('equality')}
          onClick={() => onZoneClick('equality')}
          color="#e67e22"
          doneColor="#FFD700"
          label="Sparkleflame's City"
          sdg="SDG 5"
          buildingType="city"
        />
      </svg>
    </div>
  );
}

function ZoneBuilding({
  id, x, y, done, onClick, color, doneColor, label, sdg, buildingType
}: {
  id: string; x: number; y: number; done: boolean; onClick: () => void;
  color: string; doneColor: string; label: string; sdg: string; buildingType: string;
}) {
  const fillColor = done ? '#fff' : '#e0d8c8';
  const roofColor = done ? color : '#9E9E9E';
  const accentColor = done ? color : '#757575';

  return (
    <g
      className="cursor-pointer"
      onClick={onClick}
      transform={`translate(${x},${y})`}
      style={{ transition: 'filter 0.3s' }}
      filter={done ? 'url(#healGlow)' : undefined}
    >
      {/* Shadow */}
      <ellipse cx="0" cy="55" rx="52" ry="15" fill="rgba(0,0,0,0.18)" />

      {buildingType === 'village' && <VillageBuilding fillColor={fillColor} roofColor={roofColor} done={done} color={color} />}
      {buildingType === 'farm' && <FarmBuilding fillColor={fillColor} roofColor={roofColor} done={done} color={color} />}
      {buildingType === 'clinic' && <ClinicBuilding fillColor={fillColor} roofColor={roofColor} done={done} color={color} />}
      {buildingType === 'school' && <SchoolBuilding fillColor={fillColor} roofColor={roofColor} done={done} color={color} />}
      {buildingType === 'city' && <CityBuilding fillColor={fillColor} roofColor={roofColor} done={done} color={color} />}

      {/* Sparkle when done */}
      {done && (
        <>
          <text x="-28" y="-50" fontSize="16" style={{ animation: 'float 2s ease-in-out infinite' }}>✨</text>
          <text x="20" y="-55" fontSize="14" style={{ animation: 'float 2.5s ease-in-out infinite' }}>⭐</text>
        </>
      )}

      {/* Pulsing ring if not done */}
      {!done && (
        <circle cx="0" cy="10" r="48" fill="none" stroke={color} strokeWidth="3" opacity="0.5">
          <animate attributeName="r" values="44;56;44" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* SDG badge */}
      <g transform="translate(-36,-70)">
        <rect width="72" height="22" rx="11" fill={done ? color : '#78909C'} />
        <text x="36" y="15" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Nunito">{sdg}</text>
      </g>

      {/* Label below */}
      <g transform="translate(0,68)">
        <rect x="-52" y="0" width="104" height="20" rx="10" fill="white" stroke={done ? color : '#9E9E9E'} strokeWidth="2" opacity="0.95" />
        <text x="0" y="14" textAnchor="middle" fill={done ? '#333' : '#666'} fontSize="10" fontWeight="bold" fontFamily="Nunito">{label}</text>
      </g>
    </g>
  );
}

/* ── Building shape components ── */

function VillageBuilding({ fillColor, roofColor, done, color }: any) {
  return (
    <>
      {/* Two cottages */}
      <rect x="-38" y="10" width="32" height="36" rx="4" fill={fillColor} stroke="#5D4037" strokeWidth="2" />
      <polygon points="-38,10 -22,-14 -6,10" fill={roofColor} stroke="#5D4037" strokeWidth="2" />
      <rect x="-28" y="28" width="12" height="18" rx="2" fill={done ? '#90CAF9' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1.5" />

      <rect x="8" y="15" width="30" height="32" rx="4" fill={fillColor} stroke="#5D4037" strokeWidth="2" />
      <polygon points="8,15 23,-8 38,15" fill={roofColor} stroke="#5D4037" strokeWidth="2" />
      <rect x="15" y="28" width="11" height="15" rx="2" fill={done ? '#90CAF9' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1.5" />

      {/* Chimney */}
      <rect x="-26" y="-18" width="8" height="10" rx="2" fill="#795548" />
      {done && <text x="-22" y="-22" fontSize="10" textAnchor="middle">💨</text>}

      {/* Garden/flowers */}
      {done && (
        <>
          <circle cx="-18" cy="48" r="4" fill="#FF80AB" />
          <circle cx="-6" cy="50" r="3" fill="#FFCC02" />
          <circle cx="6" cy="48" r="4" fill="#FF80AB" />
        </>
      )}
    </>
  );
}

function FarmBuilding({ fillColor, roofColor, done, color }: any) {
  return (
    <>
      {/* Barn */}
      <rect x="-30" y="5" width="38" height="40" rx="4" fill={done ? '#FFECB3' : fillColor} stroke="#5D4037" strokeWidth="2" />
      <polygon points="-30,5 -11,-18 8,5" fill={roofColor} stroke="#5D4037" strokeWidth="2" />
      <rect x="-16" y="25" width="14" height="20" rx="2" fill="#5D4037" />
      {/* Silo */}
      <rect x="14" y="10" width="20" height="35" rx="4" fill={fillColor} stroke="#5D4037" strokeWidth="2" />
      <ellipse cx="24" cy="10" rx="10" ry="5" fill={roofColor} stroke="#5D4037" strokeWidth="2" />

      {/* Crop rows */}
      {done && (
        <>
          <text x="-35" y="60" fontSize="14">🌾</text>
          <text x="-18" y="62" fontSize="14">🥕</text>
          <text x="-1" y="60" fontSize="14">🌾</text>
          <text x="16" y="62" fontSize="14">🥕</text>
        </>
      )}
      {!done && (
        <>
          <rect x="-35" y="48" width="8" height="10" rx="2" fill="#8D6E63" opacity="0.5" />
          <rect x="-22" y="48" width="8" height="10" rx="2" fill="#8D6E63" opacity="0.5" />
          <rect x="-9" y="48" width="8" height="10" rx="2" fill="#8D6E63" opacity="0.5" />
        </>
      )}
    </>
  );
}

function ClinicBuilding({ fillColor, roofColor, done, color }: any) {
  return (
    <>
      {/* Main clinic building */}
      <rect x="-34" y="0" width="68" height="48" rx="6" fill={fillColor} stroke="#5D4037" strokeWidth="2.5" />
      {/* Roof */}
      <rect x="-34" y="0" width="68" height="16" rx="6" fill={roofColor} stroke="#5D4037" strokeWidth="2" />
      {/* Cross */}
      <rect x="-7" y="-12" width="14" height="30" rx="3" fill="white" stroke={done ? color : '#78909C'} strokeWidth="2" />
      <rect x="-16" y="-4" width="32" height="14" rx="3" fill="white" stroke={done ? color : '#78909C'} strokeWidth="2" />
      {/* Windows */}
      <rect x="-28" y="18" width="16" height="14" rx="3" fill={done ? '#B2EBF2' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1.5" />
      <rect x="12" y="18" width="16" height="14" rx="3" fill={done ? '#B2EBF2' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1.5" />
      {/* Door */}
      <rect x="-8" y="28" width="16" height="20" rx="3" fill="#5D4037" />
      {done && <text x="-6" y="60" fontSize="14">🌿</text>}
      {done && <text x="14" y="60" fontSize="14">🌿</text>}
    </>
  );
}

function SchoolBuilding({ fillColor, roofColor, done, color }: any) {
  return (
    <>
      {/* Main school */}
      <rect x="-38" y="5" width="76" height="42" rx="5" fill={fillColor} stroke="#5D4037" strokeWidth="2.5" />
      {/* Peaked roof */}
      <polygon points="-38,5 0,-20 38,5" fill={roofColor} stroke="#5D4037" strokeWidth="2" />
      {/* Bell tower */}
      <rect x="-8" y="-30" width="16" height="14" rx="2" fill={fillColor} stroke="#5D4037" strokeWidth="2" />
      <polygon points="-8,-30 0,-42 8,-30" fill={roofColor} stroke="#5D4037" strokeWidth="1.5" />
      {/* Bell */}
      <ellipse cx="0" cy="-22" rx="5" ry="4" fill="#FFD700" />
      {/* Windows row */}
      <rect x="-30" y="14" width="14" height="12" rx="2" fill={done ? '#FFF9C4' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1.5" />
      <rect x="-7" y="14" width="14" height="12" rx="2" fill={done ? '#FFF9C4' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1.5" />
      <rect x="16" y="14" width="14" height="12" rx="2" fill={done ? '#FFF9C4' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1.5" />
      {/* Door */}
      <rect x="-8" y="28" width="16" height="19" rx="2" fill="#795548" />
      {done && <text x="-10" y="60" fontSize="13">📚</text>}
      {done && <text x="10" y="60" fontSize="13">⭐</text>}
    </>
  );
}

function CityBuilding({ fillColor, roofColor, done, color }: any) {
  return (
    <>
      {/* Three buildings of different heights */}
      <rect x="-35" y="10" width="22" height="40" rx="3" fill={fillColor} stroke="#5D4037" strokeWidth="2" />
      <rect x="-13" y="0" width="26" height="50" rx="3" fill={done ? '#FFF3E0' : fillColor} stroke="#5D4037" strokeWidth="2" />
      <rect x="15" y="14" width="22" height="36" rx="3" fill={fillColor} stroke="#5D4037" strokeWidth="2" />
      {/* Rooftops */}
      <rect x="-35" y="6" width="22" height="8" rx="2" fill={roofColor} stroke="#5D4037" strokeWidth="2" />
      <rect x="-13" y="-4" width="26" height="8" rx="2" fill={roofColor} stroke="#5D4037" strokeWidth="2" />
      <rect x="15" y="10" width="22" height="8" rx="2" fill={roofColor} stroke="#5D4037" strokeWidth="2" />
      {/* Windows */}
      <rect x="-30" y="18" width="8" height="8" rx="1" fill={done ? '#FFF9C4' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1" />
      <rect x="-30" y="30" width="8" height="8" rx="1" fill={done ? '#FFF9C4' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1" />
      <rect x="-6" y="10" width="8" height="8" rx="1" fill={done ? '#FFF9C4' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1" />
      <rect x="6" y="10" width="8" height="8" rx="1" fill={done ? '#FFF9C4' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1" />
      <rect x="-6" y="24" width="8" height="8" rx="1" fill={done ? '#FFF9C4' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1" />
      <rect x="6" y="24" width="8" height="8" rx="1" fill={done ? '#FFF9C4' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1" />
      <rect x="20" y="22" width="8" height="8" rx="1" fill={done ? '#FFF9C4' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1" />
      <rect x="20" y="34" width="8" height="8" rx="1" fill={done ? '#FFF9C4' : '#B0BEC5'} stroke="#5D4037" strokeWidth="1" />
      {done && <text x="-5" y="62" fontSize="14">⚡</text>}
      {done && <text x="10" y="62" fontSize="14">🌟</text>}
    </>
  );
}

export default function WorldMap() {
  const [, setLocation] = useLocation();
  const { completedZones, getWorldHealPercent, playerName } = useGame();
  const healPercent = getWorldHealPercent();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #b3e5fc 0%, #e8f5e9 60%, #c8e6c9 100%)' }}>
      {/* HUD Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm sketch-border-sm mx-2 mt-2 sticky top-2 z-20">
        <div>
          <div className="font-display text-lg text-amber-900">🗺️ {playerName}'s World</div>
          <div className="text-xs text-gray-500">Touch a zone to begin your quest!</div>
        </div>
        <div className="flex flex-col items-end gap-1 min-w-[180px]">
          <div className="flex justify-between w-full text-sm font-bold text-green-700">
            <span>World Healing</span>
            <span>{healPercent}%</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden sketch-border-sm">
            <div
              className="progress-fill rounded-full"
              style={{ width: `${healPercent}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">{completedZones.length}/5 zones healed</div>
        </div>
      </div>

      {/* Isometric Map */}
      <div className="flex-1 p-2 md:p-4 overflow-hidden">
        <IsometricMap completedZones={completedZones} onZoneClick={(id) => setLocation(`/zone/${id}`)} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 px-4 pb-3">
        {ZONE_ORDER.map((id) => {
          const zone = ZONES[id];
          const isDone = completedZones.includes(id);
          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocation(`/zone/${id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm transition-all"
              style={{
                background: isDone ? zone.themeColor : '#e0d8c8',
                color: isDone ? 'white' : '#666',
                border: `2px solid ${isDone ? zone.themeColor : '#aaa'}`,
              }}
            >
              <span>{zone.emoji}</span>
              <span>SDG {zone.sdg}: {zone.sdgTitle}</span>
              {isDone && <span>✓</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
