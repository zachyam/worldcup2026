// Compact, backend-free sharing: the entire bracket selection is encoded into
// a URL hash. We store only the user's *inputs* (group orders, third-place
// order, knockout winner sides) and replay them through the SimulationEngine
// to rebuild the full state — guaranteeing the shared view matches the app.
import { knockoutStructure, groups as initialGroups } from '../data/tournamentData';

export interface SharePayload {
  v: number;
  g: string; // 12 groups x 4 team-index digits (canonical group order)
  t: string; // third-place ranking as 12 group letters
  k: string; // knockout winner sides in canonical order ('0' = team1, '1' = team2)
}

export const GROUP_LETTERS = initialGroups.map(g => g.name);

// Knockout matches in a fixed order, used for both encoding and replay.
export function canonicalMatchIds(): string[] {
  const ids: string[] = [];
  for (const round of ['round32', 'round16', 'quarterfinals', 'semifinals'] as const) {
    for (const m of knockoutStructure[round]) ids.push(m.id);
  }
  ids.push(knockoutStructure.final.id);
  return ids;
}

export function encodeShare(payload: SharePayload): string {
  return btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeShare(str: string): SharePayload | null {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(b64)) as SharePayload;
    // Validate shape so a malformed link degrades gracefully.
    if (payload.v !== 1) return null;
    if (!/^[0-3]{48}$/.test(payload.g)) return null;
    if (!new RegExp(`^[A-Z]{${GROUP_LETTERS.length}}$`).test(payload.t)) return null;
    if (!new RegExp(`^[01]{${canonicalMatchIds().length}}$`).test(payload.k)) return null;
    return payload;
  } catch {
    return null;
  }
}
