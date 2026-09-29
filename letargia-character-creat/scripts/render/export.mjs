/**
 * Export utilities for composition rendering
 */

import { renderComposition } from "./render-core.mjs";

/**
 * Export composition to data URL
 * @param {Object} composition 
 * @param {PieceCatalog} catalog 
 * @param {Object} options 
 * @returns {Promise<string>}
 */
export async function exportCompositionToDataURL(composition, catalog, options = {}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  const exportWidth = options.canvasWidth || composition.exportOptions?.canvasWidth || 1024;
  const exportHeight = options.canvasHeight || composition.exportOptions?.canvasHeight || 1024;
  const format = options.format || composition.exportOptions?.format || "png";
  const background = options.background || composition.exportOptions?.background || "transparent";
  const scale = options.scale || composition.exportOptions?.scale || 1;

  await renderComposition(ctx, composition, catalog, {
    width: exportWidth, height: exportHeight, scale,
    background, showGrid: false, isPreview: false
  });

  const mimeType = format === "webp" ? "image/webp" : "image/png";
  const quality = format === "webp" ? 0.9 : undefined;
  return canvas.toDataURL(mimeType, quality);
}

/**
 * Export composition to blob
 * @param {Object} composition 
 * @param {PieceCatalog} catalog 
 * @param {Object} options 
 * @returns {Promise<Blob>}
 */
export async function exportCompositionToBlob(composition, catalog, options = {}) {
  const dataURL = await exportCompositionToDataURL(composition, catalog, options);
  const response = await fetch(dataURL);
  return response.blob();
}

/**
 * Download composition as file
 * @param {Object} composition 
 * @param {PieceCatalog} catalog 
 * @param {Object} options 
 */
export async function downloadComposition(composition, catalog, options = {}) {
  const blob = await exportCompositionToBlob(composition, catalog, options);
  const format = options.format || composition.exportOptions?.format || "png";
  const filename = options.filename || `character-${Date.now()}.${format}`;
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Check if WebP is supported
 * @returns {Promise<boolean>}
 */
export async function checkWebPSupport() {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1; canvas.height = 1;
    canvas.toBlob((blob) => {
      resolve(blob !== null && blob.type === "image/webp");
    }, "image/webp");
  });
}

/**
 * Get best available export format
 * @returns {Promise<string>} "webp" or "png"
 */
export async function getBestExportFormat() {
  const webpSupported = await checkWebPSupport();
  return webpSupported ? "webp" : "png";
}