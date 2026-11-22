'use client';

import React, { useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { FlakerUnitScene } from '@/components/three/FlakerUnitScene';
import { InteractivePID } from '@/components/pid/InteractivePID';
import { ProcessTrendDisplay } from '@/components/trends/ProcessTrendDisplay';
import { evaluateFlakerPermissivesA, evaluatePackingPermissivesA } from '@/engine/sequenceEngine';

export default function UnifiedSimulationPage() {
  const store = useSimulationStore();
  const tickSimulation = useSimulationStore((s) => s.tickSimulation);

  useEffect(() => {
    const timer = setInterval(() => {
      tickSimulation();
    }, 2000);
    return () => clearInterval(timer);
  }, [tickSimulation]);

  const packingPerms = evaluatePackingPermissivesA(store.instruments, store.valves);
  const flakerPerms = evaluateFlakerPermissivesA({
    instruments: store.instruments,
    valves: store.valves,
    equipment: store.equipment,
    tzi797Profile: store.tzi797Profile,
  });

  const m761A = store.equipment.find((e) => e.tag === 'M-761A');
  const tzi797 = store.instruments.find((i) => i.tag === 'TZI-797A');
  const pic705 = store.instruments.find((i) => i.tag === 'PIC-705');

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-7">
        <FlakerUnitScene />
        <InteractivePID />
        <ProcessTrendDisplay history={store.trendHistory} />
      </div>

      <div className="space-y-4 lg:col-span-5">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-sky-400">BẢNG ĐIỀU KHIỂN THAO TÁC (FIELD & DCS)</h2>
            <button
              onClick={store.resetSimulation}
              className="rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
            >
              Reset Mô phỏng
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <button onClick={store.startPumpP717A} className="rounded bg-emerald-700 px-3 py-2 font-bold text-white hover:bg-emerald-600">
              Start Bơm P-717A (Field)
            </button>
            <button onClick={store.stopPumpP717A} className="rounded bg-slate-700 px-3 py-2 font-bold text-white hover:bg-slate-600">
              Stop Bơm P-717A
            </button>
            <button onClick={store.pressHs765APackingStart} className="rounded bg-emerald-700 px-3 py-2 font-bold text-white hover:bg-emerald-600">
              HS-765A Start Packing (Field)
            </button>
            <button onClick={store.pressHs766APackingStop} className="rounded bg-slate-700 px-3 py-2 font-bold text-white hover:bg-slate-600">
              HS-766A Stop Packing (Field)
            </button>
            <button onClick={store.pressDcsFlakerPermissive} className="rounded bg-sky-700 px-3 py-2 font-bold text-white hover:bg-sky-600">
              PERMISSIVE Flaker (DCS)
            </button>
            <button onClick={store.startFlakerSystemA} className="rounded bg-emerald-700 px-3 py-2 font-bold text-white hover:bg-emerald-600">
              Start ZZ-761A / M-761A (Field)
            </button>
            <button onClick={store.pressDcsAutoStopA} className="rounded bg-amber-600 px-3 py-2 font-bold text-slate-950 hover:bg-amber-500">
              AUTO STOP M-761A (DCS)
            </button>
            <button onClick={store.toggleTzi797Oos} className="rounded bg-purple-700 px-3 py-2 font-bold text-white hover:bg-purple-600">
              TZA-797A LL: {tzi797?.oosActive ? 'OOS ON' : 'ACTIVE'}
            </button>
          </div>

          <div className="mt-3 rounded border border-slate-800 bg-slate-950 p-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span>Tốc độ trống M-761A (Max 5 RPM):</span>
              <strong className="text-sky-400">{m761A?.speedRpm ?? 0} RPM</strong>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={m761A?.speedRpm ?? 0}
              onChange={(e) => store.setDrumSpeedA(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </div>

          <div className="mt-3 rounded border border-slate-800 bg-slate-950 p-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span>PIC-705 ({pic705?.value} kg/cm²g) — PV-705 MV:</span>
              <strong className="text-amber-400">{pic705?.mvPercent ?? 45}%</strong>
            </div>
            <div className="mt-1 flex gap-2">
              <button
                onClick={() => store.setPic705Control('AUTO', pic705?.mvPercent ?? 45)}
                className={`rounded px-2 py-0.5 ${pic705?.mode === 'AUTO' ? 'bg-sky-600 text-white' : 'bg-slate-800'}`}
              >
                AUTO
              </button>
              <button
                onClick={() => store.setPic705Control('MAN', pic705?.mvPercent ?? 45)}
                className={`rounded px-2 py-0.5 ${pic705?.mode === 'MAN' ? 'bg-amber-600 text-slate-950' : 'bg-slate-800'}`}
              >
                MAN
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={pic705?.mvPercent ?? 45}
                onChange={(e) => store.setPic705Control('MAN', Number(e.target.value))}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs">
            <h3 className="mb-2 font-bold text-emerald-400">PACKING PERMISSIVES (3)</h3>
            {packingPerms.map((p) => (
              <div key={p.tag} className="mb-1 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${p.satisfied ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span>{p.label}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs">
            <h3 className="mb-2 font-bold text-sky-400">FLAKER PERMISSIVES (6)</h3>
            {flakerPerms.map((p) => (
              <div key={p.tag} className="mb-1 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${p.satisfied ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs">
          <h3 className="mb-2 font-bold text-slate-300">EVENT LOG & INTERLOCK FEEDBACK</h3>
          <div className="max-h-48 space-y-1.5 overflow-y-auto">
            {store.eventLogs.length === 0 && <div className="text-slate-500">Chưa có thao tác nào.</div>}
            {store.eventLogs.map((log, idx) => (
              <div
                key={idx}
                className={`rounded border px-2 py-1 ${
                  log.success ? 'border-emerald-800/60 bg-emerald-950/30 text-emerald-200' : 'border-red-800/60 bg-red-950/40 text-red-200'
                }`}
              >
                <span className="font-mono text-[11px] text-slate-400">[{log.timestamp}] [{log.role}] </span>
                {log.message.vi}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
