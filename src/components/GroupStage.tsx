import { useTournamentStore } from '../store/tournamentStore';
import GroupTable from './GroupTable';
import MatchList from './MatchList';

export default function GroupStage() {
  const { groups, selectedGroup, setSelectedGroup } = useTournamentStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Group Selector */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Groups</h2>
          <div className="grid grid-cols-3 gap-2">
            {groups.map((group) => (
              <button
                key={group.name}
                onClick={() => setSelectedGroup(group.name)}
                className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                  selectedGroup === group.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Group {group.name}
              </button>
            ))}
          </div>

          {/* Third Place Teams Ranking */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Third Place Teams (Top 8 Qualify)
            </h3>
            <ThirdPlaceRanking />
          </div>
        </div>
      </div>

      {/* Group Details */}
      <div className="lg:col-span-2 space-y-6">
        {selectedGroup && (
          <>
            <GroupTable groupName={selectedGroup} />
            <MatchList groupName={selectedGroup} />
          </>
        )}
      </div>
    </div>
  );
}

function ThirdPlaceRanking() {
  const { thirdPlaceTeams } = useTournamentStore();

  if (thirdPlaceTeams.length === 0) {
    return (
      <p className="text-xs text-gray-500 italic">
        Complete group matches to see third place rankings
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {thirdPlaceTeams.slice(0, 8).map((standing, index) => (
        <div
          key={standing.team.name}
          className={`text-xs px-2 py-1 rounded flex justify-between ${
            index < 8 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
          }`}
        >
          <span>
            {index + 1}. {standing.team.name} ({standing.team.group})
          </span>
          <span className="font-medium">{standing.points}pts</span>
        </div>
      ))}
    </div>
  );
}