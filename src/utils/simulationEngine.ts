import type { Team, Match, Group, GroupStanding, KnockoutMatch } from '../types/tournament';
import { groups as initialGroups, knockoutStructure } from '../data/tournamentData';
import { THIRD_PLACE_ALLOCATION, THIRD_PLACE_WINNER_ORDER } from '../data/thirdPlaceAllocation';

export class SimulationEngine {
  public groups: Group[];
  private knockoutMatches: Map<string, KnockoutMatch>;
  public thirdPlaceTeams: GroupStanding[];
  // Maps each "3rd Group X/Y/.." slot label to the team assigned to it.
  private thirdPlaceAllocation: Map<string, Team>;

  constructor() {
    this.groups = JSON.parse(JSON.stringify(initialGroups));
    this.knockoutMatches = new Map();
    this.thirdPlaceTeams = [];
    this.thirdPlaceAllocation = new Map();
  }

  // Calculate group standings based on match results
  calculateGroupStandings(group: Group): GroupStanding[] {
    const standings: Map<string, GroupStanding> = new Map();

    // Initialize standings for each team
    group.teams.forEach(team => {
      standings.set(team.name, {
        team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        position: 0
      });
    });

    // Process match results
    group.matches.forEach(match => {
      if (match.result) {
        const team1Standing = standings.get(match.team1.name)!;
        const team2Standing = standings.get(match.team2.name)!;

        team1Standing.played++;
        team2Standing.played++;
        team1Standing.goalsFor += match.result.team1Score;
        team1Standing.goalsAgainst += match.result.team2Score;
        team2Standing.goalsFor += match.result.team2Score;
        team2Standing.goalsAgainst += match.result.team1Score;

        if (match.result.winner === match.team1) {
          team1Standing.won++;
          team1Standing.points += 3;
          team2Standing.lost++;
        } else if (match.result.winner === match.team2) {
          team2Standing.won++;
          team2Standing.points += 3;
          team1Standing.lost++;
        } else {
          team1Standing.drawn++;
          team2Standing.drawn++;
          team1Standing.points++;
          team2Standing.points++;
        }

        team1Standing.goalDifference = team1Standing.goalsFor - team1Standing.goalsAgainst;
        team2Standing.goalDifference = team2Standing.goalsFor - team2Standing.goalsAgainst;
      }
    });

    // Sort standings
    const sortedStandings = Array.from(standings.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.team.name.localeCompare(b.team.name);
    });

    // Assign positions
    sortedStandings.forEach((standing, index) => {
      standing.position = index + 1;
    });

