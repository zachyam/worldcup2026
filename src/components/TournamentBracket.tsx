import { useTournamentStore } from '../store/tournamentStore';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Team, KnockoutMatch, Group } from '../types/tournament';

// Team colors mapping
const teamColors: Record<string, string> = {
  'Argentina': 'bg-sky-400',
  'France': 'bg-blue-600',
  'Brazil': 'bg-yellow-400',
  'Croatia': 'bg-red-600',
  'Netherlands': 'bg-orange-500',
  'Portugal': 'bg-red-600',
  'England': 'bg-zinc-300',
  'Spain': 'bg-red-700',
  'Germany': 'bg-zinc-800',
  'Belgium': 'bg-red-600',
  'Morocco': 'bg-red-600',
  'Japan': 'bg-blue-800',
  'USA': 'bg-blue-700',
  'Mexico': 'bg-green-600',
  'Australia': 'bg-yellow-400',
  'South Korea': 'bg-red-600',
  'Poland': 'bg-red-500',
  'Senegal': 'bg-green-600',
  'Switzerland': 'bg-red-600',
};

// Resolve a team's group origin as a short tag, e.g. "1A" (group A winner),
// "2C" (group C runner-up) or "3F" (group F third place).
function groupTagFor(groups: Group[], team: Team | null): string | null {
  if (!team) return null;
  const group =
    groups.find(g => g.name === team.group) ||
    groups.find(g => g.standings.some(s => s.team.name === team.name));
  if (!group) return null;
  const index = group.standings.findIndex(s => s.team.name === team.name);
  return index === -1 ? null : `${index + 1}${group.name}`;
}

