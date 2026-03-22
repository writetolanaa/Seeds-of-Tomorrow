export type ZoneId = 'poverty' | 'hunger' | 'health' | 'education' | 'equality';

export interface ZoneData {
  id: ZoneId;
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
  poverty: {
    id: 'poverty',
    number: 1,
    name: "Baloo's Village",
    lordName: 'Baloo',
    sdg: 1,
    sdgTitle: 'No Poverty',
    themeColor: '#e74c3c',
    bgColor: '#fce4e4',
    textColor: '#c0392b',
    emoji: '🏘️',
    description: 'Kind Neighborhood',
    brokenDesc: "The village is crumbling! Families have lost their jobs and homes are falling apart. Baloo looks so sad...",
    healedDesc: "The village is thriving! Everyone has warm homes and good work. Baloo is dancing with joy!",
    puzzleIntro: "Help me! Three families in the village need homes and jobs. Can you match each family to the right support?",
    successFact: "Amazing! SDG 1 is about ending poverty everywhere. Over 700 million people live in extreme poverty today. Every job and home we provide makes a real difference!",
    mapX: 20,
    mapY: 55,
  },
  hunger: {
    id: 'hunger',
    number: 2,
    name: "Pebblepuff's Farm",
    lordName: 'Pebblepuff',
    sdg: 2,
    sdgTitle: 'Zero Hunger',
    themeColor: '#f39c12',
    bgColor: '#fef9e7',
    textColor: '#d35400',
    emoji: '🌾',
    description: 'Grow & Serve',
    brokenDesc: "The crops have wilted and the food stores are empty! Pebblepuff's tummy is rumbling...",
    healedDesc: "The fields are bursting with vegetables and the pantry is full. Everyone is well-fed!",
    puzzleIntro: "My crops need water and care! Help me grow and harvest vegetables, then give them to the right citizens.",
    successFact: "Wonderful! SDG 2 aims to end hunger by 2030. Around 800 million people go to bed hungry each night. Smart farming and fair food sharing can change that!",
    mapX: 70,
    mapY: 30,
  },
  health: {
    id: 'health',
    number: 3,
    name: "Leaflet's Clinic",
    lordName: 'Leaflet',
    sdg: 3,
    sdgTitle: 'Good Health',
    themeColor: '#27ae60',
    bgColor: '#e8f8f0',
    textColor: '#1e8449',
    emoji: '🏥',
    description: 'Oops! Hospital!',
    brokenDesc: "Patients keep arriving with silly lifestyle problems! Leaflet is overwhelmed and the waiting room is packed...",
    healedDesc: "The clinic is calm, patients are recovering, and everyone is learning healthy habits!",
    puzzleIntro: "Patients are arriving! Choose the right treatment for each patient - sometimes the cure is better habits, not just medicine!",
    successFact: "Brilliant! SDG 3 is about good health for everyone. Many illnesses can be prevented with better habits, clean water, and access to healthcare. Prevention is better than cure!",
    mapX: 50,
    mapY: 20,
  },
  education: {
    id: 'education',
    number: 4,
    name: "Thinklet's Academy",
    lordName: 'Thinklet',
    sdg: 4,
    sdgTitle: 'Quality Education',
    themeColor: '#8e44ad',
    bgColor: '#f3e8fd',
    textColor: '#7d3c98',
    emoji: '🎓',
    description: 'My Real School',
    brokenDesc: "The school is in chaos! Students are stressed, teachers are missing, and books are scattered everywhere!",
    healedDesc: "The school is full of happy, curious learners. Thinklet is so proud of all the students!",
    puzzleIntro: "My school needs organizing! Help me assign students to the right classes and activities to boost their happiness and learning.",
    successFact: "Superb! SDG 4 ensures quality education for all. 258 million children worldwide still can't access school. Education unlocks every other SDG by building capable, caring citizens!",
    mapX: 75,
    mapY: 65,
  },
  equality: {
    id: 'equality',
    number: 5,
    name: "Sparkleflame's City",
    lordName: 'Sparkleflame',
    sdg: 5,
    sdgTitle: 'Gender Equality',
    themeColor: '#e67e22',
    bgColor: '#fef0e6',
    textColor: '#ba4a00',
    emoji: '⚡',
    description: 'Switch the Shoes',
    brokenDesc: "The city is full of unfair rules! Some people are being treated differently just because of who they are. Sparkleflame is frustrated...",
    healedDesc: "The city glows with fairness! Everyone has equal opportunities, and Sparkleflame shines bright!",
    puzzleIntro: "Unfair situations are happening across the city. Spot the inequality and choose the fair solution to fix it!",
    successFact: "Fantastic! SDG 5 is about gender equality. Women and girls make up half the world, but still face barriers in education, jobs, and leadership. Equal opportunities make the whole world stronger!",
    mapX: 30,
    mapY: 25,
  },
};

export const ZONE_ORDER: ZoneId[] = ['poverty', 'hunger', 'health', 'education', 'equality'];
