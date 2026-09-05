import { immediateScenarios } from './scenarios-immediate.js';
import { infrastructureScenarios } from './scenarios-infrastructure.js';
import { naturalScenarios } from './scenarios-natural.js';
// Modular assembly of the scenario knowledge base. Content can be extended by
// adding scenarios to any of the source files — screens read from here only.
export const scenarios = [
    ...immediateScenarios,
    ...infrastructureScenarios,
    ...naturalScenarios,
];
export function getScenario(id) {
    return scenarios.find((s) => s.id === id);
}
export function scenariosByCategory(cat) {
    return scenarios.filter((s) => s.category === cat);
}
