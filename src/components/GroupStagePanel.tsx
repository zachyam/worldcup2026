import { useTournamentStore } from '../store/tournamentStore';
import { useState } from 'react';
import { Shield, Trophy, ChevronUp, ChevronDown, Grip } from 'lucide-react';
import type { Team, GroupStanding } from '../types/tournament';

export default function GroupStagePanel() {
  const { groups, selectedGroup, setSelectedGroup, setGroupRanking } = useTournamentStore();
  const [draggedTeam, setDraggedTeam] = useState<Team | null>(null);
  const [draggedOver, setDraggedOver] = useState<number | null>(null);

  const currentGroup = groups.find(g => g.name === selectedGroup) || groups[0];

  // Get current rankings or use default order
  const getCurrentRankings = () => {
    if (currentGroup.standings.length === 4) {
      return currentGroup.standings.sort((a, b) => a.position - b.position).map(s => s.team);
    }
    return currentGroup.teams;
  };

  const [rankings, setRankings] = useState<Team[]>(getCurrentRankings());

  // Update rankings when group changes
  const handleGroupChange = (groupName: string) => {
    setSelectedGroup(groupName);
    const newGroup = groups.find(g => g.name === groupName);
    if (newGroup) {
      if (newGroup.standings.length === 4) {
        setRankings(newGroup.standings.sort((a, b) => a.position - b.position).map(s => s.team));
      } else {
        setRankings(newGroup.teams);
      }
    }
  };

  const handleDragStart = (team: Team) => {
    setDraggedTeam(team);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggedOver(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedTeam) return;

    const draggedIndex = rankings.findIndex(t => t.name === draggedTeam.name);
    if (draggedIndex === dropIndex) return;

    const newRankings = [...rankings];
    newRankings.splice(draggedIndex, 1);
    newRankings.splice(dropIndex, 0, draggedTeam);

    setRankings(newRankings);
    setDraggedTeam(null);
    setDraggedOver(null);

    // Save to store
    setGroupRanking(currentGroup.name, newRankings.map(t => t.name));
  };

  const moveTeam = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= rankings.length) return;

    const newRankings = [...rankings];
    [newRankings[index], newRankings[newIndex]] = [newRankings[newIndex], newRankings[index]];

    setRankings(newRankings);
    setGroupRanking(currentGroup.name, newRankings.map(t => t.name));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Group Selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {groups.map((group) => (
            <button
              key={group.name}
              onClick={() => handleGroupChange(group.name)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${selectedGroup === group.name
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25'
                  : group.standings.length === 4
                    ? 'bg-green-900/40 text-green-400 border border-green-600/30'
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white'
                }
              `}
            >
              Group {group.name}
              {group.standings.length === 4 && (
                <span className="ml-2 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Group Ranking Interface */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="px-6 py-4 bg-gray-900/60 border-b border-gray-700/50">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Group {currentGroup.name} - Predicted Rankings
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Drag teams to reorder or use arrow buttons
            </p>
          </div>

          <div className="p-6 space-y-3">
            {rankings.map((team, index) => (
              <div
                key={team.name}
                draggable
                onDragStart={() => handleDragStart(team)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => {
                  setDraggedTeam(null);
                  setDraggedOver(null);
                }}
                className={`
                  relative rounded-lg transition-all cursor-move
                  ${draggedOver === index ? 'scale-105 opacity-50' : ''}
                  ${draggedTeam?.name === team.name ? 'opacity-50' : ''}
                  ${index === 0 || index === 1
                    ? 'bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-600/30'
                    : index === 2
                      ? 'bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border border-yellow-600/30'
                      : 'bg-gray-800/60 border border-gray-700/50'
                  }
                `}
              >
                <div className="flex items-center p-4">
                  {/* Drag Handle */}
                  <Grip className="w-5 h-5 text-gray-500 mr-3" />

                  {/* Position */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4
                    ${index === 0 || index === 1
                      ? 'bg-green-600 text-white'
                      : index === 2
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }
                  `}>
                    {index + 1}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-white">
                        {team.name}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({team.code})
                      </span>
                      {team.isHost && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                          HOST
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {index === 0 || index === 1
                        ? '→ Advance to Round of 32'
                        : index === 2
                          ? '→ Possible advancement (best 3rd)'
                          : '→ Eliminated'
                      }
                    </div>
                  </div>

                  {/* Move Buttons */}
                  <div className="flex flex-col gap-1 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTeam(index, 'up');
                      }}
                      disabled={index === 0}
                      className={`
                        p-1 rounded transition-colors
                        ${index === 0
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }
                      `}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTeam(index, 'down');
                      }}
                      disabled={index === rankings.length - 1}
                      className={`
                        p-1 rounded transition-colors
                        ${index === rankings.length - 1
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }
                      `}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-900/60 border-t border-gray-700/30">
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-400">Advance directly</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-gray-400">Best 3rd place</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  <span className="text-gray-400">Eliminated</span>
                </span>
              </div>
              <button
                onClick={() => {
                  const { setCurrentView } = useTournamentStore.getState();
                  setCurrentView('knockout');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                View Bracket →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Group Stage Progress</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all"
                style={{
                  width: `${(groups.filter(g => g.standings.length === 4).length / groups.length) * 100}%`
                }}
              />
            </div>
            <span className="text-sm text-gray-400">
              {groups.filter(g => g.standings.length === 4).length} / {groups.length} groups
            </span>
          </div>
          {groups.every(g => g.standings.length === 4) && (
            <p className="text-green-400 text-sm mt-3">
              ✓ All groups complete! Knockout bracket has been generated.
            </p>
          )}
        </div>
      </div>

      {/* Third Place Teams */}
      <div className="mt-8">
        <ThirdPlaceRanking />
      </div>
    </div>
  );
}

