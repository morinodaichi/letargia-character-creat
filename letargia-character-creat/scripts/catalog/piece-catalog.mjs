/**
 * Piece Catalog for LETARGIA CHARACTER CREAT
 * Manages piece packs, pieces, and their metadata
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { SchemaValidator } from "../validation/schema-validator.mjs";
import { generateDemoPieces } from "./demo-pieces.mjs";

/**
 * Piece Catalog - Singleton
 */
export class PieceCatalog {
  constructor() {
    if (PieceCatalog._instance) {
      return PieceCatalog._instance;
    }
    
    this._packs = new Map();
    this._pieces = new Map();
    this._piecesByCategory = new Map();
    this._piecesByTheme = new Map();
    this._validator = new SchemaValidator();
    this._loaded = false;
    
    PieceCatalog._instance = this;
  }

  static getInstance() {
    if (!PieceCatalog._instance) {
      PieceCatalog._instance = new PieceCatalog();
    }
    return PieceCatalog._instance;
  }

  static initialize() {
    return PieceCatalog.getInstance();
  }

  /**
   * Load all packs from compendiums
   * @returns {Promise<void>}
   */
  async load() {
    if (this._loaded) return;
    
    const packs = game.packs.filter(p => p.metadata?.system === MODULE_ID);
    
    for (const pack of packs) {
      await this._loadPack(pack);
    }
    
    if (this._packs.size === 0) {
      await this._loadDemoPieces();
    }
    
    this._loaded = true;
    console.log(`[${MODULE_ID}] Piece catalog loaded: ${this._packs.size} packs, ${this._pieces.size} pieces`);
  }

  async _loadPack(pack) {
    try {
      const documents = await pack.getDocuments();
      
      for (const doc of documents) {
        const data = doc.toObject?.() || doc;
        if (data.system?.letargiaPiece) {
          this._registerPiece(data, pack.id);
        }
      }
      
      this._packs.set(pack.id, {
        id: pack.id,
        label: pack.metadata.label,
        system: pack.metadata.system,
        pieceCount: documents.filter(d => d.system?.letargiaPiece).length
      });
    } catch (error) {
      console.error(`[${MODULE_ID}] Failed to load pack ${pack.id}:`, error);
    }
  }

  _registerPiece(pieceData, packId) {
    const piece = {
      ...pieceData.system,
      _packId: packId,
      _itemId: pieceData.id,
      _source: "compendium"
    };
    
    const validation = this._validator.validatePiece(piece);
    if (!validation.valid) {
      console.warn(`[${MODULE_ID}] Piece validation failed for ${piece.id}:`, validation.errors);
      piece._validationErrors = validation.errors;
    }
    
    const fullId = `${packId}:${piece.id}`;
    this._pieces.set(fullId, piece);
    
    const category = piece.category || "uncategorized";
    if (!this._piecesByCategory.has(category)) {
      this._piecesByCategory.set(category, new Map());
    }
    this._piecesByCategory.get(category).set(fullId, piece);
    
    for (const theme of piece.themes || []) {
      if (!this._piecesByTheme.has(theme)) {
        this._piecesByTheme.set(theme, new Map());
      }
      this._piecesByTheme.get(theme).set(fullId, piece);
    }
  }

  async _loadDemoPieces() {
    const demoPieces = generateDemoPieces();
    
    for (const piece of demoPieces) {
      this._registerPiece({ id: piece.id, system: piece }, "demo");
    }
    
    this._packs.set("demo", {
      id: "demo",
      label: "Demo Pieces (Built-in)",
      system: MODULE_ID,
      pieceCount: demoPieces.length
    });
  }

  getAllPieces() { return this._pieces; }
  getPiece(pieceId) { return this._pieces.get(pieceId) || null; }
  getPiecesByCategory(category) { return this._piecesByCategory.get(category) || new Map(); }
  getPiecesByTheme(theme) { return this._piecesByTheme.get(theme) || new Map(); }
  getCategories() { return Array.from(this._piecesByCategory.keys()).sort(); }
  getThemes() { return Array.from(this._piecesByTheme.keys()).sort(); }
  getPacks() { return this._packs; }
  getPack(packId) { return this._packs.get(packId) || null; }

  filterCompatible(baseConfig, themes = []) {
    const results = [];
    
    for (const [id, piece] of this._pieces) {
      if (themes.length > 0 && !piece.themes.some(t => themes.includes(t))) continue;
      
      const compat = piece.compatibility;
      const bodyMatch = compat.bodies.includes("*") || compat.bodies.includes(baseConfig.bodyId);
      const poseMatch = compat.poses.includes("*") || compat.poses.includes(baseConfig.poseId);
      const perspectiveMatch = compat.perspectives.includes("*") || compat.perspectives.includes(baseConfig.perspectiveId);
      
      if (bodyMatch && poseMatch && perspectiveMatch) {
        results.push({ ...piece, _fullId: id });
      } else {
        results.push({ ...piece, _fullId: id, _incompatible: true, _compatReason: this._getCompatReason(compat, baseConfig) });
      }
    }
    
    return results.sort((a, b) => a.drawOrder - b.drawOrder);
  }

  _getCompatReason(compat, baseConfig) {
    const reasons = [];
    if (!compat.bodies.includes("*") && !compat.bodies.includes(baseConfig.bodyId)) reasons.push(`body:${baseConfig.bodyId}`);
    if (!compat.poses.includes("*") && !compat.poses.includes(baseConfig.poseId)) reasons.push(`pose:${baseConfig.poseId}`);
    if (!compat.perspectives.includes("*") && !compat.perspectives.includes(baseConfig.perspectiveId)) reasons.push(`perspective:${baseConfig.perspectiveId}`);
    return reasons.join(", ");
  }

  search(query) {
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    for (const [id, piece] of this._pieces) {
      const name = piece.metadata?.name || {};
      const searchText = `${name["pt-BR"] || ""} ${name["en"] || ""} ${piece.id} ${piece.category} ${(piece.themes || []).join(" ")}`.toLowerCase();
      
      if (searchText.includes(lowerQuery)) {
        results.push({ ...piece, _fullId: id });
      }
    }
    
    return results;
  }
}