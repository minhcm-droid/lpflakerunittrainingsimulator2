'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '@/store/simulationStore';
import { EQUIPMENT_3D_LAYOUT } from '@/config/modelMapping';

function EquipmentMesh({ tag }: { tag: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const item = useSimulationStore((s) => s.equipment.find((e) => e.tag === tag));
  const cfg = EQUIPMENT_3D_LAYOUT[tag];

  useFrame((_, delta) => {
    if (meshRef.current && item?.state === 'RUNNING') {
      meshRef.current.rotation.x += delta * ((item.speedRpm ?? 2) * 0.4);
    }
  });

  if (!cfg) return null;

  const color =
    item?.state === 'RUNNING'
      ? '#16a34a'
      : item?.state === 'TRIPPED'
      ? '#dc2626'
      : item?.state === 'READY'
      ? '#0284c7'
      : '#475569';

  return (
    <group position={cfg.position}>
      <mesh ref={meshRef} scale={cfg.scale}>
        {cfg.shape === 'drum' || cfg.shape === 'flaker' ? (
          <cylinderGeometry args={[0.6, 0.6, 1, 24]} />
        ) : (
          <boxGeometry args={[1, 1, 1]} />
        )}
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.35} />
      </mesh>
      <Html position={[0, cfg.scale[1] * 0.75 + 0.35, 0]} center distanceFactor={14}>
        <span className="whitespace-nowrap rounded bg-slate-900/90 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-100 border border-slate-700">
          {tag}
        </span>
      </Html>
    </group>
  );
}

export default function FlakerUnitCanvas() {
  return (
    <Canvas camera={{ position: [0, 7, 11], fov: 48 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 12, 6]} intensity={1.2} />
      <gridHelper args={[22, 22, '#334155', '#1e293b']} />
      {Object.keys(EQUIPMENT_3D_LAYOUT).map((tag) => (
        <EquipmentMesh key={tag} tag={tag} />
      ))}
      <OrbitControls makeDefault />
    </Canvas>
  );
}
