import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Warden1, Warden2, Warden3 } from '@/components/Sprites';
import {
  PebblepuffSprite, LeafletSprite, ThinkletSprite,
} from '@/components/Sprites';

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
    description: 'A warm glass greenhouse full of growing food. Pebblepuff tends the crops inside.',
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
    description: 'A bright welcoming clinic open to everyone. Leaflet shares knowledge about healthcare.',
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
    description: "A lively school buzzing with curious minds. Thinklet challenges how you think.",
    wallColor: '#6A1B9A',
    floorColor: '#7B1FA2',
    accentColor: '#E1BEE7',
    x: 2220, y: 1360, width: 200, height: 140,
  },
];

/* ── Greenhouse Room ── */
function GreenhouseRoom() {
  return (
    <svg viewBox="0 0 800 460" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="460" fill="#B3E5FC" />
      <rect x="0" y="0" width="800" height="210" fill="#E1F5FE" />
      {/* Glass ceiling panes */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <g key={i}>
          <rect x={i*100} y="0" width="100" height="210" fill="rgba(179,229,252,0.3)" stroke="#81D4FA" strokeWidth="3" />
          <rect x={i*100+2} y="2" width="96" height="100" fill="rgba(255,255,255,0.18)" />
        </g>
      ))}
      {[0,100,200,300,400,500,600,700,800].map((x,i) => (
        <line key={i} x1={x} y1="0" x2={x} y2="210" stroke="#388E3C" strokeWidth="5" />
      ))}
      <rect x="0" y="206" width="800" height="7" fill="#2E7D32" />
      {/* Wooden back wall */}
      <rect x="0" y="213" width="800" height="247" fill="#795548" />
      {[220,244,268,292,316,340,364,388,412,436,460].map((y,i) => (
        <rect key={i} x="0" y={y} width="800" height="20" fill={i%2===0?'#8D6E63':'#795548'} />
      ))}
      {[0,80,160,240,320,400,480,560,640,720,800].map((x,i) => (
        <line key={i} x1={x} y1="213" x2={x} y2="460" stroke="#6D4C41" strokeWidth="2" opacity="0.4" />
      ))}
      {/* Left shelf */}
      <rect x="20" y="255" width="180" height="14" rx="4" fill="#5D4037" />
      <rect x="20" y="269" width="8" height="110" rx="3" fill="#4E342E" />
      <rect x="192" y="269" width="8" height="110" rx="3" fill="#4E342E" />
      {[35,75,115,155].map((px,i) => (
        <g key={i} transform={`translate(${px},232)`}>
          <ellipse cx="18" cy="24" rx="18" ry="6" fill="#3E2723" opacity="0.25" />
          <rect x="4" y="2" width="28" height="22" rx="4" fill={['#E65100','#F57F17','#D84315','#BF360C'][i]} />
          <ellipse cx="18" cy="2" rx="14" ry="4" fill={['#FF8A65','#FFB74D','#FF7043','#FF8A65'][i]} />
          <ellipse cx="18" cy="-10" rx="13" ry="16" fill={['#2E7D32','#388E3C','#1B5E20','#33691E'][i]} />
          <ellipse cx="13" cy="-17" rx="9" ry="12" fill={['#4CAF50','#66BB6A','#43A047','#4CAF50'][i]} />
          <ellipse cx="23" cy="-14" rx="7" ry="10" fill={['#81C784','#A5D6A7','#81C784','#A5D6A7'][i]} />
        </g>
      ))}
      {/* Right shelf */}
      <rect x="600" y="255" width="180" height="14" rx="4" fill="#5D4037" />
      <rect x="600" y="269" width="8" height="110" rx="3" fill="#4E342E" />
      <rect x="772" y="269" width="8" height="110" rx="3" fill="#4E342E" />
      {[615,655,695,735].map((px,i) => (
        <g key={i} transform={`translate(${px},232)`}>
          <ellipse cx="18" cy="24" rx="18" ry="6" fill="#3E2723" opacity="0.25" />
          <rect x="4" y="2" width="28" height="22" rx="4" fill={['#1B5E20','#2E7D32','#33691E','#1B5E20'][i]} />
          <ellipse cx="18" cy="2" rx="14" ry="4" fill={['#4CAF50','#66BB6A','#43A047','#4CAF50'][i]} />
          <ellipse cx="18" cy="-12" rx="13" ry="17" fill={['#E91E63','#FF5722','#FDD835','#8BC34A'][i]} />
          <ellipse cx="22" cy="-18" rx="9" ry="13" fill={['#F48FB1','#FF8A65','#FFF176','#AED581'][i]} />
        </g>
      ))}
      {/* Seed trays on ground */}
      {[50,180,310,450,580,670].map((x,i) => (
        <g key={i} transform={`translate(${x},380)`}>
          <rect x="0" y="10" width="90" height="26" rx="4" fill="#5D4037" />
          <rect x="4" y="0" width="82" height="12" rx="3" fill="#795548" />
          {[0,1,2,3,4,5].map(j => (
            <g key={j} transform={`translate(${8+j*12},0)`}>
              <line x1="6" y1="-12" x2="6" y2="0" stroke="#4CAF50" strokeWidth="2.5" />
              <ellipse cx="6" cy="-14" rx="5" ry="7" fill="#66BB6A" opacity="0.9" />
            </g>
          ))}
        </g>
      ))}
      {/* Watering can */}
      <g transform="translate(500,325)">
        <ellipse cx="0" cy="56" rx="28" ry="10" fill="#1B5E20" opacity="0.25" />
        <rect x="-22" y="15" width="44" height="38" rx="8" fill="#388E3C" />
        <rect x="-22" y="15" width="44" height="38" rx="8" fill="rgba(255,255,255,0.12)" />
        <path d="M 22 28 Q 55 22 68 8" fill="none" stroke="#388E3C" strokeWidth="9" strokeLinecap="round" />
        <path d="M 68 8 L 80 -4 L 83 6 L 70 10 Z" fill="#2E7D32" />
        <path d="M -22 20 Q -50 14 -62 20" fill="none" stroke="#2E7D32" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="0" cy="15" rx="22" ry="7" fill="#4CAF50" />
      </g>
      {/* Hanging plants */}
      {[[180,2],[380,3],[530,1],[680,2]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <line x1="0" y1="0" x2="0" y2="78" stroke="#5D4037" strokeWidth="2" strokeDasharray="4 4" />
          <ellipse cx="0" cy="78" rx="20" ry="11" fill="#E65100" />
          <ellipse cx="0" cy="68" rx="28" ry="22" fill="#2E7D32" />
          <ellipse cx="-8" cy="58" rx="16" ry="13" fill="#388E3C" />
          <ellipse cx="10" cy="63" rx="13" ry="11" fill="#43A047" />
          <ellipse cx="0" cy="54" rx="10" ry="8" fill="#66BB6A" />
        </g>
      ))}
      {/* Floor planks */}
      <rect x="0" y="408" width="800" height="52" fill="#6D4C41" />
      {[0,67,133,200,267,333,400,467,533,600,667,733,800].map((x,i) => (
        <line key={i} x1={x} y1="408" x2={x} y2="460" stroke="#5D4037" strokeWidth="2" opacity="0.55" />
      ))}
      {/* NPC Pebblepuff */}
      <foreignObject x="335" y="295" width="90" height="140">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{width:'100%',height:'100%'}}>
          <PebblepuffSprite className="w-full h-full" />
        </div>
      </foreignObject>
      {/* Light rays */}
      {[120,300,500,660].map((x,i) => (
        <polygon key={i} points={`${x-18},0 ${x+18},0 ${x+55},210 ${x-55},210`}
          fill="rgba(255,255,200,0.05)" />
      ))}
    </svg>
  );
}

