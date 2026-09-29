/**
 * Character Editor for LETARGIA CHARACTER CREAT
 * Main editor window using ApplicationV2 with full Stage 2 features
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { PieceCatalog } from "../catalog/piece-catalog.mjs";
import { CompositionManager } from "../state/composition-manager.mjs";
import { HistoryManager } from "../../history/history-manager.mjs";
import { renderComposition } from "../../render/composition-renderer.mjs";
import { applyCompositionToActor, getApplicableActors, showApplyDialog } from "../../import/import-export.mjs";
import { AssetImportPanel } from "../../asset/asset-import-panel.mjs";
import { activateListeners } from "./editor-listeners.mjs";
import { closeEditor, renderPreview } from "./editor-preview.mjs";
import { getSetting } from "../settings.mjs";

export class CharacterEditor extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = {
    id: "letargia-character-creat-editor",
    window: { title: "LETARGIA CHARACTER CREAT", icon: "fas fa-user-cog", minimizable: true, resizable: true },
    position: { width: 1280, height: 800 },
    tag: "div",
    classes: ["letargia-character-creat", "character-editor"]
  };

  constructor(actor, options = {}) {
    super(options);
    this.actor = actor;
    this.composition = null;
    this.catalog = PieceCatalog.getInstance();
    this.compositionManager = CompositionManager.getInstance();
    this.historyManager = null;
    this._selectedCategory = "all";
    this._selectedTheme = "all";
    this._searchQuery = "";
    this._draggedPiece = null;
    this._closeWarning = null;
    this._reduceMotion = false;
    this._keyboardShortcutsEnabled = true;
  }

  static get template() {
    return `modules/${MODULE_ID}/templates/character-editor.hbs`;
  }

  async _prepareContext() {
    this.composition = await this.compositionManager.loadComposition(this.actor);
    if (!this.composition) {
      this.composition = await this.compositionManager.createComposition(this.actor);
    }

    this.historyManager = new HistoryManager(this.composition);
    this.historyManager.initialize();

    this._reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const baseConfig = this.composition.base;
    const allPieces = this.catalog.filterCompatible(baseConfig);
    const categories = this._groupByCategory(allPieces);
    const themes = this.catalog.getThemes();
    const packs = this.catalog.getPacks();
    const bodies = this._getAvailableBodies();
    const poses = this._getAvailablePoses();
    const perspectives = this._getAvailablePerspectives();

    return {
      actor: this.actor, composition: this.composition, categories, themes,
      packs: Array.from(packs.values()), bodies, poses, perspectives,
      selectedCategory: this._selectedCategory, selectedTheme: this._selectedTheme,
      searchQuery: this._searchQuery, hasUnsavedChanges: this.compositionManager.isDirty(this.actor.id),
      historyInfo: this.historyManager.getHistoryInfo(),
      viewport: this.composition.viewport || { scale: 1, offsetX: 0, offsetY: 0, showGrid: true },
      reduceMotion: this._reduceMotion,
      localize: (key) => game.i18n.localize(key)
    };
  }

  _getAvailableBodies() {
    const bodies = new Set(["default-body"]);
    for (const piece of this.catalog.getAllPieces().values()) {
      if (piece.compatibility?.bodies) for (const b of piece.compatibility.bodies) bodies.add(b);
    }
    return Array.from(bodies).map(id => ({ id, label: game.i18n.localize(`LETARGIA.CHARACTER_CREAT.Bodies.${id}`) || id }));
  }

  _getAvailablePoses() {
    const poses = new Set(["default-pose"]);
    for (const piece of this.catalog.getAllPieces().values()) {
      if (piece.compatibility?.poses) for (const p of piece.compatibility.poses) poses.add(p);
    }
    return Array.from(poses).map(id => ({ id, label: game.i18n.localize(`LETARGIA.CHARACTER_CREAT.Poses.${id}`) || id }));
  }

  _getAvailablePerspectives() {
    const perspectives = new Set(["default-perspective"]);
    for (const piece of this.catalog.getAllPieces().values()) {
      if (piece.compatibility?.perspectives) for (const p of piece.compatibility.perspectives) perspectives.add(p);
    }
    return Array.from(perspectives).map(id => ({ id, label: game.i18n.localize(`LETARGIA.CHARACTER_CREAT.Perspectives.${id}`) || id }));
  }

  _groupByCategory(pieces) {
    const groups = { all: [] };
    for (const piece of pieces) {
      const cat = piece.category || "uncategorized";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(piece);
      groups.all.push(piece);
    }
    for (const key of Object.keys(groups)) groups[key].sort((a, b) => a.drawOrder - b.drawOrder);
    return groups;
  }

  activateListeners(html) {
    super.activateListeners(html);
    activateListeners(this, html);
    this._setupKeyboardShortcuts(html);
    this._setupViewportControls(html);
  }

  _setupKeyboardShortcuts(html) {
    if (!this._keyboardShortcutsEnabled) return;
    
    const handleKeydown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) this.redo();
            else this.undo();
            break;
          case "y":
            e.preventDefault();
            this.redo();
            break;
          case "s":
            e.preventDefault();
            this.save();
            break;
          case "e":
            e.preventDefault();
            this.export();
            break;
          case "r":
            e.preventDefault();
            this.resetView();
            break;
        }
      } else {
        switch (e.key) {
          case "Delete":
          case "Backspace":
            this.deleteSelectedPiece();
            break;
          case "Escape":
            this.clearSelection();
            break;
          case " ":
            e.preventDefault();
            this.togglePanMode();
            break;
        }
      }
    };

    this._keydownHandler = handleKeydown;
    document.addEventListener("keydown", this._keydownHandler);
  }

  _setupViewportControls(html) {
    const canvas = html.querySelector(".letargia-preview-canvas");
    if (!canvas) return;

    let isPanning = false;
    let lastX = 0, lastY = 0;

    canvas.addEventListener("wheel", (e) => this._onWheel(e, html), { passive: false });
    canvas.addEventListener("mousedown", (e) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        isPanning = true;
        lastX = e.clientX; lastY = e.clientY;
        canvas.style.cursor = "grabbing";
        e.preventDefault();
      }
    });
    canvas.addEventListener("mousemove", (e) => {
      if (isPanning) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        this.panViewport(dx, dy);
        lastX = e.clientX; lastY = e.clientY;
      }
    });
    canvas.addEventListener("mouseup", () => { isPanning = false; canvas.style.cursor = ""; });
    canvas.addEventListener("mouseleave", () => { isPanning = false; canvas.style.cursor = ""; });
  }

  _onWheel(e, html) {
    e.preventDefault();
    const canvas = html.querySelector(".letargia-preview-canvas");
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    this.zoomViewport(zoomFactor, x, y, html);
  }

  async save() {
    const success = await this.compositionManager.saveComposition(this.actor, this.composition);
    if (success) {
      ui.notifications.info(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.Saved"));
      await this.render();
    }
  }

  async cancel() {
    if (this.compositionManager.isDirty(this.actor.id)) {
      const confirm = window.confirm(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Dialogs.DiscardChanges"));
      if (!confirm) return;
    }
    this.composition = await this.compositionManager.loadComposition(this.actor);
    await this.render();
  }

  async export() {
    const catalog = PieceCatalog.getInstance();
    const { downloadComposition } = await import("../../render/export.mjs");
    await downloadComposition(this.composition, catalog, { format: "png" });
    ui.notifications.info(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.Exported"));
  }

  async import() {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = async (event) => {
      const file = event.target.files[0]; if (!file) return;
      const text = await file.text();
      try {
        const imported = this.compositionManager.importComposition(text);
        this.composition = imported;
        this.compositionManager.updateComposition(this.actor.id, () => imported);
        this.historyManager = new HistoryManager(this.composition);
        this.historyManager.initialize();
        await this.render();
        ui.notifications.info(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.Imported"));
      } catch (error) {
        ui.notifications.error(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.ImportFailed"));
      }
    };
    input.click();
  }

  async apply() {
    const result = await showApplyDialog(this.actor, this.composition);
    if (!result) return;
    
    const success = await applyCompositionToActor(this.actor, this.composition, {
      targetActors: result.actors,
      updateToken: result.updateToken,
      updatePrototype: result.updatePrototype,
      updateSelected: result.updateSelected
    });
    
    if (success.success.length > 0) {
      ui.notifications.info(game.i18n.format("LETARGIA.CHARACTER_CREAT.Notifications.Applied", { count: success.success.length }));
    }
    if (success.failed.length > 0) {
      ui.notifications.warn(game.i18n.format("LETARGIA.CHARACTER_CREAT.Notifications.PartialApply", { count: success.failed.length }));
    }
  }

  async openAssetImport() {
    const panel = new AssetImportPanel();
    await panel.render(true);
  }

  async randomize() {
    const baseConfig = this.composition.base;
    const compatiblePieces = this.catalog.filterCompatible(baseConfig).filter(p => !p._incompatible);
    if (compatiblePieces.length === 0) {
      ui.notifications.warn(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.NoCompatiblePieces"));
      return;
    }

    this.historyManager.save("randomize");

    const categories = this._groupByCategory(compatiblePieces);
    const newPieces = [];
    
    for (const [cat, pieces] of Object.entries(categories)) {
      if (cat === "all" || pieces.length === 0) continue;
      if (Math.random() > 0.3) continue;
      
      const piece = pieces[Math.floor(Math.random() * pieces.length)];
      const exists = this.composition.pieces.some(p => p.pieceId === piece.id && p.packId === piece._packId);
      if (!exists) {
        newPieces.push({
          pieceId: piece.id, packId: piece._packId, packVersion: "1", enabled: true,
          layers: piece.layers.map(l => ({ layerId: l.id, enabled: true, opacity: l.opacity || 1, blendMode: l.blendMode || "normal", visible: true })),
          colorChoices: {}, transform: { x: 0, y: 0, scale: 1, rotation: 0 }
        });
      }
    }

    this.compositionManager.updateComposition(this.actor.id, comp => {
      comp.pieces.push(...newPieces);
      comp.metadata.updatedAt = new Date().toISOString();
      return comp;
    });

    await this.render();
    ui.notifications.info(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.Randomized"));
  }

  undo() {
    const result = this.historyManager?.undo();
    if (result) {
      this._updateHistoryInfo();
      this.render();
    }
  }

  redo() {
    const result = this.historyManager?.redo();
    if (result) {
      this._updateHistoryInfo();
      this.render();
    }
  }

  _updateHistoryInfo() {
    const info = this.historyManager?.getHistoryInfo();
    const undoBtn = this.element?.querySelector(".letargia-btn-undo");
    const redoBtn = this.element?.querySelector(".letargia-btn-redo");
    if (undoBtn) undoBtn.disabled = !info.canUndo;
    if (redoBtn) redoBtn.disabled = !info.canRedo;
  }

  async resetView() {
    this.composition.viewport = { scale: 1, offsetX: 0, offsetY: 0, showGrid: true };
    await this.render();
  }

  zoomViewport(factor, centerX, centerY, html) {
    const viewport = this.composition.viewport || { scale: 1, offsetX: 0, offsetY: 0, showGrid: true };
    const newScale = Math.max(0.1, Math.min(10, viewport.scale * factor));
    
    const scaleRatio = newScale / viewport.scale;
    viewport.offsetX = centerX - (centerX - viewport.offsetX) * scaleRatio;
    viewport.offsetY = centerY - (centerY - viewport.offsetY) * scaleRatio;
    viewport.scale = newScale;
    
    this.compositionManager.updateComposition(this.actor.id, comp => {
      comp.viewport = viewport;
      return comp;
    });
    
    this._renderPreview(html);
  }

  panViewport(dx, dy) {
    const viewport = this.composition.viewport || { scale: 1, offsetX: 0, offsetY: 0, showGrid: true };
    viewport.offsetX += dx / viewport.scale;
    viewport.offsetY += dy / viewport.scale;
    
    this.compositionManager.updateComposition(this.actor.id, comp => {
      comp.viewport = viewport;
      return comp;
    });
  }

  resetViewport() {
    this.composition.viewport = { scale: 1, offsetX: 0, offsetY: 0, showGrid: true };
    this._renderPreview(this.element);
  }

  togglePanMode() {
    const canvas = this.element?.querySelector(".letargia-preview-canvas");
    if (canvas) canvas.classList.toggle("pan-mode");
  }

  clearSelection() {
    const selected = this.element?.querySelector(".letargia-composition-piece.selected");
    if (selected) selected.classList.remove("selected");
  }

  deleteSelectedPiece() {
    const selected = this.element?.querySelector(".letargia-composition-piece.selected");
    if (selected) {
      const pieceId = selected.dataset.pieceId;
      const packId = selected.dataset.packId;
      this.historyManager.save("delete piece");
      
      this.compositionManager.updateComposition(this.actor.id, comp => {
        comp.pieces = comp.pieces.filter(p => !(p.pieceId === pieceId && p.packId === packId));
        comp.metadata.updatedAt = new Date().toISOString();
        return comp;
      });
      this.render();
    }
  }

  async onBaseChange(baseConfig) {
    const compatiblePieces = this.catalog.filterCompatible(baseConfig);
    const incompatible = this.composition.pieces.filter(p => {
      const piece = this.catalog.getPiece(`${p.packId}:${p.pieceId}`);
      return piece && piece.compatibility && (
        (!piece.compatibility.bodies.includes("*") && !piece.compatibility.bodies.includes(baseConfig.bodyId)) ||
        (!piece.compatibility.poses.includes("*") && !piece.compatibility.poses.includes(baseConfig.poseId)) ||
        (!piece.compatibility.perspectives.includes("*") && !piece.compatibility.perspectives.includes(baseConfig.perspectiveId))
      );
    });

    if (incompatible.length > 0) {
      const confirm = window.confirm(
        game.i18n.format("LETARGIA.CHARACTER_CREAT.Dialogs.BaseChangeIncompatible", { 
          count: incompatible.length 
        })
      );
      if (!confirm) return false;
    }

    this.historyManager.save("change base");
    
    this.compositionManager.updateComposition(this.actor.id, comp => {
      comp.base = { ...comp.base, ...baseConfig };
      comp.metadata.updatedAt = new Date().toISOString();
      return comp;
    });
    
    return true;
  }

  _renderPreview(html) {
    const canvas = html.querySelector(".letargia-preview-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    renderComposition(ctx, this.composition, this.catalog, {
      width: canvas.width, height: canvas.height,
      isPreview: true,
      viewport: this.composition.viewport || { scale: 1, offsetX: 0, offsetY: 0, showGrid: true },
      showGrid: this.composition.viewport?.showGrid !== false
    });
  }

  async close() {
    if (this._keydownHandler) document.removeEventListener("keydown", this._keydownHandler);
    clearImageCache();
    return closeEditor(this);
  }
}
