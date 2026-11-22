import { z } from 'zod';

const FieldOnlyValveTypes = new Set([
  'manual-isolation',
  'drain-valve',
  'vent-valve',
  'bypass-valve',
  'psv',
]);

export const ValveSchema = z
  .object({
    valveId: z.string(),
    tag: z.string(),
    sopTag: z.string().optional(),
    sopContext: z.enum(['COMMON', 'STARTUP', 'SHUTDOWN']),
    valveType: z.enum([
      'manual-isolation',
      'drain-valve',
      'vent-valve',
      'bypass-valve',
      'psv',
      'self-acting-regulator',
      'control-valve',
      'shutdown-valve',
      'slide-gate-valve',
      'scraper-actuator',
    ]),
    operableFromField: z.boolean(),
    operableFromDCS: z.boolean(),
  })
  .refine(
    (v) => !(FieldOnlyValveTypes.has(v.valveType) && v.operableFromDCS),
    {
      message:
        'Security/Domain Violation: Field manual/drain/vent/bypass/PSV valves must have operableFromDCS = false.',
    }
  );

export function validateValveDataset(valves: unknown[]): boolean {
  for (const item of valves) {
    ValveSchema.parse(item);
  }
  return true;
}
