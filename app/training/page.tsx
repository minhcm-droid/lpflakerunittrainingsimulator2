'use client';

import React from 'react';
import Link from 'next/link';
import { useSimulationStore } from '@/store/simulationStore';

export default function TrainingCenterPage() {
  const { mode, setMode, completedStepIds, procedures } = useSimulationStore();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-emerald-400">Trung tâm Huấn luyện Thực hành (Guided & Practice)</h1>
      <div className="flex gap-3">
        <button
          onClick={() => setMode('GUIDED')}
          className={`rounded px-4 py-2 text-xs font-bold ${mode === 'GUIDED' ? 'bg-emerald-600 text-white' : 'bg-slate-800'}`}
        >
          Chế độ Guided (Có hướng dẫn)
        </button>
        <button
          onClick={() => setMode('PRACTICE')}
          className={`rounded px-4 py-2 text-xs font-bold ${mode === 'PRACTICE' ? 'bg-sky-600 text-white' : 'bg-slate-800'}`}
        >
          Chế độ Practice (Tự thực hành)
        </button>
        <Link href="/simulation" className="rounded bg-amber-600 px-4 py-2 text-xs font-bold text-slate-950">
          Mở Không gian Thực hành
        </Link>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs">
        Tiến độ hoàn thành quy trình: <strong>{completedStepIds.length}</strong> / {procedures.length} bước.
      </div>
    </div>
  );
}
