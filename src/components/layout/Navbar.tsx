'use client';

import React from 'react';
import Link from 'next/link';
import { useSimulationStore } from '@/store/simulationStore';

const NAV_LINKS = [
  { href: '/', label: 'Tổng quan' },
  { href: '/system-overview', label: 'Công nghệ' },
  { href: '/simulation', label: 'Mô phỏng 3D + P&ID' },
  { href: '/pid', label: 'P&ID Động' },
  { href: '/field', label: 'Field Mode' },
  { href: '/dcs', label: 'DCS Mode' },
  { href: '/procedures/startup', label: 'SOP Start-Up' },
  { href: '/procedures/shutdown', label: 'SOP Shutdown' },
  { href: '/procedures/emergency', label: 'Sự cố (Deviation)' },
  { href: '/alarms', label: 'Alarms' },
  { href: '/interlocks', label: 'Interlocks & ESD' },
  { href: '/training', label: 'Training' },
  { href: '/assessment', label: 'Assessment' },
  { href: '/results', label: 'Kết quả' },
  { href: '/data-quality', label: 'Data Quality' },
  { href: '/documents', label: 'Tài liệu' },
];

export function Navbar() {
  const { role, setRole, tzi797Profile, setTzi797Profile, esd761Tripped } = useSimulationStore();

  return (
    <header className="border-b border-slate-800 bg-slate-950 px-4 py-2.5">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-bold text-sky-400">
            LP FLAKER SIMULATOR
          </Link>
          {esd761Tripped && (
            <span className="animate-pulse rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
              ESD-761 TRIPPED
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-slate-700 bg-slate-900 p-0.5 text-xs">
            <button
              onClick={() => setRole('FIELD')}
              className={`rounded px-2.5 py-1 font-semibold transition ${
                role === 'FIELD' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Field Operator (FO)
            </button>
            <button
              onClick={() => setRole('DCS')}
              className={`rounded px-2.5 py-1 font-semibold transition ${
                role === 'DCS' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              DCS Operator (BM)
            </button>
          </div>

          <select
            value={tzi797Profile}
            onChange={(e) =>
              setTzi797Profile(e.target.value as 'SHUTDOWN_SOP_AND_DCS' | 'STARTUP_SOP_TABLE')
            }
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200"
            title="Cấu hình ngưỡng cảnh báo/trip TZI-797A/B"
          >
            <option value="SHUTDOWN_SOP_AND_DCS">TZI-797: 135/125 °C (SOP Shutdown & DCS)</option>
            <option value="STARTUP_SOP_TABLE">TZI-797: 95/90 °C (Bảng SOP Start-Up)</option>
          </select>
        </div>
      </div>

      <nav className="mx-auto mt-2 flex max-w-[1600px] flex-wrap gap-1.5 border-t border-slate-800/80 pt-2">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800 hover:text-sky-300"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
