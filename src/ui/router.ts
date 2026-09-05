// Hash-based router. Routes map to render functions that return a Node.
// Keeps everything offline — no server routing needed.

export type RouteRender = (params: Record<string, string>) => Node;

interface Route {
  pattern: RegExp;
  keys: string[];
  render: RouteRender;
}

const routes: Route[] = [];
let notFound: RouteRender = () => document.createTextNode('Not found');
let onChange: (() => void) | null = null;

export function route(path: string, render: RouteRender) {
  const keys: string[] = [];
  const pattern = new RegExp(
    '^' +
      path
        .replace(/:[^/]+/g, (m) => {
          keys.push(m.slice(1));
          return '([^/]+)';
        })
        .replace(/\//g, '\\/') +
      '$'
  );
  routes.push({ pattern, keys, render });
}

export function setNotFound(render: RouteRender) {
  notFound = render;
}

export function navigate(path: string) {
  if (location.hash === '#' + path) {
    resolve();
  } else {
    location.hash = path;
  }
}

export function currentPath(): string {
  return location.hash.replace(/^#/, '') || '/';
}

let container: HTMLElement;

function resolve() {
  const path = currentPath();
  for (const r of routes) {
    const m = r.pattern.exec(path);
    if (m) {
      const params: Record<string, string> = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      const node = r.render(params);
      swap(node);
      window.scrollTo(0, 0);
      if (onChange) onChange();
      return;
    }
  }
  swap(notFound({}));
  if (onChange) onChange();
}

function swap(node: Node) {
  while (container.firstChild) container.removeChild(container.firstChild);
  container.appendChild(node);
}

export function startRouter(root: HTMLElement, changed?: () => void) {
  container = root;
  onChange = changed || null;
  window.addEventListener('hashchange', resolve);
  resolve();
}

export function refresh() {
  resolve();
}
