/**
 * Schema Registry for LETARGIA CHARACTER CREAT
 * Central registry for all versioned schemas
 */

import { PACK_SCHEMA_V1 } from "./pack-schema.mjs";
import { BASE_SCHEMA_V1 } from "./base-schema.mjs";
import { PIECE_SCHEMA_V1 } from "./piece-schema.mjs";
import { COMPOSITION_SCHEMA_V1 } from "./composition-schema.mjs";

export const SCHEMA_VERSIONS = {
  PACK: 1,
  BASE: 1,
  PIECE: 1,
  COMPOSITION: 1
};

/**
 * Get schema by type and version
 * @param {string} type - Schema type (pack, base, piece, composition)
 * @param {number} version - Schema version
 * @returns {Object|null} Schema object or null if not found
 */
export function getSchema(type, version) {
  const schemas = {
    pack: { 1: PACK_SCHEMA_V1 },
    base: { 1: BASE_SCHEMA_V1 },
    piece: { 1: PIECE_SCHEMA_V1 },
    composition: { 1: COMPOSITION_SCHEMA_V1 }
  };
  
  return schemas[type]?.[version] ?? null;
}

/**
 * Get latest schema version for a type
 * @param {string} type - Schema type
 * @returns {number} Latest version
 */
export function getLatestSchemaVersion(type) {
  return SCHEMA_VERSIONS[type.toUpperCase()] ?? 1;
}