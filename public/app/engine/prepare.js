import { kitCategories, maxKitScore } from '../data/kit.js';
export function preparednessScore(state) {
    const max = maxKitScore();
    let earned = 0;
    const gaps = [];
    for (const cat of kitCategories) {
        for (const item of cat.items) {
            if (state.kitOwned[item.id])
                earned += item.weight;
            else
                gaps.push({ label: `${cat.label}: ${item.label}`, weight: item.weight });
        }
    }
    const score = Math.round((earned / max) * 100);
    let tier = 'Minimal';
    if (score >= 80)
        tier = 'Strong';
    else if (score >= 55)
        tier = 'Solid';
    else if (score >= 30)
        tier = 'Basic';
    gaps.sort((a, b) => b.weight - a.weight);
    return { score, tier, gaps: gaps.slice(0, 6) };
}
