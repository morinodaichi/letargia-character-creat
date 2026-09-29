/**
 * Piece Schema v1 for LETARGIA CHARACTER CREAT
 */

export const PIECE_SCHEMA_V1 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  required: ["id", "category", "themes", "compatibility", "layers", "thumbnail", "drawOrder", "anchor", "offset", "scale", "rotation", "slots", "colorMasks"],
  properties: {
    id: { type: "string", pattern: "^[a-z0-9-]+:[a-z0-9-]+$" },
    category: { 
      type: "string",
      enum: [
        "head", "torso", "arms-hands", "legs-feet", 
        "hair-beard", "clothing", "tattoos-scars", 
        "accessories", "held-objects", "capes-wings-tails-horns"
      ]
    },
    themes: {
      type: "array",
      items: { type: "string", enum: ["modern", "medieval", "futuristic"] },
      minItems: 1
    },
    compatibility: {
      type: "object",
      required: ["bodies", "poses", "perspectives"],
      properties: {
        bodies: { type: "array", items: { type: "string" } },
        poses: { type: "array", items: { type: "string" } },
        perspectives: { type: "array", items: { type: "string" } }
      }
    },
    layers: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["id", "image", "position"],
        properties: {
          id: { type: "string" },
          image: { type: "string", format: "uri" },
          position: { $ref: "#/$defs/layerPosition" },
          blendMode: { type: "string", default: "normal" },
          opacity: { type: "number", minimum: 0, maximum: 1, default: 1 }
        }
      }
    },
    thumbnail: { type: "string", format: "uri" },
    drawOrder: { type: "integer", default: 0 },
    anchor: { $ref: "#/$defs/anchor" },
    offset: { $ref: "#/$defs/offset" },
    scale: { type: "number", minimum: 0.1, maximum: 10, default: 1 },
    rotation: { type: "number", default: 0 },
    slots: {
      type: "array",
      items: { type: "string" },
      default: []
    },
    colorMasks: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "name", "layerId", "color"],
        properties: {
          id: { type: "string" },
          name: { type: "object" },
          layerId: { type: "string" },
          color: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" }
        }
      },
      default: []
    },
    metadata: {
      type: "object",
      properties: {
        name: { type: "object" },
        description: { type: "object" },
        tags: { type: "array", items: { type: "string" } }
      }
    }
  },
  $defs: {
    anchor: {
      type: "object",
      required: ["x", "y"],
      properties: {
        x: { type: "number", minimum: 0, maximum: 1 },
        y: { type: "number", minimum: 0, maximum: 1 }
      }
    },
    offset: {
      type: "object",
      required: ["x", "y"],
      properties: {
        x: { type: "number" },
        y: { type: "number" }
      }
    },
    layerPosition: {
      type: "object",
      required: ["x", "y"],
      properties: {
        x: { type: "number" },
        y: { type: "number" }
      }
    }
  },
  additionalProperties: false
};