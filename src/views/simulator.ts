import { h, frag } from '../ui/dom.js';
import { navigate } from '../ui/router.js';
import { header, backLink, sectionLabel, warnBox, infoBox } from '../ui/components.js';
import { store } from '../model/store.js';
import { waterEstimate, foodEstimate, daysLabel } from '../engine/estimate.js';

// WHAT IF? simulator — projects consequences based on current inventory.
const SCENARIOS = [
  { id: 'power3', label: 'Power out for 3 days', power: true, days: 3 },
  { id: 'water-out', label: 'Water supply stops', water: true },
  { id: 'heatwave', label: 'Extreme heat for 3 days', heat: true },
  { id: 'isolated', label: 'Isolated for 7 days', days: 7 },
];

export function simulatorView(): Node {
  const container = h('div', {});

  function simulate(sc: any) {
    const state = store.get();
    const water = waterEstimate(state);
    const food = foodEstimate(state);
    while (container.firstChild) container.removeChild(container.firstChild);

    const rows: { k: string; v: string; risk?: boolean }[] = [
      { k: 'Water', v: state.resources.water > 0 ? daysLabel(water.daysRemaining) : 'unknown', risk: water.critical || (sc.heat && water.conserve) },
      { k: 'Food', v: state.resources.food > 0 ? daysLabel(food.daysRemaining) : 'unknown', risk: food.critical },
      { k: 'Power', v: state.powerBudget.bankWh > 0 ? '~' + (state.powerBudget.bankWh / Math.max(1, state.powerBudget.phoneWh)).toFixed(1) + ' phone charges' : (sc.power ? 'depleting' : 'limited'), risk: sc.power },
      { k: 'Temperature', v: sc.heat ? 'increasing risk' : 'manageable', risk: sc.heat },
      { k: 'Communication', v: state.conditions.comms === 'working' ? 'degraded over time' : 'unavailable', risk: false },
    ];

    // Identify largest vulnerability.
    let vuln = 'water';
    if (water.daysRemaining !== null && (water.critical || (sc.heat && water.conserve))) vuln = 'water';
    else if (food.critical) vuln = 'food';
    else if (sc.heat) vuln = 'heat exposure';
    else if (sc.power) vuln = 'power';

    container.appendChild(h('h3', { style: { marginBottom: '10px' } }, sc.label));
    container.appendChild(h('div', { class: 'card' }, ...rows.map((r) =>
      h('div', { class: 'kv' }, h('span', { class: 'k' }, r.k), h('span', { class: 'v', style: r.risk ? { color: '#f87171' } : {} }, r.v))
    )));
    container.appendChild(warnBox('Largest vulnerability', ['Your largest vulnerability is ' + vuln + '.']));
    container.appendChild(h('div', { class: 'card' },
      h('h3', {}, 'Recommended actions'),
      h('ol', {},
        h('li', {}, vuln === 'water' ? 'Secure additional safe water and reduce non-essential use.' : 'Address ' + vuln + ' as your first priority.'),
        h('li', {}, 'Establish a backup for your weakest resource.'),
        h('li', {}, 'Reduce consumption of scarce resources.'),
        h('li', {}, 'Reassess evacuation options if the location cannot sustain everyone.')
      )
    ));
    container.appendChild(h('button', { class: 'btn primary block', onclick: () => navigate('/commander') }, 'Ask Commander'));
  }

  container.appendChild(infoBox('Pick a "what if" to project consequences from your current inventory. Estimates are approximate.'));

  return frag(
    header(),
    backLink('/', 'Home'),
    h('h1', { class: 'page-title' }, '🔮 What If?'),
    h('p', { class: 'page-sub' }, 'Simulate a scenario against your current supplies.'),
    h('div', { class: 'chips' }, ...SCENARIOS.map((sc) =>
      h('button', { class: 'chip', onclick: () => simulate(sc) }, sc.label)
    )),
    h('div', { class: 'spacer' }),
    container
  );
}

// EVACUATE OR SHELTER? decision aid.
export function evacuateView(): Node {
  return frag(
    header(),
    backLink('/', 'Home'),
    h('h1', { class: 'page-title' }, 'Evacuate or Shelter?'),
    h('p', { class: 'page-sub' }, 'Weigh both options. Never evacuate solely on a prediction — use official orders and current information.'),
    h('div', { class: 'card' },
      h('h3', {}, '🏠 Stay'),
      h('p', {}, 'Advantages: existing shelter, existing supplies, familiar environment.'),
      h('p', {}, 'Risks: structural danger, fire, flood, extreme temperature, lack of water, infrastructure failure.')
    ),
    h('div', { class: 'card' },
      h('h3', {}, '🚗 Leave'),
      h('p', {}, 'Advantages: functioning infrastructure, medical help, food and water, safer environment.'),
      h('p', {}, 'Risks: traffic, unsafe roads, fuel scarcity, weather, unknown destination.')
    ),
    warnBox('Decide to leave now if any of these are true', [
      'There is an official evacuation order.',
      'Your shelter is unsafe or becoming unsafe.',
      'You cannot keep temperature survivable.',
      'Safe water is nearly gone with no reliable source.',
    ]),
    infoBox('Follow official evacuation instructions and current emergency information whenever available.')
  );
}
