export interface Team {
  name: string;
  code: string;
  group: string;
  isHost?: boolean;
  rank?: number;
}

export interface GroupStanding {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
}

export interface Match {
  id: string;
  matchNumber: number;
  date: string;
  team1: Team;
  team2: Team;
  stage: 'group' | 'round32' | 'round16' | 'quarter' | 'semi' | 'third' | 'final';
  group?: string;
  venue?: string;
  result?: {
    team1Score: number;
    team2Score: number;
    winner: Team | 'draw';
  };
}

export interface Group {
  name: string;
  teams: Team[];
  matches: Match[];
  standings: GroupStanding[];
}

export interface KnockoutMatch extends Match {
  stage: 'round32' | 'round16' | 'quarter' | 'semi' | 'third' | 'final';
  sourceMatch1?: string;
  sourceMatch2?: string;
  sourcePosition1?: string;
  sourcePosition2?: string;
}

export interface TournamentState {
  groups: Group[];
  knockoutMatches: KnockoutMatch[];
  thirdPlaceTeams: GroupStanding[];
  currentStage: 'group' | 'knockout';
  champion?: Team;
  paths: Map<string, Team[]>;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  groupResults: Map<string, Match[]>;
  knockoutResults: Map<string, KnockoutMatch>;
  probability?: number;
  potentialWinners: Team[];
  underdogRuns: Team[];
}