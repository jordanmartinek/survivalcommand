import { h, frag } from '../ui/dom.js';
import { navigate } from '../ui/router.js';
import {
  header, statusBanner, statCard, disclaimer, sectionLabel,
} from '../ui/components.js';
import { store } from '../model/store.js';
import { computePriority } from '../engine/priority.js';
import { waterEstimate, foodEstimate, daysLabel } from '../engine/estimate.js';
import { PowerState, CommsState, ShelterState, MedicalState } from '../model/types.js';

const POWER_LABEL: Record<PowerState, string> = { grid: 'Grid power', backup: 'On backup', none: 'No power' };
const COMMS_LABEL: Record<CommsState, string> = { working: 'Available', degraded: 'Degraded', unavailable: 'Unavailable' };
const SHELTER_LABEL: Record<ShelterState, string> = { secure: 'Secure', compromised: 'Compromised', unsafe: 'Unsafe' };
const MEDICAL_LABEL: Record<MedicalState, string> = { normal: 'Normal', concern: 'Concern', emergency: 'Emergency' };

export function homeView(): Node {
  const state = store.get();
  const pr = computePriority(state);
  const water = waterEstimate(state);
  const food = foodEstimate(state);

  const priorityBlock = pr.top
    ? h(
        'div',
        {
          class:
            'priority ' +
            (pr.threat === 'critical' ? 'pri-critical' : pr.threat === 'serious' ? 'pri-serious' : ''),
        },
        h('div', { class: 'pri-tag' }, 'Priority #1'),
        h('div', { class: 'pri-action' }, pr.top.action),
        h('div', { class: 'pri-why' }, pr.top.why),
        h(
          'div',
          { class: 'pri-actions' },
          h('button', { class: 'btn primary', onclick: () => navigate('/priority') }, 'Start'),
          h('button', { class: 'btn ghost', onclick: () => navigate('/priority') }, 'Why?'),
          h(
            'button',
            {
              class: 'btn ghost',
              onclick: () => {
                store.update((s) => {
                  const key = 'priority-done';
                  s.checklistProgress[key] = s.checklistProgress[key] || {};
                });
                navigate('/survive');
              },
            },
            'Done'
          ),
          h('button', { class: 'btn ghost', onclick: () => navigate('/priority') }, "I can't do this")
        )
      )
    : null;

  return frag(
    header(),
    statusBanner(pr.threat),
    sectionLabel('Current Status'),
    h(
      'div',
      { class: 'grid-2' },
      statCard({
        icon: '💧', label: 'Water',
        value: state.resources.water > 0 ? `${state.resources.water} L` : 'Not set',
        note: state.resources.water > 0 ? daysLabel(water.daysRemaining) + ' (approx)' : 'Tap to add',
        tone: water.critical ? 'danger' : water.conserve ? 'warn' : 'normal',
        onclick: () => navigate('/resources/water'),
      }),
      statCard({
        icon: '🏠', label: 'Shelter',
        value: SHELTER_LABEL[state.conditions.shelter],
        tone: state.conditions.shelter === 'unsafe' ? 'danger' : state.conditions.shelter === 'compromised' ? 'warn' : 'normal',
        onclick: () => navigate('/settings'),
      }),
      statCard({
        icon: '🥫', label: 'Food',
        value: state.resources.food > 0 ? daysLabel(food.daysRemaining) : 'Not set',
        note: state.resources.food > 0 ? `${state.resources.food} person-days` : 'Tap to add',
        tone: food.critical ? 'danger' : food.conserve ? 'warn' : 'normal',
        onclick: () => navigate('/resources/food'),
      }),
      statCard({
        icon: '⚡', label: 'Power',
        value: POWER_LABEL[state.conditions.power],
        tone: state.conditions.power === 'none' ? 'warn' : 'normal',
        onclick: () => navigate('/resources/power'),
      }),
      statCard({
        icon: '📶', label: 'Communication',
        value: COMMS_LABEL[state.conditions.comms],
        tone: state.conditions.comms === 'unavailable' ? 'warn' : 'normal',
        onclick: () => navigate('/settings'),
      }),
      statCard({
        icon: '⛑️', label: 'Medical',
        value: MEDICAL_LABEL[state.conditions.medical],
        tone: state.conditions.medical === 'emergency' ? 'danger' : state.conditions.medical === 'concern' ? 'warn' : 'normal',
        onclick: () => navigate('/settings'),
      })
    ),
    sectionLabel('What should I do now?'),
    priorityBlock || h('div', { class: 'card' }, h('p', {}, 'No active emergency conditions. Use PREPARE to build readiness, or open SURVIVE if something has happened.')),
    sectionLabel('Quick actions'),
    h(
      'div',
      { class: 'grid-2' },
      h('button', { class: 'btn danger block', onclick: () => navigate('/emergency') }, '🚨 Emergency Mode'),
      h('button', { class: 'btn block', onclick: () => navigate('/commander') }, '🧭 Ask Commander'),
      h('button', { class: 'btn block', onclick: () => navigate('/plan72') }, '⏱ 72-Hour Plan'),
      h('button', { class: 'btn block', onclick: () => navigate('/improvise') }, '🔧 Improvise')
    ),
    disclaimer()
  );
}

export function priorityDetailView(): Node {
  const state = store.get();
  const pr = computePriority(state);
  if (!pr.top) {
    return frag(
      header(),
      h('h1', { class: 'page-title' }, 'Priorities'),
      h('div', { class: 'card' }, h('p', {}, 'No active priorities. Everything appears stable.'))
    );
  }
  return frag(
    header(),
    h('button', { class: 'back-link', onclick: () => navigate('/') }, '‹ Home'),
    h('h1', { class: 'page-title' }, 'Priority Breakdown'),
    h('p', { class: 'page-sub' }, 'The engine ranks needs by threat to life, scarcity, time sensitivity, environment, and vulnerability. Estimates are approximate.'),
    ...pr.ranked.map((item, idx) =>
      h(
        'div',
        { class: 'card' },
        h('h3', {}, `#${idx + 1} · ${item.title}`),
        h('p', {}, item.action),
        h('div', { class: 'pill-row' }, ...item.breakdown.map((b) => h('span', { class: 'badge moderate' }, `${b.factor} +${b.points}`))),
        h('p', { class: 'muted', style: { marginTop: '8px' } }, item.why),
        idx === 0
          ? h('button', { class: 'btn ghost sm', onclick: () => navigate('/emergency') }, "I can't do this — show alternatives")
          : null
      )
    )
  );
}
