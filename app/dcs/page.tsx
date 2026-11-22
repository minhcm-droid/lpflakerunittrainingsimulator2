'use client';

import React, { useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { ProcessTrendDisplay } from '@/components/trends/ProcessTrendDisplay';

export default function DcsOperatorPage() {
  const setRole = useSimulationStore((s) => s.setRole);
  const pressDcsFlakerPermissive = useSimulationStore((s) => s.pressDcsFlakerPermissive);
  const pressDcsAutoStopA = useSimulationStore((s) => s.pressDcsAutoStopA);
  const toggleTzi797Oos = useSimulationStore((s) => s.toggleTzi797Oos);
  const trendHistory = useSimulationStore((s) => s.trendHistory);

  useEffect(() => {
    setRole('DCS');
  }, [setRole]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-sky-400">Chế độ DCS Operator (Boardman Console)</h1>
      <div className="flex flex-wrap gap-3">
        <button onClick={pressDcsFlakerPermissive} className="rounded bg-sky-600 px-4 py-2 text-xs font-bold text-white">
          Nhấn PERMISSIVE (Flaker A)
        </button>
        <button onClick={pressDcsAutoStopA} className="rounded bg-amber-600 px-4 py-2 text-xs font-bold text-slate-950">
          Nhấn AUTO STOP (Flaker A)
        </button>
        <button onClick={toggleTzi797Oos} className="rounded bg-purple-600 px-4 py-2 text-xs font-bold text-white">
          Chuyển đổi OOS cho TZA-797A LL
        </button>
      </div>
      <ProcessTrendDisplay history={trendHistory} />
    </div>
  );
}
