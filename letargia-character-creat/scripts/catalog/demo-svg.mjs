/**
 * Demo Pieces Generator - SVG Utilities
 */

export const DEMO_COLORS = {
  skin: "#FFDBCC",
  hair: "#8B4513",
  clothing: "#4A90D9",
  metal: "#C0C0C0",
  dark: "#2C2C2C",
  red: "#CC3333",
  green: "#33CC33",
  blue: "#3366CC"
};

export function createSvg(shape, color, size = 64) {
  const half = size / 2;
  const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  const svgFooter = "</svg>";
  let shapeContent = "";
  const c = color.replace("#", "%23");
  
  switch (shape) {
    case "circle":
      shapeContent = `<circle cx="${half}" cy="${half}" r="${half - 2}" fill="#${c}" stroke="#333" stroke-width="1"/>`;
      break;
    case "rect":
      shapeContent = `<rect x="2" y="2" width="${size - 4}" height="${size - 4}" fill="#${c}" stroke="#333" stroke-width="1" rx="4"/>`;
      break;
    case "ellipse":
      shapeContent = `<ellipse cx="${half}" cy="${half}" rx="${half - 2}" ry="${half * 0.6}" fill="#${c}" stroke="#333" stroke-width="1"/>`;
      break;
    case "triangle":
      shapeContent = `<polygon points="${half},2 ${size-2},${size-2} 2,${size-2}" fill="#${c}" stroke="#333" stroke-width="1"/>`;
      break;
    case "glasses":
      shapeContent = `
        <circle cx="${half - 12}" cy="${half}" r="10" fill="none" stroke="#${c}" stroke-width="2"/>
        <circle cx="${half + 12}" cy="${half}" r="10" fill="none" stroke="#${c}" stroke-width="2"/>
        <line x1="${half - 2}" y1="${half}" x2="${half + 2}" y2="${half}" stroke="#${c}" stroke-width="2"/>
      `;
      break;
    case "sword":
      shapeContent = `
        <rect x="${half - 2}" y="10" width="4" height="${size - 20}" fill="#${c}"/>
        <polygon points="${half - 8},10 ${half},2 ${half + 8},10" fill="#${c}"/>
        <rect x="${half - 6}" y="${size - 18}" width="12" height="8" fill="#8B4513"/>
      `;
      break;
    default:
      shapeContent = `<rect x="2" y="2" width="${size - 4}" height="${size - 4}" fill="#${c}"/>`;
  }
  
  return svgHeader + shapeContent + svgFooter;
}

export function makeThumbnail(shape, color, size = 64) {
  return `data:image/svg+xml,${encodeURIComponent(createSvg(shape, color, size))}`;
}

export function createSvgLayer(shape, color, x, y, size = 64) {
  return {
    id: `layer-${shape}-${color.replace("#", "")}`,
    image: `data:image/svg+xml,${encodeURIComponent(createSvg(shape, color, size))}`,
    position: { x, y },
    blendMode: "normal",
    opacity: 1
  };
}