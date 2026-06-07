import { useTournamentStore } from '../store/tournamentStore';
import { TrendingUp, AlertTriangle, Trophy, DollarSign } from 'lucide-react';
import type { Team } from '../types/tournament';

export default function Insights() {
  const { groups, knockoutMatches, scenarios } = useTournamentStore();

  // Analyze potential underdogs
  const analyzeUnderdogs = () => {
    const underdogs: { team: Team; stage: string; odds: string }[] = [];

    // Check for surprising group leaders
    groups.forEach(group => {
      if (group.standings.length > 0) {
        const leader = group.standings[0];
        // Consider teams from smaller nations as underdogs
        const underdogTeams = ['Curaçao', 'Haiti', 'Cape Verde', 'Jordan', 'Panama', 'New Zealand'];
        if (underdogTeams.includes(leader.team.name)) {
          underdogs.push({
            team: leader.team,
            stage: 'Group Winner',
            odds: 'High Value'
          });
        }
      }
    });

    // Check for underdogs advancing to later knockout rounds
    knockoutMatches.forEach(match => {
      if (match.result) {
        const underdogTeams = ['Curaçao', 'Haiti', 'Cape Verde', 'Jordan', 'Panama', 'New Zealand',
                               'DR Congo', 'Uzbekistan', 'Iraq', 'Bosnia and Herzegovina'];
        if (underdogTeams.includes(match.result.winner.name)) {
          let value = 'Moderate';
          if (match.stage === 'quarter') value = 'High';
          if (match.stage === 'semi') value = 'Extremely High';

          underdogs.push({
            team: match.result.winner,
            stage: match.stage,
            odds: value
          });
        }
      }
    });

    return underdogs;
  };

  // Calculate potential paths for teams
  const calculatePaths = () => {
    const paths: { team: string; difficulty: string; keyMatches: string[] }[] = [];

    // Analyze top contenders
    const topTeams = ['Brazil', 'Argentina', 'France', 'Germany', 'Spain', 'England', 'Portugal', 'Netherlands'];

    topTeams.forEach(teamName => {
      const team = groups.flatMap(g => g.teams).find(t => t.name === teamName);
      if (team) {
        const group = groups.find(g => g.name === team.group);
        const standing = group?.standings.find(s => s.team.name === teamName);

        let difficulty = 'Easy';
        const keyMatches: string[] = [];

        // Check group position
        if (standing) {
          if (standing.position > 2) {
            difficulty = 'Hard';
            keyMatches.push(`Must finish top 2 in Group ${team.group}`);
          }
        }

        // Check potential opponents
        if (team.group === 'A' || team.group === 'B') {
          keyMatches.push('Likely to face strong opposition in Round of 16');
          difficulty = 'Moderate';
        }

        paths.push({
          team: teamName,
          difficulty,
          keyMatches
        });
      }
    });

    return paths;
  };

  const underdogs = analyzeUnderdogs();
  const paths = calculatePaths();

  // Betting recommendations
  const getBettingRecommendations = () => {
    const recommendations = [];

    // High value underdogs
    const highValueUnderdogs = underdogs.filter(u => u.odds === 'High Value' || u.odds === 'Extremely High');
    if (highValueUnderdogs.length > 0) {
      recommendations.push({
        type: 'underdog',
        title: 'High Value Underdog Bets',
        teams: highValueUnderdogs.map(u => u.team.name),
        description: 'These teams are performing beyond expectations and could offer significant returns'
      });
    }

    // Safe bets
    const safeBets = ['Brazil', 'France', 'Argentina'].filter(team => {
      const group = groups.find(g => g.teams.some(t => t.name === team));
      const standing = group?.standings.find(s => s.team.name === team);
      return standing && standing.position <= 2;
    });

    if (safeBets.length > 0) {
      recommendations.push({
        type: 'safe',
        title: 'Safe Tournament Winner Bets',
        teams: safeBets,
        description: 'Traditional favorites with clear paths to the final'
      });
    }

    // Dark horses
    const darkHorses = ['Belgium', 'Croatia', 'Uruguay', 'Colombia'].filter(team => {
      const group = groups.find(g => g.teams.some(t => t.name === team));
      const standing = group?.standings.find(s => s.team.name === team);
      return standing && standing.position <= 2;
    });

    if (darkHorses.length > 0) {
      recommendations.push({
        type: 'dark-horse',
        title: 'Dark Horse Candidates',
        teams: darkHorses,
        description: 'Strong teams that could surprise at good odds'
      });
    }

    return recommendations;
  };

  const recommendations = getBettingRecommendations();

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Tournament Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Completion Status</h3>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(
                (groups.flatMap(g => g.matches).filter(m => m.result).length /
                  groups.flatMap(g => g.matches).length) * 100
              )}%
            </p>
            <p className="text-xs text-blue-700 mt-1">of group matches completed</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-2">Qualified Teams</h3>
            <p className="text-2xl font-bold text-green-600">
              {groups.filter(g => g.standings.length > 0).length * 2}
            </p>
            <p className="text-xs text-green-700 mt-1">teams qualified for knockout</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-purple-900 mb-2">Upsets Detected</h3>
            <p className="text-2xl font-bold text-purple-600">{underdogs.length}</p>
            <p className="text-xs text-purple-700 mt-1">underdog victories</p>
          </div>
        </div>
      </div>

      {/* Betting Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Betting Recommendations
        </h2>

        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`rounded-lg p-4 ${
                rec.type === 'underdog'
                  ? 'bg-red-50 border border-red-200'
                  : rec.type === 'safe'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <h3 className="font-semibold mb-2">{rec.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
              <div className="flex flex-wrap gap-2">
                {rec.teams.map((team) => (
                  <span
                    key={team}
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      rec.type === 'underdog'
                        ? 'bg-red-100 text-red-700'
                        : rec.type === 'safe'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {team}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Underdog Analysis */}
      {underdogs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Underdog Alert
          </h2>

          <div className="space-y-3">
            {underdogs.map((underdog, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
              >
                <div>
                  <span className="font-semibold">{underdog.team.name}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    reached {underdog.stage}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    underdog.odds === 'Extremely High'
                      ? 'bg-red-100 text-red-700'
                      : underdog.odds === 'High Value'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {underdog.odds}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Path to Victory Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Path to Victory Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paths.map((path, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{path.team}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    path.difficulty === 'Easy'
                      ? 'bg-green-100 text-green-700'
                      : path.difficulty === 'Moderate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {path.difficulty} Path
                </span>
              </div>
              {path.keyMatches.length > 0 && (
                <ul className="text-sm text-gray-600 space-y-1">
                  {path.keyMatches.map((match, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      {match}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}