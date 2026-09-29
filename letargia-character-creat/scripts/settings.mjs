/**
 * Settings Registration for LETARGIA CHARACTER CREAT
 */

import { MODULE_ID } from "./letargia-character-creat.mjs";

/**
 * Register module settings
 */
export function registerSettings() {
  // Enable/disable the module
  game.settings.register(MODULE_ID, "enabled", {
    name: "LETARGIA.CHARACTER_CREAT.Settings.Enabled.Name",
    hint: "LETARGIA.CHARACTER_CREAT.Settings.Enabled.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      // Refresh UI if needed
      if (game.letargiaCharacterCreat?.editor) {
        game.letargiaCharacterCreat.editor.refresh();
      }
    }
  });

  // Debug mode
  game.settings.register(MODULE_ID, "debug", {
    name: "LETARGIA.CHARACTER_CREAT.Settings.Debug.Name",
    hint: "LETARGIA.CHARACTER_CREAT.Settings.Debug.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Default canvas dimensions
  game.settings.register(MODULE_ID, "defaultCanvasWidth", {
    name: "LETARGIA.CHARACTER_CREAT.Settings.DefaultCanvasWidth.Name",
    hint: "LETARGIA.CHARACTER_CREAT.Settings.DefaultCanvasWidth.Hint",
    scope: "world",
    config: true,
    type: Number,
    default: 512,
    choices: {
      256: "256px",
      512: "512px",
      1024: "1024px",
      2048: "2048px"
    }
  });

  game.settings.register(MODULE_ID, "defaultCanvasHeight", {
    name: "LETARGIA.CHARACTER_CREAT.Settings.DefaultCanvasHeight.Name",
    hint: "LETARGIA.CHARACTER_CREAT.Settings.DefaultCanvasHeight.Hint",
    scope: "world",
    config: true,
    type: Number,
    default: 768,
    choices: {
      384: "384px",
      512: "512px",
      768: "768px",
      1024: "1024px",
      1536: "1536px"
    }
  });

  // Auto-save interval (in seconds, 0 = disabled)
  game.settings.register(MODULE_ID, "autoSaveInterval", {
    name: "LETARGIA.CHARACTER_CREAT.Settings.AutoSaveInterval.Name",
    hint: "LETARGIA.CHARACTER_CREAT.Settings.AutoSaveInterval.Hint",
    scope: "world",
    config: true,
    type: Number,
    default: 30,
    choices: {
      0: "LETARGIA.CHARACTER_CREAT.Settings.AutoSaveInterval.Disabled",
      10: "10s",
      30: "30s",
      60: "1min",
      300: "5min"
    }
  });

  // Show compatibility warnings
  game.settings.register(MODULE_ID, "showCompatibilityWarnings", {
    name: "LETARGIA.CHARACTER_CREAT.Settings.ShowCompatibilityWarnings.Name",
    hint: "LETARGIA.CHARACTER_CREAT.Settings.ShowCompatibilityWarnings.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  // Language override
  game.settings.register(MODULE_ID, "languageOverride", {
    name: "LETARGIA.CHARACTER_CREAT.Settings.LanguageOverride.Name",
    hint: "LETARGIA.CHARACTER_CREAT.Settings.LanguageOverride.Hint",
    scope: "world",
    config: true,
    type: String,
    default: "",
    choices: {
      "": "LETARGIA.CHARACTER_CREAT.Settings.LanguageOverride.System",
      "en": "English",
      "pt-BR": "Português (Brasil)"
    }
  });
}

/**
 * Get a setting value
 * @param {string} key - Setting key
 * @returns {*} Setting value
 */
export function getSetting(key) {
  return game.settings.get(MODULE_ID, key);
}

/**
 * Set a setting value
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 * @returns {Promise<void>}
 */
export async function setSetting(key, value) {
  return game.settings.set(MODULE_ID, key, value);
}