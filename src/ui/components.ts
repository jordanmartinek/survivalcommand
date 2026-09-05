// Shared UI building blocks.
import { h } from './dom.js';
import { navigate } from './router.js';
import { ThreatLevel, Severity, RiskLevel, Phase } from '../model/types.js';
import { THREAT_META } from '../engine/priority.js';

export function header(title?: string): HTMLElement {
  return h(
    'div',
    { class: 'app-header' },
    h('div', { class: 'brand' }, h('span', { class: 'brand-mark' }, '◆'), 'SURVIVAL COMMAND'),
    h(
      'button',
      { class: 'header-btn', onclick: () => navigate('/settings') },
      '⚙ Setup'
    )
  );
}

export function backLink(to: string, label: string): HTMLElement {
  return h('button', { class: 'back-link', onclick: () => navigate(to) }, '‹ ' + label);
}

export function pageTitle(title: string, sub?: string): DocumentFragment {
  const f = document.createDocumentFragment();
  f.appendChild(h('h1', { class: 'page-title' }, title));
  if (sub) f.appendChild(h('p', { class: 'page-sub' }, sub));
  return f;
}

export function sectionLabel(text: string): HTMLElement {
  return h('div', { class: 'section-label' }, text);
}

export function statusBanner(level: ThreatLevel): HTMLElement {
  const meta = THREAT_META[level];
  return h(
    'div',
    { class: 'status-banner' },
    h('span', { class: 'st-dot bg-' + level }),
    h(
      'div',
      { class: 'st-text' },
      h('div', { class: 'st-level lvl-' + level }, 'Status: ' + meta.label),
      h('div', { class: 'st-desc' }, meta.desc)
    )
  );
}

export function statCard(opts: {
  icon: string;
  label: string;
  value: string;
  note?: string;
  tone?: 'normal' | 'warn' | 'danger';
  onclick?: () => void;
}): HTMLElement {
  return h(
    'div',
    {
      class: 'stat-card ' + (opts.tone && opts.tone !== 'normal' ? opts.tone : ''),
      onclick: opts.onclick,
    },
    h(
      'div',
      { class: 'sc-top' },
      h('span', { class: 'sc-icon' }, opts.icon),
      h('span', { class: 'sc-label' }, opts.label)
    ),
    h('div', { class: 'sc-value' }, opts.value),
    opts.note ? h('div', { class: 'sc-note' }, opts.note) : null
  );
}

export function severityBadge(sev: Severity): HTMLElement {
  const label = sev.charAt(0).toUpperCase() + sev.slice(1);
  return h('span', { class: 'badge sev-' + sev }, label);
}

export function riskBadge(risk: RiskLevel): HTMLElement {
  const map: Record<RiskLevel, string> = { low: '🟢 Low risk', moderate: '🟡 Moderate risk', high: '🔴 High risk' };
  return h('span', { class: 'badge ' + risk }, map[risk]);
}

export function phaseBlock(phase: Phase): HTMLElement {
  return h(
    'div',
    { class: 'phase ' + (phase.now ? 'now' : '') },
    h('div', { class: 'ph-label' }, phase.label),
    h('ul', {}, ...phase.items.map((i) => h('li', {}, i)))
  );
}

export function warnBox(title: string, items: string[]): HTMLElement {
  return h(
    'div',
    { class: 'warn-box' },
    h('div', { class: 'wb-title' }, title),
    h('ul', { style: { margin: '4px 0 0', paddingLeft: '18px' } }, ...items.map((i) => h('li', {}, i)))
  );
}

export function infoBox(text: string): HTMLElement {
  return h('div', { class: 'info-box' }, text);
}

export function listRow(opts: {
  icon: string;
  title: string;
  sub?: string;
  onclick: () => void;
}): HTMLElement {
  return h(
    'div',
    { class: 'list-row', onclick: opts.onclick },
    h('span', { class: 'lr-icon' }, opts.icon),
    h(
      'div',
      { class: 'lr-body' },
      h('div', { class: 'lr-title' }, opts.title),
      opts.sub ? h('div', { class: 'lr-sub' }, opts.sub) : null
    ),
    h('span', { class: 'lr-chev' }, '›')
  );
}

export function disclaimer(): HTMLElement {
  return h(
    'div',
    { class: 'disclaimer' },
    'This application provides general emergency preparedness information. It does not replace emergency services, local authorities, medical professionals, utility providers, or official evacuation instructions. During active disasters, follow official emergency instructions when available. All resource estimates are approximate.'
  );
}

export function stepper(value: number, onChange: (v: number) => void, min = 0, step = 1): HTMLElement {
  const input = h('input', { type: 'number', value: String(value), min: String(min) }) as HTMLInputElement;
  input.addEventListener('change', () => onChange(Math.max(min, Number(input.value) || 0)));
  return h(
    'div',
    { class: 'stepper' },
    h('button', { onclick: () => { const v = Math.max(min, (Number(input.value) || 0) - step); input.value = String(v); onChange(v); } }, '−'),
    input,
    h('button', { onclick: () => { const v = (Number(input.value) || 0) + step; input.value = String(v); onChange(v); } }, '+')
  );
}
