'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { calculateTrainingScore } from '@/engine/scoringEngine';

export default function ResultsPage() {
  const store = useSimulationStore();
  const report = calculateTrainingScore({
    completedStepIds: store.completedStepIds,
    totalRequiredSteps: store.procedures.length,
    eventLogs: store.eventLogs,
    unacknowledgedAlarmTags: store.activeFault !== 'NONE' ? [store.activeFault] : [],
    esdTriggeredByMistake: store.esdTriggeredByMistake,
    durationSeconds: store.elapsedSeconds,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-sky-400">Báo cáo Kết quả Đánh giá Đào tạo (Thang 100 Điểm)</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">Tổng điểm</div>
          <div className="text-3xl font-extrabold text-emerald-400">{report.totalScore} / 100</div>
          <div className="mt-1 text-xs font-bold text-amber-400">Xếp loại: {report.grade}</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">Trình tự SOP (60đ)</div>
          <div className="text-2xl font-bold">{report.sequenceScore} / 60</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">An toàn & Permissive (20đ)</div>
          <div className="text-2xl font-bold">{report.safetyPermissiveScore} / 20</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">Xử lý Alarm (20đ)</div>
          <div className="text-2xl font-bold">{report.alarmResponseScore} / 20</div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs">
        <h2 className="font-bold text-sky-400">Khuyến nghị Ôn tập</h2>
        <ul className="mt-2 list-disc pl-4 text-slate-300">
          {report.recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
