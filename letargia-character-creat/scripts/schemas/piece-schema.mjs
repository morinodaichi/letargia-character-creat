/**
 * Piece Schema v1 for LETARGIA CHARACTER CREAT
 * Defines a single piece with layers, compatibility, and color masks
 */

export const PIECE_SCHEMA_V1 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://letargia.com/schemas/piece-v1.json",
  title: "LETARGIA Character Creat Piece",
  type: "object",
  required: ["id", "category", "themes", "compatibility", "layers", "thumbnail", "drawOrder", "anchor", "offset", "scale", "rotation", "slots", "colorMasks"],
  additionalProperties: false,
  properties: {
    id: {
      type: "string",
      pattern: "^[a-z0-9-]+:[a-z0-9-]+$",
      description: "Namespaced piece ID (pack:piece-id)"
    },
    category: {
      type: "string",
      enum: [
        "head", "torso", "arms-hands", "legs-feet",
        "hair-beard", "clothing", "tattoos-scars",
        "accessories", "held-objects", "capes-wings-tails-horns"
      ],
      description: "Piece category for organization and compatibility"
    },
    themes: {
      type: "array",
      minItems: 1,
      items: { type: "string", enum: ["modern", "medieval", "futuristic"] },
      description: "Content themes this piece belongs to"
    },
    compatibility: {
      type: "object",
      required: ["bodies", "poses", "perspectives"],
      additionalProperties: false,
      properties: {
        bodies: { type: "array", items: { type: "string" }, description: "Compatible body IDs, '*' for all" },
        poses: { type: "array", items: { type: "string" }, description: "Compatible pose IDs, '*' for all" },
        perspectives: { type: "array", items: { type: "string" }, description: "Compatible perspective IDs, '*' for all" }
      }
    },
    layers: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["id", "image", "position"],
        additionalProperties: false,
        properties: {
          id: { type: "string", description: "Unique layer identifier within piece" },
          image: { type: "string", format: "uri", description: "Image URI (data: or https:)" },
          position: { $ref: "#/$defs/layerPosition" },
          blendMode: { type: "string", enum: ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], default: "normal" },
          opacity: { type: "number", minimum: 0, maximum: 1, default: 1 },
          visible: { type: "boolean", default: true },
          // Layer metadata for special handling
          layerType: { type: "string", enum: ["base", "skin", "tattoo", "hair", "clothing", "accessory", "held", "effect"], default: "base" },
          region: { type: "string", description: "Body region for tattoo/clothing pieces (e.g., 'leftArm', 'torso')" },
          zOffset: { type: "integer", default: 0, description: "Additional z-order offset within piece" }
        }
      }
    },
    thumbnail: { type: "string", format: "uri", description: "Thumbnail image URI" },
    drawOrder: { type: "integer", default: 0, description: "Global draw order (lower = behind)" },
    anchor: { $ref: "#/$defs/anchor" },
    offset: { $ref: "#/$defs/offset" },
    scale: { type: "number", minimum: 0.1, maximum: 10, default: 1 },
    rotation: { type: "number", default: 0 },
    slots: {
      type: "array",
      items: { type: "string" },
      default: [],
      description: "Equipment slots this piece occupies"
    },
    colorMasks: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "name", "layerId", "color", "maskType"],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          name: {
            type: "object",
            required: ["pt-BR", "en"],
            properties: { "pt-BR": { type: "string" }, "en": { type: "string" } }
          },
          layerId: { type: "string", description: "Layer ID this mask applies to" },
          color: { type: "string", pattern: "^#[0-9a-fA-F]{6}$", description: "Default color in hex" },
          maskType: { type: "string", enum: ["fill", "tint", "multiply", "overlay"], default: "fill", description: "How the color is applied" },
          preserveLuminosity: { type: "boolean", default: false, description: "Preserve original luminosity when tinting" }
        }
      },
      default: []
    },
    metadata: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: {
          type: "object",
          required: ["pt-BR", "en"],
          properties: { "pt-BR": { type: "string" }, "en": { type: "string" } }
        },
        description: {
          type: "object",
          properties: { "pt-BR": { type: "string" }, "en": { type: "string" } }
        },
        tags: { type: "array", items: { type: "string" } },
        author: { type: "string" },
        version: { type: "string" }
      }
    }
  },
  $defs: {
    anchor: {
      type: "object",
      required: ["x", "y"],
      additionalProperties: false,
      properties: {
        x: { type: "number", minimum: 0, maximum: 1 },
        y: { type: "number", minimum: 0, maximum: 1 }
      }
    },
    offset: {
      type: "object",
      required: ["x", "y"],
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        y: { type: "number" }
      }
    },
    layerPosition: {
      type: "object",
      required: ["x", "y"],
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        y: { type: "number" }
      }
    }
  }
};