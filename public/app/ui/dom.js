// Tiny DOM helper library — a zero-dependency substitute for a framework.
// h() builds elements; render() swaps a view into a container.
export function h(tag, props, ...children) {
    const el = document.createElement(tag);
    if (props) {
        for (const [k, v] of Object.entries(props)) {
            if (v == null || v === false)
                continue;
            if (k === 'class' || k === 'className')
                el.className = String(v);
            else if (k === 'html')
                el.innerHTML = String(v);
            else if (k.startsWith('on') && typeof v === 'function') {
                el.addEventListener(k.slice(2).toLowerCase(), v);
            }
            else if (k === 'style' && typeof v === 'object') {
                Object.assign(el.style, v);
            }
            else if (k === 'value') {
                el.value = v;
            }
            else if (v === true) {
                el.setAttribute(k, '');
            }
            else {
                el.setAttribute(k, String(v));
            }
        }
    }
    const append = (c) => {
        if (c == null || c === false)
            return;
        el.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
    };
    for (const c of children) {
        if (Array.isArray(c))
            c.forEach(append);
        else
            append(c);
    }
    return el;
}
export function frag(...children) {
    const f = document.createDocumentFragment();
    const append = (c) => {
        if (c == null || c === false)
            return;
        f.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
    };
    for (const c of children) {
        if (Array.isArray(c))
            c.forEach(append);
        else
            append(c);
    }
    return f;
}
export function clear(el) {
    while (el.firstChild)
        el.removeChild(el.firstChild);
}
