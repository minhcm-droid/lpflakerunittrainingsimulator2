'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';

export default function AlarmsPage() {
  const { alarms, acknowledgedAlarmTags, acknowledgeAlarm } = useSimulationStore();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-amber-400">Danh mục Cảnh báo Công nghệ (Safe Operating Limits)</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950 text-slate-400">
            <tr>
              <th className="p-3">Tag</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3">Dải chuẩn</th>
              <th className="p-3">Ngưỡng LL / L / H / HH</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((a) => {
              const acked = acknowledgedAlarmTags.includes(a.tag);
              return (
                <tr key={a.alarmId} className="border-b border-slate-800/60">
                  <td className="p-3 font-bold text-sky-400">{a.tag}</td>
                  <td className="p-3">{a.description.vi}</td>
                  <td className="p-3">
                    {a.normalRange.min} - {a.normalRange.max} {a.unit}
                  </td>
                  <td className="p-3 font-mono">
                    {a.thresholds.LL ?? '-'} / {a.thresholds.L ?? '-'} / {a.thresholds.H ?? '-'} / {a.thresholds.HH ?? '-'}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => acknowledgeAlarm(a.tag)}
                      className={`rounded px-2.5 py-1 font-bold ${acked ? 'bg-emerald-700 text-white' : 'bg-amber-600 text-slate-950'}`}
                    >
                      {acked ? 'Đã Ack' : 'Acknowledge'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
