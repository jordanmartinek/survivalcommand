import { h, frag } from '../ui/dom.js';
import { navigate, refresh } from '../ui/router.js';
import { header, backLink, riskBadge, sectionLabel, warnBox, infoBox, listRow } from '../ui/components.js';
import { improvisedSolutions, usableObjects } from '../data/improvise.js';

export function improviseView(): Node {
  const cats = Array.from(new Set(improvisedSolutions.map((s) => s.category)));
  return frag(
    header(),
    backLink('/', 'Home'),
    h('h1', { class: 'page-title' }, '🔧 Improvise'),
    h('p', { class: 'page-sub' }, 'Safe temporary solutions from ordinary objects. Every entry lists its limits and risk.'),
    h('div', { class: 'row', style: { marginBottom: '14px' } },
      h('button', { class: 'btn block', onclick: () => navigate('/can-i-use') }, '🔍 Can I use this?'),
      h('button', { class: 'btn block', onclick: () => navigate('/nothing') }, '🫙 I have nothing')
    ),
    infoBox('Nothing here involves mains electricity, weapons, explosives, dangerous chemistry, or unsafe pressure/fuel handling. If something is unsafe to improvise, the app says so.'),
    ...cats.map((c) => frag(
      sectionLabel(c),
      ...improvisedSolutions.filter((s) => s.category === c).map((s) =>
        listRow({ icon: '🔧', title: s.title, sub: s.problem, onclick: () => navigate('/improvise/' + s.id) })
      )
    ))
  );
}

export function improviseDetailView(params: Record<string, string>): Node {
  const s = improvisedSolutions.find((x) => x.id === params.id);
  if (!s) return frag(header(), h('div', { class: 'card' }, 'Not found.'));
  return frag(
    header(),
    backLink('/improvise', 'Improvise'),
    h('div', { class: 'pill-row' }, riskBadge(s.risk), h('span', { class: 'badge moderate' }, s.category)),
    h('h1', { class: 'page-title' }, s.title),
    h('div', { class: 'card' }, h('h3', {}, 'Problem'), h('p', {}, s.problem)),
    h('div', { class: 'card' }, h('h3', {}, 'Materials'), h('ul', {}, ...s.materials.map((m) => h('li', {}, m)))),
    h('div', { class: 'card' }, h('h3', {}, 'Procedure'), h('ol', {}, ...s.procedure.map((p) => h('li', {}, p)))),
    warnBox('Safety', s.safety),
    h('div', { class: 'card' }, h('h3', {}, 'Limitations'), h('ul', {}, ...s.limitations.map((l) => h('li', {}, l)))),
    infoBox('Better alternative: ' + s.betterAlternative)
  );
}

export function canIUseView(): Node {
  return frag(
    header(),
    backLink('/improvise', 'Improvise'),
    h('h1', { class: 'page-title' }, '🔍 Can I use this?'),
    h('p', { class: 'page-sub' }, 'Pick an object to see safe emergency uses and warnings.'),
    h('div', { class: 'grid-2' }, ...usableObjects.map((o) =>
      h('button', { class: 'stat-card', style: { alignItems: 'flex-start' }, onclick: () => navigate('/can-i-use/' + o.id) },
        h('div', { class: 'sc-top' }, h('span', { class: 'sc-icon' }, o.icon), h('span', { class: 'sc-label' }, o.name))
      )
    ))
  );
}

export function usableDetailView(params: Record<string, string>): Node {
  const o = usableObjects.find((x) => x.id === params.id);
  if (!o) return frag(header(), h('div', { class: 'card' }, 'Not found.'));
  return frag(
    header(),
    backLink('/can-i-use', 'Objects'),
    h('h1', { class: 'page-title' }, `${o.icon} ${o.name}`),
    h('div', { class: 'card' }, h('h3', {}, 'Possible uses'), h('ul', {}, ...o.uses.map((u) => h('li', {}, u)))),
    warnBox('Warnings', o.warnings)
  );
}

// "I HAVE NOTHING" mode — maximise value from whatever the user has access to.
const RESOURCE_GROUPS: { key: string; label: string; tips: string[] }[] = [
  { key: 'clothing', label: 'Clothing', tips: ['Layer for warmth; stay dry.', 'Use light-coloured cloth for shade or signalling.', 'A clean cloth pre-filters debris (does NOT purify water).'] },
  { key: 'containers', label: 'Plastic containers', tips: ['Store water that is already safe.', 'Ration and measure water.', 'Collect rainfall (treat before drinking).'] },
  { key: 'fabric', label: 'Fabric / sheets', tips: ['Shade or wind break.', 'Bundle and carry supplies.', 'Insulation layer.'] },
  { key: 'paper', label: 'Paper / cardboard', tips: ['Floor insulation from cold.', 'Block drafts.', 'Improvised note at a meeting point.'] },
  { key: 'vehicle', label: 'Vehicle', tips: ['Charge phones (engine outdoors only).', 'Shelter from weather.', 'Never run the engine indoors — carbon monoxide.'] },
  { key: 'building', label: 'Building', tips: ['Concentrate in one insulated room for temperature.', 'Interior room away from windows for storms.', 'Higher floors for flooding.'] },
  { key: 'nature', label: 'Natural environment', tips: ['Shade and rainfall collection.', 'Higher ground away from flood and hazard.', 'Treat any natural water before drinking.'] },
];

export function nothingView(): Node {
  const container = h('div', {});
  const selected: Record<string, boolean> = {};

  function renderTips() {
    while (container.firstChild) container.removeChild(container.firstChild);
    const active = RESOURCE_GROUPS.filter((g) => selected[g.key]);
    if (!active.length) { container.appendChild(infoBox('Select what you have access to above.')); return; }
    active.forEach((g) => {
      container.appendChild(h('div', { class: 'card' }, h('h3', {}, g.label), h('ul', {}, ...g.tips.map((t) => h('li', {}, t)))));
    });
    container.appendChild(h('button', { class: 'btn primary block', onclick: () => navigate('/commander') }, 'Ask Commander for a plan'));
  }

  const chips = h('div', { class: 'chips' }, ...RESOURCE_GROUPS.map((g) =>
    h('button', { class: 'chip', onclick: (e: Event) => {
      selected[g.key] = !selected[g.key];
      (e.currentTarget as HTMLElement).classList.toggle('on');
      renderTips();
    } }, g.label)
  ));
  renderTips();

  return frag(
    header(),
    backLink('/improvise', 'Improvise'),
    h('h1', { class: 'page-title' }, '🫙 I Have Nothing'),
    h('p', { class: 'page-sub' }, 'What do you have access to? The goal is to maximise survival value from what exists.'),
    chips,
    h('div', { class: 'spacer' }),
    container
  );
}
