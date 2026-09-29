/**
 * Actor Integration for LETARGIA CHARACTER CREAT
 * Handles injecting the character creator button into actor sheets
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { getApi } from "../letargia-character-creat.mjs";

/**
 * Inject character creator button into actor sheet
 * @param {ActorSheet} sheet - The actor sheet
 * @param {HTMLElement} html - The sheet HTML
 * @param {Object} data - Sheet data
 */
export function injectButton(sheet, html, data) {
  // Check if actor is supported
  if (!isSupportedActor(sheet.actor)) return;
  
  // Check permissions
  if (!sheet.actor.testUserPermission(game.user, "UPDATE")) return;
  
  // Check if button already exists
  if (html.querySelector(".letargia-character-creat-btn")) return;
  
  // Find insertion point
  const header = html.querySelector(".sheet-header, .window-header, header");
  if (!header) return;
  
  // Create button
  const button = createButton(sheet.actor);
  
  // Insert button
  const actions = header.querySelector(".window-controls, .header-actions, .sheet-actions");
  if (actions) {
    actions.appendChild(button);
  } else {
    header.appendChild(button);
  }
}

/**
 * Check if actor type is supported
 * @param {Actor} actor - The actor
 * @returns {boolean}
 */
function isSupportedActor(actor) {
  // Support all actor types by default
  // Can be configured via settings later
  return true;
}

/**
 * Create the character creator button
 * @param {Actor} actor - The actor
 * @returns {HTMLButtonElement}
 */
function createButton(actor) {
  const button = document.createElement("button");
  button.className = "letargia-character-creat-btn";
  button.type = "button";
  button.title = game.i18n.localize("LETARGIA.CHARACTER_CREAT.Tooltips.OpenCreator");
  button.setAttribute("aria-label", game.i18n.localize("LETARGIA.CHARACTER_CREAT.Tooltips.OpenCreator"));
  
  // Icon + text
  button.innerHTML = `
    <i class="fas fa-user-cog"></i>
    <span class="letargia-btn-text">${game.i18n.localize("LETARGIA.CHARACTER_CREAT.Button.OpenCreator")}</span>
  `;
  
  // Click handler
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const api = getApi();
    if (api) {
      await api.openEditor(actor);
    }
  });
  
  return button;
}

/**
 * Handle hotbar drop for pieces
 * @param {Object} data - Drop data
 * @param {number} slot - Hotbar slot
 * @returns {boolean} Handled
 */
export async function handleHotbarDrop(data, slot) {
  // Future enhancement: allow dropping pieces onto hotbar
  return false;
}

/**
 * Open creator from actor sheet context menu
 * @param {Actor} actor - The actor
 * @returns {Promise<void>}
 */
export async function openFromContextMenu(actor) {
  const api = getApi();
  if (api) {
    await api.openEditor(actor);
  }
}

/**
 * Register context menu hook for actors
 */
export function registerContextMenu() {
  Hooks.on("getActorSheetContextOptions", (options, actor) => {
    if (!game.settings.get(MODULE_ID, "enabled")) return;
    if (!actor.testUserPermission(game.user, "UPDATE")) return;
    
    options.push({
      name: game.i18n.localize("LETARGIA.CHARACTER_CREAT.ContextMenu.OpenCreator"),
      icon: "<i class=\"fas fa-user-cog\"></i>",
      condition: () => true,
      callback: () => openFromContextMenu(actor)
    });
  });
}

/**
 * Alternative access via module menu for custom sheets
 * @returns {Promise<void>}
 */
export async function openFromModuleMenu() {
  // Get actors user has permission to edit
  const actors = game.actors.filter(a => a.testUserPermission(game.user, "UPDATE"));
  
  if (actors.length === 0) {
    ui.notifications.warn(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.NoActors"));
    return;
  }
  
  // If only one actor, open directly
  if (actors.length === 1) {
    const api = getApi();
    if (api) await api.openEditor(actors[0]);
    return;
  }
  
  // Multiple actors - show selector dialog
  const { ActorSelector } = await import("../ui/actor-selector.mjs");
  const selector = new ActorSelector(actors);
  await selector.render(true);
}