import { h } from '../ui/dom.js';
import { header } from '../ui/components.js';
import { store } from '../model/store.js';
import { commander } from '../engine/commander.js';
const SUGGESTIONS = [
    'I have 10 liters of water for 3 people. What should I do?',
    'The power has been out for 36 hours.',
    'My apartment is getting extremely hot.',
    'I have a tarp, rope, bucket, flashlight and two bottles.',
];
let history = [];
export function commanderView() {
    const root = h('div', {});
    const chat = h('div', { class: 'chat' });
    function renderChat() {
        while (chat.firstChild)
            chat.removeChild(chat.firstChild);
        if (!history.length) {
            chat.appendChild(botIntro());
        }
        history.forEach((m) => {
            if (m.role === 'user')
                chat.appendChild(h('div', { class: 'msg user' }, m.text || ''));
            else if (m.reply)
                chat.appendChild(renderReply(m.reply));
        });
        chat.scrollIntoView(false);
    }
    const input = h('input', { type: 'text', placeholder: 'Describe your situation…' });
    function send(text) {
        const t = text.trim();
        if (!t)
            return;
        history.push({ role: 'user', text: t });
        const reply = commander(t, store.get());
        history.push({ role: 'bot', reply });
        input.value = '';
        renderChat();
    }
    const suggest = h('div', { class: 'suggest' }, ...SUGGESTIONS.map((s) => h('button', { class: 'chip', onclick: () => send(s) }, s)));
    const composer = h('div', { class: 'composer' }, input, h('button', { class: 'btn primary', onclick: () => send(input.value) }, '➤'));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter')
        send(input.value); });
    root.appendChild(header());
    root.appendChild(h('h1', { class: 'page-title' }, '🧭 Commander'));
    root.appendChild(h('p', { class: 'page-sub' }, 'Offline survival assistant. It reasons from your situation and current resources — no guessing, no internet needed.'));
    root.appendChild(suggest);
    root.appendChild(chat);
    root.appendChild(composer);
    renderChat();
    return root;
}
function botIntro() {
    return h('div', { class: 'msg bot' }, h('h4', {}, 'Commander ready'), h('div', {}, 'Tell me what is happening. I will give you the single most important problem and what to do now. If I am missing something critical, I will ask one question.'));
}
function renderReply(r) {
    const el = h('div', { class: 'msg bot' });
    const add = (title, body) => { el.appendChild(h('h4', {}, title)); el.appendChild(body); };
    add('Current situation', h('div', {}, r.situation));
    add('Most important problem', h('div', {}, r.problem));
    if (r.doNow.length)
        add('Do this now', h('ol', {}, ...r.doNow.map((x) => h('li', {}, x))));
    if (r.next.length)
        add('Next', h('ul', {}, ...r.next.map((x) => h('li', {}, x))));
    if (r.avoid.length)
        add('Avoid', h('ul', { class: 'avoid' }, ...r.avoid.map((x) => h('li', {}, x))));
    if (r.ifChange.length)
        add('If conditions change', h('ul', {}, ...r.ifChange.map((x) => h('li', {}, x))));
    if (r.question) {
        el.appendChild(h('h4', {}, 'One question'));
        el.appendChild(h('div', { style: { fontWeight: '700' } }, r.question));
    }
    return el;
}
