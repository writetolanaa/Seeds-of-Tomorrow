import type { ZoneId } from './gameData';

export const WORLD_W = 3200;
export const WORLD_H = 11000;
export const PLAYER_SPEED = 5;
export const INTERACT_RADIUS = 100;
export const PLAYER_SPAWN = { x: 1580, y: 1200 };

export interface ZoneRegion {
  id: ZoneId;
  x: number; y: number;
  w: number; h: number;
  color: string;
  borderColor: string;
  name: string;
  emoji: string;
  sdg: number;
  level: 'people' | 'planet' | 'prosperity' | 'peace' | 'partnership';
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
  isHidden?: boolean;
}

export interface CollisionRect {
  x: number; y: number; w: number; h: number;
}

export interface WorldBuilding {
  x: number; y: number; w: number; h: number;
  type: 'cottage' | 'barn' | 'clinic' | 'school' | 'tower' | 'shop' | 'well' | 'sign' | 'factory' | 'lighthouse' | 'treehouse';
  color: string;
  roofColor: string;
  label?: string;
}

/* ── PEOPLE LEVEL – 5 zones ── */
export const PEOPLE_ZONE_REGIONS: ZoneRegion[] = [
  { id: 'equality',  x: 200,  y: 140,  w: 680, h: 560, color: '#FFF3E0', borderColor: '#FF8F00', name: "Sparkleflame's City", emoji: '⚡', sdg: 5, level: 'people' },
  { id: 'health',    x: 1240, y: 90,   w: 680, h: 560, color: '#E8F5E9', borderColor: '#2E7D32', name: "Leaflet's Clinic",    emoji: '🏥', sdg: 3, level: 'people' },
  { id: 'hunger',    x: 2320, y: 140,  w: 680, h: 560, color: '#FFF8E1', borderColor: '#F57F17', name: "Pebblepuff's Farm",   emoji: '🌾', sdg: 2, level: 'people' },
  { id: 'poverty',   x: 200,  y: 1400, w: 680, h: 560, color: '#FFEBEE', borderColor: '#C62828', name: "Baloo's Village",     emoji: '🏘️', sdg: 1, level: 'people' },
  { id: 'education', x: 2320, y: 1400, w: 680, h: 560, color: '#EDE7F6', borderColor: '#4A148C', name: "Thinklet's Academy",  emoji: '🎓', sdg: 4, level: 'people' },
];

/* ── PLANET LEVEL – 5 zones ── */
export const PLANET_ZONE_REGIONS: ZoneRegion[] = [
  { id: 'water',       x: 200,  y: 2600, w: 720, h: 580, color: '#E1F5FE', borderColor: '#0288D1', name: "Aqua's River Valley",    emoji: '💧', sdg: 6,  level: 'planet' },
  { id: 'ocean',       x: 2280, y: 2600, w: 720, h: 580, color: '#E0F7FA', borderColor: '#006064', name: "Coralina's Ocean Reef",   emoji: '🐠', sdg: 14, level: 'planet' },
  { id: 'forest',      x: 200,  y: 3500, w: 720, h: 580, color: '#E8F5E9', borderColor: '#1B5E20', name: "Ferra's Ancient Jungle",  emoji: '🌿', sdg: 15, level: 'planet' },
  { id: 'climate',     x: 2280, y: 3500, w: 720, h: 580, color: '#FBE9E7', borderColor: '#BF360C', name: "Gaia's Climate Watch",    emoji: '🌡️', sdg: 13, level: 'planet' },
  { id: 'consumption', x: 1050, y: 4000, w: 1100, h: 520, color: '#F1F8E9', borderColor: '#558B2F', name: "Reevo's Recycling Hub",  emoji: '♻️', sdg: 12, level: 'planet' },
];

/* ── PROSPERITY LEVEL – 5 zones (SDG 7-11) y=4800-7100 ── */
export const PROSPERITY_ZONE_REGIONS: ZoneRegion[] = [
  { id: 'energy',      x: 200,  y: 4880, w: 680, h: 560, color: '#FFFDE7', borderColor: '#F9A825', name: "Voltra's Energy Fields",    emoji: '⚡', sdg: 7,  level: 'prosperity' },
  { id: 'industry',    x: 2320, y: 4880, w: 680, h: 560, color: '#FBE9E7', borderColor: '#E65100', name: "Gilda's Factory Town",       emoji: '🏭', sdg: 8,  level: 'prosperity' },
  { id: 'innovation',  x: 1240, y: 4880, w: 680, h: 560, color: '#E3F2FD', borderColor: '#1565C0', name: 'Nexus Innovation Hub',        emoji: '🔬', sdg: 9,  level: 'prosperity' },
  { id: 'communities', x: 200,  y: 6040, w: 680, h: 560, color: '#F3E5F5', borderColor: '#6A1B9A', name: "Mira's Community Housing",    emoji: '🏘️', sdg: 10, level: 'prosperity' },
  { id: 'cities',      x: 2320, y: 6040, w: 680, h: 560, color: '#E0F2F1', borderColor: '#00695C', name: "Skylar's Smart City",         emoji: '🏙️', sdg: 11, level: 'prosperity' },
];

/* ── PEACE LEVEL – 1 zone (SDG 16) y=7400-9000 ── */
export const PEACE_ZONE_REGIONS: ZoneRegion[] = [
  { id: 'peace', x: 800, y: 7500, w: 1600, h: 1200, color: '#E8EAF6', borderColor: '#1A237E', name: "Justia's Peace Court", emoji: '⚖️', sdg: 16, level: 'peace' },
];

