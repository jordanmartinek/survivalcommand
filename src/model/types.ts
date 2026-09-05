// =========================================================================
// SURVIVAL COMMAND — core data model
// All scenario knowledge is stored in structured form (see data/) rather than
// hard-coded into screens. Types here define the shape of both user state and
// the offline knowledge base.
// =========================================================================

export type ThreatLevel = 'stable' | 'elevated' | 'serious' | 'critical';
export type RiskLevel = 'low' | 'moderate' | 'high';
export type Severity = 'stable' | 'elevated' | 'serious' | 'critical';

// ---- Household / profile ------------------------------------------------
export type EnvType = 'urban' | 'suburban' | 'rural';
export type DwellingType = 'apartment' | 'house' | 'other';
export type Climate = 'hot' | 'temperate' | 'cold' | 'variable';

export interface Household {
  people: number;
  children: number;
  elderly: number;
  pets: number;
  climate: Climate;
  environment: EnvType;
  dwelling: DwellingType;
  hasVehicle: boolean;
  hasGenerator: boolean;
  hasSolar: boolean;
  hasCooking: boolean;
  hasWaterStorage: boolean;
  hasFoodStorage: boolean;
  hasMedicalKit: boolean;
  hasRadio: boolean;
  hasFlashlights: boolean;
  hasBatteries: boolean;
  hasMedications: boolean;
  canLeaveArea: boolean;
  setupComplete: boolean;
}

// ---- Resources ----------------------------------------------------------
export type ResourceKey =
  | 'water'
  | 'treatableWater'
  | 'food'
  | 'batteries'
  | 'fuel'
  | 'medical'
  | 'lighting'
  | 'comms'
  | 'cash'
  | 'transport'
  | 'clothing'
  | 'shelter'
  | 'medications'
  | 'sanitation';

export interface Resource {
  key: ResourceKey;
  label: string;
  icon: string;
  unit: string;
  quantity: number;
}

// Live self-reported system conditions used by the priority engine.
export type PowerState = 'grid' | 'backup' | 'none';
export type CommsState = 'working' | 'degraded' | 'unavailable';
export type ShelterState = 'secure' | 'compromised' | 'unsafe';
export type MedicalState = 'normal' | 'concern' | 'emergency';
export type WaterService = 'working' | 'unsafe' | 'unavailable';
export type TempState = 'comfortable' | 'uncomfortable' | 'dangerous';

export interface Conditions {
  power: PowerState;
  comms: CommsState;
  shelter: ShelterState;
  medical: MedicalState;
  waterService: WaterService;
  temperature: TempState;
  activeScenarioId: string | null;
  emergencyStart: number | null; // epoch ms when an active emergency began
}

// ---- Knowledge base -----------------------------------------------------
export interface Phase {
  label: string; // e.g. "FIRST 5 MINUTES"
  now?: boolean;
  items: string[];
}

export interface DecisionNode {
  id: string;
  question: string;
  // Each option leads to another node id, or ends with a result string.
  options: { label: string; next?: string; result?: string; risk?: RiskLevel }[];
}

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  category: 'immediate' | 'infrastructure' | 'natural' | 'other';
  severity: Severity;
  summary: string;
  dangerAssessment: string;
  phases: Phase[];
  doNot: string[];
  improvised: string[];
  evacuationTriggers: string[];
  communication: string[];
  medical: string[];
  environmental: string[];
  resourcePriorities: ResourceKey[];
  decisionTree?: DecisionNode[];
  checklist: string[];
  lastReviewed: string;
}

// ---- Improvise / Can-I-Use-This ----------------------------------------
export interface ImprovisedSolution {
  id: string;
  title: string;
  category: string;
  problem: string;
  materials: string[];
  procedure: string[];
  safety: string[];
  risk: RiskLevel;
  limitations: string[];
  betterAlternative: string;
}

export interface UsableObject {
  id: string;
  name: string;
  icon: string;
  uses: string[];
  warnings: string[];
}

// ---- Checklist state ----------------------------------------------------
export type CheckState = 'open' | 'done' | 'skip' | 'cant';
export interface ChecklistProgress {
  [scenarioOrKey: string]: { [index: number]: CheckState };
}

// ---- Preparedness kit ---------------------------------------------------
export interface KitCategory {
  key: string;
  label: string;
  icon: string;
  items: KitItem[];
}
export interface KitItem {
  id: string;
  label: string;
  weight: number; // contribution to score
}

// ---- Family / community -------------------------------------------------
export type PersonStatus = 'safe' | 'help' | 'missing' | 'evacuated' | 'unknown';
export interface CommunityPerson {
  id: string;
  name: string;
  status: PersonStatus;
  needs: string;
}
export interface FamilyPlan {
  meetingPoint: string;
  secondaryMeetingPoint: string;
  outOfAreaContact: string;
  emergencyContacts: string;
  evacuationPlan: string;
  petPlan: string;
  medicalNeeds: string;
  importantAddresses: string;
}

// ---- Root app state -----------------------------------------------------
export interface AppState {
  version: number;
  household: Household;
  resources: Record<ResourceKey, number>;
  conditions: Conditions;
  checklistProgress: ChecklistProgress;
  kitOwned: Record<string, boolean>;
  community: CommunityPerson[];
  family: FamilyPlan;
  waterBudget: { people: number; liters: number; activity: 'low' | 'normal' | 'high' };
  powerBudget: { phoneWh: number; bankWh: number; solarW: number };
}
