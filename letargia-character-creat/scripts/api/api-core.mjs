/**
 * LETARGIA CHARACTER CREAT - Public API Core
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { PieceCatalog } from "../catalog/piece-catalog.mjs";
import { CompositionManager } from "../state/composition-manager.mjs";
import { SchemaValidator } from "../validation/schema-validator.mjs";
import { ExportManager } from "../export/export-manager.mjs";
import { PackManager } from "../packs/index.mjs";
import { fire, HookNames, waitForAPI, on, once } from "../api-hooks/hooks.mjs";
import { createError, ErrorCodes, API_VERSION } from "./api-errors.mjs";

export class LetargiaCharacterCreatAPI {
  constructor() {
    this._initialized = false;
    this._catalog = null;
    this._compositionManager = null;
    this._packManager = null;
    this._validator = null;
    this._exporter = null;
    this._editor = null;
    this._apiReady = false;
  }

  get version() { return API_VERSION; }
  get moduleId() { return MODULE_ID; }
  get isReady() { return this._apiReady; }

  async initialize() {
    if (this._initialized) return;
    this._catalog = PieceCatalog.getInstance();
    this._compositionManager = CompositionManager.getInstance();
    this._packManager = new PackManager(this._catalog);
    this._validator = new SchemaValidator();
    this._exporter = new ExportManager();
    await this._catalog.load();
    await this._compositionManager.load();
    await this._packManager.initialize();
    this._initialized = true;
    this._apiReady = true;
    await fire("letargia-character-creat.apiReady", this);
    console.log(`[${MODULE_ID}] Public API v${API_VERSION} initialized`);
  }

  static async waitForReady() { return waitForAPI(); }

  _checkInitialized() {
    if (!this._initialized) throw createError("NOT_INITIALIZED", "API not initialized. Call initialize() first.");
  }

  // ==================== PACK MANAGEMENT ====================
  async registerPack(packId, manifest, packPath) {
    this._checkInitialized();
    return this._packManager.registerPack(packId, manifest, packPath);
  }

  async unregisterPack(packId) {
    this._checkInitialized();
    return this._packManager.unregisterPack(packId);
  }

  listPacks() {
    this._checkInitialized();
    return this._packManager.listPacks();
  }

  listParts(filters = {}) {
    this._checkInitialized();
    return this._packManager.listParts(filters);
  }

  async registerCategory(categoryId, definition, packId) {
    this._checkInitialized();
    this._packManager._registerCategory(categoryId, definition, packId);
  }

  // ==================== COMPOSITION MANAGEMENT ====================
  async openCreator({ actorUuid, tokenUuid } = {}) {
    this._checkInitialized();
    let actor;
    if (actorUuid) {
      actor = game.actors.get(actorUuid);
      if (!actor) throw createError("ACTOR_NOT_FOUND", `Actor not found: ${actorUuid}`, { actorUuid });
    } else if (tokenUuid) {
      const token = game.canvas?.tokens?.get(tokenUuid);
      if (!token || !token.actor) throw createError("TOKEN_NOT_FOUND", `Token not found or has no actor: ${tokenUuid}`, { tokenUuid });
      actor = token.actor;
    } else {
      throw createError("INVALID_COMPOSITION", "Either actorUuid or tokenUuid must be provided");
    }
    if (!actor.testUserPermission(game.user, "UPDATE")) throw createError("NO_PERMISSION", `User lacks UPDATE permission for actor ${actor.id}`);
    if (this._editor && this._editor.actor !== actor) await this._editor.close();
    if (!this._editor || this._editor.actor !== actor) this._editor = new (await import("../ui/character-editor.mjs")).CharacterEditor(actor);
    await this._editor.render(true);
    await fire("letargia-character-creat.editorOpened", actor, this._editor);
    return this._editor;
  }

  async getComposition(actorUuid) {
    this._checkInitialized();
    const actor = game.actors.get(actorUuid);
    if (!actor) throw createError("ACTOR_NOT_FOUND", `Actor not found: ${actorUuid}`, { actorUuid });
    return this._compositionManager.loadComposition(actor);
  }

  validateComposition(composition) {
    this._checkInitialized();
    return this._validator.validateComposition(composition);
  }

  async setComposition(actorUuid, composition) {
    this._checkInitialized();
    const actor = game.actors.get(actorUuid);
    if (!actor) throw createError("ACTOR_NOT_FOUND", `Actor not found: ${actorUuid}`, { actorUuid });
    if (!actor.testUserPermission(game.user, "UPDATE")) throw createError("NO_PERMISSION", `User lacks UPDATE permission for actor ${actor.id}`);
    const validation = this.validateComposition(composition);
    if (!validation.valid) throw createError("INVALID_COMPOSITION", "Composition validation failed", { errors: validation.errors });
    const currentFlags = actor.getFlag("letargia-character-creat", "composition");
    if (currentFlags && currentFlags.metadata?.updatedAt) {
      const loaded = this._compositionManager.getComposition(actor);
      if (loaded && loaded.metadata.updatedAt !== currentFlags.metadata.updatedAt) {
        throw createError("CONCURRENT_MODIFICATION", "Composition was modified by another user", { serverVersion: currentFlags.metadata.updatedAt, localVersion: loaded.metadata.updatedAt });
      }
    }
    return this._compositionManager.saveComposition(actor, composition);
  }
}