import { h, frag } from '../ui/dom.js';
import { navigate, refresh } from '../ui/router.js';
import { header, backLink, sectionLabel, infoBox } from '../ui/components.js';
import { store } from '../model/store.js';
import { FamilyPlan, PersonStatus, CommunityPerson } from '../model/types.js';

const FAMILY_FIELDS: { key: keyof FamilyPlan; label: string; area?: boolean }[] = [
  { key: 'meetingPoint', label: 'Primary meeting location' },
  { key: 'secondaryMeetingPoint', label: 'Secondary meeting location' },
  { key: 'outOfAreaContact', label: 'Out-of-area contact (to relay messages)' },
  { key: 'emergencyContacts', label: 'Emergency contacts', area: true },
  { key: 'evacuationPlan', label: 'Evacuation plan / route', area: true },
  { key: 'petPlan', label: 'Pet plan' },
  { key: 'medicalNeeds', label: 'Medical needs / medications', area: true },
  { key: 'importantAddresses', label: 'Important addresses (hospital, shelter)', area: true },
];

export function familyView(): Node {
  const state = store.get();
  const fields = FAMILY_FIELDS.map((f) => {
    const input = f.area
      ? h('textarea', {}) as HTMLTextAreaElement
      : h('input', { type: 'text' }) as HTMLInputElement;
    input.value = state.family[f.key];
    input.addEventListener('input', () => { store.update((s) => { s.family[f.key] = input.value; }); });
    return h('label', { class: 'field' }, h('span', { class: 'fl' }, f.label), input);
  });

  return frag(
    header(),
    backLink('/prepare', 'Prepare'),
    h('h1', { class: 'page-title' }, '👪 Family Plan'),
    h('p', { class: 'page-sub' }, 'Stored locally and offline. This is your shared emergency plan and offline info card.'),
    infoBox('Write it down so it works even with no phone, no signal, and dead batteries.'),
    h('div', { class: 'card' }, ...fields),
    h('button', { class: 'btn primary block', onclick: () => downloadPlan(state.family) }, '⬇ Download offline card')
  );
}

function downloadPlan(fp: FamilyPlan) {
  const text = [
    'SURVIVAL COMMAND — EMERGENCY INFORMATION CARD',
    '',
    'Primary meeting location: ' + fp.meetingPoint,
    'Secondary meeting location: ' + fp.secondaryMeetingPoint,
    'Out-of-area contact: ' + fp.outOfAreaContact,
    'Emergency contacts: ' + fp.emergencyContacts,
    'Evacuation plan: ' + fp.evacuationPlan,
    'Pet plan: ' + fp.petPlan,
    'Medical needs: ' + fp.medicalNeeds,
    'Important addresses: ' + fp.importantAddresses,
    '',
    'In a real emergency, follow official instructions when available.',
  ].join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'emergency-info-card.txt';
  a.click();
  URL.revokeObjectURL(url);
}

const STATUS_META: Record<PersonStatus, { label: string; cls: string }> = {
  safe: { label: 'Safe', cls: 'low' },
  help: { label: 'Needs help', cls: 'high' },
  missing: { label: 'Missing', cls: 'high' },
  evacuated: { label: 'Evacuated', cls: 'moderate' },
  unknown: { label: 'Unknown', cls: 'moderate' },
};
const STATUS_CYCLE: PersonStatus[] = ['unknown', 'safe', 'help', 'evacuated', 'missing'];

export function communityView(): Node {
  const state = store.get();
  const container = h('div', {});

  function renderList() {
    while (container.firstChild) container.removeChild(container.firstChild);
    if (!state.community.length) {
      container.appendChild(infoBox('No one added yet. Track trusted people nearby so you can check on and help each other.'));
    }
    state.community.forEach((p) => {
      const meta = STATUS_META[p.status];
      container.appendChild(
        h('div', { class: 'list-row' },
          h('span', { class: 'lr-icon' }, '👤'),
          h('div', { class: 'lr-body' },
            h('div', { class: 'lr-title' }, p.name || 'Unnamed'),
            h('div', { class: 'lr-sub' }, p.needs ? 'Needs: ' + p.needs : 'No needs noted')
          ),
          h('button', { class: 'badge ' + meta.cls, style: { border: 'none', cursor: 'pointer' }, onclick: () => {
            const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(p.status) + 1) % STATUS_CYCLE.length];
            store.update(() => { p.status = next; });
            renderList();
          } }, meta.label)
        )
      );
    });
  }
  renderList();

  const nameInput = h('input', { type: 'text', placeholder: 'Name' }) as HTMLInputElement;
  const needsInput = h('input', { type: 'text', placeholder: 'Needs (optional)' }) as HTMLInputElement;

  return frag(
    header(),
    backLink('/prepare', 'Prepare'),
    h('h1', { class: 'page-title' }, '🤝 Community'),
    h('p', { class: 'page-sub' }, 'Tap a status to cycle it. Help vulnerable people where it is reasonably safe to do so.'),
    container,
    h('div', { class: 'card' },
      h('h3', {}, 'Add a person'),
      h('label', { class: 'field' }, h('span', { class: 'fl' }, 'Name'), nameInput),
      h('label', { class: 'field' }, h('span', { class: 'fl' }, 'Needs'), needsInput),
      h('button', { class: 'btn primary block', onclick: () => {
        if (!nameInput.value.trim()) return;
        const person: CommunityPerson = { id: 'p' + Date.now(), name: nameInput.value.trim(), status: 'unknown', needs: needsInput.value.trim() };
        store.update((s) => { s.community.push(person); });
        nameInput.value = ''; needsInput.value = '';
        renderList();
      } }, 'Add')
    )
  );
}
