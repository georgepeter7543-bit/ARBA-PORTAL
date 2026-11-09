// ARBA - Arusha Regional Basketball Association Data Module

export const ARBA_INFO = {
  name: "Arusha Regional Basketball Association",
  acronym: "ARBA",
  tagline: "The Pinnacle of Northern Tanzania Basketball",
  region: "Arusha, Tanzania",
  founded: 2001,
  since: "Since '01",
  president: "Hon. Juma M. Kimaro",
  generalSecretary: "Neema Mollel",
  affiliations: ["Tanzania Basketball Federation (TBF)", "FIBA Africa Zone 5"],
  stats: {
    registeredClubs: 24,
    activePlayers: 480,
    certifiedCoaches: 36,
    certifiedOfficials: 28,
    activeAcademies: 12
  }
};

export const TEAMS = [
  {
    id: 'arusha-kings',
    name: 'Arusha Kings',
    shortName: 'Kings',
    abbr: 'AKG',
    city: 'Arusha Central',
    homeCourt: 'Gymkhana Arena Arusha',
    logoUrl: '/logos/arusha-kings.png',
    primaryColor: '#0F172A',
    secondaryColor: '#C0C0C0',
    record: '19-3',
    division: "Men's Premier Division",
    championships: 4,
    established: 2018,
    coach: 'Coach Martin Mremi',
    captain: 'TBD',
    description: 'Reigning Arusha champions known for defensive supremacy, disciplined transition play, and championship pedigree.',
    roster: []
  },
  {
    id: 'arusha-spurs',
    name: 'Arusha Spurs',
    shortName: 'Spurs',
    abbr: 'ASP',
    city: 'Central Arusha',
    homeCourt: 'Sheikh Amri Abeid Stadium',
    logoUrl: '/logos/arusha-spurs.jpg',
    primaryColor: '#000000',
    secondaryColor: '#94A3B8',
    record: '18-4',
    division: "Men's Premier Division",
    championships: 3,
    established: 2016,
    coach: 'Coach Hamisi Mussa',
    captain: 'TBD',
    description: 'Pioneering franchise with relentless perimeter shooting and tactical discipline.',
    roster: []
  },
  {
    id: 'sky-wolves',
    name: 'Sky Wolves',
    shortName: 'Wolves',
    abbr: 'SKW',
    city: 'Arusha Central',
    homeCourt: 'Sakina Sports Complex',
    logoUrl: '/logos/sky-wolves.jpg',
    primaryColor: '#F97316',
    secondaryColor: '#000000',
    record: '16-6',
    division: "Men's Premier Division",
    championships: 1,
    established: 2020,
    coach: 'Coach David Mollel',
    captain: 'TBD',
    description: 'Dynamic northern contenders known for ferocious perimeter pressure and fast-paced offense.',
    roster: []
  },
  {
    id: 'northern-zion',
    name: 'Northern Zion',
    shortName: 'Zion',
    abbr: 'NZB',
    city: 'Arusha',
    homeCourt: 'Sheikh Amri Abeid Stadium',
    logoUrl: '/logos/northern-zion.png',
    primaryColor: '#F97316',
    secondaryColor: '#111827',
    record: '14-8',
    division: "Men's Premier Division",
    championships: 0,
    established: 2021,
    coach: 'Coach Emmanuel Kimaro',
    captain: 'TBD',
    description: 'High-energy franchise with sharp perimeter shooting and relentless transition scoring.',
    roster: []
  },
  {
    id: 'pentagon-giants',
    name: 'Pentagon Giants',
    shortName: 'Giants',
    abbr: 'PTG',
    city: 'Arusha',
    homeCourt: 'Gymkhana Arena Arusha',
    logoUrl: '/logos/pentagon-giants.jpg',
    primaryColor: '#0F172A',
    secondaryColor: '#EAB308',
    record: '15-7',
    division: "Men's Premier Division",
    championships: 1,
    established: 2019,
    coach: 'Coach Rashid Juma',
    captain: 'TBD',
    description: 'Disciplined squad boasting an imposing interior defense and physical rebounding dominance.',
    roster: []
  },
  {
    id: 'hooperz-basketball',
    name: 'Hooperz Basketball',
    shortName: 'Hooperz',
    abbr: 'HPZ',
    city: 'Arusha Central',
    homeCourt: 'Gymkhana Arena Arusha',
    logoUrl: '/logos/hooperz-basketball.png',
    primaryColor: '#F97316',
    secondaryColor: '#111827',
    record: '17-4',
    division: "Men's Premier Division",
    championships: 1,
    established: 2021,
    coach: 'Coach Raymond Kimaro',
    captain: 'TBD',
    description: 'High-octane offensive unit celebrated for perimeter precision and relentless fast-break ball movement.',
    roster: []
  },
  {
    id: 'pamoja-basketball',
    name: 'Pamoja Basketball',
    shortName: 'Pamoja',
    abbr: 'PMJ',
    city: 'Arusha',
    homeCourt: 'Sheikh Amri Abeid Stadium',
    logoUrl: '/logos/pamoja-basketball.png',
    primaryColor: '#059669',
    secondaryColor: '#000000',
    record: '15-6',
    division: "Men's Premier Division",
    championships: 1,
    established: 2020,
    coach: 'Coach Bernard Lyimo',
    captain: 'TBD',
    description: 'A united collective emphasizing unselfish team basketball, suffocating team defense, and community empowerment.',
    roster: []
  },
  {
    id: 'the-city',
    name: 'The City Basketball Club',
    shortName: 'The City',
    abbr: 'CTY',
    city: 'Arusha City',
    homeCourt: 'Gymkhana Arena Arusha',
    logoUrl: '/logos/the-city.jpg',
    primaryColor: '#2563EB',
    secondaryColor: '#111827',
    record: '16-5',
    division: "Men's Premier Division",
    championships: 2,
    established: 2019,
    coach: 'Coach Frank Mrosso',
    captain: 'TBD',
    description: 'Premier downtown Arusha franchise featuring elite shotmakers and high-intensity half-court execution.',
    roster: []
  }
];

