export interface StoryChapter {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  quote: string;
  scrollRange: [number, number];
  unlockedItemIndex: number;
}

export interface HostelLoreItem {
  id: string;
  name: string;
  hindiName: string;
  emoji: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  category: 'Furniture' | 'Tech' | 'Survival' | 'Chaos' | 'Sanctuary' | 'Mess';
  description: string;
  quote: string;
  stats: { label: string; value: string }[];
  actionPrompt: string;
  interactedMessage: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'ch-1',
    year: 'YEAR 1 • DAY 1',
    title: 'The Bare Shell (Room 204)',
    subtitle: 'Mummy packed 5kg laddoos. The room is echoing empty.',
    quote: '"Bhai, AC switch kaha hai?" — "Yaha pankha bhi 2 pe chalta hai, chup chap baith."',
    scrollRange: [0.0, 0.16],
    unlockedItemIndex: 0
  },
  {
    id: 'ch-2',
    year: 'YEAR 1 • SEMESTER 2',
    title: 'The Roommate & Iron Cots',
    subtitle: 'The metal bed that squeaks whenever you breathe.',
    quote: '"Bhai tu upar wala bed lega ya neeche wala?"',
    scrollRange: [0.16, 0.32],
    unlockedItemIndex: 1
  },
  {
    id: 'ch-3',
    year: 'YEAR 2 • 2:00 AM',
    title: 'The Contraband Haven & Maggi',
    subtitle: 'Extension boards, study desk & secret electric kettle.',
    quote: '"Bhai extra masala packet daal na, watery mat bana."',
    scrollRange: [0.32, 0.50],
    unlockedItemIndex: 3
  },
  {
    id: 'ch-4',
    year: '8:00 PM • MESS BELL RINGS',
    title: 'The Great Migration to Central Mess',
    subtitle: 'The gong strikes. 400 hungry engineers sprint down the corridor.',
    quote: '"Bhai jaldi chal, varna sirf dal ka paani bachega!"',
    scrollRange: [0.50, 0.68],
    unlockedItemIndex: 5
  },
  {
    id: 'ch-5',
    year: 'DINNER RUSH • THALI BATTLE',
    title: 'The 5-Compartment Steel Thali',
    subtitle: 'Watery yellow dal, mystery sabzi, and frisbee-hard rotis.',
    quote: '"Yeh dal hai ya swimming pool ka paani?"',
    scrollRange: [0.68, 0.86],
    unlockedItemIndex: 6
  },
  {
    id: 'ch-6',
    year: 'SUNDAY NIGHT • BATTLE ROYALE',
    title: 'Sunday Shahi Paneer War & Complaints',
    subtitle: 'Strictly 2 pieces per student. Monitored like national defense.',
    quote: '"Bhaiya ek paneer cube aur de do na please, birthday hai mera."',
    scrollRange: [0.86, 1.0],
    unlockedItemIndex: 8
  }
];

