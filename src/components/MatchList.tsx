import { useState } from 'react';
import { useTournamentStore } from '../store/tournamentStore';
import { Calendar, MapPin } from 'lucide-react';

interface Props {
  groupName: string;
}

export default function MatchList({ groupName }: Props) {
  const { groups, updateMatchResult } = useTournamentStore();
  const group = groups.find((g) => g.name === groupName);
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [scores, setScores] = useState<{ [key: string]: { team1: string; team2: string } }>({});

  if (!group) return null;

  const handleScoreSubmit = (matchId: string) => {
    const score = scores[matchId];
    if (score) {
      updateMatchResult(matchId, parseInt(score.team1), parseInt(score.team2));
      setEditingMatch(null);
    }
  };

  const handleScoreChange = (matchId: string, team: 'team1' | 'team2', value: string) => {
    setScores({
      ...scores,
      [matchId]: {
        ...scores[matchId],
        [team]: value
      }
    });
  };

  // Group matches by matchday
  const matchdays = [
    group.matches.slice(0, 2),
    group.matches.slice(2, 4),
    group.matches.slice(4, 6)
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Group {groupName} Matches</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {matchdays.map((matches, dayIndex) => (
          <div key={dayIndex} className="p-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">
              Matchday {dayIndex + 1}
            </h4>
            <div className="space-y-3">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(match.date).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Match {match.matchNumber}
                    </span>
                  </div>

                  {editingMatch === match.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 text-right">
                          <span className="text-sm font-medium">{match.team1.name}</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                          value={scores[match.id]?.team1 || ''}
                          onChange={(e) => handleScoreChange(match.id, 'team1', e.target.value)}
                          autoFocus
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                          value={scores[match.id]?.team2 || ''}
                          onChange={(e) => handleScoreChange(match.id, 'team2', e.target.value)}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{match.team2.name}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleScoreSubmit(match.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMatch(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -m-1 p-1 rounded"
                      onClick={() => {
                        setEditingMatch(match.id);
                        setScores({
                          ...scores,
                          [match.id]: {
                            team1: match.result?.team1Score?.toString() || '',
                            team2: match.result?.team2Score?.toString() || ''
                          }
                        });
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-1 text-right">
                          <span className={`text-sm font-medium ${
                            match.result?.winner === match.team1 ? 'text-green-600' : ''
                          }`}>
                            {match.team1.name}
                            {match.team1.isHost && (
                              <span className="ml-1 text-xs text-blue-600">(H)</span>
                            )}
                          </span>
                        </div>

                        {match.result ? (
                          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded">
                            <span className="font-bold">{match.result.team1Score}</span>
                            <span className="text-gray-400">-</span>
                            <span className="font-bold">{match.result.team2Score}</span>
                          </div>
                        ) : (
                          <div className="px-4 py-1 bg-gray-50 rounded text-gray-400 text-sm">
                            vs
                          </div>
                        )}

                        <div className="flex-1">
                          <span className={`text-sm font-medium ${
                            match.result?.winner === match.team2 ? 'text-green-600' : ''
                          }`}>
                            {match.team2.name}
                            {match.team2.isHost && (
                              <span className="ml-1 text-xs text-blue-600">(H)</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {!match.result && (
                        <span className="text-xs text-gray-400 ml-2">
                          Click to predict
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}