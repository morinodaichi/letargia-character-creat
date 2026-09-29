/**
 * Pack Schema v1 for LETARGIA CHARACTER CREAT
 * Defines a piece pack with metadata and piece references
 */

export const PACK_SCHEMA_V1 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://letargia.com/schemas/pack-v1.json",
  title: "LETARGIA Character Creat Pack",
  type: "object",
  required: ["id", "schemaVersion", "apiVersion", "name", "pieces"],
  additionalProperties: false,
  properties: {
    id: {
      type: "string",
      pattern: "^[a-z0-9-]+$",
      description: "Unique pack identifier (lowercase, alphanumeric, hyphens)"
    },
    schemaVersion: { const: 1 },
    apiVersion: { type: "integer", minimum: 1, description: "Minimum API version required" },
    author: { type: "string" },
    license: { type: "string" },
    credits: { type: "string" },
    name: {
      type: "object",
      required: ["pt-BR", "en"],
      additionalProperties: false,
      properties: {
        "pt-BR": { type: "string" },
        "en": { type: "string" }
      }
    },
    description: {
      type: "object",
      additionalProperties: false,
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
      items: {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
          id: { type: "string", description: "Piece ID within this pack" },
          category: { type: "string" }
        }
      }
    },
    bases: {
      type: "array",
      items: { $ref: "#/$defs/baseRef" },
      default: []
    },
    poses: {
      type: "array",
      items: { $ref: "#/$defs/poseRef" },
      default: []
    },
    perspectives: {
      type: "array",
      items: { $ref: "#/$defs/perspectiveRef" },
      default: []
    }
  },
  $defs: {
    baseRef: {
      type: "object",
      required: ["id"],
      additionalProperties: false,
      properties: {
        id: { type: "string" },
        name: {
          type: "object",
          required: ["pt-BR", "en"],
          properties: { "pt-BR": { type: "string" }, "en": { type: "string" } }
        }
      }
    },
    poseRef: {
      type: "object",
      required: ["id"],
      additionalProperties: false,
      properties: {
        id: { type: "string" },
        name: {
          type: "object",
          required: ["pt-BR", "en"],
          properties: { "pt-BR": { type: "string" }, "en": { type: "string" } }
        }
      }
    },
    perspectiveRef: {
      type: "object",
      required: ["id"],
      additionalProperties: false,
      properties: {
        id: { type: "string" },
        name: {
          type: "object",
          required: ["pt-BR", "en"],
          properties: { "pt-BR": { type: "string" }, "en": { type: "string" } }
        }
      }
    }
  }
};