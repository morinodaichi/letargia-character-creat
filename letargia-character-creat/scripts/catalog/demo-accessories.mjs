/**
 * Demo Pieces - Accessories and Held Objects
 */

import { DEMO_COLORS, createSvgLayer, makeThumbnail } from "./demo-svg.mjs";

const C = DEMO_COLORS;

export const DEMO_ACCESSORIES_PIECES = [
  // Clothing pieces
  {
    id: "cloak",
    category: "capes-wings-tails-horns",
    themes: ["medieval", "futuristic"],
    compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    layers: [
      createSvgLayer("triangle", C.red, 0, 30, 120)
    ],
    thumbnail: makeThumbnail("triangle", C.red),
    drawOrder: 50,
    anchor: { x: 0.5, y: 0.35 },
    offset: { x: 0, y: -10 },
    scale: 1,
    rotation: 0,
    slots: ["cape"],
    colorMasks: [
      { id: "cloak", name: { "pt-BR": "Capa", "en": "Cloak" }, layerId: "layer-triangle-CC3333", color: C.red }
    ],
    metadata: { name: { "pt-BR": "Capa Vermelha", "en": "Red Cloak" } }
  },

  // Accessories
  {
    id: "glasses",
    category: "accessories",
    themes: ["modern", "futuristic"],
    compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    layers: [
      createSvgLayer("glasses", C.metal, 0, -5, 40)
    ],
    thumbnail: makeThumbnail("glasses", C.metal),
    drawOrder: 18,
    anchor: { x: 0.5, y: 0.25 },
    offset: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    slots: ["face"],
    colorMasks: [
      { id: "frames", name: { "pt-BR": "Armação", "en": "Frames" }, layerId: "layer-glasses-C0C0C0", color: C.metal }
    ],
    metadata: { name: { "pt-BR": "Óculos", "en": "Glasses" } }
  },

  // Held objects
  {
    id: "sword",
    category: "held-objects",
    themes: ["medieval"],
    compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    layers: [
      createSvgLayer("sword", C.metal, 100, 60, 80)
    ],
    thumbnail: makeThumbnail("sword", C.metal),
    drawOrder: 60,
    anchor: { x: 0.5, y: 0.5 },
    offset: { x: 50, y: -20 },
    scale: 1,
    rotation: -0.3,
    slots: ["rightHand"],
    colorMasks: [
      { id: "blade", name: { "pt-BR": "Lâmina", "en": "Blade" }, layerId: "layer-sword-C0C0C0", color: C.metal }
    ],
    metadata: { name: { "pt-BR": "Espada", "en": "Sword" } }
  }
];