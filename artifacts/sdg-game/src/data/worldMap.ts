import type { ZoneId } from './gameData';

export const WORLD_W = 2800;
export const WORLD_H = 2000;
export const PLAYER_SPEED = 3.2;
export const INTERACT_RADIUS = 85;
export const PLAYER_SPAWN = { x: 1380, y: 980 };

export interface ZoneRegion {
  id: ZoneId;
  x: number; y: number;
  w: number; h: number;
  color: string;
  borderColor: string;
  name: string;
  emoji: string;
  sdg: number;
}

export interface WorldNPC {
  id: string;
  name: string;
  x: number; y: number;
  zoneId: ZoneId;
  isLord: boolean;
  dialogues: string[];
  spriteKey: string;
  bubble?: string;
  facing?: 'left' | 'right';
}

export interface CollisionRect {
  x: number; y: number; w: number; h: number;
}

export interface WorldBuilding {
  x: number; y: number; w: number; h: number;
  type: 'cottage' | 'barn' | 'clinic' | 'school' | 'tower' | 'shop' | 'well' | 'sign';
  color: string;
  roofColor: string;
  label?: string;
}

/* ── 5 zone regions ── */
export const ZONE_REGIONS: ZoneRegion[] = [
  { id: 'equality',  x: 150,  y: 120,  w: 620, h: 520, color: '#FFF3E0', borderColor: '#FF8F00', name: "Sparkleflame's City", emoji: '⚡', sdg: 5 },
  { id: 'health',    x: 1090, y: 80,   w: 620, h: 520, color: '#E8F5E9', borderColor: '#2E7D32', name: "Leaflet's Clinic",    emoji: '🏥', sdg: 3 },
  { id: 'hunger',    x: 2030, y: 120,  w: 620, h: 520, color: '#FFF8E1', borderColor: '#F57F17', name: "Pebblepuff's Farm",   emoji: '🌾', sdg: 2 },
  { id: 'poverty',   x: 150,  y: 1360, w: 620, h: 520, color: '#FFEBEE', borderColor: '#C62828', name: "Baloo's Village",     emoji: '🏘️', sdg: 1 },
  { id: 'education', x: 2030, y: 1360, w: 620, h: 520, color: '#EDE7F6', borderColor: '#4A148C', name: "Thinklet's Academy",  emoji: '🎓', sdg: 4 },
];

