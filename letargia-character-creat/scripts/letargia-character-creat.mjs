/**
 * LETARGIA CHARACTER CREAT - Main Entry Point
 * Foundry VTT v13 Module
 * 
 * Module ID: letargia-character-creat
 * Brand: LETARGIA
 */

import { LetargiaCharacterCreat } from "./api.mjs";
import { registerSettings } from "./settings.mjs";
import { registerHooks } from "./hooks.mjs";
import { PieceCatalog } from "./catalog/piece-catalog.mjs";
import { CompositionManager } from "./state/composition-manager.mjs";
import { ActorIntegration } from "./integration/actor-integration.mjs";

// Module namespace constant
export const MODULE_ID = "letargia-character-creat";

// Global API object
let api = null;

/**
 * Initialize the module
 */
export async function initialize() {
  // Register settings
  registerSettings();
  
  // Initialize catalog
  PieceCatalog.initialize();
  
  // Initialize composition manager
  CompositionManager.initialize();
  
  // Register hooks
  registerHooks();
  
  // Create and expose API
  api = new LetargiaCharacterCreat();
  
  // Make API globally accessible for other modules
  game.letargiaCharacterCreat = api;
  
  console.log(`[${MODULE_ID}] Module initialized`);
}

/**
 * Get the module API instance
 * @returns {LetargiaCharacterCreat}
 */
export function getApi() {
  return api;
}

// Auto-initialize when Foundry is ready
Hooks.once("init", initialize);