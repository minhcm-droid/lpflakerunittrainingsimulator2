export type LineFluidType =
  | 'INACTIVE'
  | 'LP_HOT'
  | 'NITROGEN_LN'
  | 'COOLING_WATER'
  | 'STEAM_MS'
  | 'VENT_HEXANE';

export const PROCESS_LINE_COLORS: Record<LineFluidType, string> = {
  INACTIVE: '#64748b',
  LP_HOT: '#f97316',
  NITROGEN_LN: '#22c55e',
  COOLING_WATER: '#3b82f6',
  STEAM_MS: '#ef4444',
  VENT_HEXANE: '#eab308',
};
