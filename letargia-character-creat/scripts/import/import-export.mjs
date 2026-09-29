/**
 * Import/Export utilities for LETARGIA CHARACTER CREAT
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { exportCompositionToBlob, downloadComposition } from "../render/export.mjs";
import { PieceCatalog } from "../catalog/piece-catalog.mjs";

export async function applyCompositionToActor(actor, composition, options = {}) {
  const { targetActors = [actor], updateToken = true, updatePrototype = false, updateSelected = false } = options;
  const results = { success: [], failed: [], partial: false };

  const catalog = PieceCatalog.getInstance();
  let blob;
  try {
    blob = await exportCompositionToBlob(composition, catalog, { format: "png", background: "transparent" });
  } catch (err) {
    console.error(`[${MODULE_ID}] Export failed:`, err);
    return { success: [], failed: [{ actor: actor.id, error: "Export failed" }], partial: true };
  }

  const imageUrl = URL.createObjectURL(blob);

  for (const targetActor of targetActors) {
    try {
      await applyImageToActor(targetActor, imageUrl, options);
      results.success.push(targetActor.id);
    } catch (err) {
      console.error(`[${MODULE_ID}] Failed to apply to ${targetActor.id}:`, err);
      results.failed.push({ actor: targetActor.id, error: err.message });
      results.partial = true;
    }
  }

  setTimeout(() => URL.revokeObjectURL(imageUrl), 60000);
  return results;
}

async function applyImageToActor(actor, imageUrl, options) {
  const updates = {};
  if (options.updatePrototype && actor.prototypeToken) {
    updates.prototypeToken = { ...actor.prototypeToken, texture: { src: imageUrl } };
  }
  if (options.updateToken) { updates.img = imageUrl; }
  if (Object.keys(updates).length > 0) await actor.update(updates);
  if (options.updateSelected && canvas.tokens) {
    for (const token of canvas.tokens.controlled) {
      if (token.actor === actor && token.document.hasPlayerOwner && !game.user.isGM) continue;
      await token.document.update({ texture: { src: imageUrl } });
    }
  }
}

export function getApplicableActors(sourceActor, includeSelected = false) {
  const actors = new Map();
  if (sourceActor.testUserPermission(game.user, "UPDATE")) actors.set(sourceActor.id, sourceActor);
  if (includeSelected && canvas.tokens) {
    for (const token of canvas.tokens.controlled) {
      if (token.actor && token.document.hasPlayerOwner && !game.user.isGM) continue;
      if (token.actor.testUserPermission(game.user, "UPDATE")) actors.set(token.actor.id, token.actor);
    }
  }
  return Array.from(actors.values());
}

export async function showApplyDialog(actor, composition) {
  const actors = getApplicableActors(actor, true);
  return new Promise((resolve) => {
    const dialog = new foundry.applications.api.DialogV2({
      window: { title: game.i18n.localize("LETARGIA.CHARACTER_CREAT.ApplyDialog.Title") },
      content: `
        <div class="letargia-apply-dialog">
          <p>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.ApplyDialog.Description")}</p>
          <fieldset><legend>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.ApplyDialog.Targets")}</legend>
            ${actors.map(a => `<label class="letargia-apply-target"><input type="checkbox" name="targets" value="${a.id}" ${a.id === actor.id ? "checked" : ""}><span>${a.name} (${a.type})</span></label>`).join("")}
          </fieldset>
          <fieldset><legend>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.ApplyDialog.Options")}</legend>
            <label><input type="checkbox" name="updateToken" checked> ${game.i18n.localize("LETARGIA.CHARACTER_CREAT.ApplyDialog.UpdateToken")}</label>
            <label><input type="checkbox" name="updatePrototype"> ${game.i18n.localize("LETARGIA.CHARACTER_CREAT.ApplyDialog.UpdatePrototype")}</label>
            <label><input type="checkbox" name="updateSelected"> ${game.i18n.localize("LETARGIA.CHARACTER_CREAT.ApplyDialog.UpdateSelected")}</label>
          </fieldset>
          <fieldset><legend>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.ApplyDialog.Upload")}</legend>
            <label><input type="checkbox" name="upload" checked> ${game.i18n.localize("LETARGIA.CHARACTER_CREAT.ApplyDialog.UploadToServer")}</label>
            <small>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.ApplyDialog.UploadHint")}</small>
          </fieldset>
        </div>
      `,
      buttons: [
        { action: "apply", label: game.i18n.localize("LETARGIA.CHARACTER_CREAT.Button.Apply"), default: true },
        { action: "cancel", label: game.i18n.localize("LETARGIA.CHARACTER_CREAT.Button.Cancel") }
      ],
      callback: (event, button, formData) => {
        if (button.action === "apply") {
          const targets = formData.targets || [];
          const selectedActors = actors.filter(a => targets.includes(a.id));
          resolve({ actors: selectedActors, updateToken: formData.updateToken, updatePrototype: formData.updatePrototype, updateSelected: formData.updateSelected, upload: formData.upload });
        } else { resolve(null); }
      }
    });
    dialog.render(true);
  });
}