export const HOTBAR_ITEMS: HostelLoreItem[] = [
  {
    id: 'metal_cot',
    name: 'Hostel Iron Cot',
    hindiName: 'Lohe Ka Bed',
    emoji: '🛏️',
    rarity: 'Common',
    category: 'Furniture',
    description: 'Forged in the fires of 1994 government tenders. Creates a 6.8 magnitude seismic squeak whenever someone rolls over.',
    quote: '"Ek bed pe 6 log baith ke Counter-Strike khelne ka maza hi alag hai."',
    stats: [
      { label: 'Squeak Volume', value: '92 dB' },
      { label: 'Comfort Rating', value: '4/10' },
      { label: 'Sitting Capacity', value: '1 to 7 Bros' }
    ],
    actionPrompt: 'Jump on Bed',
    interactedMessage: '*CREEEAAAKKK* The springs protest, but your back feels right at home.'
  },
  {
    id: 'chair',
    name: 'Neelkamal Plastic Chair',
    hindiName: 'Neelkamal Kursi',
    emoji: '🪑',
    rarity: 'Rare',
    category: 'Furniture',
    description: 'The backbone of Indian hostel engineering. 10% used for studying, 90% used as a permanent clothes mountain.',
    quote: '"Is kursi pe 3 week purani jeans aur kal ka towel rakha hai. Haath mat lagana."',
    stats: [
      { label: 'Clothes Stacked', value: '14 T-shirts' },
      { label: 'Structural Flex', value: 'Terrifying' },
      { label: 'Ergonomics', value: 'Questionable' }
    ],
    actionPrompt: 'Inspect Clothes Mountain',
    interactedMessage: 'You found a hoodie you thought you lost in first semester!'
  },
  {
    id: 'kettle',
    name: 'Contraband Electric Kettle',
    hindiName: 'Chori Ki Kettle',
    emoji: '🫖',
    rarity: 'Legendary',
    category: 'Survival',
    description: 'Classified Level 5 Contraband by Chief Warden. Responsible for 99.8% of late-night calories.',
    quote: '"Bhai warden aa raha hai, kettle ko jaldi bed ke neeche phenk!"',
    stats: [
      { label: 'Warden Threat', value: 'MAXIMUM' },
      { label: 'Dishes Invented', value: '18 (Maggi to Pasta)' },
      { label: 'Boil Speed', value: '90 Seconds' }
    ],
    actionPrompt: 'Boil Stealth Water',
    interactedMessage: '*SIZZLE* The heating element glows orange. The aroma of victory fills Room 204.'
  },
  {
    id: 'maggi',
    name: '2-Minute Maggi Packet',
    hindiName: 'Midnight Maggi',
    emoji: '🍜',
    rarity: 'Epic',
    category: 'Survival',
    description: 'The official currency of all Indian hostels. Can be traded for assignments, proxies, or eternal brotherhood.',
    quote: '"Ek Maggi mein do log kaise khaate hain? Roommate hone ka yehi test hai."',
    stats: [
      { label: 'Cook Time', value: '12 Mins (Not 2)' },
      { label: 'Masala Magic', value: 'Over 9000' },
      { label: 'Friendship Bond', value: '+100 XP' }
    ],
    actionPrompt: 'Cook Maggi Bowl',
    interactedMessage: 'Steaming hot noodles ready! Roommate suddenly appears: "Bhai ek chamach dena!"'
  },
  {
    id: 'extension',
    name: 'Overloaded Extension Board',
    hindiName: 'Anchor Multi-Plug',
    emoji: '⚡',
    rarity: 'Epic',
    category: 'Tech',
    description: 'A miraculous marvel of physics. 8 chargers, 2 laptops, 1 kettle plugged into a 5A socket meant for a night bulb.',
    quote: '"Bhai switch off mat karna, mera laptop 1% pe render kar raha hai."',
    stats: [
      { label: 'Current Draw', value: 'Overload 99%' },
      { label: 'Sparks Risk', value: 'High' },
      { label: 'Devices Hooked', value: '8 Connected' }
    ],
    actionPrompt: 'Tap Extension Board',
    interactedMessage: '*ZAP* A tiny static spark crackles! Red neon indicator flickers bravely.'
  },
  {
    id: 'mess_thali',
    name: '5-Compartment Steel Thali',
    hindiName: 'Hostel Mess Ki Thali',
    emoji: '🍽️',
    rarity: 'Epic',
    category: 'Mess',
    description: 'Heavy gauge stainless steel plate. Features 95% watery dal, mysterious grey sabzi, hard roti, rice mound, and a single microscopic pickle dot.',
    quote: '"Is roti se boundary maar sakte hain cricket match me."',
    stats: [
      { label: 'Dal Water Ratio', value: '96% H2O' },
      { label: 'Roti Hardness', value: 'Mohs Scale 8.5' },
      { label: 'Pickle Quantity', value: '0.04 Grams' }
    ],
    actionPrompt: 'Taste Mess Food',
    interactedMessage: '*CLANG* You bite into the roti. Your jaw muscles level up! Character building +100.'
  },
  {
    id: 'mess_cauldron',
    name: 'Giant Watery Dal Cauldron',
    hindiName: 'Dal Ka Bada Degchi',
    emoji: '🍲',
    rarity: 'Rare',
    category: 'Mess',
    description: 'A 50-liter hammered aluminum vessel. The bottom holds 3 jeera seeds and a lifetime of student grievances.',
    quote: '"Bhaiya neeche se chala ke do na, sab dal neeche baith gayi hai!"',
    stats: [
      { label: 'Volume', value: '50 Liters' },
      { label: 'Floating Jeera', value: '3 Visible' },
      { label: 'Ladle Length', value: '1.4 Meters' }
    ],
    actionPrompt: 'Stir Dal Cauldron',
    interactedMessage: '*SPLOSH* You stir with the giant wooden ladle. A vortex of yellow water swirls gracefully.'
  },
  {
    id: 'mess_cooler',
    name: 'Chained Glass Water Cooler',
    hindiName: 'Zanjeer Wala Steel Glass',
    emoji: '🚰',
    rarity: 'Legendary',
    category: 'Mess',
    description: 'Blue industrial water cooler. The steel glass is literally welded with an iron chain so seniors don\'t take it to their rooms.',
    quote: '"Paani me halka sa lohe ka taste hai, matlab pure mineral water hai bro."',
    stats: [
      { label: 'Chain Strength', value: 'Anti-Theft 100%' },
      { label: 'Water Temp', value: 'Brain Freeze Cold' },
      { label: 'Iron Taste', value: 'Authentic 10/10' }
    ],
    actionPrompt: 'Press Cooler Tap',
    interactedMessage: '*GLUG GLUG* Freezing cold water splashes into the chained glass! Chained glass clinks rhythmically.'
  },
  {
    id: 'mess_register',
    name: 'Mess Complaint Register',
    hindiName: 'Shikayat Pustika',
    emoji: '📋',
    rarity: 'Legendary',
    category: 'Mess',
    description: 'The ancient holy book where engineers pour their poetic sorrow about watery paneer, uncooked rice, and burnt parathas.',
    quote: '"To Mess Secretary: Sir, the paneer cubes have vanished like our semester GPA."',
    stats: [
      { label: 'Complaints Logged', value: '4,892' },
      { label: 'Action Taken', value: '0 (Under Review)' },
      { label: 'Sunday Paneer Quota', value: 'Strictly 2 Pieces' }
    ],
    actionPrompt: 'Read Top Complaints',
    interactedMessage: '"Complaint #402: Found a bolt in dal. Warden replied: Good for hemoglobin."'
  }
];

export const HOSTEL_FACTS = [
  "In Indian hostels, '5 minutes bro' can mean anywhere from 20 minutes to 3 working days.",
  "The room with the kettle automatically becomes the de-facto parliament of the hostel wing.",
  "75% attendance isn't just a rule; it is an epic mythological quest fought with medical certificates.",
  "The Neelkamal chair contains archaeological layers of clothes dating back to orientation week.",
  "Mess food rule: Paneer appears only on Sunday nights or when the NAAC inspection committee visits."
];
