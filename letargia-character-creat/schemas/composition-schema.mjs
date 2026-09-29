/**
 * Composition Schema v1 for LETARGIA CHARACTER CREAT
 */

export const COMPOSITION_SCHEMA_V1 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  required: ["version", "base", "pieces", "colors", "transforms", "exportOptions"],
  properties: {
    version: { const: 1 },
    base: {
      type: "object",
      required: ["bodyId", "poseId", "perspectiveId"],
      properties: {
        bodyId: { type: "string" },
        poseId: { type: "string" },
        perspectiveId: { type: "string" },
        packId: { type: "string" },
        packVersion: { type: "string" }
      }
    },
    pieces: {
      type: "array",
      items: {
        type: "object",
        required: ["pieceId", "packId", "packVersion", "enabled"],
        properties: {
          pieceId: { type: "string" },
          packId: { type: "string" },
          packVersion: { type: "string" },
          enabled: { type: "boolean", default: true },
          layers: {
            type: "array",
            items: {
              type: "object",
              required: ["layerId", "enabled"],
              properties: {
                layerId: { type: "string" },
                enabled: { type: "boolean", default: true },
                opacity: { type: "number", minimum: 0, maximum: 1, default: 1 },
                blendMode: { type: "string", default: "normal" }
              }
            }
          },
          colorChoices: {
            type: "object",
            additionalProperties: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" }
          },
          transform: {
            type: "object",
            properties: {
              x: { type: "number", default: 0 },
              y: { type: "number", default: 0 },
              scale: { type: "number", minimum: 0.1, maximum: 10, default: 1 },
              rotation: { type: "number", default: 0 }
            }
          }
        }
      }
    },
    colors: {
      type: "object",
      additionalProperties: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" }
    },
    transforms: {
      type: "object",
      properties: {
        globalScale: { type: "number", minimum: 0.1, maximum: 10, default: 1 },
        globalRotation: { type: "number", default: 0 },
        globalOffsetX: { type: "number", default: 0 },
        globalOffsetY: { type: "number", default: 0 }
      }
    },
    exportOptions: {
      type: "object",
      properties: {
        format: { type: "string", enum: ["png", "webp", "json"], default: "png" },
        scale: { type: "number", minimum: 0.1, maximum: 4, default: 1 },
        background: { type: "string", default: "transparent" },
        includeMetadata: { type: "boolean", default: true }
      }
    },
    metadata: {
      type: "object",
      properties: {
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        author: { type: "string" },
        name: { type: "string" },
        description: { type: "string" }
      }
    }
  },
  additionalProperties: false
};