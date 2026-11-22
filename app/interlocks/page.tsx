'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';

export default function InterlocksPage() {
  const { interlocks } = useSimulationStore();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-red-400">Khóa Liên động Permissive & Hệ thống ESD-761</h1>
      <div className="space-y-3">
        {interlocks.map((il) => (
          <div key={il.interlockId} className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sky-400">{il.name.vi}</h2>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono">{il.verificationStatus}</span>
            </div>
            {il.conditions && (
              <ul className="mt-2 list-disc pl-4 text-emerald-300">
                {il.conditions.map((c) => (
                  <li key={c.tag}>
                    <strong>{c.label}:</strong> {c.rule}
                  </li>
                ))}
              </ul>
            )}
            {il.triggers && (
              <div className="mt-2">
                <strong className="text-red-400">Điều kiện kích hoạt:</strong> {il.triggers.join(' | ')}
              </div>
            )}
            {il.tripActions && (
              <div className="mt-1">
                <strong className="text-amber-400">Tác động dừng an toàn:</strong> {il.tripActions.join(' | ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