/* ── Hospital Room ── */
function HospitalRoom() {
  return (
    <svg viewBox="0 0 800 460" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="460" fill="#ECEFF1" />
      <rect x="0" y="0" width="800" height="255" fill="#F5F5F5" />
      <rect x="0" y="0" width="800" height="8" fill="#1565C0" />
      {/* Floor tiles */}
      {Array.from({length:8}).map((_,row) => Array.from({length:10}).map((_,col) => (
        <rect key={`${row}-${col}`} x={col*80} y={255+row*28} width="80" height="28"
          fill={(row+col)%2===0?'#E0F2F1':'#E8F5E9'} stroke="#B2DFDB" strokeWidth="1" />
      )))}
      {/* Windows */}
      {[60,230].map((x,i) => (
        <g key={i} transform={`translate(${x},45)`}>
          <rect x="0" y="0" width="110" height="135" rx="6" fill="#B3E5FC" stroke="#90CAF9" strokeWidth="4" />
          {[0,14,28,42,56,70,84,98,112,126].map((y,j) => (
            <line key={j} x1="0" x2="110" y1={y} y2={y} stroke="#81D4FA" strokeWidth="2" opacity="0.6" />
          ))}
          <rect x="50" y="0" width="10" height="135" fill="#B3E5FC" opacity="0.45" />
          <rect x="-5" y="-5" width="120" height="145" rx="8" fill="none" stroke="#78909C" strokeWidth="5" />
          <rect x="-12" y="-6" width="22" height="150" rx="6" fill="#FFCCBC" opacity="0.75" />
          <rect x="100" y="-6" width="22" height="150" rx="6" fill="#FFCCBC" opacity="0.75" />
        </g>
      ))}
      {/* Hospital bed */}
      <g transform="translate(470,120)">
        <rect x="0" y="80" width="295" height="155" rx="12" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="4" />
        <rect x="8" y="76" width="279" height="148" rx="10" fill="white" />
        <rect x="8" y="120" width="279" height="104" rx="6" fill="#BBDEFB" />
        <rect x="8" y="120" width="279" height="30" rx="6" fill="#90CAF9" />
        <rect x="18" y="82" width="115" height="42" rx="12" fill="white" stroke="#E0E0E0" strokeWidth="2" />
        <rect x="148" y="82" width="115" height="42" rx="12" fill="white" stroke="#E0E0E0" strokeWidth="2" />
        <rect x="0" y="90" width="295" height="8" rx="4" fill="#90A4AE" />
        <rect x="0" y="214" width="295" height="8" rx="4" fill="#90A4AE" />
        <rect x="-22" y="72" width="30" height="168" rx="8" fill="#78909C" />
        <rect x="285" y="88" width="24" height="144" rx="6" fill="#78909C" />
        <rect x="10" y="230" width="14" height="28" rx="4" fill="#607D8B" />
        <rect x="272" y="230" width="14" height="28" rx="4" fill="#607D8B" />
      </g>
      {/* IV stand */}
      <g transform="translate(768,72)">
        <rect x="-3" y="0" width="6" height="238" rx="3" fill="#90A4AE" />
        <rect x="-26" y="-8" width="52" height="8" rx="4" fill="#78909C" />
        <rect x="-17" y="-85" width="34" height="57" rx="10" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="2" />
        <text x="0" y="-58" textAnchor="middle" fontSize="9" fill="#1565C0" fontWeight="bold">IV</text>
        <line x1="0" y1="-28" x2="0" y2="0" stroke="#B0BEC5" strokeWidth="2" />
        {[-20,-5,10,25].map((ox,i) => (
          <rect key={i} x={ox} y="230" width="18" height="8" rx="4" fill="#78909C"
            transform={`rotate(${i*90} 5 234)`} />
        ))}
      </g>
      {/* Armchairs */}
      {[28,158].map((x,i) => (
        <g key={i} transform={`translate(${x},228)`}>
          <rect x="0" y="30" width="112" height="82" rx="10" fill="#FFCDD2" />
          <rect x="4" y="-18" width="104" height="52" rx="10" fill="#FFCDD2" stroke="#EF9A9A" strokeWidth="2" />
          <rect x="-14" y="0" width="22" height="56" rx="8" fill="#EF9A9A" />
          <rect x="104" y="0" width="22" height="56" rx="8" fill="#EF9A9A" />
          <rect x="8" y="110" width="14" height="22" rx="4" fill="#E57373" />
          <rect x="90" y="110" width="14" height="22" rx="4" fill="#E57373" />
          <line x1="56" y1="32" x2="56" y2="110" stroke="#EF9A9A" strokeWidth="2" opacity="0.5" />
        </g>
      ))}
      {/* Side table */}
      <g transform="translate(135,295)">
        <rect x="0" y="0" width="44" height="32" rx="6" fill="#BCAAA4" />
        <rect x="-6" y="30" width="56" height="8" rx="4" fill="#A1887F" />
        <rect x="8" y="38" width="8" height="28" rx="3" fill="#8D6E63" />
        <rect x="28" y="38" width="8" height="28" rx="3" fill="#8D6E63" />
        <rect x="11" y="-24" width="18" height="20" rx="4" fill="#FFCCBC" />
        <path d="M 29 -20 Q 38 -20 38 -14 Q 38 -8 29 -8" fill="none" stroke="#FFCCBC" strokeWidth="3" />
        <ellipse cx="20" cy="-24" rx="9" ry="3" fill="#FF8A65" />
      </g>
      {/* Ceiling light */}
      <rect x="305" y="0" width="190" height="18" rx="4" fill="#E3F2FD" />
      <rect x="305" y="0" width="190" height="18" rx="4" fill="rgba(255,255,255,0.65)" />
      <rect x="296" y="16" width="10" height="26" rx="3" fill="#B0BEC5" />
      <rect x="494" y="16" width="10" height="26" rx="3" fill="#B0BEC5" />
      <rect x="294" y="38" width="212" height="14" rx="4" fill="#F5F5F5" />
      {/* Red cross */}
      <rect x="385" y="75" width="40" height="112" rx="5" fill="#F44336" opacity="0.82" />
      <rect x="348" y="112" width="114" height="40" rx="5" fill="#F44336" opacity="0.82" />
      {/* NPC Leaflet */}
      <foreignObject x="335" y="295" width="90" height="140">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{width:'100%',height:'100%'}}>
          <LeafletSprite className="w-full h-full" />
        </div>
      </foreignObject>
    </svg>
  );
}

