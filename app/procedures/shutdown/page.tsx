'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';

export default function ShutdownProcedurePage() {
  const { procedures, completedStepIds, completeStep } = useSimulationStore();
  const steps = procedures.filter((p) => p.procedureType === 'SHUTDOWN');

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-amber-400">
        Quy trình Dừng máy Chuẩn — HD-W-7800-06-001 (Shutdown LP Flaker Unit)
      </h1>
      <div className="space-y-3">
        {steps.map((s) => {
          const done = completedStepIds.includes(s.stepId);
          return (
            <div key={s.stepId} className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">
                  Bước {s.sequence} [{s.operatorRole}]: {s.title.vi}
                </span>
                <button
                  onClick={() => completeStep(s.stepId)}
                  className={`rounded px-3 py-1 font-bold ${done ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                >
                  {done ? 'Đã hoàn thành' : 'Xác nhận bước'}
                </button>
              </div>
              <p className="mt-2 text-slate-300">{s.instruction.vi}</p>
              <div className="mt-2 text-amber-300">Lưu ý an toàn: {s.hazards.join(' | ')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
