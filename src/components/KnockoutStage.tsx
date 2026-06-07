import { useState } from 'react';
import { useTournamentStore } from '../store/tournamentStore';
import { Trophy, ChevronRight } from 'lucide-react';

export default function KnockoutStage() {
  const { knockoutMatches, updateKnockoutResult, generateKnockout, groups } = useTournamentStore();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  // Check if group stage is complete
  const isGroupStageComplete = groups.every(group =>
    group.matches.every(match => match.result !== undefined)
  );

  if (!isGroupStageComplete) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Complete Group Stage First
          </h3>
          <p className="text-gray-600">
            You need to complete all group stage matches before the knockout stage can begin.
          </p>
          <button
            onClick={generateKnockout}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Knockout Bracket
          </button>
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
    third: knockoutMatches.filter(m => m.stage === 'third'),
    final: knockoutMatches.filter(m => m.stage === 'final')
  };

  const stageLabels = {
    round32: 'Round of 32',
    round16: 'Round of 16',
    quarter: 'Quarterfinals',
    semi: 'Semifinals',
    third: 'Third Place Match',
    final: 'Final'
  };

  const handleMatchClick = (matchId: string, winnerId: string) => {
    updateKnockoutResult(matchId, winnerId);
    setSelectedMatch(null);
  };

  return (
    <div className="space-y-6">
      {/* Bracket View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6">Knockout Stage Bracket</h2>

        <div className="overflow-x-auto">
          <div className="min-w-[1200px] space-y-8">
            {Object.entries(matchesByStage).map(([stage, matches]) => (
              <div key={stage}>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  {stageLabels[stage as keyof typeof stageLabels]}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="text-xs text-gray-500 mb-2">
                        Match {match.matchNumber} • {new Date(match.date).toLocaleDateString()}
                      </div>

                      {match.team1 && match.team2 ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleMatchClick(match.id, match.team1.name)}
                            className={`w-full text-left px-3 py-2 rounded transition-colors ${
                              match.result?.winner === match.team1
                                ? 'bg-green-100 text-green-700 font-semibold'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            {match.team1.name}
                            {match.result?.winner === match.team1 && (
                              <span className="float-right">✓</span>
                            )}
                          </button>

                          <button
                            onClick={() => handleMatchClick(match.id, match.team2.name)}
                            className={`w-full text-left px-3 py-2 rounded transition-colors ${
                              match.result?.winner === match.team2
                                ? 'bg-green-100 text-green-700 font-semibold'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            {match.team2.name}
                            {match.result?.winner === match.team2 && (
                              <span className="float-right">✓</span>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="px-3 py-2 bg-gray-50 rounded text-gray-400 text-sm">
                            {match.sourcePosition1 || 'TBD'}
                          </div>
                          <div className="px-3 py-2 bg-gray-50 rounded text-gray-400 text-sm">
                            {match.sourcePosition2 || 'TBD'}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Champion Display */}
      {matchesByStage.final[0]?.result && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg shadow-sm border border-yellow-300 p-8">
          <div className="text-center">
            <Trophy className="w-20 h-20 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              World Cup Champion
            </h2>
            <p className="text-2xl font-semibold text-yellow-600">
              {matchesByStage.final[0].result.winner}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}