export const NAV_LINKS = [
  { name: 'Home' },
  { name: 'Teams' },
  { name: 'Players' },
  { name: 'Women' },
  { name: 'D-League' },
  { name: 'Coaches' },
  { name: 'Officials' },
  { name: 'Academies' },
  { name: 'Login' }
];

export const ADMIN_NAV_LINKS = [
  { name: 'Home' },
  { name: 'Teams' },
  { name: 'Players' },
  { name: 'Women' },
  { name: 'D-League' },
  { name: 'Coaches' },
  { name: 'Officials' },
  { name: 'Academies' },
  { name: 'Dashboard' },
  { name: 'Login' }
];

export const PLAYERS_LEADERBOARD = [];

export const WOMEN_TEAMS = [
  { id: 'women-queens', name: 'Arusha Queens', city: 'Arusha Central', record: '14-1', titles: 3, coach: 'Neema Mollel' },
  { id: 'women-stars', name: 'Soweto Sparklers', city: 'Soweto, Arusha', record: '12-3', titles: 1, coach: 'Fatma Juma' },
  { id: 'women-titans', name: 'Njiro Valkyries', city: 'Njiro, Arusha', record: '10-5', titles: 0, coach: 'Amina Ally' },
  { id: 'women-eagles', name: 'Kaloleni Falconettes', city: 'Kaloleni', record: '9-6', titles: 1, coach: 'Agnes Kweka' }
];

export const D_LEAGUE_PROGRAMS = [
  { name: 'Arusha U20 Elite Showcase', teams: 8, season: '2026 Winter Draft', venue: 'Soweto Courts' },
  { name: 'Meru Junior Ballers Circuit', teams: 6, season: '2026 Rising Talent', venue: 'Usa River Grounds' },
  { name: 'Sakina Youth Development League', teams: 8, season: 'Grassroots Series', venue: 'Sakina Sports Complex' }
];

export const COACHES_LIST = [
  { name: 'Coach Martin Mremi', team: 'Arusha Kings', license: 'FIBA Level 2', exp: '12 Years', record: '142-38' },
  { name: 'Coach Hamisi Mussa', team: 'Arusha Spurs', license: 'FIBA Level 3', exp: '16 Years', record: '198-64' },
  { name: 'Coach Raymond Kimaro', team: 'Hooperz Basketball', license: 'FIBA Level 2', exp: '10 Years', record: '115-42' },
  { name: 'Coach Bernard Lyimo', team: 'Pamoja Basketball', license: 'FIBA Level 2', exp: '8 Years', record: '95-36' },
  { name: 'Coach Frank Mrosso', team: 'The City Basketball Club', license: 'FIBA Level 2', exp: '11 Years', record: '128-48' },
  { name: 'Coach David Mollel', team: 'Sky Wolves', license: 'FIBA Level 2', exp: '9 Years', record: '102-45' },
  { name: 'Coach Emmanuel Kimaro', team: 'Northern Zion', license: 'FIBA Level 2', exp: '10 Years', record: '118-46' },
  { name: 'Coach Rashid Juma', team: 'Pentagon Giants', license: 'FIBA Level 2', exp: '9 Years', record: '94-38' }
];

export const OFFICIALS_LIST = [
  { name: 'Francis Shao', role: 'Chief Referee / Evaluator', badge: 'FIBA International', matches: 340 },
  { name: 'Fatma Juma', role: 'Senior Floor Referee', badge: 'National Grade A', matches: 215 },
  { name: 'Lucas Masawe', role: 'Floor Official & Umpire', badge: 'National Grade A', matches: 180 },
  { name: 'Neema Mollel', role: 'Table Commissioner & Scorer', badge: 'FIBA Table Official', matches: 290 },
  { name: 'John Kimaro', role: 'Lead Timekeeper & Official', badge: 'National Grade B', matches: 145 }
];

export const ACADEMIES_LIST = [
  { name: 'Arusha Junior Hoops Academy', ages: '7 - 16 Years', court: 'Gymkhana Arena', head: 'Coach Martin Mremi', enrollment: 120 },
  { name: 'Soweto Next-Gen Basketball Clinic', ages: '9 - 18 Years', court: 'Soweto Courts', head: 'Coach Peter Lowassa', enrollment: 95 },
  { name: 'Northern Zone Youth Academy', ages: '8 - 17 Years', court: 'Sakina Complex', head: 'Coach Agnes Kweka', enrollment: 80 }
];
