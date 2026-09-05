import { Scenario } from '../model/types.js';
import { immediateScenarios } from './scenarios-immediate.js';
import { infrastructureScenarios } from './scenarios-infrastructure.js';
import { naturalScenarios } from './scenarios-natural.js';

// Modular assembly of the scenario knowledge base. Content can be extended by
// adding scenarios to any of the source files — screens read from here only.
export const scenarios: Scenario[] = [
  ...immediateScenarios,
  ...infrastructureScenarios,
  ...naturalScenarios,
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export function scenariosByCategory(cat: Scenario['category']): Scenario[] {
  return scenarios.filter((s) => s.category === cat);
}