/* ── Zone lord NPCs ── */
export const WORLD_NPCS: WorldNPC[] = [
  // LORDS
  {
    id: 'baloo', name: 'Baloo', x: 340, y: 1620, zoneId: 'poverty', isLord: true,
    spriteKey: 'baloo', bubble: '😞',
    dialogues: [
      "Oh, Warden! Our village is crumbling...",
      "Families have lost jobs and homes are falling apart.",
      "Help us solve the poverty crisis and bring life back to our village!",
    ],
  },
  {
    id: 'pebblepuff', name: 'Pebblepuff', x: 2260, y: 370, zoneId: 'hunger', isLord: true,
    spriteKey: 'pebblepuff', bubble: '🌾',
    dialogues: [
      "The crops have wilted and the food stores are empty!",
      "My tummy is grumbling louder than a thunderstorm...",
      "Help me grow and share food with all the hungry villagers!",
    ],
  },
  {
    id: 'leaflet', name: 'Leaflet', x: 1360, y: 280, zoneId: 'health', isLord: true,
    spriteKey: 'leaflet', bubble: '🌿',
    dialogues: [
      "The clinic is overwhelmed! Patients keep arriving...",
      "But medicine alone won't solve the real problems!",
      "Help me find the right treatments and teach healthy habits!",
    ],
  },
  {
    id: 'thinklet', name: 'Thinklet', x: 2260, y: 1610, zoneId: 'education', isLord: true,
    spriteKey: 'thinklet', bubble: '📚',
    dialogues: [
      "My academy is in chaos! Students are unhappy...",
      "Every child deserves the right support to learn and grow!",
      "Help me match each student to what they truly need!",
    ],
  },
  {
    id: 'sparkleflame', name: 'Sparkleflame', x: 350, y: 340, zoneId: 'equality', isLord: true,
    spriteKey: 'sparkleflame', bubble: '😤',
    dialogues: [
      "The city is full of unfair rules! People are being treated differently.",
      "No one should be held back because of who they are!",
      "Stand up for fairness and let's make the city shine with equality!",
    ],
  },

  // VILLAGERS – Poverty zone
  {
    id: 'grandma_rosa', name: 'Grandma Rosa', x: 210, y: 1530, zoneId: 'poverty', isLord: false,
    spriteKey: 'grandma', facing: 'right',
    dialogues: ["My roof has been leaking for months... I need help.", "A warm home is all I ask for."],
  },
  {
    id: 'young_maya', name: 'Young Maya', x: 480, y: 1720, zoneId: 'poverty', isLord: false,
    spriteKey: 'youngmaya', facing: 'left',
    dialogues: ["I want to learn new skills but there are no programs for me.", "If I had training, I could support my family!"],
  },
  {
    id: 'lee_father', name: 'Mr. Lee', x: 620, y: 1580, zoneId: 'poverty', isLord: false,
    spriteKey: 'leefather', facing: 'left',
    dialogues: ["I lost my job last month.", "The bakery nearby is hiring but I don't know how to apply..."],
  },

  // FARMERS – Hunger zone
  {
    id: 'farmer_ali', name: 'Ali', x: 2080, y: 250, zoneId: 'hunger', isLord: false,
    spriteKey: 'farmerali', facing: 'right',
    dialogues: ["These seeds won't grow without enough water!", "I've been farming all my life but the drought is too much."],
  },
  {
    id: 'citizen_mia', name: 'Mia', x: 2420, y: 520, zoneId: 'hunger', isLord: false,
    spriteKey: 'citizenmia',
    dialogues: ["I haven't eaten properly in days...", "Fresh vegetables would be wonderful right now."],
  },
  {
    id: 'citizen_tom', name: 'Tom', x: 2530, y: 280, zoneId: 'hunger', isLord: false,
    spriteKey: 'citizentom', facing: 'left',
    dialogues: ["A good harvest feeds the whole village.", "Sharing food is what brings our community together!"],
  },

  // PATIENTS – Health zone
  {
    id: 'mr_bun', name: 'Mr. Bun', x: 1140, y: 450, zoneId: 'health', isLord: false,
    spriteKey: 'mrbun', facing: 'right',
    dialogues: ["Ugh, my tummy hurts so much today.", "I think it's all the junk food I've been eating..."],
  },
  {
    id: 'little_zoe', name: 'Little Zoe', x: 1580, y: 200, zoneId: 'health', isLord: false,
    spriteKey: 'littlezoe',
    dialogues: ["I feel so stressed I can't focus on anything.", "Maybe I need to talk to someone?"],
  },
  {
    id: 'grandpa_joe', name: 'Grandpa Joe', x: 1150, y: 180, zoneId: 'health', isLord: false,
    spriteKey: 'grandpajoe', facing: 'right',
    dialogues: ["This polluted air is making me cough so badly.", "We need to plant more trees around here!"],
  },

  // STUDENTS – Education zone
  {
    id: 'student_sam', name: 'Sam', x: 2080, y: 1500, zoneId: 'education', isLord: false,
    spriteKey: 'studentsam', facing: 'right',
    dialogues: ["I love math but I have no one to play with at school.", "A sports club might help me make friends!"],
  },
  {
    id: 'student_aria', name: 'Aria', x: 2480, y: 1460, zoneId: 'education', isLord: false,
    spriteKey: 'studentaria',
    dialogues: ["I love science experiments but there's no lab class.", "I learn best when I can explore and discover things!"],
  },
  {
    id: 'student_leo', name: 'Leo', x: 2380, y: 1720, zoneId: 'education', isLord: false,
    spriteKey: 'studentleo', facing: 'left',
    dialogues: ["Everything feels like too much pressure right now...", "I just need someone to talk to."],
  },

  // CITIZENS – Equality zone
  {
    id: 'equality_zara', name: 'Zara', x: 190, y: 460, zoneId: 'equality', isLord: false,
    spriteKey: 'girl',
    dialogues: ["I want to join the football team but they won't let me!", "It's not fair — I'm just as good as anyone else!"],
  },
  {
    id: 'equality_worker', name: 'Priya', x: 600, y: 500, zoneId: 'equality', isLord: false,
    spriteKey: 'worker', facing: 'left',
    dialogues: ["I do the same work as my colleague but earn much less.", "Is this really fair?"],
  },
  {
    id: 'equality_sibling', name: 'Jamie', x: 400, y: 560, zoneId: 'equality', isLord: false,
    spriteKey: 'sibling',
    dialogues: ["I have to do all the chores at home while my sibling does nothing.", "Shouldn't we share responsibilities equally?"],
  },
];

