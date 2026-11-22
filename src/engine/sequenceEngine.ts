import { EquipmentItem, InstrumentItem, ValveItem } from '@/types/simulation';

export interface PermissiveCheck {
  tag: string;
  label: string;
  satisfied: boolean;
}

export function evaluatePackingPermissivesA(
  instruments: InstrumentItem[],
  valves: ValveItem[]
): PermissiveCheck[] {
  const fzi = instruments.find((i) => i.tag === 'FZI-7607A')?.value ?? 0;
  const hev761 = valves.find((v) => v.tag === '20-HEV-761A')?.state ?? 'CLOSED';
  const lah763 = instruments.find((i) => i.tag === 'LAH-763A')?.value ?? 10;

  return [
    { tag: 'FZALL-7607A', label: 'FZALL7607A NORMAL (>= 18 Nm3/h)', satisfied: fzi >= 18 },
    { tag: '20-HZLC-761A', label: 'HV761A CLOSED', satisfied: hev761 === 'CLOSED' },
    { tag: '20-LSH-763A', label: 'LAH763A NOT HIGH', satisfied: lah763 < 80 },
  ];
}

export function evaluateFlakerPermissivesA(params: {
  instruments: InstrumentItem[];
  valves: ValveItem[];
  equipment: EquipmentItem[];
  tzi797Profile: 'SHUTDOWN_SOP_AND_DCS' | 'STARTUP_SOP_TABLE';
}): PermissiveCheck[] {
  const { instruments, valves, equipment, tzi797Profile } = params;
  const fzi = instruments.find((i) => i.tag === 'FZI-7607A')?.value ?? 0;
  const hev763 = valves.find((v) => v.tag === '20-HEV-763A')?.state ?? 'OPEN';
  const lah762 = instruments.find((i) => i.tag === 'LAH-762A')?.value ?? 15;
  const tzi797Inst = instruments.find((i) => i.tag === 'TZI-797A');
  const tzi797 = tzi797Inst?.value ?? 140;
  const tzi797Oos = tzi797Inst?.oosActive ?? false;
  const azi761 = instruments.find((i) => i.tag === 'AZI-761A')?.value ?? 0.4;
  const m761 = equipment.find((e) => e.tag === 'M-761A');
  const lowThreshold = tzi797Profile === 'SHUTDOWN_SOP_AND_DCS' ? 135 : 95;

  return [
    { tag: 'FZALL-7607A', label: 'FZALL7607A NORMAL', satisfied: fzi >= 18 },
    { tag: '20-HZLO-763A', label: 'HV763A NOT CONTACT', satisfied: hev763 === 'OPEN' },
    { tag: '20-LAH-762A', label: 'LAH762A NOT HIGH', satisfied: lah762 < 80 },
    { tag: 'TZAL-797A', label: `TZAL797A NOT LOW (> ${lowThreshold}°C / OOS)`, satisfied: tzi797 > lowThreshold || tzi797Oos },
    { tag: 'AZI-761A', label: 'AZI761A NOT HIGH (< 3.5%)', satisfied: azi761 < 3.5 },
    { tag: 'HCM-761A', label: 'HCM761A MIN 2 RPM', satisfied: (m761?.speedRpm ?? 2) >= 2 || m761?.state === 'STOPPED' },
  ];
}