/* ── PARTNERSHIP LEVEL – 1 zone (SDG 17) y=9200-10800 ── */
export const PARTNERSHIP_ZONE_REGIONS: ZoneRegion[] = [
  { id: 'partnership', x: 800, y: 9300, w: 1600, h: 1200, color: '#F3E5F5', borderColor: '#4A148C', name: "Accord's Global Summit", emoji: '🤝', sdg: 17, level: 'partnership' },
];

export const ZONE_REGIONS: ZoneRegion[] = [...PEOPLE_ZONE_REGIONS, ...PLANET_ZONE_REGIONS, ...PROSPERITY_ZONE_REGIONS, ...PEACE_ZONE_REGIONS, ...PARTNERSHIP_ZONE_REGIONS];

/* ── PEOPLE LEVEL NPCs ── */
export const PEOPLE_NPCS: WorldNPC[] = [
  // Lords
  { id: 'baloo', name: 'Baloo', x: 390, y: 1680, zoneId: 'poverty', isLord: true, spriteKey: 'baloo', bubble: '😞',
    dialogues: ["Oh Warden! Our village is crumbling...", "Families have lost jobs and homes are falling apart.", "Help us solve the poverty crisis and bring life back to our village!"] },
  { id: 'sparkleflame', name: 'Sparkleflame', x: 390, y: 360, zoneId: 'equality', isLord: true, spriteKey: 'sparkleflame', bubble: '😤',
    dialogues: ["The city is full of unfair rules! People are being treated differently.", "No one should be held back because of who they are!", "Stand up for fairness and let's make the city shine with equality!"] },

  // Hidden building lords — live inside their buildings, not rendered in exterior
  { id: 'pebblepuff', name: 'Pebblepuff', x: 0, y: 0, zoneId: 'hunger', isLord: true, spriteKey: 'pebblepuff', isHidden: true, bubble: '🌾',
    dialogues: ["Welcome to my greenhouse! Hunger is a solvable problem.", "820 million people still go to bed hungry every night...", "Let's work together to grow food for everyone! Accept my harvest quest?"] },
  { id: 'leaflet', name: 'Leaflet', x: 0, y: 0, zoneId: 'health', isLord: true, spriteKey: 'leaflet', isHidden: true, bubble: '💊',
    dialogues: ["This clinic is open for everyone — no one should be turned away.", "Good health comes from clean water, food, and care.", "Help me heal this community! Will you take on the healing challenge?"] },
  { id: 'thinklet', name: 'Thinklet', x: 0, y: 0, zoneId: 'education', isLord: true, spriteKey: 'thinklet', isHidden: true, bubble: '📚',
    dialogues: ["Welcome to the academy! Education changes everything.", "300 million children worldwide can't read. We can change that!", "Ready to tackle the knowledge quiz and bring learning to all?"] },

  // Citizens
  { id: 'grandma_rosa', name: 'Grandma Rosa', x: 260, y: 1560, zoneId: 'poverty', isLord: false, spriteKey: 'grandma',
    dialogues: ["My roof is leaking and I can't afford to fix it.", "Even small help makes a big difference for our community."] },
  { id: 'young_maya', name: 'Young Maya', x: 560, y: 1620, zoneId: 'poverty', isLord: false, spriteKey: 'youngmaya',
    dialogues: ["I had to leave school to help my family with money.", "Education opens doors — I hope to return someday."] },
  { id: 'farmer_ali', name: 'Farmer Ali', x: 2480, y: 480, zoneId: 'hunger', isLord: false, spriteKey: 'farmerali',
    dialogues: ["We had good rain, but no tools to harvest properly.", "Sharing knowledge about farming helps the whole village!"] },
  { id: 'citizen_mia', name: 'Citizen Mia', x: 2700, y: 540, zoneId: 'hunger', isLord: false, spriteKey: 'citizenmia',
    dialogues: ["My children are hungry, but the market is so far away.", "Local food gardens would help everyone here."] },
  { id: 'mr_bun', name: 'Mr. Bun', x: 1420, y: 420, zoneId: 'health', isLord: false, spriteKey: 'mrbun',
    dialogues: ["I keep getting sick because I don't know how to eat well.", "Learning about nutrition changed my whole life!"] },
  { id: 'little_zoe', name: 'Little Zoe', x: 1700, y: 380, zoneId: 'health', isLord: false, spriteKey: 'littlezoe',
    dialogues: ["I feel anxious all the time and nobody talks about it.", "Mental health is just as important as physical health!"] },
  { id: 'student_sam', name: 'Sam', x: 2440, y: 1520, zoneId: 'education', isLord: false, spriteKey: 'studentsam',
    dialogues: ["I love math but I have no one to play with at school.", "A sports club might help me make friends!"] },
  { id: 'student_aria', name: 'Aria', x: 2780, y: 1540, zoneId: 'education', isLord: false, spriteKey: 'studentaria',
    dialogues: ["I love science but there's no lab class here.", "I learn best when I can explore and discover!"] },
  { id: 'equality_zara', name: 'Zara', x: 260, y: 480, zoneId: 'equality', isLord: false, spriteKey: 'girl',
    dialogues: ["I want to join the football team but they won't let me!", "It's not fair — I'm just as good as anyone else!"] },
  { id: 'equality_priya', name: 'Priya', x: 650, y: 520, zoneId: 'equality', isLord: false, spriteKey: 'worker', facing: 'left',
    dialogues: ["I do the same work as my colleague but earn much less.", "Is this really fair?"] },
];

