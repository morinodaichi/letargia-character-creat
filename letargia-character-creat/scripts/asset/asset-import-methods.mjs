/**
 * Asset Import Panel - File processing and UI methods
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { PieceCatalog } from "../catalog/piece-catalog.mjs";
import { validateFile, createPreview, generateDefaultMetadata, formatSize, CATEGORIES, THEMES, getCategoryOptions, getThemeOptions } from "./asset-import-core.mjs";

export class AssetImportPanelMethods {
  static async processFiles(that, files, html) {
    const validFiles = [];
    for (const file of files) {
      const validation = validateFile(file);
      if (validation.valid) validFiles.push({ file, ...validation });
      else ui.notifications.warn(`${file.name}: ${validation.error}`);
    }
    for (const f of validFiles) {
      const preview = await createPreview(f.file);
      that._selectedFiles.push({ ...f, preview, metadata: generateDefaultMetadata(f.file) });
    }
    AssetImportPanelMethods.renderFileList(that, html);
  }

  static renderFileList(that, html) {
    const container = html.querySelector(".letargia-asset-list");
    if (!container) return;
    container.innerHTML = that._selectedFiles.map((asset, index) => `
      <div class="letargia-asset-preview ${asset.selected ? "selected" : ""}" data-index="${index}">
        ${asset.preview ? `<img src="${asset.preview.url}" alt="${asset.file.name}">` : `<i class="fas fa-image"></i>`}
        <div class="letargia-asset-info"><span class="letargia-asset-name">${asset.file.name}</span><span class="letargia-asset-size">${formatSize(asset.file.size)} · ${asset.preview?.width || "?"}×${asset.preview?.height || "?"}</span></div>
        <i class="fas fa-check-circle letargia-asset-check"></i>
      </div>
    `).join("");
    container.querySelectorAll(".letargia-asset-preview").forEach(item => {
      item.addEventListener("click", (e) => AssetImportPanelMethods.toggleAssetSelection(that, e, html));
    });
  }

  static toggleAssetSelection(that, e, html) {
    const index = parseInt(e.currentTarget.dataset.index);
    that._selectedFiles[index].selected = !that._selectedFiles[index].selected;
    AssetImportPanelMethods.renderFileList(that, html);
    AssetImportPanelMethods.updateFormForSelection(that, html);
  }

  static updateFormForSelection(that, html) {
    const selected = that._selectedFiles.filter(f => f.selected);
    const formContainer = html.querySelector(".letargia-asset-form-container");
    if (!formContainer) return;
    if (selected.length === 1) { formContainer.style.display = "block"; AssetImportPanelMethods.populateForm(formContainer, selected[0]); }
    else if (selected.length > 1) { formContainer.style.display = "block"; formContainer.innerHTML = `<p class="letargia-multi-select">${game.i18n.format("LETARGIA.CHARACTER_CREAT.AssetImport.MultiSelect", { count: selected.length })}</p>`; }
    else { formContainer.style.display = "none"; }
  }

  static populateForm(container, asset) {
    container.innerHTML = `
      <div class="letargia-form-row"><label>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.AssetImport.Field.ID")}</label><input type="text" class="letargia-asset-form-input" data-field="id" value="${asset.metadata.id}"></div>
      <div class="letargia-form-row"><label>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.AssetImport.Field.Name")}</label><input type="text" class="letargia-asset-form-input" data-field="name.pt-BR" value="${asset.metadata.name["pt-BR"]}" placeholder="PT-BR"><input type="text" class="letargia-asset-form-input" data-field="name.en" value="${asset.metadata.name.en}" placeholder="EN"></div>
      <div class="letargia-form-row"><label>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.AssetImport.Field.Category")}</label><select class="letargia-asset-form-select" data-field="category">${CATEGORIES.map(c => `<option value="${c}" ${c === asset.metadata.category ? "selected" : ""}>${game.i18n.localize(`LETARGIA.CHARACTER_CREAT.Categories.${c}`)}</option>`).join("")}</select></div>
      <div class="letargia-form-row"><label>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.AssetImport.Field.Themes")}</label><div class="letargia-theme-checklist">${THEMES.map(t => `<label><input type="checkbox" class="letargia-asset-form-checkbox" data-field="themes" value="${t}" ${asset.metadata.themes.includes(t) ? "checked" : ""}> ${game.i18n.localize(`LETARGIA.CHARACTER_CREAT.Themes.${t}`)}</label>`).join("")}</div></div>
      <div class="letargia-form-row"><label>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.AssetImport.Field.DrawOrder")}</label><input type="number" class="letargia-asset-form-input" data-field="drawOrder" value="${asset.metadata.drawOrder}"></div>
      <div class="letargia-form-row"><label>${game.i18n.localize("LETARGIA.CHARACTER_CREAT.AssetImport.Field.Anchor")}</label><input type="number" step="0.01" min="0" max="1" class="letargia-asset-form-input" data-field="anchor.x" value="${asset.metadata.anchor.x}" placeholder="X"><input type="number" step="0.01" min="0" max="1" class="letargia-asset-form-input" data-field="anchor.y" value="${asset.metadata.anchor.y}" placeholder="Y"></div>
    `;
  }
}

function getCategoryOptions() {
  return CATEGORIES.map(c => ({ value: c, label: game.i18n.localize(`LETARGIA.CHARACTER_CREAT.Categories.${c}`) }));
}

function getThemeOptions() {
  return THEMES.map(t => ({ value: t, label: game.i18n.localize(`LETARGIA.CHARACTER_CREAT.Themes.${t}`) }));
}