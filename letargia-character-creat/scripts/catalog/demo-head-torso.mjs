/**
 * Demo Pieces - Head and Torso
 */

import { DEMO_COLORS, createSvgLayer, makeThumbnail } from "./demo-svg.mjs";

const C = DEMO_COLORS;

export const DEMO_HEAD_PIECES = [
  {
    id: "head-round",
    category: "head",
    themes: ["modern", "medieval", "futuristic"],
    compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    layers: [
      createSvgLayer("circle", C.skin, 0, 0, 80),
      createSvgLayer("circle", C.hair, -10, -20, 50)
    ],
    thumbnail: makeThumbnail("circle", C.skin),
    drawOrder: 10,
    anchor: { x: 0.5, y: 0.3 },
    offset: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    slots: ["head"],
    colorMasks: [
      { id: "skin", name: { "pt-BR": "Pele", "en": "Skin" }, layerId: "layer-circle-FFDBCC", color: C.skin },
      { id: "hair", name: { "pt-BR": "Cabelo", "en": "Hair" }, layerId: "layer-circle-8B4513", color: C.hair }
    ],
    metadata: { name: { "pt-BR": "Cabeça Redonda", "en": "Round Head" } }
  },
  {
    id: "head-square",
    category: "head",
    themes: ["futuristic"],
    compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    layers: [
      createSvgLayer("rect", C.skin, 0, 0, 70),
      createSvgLayer("rect", C.metal, -5, -15, 40)
    ],
    thumbnail: makeThumbnail("rect", C.skin),
    drawOrder: 10,
    anchor: { x: 0.5, y: 0.3 },
    offset: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    slots: ["head"],
    colorMasks: [
      { id: "skin", name: { "pt-BR": "Pele", "en": "Skin" }, layerId: "layer-rect-FFDBCC", color: C.skin },
      { id: "visor", name: { "pt-BR": "Visor", "en": "Visor" }, layerId: "layer-rect-C0C0C0", color: C.metal }
    ],
    metadata: { name: { "pt-BR": "Cabeça Quadrada (Sci-Fi)", "en": "Square Head (Sci-Fi)" } }
  }
];

export const DEMO_TORSO_PIECES = [
  {
    id: "torso-basic",
    category: "torso",
    themes: ["modern", "medieval", "futuristic"],
    compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    layers: [
      createSvgLayer("rect", C.clothing, 0, 40, 100),
      createSvgLayer("rect", C.skin, 10, 40, 40)
    ],
    thumbnail: makeThumbnail("rect", C.clothing),
    drawOrder: 20,
    anchor: { x: 0.5, y: 0.4 },
    offset: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    slots: ["torso"],
    colorMasks: [
      { id: "shirt", name: { "pt-BR": "Camisa", "en": "Shirt" }, layerId: "layer-rect-4A90D9", color: C.clothing },
      { id: "skin", name: { "pt-BR": "Pele", "en": "Skin" }, layerId: "layer-rect-FFDBCC", color: C.skin }
    ],
    metadata: { name: { "pt-BR": "Tronco Básico", "en": "Basic Torso" } }
  },
  {
    id: "torso-armor",
    category: "torso",
    themes: ["medieval", "futuristic"],
    compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    layers: [
      createSvgLayer("rect", C.metal, 0, 40, 110),
      createSvgLayer("rect", C.dark, 5, 45, 100)
    ],
    thumbnail: makeThumbnail("rect", C.metal),
    drawOrder: 20,
    anchor: { x: 0.5, y: 0.4 },
    offset: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    slots: ["torso"],
    colorMasks: [
      { id: "armor", name: { "pt-BR": "Armadura", "en": "Armor" }, layerId: "layer-rect-C0C0C0", color: C.metal },
      { id: "undersuit", name: { "pt-BR": "Subtraje", "en": "Undersuit" }, layerId: "layer-rect-2C2C2C", color: C.dark }
    ],
    metadata: { name: { "pt-BR": "Armadura de Placas", "en": "Plate Armor" } }
  }
];