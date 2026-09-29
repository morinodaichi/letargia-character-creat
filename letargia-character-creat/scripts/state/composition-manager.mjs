/**
 * Composition Manager - Main Export
 */

import { CompositionCore } from "./composition-core.mjs";
import { CompositionOperations } from "./composition-operations.mjs";

/**
 * Composition Manager - Singleton combining core and operations
 */
export class CompositionManager {
  constructor() {
    if (CompositionManager._instance) {
      return CompositionManager._instance;
    }
    
    this._core = new CompositionCore();
    this._ops = new CompositionOperations(this._core);
    
    CompositionManager._instance = this;
  }

  static getInstance() {
    if (!CompositionManager._instance) {
      CompositionManager._instance = new CompositionManager();
    }
    return CompositionManager._instance;
  }

  static initialize() {
    return CompositionManager.getInstance();
  }

  // Delegate to core
  get _compositions() { return this._core._compositions; }
  get _dirty() { return this._core._dirty; }
  get _autoSave() { return this._core._autoSave; }
  get _initialized() { return this._core._initialized; }

  // Delegate to core
  async load() { return this._core.load(); }
  validate(composition) { return this._core.validate(composition); }
  getComposition(actor) { return this._core.getComposition(actor); }
  isDirty(actorId) { return this._core.isDirty(actorId); }
  _markDirty(actorId) { return this._core._markDirty(actorId); }

  // Delegate to operations
  async createComposition(actor, baseConfig) { return this._ops.createComposition(actor, baseConfig); }
  async loadComposition(actor) { return this._ops.loadComposition(actor); }
  async saveComposition(actor, composition) { return this._ops.saveComposition(actor, composition); }
  updateComposition(actorId, updater) { return this._ops.updateComposition(actorId, updater); }
  onActorUpdate(actor, changes) { return this._ops.onActorUpdate(actor, changes); }
  onActorDelete(actor) { return this._ops.onActorDelete(actor); }
  onReady() { return this._ops.onReady(); }
  onSettingChanged(setting) { return this._ops.onSettingChanged(setting); }
  exportComposition(composition) { return this._ops.exportComposition(composition); }
  importComposition(jsonString) { return this._ops.importComposition(jsonString); }
  async deleteComposition(actor) { return this._ops.deleteComposition(actor); }
}