export default function TournamentBracket() {
  const { knockoutMatches, groups, generateKnockout, updateKnockoutResult } = useTournamentStore();
  const [champion, setChampion] = useState<Team | null>(null);

  useEffect(() => {
    // Auto-generate knockout if group stage is complete
    const isComplete = groups.every(group => group.standings.length === 4);
    if (isComplete && knockoutMatches.length === 0) {
      generateKnockout();
    }

    // Find champion
    const final = knockoutMatches.find(m => m.stage === 'final');
    if (final?.result?.winner && typeof final.result.winner !== 'string') {
      setChampion(final.result.winner);
    }
  }, [groups, knockoutMatches, generateKnockout]);

  // Check if groups are complete
  const groupsComplete = groups.every(g => g.standings.length === 4);

  if (!groupsComplete) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-400 mb-2">Complete Group Stage First</h2>
          <p className="text-sm text-zinc-500">
            Rank all teams in each group to generate the knockout bracket
          </p>
        </div>
      </div>
    );
  }

  // Organize matches by stage
  const matchesByStage = {
    round32: knockoutMatches.filter(m => m.stage === 'round32'),
    round16: knockoutMatches.filter(m => m.stage === 'round16'),
    quarter: knockoutMatches.filter(m => m.stage === 'quarter'),
    semi: knockoutMatches.filter(m => m.stage === 'semi'),
    final: knockoutMatches.filter(m => m.stage === 'final')
  };

  // Split matches for bracket sides
  const leftR32 = matchesByStage.round32.slice(0, 8);
  const rightR32 = matchesByStage.round32.slice(8, 16);
  const leftR16 = matchesByStage.round16.slice(0, 4);
  const rightR16 = matchesByStage.round16.slice(4, 8);
  const leftQuarters = matchesByStage.quarter.slice(0, 2);
  const rightQuarters = matchesByStage.quarter.slice(2, 4);
  const leftSemi = matchesByStage.semi[0];
  const rightSemi = matchesByStage.semi[1];
  const finalMatch = matchesByStage.final[0];

  const handleMatchClick = (match: KnockoutMatch, winner: Team) => {
    if (match.team1 && match.team2) {
      updateKnockoutResult(match.id, winner.name);
    }
  };

  return (
    <div className="min-w-max h-full flex items-center justify-center gap-12 p-12 md:p-24 mx-auto">

      {/* LEFT BRACKET */}
      <div className="flex items-center gap-10">

        {/* Round of 32 - Left */}
        <div className="flex flex-col gap-8">
          {leftR32.map((match, i) => (
            <div key={match.id} className="flex flex-col gap-4">
              <MatchCard match={match} onWinnerSelect={handleMatchClick} />
            </div>
          ))}
        </div>

        {/* Round of 16 - Left */}
        <div className="flex flex-col gap-16 justify-center">
          {leftR16.map((match, i) => {
            const sourceMatches = [leftR32[i*2], leftR32[i*2+1]];
            return (
              <div key={match.id} className="flex items-center gap-8">
                <div className="flex flex-col gap-4">
                  {sourceMatches.map(sm => sm && (
                    <MatchCard key={sm.id} match={sm} onWinnerSelect={handleMatchClick} />
                  ))}
                </div>
                <MatchCard match={match} onWinnerSelect={handleMatchClick} />
              </div>
            );
          })}
        </div>

        {/* Quarterfinals - Left */}
        <div className="flex flex-col gap-32 justify-center">
          {leftQuarters.map((match) => (
            <MatchCard key={match.id} match={match} onWinnerSelect={handleMatchClick} />
          ))}
        </div>

        {/* Semifinal - Left */}
        {leftSemi && (
          <MatchCard
            match={leftSemi}
            onWinnerSelect={handleMatchClick}
            isSemifinal
          />
        )}

      </div>

      {/* CENTER (Final & Champion) */}
      <div className="flex flex-col items-center justify-center mx-6 z-10">

        {/* Trophy / Winner Announcement */}
        <div className="mb-10 flex flex-col items-center group cursor-pointer">
          <div className={`w-16 h-16 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-4 ${
            champion ? 'shadow-[0_0_40px_-10px_rgba(250,204,21,0.2)] group-hover:border-yellow-500/50' : ''
          } transition-colors`}>
            <Trophy className={`w-8 h-8 ${
              champion ? 'text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'text-zinc-600'
            }`} strokeWidth={1.5} />
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium mb-1.5 group-hover:text-zinc-400 transition-colors">
            World Champions
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tighter text-zinc-100 drop-shadow-sm">
            {champion ? champion.name.toUpperCase() : 'TBD'}
          </h1>
        </div>

        {/* Final Match Card */}
        {finalMatch && (
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-br from-sky-500/20 via-zinc-900/0 to-blue-600/20 rounded-xl blur-md opacity-40 group-hover:opacity-100 transition duration-500" />
            <div className="w-[240px] bg-zinc-950 border border-zinc-700 rounded-xl shadow-2xl shrink-0 flex flex-col overflow-hidden relative z-10">
              {/* Header */}
              <div className="bg-zinc-900/60 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">Final</span>
                {finalMatch.result && (
                  <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    FT
                  </span>
                )}
              </div>
              {/* Teams */}
              <FinalTeamRow
                team={finalMatch.team1}
                score={finalMatch.result?.team1Score}
                isWinner={finalMatch.result?.winner === finalMatch.team1}
                onClick={() => finalMatch.team1 && finalMatch.team2 && handleMatchClick(finalMatch, finalMatch.team1)}
              />
              <FinalTeamRow
                team={finalMatch.team2}
                score={finalMatch.result?.team2Score}
                isWinner={finalMatch.result?.winner === finalMatch.team2}
                onClick={() => finalMatch.team2 && finalMatch.team1 && handleMatchClick(finalMatch, finalMatch.team2)}
                isSecond
              />
            </div>
          </div>
        )}

      </div>

      {/* RIGHT BRACKET */}
      <div className="flex items-center gap-10 flex-row-reverse">

        {/* Round of 32 - Right */}
        <div className="flex flex-col gap-8">
          {rightR32.map((match) => (
            <div key={match.id} className="flex flex-col gap-4">
              <MatchCard match={match} onWinnerSelect={handleMatchClick} />
            </div>
          ))}
        </div>

        {/* Round of 16 - Right */}
        <div className="flex flex-col gap-16 justify-center">
          {rightR16.map((match, i) => {
            const sourceMatches = [rightR32[i*2], rightR32[i*2+1]];
            return (
              <div key={match.id} className="flex items-center gap-8 flex-row-reverse">
                <div className="flex flex-col gap-4">
                  {sourceMatches.map(sm => sm && (
                    <MatchCard key={sm.id} match={sm} onWinnerSelect={handleMatchClick} />
                  ))}
                </div>
                <MatchCard match={match} onWinnerSelect={handleMatchClick} />
              </div>
            );
          })}
        </div>

        {/* Quarterfinals - Right */}
        <div className="flex flex-col gap-32 justify-center">
          {rightQuarters.map((match) => (
            <MatchCard key={match.id} match={match} onWinnerSelect={handleMatchClick} />
          ))}
        </div>

        {/* Semifinal - Right */}
        {rightSemi && (
          <MatchCard
            match={rightSemi}
            onWinnerSelect={handleMatchClick}
            isSemifinal
          />
        )}

      </div>

    </div>
  );
}

