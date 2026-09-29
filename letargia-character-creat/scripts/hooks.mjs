/**
 * Hooks Registration for LETARGIA CHARACTER CREAT
 */

import { MODULE_ID } from "./letargia-character-creat.mjs";
import { ActorIntegration } from "./integration/actor-integration.mjs";
import { CompositionManager } from "./state/composition-manager.mjs";

/**
 * Register Foundry hooks
 */
export function registerHooks() {
  // Register actor sheet integration
  Hooks.on("renderActorSheet", (sheet, html, data) => {
    if (game.settings.get(MODULE_ID, "enabled")) {
      ActorIntegration.injectButton(sheet, html, data);
    }
  });

  // Register context menu for actor sheets
  ActorIntegration.registerContextMenu();

  // Handle actor updates for composition sync
  Hooks.on("updateActor", (actor, changes, options, userId) => {
    CompositionManager.onActorUpdate(actor, changes);
  });

  // Handle actor deletion
  Hooks.on("deleteActor", (actor) => {
    CompositionManager.onActorDelete(actor);
  });

  // Handle scene ready - initialize any token previews
  Hooks.on("ready", () => {
    CompositionManager.onReady();
  });

  // Handle module settings changes
  Hooks.on("settingChanged", (setting, value) => {
    if (setting.startsWith(`${MODULE_ID}.`)) {
      CompositionManager.onSettingChanged(setting, value);
    }
  });

  // Handle hotbar drop for pieces (future enhancement)
  Hooks.on("hotbarDrop", (bar, data, slot) => {
    if (data.type === "Item" && data.data?.system?.letargiaPiece) {
      return ActorIntegration.handleHotbarDrop(data, slot);
    }
  });

  console.log(`[${MODULE_ID}] Hooks registered`);
}

/**
 * Unregister hooks (for cleanup)
 */
export function unregisterHooks() {
  // Hooks are automatically cleaned up by Foundry on module disable
  console.log(`[${MODULE_ID}] Hooks unregistered`);
}