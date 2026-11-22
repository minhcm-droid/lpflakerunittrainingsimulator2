export type OperatorRole = 'FIELD' | 'DCS';
export type SimulationMode = 'GUIDED' | 'PRACTICE' | 'ASSESSMENT';
export type VerificationStatus = 'VERIFIED' | 'NEED_CONFIRMATION' | 'NOT_CONFIRMED';

export type EquipmentState =
  | 'ISOLATED'
  | 'NOT_READY'
  | 'READY'
  | 'STARTING'
  | 'RUNNING'
  | 'STOPPING'
  | 'STOPPED'
  | 'TRIPPED';

export type ValveState =
  | 'CLOSED'
  | 'OPEN'
  | 'THROTTLED'
  | 'OPENING'
  | 'CLOSING'
  | 'FAILED_OPEN'
  | 'FAILED_CLOSED'
  | 'BYPASSED';

export type ValveType =
  | 'manual-isolation'
  | 'drain-valve'
  | 'vent-valve'
  | 'bypass-valve'
  | 'psv'
  | 'self-acting-regulator'
  | 'control-valve'
  | 'shutdown-valve'
  | 'slide-gate-valve'
  | 'scraper-actuator';

export interface SourceReference {
  document: string;
  section?: string;
  drawingNumber?: string;
}

export interface LocalizedText {
  vi: string;
  en: string;
}

export interface EquipmentItem {
  equipmentId: string;
  tag: string;
  name: LocalizedText;
  category: string;
  train: 'COMMON' | 'A' | 'B';
  pidDrawing: string;
  operableFromField: boolean;
  operableFromDCS: boolean;
  state: EquipmentState;
  speedRpm?: number;
  maxSpeedRpm?: number;
  loadPercent?: number;
  hasInspectionWindow?: boolean;
  sourceReference: SourceReference;
  verificationStatus: VerificationStatus;
  notes?: string;
}

export interface ValveItem {
  valveId: string;
  tag: string;
  sopTag?: string;
  sopContext: 'COMMON' | 'STARTUP' | 'SHUTDOWN';
  name: LocalizedText;
  valveType: ValveType;
  pidDrawing: string;
  lineService: string;
  failPosition?: 'FC' | 'FO' | 'FL' | 'N/A';
  operableFromField: boolean;
  operableFromDCS: boolean;
  state: ValveState;
  openingPercent: number;
  lockedState?: 'LO' | 'LC' | 'NONE';
  sourceReference: SourceReference;
  verificationStatus: VerificationStatus;
  conflictNote?: string;
}

export interface InstrumentItem {
  instrumentId: string;
  tag: string;
  equipmentTag: string;
  description: LocalizedText;
  unit: string;
  value: number;
  setpoint?: number;
  mvPercent?: number;
  mode?: 'AUTO' | 'MAN';
  oosActive?: boolean;
  pidDrawing: string;
  sourceReference: SourceReference;
  verificationStatus: VerificationStatus;
}

export interface AlarmThreshold {
  LL: number | null;
  L: number | null;
  H: number | null;
  HH: number | null;
}

export interface AlarmItem {
  alarmId: string;
  tag: string;
  equipmentTag: string;
  description: LocalizedText;
  unit: string;
  normalRange: { min: number; max: number; nominal: number };
  thresholds: AlarmThreshold;
  alternativeThresholds?: { source: string; LL: number | null; L: number | null };
  interlockTag: string | null;
  possibleCauses: string[];
  operatorAction: string[];
  sourceReference: SourceReference;
  verificationStatus: VerificationStatus;
  conflictNote?: string;
}

export interface PermissiveCondition {
  tag: string;
  label: string;
  rule: string;
}

export interface InterlockItem {
  interlockId: string;
  type: 'PERMISSIVE' | 'SAFETY_INTERLOCK';
  name: LocalizedText;
  targetEquipment?: string[];
  conditions?: PermissiveCondition[];
  actionOnSatisfied?: string;
  triggers?: string[];
  tripActions?: string[];
  bypassMechanism?: string;
  sourceReference: SourceReference;
  verificationStatus: VerificationStatus;
  conflictNote?: string;
}

export interface ProcedureStep {
  stepId: string;
  procedureType: 'STARTUP' | 'SHUTDOWN' | 'EMERGENCY';
  phase: string;
  sequence: number;
  title: LocalizedText;
  instruction: LocalizedText;
  operatorRole: OperatorRole | 'BOTH';
  equipmentTags: string[];
  valveTags: string[];
  instrumentTags: string[];
  initialConditions: string[];
  permissives: string[];
  expectedResponse: string[];
  verificationMethod: string[];
  alarmsToWatch: string[];
  interlocks: string[];
  hazards: string[];
  communicationRequired: string;
  sourceReference: SourceReference;
  verificationStatus: VerificationStatus;
}

export interface SimulationCommandResult {
  timestamp: string;
  role: OperatorRole;
  action: string;
  targetTag: string;
  success: boolean;
  message: LocalizedText;
  missingConditions: string[];
}