/* ── Classroom Room ── */
function ClassroomRoom() {
  return (
    <svg viewBox="0 0 800 460" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="460" fill="#E8EAF6" />
      <rect x="0" y="0" width="800" height="245" fill="#EDE7F6" />
      {/* Floor */}
      {Array.from({length:7}).map((_,row) => Array.from({length:8}).map((_,col) => (
        <rect key={`${row}-${col}`} x={col*100} y={245+row*32} width="100" height="32"
          fill={(row+col)%2===0?'#FFF8E1':'#FFF3E0'} stroke="#FFECB3" strokeWidth="1" />
      )))}
      {/* Blackboard */}
      <rect x="190" y="20" width="440" height="210" rx="8" fill="#1B5E20" />
      <rect x="195" y="25" width="430" height="200" rx="6" fill="#2E7D32" />
      <rect x="186" y="16" width="448" height="218" rx="10" fill="none" stroke="#5D4037" strokeWidth="8" />
      <rect x="186" y="230" width="448" height="14" rx="4" fill="#795548" />
      {[210,232,254].map((x,i) => (
        <rect key={i} x={x} y="234" width="14" height="6" rx="2" fill={['white','#FFEB3B','#FF80AB'][i]} />
      ))}
      <text x="410" y="62" textAnchor="middle" fontSize="20" fill="white" fontWeight="bold" fontFamily="Patrick Hand, cursive">SDG 4: Quality Education</text>
      <line x1="200" y1="72" x2="620" y2="72" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <text x="285" y="100" fontSize="15" fill="white" fontFamily="Patrick Hand, cursive">H₂O + CO₂ → Glucose + O₂</text>
      <text x="285" y="126" fontSize="15" fill="#A5D6A7" fontFamily="Patrick Hand, cursive">√4 = 2 · · · π ≈ 3.14</text>
      <text x="285" y="152" fontSize="14" fill="#90CAF9" fontFamily="Patrick Hand, cursive">1 in 6 kids can't read globally</text>
      <text x="285" y="178" fontSize="13" fill="#FFD54F" fontFamily="Patrick Hand, cursive">📚 Every child deserves to learn!</text>
      {/* Clock */}
      <g transform="translate(720,62)">
        <circle cx="0" cy="0" r="38" fill="white" stroke="#90A4AE" strokeWidth="4" />
        <circle cx="0" cy="0" r="4" fill="#37474F" />
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle,i) => {
          const rad=(angle-90)*Math.PI/180;
          return <line key={i} x1={Math.cos(rad)*28} y1={Math.sin(rad)*28}
            x2={Math.cos(rad)*34} y2={Math.sin(rad)*34}
            stroke="#78909C" strokeWidth={i%3===0?3:1.5} />;
        })}
        <line x1="0" y1="0" x2="0" y2="-22" stroke="#37474F" strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1="0" x2="16" y2="0" stroke="#37474F" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* Bookshelf */}
      <rect x="20" y="28" width="155" height="225" rx="6" fill="#5D4037" />
      {[28,90,152].map((y,si) => (
        <g key={si}>
          <rect x="20" y={y+30} width="155" height="8" rx="3" fill="#795548" />
          {[0,1,2,3,4,5,6].map(bi => (
            <rect key={bi} x={24+bi*19} y={y+6} width="15" height="26"
              fill={['#E53935','#1E88E5','#43A047','#F57C00','#8E24AA','#00ACC1','#6D4C41'][bi]}
              rx="2" />
          ))}
        </g>
      ))}
      <rect x="26" y="270" width="142" height="90" rx="4" fill="white" stroke="#90A4AE" strokeWidth="2" />
      <text x="97" y="284" textAnchor="middle" fontSize="8" fill="#37474F" fontWeight="bold">Periodic Table</text>
      {Array.from({length:4}).map((_,row) => Array.from({length:9}).map((_,col) => (
        <rect key={`${row}-${col}`} x={30+col*14} y={290+row*16} width="12" height="14"
          fill={['#FFCDD2','#E1F5FE','#F1F8E9','#FFF9C4'][row]} stroke="#B0BEC5" strokeWidth="0.5" />
      )))}
      {/* Student desks */}
      {[[250,290],[410,290],[250,370],[410,370]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="0" y="0" width="120" height="68" rx="6" fill="#FFECB3" stroke="#FFC107" strokeWidth="2" />
          <rect x="10" y="66" width="12" height="26" rx="3" fill="#FFA000" />
          <rect x="98" y="66" width="12" height="26" rx="3" fill="#FFA000" />
          <rect x="24" y="82" width="72" height="46" rx="6" fill="#A5D6A7" stroke="#66BB6A" strokeWidth="2" />
          <rect x="28" y="50" width="64" height="36" rx="8" fill="#C8E6C9" stroke="#81C784" strokeWidth="2" />
          <rect x="14" y="9" width="52" height="36" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
          <rect x="18" y="13" width="42" height="3" rx="1" fill="#B0BEC5" />
          <rect x="18" y="20" width="36" height="3" rx="1" fill="#B0BEC5" />
          <rect x="18" y="27" width="38" height="3" rx="1" fill="#B0BEC5" />
          <rect x="72" y="10" width="6" height="32" rx="2" fill="#FFD54F"
            transform="rotate(15 75 26)" />
        </g>
      ))}
      {/* Teacher's desk */}
      <g transform="translate(555,268)">
        <rect x="0" y="0" width="210" height="92" rx="8" fill="#8D6E63" stroke="#6D4C41" strokeWidth="3" />
        <rect x="4" y="4" width="202" height="84" rx="6" fill="#A1887F" />
        <g transform="translate(165,10)">
          <ellipse cx="0" cy="20" rx="22" ry="8" fill="#1B5E20" opacity="0.3" />
          <ellipse cx="0" cy="0" rx="18" ry="22" fill="#F44336" />
          <ellipse cx="-4" cy="-8" rx="7" ry="5" fill="#EF9A9A" opacity="0.45" />
          <rect x="-2" y="-22" width="4" height="12" rx="2" fill="#5D4037" />
          <ellipse cx="6" cy="-24" rx="8" ry="5" fill="#4CAF50" transform="rotate(-20 6 -24)" />
        </g>
        <rect x="18" y="10" width="82" height="62" rx="3" fill="white" opacity="0.9" />
        <rect x="14" y="14" width="82" height="62" rx="3" fill="white" opacity="0.65" />
        <rect x="22" y="18" width="62" height="3" rx="1" fill="#B0BEC5" />
        <rect x="22" y="26" width="55" height="3" rx="1" fill="#B0BEC5" />
        <rect x="22" y="34" width="58" height="3" rx="1" fill="#B0BEC5" />
        <rect x="52" y="96" width="106" height="62" rx="8" fill="#6A1B9A" />
        <rect x="62" y="64" width="86" height="38" rx="8" fill="#7B1FA2" />
      </g>
      {/* Windows right */}
      {[55,162].map((y,i) => (
        <g key={i} transform={`translate(742,${y})`}>
          <rect x="0" y="0" width="52" height="78" rx="4" fill="#B3E5FC" stroke="#81D4FA" strokeWidth="3" />
          <line x1="26" y1="0" x2="26" y2="78" stroke="#81D4FA" strokeWidth="2" />
          <line x1="0" y1="38" x2="52" y2="38" stroke="#81D4FA" strokeWidth="2" />
          <rect x="-5" y="-5" width="62" height="88" rx="6" fill="none" stroke="#7B1FA2" strokeWidth="4" />
        </g>
      ))}
      {/* NPC Thinklet */}
      <foreignObject x="600" y="155" width="90" height="140">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{width:'100%',height:'100%'}}>
          <ThinkletSprite className="w-full h-full" />
        </div>
      </foreignObject>
    </svg>
  );
}

