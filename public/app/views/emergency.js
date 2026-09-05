import { h, frag } from '../ui/dom.js';
import { navigate } from '../ui/router.js';
import { header, backLink, listRow } from '../ui/components.js';
import { scenariosByCategory } from '../data/scenarios.js';
import { store } from '../model/store.js';
import { setStress } from '../ui/stress.js';
// EMERGENCY MODE — the triage entry point. Three large choices.
export function emergencyView() {
    return frag(header(), backLink('/', 'Home'), h('h1', { class: 'page-title' }, 'Emergency Mode'), h('p', { class: 'page-sub' }, 'What is happening right now? Choose the closest match.'), h('div', { class: 'triage' }, h('button', {
        class: 'triage-btn tb-danger',
        onclick: () => {
            setStress(true);
            store.update((s) => { s.conditions.emergencyStart = s.conditions.emergencyStart || Date.now(); });
            navigate('/scenario/immediate-general');
        },
    }, h('div', { class: 'tb-title' }, '🚨 I am in immediate danger'), h('div', { class: 'tb-desc' }, 'Building collapse, fire, flash flood, gas leak, severe injury, dangerous structural damage.')), h('button', {
        class: 'triage-btn tb-warn',
        onclick: () => { setStress(true); navigate('/emergency/infrastructure'); },
    }, h('div', { class: 'tb-title' }, '⚠️ Infrastructure failure'), h('div', { class: 'tb-desc' }, 'Power, water, internet, telecoms, fuel, or food-distribution disruption.')), h('button', {
        class: 'triage-btn tb-safe',
        onclick: () => navigate('/prepare'),
    }, h('div', { class: 'tb-title' }, '🟢 I am safe but preparing'), h('div', { class: 'tb-desc' }, 'Build a preparedness plan and emergency kit before anything happens.'))), h('div', { class: 'spacer' }), h('button', { class: 'btn ghost block', onclick: () => navigate('/emergency/natural') }, 'Natural disaster scenarios'), h('div', { class: 'spacer' }), h('button', { class: 'btn ghost block', onclick: () => { setStress(false); navigate('/'); } }, 'Exit emergency mode'));
}
export function infrastructureListView() {
    const list = scenariosByCategory('infrastructure');
    return frag(header(), backLink('/emergency', 'Emergency Mode'), h('h1', { class: 'page-title' }, 'Infrastructure Failure'), h('p', { class: 'page-sub' }, 'Select the system that has failed.'), ...list.map((s) => listRow({ icon: s.icon, title: s.title, sub: s.summary, onclick: () => navigate('/scenario/' + s.id) })));
}
export function naturalListView() {
    const list = scenariosByCategory('natural');
    return frag(header(), backLink('/emergency', 'Emergency Mode'), h('h1', { class: 'page-title' }, 'Natural Disasters'), h('p', { class: 'page-sub' }, 'Select the hazard you are facing.'), ...list.map((s) => listRow({ icon: s.icon, title: s.title, sub: s.summary, onclick: () => navigate('/scenario/' + s.id) })));
}
