'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const FlakerUnitCanvas = dynamic(() => import('./FlakerUnitCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
      Đang khởi tạo mô hình 3D LP Flaker Unit...
    </div>
  ),
});

export function FlakerUnitScene() {
  return (
    <div className="h-[340px] w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
      <FlakerUnitCanvas />
    </div>
  );
}
