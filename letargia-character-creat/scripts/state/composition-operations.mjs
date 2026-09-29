/**
 * Composition Manager Core - Operations (Part 2)
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { migrateComposition } from "./migration.mjs";

export class CompositionOperations {
  constructor(core) {
    this._core = core;
  }

  _createSaveCallback(actor) {
    return async (actorId) => {
      if (this._core._dirty.has(actorId)) {
        const composition = this._core._compositions.get(actorId);
        if (composition) {
          const actorDoc = game.actors.get(actorId);
          if (actorDoc) await this.saveComposition(actorDoc, composition);
        }
      }
    };
  }

  async createComposition(actor, baseConfig) {
    const composition = this._core._createEmptyComposition(baseConfig);
    const validation = this._core.validate(composition);
    if (!validation.valid) console.warn(`[${MODULE_ID}] New composition validation failed:`, validation.errors);
    this._core._compositions.set(actor.id, composition);
    this._core._markDirty(actor.id);
    return composition;
  }

  async loadComposition(actor) {
    const flags = actor.getFlag("letargia-character-creat", "composition");
    if (!flags) return null;
    let composition = migrateComposition(flags);
    const validation = this._core.validate(composition);
    if (!validation.valid) console.warn(`[${MODULE_ID}] Loaded composition validation failed:`, validation.errors);
    this._core._compositions.set(actor.id, composition);
    this._core._autoSave.setup(actor, this._createSaveCallback(actor));
    return composition;
  }

  async saveComposition(actor, composition) {
    const currentFlags = actor.getFlag("letargia-character-creat", "composition");
    if (currentFlags && currentFlags.metadata?.updatedAt) {
      const loaded = this._core._compositions.get(actor.id);
      if (loaded && loaded.metadata.updatedAt !== currentFlags.metadata.updatedAt) {
        const shouldOverwrite = confirm(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Dialogs.ConcurrentModification"));
        if (!shouldOverwrite) return false;
      }
    }

    composition = { ...composition, metadata: { ...composition.metadata, updatedAt: new Date().toISOString() } };
    const validation = this._core.validate(composition);
    if (!validation.valid) {
      console.error(`[${MODULE_ID}] Save validation failed:`, validation.errors);
      ui.notifications.error(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.ValidationFailed"));
      return false;
    }

    try {
      await actor.setFlag("letargia-character-creat", "composition", composition);
      this._core._compositions.set(actor.id, composition);
      this._core._dirty.delete(actor.id);
      this._core._autoSave.clear(actor.id);
      console.log(`[${MODULE_ID}] Composition saved for ${actor.id}`);
      return true;
    } catch (error) {
      console.error(`[${MODULE_ID}] Save failed:`, error);
      ui.notifications.error(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.SaveFailed"));
      return false;
    }
  }

  updateComposition(actorId, updater) {
    const composition = this._core._compositions.get(actorId);
    if (!composition) return null;
    const updated = updater(composition);
    this._core._compositions.set(actorId, updated);
    this._core._markDirty(actorId);
    return updated;
  }

  onActorUpdate(actor, changes) {
    if (changes.flags?.["letargia-character-creat"]?.composition) {
      const newComposition = changes.flags["letargia-character-creat"].composition;
      const current = this._core._compositions.get(actor.id);
      if (current && newComposition.metadata?.updatedAt !== current.metadata?.updatedAt) {
        this._core._compositions.set(actor.id, migrateComposition(newComposition));
      }
    }
  }

  onActorDelete(actor) {
    this._core._compositions.delete(actor.id);
    this._core._dirty.delete(actor.id);
    this._core._autoSave.clear(actor.id);
  }

  onReady() {
    for (const actor of game.actors) {
      const flags = actor.getFlag("letargia-character-creat", "composition");
      if (flags) this._core._autoSave.setup(actor, this._createSaveCallback(actor));
    }
  }

  onSettingChanged(setting) {
    if (setting === "letargia-character-creat.autoSaveInterval") {
      this._core._autoSave.restartAll(this._core._compositions.keys(), this._createSaveCallback({}));
    }
  }

  exportComposition(composition) { return JSON.stringify(composition, null, 2); }
  importComposition(jsonString) {
    try {
      const composition = JSON.parse(jsonString);
      const validation = this._core.validate(composition);
      if (!validation.valid) throw new Error(`Invalid: ${validation.errors.map(e => e.message).join(", ")}`);
      return migrateComposition(composition);
    } catch (error) { console.error(`[${MODULE_ID}] Import failed:`, error); throw error; }
  }

  async deleteComposition(actor) {
    try {
      await actor.unsetFlag("letargia-character-creat", "composition");
      this._core._compositions.delete(actor.id);
      this._core._dirty.delete(actor.id);
      this._core._autoSave.clear(actor.id);
      return true;
    } catch (error) { console.error(`[${MODULE_ID}] Delete failed:`, error); return false; }
  }
}