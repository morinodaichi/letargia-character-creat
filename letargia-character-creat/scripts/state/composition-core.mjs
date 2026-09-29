/**
 * Composition Manager Core - State Management (Part 1)
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { SchemaValidator } from "../validation/schema-validator.mjs";
import { getSetting } from "../settings.mjs";
import { migrateComposition, FLAG_SCHEMA_VERSION } from "./migration.mjs";
import { AutoSaveManager } from "./auto-save.mjs";

const FLAG_KEY = "composition";

export class CompositionCore {
  constructor() {
    this._compositions = new Map();
    this._dirty = new Set();
    this._validator = new SchemaValidator();
    this._autoSave = new AutoSaveManager();
    this._initialized = false;
  }

  async load() {
    if (this._initialized) return;
    this._initialized = true;
    console.log(`[${MODULE_ID}] Composition manager initialized`);
  }

  _createEmptyComposition(baseConfig = {}) {
    return {
      version: FLAG_SCHEMA_VERSION,
      base: {
        bodyId: baseConfig.bodyId || "default-body",
        poseId: baseConfig.poseId || "default-pose",
        perspectiveId: baseConfig.perspectiveId || "default-perspective",
        packId: baseConfig.packId || "demo",
        packVersion: "1"
      },
      pieces: [],
      colors: {},
      transforms: { globalScale: 1, globalRotation: 0, globalOffsetX: 0, globalOffsetY: 0 },
      exportOptions: { format: "png", scale: 1, background: "transparent", includeMetadata: true },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: game.user?.name || "Unknown",
        name: "", description: ""
      }
    };
  }

  validate(composition) { return this._validator.validateComposition(composition); }
  getComposition(actor) { return this._compositions.get(actor.id) || null; }
  isDirty(actorId) { return this._dirty.has(actorId); }
  _markDirty(actorId) { this._dirty.add(actorId); }
}