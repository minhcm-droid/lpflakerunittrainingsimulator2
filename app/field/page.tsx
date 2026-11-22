'use client';

import React, { useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { FlakerUnitScene } from '@/components/three/FlakerUnitScene';
import { InteractivePID } from '@/components/pid/InteractivePID';

export default function FieldOperatorPage() {
  const { setRole } = useSimulationStore();
  useEffect(() => {
    setRole('FIELD');
  }, [setRole]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-emerald-400">Chế độ Field Operator (Hiện trường)</h1>
      <FlakerUnitScene />
      <InteractivePID />
    </div>
  );
}
