import { h, frag } from '../ui/dom.js';
import { navigate, refresh } from '../ui/router.js';
import { header, backLink, severityBadge, phaseBlock, warnBox, sectionLabel, } from '../ui/components.js';
import { getScenario } from '../data/scenarios.js';
import { store } from '../model/store.js';
const CHECK_LABEL = { open: '', done: '✓', skip: '–', cant: '!' };
export function scenarioView(params) {
    const s = getScenario(params.id);
    if (!s)
        return frag(header(), h('div', { class: 'card' }, 'Scenario not found.'));
    const progress = store.get().checklistProgress[s.id] || {};
    function setCheck(i, next) {
        store.update((st) => {
            st.checklistProgress[s.id] = st.checklistProgress[s.id] || {};
            st.checklistProgress[s.id][i] = next;
        });
        refresh();
    }
    const backTarget = s.category === 'natural' ? '/emergency/natural' : s.category === 'infrastructure' ? '/emergency/infrastructure' : '/emergency';
    return frag(header(), backLink(backTarget, 'Back'), h('div', { class: 'pill-row' }, severityBadge(s.severity), h('span', { class: 'badge low' }, 'Reviewed ' + s.lastReviewed)), h('h1', { class: 'page-title' }, `${s.icon} ${s.title}`), h('p', { class: 'page-sub' }, s.summary), h('div', { class: 'info-box' }, s.dangerAssessment), sectionLabel('Action plan'), ...s.phases.map(phaseBlock), s.doNot.length ? warnBox('Things NOT to do', s.doNot) : null, s.decisionTree ? h('button', { class: 'btn block', onclick: () => navigate('/decision/' + s.id) }, '🌳 Open decision tree') : null, sectionLabel('Checklist'), h('div', { class: 'card' }, ...s.checklist.map((item, i) => {
        const st = progress[i] || 'open';
        return h('div', { class: 'check-item ' + (st === 'done' ? 'done' : '') }, h('div', {
            class: 'check-box ' + (st !== 'open' ? st : ''),
            onclick: () => setCheck(i, st === 'done' ? 'open' : 'done'),
        }, CHECK_LABEL[st]), h('div', { class: 'check-body' }, h('div', { class: 'cb-text' }, item), h('div', { class: 'check-actions' }, h('button', { onclick: () => setCheck(i, 'done') }, 'Check'), h('button', { onclick: () => setCheck(i, 'skip') }, 'Skip'), h('button', { onclick: () => setCheck(i, 'cant') }, "Can't"), h('button', { onclick: () => navigate('/commander') }, 'Need help'))));
    })), sectionLabel('Resource priorities'), h('div', { class: 'pill-row' }, ...s.resourcePriorities.map((r) => h('span', { class: 'badge moderate' }, r))), detailCard('Evacuation triggers', s.evacuationTriggers), detailCard('Communication', s.communication), detailCard('Medical considerations', s.medical), detailCard('Environmental considerations', s.environmental), detailCard('Improvised solutions', s.improvised), h('div', { class: 'spacer' }), h('button', { class: 'btn primary block', onclick: () => navigate('/commander') }, 'Ask Commander about this situation'));
}
function detailCard(title, items) {
    if (!items.length)
        return null;
    return h('div', { class: 'card' }, h('h3', {}, title), h('ul', {}, ...items.map((i) => h('li', {}, i))));
}
