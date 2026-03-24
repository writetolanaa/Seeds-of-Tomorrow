export type ZoneId =
  | 'poverty' | 'hunger' | 'health' | 'education' | 'equality'
  | 'water' | 'ocean' | 'forest' | 'climate' | 'consumption'
  | 'energy' | 'industry' | 'innovation' | 'communities' | 'cities'
  | 'peace' | 'partnership';

export type LevelId = 'people' | 'planet' | 'prosperity' | 'peace' | 'partnership';

export interface ZoneData {
  id: ZoneId;
  level: LevelId;
  number: number;
  name: string;
  lordName: string;
  sdg: number;
  sdgTitle: string;
  themeColor: string;
  bgColor: string;
  textColor: string;
  emoji: string;
  description: string;
  brokenDesc: string;
  healedDesc: string;
  puzzleIntro: string;
  successFact: string;
  mapX: number;
  mapY: number;
}

export const ZONES: Record<ZoneId, ZoneData> = {
  // ── PEOPLE LEVEL ───────────────────────────────────────────
  poverty: {
    id: 'poverty', level: 'people', number: 1,
    name: "Baloo's Village", lordName: 'Baloo',
    sdg: 1, sdgTitle: 'No Poverty',
    themeColor: '#e74c3c', bgColor: '#fce4e4', textColor: '#c0392b',
    emoji: '🏘️', description: 'Community Helper',
    brokenDesc: "The village is crumbling! Families have lost their jobs and homes are falling apart. Baloo looks so sad...",
    healedDesc: "The village is thriving! Everyone has warm homes and good work. Baloo is dancing with joy!",
    puzzleIntro: "Help me! Villagers need emergency aid first, then long-term development to escape poverty.",
    successFact: "Amazing! SDG 1 is about ending poverty everywhere. Over 700 million people live in extreme poverty today. Every job and home we provide makes a real difference!",
    mapX: 20, mapY: 55,
  },
  hunger: {
    id: 'hunger', level: 'people', number: 2,
    name: "Pebblepuff's Farm", lordName: 'Pebblepuff',
    sdg: 2, sdgTitle: 'Zero Hunger',
    themeColor: '#f39c12', bgColor: '#fef9e7', textColor: '#d35400',
    emoji: '🌾', description: 'Grow & Serve',
    brokenDesc: "The crops have wilted and the food stores are empty! Pebblepuff's tummy is rumbling...",
    healedDesc: "The fields are bursting with vegetables and the pantry is full. Everyone is well-fed!",
    puzzleIntro: "My crops need water and care! Help me grow and harvest vegetables, then give them to the right citizens.",
    successFact: "Wonderful! SDG 2 aims to end hunger by 2030. Around 800 million people go to bed hungry each night. Smart farming and fair food sharing can change that!",
    mapX: 70, mapY: 30,
  },
  health: {
    id: 'health', level: 'people', number: 3,
    name: "Leaflet's Clinic", lordName: 'Leaflet',
    sdg: 3, sdgTitle: 'Good Health',
    themeColor: '#27ae60', bgColor: '#e8f8f0', textColor: '#1e8449',
    emoji: '🏥', description: 'Oops! Hospital!',
    brokenDesc: "Patients keep arriving with lifestyle problems! Leaflet is overwhelmed and the waiting room is packed...",
    healedDesc: "The clinic is calm, patients are recovering, and everyone is learning healthy habits!",
    puzzleIntro: "Patients are arriving! Choose the right treatment — sometimes the cure is better habits, not just medicine!",
    successFact: "Brilliant! SDG 3 is about good health for everyone. Many illnesses can be prevented with better habits, clean water, and healthcare access. Prevention is better than cure!",
    mapX: 50, mapY: 20,
  },
  education: {
    id: 'education', level: 'people', number: 4,
    name: "Thinklet's Academy", lordName: 'Thinklet',
    sdg: 4, sdgTitle: 'Quality Education',
    themeColor: '#8e44ad', bgColor: '#f3e8fd', textColor: '#7d3c98',
    emoji: '🎓', description: 'My Real School',
    brokenDesc: "The school is in chaos! Students are stressed, teachers are missing, and books are scattered everywhere!",
    healedDesc: "The school is full of happy, curious learners. Thinklet is so proud of all the students!",
    puzzleIntro: "My school needs organizing! Help me assign students to the right classes and activities.",
    successFact: "Superb! SDG 4 ensures quality education for all. 258 million children worldwide can't access school. Education unlocks every other SDG!",
    mapX: 75, mapY: 65,
  },
  equality: {
    id: 'equality', level: 'people', number: 5,
    name: "Sparkleflame's City", lordName: 'Sparkleflame',
    sdg: 5, sdgTitle: 'Gender Equality',
    themeColor: '#e67e22', bgColor: '#fef0e6', textColor: '#ba4a00',
    emoji: '⚡', description: 'Switch the Shoes',
    brokenDesc: "The city is full of unfair rules! Some people are being treated differently. Sparkleflame is frustrated...",
    healedDesc: "The city glows with fairness! Everyone has equal opportunities, and Sparkleflame shines bright!",
    puzzleIntro: "Unfair situations are happening across the city. Spot the inequality and choose the fair solution!",
    successFact: "Fantastic! SDG 5 is about gender equality. Women and girls make up half the world, but still face barriers. Equal opportunities make the whole world stronger!",
    mapX: 30, mapY: 25,
  },

  // ── PLANET LEVEL ────────────────────────────────────────────
  water: {
    id: 'water', level: 'planet', number: 6,
    name: "Aqua's River Valley", lordName: 'Aqua',
    sdg: 6, sdgTitle: 'Clean Water & Sanitation',
    themeColor: '#0288D1', bgColor: '#E1F5FE', textColor: '#01579B',
    emoji: '💧', description: 'Water Stories',
    brokenDesc: "The river is polluted! Oil spills, trash, and chemicals are poisoning the water supply. Aqua is devastated...",
    healedDesc: "The river runs crystal clear! Fish are swimming freely and everyone has clean drinking water. Aqua shimmers with joy!",
    puzzleIntro: "Our river is contaminated! Deploy the right cleanup tools to each segment before the pollution reaches downstream villages.",
    successFact: "Incredible! SDG 6 fights for clean water for all. 2 billion people lack access to safe drinking water. Rivers carry life — protecting them protects communities!",
    mapX: 20, mapY: 35,
  },
  consumption: {
    id: 'consumption', level: 'planet', number: 7,
    name: "Reevo's Recycling Hub", lordName: 'Reevo',
    sdg: 12, sdgTitle: 'Responsible Consumption',
    themeColor: '#558B2F', bgColor: '#F1F8E9', textColor: '#33691E',
    emoji: '♻️', description: 'Reuse Please!',
    brokenDesc: "Waste is piling up everywhere! Trash is overflowing and the recycling center is overwhelmed. Reevo is buried under garbage!",
    healedDesc: "Everything is sorted and reused! The waste center hums efficiently and no materials go to waste. Reevo beams with pride!",
    puzzleIntro: "Waste is arriving fast! Sort items into the right bins, then craft new products from recycled materials.",
    successFact: "Amazing! SDG 12 promotes responsible production and consumption. If the world's population lived like the average American, we'd need 5 Earths. Reduce, reuse, recycle!",
    mapX: 72, mapY: 90,
  },
  climate: {
    id: 'climate', level: 'planet', number: 8,
    name: "Gaia's Climate Watch", lordName: 'Gaia',
    sdg: 13, sdgTitle: 'Climate Action',
    themeColor: '#E64A19', bgColor: '#FBE9E7', textColor: '#BF360C',
    emoji: '🌡️', description: 'Climate Diary',
    brokenDesc: "CO₂ is rising, temperatures are spiking, and glaciers are melting. Gaia watches with sorrow as storms rage...",
    healedDesc: "CO₂ levels dropping, temperatures stabilizing, forests growing back. Gaia glows with renewed hope for the future!",
    puzzleIntro: "The climate crisis is escalating! Choose the right policies across 3 years to stabilize CO₂, temperature, and biodiversity.",
    successFact: "Outstanding! SDG 13 demands urgent climate action. The Earth has already warmed 1.1°C since the industrial era. Every policy choice we make today shapes the next generation's world!",
    mapX: 72, mapY: 65,
  },
  ocean: {
    id: 'ocean', level: 'planet', number: 9,
    name: "Coralina's Ocean Reef", lordName: 'Coralina',
    sdg: 14, sdgTitle: 'Life Below Water',
    themeColor: '#006064', bgColor: '#E0F7FA', textColor: '#004D40',
    emoji: '🐠', description: 'Ocean Cleanup Crew',
    brokenDesc: "The ocean is choked with plastic and oil! Coral reefs are bleaching and sea turtles are tangled in ghost nets. Coralina weeps...",
    healedDesc: "The ocean gleams blue! Coral reefs bloom with color, dolphins leap, and marine life thrives. Coralina dances in the currents!",
    puzzleIntro: "The ocean zones are polluted! Deploy the right cleanup tools and rescue marine life before the ecosystem collapses.",
    successFact: "Wonderful! SDG 14 protects life under water. Oceans cover 71% of Earth and produce half our oxygen. Over 8 million tons of plastic enter oceans every year — your cleanup matters!",
    mapX: 72, mapY: 35,
  },
  forest: {
    id: 'forest', level: 'planet', number: 10,
    name: "Ferra's Ancient Jungle", lordName: 'Ferra',
    sdg: 15, sdgTitle: 'Life on Land',
    themeColor: '#2E7D32', bgColor: '#E8F5E9', textColor: '#1B5E20',
    emoji: '🌿', description: 'Forest Guardian',
    brokenDesc: "The forest is burning and being chopped down! Animals are fleeing, soil is eroding, and Ferra's ancient trees are falling...",
    healedDesc: "The jungle roars with life! Trees tower overhead, animals reclaim their homes, and the ecosystem hums with balance. Ferra sings!",
    puzzleIntro: "The forest is under threat! Plant trees, protect wildlife, and fight fires across 3 seasons to restore the ecosystem.",
    successFact: "Brilliant! SDG 15 protects life on land. Forests cover 31% of Earth's land and are home to 80% of terrestrial species. We lose 15 billion trees per year — every tree planted matters!",
    mapX: 20, mapY: 65,
  },
};

