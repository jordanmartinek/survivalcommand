// Tiny DOM helper library — a zero-dependency substitute for a framework.
// h() builds elements; render() swaps a view into a container.

type Child = Node | string | number | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Record<string, any> | null,
  ...children: (Child | Child[])[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class' || k === 'className') el.className = String(v);
      else if (k === 'html') el.innerHTML = String(v);
      else if (k.startsWith('on') && typeof v === 'function') {
        el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
      } else if (k === 'style' && typeof v === 'object') {
        Object.assign(el.style, v);
      } else if (k === 'value') {
        (el as any).value = v;
      } else if (v === true) {
        el.setAttribute(k, '');
      } else {
        el.setAttribute(k, String(v));
      }
    }
  }
  const append = (c: Child) => {
    if (c == null || c === false) return;
    el.appendChild(typeof c === 'object' ? (c as Node) : document.createTextNode(String(c)));
  };
  for (const c of children) {
    if (Array.isArray(c)) c.forEach(append);
    else append(c);
  }
  return el;
}

export function frag(...children: (Child | Child[])[]): DocumentFragment {
  const f = document.createDocumentFragment();
  const append = (c: Child) => {
    if (c == null || c === false) return;
    f.appendChild(typeof c === 'object' ? (c as Node) : document.createTextNode(String(c)));
  };
  for (const c of children) {
    if (Array.isArray(c)) c.forEach(append);
    else append(c);
  }
  return f;
}

export function clear(el: HTMLElement) {
  while (el.firstChild) el.removeChild(el.firstChild);
}
