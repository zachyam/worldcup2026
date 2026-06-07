import { useTournamentStore } from '../store/tournamentStore';
import { Trophy, Users, TrendingUp, RotateCcw } from 'lucide-react';

export default function Navigation() {
  const { currentView, setCurrentView, resetSimulation } = useTournamentStore();

  const navItems = [
    { id: 'groups', label: 'Group Stage', icon: Users },
    { id: 'knockout', label: 'Knockout Stage', icon: Trophy },
    { id: 'insights', label: 'Betting Insights', icon: TrendingUp },
  ] as const;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 ${
                  currentView === id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={resetSimulation}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Simulation
          </button>
        </div>
      </div>
    </nav>
  );
}