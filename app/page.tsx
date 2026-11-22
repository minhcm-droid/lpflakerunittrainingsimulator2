'use client';

import React from 'react';
import Link from 'next/link';
import { useSimulationStore } from '@/store/simulationStore';

export default function DashboardPage() {
  const { equipment, procedures, alarms, interlocks } = useSimulationStore();

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold text-sky-400">
          LP Flaker Unit Training Simulator (Section 700)
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Môi trường huấn luyện vận hành chuẩn SOP Start-Up (<code>HD-W-7800-02-001</code>) & SOP Shutdown (
          <code>HD-W-7800-06-001</code>), tích hợp mô hình 3D, P&ID tương tác (712, 717, 718), bảng điều khiển DCS Faceplate và lõi chấm điểm 100 điểm.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/simulation" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-500">
            Vào Không gian Mô phỏng Hợp nhất
          </Link>
          <Link href="/training" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">
            Luyện tập Quy trình (Guided / Practice)
          </Link>
          <Link href="/assessment" className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-500">
            Thi Đánh giá Năng lực (Assessment)
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">Thiết bị Công nghệ</div>
          <div className="mt-1 text-2xl font-bold text-white">{equipment.length}</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">Bước Quy trình SOP</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400">{procedures.length}</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">Cảnh báo Công nghệ</div>
          <div className="mt-1 text-2xl font-bold text-amber-400">{alarms.length}</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">Khóa Liên động & ESD</div>
          <div className="mt-1 text-2xl font-bold text-red-400">{interlocks.length}</div>
        </div>
      </div>
    </div>
  );
}