    return sortedStandings;
  }

  // Update match result
  updateMatchResult(matchId: string, team1Score: number, team2Score: number): void {
    for (const group of this.groups) {
      const match = group.matches.find(m => m.id === matchId);
      if (match) {
        let winner: Team | 'draw';
        if (team1Score > team2Score) {
          winner = match.team1;
        } else if (team2Score > team1Score) {
          winner = match.team2;
        } else {
          winner = 'draw';
        }

        match.result = {
          team1Score,
          team2Score,
          winner
        };

        // Recalculate standings for this group
        group.standings = this.calculateGroupStandings(group);
        break;
      }
    }
  }

  // Get all third-place teams and rank them
  rankThirdPlaceTeams(): GroupStanding[] {
    const thirdPlaceTeams: GroupStanding[] = [];

    this.groups.forEach(group => {
      if (group.standings.length >= 3) {
        thirdPlaceTeams.push(group.standings[2]);
      }
    });

    // Sort third-place teams according to FIFA rules
    return thirdPlaceTeams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.team.name.localeCompare(b.team.name);
    });
  }

  // Allocate the 8 best third-place teams to their Round-of-32 slots using
  // FIFA's official Annex C table: the exact slot for each third depends on
  // which eight groups supplied the qualifying thirds.
  computeThirdPlaceAllocation(): void {
    this.thirdPlaceAllocation = new Map();

    // The 8 qualifiers, honouring the user's manual ranking when one is set.
    const ranked = this.thirdPlaceTeams.length > 0
      ? this.thirdPlaceTeams
      : this.rankThirdPlaceTeams();
    const qualifiers = ranked.slice(0, 8);
    if (qualifiers.length < 8) {
      // Not all groups have results yet — fall back to constraint matching.
      this.matchThirdPlaceTeams(qualifiers);
      return;
    }

    // Look up the official assignment for this set of qualifying groups.
    const key = qualifiers.map(q => q.team.group).sort().join('');
    const row = THIRD_PLACE_ALLOCATION[key];
    if (!row) {
      this.matchThirdPlaceTeams(qualifiers);
      return;
    }

    // row[i] is the group of the third-place team facing winner of group
    // THIRD_PLACE_WINNER_ORDER[i]. Map each winner's slot to that team.
    const teamByGroup = new Map(qualifiers.map(q => [q.team.group, q.team]));
    knockoutStructure.round32.forEach(m => {
      if (!m.sourcePosition2.startsWith('3rd Group')) return;
      const winner = m.sourcePosition1.replace('Winner Group ', '');
      const slotIdx = THIRD_PLACE_WINNER_ORDER.indexOf(winner as never);
      if (slotIdx === -1) return;
      const team = teamByGroup.get(row[slotIdx]);
      if (team) this.thirdPlaceAllocation.set(m.sourcePosition2, team);
    });
  }

  // Fallback allocation (used before all groups finish, or for any combination
  // not covered by the official table): bipartite matching that respects each
  // slot's allowed group set so no team is duplicated or wrongly included.
  private matchThirdPlaceTeams(qualifiers: GroupStanding[]): void {
    if (qualifiers.length === 0) return;

    const slots = knockoutStructure.round32
      .filter(m => m.sourcePosition2.startsWith('3rd Group'))
      .map(m => ({
        label: m.sourcePosition2,
        allowed: m.sourcePosition2.replace('3rd Group ', '').split('/')
      }));

    // Kuhn's algorithm. matchTeam[t] = index of the slot assigned to qualifier t.
    const matchTeam: (number | null)[] = qualifiers.map(() => null);

    const augment = (slotIdx: number, visited: boolean[]): boolean => {
      for (let t = 0; t < qualifiers.length; t++) {
        if (visited[t]) continue;
        if (!slots[slotIdx].allowed.includes(qualifiers[t].team.group)) continue;
        visited[t] = true;
        if (matchTeam[t] === null || augment(matchTeam[t]!, visited)) {
          matchTeam[t] = slotIdx;
          return true;
        }
      }
      return false;
    };

    for (let s = 0; s < slots.length; s++) {
      augment(s, qualifiers.map(() => false));
    }

    slots.forEach((slot, idx) => {
      const t = matchTeam.findIndex(slotIdx => slotIdx === idx);
      if (t !== -1) {
        this.thirdPlaceAllocation.set(slot.label, qualifiers[t].team);
      }
    });
  }

  // Get team for knockout position
  getTeamForPosition(position: string): Team | null {
    if (position.startsWith('Winner Group')) {
      const groupLetter = position.replace('Winner Group ', '');
      const group = this.groups.find(g => g.name === groupLetter);
      return group?.standings[0]?.team || null;
    }

    if (position.startsWith('Runner-up Group')) {
      const groupLetter = position.replace('Runner-up Group ', '');
      const group = this.groups.find(g => g.name === groupLetter);
      return group?.standings[1]?.team || null;
    }

    if (position.startsWith('3rd Group')) {
      // Use the pre-computed allocation so each qualifying third-place team
      // fills exactly one slot and excluded teams never appear.
      return this.thirdPlaceAllocation.get(position) || null;
    }

    return null;
  }

  // Generate knockout matches based on group results
  generateKnockoutMatches(): void {
    // Assign the qualifying third-place teams to their slots first.
    this.computeThirdPlaceAllocation();

    // Round of 32
    knockoutStructure.round32.forEach((match, index) => {
      const team1 = this.getTeamForPosition(match.sourcePosition1);
      const team2 = this.getTeamForPosition(match.sourcePosition2);

      if (team1 && team2) {
        const knockoutMatch: KnockoutMatch = {
          id: match.id,
          matchNumber: 73 + index,
          date: '2026-06-28',
          team1,
          team2,
          stage: 'round32',
          sourcePosition1: match.sourcePosition1,
          sourcePosition2: match.sourcePosition2
        };
        this.knockoutMatches.set(match.id, knockoutMatch);
      }
    });
  }

  // Update knockout match result and progress winner
  updateKnockoutResult(matchId: string, winnerId: string): void {
    const match = this.knockoutMatches.get(matchId);
    if (!match) return;

    const winner = match.team1.name === winnerId ? match.team1 : match.team2;
    const loser = match.team1.name === winnerId ? match.team2 : match.team1;

    match.result = {
      team1Score: match.team1.name === winnerId ? 1 : 0,
      team2Score: match.team2.name === winnerId ? 1 : 0,
      winner
    };

    // Progress to next round
    this.progressToNextRound(matchId, winner, loser);
  }

  private progressToNextRound(matchId: string, winner: Team, loser: Team): void {
    // Check Round of 16 matches
    knockoutStructure.round16.forEach((nextMatch, index) => {
      if (nextMatch.sourceMatch1 === matchId || nextMatch.sourceMatch2 === matchId) {
        let existingMatch = this.knockoutMatches.get(nextMatch.id);

        if (!existingMatch) {
          existingMatch = {
            id: nextMatch.id,
            matchNumber: 89 + index,
            date: '2026-07-04',
            team1: null as any,
            team2: null as any,
            stage: 'round16',
            sourceMatch1: nextMatch.sourceMatch1,
            sourceMatch2: nextMatch.sourceMatch2
          };
          this.knockoutMatches.set(nextMatch.id, existingMatch);
        }

        if (nextMatch.sourceMatch1 === matchId) {
          existingMatch.team1 = winner;
        } else {
          existingMatch.team2 = winner;
        }
      }
    });

    // Similar logic for quarterfinals, semifinals, and finals
    this.checkAndProgressQuarterfinals(matchId, winner, loser);
    this.checkAndProgressSemifinals(matchId, winner, loser);
    this.checkAndProgressFinal(matchId, winner, loser);
  }

  private checkAndProgressQuarterfinals(matchId: string, winner: Team, loser: Team): void {
    knockoutStructure.quarterfinals.forEach((nextMatch, index) => {
      if (nextMatch.sourceMatch1 === matchId || nextMatch.sourceMatch2 === matchId) {
        let existingMatch = this.knockoutMatches.get(nextMatch.id);

        if (!existingMatch) {
          existingMatch = {
            id: nextMatch.id,
            matchNumber: 97 + index,
            date: '2026-07-09',
            team1: null as any,
            team2: null as any,
            stage: 'quarter',
            sourceMatch1: nextMatch.sourceMatch1,
            sourceMatch2: nextMatch.sourceMatch2
          };
          this.knockoutMatches.set(nextMatch.id, existingMatch);
        }

        if (nextMatch.sourceMatch1 === matchId) {
          existingMatch.team1 = winner;
        } else {
          existingMatch.team2 = winner;
        }
      }
    });
  }

  private checkAndProgressSemifinals(matchId: string, winner: Team, loser: Team): void {
    knockoutStructure.semifinals.forEach((nextMatch, index) => {
      if (nextMatch.sourceMatch1 === matchId || nextMatch.sourceMatch2 === matchId) {
        let existingMatch = this.knockoutMatches.get(nextMatch.id);

        if (!existingMatch) {
          existingMatch = {
            id: nextMatch.id,
            matchNumber: 101 + index,
            date: '2026-07-14',
            team1: null as any,
            team2: null as any,
            stage: 'semi',
            sourceMatch1: nextMatch.sourceMatch1,
            sourceMatch2: nextMatch.sourceMatch2
          };
          this.knockoutMatches.set(nextMatch.id, existingMatch);
        }

        if (nextMatch.sourceMatch1 === matchId) {
          existingMatch.team1 = winner;
        } else {
          existingMatch.team2 = winner;
        }
      }
    });

    // Handle third place match
    if (knockoutStructure.thirdPlace.sourceMatch1 === matchId ||
        knockoutStructure.thirdPlace.sourceMatch2 === matchId) {
      let thirdPlaceMatch = this.knockoutMatches.get(knockoutStructure.thirdPlace.id);

      if (!thirdPlaceMatch) {
        thirdPlaceMatch = {
          id: knockoutStructure.thirdPlace.id,
          matchNumber: 103,
          date: '2026-07-18',
          team1: null as any,
          team2: null as any,
          stage: 'third'
        };
        this.knockoutMatches.set(knockoutStructure.thirdPlace.id, thirdPlaceMatch);
      }

      if (knockoutStructure.thirdPlace.sourceMatch1 === matchId) {
        thirdPlaceMatch.team1 = loser; // Loser goes to third place match
      } else {
        thirdPlaceMatch.team2 = loser;
      }
    }
  }

  private checkAndProgressFinal(matchId: string, winner: Team, loser: Team): void {
    if (knockoutStructure.final.sourceMatch1 === matchId ||
        knockoutStructure.final.sourceMatch2 === matchId) {
      let finalMatch = this.knockoutMatches.get(knockoutStructure.final.id);

      if (!finalMatch) {
        finalMatch = {
          id: knockoutStructure.final.id,
          matchNumber: 104,
          date: '2026-07-19',
          team1: null as any,
          team2: null as any,
          stage: 'final',
          sourceMatch1: knockoutStructure.final.sourceMatch1,
          sourceMatch2: knockoutStructure.final.sourceMatch2
        };
        this.knockoutMatches.set(knockoutStructure.final.id, finalMatch);
      }

      if (knockoutStructure.final.sourceMatch1 === matchId) {
        finalMatch.team1 = winner;
      } else {
        finalMatch.team2 = winner;
      }
    }
  }

  // Get current tournament state
  getState() {
    return {
      groups: this.groups,
      knockoutMatches: Array.from(this.knockoutMatches.values()),
      thirdPlaceTeams: this.rankThirdPlaceTeams()
    };
  }

  // Reset simulation
  reset(): void {
    this.groups = JSON.parse(JSON.stringify(initialGroups));
    this.knockoutMatches.clear();
    this.thirdPlaceTeams = [];
  }

  // Check if group stage is complete
  isGroupStageComplete(): boolean {
    return this.groups.every(group =>
      group.matches.every(match => match.result !== undefined)
    );
  }

  // Get potential paths to final for a team
  getPathToFinal(teamName: string): string[] {
    const path: string[] = [];

    // Find team's starting position
    const team = this.groups
      .flatMap(g => g.teams)
      .find(t => t.name === teamName);

    if (!team) return path;

    // Track through knockout matches
    // This would need more sophisticated logic to track actual paths

    return path;
  }
}