/* ── PLANET LEVEL NPCs ── */
export const PLANET_NPCS: WorldNPC[] = [
  // Lords
  { id: 'aqua', name: 'Aqua', x: 400, y: 2840, zoneId: 'water', isLord: true, spriteKey: 'aqua', bubble: '💧',
    dialogues: ["Warden! Our river is turning black with pollution!", "Oil spills and factory waste are poisoning the water downstream.", "Help me deploy cleanup tools before the villages lose their water supply!"] },
  { id: 'coralina', name: 'Coralina', x: 2440, y: 2840, zoneId: 'ocean', isLord: true, isHidden: true, spriteKey: 'coralina', bubble: '🐠',
    dialogues: ["The coral reefs are bleaching and plastic is everywhere!", "Sea turtles are tangled in ghost nets. The ocean is sick.", "Help me clean the ocean zones and rescue the marine life!"] },
  { id: 'ferra', name: 'Ferra', x: 400, y: 3740, zoneId: 'forest', isLord: true, spriteKey: 'ferra', bubble: '🌿',
    dialogues: ["They are cutting down my ancient trees! Fires are spreading!", "Animals are fleeing and the soil is turning to dust.", "Help me plant trees, fight fires, and protect the wildlife!"] },
  { id: 'gaia', name: 'Gaia', x: 2440, y: 3740, zoneId: 'climate', isLord: true, spriteKey: 'gaia', bubble: '🌡️',
    dialogues: ["CO₂ is rising and glaciers are melting faster than ever!", "Storms, droughts, and floods are getting worse every year.", "Help me choose the right climate policies to stabilize our world!"] },
  { id: 'reevo', name: 'Reevo', x: 1600, y: 4220, zoneId: 'consumption', isLord: true, spriteKey: 'reevo', bubble: '♻️',
    dialogues: ["The recycling hub is buried under mountains of waste!", "People are throwing away things that could be reused or repaired.", "Help me sort, process, and craft — zero waste is the goal!"] },

  // Planet citizens
  { id: 'river_fisher', name: 'Old Fisher', x: 600, y: 2920, zoneId: 'water', isLord: false, spriteKey: 'grandpajoe',
    dialogues: ["The fish are all gone. The river smells terrible now.", "Clean water is life — without it, everything suffers."] },
  { id: 'water_child', name: 'River Child', x: 260, y: 2940, zoneId: 'water', isLord: false, spriteKey: 'citizenmia',
    dialogues: ["We have to walk 2 hours every day just to get clean water.", "A clean river would change everything for our village!"] },
  { id: 'diver', name: 'Diver Maya', x: 2620, y: 2920, zoneId: 'ocean', isLord: false, spriteKey: 'youngmaya', facing: 'left',
    dialogues: ["The coral used to be so colorful! Now it's all white.", "Plastic bags look like jellyfish to sea turtles — it's deadly!"] },
  { id: 'marine_guard', name: 'Sea Guard', x: 2780, y: 2960, zoneId: 'ocean', isLord: false, spriteKey: 'worker',
    dialogues: ["We found an oil spill just north of the reef.", "Every second counts when oil spreads in the ocean!"] },
  { id: 'jungle_kid', name: 'Forest Kid', x: 600, y: 3820, zoneId: 'forest', isLord: false, spriteKey: 'studentsam',
    dialogues: ["The monkeys and birds disappeared when the logging started.", "Trees are homes for thousands of animals!"] },
  { id: 'ranger', name: 'Ranger Kai', x: 260, y: 3840, zoneId: 'forest', isLord: false, spriteKey: 'farmerali', facing: 'left',
    dialogues: ["Poachers are targeting endangered species near the south grove.", "We need more patrols and better monitoring equipment."] },
  { id: 'climate_scientist', name: 'Dr. Frost', x: 2620, y: 3820, zoneId: 'climate', isLord: false, spriteKey: 'grandpajoe', facing: 'left',
    dialogues: ["CO₂ just crossed 420 parts per million. We're in crisis.", "Every degree of warming makes extreme weather more frequent!"] },
  { id: 'climate_youth', name: 'Eco Mira', x: 2780, y: 3860, zoneId: 'climate', isLord: false, spriteKey: 'girl',
    dialogues: ["We skipped school to march for climate action.", "The youth of today will live through the decisions of today!"] },
  { id: 'recycler', name: 'Sorter Jo', x: 1420, y: 4260, zoneId: 'consumption', isLord: false, spriteKey: 'citizentom',
    dialogues: ["People keep putting batteries in the food waste bin!", "Sorting correctly means materials can be reused, not landfilled."] },
  { id: 'crafter', name: 'Maker Zoe', x: 1780, y: 4240, zoneId: 'consumption', isLord: false, spriteKey: 'littlezoe',
    dialogues: ["I turned old bottles into garden pots for our school!", "One person's trash really can be another's treasure."] },
];

