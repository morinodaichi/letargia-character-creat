/**
 * Demo Pieces - Limbs (Arms, Legs, Hair, Beard)
 */

import { DEMO_COLORS, createSvgLayer, makeThumbnail } from "./demo-svg.mjs";

const C = DEMO_COLORS;

export const DEMO_LIMBS_PIECES = [
  // Arms/Hands pieces
  {
    id: "arms-basic",
    category: "arms-hands",
    themes: ["modern", "medieval", "futuristic"],
    compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    layers: [
      createSvgLayer("rect", C.skin, -60, 60, 50),
      createSvgLayer("rect", C.skin, 60, 60, 50),
      createSvgLayer("circle", C.skin, -85, 85, 20),
      createSvgLayer("circle", C.skin, 85, 85, 20)
    ],
    thumbnail: makeThumbnail("rect", C.skin),
    drawOrder: 30,
    anchor: { x: 0.5, y: 0.5 },
    offset: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    slots: ["leftArm", "rightArm"],
    colorMasks: [
      { id: "skin", name: { "pt-BR": "Pele", "en": "Skin" }, layerId: "layer-rect-FFDBCC", color: C.skin }
    ],
    metadata: { name: { "pt-BR": "Braços Básicos", "en": "Basic Arms" } }
  },

  // Legs/Feet pieces
  {
    id: "legs-basic",
    category: "legs-feet",
    themes: ["modern", "medieval", "futuristic"],
    compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    layers: [
      createSvgLayer("rect", C.clothing, -30, 140, 60),
      createSvgLayer("rect", C.clothing, 30, 140, 60),
      createSvgLayer("rect", C.dark, -35, 200, 35),
      createSvgLayer("rect", C.dark, 35, 200, 35)
    ],
    thumbnail: makeThumbnail("rect", C.clothing),
    drawOrder: 40,
    anchor: { x: 0.5, y: 0.7 },
    offset: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    slots: ["leftLeg", "rightLeg"],
    colorMasks: [
      { id: "pants", name: { "pt-BR": "Calça", "en": "Pants" }, layerId: "layer-rect-4A90D9", color: C.clothing },
      { id: "boots", name: { "pt-BR": "Botas", "en": "Boots" }, layerId: "layer-rect-2C2C2C", color: C.dark }
    ],
    metadata: { name: { "pt-BR": "Pernas Básicas", "en": "Basic Legs" } }
  },

  // Hair/Beard pieces
  {
    id: "hair-short",
    category: "hair-beard",
    themes: ["modern", "medieval", "futuristic"],
    compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    layers: [
      createSvgLayer("ellipse", C.hair, 0, -10, 50)
    ],
    thumbnail: makeThumbnail("ellipse", C.hair),
    drawOrder: 15,
    anchor: { x: 0.5, y: 0.2 },
    offset: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    slots: ["hair"],
    colorMasks: [
      { id: "hair", name: { "pt-BR": "Cabelo", "en": "Hair" }, layerId: "layer-ellipse-8B4513", color: C.hair }
    ],
    metadata: { name: { "pt-BR": "Cabelo Curto", "en": "Short Hair" } }
  },
  {
    id: "beard-full",
    category: "hair-beard",
    themes: ["medieval", "modern"],
    compatibility: { bodies: ["*"], poses: ["*"], perspectives: ["*"] },
    layers: [
      createSvgLayer("ellipse", C.hair, 0, 30, 40)
    ],
    thumbnail: makeThumbnail("ellipse", C.hair),
    drawOrder: 12,
    anchor: { x: 0.5, y: 0.4 },
    offset: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    slots: ["beard"],
    colorMasks: [
      { id: "beard", name: { "pt-BR": "Barba", "en": "Beard" }, layerId: "layer-ellipse-8B4513", color: C.hair }
    ],
    metadata: { name: { "pt-BR": "Barba Cheia", "en": "Full Beard" } }
  }
];