Object.assign(ZONES as any, {
  energy: {
    id: 'energy', level: 'prosperity', number: 7, name: "Voltra's Energy Fields", lordName: 'Voltra',
    sdg: 7, sdgTitle: 'Affordable and Clean Energy', themeColor: '#F9A825', bgColor: '#FFFDE7', textColor: '#F57F17',
    emoji: '⚡',
    description: 'Sunlit valleys and wind-swept ridges where solar arrays and turbines power the world.',
    brokenDesc: 'The energy grid is failing — factories dark, homes cold, machines silent.',
    healedDesc: 'Clean energy hums across the land, powering every home and workshop.',
    puzzleIntro: 'Match the right energy source to each region to restore the grid!',
    successFact: 'Solar and wind energy are now the cheapest power sources in history.',
    mapX: 15, mapY: 78,
  },
  industry: {
    id: 'industry', level: 'prosperity', number: 8, name: "Gilda's Factory Town", lordName: 'Gilda',
    sdg: 8, sdgTitle: 'Decent Work and Economic Growth', themeColor: '#E65100', bgColor: '#FBE9E7', textColor: '#BF360C',
    emoji: '🏭',
    description: 'Bustling factory districts where workers build goods with fair wages and safe conditions.',
    brokenDesc: 'Workers are exploited — unsafe conditions, unfair pay, no rights.',
    healedDesc: 'Every worker has fair wages, safe conditions, and a voice in their workplace.',
    puzzleIntro: 'Balance production and worker rights to make the factory town thrive!',
    successFact: 'Countries with strong labor protections have higher productivity and innovation.',
    mapX: 55, mapY: 78,
  },
  innovation: {
    id: 'innovation', level: 'prosperity', number: 9, name: "Nexus Innovation Hub", lordName: 'Nexus',
    sdg: 9, sdgTitle: 'Industry, Innovation and Infrastructure', themeColor: '#1565C0', bgColor: '#E3F2FD', textColor: '#0D47A1',
    emoji: '🔬',
    description: 'A gleaming research campus where inventors and engineers create tomorrow\'s solutions today.',
    brokenDesc: 'The research labs are shuttered — no funding, broken equipment, forgotten ideas.',
    healedDesc: 'Innovation flourishes with open labs, shared knowledge, and global partnerships.',
    puzzleIntro: 'Connect research teams with the right resources to unlock breakthroughs!',
    successFact: 'Every dollar invested in infrastructure returns up to 20 dollars in economic growth.',
    mapX: 20, mapY: 85,
  },
  communities: {
    id: 'communities', level: 'prosperity', number: 10, name: "Mira's Community Housing", lordName: 'Mira',
    sdg: 10, sdgTitle: 'Reduced Inequalities', themeColor: '#6A1B9A', bgColor: '#F3E5F5', textColor: '#4A148C',
    emoji: '🏘️',
    description: 'Colorful neighborhoods where every family has a warm home and a place to belong.',
    brokenDesc: 'Inequality tears communities apart — wealthy enclaves beside crumbling slums.',
    healedDesc: 'Mixed communities thrive with shared parks, schools, and mutual support.',
    puzzleIntro: 'Design fair housing policies so everyone gets a decent home!',
    successFact: 'Reducing inequality improves health, education, and happiness for the entire population.',
    mapX: 55, mapY: 85,
  },
  cities: {
    id: 'cities', level: 'prosperity', number: 11, name: "Skylar's Smart City", lordName: 'Skylar',
    sdg: 11, sdgTitle: 'Sustainable Cities and Communities', themeColor: '#00695C', bgColor: '#E0F2F1', textColor: '#004D40',
    emoji: '🏙️',
    description: 'A gleaming eco-city with rooftop gardens, clean transit, and smart connected systems.',
    brokenDesc: 'The city is gridlocked — pollution, waste, and crumbling public spaces.',
    healedDesc: 'Smart transport, green rooftops, and clean air make this city a joy to live in.',
    puzzleIntro: 'Plan the sustainable city infrastructure to balance growth with livability!',
    successFact: 'By 2050, 70% of humanity will live in cities — making sustainable urban design critical.',
    mapX: 35, mapY: 92,
  },
});

