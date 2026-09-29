/**
 * Demo Pieces Generator for LETARGIA CHARACTER CREAT
 * Combines all demo piece categories
 */

import { DEMO_HEAD_PIECES, DEMO_TORSO_PIECES } from "./demo-head-torso.mjs";
import { DEMO_LIMBS_PIECES } from "./demo-limbs.mjs";
import { DEMO_ACCESSORIES_PIECES } from "./demo-accessories.mjs";

/**
 * Generate all demo pieces
 * @returns {Array<Object>} All demo pieces
 */
export function generateDemoPieces() {
  return [
    ...DEMO_HEAD_PIECES,
    ...DEMO_TORSO_PIECES,
    ...DEMO_LIMBS_PIECES,
    ...DEMO_ACCESSORIES_PIECES
  ];
}