/**
 * Schema Definitions for LETARGIA CHARACTER CREAT
 * Versioned schemas for packs, bases, pieces, and compositions
 */

export const SCHEMA_VERSIONS = {
  PACK: 1,
  BASE: 1,
  PIECE: 1,
  COMPOSITION: 1
};

/**
 * Pack Schema v1
 * Defines a piece pack with metadata and pieces
 */
export const PACK_SCHEMA_V1 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  required: ["id", "schemaVersion", "apiVersion", "name", "pieces"],
  properties: {
    id: { type: "string", pattern: "^[a-z0-9-]+$" },
    schemaVersion: { const: 1 },
    apiVersion: { type: "integer", minimum: 1 },
    author: { type: "string" },
    license: { type: "string" },
    credits: { type: "string" },
    name: {
      type: "object",
      required: ["pt-BR", "en"],
      properties: {
        "pt-BR": { type: "string" },
        "en": { type: "string" }
      }
    },
    description: {
      type: "object",
      properties: {
        "pt-BR": { type: "string" },
        "en": { type: "string" }
      }
    },
    categories: {
      type: "array",
      items: { type: "string" },
      default: []
    },
    pieces: {
      type: "array",
      items: { $ref: "#/$defs/pieceRef" }
    }
  },
  $defs: {
    pieceRef: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        category: { type: "string" }
      }
    }
  },
  additionalProperties: false
};

/**
 * Get schema by type and version
 * @param {string} type - Schema type (pack, base, piece, composition)
 * @param {number} version - Schema version
 * @returns {Object} Schema object
 */
export function getSchema(type, version) {
  const schemas = {
    pack: { 1: PACK_SCHEMA_V1 },
    base: { 1: null }, // Defined in base-schema.mjs
    piece: { 1: null }, // Defined in piece-schema.mjs
    composition: { 1: null } // Defined in composition-schema.mjs
  };
  
  return schemas[type]?.[version] || null;
}

/**
 * Get latest schema version for a type
 * @param {string} type - Schema type
 * @returns {number} Latest version
 */
export function getLatestSchemaVersion(type) {
  return SCHEMA_VERSIONS[type.toUpperCase()] || 1;
}