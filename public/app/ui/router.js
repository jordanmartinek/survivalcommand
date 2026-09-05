// Hash-based router. Routes map to render functions that return a Node.
// Keeps everything offline — no server routing needed.
const routes = [];
let notFound = () => document.createTextNode('Not found');
let onChange = null;
export function route(path, render) {
    const keys = [];
    const pattern = new RegExp('^' +
        path
            .replace(/:[^/]+/g, (m) => {
            keys.push(m.slice(1));
            return '([^/]+)';
        })
            .replace(/\//g, '\\/') +
        '$');
    routes.push({ pattern, keys, render });
}
export function setNotFound(render) {
    notFound = render;
}
export function navigate(path) {
    if (location.hash === '#' + path) {
        resolve();
    }
    else {
        location.hash = path;
    }
}
export function currentPath() {
    return location.hash.replace(/^#/, '') || '/';
}
let container;
function resolve() {
    const path = currentPath();
    for (const r of routes) {
        const m = r.pattern.exec(path);
        if (m) {
            const params = {};
            r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
            const node = r.render(params);
            swap(node);
            window.scrollTo(0, 0);
            if (onChange)
                onChange();
            return;
        }
    }
    swap(notFound({}));
    if (onChange)
        onChange();
}
function swap(node) {
    while (container.firstChild)
        container.removeChild(container.firstChild);
    container.appendChild(node);
}
export function startRouter(root, changed) {
    container = root;
    onChange = changed || null;
    window.addEventListener('hashchange', resolve);
    resolve();
}
export function refresh() {
    resolve();
}
