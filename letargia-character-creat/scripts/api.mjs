/**
 * LETARGIA CHARACTER CREAT - Public API Entry Point
 * Exports the main API class and singleton getter
 */

import { LetargiaCharacterCreatAPI } from "./api/api-main.mjs";
export { LetargiaCharacterCreatAPI } from "./api/api-main.mjs";
export { getAPI, api } from "./api/api-main.mjs";
export { createError, ErrorCodes, API_VERSION } from "./api/api-errors.mjs";
export { onHook, onceHook, HookNames, waitForAPI } from "../api-hooks/hooks.mjs";