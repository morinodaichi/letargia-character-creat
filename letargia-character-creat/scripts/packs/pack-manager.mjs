/**
 * LETARGIA CHARACTER CREAT - External Pack Manager (Part 1)
 * Pack registration, validation, and management
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { SchemaValidator } from "../validation/schema-validator.mjs";
import { fire, HookNames } from "../api-hooks/hooks.mjs";

const PACK_SCHEMA_VERSION = 1;
const MIN_API_VERSION = 1;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export class PackManager {
  constructor(catalog) {
    this.catalog = catalog;
    this.validator = new SchemaValidator();
    this._packs = new Map();
    this._registeredCategories = new Set();
    this._initialized = false;
  }

  async initialize() {
    if (this._initialized) return;
    this._initialized = true;
    console.log(`[${MODULE_ID}] Pack manager initialized`);
  }

  async registerPack(packId, manifest, packPath) {
    if (!/^[a-z0-9-]+$/.test(packId)) {
      throw this._createError('INVALID_PACK_ID', `Pack ID must be lowercase alphanumeric with hyphens: ${packId}`);
    }

    if (this._packs.has(packId)) {
      throw this._createError('PACK_EXISTS', `Pack already registered: ${packId}`);
    }

    const validation = this._validateManifest(manifest);
    if (!validation.valid) {
      throw this._createError('INVALID_MANIFEST', `Manifest validation failed: ${validation.errors.map(e => e.message).join('; ')}`);
    }

    if (manifest.apiVersion > this._getAPIVersion()) {
      throw this._createError('API_VERSION_MISMATCH', 
        `Pack requires API v${manifest.apiVersion}, current is v${this._getAPIVersion()}`);
    }

    this._validatePaths(manifest, packPath);
    this._checkDuplicateIds(manifest, packId);

    const registration = {
      manifest,
      packPath,
      enabled: true,
      registeredAt: new Date(),
      source: 'external'
    };

    this._packs.set(packId, registration);

    if (manifest.categories) {
      for (const [catId, catDef] of Object.entries(manifest.categories)) {
        this._registerCategory(catId, catDef, packId);
      }
    }

    await fire(HookNames.PACK_REGISTERED, packId, registration);
    await fire(HookNames.CATALOG_CHANGED, packId, 'register');

    console.log(`[${MODULE_ID}] Pack registered: ${packId} v${manifest.version || '1.0.0'}`);
    return registration;
  }
}