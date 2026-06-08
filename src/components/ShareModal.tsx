import { useState } from 'react';
import { useTournamentStore } from '../store/tournamentStore';
import { X, Copy, Check, Share2 } from 'lucide-react';

export default function ShareModal({ onClose }: { onClose: () => void }) {
  const getShareCode = useTournamentStore(s => s.getShareCode);
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}${window.location.pathname}#share=${getShareCode()}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the user can still select the text manually.
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-zinc-300" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-zinc-100">Share your bracket</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 rounded hover:bg-zinc-900"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm text-zinc-400 mb-4">
            Anyone with this link can view your predictions — group stages through to the final.
          </p>

          <div className="flex items-center gap-2">
            <input
              readOnly
              value={url}
              onFocus={e => e.target.select()}
              className="flex-1 min-w-0 h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
            />
            <button
              onClick={copy}
              className={`h-9 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 shrink-0 ${
                copied ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-100 hover:bg-white text-zinc-950'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" strokeWidth={2} /> : <Copy className="w-3.5 h-3.5" strokeWidth={2} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
