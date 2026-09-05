// =========================================================================
// DECISION PRIORITY ENGINE
// Continuously recalculates which survival need matters most, given current
// conditions, resources, environment, and vulnerability.
//
// PRIORITY = threat-to-life + resource scarcity + time sensitivity
//          + environmental severity + vulnerability + lack of alternatives
//
// Output drives the Home "WHAT SHOULD I DO NOW?" block and threat level.
// =========================================================================

import { AppState, ThreatLevel, ResourceKey } from '../model/types.js';
import { waterEstimate, foodEstimate } from './estimate.js';

export interface PriorityItem {
  key: ResourceKey | 'temperature' | 'medical' | 'shelter' | 'evacuation' | 'comms';
  score: number;
  title: string;
  action: string; // single most important recommended action
  why: string;
  breakdown: { factor: string; points: number }[];
}

export interface PriorityResult {
  ranked: PriorityItem[];
  top: PriorityItem;
  threat: ThreatLevel;
}

function vulnerability(state: AppState): number {
  const h = state.household;
  let v = 0;
  if (h.children > 0) v += 1;
  if (h.elderly > 0) v += 1;
  if (h.people >= 4) v += 0.5;
  return v; // 0..~2.5
}

export function computePriority(state: AppState): PriorityResult {
  const h = state.household;
  const c = state.conditions;
  const vuln = vulnerability(state);
  const water = waterEstimate(state);
  const food = foodEstimate(state);
  const items: PriorityItem[] = [];

  // ---- Medical --------------------------------------------------------
  {
    let score = 0;
    const bd: PriorityItem['breakdown'] = [];
    if (c.medical === 'emergency') {
      score += 10;
      bd.push({ factor: 'Active medical emergency', points: 10 });
    } else if (c.medical === 'concern') {
      score += 4;
      bd.push({ factor: 'Medical concern reported', points: 4 });
    }
    if (score > 0) {
      items.push({
        key: 'medical',
        score,
        title: 'Medical',
        action:
          c.medical === 'emergency'
            ? 'Treat the medical emergency first — contact emergency services if reachable and give first aid within your ability.'
            : 'Address the medical concern and keep essential medication accessible.',
        why: 'Threats to life take priority over all other needs.',
        breakdown: bd,
      });
    }
  }

  // ---- Shelter / structural ------------------------------------------
  {
    let score = 0;
    const bd: PriorityItem['breakdown'] = [];
    if (c.shelter === 'unsafe') {
      score += 9;
      bd.push({ factor: 'Shelter is unsafe', points: 9 });
    } else if (c.shelter === 'compromised') {
      score += 4;
      bd.push({ factor: 'Shelter compromised', points: 4 });
    }
    if (score > 0) {
      score += vuln;
      if (vuln) bd.push({ factor: 'Vulnerable household members', points: vuln });
      items.push({
        key: 'shelter',
        score,
        title: 'Shelter',
        action:
          c.shelter === 'unsafe'
            ? 'Move to a safe structure or open area now — do not remain in an unsafe building.'
            : 'Stabilise and assess your shelter; identify a safer fallback location.',
        why: 'Protection from the environment is a foundational survival need.',
        breakdown: bd,
      });
    }
  }

  // ---- Temperature ----------------------------------------------------
  {
    let score = 0;
    const bd: PriorityItem['breakdown'] = [];
    if (c.temperature === 'dangerous') {
      score += 8;
      bd.push({ factor: 'Dangerous indoor temperature', points: 8 });
      if (h.climate === 'hot' || h.climate === 'cold') {
        score += 1;
        bd.push({ factor: `${h.climate} climate`, points: 1 });
      }
    } else if (c.temperature === 'uncomfortable') {
      score += 3;
      bd.push({ factor: 'Uncomfortable temperature', points: 3 });
    }
    if (score > 0) {
      score += vuln;
      if (vuln) bd.push({ factor: 'Vulnerable household members', points: vuln });
      items.push({
        key: 'temperature',
        score,
        title: 'Temperature control',
        action:
          'Move everyone to the safest temperature-controlled space and protect vulnerable people; in heat, hydrate and cool — in cold, stay dry and insulate.',
        why: 'Extreme temperature can become life-threatening faster than lack of food.',
        breakdown: bd,
      });
    }
  }

  // ---- Water ----------------------------------------------------------
  {
    let score = 2; // water is always a baseline concern
    const bd: PriorityItem['breakdown'] = [{ factor: 'Baseline hydration need', points: 2 }];
    if (c.waterService === 'unavailable') {
      score += 4;
      bd.push({ factor: 'Water service unavailable', points: 4 });
    } else if (c.waterService === 'unsafe') {
      score += 5;
      bd.push({ factor: 'Water unsafe / advisory', points: 5 });
    }
    if (water.daysRemaining !== null) {
      if (water.critical) {
        score += 6;
        bd.push({ factor: 'Under ~2 days of water', points: 6 });
      } else if (water.conserve) {
        score += 3;
        bd.push({ factor: 'Under ~5 days of water', points: 3 });
      }
    } else {
      score += 1;
      bd.push({ factor: 'Water reserves unknown', points: 1 });
    }
    if (c.temperature === 'dangerous' && h.climate === 'hot') {
      score += 2;
      bd.push({ factor: 'Heat increases water need', points: 2 });
    }
    score += vuln * 0.5;
    if (vuln) bd.push({ factor: 'Vulnerable members', points: vuln * 0.5 });
    items.push({
      key: 'water',
      score,
      title: 'Water',
      action:
        c.waterService === 'unsafe'
          ? 'Secure and protect safe drinking water — do not drink from unsafe sources without an appropriate treatment method.'
          : 'Secure an adequate safe drinking-water supply before focusing on food.',
      why: 'Dehydration becomes dangerous within days — faster in heat or with exertion.',
      breakdown: bd,
    });
  }

  // ---- Food -----------------------------------------------------------
  {
    let score = 1;
    const bd: PriorityItem['breakdown'] = [{ factor: 'Baseline nutrition need', points: 1 }];
    if (food.daysRemaining !== null) {
      if (food.critical) {
        score += 4;
        bd.push({ factor: 'Under ~2 days of food', points: 4 });
      } else if (food.conserve) {
        score += 2;
        bd.push({ factor: 'Under ~4 days of food', points: 2 });
      }
    }
    if (c.power === 'none') {
      score += 1;
      bd.push({ factor: 'No power — spoilage risk', points: 1 });
    }
    items.push({
      key: 'food',
      score,
      title: 'Food',
      action:
        c.power === 'none'
          ? 'Eat perishable food first and safely, protect shelf-stable supplies, and conserve calories.'
          : 'Maintain your food supply and prioritise items that spoil first.',
      why: 'Food matters, but the body tolerates limited food far longer than dehydration or exposure.',
      breakdown: bd,
    });
  }

  // ---- Communications -------------------------------------------------
  {
    let score = 0;
    const bd: PriorityItem['breakdown'] = [];
    if (c.comms === 'unavailable') {
      score += 3;
      bd.push({ factor: 'Communications unavailable', points: 3 });
    } else if (c.comms === 'degraded') {
      score += 1.5;
      bd.push({ factor: 'Communications degraded', points: 1.5 });
    }
    if (c.power === 'none') {
      score += 1;
      bd.push({ factor: 'No power — conserve device battery', points: 1 });
    }
    if (score > 0) {
      items.push({
        key: 'comms',
        score,
        title: 'Communication',
        action:
          'Conserve device battery, use a radio for official information, and fall back to your family meeting plan.',
        why: 'Communication enables help and official information — but not before life, shelter, temperature, and water.',
        breakdown: bd,
      });
    }
  }

  // ---- Evacuation (derived) ------------------------------------------
  {
    const triggers: string[] = [];
    if (c.shelter === 'unsafe') triggers.push('unsafe shelter');
    if (c.temperature === 'dangerous') triggers.push('uncontrollable temperature');
    if (water.critical && c.waterService !== 'working') triggers.push('critically low water');
    if (triggers.length >= 2) {
      items.push({
        key: 'evacuation',
        score: 7 + vuln,
        title: 'Evacuation assessment',
        action:
          'Assess whether relocating to a safer location with working infrastructure is now safer than staying — use official information and evacuation orders.',
        why: `Multiple conditions (${triggers.join(', ')}) suggest your location may no longer be viable.`,
        breakdown: triggers.map((t) => ({ factor: t, points: 2 })),
      });
    }
  }

  items.sort((a, b) => b.score - a.score);
  const top = items[0];

  // ---- Threat level ---------------------------------------------------
  const maxScore = top ? top.score : 0;
  let threat: ThreatLevel = 'stable';
  if (c.medical === 'emergency' || c.shelter === 'unsafe' || maxScore >= 10)
    threat = 'critical';
  else if (maxScore >= 7 || c.temperature === 'dangerous' || water.critical)
    threat = 'serious';
  else if (
    maxScore >= 4 ||
    c.power === 'none' ||
    c.waterService !== 'working' ||
    c.comms !== 'working'
  )
    threat = 'elevated';

  return { ranked: items, top, threat };
}

export const THREAT_META: Record<ThreatLevel, { label: string; desc: string }> = {
  stable: { label: 'Stable', desc: 'No active emergency conditions reported.' },
  elevated: {
    label: 'Elevated',
    desc: 'Some systems are degraded. Stay alert and secure key resources.',
  },
  serious: {
    label: 'Serious',
    desc: 'Conditions require active management. Follow your top priority now.',
  },
  critical: {
    label: 'Critical',
    desc: 'Life-safety conditions present. Act on your top priority immediately.',
  },
};