function ThirdPlaceRanking() {
  const { thirdPlaceTeams, setThirdPlaceRanking } = useTournamentStore();
  const [draggedTeam, setDraggedTeam] = useState<GroupStanding | null>(null);
  const [draggedOver, setDraggedOver] = useState<number | null>(null);
  const [rankings, setRankings] = useState<GroupStanding[]>(thirdPlaceTeams);

  // Re-sync the local order when the store's third-place teams change
  // (e.g. after group results are edited). Render-phase update avoids an effect.
  const [syncedTeams, setSyncedTeams] = useState(thirdPlaceTeams);
  if (syncedTeams !== thirdPlaceTeams) {
    setSyncedTeams(thirdPlaceTeams);
    setRankings(thirdPlaceTeams);
  }

  if (thirdPlaceTeams.length === 0) {
    return null;
  }

  const handleDragStart = (standing: GroupStanding) => {
    setDraggedTeam(standing);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggedOver(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedTeam) return;

    const draggedIndex = rankings.findIndex(s => s.team.name === draggedTeam.team.name);
    if (draggedIndex === dropIndex) return;

    const newRankings = [...rankings];
    newRankings.splice(draggedIndex, 1);
    newRankings.splice(dropIndex, 0, draggedTeam);

    setRankings(newRankings);
    setDraggedTeam(null);
    setDraggedOver(null);

    // Update the store
    setThirdPlaceRanking(newRankings);
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
      <div className="px-6 py-4 bg-gray-900/60 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-yellow-500" />
          Third Place Teams Ranking
        </h3>
        <p className="text-sm text-gray-400 mt-1">Drag any team to re-arrange the full ranking — the top 8 qualify for the knockout stage</p>
      </div>

      <div className="p-6">
        <div className="space-y-2">
          {rankings.map((standing, index) => (
            <div
              key={standing.team.name}
              draggable
              onDragStart={() => handleDragStart(standing)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={() => {
                setDraggedTeam(null);
                setDraggedOver(null);
              }}
              className={`
                px-4 py-3 rounded-lg flex items-center justify-between transition-all cursor-move
                ${index < 8
                  ? 'bg-green-900/30 border border-green-600/30 text-green-400 hover:bg-green-900/40'
                  : 'bg-gray-800/60 border border-gray-700/30 text-gray-400 hover:bg-gray-800/80'
                }
                ${draggedOver === index ? 'scale-105 opacity-50' : ''}
                ${draggedTeam?.team.name === standing.team.name ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <Grip className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">
                  {index + 1}.
                </span>
                <span className="font-medium">
                  {standing.team.name}
                </span>
                <span className="text-xs opacity-75">
                  ({standing.team.code} - Group {standing.team.group})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  {standing.points} pts | GD: {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                </span>
                {index < 8 && (
                  <span className="text-xs px-2 py-1 bg-green-600/20 rounded">Qualified</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}