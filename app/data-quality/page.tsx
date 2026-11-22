'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';

export default function DataQualityPage() {
  const { tzi797Profile, setTzi797Profile } = useSimulationStore();

  return (
    <div className="space-y-4 text-xs">
      <h1 className="text-lg font-bold text-amber-400">Báo cáo Chất lượng Dữ liệu & Xử lý Xung đột SOP</h1>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-3 text-slate-300">
        <div>
          <h2 className="font-bold text-sky-400">1. Xung đột ngưỡng nhiệt độ thấp chảo nóng chảy TZI-797A/B</h2>
          <p className="mt-1">
            Bảng giới hạn trong SOP Start-Up ghi L = 95 °C / LL = 90 °C, trong khi SOP Shutdown và ảnh màn hình DCS ghi L = 135 °C / LL = 125 °C.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setTzi797Profile('SHUTDOWN_SOP_AND_DCS')}
              className={`rounded px-3 py-1.5 font-bold ${tzi797Profile === 'SHUTDOWN_SOP_AND_DCS' ? 'bg-sky-600 text-white' : 'bg-slate-800'}`}
            >
              Dùng 135 °C / 125 °C (Mặc định)
            </button>
            <button
              onClick={() => setTzi797Profile('STARTUP_SOP_TABLE')}
              className={`rounded px-3 py-1.5 font-bold ${tzi797Profile === 'STARTUP_SOP_TABLE' ? 'bg-amber-600 text-slate-950' : 'bg-slate-800'}`}
            >
              Dùng 95 °C / 90 °C
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-sky-400">2. Đánh số van tách biệt giữa hai SOP</h2>
          <p className="mt-1">
            Cùng ký hiệu V1..V31 (Start-Up) và V1..V34 (Shutdown) chỉ các van khác nhau trên thực tế (ví dụ V3 là đầu vào PSV-718A trong Start-Up nhưng là van xả đáy chảo M-761A trong Shutdown). Hệ thống lưu tách biệt theo trường <code>sopContext</code>.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-sky-400">3. Hiệu chỉnh trạng thái dừng van trượt 20-HEV-761A/B</h2>
          <p className="mt-1">
            SOP Shutdown ghi nhầm trạng thái dừng là ON; mô phỏng áp dụng đúng logic kỹ thuật De-energize CLOSE (20-HZLC-761A/B ON).
          </p>
        </div>
      </div>
    </div>
  );
}
