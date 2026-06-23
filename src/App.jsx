import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Coins,
  Crown,
  Download,
  Gamepad2,
  Goal,
  FileSpreadsheet,
  LogOut,
  Menu,
  Moon,
  Pencil,
  Play,
  Plus,
  Radio,
  RotateCcw,
  Search,
  Settings,
  Shield,
  Sparkles,
  Swords,
  Sun,
  Target,
  Trophy,
  Trash2,
  UserRound,
  UserPlus,
  UsersRound,
  Vote,
  Upload,
  X,
  Zap,
} from 'lucide-react';

const STORAGE_KEY = 'clubhouse-fc26-v1';
const SYNC_CHANNEL_KEY = 'clubhouse-fc26-live';

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST'];

const PHASES = {
  DRAFT: 'draft_setup',
  REGISTRATION: 'registration_open',
  CAPTAINS: 'captain_selection',
  AUCTION: 'auction_live',
  SQUADS: 'squad_confirmation',
  TOURNAMENT: 'tournament_live',
  COMPLETE: 'complete',
};

const phaseLabels = {
  [PHASES.DRAFT]: 'Draft setup',
  [PHASES.REGISTRATION]: 'Registration open',
  [PHASES.CAPTAINS]: 'Captain selection',
  [PHASES.AUCTION]: 'Auction live',
  [PHASES.SQUADS]: 'Squad confirmation',
  [PHASES.TOURNAMENT]: 'Tournament live',
  [PHASES.COMPLETE]: 'Complete',
};

const phaseOrder = Object.values(PHASES);
const getTournamentPhase = (tournament) => (
  phaseOrder.includes(tournament?.phase)
    ? tournament.phase
    : tournament?.status === 'active'
      ? PHASES.AUCTION
      : PHASES.DRAFT
);
const phaseLabel = (phase) => phaseLabels[phase] || phaseLabels[PHASES.DRAFT];
const setTournamentPhase = (tournament, phase) => {
  tournament.phase = phase;
  tournament.status = phase === PHASES.DRAFT ? 'draft' : phase === PHASES.COMPLETE ? 'complete' : 'active';
};

const captains = [
  { id: 'cap-tariq', name: 'Tariq', handle: 'Rohoman', team: 'North Stars', color: '#d9ff63', initials: 'TR' },
  { id: 'cap-farhan', name: 'Farhan', handle: 'F7', team: 'Night Shift', color: '#66e3ff', initials: 'FA' },
  { id: 'cap-imran', name: 'Imran', handle: 'El Jefe', team: 'Redline', color: '#ff766e', initials: 'IM' },
  { id: 'cap-sami', name: 'Sami', handle: 'S4MI', team: 'Atlas FC', color: '#b69cff', initials: 'SA' },
];

const seedPlayers = [
  { id: 'p-rafi', name: 'Rafi Ahmed', tag: 'Rafi10', initials: 'RA', primary: 'CAM', secondary: 'ST', rating: 91, style: 'Creator', traits: ['Vision', 'Quick pass'], availability: 'Confirmed', color: '#ffb96e' },
  { id: 'p-zayed', name: 'Zayed Khan', tag: 'ZK7', initials: 'ZK', primary: 'ST', secondary: 'RW', rating: 89, style: 'Finisher', traits: ['Clinical', 'Pressing'], availability: 'Confirmed', color: '#67e8c2' },
  { id: 'p-nabil', name: 'Nabil Chowdhury', tag: 'Nabs', initials: 'NC', primary: 'CB', secondary: 'CDM', rating: 88, style: 'Anchor', traits: ['Tackling', 'Calm'], availability: 'Confirmed', color: '#77b7ff' },
  { id: 'p-adnan', name: 'Adnan Malik', tag: 'AD9', initials: 'AM', primary: 'LW', secondary: 'CAM', rating: 87, style: 'Dribbler', traits: ['Skill moves', 'Agility'], availability: 'Confirmed', color: '#e6a5ff' },
  { id: 'p-fahim', name: 'Fahim Rahman', tag: 'FahimFifa', initials: 'FR', primary: 'GK', secondary: 'CB', rating: 86, style: 'Sweeper', traits: ['Reflexes', 'Distribution'], availability: 'Confirmed', color: '#ffd964' },
  { id: 'p-shah', name: 'Shah Islam', tag: 'NoLookShah', initials: 'SI', primary: 'CM', secondary: 'CDM', rating: 85, style: 'Engine', traits: ['Stamina', 'Long pass'], availability: 'Confirmed', color: '#fa8eac' },
  { id: 'p-ayaan', name: 'Ayaan Ali', tag: 'Ayaan11', initials: 'AA', primary: 'RW', secondary: 'ST', rating: 84, style: 'Winger', traits: ['Pace', 'Crossing'], availability: 'Confirmed', color: '#8ae6ff' },
  { id: 'p-hamza', name: 'Hamza Noor', tag: 'Hamzi', initials: 'HN', primary: 'CB', secondary: 'GK', rating: 83, style: 'Stopper', traits: ['Strength', 'Blocks'], availability: 'Confirmed', color: '#a6f18a' },
  { id: 'p-rayan', name: 'Rayan Hussain', tag: 'Ray', initials: 'RH', primary: 'CM', secondary: 'CAM', rating: 82, style: 'Playmaker', traits: ['Composure', 'Passing'], availability: 'Pending', color: '#f4a273' },
  { id: 'p-omar', name: 'Omar Syed', tag: 'OMR', initials: 'OS', primary: 'LB', secondary: 'CB', rating: 80, style: 'Utility', traits: ['Recovery', 'Team first'], availability: 'Confirmed', color: '#a1a8ff' },
  { id: 'p-junaid', name: 'Junaid Hasan', tag: 'JH21', initials: 'JH', primary: 'CDM', secondary: 'CB', rating: 79, style: 'Ball winner', traits: ['Interceptions', 'Safe pass'], availability: 'Confirmed', color: '#67d7c4' },
  { id: 'p-kabir', name: 'Kabir Ahmed', tag: 'Kabs', initials: 'KA', primary: 'ST', secondary: 'CAM', rating: 78, style: 'Poacher', traits: ['Positioning', 'One touch'], availability: 'Confirmed', color: '#ff8b77' },
];

const formations = {
  '4-3-3': [
    { id: 'GK', label: 'GK', x: 50, y: 91 },
    { id: 'LB', label: 'LB', x: 16, y: 73 }, { id: 'LCB', label: 'CB', x: 39, y: 78 },
    { id: 'RCB', label: 'CB', x: 61, y: 78 }, { id: 'RB', label: 'RB', x: 84, y: 73 },
    { id: 'LCM', label: 'CM', x: 25, y: 50 }, { id: 'CDM', label: 'CDM', x: 50, y: 58 },
    { id: 'RCM', label: 'CM', x: 75, y: 50 },
    { id: 'LW', label: 'LW', x: 20, y: 22 }, { id: 'ST', label: 'ST', x: 50, y: 16 },
    { id: 'RW', label: 'RW', x: 80, y: 22 },
  ],
  '4-2-3-1': [
    { id: 'GK', label: 'GK', x: 50, y: 91 },
    { id: 'LB', label: 'LB', x: 16, y: 73 }, { id: 'LCB', label: 'CB', x: 39, y: 78 },
    { id: 'RCB', label: 'CB', x: 61, y: 78 }, { id: 'RB', label: 'RB', x: 84, y: 73 },
    { id: 'LDM', label: 'CDM', x: 34, y: 59 }, { id: 'RDM', label: 'CDM', x: 66, y: 59 },
    { id: 'LW', label: 'LW', x: 19, y: 38 }, { id: 'CAM', label: 'CAM', x: 50, y: 40 },
    { id: 'RW', label: 'RW', x: 81, y: 38 }, { id: 'ST', label: 'ST', x: 50, y: 16 },
  ],
  '4-4-2': [
    { id: 'GK', label: 'GK', x: 50, y: 91 },
    { id: 'LB', label: 'LB', x: 16, y: 73 }, { id: 'LCB', label: 'CB', x: 39, y: 78 },
    { id: 'RCB', label: 'CB', x: 61, y: 78 }, { id: 'RB', label: 'RB', x: 84, y: 73 },
    { id: 'LM', label: 'LM', x: 17, y: 48 }, { id: 'LCM', label: 'CM', x: 39, y: 52 },
    { id: 'RCM', label: 'CM', x: 61, y: 52 }, { id: 'RM', label: 'RM', x: 83, y: 48 },
    { id: 'LST', label: 'ST', x: 37, y: 19 }, { id: 'RST', label: 'ST', x: 63, y: 19 },
  ],
  '4-1-2-1-2': [
    { id: 'GK', label: 'GK', x: 50, y: 91 },
    { id: 'LB', label: 'LB', x: 16, y: 73 }, { id: 'LCB', label: 'CB', x: 39, y: 78 },
    { id: 'RCB', label: 'CB', x: 61, y: 78 }, { id: 'RB', label: 'RB', x: 84, y: 73 },
    { id: 'CDM', label: 'CDM', x: 50, y: 62 },
    { id: 'LCM', label: 'CM', x: 28, y: 47 }, { id: 'RCM', label: 'CM', x: 72, y: 47 },
    { id: 'CAM', label: 'CAM', x: 50, y: 34 },
    { id: 'LST', label: 'ST', x: 36, y: 17 }, { id: 'RST', label: 'ST', x: 64, y: 17 },
  ],
  '4-3-2-1': [
    { id: 'GK', label: 'GK', x: 50, y: 91 },
    { id: 'LB', label: 'LB', x: 16, y: 73 }, { id: 'LCB', label: 'CB', x: 39, y: 78 },
    { id: 'RCB', label: 'CB', x: 61, y: 78 }, { id: 'RB', label: 'RB', x: 84, y: 73 },
    { id: 'LDM', label: 'CDM', x: 26, y: 60 }, { id: 'CM', label: 'CM', x: 50, y: 63 }, { id: 'RDM', label: 'CDM', x: 74, y: 60 },
    { id: 'LAM', label: 'CAM', x: 33, y: 38 }, { id: 'RAM', label: 'CAM', x: 67, y: 38 },
    { id: 'ST', label: 'ST', x: 50, y: 17 },
  ],
  '4-1-4-1': [
    { id: 'GK', label: 'GK', x: 50, y: 91 },
    { id: 'LB', label: 'LB', x: 16, y: 73 }, { id: 'LCB', label: 'CB', x: 39, y: 78 },
    { id: 'RCB', label: 'CB', x: 61, y: 78 }, { id: 'RB', label: 'RB', x: 84, y: 73 },
    { id: 'CDM', label: 'CDM', x: 50, y: 60 },
    { id: 'LM', label: 'LM', x: 13, y: 46 }, { id: 'LCM', label: 'CM', x: 37, y: 48 },
    { id: 'RCM', label: 'CM', x: 63, y: 48 }, { id: 'RM', label: 'RM', x: 87, y: 46 },
    { id: 'ST', label: 'ST', x: 50, y: 17 },
  ],
  '5-2-1-2': [
    { id: 'GK', label: 'GK', x: 50, y: 91 },
    { id: 'LWB', label: 'LB', x: 10, y: 68 }, { id: 'LCB', label: 'CB', x: 29, y: 77 },
    { id: 'CB', label: 'CB', x: 50, y: 80 }, { id: 'RCB', label: 'CB', x: 71, y: 77 }, { id: 'RWB', label: 'RB', x: 90, y: 68 },
    { id: 'LCM', label: 'CM', x: 33, y: 55 }, { id: 'RCM', label: 'CM', x: 67, y: 55 },
    { id: 'CAM', label: 'CAM', x: 50, y: 37 },
    { id: 'LST', label: 'ST', x: 35, y: 17 }, { id: 'RST', label: 'ST', x: 65, y: 17 },
  ],
  '3-4-3': [
    { id: 'GK', label: 'GK', x: 50, y: 91 },
    { id: 'LCB', label: 'CB', x: 25, y: 76 }, { id: 'CB', label: 'CB', x: 50, y: 80 }, { id: 'RCB', label: 'CB', x: 75, y: 76 },
    { id: 'LM', label: 'LM', x: 13, y: 52 }, { id: 'LCM', label: 'CM', x: 37, y: 54 },
    { id: 'RCM', label: 'CM', x: 63, y: 54 }, { id: 'RM', label: 'RM', x: 87, y: 52 },
    { id: 'LW', label: 'LW', x: 20, y: 22 }, { id: 'ST', label: 'ST', x: 50, y: 17 }, { id: 'RW', label: 'RW', x: 80, y: 22 },
  ],
  '3-5-2': [
    { id: 'GK', label: 'GK', x: 50, y: 91 },
    { id: 'LCB', label: 'CB', x: 25, y: 76 }, { id: 'CB', label: 'CB', x: 50, y: 80 },
    { id: 'RCB', label: 'CB', x: 75, y: 76 },
    { id: 'LM', label: 'LM', x: 13, y: 48 }, { id: 'LCM', label: 'CM', x: 34, y: 51 },
    { id: 'CDM', label: 'CDM', x: 50, y: 61 }, { id: 'RCM', label: 'CM', x: 66, y: 51 },
    { id: 'RM', label: 'RM', x: 87, y: 48 },
    { id: 'LST', label: 'ST', x: 37, y: 19 }, { id: 'RST', label: 'ST', x: 63, y: 19 },
  ],
};

const formationStyles = {
  '4-3-3': 'Balanced width',
  '4-2-3-1': 'Controlled',
  '4-4-2': 'Classic',
  '4-1-2-1-2': 'Diamond attack',
  '4-3-2-1': 'Christmas tree',
  '4-1-4-1': 'Defensive block',
  '5-2-1-2': 'Back five',
  '3-4-3': 'All-out attack',
  '3-5-2': 'Midfield overload',
  '2-1': 'Front foot',
  '1-2': 'Counter',
  '2-2': 'Box',
  '1-2-1': 'Diamond',
  '2-2-1': 'Balanced',
  '2-1-2': 'Direct',
  '2-3-1': 'Control',
  '3-2-1': 'Solid back',
  '3-3-1': 'Compact',
  '2-3-2': 'Open',
  Balanced: 'Auto layout',
};

// Small-sided pitch shapes for tournaments configured below 11-a-side. Each shape
// includes the goalkeeper slot (held by the captain) plus teamSize-1 outfield spots.
const smallFormations = {
  4: {
    '2-1': [{ id: 'GK', label: 'GK', x: 50, y: 91 }, { id: 'LB', label: 'LB', x: 32, y: 68 }, { id: 'RB', label: 'RB', x: 68, y: 68 }, { id: 'ST', label: 'ST', x: 50, y: 26 }],
    '1-2': [{ id: 'GK', label: 'GK', x: 50, y: 91 }, { id: 'CB', label: 'CB', x: 50, y: 70 }, { id: 'LF', label: 'ST', x: 33, y: 28 }, { id: 'RF', label: 'ST', x: 67, y: 28 }],
  },
  5: {
    '2-2': [{ id: 'GK', label: 'GK', x: 50, y: 91 }, { id: 'LB', label: 'CB', x: 30, y: 70 }, { id: 'RB', label: 'CB', x: 70, y: 70 }, { id: 'LF', label: 'ST', x: 32, y: 28 }, { id: 'RF', label: 'ST', x: 68, y: 28 }],
    '1-2-1': [{ id: 'GK', label: 'GK', x: 50, y: 91 }, { id: 'CB', label: 'CB', x: 50, y: 74 }, { id: 'LM', label: 'CM', x: 28, y: 50 }, { id: 'RM', label: 'CM', x: 72, y: 50 }, { id: 'ST', label: 'ST', x: 50, y: 24 }],
  },
  6: {
    '2-2-1': [{ id: 'GK', label: 'GK', x: 50, y: 91 }, { id: 'LB', label: 'CB', x: 28, y: 74 }, { id: 'RB', label: 'CB', x: 72, y: 74 }, { id: 'LM', label: 'CM', x: 30, y: 50 }, { id: 'RM', label: 'CM', x: 70, y: 50 }, { id: 'ST', label: 'ST', x: 50, y: 24 }],
    '2-1-2': [{ id: 'GK', label: 'GK', x: 50, y: 91 }, { id: 'LB', label: 'CB', x: 28, y: 74 }, { id: 'RB', label: 'CB', x: 72, y: 74 }, { id: 'CM', label: 'CM', x: 50, y: 52 }, { id: 'LF', label: 'ST', x: 32, y: 26 }, { id: 'RF', label: 'ST', x: 68, y: 26 }],
  },
  7: {
    '2-3-1': [{ id: 'GK', label: 'GK', x: 50, y: 91 }, { id: 'LB', label: 'CB', x: 26, y: 76 }, { id: 'RB', label: 'CB', x: 74, y: 76 }, { id: 'LM', label: 'CM', x: 20, y: 50 }, { id: 'CM', label: 'CM', x: 50, y: 52 }, { id: 'RM', label: 'CM', x: 80, y: 50 }, { id: 'ST', label: 'ST', x: 50, y: 22 }],
    '3-2-1': [{ id: 'GK', label: 'GK', x: 50, y: 91 }, { id: 'LCB', label: 'CB', x: 28, y: 76 }, { id: 'CB', label: 'CB', x: 50, y: 78 }, { id: 'RCB', label: 'CB', x: 72, y: 76 }, { id: 'LM', label: 'CM', x: 34, y: 50 }, { id: 'RM', label: 'CM', x: 66, y: 50 }, { id: 'ST', label: 'ST', x: 50, y: 24 }],
  },
  8: {
    '3-3-1': [{ id: 'GK', label: 'GK', x: 50, y: 91 }, { id: 'LCB', label: 'CB', x: 26, y: 77 }, { id: 'CB', label: 'CB', x: 50, y: 79 }, { id: 'RCB', label: 'CB', x: 74, y: 77 }, { id: 'LM', label: 'CM', x: 22, y: 50 }, { id: 'CM', label: 'CM', x: 50, y: 52 }, { id: 'RM', label: 'CM', x: 78, y: 50 }, { id: 'ST', label: 'ST', x: 50, y: 22 }],
    '2-3-2': [{ id: 'GK', label: 'GK', x: 50, y: 91 }, { id: 'LB', label: 'CB', x: 28, y: 77 }, { id: 'RB', label: 'CB', x: 72, y: 77 }, { id: 'LM', label: 'CM', x: 22, y: 50 }, { id: 'CM', label: 'CM', x: 50, y: 52 }, { id: 'RM', label: 'CM', x: 78, y: 50 }, { id: 'LF', label: 'ST', x: 34, y: 24 }, { id: 'RF', label: 'ST', x: 66, y: 24 }],
  },
};

// Fallback layout generator for any team size without a curated set (e.g. 2, 3, 9, 10).
function generateFormation(size) {
  const outfield = Math.max(0, Number(size) - 1);
  const spots = [{ id: 'GK', label: 'GK', x: 50, y: 91 }];
  if (!outfield) return spots;
  let def = Math.round(outfield * 0.4);
  const att = Math.max(1, Math.round(outfield * 0.3));
  if (def + att > outfield) def = outfield - att;
  const mid = outfield - def - att;
  const rows = [['CB', def, 74], ['CM', mid, 50], ['ST', att, 24]].filter(([, count]) => count > 0);
  rows.forEach(([label, count, y], rowIndex) => {
    for (let i = 0; i < count; i += 1) {
      const x = count === 1 ? 50 : Math.round(18 + (i * (64 / (count - 1))));
      spots.push({ id: `${label}-${rowIndex}-${i}`, label, x, y });
    }
  });
  return spots;
}

const getFormationSet = (teamSize) => {
  const size = Number(teamSize) || 11;
  if (size >= 11) return formations;
  if (smallFormations[size]) return smallFormations[size];
  return { Balanced: generateFormation(size) };
};

const seedTournaments = [
  { id: 't-friday-night', name: 'Friday Night FC', date: '2026-06-26', time: '20:30', status: 'active', phase: PHASES.AUCTION, format: '11v11', captainCount: 4, budget: 1000, captains: captains.map((captain) => ({ ...captain, club: { name: captain.team, logo: null } })) },
];

const demoCaptainShortlists = {
  'cap-farhan': ['p-adnan', 'p-ayaan', 'p-fahim'],
  'cap-imran': ['p-nabil', 'p-hamza', 'p-zayed'],
  'cap-sami': ['p-adnan', 'p-shah', 'p-rayan'],
};

const createCaptainData = (budget = 1000, includeDemoPicks = false) => Object.fromEntries(captains.map((captain) => [captain.id, {
  formation: '4-3-3', shortlist: includeDemoPicks ? (demoCaptainShortlists[captain.id] || []) : [], budget, squad: [], lineup: { GK: `captain:${captain.id}` }, squadConfirmed: false,
}]));

