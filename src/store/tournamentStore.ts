import { create } from 'zustand';
import { SimulationEngine } from '../utils/simulationEngine';
import type { Group, KnockoutMatch, GroupStanding, SimulationScenario } from '../types/tournament';

interface TournamentStore {
  simulation: SimulationEngine;
  groups: Group[];
  knockoutMatches: KnockoutMatch[];
  thirdPlaceTeams: GroupStanding[];
  currentView: 'groups' | 'knockout' | 'insights';
  selectedGroup: string | null;
  scenarios: SimulationScenario[];

  // Actions
  updateMatchResult: (matchId: string, team1Score: number, team2Score: number) => void;
  updateKnockoutResult: (matchId: string, winnerId: string) => void;
  setGroupRanking: (groupName: string, rankings: string[]) => void;
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
  currentView: 'groups',
  selectedGroup: 'A',
  scenarios: [],

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

      // Create standings based on the rankings
      const newStandings = rankings.map((teamName, index) => {
        const team = group.teams.find(t => t.name === teamName)!;
        return {
          team,
          position: index + 1,
          played: 3,
          won: index === 0 ? 3 : index === 1 ? 2 : index === 2 ? 1 : 0,
          drawn: 0,
          lost: 3 - (index === 0 ? 3 : index === 1 ? 2 : index === 2 ? 1 : 0),
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: index === 0 ? 9 : index === 1 ? 6 : index === 2 ? 3 : 0
        };
      });

      updatedGroups[groupIndex] = {
        ...group,
        standings: newStandings
      };

      set({ groups: updatedGroups });

      // Auto-generate knockout if all groups have standings
      const allGroupsComplete = updatedGroups.every(g => g.standings.length === 4);
      if (allGroupsComplete) {
        get().generateKnockout();
      }
    }
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

// Initialize with default state
const store = useTournamentStore.getState();
const initialState = store.simulation.getState();
store.groups = initialState.groups;
store.knockoutMatches = initialState.knockoutMatches;