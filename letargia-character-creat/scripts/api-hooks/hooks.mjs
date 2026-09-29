/**
 * LETARGIA CHARACTER CREAT - Module Hooks
 * Custom hooks with module prefix for external integrations
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";

/**
 * Hook names with module prefix
 */
export const HookNames = {
  // Fired when API is fully initialized and ready for use
  API_READY: `${MODULE_ID}.apiReady`,
  
  // Fired when a pack is registered/unregistered
  CATALOG_CHANGED: `${MODULE_ID}.catalogChanged`,
  
  // Fired when editor is opened for an actor
  EDITOR_OPENED: `${MODULE_ID}.editorOpened`,
  
  // Fired when composition is successfully saved
  COMPOSITION_SAVED: `${MODULE_ID}.compositionSaved`,
  
  // Fired when export completes (success or failure)
  EXPORT_COMPLETED: `${MODULE_ID}.exportCompleted`,
  
  // Fired when image is applied to actor/token
  IMAGE_APPLIED: `${MODULE_ID}.imageApplied`,
  
  // Fired when a pack is registered
  PACK_REGISTERED: `${MODULE_ID}.packRegistered`,
  
  // Fired when a pack is unregistered
  PACK_UNREGISTERED: `${MODULE_ID}.packUnregistered`,
  
  // Fired when a category is registered
  CATEGORY_REGISTERED: `${MODULE_ID}.categoryRegistered`,
};

/**
 * Hook payload types for documentation
 * These are not runtime types but documentation for consumers
 */

/**
 * @typedef {Object} APIReadyHook
 * @property {string} moduleId - The module ID
 * @property {string} version - API version
 * @property {LetargiaCharacterCreat} api - The API instance
 */

/**
 * @typedef {Object} CatalogChangedHook
 * @property {string} packId - The pack ID that changed
 * @property {string} changeType - 'register' | 'unregister' | 'pieceAdded' | 'pieceRemoved'
 * @property {Object} [piece] - The piece data if applicable
 */

/**
 * @typedef {Object} EditorOpenedHook
 * @property {Actor} actor - The actor being edited
 * @property {CharacterEditor} editor - The editor instance
 */

/**
 * @typedef {Object} CompositionSavedHook
 * @property {Actor} actor - The actor whose composition was saved
 * @property {Object} composition - The saved composition
 * @property {boolean} isNew - Whether this is a new composition
 */

/**
 * @typedef {Object} ExportCompletedHook
 * @property {Object} composition - The exported composition
 * @property {string} format - Export format ('png' | 'webp' | 'json')
 * @property {Blob|string} data - The exported data
 * @property {Error} [error] - Error if export failed
 */

/**
 * @typedef {Object} ImageAppliedHook
 * @property {Actor} actor - The target actor
 * @property {TokenDocument[]} tokens - Updated tokens
 * @property {string} imageUrl - The applied image URL
 * @property {Object} options - Apply options used
 * @property {Error} [error] - Error if application failed
 */

/**
 * @typedef {Object} PackHook
 * @property {string} packId - The pack ID
 * @property {Object} packData - Pack metadata
 */

/**
 * @typedef {Object} CategoryHook
 * @property {string} categoryId - The category ID
 * @property {Object} categoryData - Category definition
 */

/**
 * Register a callback for a module hook
 * @param {string} hookName - Hook name from HookNames
 * @param {Function} callback - Callback function
 * @param {Object} [options] - Hook options
 * @returns {Function} Unregister function
 */
export function on(hookName, callback, options = {}) {
  const fullName = hookName.startsWith(MODULE_ID) ? hookName : `${MODULE_ID}.${hookName}`;
  Hooks.on(fullName, callback);
  
  return () => Hooks.off(fullName, callback);
}

/**
 * Register a one-time callback for a module hook
 * @param {string} hookName - Hook name from HookNames
 * @param {Function} callback - Callback function
 * @returns {Function} Unregister function
 */
export function once(hookName, callback) {
  const fullName = hookName.startsWith(MODULE_ID) ? hookName : `${MODULE_ID}.${hookName}`;
  Hooks.once(fullName, callback);
}

/**
 * Fire a module hook
 * @param {string} hookName - Hook name from HookNames
 * @param {...*} args - Arguments to pass to callbacks
 * @returns {Promise<any[]>} Results from all callbacks
 */
export async function fire(hookName, ...args) {
  const fullName = hookName.startsWith(MODULE_ID) ? hookName : `${MODULE_ID}.${hookName}`;
  return Hooks.callAll(fullName, ...args);
}

/**
 * Check if API is ready (useful for modules that load after this one)
 * @returns {Promise<LetargiaCharacterCreat>} The API instance
 */
export async function waitForAPI() {
  return new Promise((resolve) => {
    // Check if already ready
    if (game.letargiaCharacterCreat?._initialized) {
      resolve(game.letargiaCharacterCreat);
      return;
    }
    
    // Wait for ready hook
    const unregister = on(HookNames.API_READY, (api) => {
      unregister();
      resolve(api);
    });
  });
}

/**
 * Fire hook with error handling - individual callback failures don't stop others
 * @param {string} hookName - Hook name
 * @param {...*} args - Arguments
 */
export async function safeFire(hookName, ...args) {
  const fullName = hookName.startsWith(MODULE_ID) ? hookName : `${MODULE_ID}.${hookName}`;
  try {
    return await Hooks.callAll(fullName, ...args);
  } catch (err) {
    console.error(`[${MODULE_ID}] Hook ${fullName} failed:`, err);
    return [];
  }
}