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
import { SUPABASE_STATE_ID, SUPABASE_STATE_TABLE, hasSupabaseConfig, supabase } from './supabaseClient';

const STORAGE_KEY = 'clubhouse-fc26-v1';
const CLOUD_SYNC_LABEL = hasSupabaseConfig ? 'Live sync on' : 'Local mode';

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST'];

const captains = [];

const legacyCaptainIds = new Set(['cap-tariq', 'cap-farhan', 'cap-imran', 'cap-sami']);
const legacyTournamentIds = new Set(['t-friday-night']);

const legacySeedPlayerIds = new Set([
  'p-rafi',
  'p-zayed',
  'p-nabil',
  'p-adnan',
  'p-fahim',
  'p-shah',
  'p-ayaan',
  'p-hamza',
  'p-rayan',
  'p-omar',
  'p-junaid',
  'p-kabir',
]);

const seedPlayers = [];

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

const seedTournaments = [];

const demoCaptainShortlists = {};

const createCaptainData = (budget = 1000, includeDemoPicks = false) => Object.fromEntries(captains.map((captain) => [captain.id, {
  formation: '4-3-3', shortlist: includeDemoPicks ? (demoCaptainShortlists[captain.id] || []) : [], budget, squad: [], lineup: { GK: `captain:${captain.id}` }, squadConfirmed: false,
}]));

const createAuction = () => ({
  phase: 'scheduled',
  scheduledTime: null,
  votes: {},
  playerId: null,
  bid: 0,
  leaderId: null,
  history: [],
  order: [],
  countdownEndTime: null,
  lastBidTime: 0
});

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
    // First round robin (Rounds 1-3)
    [[a, d], [b, c]], 
    [[a, c], [d, b]], 
    [[a, b], [c, d]],
    // Second round robin (Rounds 4-6, reversed home/away)
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
  { id: 'shield-final', stage: 'finals', round: 7, label: 'Shield Match · 3rd vs 4th', homeId: standings[2].teamId, awayId: standings[3].teamId, status: 'pending', scheduledAt: '', homeScore: null, awayScore: null },
  { id: 'championship-final', stage: 'finals', round: 8, label: 'Championship Final · 1st vs 2nd', homeId: standings[0].teamId, awayId: standings[1].teamId, status: 'pending', scheduledAt: '', homeScore: null, awayScore: null },
]);

const suggestKickoffDate = () => {
  const date = new Date();
  const daysUntilFriday = (5 - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilFriday);
  date.setHours(20, 0, 0, 0);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const todayInputDate = () => {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const isPlayerProfileReady = (player) => Boolean(player?.profileUpdatedAt || player?.profileReady);

const getProfileSetupStatus = (players = [], tournamentCaptains = []) => {
  const captainIds = new Set(tournamentCaptains.map((captain) => captain.id));
  const profilePlayers = players.filter((player) => !captainIds.has(player.id));
  const ready = profilePlayers.filter(isPlayerProfileReady).length;
  return {
    total: profilePlayers.length,
    ready,
    complete: profilePlayers.length > 0 && ready === profilePlayers.length,
  };
};

const createDefaultState = () => ({
  players: seedPlayers,
  captainData: {},
  auction: createAuction(),
  tournaments: seedTournaments,
  tournamentPlayerIds: {},
  tournamentCaptainData: {},
  tournamentAuctions: {},
  tournamentCompetitions: {},
  demoPicksVersion: 1,
});

const isLegacyRef = (value) => {
  return false;
};

const removeLegacySeedPlayerRefs = (value) => {
  return value;
};

const sanitizeCaptainData = (captainData = {}) => Object.fromEntries(Object.entries(captainData)
  .map(([captainId, data]) => [
    captainId,
    {
      ...data,
      shortlist: data?.shortlist || [],
      squad: data?.squad || [],
      lineup: data?.lineup || {},
    },
  ]));

const stripLegacyTournamentKeys = (map = {}) => Object.fromEntries(
  Object.entries(map).filter(([tournamentId]) => !legacyTournamentIds.has(tournamentId))
);

const sanitizeState = (state) => {
  const cleanedTournamentPlayerIds = Object.fromEntries(Object.entries(stripLegacyTournamentKeys(state.tournamentPlayerIds || {})).map(([tournamentId, playerIds]) => [
    tournamentId,
    playerIds || [],
  ]));

  const activePlayerIds = new Set();
  Object.values(cleanedTournamentPlayerIds).forEach((playerIds) => {
    (playerIds || []).forEach((pid) => activePlayerIds.add(pid));
  });

  const cleaned = {
    ...state,
    players: (state.players || [])
      .filter((player) => activePlayerIds.has(player.id)),
    captainData: sanitizeCaptainData(state.captainData),
    tournaments: (state.tournaments || [])
      .filter((tournament) => !legacyTournamentIds.has(tournament.id))
      .map((tournament) => ({
        ...tournament,
        captains: tournament.captains || [],
      })),
    tournamentPlayerIds: cleanedTournamentPlayerIds,
    tournamentCaptainData: Object.fromEntries(Object.entries(stripLegacyTournamentKeys(state.tournamentCaptainData || {})).map(([tournamentId, captainData]) => [
      tournamentId,
      sanitizeCaptainData(captainData),
    ])),
  };

  cleaned.tournamentAuctions = Object.fromEntries(Object.entries(stripLegacyTournamentKeys(state.tournamentAuctions || {})).map(([tournamentId, auction]) => [
    tournamentId,
    auction,
  ]));
  cleaned.tournamentCompetitions = stripLegacyTournamentKeys(state.tournamentCompetitions || {});

  return cleaned;
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return normalizeLoadedState(saved);
  } catch {
    return createDefaultState();
  }
}

const normalizeLoadedState = (saved) => {
  if (!saved || typeof saved !== 'object') return createDefaultState();
  const base = createDefaultState();
  const cleanedSaved = sanitizeState(saved);
  const normalized = { ...base, ...cleanedSaved };
  normalized.players = cleanedSaved.players || [];
  normalized.captainData = sanitizeCaptainData(cleanedSaved.captainData || {});
  normalized.demoPicksVersion = 1;
  normalized.tournaments = cleanedSaved.tournaments || [];
  normalized.tournamentPlayerIds = cleanedSaved.tournamentPlayerIds || {};
  normalized.tournamentCaptainData = cleanedSaved.tournamentCaptainData || {};
  normalized.tournamentAuctions = cleanedSaved.tournamentAuctions || {};
  normalized.tournamentCompetitions = cleanedSaved.tournamentCompetitions || {};
  normalized.tournaments.forEach((tournament) => {
    tournament.captains = (tournament.captains || []).map((captain) => ({
      ...captain,
      club: { ...getClubInfo(captain), color: undefined, initials: undefined },
    }));
    if (!normalized.tournamentPlayerIds[tournament.id]) normalized.tournamentPlayerIds[tournament.id] = [];
    if (!normalized.tournamentCaptainData[tournament.id]) normalized.tournamentCaptainData[tournament.id] = {};
    tournament.captains.forEach((captain) => {
      if (!normalized.tournamentCaptainData[tournament.id][captain.id]) {
        normalized.tournamentCaptainData[tournament.id][captain.id] = {
          formation: '4-3-3',
          shortlist: [],
          budget: Number(tournament.budget || 1000),
          squad: [],
          lineup: { GK: `captain:${captain.id}` },
          squadConfirmed: false,
        };
      }
    });
    if (!normalized.tournamentAuctions[tournament.id]) normalized.tournamentAuctions[tournament.id] = createAuction();
    if (!normalized.tournamentCompetitions[tournament.id]) normalized.tournamentCompetitions[tournament.id] = createCompetition();
  });
  return normalized;
};

const money = (amount) => amount.toLocaleString();

function Avatar({ person, size = 'md' }) {
  if (person?.avatar) {
    return (
      <img
        className={`avatar avatar-${size}`}
        src={person.avatar}
        alt={`${person.name || person.tag || 'User'}'s avatar`}
        style={{ objectFit: 'cover' }}
      />
    );
  }
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
      <span>TOURNAMENT<span>HQ</span></span>
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
  const hasCaptains = captains.length > 0;
  const hasPlayers = players.length > 0;
  const canEnter = role === 'organizer' || (role === 'captain' ? Boolean(selected) : Boolean(playerSelected));

  useEffect(() => {
    if (hasCaptains && !selected) {
      setSelected(captains[0].id);
    }
  }, [captains, hasCaptains, selected]);

  useEffect(() => {
    if (role === 'captain' && hasCaptains && !captains.some((c) => c.id === selected)) {
      setSelected(captains[0].id);
    }
    if (role === 'captain' && !hasCaptains && selected) {
      setSelected('');
    }
  }, [captains, hasCaptains, role, selected]);

  useEffect(() => {
    if (role === 'player' && hasPlayers && !players.some((player) => player.id === playerSelected)) {
      setPlayerSelected(players[0].id);
    }
    if (role === 'player' && !hasPlayers && playerSelected) {
      setPlayerSelected('');
    }
  }, [hasPlayers, playerSelected, players, role]);

  return (
    <main className="login-page">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />
      <header className="login-header"><Brand /><span>FC 26 · Auction night</span></header>
      <section className="login-hero">
        <div className="eyebrow"><Sparkles size={14} /> Your squad starts here</div>
        <h1>Pick your side.<br /><em>Build your legacy.</em></h1>
        <p>Organizer-built rosters. Live captain rooms. One shared auction night.<br />Absolutely no friendships guaranteed.</p>
      </section>
      <section className="login-card">
        <div className="login-card-top">
          <div>
            <span className="step-label">Demo access</span>
            <h2>Enter Tournament HQ</h2>
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
        ) : (
          <>
            <label className="field-label">{role === 'captain' ? 'Choose your captain profile' : 'Choose your player profile'}</label>
            {role === 'captain' && !hasCaptains ? (
              <div className="organizer-login-note"><Trophy size={21} /><span><strong>No captain profiles yet</strong><small>The organizer needs to create a tournament and promote players to captain.</small></span></div>
            ) : role === 'player' && !hasPlayers ? (
              <div className="organizer-login-note"><UserPlus size={21} /><span><strong>No player profiles yet</strong><small>The organizer needs to add players to a roster before player login is available.</small></span></div>
            ) : (
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
            )}
          </>
        )}
        <button className="primary full" disabled={!canEnter} onClick={() => onLogin({ role, id: role === 'organizer' ? 'organizer' : role === 'captain' ? selected : playerSelected })}>
          Enter as {role === 'organizer' ? 'organizer' : role} <ArrowRight size={18} />
        </button>
        <p className="login-note">No password needed in this prototype. Real authentication comes with the shared backend.</p>
      </section>
      <footer className="login-footer">
        <span><span className="live-dot" /> Lobby opens Friday · 8:30 PM</span>
        <span>Organizer-managed roster · 1 champion</span>
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
Kazi,ST,CAM`;

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

function TournamentSelector({ user, state, onSelect, onLogout }) {
  return (
    <main className="tournament-select-page">
      <header className="standalone-header"><Brand /><button className="ghost" onClick={onLogout}><LogOut size={16} /> Sign out</button></header>
      <section className="selector-heading"><span className="page-kicker">Step 02 · Tournament access</span><h1>Choose your competition.</h1><p>Your profile stays the same. Each tournament has its own player pool, squads, budgets, and auction.</p></section>
      <div className="tournament-card-grid">
        {state.tournaments.map((tournament) => {
          const playerIds = state.tournamentPlayerIds[tournament.id] || [];
          const started = tournament.status === 'active';
          const tourCaptains = tournament.captains || [];
          const isCaptain = tourCaptains.some((c) => c.id === user.id);
          const isPlayer = playerIds.includes(user.id);
          const eligible = user.role === 'captain' ? isCaptain : isPlayer;
          return (
            <article className={`tournament-select-card ${started && eligible ? 'available' : ''}`} key={tournament.id}>
              <div className="tournament-card-top"><span className={`tournament-status ${tournament.status}`}>{started ? <><span className="live-dot" /> Started</> : 'Draft'}</span><Trophy size={23} /></div>
              <h2>{tournament.name}</h2>
              <div className="tournament-meta"><span><CalendarDays size={14} /> {new Date(`${tournament.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><span><UsersRound size={14} /> {playerIds.length} players</span></div>
              <div className="tournament-rules"><span>{tournament.format}</span><span>{tournament.captainCount} captains</span><span>{money(tournament.budget)} coins</span></div>
              <button className="primary full" disabled={!started || !eligible} onClick={() => onSelect(tournament.id)}>
                {!started ? 'Not started' : eligible ? <>Select tournament <ArrowRight size={17} /></> : user.role === 'captain' ? 'Not a captain in this tournament' : 'Not registered in this pool'}
              </button>
            </article>
          );
        })}
      </div>
    </main>
  );
}

