// =========================================================================
// Offline-first persistent store.
// - Uses localStorage as the durable local database.
// - Emits change events so the UI can re-render.
// - NEVER deletes locally stored emergency information on load failure.
// =========================================================================

import {
  AppState,
  Household,
  Conditions,
  ResourceKey,
  FamilyPlan,
} from './types.js';

const STORAGE_KEY = 'survival-command-state-v1';

function defaultHousehold(): Household {
  return {
    people: 1,
    children: 0,
    elderly: 0,
    pets: 0,
    climate: 'temperate',
    environment: 'suburban',
    dwelling: 'house',
    hasVehicle: false,
    hasGenerator: false,
    hasSolar: false,
    hasCooking: false,
    hasWaterStorage: false,
    hasFoodStorage: false,
    hasMedicalKit: false,
    hasRadio: false,
    hasFlashlights: false,
    hasBatteries: false,
    hasMedications: false,
    canLeaveArea: true,
    setupComplete: false,
  };
}

function defaultConditions(): Conditions {
  return {
    power: 'grid',
    comms: 'working',
    shelter: 'secure',
    medical: 'normal',
    waterService: 'working',
    temperature: 'comfortable',
    activeScenarioId: null,
    emergencyStart: null,
  };
}

function defaultFamily(): FamilyPlan {
  return {
    meetingPoint: '',
    secondaryMeetingPoint: '',
    outOfAreaContact: '',
    emergencyContacts: '',
    evacuationPlan: '',
    petPlan: '',
    medicalNeeds: '',
    importantAddresses: '',
  };
}

function defaultResources(): Record<ResourceKey, number> {
  return {
    water: 0,
    treatableWater: 0,
    food: 0,
    batteries: 0,
    fuel: 0,
    medical: 0,
    lighting: 0,
    comms: 0,
    cash: 0,
    transport: 0,
    clothing: 0,
    shelter: 0,
    medications: 0,
    sanitation: 0,
  };
}

export function defaultState(): AppState {
  return {
    version: 1,
    household: defaultHousehold(),
    resources: defaultResources(),
    conditions: defaultConditions(),
    checklistProgress: {},
    kitOwned: {},
    community: [],
    family: defaultFamily(),
    waterBudget: { people: 1, liters: 0, activity: 'normal' },
    powerBudget: { phoneWh: 15, bankWh: 0, solarW: 0 },
  };
}

// Deep-merge saved state onto defaults so new fields survive upgrades and
// corrupted / partial saves never wipe the user's emergency data.
function reconcile(saved: any): AppState {
  const base = defaultState();
  if (!saved || typeof saved !== 'object') return base;
  return {
    ...base,
    ...saved,
    household: { ...base.household, ...(saved.household || {}) },
    resources: { ...base.resources, ...(saved.resources || {}) },
    conditions: { ...base.conditions, ...(saved.conditions || {}) },
    family: { ...base.family, ...(saved.family || {}) },
    waterBudget: { ...base.waterBudget, ...(saved.waterBudget || {}) },
    powerBudget: { ...base.powerBudget, ...(saved.powerBudget || {}) },
    checklistProgress: saved.checklistProgress || {},
    kitOwned: saved.kitOwned || {},
    community: Array.isArray(saved.community) ? saved.community : [],
  };
}

type Listener = () => void;

class Store {
  private state: AppState;
  private listeners = new Set<Listener>();

  constructor() {
    let loaded: AppState;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      loaded = reconcile(raw ? JSON.parse(raw) : null);
    } catch {
      // If parsing fails we fall back to defaults but DO NOT clear storage,
      // so a future fix can still recover the original bytes if needed.
      loaded = defaultState();
    }
    this.state = loaded;
  }

  get(): AppState {
    return this.state;
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Storage full / unavailable — keep running in memory; never crash.
    }
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  // Apply a mutation via an updater function, persist, and notify.
  update(mutator: (draft: AppState) => void) {
    mutator(this.state);
    this.persist();
    this.emit();
  }

  reset() {
    this.state = defaultState();
    this.persist();
    this.emit();
  }
}

export const store = new Store();