/* ── PROSPERITY LEVEL NPCs (SDG 7-11) ── */
export const PROSPERITY_NPCS: WorldNPC[] = [
  // Lords
  { id: 'voltra', name: 'Voltra', x: 390, y: 5100, zoneId: 'energy', isLord: true, spriteKey: 'voltra', bubble: '⚡',
    dialogues: ["The solar arrays are offline and the wind stopped blowing!", "We need smart energy networks to store and share power!", "Help me connect clean energy to every home in the region!"] },
  { id: 'gilda', name: 'Gilda', x: 2600, y: 5100, zoneId: 'industry', isLord: true, spriteKey: 'gilda', bubble: '🏭',
    dialogues: ["The factories are running but workers are suffering!", "Fair wages and safe conditions make everyone more productive.", "Help me balance growth with dignity for every worker!"] },
  { id: 'nexus', name: 'Nexus', x: 1580, y: 5060, zoneId: 'innovation', isLord: true, spriteKey: 'nexus', bubble: '🔬',
    dialogues: ["The research hub has lost all funding and direction!", "Innovation needs investment, collaboration, and daring ideas.", "Help me connect inventors with the resources they need!"] },
  { id: 'mira', name: 'Mira', x: 390, y: 6260, zoneId: 'communities', isLord: true, spriteKey: 'mira', bubble: '🏘️',
    dialogues: ["The gap between rich and poor neighborhoods is growing!", "Every family deserves a safe, affordable home to call their own.", "Help me design communities where everyone belongs!"] },
  { id: 'skylar', name: 'Skylar', x: 2600, y: 6260, zoneId: 'cities', isLord: true, spriteKey: 'skylar', bubble: '🏙️',
    dialogues: ["Traffic, smog, and waste are choking our beautiful city!", "Smart design can make cities cleaner, greener, and more joyful.", "Help me build the sustainable city of the future!"] },

  // Citizens
  { id: 'solar_tech', name: 'Sol', x: 260, y: 5160, zoneId: 'energy', isLord: false, spriteKey: 'studentsam',
    dialogues: ["I installed solar panels on my roof last year!", "My electricity bills went from crazy to almost zero!"] },
  { id: 'wind_worker', name: 'Winnie', x: 560, y: 5180, zoneId: 'energy', isLord: false, spriteKey: 'girl',
    dialogues: ["The wind turbines create twice as many jobs as old coal plants.", "Clean energy is also good for local economies!"] },
  { id: 'factory_worker', name: 'Tom', x: 2440, y: 5160, zoneId: 'industry', isLord: false, spriteKey: 'citizentom',
    dialogues: ["Our factory just got safety inspections — it actually helps!", "When workers feel safe, they produce better quality goods."] },
  { id: 'entrepreneur', name: 'Zara', x: 2750, y: 5180, zoneId: 'industry', isLord: false, spriteKey: 'youngmaya',
    dialogues: ["I started my own small workshop making recycled furniture.", "Small businesses create most of the world's employment!"] },
  { id: 'inventor', name: 'Kai', x: 1440, y: 5060, zoneId: 'innovation', isLord: false, spriteKey: 'studentaria',
    dialogues: ["My 3D-printed water filter can purify a liter per minute!", "Open-source designs let anyone build solutions anywhere."] },
  { id: 'engineer', name: 'Priya', x: 1720, y: 5060, zoneId: 'innovation', isLord: false, spriteKey: 'worker',
    dialogues: ["Better bridges and roads reduce transport costs for everyone.", "Infrastructure is the backbone of a thriving economy."] },
  { id: 'neighbor', name: 'Rosa', x: 260, y: 6300, zoneId: 'communities', isLord: false, spriteKey: 'grandma',
    dialogues: ["Our new community garden brought everyone together!", "Mixed neighborhoods mean rich kids and poor kids grow up as friends."] },
  { id: 'youth_activist', name: 'Theo', x: 560, y: 6300, zoneId: 'communities', isLord: false, spriteKey: 'studentsam',
    dialogues: ["We marched for affordable housing last weekend.", "No one should sleep outside in a city this wealthy!"] },
  { id: 'city_planner', name: 'Maya', x: 2440, y: 6300, zoneId: 'cities', isLord: false, spriteKey: 'youngmaya', facing: 'left',
    dialogues: ["Our new tram line cut car use by 30% in two years!", "Green rooftops reduce heat and improve air quality for everyone."] },
  { id: 'smart_city_kid', name: 'Leo', x: 2770, y: 6300, zoneId: 'cities', isLord: false, spriteKey: 'littlezoe',
    dialogues: ["The city app tells me where the cleanest air parks are.", "Smart cities use data to make daily life better!"] },
];

/* ── PEACE LEVEL NPCs (SDG 16) ── */
export const PEACE_NPCS: WorldNPC[] = [
  { id: 'justia', name: 'Justia', x: 1580, y: 7880, zoneId: 'peace', isLord: true, spriteKey: 'thinklet', bubble: '⚖️',
    dialogues: ["The courts are broken and corruption runs rampant through our institutions!", "Real peace comes from fair laws applied equally to everyone.", "Help me investigate cases and make just decisions to restore trust in our system!"] },
  { id: 'justice_elder', name: 'Elder Ward', x: 1000, y: 7960, zoneId: 'peace', isLord: false, spriteKey: 'grandpajoe',
    dialogues: ["I waited 3 years for a simple court case to be resolved.", "Slow justice is no justice — efficient courts matter as much as fair ones."] },
  { id: 'whistleblower', name: 'Pat', x: 1380, y: 7980, zoneId: 'peace', isLord: false, spriteKey: 'youngmaya',
    dialogues: ["I reported corruption and was ignored for months.", "Transparency laws exist to protect people like me!"] },
  { id: 'mediator', name: 'Soren', x: 1780, y: 7960, zoneId: 'peace', isLord: false, spriteKey: 'farmerali', facing: 'left',
    dialogues: ["Mediation resolved our land dispute in one week.", "Peaceful dialogue prevents conflicts from escalating."] },
  { id: 'youth_rights', name: 'Amira', x: 2160, y: 7950, zoneId: 'peace', isLord: false, spriteKey: 'girl',
    dialogues: ["Young people have a right to participate in decisions that affect us.", "Inclusive institutions build lasting peace!"] },
];

