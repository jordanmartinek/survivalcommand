import { h, frag } from '../ui/dom.js';
import { navigate, refresh } from '../ui/router.js';
import { header, backLink, sectionLabel, warnBox, infoBox, stepper, listRow, statCard } from '../ui/components.js';
import { store } from '../model/store.js';
import { waterEstimate, foodEstimate, daysLabel, waterPerPersonPerDay, powerEstimate } from '../engine/estimate.js';
import { ResourceKey } from '../model/types.js';

const RESOURCE_META: { key: ResourceKey; label: string; icon: string; unit: string }[] = [
  { key: 'water', label: 'Drinking water', icon: '💧', unit: 'L' },
  { key: 'treatableWater', label: 'Treatable water', icon: '🚰', unit: 'L' },
  { key: 'food', label: 'Food', icon: '🥫', unit: 'person-days' },
  { key: 'batteries', label: 'Batteries', icon: '🔋', unit: 'units' },
  { key: 'fuel', label: 'Fuel', icon: '⛽', unit: 'L' },
  { key: 'medical', label: 'Medical supplies', icon: '⛑️', unit: 'items' },
  { key: 'lighting', label: 'Lighting', icon: '🔦', unit: 'hours' },
  { key: 'comms', label: 'Comms power', icon: '📻', unit: 'charges' },
  { key: 'cash', label: 'Cash', icon: '💵', unit: 'units' },
  { key: 'medications', label: 'Medications', icon: '💊', unit: 'days' },
  { key: 'sanitation', label: 'Sanitation', icon: '🧼', unit: 'items' },
  { key: 'clothing', label: 'Clothing/warmth', icon: '🧥', unit: 'sets' },
];

export function resourcesView(): Node {
  const state = store.get();
  const water = waterEstimate(state);
  const food = foodEstimate(state);
  return frag(
    header(),
    h('h1', { class: 'page-title' }, 'Resources'),
    h('p', { class: 'page-sub' }, 'Track supplies and see approximate days remaining. All estimates are approximate.'),
    sectionLabel('Command centers'),
    listRow({ icon: '💧', title: 'Water Command Center', sub: state.resources.water > 0 ? `${state.resources.water} L · ${daysLabel(water.daysRemaining)}` : 'Not set', onclick: () => navigate('/resources/water') }),
    listRow({ icon: '🥫', title: 'Food', sub: state.resources.food > 0 ? `${state.resources.food} person-days · ${daysLabel(food.daysRemaining)}` : 'Not set', onclick: () => navigate('/resources/food') }),
    listRow({ icon: '⚡', title: 'Power Budget', sub: `${state.powerBudget.bankWh} Wh stored`, onclick: () => navigate('/resources/power') }),
    listRow({ icon: '📦', title: 'Full inventory', sub: 'Enter all supply quantities', onclick: () => navigate('/resources/inventory') }),
    sectionLabel('Redundancy'),
    infoBox('Never rely on a single point of failure. For each critical need keep a primary, secondary, and tertiary option.'),
    h('div', { class: 'card' },
      h('h3', {}, 'Water'), h('p', {}, 'Primary: stored water · Secondary: treatment method · Tertiary: alternate source'),
      h('h3', {}, 'Light'), h('p', {}, 'Primary: flashlight · Secondary: lantern · Tertiary: spare batteries'),
      h('h3', {}, 'Communication'), h('p', {}, 'Primary: phone · Secondary: radio · Tertiary: meeting location')
    )
  );
}

export function waterCenterView(): Node {
  const state = store.get();
  const est = waterEstimate(state);
  const perPerson = waterPerPersonPerDay(state);

  const activityChips = (['low', 'normal', 'high'] as const).map((a) =>
    h('button', {
      class: 'chip ' + (state.waterBudget.activity === a ? 'on' : ''),
      onclick: () => { store.update((s) => { s.waterBudget.activity = a; }); refresh(); },
    }, a.charAt(0).toUpperCase() + a.slice(1))
  );

  return frag(
    header(),
    backLink('/resources', 'Resources'),
    h('h1', { class: 'page-title' }, '💧 Water Command Center'),
    h('div', { class: 'card' },
      h('h3', {}, 'Water budget'),
      h('label', { class: 'field' }, h('span', { class: 'fl' }, 'Safe drinking water available (liters)'),
        stepper(state.resources.water, (v) => { store.update((s) => { s.resources.water = v; }); refresh(); })),
      h('label', { class: 'field' }, h('span', { class: 'fl' }, 'People'),
        stepper(state.household.people, (v) => { store.update((s) => { s.household.people = Math.max(1, v); }); refresh(); }, 1)),
      h('label', { class: 'field' }, h('span', { class: 'fl' }, 'Activity level'), h('div', { class: 'chips' }, ...activityChips))
    ),
    h('div', { class: 'card' },
      h('h3', {}, 'Estimated supply (approximate)'),
      kv('Per person / day', `~${perPerson.toFixed(1)} L`),
      kv('Household / day', `~${est.perDay.toFixed(1)} L`),
      kv('Estimated duration', daysLabel(est.daysRemaining)),
      est.critical ? warnBox('Critical', ['Under ~2 days of water. Water is now your overriding priority. Secure a safe source and consider relocating.'])
        : est.conserve ? warnBox('Conservation recommended', ['Under ~5 days of water. Reduce non-essential use and secure a backup source and treatment method.'])
        : infoBox('Supply adequate for now. Keep water protected from contamination.')
    ),
    sectionLabel('Water safety classes'),
    h('div', { class: 'card' },
      h('h3', {}, '🟢 Potable'), h('p', {}, 'Safe for drinking.'),
      h('h3', {}, '🟡 Treatable'), h('p', {}, 'Potentially usable after an appropriate treatment method.'),
      h('h3', {}, '🔴 Contaminated'), h('p', {}, 'Do not consume unless a treatment method known to make it safe is applied.'),
      h('h3', {}, '⚪ Unknown'), h('p', {}, 'Treat as unsafe until properly assessed.')
    ),
    warnBox('Treatment is not one-size-fits-all', [
      'Boiling addresses many biological pathogens, but not chemical contamination.',
      'Filters vary — capability depends on the specific filter.',
      'Disinfection and filtration are not interchangeable.',
      'No cloth, bottle, or random filter automatically makes contaminated water safe.',
    ]),
    sectionLabel('Emergency water sources'),
    h('div', { class: 'card' },
      h('ul', {},
        h('li', {}, 'Stored water and sealed bottled water (use first).'),
        h('li', {}, 'Rainfall collected with clean surfaces and containers (treat before drinking).'),
        h('li', {}, 'Household water heater tank, if uncontaminated.'),
        h('li', {}, 'Safe surface sources, treated appropriately.'),
        h('li', {}, 'Other reserves (e.g., toilet tank water — not bowl — for non-drinking use).')
      )
    )
  );
}

