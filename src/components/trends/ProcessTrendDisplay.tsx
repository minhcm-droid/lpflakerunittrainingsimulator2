'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export interface TrendPoint {
  time: string;
  TZI_797A: number;
  TZI_795A: number;
  AZI_761A: number;
  FZI_7607A: number;
}

export function ProcessTrendDisplay({ history }: { history: TrendPoint[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
          DCS Real-Time Process Trend — M-761A
        </h3>
        <span className="text-[11px] text-slate-400">
          TZI-797A (°C) | TZI-795A (°C) | FZI-7607A (Nm³/h) | AZI-761A (%)
        </span>
      </div>
      <div className="h-52 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="TZI_797A" name="Pan Temp TZI-797A (°C)" stroke="#f97316" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="TZI_795A" name="CWR Temp TZI-795A (°C)" stroke="#3b82f6" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="FZI_7607A" name="LN Flow FZI-7607A (Nm³/h)" stroke="#22c55e" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="AZI_761A" name="Oxygen AZI-761A (%)" stroke="#eab308" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-500">
            Đang tải biểu đồ xu hướng DCS...
          </div>
        )}
      </div>
    </div>
  );
}