/* ── PARTNERSHIP LEVEL NPCs (SDG 17) ── */
export const PARTNERSHIP_NPCS: WorldNPC[] = [
  { id: 'accord', name: 'Accord', x: 1580, y: 9680, zoneId: 'partnership', isLord: true, spriteKey: 'nexus', bubble: '🤝',
    dialogues: ["The world's SDGs are stalling — nations are working in silos instead of together!", "No single country, company, or NGO can solve global challenges alone.", "Help me forge the right partnerships to unlock progress on all 17 Goals!"] },
  { id: 'diplomat', name: 'Ambassador Li', x: 1000, y: 9760, zoneId: 'partnership', isLord: false, spriteKey: 'grandpajoe',
    dialogues: ["Our nations share 80% of the same challenges.", "Joint research partnerships save billions compared to working alone."] },
  { id: 'ngo_leader', name: 'Dr. Kofi', x: 1380, y: 9780, zoneId: 'partnership', isLord: false, spriteKey: 'citizentom',
    dialogues: ["NGOs connect communities with the funding they need.", "Local knowledge makes global funding 3× more effective."] },
  { id: 'tech_transfer', name: 'Mia', x: 1780, y: 9760, zoneId: 'partnership', isLord: false, spriteKey: 'youngmaya', facing: 'left',
    dialogues: ["Technology transfer to developing nations accelerates all SDGs.", "Open-source solutions multiply impact across borders."] },
  { id: 'funding_rep', name: 'Commissioner Ray', x: 2160, y: 9750, zoneId: 'partnership', isLord: false, spriteKey: 'worker',
    dialogues: ["Public-private partnerships can fund clean infrastructure.", "When governments and companies align on SDGs — magic happens!"] },
];

export const WORLD_NPCS: WorldNPC[] = [...PEOPLE_NPCS, ...PLANET_NPCS, ...PROSPERITY_NPCS, ...PEACE_NPCS, ...PARTNERSHIP_NPCS];

