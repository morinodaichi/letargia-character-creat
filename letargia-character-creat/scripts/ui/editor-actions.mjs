/**
 * Character Editor - Event Listeners (Part 2)
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";

async function onPieceClick(editor, event, html) {
  const pieceId = event.currentTarget.dataset.pieceId;
  const piece = editor.catalog.getPiece(pieceId);
  if (!piece) return;
  
  const exists = editor.composition.pieces.some(p => p.pieceId === piece.id && p.packId === piece._packId);
  if (exists) {
    ui.notifications.info(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.PieceAlreadyAdded"));
    return;
  }
  
  const newPiece = {
    pieceId: piece.id, packId: piece._packId, packVersion: "1", enabled: true,
    layers: piece.layers.map(l => ({ layerId: l.id, enabled: true, opacity: l.opacity || 1, blendMode: l.blendMode || "normal" })),
    colorChoices: {}, transform: { x: 0, y: 0, scale: 1, rotation: 0 }
  };
  
  editor.compositionManager.updateComposition(editor.actor.id, comp => {
    comp.pieces.push(newPiece);
    comp.metadata.updatedAt = new Date().toISOString();
    return comp;
  });
  
  await editor.render();
}

async function onRemovePiece(editor, event, html) {
  const pieceId = event.currentTarget.dataset.pieceId;
  const packId = event.currentTarget.dataset.packId;
  
  editor.compositionManager.updateComposition(editor.actor.id, comp => {
    comp.pieces = comp.pieces.filter(p => !(p.pieceId === pieceId && p.packId === packId));
    comp.metadata.updatedAt = new Date().toISOString();
    return comp;
  });
  
  await editor.render();
}

async function onColorChange(editor, event, html) {
  const pieceId = event.currentTarget.dataset.pieceId;
  const packId = event.currentTarget.dataset.packId;
  const colorId = event.currentTarget.dataset.colorId;
  const color = event.target.value;
  
  editor.compositionManager.updateComposition(editor.actor.id, comp => {
    const piece = comp.pieces.find(p => p.pieceId === pieceId && p.packId === packId);
    if (piece) { piece.colorChoices[colorId] = color; comp.metadata.updatedAt = new Date().toISOString(); }
    return comp;
  });
  renderPreview(editor, html);
}

function onDragStart(editor, event) {
  editor._draggedPiece = event.currentTarget.dataset.pieceId;
  event.currentTarget.classList.add("dragging");
  event.dataTransfer.effectAllowed = "copy";
}

function onDragEnd(editor, event) {
  event.currentTarget.classList.remove("dragging");
  editor._draggedPiece = null;
}

function onDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
  event.currentTarget.classList.add("drag-over");
}

function onDragLeave(event) {
  event.currentTarget.classList.remove("drag-over");
}

async function onDrop(editor, event, html) {
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");
  if (!editor._draggedPiece) return;
  await onPieceClick(editor, { currentTarget: { dataset: { pieceId: editor._draggedPiece } } }, html);
}