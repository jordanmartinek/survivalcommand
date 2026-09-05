import { h, frag } from '../ui/dom.js';
import { navigate, refresh } from '../ui/router.js';
import { header, backLink, sectionLabel, stepper, infoBox } from '../ui/components.js';
import { store } from '../model/store.js';
import { setStress, isStress } from '../ui/stress.js';
function chipRow(current, opts, onPick) {
    return h('div', { class: 'chips' }, ...opts.map((o) => h('button', { class: 'chip ' + (current === o.value ? 'on' : ''), onclick: () => { onPick(o.value); refresh(); } }, o.label)));
}
function toggleChips(items, state, onToggle) {
    return h('div', { class: 'chips' }, ...items.map((i) => h('button', { class: 'chip ' + (state[i.key] ? 'on' : ''), onclick: () => { onToggle(i.key); refresh(); } }, i.label)));
}
export function settingsView() {
    const state = store.get();
    const h_ = state.household;
    const equipment = [
        { key: 'hasVehicle', label: 'Vehicle' },
        { key: 'hasGenerator', label: 'Generator' },
        { key: 'hasSolar', label: 'Solar' },
        { key: 'hasCooking', label: 'Cooking gear' },
        { key: 'hasWaterStorage', label: 'Water storage' },
        { key: 'hasFoodStorage', label: 'Food storage' },
        { key: 'hasMedicalKit', label: 'Medical kit' },
        { key: 'hasRadio', label: 'Radio' },
        { key: 'hasFlashlights', label: 'Flashlights' },
        { key: 'hasBatteries', label: 'Batteries' },
        { key: 'hasMedications', label: 'Medications' },
        { key: 'canLeaveArea', label: 'Can leave area' },
    ];
    const eqState = {};
    equipment.forEach((e) => (eqState[e.key] = h_[e.key]));
    return frag(header(), backLink('/', 'Home'), h('h1', { class: 'page-title' }, 'Survival Profile'), h('p', { class: 'page-sub' }, 'No sensitive personal info required. Skip anything you like — it just sharpens recommendations.'), sectionLabel('Household'), h('div', { class: 'card' }, field('People', stepper(h_.people, (v) => set((s) => (s.household.people = Math.max(1, v))), 1)), field('Children', stepper(h_.children, (v) => set((s) => (s.household.children = v)))), field('Elderly', stepper(h_.elderly, (v) => set((s) => (s.household.elderly = v)))), field('Pets', stepper(h_.pets, (v) => set((s) => (s.household.pets = v))))), sectionLabel('Environment'), h('div', { class: 'card' }, field('Climate', chipRow(h_.climate, [
        { value: 'hot', label: 'Hot' }, { value: 'temperate', label: 'Temperate' }, { value: 'cold', label: 'Cold' }, { value: 'variable', label: 'Variable' },
    ], (v) => set((s) => (s.household.climate = v)))), field('Area', chipRow(h_.environment, [
        { value: 'urban', label: 'Urban' }, { value: 'suburban', label: 'Suburban' }, { value: 'rural', label: 'Rural' },
    ], (v) => set((s) => (s.household.environment = v)))), field('Dwelling', chipRow(h_.dwelling, [
        { value: 'apartment', label: 'Apartment' }, { value: 'house', label: 'House' }, { value: 'other', label: 'Other' },
    ], (v) => set((s) => (s.household.dwelling = v))))), sectionLabel('Equipment access'), h('div', { class: 'card' }, toggleChips(equipment, eqState, (k) => set((s) => { s.household[k] = !s.household[k]; }))), sectionLabel('Live conditions'), infoBox('Update these when your situation changes — they drive the priority engine and threat level.'), h('div', { class: 'card' }, field('Power', chipRow(state.conditions.power, [
        { value: 'grid', label: 'Grid' }, { value: 'backup', label: 'Backup' }, { value: 'none', label: 'None' },
    ], (v) => set((s) => (s.conditions.power = v)))), field('Water service', chipRow(state.conditions.waterService, [
        { value: 'working', label: 'Working' }, { value: 'unsafe', label: 'Unsafe' }, { value: 'unavailable', label: 'None' },
    ], (v) => set((s) => (s.conditions.waterService = v)))), field('Temperature', chipRow(state.conditions.temperature, [
        { value: 'comfortable', label: 'OK' }, { value: 'uncomfortable', label: 'Uncomfortable' }, { value: 'dangerous', label: 'Dangerous' },
    ], (v) => set((s) => (s.conditions.temperature = v)))), field('Shelter', chipRow(state.conditions.shelter, [
        { value: 'secure', label: 'Secure' }, { value: 'compromised', label: 'Compromised' }, { value: 'unsafe', label: 'Unsafe' },
    ], (v) => set((s) => (s.conditions.shelter = v)))), field('Communication', chipRow(state.conditions.comms, [
        { value: 'working', label: 'Working' }, { value: 'degraded', label: 'Degraded' }, { value: 'unavailable', label: 'None' },
    ], (v) => set((s) => (s.conditions.comms = v)))), field('Medical', chipRow(state.conditions.medical, [
        { value: 'normal', label: 'Normal' }, { value: 'concern', label: 'Concern' }, { value: 'emergency', label: 'Emergency' },
    ], (v) => set((s) => (s.conditions.medical = v))))), sectionLabel('Interface'), h('div', { class: 'card' }, field('Stress Mode (bigger, high-contrast emergency UI)', h('button', { class: 'btn ' + (isStress() ? 'primary' : ''), onclick: () => { setStress(!isStress()); refresh(); } }, isStress() ? 'On' : 'Off'))), h('button', { class: 'btn primary block', onclick: () => { store.update((s) => { s.household.setupComplete = true; }); navigate('/'); } }, 'Save & return'), h('div', { class: 'spacer' }), h('button', { class: 'btn ghost block', onclick: () => { if (confirm('Reset all local data? This cannot be undone.')) {
            store.reset();
            refresh();
        } } }, 'Reset all data'));
}
function field(label, control) {
    return h('label', { class: 'field' }, h('span', { class: 'fl' }, label), control);
}
function set(mut) { store.update(mut); }
