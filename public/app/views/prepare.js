import { h, frag } from '../ui/dom.js';
import { navigate, refresh } from '../ui/router.js';
import { header, sectionLabel, infoBox } from '../ui/components.js';
import { store } from '../model/store.js';
import { kitCategories } from '../data/kit.js';
import { preparednessScore } from '../engine/prepare.js';
export function prepareView() {
    const state = store.get();
    const prep = preparednessScore(state);
    return frag(header(), h('h1', { class: 'page-title' }, 'Prepare'), h('p', { class: 'page-sub' }, 'Build readiness before an emergency. Check what you actually have.'), h('div', { class: 'card', style: { textAlign: 'center' } }, h('div', { class: 'score-big' }, `${prep.score} / 100`), h('div', { class: 'section-label', style: { marginTop: '4px' } }, prep.tier + ' preparedness'), h('div', { class: 'bar', style: { marginTop: '10px' } }, h('span', { style: { width: prep.score + '%' } }))), prep.gaps.length
        ? h('div', { class: 'card' }, h('h3', {}, 'What would improve your score most'), h('ul', {}, ...prep.gaps.map((g) => h('li', {}, g.label + ` (+${g.weight})`))))
        : infoBox('Excellent — you have covered the tracked essentials.'), h('div', { class: 'row', style: { marginBottom: '14px' } }, h('button', { class: 'btn block', onclick: () => navigate('/plan72') }, '⏱ 72-Hour Plan'), h('button', { class: 'btn block', onclick: () => navigate('/family') }, '👪 Family Plan')), h('div', { class: 'row', style: { marginBottom: '14px' } }, h('button', { class: 'btn block', onclick: () => navigate('/community') }, '🤝 Community'), h('button', { class: 'btn block', onclick: () => navigate('/readiness') }, '✅ Readiness Check')), sectionLabel('Emergency kit builder'), ...kitCategories.map((cat) => h('div', { class: 'card' }, h('h3', {}, `${cat.icon} ${cat.label}`), ...cat.items.map((item) => {
        const owned = !!state.kitOwned[item.id];
        return h('div', { class: 'check-item ' + (owned ? 'done' : '') }, h('div', {
            class: 'check-box ' + (owned ? 'done' : ''),
            onclick: () => { store.update((s) => { s.kitOwned[item.id] = !s.kitOwned[item.id]; }); refresh(); },
        }, owned ? '✓' : ''), h('div', { class: 'check-body' }, h('div', { class: 'cb-text' }, item.label)));
    }))));
}
export function readinessView() {
    const questions = [
        'Do you have at least 3 days of drinking water per person?',
        'Is your phone charged and a power bank ready?',
        'Do emergency lights work and have spare batteries?',
        'Do you have several days of food that needs no cooking?',
        'Is your first-aid kit stocked and medications topped up?',
        'Do you know your evacuation route and meeting point?',
    ];
    const key = 'daily-readiness';
    const progress = store.get().checklistProgress[key] || {};
    return frag(header(), h('button', { class: 'back-link', onclick: () => navigate('/prepare') }, '‹ Prepare'), h('h1', { class: 'page-title' }, '60-Second Readiness Check'), h('div', { class: 'card' }, ...questions.map((q, i) => {
        const done = progress[i] === 'done';
        return h('div', { class: 'check-item ' + (done ? 'done' : '') }, h('div', { class: 'check-box ' + (done ? 'done' : ''), onclick: () => {
                store.update((s) => { s.checklistProgress[key] = s.checklistProgress[key] || {}; s.checklistProgress[key][i] = done ? 'open' : 'done'; });
                refresh();
            } }, done ? '✓' : ''), h('div', { class: 'check-body' }, h('div', { class: 'cb-text' }, q)));
    })), h('button', { class: 'btn ghost block', onclick: () => { store.update((s) => { s.checklistProgress[key] = {}; }); refresh(); } }, 'Reset check'));
}
