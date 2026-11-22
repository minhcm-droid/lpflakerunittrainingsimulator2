'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { PROCESS_LINE_COLORS } from '@/config/processColors';

export function InteractivePID() {
  const [sheet, setSheet] = useState<'712' | '717' | '718'>('717');
  const { valves, equipment, instruments, role, toggleValve } = useSimulationStore();

  const v1Open = valves.find((v) => v.tag === 'V1 (Start-Up)')?.state === 'OPEN';
  const v4Open = valves.find((v) => v.tag === 'V4 (Start-Up)')?.state === 'OPEN';
  const v14Open = valves.find((v) => v.tag === 'V14 (Start-Up)')?.state === 'OPEN';
  const v16aOpen = valves.find((v) => v.tag === 'V16a (Start-Up)')?.state === 'OPEN';
  const v17Open = valves.find((v) => v.tag === 'V17 (Start-Up)')?.state === 'OPEN';
  const p717Running = equipment.find((e) => e.tag === 'P-717A')?.state === 'RUNNING';
  const m761Running = equipment.find((e) => e.tag === 'M-761A')?.state === 'RUNNING';

  const lpLineColor =
    p717Running && v1Open && v4Open && v17Open
      ? PROCESS_LINE_COLORS.LP_HOT
      : PROCESS_LINE_COLORS.INACTIVE;
  const lnLineColor = v14Open ? PROCESS_LINE_COLORS.NITROGEN_LN : PROCESS_LINE_COLORS.INACTIVE;
  const cwLineColor = v16aOpen ? PROCESS_LINE_COLORS.COOLING_WATER : PROCESS_LINE_COLORS.INACTIVE;

  const sheetValves = valves.filter((v) => v.pidDrawing.endsWith(sheet));

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {(['712', '717', '718'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setSheet(id)}
              className={`rounded px-3 py-1 text-xs font-bold ${
                sheet === id ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              P&ID {id}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-slate-400">
          Active Role: <strong className="text-emerald-400">{role}</strong>
        </span>
      </div>

      <svg viewBox="0 0 760 270" className="w-full rounded border border-slate-800 bg-slate-950">
        {sheet === '712' && (
          <g>
            <text x="16" y="24" fill="#38bdf8" fontSize="13" fontWeight="bold">
              SC0353-ESD0-PD-2000-712 — LP STORAGE & TRANSFER (D-717 / P-717A)
            </text>
            <rect x="40" y="65" width="110" height="140" rx="14" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
            <text x="72" y="135" fill="#f8fafc" fontSize="13" fontWeight="bold">D-717</text>
            <line x1="150" y1="150" x2="290" y2="150" stroke={v1Open ? PROCESS_LINE_COLORS.LP_HOT : PROCESS_LINE_COLORS.INACTIVE} strokeWidth="4" />
            <circle cx="320" cy="150" r="24" fill={p717Running ? '#16a34a' : '#1e293b'} stroke="#f8fafc" strokeWidth="2" />
            <text x="298" y="155" fill="#ffffff" fontSize="11" fontWeight="bold">P-717A</text>
            <line x1="344" y1="150" x2="680" y2="150" stroke={lpLineColor} strokeWidth="4" />
            <text x="530" y="138" fill="#fb923c" fontSize="11">To P&ID 717 (M-761A/B)</text>
          </g>
        )}

        {sheet === '717' && (
          <g>
            <text x="16" y="24" fill="#38bdf8" fontSize="13" fontWeight="bold">
              SC0353-ESD0-PD-2000-717 — LP FLAKER & PACKING UNIT (M-761A / ZZ-761A / FD-762A)
            </text>
            <line x1="20" y1="95" x2="240" y2="95" stroke={lpLineColor} strokeWidth="4" />
            <text x="24" y="85" fill="#fb923c" fontSize="11">LP Feed (V17)</text>
            <line x1="20" y1="145" x2="240" y2="145" stroke={lnLineColor} strokeWidth="4" />
            <text x="24" y="135" fill="#4ade80" fontSize="11">Nitrogen LN (V14)</text>
            <line x1="20" y1="195" x2="240" y2="195" stroke={cwLineColor} strokeWidth="4" />
            <text x="24" y="185" fill="#60a5fa" fontSize="11">Cooling Water CW (V16a)</text>

            <rect x="240" y="65" width="170" height="150" rx="10" fill={m761Running ? '#064e3b' : '#1e293b'} stroke="#38bdf8" strokeWidth="2" />
            <text x="295" y="135" fill="#f8fafc" fontSize="14" fontWeight="bold">M-761A</text>
            <text x="280" y="155" fill="#94a3b8" fontSize="11">Drum Flaker A</text>

            <rect x="455" y="95" width="100" height="75" rx="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
            <text x="480" y="136" fill="#f8fafc" fontSize="12" fontWeight="bold">ZZ-761A</text>

            <rect x="595" y="105" width="130" height="55" rx="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
            <text x="632" y="136" fill="#f8fafc" fontSize="12" fontWeight="bold">FD-762A</text>
          </g>
        )}

        {sheet === '718' && (
          <g>
            <text x="16" y="24" fill="#38bdf8" fontSize="13" fontWeight="bold">
              SC0353-ESD0-PD-2000-718 — HEXANE VENT RECOVERY (E-770 / C-770 / PIC-705)
            </text>
            <rect x="110" y="75" width="90" height="135" rx="8" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
            <text x="135" y="145" fill="#f8fafc" fontSize="13" fontWeight="bold">E-770</text>
            <line x1="200" y1="140" x2="380" y2="140" stroke={PROCESS_LINE_COLORS.VENT_HEXANE} strokeWidth="4" />
            <circle cx="410" cy="140" r="28" fill="#15803d" stroke="#f8fafc" strokeWidth="2" />
            <text x="392" y="145" fill="#ffffff" fontSize="12" fontWeight="bold">C-770</text>
            <line x1="438" y1="140" x2="680" y2="140" stroke={PROCESS_LINE_COLORS.VENT_HEXANE} strokeWidth="4" />
            <text x="530" y="128" fill="#fde047" fontSize="11">SDV-711 → D-882 / SDV-712 → ATM</text>
          </g>
        )}
      </svg>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sheetValves.map((v) => {
          const isOpen = v.state === 'OPEN';
          return (
            <div key={v.valveId} className="flex items-center justify-between rounded border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs">
              <div>
                <div className="font-bold text-slate-200">{v.tag}</div>
                <div className="text-[11px] text-slate-400">{v.name.vi}</div>
              </div>
              <button
                onClick={() => toggleValve(v.tag, isOpen ? 'CLOSED' : 'OPEN')}
                className={`rounded px-2 py-1 font-bold ${
                  isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'
                }`}
              >
                {v.state}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 border-t border-slate-800 pt-2 text-xs text-slate-300">
        {instruments.slice(0, 6).map((inst) => (
          <span key={inst.instrumentId} className="rounded bg-slate-950 px-2 py-1">
            <strong className="text-sky-400">{inst.tag}:</strong> {inst.value} {inst.unit}
          </span>
        ))}
      </div>
    </div>
  );
}
