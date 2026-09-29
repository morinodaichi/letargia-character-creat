/**
 * Core render logic for composition rendering
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { loadImage } from "./composition-renderer.mjs";

/**
 * Render a composition to a canvas context
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Object} composition 
 * @param {PieceCatalog} catalog 
 * @param {Object} options 
 */
export async function renderComposition(ctx, composition, catalog, options = {}) {
  const {
    width = 1024, height = 1024, scale = 1, background = "transparent",
    showGrid = false, viewport = { scale: 1, offsetX: 0, offsetY: 0 }
  } = options;

  ctx.canvas.width = width; ctx.canvas.height = height;
  if (background !== "transparent") { ctx.fillStyle = background; ctx.fillRect(0, 0, width, height); }
  else { ctx.clearRect(0, 0, width, height); }

  const isPreview = options.isPreview === true;
  if (isPreview) {
    ctx.save();
    ctx.translate(width/2 + viewport.offsetX, height/2 + viewport.offsetY);
    ctx.scale(viewport.scale, viewport.scale);
    ctx.translate(-width/2, -height/2);
  }

  if (showGrid && isPreview) drawGrid(ctx, width, height, viewport.scale);

  const piecesWithData = [];
  for (const compPiece of composition.pieces) {
    if (!compPiece.enabled) continue;
    const piece = catalog.getPiece(`${compPiece.packId}:${compPiece.pieceId}`);
    if (!piece) { console.warn(`[${MODULE_ID}] Piece not found: ${compPiece.packId}:${compPiece.pieceId}`); continue; }
    piecesWithData.push({ compPiece, piece });
  }

  piecesWithData.sort((a, b) => (a.piece.drawOrder||0) - (b.piece.drawOrder||0));

  for (const { compPiece, piece } of piecesWithData) {
    await renderPiece(ctx, compPiece, piece, composition, catalog, { width, height, isPreview, globalTransforms: composition.transforms });
  }

  if (isPreview) ctx.restore();
  if (isPreview) drawCrosshair(ctx, width, height);
}

async function renderPiece(ctx, compPiece, piece, composition, catalog, options) {
  const { width, height, isPreview, globalTransforms } = options;
  const layerOrder = compPiece.layerOrder || piece.layers.map(l => l.id);
  const sortedLayers = [...piece.layers].sort((a, b) => {
    const zDiff = (a.zOffset||0) - (b.zOffset||0);
    if (zDiff !== 0) return zDiff;
    return layerOrder.indexOf(a.id) - layerOrder.indexOf(b.id);
  });

  const pieceTransform = compPiece.transform || { x: 0, y: 0, scale: 1, rotation: 0 };
  const anchorX = pieceTransform.anchorX ?? piece.anchor?.x ?? 0.5;
  const anchorY = pieceTransform.anchorY ?? piece.anchor?.y ?? 0.5;
  const globalScale = globalTransforms?.globalScale ?? 1;
  const globalRotation = globalTransforms?.globalRotation ?? 0;
  const globalOffsetX = globalTransforms?.globalOffsetX ?? 0;
  const globalOffsetY = globalTransforms?.globalOffsetY ?? 0;
  const baseX = width/2 + pieceTransform.x + (piece.offset?.x||0) + globalOffsetX;
  const baseY = height/2 + pieceTransform.y + (piece.offset?.y||0) + globalOffsetY;
  const combinedScale = (piece.scale||1) * (pieceTransform.scale||1) * globalScale;
  const combinedRotation = (pieceTransform.rotation||0) + (piece.rotation||0) + globalRotation;

  for (const layer of sortedLayers) {
    const compLayer = compPiece.layers?.find(l => l.layerId === layer.id);
    if (!compLayer?.enabled) continue;
    if (compLayer.visible === false) continue;

    const img = await loadImage(layer.image);
    if (!img) continue;

    ctx.save();
    ctx.translate(baseX, baseY);
    ctx.rotate(combinedRotation);
    ctx.scale(combinedScale, combinedScale);
    const layerX = (layer.position?.x||0) - (img.width * anchorX);
    const layerY = (layer.position?.y||0) - (img.height * anchorY);
    ctx.globalAlpha = (compLayer.opacity??1) * (layer.opacity??1);
    ctx.globalCompositeOperation = compLayer.blendMode || layer.blendMode || "source-over";
    ctx.drawImage(img, layerX, layerY);
    ctx.restore();
  }
}

function drawGrid(ctx, width, height, viewportScale = 1) {
  const gridSize = 32 * viewportScale;
  ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 0.5 / viewportScale;
  ctx.beginPath();
  for (let x = 0; x <= width; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
  for (let y = 0; y <= height; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
  ctx.stroke();
}

function drawCrosshair(ctx, width, height) {
  ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 1; ctx.setLineDash([10, 10]);
  ctx.beginPath(); ctx.moveTo(width/2-20, height/2); ctx.lineTo(width/2+20, height/2); ctx.moveTo(width/2, height/2-20); ctx.lineTo(width/2, height/2+20); ctx.stroke(); ctx.setLineDash([]);
}