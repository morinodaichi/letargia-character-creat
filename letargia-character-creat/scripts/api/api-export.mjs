/**
 * LETARGIA CHARACTER CREAT - API Export/Import Methods
 */

import { createError, ErrorCodes } from "./api-errors.mjs";
import { fire } from "../api-hooks/hooks.mjs";

export class APIExportMethods {
  constructor(api) {
    this._api = api;
  }

  async exportComposition(composition, options = {}) {
    this._api._checkInitialized();
    const format = options.format || "png";
    if (!["png", "webp", "json"].includes(format)) {
      throw createError("EXPORT_FAILED", `Invalid format: ${format}. Must be one of: png, webp, json`);
    }

    try {
      if (format === "json") {
        const json = this._api._exporter.exportJSON(composition);
        const blob = new Blob([json], { type: "application/json" });
        return { data: blob, format: "json", filename: `composition-${Date.now()}.json` };
      }
      const { exportCompositionToBlob } = await import("../../render/export.mjs");
      const blob = await exportCompositionToBlob(composition, this._api._catalog, {
        format,
        scale: options.scale || 1,
        background: options.background || "transparent",
        canvasWidth: options.canvasWidth || composition.exportOptions?.canvasWidth || 1024,
        canvasHeight: options.canvasHeight || composition.exportOptions?.canvasHeight || 1024
      });
      return {
        data: blob,
        format,
        filename: `character-${Date.now()}.${format === "webp" ? "webp" : "png"}`
      };
    } catch (err) {
      console.error(`[letargia-character-creat] Export failed:`, err);
      throw createError("EXPORT_FAILED", `Export failed: ${err.message}`, { originalError: err.message });
    }
  }

  async applyToActor(actorUuid, options = {}) {
    this._api._checkInitialized();
    const composition = await this._api.getComposition(actorUuid);
    if (!composition) throw createError("INVALID_COMPOSITION", "No composition found for actor", { actorUuid });

    const sourceActor = game.actors.get(actorUuid);
    if (!sourceActor) throw createError("ACTOR_NOT_FOUND", `Actor not found: ${actorUuid}`);

    const targetActors = options.targetActors 
      ? options.targetActors.map(uuid => game.actors.get(uuid)).filter(Boolean)
      : [sourceActor];

    if (targetActors.length === 0) {
      throw createError("NO_APPLICABLE_ACTORS", "No valid target actors", { actorUuid });
    }

    for (const actor of targetActors) {
      if (!actor.testUserPermission(game.user, "UPDATE")) {
        throw createError("NO_PERMISSION", `User lacks UPDATE permission for actor ${actor.id}`, { actorId: actor.id });
      }
    }

    const { exportCompositionToBlob } = await import("../../render/export.mjs");
    const blob = await import("../../render/export.mjs").then(m => m.exportCompositionToBlob(composition, this._api._catalog, {
      format: "png", background: "transparent",
      canvasWidth: composition.exportOptions?.canvasWidth || 1024,
      canvasHeight: composition.exportOptions?.canvasHeight || 1024
    }));

    const imageUrl = URL.createObjectURL(blob);
    const results = { success: [], failed: [], partial: false };

    try {
      for (const actor of targetActors) {
        try {
          const updates = {};
          if (options.updatePrototype && actor.prototypeToken) {
            updates.prototypeToken = { ...actor.prototypeToken, texture: { src: imageUrl } };
          }
          if (options.updateToken !== false) updates.img = imageUrl;
          if (Object.keys(updates).length > 0) await actor.update(updates);
          if (options.updateSelected && canvas.tokens) {
            for (const token of canvas.tokens.controlled) {
              if (token.actor === actor && token.document.hasPlayerOwner && !game.user.isGM) continue;
              await token.document.update({ texture: { src: imageUrl } });
            }
          }
          results.success.push(actor.id);
        } catch (err) {
          console.error(`[letargia-character-creat] Failed to apply to ${actor.id}:`, err);
          results.failed.push({ actor: actor.id, error: err.message });
          results.partial = true;
        }
      }

      if (options.upload && game.user.isGM) {
        try {
          const filename = `${sourceActor.name}-character-${Date.now()}.png`.replace(/[^a-zA-Z0-9.-]/g, "_");
          await FilePicker.upload("data", `letargia-character-creat/${filename}`, blob, { type: "image/png" });
        } catch (uploadErr) {
          console.warn(`[letargia-character-creat] Upload failed, image still applied locally:`, uploadErr);
        }
      }

      await fire("letargia-character-creat.imageApplied", sourceActor, targetActors, imageUrl, options);
      return results;
    } finally {
      setTimeout(() => URL.revokeObjectURL(imageUrl), 60000);
    }
  }
}