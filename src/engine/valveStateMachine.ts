import { OperatorRole, SimulationCommandResult, ValveItem, ValveState } from '@/types/simulation';

export function evaluateValveCommand(params: {
  valve: ValveItem;
  targetState: 'OPEN' | 'CLOSED';
  role: OperatorRole;
  timestamp: string;
}): { updatedValve: ValveItem; result: SimulationCommandResult } {
  const { valve, targetState, role, timestamp } = params;

  if (role === 'DCS' && !valve.operableFromDCS) {
    return {
      updatedValve: valve,
      result: {
        timestamp,
        role,
        action: `SET_VALVE_${targetState}`,
        targetTag: valve.tag,
        success: false,
        message: {
          vi: `Bị chặn: Van tay ${valve.tag} chỉ thao tác tại hiện trường (Field Operator).`,
          en: `Blocked: Manual valve ${valve.tag} can only be operated by Field Operator.`,
        },
        missingConditions: ['FIELD_OPERATOR_REQUIRED'],
      },
    };
  }

  if (role === 'FIELD' && !valve.operableFromField) {
    return {
      updatedValve: valve,
      result: {
        timestamp,
        role,
        action: `SET_VALVE_${targetState}`,
        targetTag: valve.tag,
        success: false,
        message: {
          vi: `Bị chặn: Van điều khiển ${valve.tag} thao tác từ phòng điều khiển DCS.`,
          en: `Blocked: Automated valve ${valve.tag} must be operated from DCS.`,
        },
        missingConditions: ['DCS_OPERATOR_REQUIRED'],
      },
    };
  }

  const nextState: ValveState = targetState;
  const nextOpening = targetState === 'OPEN' ? 100 : 0;

  return {
    updatedValve: {
      ...valve,
      state: nextState,
      openingPercent: nextOpening,
    },
    result: {
      timestamp,
      role,
      action: `SET_VALVE_${targetState}`,
      targetTag: valve.tag,
      success: true,
      message: {
        vi: `Thành công: ${valve.tag} chuyển sang trạng thái ${targetState}.`,
        en: `Success: ${valve.tag} set to ${targetState}.`,
      },
      missingConditions: [],
    },
  };
}