/* ── Buildings for each zone ── */
export const WORLD_BUILDINGS: WorldBuilding[] = [
  // Central plaza well
  { x: 1330, y: 940, w: 100, h: 100, type: 'well', color: '#B0BEC5', roofColor: '#78909C', label: 'Town Well' },

  // Equality City buildings
  { x: 180, y: 160, w: 130, h: 100, type: 'tower', color: '#FFF3E0', roofColor: '#FF8F00' },
  { x: 340, y: 145, w: 160, h: 120, type: 'tower', color: '#FFF3E0', roofColor: '#FF8F00' },
  { x: 520, y: 160, w: 140, h: 110, type: 'tower', color: '#FFF3E0', roofColor: '#FF6F00' },
  { x: 200, y: 290, w: 100, h: 80, type: 'shop', color: '#FFCCBC', roofColor: '#FF5722', label: 'Market' },
  { x: 560, y: 290, w: 120, h: 90, type: 'shop', color: '#FFCCBC', roofColor: '#FF5722' },

  // Health Clinic buildings
  { x: 1100, y: 100, w: 200, h: 150, type: 'clinic', color: '#E8F5E9', roofColor: '#2E7D32', label: 'Clinic' },
  { x: 1340, y: 100, w: 140, h: 130, type: 'cottage', color: '#F1F8E9', roofColor: '#33691E' },
  { x: 1510, y: 100, w: 130, h: 120, type: 'cottage', color: '#F1F8E9', roofColor: '#33691E' },
  { x: 1650, y: 100, w: 90, h: 100, type: 'shop', color: '#DCEDC8', roofColor: '#558B2F', label: 'Pharmacy' },

  // Hunger Farm buildings
  { x: 2050, y: 150, w: 200, h: 160, type: 'barn', color: '#FFF8E1', roofColor: '#F57F17', label: 'Barn' },
  { x: 2270, y: 160, w: 100, h: 120, type: 'cottage', color: '#EFEBE9', roofColor: '#5D4037' },
  { x: 2390, y: 150, w: 90, h: 100, type: 'shop', color: '#FFECB3', roofColor: '#FF8F00' },
  { x: 2510, y: 160, w: 120, h: 110, type: 'barn', color: '#FFF8E1', roofColor: '#E65100' },

  // Poverty Village buildings
  { x: 180, y: 1390, w: 120, h: 100, type: 'cottage', color: '#FFCDD2', roofColor: '#C62828', label: 'House' },
  { x: 330, y: 1380, w: 140, h: 120, type: 'cottage', color: '#FFCDD2', roofColor: '#B71C1C' },
  { x: 500, y: 1390, w: 120, h: 100, type: 'cottage', color: '#FFCDD2', roofColor: '#C62828' },
  { x: 640, y: 1380, w: 100, h: 110, type: 'cottage', color: '#EF9A9A', roofColor: '#D32F2F' },
  { x: 200, y: 1790, w: 130, h: 80, type: 'shop', color: '#FFAB91', roofColor: '#BF360C', label: 'Shelter' },
  { x: 550, y: 1790, w: 110, h: 80, type: 'cottage', color: '#FFCDD2', roofColor: '#C62828' },

  // Education Academy buildings
  { x: 2040, y: 1370, w: 240, h: 180, type: 'school', color: '#EDE7F6', roofColor: '#4A148C', label: 'Academy' },
  { x: 2310, y: 1380, w: 130, h: 120, type: 'cottage', color: '#E1BEE7', roofColor: '#6A1B9A' },
  { x: 2460, y: 1370, w: 110, h: 110, type: 'shop', color: '#E8EAF6', roofColor: '#311B92', label: 'Library' },
  { x: 2600, y: 1380, w: 90, h: 100, type: 'cottage', color: '#D1C4E9', roofColor: '#4527A0' },
];

/* ── Collision boxes (can't walk through buildings) ── */
export const COLLISION_RECTS: CollisionRect[] = WORLD_BUILDINGS.map(b => ({
  x: b.x, y: b.y, w: b.w, h: b.h,
})).concat([
  // World border (invisible walls)
  { x: -50, y: -50, w: 50, h: WORLD_H + 100 },
  { x: WORLD_W, y: -50, w: 50, h: WORLD_H + 100 },
  { x: -50, y: -50, w: WORLD_W + 100, h: 50 },
  { x: -50, y: WORLD_H, w: WORLD_W + 100, h: 50 },
]);
