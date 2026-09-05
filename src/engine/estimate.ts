// =========================================================================
// Resource estimators. All outputs are APPROXIMATE and clearly labeled as
// such in the UI. These are planning aids, never guarantees.
// =========================================================================

import { AppState } from '../model/types.js';

// Baseline drinking + minimal use water need per person per day (liters).
// Higher in heat / high activity. This is a conservative planning figure.
export function waterPerPersonPerDay(state: AppState): number {
  const base = 3; // drinking + minimal cooking/hygiene, liters
  let mult = 1;
  if (state.household.climate === 'hot') mult += 0.6;
  if (state.household.climate === 'cold') mult -= 0.1;
  const activity = state.waterBudget.activity;
  if (activity === 'high') mult += 0.5;
  if (activity === 'low') mult -= 0.2;
  return Math.max(2, base * mult);
}

export interface Estimate {
  daysRemaining: number | null; // null when no consumption basis
  perDay: number;
  approximate: true;
  conserve: boolean; // recommend conservation
  critical: boolean; // below critical threshold
}

export function waterEstimate(state: AppState): Estimate {
  const people = Math.max(1, state.household.people);
  const perPerson = waterPerPersonPerDay(state);
  const perDay = perPerson * people;
  const liters = state.resources.water;
  const days = perDay > 0 ? liters / perDay : null;
  return {
    daysRemaining: days,
    perDay,
    approximate: true,
    conserve: days !== null && days < 5,
    critical: days !== null && days < 2,
  };
}

// Food is tracked in "person-days" of shelf-stable food for simplicity.
export function foodEstimate(state: AppState): Estimate {
  const people = Math.max(1, state.household.people);
  const personDays = state.resources.food;
  const days = personDays / people;
  return {
    daysRemaining: state.resources.food > 0 ? days : null,
    perDay: people,
    approximate: true,
    conserve: state.resources.food > 0 && days < 4,
    critical: state.resources.food > 0 && days < 2,
  };
}

// Lighting tracked in approximate hours available.
export function lightingHours(state: AppState): number {
  return state.resources.lighting;
}

// Very rough power-budget estimate. Phone ~15 Wh/full charge by default.
export interface PowerEstimate {
  totalWh: number;
  phoneCharges: number;
  approximate: true;
}
export function powerEstimate(state: AppState): PowerEstimate {
  const pb = state.powerBudget;
  const totalWh = pb.bankWh; // stored energy available now
  const phoneCharges = pb.phoneWh > 0 ? totalWh / pb.phoneWh : 0;
  return { totalWh, phoneCharges, approximate: true };
}

export function daysLabel(days: number | null): string {
  if (days === null) return 'not set';
  if (days < 1) return `~${Math.round(days * 24)} hours`;
  return `~${days.toFixed(1)} days`;
}