// Match Card Component
function MatchCard({
  match,
  onWinnerSelect,
  isSemifinal = false
}: {
  match: KnockoutMatch;
  onWinnerSelect: (match: KnockoutMatch, winner: Team) => void;
  isSemifinal?: boolean;
}) {
  const groups = useTournamentStore(s => s.groups);

  const getTeamColor = (team: Team | null) => {
    if (!team) return 'bg-zinc-700';
    return teamColors[team.name] || 'bg-zinc-600';
  };

  const isWinner = (team: Team | null) => match.result?.winner === team;

  // Get team source labels for Round of 32
  const getTeamSourceLabel = (team: Team | null, teamSlot: 'team1' | 'team2') => {
    if (team || match.stage !== 'round32') return null;

    // Parse the match ID to determine the group sources
    const matchNumber = parseInt(match.id.replace('r32-', ''));

    // FIFA World Cup bracket structure for 32 teams
    const bracketStructure = [
      { team1: '1A', team2: '2C' }, // Match 1
      { team1: '1C', team2: '2A' }, // Match 2
      { team1: '1B', team2: '2D' }, // Match 3
      { team1: '1D', team2: '2B' }, // Match 4
      { team1: '1E', team2: '2G' }, // Match 5
      { team1: '1G', team2: '2E' }, // Match 6
      { team1: '1F', team2: '2H' }, // Match 7
      { team1: '1H', team2: '2F' }, // Match 8
      { team1: '1I', team2: '3rd' }, // Match 9
      { team1: '1K', team2: '3rd' }, // Match 10
      { team1: '1J', team2: '3rd' }, // Match 11
      { team1: '1L', team2: '3rd' }, // Match 12
      { team1: '1M', team2: '3rd' }, // Match 13
      { team1: '1O', team2: '3rd' }, // Match 14
      { team1: '1N', team2: '3rd' }, // Match 15
      { team1: '1P', team2: '3rd' }, // Match 16
    ];

    if (matchNumber >= 1 && matchNumber <= 16) {
      const structure = bracketStructure[matchNumber - 1];
      const label = teamSlot === 'team1' ? structure.team1 : structure.team2;

      if (label.includes('3rd')) {
        return 'Best 3rd';
      }

      const position = label[0] === '1' ? 'Winner' : 'Runner-up';
      const group = label[1];
      return `Group ${group} ${position}`;
    }

    return null;
  };

  return (
    <div className={`w-[200px] bg-zinc-950 border rounded-lg shadow-sm hover:border-zinc-700 transition-colors shrink-0 flex flex-col overflow-hidden group cursor-pointer relative ${
      isSemifinal ? 'border-zinc-700/80 scale-[1.02]' : 'border-zinc-800/80'
    }`}>
      <TeamRow
        team={match.team1}
        score={match.result?.team1Score}
        isWinner={isWinner(match.team1)}
        teamColor={getTeamColor(match.team1)}
        onClick={() => match.team1 && match.team2 && onWinnerSelect(match, match.team1)}
        isTop
        sourceLabel={getTeamSourceLabel(match.team1, 'team1')}
        groupTag={groupTagFor(groups, match.team1)}
      />
      <TeamRow
        team={match.team2}
        score={match.result?.team2Score}
        isWinner={isWinner(match.team2)}
        teamColor={getTeamColor(match.team2)}
        onClick={() => match.team2 && match.team1 && onWinnerSelect(match, match.team2)}
        sourceLabel={getTeamSourceLabel(match.team2, 'team2')}
        groupTag={groupTagFor(groups, match.team2)}
      />
    </div>
  );
}

