/**
 * Asset Import Core - Constants and utilities
 */

export const SUPPORTED_FORMATS = {
  "image/png": { ext: "png", name: "PNG" },
  "image/jpeg": { ext: "jpg", name: "JPEG" },
  "image/webp": { ext: "webp", name: "WebP" }
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_DIMENSIONS = { width: 4096, height: 4096 };

export function validateFile(file) {
  const format = SUPPORTED_FORMATS[file.type];
  if (!format) return { valid: false, error: "Unsupported format" };
  if (file.size > MAX_FILE_SIZE) return { valid: false, error: "File too large" };
  return { valid: true, format, ext: format.ext };
}

export function createPreview(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve({ url, width: img.width, height: img.height }); };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

export function generateDefaultMetadata(file) {
  const name = file.name.replace(/\.[^/.]+$/, "");
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return {
    id: slug, name: { "pt-BR": name, "en": name }, category: "accessories",
    themes: ["modern"], compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    drawOrder: 0, anchor: { x: 0.5, y: 0.5 }, offset: { x: 0, y: 0 },
    scale: 1, rotation: 0, slots: [], layers: [], colorMasks: []
  };
}

export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)}KB`;
  return `${(bytes/1024/1024).toFixed(1)}MB`;
}

export const CATEGORIES = [
  "head", "torso", "arms-hands", "legs-feet",
  "hair-beard", "clothing", "tattoos-scars",
  "accessories", "held-objects", "capes-wings-tails-horns"
];

export const THEMES = ["modern", "medieval", "futuristic"];

export function getCategoryOptions() {
  return CATEGORIES.map(c => ({ value: c, label: `LETARGIA.CHARACTER_CREAT.Categories.${c}` }));
}

export function getThemeOptions() {
  return THEMES.map(t => ({ value: t, label: `LETARGIA.CHARACTER_CREAT.Themes.${t}` }));
}