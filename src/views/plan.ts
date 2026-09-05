import { h, frag } from '../ui/dom.js';
import { navigate, refresh } from '../ui/router.js';
import { header, backLink, sectionLabel, infoBox } from '../ui/components.js';
import { store } from '../model/store.js';
import { CheckState } from '../model/types.js';

interface PlanPhase { label: string; items: string[]; }

const PLAN_72: PlanPhase[] = [
  { label: '0–1 HOUR · Secure immediate safety', items: [
    'Confirm everyone is safe and account for the group.',
    'Address any immediate hazards (fire, gas, structural, injury).',
    'Contact emergency services if needed and reachable.',
  ]},
  { label: '1–6 HOURS · Stabilise essentials', items: [
    'Secure and protect safe drinking water.',
    'Confirm shelter is safe and manage temperature.',
    'Set up lighting and preserve device battery.',
    'Turn on a radio for official information.',
    'Handle any medical needs and medications.',
  ]},
  { label: '6–24 HOURS · Extend', items: [
    'Sort and protect food; eat perishables first.',
    'Set up sanitation that keeps waste away from water.',
    'Manage temperature for a longer period.',
    'Establish a power/battery budget.',
    'Confirm transportation and fuel status.',
  ]},
  { label: '24–72 HOURS · Sustain & plan', items: [
    'Begin resource rationing based on days remaining.',
    'Gather official information regularly.',
    'Coordinate with trusted neighbours/community.',
    'Secure longer-term water and food.',
    'Reassess whether staying is still viable, or plan evacuation.',
  ]},
];

const PLAN_7DAY: PlanPhase[] = [
  { label: 'DAYS 3–7 · Survival → Sustainability', items: [
    'Establish a reliable daily water routine (source + treatment).',
    'Maintain safe food handling and rationing.',
    'Keep sanitation discipline — separation from water is critical over time.',
    'Rotate and conserve power for critical devices only.',
    'Track morale and fatigue; rest and share tasks.',
    'Reassess daily: "Can this location support everyone for another 24 hours?" If no, plan relocation.',
  ]},
];

export function plan72View(): Node {
  return renderPlan('⏱ 72-Hour Plan', 'Follow the phases in order. Each builds on the last.', PLAN_72, 'plan72', true);
}

export function plan7View(): Node {
  return renderPlan('📅 7-Day Sustainability', 'If infrastructure remains unavailable after 72 hours, shift from survival to sustainability.', PLAN_7DAY, 'plan7', false);
}

function renderPlan(title: string, sub: string, phases: PlanPhase[], key: string, offerNext: boolean): Node {
  const progress = store.get().checklistProgress[key] || {};
  let idx = 0;
  const blocks: Node[] = [];
  phases.forEach((ph) => {
    blocks.push(h('div', { class: 'phase' }, h('div', { class: 'ph-label' }, ph.label)));
    ph.items.forEach((item) => {
      const i = idx++;
      const st: CheckState = (progress[i] as CheckState) || 'open';
      const done = st === 'done';
      blocks.push(
        h('div', { class: 'check-item ' + (done ? 'done' : ''), style: { paddingLeft: '14px' } },
          h('div', { class: 'check-box ' + (done ? 'done' : ''), onclick: () => {
            store.update((s) => { s.checklistProgress[key] = s.checklistProgress[key] || {}; s.checklistProgress[key][i] = done ? 'open' : 'done'; });
            refresh();
          } }, done ? '✓' : ''),
          h('div', { class: 'check-body' }, h('div', { class: 'cb-text' }, item))
        )
      );
    });
  });

  return frag(
    header(),
    backLink('/prepare', 'Prepare'),
    h('h1', { class: 'page-title' }, title),
    h('p', { class: 'page-sub' }, sub),
    infoBox('The app can transition from 72-hour survival to 7-day sustainability automatically when infrastructure stays down.'),
    ...blocks,
    h('div', { class: 'spacer' }),
    offerNext ? h('button', { class: 'btn block', onclick: () => navigate('/plan7') }, 'Continue to 7-Day Sustainability →') : null,
    h('button', { class: 'btn ghost block', onclick: () => { store.update((s) => { s.checklistProgress[key] = {}; }); refresh(); } }, 'Reset plan')
  );
}
