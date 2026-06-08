import { useEffect, useState } from 'react';
import { useTournamentStore } from '../store/tournamentStore';
import TournamentBracket from './TournamentBracket';
import { Trophy, ArrowRight, Eye, AlertTriangle } from 'lucide-react';
import type { Group, Team } from '../types/tournament';

// The app's own URL, without the share hash — used for the "create your own" CTA.
const baseUrl = () => window.location.origin + window.location.pathname;

export default function ShareView({ code }: { code: string }) {
  const loadShareCode = useTournamentStore(s => s.loadShareCode);
  const groups = useTournamentStore(s => s.groups);
  const knockoutMatches = useTournamentStore(s => s.knockoutMatches);
  const [status, setStatus] = useState<'loading' | 'ok' | 'bad'>('loading');

  useEffect(() => {
    // One-time imperative load of the shared bracket on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(loadShareCode(code) ? 'ok' : 'bad');
  }, [code, loadShareCode]);

  if (status === 'loading') {
    return <div className="bg-zinc-950 min-h-screen" />;
  }

  if (status === 'bad') {
    return (
      <div className="bg-zinc-950 text-zinc-200 min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertTriangle className="w-10 h-10 text-zinc-600" strokeWidth={1.5} />
        <h1 className="text-lg font-semibold text-zinc-100">This shared link is invalid</h1>
        <p className="text-sm text-zinc-400 max-w-sm">The bracket link may be incomplete or out of date.</p>
        <a
          href={baseUrl()}
          className="mt-2 inline-flex items-center gap-2 h-10 px-6 bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-medium rounded-md transition-all active:scale-95"
        >
          Create your own bracket
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </a>
      </div>
    );
  }

  const final = knockoutMatches.find(m => m.stage === 'final');
  const champion: Team | null =
    final?.result && typeof final.result.winner !== 'string' ? final.result.winner : null;

  return (
    <div className="bg-zinc-950 text-zinc-200 min-h-screen flex flex-col relative selection:bg-zinc-800 selection:text-white">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] pointer-events-none" />

      {/* Header */}
      <header className="h-14 shrink-0 border-b border-zinc-800/80 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-6 z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-zinc-100 text-zinc-950 flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-semibold tracking-tighter text-zinc-100">WCSIM</span>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-zinc-500 border border-zinc-800 rounded px-2 py-1">
            <Eye className="w-3 h-3" strokeWidth={1.5} /> Shared prediction
          </span>
        </div>

        <a
          href={baseUrl()}
          className="h-8 px-4 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium rounded-md transition-all active:scale-95 flex items-center gap-2"
        >
          Create your own
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
        </a>
      </header>

      <main className="flex-1 overflow-auto relative z-0 custom-scrollbar">
        {/* Champion */}
        <div className="flex flex-col items-center pt-12 pb-6 px-4">
          <div className={`w-16 h-16 rounded-full bg-zinc-900/80 border flex items-center justify-center mb-4 ${
            champion ? 'border-yellow-500/40 shadow-[0_0_40px_-10px_rgba(250,204,21,0.3)]' : 'border-zinc-800'
          }`}>
            <Trophy className={`w-8 h-8 ${champion ? 'text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'text-zinc-600'}`} strokeWidth={1.5} />
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium mb-1.5">Predicted Champion</span>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-zinc-100">
            {champion ? champion.name.toUpperCase() : 'TBD'}
          </h1>
        </div>

        {/* Group Stage Predictions */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 text-center">
            Group Stage Predictions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groups.map(group => (
              <GroupCard key={group.name} group={group} />
            ))}
          </div>
        </section>

        {/* Knockout Bracket */}
        <section className="py-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2 text-center">
            Knockout Bracket
          </h2>
          <div className="overflow-x-auto">
            <TournamentBracket />
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="max-w-xl mx-auto px-4 py-12 text-center">
          <h3 className="text-lg font-semibold text-zinc-100">Think you can do better?</h3>
          <p className="text-sm text-zinc-400 mt-1.5 mb-5">
            Build your own World Cup 2026 prediction and share it with your friends.
          </p>
          <a
            href={baseUrl()}
            className="inline-flex items-center gap-2 h-10 px-6 bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-medium rounded-md transition-all active:scale-95"
          >
            Create your own bracket
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </a>
        </div>
      </main>
    </div>
  );
}

function GroupCard({ group }: { group: Group }) {
  const ranking = [...group.standings].sort((a, b) => a.position - b.position);

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800/80">
        <span className="text-xs font-semibold text-zinc-300 tracking-tight">Group {group.name}</span>
      </div>
      <div className="p-2 space-y-1">
        {ranking.map((standing, index) => {
          const accent = index < 2 ? 'bg-emerald-500' : index === 2 ? 'bg-yellow-500' : 'bg-zinc-700';
          return (
            <div key={standing.team.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md relative">
              <div className={`absolute inset-y-1 left-0 w-0.5 rounded-full ${accent}`} />
              <span className="text-[11px] font-semibold text-zinc-500 w-3 text-center">{index + 1}</span>
              <span className="text-sm text-zinc-200 flex-1 tracking-tight">{standing.team.name}</span>
              <span className="text-[10px] text-zinc-600 font-medium">{standing.team.code}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
