'use client';

import { create } from 'zustand';
import equipmentData from '@/data/equipment.json';
import valvesData from '@/data/valves.json';
import instrumentsData from '@/data/instruments.json';
import alarmsData from '@/data/alarms.json';
import interlocksData from '@/data/interlocks.json';
import proceduresData from '@/data/procedures.json';
import {
  AlarmItem,
  EquipmentItem,
  InstrumentItem,
  InterlockItem,
  OperatorRole,
  ProcedureStep,
  SimulationCommandResult,
  SimulationMode,
  ValveItem,
} from '@/types/simulation';
import { evaluateValveCommand } from '@/engine/valveStateMachine';
import { evaluateFlakerPermissivesA, evaluatePackingPermissivesA } from '@/engine/sequenceEngine';
import { FaultScenarioId } from '@/engine/faultInjectionEngine';
import { stepProcessPhysics } from '@/engine/processPhysicsEngine';
import { TrendPoint } from '@/components/trends/ProcessTrendDisplay';

interface SimulationStore {
  role: OperatorRole;
  mode: SimulationMode;
  activeProcedureType: 'STARTUP' | 'SHUTDOWN' | 'EMERGENCY';
  tzi797Profile: 'SHUTDOWN_SOP_AND_DCS' | 'STARTUP_SOP_TABLE';
  equipment: EquipmentItem[];
  valves: ValveItem[];
  instruments: InstrumentItem[];
  alarms: AlarmItem[];
  interlocks: InterlockItem[];
  procedures: ProcedureStep[];
  completedStepIds: string[];
  acknowledgedAlarmTags: string[];
  dcsFlakerPermissiveGranted: boolean;
  esd761Tripped: boolean;
  esdTriggeredByMistake: boolean;
  activeFault: FaultScenarioId;
  eventLogs: SimulationCommandResult[];
  trendHistory: TrendPoint[];
  elapsedSeconds: number;

  setRole: (role: OperatorRole) => void;
  setMode: (mode: SimulationMode) => void;
  setActiveProcedureType: (type: 'STARTUP' | 'SHUTDOWN' | 'EMERGENCY') => void;
  setTzi797Profile: (profile: 'SHUTDOWN_SOP_AND_DCS' | 'STARTUP_SOP_TABLE') => void;
  toggleValve: (tag: string, targetState: 'OPEN' | 'CLOSED') => void;
  startPumpP717A: () => void;
  stopPumpP717A: () => void;
  pressHs765APackingStart: () => void;
  pressHs766APackingStop: () => void;
  pressDcsFlakerPermissive: () => void;
  startFlakerSystemA: () => void;
  pressDcsAutoStopA: () => void;
  setDrumSpeedA: (rpm: number) => void;
  toggleTzi797Oos: () => void;
  setPic705Control: (mode: 'AUTO' | 'MAN', mvPercent: number) => void;
  acknowledgeAlarm: (tag: string) => void;
  injectFault: (faultId: FaultScenarioId) => void;
  completeStep: (stepId: string) => void;
  tickSimulation: () => void;
  resetSimulation: () => void;
}

