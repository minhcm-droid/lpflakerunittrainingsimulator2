import React from 'react';

export default function SystemOverviewPage() {
  return (
    <div className="space-y-4 text-xs">
      <h1 className="text-lg font-bold text-sky-400">Tổng quan Công nghệ LP Flaker Unit (Section 700)</h1>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-2 text-slate-300">
        <p><strong>1. Cụm Thượng nguồn (T-703, D-711, D-712, P-713A/B):</strong> <span className="rounded bg-red-950 px-2 py-0.5 font-bold text-red-300">NOT CONFIRMED FROM PROVIDED DOCUMENT</span></p>
        <p><strong>2. Cụm Bồn chứa & Bơm LP (P&ID 712):</strong> Bồn D-717 gia nhiệt giữ LP lỏng, bơm bánh răng P-717A/B (Seal Plan 02/53A) tuần hoàn qua bypass V6 và cấp liệu sang M-761A/B.</p>
        <p><strong>3. Cụm Tạo vảy & Đóng gói (P&ID 717):</strong> Trống làm lạnh M-761A/B (&lt; 5 RPM), dao gạt 20-HEV-763A/B, máy nghiền ZZ-761A/B, van xoay RF-763A/B, van trượt 20-HEV-761A/B và vít tải FD-762A/B đóng bao Big Bag có tiếp địa chống tĩnh điện.</p>
        <p><strong>4. Cụm Thu hồi Khí Vent (P&ID 718):</strong> Bình ngưng E-770, quạt hút C-770 (PIC-705 = 0.02 kg/cm²g) đưa khí thu hồi sang D-882 qua SDV-711.</p>
      </div>
    </div>
  );
}
