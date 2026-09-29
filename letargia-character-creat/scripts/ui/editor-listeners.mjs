/**
 * Character Editor - Event Listeners (Part 1)
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";

export function activateListeners(editor, html) {
  html.querySelectorAll(".letargia-category-tab").forEach(tab => {
    tab.addEventListener("click", (ev) => onCategoryChange(editor, ev, html));
  });
  
  html.querySelector(".letargia-theme-select")?.addEventListener("change", (ev) => onThemeChange(editor, ev, html));
  html.querySelector(".letargia-search-input")?.addEventListener("input", (ev) => onSearch(editor, ev, html));
  
  attachPieceListeners(editor, html);
  
  html.querySelectorAll(".letargia-composition-piece .letargia-remove-piece").forEach(btn => {
    btn.addEventListener("click", (ev) => onRemovePiece(editor, ev, html));
  });
  
  html.querySelectorAll(".letargia-color-picker").forEach(input => {
    input.addEventListener("change", (ev) => onColorChange(editor, ev, html));
  });
  
  html.querySelector(".letargia-btn-save")?.addEventListener("click", () => onSave(editor));
  html.querySelector(".letargia-btn-cancel")?.addEventListener("click", () => onCancel(editor));
  html.querySelector(".letargia-btn-export")?.addEventListener("click", () => onExport(editor));
  html.querySelector(".letargia-btn-import")?.addEventListener("click", () => onImport(editor));
  html.querySelector(".letargia-btn-reset")?.addEventListener("click", () => onReset(editor, html));
  
  const dropZone = html.querySelector(".letargia-canvas-dropzone");
  if (dropZone) {
    dropZone.addEventListener("dragover", (ev) => onDragOver(ev));
    dropZone.addEventListener("drop", (ev) => onDrop(editor, ev, html));
    dropZone.addEventListener("dragleave", (ev) => onDragLeave(ev));
  }
  
  renderPreview(editor, html);
  setupCloseWarning(editor);
}

function onCategoryChange(editor, event, html) {
  editor._selectedCategory = event.currentTarget.dataset.category;
  refreshPieceList(editor, html);
}

function onThemeChange(editor, event, html) {
  editor._selectedTheme = event.target.value;
  refreshPieceList(editor, html);
}

function onSearch(editor, event, html) {
  editor._searchQuery = event.target.value;
  refreshPieceList(editor, html);
}

function refreshPieceList(editor, html) {
  const baseConfig = editor.composition.base;
  let pieces = editor.catalog.filterCompatible(baseConfig);
  
  if (editor._selectedCategory !== "all") pieces = pieces.filter(p => p.category === editor._selectedCategory);
  if (editor._selectedTheme !== "all") pieces = pieces.filter(p => p.themes.includes(editor._selectedTheme));
  if (editor._searchQuery) {
    const query = editor._searchQuery.toLowerCase();
    pieces = pieces.filter(p => {
      const name = p.metadata?.name || {};
      return `${name["pt-BR"] || ""} ${name["en"] || ""} ${p.id}`.toLowerCase().includes(query);
    });
  }
  
  const categories = editor._groupByCategory(pieces);
  const container = html.querySelector(".letargia-piece-list");
  if (container) {
    container.innerHTML = renderPieceList(editor, categories);
    attachPieceListeners(editor, html);
  }
  
  html.querySelectorAll(".letargia-category-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.category === editor._selectedCategory);
  });
}

function renderPieceList(editor, categories) {
  const pieces = categories[editor._selectedCategory] || categories.all || [];
  if (pieces.length === 0) {
    return `<div class="letargia-empty-state"><i class="fas fa-search"></i><p>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.EmptyState.NoPieces")}</p></div>`;
  }
  return pieces.map(piece => `
    <div class="letargia-piece-item ${piece._incompatible ? "incompatible" : ""}" 
         data-piece-id="${piece._fullId}" draggable="true"
         title="${piece._incompatible ? game.i18n.format("LETARGIA.CHARACTER_CREAT.Tooltips.Incompatible", { reason: piece._compatReason }) : ""}">
      <img src="${piece.thumbnail}" alt="" class="letargia-piece-thumb" loading="lazy">
      <div class="letargia-piece-info">
        <span class="letargia-piece-name">${piece.metadata?.name?.[game.i18n.lang] || piece.metadata?.name?.en || piece.id}</span>
        <span class="letargia-piece-category">${game.i18n.localize(`LETARGIA.CHARACTER_CREAT.Categories.${piece.category}`) || piece.category}</span>
      </div>
      ${piece._incompatible ? `<span class="letargia-incompatible-badge"><i class="fas fa-exclamation-triangle"></i></span>` : ""}
    </div>
  `).join("");
}

function attachPieceListeners(editor, html) {
  html.querySelectorAll(".letargia-piece-item").forEach(item => {
    item.addEventListener("click", (ev) => onPieceClick(editor, ev, html));
    item.addEventListener("dragstart", (ev) => onDragStart(editor, ev));
    item.addEventListener("dragend", (ev) => onDragEnd(editor, ev));
  });
}