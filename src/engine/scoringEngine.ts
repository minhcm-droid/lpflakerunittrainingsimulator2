import { SimulationCommandResult } from '@/types/simulation';

export interface AssessmentReport {
  totalScore: number;
  sequenceScore: number;
  safetyPermissiveScore: number;
  alarmResponseScore: number;
  grade: 'PASS' | 'CONDITIONAL' | 'FAIL';
  durationSeconds: number;
  completedSteps: number;
  totalSteps: number;
  violations: {
    roleViolations: string[];
    permissiveViolations: string[];
    unacknowledgedAlarms: string[];
  };
  recommendations: string[];
}

export function calculateTrainingScore(params: {
  completedStepIds: string[];
  totalRequiredSteps: number;
  eventLogs: SimulationCommandResult[];
  unacknowledgedAlarmTags: string[];
  esdTriggeredByMistake: boolean;
  durationSeconds: number;
}): AssessmentReport {
  const {
    completedStepIds,
    totalRequiredSteps,
    eventLogs,
    unacknowledgedAlarmTags,
    esdTriggeredByMistake,
    durationSeconds,
  } = params;

  const ratio = totalRequiredSteps > 0 ? Math.min(1, completedStepIds.length / totalRequiredSteps) : 1;
  const sequenceScore = Math.round(ratio * 60);

  const roleViolations = eventLogs
    .filter((e) => !e.success && e.missingConditions.includes('FIELD_OPERATOR_REQUIRED'))
    .map((e) => `${e.targetTag}: ${e.message.vi}`);

  const permissiveViolations = eventLogs
    .filter(
      (e) =>
        !e.success &&
        !e.missingConditions.includes('FIELD_OPERATOR_REQUIRED') &&
        e.missingConditions.length > 0
    )
    .map((e) => `${e.targetTag}: ${e.message.vi}`);

  let safetyDeduction = roleViolations.length * 5 + permissiveViolations.length * 5;
  if (esdTriggeredByMistake) safetyDeduction += 10;
  const safetyPermissiveScore = Math.max(0, 20 - safetyDeduction);

  const alarmDeduction = unacknowledgedAlarmTags.length * 5;
  const alarmResponseScore = Math.max(0, 20 - alarmDeduction);

  const totalScore = sequenceScore + safetyPermissiveScore + alarmResponseScore;
  const grade: 'PASS' | 'CONDITIONAL' | 'FAIL' =
    totalScore >= 80 ? 'PASS' : totalScore >= 65 ? 'CONDITIONAL' : 'FAIL';

  const recommendations: string[] = [];
  if (roleViolations.length > 0) {
    recommendations.push(
      'Ôn tập ranh giới nhiệm vụ Field Operator vs Boardman (DCS): Các van tay (Manual/Drain/Vent) chỉ được thao tác tại hiện trường.'
    );
  }
  if (permissiveViolations.length > 0) {
    recommendations.push(
      'Kiểm tra kỹ bảng Permissive trên DCS (6 điều kiện Flaker System & 3 điều kiện Packing) trước khi nhấn nút khởi động.'
    );
  }
  if (esdTriggeredByMistake) {
    recommendations.push(
      'Rà soát quy trình xả cạn Melting Pan trong SOP Shutdown (HD-W-7800-06-001): Bắt buộc đặt TZA-797A/B LL sang OOS trước khi xả đáy chảo.'
    );
  }
  if (unacknowledgedAlarmTags.length > 0) {
    recommendations.push(
      `Cần phản ứng nhanh hơn với các cảnh báo đang kích hoạt: ${unacknowledgedAlarmTags.join(', ')}.`
    );
  }
  if (recommendations.length === 0) {
    recommendations.push('Xuất sắc: Tuân thủ đầy đủ trình tự SOP, phân quyền thao tác và giới hạn vận hành an toàn.');
  }

  return {
    totalScore,
    sequenceScore,
    safetyPermissiveScore,
    alarmResponseScore,
    grade,
    durationSeconds,
    completedSteps: completedStepIds.length,
    totalSteps: totalRequiredSteps,
    violations: {
      roleViolations,
      permissiveViolations,
      unacknowledgedAlarms: unacknowledgedAlarmTags,
    },
    recommendations,
  };
}
