/**
 * LETARGIA CHARACTER CREAT - Pack Manager Operations (Part 2)
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { fire, HookNames } from "../api-hooks/hooks.mjs";

export class PackManagerOperations {
  constructor(manager) {
    this._manager = manager;
  }

  async unregisterPack(packId) {
    const registration = this._manager._packs.get(packId);
    if (!registration) return false;

    if (registration.manifest.pieces) {
      for (const piece of registration.manifest.pieces) {
        const fullId = `${packId}:${piece.id}`;
        this._manager.catalog._pieces.delete(fullId);
        const cat = piece.category || 'uncategorized';
        this._manager.catalog._piecesByCategory.get(cat)?.delete(fullId);
        for (const theme of piece.themes || []) {
          this._manager.catalog._piecesByTheme.get(theme)?.delete(fullId);
        }
      }
    }

    this._manager.catalog._packs.delete(packId);
    this._manager._packs.delete(packId);

    await fire(HookNames.PACK_UNREGISTERED, packId, registration);
    await fire(HookNames.CATALOG_CHANGED, packId, 'unregister');

    console.log(`[${MODULE_ID}] Pack unregistered: ${packId}`);
    return true;
  }

  listPacks() {
    return Array.from(this._manager._packs.values()).map(reg => ({
      packId: reg.manifest.id,
      name: reg.manifest.name,
      version: reg.manifest.version,
      author: reg.manifest.author,
      enabled: reg.enabled,
      registeredAt: reg.registeredAt,
      source: reg.source,
      pieceCount: reg.manifest.pieces?.length || 0,
      hasCustomCategories: !!reg.manifest.categories,
      hasCustomThemes: !!reg.manifest.themes,
      hasCustomPalettes: !!reg.manifest.palettes
    }));
  }

  listParts(filters = {}) {
    const { packId, category, theme, search } = filters;
    let pieces = [];

    if (packId) {
      const reg = this._manager._packs.get(packId);
      if (!reg) return [];
      pieces = (reg.manifest.pieces || []).map(p => ({ ...p, _packId: packId }));
    } else {
      for (const [pid, reg] of this._manager._packs) {
        if (!reg.enabled) continue;
        pieces.push(...(reg.manifest.pieces || []).map(p => ({ ...p, _packId: pid })));
      }
    }

    if (category) pieces = pieces.filter(p => p.category === category);
    if (theme) pieces = pieces.filter(p => p.themes?.includes(theme));
    if (search) {
      const query = search.toLowerCase();
      pieces = pieces.filter(p => {
        const name = p.metadata?.name || {};
        return `${name["pt-BR"] || ""} ${name["en"] || ""} ${p.id}`.toLowerCase().includes(query);
      });
    }

    return pieces.map(p => ({ ...p, _fullId: `${p._packId}:${p.id}` }));
  }

  setPackEnabled(packId, enabled) {
    const reg = this._manager._packs.get(packId);
    if (!reg) return false;
    reg.enabled = enabled;
    fire(HookNames.CATALOG_CHANGED, packId, enabled ? 'enable' : 'disable');
    return true;
  }

  _registerCategory(categoryId, definition, packId) {
    if (!this._manager._registeredCategories.has(categoryId)) {
      this._manager._registeredCategories.add(categoryId);
      fire(HookNames.CATEGORY_REGISTERED, categoryId, { ...definition, _packId: packId });
    }
  }

  getPack(packId) {
    return this._manager._packs.get(packId) || null;
  }

  isPackEnabled(packId) {
    const reg = this._manager._packs.get(packId);
    return reg?.enabled === true;
  }

  getCategories() {
    return Array.from(this._manager._registeredCategories);
  }
}