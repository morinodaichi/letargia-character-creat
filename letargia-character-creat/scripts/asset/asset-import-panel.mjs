/**
 * Asset Import Panel - Main class
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { PieceCatalog } from "../catalog/piece-catalog.mjs";
import { validateFile, createPreview, generateDefaultMetadata, formatSize, CATEGORIES, THEMES } from "./asset-import-core.mjs";

export class AssetImportPanel extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = {
    id: "letargia-asset-import",
    window: { title: "LETARGIA.CHARACTER_CREAT.AssetImport.Title", icon: "fas fa-upload", resizable: true },
    position: { width: 800, height: 600 },
    tag: "div",
    classes: ["letargia-character-creat", "asset-import"]
  };

  constructor(options = {}) {
    super(options);
    this.catalog = PieceCatalog.getInstance();
    this._selectedFiles = [];
  }

  static get template() {
    return `modules/${MODULE_ID}/templates/asset-import.hbs`;
  }

  async _prepareContext() {
    const packs = this.catalog.getPacks();
    return { packs: Array.from(packs.values()), localize: (key) => game.i18n.localize(key), categories: getCategoryOptions(), themes: getThemeOptions() };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.querySelector(".letargia-file-input")?.addEventListener("change", (e) => this._onFilesSelected(e, html));
    const dropZone = html.querySelector(".letargia-drop-zone");
    if (dropZone) {
      dropZone.addEventListener("dragover", (e) => this._onDragOver(e));
      dropZone.addEventListener("dragleave", (e) => this._onDragLeave(e));
      dropZone.addEventListener("drop", (e) => this._onDrop(e, html));
    }
    html.querySelector(".letargia-btn-import-files")?.addEventListener("click", () => this._importFiles(html));
    html.querySelector(".letargia-btn-clear")?.addEventListener("click", () => this._clearFiles(html));
  }

  _onDragOver(e) { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }
  _onDragLeave(e) { e.currentTarget.classList.remove("drag-over"); }
  
  _onDrop(e, html) { e.preventDefault(); e.currentTarget.classList.remove("drag-over"); this._processFiles(Array.from(e.dataTransfer.files), html); }
  _onFilesSelected(e, html) { this._processFiles(Array.from(e.target.files), html); } 
}