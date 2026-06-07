import { useTournamentStore } from '../store/tournamentStore';

interface Props {
  groupName: string;
}

export default function GroupTable({ groupName }: Props) {
  const { groups } = useTournamentStore();
  const group = groups.find((g) => g.name === groupName);

  if (!group) return null;

  // Calculate standings if not already done
  const standings = group.standings.length > 0 ? group.standings :
    group.teams.map((team, index) => ({
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      position: index + 1
    }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Group {groupName} Standings</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Pos</th>
              <th className="px-4 py-2 text-left">Team</th>
              <th className="px-4 py-2 text-center">P</th>
              <th className="px-4 py-2 text-center">W</th>
              <th className="px-4 py-2 text-center">D</th>
              <th className="px-4 py-2 text-center">L</th>
              <th className="px-4 py-2 text-center">GF</th>
              <th className="px-4 py-2 text-center">GA</th>
              <th className="px-4 py-2 text-center">GD</th>
              <th className="px-4 py-2 text-center font-semibold">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {standings.map((standing, index) => (
              <tr
                key={standing.team.name}
                className={`hover:bg-gray-50 transition-colors ${
                  index === 0 || index === 1
                    ? 'bg-green-50'
                    : index === 2
                    ? 'bg-yellow-50'
                    : ''
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium">
                  {standing.position}
                  {index === 0 || index === 1 ? (
                    <span className="ml-1 text-green-600">●</span>
                  ) : index === 2 ? (
                    <span className="ml-1 text-yellow-600">●</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {standing.team.name}
                    {standing.team.isHost && (
                      <span className="text-xs px-1 py-0.5 bg-blue-100 text-blue-600 rounded">
                        H
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-center">{standing.played}</td>
                <td className="px-4 py-3 text-sm text-center">{standing.won}</td>
                <td className="px-4 py-3 text-sm text-center">{standing.drawn}</td>
                <td className="px-4 py-3 text-sm text-center">{standing.lost}</td>
                <td className="px-4 py-3 text-sm text-center">{standing.goalsFor}</td>
                <td className="px-4 py-3 text-sm text-center">{standing.goalsAgainst}</td>
                <td className="px-4 py-3 text-sm text-center font-medium">
                  {standing.goalDifference > 0 && '+'}
                  {standing.goalDifference}
                </td>
                <td className="px-4 py-3 text-sm text-center font-bold">
                  {standing.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="text-green-600">●</span> Advance to Round of 32
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-600">●</span> Possible advancement (best third-placed)
          </span>
        </div>
      </div>
    </div>
  );
}