export function foodView(): Node {
  const state = store.get();
  const est = foodEstimate(state);
  return frag(
    header(),
    backLink('/resources', 'Resources'),
    h('h1', { class: 'page-title' }, '🥫 Food'),
    h('div', { class: 'card' },
      h('label', { class: 'field' }, h('span', { class: 'fl' }, 'Food available (person-days)'),
        stepper(state.resources.food, (v) => { store.update((s) => { s.resources.food = v; }); refresh(); })),
      kv('People', String(state.household.people)),
      kv('Estimated duration', daysLabel(est.daysRemaining)),
      est.critical ? warnBox('Critical', ['Under ~2 days of food. Conserve calories and secure safe additional food.'])
        : est.conserve ? warnBox('Conserve', ['Under ~4 days of food. Begin light rationing and prioritise items that spoil first.'])
        : infoBox('Food supply adequate for now.')
    ),
    sectionLabel('During a power outage'),
    h('div', { class: 'card' },
      h('ol', {},
        h('li', {}, 'Eat refrigerated/perishable food first — while still safe.'),
        h('li', {}, 'Then frozen food (a full freezer holds cold ~48h if kept closed).'),
        h('li', {}, 'Then shelf-stable and ready-to-eat food.'),
        h('li', {}, 'Keep the fridge/freezer closed as much as possible.')
      )
    ),
    warnBox('Food safety', ['Never eat food that has become unsafe just because supplies are scarce. When in doubt, throw it out.'])
  );
}

export function powerView(): Node {
  const state = store.get();
  const est = powerEstimate(state);
  return frag(
    header(),
    backLink('/resources', 'Resources'),
    h('h1', { class: 'page-title' }, '⚡ Power Budget'),
    h('div', { class: 'card' },
      h('label', { class: 'field' }, h('span', { class: 'fl' }, 'Stored energy in power banks (Wh)'),
        stepper(state.powerBudget.bankWh, (v) => { store.update((s) => { s.powerBudget.bankWh = v; }); refresh(); }, 0, 5)),
      h('label', { class: 'field' }, h('span', { class: 'fl' }, 'Solar input (watts)'),
        stepper(state.powerBudget.solarW, (v) => { store.update((s) => { s.powerBudget.solarW = v; }); refresh(); }, 0, 5)),
      h('label', { class: 'field' }, h('span', { class: 'fl' }, 'Energy per phone charge (Wh)'),
        stepper(state.powerBudget.phoneWh, (v) => { store.update((s) => { s.powerBudget.phoneWh = Math.max(1, v); }); refresh(); }, 1)),
      kv('Approx phone charges available', `~${est.phoneCharges.toFixed(1)}`)
    ),
    sectionLabel('Critical-device priority'),
    h('div', { class: 'card' },
      h('ol', {},
        h('li', {}, 'Essential medical equipment'),
        h('li', {}, 'Phone for emergency communication'),
        h('li', {}, 'Radio for official information'),
        h('li', {}, 'Lighting'),
        h('li', {}, 'Everything else last')
      )
    ),
    warnBox('Safety', [
      'Never run a generator or combustion engine indoors or in an attached garage — carbon monoxide is deadly.',
      'Do not block exhaust; keep generators well away from windows and doors.',
      'Charge from a vehicle only with the engine outdoors.',
    ])
  );
}

export function inventoryView(): Node {
  const state = store.get();
  return frag(
    header(),
    backLink('/resources', 'Resources'),
    h('h1', { class: 'page-title' }, '📦 Inventory'),
    h('p', { class: 'page-sub' }, 'Enter quantities. Estimates elsewhere update automatically. All approximate.'),
    ...RESOURCE_META.map((m) =>
      h('div', { class: 'card' },
        h('label', { class: 'field' },
          h('span', { class: 'fl' }, `${m.icon} ${m.label} (${m.unit})`),
          stepper(state.resources[m.key], (v) => { store.update((s) => { s.resources[m.key] = v; }); }, 0)
        )
      )
    )
  );
}

function kv(k: string, v: string): HTMLElement {
  return h('div', { class: 'kv' }, h('span', { class: 'k' }, k), h('span', { class: 'v' }, v));
}
