'use client';

import React from 'react';
import { InteractivePID } from '@/components/pid/InteractivePID';

export default function PidExplorerPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-sky-400">Sơ đồ P&ID Tương tác (712 / 717 / 718)</h1>
      <InteractivePID />
    </div>
  );
}
