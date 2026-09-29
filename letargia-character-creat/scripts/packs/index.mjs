/**
 * LETARGIA CHARACTER CREAT - Pack Manager (Main Export)
 */

import { PackManagerCore } from "./pack-manager.mjs";
import { PackManagerOperations } from "./pack-manager-operations.mjs";
import { PackManagerValidation } from "./pack-manager-validation.mjs";
import { PackManagerValidationExtra } from "./pack-manager-validation-extra.mjs";

export class PackManager {
  constructor(catalog) {
    this._core = new PackManagerCore(catalog);
    this._ops = new PackManagerOperations(this._core);
    this._validation = new PackManagerValidation(this._core);
    this._validationExtra = new PackManagerValidationExtra(this._core);
  }

  get _packs() { return this._core._packs; }
  get _registeredCategories() { return this._core._registeredCategories; }
  get _initialized() { return this._core._initialized; }
  get catalog() { return this._core.catalog; }
  get validator() { return this._core.validator; }

  async initialize() { return this._core.initialize(); }
  async registerPack(packId, manifest, packPath) { return this._core.registerPack(packId, manifest, packPath); }
  async unregisterPack(packId) { return this._ops.unregisterPack(packId); }
  listPacks() { return this._ops.listPacks(); }
  listParts(filters) { return this._ops.listParts(filters); }
  setPackEnabled(packId, enabled) { return this._ops.setPackEnabled(packId, enabled); }
  getPack(packId) { return this._ops.getPack(packId); }
  isPackEnabled(packId) { return this._ops.isPackEnabled(packId); }
  getCategories() { return this._ops.getCategories(); }

  _validateManifest(manifest) { return this._validation._validateManifest(manifest); }
  _validatePaths(manifest, packPath) { return this._validationExtra._validatePaths(manifest, packPath); }
  _checkDuplicateIds(manifest, packId) { return this._validationExtra._checkDuplicateIds(manifest, packId); }
  _createError(code, message) { return this._validationExtra._createError(code, message); }
  _getAPIVersion() { return this._validationExtra._getAPIVersion(); }
}