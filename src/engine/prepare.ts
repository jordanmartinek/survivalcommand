// Preparedness scoring — turns owned kit items into a 0–100 score plus
// actionable gaps ("what would improve the score").
import { AppState } from '../model/types.js';
import { kitCategories, maxKitScore } from '../data/kit.js';

export interface PrepScore {
  score: number; // 0..100
  tier: 'Minimal' | 'Basic' | 'Solid' | 'Strong';
  gaps: { label: string; weight: number }[];
}

export function preparednessScore(state: AppState): PrepScore {
  const max = maxKitScore();
  let earned = 0;
  const gaps: { label: string; weight: number }[] = [];
  for (const cat of kitCategories) {
    for (const item of cat.items) {
      if (state.kitOwned[item.id]) earned += item.weight;
      else gaps.push({ label: `${cat.label}: ${item.label}`, weight: item.weight });
    }
  }
  const score = Math.round((earned / max) * 100);
  let tier: PrepScore['tier'] = 'Minimal';
  if (score >= 80) tier = 'Strong';
  else if (score >= 55) tier = 'Solid';
  else if (score >= 30) tier = 'Basic';
  gaps.sort((a, b) => b.weight - a.weight);
  return { score, tier, gaps: gaps.slice(0, 6) };
}
