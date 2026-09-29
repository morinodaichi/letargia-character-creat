/**
 * LETARGIA CHARACTER CREAT - Public API Main Entry Point
 * Combines core, export, and utilities into the final API class
 */

import { LetargiaCharacterCreatAPICore } from "./api-core.mjs";
import { APIExportMethods } from "./api-export.mjs";
import { createError, ErrorCodes, API_VERSION } from "./api-errors.mjs";
import { fire, on, once } from "../api-hooks/hooks.mjs";

export class LetargiaCharacterCreatAPI extends LetargiaCharacterCreatAPICore {
  constructor() {
    super();
    this._exportMethods = new APIExportMethods(this);
  }

  // Delegate export methods
  async exportComposition(composition, options = {}) { return this._exportMethods.exportComposition(composition, options); }
  async applyToActor(actorUuid, options = {}) { return this._exportMethods.applyToActor(actorUuid, options); }

  // Utility methods
  localize(key, data = {}) { return game.i18n.localize(key, data); }
  getModuleVersion() { return game.modules.get("letargia-character-creat")?.version || "0.0.0"; }
  getCatalog() { this._checkInitialized(); return this._catalog; }
  getCompositionManager() { this._checkInitialized(); return this._compositionManager; }
  getPackManager() { this._checkInitialized(); return this._packManager; }
  getValidator() { this._checkInitialized(); return this._validator; }
  getExporter() { this._checkInitialized(); return this._exporter; }
  isEnabled() { return game.settings.get("letargia-character-creat", "enabled"); }
  onHook(hookName, callback) { return on(hookName, callback); }
  onceHook(hookName, callback) { return once(hookName, callback); }
}

let _apiInstance = null;
export function getAPI() { if (!_apiInstance) _apiInstance = new LetargiaCharacterCreatAPI(); return _apiInstance; }
export const api = getAPI();
export { createError, ErrorCodes, API_VERSION } from "./api-errors.mjs";