'use client';

import React from 'react';
import { FAULT_SCENARIOS, FaultScenarioId } from '@/engine/faultInjectionEngine';
import { useSimulationStore } from '@/store/simulationStore';

export default function EmergencyDeviationPage() {
  const { activeFault, injectFault } = useSimulationStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-red-400">
          Thư viện Kịch bản Bất thường & Sự cố (Deviation Analysis)
        </h1>
        <button
          onClick={() => injectFault('NONE')}
          className="rounded bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200"
        >
          Xóa sự cố hiện tại ({activeFault})
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.values(FAULT_SCENARIOS).map((f) => (
          <div key={f.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold text-amber-400">{f.title.vi}</h2>
              <button
                onClick={() => injectFault(f.id as FaultScenarioId)}
                className="rounded bg-red-600 px-2.5 py-1 font-bold text-white hover:bg-red-500"
              >
                Tiêm sự cố
              </button>
            </div>
            <p className="mt-2 text-slate-300">{f.triggerDescription.vi}</p>
            <ul className="mt-2 list-disc pl-4 text-emerald-300">
              {f.expectedOperatorActions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
