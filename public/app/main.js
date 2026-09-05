// =========================================================================
// SURVIVAL COMMAND — application entry point.
// Wires the router, tab bar, offline indicator, and re-render on state change.
// Fully offline-first: no network calls anywhere in the runtime.
// =========================================================================
import { route, setNotFound, startRouter, navigate, currentPath, refresh } from './ui/router.js';
import { store } from './model/store.js';
import { homeView, priorityDetailView } from './views/home.js';
import { emergencyView, infrastructureListView, naturalListView } from './views/emergency.js';
import { scenarioView } from './views/scenario.js';
import { decisionView } from './views/decision.js';
import { resourcesView, waterCenterView, foodView, powerView, inventoryView, } from './views/resources.js';
import { prepareView, readinessView } from './views/prepare.js';
import { plan72View, plan7View } from './views/plan.js';
import { familyView, communityView } from './views/family.js';
import { settingsView } from './views/settings.js';
import { commanderView } from './views/commander.js';
import { improviseView, improviseDetailView, canIUseView, usableDetailView, nothingView, } from './views/improvise.js';
import { simulatorView, evacuateView } from './views/simulator.js';
// ---- Routes -------------------------------------------------------------
route('/', homeView);
route('/priority', priorityDetailView);
route('/emergency', emergencyView);
route('/emergency/infrastructure', infrastructureListView);
route('/emergency/natural', naturalListView);
route('/scenario/:id', scenarioView);
route('/decision/:id', decisionView);
route('/resources', resourcesView);
route('/resources/water', waterCenterView);
route('/resources/food', foodView);
route('/resources/power', powerView);
route('/resources/inventory', inventoryView);
route('/prepare', prepareView);
route('/readiness', readinessView);
route('/plan72', plan72View);
route('/plan7', plan7View);
route('/family', familyView);
route('/community', communityView);
route('/settings', settingsView);
route('/commander', commanderView);
route('/improvise', improviseView);
route('/improvise/:id', improviseDetailView);
route('/can-i-use', canIUseView);
route('/can-i-use/:id', usableDetailView);
route('/nothing', nothingView);
route('/whatif', simulatorView);
route('/evacuate', evacuateView);
setNotFound(homeView);
const TABS = [
    { path: '/', icon: '🏠', label: 'Home', match: (p) => p === '/' || p === '/priority' || p === '/whatif' || p === '/evacuate' },
    { path: '/emergency', icon: '🆘', label: 'Survive', match: (p) => p.startsWith('/emergency') || p.startsWith('/scenario') || p.startsWith('/decision') },
    { path: '/resources', icon: '📦', label: 'Resources', match: (p) => p.startsWith('/resources') },
    { path: '/prepare', icon: '🎒', label: 'Prepare', match: (p) => ['/prepare', '/plan72', '/plan7', '/family', '/community', '/readiness'].includes(p) },
    { path: '/improvise', icon: '🔧', label: 'Improvise', match: (p) => p.startsWith('/improvise') || p.startsWith('/can-i-use') || p === '/nothing' },
    { path: '/commander', icon: '🧭', label: 'Commander', match: (p) => p === '/commander' },
];
function renderTabs() {
    const bar = document.getElementById('tabbar');
    bar.hidden = false;
    while (bar.firstChild)
        bar.removeChild(bar.firstChild);
    const path = currentPath();
    TABS.forEach((t) => {
        const btn = document.createElement('button');
        btn.className = t.match(path) ? 'active' : '';
        btn.innerHTML = `<span class="ti">${t.icon}</span><span>${t.label}</span>`;
        btn.addEventListener('click', () => navigate(t.path));
        bar.appendChild(btn);
    });
}
// ---- Offline indicator --------------------------------------------------
function updateOnline() {
    const banner = document.getElementById('offline-banner');
    banner.hidden = navigator.onLine;
}
window.addEventListener('online', updateOnline);
window.addEventListener('offline', updateOnline);
// ---- Boot ---------------------------------------------------------------
const root = document.getElementById('app');
startRouter(root, renderTabs);
updateOnline();
// Re-render the current view whenever persisted state changes so estimates,
// the priority engine, and the threat level stay live.
let raf = 0;
store.subscribe(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
        // Only auto-refresh views that are purely state-derived; interactive
        // views (Commander, decision tree) manage their own DOM and call refresh()
        // explicitly, so a full refresh here is safe and cheap.
        const p = currentPath();
        const selfManaged = p === '/commander' || p.startsWith('/decision');
        if (!selfManaged)
            refresh();
    });
});
