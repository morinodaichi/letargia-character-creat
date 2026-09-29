/**
 * Base Schema v1 for LETARGIA CHARACTER CREAT
 */

export const BASE_SCHEMA_V1 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  required: ["bodyId", "poseId", "perspectiveId", "canvas", "anchors"],
  properties: {
    bodyId: { type: "string" },
    poseId: { type: "string" },
    perspectiveId: { type: "string" },
    canvas: {
      type: "object",
      required: ["width", "height"],
      properties: {
        width: { type: "integer", minimum: 64, maximum: 4096 },
        height: { type: "integer", minimum: 64, maximum: 4096 }
      }
    },
    anchors: {
      type: "object",
      required: ["head", "torso", "leftArm", "rightArm", "leftLeg", "rightLeg"],
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
      properties: {
        name: { type: "object" },
        description: { type: "object" },
        preview: { type: "string", format: "uri" }
      }
    }
  },
  $defs: {
    anchor: {
      type: "object",
      required: ["x", "y"],
      properties: {
        x: { type: "number", minimum: 0, maximum: 1 },
        y: { type: "number", minimum: 0, maximum: 1 },
        rotation: { type: "number", default: 0 },
        scale: { type: "number", minimum: 0.1, maximum: 10, default: 1 }
      }
    }
  },
  additionalProperties: false
};