function OrganizerAuctionPanel({ tournament, state, updateState }) {
  const auction = state.tournamentAuctions[tournament.id] || createAuction();
  const tCapData = state.tournamentCaptainData[tournament.id] || {};
  const captains = tournament.captains || [];
  const soldIds = new Set(Object.values(tCapData).flatMap((item) => item.squad || []));
  const teamSize = tournament.teamSize || Math.floor(Number(tournament.totalPlayers || 16) / Number(tournament.captainCount)) || 4;

  const [schedTime, setSchedTime] = useState(auction.scheduledTime || '');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!auction.countdownEndTime) {
      setTimeLeft(0);
      return undefined;
    }
    const updateTime = () => {
      const remaining = Math.max(0, Math.ceil((auction.countdownEndTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    updateTime();
    const interval = setInterval(updateTime, 250);
    return () => clearInterval(interval);
  }, [auction.countdownEndTime]);

  const saveScheduledTime = () => {
    updateState((draft) => {
      if (!draft.tournamentAuctions[tournament.id]) {
        draft.tournamentAuctions[tournament.id] = createAuction();
      }
      draft.tournamentAuctions[tournament.id].scheduledTime = schedTime;
    });
  };

  const startAuction = () => {
    updateState((draft) => {
      if (!draft.tournamentAuctions[tournament.id]) {
        draft.tournamentAuctions[tournament.id] = createAuction();
      }
      draft.tournamentAuctions[tournament.id].phase = 'priority-setup';
    });
  };

  const triggerStartRound = () => {
    updateState((draft) => {
      const tourId = tournament.id;
      const tState = draft.tournamentCaptainData[tourId] || {};
      const targetTour = draft.tournaments.find((t) => t.id === tourId);
      const caps = targetTour?.captains || [];
      const sold = new Set(Object.values(tState).flatMap((data) => data.squad || []));

      // Collect all priority picks from active captains
      const picks = [];
      caps.forEach((cap) => {
        const shortlist = tState[cap.id]?.shortlist || [];
        const activePicks = shortlist.filter((pid) => !sold.has(pid));
        picks.push(...activePicks);
      });

      // Count occurrences of each player ID in the shortlists
      const counts = {};
      picks.forEach((pid) => {
        counts[pid] = (counts[pid] || 0) + 1;
      });

      // Split into conflicts (>1 vote) and uniques (1 vote)
      const conflicts = [];
      const uniques = [];
      Object.entries(counts).forEach(([pid, count]) => {
        if (count > 1) {
          conflicts.push(pid);
        } else {
          uniques.push(pid);
        }
      });

      const shuffle = (arr) => {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
      };

      const order = [...shuffle(conflicts), ...shuffle(uniques)];

      if (order.length > 0) {
        draft.tournamentAuctions[tourId].order = order;
        const nextPlayerId = order.shift();
        draft.tournamentAuctions[tourId].order = order;
        draft.tournamentAuctions[tourId].phase = 'bidding';
        draft.tournamentAuctions[tourId].playerId = nextPlayerId;
        draft.tournamentAuctions[tourId].bid = 50;
        draft.tournamentAuctions[tourId].leaderId = null;
        
        const pName = draft.players.find((p) => p.id === nextPlayerId)?.tag || 'Player';
        draft.tournamentAuctions[tourId].history.unshift({
          type: 'nomination',
          text: `${pName} nominated automatically at 50 coins`
        });
      } else {
        alert("No priority players selected by any captain!");
      }
    });
  };

  const rivalBid = () => {
    updateState((draft) => {
      const tourId = tournament.id;
      const tAuction = draft.tournamentAuctions[tourId];
      const tCapData = draft.tournamentCaptainData[tourId];
      const squadSize = (captainId, data) => 1 + new Set((data.squad || []).filter((pid) => pid !== captainId)).size;
      
      const rivalPrice = tAuction.leaderId ? tAuction.bid + 25 : 50;
      const rivals = tournament.captains.filter((captain) => (
        captain.id !== tAuction.leaderId
        && tCapData[captain.id].budget >= rivalPrice
        && squadSize(captain.id, tCapData[captain.id]) < teamSize
      ));
      if (!rivals.length) return;
      const rival = rivals[Math.floor(Math.random() * rivals.length)];
      tAuction.bid = rivalPrice;
      tAuction.leaderId = rival.id;
      tAuction.countdownEndTime = null;
      tAuction.history.unshift({ type: 'bid', text: `${rival.handle || rival.tag || ''} bid ${tAuction.bid}` });
    });
  };

  const sellPlayer = () => {
    updateState((draft) => {
      const tourId = tournament.id;
      const tAuction = draft.tournamentAuctions[tourId];
      const tCapData = draft.tournamentCaptainData[tourId];
      const winner = tAuction.leaderId;
      if (!winner) return;

      const squadSize = (captainId, data) => 1 + new Set((data.squad || []).filter((pid) => pid !== captainId)).size;
      if (squadSize(winner, tCapData[winner]) >= teamSize) return;

      const wonPlayer = draft.players.find((item) => item.id === tAuction.playerId);
      tCapData[winner].budget -= tAuction.bid;
      tCapData[winner].squad.push(tAuction.playerId);
      
      Object.values(tCapData).forEach((data) => {
        data.shortlist = data.shortlist.filter((id) => id !== tAuction.playerId);
      });

      const saleEntry = { type: 'sale', text: `${wonPlayer?.tag} signed by ${getClubInfo(tournament.captains.find((c) => c.id === winner)).name}` };
      
      const order = tAuction.order || [];
      const sold = new Set(Object.values(tCapData).flatMap((d) => d.squad || []));
      const remainingOrder = order.filter((pid) => !sold.has(pid));
      const unsoldPlayers = draft.players.filter((p) => !sold.has(p.id) && !tournament.captains.some(cap => cap.id === p.id));
      const openTeams = tournament.captains.filter((cap) => squadSize(cap.id, tCapData[cap.id]) < teamSize);

      if (openTeams.length === 0 || unsoldPlayers.length === 0) {
        draft.tournamentAuctions[tourId] = {
          phase: 'complete',
          votes: {},
          playerId: null,
          bid: 0,
          leaderId: null,
          history: [{ type: 'complete', text: 'Auction complete · All squads set' }, saleEntry, ...tAuction.history]
        };
      } else if (remainingOrder.length > 0) {
        const nextPlayerId = remainingOrder.shift();
        draft.tournamentAuctions[tourId] = {
          ...tAuction,
          phase: 'bidding',
          playerId: nextPlayerId,
          bid: 50,
          leaderId: null,
          order: remainingOrder,
          history: [
            { type: 'nomination', text: `${draft.players.find((p) => p.id === nextPlayerId)?.tag} nominated at 50 coins` },
            saleEntry,
            ...tAuction.history
          ]
        };
      } else {
        const tPlayerIds = new Set(draft.tournamentPlayerIds[tourId] || []);
        const unsoldPool = draft.players.filter((p) => tPlayerIds.has(p.id) && !sold.has(p.id) && !tournament.captains.some(cap => cap.id === p.id));
        if (unsoldPool.length > 0) {
          const shuffled = unsoldPool.sort(() => Math.random() - 0.5);
          const firstPlayer = shuffled[0];
          const remainingUnsoldIds = shuffled.slice(1).map((p) => p.id);
          draft.tournamentAuctions[tourId] = {
            ...tAuction,
            phase: 'bidding',
            playerId: firstPlayer.id,
            bid: 50,
            leaderId: null,
            order: remainingUnsoldIds,
            history: [
              { type: 'nomination', text: `${firstPlayer.tag} nominated at 50 coins (automatic pool queue)` },
              saleEntry,
              ...tAuction.history
            ]
          };
        } else {
          draft.tournamentAuctions[tourId] = {
            phase: 'complete',
            votes: {},
            playerId: null,
            bid: 0,
            leaderId: null,
            history: [{ type: 'complete', text: 'Auction complete · All squads set' }, saleEntry, ...tAuction.history]
          };
        }
      }
    });
  };

  const passPlayer = () => {
    updateState((draft) => {
      const tourId = tournament.id;
      const tAuction = draft.tournamentAuctions[tourId];
      const tCapData = draft.tournamentCaptainData[tourId];
      const passed = draft.players.find((item) => item.id === tAuction.playerId);
      const passEntry = { type: 'pass', text: `${passed?.tag || 'Player'} passed · no sale, back in the pool` };

      const order = tAuction.order || [];
      const sold = new Set(Object.values(tCapData).flatMap((d) => d.squad || []));
      const remainingOrder = order.filter((pid) => !sold.has(pid));
      const squadSize = (captainId, data) => 1 + new Set((data.squad || []).filter((pid) => pid !== captainId)).size;
      const unsoldPlayers = draft.players.filter((p) => !sold.has(p.id) && !tournament.captains.some(cap => cap.id === p.id));
      const openTeams = tournament.captains.filter((cap) => squadSize(cap.id, tCapData[cap.id]) < teamSize);

      if (openTeams.length === 0 || unsoldPlayers.length === 0) {
        draft.tournamentAuctions[tourId] = {
          phase: 'complete',
          votes: {},
          playerId: null,
          bid: 0,
          leaderId: null,
          history: [{ type: 'complete', text: 'Auction complete · All squads set' }, passEntry, ...tAuction.history]
        };
      } else if (remainingOrder.length > 0) {
        const nextPlayerId = remainingOrder.shift();
        draft.tournamentAuctions[tourId] = {
          ...tAuction,
          phase: 'bidding',
          playerId: nextPlayerId,
          bid: 50,
          leaderId: null,
          order: remainingOrder,
          history: [
            { type: 'nomination', text: `${draft.players.find((p) => p.id === nextPlayerId)?.tag} nominated at 50 coins` },
            passEntry,
            ...tAuction.history
          ]
        };
      } else {
        const tPlayerIds = new Set(draft.tournamentPlayerIds[tourId] || []);
        const unsoldPool = draft.players.filter((p) => tPlayerIds.has(p.id) && !sold.has(p.id) && !tournament.captains.some(cap => cap.id === p.id));
        if (unsoldPool.length > 0) {
          const shuffled = unsoldPool.sort(() => Math.random() - 0.5);
          const firstPlayer = shuffled[0];
          const remainingUnsoldIds = shuffled.slice(1).map((p) => p.id);
          draft.tournamentAuctions[tourId] = {
            ...tAuction,
            phase: 'bidding',
            playerId: firstPlayer.id,
            bid: 50,
            leaderId: null,
            order: remainingUnsoldIds,
            history: [
              { type: 'nomination', text: `${firstPlayer.tag} nominated at 50 coins (automatic pool queue)` },
              passEntry,
              ...tAuction.history
            ]
          };
        } else {
          draft.tournamentAuctions[tourId] = {
            phase: 'complete',
            votes: {},
            playerId: null,
            bid: 0,
            leaderId: null,
            history: [{ type: 'complete', text: 'Auction complete · All squads set' }, passEntry, ...tAuction.history]
          };
        }
      }
    });
  };

  const startCountdown = () => {
    updateState((draft) => {
      const tourId = tournament.id;
      if (!draft.tournamentAuctions[tourId]) return;
      draft.tournamentAuctions[tourId].countdownEndTime = Date.now() + 5000;
    });
  };

  useEffect(() => {
    if (auction.phase !== 'bidding' || !auction.countdownEndTime) return undefined;
    
    const interval = setInterval(() => {
      const remaining = auction.countdownEndTime - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        if (auction.leaderId) {
          sellPlayer();
        } else {
          passPlayer();
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [auction.phase, auction.countdownEndTime, auction.leaderId]);

  const resetAuction = () => {
    if (!window.confirm('Reset the entire auction? This will clear all bids, sales, squads, and auction history.')) return;
    updateState((draft) => {
      draft.tournamentAuctions[tournament.id] = createAuction();
      const eligibleIds = new Set(draft.players.map((p) => p.id));
      const targetTour = draft.tournaments.find((t) => t.id === tournament.id);
      const tCaptains = targetTour?.captains || [];
      tCaptains.forEach((captain) => {
        const data = draft.tournamentCaptainData[tournament.id]?.[captain.id];
        if (!data) return;
        data.budget = Number(tournament.budget || 1000);
        data.squad = [];
        data.shortlist = (data.shortlist || []).filter((pid) => eligibleIds.has(pid));
        data.lineup = Object.fromEntries(Object.entries(data.lineup || {}).filter(([, memberId]) => (
          memberId === captain.id || memberId === `captain:${captain.id}`
        )));
      });
    });
  };

  const captainsStatus = captains.map((cap) => {
    const shortlist = tCapData[cap.id]?.shortlist || [];
    const activeShortlistCount = shortlist.filter((pid) => !soldIds.has(pid)).length;
    return {
      id: cap.id,
      name: cap.name,
      handle: cap.handle || cap.tag,
      picksCount: activeShortlistCount,
      ready: activeShortlistCount === 3
    };
  });
  const canStartRound = captainsStatus.some((c) => c.picksCount > 0);

  if (auction.phase === 'scheduled') {
    return (
      <div className="csv-import-panel" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <h3>Schedule Live Auction</h3>
            <p style={{ color: 'var(--muted)', fontSize: '11px', margin: '4px 0 16px' }}>Set the target date and time. This will display for all captains and players.</p>
          </div>
          <label style={{ display: 'grid', gap: '7px' }}>
            <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 600 }}>Auction Date & Time</span>
            <input 
              type="datetime-local" 
              value={schedTime} 
              onChange={(e) => setSchedTime(e.target.value)} 
              style={{ width: '100%', padding: '12px', background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '8px', fontSize: '11px' }}
            />
          </label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="primary" onClick={saveScheduledTime} style={{ padding: '10px 20px', fontSize: '11px' }}><BadgeCheck size={16} /> Save Schedule</button>
            <button className="primary" onClick={startAuction} disabled={!schedTime} style={{ padding: '10px 20px', fontSize: '11px' }}><Play size={16} /> Start Auction</button>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--line)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4>Status Check</h4>
          <p style={{ fontSize: '10px', color: 'var(--muted)' }}>Captains will not be able to enter the bidding room until the auction is officially started.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <Clock3 size={15} style={{ color: 'var(--lime)' }} />
            <span>Scheduled: <strong>{auction.scheduledTime ? new Date(auction.scheduledTime).toLocaleString() : 'TBD'}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  if (auction.phase === 'priority-setup') {
    return (
      <div className="csv-import-panel" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <h3>Nomination Round Setup</h3>
            <p style={{ color: 'var(--muted)', fontSize: '11px', margin: '4px 0 16px' }}>Captains are currently picking their 3 priority players. Once picks are ready, click "Start Round".</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--card)', border: '1px solid var(--line)', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '11px' }}>Captain Checklist</h4>
            {captainsStatus.map((c) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span><strong>{c.handle}</strong> ({c.name})</span>
                <span style={{ color: c.ready ? 'var(--lime)' : '#ffb96e', fontWeight: 'bold' }}>
                  {c.ready ? '🟢 Ready (3/3)' : `🟡 Choosing (${c.picksCount}/3)`}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="primary" onClick={triggerStartRound} disabled={!canStartRound} style={{ padding: '10px 20px', fontSize: '11px' }}><Play size={16} /> Start Round</button>
            <button className="ghost btn-danger btn-xs" onClick={resetAuction} style={{ marginLeft: 'auto' }}><RotateCcw size={13} /> Reset auction</button>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--line)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4>Lot Queuing Rules</h4>
          <p style={{ fontSize: '9px', color: 'var(--muted)', lineHeight: '1.4' }}>
            1. <strong>Conflicts first:</strong> Players shortlisted by more than 1 captain are pooled and shuffled to be auctioned first.<br/><br/>
            2. <strong>Uniques second:</strong> Players shortlisted by exactly 1 captain are shuffled and auctioned after conflicts.
          </p>
        </div>
      </div>
    );
  }

  if (auction.phase === 'bidding') {
    const activePlayer = state.players.find((p) => p.id === auction.playerId);
    const leader = captains.find((c) => c.id === auction.leaderId);
    return (
      <div className="csv-import-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
          <div>
            <h3>Live Bidding Console (Auctioneer View)</h3>
            <p style={{ color: 'var(--muted)', fontSize: '11px' }}>Manage the active bidding lot, trigger rival bids, and award/pass players.</p>
          </div>
          <button className="ghost btn-danger btn-xs" onClick={resetAuction}><RotateCcw size={13} /> Reset auction</button>
        </div>
        <div className="auction-stage" style={{ background: 'transparent', padding: 0 }}>
          <div className="auction-layout" style={{ margin: 0 }}>
            {activePlayer && (
              <section className="lot-card">
                <div className="lot-stripe" />
                <span className="lot-label">Now on the block</span>
                <Avatar person={activePlayer} size="xl" />
                <h1>{activePlayer.tag}</h1><p>{activePlayer.name}</p>
                <div className="lot-stats"><span><b>{activePlayer.primary}</b> Position</span></div>
              </section>
            )}
            <section className="bid-console" style={{ background: 'var(--panel)', padding: '24px', borderRadius: '14px' }}>
              <span className="page-kicker">Current bid</span>
              <div className="big-bid" style={{ fontSize: '36px' }}><Coins size={33} /> {auction.bid}</div>
              <div className={`leading-bid ${leader ? 'has-leader' : ''}`}>
                {leader ? <><ClubMark club={getClubInfo(leader)} size="xs" /><span><small>Leading bid</small><strong>{getClubInfo(leader).name}</strong></span></> : <><Clock3 size={19} /><span><small>Opening price</small><strong>Waiting for first bid</strong></span></>}
              </div>
              
              <div className="demo-controls" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', border: 0, padding: 0 }}>
                {timeLeft > 0 ? (
                  <div className="countdown-alert" style={{ background: '#ff3b30', color: '#fff', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <Clock3 size={15} /> Closing in {timeLeft}s
                  </div>
                ) : (
                  <button className="primary" onClick={startCountdown} style={{ background: '#ff9500', color: '#fff', border: '1px solid rgba(255,149,0,0.2)' }}><Clock3 size={15} /> Start Countdown (5s)</button>
                )}
                <button className="primary" onClick={rivalBid} style={{ background: 'var(--lime-dark)', color: 'var(--lime)', border: '1px solid rgba(217,255,99,0.2)' }}><Sparkles size={16} /> Simulate rival +25</button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button className="primary" onClick={sellPlayer} disabled={!leader}>Close &amp; award player</button>
                  <button className="secondary" onClick={passPlayer}>Pass · no sale</button>
                </div>
              </div>
            </section>
            <aside className="standings-card">
              <h2>Captain budgets</h2>
              {captains.map((cap) => {
                const cData = tCapData[cap.id] || { squad: [], budget: 0 };
                const club = getClubInfo(cap);
                const filled = 1 + new Set((cData.squad || []).filter((pid) => pid !== cap.id)).size;
                const isFull = filled >= teamSize;
                return (
                  <div className={auction.leaderId === cap.id ? 'leading' : ''} key={cap.id}>
                    <ClubMark club={club} size="xs" />
                    <span>
                      <strong>{club.name}</strong>
                      {isFull
                        ? <small className="squad-dots-complete">COMPLETE</small>
                        : <span className="squad-dots">{Array.from({ length: teamSize }, (_, i) => <span key={i} className={i < filled ? 'squad-dot filled' : 'squad-dot'} />)}</span>
                      }
                    </span>
                    <b>{money(cData.budget)}</b>
                  </div>
                );
              })}
              <div className="history">
                <h3>Room activity</h3>
                {auction.history.slice(0, 4).map((item, idx) => <p key={idx}><span />{item.text}</p>)}
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (auction.phase === 'complete') {
    return (
      <div className="csv-import-panel" style={{ padding: '20px', textAlign: 'center' }}>
        <Crown size={48} style={{ color: 'var(--lime)', marginBottom: '16px' }} />
        <h3>Auction Complete</h3>
        <p style={{ color: 'var(--muted)', margin: '8px 0 20px' }}>All squads have been finalized. The captains can now go to the Tournament Hub to confirm their line-ups.</p>
        <button className="secondary" onClick={resetAuction}><RotateCcw size={16} /> Reset Auction</button>
      </div>
    );
  }

  return null;
}

function OrganizerDashboard({ state, updateState, onLogout }) {
  const [selectedId, setSelectedId] = useState(state.tournaments[0]?.id);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', date: todayInputDate(), teamSize: 4, captainCount: 4, budget: 1000 });
  const [csvRows, setCsvRows] = useState([]);
  const [importMessage, setImportMessage] = useState('');
  
  // New States
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', date: '', teamSize: 4, captainCount: 4, budget: 1000 });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [manualPlayer, setManualPlayer] = useState({ name: '', primary: 'CM', secondary: 'CM' });
  const [orgTab, setOrgTab] = useState('roster');

  useEffect(() => {
    setOrgTab('roster');
  }, [selectedId]);

  const tournament = state.tournaments.find((item) => item.id === selectedId) || state.tournaments[0];
  const playerIds = state.tournamentPlayerIds[tournament?.id] || [];
  const tournamentPlayers = state.players.filter((player) => playerIds.includes(player.id));

  const tournamentState = tournament ? {
    players: auctionEligiblePlayers(state.players.filter((player) => playerIds.includes(player.id)), tournament.captains || []),
    captainData: state.tournamentCaptainData[tournament.id],
    auction: state.tournamentAuctions[tournament.id],
    competition: state.tournamentCompetitions?.[tournament.id] || createCompetition(),
    captains: tournament.captains || [],
    teamSize: getTournamentTeamSize(tournament),
  } : null;

  const updateTournamentState = (recipe) => updateState((draft) => {
    const tourId = tournament.id;
    if (!draft.tournamentCompetitions) draft.tournamentCompetitions = {};
    const ids = new Set(draft.tournamentPlayerIds[tourId] || []);
    const targetTournament = draft.tournaments.find((t) => t.id === tourId);
    const scopedCaptains = targetTournament ? (targetTournament.captains || []) : [];
    const scoped = {
      players: auctionEligiblePlayers(draft.players.filter((player) => ids.has(player.id)), scopedCaptains),
      captainData: draft.tournamentCaptainData[tourId],
      auction: draft.tournamentAuctions[tourId],
      competition: draft.tournamentCompetitions[tourId] || createCompetition(),
      captains: scopedCaptains,
      teamSize: getTournamentTeamSize(targetTournament),
    };
    recipe(scoped);
    const scopedMap = new Map(scoped.players.map((player) => [player.id, player]));
    draft.players = draft.players.map((player) => scopedMap.get(player.id) || player);
    scoped.players.forEach((player) => { if (!draft.players.some((item) => item.id === player.id)) draft.players.push(player); });
    draft.tournamentCaptainData[tourId] = scoped.captainData;
    draft.tournamentAuctions[tourId] = scoped.auction;
    draft.tournamentCompetitions[tourId] = scoped.competition;
  });

  const createTournament = () => {
    if (!form.name.trim()) return;
    const id = `t-${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString(36)}`;
    const teamSize = Number(form.teamSize);
    const totalPlayers = Number(form.captainCount) * teamSize;
    updateState((draft) => {
      draft.tournaments.push({
        name: form.name,
        date: form.date,
        totalPlayers: totalPlayers,
        teamSize: teamSize,
        captainCount: Number(form.captainCount),
        budget: Number(form.budget),
        id,
        format: `${teamSize}v${teamSize}`,
        status: 'draft',
        captains: []
      });
      draft.tournamentPlayerIds[id] = [];
      draft.tournamentCaptainData[id] = {};
      draft.tournamentAuctions[id] = createAuction();
      draft.tournamentCompetitions[id] = createCompetition();
    });
    setSelectedId(id); setShowCreate(false); setForm({ name: '', date: todayInputDate(), teamSize: 4, captainCount: 4, budget: 1000 });
  };

  const deleteTournament = (id) => {
    updateState((draft) => {
      draft.tournaments = draft.tournaments.filter((item) => item.id !== id);
      delete draft.tournamentPlayerIds[id];
      delete draft.tournamentCaptainData[id];
      delete draft.tournamentAuctions[id];
      delete draft.tournamentCompetitions[id];

      // Cleanup orphaned players
      const activePlayerIds = new Set();
      Object.values(draft.tournamentPlayerIds || {}).forEach((playerIds) => {
        (playerIds || []).forEach((pid) => activePlayerIds.add(pid));
      });
      draft.players = (draft.players || []).filter((player) => activePlayerIds.has(player.id));
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
        target.status = 'draft';
        target.time = ''; // Clear start time on reset
        target.captains = []; // Clear custom captains on reset
      }
      draft.tournamentPlayerIds[tournament.id] = [];
      draft.tournamentCaptainData[tournament.id] = {};
      draft.tournamentAuctions[tournament.id] = createAuction();
      draft.tournamentCompetitions[tournament.id] = createCompetition();

      // Cleanup orphaned players
      const activePlayerIds = new Set();
      Object.values(draft.tournamentPlayerIds || {}).forEach((playerIds) => {
        (playerIds || []).forEach((pid) => activePlayerIds.add(pid));
      });
      draft.players = (draft.players || []).filter((player) => activePlayerIds.has(player.id));
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
      captainCount: tournament.captainCount,
      budget: tournament.budget
    });
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) return;
    const teamSize = Number(editForm.teamSize);
    const totalPlayers = Number(editForm.captainCount) * teamSize;
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (target) {
        target.name = editForm.name;
        target.date = editForm.date;
        if (target.status === 'draft') {
          target.totalPlayers = totalPlayers;
          target.teamSize = teamSize;
          target.captainCount = Number(editForm.captainCount);
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

      // Cleanup orphaned players
      const activePlayerIds = new Set();
      Object.values(draft.tournamentPlayerIds || {}).forEach((playerIds) => {
        (playerIds || []).forEach((pid) => activePlayerIds.add(pid));
      });
      draft.players = (draft.players || []).filter((player) => activePlayerIds.has(player.id));
    });
  };

  const toggleCaptain = (player) => {
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
          color,
          profileReady: false,
          profileUpdatedAt: null
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

  const startTournament = () => {
    const required = Number(tournament.captainCount || 4);
    const current = tournament.captains?.length || 0;
    if (current !== required) {
      alert(`Please select exactly ${required} captains from the roster first. (Currently: ${current} selected)`);
      return;
    }
    const requiredPlayers = Number(tournament.totalPlayers || (tournament.captainCount * tournament.teamSize));
    const registeredCount = playerIds.length;
    if (registeredCount < requiredPlayers) {
      alert(`Cannot start tournament. You must have at least ${requiredPlayers} players registered on the roster first to fill all ${tournament.captainCount} teams of size ${tournament.teamSize}. (Currently: ${registeredCount} registered)`);
      return;
    }
    updateState((draft) => {
      const target = draft.tournaments.find((item) => item.id === tournament.id);
      if (target) target.status = 'active';
    });
  };

  const simulateAuction = () => {
    const required = Number(tournament.captainCount || 4);
    const current = tournament.captains?.length || 0;
    if (current !== required) {
      alert(`Please select exactly ${required} captains from the roster first. (Currently: ${current} selected)`);
      return;
    }
    const requiredPlayers = Number(tournament.totalPlayers || (tournament.captainCount * tournament.teamSize));
    const registeredCount = playerIds.length;
    if (registeredCount < requiredPlayers) {
      alert(`Cannot start auto-draft. You must have at least ${requiredPlayers} players registered on the roster first to fill all ${tournament.captainCount} teams of size ${tournament.teamSize}. (Currently: ${registeredCount} registered)`);
      return;
    }
    if (!window.confirm("This will auto-draft all registered players to the captains' squads, schedule the double round-robin fixtures, and complete the auction phase. Continue?")) return;

    updateState((draft) => {
      const tourId = tournament.id;
      const target = draft.tournaments.find((item) => item.id === tourId);
      if (target) target.status = 'active';

      const tCapData = draft.tournamentCaptainData[tourId] || {};
      tournament.captains.forEach((cap) => {
        tCapData[cap.id] = {
          formation: '4-3-3',
          shortlist: [],
          budget: tournament.budget,
          squad: [],
          lineup: { GK: `captain:${cap.id}` },
          squadConfirmed: true
        };
      });
      draft.tournamentCaptainData[tourId] = tCapData;

      const tPlayerIds = draft.tournamentPlayerIds[tourId] || [];
      const eligible = tPlayerIds.filter((pid) => !tournament.captains.some((cap) => cap.id === pid));
      const shuffled = [...eligible].sort(() => Math.random() - 0.5);

      const teamSizeLimit = tournament.teamSize || 11;
      let capIndex = 0;
      
      shuffled.forEach((pid) => {
        let attempts = 0;
        while (attempts < tournament.captains.length) {
          const cap = tournament.captains[capIndex];
          const capData = tCapData[cap.id];
          const filled = 1 + new Set((capData.squad || []).filter((id) => id !== cap.id)).size;
          if (filled < teamSizeLimit) {
            capData.squad.push(pid);
            const cost = Math.min(capData.budget - 25, Math.floor(Math.random() * 4 + 2) * 25);
            capData.budget = Math.max(0, capData.budget - cost);
            
            const positions = ['CB', 'LB', 'RB', 'CM', 'LM', 'RM', 'ST', 'LW', 'RW'];
            const assignedPositions = Object.keys(capData.lineup);
            const nextPos = positions.find((pos) => !assignedPositions.includes(pos));
            if (nextPos) {
              capData.lineup[nextPos] = pid;
            }

            capIndex = (capIndex + 1) % tournament.captains.length;
            break;
          }
          capIndex = (capIndex + 1) % tournament.captains.length;
          attempts++;
        }
      });

      draft.tournamentAuctions[tourId] = {
        phase: 'complete',
        votes: {},
        playerId: null,
        bid: 0,
        leaderId: null,
        history: [{ type: 'complete', text: 'Auction completed via Organizer Simulation' }],
        order: [],
        countdownEndTime: null,
        lastBidTime: 0
      };

      const capIds = tournament.captains.map((cap) => cap.id);
      if (!draft.tournamentCompetitions[tourId]) {
        draft.tournamentCompetitions[tourId] = createCompetition();
      }
      draft.tournamentCompetitions[tourId].phase = 'league';
      draft.tournamentCompetitions[tourId].matches = createLeagueFixtures(capIds);
      draft.tournamentCompetitions[tourId].playerStats = [];
    });
    setOrgTab('tournament');
  };

  const readyAllPlayerProfiles = () => {
    updateState((draft) => {
      const ids = new Set(draft.tournamentPlayerIds[tournament.id] || []);
      draft.players = draft.players.map((player) => {
        if (ids.has(player.id)) {
          return {
            ...player,
            profileReady: true,
            profileUpdatedAt: new Date().toISOString()
          };
        }
        return player;
      });
    });
  };

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
            color: palette[index % palette.length],
            profileReady: false,
            profileUpdatedAt: null
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
      + "Kazi,ST,CAM";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "roster_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadBackup = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const dateStr = new Date().toISOString().slice(0, 10);
      const exportFileDefaultName = `fc_auction_backup_${dateStr}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      alert("Failed to generate backup file: " + err.message);
    }
  };

  const uploadBackup = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        
        if (!parsed.tournaments || !Array.isArray(parsed.tournaments)) {
          throw new Error("Invalid backup: 'tournaments' array is missing.");
        }
        if (!parsed.players || !Array.isArray(parsed.players)) {
          throw new Error("Invalid backup: 'players' array is missing.");
        }
        if (!parsed.tournamentPlayerIds || typeof parsed.tournamentPlayerIds !== 'object') {
          throw new Error("Invalid backup: 'tournamentPlayerIds' map is missing.");
        }
        if (!parsed.tournamentCaptainData || typeof parsed.tournamentCaptainData !== 'object') {
          throw new Error("Invalid backup: 'tournamentCaptainData' map is missing.");
        }
        if (!parsed.tournamentAuctions || typeof parsed.tournamentAuctions !== 'object') {
          throw new Error("Invalid backup: 'tournamentAuctions' map is missing.");
        }

        if (!window.confirm("Warning: Uploading this backup will completely replace your current tournaments, rosters, draft states, and match stats. Do you want to continue?")) {
          return;
        }

        updateState((draft) => {
          draft.players = parsed.players;
          draft.tournaments = parsed.tournaments;
          draft.tournamentPlayerIds = parsed.tournamentPlayerIds;
          draft.tournamentCaptainData = parsed.tournamentCaptainData;
          draft.tournamentAuctions = parsed.tournamentAuctions;
          draft.tournamentCompetitions = parsed.tournamentCompetitions || {};
        });

        alert("Backup restored successfully!");
        if (parsed.tournaments.length > 0) {
          setSelectedId(parsed.tournaments[0].id);
        }
      } catch (err) {
        alert("Failed to restore backup: " + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <main className="organizer-page">
      <header className="standalone-header"><Brand /><div><span className="organizer-badge"><Shield size={14} /> Organizer</span><button className="ghost" onClick={onLogout}><LogOut size={16} /> Sign out</button></div></header>
      <div className="organizer-layout">
        <aside className="tournament-list-panel">
          <div className="organizer-section-head"><div><span className="page-kicker">Tournament control</span><h1>Competitions</h1></div><button className="primary icon-only" aria-label="Create tournament" onClick={() => setShowCreate((value) => !value)}><Plus size={18} /></button></div>
          {showCreate && (
            <div className="create-tournament-form">
              <label><span>Tournament name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Auction Night" /></label>
              <div className="form-row">
                <label><span>Start Date</span><input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
                <label><span>Captains</span><input type="number" min="2" max="8" value={form.captainCount} onChange={(event) => setForm({ ...form, captainCount: event.target.value })} /></label>
              </div>
              <div className="form-row">
                <label><span>Team Size</span><input type="number" min="2" value={form.teamSize} onChange={(event) => setForm({ ...form, teamSize: event.target.value })} /></label>
                <label><span>Coin budget</span><input type="number" min="100" step="50" value={form.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} /></label>
              </div>
              <div className="team-size-calc-helper">
                Total Players: {Number(form.captainCount) * Number(form.teamSize)} · {form.captainCount} Teams
              </div>
              <button className="primary full" onClick={createTournament}>Create tournament</button>
            </div>
          )}
          <div className="organizer-tournament-list">
            {state.tournaments.map((item) => (
              <button key={item.id} className={selectedId === item.id ? 'active' : ''} onClick={() => { setSelectedId(item.id); setCsvRows([]); setImportMessage(''); setIsEditing(false); setDeleteConfirm(false); setShowAddPlayer(false); }}>
                <span className={`tournament-dot ${item.status}`} />
                <span><strong>{item.name}</strong><small>{item.status === 'active' ? 'Started' : 'Draft'} · {item.date}</small></span>
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
          <div className="backup-restore-panel" style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="page-kicker" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Maintenance &amp; Backup</span>
            <button className="secondary full btn-xs" onClick={downloadBackup} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', padding: '8px' }}><Download size={14} /> Download Backup (JSON)</button>
            <label className="secondary button full btn-xs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', padding: '8px', cursor: 'pointer', textAlign: 'center', border: '1px dashed var(--line)', background: 'var(--card)' }}>
              <Upload size={14} /> Upload Backup (JSON)
              <input type="file" accept=".json" onChange={uploadBackup} style={{ display: 'none' }} />
            </label>
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
                  {tournament.status === 'draft' ? (
                    <label><span>Captains</span><input type="number" min="2" max="8" value={editForm.captainCount} onChange={(e) => setEditForm({...editForm, captainCount: e.target.value})} /></label>
                  ) : (
                    <label><span>Captains</span><input type="number" disabled value={tournament.captainCount} /></label>
                  )}
                </div>
                {tournament.status === 'draft' ? (
                  <>
                    <div className="form-row">
                      <label><span>Team Size</span><input type="number" min="2" value={editForm.teamSize} onChange={(e) => setEditForm({...editForm, teamSize: e.target.value})} /></label>
                      <label><span>Coin Budget</span><input type="number" min="100" step="50" value={editForm.budget} onChange={(e) => setEditForm({...editForm, budget: e.target.value})} /></label>
                    </div>
                    <div className="team-size-calc-helper">
                      Total Players: {Number(editForm.captainCount) * Number(editForm.teamSize)} · {editForm.captainCount} Teams
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-row">
                      <label><span>Team Size</span><input type="number" disabled value={tournament.teamSize || Math.floor(Number(tournament.totalPlayers || 16) / Number(tournament.captainCount))} /></label>
                      <label><span>Coin Budget</span><input type="number" disabled value={tournament.budget} /></label>
                    </div>
                    <p className="locked-warning">⚠️ Team size, captains, and budget are locked for active tournaments.</p>
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
                  <span className={`tournament-status ${tournament.status}`}>{tournament.status === 'active' ? 'Tournament started' : 'Draft setup'}</span>
                  <h2>{tournament.name}</h2>
                  <p>{tournament.format} · {tournament.captainCount} captains · {money(tournament.budget)} coins each · Start Date: {tournament.date}</p>
                </div>
                <div className="control-actions">
                  {tournament.status === 'draft' ? (
                    <>
                      <button className="primary" onClick={startTournament}><Play size={17} /> Start tournament</button>
                      <button className="secondary" onClick={simulateAuction}><Sparkles size={17} /> Auto-draft &amp; Start Tournament</button>
                    </>
                  ) : (
                    <>
                      <button className="secondary" onClick={resetTournament}><RotateCcw size={17} /> Reset to Draft</button>
                      {tournamentState?.auction?.phase !== 'complete' && (
                        <button className="secondary" onClick={simulateAuction}><Sparkles size={17} /> Auto-draft &amp; Complete Auction</button>
                      )}
                    </>
                  )}
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
            <div className="control-stats"><div><span>Registered players</span><strong>{tournamentPlayers.length}</strong></div><div><span>Captain slots</span><strong>{tournament.captainCount}</strong></div><div><span>Auction budget</span><strong>{money(tournament.budget)}</strong></div></div>
            <div className="active-tournament-management">
              <div className="org-tabs">
                <button className={orgTab === 'roster' ? 'active' : ''} onClick={() => setOrgTab('roster')}><UsersRound size={16} /> Registered Players ({tournamentPlayers.length})</button>
                {tournament.status === 'draft' && (
                  <button className={orgTab === 'csv' ? 'active' : ''} onClick={() => setOrgTab('csv')}><FileSpreadsheet size={16} /> CSV Import</button>
                )}
                {tournament.status === 'active' && (
                  <>
                    <button className={orgTab === 'tournament' ? 'active' : ''} onClick={() => setOrgTab('tournament')}><Trophy size={16} /> Tournament</button>
                    <button className={orgTab === 'auction' ? 'active' : ''} onClick={() => setOrgTab('auction')}><Radio size={16} /> Live Auction</button>
                  </>
                )}
              </div>
              {orgTab === 'csv' && tournament.status === 'draft' ? (
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
              ) : orgTab === 'auction' && tournament.status === 'active' ? (
                <OrganizerAuctionPanel tournament={tournament} state={state} updateState={updateState} />
              ) : orgTab === 'tournament' && tournament.status === 'active' ? (
                <TournamentHub user={{ role: 'organizer', id: 'organizer' }} state={tournamentState} updateState={updateTournamentState} />
              ) : (
                <div className="roster-management-panel">
                  <div className="roster-header">
                    <div>
                      <h3>Tournament Roster</h3>
                      <p>{tournamentPlayers.length} players currently registered in this competition.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {tournamentPlayers.some(p => !isPlayerProfileReady(p)) && (
                        <button className="secondary" onClick={readyAllPlayerProfiles}>
                          <BadgeCheck size={15} /> Ready All Profiles
                        </button>
                      )}
                      {tournament.status === 'draft' ? (
                        <button className="secondary" onClick={() => setShowAddPlayer(!showAddPlayer)}>{showAddPlayer ? <X size={15} /> : <UserPlus size={15} />} {showAddPlayer ? 'Cancel' : 'Add Player'}</button>
                      ) : (
                        <span className="roster-status-locked" style={{ fontSize: '12px', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '6px' }}>🔒 Roster Locked</span>
                      )}
                    </div>
                  </div>
                  {showAddPlayer && tournament.status === 'draft' && (
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
                      <div className="roster-list-header" style={{ gridTemplateColumns: tournament.status === 'draft' ? '2fr 1.2fr 1.5fr 80px' : '2fr 1.2fr 1.5fr' }}>
                        <span>Player Details</span>
                        <span>Positions</span>
                        <span>{tournament.status === 'draft' ? 'Captain Team' : 'Assigned Team'}</span>
                        {tournament.status === 'draft' && <span>Action</span>}
                      </div>
                      <div className="roster-list-body">
                        {tournamentPlayers.map((player) => {
                          const isCap = tournament.captains?.some((c) => c.id === player.id);
                          const capInfo = tournament.captains?.find((c) => c.id === player.id);
                          const assignedCap = Object.entries(state.tournamentCaptainData[tournament.id] || {}).find(([, capData]) => capData.squad?.includes(player.id))?.[0];
                          const assignedCapInfo = tournament.captains?.find((c) => c.id === assignedCap);

                          return (
                            <div className="roster-item" key={player.id} style={{ gridTemplateColumns: tournament.status === 'draft' ? '2fr 1.2fr 1.5fr 80px' : '2fr 1.2fr 1.5fr' }}>
                              <div className="roster-item-info">
                                <Avatar person={player} size="xs" />
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <strong>{player.tag}</strong>
                                    {isCap && <span className="captain-badge" title="Tournament Captain" style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)', color: '#ffd700', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Trophy size={10} /> CAP</span>}
                                  </div>
                                  <small>{player.name}</small>
                                </div>
                              </div>
                              <span className="roster-pos">{player.primary} / {player.secondary}</span>
                              {tournament.status === 'draft' ? (
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
                              {tournament.status === 'draft' && (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button 
                                    className={`ghost icon-only ${isCap ? 'active btn-warning' : ''}`} 
                                    title={isCap ? 'Demote Captain' : 'Promote to Captain'} 
                                    onClick={() => toggleCaptain(player)}
                                    style={isCap ? { color: '#ffd700' } : {}}
                                  >
                                    <Trophy size={15} />
                                  </button>
                                  <button className="ghost btn-danger icon-only" title="Remove from tournament" onClick={() => removePlayerFromTournament(player.id)}><X size={15} /></button>
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


function AppShell({ user, active, setActive, onLogout, onChangeTournament, children, budget, tournament, players, captains: propCaptains, profileSetup, allPlayersAssigned, auction }) {
  const resolvedCaptains = propCaptains || [];
  const captain = resolvedCaptains.find((item) => item.id === user.id);
  const club = getClubInfo(captain);
  const isCaptain = user.role === 'captain';
  const isProfileSetupFinished = profileSetup?.complete || (auction?.phase && auction.phase !== 'scheduled');
  const navItems = isCaptain
    ? [
      ['squad', 'Squad', UsersRound],
      ...(isProfileSetupFinished ? [['auction', 'Auction', Radio]] : []),
      ...(allPlayersAssigned ? [['tournament', 'Tournament', Swords]] : []),
      ['club', 'Club settings', Settings],
    ]
    : [['profile', 'Profile', CircleUserRound], ['pool', 'Players', UsersRound]];
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-head"><Brand /><button className="icon-button mobile-close" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
        <div className="event-card">
          <span className="event-kicker"><span className="live-dot" /> Live tournament</span>
          <strong>{tournament.name}</strong>
          <span><Clock3 size={14} /> {profileSetup?.complete ? `Auction · ${tournament.time || 'TBD'}` : `Profiles · ${profileSetup?.ready || 0}/${profileSetup?.total || 0}`}</span>
        </div>
        <button className="tournament-switch" onClick={onChangeTournament}><Trophy size={15} /> Change tournament <ArrowRight size={14} /></button>
        <nav>
          <span className="nav-label">Workspace</span>
          {navItems.map(([id, label, Icon]) => (
            <button key={id} className={active === id ? 'active' : ''} onClick={() => { setActive(id); setMobileOpen(false); }}>
              <Icon size={19} /> {label}
              {id === 'auction' && <span className="nav-live">Live</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          {isCaptain && <div className="budget-mini"><span>Available budget</span><strong><Coins size={18} /> {money(budget)}</strong></div>}
          <button className="profile-chip" onClick={onLogout}>
            {isCaptain ? <ClubMark club={club} size="sm" /> : <Avatar person={players.find((item) => item.id === user.id)} size="sm" />}
            <span><strong>{captain?.handle || players.find((item) => item.id === user.id)?.tag || user.name || 'Captain'}</strong><small>{isCaptain ? club.name : 'Registered player'}</small></span>
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <div className="mobile-top"><button className="icon-button" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><Brand /></div>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <section className="content">
        {user.role === 'player' && auction?.phase === 'scheduled' && (
          <div className="auction-scheduled-banner" style={{ background: 'rgba(217,255,99,0.1)', border: '1px solid rgba(217,255,99,0.2)', padding: '12px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <CalendarDays size={18} style={{ color: 'var(--lime)' }} />
            <span style={{ fontSize: '11px', color: 'var(--ink)' }}>
              <strong>Live Auction Scheduled:</strong> {auction.scheduledTime ? new Date(auction.scheduledTime).toLocaleString() : 'Date & Time TBD'}
            </span>
          </div>
        )}
        {children}
      </section>
    </div>
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

function PlayerCard({ player, rank, onRank, sold, soldClub, profileReady = true, showProfileStatus = false }) {
  const unavailable = !profileReady && !sold;
  return (
    <article className={`player-card ${rank ? 'shortlisted' : ''} ${sold ? 'sold' : ''} ${unavailable ? 'profile-pending' : ''}`}>
      <div className="player-card-head">
        <Avatar person={player} />
        <div><strong>{player.tag}</strong><span>{player.name}</span></div>
      </div>
      <div className="position-row"><b>{player.primary}</b>{player.secondary && <span>{player.secondary}</span>}</div>
      <div className="trait-row">{(player.traits || []).map((trait) => <span key={trait}>{trait}</span>)}</div>

      {sold ? (
        <div className="rank-button sold-label"><ClubMark club={soldClub} size="xs" /><span>Drafted to</span><strong>{soldClub?.name || 'Another Team'}</strong></div>
      ) : (
        <button 
          className={`rank-button ${rank ? 'active' : ''}`} 
          onClick={onRank} 
          disabled={unavailable}
          style={profileReady && !rank ? { boxShadow: '0 0 10px rgba(217, 255, 99, 0.25)', borderColor: 'var(--lime)', color: 'var(--lime)', fontWeight: 'bold' } : {}}
        >
          {unavailable ? 'Waiting on profile' : rank ? <><span>#{rank}</span> Priority pick <X size={15} /></> : <><Target size={16} /> Shortlist</>}
        </button>
      )}
    </article>
  );
}

function SquadRoom({ user, state, updateState, goAuction, profileSetup }) {
  const captain = state.captains?.find((item) => item.id === user.id);
  const data = state.captainData?.[user.id] || { formation: '4-3-3', shortlist: [], budget: 1000, squad: [], lineup: {} };
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('All');
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const soldIds = Object.values(state.captainData || {}).flatMap((item) => item?.squad || []);
  const availablePlayerCount = state.players.filter((player) => !soldIds.includes(player.id)).length;
  const readyAvailablePlayerCount = state.players.filter((player) => !soldIds.includes(player.id) && isPlayerProfileReady(player)).length;
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
  const teamSize = 11;
  const formationSet = getFormationSet(11);
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
    const set = getFormationSet(11);
    if (!set[formation]) return;
    const activeSpotIds = new Set(set[formation].map((spot) => spot.id));
    if (!draft.captainData[user.id]) {
      draft.captainData[user.id] = { formation, shortlist: [], budget: 1000, squad: [], lineup: { GK: captainMemberId } };
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
        draft.captainData[user.id] = { formation: activeFormation, shortlist: [], budget: 1000, squad: [], lineup: {} };
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
      draft.captainData[user.id] = { formation: activeFormation, shortlist: [], budget: 1000, squad: [], lineup: {} };
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
    const player = draft.players.find((item) => item.id === playerId);
    if (!isPlayerProfileReady(player)) return;
    if (!draft.captainData[user.id]) {
      draft.captainData[user.id] = { formation: '4-3-3', shortlist: [], budget: 1000, squad: [], lineup: {} };
    }
    if (!draft.captainData[user.id].shortlist) draft.captainData[user.id].shortlist = [];
    const list = draft.captainData[user.id].shortlist;
    const existing = list.indexOf(playerId);
    if (existing >= 0) list.splice(existing, 1);
    else if (list.length < 3) list.push(playerId);
    else { list.shift(); list.push(playerId); }
  });
  const totalAvailable = 1 + (data.squad || []).length;
  const pitchFull = Object.keys(data.lineup || {}).length >= totalAvailable && totalAvailable > 1;
  const squadConfirmed = data.squadConfirmed || false;
  const confirmSquad = () => updateState((draft) => {
    if (!draft.captainData[user.id]) return;
    draft.captainData[user.id].squadConfirmed = true;
  });

  return (
    <>
      <header className="page-header">
        <div><span className="page-kicker">Captain workspace</span><h1>Build {getClubInfo(captain).name}</h1><p>{profileSetup?.complete ? 'Set the shape, scout the pool, then bring your shortlist to the auction.' : `Player profile setup is open. ${profileSetup?.ready || 0} of ${profileSetup?.total || 0} player profiles are ready.`}</p></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {pitchFull && !squadConfirmed && (
            <button className="primary confirm-squad-btn" onClick={confirmSquad}><BadgeCheck size={18} /> Confirm squad</button>
          )}
          {squadConfirmed && <span className="status-pill good"><BadgeCheck size={14} /> Squad confirmed</span>}
          {profileSetup?.complete && <button className="secondary" onClick={goAuction}><Radio size={18} /> Auction</button>}
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
                <div className="priority-item" key={player.id}><span>{index + 1}</span><Avatar person={player} size="xs" /><div><strong>{player.tag}</strong><small>{player.primary}</small></div></div>
              ) : <div className="priority-empty" key={index}><span>{index + 1}</span> Pick a player below</div>;
            })}
          </div>
          <button className="secondary full" onClick={goAuction} disabled={!data.shortlist.length || !profileSetup?.complete}><Vote size={17} /> {profileSetup?.complete ? 'Take shortlist to vote' : 'Waiting for player profiles'}</button>
        </aside>
      </div>
      <section className="pool-section">
        <div className="pool-title"><div><span className="section-step">03</span><h2>Scout the player pool</h2><p>{readyAvailablePlayerCount}/{availablePlayerCount} profiles ready · pending cards are locked</p></div></div>
        <div className="filter-row">
          <label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search players or positions" /></label>
          <div className="filter-pills">{['All', 'ST', 'CAM', 'CM', 'CDM', 'CB', 'GK'].map((item) => <button key={item} className={position === item ? 'active' : ''} onClick={() => setPosition(item)}>{item}</button>)}</div>
        </div>
        <div className="player-grid">
          {filtered.map((player) => <PlayerCard key={player.id} player={player} sold={soldIds.includes(player.id)} soldClub={getPurchaserClub(player.id)} rank={data.shortlist.indexOf(player.id) + 1 || 0} onRank={() => toggleShortlist(player.id)} profileReady={isPlayerProfileReady(player)} />)}
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
              <Avatar person={player} size="lg" /><strong>{player.tag}</strong><small>{player.primary}</small>
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
  const nextBid = auction.leaderId ? auction.bid + 25 : 50;
  const teamSize = state.teamSize || 11;
  const squadSize = (captainId, data) => 1 + new Set((data.squad || []).filter((playerId) => playerId !== captainId)).size;
  const squadFull = squadSize(user.id, state.captainData[user.id]) >= teamSize;
  const canAfford = state.captainData[user.id].budget >= nextBid && !squadFull;

  const [timeLeft, setTimeLeft] = useState(0);
  const [localBidCooldown, setLocalBidCooldown] = useState(false);

  const globalCooldown = auction.lastBidTime && (Date.now() - auction.lastBidTime < 1000);
  const isBidLocked = localBidCooldown || globalCooldown;

  useEffect(() => {
    if (!auction.countdownEndTime) {
      setTimeLeft(0);
      return undefined;
    }
    const updateTime = () => {
      const remaining = Math.max(0, Math.ceil((auction.countdownEndTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    updateTime();
    const interval = setInterval(updateTime, 250);
    return () => clearInterval(interval);
  }, [auction.countdownEndTime]);

  const bid = () => {
    if (isBidLocked) return;
    setLocalBidCooldown(true);
    setTimeout(() => setLocalBidCooldown(false), 1000);

    updateState((draft) => {
      const price = draft.auction.leaderId ? draft.auction.bid + 25 : 50;
      if (draft.captainData[user.id].budget < price) return;
      draft.auction.bid = price;
      draft.auction.leaderId = user.id;
      draft.auction.countdownEndTime = null;
      draft.auction.lastBidTime = Date.now();
      draft.auction.history.unshift({ type: 'bid', text: `${state.captains.find((c) => c.id === user.id)?.handle || state.captains.find((c) => c.id === user.id)?.tag || ''} bid ${price}` });
    });
  };
  const rivalBid = () => updateState((draft) => {
    const rivalPrice = draft.auction.leaderId ? draft.auction.bid + 25 : 50;
    const rivals = state.captains.filter((captain) => (
      captain.id !== user.id
      && draft.captainData[captain.id].budget >= rivalPrice
      && squadSize(captain.id, draft.captainData[captain.id]) < teamSize
    ));
    if (!rivals.length) return;
    const rival = rivals[Math.floor(Math.random() * rivals.length)];
    draft.auction.bid = rivalPrice;
    draft.auction.leaderId = rival.id;
    draft.auction.countdownEndTime = null;
    draft.auction.lastBidTime = Date.now();
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
      <div className="auction-topline"><span><span className="live-dot" /> Live auction</span><strong>Lot 01</strong><div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><span>Minimum raise · 25</span>{onReset && <button className="ghost btn-danger btn-xs" onClick={onReset}><RotateCcw size={13} /> Reset auction</button>}</div></div>
      <div className="auction-layout">
        <section className="lot-card">
          <div className="lot-stripe" />
          <span className="lot-label">Now on the block</span>
          <Avatar person={player} size="xl" />
          <h1>{player.tag}</h1><p>{player.name}</p>
          <div className="lot-stats"><span><b>{player.primary}</b> Position</span></div>
          <div className="lot-traits">{player.traits.map((trait) => <span key={trait}><Zap size={13} /> {trait}</span>)}</div>
        </section>
        <section className="bid-console">
          <span className="page-kicker">Current bid</span>
          <div className="big-bid"><Coins size={33} /> {auction.bid}</div>
          <div className={`leading-bid ${leader ? 'has-leader' : ''}`}>
            {leader ? <><ClubMark club={getClubInfo(leader)} size="xs" /><span><small>Leading bid</small><strong>{getClubInfo(leader).name}</strong></span></> : <><Clock3 size={19} /><span><small>Opening price</small><strong>Waiting for first bid</strong></span></>}
          </div>
          {timeLeft > 0 && (
            <div className="countdown-alert" style={{ background: '#ff3b30', color: '#fff', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', animation: 'pulse 1s infinite' }}>
              <Clock3 size={15} /> Closing in {timeLeft}s
            </div>
          )}
          <button className="bid-button" onClick={bid} disabled={!canAfford || auction.leaderId === user.id || isBidLocked}>
            <span>{isBidLocked ? 'Processing bid...' : 'Place bid'}</span><strong><Coins size={22} /> {nextBid}</strong>
          </button>
          <p className="bid-helper">You have <b>{money(state.captainData[user.id].budget)}</b> coins available.{squadFull && <><br /><b>Your squad is full.</b></>}</p>
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
          return (
            <div className="complete-squad-card" key={captain.id}>
              <div className="complete-squad-head">
                <ClubMark club={club} size="sm" />
                <span><strong>{club.name}</strong><small>{money(data.budget)} coins remaining</small></span>
              </div>
              <div className="complete-squad-list">
                {squadPlayers.map((p) => (
                  <div key={p.id}><Avatar person={p} size="xs" /><span><strong>{p.tag}</strong><small>{p.primary}</small></span></div>
                ))}
                {!squadPlayers.length && <p style={{ color: 'var(--muted)', fontSize: '9px', margin: '4px 0' }}>No auction picks</p>}
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

  const auction = props.state.auction;

  if (auction.phase === 'scheduled') {
    return (
      <div className="auction-scheduled-view" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <CalendarDays size={48} style={{ color: 'var(--lime)', marginBottom: '16px', display: 'inline-block' }} />
        <h2>Live Auction Scheduled</h2>
        <p style={{ color: 'var(--muted)', margin: '8px 0 24px' }}>
          The live auction has been scheduled by the organizer.
        </p>
        <div className="scheduled-time-box" style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', display: 'inline-block' }}>
          <Clock3 size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--lime)', display: 'inline-block' }} />
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {auction.scheduledTime ? new Date(auction.scheduledTime).toLocaleString() : 'Date & Time TBD'}
          </span>
        </div>
      </div>
    );
  }

  if (auction.phase === 'priority-setup') {
    return (
      <div className="auction-waiting-view" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Clock3 size={48} style={{ color: 'var(--lime)', marginBottom: '16px', display: 'inline-block' }} />
        <h2>Scouting & Priority Board Selection</h2>
        <p style={{ color: 'var(--muted)', margin: '8px 0 24px', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto', fontSize: '12px', lineHeight: '1.5' }}>
          The Auctioneer has started the tournament draft setup! Please head over to the <strong>Squad</strong> room to pick your 3 priority board players. The Auctioneer will start the round once captains are ready.
        </p>
        <div className="status-container" style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px 30px', display: 'inline-block', width: '280px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Captain Readiness</h4>
          <div style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
            {props.state.captains.map((cap) => {
              const picks = props.state.captainData[cap.id]?.shortlist || [];
              const isReady = picks.length === 3;
              return (
                <div key={cap.id} style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span><strong>{cap.handle || cap.tag}</strong></span>
                  <span style={{ color: isReady ? 'var(--lime)' : '#ffb96e', fontWeight: 'bold' }}>
                    {isReady ? 'Ready' : `Choosing (${picks.length}/3)`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {auction.phase === 'complete'
        ? <AuctionCompleteScreen state={props.state} goTournament={goTournament} />
        : <BiddingRoom {...props} onReset={resetAuction} />}
    </>
  );
}

function TournamentHub({ user, state, updateState }) {
  const isOrganizer = user?.role === 'organizer';
  const competition = state.competition || createCompetition();
  const standings = calculateStandings(state.captains, competition.matches || []);
  const nextMatch = (competition.matches || []).find((match) => match.status !== 'completed');
  const [matchDate, setMatchDate] = useState(nextMatch?.scheduledAt || suggestKickoffDate());

  const [hScore, setHScore] = useState(0);
  const [aScore, setAScore] = useState(0);
  const [hScorers, setHScorers] = useState([]);
  const [aScorers, setAScorers] = useState([]);

  useEffect(() => { setMatchDate(nextMatch?.scheduledAt || suggestKickoffDate()); }, [nextMatch?.id, nextMatch?.scheduledAt]);

  const clubFor = (teamId) => getClubInfo(state.captains.find((captain) => captain.id === teamId));
  
  const homeSquad = state.captainData?.[nextMatch?.homeId]?.squad || [];
  const homeCapId = nextMatch?.homeId;
  const homePlayers = homeCapId ? [
    { id: homeCapId, tag: state.captains.find((c) => c.id === homeCapId)?.handle || state.captains.find((c) => c.id === homeCapId)?.tag || 'Captain' },
    ...homeSquad.filter((pid) => pid !== homeCapId).map((pid) => {
      const p = state.players.find((player) => player.id === pid);
      return { id: pid, tag: p?.tag || p?.name || 'Player' };
    })
  ] : [];

  const awaySquad = state.captainData?.[nextMatch?.awayId]?.squad || [];
  const awayCapId = nextMatch?.awayId;
  const awayPlayers = awayCapId ? [
    { id: awayCapId, tag: state.captains.find((c) => c.id === awayCapId)?.handle || state.captains.find((c) => c.id === awayCapId)?.tag || 'Captain' },
    ...awaySquad.filter((pid) => pid !== awayCapId).map((pid) => {
      const p = state.players.find((player) => player.id === pid);
      return { id: pid, tag: p?.tag || p?.name || 'Player' };
    })
  ] : [];

  const formatDateTimeLocal = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const handleHomeScoreChange = (score) => {
    const nextScore = Math.max(0, score);
    setHScore(nextScore);
    setHScorers((prev) => {
      const arr = [...prev];
      if (arr.length < nextScore) {
        while (arr.length < nextScore) arr.push(homePlayers[0]?.id || '');
      } else {
        arr.length = nextScore;
      }
      return arr;
    });
  };

  const handleAwayScoreChange = (score) => {
    const nextScore = Math.max(0, score);
    setAScore(nextScore);
    setAScorers((prev) => {
      const arr = [...prev];
      if (arr.length < nextScore) {
        while (arr.length < nextScore) arr.push(awayPlayers[0]?.id || '');
      } else {
        arr.length = nextScore;
      }
      return arr;
    });
  };

  const updateHomeScorer = (index, value) => {
    setHScorers((prev) => {
      const arr = [...prev];
      arr[index] = value;
      return arr;
    });
  };

  const updateAwayScorer = (index, value) => {
    setAScorers((prev) => {
      const arr = [...prev];
      arr[index] = value;
      return arr;
    });
  };

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
    const allReady = draft.captains.every((captain) => draft.captainData[captain.id]?.squadConfirmed);
    if (allReady && draft.competition.phase === 'ready') startCompetition(draft.competition);
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
  };

  const scheduleMatch = () => {
    if (!nextMatch || !matchDate) return;
    updateState((draft) => {
      const match = draft.competition.matches.find((item) => item.id === nextMatch.id);
      match.scheduledAt = matchDate;
      match.status = 'scheduled';
    });
  };

  const reportMatchResult = (hScoreVal, aScoreVal, hScorerIds, aScorerIds) => {
    updateState((draft) => {
      const draftCompetition = draft.competition;
      const match = draftCompetition.matches.find((item) => item.id === nextMatch?.id);
      if (!match) return;

      match.homeScore = hScoreVal;
      match.awayScore = aScoreVal;
      match.status = 'completed';
      if (!match.scheduledAt) match.scheduledAt = new Date().toISOString().slice(0, 16);

      hScorerIds.forEach((pid) => {
        const player = draft.players.find((p) => p.id === pid);
        const captain = draft.captains.find((c) => c.id === pid);
        const name = player?.tag || captain?.handle || captain?.tag || 'Player';
        draftCompetition.playerStats.push({ matchId: match.id, teamId: match.homeId, playerId: pid, name, goals: 1 });
      });

      aScorerIds.forEach((pid) => {
        const player = draft.players.find((p) => p.id === pid);
        const captain = draft.captains.find((c) => c.id === pid);
        const name = player?.tag || captain?.handle || captain?.tag || 'Player';
        draftCompetition.playerStats.push({ matchId: match.id, teamId: match.awayId, playerId: pid, name, goals: 1 });
      });

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

  const submitScore = () => {
    if (hScore > 0 && hScorers.some((id) => !id)) {
      alert('Please select a player for all home goals.');
      return;
    }
    if (aScore > 0 && aScorers.some((id) => !id)) {
      alert('Please select a player for all away goals.');
      return;
    }
    reportMatchResult(hScore, aScore, hScorers, aScorers);
    setHScore(0);
    setAScore(0);
    setHScorers([]);
    setAScorers([]);
  };

  const simulateMatchmakerResult = () => {
    const homeCount = homePlayers.length;
    const awayCount = awayPlayers.length;
    if (!homeCount || !awayCount) return;

    const completedCount = competition.matches.filter((item) => item.status === 'completed').length;
    const scorePatterns = [[2, 1], [1, 1], [3, 0], [1, 2], [2, 2], [0, 1], [2, 0], [1, 3]];
    const [hSimScore, aSimScore] = scorePatterns[completedCount % scorePatterns.length];

    const hSimScorers = Array.from({ length: hSimScore }).map(() => {
      const idx = Math.floor(Math.random() * homeCount);
      return homePlayers[idx].id;
    });

    const aSimScorers = Array.from({ length: aSimScore }).map(() => {
      const idx = Math.floor(Math.random() * awayCount);
      return awayPlayers[idx].id;
    });

    reportMatchResult(hSimScore, aSimScore, hSimScorers, aSimScorers);
  };

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
    return (
      <>
        <header className="page-header"><div><span className="page-kicker">Auction complete</span><h1>Lock in your club.</h1><p>All captains must confirm their squad before Matchmaker releases the official tournament path.</p></div><span className="status-pill good"><BadgeCheck size={14} /> Squads locked</span></header>
        <section className="panel ready-room">
          <div className="ready-room-head"><div><span className="section-step">01</span><h2>Captain ready check</h2><p>{readyIds.size} of {state.captains.length} squads confirmed</p></div>{isOrganizer && <button className="ghost" onClick={() => setReady(true)}><Sparkles size={16} /> Make everyone ready · Demo</button>}</div>
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
            {isOrganizer ? (
              <button className="primary" onClick={() => setReady(true)}><BadgeCheck size={17} /> Confirm all squads and start</button>
            ) : (
              <button className="primary" disabled={readyIds.has(user.id)} onClick={() => setReady(false)}><BadgeCheck size={17} /> {readyIds.has(user.id) ? 'Squad confirmed' : 'I am ready'}</button>
            )}
            <p>Scrims are always open and never affect official standings.</p>
          </div>
        </section>
        <section className="format-explainer"><div><strong>01</strong><span><b>Home and Away</b><small>Each club plays every rival twice (6 rounds total).</small></span></div><ArrowRight size={18} /><div><strong>02</strong><span><b>Shield match</b><small>3rd and 4th settle placement.</small></span></div><ArrowRight size={18} /><div><strong>03</strong><span><b>Championship Final</b><small>Top two play for the title.</small></span></div></section>
      </>
    );
  }

  return (
    <>
      <header className="page-header tournament-hub-header"><div><span className="page-kicker">Matchmaker · {competition.phase === 'finals' ? 'Finals' : competition.phase === 'complete' ? 'Complete' : 'League stage'}</span><h1>The road to the trophy.</h1><p>Official fixtures count toward standings. Clubs may arrange unlimited scrims between them.</p></div><div className="tournament-header-actions"><span className="status-pill good"><Radio size={14} /> Matchmaker connected</span>{isOrganizer && (<button className="ghost btn-danger" onClick={resetFixtures}><RotateCcw size={16} /> Reset fixtures · Test</button>)}</div></header>
      <div className="tournament-metric-grid"><div><span>Official matches</span><strong>{completedMatches.length}/{competition.matches.length}</strong></div><div><span>Total goals</span><strong>{totalGoals}</strong></div><div><span>League leader</span><strong>{standings[0] ? clubFor(standings[0].teamId).name : '—'}</strong></div><div><span>Tightest defense</span><strong>{tightestDefense ? `${clubFor(tightestDefense.teamId).name} · ${tightestDefense.ga} GA` : '—'}</strong></div></div>
      <div className="tournament-hub-grid">
        <section className="panel standings-table"><div className="panel-head"><div><span className="section-step">01</span><h2>League table</h2></div><Trophy size={18} /></div><div className="standings-row standings-head"><span>#</span><span>Club</span><span>P</span><span>GD</span><span>Pts</span></div>{standings.map((row, index) => { const club = clubFor(row.teamId); return <div className="standings-row" key={row.teamId}><b>{index + 1}</b><span><ClubMark club={club} size="xs" /><strong>{club.name}</strong></span><span>{row.played}</span><span>{row.gf - row.ga > 0 ? '+' : ''}{row.gf - row.ga}</span><strong>{row.points}</strong></div>; })}</section>
        <aside className="panel next-match-card">
          <span className="page-kicker">Matchmaker recommends next</span>
          {nextMatch ? (
            <>
              <div className="match-stage">{nextMatch.label}</div>
              <div className="match-versus">
                <div><ClubMark club={clubFor(nextMatch.homeId)} size="lg" /><strong>{clubFor(nextMatch.homeId).name}</strong></div>
                <b>VS</b>
                <div><ClubMark club={clubFor(nextMatch.awayId)} size="lg" /><strong>{clubFor(nextMatch.awayId).name}</strong></div>
              </div>
              
              {isOrganizer ? (
                <>
                  <label style={{ display: 'block', marginTop: '16px' }}>
                    <span>Schedule match kickoff</span>
                    <input type="datetime-local" value={formatDateTimeLocal(matchDate)} onChange={(event) => setMatchDate(event.target.value)} />
                  </label>
                  <button className="secondary full" onClick={scheduleMatch} disabled={!matchDate} style={{ marginBottom: '14px' }}><CalendarDays size={16} /> {nextMatch.status === 'scheduled' ? 'Update match date' : 'Confirm match date'}</button>
                  
                  {/* Organizer Score Entry Form */}
                  <div className="report-score-panel" style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', marginTop: '10px' }}>
                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Report Score</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '12px', marginBottom: '16px', textAlign: 'center' }}>
                      <div>
                        <small style={{ display: 'block', marginBottom: '4px', fontSize: '9px', textTransform: 'uppercase', color: 'var(--muted)' }}>{clubFor(nextMatch.homeId).name}</small>
                        <input type="number" min="0" max="20" value={hScore} onChange={(e) => handleHomeScoreChange(Number(e.target.value))} style={{ width: '60px', textAlign: 'center', fontSize: '16px', padding: '6px', background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--muted)' }}>-</span>
                      <div>
                        <small style={{ display: 'block', marginBottom: '4px', fontSize: '9px', textTransform: 'uppercase', color: 'var(--muted)' }}>{clubFor(nextMatch.awayId).name}</small>
                        <input type="number" min="0" max="20" value={aScore} onChange={(e) => handleAwayScoreChange(Number(e.target.value))} style={{ width: '60px', textAlign: 'center', fontSize: '16px', padding: '6px', background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '4px' }} />
                      </div>
                    </div>

                    {/* Scorer lists */}
                    {hScore > 0 && (
                      <div style={{ marginBottom: '12px', textAlign: 'left' }}>
                        <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '6px', fontSize: '9px', textTransform: 'uppercase' }}>Home Scorers</small>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {Array.from({ length: hScore }).map((_, i) => (
                            <select key={`home-${i}`} value={hScorers[i] || ''} onChange={(e) => updateHomeScorer(i, e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '11px', background: 'var(--card)', color: 'var(--ink)', border: '1px solid var(--line)', borderRadius: '4px' }}>
                              <option value="">Select Scorer</option>
                              {homePlayers.map((p) => <option key={p.id} value={p.id}>{p.tag}</option>)}
                            </select>
                          ))}
                        </div>
                      </div>
                    )}

                    {aScore > 0 && (
                      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                        <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '6px', fontSize: '9px', textTransform: 'uppercase' }}>Away Scorers</small>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {Array.from({ length: aScore }).map((_, i) => (
                            <select key={`away-${i}`} value={aScorers[i] || ''} onChange={(e) => updateAwayScorer(i, e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '11px', background: 'var(--card)', color: 'var(--ink)', border: '1px solid var(--line)', borderRadius: '4px' }}>
                              <option value="">Select Scorer</option>
                              {awayPlayers.map((p) => <option key={p.id} value={p.id}>{p.tag}</option>)}
                            </select>
                          ))}
                        </div>
                      </div>
                    )}

                    <button className="primary full" onClick={submitScore} style={{ fontSize: '11px', padding: '10px' }}><CheckCircle2 size={15} /> Submit Results</button>
                    <button className="ghost full matchmaker-demo" onClick={simulateMatchmakerResult} style={{ marginTop: '8px', fontSize: '10px' }}><Sparkles size={13} /> Auto-simulate instead</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="scheduled-time-box" style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px', margin: '16px 0', textAlign: 'center' }}>
                    <Clock3 size={16} style={{ marginRight: '6px', color: 'var(--lime)', verticalAlign: 'middle', display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      {nextMatch.scheduledAt ? new Date(nextMatch.scheduledAt).toLocaleString() : 'Kickoff Date TBD'}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', margin: '10px 0 0' }}>
                    Waiting for Organizer to report match score.
                  </p>
                </>
              )}
              {nextMatch.scheduledAt && isOrganizer && (
                <p className="scheduled-note"><CheckCircle2 size={14} /> Scheduled · {new Date(nextMatch.scheduledAt).toLocaleString()}</p>
              )}
            </>
          ) : (
            <div className="tournament-complete"><Crown size={42} /><h2>Tournament complete</h2><p>All official fixtures have been reported.</p></div>
          )}
        </aside>
      </div>
      <div className="tournament-lower-grid">
        <section className="panel top-scorers"><div className="panel-head"><div><span className="section-step">02</span><h2>Club top scorers</h2></div><Goal size={18} /></div>{state.captains.map((captain) => { const club = getClubInfo(captain); return <div key={captain.id}><ClubMark club={club} size="xs" /><span><strong>{club.name}</strong><small>{topScorerFor(captain.id)}</small></span></div>; })}</section>
        <section className="panel fixture-list"><div className="panel-head"><div><span className="section-step">03</span><h2>Official fixture path</h2></div><CalendarDays size={18} /></div>{(competition.matches || []).map((match) => <div className={match.id === nextMatch?.id ? 'current' : ''} key={match.id}><span>{match.label}</span><strong>{clubFor(match.homeId).name} <b>{match.status === 'completed' ? `${match.homeScore}–${match.awayScore}` : 'vs'}</b> {clubFor(match.awayId).name}</strong><small>{match.status === 'completed' ? 'Final' : match.scheduledAt ? new Date(match.scheduledAt).toLocaleString() : 'Date TBD'}</small></div>)}</section>
      </div>
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

function PlayerProfile({ user, state, updateState, showPool, player: playerProp }) {
  const player = playerProp || state.players.find((item) => item.id === user.id);
  const [form, setForm] = useState(player || { name: '', tag: '', primary: 'CM', secondary: 'CM' });
  const [saved, setSaved] = useState(false);
  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const save = () => {
    const updatedProfile = { ...form, profileReady: true, profileUpdatedAt: new Date().toISOString() };
    updateState((draft) => { draft.players = draft.players.map((item) => item.id === user.id ? updatedProfile : item); });
    setForm(updatedProfile);
    setSaved(true); setTimeout(() => setSaved(false), 1800);
  };

  const uploadAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image smaller than 2 MB.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setField('avatar', dataUrl);
        setSaved(false);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <header className="page-header"><div><span className="page-kicker">Player profile setup</span><h1>Make your case.</h1><p>Captains can shortlist you after this card is saved.</p></div><span className={`status-pill ${isPlayerProfileReady(form) ? 'good' : ''}`}><BadgeCheck size={14} /> {isPlayerProfileReady(form) ? 'Profile updated' : 'Needs update'}</span></header>
      <div className="profile-layout">
        <section className="panel profile-form">
          <div className="panel-head"><div><span className="section-step">01</span><h2>Your player profile</h2></div><Pencil size={18} /></div>
          
          <div className="profile-avatar-row">
            <Avatar person={form} size="xl" />
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label className="secondary club-upload-button" htmlFor="player-avatar-upload" style={{ margin: 0, padding: '6px 12px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <Upload size={14} /> Upload photo
                </label>
                <input id="player-avatar-upload" type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadAvatar} style={{ display: 'none' }} />
                {form.avatar && (
                  <button className="ghost btn-danger icon-only" title="Remove photo" onClick={() => { setField('avatar', null); setSaved(false); }} style={{ padding: '6px' }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <small style={{ marginTop: '6px', color: 'var(--muted)', fontSize: '9px', display: 'block' }}>PNG, JPG or WebP. Auto-resized to square.</small>
            </div>
          </div>

          <div className="form-grid">
            <label><span>Name</span><input value={form.name} onChange={(e) => setField('name', e.target.value)} /></label>
            <label><span>Gamertag</span><input value={form.tag} onChange={(e) => setField('tag', e.target.value)} /></label>
            <label><span>Primary position</span><select value={form.primary} onChange={(e) => setField('primary', e.target.value)}>{POSITIONS.map((p) => <option key={p}>{p}</option>)}</select></label>
            <label><span>Secondary position</span><select value={form.secondary} onChange={(e) => setField('secondary', e.target.value)}>{POSITIONS.map((p) => <option key={p}>{p}</option>)}</select></label>
          </div>
          <button className="primary" onClick={save}>{saved ? <><BadgeCheck size={18} /> Saved</> : <>Save <ArrowRight size={18} /></>}</button>
        </section>
        <aside className="profile-preview">
          <span className="section-step">02</span><h2>Captain preview</h2><p>This is how you appear on every draft board.</p>
          <PlayerCard player={form} rank={0} onRank={() => {}} />
          <div className="profile-tip"><Sparkles size={18} /><span><strong>Quick tip</strong>Flexible positions make you easier to fit into more formations.</span></div>
        </aside>
      </div>
    </>
  );
}

function PlayerPool({ state }) {
  const soldIds = Object.values(state.captainData || {}).flatMap((item) => item?.squad || []);
  const getPurchaserClub = (playerId) => {
    const captainId = Object.keys(state.captainData || {}).find(
      (capId) => state.captainData[capId]?.squad?.includes(playerId)
    );
    if (!captainId) return null;
    const captainInfo = state.captains?.find((c) => c.id === captainId);
    return captainInfo ? getClubInfo(captainInfo) : null;
  };
  return (
    <>
      <header className="page-header">
        <div>
          <span className="page-kicker">Tournament lobby</span>
          <h1>Meet the player pool.</h1>
          <p>{state.players.length} registered players are ready for auction night.</p>
        </div>
      </header>
      <div className="player-grid">
        {state.players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            sold={soldIds.includes(player.id)}
            soldClub={getPurchaserClub(player.id)}
            rank={0}
            onRank={() => {}}
            profileReady={isPlayerProfileReady(player)}
            showProfileStatus
          />
        ))}
      </div>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [state, setState] = useState(loadState);
  const [syncStatus, setSyncStatus] = useState(CLOUD_SYNC_LABEL);
  const [active, setActive] = useState('squad');
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('clubhouse-theme') || 'dark');
  const applyingRemoteState = useRef(false);
  const cloudReady = useRef(!hasSupabaseConfig);
  const saveTimer = useRef(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('clubhouse-theme', theme); }, [theme]);
  useEffect(() => {
    if (!supabase) return undefined;

    let isMounted = true;

    const loadCloudState = async () => {
      setSyncStatus('Connecting live sync');
      const { data, error } = await supabase
        .from(SUPABASE_STATE_TABLE)
        .select('state')
        .eq('id', SUPABASE_STATE_ID)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        console.error('Supabase load failed', error);
        setSyncStatus('Live sync error');
        cloudReady.current = true;
        return;
      }

      if (data?.state) {
        const normalizedRemote = normalizeLoadedState(data.state);
        applyingRemoteState.current = true;
        setState(normalizedRemote);
        if (JSON.stringify(normalizedRemote) !== JSON.stringify(data.state)) {
          const { error: cleanupError } = await supabase
            .from(SUPABASE_STATE_TABLE)
            .upsert({ id: SUPABASE_STATE_ID, state: normalizedRemote, updated_at: new Date().toISOString() });
          if (cleanupError) console.error('Supabase cleanup failed', cleanupError);
        }
        setSyncStatus('Live sync on');
      } else {
        const initialState = normalizeLoadedState(state);
        const { error: seedError } = await supabase
          .from(SUPABASE_STATE_TABLE)
          .upsert({ id: SUPABASE_STATE_ID, state: initialState, updated_at: new Date().toISOString() });
        if (seedError) {
          console.error('Supabase seed failed', seedError);
          setSyncStatus('Live sync error');
        } else {
          setSyncStatus('Live sync on');
        }
      }
      cloudReady.current = true;
    };

    const channel = supabase
      .channel('fc-auction-state')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: SUPABASE_STATE_TABLE, filter: `id=eq.${SUPABASE_STATE_ID}` },
        (payload) => {
          if (!payload.new?.state) return;
          applyingRemoteState.current = true;
          setState(normalizeLoadedState(payload.new.state));
          setSyncStatus('Live sync on');
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: SUPABASE_STATE_TABLE, filter: `id=eq.${SUPABASE_STATE_ID}` },
        (payload) => {
          if (!payload.new?.state) return;
          applyingRemoteState.current = true;
          setState(normalizeLoadedState(payload.new.state));
          setSyncStatus('Live sync on');
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setSyncStatus('Live sync on');
      });

    loadCloudState();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!supabase || !cloudReady.current) return undefined;
    if (applyingRemoteState.current) {
      applyingRemoteState.current = false;
      return undefined;
    }

    setSyncStatus('Saving live state');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      const { error } = await supabase
        .from(SUPABASE_STATE_TABLE)
        .upsert({ id: SUPABASE_STATE_ID, state: normalizeLoadedState(state), updated_at: new Date().toISOString() });
      if (error) {
        console.error('Supabase save failed', error);
        setSyncStatus('Live sync error');
      } else {
        setSyncStatus('Live sync on');
      }
    }, 350);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state]);

  const updateState = (recipe) => setState((current) => {
    const draft = structuredClone(current); recipe(draft); return draft;
  });
  const login = (nextUser) => { setUser(nextUser); setSelectedTournamentId(null); setActive(nextUser.role === 'captain' ? 'squad' : 'profile'); };
  const logout = () => { setUser(null); setSelectedTournamentId(null); };
  const tournament = state.tournaments.find((item) => item.id === selectedTournamentId);
  const tournamentPlayerIds = state.tournamentPlayerIds[selectedTournamentId] || [];
  const tournamentCaptains = tournament ? (tournament.captains || []) : [];
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
    const scopedCaptains = targetTournament ? (targetTournament.captains || []) : [];
    const scoped = {
      players: auctionEligiblePlayers(draft.players.filter((player) => ids.has(player.id)), scopedCaptains),
      captainData: draft.tournamentCaptainData[selectedTournamentId],
      auction: draft.tournamentAuctions[selectedTournamentId],
      competition: draft.tournamentCompetitions[selectedTournamentId] || createCompetition(),
      captains: scopedCaptains,
      teamSize: getTournamentTeamSize(targetTournament),
    };
    recipe(scoped);
    const scopedMap = new Map(scoped.players.map((player) => [player.id, player]));
    draft.players = draft.players.map((player) => scopedMap.get(player.id) || player);
    scoped.players.forEach((player) => { if (!draft.players.some((item) => item.id === player.id)) draft.players.push(player); });
    draft.tournamentCaptainData[selectedTournamentId] = scoped.captainData;
    draft.tournamentAuctions[selectedTournamentId] = scoped.auction;
    draft.tournamentCompetitions[selectedTournamentId] = scoped.competition;
    return draft;
  });
  const budget = useMemo(() => user?.role === 'captain' && tournamentState ? tournamentState.captainData[user.id]?.budget : 0, [tournamentState, user]);
  const profileSetup = useMemo(() => (
    tournamentState ? getProfileSetupStatus(tournamentState.players, tournamentState.captains) : { total: 0, ready: 0, complete: false }
  ), [tournamentState]);
  const allPlayersAssigned = useMemo(() => {
    if (!tournamentState) return false;
    const soldIds = Object.values(tournamentState.captainData || {}).flatMap((item) => item?.squad || []);
    return tournamentState.players.length > 0 && tournamentState.players.every((p) => soldIds.includes(p.id));
  }, [tournamentState]);

  const isProfileSetupFinished = useMemo(() => {
    return profileSetup.complete || (tournamentState?.auction?.phase && tournamentState.auction.phase !== 'scheduled');
  }, [profileSetup.complete, tournamentState?.auction?.phase]);

  useEffect(() => {
    if (user?.role === 'captain') {
      if (!isProfileSetupFinished && (active === 'auction' || active === 'tournament')) {
        setActive('squad');
      } else if (isProfileSetupFinished && active === 'tournament' && !allPlayersAssigned) {
        setActive('squad');
      }
    }
  }, [active, isProfileSetupFinished, allPlayersAssigned, user?.role]);

  const loginCaptains = useMemo(() => {
    const list = [];
    const seen = new Set();
    state.tournaments.forEach((t) => {
      if (t.status === 'active' && t.captains) {
        t.captains.forEach((c) => {
          if (!seen.has(c.id)) {
            seen.add(c.id);
            list.push(c);
          }
        });
      }
    });
    return list;
  }, [state.tournaments]);

  let view;
  if (!user) view = <Login onLogin={login} players={state.players} captains={loginCaptains} />;
  else if (user.role === 'organizer') view = <OrganizerDashboard state={state} updateState={updateState} onLogout={logout} tournamentState={tournamentState} updateTournamentState={updateTournamentState} />;
  else if (!tournament) view = <TournamentSelector user={user} state={state} onSelect={setSelectedTournamentId} onLogout={logout} />;
  else view = (
    <AppShell user={user} active={active} setActive={setActive} onLogout={logout} onChangeTournament={() => setSelectedTournamentId(null)} budget={budget} tournament={tournament} players={state.players} captains={tournamentState.captains} profileSetup={profileSetup} allPlayersAssigned={allPlayersAssigned} auction={tournamentState?.auction}>
      {user.role === 'captain' && active === 'squad' && <SquadRoom user={user} state={tournamentState} updateState={updateTournamentState} goAuction={() => isProfileSetupFinished && setActive('auction')} profileSetup={profileSetup} />}
      {user.role === 'captain' && active === 'auction' && isProfileSetupFinished && <AuctionRoom user={user} state={tournamentState} updateState={updateTournamentState} startingBudget={tournament.budget} goTournament={() => setActive('tournament')} />}
      {user.role === 'captain' && active === 'tournament' && isProfileSetupFinished && <TournamentHub user={user} state={tournamentState} updateState={updateTournamentState} />}
      {user.role === 'captain' && active === 'club' && <ClubSettings user={user} state={tournamentState} updateState={updateTournamentState} />}
      {user.role === 'player' && active === 'profile' && <PlayerProfile user={user} state={tournamentState} updateState={updateState} player={state.players.find((p) => p.id === user.id)} showPool={() => setActive('pool')} />}
      {user.role === 'player' && active === 'pool' && <PlayerPool state={tournamentState} />}
    </AppShell>
  );
  return (
    <>
      <ThemeToggle theme={theme} onToggle={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} />
      <div className={`sync-status ${syncStatus === 'Live sync error' ? 'error' : ''}`}>{syncStatus}</div>
      {view}
    </>
  );
}
