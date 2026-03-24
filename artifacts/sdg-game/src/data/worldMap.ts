import type { ZoneId } from './gameData';

export const WORLD_W = 3200;
export const WORLD_H = 7200;
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
  level: 'people' | 'planet' | 'prosperity';
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

export const ZONE_REGIONS: ZoneRegion[] = [...PEOPLE_ZONE_REGIONS, ...PLANET_ZONE_REGIONS, ...PROSPERITY_ZONE_REGIONS];

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
  { id: 'coralina', name: 'Coralina', x: 2440, y: 2840, zoneId: 'ocean', isLord: true, spriteKey: 'coralina', bubble: '🐠',
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

export const WORLD_NPCS: WorldNPC[] = [...PEOPLE_NPCS, ...PLANET_NPCS, ...PROSPERITY_NPCS];

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

  // Education Academy — flanking the central enterable school (x=2560)
  { x: 2330, y: 1445, w: 200, h: 175, type: 'school', color: '#EDE7F6', roofColor: '#4A148C', label: 'Academy' },
  { x: 2810, y: 1450, w: 130, h: 130, type: 'cottage', color: '#E1BEE7', roofColor: '#6A1B9A' },
  { x: 2960, y: 1445, w: 110, h: 110, type: 'shop', color: '#E8EAF6', roofColor: '#311B92', label: 'Library' },

  // ── PLANET SECTION BUILDINGS ──

  // Water/River zone (mountain huts + water tower)
  { x: 230, y: 2650, w: 160, h: 120, type: 'cottage', color: '#B3E5FC', roofColor: '#0277BD', label: 'Filter Station' },
  { x: 420, y: 2640, w: 100, h: 130, type: 'tower', color: '#E1F5FE', roofColor: '#0288D1' },
  { x: 620, y: 2655, w: 120, h: 110, type: 'shop', color: '#B3E5FC', roofColor: '#01579B', label: 'Water Lab' },
  { x: 750, y: 2650, w: 90, h: 100, type: 'cottage', color: '#E1F5FE', roofColor: '#0288D1' },

  // Ocean zone (lighthouse + docks)
  { x: 2310, y: 2630, w: 80, h: 200, type: 'lighthouse', color: '#E0F7FA', roofColor: '#006064', label: 'Lighthouse' },
  { x: 2430, y: 2660, w: 150, h: 120, type: 'shop', color: '#B2EBF2', roofColor: '#00838F', label: 'Research Hub' },
  { x: 2620, y: 2650, w: 140, h: 130, type: 'cottage', color: '#E0F7FA', roofColor: '#006064' },
  { x: 2800, y: 2660, w: 120, h: 110, type: 'cottage', color: '#B2EBF2', roofColor: '#00838F' },

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

  // Energy Fields zone (SDG 7) — solar control hub + wind turbine base
  { x: 230, y: 4960, w: 200, h: 160, type: 'factory', color: '#FFFDE7', roofColor: '#F9A825', label: 'Solar Hub' },
  { x: 460, y: 4960, w: 130, h: 140, type: 'tower', color: '#FFF9C4', roofColor: '#F57F17' },
  { x: 620, y: 4970, w: 150, h: 130, type: 'shop', color: '#FFFDE7', roofColor: '#FF8F00', label: 'Grid Control' },
  { x: 790, y: 4965, w: 100, h: 120, type: 'cottage', color: '#FFF9C4', roofColor: '#F9A825' },

  // Innovation Hub zone (SDG 9) — labs + research campus
  { x: 1260, y: 4960, w: 250, h: 180, type: 'clinic', color: '#E3F2FD', roofColor: '#1565C0', label: 'Research Lab' },
  { x: 1540, y: 4970, w: 150, h: 160, type: 'tower', color: '#BBDEFB', roofColor: '#0D47A1' },
  { x: 1720, y: 4960, w: 160, h: 150, type: 'school', color: '#E3F2FD', roofColor: '#1976D2', label: 'Tech Academy' },
  { x: 1910, y: 4970, w: 100, h: 130, type: 'shop', color: '#BBDEFB', roofColor: '#1565C0', label: 'Patent Office' },

  // Industry/Factory Town zone (SDG 8)
  { x: 2320, y: 4960, w: 240, h: 180, type: 'factory', color: '#FBE9E7', roofColor: '#E65100', label: 'Main Factory' },
  { x: 2590, y: 4965, w: 150, h: 160, type: 'factory', color: '#FFCCBC', roofColor: '#BF360C', label: 'Craft Workshop' },
  { x: 2770, y: 4960, w: 130, h: 150, type: 'shop', color: '#FBE9E7', roofColor: '#D84315', label: 'Worker Center' },
  { x: 2930, y: 4965, w: 100, h: 130, type: 'cottage', color: '#FFCCBC', roofColor: '#E64A19' },

  // Prosperity plaza hub
  { x: 1530, y: 5700, w: 100, h: 100, type: 'well', color: '#FFF59D', roofColor: '#F9A825', label: 'Prosperity Hub' },

  // Community Housing zone (SDG 10)
  { x: 230, y: 6110, w: 150, h: 130, type: 'cottage', color: '#F3E5F5', roofColor: '#6A1B9A', label: 'Apt Block A' },
  { x: 410, y: 6095, w: 170, h: 150, type: 'cottage', color: '#EDE7F6', roofColor: '#4A148C', label: 'Apt Block B' },
  { x: 610, y: 6110, w: 140, h: 130, type: 'cottage', color: '#F3E5F5', roofColor: '#7B1FA2' },
  { x: 780, y: 6100, w: 120, h: 140, type: 'shop', color: '#EDE7F6', roofColor: '#6A1B9A', label: 'Community Hall' },
  { x: 260, y: 6500, w: 150, h: 100, type: 'shop', color: '#D1C4E9', roofColor: '#512DA8', label: 'Welfare Office' },
  { x: 630, y: 6495, w: 130, h: 100, type: 'cottage', color: '#EDE7F6', roofColor: '#673AB7' },

  // Smart City zone (SDG 11) — skyscrapers + transit hub
  { x: 2310, y: 6090, w: 100, h: 280, type: 'tower', color: '#E0F2F1', roofColor: '#00695C', label: 'City Tower A' },
  { x: 2440, y: 6100, w: 120, h: 250, type: 'tower', color: '#B2DFDB', roofColor: '#004D40', label: 'City Tower B' },
  { x: 2590, y: 6095, w: 140, h: 220, type: 'factory', color: '#E0F2F1', roofColor: '#00796B', label: 'Transit Hub' },
  { x: 2760, y: 6100, w: 150, h: 180, type: 'school', color: '#B2DFDB', roofColor: '#00897B', label: 'Eco School' },
  { x: 2940, y: 6110, w: 110, h: 160, type: 'shop', color: '#E0F2F1', roofColor: '#26A69A', label: 'Green Market' },
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
