export interface ModelSpatialConfig {
  tag: string;
  position: [number, number, number];
  scale: [number, number, number];
  shape: 'drum' | 'pump' | 'flaker' | 'crusher' | 'conveyor' | 'condenser' | 'blower';
  glbPath?: string;
}

export const EQUIPMENT_3D_LAYOUT: Record<string, ModelSpatialConfig> = {
  'D-717': { tag: 'D-717', position: [-6, 1.4, -2], scale: [1.5, 2.6, 1.5], shape: 'drum', glbPath: '/models/d-717.glb' },
  'P-717A': { tag: 'P-717A', position: [-3.5, 0.5, -2.8], scale: [0.9, 0.7, 0.7], shape: 'pump', glbPath: '/models/p-717.glb' },
  'P-717B': { tag: 'P-717B', position: [-3.5, 0.5, -1.2], scale: [0.9, 0.7, 0.7], shape: 'pump', glbPath: '/models/p-717.glb' },
  'M-761A': { tag: 'M-761A', position: [0, 1.8, -2.5], scale: [2.2, 1.6, 1.4], shape: 'flaker', glbPath: '/models/m-761.glb' },
  'M-761B': { tag: 'M-761B', position: [0, 1.8, 2.5], scale: [2.2, 1.6, 1.4], shape: 'flaker', glbPath: '/models/m-761.glb' },
  'ZZ-761A': { tag: 'ZZ-761A', position: [2.2, 1.2, -2.5], scale: [0.9, 0.8, 0.9], shape: 'crusher', glbPath: '/models/zz-761.glb' },
  'ZZ-761B': { tag: 'ZZ-761B', position: [2.2, 1.2, 2.5], scale: [0.9, 0.8, 0.9], shape: 'crusher', glbPath: '/models/zz-761.glb' },
  'FD-762A': { tag: 'FD-762A', position: [4.4, 0.7, -2.5], scale: [2.4, 0.45, 0.45], shape: 'conveyor', glbPath: '/models/fd-762.glb' },
  'FD-762B': { tag: 'FD-762B', position: [4.4, 0.7, 2.5], scale: [2.4, 0.45, 0.45], shape: 'conveyor', glbPath: '/models/fd-762.glb' },
  'E-770': { tag: 'E-770', position: [1.5, 3.6, 0], scale: [0.8, 2.0, 0.8], shape: 'condenser', glbPath: '/models/e-770-c-770.glb' },
  'C-770': { tag: 'C-770', position: [3.8, 3.2, 0], scale: [1.0, 1.0, 1.0], shape: 'blower', glbPath: '/models/e-770-c-770.glb' },
};