// Team Row Component
function TeamRow({
  team,
  score,
  isWinner,
  teamColor,
  onClick,
  isTop = false,
  sourceLabel,
  groupTag
}: {
  team: Team | null;
  score?: number;
  isWinner: boolean;
  teamColor: string;
  onClick: () => void;
  isTop?: boolean;
  sourceLabel?: string | null;
  groupTag?: string | null;
}) {
  return (
    <div
      onClick={onClick}
      className={`px-3 py-2.5 flex justify-between items-center relative ${
        isWinner ? 'bg-zinc-900/50' : ''
      } ${isTop ? 'border-b border-zinc-800/80' : ''} ${
        team ? 'hover:bg-zinc-900/40 transition-colors' : ''
      }`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${teamColor} ${
        isWinner ? '' : 'opacity-30'
      }`} />
      <div className="flex-1 flex items-baseline gap-1.5">
        <span className={`text-xs tracking-tight pl-1.5 ${
          isWinner ? 'font-semibold text-zinc-100' : 'font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors'
        }`}>
          {team ? team.name : (sourceLabel || 'TBD')}
        </span>
        {team && groupTag && (
          <span className="text-[10px] font-semibold tracking-wider text-zinc-600">
            {groupTag}
          </span>
        )}
      </div>
      {score !== undefined && (
        <span className={`text-xs ${
          isWinner ? 'font-semibold text-zinc-100' : 'font-medium text-zinc-500'
        }`}>
          {score}
        </span>
      )}
    </div>
  );
}

// Final Match Team Row
function FinalTeamRow({
  team,
  score,
  isWinner,
  onClick,
  isSecond = false
}: {
  team: Team | null;
  score?: number;
  isWinner: boolean;
  onClick: () => void;
  isSecond?: boolean;
}) {
  const groups = useTournamentStore(s => s.groups);
  const groupTag = groupTagFor(groups, team);

  const getTeamColor = (team: Team | null) => {
    if (!team) return 'bg-zinc-700';
    return teamColors[team.name] || 'bg-zinc-600';
  };

  return (
    <div
      onClick={onClick}
      className={`px-4 py-3.5 flex justify-between items-center relative hover:bg-zinc-900/40 transition-colors cursor-pointer ${
        isWinner ? 'bg-zinc-900/40' : ''
      } ${!isSecond ? 'border-b border-zinc-800' : ''}`}
    >
      <div className={`absolute inset-y-0 left-0 w-1.5 ${getTeamColor(team)} ${
        isWinner ? '' : 'opacity-50'
      }`} />
      <div className="flex items-center gap-3 pl-2">
        <div className={`w-5 h-5 rounded-full ${getTeamColor(team)} shadow-[inset_0_0_0_1px_rgba(255,255,255,${
          isWinner ? '0.2' : '0.1'
        })] ${!isWinner ? 'opacity-70' : ''}`} />
        <span className={`text-sm tracking-tight ${
          isWinner ? 'font-semibold text-zinc-100' : 'font-medium text-zinc-400'
        }`}>
          {team ? team.name : 'TBD'}
        </span>
        {team && groupTag && (
          <span className="text-[10px] font-semibold tracking-wider text-zinc-500">
            {groupTag}
          </span>
        )}
      </div>
      {score !== undefined && (
        <span className={`text-sm ${
          isWinner ? 'font-semibold text-zinc-100' : 'font-medium text-zinc-400'
        }`}>
          {score}
        </span>
      )}
    </div>
  );
}