import { h, frag } from '../ui/dom.js';
import { navigate } from '../ui/router.js';
import { header, backLink } from '../ui/components.js';
import { getScenario } from '../data/scenarios.js';
// Interactive decision tree. State is held locally in the view (re-rendered
// in place) so it feels responsive without touching the store.
export function decisionView(params) {
    const s = getScenario(params.id);
    const container = h('div', {});
    if (!s || !s.decisionTree) {
        container.appendChild(h('div', { class: 'card' }, 'No decision tree for this scenario.'));
        return frag(header(), backLink('/scenario/' + params.id, 'Back'), container);
    }
    const tree = s.decisionTree;
    const byId = new Map(tree.map((n) => [n.id, n]));
    function renderNode(id) {
        const node = byId.get(id);
        while (container.firstChild)
            container.removeChild(container.firstChild);
        if (!node)
            return;
        container.appendChild(h('div', { class: 'dtree-q' }, node.question));
        node.options.forEach((opt) => {
            container.appendChild(h('button', {
                class: 'btn block',
                style: { marginBottom: '10px' },
                onclick: () => {
                    if (opt.next)
                        renderNode(opt.next);
                    else if (opt.result)
                        renderResult(opt.result);
                },
            }, opt.label));
        });
    }
    function renderResult(result) {
        while (container.firstChild)
            container.removeChild(container.firstChild);
        container.appendChild(h('div', { class: 'priority pri-serious' }, h('div', { class: 'pri-tag' }, 'Recommended path'), h('div', { class: 'pri-action', style: { fontSize: '1.05rem' } }, result)));
        container.appendChild(h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn', onclick: () => renderNode(tree[0].id) }, 'Restart'), h('button', { class: 'btn primary', onclick: () => navigate('/scenario/' + s.id) }, 'Full plan')));
    }
    renderNode(tree[0].id);
    return frag(header(), backLink('/scenario/' + params.id, s.title), h('h1', { class: 'page-title' }, '🌳 ' + s.title + ' — Decisions'), h('p', { class: 'page-sub' }, 'Answer each question to reach the recommended action.'), container);
}