const createAuction = () => ({ phase: 'voting', votes: {}, playerId: null, bid: 0, leaderId: null, history: [] });

const auctionEligiblePlayers = (players, tournamentCaptains = []) => {
  const captainIds = new Set(tournamentCaptains.map((captain) => captain.id));
  return players.filter((player) => !captainIds.has(player.id));
};

const getTournamentTeamSize = (tournament) => (
  Number(tournament?.teamSize)
  || Math.floor(Number(tournament?.totalPlayers || 0) / Number(tournament?.captainCount || 1))
  || Number.parseInt(tournament?.format, 10)
  || 11
);

const getClubInfo = (captain) => ({
  name: captain?.club?.name || captain?.team || `${captain?.handle || captain?.tag || 'Captain'}'s FC`,
  logo: captain?.club?.logo || null,
  color: captain?.color || '#d9ff63',
  initials: captain?.initials || (captain?.handle || captain?.tag || 'FC').slice(0, 2).toUpperCase(),
});

const createCompetition = () => ({ phase: 'ready', readyCaptainIds: [], matches: [], playerStats: [] });

const createLeagueFixtures = (teamIds) => {
  if (teamIds.length !== 4) return [];
  const [a, b, c, d] = teamIds;
  const rounds = [
    // Leg 1
    [[a, d], [b, c]],
    [[a, c], [d, b]],
    [[a, b], [c, d]],
    // Leg 2 (Reversed home/away)
    [[d, a], [c, b]],
    [[c, a], [b, d]],
    [[b, a], [d, c]]
  ];
  return rounds.flatMap((pairs, roundIndex) => pairs.map(([homeId, awayId], matchIndex) => ({
    id: `league-${roundIndex + 1}-${matchIndex + 1}`,
    stage: 'league', round: roundIndex + 1, label: `League · Round ${roundIndex + 1}`,
    homeId, awayId, status: 'pending', scheduledAt: '', homeScore: null, awayScore: null,
  })));
};


const calculateStandings = (tournamentCaptains, matches) => {
  const table = Object.fromEntries(tournamentCaptains.map((captain) => [captain.id, {
    teamId: captain.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0,
  }]));
  matches.filter((match) => match.stage === 'league' && match.status === 'completed').forEach((match) => {
    const home = table[match.homeId]; const away = table[match.awayId];
    if (!home || !away) return;
    home.played += 1; away.played += 1; home.gf += match.homeScore; home.ga += match.awayScore; away.gf += match.awayScore; away.ga += match.homeScore;
    if (match.homeScore > match.awayScore) { home.won += 1; away.lost += 1; home.points += 3; }
    else if (match.homeScore < match.awayScore) { away.won += 1; home.lost += 1; away.points += 3; }
    else { home.drawn += 1; away.drawn += 1; home.points += 1; away.points += 1; }
  });
  return Object.values(table).sort((left, right) => right.points - left.points || (right.gf - right.ga) - (left.gf - left.ga) || right.gf - left.gf);
};

const createFinalFixtures = (standings) => ([
  { id: 'shield-final', stage: 'finals', round: 4, label: 'Shield Match · 3rd vs 4th', homeId: standings[2].teamId, awayId: standings[3].teamId, status: 'pending', scheduledAt: '', homeScore: null, awayScore: null },
  { id: 'championship-final', stage: 'finals', round: 5, label: 'Championship Final · 1st vs 2nd', homeId: standings[0].teamId, awayId: standings[1].teamId, status: 'pending', scheduledAt: '', homeScore: null, awayScore: null },
]);

const suggestKickoffDate = () => {
  const date = new Date();
  const daysUntilFriday = (5 - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilFriday);
  date.setHours(20, 0, 0, 0);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const isProfileComplete = (player) => (
  !!(player && player.profileComplete && player.name?.trim() && player.tag?.trim() && player.primary && player.secondary && player.style)
);

const getCaptainReadiness = (state, tournament) => {
  const captainsList = tournament?.captains || [];
  const captainData = state.tournamentCaptainData[tournament?.id] || {};
  const teamSize = Number(tournament?.teamSize) || 11;
  const soldIds = new Set(Object.values(captainData).flatMap((data) => data.squad || []));
  
  return captainsList.map((captain) => {
    const data = captainData[captain.id] || { squad: [], shortlist: [] };
    const filled = 1 + new Set((data.squad || []).filter((id) => id !== captain.id)).size;
    const isFull = filled >= teamSize;
    const validShortlist = (data.shortlist || []).filter((pId) => !soldIds.has(pId));
    const isReady = isFull || validShortlist.length > 0;
    
    return {
      id: captain.id,
      name: captain.name,
      handle: captain.handle || captain.tag,
      isFull,
      shortlistCount: validShortlist.length,
      isReady
    };
  });
};

const getNextBidPrice = (currentBid, leaderId) => {
  if (!leaderId) return 50;
  if (currentBid >= 200) return currentBid + 100;
  return currentBid + 50;
};

const getMaxAllowedBid = (budget, currentSquadCount, teamSize) => {
  const playersNeededTotal = teamSize - currentSquadCount;
  if (playersNeededTotal <= 1) {
    return budget;
  }
  const reservedCoins = playersNeededTotal * 50;
  return budget - reservedCoins;
};


const createDefaultState = () => ({
  players: seedPlayers,
  captainData: createCaptainData(1000, true),
  auction: createAuction(),
  tournaments: seedTournaments,
  tournamentPlayerIds: { 't-friday-night': seedPlayers.map((player) => player.id) },
  tournamentCaptainData: { 't-friday-night': createCaptainData(1000, true) },
  tournamentAuctions: { 't-friday-night': createAuction() },
  tournamentCompetitions: { 't-friday-night': createCompetition() },
  demoPicksVersion: 1,
  _sync: { origin: 'seed', updatedAt: 0 },
});

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved?.players || !saved?.captainData || !saved?.auction) return createDefaultState();
    const base = createDefaultState();
    const normalized = { ...base, ...saved, captainData: { ...base.captainData } };
    const needsDemoPicks = saved.demoPicksVersion !== 1;
    const soldPlayerIds = new Set(Object.values(saved.captainData).flatMap((data) => data.squad || []));
    captains.forEach((captain) => {
      const prior = saved.captainData[captain.id] || {};
      const formation = formations[prior.formation] ? prior.formation : '4-3-3';
      const activeSpots = new Set(formations[formation].map((spot) => spot.id));
      const lineup = Object.fromEntries(Object.entries(prior.lineup || {}).filter(([spotId]) => activeSpots.has(spotId)));
      const captainMemberId = `captain:${captain.id}`;
      if (!Object.values(lineup).includes(captainMemberId)) lineup.GK = captainMemberId;
      const seededShortlist = demoCaptainShortlists[captain.id]?.filter((playerId) => !soldPlayerIds.has(playerId)) || [];
      const shortlist = needsDemoPicks && captain.id !== 'cap-tariq' && !prior.shortlist?.length ? seededShortlist : (prior.shortlist || base.captainData[captain.id].shortlist);
      normalized.captainData[captain.id] = { ...base.captainData[captain.id], ...prior, formation, lineup, shortlist };
    });
    normalized.demoPicksVersion = 1;
    normalized.tournaments = saved.tournaments?.length ? saved.tournaments : seedTournaments;
    normalized.tournamentPlayerIds = saved.tournamentPlayerIds || { 't-friday-night': normalized.players.map((player) => player.id) };
    normalized.tournamentCaptainData = saved.tournamentCaptainData || { 't-friday-night': normalized.captainData };
    normalized.tournamentAuctions = saved.tournamentAuctions || { 't-friday-night': normalized.auction };
    normalized.tournamentCompetitions = saved.tournamentCompetitions || { 't-friday-night': createCompetition() };
    normalized.tournaments.forEach((tournament) => {
      if (tournament.id === 't-friday-night' && !tournament.captains) tournament.captains = captains.map((captain) => ({ ...captain }));
      if (!phaseOrder.includes(tournament.phase)) {
        const competition = normalized.tournamentCompetitions?.[tournament.id];
        if (tournament.status === 'active' && competition?.phase && competition.phase !== 'ready') tournament.phase = PHASES.TOURNAMENT;
        else tournament.phase = tournament.status === 'active' ? PHASES.AUCTION : PHASES.DRAFT;
      }
      tournament.captainCount = 4;
      if (tournament.captains) {
        tournament.captains = tournament.captains.map((captain) => ({
          ...captain,
          club: { ...getClubInfo(captain), color: undefined, initials: undefined },
        }));
      }
      if (!normalized.tournamentPlayerIds[tournament.id]) normalized.tournamentPlayerIds[tournament.id] = [];
      if (!normalized.tournamentCaptainData[tournament.id]) normalized.tournamentCaptainData[tournament.id] = createCaptainData(tournament.budget);
      if (!normalized.tournamentAuctions[tournament.id]) normalized.tournamentAuctions[tournament.id] = createAuction();
      if (!normalized.tournamentCompetitions[tournament.id]) normalized.tournamentCompetitions[tournament.id] = createCompetition();
    });
    normalized._sync = saved._sync || { origin: 'legacy', updatedAt: Date.now() };
    return normalized;
  } catch {
    return createDefaultState();
  }
}

const money = (amount) => (amount != null ? amount.toLocaleString() : '0');

const roleThemeClass = (role = 'player') => `role-theme role-theme-${role}`;

function Avatar({ person, size = 'md' }) {
  const color = person?.color || '#a1a8ff';
  const initials = person?.initials || '?';
  return (
    <span className={`avatar avatar-${size}`} style={{ '--avatar-color': color }}>
      {initials}
    </span>
  );
}

function ClubMark({ club, size = 'sm' }) {
  if (club?.logo) return <img className={`club-mark club-mark-${size}`} src={club.logo} alt={`${club.name} crest`} />;
  return <Avatar person={{ color: club?.color, initials: club?.initials }} size={size} />;
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark"><Goal size={21} strokeWidth={2.3} /></span>
      <span>CLUB<span>HOUSE</span></span>
    </div>
  );
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}

function Login({ onLogin, players, captains }) {
  const [role, setRole] = useState('captain');
  const [selected, setSelected] = useState('');
  const [playerSelected, setPlayerSelected] = useState(players[0]?.id || '');

  useEffect(() => {
    if (captains && captains.length > 0 && !selected) {
      setSelected(captains[0].id);
    }
  }, [captains, selected]);

  useEffect(() => {
    if (role === 'captain' && captains && captains.length > 0 && !captains.some((c) => c.id === selected)) {
      setSelected(captains[0].id);
    }
  }, [captains, role, selected]);

  useEffect(() => {
    if (role === 'player' && players && players.length > 0 && !players.some((p) => p.id === playerSelected)) {
      setPlayerSelected(players[0].id);
    }
  }, [players, role, playerSelected]);

  return (
    <main className={`login-page ${roleThemeClass(role)}`}>
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />
      <header className="login-header"><Brand /><span>FC 26 · Auction night</span></header>
      <section className="login-hero">
        <div className="eyebrow"><Sparkles size={14} /> Your squad starts here</div>
        <h1>Pick your side.<br /><em>Build your legacy.</em></h1>
        <p>One player pool. Four captains. A thousand coins each.<br />Absolutely no friendships guaranteed.</p>
      </section>
      <section className="login-card">
        <div className="login-card-top">
          <div>
            <span className="step-label">Demo access</span>
            <h2>Enter the clubhouse</h2>
          </div>
          <span className="secure-badge"><Shield size={14} /> Private lobby</span>
        </div>
        <div className="role-tabs">
          <button className={role === 'captain' ? 'active' : ''} onClick={() => setRole('captain')}>
            <Trophy size={18} /> Captain
          </button>
          <button className={role === 'player' ? 'active' : ''} onClick={() => setRole('player')}>
            <UserRound size={18} /> Player
          </button>
          <button className={role === 'organizer' ? 'active' : ''} onClick={() => setRole('organizer')}>
            <Shield size={18} /> Organizer
          </button>
        </div>
        {role === 'organizer' ? (
          <div className="organizer-login-note"><Shield size={21} /><span><strong>Tournament Director</strong><small>Create tournaments, open registration, and import player pools.</small></span></div>
        ) : role === 'player' && players.length === 0 ? (
          <div className="organizer-login-note" style={{ borderLeftColor: '#ffb96e' }}>
            <UserRound size={21} style={{ color: '#ffb96e' }} />
            <span>
              <strong>No Registered Players</strong>
              <small>Registration must be opened or players must be imported/created by the organizer.</small>
            </span>
          </div>
        ) : (
          <>
            <label className="field-label">Choose your profile</label>
            <div className="select-wrap">
              <select
                value={role === 'captain' ? selected : playerSelected}
                onChange={(event) => role === 'captain' ? setSelected(event.target.value) : setPlayerSelected(event.target.value)}
              >
                {(role === 'captain' ? captains : players).map((person) => (
                  <option key={person.id} value={person.id}>{person.name} · {person.handle || person.tag}</option>
                ))}
              </select>
              <ChevronDown size={17} />
            </div>
          </>
        )}
        <button 
          className="primary full" 
          disabled={role === 'player' && players.length === 0}
          onClick={() => onLogin({ role, id: role === 'organizer' ? 'organizer' : role === 'captain' ? selected : playerSelected })}
        >
          Enter as {role === 'organizer' ? 'organizer' : role} <ArrowRight size={18} />
        </button>
        <p className="login-note">No password needed in this prototype. Real authentication comes with the shared backend.</p>
      </section>
      <footer className="login-footer">
        <span><span className="live-dot" /> Lobby opens Friday · 8:30 PM</span>
        <span>4 captains · 12 players · 1 champion</span>
      </footer>
    </main>
  );
}

const SAMPLE_CSV = `name,primary_position,secondary_position
Fatin,CDM,CAM
Saqib,ST,CAM
Tariq,CAM,ST
Jaed,CAM,CM
Kaisar Bhai,RW,RM
Sanju,ST,
Nehal,LCM,RCM
Rakin,CAM,CM
Mannan,GK,
Rashed,LW,RW
Wasiful,LW,RW
Amado,CAM,CM
Arman,CM,CDM
Saad Bhai,CM,CAM
Aamir,ST,CAM
Shoumik,ST,CAM`;

function normalizePosition(pos) {
  if (!pos) return '';
  const p = pos.toUpperCase().trim();
  if (p === 'LCM' || p === 'RCM' || p === 'LCM/RCM') return 'CM';
  if (p === 'LDM' || p === 'RDM') return 'CDM';
  if (p === 'LWB') return 'LB';
  if (p === 'RWB') return 'RB';
  if (p === 'CF') return 'ST';
  return p;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"' && quoted && text[index + 1] === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = []; cell = '';
    } else cell += char;
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) return [];
  const headers = rows[0].map((header) => header.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''));
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || '']))).filter((item) => item.name || item.full_name || item.gamertag || item.tag);
}

