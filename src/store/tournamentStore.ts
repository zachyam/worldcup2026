import { create } from 'zustand';
import { SimulationEngine } from '../utils/simulationEngine';
import type { Group, KnockoutMatch, GroupStanding, SimulationScenario } from '../types/tournament';

// Build placeholder standings for a group from an ordered list of team names.
function buildStandings(group: Group, rankingNames: string[]): GroupStanding[] {
  return rankingNames.map((teamName, index) => {
    const team = group.teams.find(t => t.name === teamName)!;
    const won = index === 0 ? 3 : index === 1 ? 2 : index === 2 ? 1 : 0;
    return {
      team,
      position: index + 1,
      played: 3,
      won,
      drawn: 0,
      lost: 3 - won,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: index === 0 ? 9 : index === 1 ? 6 : index === 2 ? 3 : 0
    };
  });
}

interface TournamentStore {
  simulation: SimulationEngine;
  groups: Group[];
  knockoutMatches: KnockoutMatch[];
  thirdPlaceTeams: GroupStanding[];
  // Whether each group's predicted ranking has been confirmed by the user.
  confirmedGroups: Record<string, boolean>;
  currentView: 'groups' | 'knockout' | 'insights';
  selectedGroup: string | null;
  scenarios: SimulationScenario[];

  // Actions
  initializeGroups: () => void;
  updateMatchResult: (matchId: string, team1Score: number, team2Score: number) => void;
  updateKnockoutResult: (matchId: string, winnerId: string) => void;
  setGroupRanking: (groupName: string, rankings: string[]) => void;
  setGroupConfirmed: (groupName: string, confirmed: boolean) => void;
  setThirdPlaceRanking: (rankings: GroupStanding[]) => void;
  generateKnockout: () => void;
  resetSimulation: () => void;
  setCurrentView: (view: 'groups' | 'knockout' | 'insights') => void;
  setSelectedGroup: (group: string | null) => void;
  saveScenario: (name: string, description: string) => void;
  loadScenario: (scenarioId: string) => void;
}

export const useTournamentStore = create<TournamentStore>((set, get) => ({
  simulation: new SimulationEngine(),
  groups: [],
  knockoutMatches: [],
  thirdPlaceTeams: [],
  confirmedGroups: {},
  currentView: 'groups',
  selectedGroup: 'A',
  scenarios: [],

  // Seed every group with its default predicted ranking (all confirmed), so
  // the bracket and third-place list exist without the user dragging first.
  initializeGroups: () => {
    const { simulation } = get();
    const baseGroups = simulation.getState().groups;
    const groups = baseGroups.map(g => ({
      ...g,
      standings: g.standings.length === 4
        ? g.standings
        : buildStandings(g, g.teams.map(t => t.name))
    }));

    const confirmedGroups: Record<string, boolean> = {};
    groups.forEach(g => { confirmedGroups[g.name] = true; });

    simulation.groups = groups;
    simulation.generateKnockoutMatches();
    const state = simulation.getState();

    set({
      groups,
      confirmedGroups,
      knockoutMatches: state.knockoutMatches,
      thirdPlaceTeams: state.thirdPlaceTeams
    });
  },

  updateMatchResult: (matchId, team1Score, team2Score) => {
    const { simulation } = get();
    simulation.updateMatchResult(matchId, team1Score, team2Score);
    const state = simulation.getState();

    set({
      groups: state.groups,
      thirdPlaceTeams: state.thirdPlaceTeams
    });

    // Auto-generate knockout if group stage is complete
    if (simulation.isGroupStageComplete()) {
      get().generateKnockout();
    }
  },

  updateKnockoutResult: (matchId, winnerId) => {
    const { simulation } = get();
    simulation.updateKnockoutResult(matchId, winnerId);
    const state = simulation.getState();

    set({
      knockoutMatches: state.knockoutMatches
    });
  },

  setGroupRanking: (groupName, rankings) => {
    const { groups } = get();
    const groupIndex = groups.findIndex(g => g.name === groupName);

    if (groupIndex !== -1) {
      const updatedGroups = [...groups];
      const group = updatedGroups[groupIndex];

      updatedGroups[groupIndex] = {
        ...group,
        standings: buildStandings(group, rankings)
      };

      // Reordering a group unconfirms it until the user re-confirms.
      set((state) => ({
        groups: updatedGroups,
        confirmedGroups: { ...state.confirmedGroups, [groupName]: false }
      }));

      // Auto-generate knockout if all groups have standings
      const allGroupsComplete = updatedGroups.every(g => g.standings.length === 4);
      if (allGroupsComplete) {
        get().generateKnockout();
      }
    }
  },

  setGroupConfirmed: (groupName, confirmed) => {
    set((state) => ({
      confirmedGroups: { ...state.confirmedGroups, [groupName]: confirmed }
    }));
  },

  setThirdPlaceRanking: (rankings) => {
    set({ thirdPlaceTeams: rankings });
    // Regenerate knockout with new third place rankings
    const { simulation, groups } = get();
    simulation.groups = groups;
    simulation.thirdPlaceTeams = rankings;
    simulation.generateKnockoutMatches();
    const state = simulation.getState();
    set({
      knockoutMatches: state.knockoutMatches
    });
  },

  generateKnockout: () => {
    const { simulation, groups } = get();

    // Set the simulation groups to match our store groups
    simulation.groups = groups;

    simulation.generateKnockoutMatches();
    const state = simulation.getState();

    set({
      knockoutMatches: state.knockoutMatches,
      thirdPlaceTeams: state.thirdPlaceTeams
    });
  },

  resetSimulation: () => {
    const simulation = new SimulationEngine();
    const state = simulation.getState();

    set({
      simulation,
      groups: state.groups,
      knockoutMatches: state.knockoutMatches,
      thirdPlaceTeams: state.thirdPlaceTeams
    });
  },

  setCurrentView: (view) => set({ currentView: view }),

  setSelectedGroup: (group) => set({ selectedGroup: group }),

  saveScenario: (name, description) => {
    const { groups, knockoutMatches } = get();
    const scenario: SimulationScenario = {
      id: Date.now().toString(),
      name,
      description,
      groupResults: new Map(),
      knockoutResults: new Map(),
      potentialWinners: [],
      underdogRuns: []
    };

    // Save current state
    groups.forEach(group => {
      scenario.groupResults.set(group.name, group.matches.filter(m => m.result));
    });

    knockoutMatches.forEach(match => {
      if (match.result) {
        scenario.knockoutResults.set(match.id, match);
      }
    });

    set((state) => ({
      scenarios: [...state.scenarios, scenario]
    }));
  },

  loadScenario: (scenarioId) => {
    const { scenarios } = get();
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      // Implementation to load scenario
      // This would restore the saved state
    }
  }
}));

// Initialize with default (all-confirmed) standings so the bracket and
// third-place ranking are ready immediately.
useTournamentStore.getState().initializeGroups();