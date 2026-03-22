export type ZoneId = 'water' | 'earth' | 'life' | 'energy' | 'justice' | 'knowledge';

export interface ZoneData {
  id: ZoneId;
  name: string;
  lordName: string;
  sdgs: number[];
  colorClass: string;
  bgColorClass: string;
  description: string;
  brokenDesc: string;
  healedDesc: string;
  puzzleIntro: string;
  successFact: string;
}

export const ZONES: Record<ZoneId, ZoneData> = {
  water: {
    id: 'water',
    name: "Splashy's Domain",
    lordName: 'Splashy',
    sdgs: [6, 14],
    colorClass: 'text-zone-water',
    bgColorClass: 'bg-zone-water',
    description: 'Oceans and Clean Water',
    brokenDesc: 'The rivers are clogged with strange sludge, and the ocean waves are crying out in murky grey tones.',
    healedDesc: 'The waters run crystal clear, sparkling under the sun, and the fish are happily swimming again!',
    puzzleIntro: 'Help me fix the water flow! The pipes got all twisted when the world cracked.',
    successFact: 'Did you know? By 2030, we aim to achieve universal and equitable access to safe and affordable drinking water for all. Protecting our oceans helps regulate the global climate!',
  },
  earth: {
    id: 'earth',
    name: "Pebblepuff's Highlands",
    lordName: 'Pebblepuff',
    sdgs: [2, 12],
    colorClass: 'text-zone-earth',
    bgColorClass: 'bg-zone-earth',
    description: 'Responsible Land & Food',
    brokenDesc: 'The soil is dry, rocks are tumbling, and trash is scattered everywhere across the hills.',
    healedDesc: 'Lush grass blankets the rolling hills, and the crops are growing strong and healthy.',
    puzzleIntro: 'Oh my, what a mess! Can you help me sort this waste into the right bins so the earth can breathe?',
    successFact: 'Awesome! Responsible consumption and production (SDG 12) means doing more and better with less. Sorting waste properly reduces landfill size!',
  },
  life: {
    id: 'life',
    name: "Leaflet's Grove",
    lordName: 'Leaflet',
    sdgs: [3, 15],
    colorClass: 'text-zone-life',
    bgColorClass: 'bg-zone-life',
    description: 'Health & Biodiversity',
    brokenDesc: 'The ancient trees have wilted, and the woodland spirits are hiding from the smog.',
    healedDesc: 'The canopy is vibrant green, flowers bloom in every color, and the air is fresh and clean.',
    puzzleIntro: 'The forest needs your knowledge to grow back. Answer my nature questions to plant new saplings!',
    successFact: 'Hooray! Protecting life on land (SDG 15) halts biodiversity loss. Healthy forests mean healthier lives for everyone (SDG 3)!',
  },
  energy: {
    id: 'energy',
    name: "Sparkleflame's City",
    lordName: 'Sparkleflame',
    sdgs: [7, 9, 11],
    colorClass: 'text-zone-energy',
    bgColorClass: 'bg-zone-energy',
    description: 'Clean Energy & Cities',
    brokenDesc: 'The city floats precariously in the dark, its sustainable power grids shattered.',
    healedDesc: 'The city shines brightly with renewable power, humming smoothly in harmony with nature.',
    puzzleIntro: 'We need a jumpstart! Reconnect the clean energy turbines to power up the floating city.',
    successFact: 'Zap! Access to affordable, reliable, sustainable, and modern energy for all (SDG 7) transforms cities into hubs of innovation (SDG 9 & 11).',
  },
  justice: {
    id: 'justice',
    name: "Baloo's Village",
    lordName: 'Baloo',
    sdgs: [1, 5, 10, 16],
    colorClass: 'text-zone-justice',
    bgColorClass: 'bg-zone-justice',
    description: 'Equality & Peace',
    brokenDesc: 'The scales of fairness have tipped, causing walls to crack and neighbors to argue in the cold.',
    healedDesc: 'Warmth has returned to the village. Everyone shares, listens, and smiles together.',
    puzzleIntro: 'The balance is lost. Help me choose the fairest actions to restore harmony to our village scale.',
    successFact: 'Wonderful! Reducing inequalities (SDG 10) and promoting peace and justice (SDG 16) are key to a world where no one is left behind in poverty.',
  },
  knowledge: {
    id: 'knowledge',
    name: "Thinklet's Academy",
    lordName: 'Thinklet',
    sdgs: [4, 8, 17],
    colorClass: 'text-zone-knowledge',
    bgColorClass: 'bg-zone-knowledge',
    description: 'Education & Partnership',
    brokenDesc: 'Books are flying away, the library is locked, and the bridges to other lands have collapsed.',
    healedDesc: 'The halls are filled with eager learners, and sturdy bridges connect us to the whole world.',
    puzzleIntro: 'Knowledge is scattered! Match the concepts to rebuild our library of wisdom.',
    successFact: 'Brilliant! Quality education (SDG 4) is the foundation for decent work (SDG 8) and forming strong global partnerships (SDG 17).',
  }
};
