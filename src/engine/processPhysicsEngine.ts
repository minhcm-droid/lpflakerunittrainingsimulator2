import { EquipmentItem, InstrumentItem, ValveItem } from '@/types/simulation';
import { FaultScenarioId } from './faultInjectionEngine';

export function stepProcessPhysics(params: {
  instruments: InstrumentItem[];
  valves: ValveItem[];
  equipment: EquipmentItem[];
  activeFault: FaultScenarioId;
}): InstrumentItem[] {
  const { instruments, valves, equipment, activeFault } = params;

  const v14Open = valves.find((v) => v.tag === 'V14 (Start-Up)')?.state === 'OPEN';
  const v16aOpen = valves.find((v) => v.tag === 'V16a (Start-Up)')?.state === 'OPEN';
  const v15bOpen = valves.find((v) => v.tag === 'V15b (Start-Up)')?.state === 'OPEN';
  const v17Open = valves.find((v) => v.tag === 'V17 (Start-Up)')?.state === 'OPEN';
  const v3DrainOpen = valves.find((v) => v.tag === 'V3 (Shutdown)')?.state === 'OPEN';
  const p717Running = equipment.find((e) => e.tag === 'P-717A')?.state === 'RUNNING';
  const m761Running = equipment.find((e) => e.tag === 'M-761A')?.state === 'RUNNING';
  const fd762Running = equipment.find((e) => e.tag === 'FD-762A')?.state === 'RUNNING';

  return instruments.map((inst) => {
    let val = inst.value;

    if (inst.tag === 'FZI-7607A') {
      if (activeFault === 'FAULT-LN-LOSS-O2-HIGH') {
        val = Math.max(6.5, val - 1.5);
      } else {
        const target = v14Open ? 21.0 : 0.0;
        val = val + (target - val) * 0.25;
      }
    }

    if (inst.tag === 'AZI-761A') {
      if (activeFault === 'FAULT-LN-LOSS-O2-HIGH') {
        val = Math.min(5.2, val + 0.45);
      } else {
        const target = v14Open ? 0.2 : 20.9;
        val = val + (target - val) * 0.15;
      }
    }

    if (inst.tag === 'PI-766A') {
      if (activeFault === 'FAULT-PI766-HIGH') {
        val = Math.min(440, val + 25);
      } else {
        const target = v14Open ? 210 : 0;
        val = val + (target - val) * 0.2;
      }
    }

    if (inst.tag === 'TZI-797A') {
      let target = v15bOpen ? 145 : 35;
      if (v3DrainOpen) target = 85;
      val = val + (target - val) * 0.12;
    }

    if (inst.tag === 'TZI-795A') {
      const feeding = p717Running && v17Open && m761Running;
      const target = feeding ? (v16aOpen ? 30.5 : 49.0) : 28.0;
      val = val + (target - val) * 0.15;
    }

    if (inst.tag === 'LAH-762A') {
      if (activeFault === 'FAULT-LSHH762-HOPPER') {
        val = Math.min(96, val + 6);
      } else if (m761Running && p717Running && v17Open && !fd762Running) {
        val = Math.min(96, val + 4);
      } else if (fd762Running) {
        val = Math.max(12, val - 3);
      }
    }

    if (inst.tag === 'PIC-705') {
      if (activeFault === 'FAULT-PIC705-HIGH') {
        val = Math.min(0.052, val + 0.004);
      } else if (activeFault === 'FAULT-PIC705-LOW') {
        val = Math.max(0.006, val - 0.003);
      } else if (inst.mode === 'MAN') {
        const mv = inst.mvPercent ?? 45;
        const target = Number(((mv / 45) * 0.02).toFixed(4));
        val = val + (target - val) * 0.3;
      } else {
        val = val + (0.02 - val) * 0.25;
      }
    }

    return {
      ...inst,
      value: Number(val.toFixed(3)),
    };
  });
}
