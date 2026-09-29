/**
 * Base Schema v1 for LETARGIA CHARACTER CREAT
 * Defines a body base with pose and perspective
 */

export const BASE_SCHEMA_V1 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://letargia.com/schemas/base-v1.json",
  title: "LETARGIA Character Creat Base",
  type: "object",
  required: ["bodyId", "poseId", "perspectiveId", "canvas", "anchors"],
  additionalProperties: false,
  properties: {
    bodyId: { type: "string", description: "Body identifier" },
    poseId: { type: "string", description: "Pose identifier" },
    perspectiveId: { type: "string", description: "Perspective identifier" },
    canvas: {
      type: "object",
      required: ["width", "height"],
      additionalProperties: false,
      properties: {
        width: { type: "integer", minimum: 64, maximum: 4096, default: 1024 },
        height: { type: "integer", minimum: 64, maximum: 4096, default: 1024 }
      }
    },
    anchors: {
      type: "object",
      required: ["head", "torso", "leftArm", "rightArm", "leftLeg", "rightLeg"],
      additionalProperties: false,
      properties: {
        head: { $ref: "#/$defs/anchor" },
        torso: { $ref: "#/$defs/anchor" },
        leftArm: { $ref: "#/$defs/anchor" },
        rightArm: { $ref: "#/$defs/anchor" },
        leftLeg: { $ref: "#/$defs/anchor" },
        rightLeg: { $ref: "#/$defs/anchor" }
      }
    },
    metadata: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: {
          type: "object",
          properties: { "pt-BR": { type: "string" }, "en": { type: "string" } }
        },
        description: {
          type: "object",
          properties: { "pt-BR": { type: "string" }, "en": { type: "string" } }
        },
        preview: { type: "string", format: "uri" }
      }
    }
  },
  $defs: {
    anchor: {
      type: "object",
      required: ["x", "y"],
      additionalProperties: false,
      properties: {
        x: { type: "number", minimum: 0, maximum: 1, description: "Normalized X position (0-1)" },
        y: { type: "number", minimum: 0, maximum: 1, description: "Normalized Y position (0-1)" },
        rotation: { type: "number", default: 0, description: "Rotation in radians" },
        scale: { type: "number", minimum: 0.1, maximum: 10, default: 1, description: "Scale multiplier" }
      }
    }
  }
};