Object.assign(ZONES as any, {
  peace: {
    id: 'peace', level: 'peace', number: 16, name: "Justia's Peace Court", lordName: 'Justia',
    sdg: 16, sdgTitle: 'Peace, Justice & Strong Institutions',
    themeColor: '#1A237E', bgColor: '#E8EAF6', textColor: '#0D1B8E',
    emoji: '⚖️',
    description: 'Justice Quest — Build Fair Institutions',
    brokenDesc: 'Corruption spreads unchecked — the courts are broken, trust has collapsed, and unrest fills the streets.',
    healedDesc: 'Justice flows freely! Fair courts, transparent institutions, and peaceful communities thrive.',
    puzzleIntro: 'Cases of injustice are piling up. Investigate carefully and make fair decisions to restore peace!',
    successFact: 'Countries with strong institutions reduce corruption by up to 80%. Justice and peace go hand in hand.',
    mapX: 35, mapY: 78,
  },
  partnership: {
    id: 'partnership', level: 'partnership', number: 17, name: "Accord's Global Summit", lordName: 'Accord',
    sdg: 17, sdgTitle: 'Partnerships for the Goals',
    themeColor: '#4A148C', bgColor: '#F3E5F5', textColor: '#38006B',
    emoji: '🤝',
    description: 'Global Link — Connect the World',
    brokenDesc: 'Nations work alone — siloed, competing, failing. No SDG can succeed without cooperation.',
    healedDesc: 'A web of partnerships stretches across the globe! Every SDG accelerates when nations unite.',
    puzzleIntro: 'Match partners to global challenges — the right alliances unlock solutions that no one can achieve alone!',
    successFact: 'When countries collaborate on SDGs, progress is 3× faster. Partnership is the engine of all change.',
    mapX: 65, mapY: 85,
  },
});

export const PEOPLE_ZONES: ZoneId[] = ['poverty', 'hunger', 'health', 'education', 'equality'];
export const PLANET_ZONES: ZoneId[] = ['water', 'ocean', 'forest', 'climate', 'consumption'];
export const PROSPERITY_ZONES: ZoneId[] = ['energy', 'industry', 'innovation', 'communities', 'cities'];
export const PEACE_ZONES: ZoneId[] = ['peace'];
export const PARTNERSHIP_ZONES: ZoneId[] = ['partnership'];
export const ZONE_ORDER: ZoneId[] = [...PEOPLE_ZONES, ...PLANET_ZONES, ...PROSPERITY_ZONES, ...PEACE_ZONES, ...PARTNERSHIP_ZONES];
