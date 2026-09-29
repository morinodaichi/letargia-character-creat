/**
 * Composition Schema v1 for LETARGIA CHARACTER CREAT
 * Defines a character composition
 */

export const COMPOSITION_SCHEMA_V1 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://letargia.com/schemas/composition-v1.json",
  title: "LETARGIA Character Creat Composition",
  type: "object",
  required: ["version", "base", "pieces", "colors", "transforms", "exportOptions"],
  additionalProperties: false,
  properties: {
    version: { const: 1 },
    base: {
      type: "object",
      required: ["bodyId", "poseId", "perspectiveId"],
      additionalProperties: false,
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
        additionalProperties: false,
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
              additionalProperties: false,
              properties: {
                layerId: { type: "string" },
                enabled: { type: "boolean", default: true },
                opacity: { type: "number", minimum: 0, maximum: 1, default: 1 },
                blendMode: { type: "string", default: "normal" },
                visible: { type: "boolean", default: true }
              }
            }
          },
          colorChoices: {
            type: "object",
            additionalProperties: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            description: "Chosen colors for color masks"
          },
          transform: {
            type: "object",
            additionalProperties: false,
            properties: {
              x: { type: "number", default: 0 },
              y: { type: "number", default: 0 },
              scale: { type: "number", minimum: 0.1, maximum: 10, default: 1 },
              rotation: { type: "number", default: 0 },
              // Anchor override (optional)
              anchorX: { type: "number", minimum: 0, maximum: 1 },
              anchorY: { type: "number", minimum: 0, maximum: 1 }
            }
          },
          // Layer order override (optional, for reordering)
          layerOrder: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    },
    colors: {
      type: "object",
      additionalProperties: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
      description: "Global color overrides"
    },
    transforms: {
      type: "object",
      additionalProperties: false,
      properties: {
        globalScale: { type: "number", minimum: 0.1, maximum: 10, default: 1 },
        globalRotation: { type: "number", default: 0 },
        globalOffsetX: { type: "number", default: 0 },
        globalOffsetY: { type: "number", default: 0 }
      }
    },
    exportOptions: {
      type: "object",
      additionalProperties: false,
      properties: {
        format: { type: "string", enum: ["png", "webp", "json"], default: "png" },
        scale: { type: "number", minimum: 0.1, maximum: 4, default: 1 },
        background: { type: "string", default: "transparent" },
        includeMetadata: { type: "boolean", default: true },
        canvasWidth: { type: "integer", minimum: 64, maximum: 4096, default: 1024 },
        canvasHeight: { type: "integer", minimum: 64, maximum: 4096, default: 1024 }
      }
    },
    // Viewport state for preview (not exported)
    viewport: {
      type: "object",
      additionalProperties: false,
      properties: {
        scale: { type: "number", minimum: 0.1, maximum: 10, default: 1 },
        offsetX: { type: "number", default: 0 },
        offsetY: { type: "number", default: 0 },
        showGrid: { type: "boolean", default: true }
      }
    },
    // Undo/redo history (kept in memory, not persisted to flags)
    history: {
      type: "object",
      additionalProperties: false,
      properties: {
        past: { type: "array", items: { type: "object" } },
        future: { type: "array", items: { type: "object" } },
        maxHistorySize: { type: "integer", default: 50 }
      }
    },
    metadata: {
      type: "object",
      additionalProperties: false,
      properties: {
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        author: { type: "string" },
        name: { type: "string" },
        description: { type: "string" }
      }
    }
  }
};