import React from 'react';

export default function DocumentsReferencePage() {
  return (
    <div className="space-y-4 text-xs">
      <h1 className="text-lg font-bold text-sky-400">Tài liệu Nguồn & Phạm vi Trích xuất</h1>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <ul className="list-disc space-y-1.5 pl-4 text-slate-300">
          <li><strong>HD-W-7800-02-001:</strong> Start Up LP Flaker Unit (7 Giai đoạn, van đánh dấu V1–V31).</li>
          <li><strong>HD-W-7800-06-001:</strong> Shutdown LP Flaker Unit (4 Giai đoạn, van đánh dấu V1–V34).</li>
          <li><strong>SC0353-ESD0-PD-2000-009 / 712 / 717 / 718:</strong> P&ID Seal Plan 02/53A, LP Storage, LP Flaker và Vent Recovery.</li>
          <li><strong>Tài liệu tham chiếu chưa đính kèm (NOT CONFIRMED):</strong> P&ID thượng nguồn (T-703 đến P-713A/B), Cause & Effect HD1-2M90-5027-031, SOP C-770 HD-W-7800-02-002.</li>
        </ul>
      </div>
    </div>
  );
}
