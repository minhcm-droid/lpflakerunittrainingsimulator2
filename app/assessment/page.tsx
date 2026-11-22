'use client';

import React from 'react';
import Link from 'next/link';
import { useSimulationStore } from '@/store/simulationStore';

export default function AssessmentPage() {
  const { setMode, injectFault } = useSimulationStore();

  const startExam = () => {
    setMode('ASSESSMENT');
    injectFault('FAULT-LSHH762-HOPPER');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-amber-400">Chế độ Thi Đánh giá Năng lực (Assessment Mode)</h1>
      <p className="text-xs text-slate-300">
        Trong chế độ Assessment, hệ thống khóa gợi ý tự động, ghi nhận mọi lỗi phân quyền Field/DCS, lỗi thiếu Permissive và tự động tiêm tình huống bất thường (thay bao Big Bag kịp thời trước LSHH-762A).
      </p>
      <div className="flex gap-3">
        <button onClick={startExam} className="rounded bg-amber-600 px-4 py-2 text-xs font-bold text-slate-950">
          Bắt đầu Bài thi & Tiêm tình huống
        </button>
        <Link href="/simulation" className="rounded bg-sky-600 px-4 py-2 text-xs font-bold text-white">
          Vào phòng thi Mô phỏng
        </Link>
        <Link href="/results" className="rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white">
          Nộp bài & Xem Bảng điểm 100
        </Link>
      </div>
    </div>
  );
}