function TournamentSelector({ user, state, onSelect, onRegister, onLogout }) {
  return (
    <main className={`tournament-select-page ${roleThemeClass(user.role)}`}>
      <header className="standalone-header"><Brand /><button className="ghost" onClick={onLogout}><LogOut size={16} /> Sign out</button></header>
      <section className="selector-heading"><span className="page-kicker">Step 02 · Tournament access</span><h1>Choose your competition.</h1><p>Your profile stays the same. Each tournament has its own player pool, squads, budgets, and auction.</p></section>
      <div className="tournament-card-grid">
        {state.tournaments.map((tournament) => {
          const playerIds = state.tournamentPlayerIds[tournament.id] || [];
          const phase = getTournamentPhase(tournament);
          const tourCaptains = tournament.captains || (tournament.id === 't-friday-night' ? captains : []);
          const isCaptain = tourCaptains.some((c) => c.id === user.id);
          const isPlayer = playerIds.includes(user.id);
          const registrationOpen = phase === PHASES.REGISTRATION;
          const captainAccess = isCaptain && phaseOrder.indexOf(phase) >= phaseOrder.indexOf(PHASES.CAPTAINS);
          const playerAccess = isPlayer && phase !== PHASES.DRAFT;
          const eligible = user.role === 'captain' ? captainAccess : playerAccess;
          return (
            <article className={`tournament-select-card ${eligible || registrationOpen ? 'available' : ''}`} key={tournament.id}>
              <div className="tournament-card-top"><span className={`tournament-status ${phase}`}>{phase === PHASES.AUCTION ? <><span className="live-dot" /> {phaseLabel(phase)}</> : phaseLabel(phase)}</span><Trophy size={23} /></div>
              <h2>{tournament.name}</h2>
              <div className="tournament-meta"><span><CalendarDays size={14} /> {new Date(`${tournament.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><span><UsersRound size={14} /> {playerIds.length} players</span></div>
              <div className="tournament-rules"><span>{tournament.format}</span><span>{tournament.captainCount} captains</span><span>{money(tournament.budget)} coins</span></div>
              {user.role === 'player' && registrationOpen && !isPlayer ? (
                <button className="primary full" onClick={() => onRegister(tournament.id)}>
                  Register for tournament <ArrowRight size={17} />
                </button>
              ) : (
                <button className="primary full" disabled={!eligible} onClick={() => onSelect(tournament.id)}>
                  {eligible ? <>Select tournament <ArrowRight size={17} /></> : user.role === 'captain' ? 'Not a captain in this tournament' : phase === PHASES.DRAFT ? 'Registration not open' : 'Not registered in this pool'}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}

function OrganizerDashboard({ state, updateState, onLogout }) {
  const [selectedId, setSelectedId] = useState(state.tournaments[0]?.id);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', date: '2026-07-03', teamSize: 4, captainCount: 4, budget: 1000 });
  const [csvRows, setCsvRows] = useState([]);
  const [importMessage, setImportMessage] = useState('');
  
  // New States
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', date: '', teamSize: 4, captainCount: 4, budget: 1000 });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [manualPlayer, setManualPlayer] = useState({ name: '', primary: 'CM', secondary: 'CM' });
  const [orgTab, setOrgTab] = useState('roster');

  const tournament = state.tournaments.find((item) => item.id === selectedId) || state.tournaments[0];
  const phase = getTournamentPhase(tournament);
  const canEditRules = phase === PHASES.DRAFT;
  const canManageRoster = [PHASES.DRAFT, PHASES.REGISTRATION].includes(phase);
  const canSelectCaptains = phase === PHASES.CAPTAINS;
  const playerIds = state.tournamentPlayerIds[tournament?.id] || [];
  const tournamentPlayers = state.players.filter((player) => playerIds.includes(player.id));

  const createTournament = () => {
    if (!form.name.trim()) return;
    const id = `t-${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString(36)}`;
    const teamSize = Number(form.teamSize);
    const captainCount = 4;
    const totalPlayers = captainCount * teamSize;
    updateState((draft) => {
      draft.tournaments.push({
        name: form.name,
        date: form.date,
        totalPlayers: totalPlayers,
        teamSize: teamSize,
        captainCount,
        budget: Number(form.budget),
        id,
        format: `${teamSize}v${teamSize}`,
        status: 'draft',
        phase: PHASES.DRAFT,
        captains: []
      });
      draft.tournamentPlayerIds[id] = [];
      draft.tournamentCaptainData[id] = {};
      draft.tournamentAuctions[id] = createAuction();
      draft.tournamentCompetitions[id] = createCompetition();
    });
    setSelectedId(id); setShowCreate(false); setForm({ name: '', date: '2026-07-03', teamSize: 4, captainCount: 4, budget: 1000 });
  };

  const deleteTournament = (id) => {
    updateState((draft) => {
      const playersInDeletedTour = draft.tournamentPlayerIds[id] || [];
      
      // Filter out this tournament
      draft.tournaments = draft.tournaments.filter((item) => item.id !== id);
      delete draft.tournamentPlayerIds[id];
      delete draft.tournamentCaptainData[id];
      delete draft.tournamentAuctions[id];
      delete draft.tournamentCompetitions[id];
      
      // Find all player IDs that are still registered in at least one remaining tournament
      const remainingRegisteredPlayerIds = new Set(
        Object.entries(draft.tournamentPlayerIds)
          .filter(([tourId]) => tourId !== id)
          .flatMap(([, playerIds]) => playerIds || [])
      );
      
      // Delete players who were only in the deleted tournament and are not in remainingRegisteredPlayerIds
      const playerIdsToRemove = playersInDeletedTour.filter(pId => !remainingRegisteredPlayerIds.has(pId));
      if (playerIdsToRemove.length > 0) {
        const removeSet = new Set(playerIdsToRemove);
        draft.players = draft.players.filter(p => !removeSet.has(p.id));
      }
    });
    const remaining = state.tournaments.filter((item) => item.id !== id);
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id);
    } else {
      setSelectedId(null);
    }
    setDeleteConfirm(false);
    setIsEditing(false);
  };

  const resetTournament = () => {
    if (!window.confirm("Are you sure you want to reset this tournament? All auction history, rosters, and budgets will be cleared.")) return;
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (target) {
        setTournamentPhase(target, PHASES.DRAFT);
        target.time = ''; // Clear start time on reset
        target.captains = []; // Clear custom captains on reset
      }
      draft.tournamentPlayerIds[tournament.id] = [];
      draft.tournamentCaptainData[tournament.id] = {};
      draft.tournamentAuctions[tournament.id] = createAuction();
      draft.tournamentCompetitions[tournament.id] = createCompetition();
    });
    setCsvRows([]);
    setImportMessage('');
  };

  const startEditing = () => {
    const defaultTeamSize = tournament.teamSize || Math.floor(Number(tournament.totalPlayers || 16) / Number(tournament.captainCount)) || 4;
    setEditForm({
      name: tournament.name,
      date: tournament.date,
      teamSize: defaultTeamSize,
      captainCount: 4,
      budget: tournament.budget
    });
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) return;
    const teamSize = Number(editForm.teamSize);
    const captainCount = 4;
    const totalPlayers = captainCount * teamSize;
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (target) {
        target.name = editForm.name;
        target.date = editForm.date;
        if (getTournamentPhase(target) === PHASES.DRAFT) {
          target.totalPlayers = totalPlayers;
          target.teamSize = teamSize;
          target.captainCount = captainCount;
          target.budget = Number(editForm.budget);
          target.format = `${teamSize}v${teamSize}`;
          target.captains = [];
          draft.tournamentCaptainData[tournament.id] = {};
        }
      }
    });
    setIsEditing(false);
  };

  const removePlayerFromTournament = (playerId) => {
    updateState((draft) => {
      draft.tournamentPlayerIds[tournament.id] = (draft.tournamentPlayerIds[tournament.id] || []).filter((id) => id !== playerId);
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (target && target.captains) {
        target.captains = target.captains.filter((c) => c.id !== playerId);
      }
      if (draft.tournamentCaptainData[tournament.id]) {
        delete draft.tournamentCaptainData[tournament.id][playerId];
      }
    });
  };

  const toggleCaptain = (player) => {
    const isCap = tournament.captains?.some((c) => c.id === player.id);
    if (!isCap && !isProfileComplete(player)) {
      alert(`Cannot promote ${player.name} (${player.tag}) to captain. Their profile is incomplete.`);
      return;
    }
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (!target) return;
      if (!target.captains) target.captains = [];

      const existingIndex = target.captains.findIndex((c) => c.id === player.id);
      if (existingIndex >= 0) {
        target.captains.splice(existingIndex, 1);
        if (draft.tournamentCaptainData[tournament.id]) {
          delete draft.tournamentCaptainData[tournament.id][player.id];
        }
      } else {
        const maxCaptains = Number(target.captainCount || 4);
        if (target.captains.length >= maxCaptains) {
          alert(`This tournament is configured for exactly ${maxCaptains} captains. Demote an existing captain first.`);
          return;
        }

        const teamColors = ['#d9ff63', '#66e3ff', '#ff766e', '#b69cff', '#67e8c2', '#ffb96e', '#ffd964', '#fa8eac'];
        const assignedColor = teamColors[target.captains.length % teamColors.length];

        const capInfo = {
          id: player.id,
          name: player.name,
          handle: player.tag,
          team: `${player.tag}'s FC`,
          color: assignedColor,
          initials: player.initials,
          club: { name: `${player.tag}'s FC`, logo: null }
        };
        target.captains.push(capInfo);

        if (!draft.tournamentCaptainData[tournament.id]) {
          draft.tournamentCaptainData[tournament.id] = {};
        }

        const defaultFormation = Object.keys(getFormationSet(getTournamentTeamSize(target)))[0];
        draft.tournamentCaptainData[tournament.id][player.id] = {
          formation: defaultFormation,
          shortlist: [],
          budget: Number(target.budget || 1000),
          squad: [],
          lineup: { GK: `captain:${player.id}` }
        };

        Object.values(draft.tournamentCaptainData[tournament.id]).forEach((captainData) => {
          captainData.shortlist = (captainData.shortlist || []).filter((id) => id !== player.id);
          captainData.squad = (captainData.squad || []).filter((id) => id !== player.id);
        });

        const auction = draft.tournamentAuctions[tournament.id];
        if (auction) {
          Object.keys(auction.votes || {}).forEach((captainId) => {
            if (auction.votes[captainId] === player.id) delete auction.votes[captainId];
          });
          if (auction.playerId === player.id) draft.tournamentAuctions[tournament.id] = createAuction();
        }
      }
    });
  };

  const updateCaptainTeamName = (playerId, teamName) => {
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (!target || !target.captains) return;
      const cap = target.captains.find((c) => c.id === playerId);
      if (cap) {
        cap.team = teamName;
        cap.club = { ...getClubInfo(cap), name: teamName, color: undefined, initials: undefined };
      }
    });
  };

  const addPlayerToTournament = () => {
    if (!manualPlayer.name.trim()) return;
    updateState((draft) => {
      const name = manualPlayer.name;
      const tag = name;
      const initials = name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'P';
      const palette = ['#77b7ff', '#ffb96e', '#67e8c2', '#e6a5ff', '#ffd964'];
      const color = palette[draft.players.length % palette.length];
      
      let player = draft.players.find((item) => item.name.toLowerCase() === name.toLowerCase());
      if (!player) {
        player = {
          id: `p-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`,
          name: name,
          tag: tag,
          initials,
          primary: manualPlayer.primary,
          secondary: manualPlayer.secondary,
          rating: 75,
          style: 'Utility',
          traits: [],
          availability: 'Confirmed',
          color
        };
        draft.players.push(player);
      }
      
      const tournamentIds = new Set(draft.tournamentPlayerIds[tournament.id] || []);
      tournamentIds.add(player.id);
      draft.tournamentPlayerIds[tournament.id] = [...tournamentIds];
    });
    
    setManualPlayer({ name: '', primary: 'CM', secondary: 'CM' });
    setShowAddPlayer(false);
  };

  const openRegistration = () => {
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (target) setTournamentPhase(target, PHASES.REGISTRATION);
    });
    setOrgTab('roster');
  };

  const lockRegistration = () => {
    const required = Number(tournament.captainCount || 4);
    if (tournamentPlayers.length < required) {
      alert(`Register at least ${required} players before selecting captains. (${tournamentPlayers.length} registered)`);
      return;
    }

    // Check if any registered player has an incomplete profile
    const incompletePlayers = tournamentPlayers.filter(p => !isProfileComplete(p));
    if (incompletePlayers.length > 0) {
      const confirmLock = window.confirm(
        `Warning: ${incompletePlayers.length} player(s) have not completed their profiles:\n` +
        incompletePlayers.map(p => `- ${p.tag || p.name}`).join('\n') +
        `\n\nDo you want to lock registration anyway?`
      );
      if (!confirmLock) return;
    }
    
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (target) setTournamentPhase(target, PHASES.CAPTAINS);
    });
    setOrgTab('roster');
  };

  const startAuction = () => {
    const required = Number(tournament.captainCount || 4);
    const current = tournament.captains?.length || 0;
    if (current !== required) {
      alert(`Please select exactly ${required} captains from the roster first. (Currently: ${current} selected)`);
      return;
    }
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (target) setTournamentPhase(target, PHASES.AUCTION);
      draft.tournamentAuctions[tournament.id] = createAuction();
    });
  };

  const simulateInstantDraft = () => {
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (!target) return;
      const captainList = target.captains || [];
      if (captainList.length < 4) {
        alert("Please select captains first.");
        return;
      }
      
      const teamSize = getTournamentTeamSize(target);
      const capData = draft.tournamentCaptainData[tournament.id] || {};
      const playerIds = draft.tournamentPlayerIds[tournament.id] || [];
      
      const captainIds = new Set(captainList.map((c) => c.id));
      const draftablePlayers = playerIds.filter((pId) => !captainIds.has(pId));
      
      captainList.forEach((captain) => {
        if (!capData[captain.id]) {
          capData[captain.id] = {
            formation: '4-3-3',
            shortlist: [],
            budget: target.budget || 1000,
            squad: [],
            lineup: { GK: `captain:${captain.id}` },
            squadConfirmed: false
          };
        } else {
          capData[captain.id].squad = [];
          capData[captain.id].budget = target.budget || 1000;
          capData[captain.id].lineup = { GK: `captain:${captain.id}` };
          capData[captain.id].squadConfirmed = false;
        }
      });
      
      let playerIndex = 0;
      for (let i = 1; i < teamSize; i++) {
        captainList.forEach((captain) => {
          if (playerIndex < draftablePlayers.length) {
            const playerId = draftablePlayers[playerIndex];
            capData[captain.id].squad.push(playerId);
            capData[captain.id].budget -= 100;
            playerIndex++;
          }
        });
      }
      
      captainList.forEach((captain) => {
        capData[captain.id].shortlist = [];
      });
      
      draft.tournamentAuctions[tournament.id] = {
        phase: 'complete',
        votes: {},
        playerId: null,
        bid: 0,
        leaderId: null,
        history: [
          { type: 'complete', text: 'Auction completed via developer instant draft simulation' }
        ]
      };
      
      setTournamentPhase(target, PHASES.SQUADS);
    });
  };

  const openSquadConfirmation = () => {
    if (state.tournamentAuctions[tournament.id]?.phase !== 'complete') {
      alert('Finish the auction before opening squad confirmation.');
      return;
    }
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (target) setTournamentPhase(target, PHASES.SQUADS);
    });
  };

  const startTournamentLive = () => {
    const allReady = (tournament.captains || []).every((captain) => state.tournamentCaptainData[tournament.id]?.[captain.id]?.squadConfirmed);
    if (!allReady) {
      alert('Every captain must confirm their squad first.');
      return;
    }
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (!target) return;
      setTournamentPhase(target, PHASES.TOURNAMENT);
      const teamIds = (target.captains || []).map((captain) => captain.id);
      draft.tournamentCompetitions[tournament.id] = { phase: 'league', readyCaptainIds: teamIds, matches: createLeagueFixtures(teamIds), playerStats: [] };
    });
  };

  const markComplete = () => {
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (target) setTournamentPhase(target, PHASES.COMPLETE);
    });
  };

  const auctionPlayersFor = (draft, target) => {
    const ids = new Set(draft.tournamentPlayerIds[target.id] || []);
    return auctionEligiblePlayers(draft.players.filter((player) => ids.has(player.id)), target.captains || []);
  };
  const captainSquadSize = (captainId, captainData) => 1 + new Set((captainData?.squad || []).filter((playerId) => playerId !== captainId)).size;

  const fillAuctionVotes = () => updateState((draft) => {
    const target = draft.tournaments.find((item) => item.id === tournament.id);
    if (!target) return;
    const auction = draft.tournamentAuctions[tournament.id];
    const captainData = draft.tournamentCaptainData[tournament.id] || {};
    const soldIds = new Set(Object.values(captainData).flatMap((data) => data.squad || []));
    const players = auctionPlayersFor(draft, target);
    const unsoldPlayers = players.filter((player) => !soldIds.has(player.id));
    const activeCandidates = Array.from(new Set(
      Object.values(captainData).map((data) => data.shortlist?.find((id) => !soldIds.has(id))).filter(Boolean)
    ));
    (target.captains || []).forEach((captain, index) => {
      if (auction.votes[captain.id]) return;
      const topPick = captainData[captain.id]?.shortlist?.find((id) => !soldIds.has(id));
      const fallback = activeCandidates[index % Math.max(activeCandidates.length, 1)]
        || unsoldPlayers[index % Math.max(unsoldPlayers.length, 1)]?.id;
      if (topPick || fallback) auction.votes[captain.id] = topPick || fallback;
    });
  });

  const revealAuctionNomination = () => updateState((draft) => {
    const target = draft.tournaments.find((item) => item.id === tournament.id);
    if (!target) return;
    const auction = draft.tournamentAuctions[tournament.id];
    const captainData = draft.tournamentCaptainData[tournament.id] || {};
    const soldIds = new Set(Object.values(captainData).flatMap((data) => data.squad || []));
    const players = auctionPlayersFor(draft, target);
    const unsoldPlayers = players.filter((player) => !soldIds.has(player.id));
    const activeCandidates = Array.from(new Set(
      Object.values(captainData).map((data) => data.shortlist?.find((id) => !soldIds.has(id))).filter(Boolean)
    ));
    
    // Automatically fill missing votes using shortlist or fallback
    (target.captains || []).forEach((cap, index) => {
      if (auction.votes[cap.id]) return;
      const topPick = captainData[cap.id]?.shortlist?.find((id) => !soldIds.has(id));
      const fallback = activeCandidates[index % Math.max(activeCandidates.length, 1)]
        || unsoldPlayers[index % Math.max(unsoldPlayers.length, 1)]?.id;
      if (topPick || fallback) auction.votes[cap.id] = topPick || fallback;
    });

    const counts = Object.values(auction.votes || {}).reduce((map, id) => ({ ...map, [id]: (map[id] || 0) + 1 }), {});
    const top = Math.max(...Object.values(counts), 0);
    const tied = Object.keys(counts).filter((id) => counts[id] === top);
    const winner = tied[Math.floor(Math.random() * tied.length)];
    if (!winner) return;
    auction.phase = 'bidding';
    auction.playerId = winner;
    auction.bid = 50;
    auction.leaderId = null;
    const player = draft.players.find((item) => item.id === winner);
    auction.history.unshift({ type: 'nomination', text: `${player?.tag || 'Player'} nominated at 50 coins` });
  });

  const recordHostBid = () => updateState((draft) => {
    const target = draft.tournaments.find((item) => item.id === tournament.id);
    if (!target) return;
    const auction = draft.tournamentAuctions[tournament.id];
    const captainData = draft.tournamentCaptainData[tournament.id] || {};
    const teamSize = getTournamentTeamSize(target);
    const price = getNextBidPrice(auction.bid, auction.leaderId);
    const bidders = (target.captains || []).filter((captain) => (
      captain.id !== auction.leaderId
      && captainData[captain.id]?.budget >= price
      && captainSquadSize(captain.id, captainData[captain.id]) < teamSize
    ));
    if (!bidders.length) return;
    const bidder = bidders[0];
    auction.bid = price;
    auction.leaderId = bidder.id;
    auction.history.unshift({ type: 'bid', text: `${bidder.handle || bidder.tag || 'Captain'} bid ${price}` });
  });

  const closeAuctionLot = () => updateState((draft) => {
    const target = draft.tournaments.find((item) => item.id === tournament.id);
    if (!target) return;
    const auction = draft.tournamentAuctions[tournament.id];
    const captainData = draft.tournamentCaptainData[tournament.id] || {};
    if (!auction.leaderId) return;
    const teamSize = getTournamentTeamSize(target);
    const winner = auction.leaderId;
    if (captainSquadSize(winner, captainData[winner]) >= teamSize) return;
    const players = auctionPlayersFor(draft, target);
    const wonPlayer = players.find((item) => item.id === auction.playerId);
    captainData[winner].budget -= auction.bid;
    captainData[winner].squad.push(auction.playerId);
    Object.values(captainData).forEach((data) => { data.shortlist = (data.shortlist || []).filter((id) => id !== auction.playerId); });
    const saleEntry = { type: 'sale', text: `${wonPlayer?.tag || 'Player'} signed by ${getClubInfo((target.captains || []).find((c) => c.id === winner)).name}` };
    const soldIds = new Set(Object.values(captainData).flatMap((data) => data.squad || []));
    const unsoldPlayers = players.filter((player) => !soldIds.has(player.id));
    const openTeams = (target.captains || []).filter((captain) => captainSquadSize(captain.id, captainData[captain.id]) < teamSize);
    if (openTeams.length === 0 || unsoldPlayers.length === 0) {
      draft.tournamentAuctions[tournament.id] = { phase: 'complete', votes: {}, playerId: null, bid: 0, leaderId: null, history: [{ type: 'complete', text: 'Auction complete - All squads set' }, saleEntry, ...auction.history] };
    } else if (unsoldPlayers.length === 1 && openTeams.length === 1) {
      const lastPlayer = unsoldPlayers[0];
      const onlyTeam = openTeams[0];
      captainData[onlyTeam.id].squad.push(lastPlayer.id);
      Object.values(captainData).forEach((data) => { data.shortlist = (data.shortlist || []).filter((id) => id !== lastPlayer.id); });
      const autoEntry = { type: 'auto', text: `${lastPlayer.tag} auto-allocated to ${getClubInfo((target.captains || []).find((c) => c.id === onlyTeam.id)).name}` };
      draft.tournamentAuctions[tournament.id] = { phase: 'complete', votes: {}, playerId: null, bid: 0, leaderId: null, history: [{ type: 'complete', text: 'Auction complete - All squads set' }, autoEntry, saleEntry, ...auction.history] };
    } else {
      draft.tournamentAuctions[tournament.id] = { phase: 'voting', votes: {}, playerId: null, bid: 0, leaderId: null, history: [saleEntry, ...auction.history] };
    }
  });

  const passAuctionLot = () => updateState((draft) => {
    const auction = draft.tournamentAuctions[tournament.id];
    const passed = draft.players.find((item) => item.id === auction.playerId);
    draft.tournamentAuctions[tournament.id] = { phase: 'voting', votes: {}, playerId: null, bid: 0, leaderId: null, history: [{ type: 'pass', text: `${passed?.tag || 'Player'} passed - no sale, back in the pool` }, ...auction.history] };
  });

  const readCsv = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCsvRows(parseCsv(await file.text())); setImportMessage('');
  };

  const importRoster = () => {
    if (!csvRows.length) return;
    updateState((draft) => {
      const tournamentIds = new Set(draft.tournamentPlayerIds[tournament.id] || []);
      const palette = ['#77b7ff', '#ffb96e', '#67e8c2', '#e6a5ff', '#ffd964'];
      csvRows.forEach((row, index) => {
        const name = row.name || row.full_name || '';
        if (!name.trim()) return;
        const tag = row.gamertag || row.tag || name;
        const rawPrimary = row.primary_position || row.preferred_positions || row.preferred_position || row.primary || 'CM';
        const rawSecondary = row.secondary_position || row.secondary || rawPrimary;
        const primary = normalizePosition(rawPrimary);
        const secondary = normalizePosition(rawSecondary);
        let player = draft.players.find((item) => item.name.toLowerCase() === name.toLowerCase());
        if (!player) {
          const initials = name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'P';
          player = {
            id: `p-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}-${index}`,
            name,
            tag,
            initials,
            primary,
            secondary,
            rating: 75,
            style: 'Utility',
            traits: [],
            availability: 'Confirmed',
            color: palette[index % palette.length]
          };
          draft.players.push(player);
        }
        tournamentIds.add(player.id);
      });
      draft.tournamentPlayerIds[tournament.id] = [...tournamentIds];
    });
    setImportMessage(`${csvRows.length} players imported to ${tournament.name}.`); setCsvRows([]);
  };

  const downloadCsvTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "name,primary_position,secondary_position\n"
      + "Fatin,CDM,CAM\n"
      + "Saqib,ST,CAM\n"
      + "Tariq,CAM,ST\n"
      + "Jaed,CAM,CM\n"
      + "Kaisar Bhai,RW,RM\n"
      + "Sanju,ST,\n"
      + "Nehal,LCM,RCM\n"
      + "Rakin,CAM,CM\n"
      + "Mannan,GK,\n"
      + "Rashed,LW,RW\n"
      + "Wasiful,LW,RW\n"
      + "Amado,CAM,CM\n"
      + "Arman,CM,CDM\n"
      + "Saad Bhai,CM,CAM\n"
      + "Aamir,ST,CAM\n"
      + "Shoumik,ST,CAM";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "roster_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const auction = tournament ? state.tournamentAuctions[tournament.id] || createAuction() : createAuction();
  const auctionPlayer = tournamentPlayers.find((player) => player.id === auction.playerId);
  const auctionLeader = tournament?.captains?.find((captain) => captain.id === auction.leaderId);
  const auctionVotesIn = Object.keys(auction.votes || {}).length;

  return (
    <main className={`organizer-page ${roleThemeClass('organizer')}`}>
      <header className="standalone-header"><Brand /><div><span className="organizer-badge"><Shield size={14} /> Organizer</span><button className="ghost" onClick={onLogout}><LogOut size={16} /> Sign out</button></div></header>
      <div className="organizer-layout">
        <aside className="tournament-list-panel">
          <div className="organizer-section-head"><div><span className="page-kicker">Tournament control</span><h1>Competitions</h1></div><button className="primary icon-only" aria-label="Create tournament" onClick={() => setShowCreate((value) => !value)}><Plus size={18} /></button></div>
          {showCreate && (
            <div className="create-tournament-form">
              <label><span>Tournament name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Friday Night FC" /></label>
              <div className="form-row">
                <label><span>Start Date</span><input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
                <label><span>Captains</span><input type="number" disabled value={4} /></label>
              </div>
              <div className="form-row">
                <label><span>Team Size</span><input type="number" min="2" value={form.teamSize} onChange={(event) => setForm({ ...form, teamSize: event.target.value })} /></label>
                <label><span>Coin budget</span><input type="number" min="100" step="50" value={form.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} /></label>
              </div>
              <div className="team-size-calc-helper">
                Total Players: {4 * Number(form.teamSize)} · 4 Teams
              </div>
              <button className="primary full" onClick={createTournament}>Create tournament</button>
            </div>
          )}
          <div className="organizer-tournament-list">
            {state.tournaments.map((item) => (
              <button key={item.id} className={selectedId === item.id ? 'active' : ''} onClick={() => { setSelectedId(item.id); setCsvRows([]); setImportMessage(''); setIsEditing(false); setDeleteConfirm(false); setShowAddPlayer(false); }}>
                <span className={`tournament-dot ${getTournamentPhase(item)}`} />
                <span><strong>{item.name}</strong><small>{phaseLabel(getTournamentPhase(item))} · {item.date}</small></span>
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
        </aside>
        {tournament ? (
          <section className="tournament-control-panel">
            {isEditing ? (
              <div className="edit-tournament-form-inline">
                <div className="edit-form-header">
                  <h3>Edit Competition Details</h3>
                  <p>Modify settings for "{tournament.name}"</p>
                </div>
                <label><span>Tournament Name</span><input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} /></label>
                <div className="form-row">
                  <label><span>Start Date</span><input type="date" value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} /></label>
                  {canEditRules ? (
                    <label><span>Captains</span><input type="number" disabled value={4} /></label>
                  ) : (
                    <label><span>Captains</span><input type="number" disabled value={tournament.captainCount} /></label>
                  )}
                </div>
                {canEditRules ? (
                  <>
                    <div className="form-row">
                      <label><span>Team Size</span><input type="number" min="2" value={editForm.teamSize} onChange={(e) => setEditForm({...editForm, teamSize: e.target.value})} /></label>
                      <label><span>Coin Budget</span><input type="number" min="100" step="50" value={editForm.budget} onChange={(e) => setEditForm({...editForm, budget: e.target.value})} /></label>
                    </div>
                    <div className="team-size-calc-helper">
                      Total Players: {4 * Number(editForm.teamSize)} · 4 Teams
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-row">
                      <label><span>Team Size</span><input type="number" disabled value={tournament.teamSize || Math.floor(Number(tournament.totalPlayers || 16) / Number(tournament.captainCount))} /></label>
                      <label><span>Coin Budget</span><input type="number" disabled value={tournament.budget} /></label>
                    </div>
                    <p className="locked-warning">Team size, captains, and budget are locked after draft setup.</p>
                  </>
                )}
                <div className="edit-actions">
                  <button className="primary" onClick={saveEdit}>Save Changes</button>
                  <button className="secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="control-hero">
                <div>
                  <span className={`tournament-status ${phase}`}>{phaseLabel(phase)}</span>
                  <h2>{tournament.name}</h2>
                  <p>{tournament.format} · {tournament.captainCount} captains · {money(tournament.budget)} coins each · Start Date: {tournament.date}</p>
                </div>
                <div className="control-actions">
                  {phase === PHASES.DRAFT && <button className="primary" onClick={openRegistration}><Play size={17} /> Open registration</button>}
                  {phase === PHASES.REGISTRATION && <button className="primary" onClick={lockRegistration}><UsersRound size={17} /> Lock registration</button>}
                  {phase === PHASES.CAPTAINS && <button className="primary" onClick={startAuction}><Radio size={17} /> Start auction</button>}
                  {phase === PHASES.AUCTION && <button className="primary" onClick={openSquadConfirmation}><BadgeCheck size={17} /> Open squad confirmation</button>}
                  {phase === PHASES.SQUADS && <button className="primary" onClick={startTournamentLive}><Swords size={17} /> Start tournament</button>}
                  {phase === PHASES.TOURNAMENT && <button className="primary" onClick={markComplete}><Crown size={17} /> Mark complete</button>}
                  {phase !== PHASES.DRAFT && <button className="secondary" onClick={resetTournament}><RotateCcw size={17} /> Reset to Draft</button>}
                  <button className="secondary icon-only" title="Edit competition details" onClick={startEditing}>
                    <Settings size={17} />
                  </button>
                  {deleteConfirm ? (
                    <div className="delete-confirm-inline">
                      <span>Delete?</span>
                      <button className="primary btn-danger" onClick={() => deleteTournament(tournament.id)}>Yes</button>
                      <button className="secondary" onClick={() => setDeleteConfirm(false)}>No</button>
                    </div>
                  ) : (
                    <button className="secondary btn-danger icon-only" title="Delete competition" onClick={() => setDeleteConfirm(true)}>
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              </div>
            )}
            {phase === PHASES.AUCTION && (() => {
              const readiness = getCaptainReadiness(state, tournament);
              const isRosterReadyForAuctionRound = readiness.every(r => r.isReady);
              return (
                <section className="panel organizer-auction-panel">
                  <div className="panel-head">
                    <div><span className="section-step">A</span><h2>Live Auction Monitor</h2></div>
                    <span className="status-pill good"><Radio size={14} /> {
                      auction.phase === 'voting' ? 'Waiting for votes' :
                      auction.phase === 'bidding' ? 'Bidding live' : 'Auction complete'
                    }</span>
                  </div>
                  
                  {/* Current Lot Info */}
                  <div className="auction-monitor-current-lot" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--line)', marginBottom: '12px' }}>
                    <span style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Current Round State</span>
                    {auction.phase === 'voting' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Vote size={18} style={{ color: '#ffb96e' }} />
                        <div>
                          <strong style={{ fontSize: '12px', display: 'block' }}>Nomination Phase</strong>
                          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                            {auctionVotesIn} of {tournament.captains?.length || 0} captains have submitted their votes.
                          </span>
                        </div>
                      </div>
                    ) : auction.phase === 'bidding' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar person={auctionPlayer} size="sm" />
                        <div>
                          <strong style={{ fontSize: '12px', display: 'block' }}>Bidding Live: {auctionPlayer?.tag} ({auctionPlayer?.primary})</strong>
                          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                            OVR: {auctionPlayer?.rating} · Style: {auctionPlayer?.style}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Crown size={18} style={{ color: '#ffd700' }} />
                        <div>
                          <strong style={{ fontSize: '12px', display: 'block' }}>Auction Complete</strong>
                          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>All squads have been finalized.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Leading Bid Info */}
                  {auction.phase === 'bidding' && (
                    <div className="auction-monitor-bid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', background: 'rgba(217,255,99,0.05)', border: '1px solid rgba(217,255,99,0.15)', borderRadius: '8px', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '9px', color: 'var(--muted)' }}>Highest Bid</span>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--lime)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                          <Coins size={15} /> {auction.bid}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '9px', color: 'var(--muted)' }}>Leading Captain</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          {auctionLeader ? (
                            <>
                              <ClubMark club={getClubInfo(auctionLeader)} size="xs" />
                              <strong style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getClubInfo(auctionLeader).name}</strong>
                            </>
                          ) : (
                            <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Waiting for first bid</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Captains Shortlist Readiness (only in voting phase) */}
                  {auction.phase === 'voting' && (
                    <div style={{ margin: '12px 0', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--line)' }}>
                      <h4 style={{ fontSize: '10px', margin: '0 0 6px', color: 'var(--muted)', textTransform: 'uppercase' }}>Captain Shortlist Readiness</h4>
                      <div style={{ display: 'grid', gap: '4px' }}>
                        {readiness.map((cap) => (
                          <div key={cap.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                            <span>{cap.handle}</span>
                            {cap.isReady ? (
                              <span style={{ color: '#67e8c2' }}>✓ Ready ({cap.shortlistCount} picks)</span>
                            ) : (
                              <span style={{ color: '#ffb96e' }}>⚠️ Missing Shortlist</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Captains Status (Budgets & Squad progress) */}
                  <div className="auction-monitor-captains" style={{ marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Captains Status</h3>
                    <div style={{ display: 'grid', gap: '6px' }}>
                      {(tournament.captains || []).map((captain) => {
                        const capData = state.tournamentCaptainData[tournament.id]?.[captain.id] || { squad: [], budget: 0 };
                        const club = getClubInfo(captain);
                        const size = captainSquadSize(captain.id, capData);
                        const teamSize = getTournamentTeamSize(tournament);
                        const hasVoted = !!auction.votes[captain.id];
                        
                        return (
                          <div key={captain.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--line)', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <ClubMark club={club} size="xs" />
                              <div>
                                <strong style={{ fontSize: '11px', display: 'block' }}>{club.name}</strong>
                                <span style={{ fontSize: '9px', color: 'var(--muted)' }}>
                                  Squad: {size}/{teamSize} {size >= teamSize && ' (FULL)'}
                                </span>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {auction.phase === 'voting' && (
                                <span style={{ fontSize: '9px', padding: '1px 4px', borderRadius: '3px', background: hasVoted ? 'rgba(103,232,194,0.08)' : 'rgba(255,255,255,0.03)', color: hasVoted ? '#67e8c2' : 'var(--muted)' }}>
                                  {hasVoted ? 'Voted' : 'Voting...'}
                                </span>
                              )}
                              <div style={{ fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <Coins size={10} /> {capData.budget}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Main Control Actions */}
                  <div className="control-actions" style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
                    {auction.phase === 'voting' ? (
                      <div style={{ width: '100%' }}>
                        {!isRosterReadyForAuctionRound && (
                          <p style={{ fontSize: '10px', color: '#ffb96e', margin: '0 0 6px', textAlign: 'center' }}>
                            ⚠️ All active captains must have at least 1 valid shortlist pick.
                          </p>
                        )}
                        <button 
                          className="primary full" 
                          disabled={!isRosterReadyForAuctionRound} 
                          onClick={revealAuctionNomination}
                        >
                          <ArrowRight size={15} /> Reveal Nomination
                        </button>
                      </div>
                    ) : auction.phase === 'bidding' ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
                        <button className="primary" disabled={!auction.leaderId} onClick={closeAuctionLot}>
                          <BadgeCheck size={15} /> Award Player
                        </button>
                        <button className="secondary" onClick={passAuctionLot}>
                          Pass No Sale
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '10px', color: 'var(--muted)', textAlign: 'center', width: '100%' }}>
                        Auction complete. Advance to squad confirmation.
                      </div>
                    )}
                  </div>

                  {/* Admin / Override Tools */}
                  <div className="admin-override-section" style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                    <details style={{ width: '100%' }}>
                      <summary style={{ fontSize: '10px', color: 'var(--muted)', cursor: 'pointer', userSelect: 'none', padding: '2px 0' }}>
                        ⚙ Admin / Override Tools
                      </summary>
                      <div style={{ display: 'grid', gap: '6px', marginTop: '6px', padding: '6px', background: 'rgba(255,0,0,0.01)', border: '1px solid rgba(255,0,0,0.08)', borderRadius: '6px' }}>
                        <button className="secondary btn-xs full" style={{ fontSize: '9px', padding: '4px', backgroundColor: 'rgba(217,255,99,0.08)', color: 'var(--lime)', border: '1px solid rgba(217,255,99,0.2)' }} onClick={simulateInstantDraft}>
                          <Sparkles size={11} /> Instant Draft (Skip Auction)
                        </button>
                        {auction.phase === 'voting' && (
                          <button className="secondary btn-xs full" style={{ fontSize: '9px', padding: '4px' }} onClick={fillAuctionVotes}>
                            <Sparkles size={11} /> Force fill open votes (Demo)
                          </button>
                        )}
                        <button className="secondary btn-danger btn-xs full" style={{ fontSize: '9px', padding: '4px' }} onClick={resetTournament}>
                          <RotateCcw size={11} /> Force reset competition state
                        </button>
                      </div>
                    </details>
                  </div>

                  {/* Bid History */}
                  <div style={{ marginTop: '12px' }}>
                    <h3 style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>History</h3>
                    <div className="history" style={{ maxHeight: '80px', overflowY: 'auto', padding: '6px', background: 'rgba(0,0,0,0.12)', borderRadius: '6px', fontSize: '9px' }}>
                      {auction.history.length > 0 ? (
                        auction.history.slice(0, 5).map((item, index) => (
                          <p key={index} style={{ margin: '2px 0', color: item.type === 'sale' ? 'var(--lime)' : item.type === 'pass' ? '#ff766e' : 'var(--muted)' }}>
                            • {item.text}
                          </p>
                        ))
                      ) : (
                        <p style={{ color: 'var(--muted)', margin: 0 }}>No activity yet</p>
                      )}
                    </div>
                  </div>
                </section>
              );
            })()}
            {[PHASES.TOURNAMENT, PHASES.COMPLETE].includes(phase) && (
              <div style={{ marginTop: '20px' }}>
                <TournamentHub 
                  user={{ role: 'organizer', id: 'organizer' }} 
                  state={{
                    players: state.players.filter((player) => (state.tournamentPlayerIds[tournament.id] || []).includes(player.id)),
                    captainData: state.tournamentCaptainData[tournament.id],
                    auction: state.tournamentAuctions[tournament.id],
                    competition: state.tournamentCompetitions?.[tournament.id] || createCompetition(),
                    captains: tournament.captains || [],
                    teamSize: getTournamentTeamSize(tournament),
                  }} 
                  updateState={(recipe) => updateState((draft) => {
                    const targetTournament = draft.tournaments.find((t) => t.id === tournament.id);
                    const scoped = {
                      players: draft.players.filter((player) => (draft.tournamentPlayerIds[tournament.id] || []).includes(player.id)),
                      captainData: draft.tournamentCaptainData[tournament.id],
                      auction: draft.tournamentAuctions[tournament.id],
                      competition: draft.competition || draft.tournamentCompetitions[tournament.id] || createCompetition(),
                      captains: targetTournament?.captains || [],
                      teamSize: getTournamentTeamSize(targetTournament),
                    };
                    recipe(scoped);
                    draft.tournamentCaptainData[tournament.id] = scoped.captainData;
                    draft.tournamentAuctions[tournament.id] = scoped.auction;
                    draft.tournamentCompetitions[tournament.id] = scoped.competition;
                    draft._sync = { origin: 'local', updatedAt: Date.now() };
                  })}
                  isOrganizer={true}
                />
              </div>
            )}
            <div className="control-stats"><div><span>Registered players</span><strong>{tournamentPlayers.length}</strong></div><div><span>Captain slots</span><strong>{tournament.captainCount}</strong></div><div><span>Auction budget</span><strong>{money(tournament.budget)}</strong></div></div>
            <div className="active-tournament-management">
              <div className="org-tabs">
                <button className={orgTab === 'roster' ? 'active' : ''} onClick={() => setOrgTab('roster')}><UsersRound size={16} /> Registered Players ({tournamentPlayers.length})</button>
                {canManageRoster && (
                  <button className={orgTab === 'csv' ? 'active' : ''} onClick={() => setOrgTab('csv')}><FileSpreadsheet size={16} /> CSV Import</button>
                )}
              </div>
              {orgTab === 'csv' && canManageRoster ? (
                <div className="csv-import-panel">
                  <div className="csv-title"><span className="csv-icon"><FileSpreadsheet size={23} /></span><div><span className="page-kicker">Player registration</span><h3>Import player pool from CSV</h3><p>Upload names, primary positions, and secondary positions.</p></div></div>
                  <div className="csv-actions"><label className="upload-drop"><Upload size={22} /><span><strong>Choose a CSV file</strong><small>Required: name, primary_position, secondary_position</small></span><input type="file" accept=".csv,text/csv" onChange={readCsv} /></label><div className="csv-template-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><button className="secondary" onClick={downloadCsvTemplate}><Download size={16} /> Download Template</button><button className="secondary" onClick={() => { setCsvRows(parseCsv(SAMPLE_CSV)); setImportMessage(''); }}><Sparkles size={16} /> Load sample CSV</button></div></div>
                  {csvRows.length > 0 && <><div className="csv-preview"><div className="csv-preview-head"><strong>Import preview</strong><span>{csvRows.length} rows</span></div><div className="csv-table"><div className="csv-row csv-header"><span>Player Name</span><span>Primary Position</span><span>Secondary Position</span></div>{csvRows.slice(0, 5).map((row, index) => {
                    const primary = normalizePosition(row.primary_position || row.primary || 'CM');
                    const secondary = normalizePosition(row.secondary_position || row.secondary || row.primary_position || row.primary || 'CM');
                    return (
                      <div className="csv-row" key={index}>
                        <span><strong>{row.name || row.full_name}</strong></span>
                        <span>{primary}</span>
                        <span>{secondary}</span>
                      </div>
                    );
                  })}</div></div><button className="primary" onClick={importRoster}><Upload size={17} /> Import {csvRows.length} players</button></>}
                  {importMessage && <div className="import-success"><CheckCircle2 size={17} /> {importMessage}</div>}
                </div>
              ) : (
                <div className="roster-management-panel">
                  <div className="roster-header">
                    <div>
                      <h3>Tournament Roster</h3>
                      <p>{tournamentPlayers.length} players currently registered in this competition.</p>
                    </div>
                    {canManageRoster ? (
                      <button className="secondary" onClick={() => setShowAddPlayer(!showAddPlayer)}>{showAddPlayer ? <X size={15} /> : <UserPlus size={15} />} {showAddPlayer ? 'Cancel' : 'Add Player'}</button>
                    ) : (
                      <span className="roster-status-locked" style={{ fontSize: '12px', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '6px' }}>Roster locked</span>
                    )}
                  </div>
                  {showAddPlayer && canManageRoster && (
                    <div className="manual-player-form">
                      <h4>Add Player Manually</h4>
                      <div className="manual-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                        <label><span>Full Name</span><input value={manualPlayer.name} onChange={(e) => setManualPlayer({...manualPlayer, name: e.target.value})} placeholder="Jane Doe" /></label>
                        <div className="form-row">
                          <label><span>Primary Position</span><select value={manualPlayer.primary} onChange={(e) => setManualPlayer({...manualPlayer, primary: e.target.value})}>{POSITIONS.map((p) => <option key={p}>{p}</option>)}</select></label>
                          <label><span>Secondary Position</span><select value={manualPlayer.secondary} onChange={(e) => setManualPlayer({...manualPlayer, secondary: e.target.value})}>{POSITIONS.map((p) => <option key={p}>{p}</option>)}</select></label>
                        </div>
                      </div>
                      <button className="primary" style={{ marginTop: '12px' }} onClick={addPlayerToTournament}>Add to Roster</button>
                    </div>
                  )}
                  {tournamentPlayers.length > 0 ? (
                    <div className="roster-list">
                      <div className="roster-list-header" style={{ gridTemplateColumns: canManageRoster || canSelectCaptains ? '2fr 1fr 1fr 1.5fr 80px' : '2fr 1fr 1fr 1.5fr' }}>
                        <span>Player Details</span>
                        <span>Positions</span>
                        <span>Style</span>
                        <span>{canSelectCaptains ? 'Captain Team' : 'Assigned Team'}</span>
                        {(canManageRoster || canSelectCaptains) && <span>Action</span>}
                      </div>
                      <div className="roster-list-body">
                        {tournamentPlayers.map((player) => {
                          const isCap = tournament.captains?.some((c) => c.id === player.id);
                          const capInfo = tournament.captains?.find((c) => c.id === player.id);
                          const assignedCap = Object.entries(state.tournamentCaptainData[tournament.id] || {}).find(([, capData]) => capData.squad?.includes(player.id))?.[0];
                          const assignedCapInfo = tournament.captains?.find((c) => c.id === assignedCap);

                          return (
                            <div className="roster-item" key={player.id} style={{ gridTemplateColumns: canManageRoster || canSelectCaptains ? '2fr 1fr 1fr 1.5fr 80px' : '2fr 1fr 1fr 1.5fr' }}>
                              <div className="roster-item-info">
                                <Avatar person={player} size="xs" />
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <strong>{player.tag}</strong>
                                    {isCap && <span className="captain-badge" title="Tournament Captain" style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)', color: '#ffd700', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Trophy size={10} /> CAP</span>}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                    <small>{player.name}</small>
                                    {isProfileComplete(player) ? (
                                      <span style={{ fontSize: '8px', color: '#67e8c2', background: 'rgba(103,232,194,0.08)', padding: '1px 4px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }}>✓ Complete</span>
                                    ) : (
                                      <span style={{ fontSize: '8px', color: '#ffb96e', background: 'rgba(255,185,110,0.08)', padding: '1px 4px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }}>⚠ Incomplete</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className="roster-pos">{player.primary} / {player.secondary}</span>
                              <span className="roster-style">{player.style}</span>
                              {canSelectCaptains ? (
                                isCap ? (
                                  <div className="captain-team-field" style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                      type="text" 
                                      value={capInfo?.team || ''} 
                                      onChange={(e) => updateCaptainTeamName(player.id, e.target.value)}
                                      placeholder="Team name"
                                      style={{ width: '100%', fontSize: '11px', padding: '3px 6px', height: '24px', background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '4px' }}
                                    />
                                  </div>
                                ) : (
                                  <span className="roster-style" style={{ opacity: 0.3 }}>—</span>
                                )
                              ) : (
                                isCap ? (
                                  <span style={{ color: capInfo?.color, fontWeight: 'bold', fontSize: '12px' }}>{getClubInfo(capInfo).name}</span>
                                ) : assignedCapInfo ? (
                                  <span style={{ opacity: 0.8, fontSize: '12px' }}>{getClubInfo(assignedCapInfo).name}</span>
                                ) : (
                                  <span className="roster-style" style={{ opacity: 0.4 }}>Unassigned</span>
                                )
                              )}
                              {(canManageRoster || canSelectCaptains) && (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  {canSelectCaptains && (
                                    <button 
                                      className={`ghost icon-only ${isCap ? 'active btn-warning' : ''}`} 
                                      title={isCap ? 'Demote Captain' : 'Promote to Captain'} 
                                      onClick={() => toggleCaptain(player)}
                                      style={isCap ? { color: '#ffd700' } : {}}
                                    >
                                      <Trophy size={15} />
                                    </button>
                                  )}
                                  {canManageRoster && <button className="ghost btn-danger icon-only" title="Remove from tournament" onClick={() => removePlayerFromTournament(player.id)}><X size={15} /></button>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="empty-roster"><UsersRound size={32} /><p>No players registered yet. Import a CSV roster or add players manually.</p></div>
                  )}
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="tournament-control-panel empty-dashboard">
            <Trophy size={48} />
            <h2>No Competitions Found</h2>
            <p>Click the <strong>+</strong> button on the left panel to create your first competition.</p>
          </section>
        )}
      </div>
    </main>
  );
}


function AppShell({ user, active, setActive, onLogout, onChangeTournament, children, budget, tournament, players, captains: propCaptains, competition }) {
  const resolvedCaptains = propCaptains && propCaptains.length ? propCaptains : captains;
  const captain = resolvedCaptains.find((item) => item.id === user.id);
  const club = getClubInfo(captain);
  const isCaptain = user.role === 'captain';
  const phase = getTournamentPhase(tournament);
  const captainNavByPhase = {
    [PHASES.CAPTAINS]: [['squad', 'Scout', UsersRound], ['club', 'Club settings', Settings]],
    [PHASES.AUCTION]: [['squad', 'Squad', UsersRound], ['auction', 'Auction', Radio], ['club', 'Club settings', Settings]],
    [PHASES.SQUADS]: [['squad', 'Squad', UsersRound], ['tournament', 'Confirm', BadgeCheck], ['club', 'Club settings', Settings]],
    [PHASES.TOURNAMENT]: [['squad', 'Squad', UsersRound], ['tournament', 'Tournament', Swords], ['club', 'Club settings', Settings]],
    [PHASES.COMPLETE]: [['squad', 'Squad', UsersRound], ['tournament', 'Results', Crown], ['club', 'Club settings', Settings]],
  };
  const playerNavByPhase = {
    [PHASES.REGISTRATION]: [['profile', 'Profile', CircleUserRound]],
    [PHASES.CAPTAINS]: [['profile', 'Profile', CircleUserRound], ['pool', 'Player pool', UsersRound]],
    [PHASES.AUCTION]: [['pool', 'Draft room', UsersRound]],
    [PHASES.SQUADS]: [['pool', 'Squads', UsersRound]],
    [PHASES.TOURNAMENT]: [['pool', 'Squads', UsersRound], ['tournament', 'Tournament', Swords]],
    [PHASES.COMPLETE]: [['pool', 'Results', Trophy], ['tournament', 'Results & Standings', Crown]],
  };
  const navItems = isCaptain
    ? (captainNavByPhase[phase] || [['squad', 'Squad', UsersRound], ['club', 'Club settings', Settings]])
    : (playerNavByPhase[phase] || [['profile', 'Profile', CircleUserRound]]);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`app-shell ${roleThemeClass(user.role)}`}>
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-head"><Brand /><button className="icon-button mobile-close" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
        <div className="event-card">
          <span className="event-kicker"><span className="live-dot" /> {phaseLabel(phase)}</span>
          <strong>{tournament.name}</strong>
          <span><Clock3 size={14} /> {tournament.date || 'Date TBD'}</span>
        </div>
        <button className="tournament-switch" onClick={onChangeTournament}><Trophy size={15} /> Change tournament <ArrowRight size={14} /></button>
        <nav>
          <span className="nav-label">Workspace</span>
          {navItems.map(([id, label, Icon]) => (
            <button key={id} className={active === id ? 'active' : ''} onClick={() => { setActive(id); setMobileOpen(false); }}>
              <Icon size={19} /> {label}
              {id === 'auction' && phase === PHASES.AUCTION && <span className="nav-live">Live</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          {isCaptain && <div className="budget-mini"><span>Available budget</span><strong><Coins size={18} /> {money(budget)}</strong></div>}
          <button className="profile-chip" onClick={onLogout}>
            {isCaptain ? <ClubMark club={club} size="sm" /> : <Avatar person={players.find((item) => item.id === user.id) || resolvedCaptains.find((item) => item.id === user.id)} size="sm" />}
            <span><strong>{captain?.handle || players.find((item) => item.id === user.id)?.tag || user.name || 'Captain'}</strong><small>{isCaptain ? club.name : 'Registered player'}</small></span>
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <div className="mobile-top"><button className="icon-button" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><Brand /></div>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <section className="content" key={`${user.role}-${active}-${tournament.id}`}>{children}</section>
    </div>
  );
}

function PhaseNotice({ title, body, actionLabel, onAction }) {
  return (
    <section className="panel phase-notice">
      <Clock3 size={34} />
      <h1>{title}</h1>
      <p>{body}</p>
      {actionLabel && <button className="primary" onClick={onAction}>{actionLabel} <ArrowRight size={17} /></button>}
    </section>
  );
}

function Pitch({ spots, lineup, players, captain, onSlotClick, selectedMemberId, compact = false }) {
  return (
    <div className={`pitch ${compact ? 'pitch-compact' : ''}`}>
      <div className="pitch-center" /><div className="pitch-circle" />
      <div className="penalty penalty-top" /><div className="penalty penalty-bottom" />
      {spots.map((spot) => {
        const memberId = lineup[spot.id];
        const isCaptain = memberId === `captain:${captain?.id}` || memberId === captain?.id;
        const member = isCaptain ? { ...captain, tag: captain?.handle || captain?.tag || '' } : players.find((item) => item.id === memberId);
        return (
          <button
            type="button"
            aria-label={`${spot.id} position: ${member?.tag || 'empty'}`}
            className={`pitch-player ${member ? 'filled' : ''} ${isCaptain ? 'captain-spot' : ''} ${selectedMemberId === memberId ? 'selected' : ''}`}
            key={spot.id}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            onClick={() => onSlotClick?.(spot.id)}
          >
            {member ? <Avatar person={member} size="pitch" /> : <span className="empty-slot">+</span>}
            <small>{member?.tag || spot.label}</small>
          </button>
        );
      })}
    </div>
  );
}

function FormationPicker({ set, current, onChange }) {
  return (
    <div className="formation-options">
      {Object.keys(set).map((name) => (
        <button key={name} className={current === name ? 'active' : ''} onClick={() => onChange(name)}>
          <span className="mini-pitch">
            {set[name].map((spot, index) => <i key={index} style={{ left: `${spot.x}%`, top: `${spot.y}%` }} />)}
          </span>
          <span><strong>{name}</strong><small>{formationStyles[name]}</small></span>
          {current === name && <BadgeCheck size={17} />}
        </button>
      ))}
    </div>
  );
}

function PlayerCard({ player, rank, onRank, sold, soldClub, hideRankButton }) {
  return (
    <article className={`player-card ${rank ? 'shortlisted' : ''} ${sold ? 'sold' : ''}`}>
      <div className="player-card-head">
        <Avatar person={player} />
        <div><strong>{player.tag}</strong><span>{player.name}</span></div>
        <span className="rating">{player.rating}</span>
      </div>
      <div className="position-row"><b>{player.primary}</b><span>{player.secondary}</span><span>{player.style}</span></div>
      <div className="trait-row">{player.traits.map((trait) => <span key={trait}>{trait}</span>)}</div>
      {sold ? (
        <div className="rank-button sold-label"><ClubMark club={soldClub} size="xs" /><span>Drafted to</span><strong>{soldClub?.name || 'Another Team'}</strong></div>
      ) : hideRankButton ? null : (
        <button className={`rank-button ${rank ? 'active' : ''}`} onClick={onRank}>
          {rank ? <><span>#{rank}</span> Priority pick <X size={15} /></> : <><Target size={16} /> Add to shortlist</>}
        </button>
      )}
    </article>
  );
}

function SquadRoom({ user, state, updateState, goAuction }) {
  const captain = state.captains?.find((item) => item.id === user.id);
  const data = state.captainData?.[user.id] || { formation: '4-3-3', shortlist: [], budget: 1000, squad: [], lineup: {} };
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('All');
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const soldIds = Object.values(state.captainData || {}).flatMap((item) => item?.squad || []);
  const availablePlayerCount = state.players.filter((player) => !soldIds.includes(player.id)).length;
  const getPurchaserClub = (playerId) => {
    const captainId = Object.keys(state.captainData || {}).find(
      (capId) => state.captainData[capId]?.squad?.includes(playerId)
    );
    if (!captainId) return null;
    const captainInfo = state.captains?.find((c) => c.id === captainId);
    return captainInfo ? getClubInfo(captainInfo) : null;
  };
  const captainMemberId = `captain:${user.id}`;
  const captainMember = { ...captain, id: captainMemberId, tag: captain?.handle || captain?.tag || 'Captain', primary: 'Captain' };
  const squadPlayers = (data.squad || [])
    .filter((playerId) => playerId !== user.id)
    .map((playerId) => state.players.find((player) => player.id === playerId))
    .filter(Boolean);
  const teamMembers = [captainMember, ...squadPlayers];
  const teamSize = state.teamSize || 11;
  const formationSet = getFormationSet(teamSize);
  const formationNames = Object.keys(formationSet);
  const activeFormation = formationSet[data.formation] ? data.formation : formationNames[0];
  const spots = formationSet[activeFormation];
  const activeSpots = spots;
  const isCaptainMember = (memberId) => memberId === captainMemberId || memberId === user.id;
  const filtered = state.players.filter((player) => {
    const text = `${player.name} ${player.tag} ${player.primary} ${player.secondary}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (position === 'All' || player.primary === position || player.secondary === position);
  });

  const setFormation = (formation) => updateState((draft) => {
    const set = getFormationSet(draft.teamSize || teamSize);
    if (!set[formation]) return;
    const activeSpotIds = new Set(set[formation].map((spot) => spot.id));
    if (!draft.captainData[user.id]) {
      draft.captainData[user.id] = { formation, shortlist: [], budget: 1000, squad: [], lineup: { GK: captainMemberId }, squadConfirmed: false };
    }
    const currentLineup = draft.captainData[user.id].lineup || {};
    draft.captainData[user.id].formation = formation;
    const nextLineup = Object.fromEntries(Object.entries(currentLineup).filter(([spotId]) => activeSpotIds.has(spotId)));
    // Keep the captain on the pitch when switching shapes drops their old slot.
    if (!Object.values(nextLineup).some(isCaptainMember) && activeSpotIds.has('GK')) nextLineup.GK = captainMemberId;
    draft.captainData[user.id].lineup = nextLineup;
  });
  const assignToSlot = (spotId) => {
    const occupant = data.lineup?.[spotId];
    if (!selectedMemberId) {
      if (occupant) setSelectedMemberId(occupant);
      return;
    }
    updateState((draft) => {
      if (!draft.captainData[user.id]) {
        draft.captainData[user.id] = { formation: activeFormation, shortlist: [], budget: 1000, squad: [], lineup: {}, squadConfirmed: false };
      }
      const lineup = draft.captainData[user.id].lineup || {};
      const placingCaptain = isCaptainMember(selectedMemberId);
      Object.keys(lineup).forEach((key) => { if (lineup[key] === selectedMemberId || (placingCaptain && isCaptainMember(lineup[key]))) delete lineup[key]; });
      lineup[spotId] = placingCaptain ? captainMemberId : selectedMemberId;
      draft.captainData[user.id].lineup = lineup;
    });
    setSelectedMemberId(null);
  };
  const autoPlace = () => updateState((draft) => {
      if (!draft.captainData[user.id]) {
        draft.captainData[user.id] = { formation: activeFormation, shortlist: [], budget: 1000, squad: [], lineup: {}, squadConfirmed: false };
      }
    const size = draft.teamSize || teamSize;
    const set = getFormationSet(size);
    const formName = set[draft.captainData[user.id].formation] ? draft.captainData[user.id].formation : Object.keys(set)[0];
    draft.captainData[user.id].formation = formName;
    const lineup = { GK: captainMemberId };
    const availableSpots = set[formName].filter((spot) => spot.id !== 'GK');
    const broadGroup = (position) => position === 'GK' ? 'GK' : /B|DM/.test(position) ? 'DEF' : /M/.test(position) ? 'MID' : 'ATT';
    (draft.captainData[user.id].squad || []).slice(0, Math.max(0, size - 1)).forEach((playerId) => {
      const player = draft.players.find((item) => item.id === playerId);
      if (!player || !availableSpots.length) return;
      availableSpots.sort((a, b) => {
        const score = (spot) => (spot.label === player.primary ? 10 : broadGroup(spot.label) === broadGroup(player.primary) ? 5 : 0);
        return score(b) - score(a);
      });
      const bestSpot = availableSpots.shift();
      lineup[bestSpot.id] = playerId;
    });
    draft.captainData[user.id].lineup = lineup;
  });
  const toggleShortlist = (playerId) => updateState((draft) => {
      if (!draft.captainData[user.id]) {
      draft.captainData[user.id] = { formation: activeFormation, shortlist: [], budget: 1000, squad: [], lineup: {}, squadConfirmed: false };
    }
    if (!draft.captainData[user.id].shortlist) draft.captainData[user.id].shortlist = [];
    const list = draft.captainData[user.id].shortlist;
    const existing = list.indexOf(playerId);
    if (existing >= 0) list.splice(existing, 1);
    else if (list.length < 3) list.push(playerId);
    else { list.shift(); list.push(playerId); }
  });
  const totalAvailable = 1 + (data.squad || []).length;
  const pitchFull = totalAvailable >= teamSize && Object.keys(data.lineup || {}).length >= teamSize;
  const squadConfirmed = data.squadConfirmed || false;
  const confirmSquad = () => updateState((draft) => {
    if (!draft.captainData[user.id]) return;
    draft.captainData[user.id].squadConfirmed = true;
  });

  return (
    <>
      <header className="page-header">
        <div><span className="page-kicker">Captain workspace</span><h1>Build {getClubInfo(captain).name}</h1><p>Set the shape, scout the pool, then bring your shortlist to the auction.</p></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {pitchFull && !squadConfirmed && (
            <button className="primary confirm-squad-btn" onClick={confirmSquad}><BadgeCheck size={18} /> Confirm squad</button>
          )}
          {squadConfirmed && <span className="status-pill good"><BadgeCheck size={14} /> Squad confirmed</span>}
          <button className="secondary" onClick={goAuction}><Radio size={18} /> Auction</button>
        </div>
      </header>
      <div className="dashboard-grid">
        <section className="panel formation-panel">
          <div className="panel-head"><div><span className="section-step">01</span><h2>Choose your shape</h2></div><span className="status-pill good"><BadgeCheck size={14} /> Saved</span></div>
          <div className="formation-layout">
            <Pitch spots={spots} lineup={data.lineup || {}} players={state.players} captain={captain} onSlotClick={assignToSlot} selectedMemberId={selectedMemberId} />
            <div className="formation-controls">
              <p className="helper-text">Build your starting {teamSize} including the goalkeeper. Select a team member, then tap a position on the pitch.</p>
              <FormationPicker set={formationSet} current={activeFormation} onChange={setFormation} />
              <div className="assignment-box">
                <div className="assignment-head"><div><strong>Assign players</strong><small>{Object.keys(data.lineup || {}).length}/{teamSize} placed</small></div><button onClick={autoPlace} disabled={!data.squad.length}><Sparkles size={13} /> Auto-place</button></div>
                <div className="member-list">
                  {teamMembers.map((member) => {
                    const assignedSpotId = Object.entries(data.lineup || {}).find(([, memberId]) => memberId === member.id || (member.id === captainMemberId && isCaptainMember(memberId)))?.[0];
                    const spot = activeSpots.find((item) => item.id === assignedSpotId);
                    return (
                      <button key={member.id} className={`${selectedMemberId === member.id ? 'selected' : ''} ${spot ? 'assigned' : ''}`} onClick={() => setSelectedMemberId(selectedMemberId === member.id ? null : member.id)}>
                        <Avatar person={member} size="xs" /><span><strong>{member.tag}</strong><small>{spot ? `${spot.label} · On pitch` : 'Bench · Select to place'}</small></span>{selectedMemberId === member.id && <Target size={15} />}
                      </button>
                    );
                  })}
                </div>
                {!data.squad.length && <p className="assignment-empty">Auction wins will appear here beside your captain.</p>}
              </div>
            </div>
          </div>
        </section>
        <aside className="panel shortlist-panel">
          <div className="panel-head"><div><span className="section-step">02</span><h2>Priority board</h2></div><span className="count-pill">{data.shortlist.length}/3</span></div>
          <p className="helper-text">Rank three players. Your #1 becomes your vote in the nomination round.</p>
          <div className="priority-list">
            {[0, 1, 2].map((index) => {
              const player = state.players.find((item) => item.id === data.shortlist[index]);
              return player ? (
                <div className="priority-item" key={player.id}><span>{index + 1}</span><Avatar person={player} size="xs" /><div><strong>{player.tag}</strong><small>{player.primary} · {player.style}</small></div></div>
              ) : <div className="priority-empty" key={index}><span>{index + 1}</span> Pick a player below</div>;
            })}
          </div>
          <button className="secondary full" onClick={goAuction} disabled={!data.shortlist.length}><Vote size={17} /> Take shortlist to vote</button>
        </aside>
      </div>
      <section className="pool-section">
        <div className="pool-title"><div><span className="section-step">03</span><h2>Scout the player pool</h2><p>{availablePlayerCount} available · sorted by player rating</p></div></div>
        <div className="filter-row">
          <label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search players or positions" /></label>
          <div className="filter-pills">{['All', 'ST', 'CAM', 'CM', 'CDM', 'CB', 'GK'].map((item) => <button key={item} className={position === item ? 'active' : ''} onClick={() => setPosition(item)}>{item}</button>)}</div>
        </div>
        <div className="player-grid">
          {filtered.map((player) => <PlayerCard key={player.id} player={player} sold={soldIds.includes(player.id)} soldClub={getPurchaserClub(player.id)} rank={data.shortlist.indexOf(player.id) + 1 || 0} onRank={() => toggleShortlist(player.id)} />)}
        </div>
      </section>
    </>
  );
}

function VotingRoom({ user, state, updateState, onReset }) {
  const auction = state.auction;
  const currentData = state.captainData[user.id];
  const soldIds = new Set(Object.values(state.captainData).flatMap((data) => data.squad || []));
  const candidates = Array.from(new Set(
    Object.values(state.captainData).map((data) => data.shortlist.find((id) => !soldIds.has(id))).filter(Boolean)
  ));
  const castVote = (playerId) => updateState((draft) => { draft.auction.votes[user.id] = playerId; });

  const simulateVotes = () => updateState((draft) => {
    const draftSoldIds = new Set(Object.values(draft.captainData).flatMap((data) => data.squad || []));
    const unsoldPlayers = draft.players.filter((p) => !draftSoldIds.has(p.id));
    const activeCandidates = Array.from(new Set(
      Object.values(draft.captainData).map((data) => data.shortlist.find((id) => !draftSoldIds.has(id))).filter(Boolean)
    ));
    draft.captains.forEach((captain, index) => {
      if (draft.auction.votes[captain.id]) return;
      const topPick = draft.captainData[captain.id]?.shortlist.find((id) => !draftSoldIds.has(id));
      const fallback = activeCandidates[index % Math.max(activeCandidates.length, 1)]
        || unsoldPlayers[index % Math.max(unsoldPlayers.length, 1)]?.id;
      if (topPick || fallback) draft.auction.votes[captain.id] = topPick || fallback;
    });
  });

  const resolveVote = () => updateState((draft) => {
    const counts = Object.values(draft.auction.votes).reduce((map, id) => ({ ...map, [id]: (map[id] || 0) + 1 }), {});
    const top = Math.max(...Object.values(counts), 0);
    const tied = Object.keys(counts).filter((id) => counts[id] === top);
    const winner = tied[Math.floor(Math.random() * tied.length)];
    if (!winner) return;
    draft.auction.phase = 'bidding';
    draft.auction.playerId = winner;
    draft.auction.bid = 50;
    draft.auction.leaderId = null;
    draft.auction.history.unshift({ type: 'nomination', text: `${draft.players.find((p) => p.id === winner)?.tag} nominated at 50 coins` });
  });
  const votesIn = Object.keys(auction.votes).length;

  return (
    <div className="voting-room">
      <div className="room-banner"><span><Vote size={18} /> Nomination round</span><div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><strong>{votesIn} of {state.captains.length} votes locked</strong>{onReset && <button className="ghost btn-danger btn-xs" onClick={onReset}><RotateCcw size={13} /> Reset auction</button>}</div></div>
      <div className="vote-heading"><span className="page-kicker">Auction room · Round 01</span><h1>Who hits the block first?</h1><p>Every captain gets one vote. Majority wins; tied nominations are decided at random.</p></div>
      <div className="vote-grid">
        {state.players.filter((player) => !soldIds.has(player.id) && (candidates.includes(player.id) || currentData.shortlist.includes(player.id))).map((player) => {
          const voteCount = Object.values(auction.votes).filter((id) => id === player.id).length;
          const selected = auction.votes[user.id] === player.id;
          return (
            <button className={`vote-card ${selected ? 'selected' : ''}`} key={player.id} onClick={() => castVote(player.id)}>
              <span className="vote-check">{selected ? <BadgeCheck size={21} /> : <span />}</span>
              <Avatar person={player} size="lg" /><strong>{player.tag}</strong><small>{player.primary} · {player.style}</small>
              <span className="vote-count"><UsersRound size={15} /> {voteCount} {voteCount === 1 ? 'vote' : 'votes'}</span>
            </button>
          );
        })}
      </div>
      {!candidates.length && <div className="empty-state"><Target size={28} /><h3>No captain shortlist yet</h3><p>Add a priority pick in the Squad room, then return here.</p></div>}
      <div className="captain-votes">
        {state.captains.map((captain) => {
          const pick = state.players.find((player) => player.id === auction.votes[captain.id]);
          return <div key={captain.id}><Avatar person={captain} size="xs" /><span><strong>{captain.handle || captain.tag}</strong><small>{pick ? `Voted · ${pick.tag}` : 'Choosing…'}</small></span>{pick && <BadgeCheck size={16} />}</div>;
        })}
      </div>
      <div className="room-actions">
        <button className="ghost" onClick={simulateVotes}><Sparkles size={17} /> Fill remaining demo votes</button>
        <button className="primary" disabled={votesIn < state.captains.length} onClick={resolveVote}>Reveal nomination <ArrowRight size={18} /></button>
      </div>
    </div>
  );
}

function BiddingRoom({ user, state, updateState, onReset }) {
  const auction = state.auction;
  const player = state.players.find((item) => item.id === auction.playerId);
  const leader = state.captains.find((item) => item.id === auction.leaderId);
  const nextBid = getNextBidPrice(auction.bid, auction.leaderId);
  const teamSize = state.teamSize || 11;
  const squadSize = (captainId, data) => 1 + new Set((data.squad || []).filter((playerId) => playerId !== captainId)).size;
  const squadFull = squadSize(user.id, state.captainData[user.id]) >= teamSize;
  const maxAllowedBid = getMaxAllowedBid(state.captainData[user.id].budget, squadSize(user.id, state.captainData[user.id]), teamSize);
  const reservedCoins = Math.max(0, state.captainData[user.id].budget - maxAllowedBid);
  const canAfford = nextBid <= maxAllowedBid && !squadFull;

  const bid = () => updateState((draft) => {
    const price = getNextBidPrice(draft.auction.bid, draft.auction.leaderId);
    if (draft.captainData[user.id].budget < price) return;
    const maxAllowed = getMaxAllowedBid(draft.captainData[user.id].budget, squadSize(user.id, draft.captainData[user.id]), teamSize);
    if (price > maxAllowed) return; // double check budget constraint
    draft.auction.bid = price;
    draft.auction.leaderId = user.id;
    draft.auction.history.unshift({ type: 'bid', text: `${state.captains.find((c) => c.id === user.id)?.handle || state.captains.find((c) => c.id === user.id)?.tag || ''} bid ${price}` });
  });
  const rivalBid = () => updateState((draft) => {
    const rivalPrice = getNextBidPrice(draft.auction.bid, draft.auction.leaderId);
    const rivals = state.captains.filter((captain) => {
      const capData = draft.captainData[captain.id] || { budget: 0, squad: [] };
      const maxAllowed = getMaxAllowedBid(capData.budget, squadSize(captain.id, capData), teamSize);
      return (
        captain.id !== user.id
        && rivalPrice <= maxAllowed
        && squadSize(captain.id, capData) < teamSize
      );
    });
    if (!rivals.length) return;
    const rival = rivals[Math.floor(Math.random() * rivals.length)];
    draft.auction.bid = rivalPrice;
    draft.auction.leaderId = rival.id;
    draft.auction.history.unshift({ type: 'bid', text: `${rival.handle || rival.tag || ''} bid ${draft.auction.bid}` });
  });
  const sell = () => updateState((draft) => {
    if (!draft.auction.leaderId) return;
    const winner = draft.auction.leaderId;
    if (squadSize(winner, draft.captainData[winner]) >= teamSize) return;
    const wonPlayer = draft.players.find((item) => item.id === draft.auction.playerId);
    draft.captainData[winner].budget -= draft.auction.bid;
    draft.captainData[winner].squad.push(draft.auction.playerId);
    Object.values(draft.captainData).forEach((data) => { data.shortlist = data.shortlist.filter((id) => id !== draft.auction.playerId); });
    const saleEntry = { type: 'sale', text: `${wonPlayer?.tag} signed by ${getClubInfo(draft.captains.find((c) => c.id === winner)).name}` };
    const soldIds = new Set(Object.values(draft.captainData).flatMap((d) => d.squad || []));
    const unsoldPlayers = draft.players.filter((p) => !soldIds.has(p.id));
    const openTeams = draft.captains.filter((cap) => squadSize(cap.id, draft.captainData[cap.id]) < teamSize);
    if (openTeams.length === 0 || unsoldPlayers.length === 0) {
      draft.auction = { phase: 'complete', votes: {}, playerId: null, bid: 0, leaderId: null, history: [{ type: 'complete', text: 'Auction complete · All squads set' }, saleEntry, ...draft.auction.history] };
    } else if (unsoldPlayers.length === 1 && openTeams.length === 1) {
      const lastPlayer = unsoldPlayers[0];
      const onlyTeam = openTeams[0];
      draft.captainData[onlyTeam.id].squad.push(lastPlayer.id);
      Object.values(draft.captainData).forEach((data) => { data.shortlist = data.shortlist.filter((id) => id !== lastPlayer.id); });
      const autoEntry = { type: 'auto', text: `${lastPlayer.tag} auto-allocated to ${getClubInfo(draft.captains.find((c) => c.id === onlyTeam.id)).name}` };
      draft.auction = { phase: 'complete', votes: {}, playerId: null, bid: 0, leaderId: null, history: [{ type: 'complete', text: 'Auction complete · All squads set' }, autoEntry, saleEntry, ...draft.auction.history] };
    } else {
      draft.auction = { phase: 'voting', votes: {}, playerId: null, bid: 0, leaderId: null, history: [saleEntry, ...draft.auction.history] };
    }
  });
  const passLot = () => updateState((draft) => {
    const passed = draft.players.find((item) => item.id === draft.auction.playerId);
    draft.auction = { phase: 'voting', votes: {}, playerId: null, bid: 0, leaderId: null, history: [{ type: 'pass', text: `${passed?.tag || 'Player'} passed · no sale, back in the pool` }, ...draft.auction.history] };
  });

  return (
    <div className="auction-stage">
      <div className="auction-topline"><span><span className="live-dot" /> Live auction</span><strong>Lot 01</strong><div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><span>Minimum raise · {auction.bid >= 200 ? '100' : '25'}</span>{onReset && <button className="ghost btn-danger btn-xs" onClick={onReset}><RotateCcw size={13} /> Reset auction</button>}</div></div>
      <div className="auction-layout">
        <section className="lot-card">
          <div className="lot-stripe" />
          <span className="lot-label">Now on the block</span>
          <Avatar person={player} size="xl" />
          <h1>{player.tag}</h1><p>{player.name}</p>
          <div className="lot-stats"><span><b>{player.rating}</b> OVR</span><span><b>{player.primary}</b> Position</span><span><b>{player.style}</b> Style</span></div>
          <div className="lot-traits">{player.traits.map((trait) => <span key={trait}><Zap size={13} /> {trait}</span>)}</div>
        </section>
        <section className="bid-console">
          <span className="page-kicker">Current bid</span>
          <div className="big-bid"><Coins size={33} /> {auction.bid}</div>
          <div className={`leading-bid ${leader ? 'has-leader' : ''}`}>
            {leader ? <><ClubMark club={getClubInfo(leader)} size="xs" /><span><small>Leading bid</small><strong>{getClubInfo(leader).name}</strong></span></> : <><Clock3 size={19} /><span><small>Opening price</small><strong>Waiting for first bid</strong></span></>}
          </div>
          <button className="bid-button" onClick={bid} disabled={!canAfford || auction.leaderId === user.id}>
            <span>Place bid</span><strong><Coins size={22} /> {nextBid}</strong>
          </button>
          <p className="bid-helper">
            You have <b>{money(state.captainData[user.id].budget)}</b> coins available.
            {squadFull ? (
              <>
                <br />
                <b>Your squad is full.</b>
              </>
            ) : (
              <>
                <br />
                Max allowed bid: <b>{maxAllowedBid}</b> coins (reserving <b>{reservedCoins}</b> for the other {teamSize - squadSize(user.id, state.captainData[user.id]) - 1} players).
              </>
            )}
          </p>
          <div className="demo-controls"><span>Host controls moved to organizer dashboard</span></div>
        </section>
        <aside className="standings-card">
          <h2>Captain budgets</h2>
          {state.captains.map((captain) => {
            const data = state.captainData[captain.id] || { squad: [], budget: 0 };
            const club = getClubInfo(captain);
            const filled = squadSize(captain.id, data);
            const isFull = filled >= teamSize;
            return (
              <div className={auction.leaderId === captain.id ? 'leading' : ''} key={captain.id}>
                <ClubMark club={club} size="xs" />
                <span>
                  <strong>{club.name}</strong>
                  {isFull
                    ? <small className="squad-dots-complete">COMPLETE</small>
                    : <span className="squad-dots">{Array.from({ length: teamSize }, (_, i) => <span key={i} className={i < filled ? 'squad-dot filled' : 'squad-dot'} />)}</span>
                  }
                </span>
                <b>{money(data.budget)}</b>
              </div>
            );
          })}
          <div className="history"><h3>Room activity</h3>{auction.history.slice(0, 4).map((item, index) => <p key={index}><span />{item.text}</p>)}</div>
        </aside>
      </div>
    </div>
  );
}

function AuctionCompleteScreen({ state, goTournament }) {
  return (
    <div className="auction-complete-screen">
      <div className="auction-complete-hero">
        <Crown size={52} />
        <h1>Auction complete.</h1>
        <p>All squads have been set. Head to the tournament hub to lock in your lineup and kick off the competition.</p>
        <button className="primary" onClick={goTournament}><Swords size={18} /> Go to tournament</button>
      </div>
      <div className="complete-squads-grid">
        {state.captains.map((captain) => {
          const club = getClubInfo(captain);
          const data = state.captainData[captain.id] || { squad: [], budget: 0 };
          const squadPlayers = (data.squad || []).map((id) => state.players.find((p) => p.id === id)).filter(Boolean);
          const captainPlayer = state.players.find((p) => 
            p.id === captain.id ||
            p.name.toLowerCase() === captain.name.toLowerCase() || 
            (p.tag && p.tag.toLowerCase() === (captain.handle || '').toLowerCase())
          );
          const captainTag = captain.handle || captain.tag || captain.name;
          const captainPosition = captainPlayer ? captainPlayer.primary : 'Captain';
          const captainAvatarPerson = captainPlayer || captain;
          return (
            <div className="complete-squad-card" key={captain.id}>
              <div className="complete-squad-head">
                <ClubMark club={club} size="md" />
                <span><strong>{club.name}</strong><small>{money(data.budget)} coins remaining</small></span>
              </div>
              <div className="complete-squad-list">
                <div key={captain.id}>
                  <Avatar person={captainAvatarPerson} size="sm" />
                  <span>
                    <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {captainTag}
                      <Crown size={12} className="captain-crown" style={{ color: '#ffd700', fill: '#ffd700' }} />
                    </strong>
                    <small>{captainPosition}</small>
                  </span>
                </div>
                {squadPlayers.map((p) => (
                  <div key={p.id}><Avatar person={p} size="sm" /><span><strong>{p.tag}</strong><small>{p.primary}</small></span></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AuctionRoom({ startingBudget, goTournament, ...props }) {
  const resetAuction = () => {
    if (!window.confirm('Reset the entire auction? This will clear all bids, sales, squads, and auction history.')) return;

    props.updateState((draft) => {
      draft.auction = createAuction();
      const eligibleIds = new Set(draft.players.map((player) => player.id));

      draft.captains.forEach((captain) => {
        const data = draft.captainData[captain.id];
        if (!data) return;

        data.budget = Number(startingBudget || 1000);
        data.squad = [];
        data.shortlist = (data.shortlist || []).filter((playerId) => eligibleIds.has(playerId));
        data.lineup = Object.fromEntries(Object.entries(data.lineup || {}).filter(([, memberId]) => (
          memberId === captain.id || memberId === `captain:${captain.id}`
        )));
      });
    });
  };

  return (
    <>
      {props.state.auction.phase === 'complete'
        ? <AuctionCompleteScreen state={props.state} goTournament={goTournament} />
        : props.state.auction.phase === 'voting'
          ? <VotingRoom {...props} onReset={resetAuction} />
          : <BiddingRoom {...props} onReset={resetAuction} />}
    </>
  );
}

function TournamentHub({ user, state, updateState, isOrganizer = false }) {
  const competition = state.competition || createCompetition();
  const standings = calculateStandings(state.captains, competition.matches || []);
  const nextMatch = user.role === 'captain'
    ? (competition.matches || []).find((match) => match.status !== 'completed' && (match.homeId === user.id || match.awayId === user.id))
    : (competition.matches || []).find((match) => match.status !== 'completed');
  const hasPendingMatches = (competition.matches || []).some((match) => match.status !== 'completed');
  const opponentId = (nextMatch && user.role === 'captain') ? (nextMatch.homeId === user.id ? nextMatch.awayId : nextMatch.homeId) : null;
  const opponentCaptain = opponentId ? state.captains.find(c => c.id === opponentId) : null;
  const opponentClub = opponentCaptain ? getClubInfo(opponentCaptain) : null;
  const isHome = nextMatch ? nextMatch.homeId === user.id : false;

  const [matchDate, setMatchDate] = useState(nextMatch?.scheduledAt || suggestKickoffDate());

  useEffect(() => { setMatchDate(nextMatch?.scheduledAt || suggestKickoffDate()); }, [nextMatch?.id, nextMatch?.scheduledAt]);

  const [showScoreEntry, setShowScoreEntry] = useState(false);
  const [homeScoreInput, setHomeScoreInput] = useState('');
  const [awayScoreInput, setAwayScoreInput] = useState('');
  const [homeScorersInput, setHomeScorersInput] = useState([]);
  const [awayScorersInput, setAwayScorersInput] = useState([]);

  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editMatchDate, setEditMatchDate] = useState('');
  const [editHomeScore, setEditHomeScore] = useState('');
  const [editAwayScore, setEditAwayScore] = useState('');
  const [editHomeScorers, setEditHomeScorers] = useState([]);
  const [editAwayScorers, setEditAwayScorers] = useState([]);

  const getTeamRoster = (teamId) => {
    const captain = state.captains.find((c) => c.id === teamId);
    const squadIds = state.captainData[teamId]?.squad || [];
    const squadPlayers = squadIds.map((id) => state.players.find((p) => p.id === id)).filter(Boolean);
    const list = [];
    if (captain) {
      list.push({ id: `captain:${captain.id}`, tag: captain.handle || captain.tag || 'Captain' });
    }
    squadPlayers.forEach((p) => {
      list.push({ id: p.id, tag: p.tag });
    });
    return list;
  };

  const saveMatchResult = (matchId, hScore, aScore, hScorers, aScorers) => {
    updateState((draft) => {
      const draftCompetition = draft.competition;
      const match = draftCompetition.matches.find((item) => item.id === matchId);
      if (!match) return;
      
      const homeScore = parseInt(hScore, 10) || 0;
      const awayScore = parseInt(aScore, 10) || 0;
      
      match.homeScore = homeScore;
      match.awayScore = awayScore;
      match.status = 'completed';
      if (!match.scheduledAt) {
        match.scheduledAt = new Date().toISOString().slice(0, 16);
      }
      
      // Remove existing stats for this match if any (e.g. if re-editing)
      draftCompetition.playerStats = (draftCompetition.playerStats || []).filter(
        (stat) => stat.matchId !== matchId
      );
      
      // Add scorers
      const addGoals = (teamId, scorersList) => {
        const counts = {};
        scorersList.forEach((id) => {
          if (id) counts[id] = (counts[id] || 0) + 1;
        });
        Object.entries(counts).forEach(([playerId, goals]) => {
          let name = 'Player';
          if (playerId.startsWith('captain:')) {
            const capId = playerId.replace('captain:', '');
            const cap = draft.captains.find((c) => c.id === capId);
            name = cap?.handle || cap?.tag || 'Captain';
          } else {
            const p = draft.players.find((item) => item.id === playerId);
            name = p?.tag || p?.name || 'Player';
          }
          draftCompetition.playerStats.push({
            matchId,
            teamId,
            playerId,
            name,
            goals
          });
        });
      };
      
      addGoals(match.homeId, hScorers);
      addGoals(match.awayId, aScorers);
      
      // Progress competition phase
      const leagueMatches = draftCompetition.matches.filter((item) => item.stage === 'league');
      if (leagueMatches.length && leagueMatches.every((item) => item.status === 'completed') && !draftCompetition.matches.some((item) => item.stage === 'finals')) {
        const finalStandings = calculateStandings(draft.captains, draftCompetition.matches);
        draftCompetition.matches.push(...createFinalFixtures(finalStandings));
        draftCompetition.phase = 'finals';
      } else if (match.id === 'championship-final') {
        draftCompetition.phase = 'complete';
      }
    });
  };

  const clubFor = (teamId) => getClubInfo(state.captains.find((captain) => captain.id === teamId));
  const startCompetition = (draftCompetition) => {
    draftCompetition.phase = 'league';
    draftCompetition.matches = createLeagueFixtures(state.captains.map((captain) => captain.id));
    draftCompetition.playerStats = [];
  };
  const setReady = (everyone = false) => updateState((draft) => {
    if (!draft.competition) draft.competition = createCompetition();
    if (everyone) {
      draft.captains.forEach((captain) => {
        if (draft.captainData[captain.id]) draft.captainData[captain.id].squadConfirmed = true;
      });
    } else {
      if (draft.captainData[user.id]) draft.captainData[user.id].squadConfirmed = true;
    }
  });
  const resetFixtures = () => {
    if (!window.confirm('Reset official fixtures to opening day? This clears match dates, results, standings, and scorer stats.')) return;
    updateState((draft) => {
      if (!draft.competition) draft.competition = createCompetition();
      draft.competition.phase = 'league';
      draft.competition.readyCaptainIds = draft.captains.map((captain) => captain.id);
      draft.competition.matches = createLeagueFixtures(draft.captains.map((captain) => captain.id));
      draft.competition.playerStats = [];
    });
    setShowScoreEntry(false);
    setEditingMatchId(null);
  };
  const scheduleMatch = () => {
    if (!nextMatch || !matchDate) return;
    updateState((draft) => {
      const match = draft.competition.matches.find((item) => item.id === nextMatch.id);
      match.scheduledAt = matchDate;
      match.status = 'scheduled';
    });
  };
  const simulateMatchmakerResult = () => updateState((draft) => {
    const draftCompetition = draft.competition;
    const match = draftCompetition.matches.find((item) => item.id === nextMatch?.id);
    if (!match) return;
    const completedCount = draftCompetition.matches.filter((item) => item.status === 'completed').length;
    const scorePatterns = [[2, 1], [1, 1], [3, 0], [1, 2], [2, 2], [0, 1], [2, 0], [1, 3]];
    const [homeScore, awayScore] = scorePatterns[completedCount % scorePatterns.length];
    match.homeScore = homeScore; match.awayScore = awayScore; match.status = 'completed';
    if (!match.scheduledAt) match.scheduledAt = new Date().toISOString().slice(0, 16);
    const scorerFor = (teamId) => {
      const playerId = (draft.captainData[teamId]?.squad || []).find((id) => id !== teamId);
      const player = draft.players.find((item) => item.id === playerId);
      const captain = draft.captains.find((item) => item.id === teamId);
      return { playerId: player?.id || captain?.id, name: player?.tag || captain?.handle || 'Captain' };
    };
    [[match.homeId, homeScore], [match.awayId, awayScore]].forEach(([teamId, goals]) => {
      if (!goals) return;
      const scorer = scorerFor(teamId);
      draftCompetition.playerStats.push({ matchId: match.id, teamId, ...scorer, goals });
    });
    const leagueMatches = draftCompetition.matches.filter((item) => item.stage === 'league');
    if (leagueMatches.length && leagueMatches.every((item) => item.status === 'completed') && !draftCompetition.matches.some((item) => item.stage === 'finals')) {
      const finalStandings = calculateStandings(draft.captains, draftCompetition.matches);
      draftCompetition.matches.push(...createFinalFixtures(finalStandings));
      draftCompetition.phase = 'finals';
    } else if (match.id === 'championship-final') draftCompetition.phase = 'complete';
  });

  const topScorerFor = (teamId) => {
    const totals = (competition.playerStats || []).filter((stat) => stat.teamId === teamId).reduce((map, stat) => ({ ...map, [stat.name]: (map[stat.name] || 0) + stat.goals }), {});
    const leader = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    return leader ? `${leader[0]} · ${leader[1]} goals` : 'Waiting for Matchmaker';
  };
  const completedMatches = (competition.matches || []).filter((match) => match.status === 'completed');
  const totalGoals = completedMatches.reduce((total, match) => total + match.homeScore + match.awayScore, 0);
  const tightestDefense = standings.filter((row) => row.played).sort((a, b) => a.ga - b.ga)[0];

  if (competition.phase === 'ready') {
    const readyIds = new Set(state.captains.filter((c) => state.captainData[c.id]?.squadConfirmed).map((c) => c.id));
    const allReady = state.captains.every((captain) => state.captainData[captain.id]?.squadConfirmed);
    return (
      <>
        <header className="page-header"><div><span className="page-kicker">Auction complete</span><h1>Lock in your club.</h1><p>All captains must confirm their squad before Matchmaker releases the official tournament path.</p></div><span className="status-pill good"><BadgeCheck size={14} /> Squads locked</span></header>
        <section className="panel ready-room">
          <div className="ready-room-head"><div><span className="section-step">01</span><h2>Captain ready check</h2><p>{readyIds.size} of {state.captains.length} squads confirmed</p></div></div>
          <div className="ready-club-grid">
            {state.captains.map((captain) => {
              const club = getClubInfo(captain);
              const ready = readyIds.has(captain.id);
              return (
                <div className={ready ? 'ready' : ''} key={captain.id}>
                  <div style={{ flex: '0 0 auto', width: '43px', height: '43px' }}><ClubMark club={club} size="md" /></div>
                  <span><strong>{club.name}</strong><small>{ready ? 'Squad confirmed' : 'Waiting on captain'}</small></span>
                  {ready ? <CheckCircle2 size={20} /> : <Clock3 size={20} />}
                </div>
              );
            })}
          </div>
          <div className="ready-actions">
            {allReady ? (
              <span className="status-pill good"><BadgeCheck size={14} /> Waiting for organizer</span>
            ) : (
              <button className="primary" disabled={readyIds.has(user.id)} onClick={() => setReady(false)}>
                <BadgeCheck size={17} /> {readyIds.has(user.id) ? 'Squad confirmed' : 'I am ready'}
              </button>
            )}
            <p>Scrims are always open and never affect official standings.</p>
          </div>
        </section>
        <section className="format-explainer"><div><strong>01</strong><span><b>Round robin</b><small>Every club faces all three rivals once.</small></span></div><ArrowRight size={18} /><div><strong>02</strong><span><b>Shield match</b><small>3rd and 4th settle placement.</small></span></div><ArrowRight size={18} /><div><strong>03</strong><span><b>Championship Final</b><small>Top two play for the title.</small></span></div></section>
      </>
    );
  }

  return (
    <>
      <header className="page-header tournament-hub-header"><div><span className="page-kicker">Matchmaker · {competition.phase === 'finals' ? 'Finals' : competition.phase === 'complete' ? 'Complete' : 'League stage'}</span><h1>The road to the trophy.</h1><p>Official fixtures count toward standings. Clubs may arrange unlimited scrims between them.</p></div><div className="tournament-header-actions"><span className="status-pill good"><Radio size={14} /> Matchmaker connected</span>{isOrganizer && <button className="ghost btn-danger" onClick={resetFixtures}><RotateCcw size={16} /> Reset fixtures · Test</button>}</div></header>
      {(isOrganizer || user.role === 'player') && (
        <div className="tournament-metric-grid"><div><span>Official matches</span><strong>{completedMatches.length}/{competition.matches.length}</strong></div><div><span>Total goals</span><strong>{totalGoals}</strong></div><div><span>League leader</span><strong>{standings[0] ? clubFor(standings[0].teamId).name : '—'}</strong></div><div><span>Tightest defense</span><strong>{tightestDefense ? `${clubFor(tightestDefense.teamId).name} · ${tightestDefense.ga} GA` : '—'}</strong></div></div>
      )}
      <div className="tournament-hub-grid">
        <section className="panel standings-table"><div className="panel-head"><div><span className="section-step">01</span><h2>League table</h2></div><Trophy size={18} /></div><div className="standings-row standings-head"><span>#</span><span>Club</span><span>P</span><span>GD</span><span>Pts</span></div>{standings.map((row, index) => { const club = clubFor(row.teamId); return <div className="standings-row" key={row.teamId}><b>{index + 1}</b><span><ClubMark club={club} size="xs" /><strong>{club.name}</strong></span><span>{row.played}</span><span>{row.gf - row.ga > 0 ? '+' : ''}{row.gf - row.ga}</span><strong>{row.points}</strong></div>; })}</section>
        <aside className="panel next-match-card">
          <span className="page-kicker">Matchmaker recommends next</span>
          {nextMatch ? (
            <>
              <div className="match-stage">{nextMatch.label}</div>
              <div className="match-versus">
                <div>
                  <ClubMark club={getClubInfo(state.captains.find(c => c.id === nextMatch.homeId))} size="lg" />
                  <strong>{getClubInfo(state.captains.find(c => c.id === nextMatch.homeId)).name}</strong>
                  <span style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginTop: '2px' }}>Home</span>
                </div>
                <b>VS</b>
                <div>
                  <ClubMark club={getClubInfo(state.captains.find(c => c.id === nextMatch.awayId))} size="lg" />
                  <strong>{getClubInfo(state.captains.find(c => c.id === nextMatch.awayId)).name}</strong>
                  <span style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginTop: '2px' }}>Away</span>
                </div>
              </div>
              
              {isOrganizer ? (
                !showScoreEntry ? (
                  <>
                    <label>
                      <span>Captains agree on kickoff</span>
                      <input type="datetime-local" value={matchDate} onInput={(event) => setMatchDate(event.currentTarget.value)} />
                    </label>
                    <button className="secondary full" onClick={scheduleMatch} disabled={!matchDate}>
                      {nextMatch.status === 'scheduled' ? 'Update match date' : 'Confirm match date'}
                    </button>
                    {nextMatch.scheduledAt && (
                      <>
                        <p className="scheduled-note" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '10px 0 0' }}>
                          <CheckCircle2 size={14} /> Scheduled · {new Date(nextMatch.scheduledAt).toLocaleString()}
                        </p>
                        <button className="primary full" style={{ marginTop: '12px' }} onClick={() => {
                          setShowScoreEntry(true);
                          setHomeScoreInput('');
                          setAwayScoreInput('');
                          setHomeScorersInput([]);
                          setAwayScorersInput([]);
                        }}>
                          <Goal size={16} /> Enter Match Score
                        </button>
                      </>
                    )}
                    <button className="ghost full matchmaker-demo" onClick={simulateMatchmakerResult}><Sparkles size={16} /> Simulate Matchmaker result</button>
                  </>
                ) : (
                  <div className="score-entry-form" style={{ display: 'grid', gap: '12px', textAlign: 'left', marginTop: '12px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--lime)' }}>Enter Match Score</span>
                      <button className="ghost btn-xs" style={{ padding: '2px 8px' }} onClick={() => setShowScoreEntry(false)}>Cancel</button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <label style={{ display: 'grid', gap: '4px' }}>
                        <span style={{ fontSize: '9px', color: 'var(--muted)' }}>{clubFor(nextMatch.homeId).name} Goals</span>
                        <input 
                          type="number" 
                          min="0" 
                          placeholder="0" 
                          value={homeScoreInput} 
                          onChange={(e) => {
                            const val = e.target.value;
                            setHomeScoreInput(val);
                            const count = parseInt(val, 10) || 0;
                            const roster = getTeamRoster(nextMatch.homeId);
                            setHomeScorersInput(prev => {
                              const next = [...prev];
                              while (next.length < count) next.push(roster[0]?.id || '');
                              return next.slice(0, count);
                            });
                          }}
                          style={{ padding: '8px', background: '#0c1511', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '6px', fontSize: '11px' }}
                        />
                      </label>
                      
                      <label style={{ display: 'grid', gap: '4px' }}>
                        <span style={{ fontSize: '9px', color: 'var(--muted)' }}>{clubFor(nextMatch.awayId).name} Goals</span>
                        <input 
                          type="number" 
                          min="0" 
                          placeholder="0" 
                          value={awayScoreInput} 
                          onChange={(e) => {
                            const val = e.target.value;
                            setAwayScoreInput(val);
                            const count = parseInt(val, 10) || 0;
                            const roster = getTeamRoster(nextMatch.awayId);
                            setAwayScorersInput(prev => {
                              const next = [...prev];
                              while (next.length < count) next.push(roster[0]?.id || '');
                              return next.slice(0, count);
                            });
                          }}
                          style={{ padding: '8px', background: '#0c1511', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '6px', fontSize: '11px' }}
                        />
                      </label>
                    </div>
                    
                    {homeScorersInput.length > 0 && (
                      <div style={{ display: 'grid', gap: '4px' }}>
                        <span style={{ fontSize: '8px', color: 'var(--muted)' }}>{clubFor(nextMatch.homeId).name} Scorers</span>
                        {homeScorersInput.map((scorerId, idx) => (
                          <select 
                            key={idx} 
                            value={scorerId} 
                            onChange={(e) => {
                              const val = e.target.value;
                              setHomeScorersInput(prev => {
                                const next = [...prev];
                                next[idx] = val;
                                return next;
                              });
                            }}
                            style={{ padding: '6px', background: '#0c1511', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '6px', fontSize: '10px' }}
                          >
                            {getTeamRoster(nextMatch.homeId).map(p => <option key={p.id} value={p.id}>{p.tag}</option>)}
                          </select>
                        ))}
                      </div>
                    )}
                    
                    {awayScorersInput.length > 0 && (
                      <div style={{ display: 'grid', gap: '4px' }}>
                        <span style={{ fontSize: '8px', color: 'var(--muted)' }}>{clubFor(nextMatch.awayId).name} Scorers</span>
                        {awayScorersInput.map((scorerId, idx) => (
                          <select 
                            key={idx} 
                            value={scorerId} 
                            onChange={(e) => {
                              const val = e.target.value;
                              setAwayScorersInput(prev => {
                                const next = [...prev];
                                next[idx] = val;
                                return next;
                              });
                            }}
                            style={{ padding: '6px', background: '#0c1511', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '6px', fontSize: '10px' }}
                          >
                            {getTeamRoster(nextMatch.awayId).map(p => <option key={p.id} value={p.id}>{p.tag}</option>)}
                          </select>
                        ))}
                      </div>
                    )}
                    
                    <button 
                      className="primary full" 
                      onClick={() => {
                        if (homeScoreInput === '' || awayScoreInput === '') {
                          alert('Please enter scores for both teams.');
                          return;
                        }
                        saveMatchResult(nextMatch.id, homeScoreInput, awayScoreInput, homeScorersInput, awayScorersInput);
                        setShowScoreEntry(false);
                      }}
                    >
                      Submit Result
                    </button>
                  </div>
                )
              ) : (
                <div style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--line)', borderRadius: '8px', marginTop: '10px' }}>
                  <Clock3 size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  <strong>
                    {nextMatch.status === 'scheduled' 
                      ? `Kickoff: ${new Date(nextMatch.scheduledAt).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}`
                      : 'Kickoff: Date TBD (Waiting for organizer)'}
                  </strong>
                </div>
              )}
              {user.role === 'captain' && opponentClub && (
                <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(217, 255, 99, 0.04)', border: '1px solid rgba(217, 255, 99, 0.15)', borderRadius: '8px', fontSize: '11px', textAlign: 'center' }}>
                  <strong>Opponent:</strong> {opponentClub.name} <span style={{ color: 'var(--muted)' }}>({isHome ? 'Home' : 'Away'})</span>
                </div>
              )}
            </>
          ) : (
            user.role === 'captain' && hasPendingMatches ? (
              <div className="tournament-complete" style={{ padding: '24px 12px' }}>
                <Clock3 size={36} style={{ color: 'var(--muted)', marginBottom: '8px' }} />
                <h2>Fixtures completed</h2>
                <p>Waiting for other league matches to finish.</p>
              </div>
            ) : (
              <div className="tournament-complete"><Crown size={42} /><h2>Tournament complete</h2><p>All official fixtures have been reported.</p></div>
            )
          )}
        </aside>
      </div>
      {(isOrganizer || user.role === 'player') && (
        <div className="tournament-lower-grid">
        <section className="panel top-scorers"><div className="panel-head"><div><span className="section-step">02</span><h2>Club top scorers</h2></div><Goal size={18} /></div>{state.captains.map((captain) => { const club = getClubInfo(captain); return <div key={captain.id}><ClubMark club={club} size="xs" /><span><strong>{club.name}</strong><small>{topScorerFor(captain.id)}</small></span></div>; })}</section>
        <section className="panel fixture-list">
          <div className="panel-head"><div><span className="section-step">03</span><h2>Official fixture path</h2></div><CalendarDays size={18} /></div>
          {(competition.matches || []).map((match) => {
            const isEditing = editingMatchId === match.id;
            const isCurrent = match.id === nextMatch?.id;
            
            if (isEditing) {
              const homeRoster = getTeamRoster(match.homeId);
              const awayRoster = getTeamRoster(match.awayId);
              
              return (
                <div className="fixture-edit-form" key={match.id} style={{ display: 'grid', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--line)', margin: '10px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '12px' }}>Edit: {match.label}</strong>
                    <button className="ghost btn-xs" style={{ padding: '2px 8px' }} onClick={() => setEditingMatchId(null)}>Cancel</button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                    <label style={{ display: 'grid', gap: '4px' }}>
                      <span style={{ fontSize: '9px', color: 'var(--muted)' }}>Kickoff Date & Time</span>
                      <input 
                        type="datetime-local" 
                        value={editMatchDate} 
                        onChange={(e) => setEditMatchDate(e.target.value)} 
                        style={{ padding: '8px', background: '#0c1511', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '6px', fontSize: '11px' }}
                      />
                    </label>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <ClubMark club={clubFor(match.homeId)} size="xs" />
                        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{clubFor(match.homeId).name}</span>
                      </div>
                      <input 
                        type="number" 
                        min="0" 
                        placeholder="Goals" 
                        value={editHomeScore} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditHomeScore(val);
                          const count = parseInt(val, 10) || 0;
                          setEditHomeScorers(prev => {
                            const next = [...prev];
                            while (next.length < count) next.push(homeRoster[0]?.id || '');
                            return next.slice(0, count);
                          });
                        }}
                        style={{ width: '100%', padding: '8px', background: '#0c1511', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '6px', fontSize: '11px' }}
                      />
                    </div>
                    <b style={{ color: 'var(--muted)', fontSize: '11px' }}>vs</b>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <ClubMark club={clubFor(match.awayId)} size="xs" />
                        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{clubFor(match.awayId).name}</span>
                      </div>
                      <input 
                        type="number" 
                        min="0" 
                        placeholder="Goals" 
                        value={editAwayScore} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditAwayScore(val);
                          const count = parseInt(val, 10) || 0;
                          setEditAwayScorers(prev => {
                            const next = [...prev];
                            while (next.length < count) next.push(awayRoster[0]?.id || '');
                            return next.slice(0, count);
                          });
                        }}
                        style={{ width: '100%', padding: '8px', background: '#0c1511', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '6px', fontSize: '11px' }}
                      />
                    </div>
                  </div>

                  {editHomeScorers.length > 0 && (
                    <div style={{ display: 'grid', gap: '4px' }}>
                      <span style={{ fontSize: '9px', color: 'var(--muted)' }}>{clubFor(match.homeId).name} Scorers</span>
                      {editHomeScorers.map((scorerId, idx) => (
                        <select 
                          key={idx} 
                          value={scorerId} 
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditHomeScorers(prev => {
                              const next = [...prev];
                              next[idx] = val;
                              return next;
                            });
                          }}
                          style={{ padding: '6px', background: '#0c1511', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '6px', fontSize: '11px' }}
                        >
                          {homeRoster.map(p => <option key={p.id} value={p.id}>{p.tag}</option>)}
                        </select>
                      ))}
                    </div>
                  )}

                  {editAwayScorers.length > 0 && (
                    <div style={{ display: 'grid', gap: '4px' }}>
                      <span style={{ fontSize: '9px', color: 'var(--muted)' }}>{clubFor(match.awayId).name} Scorers</span>
                      {editAwayScorers.map((scorerId, idx) => (
                        <select 
                          key={idx} 
                          value={scorerId} 
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditAwayScorers(prev => {
                              const next = [...prev];
                              next[idx] = val;
                              return next;
                            });
                          }}
                          style={{ padding: '6px', background: '#0c1511', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '6px', fontSize: '11px' }}
                        >
                          {awayRoster.map(p => <option key={p.id} value={p.id}>{p.tag}</option>)}
                        </select>
                      ))}
                    </div>
                  )}

                  <button 
                    className="primary full" 
                    onClick={() => {
                      if (editHomeScore !== '' && editAwayScore !== '') {
                        saveMatchResult(match.id, editHomeScore, editAwayScore, editHomeScorers, editAwayScorers);
                      }
                      updateState((draft) => {
                        const m = draft.competition.matches.find(item => item.id === match.id);
                        if (m) {
                          m.scheduledAt = editMatchDate;
                          if (m.status !== 'completed') {
                            m.status = editMatchDate ? 'scheduled' : 'pending';
                          }
                        }
                      });
                      setEditingMatchId(null);
                    }}
                  >
                    Save Fixture Details
                  </button>
                </div>
              );
            }
            
            return (
              <div className={isCurrent ? 'current' : ''} key={match.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 7px', borderTop: '1px solid var(--line)' }}>
                <div style={{ flex: '1', display: 'grid', gridTemplateColumns: '95px 1fr', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '8px', color: 'var(--muted)' }}>{match.label}</span>
                  <strong style={{ fontSize: '10px' }}>
                    {clubFor(match.homeId).name} <span style={{fontSize:'8px', color:'var(--muted)', fontWeight:'normal'}}>(H)</span> <b>{match.status === 'completed' ? `${match.homeScore}–${match.awayScore}` : 'vs'}</b> {clubFor(match.awayId).name} <span style={{fontSize:'8px', color:'var(--muted)', fontWeight:'normal'}}>(A)</span>
                  </strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <small style={{ fontSize: '8px', color: 'var(--muted)', textAlign: 'right' }}>
                    {match.status === 'completed' ? 'Final' : match.scheduledAt ? new Date(match.scheduledAt).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}) : 'Date TBD'}
                  </small>
                  {isOrganizer && (
                    <button 
                      className="ghost icon-only" 
                      style={{ width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} 
                      title="Edit match details"
                      onClick={() => {
                        setEditingMatchId(match.id);
                        setEditMatchDate(match.scheduledAt || '');
                        setEditHomeScore(match.homeScore !== null ? match.homeScore : '');
                        setEditAwayScore(match.awayScore !== null ? match.awayScore : '');
                        
                        const matchStats = competition.playerStats || [];
                        const homeStats = matchStats.filter(s => s.matchId === match.id && s.teamId === match.homeId);
                        const awayStats = matchStats.filter(s => s.matchId === match.id && s.teamId === match.awayId);
                        
                        const hScorers = [];
                        homeStats.forEach(s => {
                          for (let i = 0; i < s.goals; i++) hScorers.push(s.playerId);
                        });
                        const aScorers = [];
                        awayStats.forEach(s => {
                          for (let i = 0; i < s.goals; i++) aScorers.push(s.playerId);
                        });
                        
                        const homeRoster = getTeamRoster(match.homeId);
                        const awayRoster = getTeamRoster(match.awayId);
                        
                        const hScoreVal = match.homeScore || 0;
                        while (hScorers.length < hScoreVal) hScorers.push(homeRoster[0]?.id || '');
                        const aScoreVal = match.awayScore || 0;
                        while (aScorers.length < aScoreVal) aScorers.push(awayRoster[0]?.id || '');
                        
                        setEditHomeScorers(hScorers);
                        setEditAwayScorers(aScorers);
                      }}
                    >
                      <Pencil size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </div>
      )}
    </>
  );
}

function ClubSettings({ user, state, updateState }) {
  const captain = state.captains.find((item) => item.id === user.id);
  const club = getClubInfo(captain);
  const [name, setName] = useState(club.name);
  const [logo, setLogo] = useState(club.logo);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const latest = getClubInfo(captain);
    setName(latest.name);
    setLogo(latest.logo);
  }, [captain]);

  const uploadLogo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert('Please choose a logo smaller than 1.5 MB.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setLogo(reader.result); setSaved(false); };
    reader.readAsDataURL(file);
  };

  const saveClub = () => {
    const nextName = name.trim();
    if (!nextName) return;
    updateState((draft) => {
      const draftCaptain = draft.captains.find((item) => item.id === user.id);
      if (!draftCaptain) return;
      draftCaptain.team = nextName;
      draftCaptain.club = { name: nextName, logo: logo || null };
    });
    setSaved(true);
  };

  const previewClub = { ...club, name: name.trim() || club.name, logo };

  return (
    <>
      <header className="page-header">
        <div><span className="page-kicker">Captain workspace</span><h1>Club settings</h1><p>Manage the identity displayed across your tournament.</p></div>
        {saved && <span className="status-pill good"><BadgeCheck size={14} /> Saved</span>}
      </header>
      <div className="club-settings-layout">
        <section className="panel club-settings-form">
          <div className="panel-head"><div><span className="section-step">01</span><h2>Club identity</h2></div><Settings size={18} /></div>
          <label className="club-name-field"><span>Name of the club</span><input value={name} maxLength={40} onChange={(event) => { setName(event.target.value); setSaved(false); }} placeholder="Enter club name" /></label>
          <div className="club-logo-field">
            <span>Club flag or logo</span>
            <div className="club-logo-editor">
              <ClubMark club={previewClub} size="xl" />
              <div><label className="secondary club-upload-button" htmlFor="club-logo-upload"><Upload size={16} /> Upload image</label><input id="club-logo-upload" type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadLogo} />
              <small>PNG, JPG, or WebP · maximum 1.5 MB</small></div>
              {logo && <button className="ghost btn-danger icon-only" title="Remove club logo" onClick={() => { setLogo(null); setSaved(false); }}><Trash2 size={16} /></button>}
            </div>
          </div>
          <button className="primary" onClick={saveClub} disabled={!name.trim()}><BadgeCheck size={17} /> Save club settings</button>
        </section>
        <aside className="panel club-preview-card">
          <span className="page-kicker">Live preview</span>
          <ClubMark club={previewClub} size="xl" />
          <h2>{previewClub.name}</h2>
          <p>This crest and name will appear in drafted-player cards, auction standings, and your captain profile.</p>
          <div className="club-preview-badge"><ClubMark club={previewClub} size="xs" /><span>Drafted to</span><strong>{previewClub.name}</strong></div>
        </aside>
      </div>
    </>
  );
}

function PlayerProfile({ user, state, updateState, showPool, editable = true }) {
  const player = state.players.find((item) => item.id === user.id) || (state.captains || captains).find((item) => item.id === user.id);
  const [form, setForm] = useState(() => {
    if (!player) return { name: 'Captain', tag: 'Captain', primary: 'CM', secondary: 'CM', style: 'Utility', traits: [], color: '#a1a8ff', initials: 'C' };
    return {
      ...player,
      tag: player.tag || player.handle || player.name || 'Captain',
      primary: player.primary || 'CM',
      secondary: player.secondary || 'CM',
      style: player.style || 'Utility',
      traits: player.traits || [],
      color: player.color || '#a1a8ff',
      initials: player.initials || 'C'
    };
  });
  const [saved, setSaved] = useState(false);
  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const save = () => {
    if (!editable) return;
    const completedForm = { ...form, profileComplete: true };
    updateState((draft) => {
      draft.players = draft.players.map((item) => item.id === user.id ? completedForm : item);
      if (draft.tournaments) {
        draft.tournaments.forEach((t) => {
          if (t.captains) {
            t.captains = t.captains.map((c) => {
              if (c.id === user.id) {
                return { ...c, name: completedForm.name, handle: completedForm.tag, tag: completedForm.tag };
              }
              return c;
            });
          }
        });
      }
    });
    setSaved(true); setTimeout(() => setSaved(false), 1800);
  };
  return (
    <>
      <header className="page-header"><div><span className="page-kicker">Player registration</span><h1>Make your case.</h1><p>Captains see this card when they build their shortlist. Keep it honest-ish.</p></div><span className="status-pill good"><BadgeCheck size={14} /> {editable ? 'Registration open' : 'Registration locked'}</span></header>
      <div className="profile-layout">
        <section className="panel profile-form">
          <div className="panel-head"><div><span className="section-step">01</span><h2>Your player profile</h2></div><Pencil size={18} /></div>
          <div className="profile-avatar-row"><Avatar person={form} size="xl" /><div><strong>{form.tag}</strong><span>{form.name}</span><small>Profile color and initials are assigned for this demo.</small></div></div>
          <div className="form-grid">
            <label><span>Display name</span><input disabled={!editable} value={form.name} onChange={(e) => setField('name', e.target.value)} /></label>
            <label><span>FC gamertag</span><input disabled={!editable} value={form.tag} onChange={(e) => setField('tag', e.target.value)} /></label>
            <label><span>Primary position</span><select disabled={!editable} value={form.primary} onChange={(e) => setField('primary', e.target.value)}>{POSITIONS.map((p) => <option key={p}>{p}</option>)}</select></label>
            <label><span>Secondary position</span><select disabled={!editable} value={form.secondary} onChange={(e) => setField('secondary', e.target.value)}>{POSITIONS.map((p) => <option key={p}>{p}</option>)}</select></label>
            <label className="span-two"><span>Play style</span><select disabled={!editable} value={form.style} onChange={(e) => setField('style', e.target.value)}>{['Creator','Finisher','Anchor','Dribbler','Sweeper','Engine','Winger','Stopper','Playmaker','Utility','Ball winner','Poacher'].map((p) => <option key={p}>{p}</option>)}</select></label>
          </div>
          <button className="primary" onClick={save} disabled={!editable}>{saved ? <><BadgeCheck size={18} /> Saved to pool</> : <>Save player card <ArrowRight size={18} /></>}</button>
        </section>
        <aside className="profile-preview">
          <span className="section-step">02</span><h2>Captain preview</h2><p>This is how you appear on every draft board.</p>
          <PlayerCard player={form} rank={0} onRank={() => {}} hideRankButton={true} />
          <div className="profile-tip"><Sparkles size={18} /><span><strong>Quick tip</strong>Flexible positions make you easier to fit into more formations.</span></div>
          <button className="secondary full" onClick={showPool}><UsersRound size={17} /> See the squads</button>
        </aside>
      </div>
    </>
  );
}

function PlayerPool({ state }) {
  const soldIds = new Set(Object.values(state.captainData || {}).flatMap((item) => item?.squad || []));
  const getPurchaserClub = (playerId) => {
    const captainId = Object.keys(state.captainData || {}).find(
      (capId) => state.captainData[capId]?.squad?.includes(playerId)
    );
    if (!captainId) return null;
    const captainInfo = state.captains?.find((c) => c.id === captainId);
    return captainInfo ? getClubInfo(captainInfo) : null;
  };
  const undraftedPlayers = state.players.filter((p) => !soldIds.has(p.id));

  return (
    <>
      <header className="page-header">
        <div>
          <span className="page-kicker">Tournament lobby</span>
          <h1>Meet the squads.</h1>
          <p>{state.players.length} registered players are ready for auction night.</p>
        </div>
      </header>
      
      <section className="panel undrafted-pool-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div className="panel-head" style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="section-step" style={{ background: 'var(--lime-dark)', color: 'var(--lime)' }}>★</span>
          <h2>Available Player Pool ({undraftedPlayers.length})</h2>
        </div>
        {undraftedPlayers.length > 0 ? (
          <div className="player-grid">
            {undraftedPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                sold={false}
                soldClub={null}
                rank={0}
                onRank={() => {}}
                hideRankButton={true}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', fontSize: '11px', textAlign: 'center', padding: '24px 0' }}>All players have been drafted!</p>
        )}
      </section>

      <div className="panel-head" style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="section-step" style={{ background: 'var(--lime-dark)', color: 'var(--lime)' }}>✔</span>
        <h2>Team Rosters</h2>
      </div>
      <div className="complete-squads-grid" style={{ padding: '0 0 24px' }}>
        {state.captains.map((captain) => {
          const club = getClubInfo(captain);
          const data = state.captainData[captain.id] || { squad: [], budget: 0 };
          const squadPlayers = (data.squad || []).map((id) => state.players.find((p) => p.id === id)).filter(Boolean);
          const captainPlayer = state.players.find((p) => 
            p.id === captain.id ||
            p.name.toLowerCase() === captain.name.toLowerCase() || 
            (p.tag && p.tag.toLowerCase() === (captain.handle || '').toLowerCase())
          );
          const captainTag = captain.handle || captain.tag || captain.name;
          const captainPosition = captainPlayer ? captainPlayer.primary : 'Captain';
          const captainAvatarPerson = captainPlayer || captain;
          return (
            <div className="complete-squad-card" key={captain.id}>
              <div className="complete-squad-head">
                <ClubMark club={club} size="md" />
                <span><strong>{club.name}</strong><small>{data.squad?.length || 0} players signed</small></span>
              </div>
              <div className="complete-squad-list">
                <div key={captain.id}>
                  <Avatar person={captainAvatarPerson} size="sm" />
                  <span>
                    <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {captainTag}
                      <Crown size={12} className="captain-crown" style={{ color: '#ffd700', fill: '#ffd700' }} />
                    </strong>
                    <small>{captainPosition}</small>
                  </span>
                </div>
                {squadPlayers.map((p) => (
                  <div key={p.id}><Avatar person={p} size="sm" /><span><strong>{p.tag}</strong><small>{p.primary}</small></span></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [state, setState] = useState(loadState);
  const [active, setActive] = useState('squad');
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('clubhouse-theme') || 'dark');

  // Multi-tab sync channel
  const channelRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(SYNC_CHANNEL_KEY);
      channelRef.current = channel;
      channel.onmessage = (event) => {
        const { state: incomingState, type } = event.data;
        if (type === 'STATE_UPDATE' && incomingState) {
          setState((current) => {
            const currentTs = current._sync?.updatedAt || 0;
            const incomingTs = incomingState._sync?.updatedAt || 0;
            if (incomingTs > currentTs) {
              return incomingState;
            }
            return current;
          });
        }
      };
      return () => {
        channel.close();
      };
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (channelRef.current && state._sync?.origin === 'local') {
      const broadcastState = {
        ...state,
        _sync: { origin: 'remote', updatedAt: state._sync.updatedAt }
      };
      channelRef.current.postMessage({ type: 'STATE_UPDATE', state: broadcastState });
    }
  }, [state]);

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('clubhouse-theme', theme); }, [theme]);

  const updateState = (recipe) => setState((current) => {
    const draft = structuredClone(current);
    recipe(draft);
    draft._sync = { origin: 'local', updatedAt: Date.now() };
    return draft;
  });

  const login = (nextUser) => { setUser(nextUser); setSelectedTournamentId(null); setActive(nextUser.role === 'captain' ? 'squad' : 'profile'); };
  const logout = () => { setUser(null); setSelectedTournamentId(null); };

  const registerForTournament = (tournamentId) => {
    if (!user || user.role !== 'player') return;
    setState((current) => {
      const draft = structuredClone(current);
      const ids = new Set(draft.tournamentPlayerIds[tournamentId] || []);
      ids.add(user.id);
      draft.tournamentPlayerIds[tournamentId] = [...ids];
      draft._sync = { origin: 'local', updatedAt: Date.now() };
      return draft;
    });
    setSelectedTournamentId(tournamentId);
    setActive('profile');
  };

  const tournament = state.tournaments.find((item) => item.id === selectedTournamentId);
  const tournamentPhase = getTournamentPhase(tournament);
  const tournamentPlayerIds = state.tournamentPlayerIds[selectedTournamentId] || [];
  const tournamentCaptains = tournament ? (tournament.captains || (tournament.id === 't-friday-night' ? captains : [])) : [];
  const tournamentState = tournament ? {
    players: auctionEligiblePlayers(state.players.filter((player) => tournamentPlayerIds.includes(player.id)), tournamentCaptains),
    captainData: state.tournamentCaptainData[selectedTournamentId],
    auction: state.tournamentAuctions[selectedTournamentId],
    competition: state.tournamentCompetitions?.[selectedTournamentId] || createCompetition(),
    captains: tournamentCaptains,
    teamSize: getTournamentTeamSize(tournament),
  } : null;

  const updateTournamentState = (recipe) => setState((current) => {
    const draft = structuredClone(current);
    if (!draft.tournamentCompetitions) draft.tournamentCompetitions = {};
    const ids = new Set(draft.tournamentPlayerIds[selectedTournamentId] || []);
    const targetTournament = draft.tournaments.find((t) => t.id === selectedTournamentId);
    const scopedCaptains = targetTournament ? (targetTournament.captains || (targetTournament.id === 't-friday-night' ? captains : [])) : [];
    const scoped = {
      players: auctionEligiblePlayers(draft.players.filter((player) => ids.has(player.id)), scopedCaptains),
      captainData: draft.tournamentCaptainData[selectedTournamentId],
      auction: draft.tournamentAuctions[selectedTournamentId],
      competition: draft.competition || draft.tournamentCompetitions[selectedTournamentId] || createCompetition(),
      captains: scopedCaptains,
      teamSize: getTournamentTeamSize(targetTournament),
    };
    recipe(scoped);
    if (targetTournament) {
      targetTournament.captains = scoped.captains;
    }
    const scopedMap = new Map(scoped.players.map((player) => [player.id, player]));
    draft.players = draft.players.map((player) => scopedMap.get(player.id) || player);
    scoped.players.forEach((player) => { if (!draft.players.some((item) => item.id === player.id)) draft.players.push(player); });
    draft.tournamentCaptainData[selectedTournamentId] = scoped.captainData;
    draft.tournamentAuctions[selectedTournamentId] = scoped.auction;
    draft.tournamentCompetitions[selectedTournamentId] = scoped.competition;
    draft._sync = { origin: 'local', updatedAt: Date.now() };
    return draft;
  });

  const budget = useMemo(() => user?.role === 'captain' && tournamentState ? tournamentState.captainData[user.id]?.budget : 0, [tournamentState, user]);

  const loginPlayers = useMemo(() => {
    const seedIds = new Set(seedPlayers.map(p => p.id));
    return state.players.filter(p => {
      if (seedIds.has(p.id)) return false;
      return Object.values(state.tournamentPlayerIds).some(playerIds => playerIds.includes(p.id));
    });
  }, [state.players, state.tournamentPlayerIds]);

  const loginCaptains = useMemo(() => {
    const list = [];
    const seen = new Set();
    state.tournaments.forEach((t) => {
      if ([PHASES.CAPTAINS, PHASES.AUCTION, PHASES.SQUADS, PHASES.TOURNAMENT, PHASES.COMPLETE].includes(getTournamentPhase(t)) && t.captains) {
        t.captains.forEach((c) => {
          if (!seen.has(c.id)) {
            seen.add(c.id);
            list.push(c);
          }
        });
      }
    });
    return list.length ? list : captains;
  }, [state.tournaments]);

  let view;
  if (!user) view = <Login onLogin={login} players={loginPlayers} captains={loginCaptains} />;
  else if (user.role === 'organizer') view = <OrganizerDashboard state={state} updateState={updateState} onLogout={logout} />;
  else if (!tournament) view = <TournamentSelector user={user} state={state} onSelect={setSelectedTournamentId} onRegister={registerForTournament} onLogout={logout} />;
  else {
    const captainCanUseAuction = user.role === 'captain' && tournamentPhase === PHASES.AUCTION;
    const captainCanUseTournament = user.role === 'captain' && [PHASES.SQUADS, PHASES.TOURNAMENT, PHASES.COMPLETE].includes(tournamentPhase);
    const playerCanEditProfile = user.role === 'player' && tournamentPhase === PHASES.REGISTRATION;
    const playerCanViewPool = user.role === 'player' && [PHASES.CAPTAINS, PHASES.AUCTION, PHASES.SQUADS, PHASES.TOURNAMENT, PHASES.COMPLETE].includes(tournamentPhase);
    const content = (
      <>
        {user.role === 'captain' && active === 'squad' && <SquadRoom user={user} state={tournamentState} updateState={updateTournamentState} goAuction={() => setActive('auction')} />}
        {user.role === 'captain' && active === 'auction' && (captainCanUseAuction
          ? <AuctionRoom user={user} state={tournamentState} updateState={updateTournamentState} startingBudget={tournament.budget} goTournament={() => setActive('tournament')} />
          : <PhaseNotice title="Auction is not live." body="The organizer controls when the auction opens. Use the squad room to scout until then." actionLabel="Back to squad" onAction={() => setActive('squad')} />)}
        {user.role === 'captain' && active === 'tournament' && (captainCanUseTournament
          ? <TournamentHub user={user} state={tournamentState} updateState={updateTournamentState} />
          : <PhaseNotice title="Tournament is not ready." body="This opens after the auction closes and squads move into confirmation." actionLabel="Back to squad" onAction={() => setActive('squad')} />)}
        {user.role === 'captain' && active === 'club' && <ClubSettings user={user} state={tournamentState} updateState={updateTournamentState} />}
        {user.role === 'player' && active === 'tournament' && (
          [PHASES.SQUADS, PHASES.TOURNAMENT, PHASES.COMPLETE].includes(tournamentPhase)
            ? <TournamentHub user={user} state={tournamentState} updateState={updateTournamentState} isOrganizer={false} />
            : <PhaseNotice title="Tournament is not ready." body="This opens after the squads move into tournament stage." />
        )}
        {user.role === 'player' && active === 'profile' && (playerCanEditProfile
          ? <PlayerProfile user={user} state={state} updateState={updateState} showPool={() => setActive('pool')} editable={playerCanEditProfile} />
          : <PhaseNotice title="Registration is locked." body="Player cards are locked after registration. You can still follow the draft and squads." actionLabel="View squads" onAction={() => setActive('pool')} />)}
        {user.role === 'player' && active === 'pool' && (playerCanViewPool || tournamentPhase === PHASES.REGISTRATION
          ? <PlayerPool state={tournamentState} />
          : <PhaseNotice title="Player pool is not open." body="The organizer has not opened registration for this tournament yet." />)}
      </>
    );
    view = (
    <AppShell user={user} active={active} setActive={setActive} onLogout={logout} onChangeTournament={() => setSelectedTournamentId(null)} budget={budget} tournament={tournament} players={state.players} captains={tournamentState.captains} competition={tournamentState.competition}>
      {content}
    </AppShell>
    );
  }
  return (
    <><ThemeToggle theme={theme} onToggle={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} />{view}</>
  );
}
