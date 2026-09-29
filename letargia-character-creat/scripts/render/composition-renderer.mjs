/**
 * Composition Renderer for LETARGIA CHARACTER CREAT
 * Deterministic 2D rendering with transparency, stable layer order, and anchors
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";

export const DEFAULT_EXPORT_WIDTH = 1024;
export const DEFAULT_EXPORT_HEIGHT = 1024;

const imageCache = new Map();
const loadingPromises = new Map();

export async function loadImage(src) {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src);
    if (cached.complete && cached.naturalWidth > 0) return cached;
  }
  if (loadingPromises.has(src)) return loadingPromises.get(src);

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const timeout = setTimeout(() => {
      console.warn(`[${MODULE_ID}] Image load timeout: ${src}`);
      resolve(null);
    }, 10000);
    img.onload = () => { clearTimeout(timeout); imageCache.set(src, img); loadingPromises.delete(src); resolve(img); };
    img.onerror = () => { clearTimeout(timeout); console.warn(`[${MODULE_ID}] Image load failed: ${src}`); loadingPromises.delete(src); resolve(null); };
    img.src = src;
  });
  loadingPromises.set(src, promise);
  return promise;
}

export function clearImageCache() { imageCache.clear(); loadingPromises.clear(); }
export function getCacheStats() { return { size: imageCache.size, loading: loadingPromises.size }; }

function drawGrid(ctx, width, height, viewportScale = 1) {
  const gridSize = 32 * viewportScale;
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 0.5 / viewportScale;
  ctx.beginPath();
  for (let x = 0; x <= width; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
  for (let y = 0; y <= height; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
  ctx.stroke();
}

function drawCrosshair(ctx, width, height) {
  ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 1; ctx.setLineDash([10, 10]);
  ctx.beginPath(); ctx.moveTo(width/2-20, height/2); ctx.lineTo(width/2+20, height/2); ctx.moveTo(width/2, height/2-20); ctx.lineTo(width/2, height/2+20); ctx.stroke(); ctx.setLineDash([]);
}