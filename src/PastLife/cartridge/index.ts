// ============================================================================
//  cartridge/index.ts — single swap point for the identity-transformation
//  engine's theme. Change the import to switch worlds.
// ============================================================================

import { pastLifeCartridge } from './past-life';

export const CARTRIDGE = pastLifeCartridge;

export type { IdentityCartridge } from './types';