interface Props {
  building: BuildingDef | null;
  onClose: () => void;
  onTalkToNPC: (zoneId: string) => void;
  playerCharacter?: number;
}

export default function BuildingInterior({ building, onClose, onTalkToNPC, playerCharacter = 1 }: Props) {
  const PlayerSprite = [Warden1, Warden2, Warden3][(playerCharacter - 1) % 3] ?? Warden1;

  useEffect(() => {
    if (!building) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [building, onClose]);

  if (!building) return null;

  const RoomScene = building.id === 'greenhouse'
    ? GreenhouseRoom
    : building.id === 'hospital'
    ? HospitalRoom
    : ClassroomRoom;

  const npcDialogue = building.id === 'greenhouse'
    ? "The crops are growing! Let's talk about ending hunger. 🌾"
    : building.id === 'hospital'
    ? "Welcome, Warden! Healthcare should be a right for everyone. 💊"
    : "Class is in session! Every child deserves quality education. 📚";

  return (
    <AnimatePresence>
      <motion.div
        key="interior-fullscreen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[600] flex flex-col"
        style={{ background: building.wallColor }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0 shadow-lg"
          style={{ background: `${building.wallColor}ee` }}>
          <span className="text-3xl">{building.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-lg leading-tight truncate"
              style={{ fontFamily: 'Patrick Hand, cursive' }}>
              {building.name}
            </div>
            <div className="text-white/70 text-xs" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Press <kbd className="bg-white/20 rounded px-1">ESC</kbd> to leave &nbsp;·&nbsp; Speak with {building.npcName} inside
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 px-4 py-2 rounded-2xl border border-white/30 text-white/80 text-sm font-bold hover:bg-white/10 active:scale-95 transition-all"
            style={{ fontFamily: 'Nunito, sans-serif' }}>
            🚪 Leave
          </button>
        </div>

        {/* Room */}
        <div className="flex-1 relative overflow-hidden">
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <RoomScene />
          </motion.div>

          {/* Player at door */}
          <motion.div
            className="absolute bottom-4 left-1/2 flex flex-col items-center pointer-events-none"
            style={{ transform: 'translateX(-50%)' }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div style={{ width: 52, height: 90 }}>
              <PlayerSprite className="w-full h-full" />
            </div>
            <div className="text-xs text-white font-bold mt-1 bg-black/30 rounded-full px-2 py-0.5"
              style={{ fontFamily: 'Nunito, sans-serif' }}>You</div>
          </motion.div>

          {/* NPC speech bubble */}
          <motion.div
            className="absolute bottom-32 px-4 py-3 rounded-2xl shadow-xl max-w-xs text-center pointer-events-none"
            style={{
              left: '52%',
              background: 'white',
              color: building.wallColor,
              fontFamily: 'Patrick Hand, cursive',
              fontSize: 14,
              lineHeight: 1.4,
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <div className="absolute bottom-0 left-8 w-4 h-4 bg-white"
              style={{ clipPath: 'polygon(0 0,100% 0,50% 100%)' }} />
            {npcDialogue}
          </motion.div>

          {/* Talk button */}
          <motion.button
            className="absolute bottom-4 right-5 px-6 py-3 rounded-2xl font-bold text-base shadow-lg"
            style={{ background: 'white', color: building.wallColor, fontFamily: 'Patrick Hand, cursive', fontSize: 16 }}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            onClick={() => { onTalkToNPC(building.zoneId); onClose(); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💬 Talk to {building.npcName}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
