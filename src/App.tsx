import { useTournamentStore } from './store/tournamentStore';
import TournamentBracket from './components/TournamentBracket';
import GroupStagePanel from './components/GroupStagePanel';
import ShareView from './components/ShareView';
import ShareModal from './components/ShareModal';
import { Trophy, Share2 } from 'lucide-react';
import { useState } from 'react';

function App() {
  const { currentView, setCurrentView, groups, confirmedGroups, knockoutMatches } = useTournamentStore();
  const [shareOpen, setShareOpen] = useState(false);

  // Render the read-only shared view when arriving via a #share=... link.
  const [shareCode] = useState(() => {
    const match = window.location.hash.match(/^#share=(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  });
  if (shareCode !== null) return <ShareView code={shareCode} />;

  // Sharing unlocks only once every group is confirmed and a champion is set.
  const allConfirmed = groups.length > 0 && groups.every(g => confirmedGroups[g.name]);
  const finalMatch = knockoutMatches.find(m => m.stage === 'final');
  const canShare = allConfirmed && !!finalMatch?.result;

  return (
    <div className="bg-zinc-950 text-zinc-200 h-screen flex flex-col overflow-hidden relative selection:bg-zinc-800 selection:text-white">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] pointer-events-none" />

      {/* Header / Navigation */}
      <header className="h-14 shrink-0 border-b border-zinc-800/80 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 z-10 sticky top-0 gap-2">
        <div className="flex items-center gap-3 sm:gap-8 min-w-0">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group shrink-0">
            <div className="w-6 h-6 rounded-md bg-zinc-100 text-zinc-950 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Trophy className="w-3.5 h-3.5" strokeWidth={1.5} />
            </div>
            <span className="hidden sm:inline text-sm font-semibold tracking-tighter text-zinc-100">WCSIM</span>
          </div>

          {/* Segmented Control */}
          <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-md border border-zinc-800/60">
            <button
              onClick={() => setCurrentView('groups')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors focus:outline-none ${
                currentView === 'groups'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Group Stage
            </button>
            <button
              onClick={() => setCurrentView('knockout')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors focus:outline-none ${
                currentView === 'knockout'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Knockouts
            </button>
          </div>
        </div>

        {/* Share */}
        <button
          onClick={() => canShare && setShareOpen(true)}
          disabled={!canShare}
          title={canShare ? 'Share your bracket' : 'Confirm all groups and pick a champion to share'}
          className={`h-8 px-4 text-xs font-medium rounded-md transition-all flex items-center gap-2 focus:outline-none ${
            canShare
              ? 'bg-zinc-100 hover:bg-white text-zinc-950 active:scale-95 cursor-pointer'
              : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          Share
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-0 custom-scrollbar">
        {currentView === 'groups' ? <GroupStagePanel /> : <TournamentBracket />}
      </main>

      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
    </div>
  );
}

export default App;