/* ── BUILDINGS ── */
export const WORLD_BUILDINGS: WorldBuilding[] = [
  // Central People plaza well
  { x: 1530, y: 960, w: 100, h: 100, type: 'well', color: '#B0BEC5', roofColor: '#78909C', label: 'Town Well' },

  // Equality City
  { x: 230, y: 180, w: 140, h: 110, type: 'tower', color: '#FFF3E0', roofColor: '#FF8F00' },
  { x: 390, y: 165, w: 180, h: 130, type: 'tower', color: '#FFF3E0', roofColor: '#FF8F00' },
  { x: 600, y: 180, w: 150, h: 120, type: 'tower', color: '#FFF3E0', roofColor: '#FF6F00' },
  { x: 250, y: 320, w: 110, h: 90, type: 'shop', color: '#FFCCBC', roofColor: '#FF5722', label: 'Market' },
  { x: 620, y: 320, w: 130, h: 100, type: 'shop', color: '#FFCCBC', roofColor: '#FF5722' },

  // Health Clinic — flanking the central enterable hospital (x=1490)
  { x: 1250, y: 120, w: 200, h: 150, type: 'clinic', color: '#E8F5E9', roofColor: '#2E7D32', label: 'Clinic' },
  { x: 1720, y: 120, w: 140, h: 130, type: 'cottage', color: '#F1F8E9', roofColor: '#33691E' },
  { x: 1880, y: 120, w: 100, h: 110, type: 'shop', color: '#DCEDC8', roofColor: '#558B2F', label: 'Pharmacy' },

  // Hunger Farm — kept left/right of the central greenhouse
  { x: 2330, y: 180, w: 200, h: 160, type: 'barn', color: '#FFF8E1', roofColor: '#F57F17', label: 'Barn' },
  { x: 2790, y: 190, w: 110, h: 130, type: 'cottage', color: '#EFEBE9', roofColor: '#5D4037' },
  { x: 2920, y: 185, w: 100, h: 110, type: 'shop', color: '#FFECB3', roofColor: '#FF8F00' },

  // Poverty Village
  { x: 230, y: 1450, w: 130, h: 110, type: 'cottage', color: '#FFCDD2', roofColor: '#C62828', label: 'House' },
  { x: 390, y: 1430, w: 150, h: 130, type: 'cottage', color: '#FFCDD2', roofColor: '#B71C1C' },
  { x: 570, y: 1450, w: 130, h: 110, type: 'cottage', color: '#FFCDD2', roofColor: '#C62828' },
  { x: 730, y: 1440, w: 110, h: 120, type: 'cottage', color: '#EF9A9A', roofColor: '#D32F2F' },
  { x: 260, y: 1840, w: 140, h: 90, type: 'shop', color: '#FFAB91', roofColor: '#BF360C', label: 'Shelter' },
  { x: 620, y: 1840, w: 120, h: 90, type: 'cottage', color: '#FFCDD2', roofColor: '#C62828' },

  // Education district — kept well clear of the enterable school (x=2560)
  { x: 2030, y: 1420, w: 200, h: 175, type: 'school', color: '#EDE7F6', roofColor: '#4A148C', label: 'Academy' },
  { x: 2250, y: 1430, w: 130, h: 140, type: 'shop',    color: '#E8EAF6', roofColor: '#311B92', label: 'Library' },
  { x: 2810, y: 1445, w: 130, h: 130, type: 'cottage', color: '#E1BEE7', roofColor: '#6A1B9A' },
  { x: 2960, y: 1440, w: 110, h: 115, type: 'shop',    color: '#D1C4E9', roofColor: '#4527A0', label: 'Tutoring' },

  // ── PLANET SECTION BUILDINGS ──

  // Water/River zone (mountain huts + water tower)
  { x: 230, y: 2650, w: 160, h: 120, type: 'cottage', color: '#B3E5FC', roofColor: '#0277BD', label: 'Filter Station' },
  { x: 420, y: 2640, w: 100, h: 130, type: 'tower', color: '#E1F5FE', roofColor: '#0288D1' },
  { x: 620, y: 2655, w: 120, h: 110, type: 'shop', color: '#B3E5FC', roofColor: '#01579B', label: 'Water Lab' },
  { x: 750, y: 2650, w: 90, h: 100, type: 'cottage', color: '#E1F5FE', roofColor: '#0288D1' },

  // Ocean zone (lighthouse + docks) — Research Hub now enterable (removed from decorative)
  { x: 2310, y: 2630, w: 80, h: 200, type: 'lighthouse', color: '#E0F7FA', roofColor: '#006064', label: 'Lighthouse' },
  { x: 2640, y: 2650, w: 140, h: 130, type: 'cottage',    color: '#E0F7FA', roofColor: '#006064', label: 'Marine Lab' },
  { x: 2810, y: 2640, w: 120, h: 115, type: 'shop',       color: '#B2EBF2', roofColor: '#00838F', label: 'Dive Shop' },
  { x: 2960, y: 2648, w: 100, h: 105, type: 'cottage',    color: '#E0F7FA', roofColor: '#006064' },

  // Forest zone (treehouses + ranger station)
  { x: 230, y: 3550, w: 120, h: 140, type: 'treehouse', color: '#A5D6A7', roofColor: '#1B5E20', label: 'Ranger HQ' },
  { x: 390, y: 3540, w: 100, h: 130, type: 'treehouse', color: '#C8E6C9', roofColor: '#2E7D32' },
  { x: 600, y: 3555, w: 130, h: 120, type: 'cottage', color: '#DCEDC8', roofColor: '#33691E', label: 'Seed Bank' },
  { x: 755, y: 3550, w: 100, h: 110, type: 'shop', color: '#C8E6C9', roofColor: '#388E3C' },

  // Climate zone (research stations + solar panels)
  { x: 2310, y: 3540, w: 170, h: 150, type: 'clinic', color: '#FFCCBC', roofColor: '#BF360C', label: 'Climate Lab' },
  { x: 2520, y: 3545, w: 130, h: 130, type: 'tower', color: '#FBE9E7', roofColor: '#E64A19' },
  { x: 2690, y: 3550, w: 150, h: 120, type: 'cottage', color: '#FFCCBC', roofColor: '#D84315' },
  { x: 2870, y: 3545, w: 90, h: 110, type: 'shop', color: '#FBE9E7', roofColor: '#BF360C', label: 'Data Center' },

  // Consumption zone (factories + sorting center)
  { x: 1080, y: 4060, w: 200, h: 160, type: 'factory', color: '#CFD8DC', roofColor: '#455A64', label: 'Sorting Center' },
  { x: 1310, y: 4055, w: 160, h: 170, type: 'factory', color: '#B0BEC5', roofColor: '#37474F', label: 'Recycling Plant' },
  { x: 1510, y: 4060, w: 140, h: 150, type: 'shop', color: '#DCEDC8', roofColor: '#558B2F', label: 'Craft Workshop' },
  { x: 1690, y: 4055, w: 130, h: 160, type: 'factory', color: '#CFD8DC', roofColor: '#455A64' },
  { x: 1860, y: 4060, w: 100, h: 140, type: 'cottage', color: '#DCEDC8', roofColor: '#33691E', label: 'Green Store' },

  // Planet hub well/portal
  { x: 1530, y: 2980, w: 100, h: 100, type: 'well', color: '#80DEEA', roofColor: '#00838F', label: 'Planet Well' },

  // ── PROSPERITY SECTION BUILDINGS ──

  // Energy Fields zone (SDG 7) — solar hubs + wind turbine sheds
  { x: 180, y: 4945, w: 210, h: 165, type: 'factory', color: '#FFFDE7', roofColor: '#F9A825', label: '☀️ Solar Hub' },
  { x: 415, y: 4945, w: 140, h: 150, type: 'tower',   color: '#FFF176', roofColor: '#F57F17' },
  { x: 580, y: 4950, w: 155, h: 140, type: 'shop',    color: '#FFECB3', roofColor: '#FF8F00', label: '⚡ Grid Control' },
  { x: 758, y: 4950, w: 120, h: 130, type: 'clinic',  color: '#FFFDE7', roofColor: '#FFA000', label: '🔋 Battery Lab' },
  { x: 900, y: 4952, w: 100, h: 120, type: 'cottage', color: '#FFF9C4', roofColor: '#F9A825' },
  // Energy zone café
  { x: 180, y: 5140, w: 130, h: 100, type: 'shop',    color: '#FFE082', roofColor: '#FF6F00', label: '☕ Power Café' },
  { x: 330, y: 5135, w: 110, h: 100, type: 'cottage', color: '#FFCC80', roofColor: '#E65100' },

  // Innovation Hub zone (SDG 9) — gleaming tech campus
  { x: 1180, y: 4940, w: 270, h: 185, type: 'clinic',  color: '#E3F2FD', roofColor: '#1565C0', label: '🔬 Research Lab' },
  { x: 1475, y: 4950, w: 155, h: 165, type: 'tower',   color: '#BBDEFB', roofColor: '#0D47A1' },
  { x: 1652, y: 4940, w: 165, h: 155, type: 'school',  color: '#90CAF9', roofColor: '#1976D2', label: '💡 Tech Academy' },
  { x: 1840, y: 4950, w: 115, h: 140, type: 'shop',    color: '#E3F2FD', roofColor: '#1565C0', label: '📋 Patent Office' },
  { x: 1978, y: 4955, w: 100, h: 130, type: 'tower',   color: '#BBDEFB', roofColor: '#283593' },
  // Innovation café + co-working
  { x: 1250, y: 5150, w: 140, h: 105, type: 'shop',    color: '#B3E5FC', roofColor: '#0277BD', label: '🍵 Maker Café' },
  { x: 1410, y: 5148, w: 130, h: 102, type: 'clinic',  color: '#E1F5FE', roofColor: '#01579B', label: '💻 Co-Work' },

  // Industry / Craft Town zone (SDG 8) — vibrant workshops
  { x: 2250, y: 4942, w: 230, h: 182, type: 'factory', color: '#FFCCBC', roofColor: '#E65100', label: '🏭 Main Factory' },
  { x: 2503, y: 4948, w: 155, h: 168, type: 'factory', color: '#FFAB91', roofColor: '#BF360C', label: '🔨 Workshop' },
  { x: 2680, y: 4942, w: 140, h: 155, type: 'shop',    color: '#FF8A65', roofColor: '#D84315', label: '🛠️ Worker Center' },
  { x: 2843, y: 4948, w: 120, h: 142, type: 'clinic',  color: '#FFCCBC', roofColor: '#FF7043', label: '📦 Dispatch Hub' },
  { x: 2984, y: 4952, w: 100, h: 130, type: 'cottage', color: '#FBE9E7', roofColor: '#E64A19' },
  // Industry food court
  { x: 2280, y: 5148, w: 145, h: 105, type: 'shop',    color: '#FFE0B2', roofColor: '#FF5722', label: '🍜 Food Court' },
  { x: 2450, y: 5145, w: 115, h: 102, type: 'cottage', color: '#FFCCBC', roofColor: '#D84315' },

  // Prosperity plaza hub
  { x: 1530, y: 5700, w: 100, h: 100, type: 'well',    color: '#FFF59D', roofColor: '#F9A825', label: 'Prosperity Hub' },

  // 🛍️ Shopping Mall (between community + smart city)
  { x: 1050, y: 6090, w: 380, h: 200, type: 'factory', color: '#F3E5F5', roofColor: '#9C27B0', label: '🛍️ Grand Mall' },
  { x: 1460, y: 6095, w: 220, h: 190, type: 'factory', color: '#E8EAF6', roofColor: '#3F51B5', label: '🎬 Cinema' },
  { x: 1700, y: 6100, w: 160, h: 180, type: 'tower',   color: '#BBDEFB', roofColor: '#1976D2', label: '🏨 Hotel' },
  { x: 1880, y: 6095, w: 140, h: 185, type: 'tower',   color: '#B2EBF2', roofColor: '#006064', label: '🏢 Office' },

  // Community Housing zone (SDG 10) — colourful apartment blocks
  { x: 175, y: 6090, w: 155, h: 140, type: 'cottage', color: '#F8BBD0', roofColor: '#AD1457', label: '🏠 Apt Block A' },
  { x: 352, y: 6075, w: 175, h: 160, type: 'cottage', color: '#CE93D8', roofColor: '#6A1B9A', label: '🏠 Apt Block B' },
  { x: 550, y: 6090, w: 148, h: 138, type: 'cottage', color: '#B3E5FC', roofColor: '#0277BD', label: '🏠 Apt Block C' },
  { x: 720, y: 6082, w: 135, h: 148, type: 'shop',    color: '#A5D6A7', roofColor: '#2E7D32', label: '🏛️ Community Hall' },
  { x: 200, y: 6270, w: 155, h: 108, type: 'shop',    color: '#FFCDD2', roofColor: '#C62828', label: '🏥 Welfare Office' },
  { x: 380, y: 6268, w: 115, h: 105, type: 'shop',    color: '#DCEDC8', roofColor: '#388E3C', label: '☕ Café Soleil' },
  { x: 515, y: 6268, w: 100, h: 105, type: 'cottage', color: '#FFF9C4', roofColor: '#F9A825' },
  { x: 635, y: 6265, w: 110, h: 108, type: 'clinic',  color: '#B2EBF2', roofColor: '#006064', label: '📮 Post Office' },

  // Smart City zone (SDG 11) — mixed-use skyscrapers + green transit
  { x: 2230, y: 6060, w: 110, h: 310, type: 'tower',   color: '#E0F2F1', roofColor: '#00695C', label: '🏙️ City Tower A' },
  { x: 2360, y: 6070, w: 130, h: 275, type: 'tower',   color: '#80DEEA', roofColor: '#004D40', label: '🏙️ City Tower B' },
  { x: 2515, y: 6065, w: 145, h: 245, type: 'factory', color: '#B2EBF2', roofColor: '#00796B', label: '🚇 Transit Hub' },
  { x: 2682, y: 6075, w: 158, h: 200, type: 'school',  color: '#CCFF90', roofColor: '#558B2F', label: '🌿 Eco School' },
  { x: 2862, y: 6080, w: 138, h: 185, type: 'shop',    color: '#F0F4C3', roofColor: '#9E9D24', label: '🌱 Green Market' },
  { x: 3020, y: 6088, w: 115, h: 168, type: 'tower',   color: '#E0F7FA', roofColor: '#006064', label: '📡 Data Tower' },
  // Smart city street café
  { x: 2290, y: 6400, w: 130, h: 100, type: 'shop',    color: '#B2DFDB', roofColor: '#00695C', label: '☕ Smart Café' },
  { x: 2445, y: 6398, w: 115, h: 100, type: 'cottage', color: '#80CBC4', roofColor: '#004D40' },
  { x: 2580, y: 6402, w: 120, h: 100, type: 'clinic',  color: '#B2EBF2', roofColor: '#006064', label: '🚲 Bike Share' },

  // ── PEACE SPACE BUILDINGS (SDG 16) y~7400-9000 ──
  { x: 900,  y: 7540, w: 260, h: 200, type: 'school',  color: '#C5CAE9', roofColor: '#1A237E', label: '⚖️ Courthouse' },
  { x: 1190, y: 7550, w: 200, h: 185, type: 'clinic',  color: '#E8EAF6', roofColor: '#283593', label: '🏛️ Court of Appeals' },
  { x: 1420, y: 7545, w: 160, h: 170, type: 'tower',   color: '#C5CAE9', roofColor: '#1A237E' },
  { x: 1610, y: 7540, w: 200, h: 190, type: 'shop',    color: '#E8EAF6', roofColor: '#3949AB', label: '🕊️ Peace Center' },
  { x: 1840, y: 7545, w: 160, h: 175, type: 'cottage', color: '#C5CAE9', roofColor: '#283593', label: '🤝 Mediation Hall' },
  { x: 2025, y: 7550, w: 130, h: 165, type: 'factory', color: '#E8EAF6', roofColor: '#1565C0', label: '📰 Transparency Office' },
  { x: 2180, y: 7545, w: 180, h: 180, type: 'school',  color: '#C5CAE9', roofColor: '#1A237E', label: '🏫 Justice Academy' },
  // Peace zone lower row
  { x: 920,  y: 7780, w: 150, h: 120, type: 'shop',    color: '#E8EAF6', roofColor: '#303F9F', label: '📋 Legal Aid Clinic' },
  { x: 1090, y: 7778, w: 130, h: 115, type: 'cottage', color: '#C5CAE9', roofColor: '#1A237E' },
  { x: 1240, y: 7776, w: 100, h: 110, type: 'cottage', color: '#E8EAF6', roofColor: '#3F51B5' },
  { x: 2050, y: 7778, w: 140, h: 115, type: 'shop',    color: '#E8EAF6', roofColor: '#283593', label: '📡 Anti-Corruption Hub' },
  { x: 2210, y: 7780, w: 110, h: 112, type: 'cottage', color: '#C5CAE9', roofColor: '#1A237E' },
  // Peace hub
  { x: 1530, y: 8000, w: 100, h: 100, type: 'well',    color: '#C5CAE9', roofColor: '#1A237E', label: 'Peace Plaza' },
  // Lower peace buildings
  { x: 900,  y: 8200, w: 200, h: 140, type: 'clinic',  color: '#E3F2FD', roofColor: '#1565C0', label: '🌐 Human Rights Court' },
  { x: 1130, y: 8195, w: 170, h: 130, type: 'shop',    color: '#E8EAF6', roofColor: '#283593', label: '🗳️ Election Commission' },
  { x: 1980, y: 8195, w: 160, h: 135, type: 'factory', color: '#C5CAE9', roofColor: '#1A237E', label: '🔍 Audit Bureau' },
  { x: 2165, y: 8200, w: 180, h: 140, type: 'school',  color: '#E8EAF6', roofColor: '#303F9F', label: '🏅 Citizens Forum' },

  // ── PARTNERSHIP SPACE BUILDINGS (SDG 17) y~9200-10800 ──
  { x: 900,  y: 9340, w: 250, h: 200, type: 'tower',   color: '#EDE7F6', roofColor: '#4A148C', label: '🌐 Global Summit Hall' },
  { x: 1180, y: 9348, w: 200, h: 185, type: 'school',  color: '#F3E5F5', roofColor: '#6A1B9A', label: '🎓 Knowledge Bridge' },
  { x: 1410, y: 9345, w: 160, h: 170, type: 'clinic',  color: '#EDE7F6', roofColor: '#7B1FA2', label: '💡 Innovation Hub' },
  { x: 1600, y: 9340, w: 200, h: 190, type: 'factory', color: '#F3E5F5', roofColor: '#4A148C', label: '🔗 Partnership Center' },
  { x: 1830, y: 9345, w: 160, h: 175, type: 'shop',    color: '#EDE7F6', roofColor: '#6A1B9A', label: '💰 Global Fund Office' },
  { x: 2015, y: 9350, w: 155, h: 165, type: 'tower',   color: '#F3E5F5', roofColor: '#4A148C' },
  { x: 2190, y: 9345, w: 170, h: 180, type: 'school',  color: '#EDE7F6', roofColor: '#6A1B9A', label: '📡 Tech Transfer Lab' },
  // Partnership zone lower row
  { x: 920,  y: 9575, w: 155, h: 120, type: 'shop',    color: '#F3E5F5', roofColor: '#7B1FA2', label: '🤝 NGO Center' },
  { x: 1095, y: 9572, w: 130, h: 115, type: 'cottage', color: '#EDE7F6', roofColor: '#4A148C' },
  { x: 2055, y: 9572, w: 140, h: 118, type: 'clinic',  color: '#F3E5F5', roofColor: '#6A1B9A', label: '🏦 Development Bank' },
  { x: 2215, y: 9575, w: 120, h: 115, type: 'cottage', color: '#EDE7F6', roofColor: '#4A148C' },
  // Partnership hub
  { x: 1530, y: 9800, w: 100, h: 100, type: 'well',    color: '#EDE7F6', roofColor: '#4A148C', label: 'World Summit' },
  // Lower partnership buildings
  { x: 900,  y: 9990, w: 200, h: 140, type: 'factory', color: '#F3E5F5', roofColor: '#4A148C', label: '🌍 Earth Council' },
  { x: 1130, y: 9988, w: 160, h: 130, type: 'shop',    color: '#EDE7F6', roofColor: '#7B1FA2', label: '🔬 Science Council' },
  { x: 1980, y: 9988, w: 165, h: 135, type: 'clinic',  color: '#F3E5F5', roofColor: '#6A1B9A', label: '📊 Data Partnership' },
  { x: 2165, y: 9990, w: 175, h: 140, type: 'tower',   color: '#EDE7F6', roofColor: '#4A148C', label: '💫 SDG Observatory' },
];

/* ── COLLISION RECTS ── */
export const COLLISION_RECTS: CollisionRect[] = WORLD_BUILDINGS
  .filter(b => b.type !== 'well' && b.type !== 'sign')
  .map(b => ({ x: b.x + 8, y: b.y + 8, w: b.w - 16, h: b.h - 16 }))
  .concat([
    { x: -50, y: -50, w: 50, h: WORLD_H + 100 },
    { x: WORLD_W, y: -50, w: 50, h: WORLD_H + 100 },
    { x: -50, y: -50, w: WORLD_W + 100, h: 50 },
    { x: -50, y: WORLD_H, w: WORLD_W + 100, h: 50 },
  ]);