function nowTime(): string {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  role: 'FIELD',
  mode: 'GUIDED',
  activeProcedureType: 'STARTUP',
  tzi797Profile: 'SHUTDOWN_SOP_AND_DCS',
  equipment: equipmentData as unknown as EquipmentItem[],
  valves: valvesData as unknown as ValveItem[],
  instruments: instrumentsData as unknown as InstrumentItem[],
  alarms: alarmsData as unknown as AlarmItem[],
  interlocks: interlocksData as unknown as InterlockItem[],
  procedures: proceduresData as unknown as ProcedureStep[],
  completedStepIds: [],
  acknowledgedAlarmTags: [],
  dcsFlakerPermissiveGranted: false,
  esd761Tripped: false,
  esdTriggeredByMistake: false,
  activeFault: 'NONE',
  eventLogs: [],
  trendHistory: [
    { time: '00:00:00', TZI_797A: 142, TZI_795A: 30.2, AZI_761A: 0.4, FZI_7607A: 21.0 },
  ],
  elapsedSeconds: 0,

  setRole: (role) => set({ role }),
  setMode: (mode) => set({ mode }),
  setActiveProcedureType: (activeProcedureType) => set({ activeProcedureType }),
  setTzi797Profile: (tzi797Profile) => set({ tzi797Profile }),

  toggleValve: (tag, targetState) => {
    const { valves, role, eventLogs } = get();
    const target = valves.find((v) => v.tag === tag);
    if (!target) return;

    const { updatedValve, result } = evaluateValveCommand({
      valve: target,
      targetState,
      role,
      timestamp: nowTime(),
    });

    set({
      valves: valves.map((v) => (v.tag === tag ? updatedValve : v)),
      eventLogs: [result, ...eventLogs].slice(0, 80),
    });
  },

  startPumpP717A: () => {
    const { role, valves, equipment, eventLogs } = get();
    const v1Open = valves.find((v) => v.tag === 'V1 (Start-Up)')?.state === 'OPEN';
    const v4Open = valves.find((v) => v.tag === 'V4 (Start-Up)')?.state === 'OPEN';

    if (!v1Open || !v4Open) {
      set({
        eventLogs: [
          {
            timestamp: nowTime(),
            role,
            action: 'START_PUMP',
            targetTag: 'P-717A',
            success: false,
            message: {
              vi: 'Bị chặn: Phải mở van hút V1 và van đẩy V4 trước khi chạy bơm P-717A.',
              en: 'Blocked: Suction V1 and discharge V4 must be open before starting P-717A.',
            },
            missingConditions: ['V1_OPEN', 'V4_OPEN'],
          },
          ...eventLogs,
        ],
      });
      return;
    }

    set({
      equipment: equipment.map((e) =>
        e.tag === 'P-717A' ? { ...e, state: 'RUNNING', loadPercent: 20 } : e
      ),
      eventLogs: [
        {
          timestamp: nowTime(),
          role,
          action: 'START_PUMP',
          targetTag: 'P-717A',
          success: true,
          message: {
            vi: 'Khởi động bơm P-717A thành công (tuần hoàn LP).',
            en: 'Pump P-717A started successfully.',
          },
          missingConditions: [],
        },
        ...eventLogs,
      ],
    });
  },

  stopPumpP717A: () => {
    const { role, equipment, eventLogs } = get();
    set({
      equipment: equipment.map((e) =>
        e.tag === 'P-717A' ? { ...e, state: 'STOPPED', loadPercent: 0 } : e
      ),
      eventLogs: [
        {
          timestamp: nowTime(),
          role,
          action: 'STOP_PUMP',
          targetTag: 'P-717A',
          success: true,
          message: { vi: 'Đã dừng bơm P-717A.', en: 'Pump P-717A stopped.' },
          missingConditions: [],
        },
        ...eventLogs,
      ],
    });
  },

  pressHs765APackingStart: () => {
    const { role, instruments, valves, equipment, eventLogs } = get();
    if (role !== 'FIELD') {
      set({
        eventLogs: [
          {
            timestamp: nowTime(),
            role,
            action: 'HS-765A',
            targetTag: 'PK-761A',
            success: false,
            message: {
              vi: 'Bị chặn: Nút nhấn tại chỗ HS-765A chỉ thao tác được bởi Field Operator.',
              en: 'Blocked: Local pushbutton HS-765A requires Field Operator.',
            },
            missingConditions: ['FIELD_OPERATOR_REQUIRED'],
          },
          ...eventLogs,
        ],
      });
      return;
    }

    const checks = evaluatePackingPermissivesA(instruments, valves);
    const missing = checks.filter((c) => !c.satisfied).map((c) => c.label);
    if (missing.length > 0) {
      set({
        eventLogs: [
          {
            timestamp: nowTime(),
            role,
            action: 'HS-765A',
            targetTag: 'PK-761A',
            success: false,
            message: {
              vi: `Thiếu điều kiện Permissive cụm đóng gói: ${missing.join(', ')}`,
              en: `Missing Packing Permissives: ${missing.join(', ')}`,
            },
            missingConditions: missing,
          },
          ...eventLogs,
        ],
      });
      return;
    }

    set({
      equipment: equipment.map((e) =>
        e.tag === 'RF-763A' || e.tag === 'FD-762A' ? { ...e, state: 'RUNNING' } : e
      ),
      valves: valves.map((v) =>
        v.tag === '20-HEV-761A' ? { ...v, state: 'OPEN', openingPercent: 100 } : v
      ),
      eventLogs: [
        {
          timestamp: nowTime(),
          role,
          action: 'HS-765A',
          targetTag: 'PK-761A',
          success: true,
          message: {
            vi: 'SEQUENCE COMPLETED: RF-763A START -> 20-HEV-761A OPEN -> FD-762A START.',
            en: 'SEQUENCE COMPLETED: RF-763A START -> 20-HEV-761A OPEN -> FD-762A START.',
          },
          missingConditions: [],
        },
        ...eventLogs,
      ],
    });
  },

  pressHs766APackingStop: () => {
    const { role, equipment, valves, eventLogs } = get();
    if (role !== 'FIELD') {
      set({
        eventLogs: [
          {
            timestamp: nowTime(),
            role,
            action: 'HS-766A',
            targetTag: 'PK-761A',
            success: false,
            message: {
              vi: 'Bị chặn: Nút dừng tại chỗ HS-766A chỉ thao tác bởi Field Operator.',
              en: 'Blocked: Local stop button HS-766A requires Field Operator.',
            },
            missingConditions: ['FIELD_OPERATOR_REQUIRED'],
          },
          ...eventLogs,
        ],
      });
      return;
    }

    set({
      equipment: equipment.map((e) =>
        e.tag === 'RF-763A' || e.tag === 'FD-762A' ? { ...e, state: 'STOPPED' } : e
      ),
      valves: valves.map((v) =>
        v.tag === '20-HEV-761A' ? { ...v, state: 'CLOSED', openingPercent: 0 } : v
      ),
      eventLogs: [
        {
          timestamp: nowTime(),
          role,
          action: 'HS-766A',
          targetTag: 'PK-761A',
          success: true,
          message: {
            vi: 'Đã dừng cụm đóng gói: FD-762A STOP -> 20-HEV-761A CLOSED -> RF-763A STOP.',
            en: 'Packing unit stopped: FD-762A STOP -> 20-HEV-761A CLOSED -> RF-763A STOP.',
          },
          missingConditions: [],
        },
        ...eventLogs,
      ],
    });
  },

  pressDcsFlakerPermissive: () => {
    const { role, instruments, valves, equipment, tzi797Profile, eventLogs } = get();
    if (role !== 'DCS') {
      set({
        eventLogs: [
          {
            timestamp: nowTime(),
            role,
            action: 'DCS_PERMISSIVE',
            targetTag: 'M-761A',
            success: false,
            message: {
              vi: 'Bị chặn: Nút PERMISSIVE chỉ nhấn được từ màn hình DCS.',
              en: 'Blocked: PERMISSIVE button requires DCS Operator.',
            },
            missingConditions: ['DCS_OPERATOR_REQUIRED'],
          },
          ...eventLogs,
        ],
      });
      return;
    }

    const checks = evaluateFlakerPermissivesA({ instruments, valves, equipment, tzi797Profile });
    const missing = checks.filter((c) => !c.satisfied).map((c) => c.label);
    if (missing.length > 0) {
      set({
        eventLogs: [
          {
            timestamp: nowTime(),
            role,
            action: 'DCS_PERMISSIVE',
            targetTag: 'M-761A',
            success: false,
            message: {
              vi: `Chưa đủ 6 điều kiện Flaker Permissive: ${missing.join(', ')}`,
              en: `Missing Flaker Permissives: ${missing.join(', ')}`,
            },
            missingConditions: missing,
          },
          ...eventLogs,
        ],
      });
      return;
    }

    set({
      dcsFlakerPermissiveGranted: true,
      eventLogs: [
        {
          timestamp: nowTime(),
          role,
          action: 'DCS_PERMISSIVE',
          targetTag: 'M-761A',
          success: true,
          message: {
            vi: 'Boardman đã xác nhận PERMISSIVE trên DCS. Field Operator có thể nhấn Start ZZ-761A.',
            en: 'DCS PERMISSIVE granted. Field Operator may now start ZZ-761A.',
          },
          missingConditions: [],
        },
        ...eventLogs,
      ],
    });
  },

  startFlakerSystemA: () => {
    const { role, dcsFlakerPermissiveGranted, equipment, valves, eventLogs } = get();
    if (role !== 'FIELD') {
      set({
        eventLogs: [
          {
            timestamp: nowTime(),
            role,
            action: 'START_FLAKER_A',
            targetTag: 'ZZ-761A / M-761A',
            success: false,
            message: {
              vi: 'Bị chặn: Lệnh khởi động tại chỗ ZZ-761A thuộc quyền Field Operator.',
              en: 'Blocked: Local start of ZZ-761A requires Field Operator.',
            },
            missingConditions: ['FIELD_OPERATOR_REQUIRED'],
          },
          ...eventLogs,
        ],
      });
      return;
    }

    if (!dcsFlakerPermissiveGranted) {
      set({
        eventLogs: [
          {
            timestamp: nowTime(),
            role,
            action: 'START_FLAKER_A',
            targetTag: 'ZZ-761A / M-761A',
            success: false,
            message: {
              vi: 'Bị chặn: Boardman chưa nhấn nút PERMISSIVE trên DCS.',
              en: 'Blocked: DCS PERMISSIVE has not been granted yet.',
            },
            missingConditions: ['DCS_PERMISSIVE_NOT_GRANTED'],
          },
          ...eventLogs,
        ],
      });
      return;
    }

    const v17Open = valves.find((v) => v.tag === 'V17 (Start-Up)')?.state === 'OPEN';

    set({
      equipment: equipment.map((e) => {
        if (e.tag === 'ZZ-761A') return { ...e, state: 'RUNNING' };
        if (e.tag === 'M-761A') return { ...e, state: 'RUNNING', speedRpm: 2 };
        return e;
      }),
      valves: valves.map((v) =>
        v.tag === '20-HEV-763A' && v17Open ? { ...v, state: 'CLOSED', openingPercent: 0 } : v
      ),
      eventLogs: [
        {
          timestamp: nowTime(),
          role,
          action: 'START_FLAKER_A',
          targetTag: 'M-761A',
          success: true,
          message: {
            vi: 'Khởi động thành công ZZ-761A & Drum Flaker M-761A (2 RPM).',
            en: 'Started ZZ-761A & Drum Flaker M-761A (2 RPM).',
          },
          missingConditions: [],
        },
        ...eventLogs,
      ],
    });
  },

  pressDcsAutoStopA: () => {
    const { role, equipment, valves, eventLogs } = get();
    if (role !== 'DCS') {
      set({
        eventLogs: [
          {
            timestamp: nowTime(),
            role,
            action: 'AUTO_STOP',
            targetTag: 'M-761A',
            success: false,
            message: {
              vi: 'Bị chặn: Nút AUTO STOP thao tác trên DCS.',
              en: 'Blocked: AUTO STOP requires DCS Operator.',
            },
            missingConditions: ['DCS_OPERATOR_REQUIRED'],
          },
          ...eventLogs,
        ],
      });
      return;
    }

    set({
      dcsFlakerPermissiveGranted: false,
      equipment: equipment.map((e) => {
        if (e.tag === 'M-761A') return { ...e, state: 'STOPPED', speedRpm: 0 };
        if (e.tag === 'ZZ-761A') return { ...e, state: 'STOPPED' };
        return e;
      }),
      valves: valves.map((v) =>
        v.tag === '20-HEV-763A' ? { ...v, state: 'OPEN', openingPercent: 100 } : v
      ),
      eventLogs: [
        {
          timestamp: nowTime(),
          role,
          action: 'AUTO_STOP',
          targetTag: 'M-761A',
          success: true,
          message: {
            vi: 'AUTO STOP hoàn tất: Nhả dao gạt 20-HEV-763A (NOT CONTACT) và dừng trống M-761A.',
            en: 'AUTO STOP complete: Scraper 20-HEV-763A disengaged & Drum M-761A stopped.',
          },
          missingConditions: [],
        },
        ...eventLogs,
      ],
    });
  },

  setDrumSpeedA: (rpm) => {
    const clamped = Math.max(0, Math.min(5, rpm));
    set({
      equipment: get().equipment.map((e) =>
        e.tag === 'M-761A' ? { ...e, speedRpm: clamped } : e
      ),
    });
  },

  toggleTzi797Oos: () => {
    const { role, instruments, eventLogs } = get();
    if (role !== 'DCS') return;
    const updated = instruments.map((i) =>
      i.tag === 'TZI-797A' ? { ...i, oosActive: !i.oosActive } : i
    );
    const isNowOos = updated.find((i) => i.tag === 'TZI-797A')?.oosActive ?? false;
    set({
      instruments: updated,
      eventLogs: [
        {
          timestamp: nowTime(),
          role,
          action: 'TOGGLE_OOS',
          targetTag: 'TZA-797A LL',
          success: true,
          message: {
            vi: `Liên động TZA-797A LL đã chuyển sang ${isNowOos ? 'OOS (Out of Service)' : 'ACTIVE'}.`,
            en: `Interlock TZA-797A LL set to ${isNowOos ? 'OOS' : 'ACTIVE'}.`,
          },
          missingConditions: [],
        },
        ...eventLogs,
      ],
    });
  },

  setPic705Control: (mode, mvPercent) => {
    const { role, instruments } = get();
    if (role !== 'DCS') return;
    set({
      instruments: instruments.map((i) =>
        i.tag === 'PIC-705' ? { ...i, mode, mvPercent } : i
      ),
      activeFault:
        get().activeFault === 'FAULT-PIC705-HIGH' || get().activeFault === 'FAULT-PIC705-LOW'
          ? 'NONE'
          : get().activeFault,
    });
  },

  acknowledgeAlarm: (tag) => {
    const { acknowledgedAlarmTags } = get();
    if (!acknowledgedAlarmTags.includes(tag)) {
      set({ acknowledgedAlarmTags: [...acknowledgedAlarmTags, tag] });
    }
  },

  injectFault: (faultId) => {
    const { eventLogs, role } = get();
    set({
      activeFault: faultId,
      eventLogs: [
        {
          timestamp: nowTime(),
          role,
          action: 'INJECT_FAULT',
          targetTag: faultId,
          success: true,
          message: {
            vi: `Kích hoạt tình huống mô phỏng bất thường: ${faultId}`,
            en: `Injected abnormal scenario: ${faultId}`,
          },
          missingConditions: [],
        },
        ...eventLogs,
      ],
    });
  },

  completeStep: (stepId) => {
    const { completedStepIds } = get();
    if (!completedStepIds.includes(stepId)) {
      set({ completedStepIds: [...completedStepIds, stepId] });
    }
  },

  tickSimulation: () => {
    const state = get();
    const nextInstruments = stepProcessPhysics({
      instruments: state.instruments,
      valves: state.valves,
      equipment: state.equipment,
      activeFault: state.activeFault,
    });

    const tzi797 = nextInstruments.find((i) => i.tag === 'TZI-797A');
    const azi761 = nextInstruments.find((i) => i.tag === 'AZI-761A')?.value ?? 0.4;
    const fzi7607 = nextInstruments.find((i) => i.tag === 'FZI-7607A')?.value ?? 21;
    const tzi795 = nextInstruments.find((i) => i.tag === 'TZI-795A')?.value ?? 30;
    const pic705 = nextInstruments.find((i) => i.tag === 'PIC-705')?.value ?? 0.02;
    const m761Running = state.equipment.find((e) => e.tag === 'M-761A')?.state === 'RUNNING';
    const lowTrip = state.tzi797Profile === 'SHUTDOWN_SOP_AND_DCS' ? 125 : 90;

    let esdTripped = state.esd761Tripped;
    let esdMistake = state.esdTriggeredByMistake;

    if (
      m761Running &&
      tzi797 &&
      tzi797.value <= lowTrip &&
      !tzi797.oosActive
    ) {
      esdTripped = true;
      esdMistake = true;
    }

    if (azi761 >= 5.0 || fzi7607 <= 8.0 || tzi795 >= 52.0 || pic705 >= 0.05) {
      esdTripped = true;
    }

    const updatedEquipment = esdTripped
      ? state.equipment.map((e) =>
          ['M-761A', 'ZZ-761A', 'FD-762A', 'RF-763A', 'C-770'].includes(e.tag)
            ? { ...e, state: 'TRIPPED' as const, speedRpm: 0 }
            : e
        )
      : state.equipment;

    const updatedValves = esdTripped
      ? state.valves.map((v) => {
          if (v.tag === '20-HEV-761A' || v.tag === 'SDV-711') {
            return { ...v, state: 'CLOSED' as const, openingPercent: 0 };
          }
          if (v.tag === '20-HEV-763A' || v.tag === 'SDV-712') {
            return { ...v, state: 'OPEN' as const, openingPercent: 100 };
          }
          return v;
        })
      : state.valves;

    const nextElapsed = state.elapsedSeconds + 2;
    const newPoint: TrendPoint = {
      time: nowTime(),
      TZI_797A: tzi797?.value ?? 140,
      TZI_795A: tzi795,
      AZI_761A: azi761,
      FZI_7607A: fzi7607,
    };

    set({
      instruments: nextInstruments,
      equipment: updatedEquipment,
      valves: updatedValves,
      esd761Tripped: esdTripped,
      esdTriggeredByMistake: esdMistake,
      elapsedSeconds: nextElapsed,
      trendHistory: [...state.trendHistory, newPoint].slice(-30),
    });
  },

  resetSimulation: () =>
    set({
      equipment: equipmentData as unknown as EquipmentItem[],
      valves: valvesData as unknown as ValveItem[],
      instruments: instrumentsData as unknown as InstrumentItem[],
      completedStepIds: [],
      acknowledgedAlarmTags: [],
      dcsFlakerPermissiveGranted: false,
      esd761Tripped: false,
      esdTriggeredByMistake: false,
      activeFault: 'NONE',
      eventLogs: [],
      elapsedSeconds: 0,
    }),
}));
